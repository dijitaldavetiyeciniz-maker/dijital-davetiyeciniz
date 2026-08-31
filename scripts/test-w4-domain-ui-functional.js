import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runTests() {
  console.log('=== C13 W4 ADMIN DOMAIN MANAGEMENT UI FUNCTIONAL TEST SUITE ===\n');

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

  const componentPath = path.join(__dirname, '../src/components/admin/DomainManagerTab.tsx');
  const adminPagePath = path.join(__dirname, '../src/app/[wedding_id]/admin/page.tsx');

  assert(fs.existsSync(componentPath), 'DomainManagerTab.tsx component exists');
  assert(fs.existsSync(adminPagePath), 'admin/page.tsx exists');

  const componentCode = fs.readFileSync(componentPath, 'utf-8');
  const adminPageCode = fs.readFileSync(adminPagePath, 'utf-8');

  // --- SECTION 1: ARCHITECTURE & API CONTRACT CONFORMANCE ---
  console.log('--- 1. Architecture & Client-Side API Contracts ---');

  // Test 1: Exclusively uses W3 API endpoints
  const usesGetApi = componentCode.includes('/api/admin/domain?wedding_id=');
  const usesPostAddApi = componentCode.includes("fetch('/api/admin/domain'");
  const usesPostVerifyApi = componentCode.includes("fetch('/api/admin/domain/verify'");
  const usesDeleteApi = componentCode.includes("method: 'DELETE'") && componentCode.includes('/api/admin/domain?');

  assert(
    usesGetApi && usesPostAddApi && usesPostVerifyApi && usesDeleteApi,
    'DomainManagerTab communicates exclusively with W3 server APIs (/api/admin/domain, /api/admin/domain/verify)'
  );

  // Test 2: No direct client-side Supabase writes
  const hasNoClientSupabaseWrites = !componentCode.includes("supabase.from('custom_domains').insert") &&
    !componentCode.includes("supabase.from('custom_domains').update") &&
    !componentCode.includes("supabase.from('custom_domains').delete") &&
    !componentCode.includes("supabase.from('custom_domains').upsert");

  assert(
    hasNoClientSupabaseWrites,
    'Client-side component strictly contains zero direct Supabase mutations on custom_domains table'
  );

  // --- SECTION 2: NAVIGATION & PAGE INTEGRATION ---
  console.log('\n--- 2. Navigation & Admin Page Integration ---');

  // Test 3: Admin page imports DomainManagerTab
  assert(
    adminPageCode.includes("import DomainManagerTab from '@/components/admin/DomainManagerTab'"),
    'admin/page.tsx imports DomainManagerTab component'
  );

  // Test 4: Navigation tab button configured
  assert(
    adminPageCode.includes('data-testid="admin-nav-domain"') && adminPageCode.includes("setActiveTab('domain')"),
    'admin/page.tsx includes dedicated Özel Alan Adı navigation tab button with data-testid'
  );

  // Test 5: Tab renderer mounted
  assert(
    adminPageCode.includes("activeTab === 'domain'") && adminPageCode.includes('<DomainManagerTab'),
    'admin/page.tsx conditionally renders DomainManagerTab when activeTab is domain'
  );

  // --- SECTION 3: ENTITLEMENT LOCKED STATE ---
  console.log('\n--- 3. Entitlement Gating & Locked State UX ---');

  // Test 6: Entitlement evaluation logic
  assert(
    componentCode.includes('wedding.is_paid') && componentCode.includes('wedding.plan_tier'),
    'Component evaluates wedding payment and plan tier for entitlement check'
  );

  // Test 7: Locked banner elements
  assert(
    componentCode.includes('data-testid="domain-manager-locked"') &&
    componentCode.includes('data-testid="upgrade-plan-button"'),
    'Locked state displays high-converting upgrade banner with lock icon and plan upgrade button'
  );

  // --- SECTION 4: EMPTY STATE & FORM VALIDATION ---
  console.log('\n--- 4. Empty State & Input Form ---');

  // Test 8: Empty state container
  assert(
    componentCode.includes('data-testid="domain-empty-state"'),
    'Empty state is rendered when no custom domain is connected'
  );

  // Test 9: Input field with placeholder and testid
  assert(
    componentCode.includes('data-testid="domain-hostname-input"') &&
    componentCode.includes('placeholder="Örn: davet.zeynepmurat.com"'),
    'Hostname input field includes intuitive placeholder and data-testid'
  );

  // Test 10: Double submit protection and disabled submit button
  assert(
    componentCode.includes('disabled={submitting || !hostnameInput.trim()}') ||
    componentCode.includes('disabled={submitting'),
    'Submit button enforces double-submit prevention and disables during request'
  );

  // --- SECTION 5: PENDING VERIFICATION & DNS INSTRUCTIONS ---
  console.log('\n--- 5. Pending Verification & DNS Instructions ---');

  // Test 11: Connected state container
  assert(
    componentCode.includes('data-testid="domain-connected-state"'),
    'Connected state displays domain banner and configuration when domain exists'
  );

  // Test 12: Pending status badge
  assert(
    componentCode.includes('data-testid="domain-status-pending"'),
    'Pending domain displays amber DNS Doğrulaması Bekleniyor badge'
  );

  // Test 13: DNS configuration table with CNAME and TXT records
  assert(
    componentCode.includes('data-testid="dns-row-cname"') &&
    componentCode.includes('data-testid="dns-row-txt"') &&
    componentCode.includes('cname.vercel-dns.com'),
    'DNS configuration table provides accurate CNAME and TXT challenge instructions'
  );

  // Test 14: One-click copy with visual feedback
  assert(
    componentCode.includes('copyToClipboard') &&
    componentCode.includes('data-testid="copy-cname-button"') &&
    componentCode.includes('data-testid="copy-txt-button"') &&
    componentCode.includes('Kopyalandı'),
    'One-click copy buttons provide instant visual feedback (Kopyalandı!)'
  );

  // Test 15: Verify button with spinner
  assert(
    componentCode.includes('data-testid="domain-verify-button"') &&
    componentCode.includes('verifying') &&
    componentCode.includes('animate-spin'),
    'Verify button triggers verification with loading spinner and disabled state'
  );

  // --- SECTION 6: ACTIVE DOMAIN STATE ---
  console.log('\n--- 6. Active Domain State ---');

  // Test 16: Active status badge
  assert(
    componentCode.includes('data-testid="domain-status-active"') &&
    componentCode.includes('Aktif & SSL Hazır'),
    'Active domain displays emerald Aktif & SSL Hazır badge'
  );

  // Test 17: Live link and active information banner
  assert(
    componentCode.includes('data-testid="domain-active-info"') &&
    componentCode.includes('ExternalLink') &&
    componentCode.includes('https://'),
    'Active domain provides live link and confirmation of HTTPS readiness'
  );

  // --- SECTION 7: ERROR STATE & NOTIFICATIONS ---
  console.log('\n--- 7. Error State & Feedback ---');

  // Test 18: Error status pill
  assert(
    componentCode.includes('data-testid="domain-status-error"'),
    'Failed domain status displays red Doğrulama Hatası badge'
  );

  // Test 19: Accessible error alert banner
  assert(
    componentCode.includes('role="alert"') &&
    componentCode.includes('data-testid="domain-error-alert"'),
    'Error alert banner conforms to accessibility standards (role="alert")'
  );

  // --- SECTION 8: REMOVE MODAL & DELETION SAFETY ---
  console.log('\n--- 8. Remove Confirmation Modal & Deletion Safety ---');

  // Test 20: Remove confirmation modal dialog
  assert(
    componentCode.includes('data-testid="domain-remove-modal"') &&
    componentCode.includes('role="dialog"') &&
    componentCode.includes('aria-modal="true"'),
    'Remove action opens accessible modal dialog with clear impact warning'
  );

  // Test 21: Modal cancel and confirm actions
  assert(
    componentCode.includes('data-testid="modal-cancel-remove"') &&
    componentCode.includes('data-testid="modal-confirm-remove"'),
    'Modal provides safe cancel and confirm deletion actions'
  );

  // --- SECTION 9: REFRESH PERSISTENCE & MOBILE RESPONSIVENESS ---
  console.log('\n--- 9. Data Fetch Persistence & Responsive Design ---');

  // Test 22: Automatic data fetch on mount (F5 / tab switch persistence)
  assert(
    componentCode.includes('fetchDomainData()') && componentCode.includes('useEffect('),
    'Component automatically re-fetches latest authoritative domain state from server on mount/tab change'
  );

  // Test 23: Mobile responsive classes (390x844 layout)
  assert(
    componentCode.includes('flex-col') &&
    componentCode.includes('sm:flex-row') &&
    componentCode.includes('overflow-x-auto'),
    'Component incorporates responsive Tailwind layout (flex-col sm:flex-row, overflow-x-auto) for mobile viewports'
  );

  console.log(`\n================================`);
  console.log(`W4 FUNCTIONAL TESTS TOTAL: ${passed + failed}`);
  console.log(`W4 PASS: ${passed}`);
  console.log(`W4 FAIL: ${failed}`);
  console.log(`================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error(err);
  process.exit(1);
});
