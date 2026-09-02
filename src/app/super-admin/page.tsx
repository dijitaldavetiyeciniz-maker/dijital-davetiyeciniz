'use client';
import { useState, useEffect, useRef } from 'react';
import { 
  Shield, Users, Mail, AlertTriangle, CheckCircle2, Search, Filter, 
  ExternalLink, Power, Bell, Lock, Activity, Layers, Calendar, 
  Eye, RefreshCw, X, ArrowUpRight, MessageSquare, AlertCircle, 
  Check, ChevronRight, UserCheck, ShieldAlert, Sparkles, Send,
  Globe, Server, BarChart3, Database, KeyRound, Radio, Clock,
  FileText, ShieldCheck, UserX, Trash2, Edit3, Plus, ArrowRight,
  TrendingUp, Compass, Cpu, History
} from 'lucide-react';
import SiteManagementTab from '@/components/super-admin/SiteManagementTab';
import SupportInboxTab from '@/components/super-admin/SupportInboxTab';
import DataCleanupTab from '@/components/super-admin/DataCleanupTab';
import AuditLogViewerTab from '@/components/super-admin/AuditLogViewerTab';
import SystemStatusTab from '@/components/super-admin/SystemStatusTab';

export default function SuperAdminUltimateCommandCenter() {
  // 1. Auth States
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // 2. Navigation & Tabs
  const [activeTab, setActiveTab] = useState<'overview' | 'members' | 'invitations' | 'site_management' | 'support_center' | 'data_cleanup' | 'contacts' | 'analytics' | 'security' | 'system' | 'audit'>('overview');
  const [securitySubTab, setSecuritySubTab] = useState<'verifications' | 'delivery' | 'events'>('verifications');

  // 3. Global Data States
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [invitations, setInvitations] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [verifications, setVerifications] = useState<any[]>([]);
  const [deliveryLogs, setDeliveryLogs] = useState<any[]>([]);
  const [securityEvents, setSecurityEvents] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>({
    maintenance_enabled: false,
    maintenance_scope: 'platform',
    maintenance_message: '',
    announcement_enabled: false,
    announcement_message: '',
    announcement_type: 'info',
    contact_email: 'dijitaldavetiyeciniz@gmail.com',
    contact_phone: '+90 555 000 0000',
    contact_address: 'Levent, Büyükdere Cad. No: 199, Şişli / İstanbul',
    allow_signup: true,
    allow_invitation_creation: true,
    contact_form_enabled: true
  });

  // 4. Global Search States
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');
  const [globalSearchResults, setGlobalSearchResults] = useState<{ users: any[]; invitations: any[] } | null>(null);
  const [isSearchingGlobal, setIsSearchingGlobal] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // 5. Member Drawer & Internal Notes
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [memberNotes, setMemberNotes] = useState<any[]>([]);
  const [newNoteText, setNewNoteText] = useState('');
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [memberActionLoading, setMemberActionLoading] = useState(false);

  // 6. Filtering & Search in Sub-Tabs
  const [memberSearch, setMemberSearch] = useState('');
  const [memberFilter, setMemberFilter] = useState('all');
  const [invitationSearch, setInvitationSearch] = useState('');
  const [invitationFilter, setInvitationFilter] = useState('all');
  const [contactFilter, setContactFilter] = useState('all');
  const [selectedContact, setSelectedContact] = useState<any>(null);
  const [auditFilter, setAuditFilter] = useState('all');
  const [verificationSearch, setVerificationSearch] = useState('');
  const [verificationStatusFilter, setVerificationStatusFilter] = useState('all');

  // 7. Modals & Action Statuses
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
  const [maintenanceForm, setMaintenanceForm] = useState({
    enabled: false,
    scope: 'platform',
    message: ''
  });
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [settingsSuccess, setSettingsSuccess] = useState('');
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Show temporary toast
  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ type, text });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Close global search dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setGlobalSearchResults(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Load All Data
  async function loadAllData() {
    setLoading(true);
    await Promise.all([
      fetchStats(),
      fetchMembers(),
      fetchInvitations(),
      fetchContacts(),
      fetchVerifications(),
      fetchDeliveryLogs(),
      fetchSecurityEvents(),
      fetchAuditLogs(),
      fetchSettings()
    ]);
    setLoading(false);
  }

  async function checkAuth() {
    try {
      const res = await fetch('/api/super-admin/auth');
      const data = await res.json();
      if (data.authenticated) {
        setIsAuthenticated(true);
        loadAllData();
      } else {
        setIsAuthenticated(false);
      }
    } catch {
      setIsAuthenticated(false);
    }
  }

  // Initial Auth Check
  useEffect(() => {
    checkAuth();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');

    try {
      const res = await fetch('/api/super-admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passwordInput })
      });
      const data = await res.json();
      if (data.success) {
        setIsAuthenticated(true);
        setPasswordInput('');
        loadAllData();
      } else {
        setAuthError(data.error || 'Giriş başarısız.');
      }
    } catch {
      setAuthError('Sunucu bağlantı hatası.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/super-admin/logout', { method: 'POST' });
    setIsAuthenticated(false);
  };



  async function fetchStats() {
    try {
      const res = await fetch('/api/super-admin/stats');
      const data = await res.json();
      if (data.success) {
        setStats(data.stats);
        if (data.stats.platformSettings) {
          setSettings(data.stats.platformSettings);
          setMaintenanceForm({
            enabled: data.stats.platformSettings.maintenance_enabled || false,
            scope: data.stats.platformSettings.maintenance_scope || 'platform',
            message: data.stats.platformSettings.maintenance_message || ''
          });
        }
      }
    } catch (e) {
      console.error(e);
    }
  }

  async function fetchMembers() {
    try {
      const res = await fetch(`/api/super-admin/users?filter=${memberFilter}&search=${encodeURIComponent(memberSearch)}`);
      const data = await res.json();
      if (data.success) setMembers(data.users || []);
    } catch (e) {
      console.error(e);
    }
  }

  async function fetchInvitations() {
    try {
      const res = await fetch(`/api/super-admin/invitations?filter=${invitationFilter}&search=${encodeURIComponent(invitationSearch)}`);
      const data = await res.json();
      if (data.success) setInvitations(data.invitations || []);
    } catch (e) {
      console.error(e);
    }
  }

  async function fetchContacts() {
    try {
      const res = await fetch(`/api/super-admin/contacts?filter=${contactFilter}`);
      const data = await res.json();
      if (data.success) setContacts(data.messages || []);
    } catch (e) {
      console.error(e);
    }
  }

  async function fetchVerifications() {
    try {
      const res = await fetch(`/api/super-admin/verifications?status=${verificationStatusFilter}&search=${encodeURIComponent(verificationSearch)}`);
      const data = await res.json();
      if (data.success) setVerifications(data.verifications || []);
    } catch (e) {
      console.error(e);
    }
  }

  async function fetchDeliveryLogs() {
    try {
      const res = await fetch('/api/super-admin/delivery-logs');
      const data = await res.json();
      if (data.success) setDeliveryLogs(data.logs || []);
    } catch (e) {
      console.error(e);
    }
  }

  async function fetchSecurityEvents() {
    try {
      const res = await fetch('/api/super-admin/security-events');
      const data = await res.json();
      if (data.success) setSecurityEvents(data.events || []);
    } catch (e) {
      console.error(e);
    }
  }

  async function fetchAuditLogs() {
    try {
      const res = await fetch(`/api/super-admin/audit-logs?category=${auditFilter}`);
      const data = await res.json();
      if (data.success) setAuditLogs(data.logs || []);
    } catch (e) {
      console.error(e);
    }
  }

  async function fetchSettings() {
    try {
      const res = await fetch('/api/super-admin/settings');
      const data = await res.json();
      if (data.success && data.settings) {
        setSettings(data.settings);
      }
    } catch (e) {
      console.error(e);
    }
  }

  // Global Search Handler
  const handleGlobalSearch = async (val: string) => {
    setGlobalSearchQuery(val);
    if (val.trim().length < 2) {
      setGlobalSearchResults(null);
      return;
    }
    setIsSearchingGlobal(true);
    try {
      const res = await fetch(`/api/super-admin/search?q=${encodeURIComponent(val)}`);
      const data = await res.json();
      if (data.success) {
        setGlobalSearchResults({ users: data.users || [], invitations: data.invitations || [] });
      }
    } catch {
      setGlobalSearchResults(null);
    } finally {
      setIsSearchingGlobal(false);
    }
  };

  // Member Detail & Notes Handlers
  const handleOpenMemberDrawer = async (user: any) => {
    setSelectedMember(user);
    try {
      const res = await fetch(`/api/super-admin/notes?userId=${user.id}`);
      const data = await res.json();
      setMemberNotes(data.notes || []);
    } catch {
      setMemberNotes([]);
    }
  };

  const handleAddMemberNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim() || !selectedMember) return;
    setIsAddingNote(true);
    try {
      const res = await fetch('/api/super-admin/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: selectedMember.id, note: newNoteText.trim() })
      });
      const data = await res.json();
      if (data.success && data.note) {
        setMemberNotes([data.note, ...memberNotes]);
        setNewNoteText('');
        showToast('Dahili not başarıyla kaydedildi.');
      }
    } catch {
      showToast('Not eklenirken hata oluştu.', 'error');
    } finally {
      setIsAddingNote(false);
    }
  };

  const handleResendOtpForMember = async (email: string) => {
    if (!confirm(`${email} adresine yeni 6 haneli doğrulama kodu gönderilsin mi?`)) return;
    setMemberActionLoading(true);
    try {
      const res = await fetch('/api/super-admin/verifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message || 'Yeni doğrulama kodu gönderildi.');
        fetchVerifications();
        fetchAuditLogs();
        fetchSecurityEvents();
      } else {
        showToast(data.error || 'Kod gönderilemedi.', 'error');
      }
    } catch {
      showToast('İşlem başarısız.', 'error');
    } finally {
      setMemberActionLoading(false);
    }
  };

  const handleToggleUserSuspension = async (userId: string, currentStatus: boolean, email: string) => {
    const actionText = currentStatus ? 'askıdan indirmek' : 'askıya almak';
    if (!confirm(`${email} kullanıcısını ${actionText} istediğinize emin misiniz?`)) return;

    const res = await fetch('/api/super-admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, action: 'toggle_suspend', isSuspended: !currentStatus })
    });

    if (res.ok) {
      showToast(`Kullanıcı başarıyla ${currentStatus ? 'aktifleştirildi' : 'askıya alındı'}.`);
      fetchMembers();
      fetchAuditLogs();
      if (selectedMember && selectedMember.id === userId) {
        setSelectedMember({ ...selectedMember, is_suspended: !currentStatus });
      }
    }
  };

  // Invitation Actions
  const handleToggleInvitationStatus = async (id: string, currentStatus: boolean) => {
    const res = await fetch('/api/super-admin/invitations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, action: 'toggle_publish', is_paid: !currentStatus })
    });
    if (res.ok) {
      showToast(`Davetiye yayını ${!currentStatus ? 'açıldı' : 'kapatıldı'}.`);
      fetchInvitations();
      fetchStats();
      fetchAuditLogs();
    }
  };

  const handleDeleteInvitation = async (id: string, name: string) => {
    if (!confirm(`"${name}" davetiyesini silmek istediğinize emin misiniz?`)) return;
    const res = await fetch('/api/super-admin/invitations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, action: 'delete' })
    });
    if (res.ok) {
      showToast('Davetiye başarıyla silindi.');
      fetchInvitations();
      fetchStats();
      fetchAuditLogs();
    }
  };

  // Contact Message Status Update
  const handleContactStatus = async (id: string, status: string) => {
    const res = await fetch('/api/super-admin/contacts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, action: 'set_status', status })
    });
    if (res.ok) {
      showToast(`Mesaj durumu '${status}' olarak güncellendi.`);
      fetchContacts();
      fetchStats();
      if (selectedContact && selectedContact.id === id) {
        setSelectedContact({ ...selectedContact, status });
      }
    }
  };

  // Save Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsSaving(true);
    setSettingsSuccess('');

    try {
      const res = await fetch('/api/super-admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      const data = await res.json();
      if (data.success) {
        setSettingsSuccess('Platform ayarları başarıyla kaydedildi.');
        showToast('Platform ayarları güncellendi.');
        fetchStats();
        fetchAuditLogs();
        setTimeout(() => setSettingsSuccess(''), 3500);
      }
    } catch {
      showToast('Ayarlar kaydedilirken hata oluştu.', 'error');
    } finally {
      setSettingsSaving(false);
    }
  };

  // Maintenance Modal Apply
  const handleApplyMaintenance = async () => {
    setSettingsSaving(true);
    const updatedSettings = {
      ...settings,
      maintenance_enabled: maintenanceForm.enabled,
      maintenance_scope: maintenanceForm.scope,
      maintenance_message: maintenanceForm.message
    };

    const res = await fetch('/api/super-admin/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedSettings)
    });

    if (res.ok) {
      setSettings(updatedSettings);
      setShowMaintenanceModal(false);
      showToast(maintenanceForm.enabled ? 'Bakım modu AKTİFLEŞTİRİLDİ.' : 'Bakım modu KAPATILDI.');
      fetchStats();
      fetchAuditLogs();
    }
    setSettingsSaving(false);
  };

  // Format Date Helper
  const formatDateDeterministic = (dateStr: string | null | undefined) => {
    if (!dateStr) return '-';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return '-';
      const months = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];
      const day = String(d.getDate()).padStart(2, '0');
      const month = months[d.getMonth()];
      const year = d.getFullYear();
      const hours = String(d.getHours()).padStart(2, '0');
      const mins = String(d.getMinutes()).padStart(2, '0');
      return `${day} ${month} ${year} • ${hours}:${mins}`;
    } catch {
      return '-';
    }
  };

  // ==========================================
  // LOGIN SCREEN
  // ==========================================
  if (isAuthenticated === false) {
    return (
      <div className="min-h-screen bg-[#07070f] flex items-center justify-center p-4 relative overflow-hidden font-sans selection:bg-rose-500/30">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-rose-500/10 rounded-full mix-blend-screen filter blur-[150px] opacity-40 animate-pulse pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-indigo-500/10 rounded-full mix-blend-screen filter blur-[120px] opacity-30 pointer-events-none" />

        <div className="bg-[#0f111e]/80 backdrop-blur-2xl rounded-3xl shadow-2xl w-full max-w-md p-8 sm:p-10 text-center border border-white/10 relative z-10">
          <div className="w-16 h-16 bg-gradient-to-br from-rose-500 via-pink-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 text-white shadow-lg shadow-rose-500/25">
            <Shield className="w-8 h-8" />
          </div>

          <div className="inline-flex items-center gap-2 bg-rose-500/10 border border-rose-500/20 text-rose-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
            Super Admin Command Center
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-2 font-serif">
            Operasyon Merkezi
          </h1>
          <p className="text-slate-400 mb-8 text-xs leading-relaxed">
            Platform yönetim konsoluna erişmek için Super Admin şifrenizi girin.
          </p>

          {authError && (
            <div className="mb-6 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
              {authError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="password" 
                required
                value={passwordInput}
                onChange={e => setPasswordInput(e.target.value)}
                placeholder="Admin Şifresi"
                className="w-full pl-11 pr-4 py-3.5 border border-white/10 rounded-xl text-center text-lg tracking-[0.2em] bg-white/5 text-white placeholder:text-slate-500 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 focus:outline-none transition-all backdrop-blur-sm"
                autoFocus
              />
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full bg-gradient-to-r from-rose-500 via-pink-600 to-indigo-600 hover:opacity-95 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-rose-500/25 transition-all text-sm disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
            >
              {authLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Yönetim Merkezine Giriş Yap</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-[11px] text-slate-400">
            🔒 Uçtan uca şifreli oturum ve server-side yetkilendirme aktiftir.
          </p>
        </div>
      </div>
    );
  }

  // Loading Screen
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-[#07070f] flex items-center justify-center text-slate-400 font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs uppercase tracking-widest font-semibold">Operasyon Merkezi Yükleniyor...</span>
        </div>
      </div>
    );
  }

  const isMaintenanceActive = settings?.maintenance_enabled || false;

  // ==========================================
  // COMMAND CENTER DASHBOARD
  // ==========================================
  return (
    <div className="min-h-screen bg-[#07070f] text-slate-200 font-sans selection:bg-rose-500/30 relative overflow-x-hidden">
      {/* Background Ambient Glows */}
      <div className="fixed top-0 right-0 w-[800px] h-[800px] bg-rose-500/5 rounded-full mix-blend-screen filter blur-[180px] pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[700px] h-[700px] bg-indigo-500/5 rounded-full mix-blend-screen filter blur-[180px] pointer-events-none" />

      {/* Toast Notification */}
      {toastMessage && (
        <div className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border text-xs font-semibold backdrop-blur-xl animate-fade-in ${
          toastMessage.type === 'success' ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300' : 'bg-rose-500/20 border-rose-500/30 text-rose-300'
        }`}>
          {toastMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-rose-400" />}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Header Bar */}
      <header className="sticky top-0 z-40 bg-[#0f111e]/90 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          {/* Brand Logo & Title */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 bg-gradient-to-br from-rose-500 via-pink-600 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-rose-500/20">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white tracking-wide text-sm font-serif">Super Admin</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 font-mono font-bold">
                  COMMAND CENTER v2
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium">Platform Operasyon & Yönetim Merkezi</p>
            </div>
          </div>

          {/* Global Search Bar */}
          <div ref={searchRef} className="relative flex-1 max-w-md hidden md:block">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={globalSearchQuery}
                onChange={e => handleGlobalSearch(e.target.value)}
                placeholder="Global Arama (Üye adı, E-posta, Telefon, Davetiye Slug)..."
                className="w-full pl-10 pr-8 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder:text-slate-500 focus:border-rose-500 focus:outline-none transition-all"
              />
              {isSearchingGlobal && (
                <div className="w-3.5 h-3.5 border-2 border-rose-500 border-t-transparent rounded-full animate-spin absolute right-3 top-1/2 -translate-y-1/2" />
              )}
            </div>

            {/* Global Search Dropdown Results */}
            {globalSearchResults && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-[#121422] border border-white/15 rounded-2xl shadow-2xl overflow-hidden z-50 max-h-96 overflow-y-auto">
                {globalSearchResults.users.length === 0 && globalSearchResults.invitations.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-400">Eşleşen sonuç bulunamadı.</div>
                ) : (
                  <div className="p-2 space-y-3">
                    {globalSearchResults.users.length > 0 && (
                      <div>
                        <div className="text-[10px] uppercase font-bold text-slate-400 px-3 py-1">Üyeler ({globalSearchResults.users.length})</div>
                        {globalSearchResults.users.map(u => (
                          <div 
                            key={u.id}
                            onClick={() => {
                              handleOpenMemberDrawer(u);
                              setGlobalSearchResults(null);
                              setActiveTab('members');
                            }}
                            className="p-2.5 rounded-xl hover:bg-white/5 cursor-pointer flex items-center justify-between text-xs transition-colors"
                          >
                            <div>
                              <div className="font-semibold text-white">{u.name}</div>
                              <div className="text-[11px] text-slate-400">{u.email} • {u.phone || u.city || 'Konum yok'}</div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-slate-500" />
                          </div>
                        ))}
                      </div>
                    )}

                    {globalSearchResults.invitations.length > 0 && (
                      <div>
                        <div className="text-[10px] uppercase font-bold text-slate-400 px-3 py-1">Davetiyeler ({globalSearchResults.invitations.length})</div>
                        {globalSearchResults.invitations.map(w => (
                          <a 
                            key={w.id}
                            href={`/${w.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2.5 rounded-xl hover:bg-white/5 cursor-pointer flex items-center justify-between text-xs transition-colors block"
                          >
                            <div>
                              <div className="font-semibold text-rose-300">{w.title} <span className="text-[10px] text-slate-400 font-mono">/{w.slug}</span></div>
                              <div className="text-[11px] text-slate-400">{w.event_type} • {w.email || 'Misafir'} • {w.is_paid ? '🟢 Yayında' : '⚪ Taslak'}</div>
                            </div>
                            <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Status & Actions */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Live / Maintenance Status Badge */}
            <button
              onClick={() => setShowMaintenanceModal(true)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                isMaintenanceActive
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-300 hover:bg-amber-500/20'
                  : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isMaintenanceActive ? 'bg-amber-400 animate-ping' : 'bg-emerald-400 animate-pulse'}`} />
              <span>{isMaintenanceActive ? 'Bakım Modu Aktif' : 'Sistem Canlı'}</span>
            </button>

            {/* Refresh */}
            <button
              onClick={loadAllData}
              disabled={loading}
              title="Verileri Yenile"
              className="p-2 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 text-slate-300 transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-rose-400' : ''}`} />
            </button>

            {/* Logout */}
            <button
              onClick={handleLogout}
              title="Çıkış Yap"
              className="p-2 bg-rose-500/10 hover:bg-rose-500/20 rounded-xl border border-rose-500/20 text-rose-400 transition-all cursor-pointer"
            >
              <Power className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Executive Tabs Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-1 overflow-x-auto scrollbar-none py-1 border-t border-white/5">
          {[
            { id: 'overview', label: 'Genel Bakış', icon: Activity },
            { id: 'members', label: 'Üyeler', icon: Users, badge: stats?.totalMembers },
            { id: 'invitations', label: 'Davetiyeler', icon: Layers, badge: stats?.totalInvitations },
            { id: 'site_management', label: 'Site Yönetimi & CMS', icon: Globe },
            { id: 'support_center', label: 'Destek Merkezi', icon: MessageSquare, badge: stats?.unreadMessages, highlightBadge: stats?.unreadMessages > 0 },
            { id: 'data_cleanup', label: 'Veri Temizliği', icon: ShieldAlert },
            { id: 'analytics', label: 'Analitik', icon: BarChart3 },
            { id: 'security', label: 'Güvenlik', icon: ShieldCheck, badge: stats?.pendingVerifications, highlightBadge: stats?.pendingVerifications > 0 },
            { id: 'system', label: 'Sistem Durumu', icon: Server },
            { id: 'audit', label: 'Denetim Kayıtları', icon: History }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-rose-500/20 to-pink-500/20 text-rose-300 border border-rose-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-rose-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {typeof tab.badge === 'number' && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                    tab.highlightBadge ? 'bg-rose-500 text-white animate-pulse' : 'bg-white/10 text-slate-300'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        {/* ========================================================================= */}
        {/* TAB 1: OVERVIEW & OPERATIONS DASHBOARD */}
        {/* ========================================================================= */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fade-in">
            {/* Top KPI Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Total Members */}
              <div className="p-5 rounded-2xl bg-[#0f111e]/90 border border-white/10 backdrop-blur-xl relative overflow-hidden">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Toplam Üye</span>
                  <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                    <Users className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold text-white font-mono mb-2">
                  {stats?.totalMembers || 0}
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-400">
                  <span className="text-emerald-400 font-semibold">+{stats?.todayMembers || 0} Bugün</span>
                  <span>•</span>
                  <span>+{stats?.last30DaysMembers || 0} Son 30 Gün</span>
                </div>
              </div>

              {/* Total Invitations */}
              <div className="p-5 rounded-2xl bg-[#0f111e]/90 border border-white/10 backdrop-blur-xl relative overflow-hidden">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Toplam Davetiye</span>
                  <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center">
                    <Layers className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold text-white font-mono mb-2">
                  {stats?.totalInvitations || 0}
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-400">
                  <span className="text-emerald-400 font-semibold">{stats?.publishedInvitations || 0} Yayında</span>
                  <span>•</span>
                  <span className="text-slate-400">{stats?.draftInvitations || 0} Taslak</span>
                </div>
              </div>

              {/* Email Verifications */}
              <div className="p-5 rounded-2xl bg-[#0f111e]/90 border border-white/10 backdrop-blur-xl relative overflow-hidden">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">E-posta Doğrulama</span>
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold text-white font-mono mb-2">
                  {stats?.verifiedMembers || 0}
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-400">
                  <span className="text-amber-400 font-semibold">{stats?.pendingVerifications || 0} Bekleyen</span>
                  <span>•</span>
                  <span className="text-slate-400">%{stats?.totalMembers ? Math.round(((stats.verifiedMembers || 0) / stats.totalMembers) * 100) : 100} Oran</span>
                </div>
              </div>

              {/* Contact Messages */}
              <div className="p-5 rounded-2xl bg-[#0f111e]/90 border border-white/10 backdrop-blur-xl relative overflow-hidden">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">İletişim & Destek</span>
                  <div className="w-8 h-8 rounded-xl bg-pink-500/10 text-pink-400 flex items-center justify-center">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold text-white font-mono mb-2">
                  {stats?.unreadMessages || 0}
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-400">
                  <span className="text-rose-400 font-semibold">{stats?.unreadMessages || 0} Okunmamış</span>
                  <span>•</span>
                  <span>{stats?.totalMessages || 0} Toplam Mesaj</span>
                </div>
              </div>
            </div>

            {/* Platform Health & Quick Operations Bar */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Platform Health Card */}
              <div className="p-6 rounded-2xl bg-[#0f111e]/90 border border-white/10 backdrop-blur-xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-400" />
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">Platform Sağlık Durumu</h3>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-mono font-bold bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                    OPERATIONAL
                  </span>
                </div>
                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between p-2.5 bg-white/5 rounded-xl">
                    <span className="text-slate-300">Veritabanı & API (Supabase)</span>
                    <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Aktif
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 bg-white/5 rounded-xl">
                    <span className="text-slate-300">E-posta Servisi (dijitaldavetiyeniz@gmail.com)</span>
                    <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" /> Hazır
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 bg-white/5 rounded-xl">
                    <span className="text-slate-300">Bakım Modu Kapsamı</span>
                    <span className="text-slate-400 font-mono">
                      {settings?.maintenance_enabled ? `Aktif (${settings?.maintenance_scope})` : 'Kapalı (Tüm Sistem Canlı)'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 bg-white/5 rounded-xl">
                    <span className="text-slate-300">Yeni Üye & Davetiye Alımı</span>
                    <span className="text-slate-400 font-mono">
                      {settings?.allow_signup && settings?.allow_invitation_creation ? 'Açık' : 'Kısmi Kısıtlı'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Actions Card */}
              <div className="p-6 rounded-2xl bg-[#0f111e]/90 border border-white/10 backdrop-blur-xl lg:col-span-2">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-rose-400" />
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">Hızlı Operasyon Eylemleri</h3>
                  </div>
                  <span className="text-[10px] text-slate-400">Komuta Kısayolları</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <button
                    onClick={() => setShowMaintenanceModal(true)}
                    className="p-3.5 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 text-left transition-all cursor-pointer group"
                  >
                    <Power className="w-5 h-5 text-amber-400 mb-2 group-hover:scale-110 transition-transform" />
                    <div className="text-xs font-bold text-white">Bakım Modu</div>
                    <div className="text-[10px] text-slate-400">Kapsam & Mesaj</div>
                  </button>

                  <button
                    onClick={() => { setActiveTab('security'); setSecuritySubTab('verifications'); }}
                    className="p-3.5 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 text-left transition-all cursor-pointer group"
                  >
                    <ShieldCheck className="w-5 h-5 text-emerald-400 mb-2 group-hover:scale-110 transition-transform" />
                    <div className="text-xs font-bold text-white">Doğrulamalar</div>
                    <div className="text-[10px] text-slate-400">OTP İstihbaratı</div>
                  </button>

                  <button
                    onClick={() => setActiveTab('contacts')}
                    className="p-3.5 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 text-left transition-all cursor-pointer group"
                  >
                    <MessageSquare className="w-5 h-5 text-pink-400 mb-2 group-hover:scale-110 transition-transform" />
                    <div className="text-xs font-bold text-white">Gelen Mesajlar</div>
                    <div className="text-[10px] text-slate-400">{stats?.unreadMessages || 0} okunmamış</div>
                  </button>

                  <button
                    onClick={() => setActiveTab('system')}
                    className="p-3.5 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 text-left transition-all cursor-pointer group"
                  >
                    <Bell className="w-5 h-5 text-indigo-400 mb-2 group-hover:scale-110 transition-transform" />
                    <div className="text-xs font-bold text-white">Duyuru Bandı</div>
                    <div className="text-[10px] text-slate-400">Platform Ayarları</div>
                  </button>
                </div>
              </div>
            </div>

            {/* Recent Activity Feed & Event Type Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Real Recent Activity Feed */}
              <div className="p-6 rounded-2xl bg-[#0f111e]/90 border border-white/10 backdrop-blur-xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <History className="w-4 h-4 text-indigo-400" />
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">Son Platform Hareketleri</h3>
                  </div>
                  <span className="text-[10px] text-slate-400">Gerçek Zamanlı</span>
                </div>
                <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                  {stats?.recentActivities && stats.recentActivities.length > 0 ? (
                    stats.recentActivities.map((act: any) => (
                      <div key={act.id} className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-start justify-between gap-3 text-xs">
                        <div>
                          <div className="font-semibold text-slate-200">{act.title}</div>
                          <div className="text-slate-400 text-[11px]">{act.description}</div>
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono shrink-0">
                          {formatDateDeterministic(act.timestamp)}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-xs text-slate-500">Henüz kaydedilmiş hareket yok.</div>
                  )}
                </div>
              </div>

              {/* Event Type & Top Templates Distribution */}
              <div className="p-6 rounded-2xl bg-[#0f111e]/90 border border-white/10 backdrop-blur-xl space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-pink-400" />
                    Etkinlik Türü Dağılımı
                  </h3>
                  <div className="space-y-2 text-xs">
                    {stats?.eventTypeDistribution && Object.keys(stats.eventTypeDistribution).length > 0 ? (
                      Object.entries(stats.eventTypeDistribution).map(([type, count]: any) => (
                        <div key={type} className="flex items-center justify-between p-2 bg-white/5 rounded-xl">
                          <span className="text-slate-300 font-medium">{type}</span>
                          <span className="text-rose-400 font-mono font-bold">{count} Davetiye</span>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-3 text-xs text-slate-500">Veri bulunamadı.</div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    En Çok Tercih Edilen Şablonlar
                  </h3>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {stats?.topTemplates && stats.topTemplates.length > 0 ? (
                      stats.topTemplates.map((tpl: any) => (
                        <div key={tpl.id} className="p-2.5 bg-white/5 rounded-xl flex items-center justify-between border border-white/5">
                          <span className="text-slate-300 font-mono font-semibold">{tpl.id}</span>
                          <span className="text-emerald-400 font-bold font-mono">{tpl.count}</span>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-2 text-center py-2 text-xs text-slate-500">Şablon verisi yok.</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: MEMBERS & MEMBER INTELLIGENCE */}
        {/* ========================================================================= */}
        {activeTab === 'members' && (
          <div className="space-y-6 animate-fade-in">
            {/* Header & Filters */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-white font-serif">Platform Üye İstihbaratı</h2>
                <p className="text-xs text-slate-400">Tüm kayıtlı üyelerin iletişim bilgileri, davetiyeleri ve doğrulama durumları.</p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={memberSearch}
                    onChange={e => setMemberSearch(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && fetchMembers()}
                    placeholder="Üye adı, e-posta, tel ara..."
                    className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder:text-slate-500 focus:border-rose-500 focus:outline-none"
                  />
                </div>

                <select
                  value={memberFilter}
                  onChange={e => { setMemberFilter(e.target.value); }}
                  className="py-2 px-3 bg-[#141424] border border-white/10 rounded-xl text-xs text-slate-300 focus:border-rose-500 focus:outline-none cursor-pointer"
                >
                  <option value="all">Tüm Üyeler ({members.length})</option>
                  <option value="with_invitations">Davetiyesi Olanlar</option>
                  <option value="published_only">Yayında Davetiyesi Olanlar</option>
                  <option value="suspended">Askıya Alınanlar</option>
                </select>

                <button
                  onClick={fetchMembers}
                  className="px-3.5 py-2 bg-white/10 hover:bg-white/15 rounded-xl text-xs font-semibold text-white transition-all cursor-pointer"
                >
                  Filtrele
                </button>
              </div>
            </div>

            {/* Members Table */}
            <div className="bg-[#0f111e]/90 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-white/5 border-b border-white/10 text-slate-400 uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="py-3.5 px-4 font-semibold">Üye Bilgisi</th>
                      <th className="py-3.5 px-4 font-semibold">İletişim & Konum</th>
                      <th className="py-3.5 px-4 font-semibold">E-posta Durumu</th>
                      <th className="py-3.5 px-4 font-semibold">Üyelik Tarihi & Saati</th>
                      <th className="py-3.5 px-4 font-semibold text-center">Davetiyeler</th>
                      <th className="py-3.5 px-4 font-semibold text-right">Eylemler</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {members.length > 0 ? (
                      members.map((u: any) => (
                        <tr key={u.id} className="hover:bg-white/5 transition-colors">
                          {/* Name & ID */}
                          <td className="py-3.5 px-4">
                            <div className="font-semibold text-white flex items-center gap-2">
                              <span>{u.name}</span>
                              {u.is_suspended && (
                                <span className="text-[10px] px-1.5 py-0.2 bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-full font-bold">
                                  Askıda
                                </span>
                              )}
                            </div>
                            <div className="text-slate-400 text-[11px] font-mono">{u.email}</div>
                          </td>

                          {/* Contact & Location */}
                          <td className="py-3.5 px-4">
                            <div className="text-slate-300">{u.phone || '-'}</div>
                            <div className="text-slate-500 text-[11px]">{u.city || u.country || 'Konum belirtilmedi'}</div>
                          </td>

                          {/* Email Status */}
                          <td className="py-3.5 px-4">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                              u.is_email_verified
                                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                                : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                            }`}>
                              {u.is_email_verified ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                              <span>{u.is_email_verified ? 'Doğrulandı' : 'Bekliyor'}</span>
                            </span>
                          </td>

                          {/* Membership Deterministic Timestamp */}
                          <td className="py-3.5 px-4 font-mono text-slate-300">
                            {formatDateDeterministic(u.created_at)}
                          </td>

                          {/* Invitation counts */}
                          <td className="py-3.5 px-4 text-center font-mono">
                            <span className="font-bold text-white">{u.totalInvitations}</span>
                            <span className="text-slate-500 text-[10px] ml-1.5">
                              (<strong className="text-emerald-400">{u.publishedInvitations}</strong> yayında)
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="py-3.5 px-4 text-right space-x-2">
                            <button
                              onClick={() => handleOpenMemberDrawer(u)}
                              className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 rounded-xl text-xs font-semibold border border-rose-500/20 transition-all cursor-pointer"
                            >
                              Detay
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="text-center py-10 text-slate-500 text-xs">
                          Arama kriterlerine uygun üye bulunamadı.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: INVITATIONS MANAGEMENT */}
        {/* ========================================================================= */}
        {activeTab === 'invitations' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-white font-serif">Platform Davetiyeleri</h2>
                <p className="text-xs text-slate-400">Oluşturulan tüm davetiyelerin yayın durumu, şablon ve erişim yönetimi.</p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={invitationSearch}
                    onChange={e => setInvitationSearch(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && fetchInvitations()}
                    placeholder="Davetiye adı, slug, sahip..."
                    className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder:text-slate-500 focus:border-rose-500 focus:outline-none"
                  />
                </div>

                <select
                  value={invitationFilter}
                  onChange={e => setInvitationFilter(e.target.value)}
                  className="py-2 px-3 bg-[#141424] border border-white/10 rounded-xl text-xs text-slate-300 focus:border-rose-500 focus:outline-none cursor-pointer"
                >
                  <option value="all">Tüm Davetiyeler ({invitations.length})</option>
                  <option value="published">Sadece Yayında</option>
                  <option value="draft">Sadece Taslak</option>
                </select>

                <button
                  onClick={fetchInvitations}
                  className="px-3.5 py-2 bg-white/10 hover:bg-white/15 rounded-xl text-xs font-semibold text-white transition-all cursor-pointer"
                >
                  Filtrele
                </button>
              </div>
            </div>

            <div className="bg-[#0f111e]/90 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-white/5 border-b border-white/10 text-slate-400 uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="py-3.5 px-4 font-semibold">Davetiye Başlığı / Slug</th>
                      <th className="py-3.5 px-4 font-semibold">Davetiye Sahibi</th>
                      <th className="py-3.5 px-4 font-semibold">Tür & Şablon</th>
                      <th className="py-3.5 px-4 font-semibold">Yayın Durumu</th>
                      <th className="py-3.5 px-4 font-semibold">Oluşturulma</th>
                      <th className="py-3.5 px-4 font-semibold text-right">Eylemler</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {invitations.length > 0 ? (
                      invitations.map((inv: any) => (
                        <tr key={inv.id} className="hover:bg-white/5 transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="font-semibold text-white">{inv.title}</div>
                            <a 
                              href={`/${inv.slug}`} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-rose-400 hover:underline text-[11px] font-mono inline-flex items-center gap-1"
                            >
                              <span>/{inv.slug}</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </td>

                          <td className="py-3.5 px-4 text-slate-300">
                            {inv.ownerEmail || 'Misafir / Anonim'}
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="text-slate-200 font-medium">{inv.event_type || 'Düğün'}</div>
                            <div className="text-slate-500 text-[10px] font-mono">{inv.template_id || 'template1'}</div>
                          </td>

                          <td className="py-3.5 px-4">
                            <button
                              onClick={() => handleToggleInvitationStatus(inv.id, inv.is_paid)}
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border transition-all cursor-pointer ${
                                inv.is_paid
                                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                                  : 'bg-slate-500/10 border-slate-500/30 text-slate-400 hover:bg-slate-500/20'
                              }`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full ${inv.is_paid ? 'bg-emerald-400' : 'bg-slate-500'}`} />
                              <span>{inv.is_paid ? 'Yayında' : 'Taslak'}</span>
                            </button>
                          </td>

                          <td className="py-3.5 px-4 font-mono text-slate-400 text-[11px]">
                            {formatDateDeterministic(inv.created_at)}
                          </td>

                          <td className="py-3.5 px-4 text-right space-x-2">
                            <a
                              href={`/${inv.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-2.5 py-1.5 bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl text-xs font-semibold inline-flex items-center gap-1 border border-white/10"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Önizle</span>
                            </a>
                            <button
                              onClick={() => handleDeleteInvitation(inv.id, inv.title)}
                              className="px-2.5 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-xl text-xs font-semibold border border-rose-500/20 transition-all cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="text-center py-10 text-slate-500 text-xs">
                          Henüz davetiye kaydı bulunmuyor.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: CONTACTS & INBOX */}
        {/* ========================================================================= */}
        {activeTab === 'contacts' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
            {/* Left: Message List */}
            <div className="lg:col-span-1 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-white font-serif">Gelen Mesajlar</h2>
                  <p className="text-xs text-slate-400">{contacts.length} mesaj listeleniyor</p>
                </div>
                <select
                  value={contactFilter}
                  onChange={e => setContactFilter(e.target.value)}
                  className="py-1 px-2.5 bg-[#141424] border border-white/10 rounded-xl text-xs text-slate-300 focus:outline-none cursor-pointer"
                >
                  <option value="all">Tümü</option>
                  <option value="new">Okunmamış</option>
                  <option value="read">Okunmuş</option>
                  <option value="archived">Arşiv</option>
                </select>
              </div>

              <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
                {contacts.length > 0 ? (
                  contacts.map((msg: any) => (
                    <div
                      key={msg.id}
                      onClick={() => {
                        setSelectedContact(msg);
                        if (msg.status === 'new') handleContactStatus(msg.id, 'read');
                      }}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                        selectedContact?.id === msg.id
                          ? 'bg-rose-500/10 border-rose-500/30 shadow-md'
                          : msg.status === 'new'
                          ? 'bg-[#141424] border-white/15'
                          : 'bg-[#0f111e]/60 border-white/5 text-slate-400'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-semibold text-xs text-white flex items-center gap-2">
                          {msg.status === 'new' && <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />}
                          <span>{msg.name}</span>
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">{formatDateDeterministic(msg.created_at)}</span>
                      </div>
                      <div className="text-xs text-slate-300 font-medium truncate">{msg.subject || 'Konu Yok'}</div>
                      <div className="text-[11px] text-slate-400 line-clamp-2 mt-1">{msg.message}</div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-slate-500 text-xs">Gelen mesaj kutusu boş.</div>
                )}
              </div>
            </div>

            {/* Right: Message Detail Viewer */}
            <div className="lg:col-span-2 bg-[#0f111e]/90 border border-white/10 rounded-2xl p-6 backdrop-blur-xl flex flex-col justify-between">
              {selectedContact ? (
                <div className="space-y-6">
                  <div className="flex items-start justify-between border-b border-white/10 pb-4">
                    <div>
                      <h3 className="text-lg font-bold text-white font-serif">{selectedContact.subject || 'Konu Belirtilmemiş'}</h3>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1">
                        <span>Gönderen: <strong className="text-slate-200">{selectedContact.name}</strong></span>
                        <span>•</span>
                        <a href={`mailto:${selectedContact.email}`} className="text-rose-400 hover:underline">{selectedContact.email}</a>
                        {selectedContact.phone && (
                          <>
                            <span>•</span>
                            <span className="text-slate-300">{selectedContact.phone}</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {selectedContact.status !== 'archived' ? (
                        <button
                          onClick={() => handleContactStatus(selectedContact.id, 'archived')}
                          className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 rounded-xl text-xs font-semibold cursor-pointer"
                        >
                          Arşivle
                        </button>
                      ) : (
                        <button
                          onClick={() => handleContactStatus(selectedContact.id, 'read')}
                          className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 rounded-xl text-xs font-semibold cursor-pointer"
                        >
                          Gelen Kutusuna Taşı
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="bg-white/5 p-5 rounded-2xl border border-white/5 text-slate-200 text-sm leading-relaxed whitespace-pre-wrap">
                    {selectedContact.message}
                  </div>

                  <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                    <span className="text-xs text-slate-500">Tarih: {formatDateDeterministic(selectedContact.created_at)}</span>
                    <a
                      href={`mailto:${selectedContact.email}?subject=Re: ${encodeURIComponent(selectedContact.subject || 'Dijital Davetiyeniz Destek')}`}
                      className="px-4 py-2 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white rounded-xl text-xs font-bold inline-flex items-center gap-2 shadow-lg shadow-rose-500/20"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>E-posta ile Yanıtla</span>
                    </a>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-24 text-slate-500 text-center">
                  <Mail className="w-12 h-12 mb-3 stroke-1 text-slate-600" />
                  <p className="text-sm">Görüntülemek için sol listeden bir mesaj seçin.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: ANALYTICS & GROWTH */}
        {/* ========================================================================= */}
        {activeTab === 'analytics' && (
          <div className="space-y-8 animate-fade-in">
            <div>
              <h2 className="text-lg font-bold text-white font-serif">Platform Büyüme & Kullanım Analitiği</h2>
              <p className="text-xs text-slate-400">Kayıtlı üye artışı, davetiye aktivitesi ve şablon trendleri.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 bg-[#0f111e]/90 border border-white/10 rounded-2xl backdrop-blur-xl">
                <span className="text-xs text-slate-400 uppercase font-semibold">Yeni Üye Kayıtları</span>
                <div className="text-2xl font-bold text-white font-mono mt-2">{stats?.last30DaysMembers || 0}</div>
                <p className="text-[11px] text-slate-500 mt-1">Son 30 gün içinde kaydedilen üyeler</p>
              </div>

              <div className="p-5 bg-[#0f111e]/90 border border-white/10 rounded-2xl backdrop-blur-xl">
                <span className="text-xs text-slate-400 uppercase font-semibold">Yeni Davetiyeler</span>
                <div className="text-2xl font-bold text-rose-400 font-mono mt-2">{stats?.last30DaysInvitations || 0}</div>
                <p className="text-[11px] text-slate-500 mt-1">Son 30 gün içinde oluşturulan davetiyeler</p>
              </div>

              <div className="p-5 bg-[#0f111e]/90 border border-white/10 rounded-2xl backdrop-blur-xl">
                <span className="text-xs text-slate-400 uppercase font-semibold">Yayınlanma Başarı Oranı</span>
                <div className="text-2xl font-bold text-emerald-400 font-mono mt-2">
                  %{stats?.totalInvitations ? Math.round(((stats.publishedInvitations || 0) / stats.totalInvitations) * 100) : 0}
                </div>
                <p className="text-[11px] text-slate-500 mt-1">Toplam davetiyeler içinde yayında olanlar</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Event Types Breakdown */}
              <div className="p-6 bg-[#0f111e]/90 border border-white/10 rounded-2xl backdrop-blur-xl">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-rose-400" />
                  Etkinlik Türü Dağılımı
                </h3>
                <div className="space-y-3">
                  {stats?.eventTypeDistribution && Object.entries(stats.eventTypeDistribution).map(([type, count]: any) => {
                    const pct = Math.round((count / (stats.totalInvitations || 1)) * 100);
                    return (
                      <div key={type} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-300">{type}</span>
                          <span className="text-slate-400 font-mono">{count} adet (%{pct})</span>
                        </div>
                        <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-rose-500 to-pink-500 rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Template Popularity Ranking */}
              <div className="p-6 bg-[#0f111e]/90 border border-white/10 rounded-2xl backdrop-blur-xl">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Compass className="w-4 h-4 text-indigo-400" />
                  En Çok Kullanılan 8 Şablon
                </h3>
                <div className="space-y-2.5">
                  {stats?.topTemplates && stats.topTemplates.map((tpl: any, idx: number) => (
                    <div key={tpl.id} className="flex items-center justify-between p-2.5 bg-white/5 rounded-xl text-xs">
                      <div className="flex items-center gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-white/10 text-slate-300 font-mono font-bold flex items-center justify-center text-[10px]">
                          {idx + 1}
                        </span>
                        <span className="font-mono text-slate-200 font-semibold">{tpl.id}</span>
                      </div>
                      <span className="text-emerald-400 font-mono font-bold">{tpl.count} Kullanım</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 6: SECURITY & EMAIL VERIFICATION CENTER */}
        {/* ========================================================================= */}
        {activeTab === 'security' && (
          <div className="space-y-6 animate-fade-in">
            {/* Sub-Navigation */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h2 className="text-lg font-bold text-white font-serif">Güvenlik & Doğrulama Merkezi</h2>
                <p className="text-xs text-slate-400">E-posta doğrulamaları, teslimat logları ve güvenlik olayları takibi.</p>
              </div>

              <div className="flex items-center gap-2 bg-[#121422] p-1 rounded-xl border border-white/10">
                <button
                  onClick={() => setSecuritySubTab('verifications')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    securitySubTab === 'verifications' ? 'bg-rose-500 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Email Doğrulamaları ({verifications.length})
                </button>
                <button
                  onClick={() => setSecuritySubTab('delivery')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    securitySubTab === 'delivery' ? 'bg-rose-500 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Teslimat Logları ({deliveryLogs.length})
                </button>
                <button
                  onClick={() => setSecuritySubTab('events')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    securitySubTab === 'events' ? 'bg-rose-500 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Güvenlik Olayları ({securityEvents.length})
                </button>
              </div>
            </div>

            {/* SUBTAB 1: Email Verifications */}
            {securitySubTab === 'verifications' && (
              <div className="space-y-4">
                <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center justify-between text-xs text-rose-300">
                  <div className="flex items-center gap-2.5">
                    <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0" />
                    <span><strong>OTP Güvenlik Politikası:</strong> Doğrulama kodları şifreli hash (HMAC-SHA256) olarak saklanır. Ham OTP hiçbir ekranda ve logda görüntülenemez.</span>
                  </div>
                  <span className="font-mono text-[11px] text-rose-400 bg-rose-500/20 px-2 py-1 rounded-lg">SENDER: dijitaldavetiyeniz@gmail.com</span>
                </div>

                <div className="bg-[#0f111e]/90 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-xl">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-white/5 border-b border-white/10 text-slate-400 uppercase tracking-wider text-[10px]">
                        <tr>
                          <th className="py-3.5 px-4 font-semibold">E-posta Adresi</th>
                          <th className="py-3.5 px-4 font-semibold">Durum</th>
                          <th className="py-3.5 px-4 font-semibold">Son Gönderim</th>
                          <th className="py-3.5 px-4 font-semibold">Son Kullanma</th>
                          <th className="py-3.5 px-4 font-semibold text-center">Hatalı Deneme</th>
                          <th className="py-3.5 px-4 font-semibold text-center">Yeniden Gönderim</th>
                          <th className="py-3.5 px-4 font-semibold text-right">Eylemler</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {verifications.length > 0 ? (
                          verifications.map((v: any) => (
                            <tr key={v.id} className="hover:bg-white/5 transition-colors">
                              <td className="py-3.5 px-4 font-mono text-white">{v.email}</td>
                              <td className="py-3.5 px-4">
                                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                                  v.status === 'verified'
                                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                                    : v.status === 'expired'
                                    ? 'bg-slate-500/10 border-slate-500/30 text-slate-400'
                                    : v.status === 'too_many_attempts'
                                    ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                                    : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                                }`}>
                                  <span>{v.status === 'verified' ? '✓ Doğrulandı' : v.status === 'expired' ? 'Süresi Doldu' : v.status === 'too_many_attempts' ? 'Kilitlendi' : 'Bekliyor'}</span>
                                </span>
                              </td>
                              <td className="py-3.5 px-4 font-mono text-slate-400 text-[11px]">{formatDateDeterministic(v.last_sent_at || v.created_at)}</td>
                              <td className="py-3.5 px-4 font-mono text-slate-400 text-[11px]">{formatDateDeterministic(v.expires_at)}</td>
                              <td className="py-3.5 px-4 text-center font-mono text-slate-300">{v.attempt_count || 0} / 5</td>
                              <td className="py-3.5 px-4 text-center font-mono text-slate-300">{v.resend_count || 0}</td>
                              <td className="py-3.5 px-4 text-right">
                                <button
                                  onClick={() => handleResendOtpForMember(v.email)}
                                  disabled={memberActionLoading}
                                  className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 rounded-xl text-xs font-semibold border border-rose-500/20 transition-all cursor-pointer disabled:opacity-50"
                                >
                                  Yeni Kod Gönder
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={7} className="text-center py-10 text-slate-500 text-xs">Kayıtlı e-posta doğrulama bulunmuyor.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* SUBTAB 2: Email Delivery Logs */}
            {securitySubTab === 'delivery' && (
              <div className="bg-[#0f111e]/90 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-white/5 border-b border-white/10 text-slate-400 uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="py-3.5 px-4 font-semibold">Alıcı E-posta</th>
                        <th className="py-3.5 px-4 font-semibold">E-posta Türü</th>
                        <th className="py-3.5 px-4 font-semibold">Teslimat Durumu</th>
                        <th className="py-3.5 px-4 font-semibold">Gönderim Zamanı</th>
                        <th className="py-3.5 px-4 font-semibold">Hata / Açıklama</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {deliveryLogs.length > 0 ? (
                        deliveryLogs.map((log: any) => (
                          <tr key={log.id} className="hover:bg-white/5 transition-colors">
                            <td className="py-3.5 px-4 font-mono text-white">{log.recipient}</td>
                            <td className="py-3.5 px-4 text-slate-300 font-mono text-[11px]">{log.email_type}</td>
                            <td className="py-3.5 px-4">
                              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                log.status === 'sent' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                              }`}>
                                {log.status === 'sent' ? 'Gönderildi' : 'Başarısız'}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 font-mono text-slate-400 text-[11px]">{formatDateDeterministic(log.sent_at)}</td>
                            <td className="py-3.5 px-4 text-slate-500 text-[11px]">{log.error_message || '-'}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="text-center py-10 text-slate-500 text-xs">Henüz e-posta gönderim kaydı bulunmuyor.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* SUBTAB 3: Security Events */}
            {securitySubTab === 'events' && (
              <div className="bg-[#0f111e]/90 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-white/5 border-b border-white/10 text-slate-400 uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="py-3.5 px-4 font-semibold">Olay Türü</th>
                        <th className="py-3.5 px-4 font-semibold">Aktör E-posta</th>
                        <th className="py-3.5 px-4 font-semibold">Detaylar</th>
                        <th className="py-3.5 px-4 font-semibold">Zaman Damgası</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {securityEvents.length > 0 ? (
                        securityEvents.map((evt: any) => (
                          <tr key={evt.id} className="hover:bg-white/5 transition-colors">
                            <td className="py-3.5 px-4 font-mono text-rose-300 font-semibold">{evt.event_type}</td>
                            <td className="py-3.5 px-4 font-mono text-slate-300">{evt.actor_email || 'Sistem'}</td>
                            <td className="py-3.5 px-4 text-slate-400 text-[11px]">{JSON.stringify(evt.details || {})}</td>
                            <td className="py-3.5 px-4 font-mono text-slate-400 text-[11px]">{formatDateDeterministic(evt.created_at)}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="text-center py-10 text-slate-500 text-xs">Güvenlik olayı kaydı bulunmuyor.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 7: SYSTEM OPERATIONS & FEATURE SWITCHES */}
        {/* ========================================================================= */}
        {activeTab === 'system' && (
          <div className="space-y-8 animate-fade-in">
            {/* Maintenance Hero Card */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-[#121422] to-[#0a0a14] border border-white/10 relative overflow-hidden">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2.5 mb-2">
                    <Power className={`w-5 h-5 ${isMaintenanceActive ? 'text-amber-400' : 'text-emerald-400'}`} />
                    <h2 className="text-xl font-bold text-white font-serif">Platform Bakım Anahtarı</h2>
                  </div>
                  <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
                    Bakım modunda varsayılan olarak ana sayfa ve yönetim panelleri bakıma alınır, 
                    <strong> daha önce misafirlerle paylaşılmış düğün davetiye linkleri (/[slug]) açık kalır</strong>.
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className={`px-4 py-2 rounded-2xl border text-xs font-bold ${
                    isMaintenanceActive ? 'bg-amber-500/10 border-amber-500/30 text-amber-300' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  }`}>
                    {isMaintenanceActive ? 'Bakım Modu: AÇIK' : 'Bakım Modu: KAPALI'}
                  </div>
                  <button
                    onClick={() => setShowMaintenanceModal(true)}
                    className="px-5 py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-rose-500/20 cursor-pointer"
                  >
                    {isMaintenanceActive ? 'Bakım Modunu Kapat' : 'Bakım Modunu Aç'}
                  </button>
                </div>
              </div>
            </div>

            {/* Operational Feature Switches */}
            <div className="p-6 rounded-3xl bg-[#0f111e]/90 border border-white/10">
              <h3 className="text-base font-bold text-white font-serif mb-2">Operasyonel Fonksiyon Anahtarları (Feature Switches)</h3>
              <p className="text-xs text-slate-400 mb-6">Bakım moduna geçmeden belirli platform fonksiyonlarını durdurabilir veya yeniden açabilirsiniz.</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Switch 1: Signup */}
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-white">Yeni Üye Kaydı</div>
                    <div className="text-[11px] text-slate-400">{settings.allow_signup ? 'Kayıtlar açık' : 'Kayıtlar durduruldu'}</div>
                  </div>
                  <button
                    onClick={() => {
                      setSettings({ ...settings, allow_signup: !settings.allow_signup });
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border cursor-pointer ${
                      settings.allow_signup ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                    }`}
                  >
                    {settings.allow_signup ? 'AÇIK' : 'KAPALI'}
                  </button>
                </div>

                {/* Switch 2: Invitation Creation */}
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-white">Yeni Davetiye Oluşturma</div>
                    <div className="text-[11px] text-slate-400">{settings.allow_invitation_creation ? 'Oluşturma açık' : 'Oluşturma durduruldu'}</div>
                  </div>
                  <button
                    onClick={() => {
                      setSettings({ ...settings, allow_invitation_creation: !settings.allow_invitation_creation });
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border cursor-pointer ${
                      settings.allow_invitation_creation ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                    }`}
                  >
                    {settings.allow_invitation_creation ? 'AÇIK' : 'KAPALI'}
                  </button>
                </div>

                {/* Switch 3: Contact Form */}
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-white">İletişim Formu Alımı</div>
                    <div className="text-[11px] text-slate-400">{settings.contact_form_enabled ? 'Form aktif' : 'Form devre dışı'}</div>
                  </div>
                  <button
                    onClick={() => {
                      setSettings({ ...settings, contact_form_enabled: !settings.contact_form_enabled });
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border cursor-pointer ${
                      settings.contact_form_enabled ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                    }`}
                  >
                    {settings.contact_form_enabled ? 'AÇIK' : 'KAPALI'}
                  </button>
                </div>
              </div>
            </div>

            {/* Platform Settings Form */}
            <form onSubmit={handleSaveSettings} className="p-6 rounded-3xl bg-[#0f111e]/90 border border-white/10 space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <h3 className="text-base font-bold text-white font-serif">Platform Bilgileri & Duyuru Bandı</h3>
                  <p className="text-xs text-slate-400">Üst duyuru bandı ve platform geneli iletişim bilgileri.</p>
                </div>
                {settingsSuccess && (
                  <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> {settingsSuccess}
                  </span>
                )}
              </div>

              {/* Announcement Banner */}
              <div className="space-y-4 bg-white/5 p-5 rounded-2xl border border-white/5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300">Platform Üst Duyuru Bandı</span>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.announcement_enabled}
                      onChange={e => setSettings({ ...settings, announcement_enabled: e.target.checked })}
                      className="w-4 h-4 rounded text-rose-500 focus:ring-rose-500"
                    />
                    <span className="text-xs text-slate-300">Yayında</span>
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] text-slate-400 mb-1">Duyuru Metni</label>
                    <input
                      type="text"
                      value={settings.announcement_message}
                      onChange={e => setSettings({ ...settings, announcement_message: e.target.value })}
                      placeholder="Örn: 2026 Sezonu yeni tasarım şablonlarımız yayında! %20 indirim fırsatını kaçırmayın."
                      className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:border-rose-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Duyuru Türü</label>
                    <select
                      value={settings.announcement_type}
                      onChange={e => setSettings({ ...settings, announcement_type: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#141424] border border-white/10 rounded-xl text-xs text-slate-300 focus:border-rose-500 focus:outline-none cursor-pointer"
                    >
                      <option value="info">Bilgilendirme (Mavi)</option>
                      <option value="maintenance">Bakım Bildirimi (Amber)</option>
                      <option value="important">Önemli Kampanya (Rose)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Destek E-posta Adresi</label>
                  <input
                    type="email"
                    value={settings.contact_email}
                    onChange={e => setSettings({ ...settings, contact_email: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:border-rose-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Destek Telefon / WhatsApp</label>
                  <input
                    type="text"
                    value={settings.contact_phone}
                    onChange={e => setSettings({ ...settings, contact_phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:border-rose-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Şirket Ofis Adresi</label>
                  <input
                    type="text"
                    value={settings.contact_address}
                    onChange={e => setSettings({ ...settings, contact_address: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:border-rose-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={settingsSaving}
                  className="px-6 py-2.5 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white rounded-xl text-xs font-bold shadow-lg shadow-rose-500/25 transition-all disabled:opacity-50 cursor-pointer"
                >
                  {settingsSaving ? 'Kaydediliyor...' : 'Tüm Ayarları Kaydet'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 8: AUDIT LOGS */}
        {/* ========================================================================= */}
        {activeTab === 'audit' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-white font-serif">Sistem & Yönetim Denetim Kayıtları (Audit Logs)</h2>
                <p className="text-xs text-slate-400">Super Admin tarafından gerçekleştirilen tüm operasyonel eylemlerin kayıtları.</p>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={auditFilter}
                  onChange={e => setAuditFilter(e.target.value)}
                  className="py-2 px-3 bg-[#141424] border border-white/10 rounded-xl text-xs text-slate-300 focus:border-rose-500 focus:outline-none cursor-pointer"
                >
                  <option value="all">Tüm İşlemler ({auditLogs.length})</option>
                  <option value="maintenance">Bakım Modu</option>
                  <option value="settings">Platform Ayarları</option>
                  <option value="users">Üye Eylemleri</option>
                  <option value="invitations">Davetiye Eylemleri</option>
                </select>

                <button
                  onClick={fetchAuditLogs}
                  className="px-3.5 py-2 bg-white/10 hover:bg-white/15 rounded-xl text-xs font-semibold text-white transition-all cursor-pointer"
                >
                  Yenile
                </button>
              </div>
            </div>

            <div className="bg-[#0f111e]/90 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-white/5 border-b border-white/10 text-slate-400 uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="py-3.5 px-4 font-semibold">Tarih & Saat</th>
                      <th className="py-3.5 px-4 font-semibold">Aktör</th>
                      <th className="py-3.5 px-4 font-semibold">Eylem</th>
                      <th className="py-3.5 px-4 font-semibold">Detaylar (Sanitized)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {auditLogs.length > 0 ? (
                      auditLogs.map((log: any) => (
                        <tr key={log.id} className="hover:bg-white/5 transition-colors">
                          <td className="py-3.5 px-4 font-mono text-slate-300 text-[11px] whitespace-nowrap">
                            {formatDateDeterministic(log.created_at)}
                          </td>
                          <td className="py-3.5 px-4 font-semibold text-rose-300">
                            {log.actor_email || 'Super Admin'}
                          </td>
                          <td className="py-3.5 px-4 font-mono text-slate-200">
                            {log.action}
                          </td>
                          <td className="py-3.5 px-4 font-mono text-slate-400 text-[11px] max-w-md truncate">
                            {JSON.stringify(log.details || {})}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="text-center py-10 text-slate-500 text-xs">
                          Henüz kaydedilmiş denetim kaydı bulunmuyor.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB: SITE MANAGEMENT & GLOBAL CMS */}
        {activeTab === 'site_management' && <SiteManagementTab />}

        {/* TAB: SUPPORT CENTER */}
        {activeTab === 'support_center' && <SupportInboxTab />}

        {/* TAB: DATA CLEANUP */}
        {activeTab === 'data_cleanup' && <DataCleanupTab />}

        {/* TAB: SYSTEM STATUS */}
        {activeTab === 'system' && <SystemStatusTab />}

      </main>

      {/* ========================================================================= */}
      {/* MEMBER DETAIL DRAWER */}
      {/* ========================================================================= */}
      {selectedMember && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end animate-fade-in">
          <div className="w-full max-w-xl bg-[#0f111e] border-l border-white/10 h-full p-6 sm:p-8 overflow-y-auto flex flex-col justify-between shadow-2xl">
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <span className="text-[10px] font-bold text-rose-400 uppercase tracking-widest">Üye Detay Kartı</span>
                  <h3 className="text-xl font-bold text-white font-serif">{selectedMember.name}</h3>
                </div>
                <button
                  onClick={() => setSelectedMember(null)}
                  className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/5 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Status Badge */}
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-2xl border border-white/5">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${selectedMember.is_suspended ? 'bg-rose-500' : 'bg-emerald-400'}`} />
                  <span className="text-xs font-semibold text-slate-200">
                    {selectedMember.is_suspended ? 'Hesap Askıya Alınmış' : 'Hesap Aktif'}
                  </span>
                </div>
                <button
                  onClick={() => handleToggleUserSuspension(selectedMember.id, selectedMember.is_suspended, selectedMember.email)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    selectedMember.is_suspended
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20'
                      : 'bg-rose-500/10 border-rose-500/20 text-rose-400 hover:bg-rose-500/20'
                  }`}
                >
                  {selectedMember.is_suspended ? 'Askıdan İndir' : 'Hesabı Askıya Al'}
                </button>
              </div>

              {/* Profile Intelligence Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-white/5 rounded-xl">
                  <span className="text-slate-500 block mb-0.5">E-posta Adresi</span>
                  <span className="text-white font-mono">{selectedMember.email}</span>
                </div>

                <div className="p-3 bg-white/5 rounded-xl">
                  <span className="text-slate-500 block mb-0.5">Telefon Numarası</span>
                  <span className="text-white">{selectedMember.phone || '-'}</span>
                </div>

                <div className="p-3 bg-white/5 rounded-xl">
                  <span className="text-slate-500 block mb-0.5">Şehir / Konum</span>
                  <span className="text-white">{selectedMember.city || selectedMember.country || '-'}</span>
                </div>

                <div className="p-3 bg-white/5 rounded-xl">
                  <span className="text-slate-500 block mb-0.5">Üyelik Tarihi & Saati</span>
                  <span className="text-white font-mono">{formatDateDeterministic(selectedMember.created_at)}</span>
                </div>
              </div>

              {/* Email Verification Box & Resend Action */}
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300">E-posta Doğrulama</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    selectedMember.is_email_verified ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                  }`}>
                    {selectedMember.is_email_verified ? '✓ Doğrulandı' : 'Doğrulama Bekliyor'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>Gönderici: <strong className="text-slate-300">dijitaldavetiyeniz@gmail.com</strong></span>
                  <button
                    onClick={() => handleResendOtpForMember(selectedMember.email)}
                    disabled={memberActionLoading}
                    className="px-3 py-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 rounded-lg text-xs font-semibold cursor-pointer disabled:opacity-50"
                  >
                    Yeni Kod Gönder
                  </button>
                </div>
              </div>

              {/* Internal Staff Notes (Dahili Notlar) */}
              <div className="space-y-3 border-t border-white/10 pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-indigo-400" />
                    Dahili Yönetici Notları (Staff Only)
                  </span>
                  <span className="text-[10px] text-slate-500">Kullanıcıya Görünmez</span>
                </div>

                <form onSubmit={handleAddMemberNote} className="flex gap-2">
                  <input
                    type="text"
                    value={newNoteText}
                    onChange={e => setNewNoteText(e.target.value)}
                    placeholder="Üye hakkında dahili not ekleyin..."
                    className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder:text-slate-500 focus:border-rose-500 focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={isAddingNote || !newNoteText.trim()}
                    className="px-3 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-bold cursor-pointer disabled:opacity-50"
                  >
                    Ekle
                  </button>
                </form>

                <div className="space-y-2 max-h-36 overflow-y-auto">
                  {memberNotes.length > 0 ? (
                    memberNotes.map((note: any) => (
                      <div key={note.id} className="p-2.5 bg-white/5 rounded-xl text-xs border border-white/5">
                        <div className="text-slate-300">{note.note}</div>
                        <div className="text-[10px] text-slate-500 mt-1 flex justify-between">
                          <span>{note.author_email}</span>
                          <span>{formatDateDeterministic(note.created_at)}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-[11px] text-slate-500 italic">Henüz not eklenmemiş.</div>
                  )}
                </div>
              </div>

              {/* User's Created Invitations */}
              <div className="space-y-3 border-t border-white/10 pt-4">
                <span className="text-xs font-bold text-white uppercase tracking-wider block">
                  Kullanıcının Davetiyeleri ({selectedMember.invitations?.length || 0})
                </span>

                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {selectedMember.invitations && selectedMember.invitations.length > 0 ? (
                    selectedMember.invitations.map((inv: any) => (
                      <div key={inv.id} className="p-3 bg-white/5 rounded-xl flex items-center justify-between text-xs">
                        <div>
                          <div className="font-semibold text-white">{inv.title}</div>
                          <div className="text-slate-400 text-[11px]">/{inv.slug} • {inv.event_type}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            inv.is_paid ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-500/10 text-slate-400'
                          }`}>
                            {inv.is_paid ? 'Yayında' : 'Taslak'}
                          </span>
                          <a
                            href={`/${inv.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-slate-300"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-slate-500 italic py-2">Bu kullanıcı henüz davetiye oluşturmamış.</div>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-white/10 flex justify-end">
              <button
                onClick={() => setSelectedMember(null)}
                className="px-5 py-2 bg-white/10 hover:bg-white/15 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MAINTENANCE MODE MODAL */}
      {/* ========================================================================= */}
      {showMaintenanceModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#0f111e] border border-white/15 rounded-3xl w-full max-w-lg p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2.5">
                <Power className="w-5 h-5 text-amber-400" />
                <h3 className="text-lg font-bold text-white font-serif">Platform Bakım Modu Yönetimi</h3>
              </div>
              <button onClick={() => setShowMaintenanceModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white text-sm">Bakım Modu Durumu</div>
                  <div className="text-slate-400 text-[11px]">Sistemi ziyaretçilere kapat/aç</div>
                </div>
                <button
                  type="button"
                  onClick={() => setMaintenanceForm({ ...maintenanceForm, enabled: !maintenanceForm.enabled })}
                  className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    maintenanceForm.enabled
                      ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                      : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                  }`}
                >
                  {maintenanceForm.enabled ? 'AÇIK (Bakımda)' : 'KAPALI (Canlı)'}
                </button>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1.5">Bakım Kapsamı</label>
                <div className="space-y-2">
                  <label className="flex items-start gap-3 p-3 bg-white/5 rounded-xl border border-white/5 cursor-pointer">
                    <input
                      type="radio"
                      name="scope"
                      value="platform"
                      checked={maintenanceForm.scope === 'platform'}
                      onChange={() => setMaintenanceForm({ ...maintenanceForm, scope: 'platform' })}
                      className="mt-0.5 text-rose-500"
                    />
                    <div>
                      <div className="font-bold text-white">Platform Bakımı (Önerilen)</div>
                      <div className="text-slate-400 text-[11px]">
                        Ana sayfa ve stüdyo bakıma alınır. <strong>Mevcut davetiye linkleri (/[slug]) açık kalır!</strong>
                      </div>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-3 bg-white/5 rounded-xl border border-white/5 cursor-pointer">
                    <input
                      type="radio"
                      name="scope"
                      value="full"
                      checked={maintenanceForm.scope === 'full'}
                      onChange={() => setMaintenanceForm({ ...maintenanceForm, scope: 'full' })}
                      className="mt-0.5 text-rose-500"
                    />
                    <div>
                      <div className="font-bold text-white">Tam Bakım (Acil Durum)</div>
                      <div className="text-slate-400 text-[11px]">
                        Tüm platform ve davetiyeler bakıma alınır. (Super Admin hariç)
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1.5">Ziyaretçi Bakım Mesajı (İsteğe Bağlı)</label>
                <textarea
                  rows={3}
                  value={maintenanceForm.message}
                  onChange={e => setMaintenanceForm({ ...maintenanceForm, message: e.target.value })}
                  placeholder="Örn: Sistemlerimizde planlı altyapı güçlendirme çalışması yapılmaktadır. Kısa süre içinde tekrar yayında olacağız."
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:border-rose-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-white/10 pt-4">
              <button
                type="button"
                onClick={() => setShowMaintenanceModal(false)}
                className="px-4 py-2 bg-white/10 hover:bg-white/15 text-slate-300 rounded-xl text-xs font-semibold"
              >
                Vazgeç
              </button>
              <button
                type="button"
                onClick={handleApplyMaintenance}
                disabled={settingsSaving}
                className="px-5 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-rose-500/25"
              >
                {settingsSaving ? 'Uygulanıyor...' : 'Değişiklikleri Uygula'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
