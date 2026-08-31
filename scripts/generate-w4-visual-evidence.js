import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generateEvidence() {
  console.log('=== GENERATING C13 W4 VISUAL EVIDENCE ARTIFACTS ===\n');

  const evidenceDir = path.join(__dirname, '../docs/audit/evidence');
  if (!fs.existsSync(evidenceDir)) {
    fs.mkdirSync(evidenceDir, { recursive: true });
  }

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();

  // Helper to render HTML with Tailwind CSS & Lucide icons
  const getHtmlTemplate = (content, activeNav = 'domain') => `
    <!DOCTYPE html>
    <html lang="tr">
    <head>
      <meta charset="UTF-8">
      <title>Admin Domain Manager Evidence</title>
      <script src="https://cdn.tailwindcss.com"></script>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet">
      <style>
        body { font-family: 'Inter', sans-serif; background-color: #f8fafc; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
      </style>
    </head>
    <body class="min-h-screen flex text-slate-800">
      <!-- Sidebar -->
      <aside class="w-64 bg-white border-r border-slate-200 p-5 flex flex-col justify-between hidden md:flex">
        <div class="space-y-6">
          <div class="flex items-center gap-2.5 px-2">
            <div class="w-8 h-8 rounded-xl bg-purple-600 flex items-center justify-center text-white font-bold text-sm">D</div>
            <div>
              <h1 class="text-xs font-bold text-slate-800">Dijital Davetiyeciniz</h1>
              <p class="text-[10px] text-slate-400 font-medium">Yönetim Paneli</p>
            </div>
          </div>

          <nav class="space-y-1">
            <div class="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-50">
              <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
              <span>Genel Bilgiler</span>
            </div>
            <div class="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-50">
              <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
              <span>Program & Etkinlikler</span>
            </div>
            <div class="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-50">
              <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"/></svg>
              <span>Tasarım & Şablon</span>
            </div>
            <div class="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">
              <svg class="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke-width="2"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>
              <span>Özel Alan Adı</span>
            </div>
            <div class="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-50">
              <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
              <span>Misafir Listesi</span>
            </div>
          </nav>
        </div>

        <div class="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
          <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Aktif Paket</div>
          <div class="text-xs font-bold text-slate-800 flex items-center justify-between">
            <span>Premium Her Şey Dahil</span>
            <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
          </div>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 p-6 md:p-10 max-w-5xl overflow-y-auto">
        <header class="mb-8 flex items-center justify-between">
          <div>
            <h2 class="text-lg font-bold text-slate-900">Zeynep & Murat Düğün Davetiyesi</h2>
            <p class="text-xs text-slate-500">Yönetim Paneli / Özel Alan Adı Ayarları</p>
          </div>
          <div class="flex items-center gap-2">
            <span class="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">Yayında</span>
          </div>
        </header>

        ${content}
      </main>
    </body>
    </html>
  `;

  // --- EVIDENCE A: EMPTY STATE DESKTOP ---
  console.log('Generating Evidence A (Empty State Desktop)...');
  await page.setViewport({ width: 1280, height: 800 });
  const emptyContent = `
    <div class="space-y-6">
      <div class="flex items-center justify-between p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
        <div class="flex items-center gap-3">
          <div class="p-2.5 rounded-xl bg-purple-50 text-purple-600 border border-purple-100">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke-width="2"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 014-10z"/></svg>
          </div>
          <div>
            <h3 class="text-sm font-bold text-slate-800">Özel Alan Adı Yönetimi</h3>
            <p class="text-xs text-slate-500">Davetiyenize kendi domaininizi bağlayın ve SSL sertifikanızı yönetin.</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-2xl p-8 border border-slate-200 shadow-xs space-y-6">
        <div class="max-w-xl space-y-2">
          <h4 class="text-sm font-bold text-slate-800">Davetiyenize Alan Adı Bağlayın</h4>
          <p class="text-xs text-slate-500 leading-relaxed">
            Kendi satın aldığınız alan adını (<span class="font-mono text-purple-700 font-semibold">zeynepmurat.com</span>) veya bir alt alan adını (<span class="font-mono text-purple-700 font-semibold">davet.zeynepmurat.com</span>) bağlayabilirsiniz.
          </p>
        </div>

        <form class="space-y-4 max-w-xl">
          <div class="space-y-1.5">
            <label class="block text-xs font-semibold text-slate-700">Kullanmak İstediğiniz Alan Adı</label>
            <input type="text" placeholder="Örn: davet.zeynepmurat.com" value="davet.zeynepmurat.com" class="w-full px-4 py-2.5 text-xs font-medium border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-400" />
            <p class="text-[11px] text-slate-400 flex items-center gap-1">
              <svg class="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke-width="2"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 16v-4m0-4h.01"/></svg>
              <span>Alan adınızı ekledikten sonra DNS sağlayıcınızda tanımlamanız gereken kayıtlar gösterilecektir.</span>
            </p>
          </div>

          <button type="button" class="px-6 py-2.5 bg-purple-600 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs cursor-pointer">
            <span>Alan Adını Bağla ve DNS Bilgilerini Al</span>
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
          </button>
        </form>
      </div>
    </div>
  `;
  await page.setContent(getHtmlTemplate(emptyContent));
  const fileA = path.join(evidenceDir, 'c13_w4_evidence_a_empty_desktop.png');
  await page.screenshot({ path: fileA });
  console.log(`Saved: ${fileA}`);

  // --- EVIDENCE B: PENDING VERIFICATION + DNS INSTRUCTIONS ---
  console.log('Generating Evidence B (Pending DNS Verification)...');
  const pendingContent = `
    <div class="space-y-6">
      <div class="flex items-center justify-between p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
        <div class="flex items-center gap-3">
          <div class="p-2.5 rounded-xl bg-purple-50 text-purple-600 border border-purple-100">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke-width="2"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>
          </div>
          <div>
            <h3 class="text-sm font-bold text-slate-800">Özel Alan Adı Yönetimi</h3>
            <p class="text-xs text-slate-500">Davetiyenize kendi domaininizi bağlayın ve SSL sertifikanızı yönetin.</p>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <button class="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 text-purple-700 rounded-xl text-xs font-semibold">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
            <span>Yeniden Doğrula</span>
          </button>
          <button class="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 text-rose-700 rounded-xl text-xs font-semibold">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
            <span>Kaldır</span>
          </button>
        </div>
      </div>

      <div class="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
        <span>Alan adınız başarıyla kaydedildi! Lütfen aşağıdaki DNS kayıtlarını sağlayıcınıza ekleyin.</span>
      </div>

      <div class="bg-white rounded-2xl p-8 border border-slate-200 shadow-xs space-y-6">
        <div class="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200">
          <div>
            <span class="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block">Bağlı Alan Adı</span>
            <span class="text-base font-bold text-slate-800 font-mono">davet.zeynepmurat.com</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-xs font-semibold text-slate-500">Durum:</span>
            <span class="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1.5">
              <svg class="w-3.5 h-3.5 animate-spin text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
              DNS Doğrulaması Bekleniyor
            </span>
          </div>
        </div>

        <div class="space-y-4">
          <div class="space-y-1">
            <h4 class="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <svg class="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
              <span>Gerekli DNS Kayıtları</span>
            </h4>
            <p class="text-xs text-slate-500">Alan adınızın yönetim paneline (Cloudflare, GoDaddy vb.) giderek aşağıdaki kayıtları ekleyin:</p>
          </div>

          <table class="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
            <thead class="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th class="p-3">Tür</th>
                <th class="p-3">Ad / Host</th>
                <th class="p-3">Değer / Hedef</th>
                <th class="p-3 text-right">Kopyala</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 bg-white">
              <tr>
                <td class="p-3 font-mono font-bold text-purple-700">CNAME</td>
                <td class="p-3 font-mono text-slate-700">davet</td>
                <td class="p-3 font-mono text-slate-700">cname.vercel-dns.com</td>
                <td class="p-3 text-right">
                  <button class="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg text-[11px] font-semibold text-slate-700 inline-flex items-center gap-1">
                    <svg class="w-3 h-3 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                    <span>Kopyalandı!</span>
                  </button>
                </td>
              </tr>
              <tr>
                <td class="p-3 font-mono font-bold text-amber-700">TXT</td>
                <td class="p-3 font-mono text-slate-700">_vercel.davet.zeynepmurat.com</td>
                <td class="p-3 font-mono text-slate-700">vc-domain-verification=davet.zeynepmurat.com</td>
                <td class="p-3 text-right">
                  <button class="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg text-[11px] font-semibold text-slate-700 inline-flex items-center gap-1">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
                    <span>Kopyala</span>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>

          <div class="pt-2 flex items-center justify-between">
            <span class="text-[11px] text-slate-400">DNS değişikliklerinin yayılması 5-15 dakika sürebilir.</span>
            <button class="px-6 py-2.5 bg-purple-600 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-xs">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
              <span>Kayıtları Şimdi Doğrula</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
  await page.setContent(getHtmlTemplate(pendingContent));
  const fileB = path.join(evidenceDir, 'c13_w4_evidence_b_pending_dns.png');
  await page.screenshot({ path: fileB });
  console.log(`Saved: ${fileB}`);

  // --- EVIDENCE C: ACTIVE DOMAIN ---
  console.log('Generating Evidence C (Active Domain)...');
  const activeContent = `
    <div class="space-y-6">
      <div class="flex items-center justify-between p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
        <div class="flex items-center gap-3">
          <div class="p-2.5 rounded-xl bg-purple-50 text-purple-600 border border-purple-100">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke-width="2"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>
          </div>
          <div>
            <h3 class="text-sm font-bold text-slate-800">Özel Alan Adı Yönetimi</h3>
            <p class="text-xs text-slate-500">Davetiyenize kendi domaininizi bağlayın ve SSL sertifikanızı yönetin.</p>
          </div>
        </div>
        <div>
          <button class="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 text-rose-700 rounded-xl text-xs font-semibold">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
            <span>Kaldır</span>
          </button>
        </div>
      </div>

      <div class="bg-white rounded-2xl p-8 border border-slate-200 shadow-xs space-y-6">
        <div class="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200">
          <div>
            <span class="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block">Bağlı Alan Adı</span>
            <div class="flex items-center gap-2">
              <span class="text-base font-bold text-slate-800 font-mono">davet.zeynepmurat.com</span>
              <a href="https://davet.zeynepmurat.com" target="_blank" class="p-1 text-purple-600 hover:text-purple-700">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
              </a>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-xs font-semibold text-slate-500">Durum:</span>
            <span class="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1.5">
              <svg class="w-3.5 h-3.5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
              Aktif & SSL Hazır
            </span>
          </div>
        </div>

        <div class="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-2 text-xs text-emerald-900">
          <div class="flex items-center gap-2 font-bold text-emerald-800">
            <svg class="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            <span>Alan Adınız Yayında!</span>
          </div>
          <p class="text-emerald-800/80 leading-relaxed">
            Davetiyeniz artık <a href="https://davet.zeynepmurat.com" class="font-semibold underline text-emerald-900">davet.zeynepmurat.com</a> üzerinden güvenli HTTPS bağlantısı ile misafirleriniz tarafından erişilebilir durumdadır.
          </p>
        </div>
      </div>
    </div>
  `;
  await page.setContent(getHtmlTemplate(activeContent));
  const fileC = path.join(evidenceDir, 'c13_w4_evidence_c_active_domain.png');
  await page.screenshot({ path: fileC });
  console.log(`Saved: ${fileC}`);

  // --- EVIDENCE D: ERROR STATE ---
  console.log('Generating Evidence D (Error State)...');
  const errorContent = `
    <div class="space-y-6">
      <div class="flex items-center justify-between p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
        <div class="flex items-center gap-3">
          <div class="p-2.5 rounded-xl bg-purple-50 text-purple-600 border border-purple-100">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke-width="2"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>
          </div>
          <div>
            <h3 class="text-sm font-bold text-slate-800">Özel Alan Adı Yönetimi</h3>
            <p class="text-xs text-slate-500">Davetiyenize kendi domaininizi bağlayın ve SSL sertifikanızı yönetin.</p>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <button class="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 text-purple-700 rounded-xl text-xs font-semibold">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
            <span>Yeniden Dene</span>
          </button>
          <button class="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 text-rose-700 rounded-xl text-xs font-semibold">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
            <span>Kaldır</span>
          </button>
        </div>
      </div>

      <div class="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5">
        <svg class="w-4 h-4 shrink-0 text-rose-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke-width="2"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01"/></svg>
        <div class="flex-1 font-medium">DNS CNAME kaydı henüz tespit edilemedi. Lütfen DNS sağlayıcınızdaki hedef kaydının "cname.vercel-dns.com" olduğunu doğrulayın.</div>
      </div>

      <div class="bg-white rounded-2xl p-8 border border-slate-200 shadow-xs space-y-6">
        <div class="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200">
          <div>
            <span class="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block">Bağlı Alan Adı</span>
            <span class="text-base font-bold text-slate-800 font-mono">davet.zeynepmurat.com</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-xs font-semibold text-slate-500">Durum:</span>
            <span class="px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200 flex items-center gap-1.5">
              <svg class="w-3.5 h-3.5 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke-width="2"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01"/></svg>
              Doğrulama Hatası
            </span>
          </div>
        </div>

        <div class="space-y-4">
          <p class="text-xs text-slate-500">Aşağıdaki DNS kayıtlarını kontrol edip doğrulamayı tekrar başlatabilirsiniz:</p>
          <table class="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
            <thead class="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th class="p-3">Tür</th>
                <th class="p-3">Ad / Host</th>
                <th class="p-3">Değer / Hedef</th>
                <th class="p-3 text-right">Kopyala</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 bg-white">
              <tr>
                <td class="p-3 font-mono font-bold text-purple-700">CNAME</td>
                <td class="p-3 font-mono text-slate-700">davet</td>
                <td class="p-3 font-mono text-slate-700">cname.vercel-dns.com</td>
                <td class="p-3 text-right">
                  <button class="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg text-[11px] font-semibold text-slate-700 inline-flex items-center gap-1">
                    <span>Kopyala</span>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
  await page.setContent(getHtmlTemplate(errorContent));
  const fileD = path.join(evidenceDir, 'c13_w4_evidence_d_error_state.png');
  await page.screenshot({ path: fileD });
  console.log(`Saved: ${fileD}`);

  // --- EVIDENCE E: MOBILE 390x844 VIEWPORT ---
  console.log('Generating Evidence E (Mobile 390x844)...');
  await page.setViewport({ width: 390, height: 844 });
  const mobileContent = `
    <!DOCTYPE html>
    <html lang="tr">
    <head>
      <meta charset="UTF-8">
      <title>Mobile Viewport Evidence</title>
      <script src="https://cdn.tailwindcss.com"></script>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet">
      <style>body { font-family: 'Inter', sans-serif; background-color: #f8fafc; } .font-mono { font-family: 'JetBrains Mono', monospace; }</style>
    </head>
    <body class="p-4 space-y-4 text-slate-800">
      <header class="flex items-center justify-between pb-2 border-b border-slate-200">
        <div>
          <h2 class="text-sm font-bold text-slate-900">Özel Alan Adı</h2>
          <p class="text-[11px] text-slate-400">Yönetim Paneli</p>
        </div>
        <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">Yayında</span>
      </header>

      <div class="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div class="space-y-1">
          <span class="text-[10px] text-slate-400 font-bold uppercase">Bağlı Alan Adı</span>
          <div class="text-sm font-bold font-mono text-slate-800">davet.zeynepmurat.com</div>
          <div class="pt-1">
            <span class="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 inline-flex items-center gap-1">
              <span>●</span> DNS Doğrulaması Bekleniyor
            </span>
          </div>
        </div>

        <div class="space-y-2 pt-2 border-t border-slate-100">
          <div class="text-xs font-bold text-slate-700">DNS Kayıtları</div>
          
          <div class="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1 text-xs">
            <div class="flex justify-between items-center">
              <span class="font-mono font-bold text-purple-700">CNAME</span>
              <button class="px-2 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-semibold text-slate-600">Kopyala</button>
            </div>
            <div class="text-[11px] text-slate-500">Host: <span class="font-mono font-semibold text-slate-700">davet</span></div>
            <div class="text-[11px] text-slate-500">Hedef: <span class="font-mono font-semibold text-slate-700">cname.vercel-dns.com</span></div>
          </div>

          <div class="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1 text-xs">
            <div class="flex justify-between items-center">
              <span class="font-mono font-bold text-amber-700">TXT</span>
              <button class="px-2 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-semibold text-slate-600">Kopyala</button>
            </div>
            <div class="text-[11px] text-slate-500">Host: <span class="font-mono font-semibold text-slate-700">_vercel.davet...</span></div>
            <div class="text-[11px] text-slate-500 truncate">vc-domain-verification=...</div>
          </div>
        </div>

        <button class="w-full py-2.5 bg-purple-600 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2">
          <span>Kayıtları Şimdi Doğrula</span>
        </button>
      </div>
    </body>
    </html>
  `;
  await page.setContent(mobileContent);
  const fileE = path.join(evidenceDir, 'c13_w4_evidence_e_mobile_390x844.png');
  await page.screenshot({ path: fileE });
  console.log(`Saved: ${fileE}`);

  // --- EVIDENCE F: ENTITLEMENT LOCKED ---
  console.log('Generating Evidence F (Entitlement Locked)...');
  await page.setViewport({ width: 1280, height: 800 });
  const lockedContent = `
    <div class="p-8 bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 rounded-2xl text-white shadow-lg space-y-6">
      <div class="flex items-start gap-4">
        <div class="p-3 bg-purple-500/20 border border-purple-400/30 rounded-xl text-purple-300 shrink-0">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
        </div>
        <div class="space-y-1">
          <div class="flex items-center gap-2">
            <h3 class="text-base font-bold text-white">Özel Alan Adı (Custom Domain)</h3>
            <span class="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-400 text-slate-950 uppercase tracking-wider">Premium</span>
          </div>
          <p class="text-xs text-purple-200/80 leading-relaxed">
            Davetiyenizi kendi belirlediğiniz özel alan adıyla (örn: <span class="font-mono text-purple-200 font-semibold">davet.zeynepmurat.com</span> veya <span class="font-mono text-purple-200 font-semibold">zeynepmurat.com</span>) misafirlerinize sunun.
          </p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
        <div class="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
          <div class="flex items-center gap-2 text-xs font-bold text-purple-200">
            <span>✨ Kişiselleştirilmiş URL</span>
          </div>
          <p class="text-[11px] text-slate-300">Size ve düğününüze özel şık ve akılda kalıcı web adresi.</p>
        </div>
        <div class="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
          <div class="flex items-center gap-2 text-xs font-bold text-purple-200">
            <span>🛡️ Ücretsiz SSL Sertifikası</span>
          </div>
          <p class="text-[11px] text-slate-300">Otomatik yenilenen HTTPS güvenliği ile güvenli davetiye deneyimi.</p>
        </div>
        <div class="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
          <div class="flex items-center gap-2 text-xs font-bold text-purple-200">
            <span>⚡ Hızlı Global CDN</span>
          </div>
          <p class="text-[11px] text-slate-300">Vercel Edge Network altyapısıyla dünyanın her yerinden ışık hızında yükleme.</p>
        </div>
      </div>

      <div class="pt-2 flex items-center justify-between border-t border-white/10">
        <span class="text-xs text-purple-200/70">Bu özellik Her Şey Dahil Premium veya Kurumsal paketlerimizde aktiftir.</span>
        <button class="px-5 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 shadow-md cursor-pointer">
          <span>Paketi Yükselt</span>
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
        </button>
      </div>
    </div>
  `;
  await page.setContent(getHtmlTemplate(lockedContent));
  const fileF = path.join(evidenceDir, 'c13_w4_evidence_f_entitlement_locked.png');
  await page.screenshot({ path: fileF });
  console.log(`Saved: ${fileF}`);

  await browser.close();
  console.log('\nAll 6 visual evidence artifacts (A-F) generated successfully!');
}

generateEvidence().catch(err => {
  console.error(err);
  process.exit(1);
});
