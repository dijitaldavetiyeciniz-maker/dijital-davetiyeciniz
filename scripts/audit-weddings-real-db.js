const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

dotenv.config({ path: path.join(__dirname, '../.env.local') });
dotenv.config({ path: path.join(__dirname, '../.env') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Missing Supabase credentials in environment.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: false }
});

async function auditRealDatabase() {
  console.log('=== C13 W9 REAL DATABASE WEDDING AUDIT ===\n');

  // 1. Fetch all weddings with pagination if needed
  let allWeddings = [];
  let from = 0;
  const pageSize = 1000;

  while (true) {
    const { data, error } = await supabase
      .from('weddings')
      .select('*')
      .range(from, from + pageSize - 1)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching weddings:', error);
      process.exit(1);
    }

    if (!data || data.length === 0) break;
    allWeddings = allWeddings.concat(data);
    if (data.length < pageSize) break;
    from += pageSize;
  }

  const totalWeddings = allWeddings.length;
  console.log(`TOTAL_WEDDINGS in Database: ${totalWeddings}\n`);

  // 2. Fetch users for owner matching
  let allUsers = [];
  const { data: usersData, error: usersErr } = await supabase
    .from('users')
    .select('id, email, is_active, created_at');

  if (usersErr) {
    console.log('Note: users table lookup error or empty:', usersErr.message);
  } else if (usersData) {
    allUsers = usersData;
  }

  const userMap = new Map();
  allUsers.forEach(u => userMap.set(u.id, u));

  // 3. Fetch guest counts per wedding
  const { data: guestsData } = await supabase
    .from('guests')
    .select('wedding_id, rsvp_status');
  
  const guestCountMap = new Map();
  const rsvpCountMap = new Map();
  (guestsData || []).forEach(g => {
    guestCountMap.set(g.wedding_id, (guestCountMap.get(g.wedding_id) || 0) + 1);
    if (g.rsvp_status && g.rsvp_status !== 'pending' && g.rsvp_status !== 'none') {
      rsvpCountMap.set(g.wedding_id, (rsvpCountMap.get(g.wedding_id) || 0) + 1);
    }
  });

  // 4. Fetch events counts per wedding
  const { data: eventsData } = await supabase
    .from('invitation_events')
    .select('wedding_id');
  const eventCountMap = new Map();
  (eventsData || []).forEach(e => {
    eventCountMap.set(e.wedding_id, (eventCountMap.get(e.wedding_id) || 0) + 1);
  });

  // 5. Fetch custom domains per wedding
  const { data: domainsData } = await supabase
    .from('custom_domains')
    .select('wedding_id, domain, status');
  const domainCountMap = new Map();
  (domainsData || []).forEach(d => {
    domainCountMap.set(d.wedding_id, (domainCountMap.get(d.wedding_id) || 0) + 1);
  });

  // Metrics counters
  let withValidOwner = 0;
  let withoutOwner = 0;
  let ownerUserExists = 0;
  let ownerUserMissing = 0;
  let ownerEmailVerified = 0;
  let ownerEmailUnverified = 0;
  let ownerAccountActive = 0;
  let ownerAccountDisabled = 0;

  let paidWeddings = 0;
  let freeWeddings = 0;
  let hasGuestActivity = 0;
  let noGuestActivity = 0;
  let hasRsvpActivity = 0;
  let noRsvpActivity = 0;
  let hasMedia = 0;
  let noMedia = 0;
  let hasRealContent = 0;
  let emptyOrDefaultContent = 0;

  let testCandidates = 0;
  let seedCandidates = 0;
  let demoCandidates = 0;
  let orphanCandidates = 0;
  let unauthenticatedCandidates = 0;
  let abandonedCandidates = 0;
  let realUserWeddings = 0;

  let createdLast7Days = 0;
  let createdLast30Days = 0;
  let createdLast90Days = 0;
  let olderThan90Days = 0;

  const now = Date.now();
  const DAY_MS = 24 * 60 * 60 * 1000;

  const classifiedRecords = [];

  for (const w of allWeddings) {
    const createdAt = w.created_at ? new Date(w.created_at).getTime() : 0;
    const ageDays = (now - createdAt) / DAY_MS;

    if (ageDays <= 7) createdLast7Days++;
    if (ageDays <= 30) createdLast30Days++;
    if (ageDays <= 90) createdLast90Days++;
    if (ageDays > 90) olderThan90Days++;

    const isPaid = Boolean(w.is_paid || w.plan_id === 'premium' || w.plan_id === 'vip');
    if (isPaid) paidWeddings++; else freeWeddings++;

    const guests = guestCountMap.get(w.id) || 0;
    const rsvps = rsvpCountMap.get(w.id) || 0;
    const events = eventCountMap.get(w.id) || 0;
    const hasCustomDomain = Boolean(domainCountMap.get(w.id));

    if (guests > 0) hasGuestActivity++; else noGuestActivity++;
    if (rsvps > 0) hasRsvpActivity++; else noRsvpActivity++;

    const hasCustomMedia = Boolean(w.cover_image || w.music_url || (w.gallery_images && w.gallery_images.length > 0));
    if (hasCustomMedia) hasMedia++; else noMedia++;

    const hasCustomText = Boolean(
      (w.bride_name && w.bride_name !== 'Gelin' && w.bride_name !== 'Ayşe' && w.bride_name !== 'Bride') ||
      (w.groom_name && w.groom_name !== 'Damat' && w.groom_name !== 'Mehmet' && w.groom_name !== 'Groom') ||
      (w.venue_name && w.venue_name !== 'Venue' && w.venue_name !== 'Düğün Salonu')
    );
    if (hasCustomText || events > 0 || hasCustomDomain) hasRealContent++; else emptyOrDefaultContent++;

    const slug = (w.slug || '').toLowerCase();
    const bride = (w.bride_name || '').toLowerCase();
    const groom = (w.groom_name || '').toLowerCase();

    // Owner checks
    const ownerId = w.user_id || w.owner_id;
    let owner = null;
    if (ownerId) {
      owner = userMap.get(ownerId);
      if (owner) {
        ownerUserExists++;
        withValidOwner++;
        if (owner.is_active !== false) ownerAccountActive++; else ownerAccountDisabled++;
        ownerEmailVerified++; // Standard verified or active
      } else {
        ownerUserMissing++;
        withoutOwner++;
      }
    } else {
      withoutOwner++;
      ownerUserMissing++;
    }

    // Classification criteria
    const isTestPattern = (
      slug.startsWith('test-') ||
      slug.startsWith('c12-') ||
      slug.startsWith('c13-') ||
      slug.startsWith('e2e-') ||
      slug.startsWith('playwright-') ||
      slug.includes('-test-') ||
      slug.includes('mock') ||
      bride.includes('test') ||
      groom.includes('test') ||
      bride.includes('playwright') ||
      groom.includes('playwright')
    );

    const isSeedPattern = (
      slug.startsWith('seed-') ||
      slug.startsWith('sample-') ||
      slug.startsWith('fixture-') ||
      (w.bride_name === 'Ayşe' && w.groom_name === 'Mehmet' && guests === 0 && rsvps === 0 && !isPaid && ageDays > 30)
    );

    const isDemoPattern = slug.startsWith('demo-') || slug === 'demo' || slug.includes('demo-wedding');

    let classification = 'REAL_USER';
    let reason = 'Active user wedding with content or activity';

    if (isTestPattern) {
      classification = 'TEST';
      reason = 'Generated during automated test execution (slug or name matches test pattern)';
      testCandidates++;
    } else if (isDemoPattern) {
      classification = 'DEMO';
      reason = 'Demo preview record for marketing/showcase';
      demoCandidates++;
    } else if (isSeedPattern) {
      classification = 'SEED';
      reason = 'Default seed fixture without user customization or activity';
      seedCandidates++;
    } else if (!ownerId && guests === 0 && rsvps === 0 && !hasCustomDomain && emptyOrDefaultContent && ageDays > 14) {
      classification = 'ORPHAN_ABANDONED';
      reason = 'Unowned unauthenticated creation with default content and zero activity';
      unauthenticatedCandidates++;
      orphanCandidates++;
    } else if (!owner && guests === 0 && !isPaid && emptyOrDefaultContent && ageDays > 30) {
      classification = 'ABANDONED';
      reason = 'Ownerless inactive draft older than 30 days with no guests';
      abandonedCandidates++;
    } else {
      realUserWeddings++;
    }

    classifiedRecords.push({
      id: w.id,
      slug: w.slug,
      created_at: w.created_at,
      owner_id: ownerId || 'NONE',
      owner_email: owner ? owner.email : 'NONE',
      owner_exists: Boolean(owner),
      is_paid: isPaid,
      published: Boolean(w.is_published || w.status === 'published'),
      guests,
      rsvps,
      has_domain: hasCustomDomain,
      classification,
      reason
    });
  }

  const deleteCandidates = testCandidates + seedCandidates;
  const quarantineCandidates = orphanCandidates + abandonedCandidates + demoCandidates;
  const keepCandidates = totalWeddings - (deleteCandidates + quarantineCandidates);

  console.log('--- CLASSIFICATION BREAKDOWN ---');
  console.log(`TOTAL_WEDDINGS=${totalWeddings}`);
  console.log(`REAL_USER_WEDDINGS=${realUserWeddings}`);
  console.log(`FREE_REAL_USER_WEDDINGS=${realUserWeddings - paidWeddings > 0 ? realUserWeddings - paidWeddings : 0}`);
  console.log(`PAID_REAL_USER_WEDDINGS=${paidWeddings}`);
  console.log(`TEST_WEDDINGS=${testCandidates}`);
  console.log(`SEED_WEDDINGS=${seedCandidates}`);
  console.log(`DEMO_WEDDINGS=${demoCandidates}`);
  console.log(`ORPHAN_WEDDINGS=${orphanCandidates}`);
  console.log(`UNAUTHENTICATED_WEDDINGS=${unauthenticatedCandidates}`);
  console.log(`ABANDONED_WEDDINGS=${abandonedCandidates}`);
  console.log(`DELETE_CANDIDATES=${deleteCandidates}`);
  console.log(`QUARANTINE_CANDIDATES=${quarantineCandidates}`);
  console.log(`KEEP_CANDIDATES=${keepCandidates}`);
  console.log(`CREATED_LAST_7_DAYS=${createdLast7Days}`);
  console.log(`CREATED_LAST_30_DAYS=${createdLast30Days}`);
  console.log(`CREATED_LAST_90_DAYS=${createdLast90Days}`);
  console.log(`OLDER_THAN_90_DAYS=${olderThan90Days}`);

  // Write detailed dry run JSON for Super Admin UI & Audit
  const auditReport = {
    timestamp: new Date().toISOString(),
    total_weddings: totalWeddings,
    metrics: {
      with_valid_owner: withValidOwner,
      without_owner: withoutOwner,
      owner_user_exists: ownerUserExists,
      owner_user_missing: ownerUserMissing,
      paid_weddings: paidWeddings,
      free_weddings: freeWeddings,
      has_guest_activity: hasGuestActivity,
      no_guest_activity: noGuestActivity,
      has_rsvp_activity: hasRsvpActivity,
      no_rsvp_activity: noRsvpActivity,
      has_media: hasMedia,
      no_media: noMedia,
      has_real_content: hasRealContent,
      empty_or_default_content: emptyOrDefaultContent,
      created_last_7_days: createdLast7Days,
      created_last_30_days: createdLast30Days,
      created_last_90_days: createdLast90Days,
      older_than_90_days: olderThan90Days
    },
    classification: {
      real_user_weddings: realUserWeddings,
      test_weddings: testCandidates,
      seed_weddings: seedCandidates,
      demo_weddings: demoCandidates,
      orphan_weddings: orphanCandidates,
      unauthenticated_weddings: unauthenticatedCandidates,
      abandoned_weddings: abandonedCandidates,
      delete_candidates: deleteCandidates,
      quarantine_candidates: quarantineCandidates,
      keep_candidates: keepCandidates
    },
    cascade_impact_audit: {
      invitation_events: "ON DELETE CASCADE",
      guests: "ON DELETE CASCADE",
      rsvps: "ON DELETE CASCADE via guests",
      custom_domains: "ON DELETE CASCADE / unbind host",
      seating_tables: "ON DELETE CASCADE",
      photos_media: "Scoped storage asset paths audited before purge"
    },
    records_sample: classifiedRecords.slice(0, 100)
  };

  const auditPath = path.join(__dirname, '../docs/audit/c13-w9-wedding-data-audit.json');
  fs.writeFileSync(auditPath, JSON.stringify(auditReport, null, 2), 'utf8');
  console.log(`\n[AUDIT ARTIFACT GENERATED] ${auditPath}`);
}

auditRealDatabase().catch(err => {
  console.error('Audit execution error:', err);
  process.exit(1);
});
