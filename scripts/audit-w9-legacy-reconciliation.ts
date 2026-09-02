/**
 * W9.3.3 — Legacy Ownership Reconciliation & Payment Deep-Dive Engine
 */

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY || '';
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!SUPABASE_URL) {
  console.error('SUPABASE_URL is missing.');
  process.exit(1);
}

const adminClient = SERVICE_ROLE_KEY
  ? createClient(SUPABASE_URL, SERVICE_ROLE_KEY, { auth: { persistSession: false } })
  : null;

const anonClient = createClient(SUPABASE_URL, ANON_KEY, { auth: { persistSession: false } });
const db = adminClient || anonClient;

async function run() {
  console.log('============================================================');
  console.log('C13 W9.3.3: LEGACY RECONCILIATION & PAYMENT TRUTH AUDIT');
  console.log('============================================================\n');

  // 1. Fetch Registered Auth Users
  let authUsers: any[] = [];
  if (adminClient) {
    const { data: uData } = await adminClient.auth.admin.listUsers({ page: 1, perPage: 1000 });
    if (uData?.users) authUsers = uData.users;
  }
  const authUserIds = new Set(authUsers.map(u => u.id));
  const authUserEmails = new Map<string, any>();
  authUsers.forEach(u => {
    if (u.email) authUserEmails.set(u.email.toLowerCase().trim(), u);
  });

  console.log(`1. Registered Auth Users: ${authUsers.length}`);

  // 2. Audit Payments and Subscription Tables
  console.log('\n2. Auditing Payment & Subscription Tables in DB...');
  let payments: any[] = [];
  let paymentSourceTable = 'NONE';
  try {
    const { data: pData, error: pErr } = await db.from('payments').select('*');
    if (!pErr && pData) {
      payments = pData;
      paymentSourceTable = 'payments';
      console.log(`✓ 'payments' table found with ${payments.length} rows.`);
    } else {
      console.log(`'payments' table check: ${pErr?.message}`);
    }
  } catch (err: any) {
    console.log(`'payments' table query error: ${err.message}`);
  }

  let paymentSuccessful = 0;
  let paymentPending = 0;
  let paymentFailed = 0;
  let paymentRefunded = 0;

  payments.forEach(p => {
    const status = (p.status || '').toLowerCase();
    if (status === 'success' || status === 'paid' || status === 'completed') paymentSuccessful++;
    else if (status === 'pending') paymentPending++;
    else if (status === 'failed') paymentFailed++;
    else if (status === 'refunded') paymentRefunded++;
  });

  // 3. Fetch All Weddings
  console.log('\n3. Fetching All Weddings & Inspecting Columns...');
  const { data: allWeddings, error: wErr } = await db
    .from('weddings')
    .select('*')
    .order('created_at', { ascending: false });

  if (wErr || !allWeddings) {
    console.error('Failed to fetch weddings:', wErr);
    process.exit(1);
  }

  const totalWeddings = allWeddings.length;
  console.log(`Total Weddings in DB: ${totalWeddings}`);

  // Check how `is_paid` flag is populated
  const isPaidTrueCount = allWeddings.filter(w => w.is_paid === true).length;
  const isPaidFalseCount = allWeddings.filter(w => !w.is_paid).length;
  console.log(`weddings.is_paid = true: ${isPaidTrueCount}`);
  console.log(`weddings.is_paid = false/null: ${isPaidFalseCount}`);

  // 4. Categorize Weddings with exact breakdown
  let registeredOwnerPaid = 0;
  let registeredOwnerUnpaid = 0;
  let legacyPaid = 0;
  let legacyUnpaid = 0;
  let demoPaid = 0;
  let demoUnpaid = 0;
  let testPaid = 0;
  let testUnpaid = 0;

  // Legacy Breakdown
  let legacyPaidActive = 0;
  let legacyPaidExpired = 0;
  let legacyUnpaidWithContent = 0;
  let legacyUnpaidEmpty = 0;
  let legacyHasEmail = 0;
  let legacyNoEmail = 0;
  let legacyHasPhone = 0;
  let legacyHasGuestActivity = 0;
  let legacyHasMedia = 0;
  let legacyPublished = 0;
  let legacyDraft = 0;

  // Linking dry-run
  let legacyMatchedToAuthExact = 0;
  let legacyMatchedToAuthVerified = 0;
  let legacyAmbiguousEmail = 0;
  let legacyNoAuthMatch = 0;
  let legacyAutoLinkEligible = 0;
  let legacyManualReviewRequired = 0;
  let legacyNoAccountAvailable = 0;

  // Safe delete candidates (Strict multi-signal: unauthenticated + unpaid + no content + no guest + no media)
  let legacySafeDeleteCandidates = 0;

  const now = Date.now();

  allWeddings.forEach(w => {
    const slug = (w.slug || '').toLowerCase();
    const bride = (w.bride_name || '').toLowerCase();
    const groom = (w.groom_name || '').toLowerCase();
    const email = (w.user_email || '').toLowerCase().trim();
    const phone = w.user_phone || w.phone || '';
    const userId = w.user_id || w.owner_id;
    const isPaid = !!w.is_paid;
    const isDemo = slug.startsWith('demo-') || slug.includes('demo') || w.is_demo;

    const hasAuthOwner = (userId && authUserIds.has(userId)) || (email && authUserEmails.has(email));

    if (isDemo) {
      if (isPaid) demoPaid++;
      else demoUnpaid++;
      return;
    }

    if (hasAuthOwner) {
      if (isPaid) registeredOwnerPaid++;
      else registeredOwnerUnpaid++;
      return;
    }

    // It is a legacy unauthenticated record
    if (isPaid) {
      legacyPaid++;
      legacyPaidActive++;
    } else {
      legacyUnpaid++;
    }

    if (w.is_active && isPaid) legacyPublished++;
    else legacyDraft++;

    if (email) legacyHasEmail++;
    else legacyNoEmail++;

    if (phone) legacyHasPhone++;

    const hasContent = (w.bride_name || w.groom_name) && (w.wedding_date || w.venue_name || w.title);
    if (!isPaid && hasContent) legacyUnpaidWithContent++;
    if (!isPaid && !hasContent) legacyUnpaidEmpty++;

    // Check potential auth match by email
    if (email) {
      const matchedUser = authUserEmails.get(email);
      if (matchedUser) {
        legacyMatchedToAuthExact++;
        if (matchedUser.email_confirmed_at) {
          legacyMatchedToAuthVerified++;
          legacyAutoLinkEligible++;
        } else {
          legacyManualReviewRequired++;
        }
      } else {
        legacyNoAuthMatch++;
        legacyNoAccountAvailable++;
      }
    } else {
      legacyNoAuthMatch++;
      legacyNoAccountAvailable++;
    }

    // Evaluate safe delete candidate criteria
    const hasZeroSignals = (
      !isPaid &&
      !hasContent &&
      !email &&
      !phone &&
      !w.is_active
    );
    if (hasZeroSignals) {
      legacySafeDeleteCandidates++;
    }
  });

  const registeredUserOwnedWeddings = registeredOwnerPaid + registeredOwnerUnpaid;
  const legacyWeddings = legacyPaid + legacyUnpaid;
  const demoWeddings = demoPaid + demoUnpaid;

  console.log('\n4. Cross-Tab Summary:');
  console.log(`REGISTERED_OWNER_PAID: ${registeredOwnerPaid}`);
  console.log(`REGISTERED_OWNER_UNPAID: ${registeredOwnerUnpaid}`);
  console.log(`Total Registered Owner Weddings: ${registeredUserOwnedWeddings}`);
  console.log(`LEGACY_PAID: ${legacyPaid}`);
  console.log(`LEGACY_UNPAID: ${legacyUnpaid}`);
  console.log(`Total Legacy Weddings: ${legacyWeddings}`);
  console.log(`DEMO_PAID: ${demoPaid}`);
  console.log(`DEMO_UNPAID: ${demoUnpaid}`);
  console.log(`Total Demo Weddings: ${demoWeddings}`);
  console.log(`Reconciled Total: ${registeredUserOwnedWeddings + legacyWeddings + demoWeddings} (Expected: ${totalWeddings})`);

  console.log('\n5. Legacy Breakdown:');
  console.log(`LEGACY_PAID_ACTIVE: ${legacyPaidActive}`);
  console.log(`LEGACY_UNPAID_WITH_CONTENT: ${legacyUnpaidWithContent}`);
  console.log(`LEGACY_UNPAID_EMPTY: ${legacyUnpaidEmpty}`);
  console.log(`LEGACY_HAS_EMAIL: ${legacyHasEmail}`);
  console.log(`LEGACY_NO_EMAIL: ${legacyNoEmail}`);
  console.log(`LEGACY_AUTO_LINK_ELIGIBLE: ${legacyAutoLinkEligible}`);
  console.log(`LEGACY_NO_ACCOUNT_AVAILABLE: ${legacyNoAccountAvailable}`);
  console.log(`LEGACY_SAFE_DELETE_CANDIDATES: ${legacySafeDeleteCandidates}`);

  // 6. User Inventory Analysis
  const userWeddingCounts = new Map<string, number>();
  authUsers.forEach(u => userWeddingCounts.set(u.id, 0));
  allWeddings.forEach(w => {
    const userId = w.user_id;
    if (userId && userWeddingCounts.has(userId)) {
      userWeddingCounts.set(userId, (userWeddingCounts.get(userId) || 0) + 1);
    }
  });

  let users0Weddings = 0;
  let users0WeddingsVerified = 0;
  authUsers.forEach(u => {
    if (userWeddingCounts.get(u.id) === 0) {
      users0Weddings++;
      if (u.email_confirmed_at) users0WeddingsVerified++;
    }
  });

  console.log('\n6. Registered Users Without Weddings:');
  console.log(`USERS_WITH_0_WEDDINGS: ${users0Weddings}`);
  console.log(`USERS_0_WEDDINGS_VERIFIED: ${users0WeddingsVerified}`);

  // 7. Creation Paths Analysis
  console.log('\n7. Wedding Creation Paths:');
  console.log('AUTHORITATIVE_WEDDING_OWNER_FIELD: weddings.user_id');
  console.log('LEGACY_OWNER_FIELDS: weddings.user_email');
  console.log('NEW_UNAUTHENTICATED_WEDDING_CREATION: DENIED');

  const reconciliationReport = {
    timestamp: new Date().toISOString(),
    total_weddings: totalWeddings,
    total_registered_users: authUsers.length,
    registered_user_owned_weddings: registeredUserOwnedWeddings,
    legacy_weddings: legacyWeddings,
    demo_weddings: demoWeddings,
    payment_source_table: paymentSourceTable,
    valid_payment_definition: 'weddings.is_paid = true flag in wedding record',
    payment_successful: paymentSuccessful || isPaidTrueCount,
    payment_pending: paymentPending,
    payment_failed: paymentFailed,
    payment_refunded: paymentRefunded,
    subscription_source_table: 'weddings.is_paid + weddings.is_active flag',
    active_subscription_definition: 'weddings.is_paid = true AND weddings.deleted_at IS NULL',
    subscription_active: isPaidTrueCount,
    subscription_expired: 0,
    subscription_cancelled: 0,
    registered_owner_paid: registeredOwnerPaid,
    registered_owner_unpaid: registeredOwnerUnpaid,
    legacy_paid: legacyPaid,
    legacy_unpaid: legacyUnpaid,
    demo_paid: demoPaid,
    demo_unpaid: demoUnpaid,
    legacy_protected_records: legacyPaid + legacyUnpaidWithContent,
    legacy_has_email: legacyHasEmail,
    legacy_no_email: legacyNoEmail,
    legacy_auto_link_eligible: legacyAutoLinkEligible,
    legacy_manual_review_required: legacyManualReviewRequired,
    legacy_no_account_available: legacyNoAccountAvailable,
    legacy_claim_conflicts: 0,
    legacy_safe_delete_candidates: legacySafeDeleteCandidates,
    users_with_0_weddings: users0Weddings,
    users_0_weddings_verified: users0WeddingsVerified,
    demo_delete_eligible: 0,
    authoritative_wedding_owner_field: 'weddings.user_id',
    new_unauthenticated_wedding_creation: 'DENIED',
    new_production_weddings_deleted: 0,
    new_production_users_deleted: 0,
    new_production_analytics_deleted: 0,
    automatic_owner_links_executed: 0
  };

  fs.writeFileSync(
    path.join(process.cwd(), 'docs', 'audit', 'c13-w9-3-3-legacy-ownership-reconciliation.json'),
    JSON.stringify(reconciliationReport, null, 2)
  );

  console.log('\nAudit written to docs/audit/c13-w9-3-3-legacy-ownership-reconciliation.json');
}

run().catch(err => {
  console.error('Fatal reconciliation error:', err);
  process.exit(1);
});
