import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runDetailedAudit() {
  const { data: allWeddings, error } = await supabase
    .from('weddings')
    .select('id, slug, is_paid, bride_name, groom_name, user_id, created_at');

  if (error || !allWeddings) {
    console.error('Audit query failed:', error);
    process.exit(1);
  }

  const total = allWeddings.length;

  let realUsers = 0;
  let freeReal = 0;
  let paidReal = 0;
  let ownerVerifiedReal = 0;
  let ownerUnverifiedReal = 0;

  let testWeddings = 0;
  let orphanWeddings = 0;
  let unauthenticatedWeddings = 0;
  let seedWeddings = 0;
  let demoWeddings = 0;
  let abandonedWeddings = 0;

  for (const w of allWeddings) {
    const slug = (w.slug || '').toLowerCase();
    const bride = (w.bride_name || '').toLowerCase();
    const groom = (w.groom_name || '').toLowerCase();

    const isTestFixture = (
      slug.startsWith('test-') ||
      slug.startsWith('c12-') ||
      slug.startsWith('c13-') ||
      slug.startsWith('e2e-') ||
      slug.includes('-test-') ||
      bride.includes('test') ||
      groom.includes('test')
    );

    const isSeedOrDemo = slug.includes('demo') || slug.includes('seed');
    const isOrphan = (!w.bride_name && !w.groom_name) && !w.user_id;
    const isUnauthenticated = !w.user_id;

    if (isSeedOrDemo) {
      demoWeddings++;
      testWeddings++;
    } else if (isTestFixture) {
      testWeddings++;
    } else if (isOrphan) {
      orphanWeddings++;
      if (isUnauthenticated) unauthenticatedWeddings++;
    } else if (!w.bride_name && !w.groom_name) {
      abandonedWeddings++;
      orphanWeddings++;
    } else {
      realUsers++;
      if (w.is_paid) paidReal++;
      else freeReal++;

      if (w.user_id) ownerVerifiedReal++;
      else ownerUnverifiedReal++;
    }
  }

  const deleteCandidates = testWeddings;
  const quarantineCandidates = orphanWeddings;
  const keepCandidates = realUsers;
  const classificationTotal = realUsers + testWeddings + orphanWeddings;

  console.log('\n============================================================');
  console.log('GRANULAR READ-ONLY DATABASE WEDDINGS AUDIT');
  console.log('============================================================');
  console.log(`TOTAL_WEDDINGS=${total}`);
  console.log(`REAL_USER_WEDDINGS=${realUsers}`);
  console.log(`FREE_REAL_USER_WEDDINGS=${freeReal}`);
  console.log(`PAID_REAL_USER_WEDDINGS=${paidReal}`);
  console.log(`OWNER_VERIFIED_REAL_WEDDINGS=${ownerVerifiedReal}`);
  console.log(`OWNER_UNVERIFIED_REAL_WEDDINGS=${ownerUnverifiedReal}`);
  console.log(`ORPHAN_WEDDINGS=${orphanWeddings}`);
  console.log(`UNAUTHENTICATED_WEDDINGS=${unauthenticatedWeddings}`);
  console.log(`TEST_WEDDINGS=${testWeddings}`);
  console.log(`SEED_WEDDINGS=${seedWeddings}`);
  console.log(`DEMO_WEDDINGS=${demoWeddings}`);
  console.log(`ABANDONED_WEDDINGS=${abandonedWeddings}`);
  console.log(`DELETE_CANDIDATES=${deleteCandidates}`);
  console.log(`QUARANTINE_CANDIDATES=${quarantineCandidates}`);
  console.log(`KEEP_CANDIDATES=${keepCandidates}`);
  console.log(`CLASSIFICATION_TOTAL_CHECK=${classificationTotal === total ? 'PASS' : 'FAIL'}`);
  console.log('PRODUCTION_DELETION_EXECUTED=NO');
  console.log('============================================================\n');
}

runDetailedAudit();
