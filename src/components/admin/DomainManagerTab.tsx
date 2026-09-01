'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Globe,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Trash2,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  Lock,
  ArrowRight,
  Sparkles,
  Info,
} from 'lucide-react';

interface DomainManagerTabProps {
  wedding: {
    id: string;
    slug?: string;
    is_paid?: boolean;
    plan_tier?: string;
    custom_domain?: string | null;
  };
  onRefresh?: () => void;
}

interface DomainVerificationRequirement {
  type: 'TXT' | 'CNAME' | 'A';
  domain: string;
  value: string;
  reason?: string;
}

interface CustomDomainRecord {
  id: string;
  wedding_id: string;
  hostname: string;
  status: 'pending' | 'verifying' | 'active' | 'error' | 'removing';
  ssl_status: 'pending' | 'active' | 'error';
  is_primary: boolean;
  verified_at?: string | null;
  verification_error?: string | null;
  created_at: string;
  updated_at: string;
}

export default function DomainManagerTab({ wedding, onRefresh }: DomainManagerTabProps) {
  const [domainRecord, setDomainRecord] = useState<CustomDomainRecord | null>(null);
  const [verificationRequirements, setVerificationRequirements] = useState<DomainVerificationRequirement[]>([]);
  const [hostnameInput, setHostnameInput] = useState('');
  
  // Loading & State flags
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  
  // Feedback
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Entitlement: Check if custom domain feature is unlocked
  // Paid weddings or premium / corporate tiers are allowed
  const isEntitled = Boolean(wedding.is_paid || (wedding.plan_tier && wedding.plan_tier !== 'standard'));

  /**
   * Fetch current domain record from W3 server API
   */
  const fetchDomainData = useCallback(async () => {
    if (!wedding?.id) return;
    try {
      setLoading(true);
      setErrorMsg(null);

      const res = await fetch(`/api/admin/domain?wedding_id=${encodeURIComponent(wedding.id)}`, {
        method: 'GET',
        headers: { 'Cache-Control': 'no-cache' },
      });

      if (!res.ok) {
        if (res.status === 401) {
          setErrorMsg('Oturum süreniz doldu, lütfen tekrar giriş yapın.');
        } else {
          const errData = await res.json().catch(() => ({}));
          setErrorMsg(errData.error || 'Alan adı bilgileri yüklenemedi.');
        }
        return;
      }

      const data = await res.json();
      const primaryDomain = Array.isArray(data.domains) && data.domains.length > 0 ? data.domains[0] : null;
      setDomainRecord(primaryDomain);

      // Construct default verification requirements if pending
      if (primaryDomain && primaryDomain.status !== 'active') {
        setVerificationRequirements([
          {
            type: 'CNAME',
            domain: primaryDomain.hostname.includes('.') ? primaryDomain.hostname.split('.')[0] : '@',
            value: 'cname.vercel-dns.com',
          },
          {
            type: 'TXT',
            domain: `_vercel.${primaryDomain.hostname}`,
            value: `vc-domain-verification=${primaryDomain.hostname}`,
            reason: 'domain-verification',
          },
        ]);
      } else {
        setVerificationRequirements([]);
      }
    } catch (err: any) {
      setErrorMsg('Bağlantı hatası oluştu.');
    } finally {
      setLoading(false);
    }
  }, [wedding.id]);

  useEffect(() => {
    fetchDomainData();
  }, [fetchDomainData]);

  /**
   * Clipboard Copy handler with temporary feedback
   */
  const copyToClipboard = (text: string, key: string) => {
    if (!navigator?.clipboard) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => {
      setCopiedKey(prev => (prev === key ? null : prev));
    }, 2000);
  };

  /**
   * Form Submit: Add / Connect Custom Domain
   */
  const handleAddDomain = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hostnameInput.trim() || submitting) return;

    setErrorMsg(null);
    setSuccessMsg(null);
    setSubmitting(true);

    try {
      const res = await fetch('/api/admin/domain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          wedding_id: wedding.id,
          hostname: hostnameInput.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || 'Alan adı eklenemedi.');
        return;
      }

      setDomainRecord(data.domain);
      if (Array.isArray(data.verificationRequirements) && data.verificationRequirements.length > 0) {
        setVerificationRequirements(data.verificationRequirements);
      }
      setSuccessMsg('Alan adınız başarıyla kaydedildi! Lütfen aşağıdaki DNS kayıtlarını sağlayıcınıza ekleyin.');
      setHostnameInput('');
      if (onRefresh) onRefresh();
    } catch (err: any) {
      setErrorMsg('Sunucuyla bağlantı kurulamadı.');
    } finally {
      setSubmitting(false);
    }
  };

  /**
   * Trigger DNS / SSL Verification
   */
  const handleVerify = async () => {
    if (!domainRecord || verifying) return;

    setErrorMsg(null);
    setSuccessMsg(null);
    setVerifying(true);

    try {
      const res = await fetch('/api/admin/domain/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          wedding_id: wedding.id,
          hostname: domainRecord.hostname,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || 'Doğrulama başarısız oldu.');
        return;
      }

      setDomainRecord(data.domain);

      if (data.success) {
        setSuccessMsg('Tebrikler! Alan adınız başarıyla doğrulandı ve yayına alındı.');
        setVerificationRequirements([]);
      } else {
        setErrorMsg(data.message || 'DNS kayıtları henüz tespit edilemedi. Lütfen kayıtlarınızı kontrol edip birkaç dakika sonra tekrar deneyin.');
      }
      if (onRefresh) onRefresh();
    } catch (err: any) {
      setErrorMsg('Doğrulama servisine ulaşılamadı.');
    } finally {
      setVerifying(false);
    }
  };

  /**
   * Remove Custom Domain
   */
  const handleRemoveDomain = async () => {
    if (!domainRecord || removing) return;

    setErrorMsg(null);
    setSuccessMsg(null);
    setRemoving(true);

    try {
      const res = await fetch(
        `/api/admin/domain?wedding_id=${encodeURIComponent(wedding.id)}&hostname=${encodeURIComponent(domainRecord.hostname)}`,
        {
          method: 'DELETE',
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || 'Alan adı kaldırılamadı.');
        return;
      }

      setDomainRecord(null);
      setVerificationRequirements([]);
      setShowRemoveModal(false);
      setSuccessMsg('Alan adı başarıyla kaldırıldı.');
      if (onRefresh) onRefresh();
    } catch (err: any) {
      setErrorMsg('Alan adı silinirken bir hata oluştu.');
    } finally {
      setRemoving(false);
    }
  };

  // --- 1. LOADING STATE ---
  if (loading) {
    return (
      <div data-testid="domain-manager-loading" className="p-8 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col items-center justify-center min-h-[320px] text-slate-500 space-y-3">
        <RefreshCw className="w-6 h-6 animate-spin text-purple-600" />
        <span className="text-xs font-semibold text-slate-600">Alan adı durumu kontrol ediliyor...</span>
      </div>
    );
  }

  // --- 2. ENTITLEMENT LOCKED STATE ---
  if (!isEntitled) {
    return (
      <div data-testid="domain-manager-locked" className="p-6 md:p-8 bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 rounded-2xl text-white shadow-lg space-y-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-purple-500/20 border border-purple-400/30 rounded-xl text-purple-300 shrink-0">
            <Lock className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white">Özel Alan Adı (Custom Domain)</h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-400 text-slate-950 uppercase tracking-wider">
                Premium
              </span>
            </div>
            <p className="text-xs text-purple-200/80 leading-relaxed">
              Davetiyenizi kendi belirlediğiniz özel alan adıyla (örn: <span className="font-mono text-purple-200 font-semibold">davet.zeynepmurat.com</span> veya <span className="font-mono text-purple-200 font-semibold">zeynepmurat.com</span>) misafirlerinize sunun.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-purple-200">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Kişiselleştirilmiş URL</span>
            </div>
            <p className="text-[11px] text-slate-300">Size ve düğününüze özel şık ve akılda kalıcı web adresi.</p>
          </div>
          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-purple-200">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Ücretsiz SSL Sertifikası</span>
            </div>
            <p className="text-[11px] text-slate-300">Otomatik yenilenen HTTPS güvenliği ile güvenli davetiye deneyimi.</p>
          </div>
          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-purple-200">
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <span>Hızlı Global CDN</span>
            </div>
            <p className="text-[11px] text-slate-300">Vercel Edge Network altyapısıyla dünyanın her yerinden ışık hızında yükleme.</p>
          </div>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/10">
          <span className="text-xs text-purple-200/70">
            Bu özellik Her Şey Dahil Premium veya Kurumsal paketlerimizde aktiftir.
          </span>
          <a
            href={`/${wedding.slug || wedding.id}/admin?tab=settings`}
            data-testid="upgrade-plan-button"
            className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold rounded-xl text-xs transition flex items-center justify-center gap-2 shadow-md cursor-pointer"
          >
            <span>Paketi Yükselt</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    );
  }

  return (
    <div data-testid="domain-manager-tab" className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600 border border-purple-100 shrink-0">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800">Özel Alan Adı Yönetimi</h3>
            <p className="text-xs text-slate-500">Davetiyenize kendi domaininizi bağlayın ve SSL sertifikanızı yönetin.</p>
          </div>
        </div>

        {domainRecord && (
          <div className="flex items-center gap-2">
            {domainRecord.status !== 'active' && (
              <button
                type="button"
                data-testid="domain-refresh-button"
                onClick={handleVerify}
                disabled={verifying}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-xl text-xs font-semibold transition cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${verifying ? 'animate-spin' : ''}`} />
                <span>{verifying ? 'Kontrol Ediliyor...' : 'Yeniden Doğrula'}</span>
              </button>
            )}
            <button
              type="button"
              data-testid="domain-remove-button"
              onClick={() => setShowRemoveModal(true)}
              disabled={removing || submitting}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-semibold transition cursor-pointer disabled:opacity-50"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Kaldır</span>
            </button>
          </div>
        )}
      </div>

      {/* Notifications */}
      {errorMsg && (
        <div role="alert" data-testid="domain-error-alert" className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
          <div className="flex-1 font-medium">{errorMsg}</div>
        </div>
      )}

      {successMsg && (
        <div role="status" data-testid="domain-success-alert" className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
          <div className="flex-1 font-medium">{successMsg}</div>
        </div>
      )}

      {/* --- 3. EMPTY STATE (NO DOMAIN CONNECTED) --- */}
      {!domainRecord ? (
        <div data-testid="domain-empty-state" className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="max-w-xl space-y-2">
            <h4 className="text-sm font-bold text-slate-800">Davetiyenize Alan Adı Bağlayın</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Kendi satın aldığınız alan adını (<span className="font-mono text-purple-700 font-semibold">zeynepmurat.com</span>) veya bir alt alan adını (<span className="font-mono text-purple-700 font-semibold">davet.zeynepmurat.com</span>) bağlayabilirsiniz.
            </p>
          </div>

          <form onSubmit={handleAddDomain} className="space-y-4 max-w-xl">
            <div className="space-y-1.5">
              <label htmlFor="custom-hostname-input" className="block text-xs font-semibold text-slate-700">
                Kullanmak İstediğiniz Alan Adı
              </label>
              <div className="relative">
                <input
                  id="custom-hostname-input"
                  data-testid="domain-hostname-input"
                  type="text"
                  required
                  placeholder="Örn: davet.zeynepmurat.com"
                  value={hostnameInput}
                  onChange={e => setHostnameInput(e.target.value)}
                  disabled={submitting}
                  className="w-full px-4 py-2.5 text-xs font-medium border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition"
                />
              </div>
              <p className="text-[11px] text-slate-400 flex items-center gap-1">
                <Info className="w-3.5 h-3.5 text-slate-400" />
                <span>Alan adınızı ekledikten sonra DNS sağlayıcınızda tanımlamanız gereken kayıtlar gösterilecektir.</span>
              </p>
            </div>

            <button
              type="submit"
              data-testid="domain-submit-button"
              disabled={submitting || !hostnameInput.trim()}
              className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-xs"
            >
              {submitting ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Alan Adı Ekleniyor...</span>
                </>
              ) : (
                <>
                  <span>Alan Adını Bağla ve DNS Bilgilerini Al</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>
        </div>
      ) : (
        /* --- 4. CONNECTED STATE (PENDING / ACTIVE / ERROR) --- */
        <div data-testid="domain-connected-state" className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-xs space-y-6">
          {/* Domain Status Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="space-y-0.5">
              <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block">Bağlı Alan Adı</span>
              <div className="flex items-center gap-2">
                <span data-testid="connected-hostname" className="text-sm md:text-base font-bold text-slate-800 font-mono">
                  {domainRecord.hostname}
                </span>
                {domainRecord.status === 'active' && (
                  <a
                    href={`https://${domainRecord.hostname}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1 text-purple-600 hover:text-purple-700 transition"
                    title="Yeni sekmede aç"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500">Durum:</span>
              {domainRecord.status === 'active' ? (
                <span data-testid="domain-status-active" className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Aktif & SSL Hazır
                </span>
              ) : domainRecord.status === 'error' ? (
                <span data-testid="domain-status-error" className="px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                  Doğrulama Hatası
                </span>
              ) : (
                <span data-testid="domain-status-pending" className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1.5">
                  <RefreshCw className="w-3.5 h-3.5 text-amber-600" />
                  DNS Doğrulaması Bekleniyor
                </span>
              )}
            </div>
          </div>

          {/* Verification / DNS Table (Shown when pending / error) */}
          {domainRecord.status !== 'active' && (
            <div data-testid="domain-dns-instructions" className="space-y-4">
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-purple-600" />
                  <span>Gerekli DNS Kayıtları</span>
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Alan adınızın yönetim paneline (Cloudflare, GoDaddy, Turhost vb.) giderek aşağıdaki DNS kayıtlarını ekleyin:
                </p>
              </div>

              {/* Desktop & Mobile Responsive DNS Records Table / Cards */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
                  <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-3">Tür</th>
                      <th className="p-3">Ad / Host</th>
                      <th className="p-3">Değer / Hedef</th>
                      <th className="p-3 text-right">Kopyala</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {/* CNAME Record */}
                    <tr data-testid="dns-row-cname">
                      <td className="p-3 font-mono font-bold text-purple-700">CNAME</td>
                      <td className="p-3 font-mono text-slate-700">
                        {domainRecord.hostname.includes('.') ? domainRecord.hostname.split('.')[0] : '@'}
                      </td>
                      <td className="p-3 font-mono text-slate-700">cname.vercel-dns.com</td>
                      <td className="p-3 text-right">
                        <button
                          type="button"
                          data-testid="copy-cname-button"
                          onClick={() => copyToClipboard('cname.vercel-dns.com', 'cname-val')}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg text-[11px] font-semibold text-slate-700 inline-flex items-center gap-1 transition cursor-pointer"
                        >
                          {copiedKey === 'cname-val' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedKey === 'cname-val' ? 'Kopyalandı' : 'Kopyala'}</span>
                        </button>
                      </td>
                    </tr>

                    {/* TXT Challenge Record */}
                    <tr data-testid="dns-row-txt">
                      <td className="p-3 font-mono font-bold text-amber-700">TXT</td>
                      <td className="p-3 font-mono text-slate-700">_vercel.{domainRecord.hostname}</td>
                      <td className="p-3 font-mono text-slate-700 truncate max-w-[180px] md:max-w-none">
                        vc-domain-verification={domainRecord.hostname}
                      </td>
                      <td className="p-3 text-right">
                        <button
                          type="button"
                          data-testid="copy-txt-button"
                          onClick={() => copyToClipboard(`vc-domain-verification=${domainRecord.hostname}`, 'txt-val')}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg text-[11px] font-semibold text-slate-700 inline-flex items-center gap-1 transition cursor-pointer"
                        >
                          {copiedKey === 'txt-val' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedKey === 'txt-val' ? 'Kopyalandı' : 'Kopyala'}</span>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Verify Action Button */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                <span className="text-[11px] text-slate-400">
                  DNS değişikliklerinin küresel olarak yayılması 5-15 dakika sürebilir.
                </span>
                <button
                  type="button"
                  data-testid="domain-verify-button"
                  onClick={handleVerify}
                  disabled={verifying}
                  className="w-full sm:w-auto px-6 py-2.5 bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50 shadow-xs"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${verifying ? 'animate-spin' : ''}`} />
                  <span>{verifying ? 'Doğrulanıyor...' : 'Kayıtları Şimdi Doğrula'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Active Domain Info Box */}
          {domainRecord.status === 'active' && (
            <div data-testid="domain-active-info" className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-2 text-xs text-emerald-900">
              <div className="flex items-center gap-2 font-bold text-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Alan Adınız Yayında!</span>
              </div>
              <p className="text-emerald-800/80 leading-relaxed">
                Davetiyeniz artık <a href={`https://${domainRecord.hostname}`} target="_blank" rel="noopener noreferrer" className="font-semibold underline text-emerald-900">{domainRecord.hostname}</a> üzerinden güvenli HTTPS bağlantısı ile misafirleriniz tarafından erişilebilir durumdadır.
              </p>
            </div>
          )}
        </div>
      )}

      {/* --- 5. REMOVE CONFIRMATION MODAL --- */}
      {showRemoveModal && domainRecord && (
        <div role="dialog" aria-modal="true" data-testid="domain-remove-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-100">
                <AlertCircle className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">Alan Adını Kaldır</h4>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              <span className="font-mono font-bold text-slate-800">{domainRecord.hostname}</span> alan adını davetiyenizden kaldırmak istediğinize emin misiniz? Kaldırıldıktan sonra davetiyeniz bu adres üzerinden açılamayacaktır.
            </p>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                data-testid="modal-cancel-remove"
                onClick={() => setShowRemoveModal(false)}
                disabled={removing}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition cursor-pointer disabled:opacity-50"
              >
                Vazgeç
              </button>
              <button
                type="button"
                data-testid="modal-confirm-remove"
                onClick={handleRemoveDomain}
                disabled={removing}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {removing ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Kaldırılıyor...</span>
                  </>
                ) : (
                  <span>Evet, Kaldır</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
