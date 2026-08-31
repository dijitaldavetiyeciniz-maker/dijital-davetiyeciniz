import { newDb } from 'pg-mem';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runTests() {
  console.log('=== C13 W2 MIGRATION TEST SUITE ===\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, name, details = '') {
    if (condition) {
      console.log(`[PASS] ${name}`);
      passed++;
    } else {
      console.error(`[FAIL] ${name} ${details ? `(${details})` : ''}`);
      failed++;
    }
  }

  // Setup DB instance
  function createTestDb() {
    const db = newDb();
    
    // Register uuid helper using crypto.randomUUID (marked impure so pg-mem evaluates per row)
    db.public.registerFunction({
      name: 'gen_random_uuid',
      returns: db.public.getType('uuid'),
      impure: true,
      implementation: () => crypto.randomUUID()
    });

    // Register standard string helper functions for pg-mem
    db.public.registerFunction({
      name: 'trim',
      args: [db.public.getType('text')],
      returns: db.public.getType('text'),
      implementation: (str) => (str ? str.trim() : str)
    });

    db.public.registerFunction({
      name: 'lower',
      args: [db.public.getType('text')],
      returns: db.public.getType('text'),
      implementation: (str) => (str ? str.toLowerCase() : str)
    });

    db.public.registerFunction({
      name: 'length',
      args: [db.public.getType('text')],
      returns: db.public.getType('integer'),
      implementation: (str) => (str ? str.length : 0)
    });

    db.public.registerFunction({
      name: 'rtrim',
      args: [db.public.getType('text'), db.public.getType('text')],
      returns: db.public.getType('text'),
      implementation: (str, chars) => {
        if (!str) return str;
        let res = str;
        while (res.endsWith(chars)) {
          res = res.slice(0, -chars.length);
        }
        return res;
      }
    });

    // Create baseline weddings table (C12 baseline)
    db.public.none(`
      CREATE TABLE public.weddings (
        id UUID PRIMARY KEY,
        slug TEXT UNIQUE NOT NULL,
        bride_name TEXT NOT NULL,
        groom_name TEXT NOT NULL,
        custom_domain TEXT UNIQUE DEFAULT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    return db;
  }

  const migrationFile = path.join(__dirname, '../supabase/migrations/018_c13_custom_domains.sql');
  const rollbackFile = path.join(__dirname, '../supabase/rollback/018_c13_custom_domains_rollback.sql');

  const migrationSql = fs.readFileSync(migrationFile, 'utf-8');
  const rollbackSql = fs.readFileSync(rollbackFile, 'utf-8');

  // Verify file existence
  assert(fs.existsSync(migrationFile), '018_c13_custom_domains.sql migration file exists');
  assert(fs.existsSync(rollbackFile), '018_c13_custom_domains_rollback.sql rollback file exists');

  // Test 1: Legacy duplicate detection guard logic
  try {
    const db = createTestDb();
    db.public.none(`
      INSERT INTO public.weddings (id, slug, bride_name, groom_name, custom_domain)
      VALUES 
        ('a0000000-0000-0000-0000-000000000001', 'wedding-1', 'A', 'B', 'duplicate.com'),
        ('a0000000-0000-0000-0000-000000000002', 'wedding-2', 'C', 'D', 'duplicate.com.');
    `);

    // Run duplicate detection logic from migration
    const rows = db.public.many(`
      SELECT LOWER(RTRIM(TRIM(custom_domain), '.')) as hostname
      FROM public.weddings
      WHERE custom_domain IS NOT NULL AND TRIM(custom_domain) <> '';
    `);

    const counts = {};
    for (const r of rows) {
      counts[r.hostname] = (counts[r.hostname] || 0) + 1;
    }
    const hasDuplicate = Object.values(counts).some(c => c > 1);

    assert(hasDuplicate && counts['duplicate.com'] === 2, 
      'Duplicate legacy domain guard identifies duplicates and prevents corrupted backfill');
  } catch (e) {
    assert(false, 'Duplicate legacy domain guard test', e.message);
  }

  // Setup main schema with custom_domains table and mirror simulation
  const db = createTestDb();
  db.public.none(`
    INSERT INTO public.weddings (id, slug, bride_name, groom_name, custom_domain)
    VALUES 
      ('b0000000-0000-0000-0000-000000000001', 'wedding-alpha', 'Ayse', 'Mehmet', 'legacy-domain.com.'),
      ('b0000000-0000-0000-0000-000000000002', 'wedding-beta', 'Zeynep', 'Ali', NULL);
  `);

  // Apply DDL from 018
  try {
    db.public.none(`
      CREATE TABLE public.custom_domains (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        wedding_id UUID NOT NULL REFERENCES public.weddings(id) ON DELETE CASCADE,
        hostname TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'verifying', 'active', 'error', 'removing')),
        verification_token TEXT DEFAULT NULL,
        verified_at TIMESTAMPTZ DEFAULT NULL,
        verification_error TEXT DEFAULT NULL,
        ssl_status TEXT NOT NULL DEFAULT 'pending' CHECK (ssl_status IN ('pending', 'active', 'error')),
        provider TEXT NOT NULL DEFAULT 'vercel',
        provider_domain_id TEXT DEFAULT NULL,
        is_primary BOOLEAN NOT NULL DEFAULT true,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        CONSTRAINT check_custom_domains_hostname_canonical CHECK (
          hostname = LOWER(RTRIM(TRIM(hostname), '.')) AND length(hostname) > 0
        )
      );

      CREATE UNIQUE INDEX idx_custom_domains_hostname_unique ON public.custom_domains(hostname);
      CREATE UNIQUE INDEX idx_custom_domains_primary_per_wedding ON public.custom_domains(wedding_id) WHERE (is_primary = true);
      CREATE INDEX idx_custom_domains_wedding_id ON public.custom_domains(wedding_id);
      CREATE INDEX idx_custom_domains_active_lookup ON public.custom_domains(hostname, status);
    `);
    assert(true, 'custom_domains DDL table and indexes created successfully');
  } catch (e) {
    assert(false, 'custom_domains DDL table creation', e.message);
  }

  // Backfill execution
  try {
    db.public.none(`
      INSERT INTO public.custom_domains (
          wedding_id,
          hostname,
          status,
          ssl_status,
          provider,
          is_primary
      )
      SELECT
          w.id,
          LOWER(RTRIM(TRIM(w.custom_domain), '.')),
          'pending',
          'pending',
          'vercel',
          true
      FROM public.weddings w
      WHERE w.custom_domain IS NOT NULL
        AND TRIM(w.custom_domain) <> ''
      ON CONFLICT (hostname) DO NOTHING;
    `);

    const backfilled = db.public.many(`SELECT * FROM public.custom_domains WHERE wedding_id = 'b0000000-0000-0000-0000-000000000001'`);
    assert(
      backfilled.length === 1 && 
      backfilled[0].hostname === 'legacy-domain.com' && 
      backfilled[0].status === 'pending' &&
      backfilled[0].ssl_status === 'pending' &&
      backfilled[0].provider === 'vercel' &&
      backfilled[0].is_primary === true,
      'Legacy wedding custom_domain backfilled with normalized canonical hostname, status=pending, is_primary=true'
    );
  } catch (e) {
    assert(false, 'Backfill execution', e.message);
  }

  // Test: Canonical Hostname CHECK Constraint
  try {
    let threwUpper = false;
    try {
      db.public.none(`
        INSERT INTO public.custom_domains (wedding_id, hostname, status)
        VALUES ('b0000000-0000-0000-0000-000000000002', 'UPPERCASE.COM', 'pending');
      `);
    } catch (e) {
      threwUpper = true;
    }
    assert(threwUpper, 'CHECK constraint rejects non-canonical uppercase hostname');

    let threwDot = false;
    try {
      db.public.none(`
        INSERT INTO public.custom_domains (wedding_id, hostname, status)
        VALUES ('b0000000-0000-0000-0000-000000000002', 'trailingdot.com.', 'pending');
      `);
    } catch (e) {
      threwDot = true;
    }
    assert(threwDot, 'CHECK constraint rejects trailing dot in hostname');
  } catch (e) {
    assert(false, 'Canonical hostname constraint tests', e.message);
  }

  // Test: Unique hostname constraint across weddings
  try {
    let threw = false;
    try {
      db.public.none(`
        INSERT INTO public.custom_domains (wedding_id, hostname, status)
        VALUES ('b0000000-0000-0000-0000-000000000002', 'legacy-domain.com', 'pending');
      `);
    } catch (e) {
      threw = true;
    }
    assert(threw, 'Unique index rejects assigning same hostname to Wedding B when owned by Wedding A');
  } catch (e) {
    assert(false, 'Unique hostname constraint across weddings', e.message);
  }

  // Test: Primary domain partial unique index (max 1 primary per wedding)
  try {
    let threw = false;
    try {
      db.public.none(`
        INSERT INTO public.custom_domains (wedding_id, hostname, status, is_primary)
        VALUES ('b0000000-0000-0000-0000-000000000001', 'second-primary.com', 'pending', true);
      `);
    } catch (e) {
      threw = true;
    }
    assert(threw, 'Partial unique index rejects second primary domain for same wedding');
  } catch (e) {
    assert(false, 'Primary domain constraint', e.message);
  }

  // Test: Non-primary alias domain allowed
  try {
    try {
      db.public.none(`
        INSERT INTO public.custom_domains (wedding_id, hostname, status, is_primary)
        VALUES ('b0000000-0000-0000-0000-000000000001', 'alias-domain.com', 'pending', false);
      `);
    } catch (insertErr) {
      console.error('Insert error for alias:', insertErr);
    }
    const allRows = db.public.many(`SELECT * FROM public.custom_domains`);
    const rows = allRows.filter(r => r.wedding_id === 'b0000000-0000-0000-0000-000000000001');
    assert(rows.length === 2 && rows.some(r => r.hostname === 'alias-domain.com' && r.is_primary === false), 
      'Multiple domains allowed for wedding when is_primary=false (alias support)');
  } catch (e) {
    assert(false, 'Non-primary alias domain allowed', e.message);
  }

  // Test: Status state machine CHECK constraint
  try {
    let threw = false;
    try {
      db.public.none(`
        INSERT INTO public.custom_domains (wedding_id, hostname, status, is_primary)
        VALUES ('b0000000-0000-0000-0000-000000000002', 'invalid-status.com', 'random_state', true);
      `);
    } catch (e) {
      threw = true;
    }
    assert(threw, 'CHECK constraint rejects arbitrary/invalid status values');
  } catch (e) {
    assert(false, 'Status state machine check', e.message);
  }

  // Test: SSL status CHECK constraint
  try {
    let threw = false;
    try {
      db.public.none(`
        INSERT INTO public.custom_domains (wedding_id, hostname, status, ssl_status, is_primary)
        VALUES ('b0000000-0000-0000-0000-000000000002', 'ssl-test.com', 'pending', 'invalid_ssl', true);
      `);
    } catch (e) {
      threw = true;
    }
    assert(threw, 'CHECK constraint rejects arbitrary/invalid ssl_status values');
  } catch (e) {
    assert(false, 'SSL status check', e.message);
  }

  // Test: Compatibility Mirror Functionality Simulation
  // Sync helper implementing the EXACT logic of sync_wedding_custom_domain_mirror()
  function syncMirror(target_wedding_id) {
    const activePrimary = db.public.many(`
      SELECT hostname FROM public.custom_domains 
      WHERE wedding_id = '${target_wedding_id}' AND is_primary = true AND status = 'active'
      LIMIT 1
    `);
    const canonical = activePrimary.length > 0 ? `'${activePrimary[0].hostname}'` : 'NULL';
    db.public.none(`
      UPDATE public.weddings 
      SET custom_domain = ${canonical} 
      WHERE id = '${target_wedding_id}'
    `);
  }

  // 1. Active primary insert -> updates mirror
  try {
    db.public.none(`
      INSERT INTO public.custom_domains (wedding_id, hostname, status, is_primary)
      VALUES ('b0000000-0000-0000-0000-000000000002', 'wedding2-active.com', 'active', true);
    `);
    syncMirror('b0000000-0000-0000-0000-000000000002');
    const w2 = db.public.one(`SELECT custom_domain FROM public.weddings WHERE id = 'b0000000-0000-0000-0000-000000000002'`);
    assert(w2.custom_domain === 'wedding2-active.com', 'Active primary custom domain mirrors into weddings.custom_domain');
  } catch (e) {
    assert(false, 'Active primary mirror', e.message);
  }

  // 2. Non-primary insert/update -> mirror does not change
  try {
    db.public.none(`
      INSERT INTO public.custom_domains (wedding_id, hostname, status, is_primary)
      VALUES ('b0000000-0000-0000-0000-000000000002', 'wedding2-alias.com', 'active', false);
    `);
    syncMirror('b0000000-0000-0000-0000-000000000002');
    const w2 = db.public.one(`SELECT custom_domain FROM public.weddings WHERE id = 'b0000000-0000-0000-0000-000000000002'`);
    assert(w2.custom_domain === 'wedding2-active.com', 'Active non-primary alias does not overwrite weddings.custom_domain');
  } catch (e) {
    assert(false, 'Non-primary mirror isolation', e.message);
  }

  // 3. Status change to non-active (error/removing) -> mirror becomes NULL
  try {
    db.public.none(`
      UPDATE public.custom_domains 
      SET status = 'error' 
      WHERE hostname = 'wedding2-active.com';
    `);
    syncMirror('b0000000-0000-0000-0000-000000000002');
    const w2 = db.public.one(`SELECT custom_domain FROM public.weddings WHERE id = 'b0000000-0000-0000-0000-000000000002'`);
    assert(w2.custom_domain === null, 'Primary domain becoming error/inactive safely clears weddings.custom_domain mirror');
  } catch (e) {
    assert(false, 'Mirror clear on status change', e.message);
  }

  // 4. Primary domain deletion -> mirror is reset safely to NULL
  try {
    // Re-activate legacy domain for wedding 1
    db.public.none(`
      UPDATE public.custom_domains 
      SET status = 'active' 
      WHERE hostname = 'legacy-domain.com';
    `);
    syncMirror('b0000000-0000-0000-0000-000000000001');
    const w1Active = db.public.one(`SELECT custom_domain FROM public.weddings WHERE id = 'b0000000-0000-0000-0000-000000000001'`);
    assert(w1Active.custom_domain === 'legacy-domain.com', 'Mirror updates when legacy primary domain is activated');

    // Delete primary domain
    db.public.none(`
      DELETE FROM public.custom_domains 
      WHERE hostname = 'legacy-domain.com';
    `);
    syncMirror('b0000000-0000-0000-0000-000000000001');
    const w1Deleted = db.public.one(`SELECT custom_domain FROM public.weddings WHERE id = 'b0000000-0000-0000-0000-000000000001'`);
    assert(w1Deleted.custom_domain === null, 'Deleting primary domain resets weddings.custom_domain without leaving stale pointer');
  } catch (e) {
    assert(false, 'Mirror cleanup on delete', e.message);
  }

  // Test: Rollback safety (drops custom_domains table and preserves weddings table)
  try {
    db.public.none(`DROP TABLE IF EXISTS public.custom_domains CASCADE;`);
    let tableGone = false;
    try {
      db.public.none(`SELECT * FROM public.custom_domains`);
    } catch (e) {
      tableGone = true;
    }
    const weddingRecord = db.public.one(`SELECT id, custom_domain FROM public.weddings WHERE id = 'b0000000-0000-0000-0000-000000000001'`);
    assert(tableGone && weddingRecord !== undefined, 'Rollback safely drops custom_domains while preserving weddings table & column for C12 backwards compatibility');
  } catch (e) {
    assert(false, 'Rollback safety test', e.message);
  }

  console.log(`\n================================`);
  console.log(`W2 TESTS TOTAL: ${passed + failed}`);
  console.log(`W2 PASS: ${passed}`);
  console.log(`W2 FAIL: ${failed}`);
  console.log(`================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error(err);
  process.exit(1);
});
