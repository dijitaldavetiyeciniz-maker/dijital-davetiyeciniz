'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Shield, Users, Mail, Settings, Activity, AlertTriangle, 
  CheckCircle2, Lock, Search, Filter, Eye, RefreshCw, 
  ArrowUpRight, Trash2, Globe, Clock, ChevronRight, X, 
  Send, Phone, MapPin, Calendar, Heart, Sparkles, LogOut,
  Layers, MessageSquare, AlertCircle, FileText, ToggleLeft, ToggleRight,
  TrendingUp, BarChart3, Database, Check, ShieldAlert
} from 'lucide-react';

export default function SuperAdminCommandCenter() {
  const router = useRouter();

  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState<'overview' | 'members' | 'invitations' | 'contacts' | 'system' | 'audit'>('overview');

  // Data States
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [invitations, setInvitations] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>(null);

  // Filters & Search
  const [userSearch, setUserSearch] = useState('');
  const [userFilter, setUserFilter] = useState('all');
  const [userSort, setUserSort] = useState('newest');

  const [invSearch, setInvSearch] = useState('');
  const [invFilter, setInvFilter] = useState('all');
  const [invEventType, setInvEventType] = useState('all');

  const [contactFilter, setContactFilter] = useState('all');
  const [contactSearch, setContactSearch] = useState('');

  // Selected Detail Drawers / Modals
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [selectedContact, setSelectedContact] = useState<any | null>(null);
  const [maintenanceModalOpen, setMaintenanceModalOpen] = useState(false);
  const [maintenanceForm, setMaintenanceForm] = useState({
    enabled: false,
    scope: 'platform',
    message: '',
    until: ''
  });

  // Settings Save State
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [settingsSuccess, setSettingsSuccess] = useState('');

  // 1. Initial Auth Check
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
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
  };

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
    } catch (err: any) {
      setAuthError('Sunucu bağlantı hatası.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/super-admin/logout', { method: 'POST' });
    setIsAuthenticated(false);
  };

  // 2. Load Data Handlers
  const loadAllData = async () => {
    setLoading(true);
    await Promise.all([
      fetchStats(),
      fetchMembers(),
      fetchInvitations(),
      fetchContacts(),
      fetchSettings(),
      fetchAuditLogs()
    ]);
    setLoading(false);
  };

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/super-admin/stats');
      const data = await res.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (e) {
      console.warn('Failed to fetch stats:', e);
    }
  };

  const fetchMembers = async () => {
    try {
      const url = `/api/super-admin/users?search=${encodeURIComponent(userSearch)}&filter=${userFilter}&sort=${userSort}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setMembers(data.users);
      }
    } catch (e) {
      console.warn('Failed to fetch members:', e);
    }
  };

  const fetchInvitations = async () => {
    try {
      const url = `/api/super-admin/invitations?search=${encodeURIComponent(invSearch)}&filter=${invFilter}&eventType=${invEventType}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setInvitations(data.invitations);
      }
    } catch (e) {
      console.warn('Failed to fetch invitations:', e);
    }
  };

  const fetchContacts = async () => {
    try {
      const url = `/api/super-admin/contacts?search=${encodeURIComponent(contactSearch)}&filter=${contactFilter}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setContacts(data.messages);
      }
    } catch (e) {
      console.warn('Failed to fetch contacts:', e);
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/super-admin/settings');
      const data = await res.json();
      if (data.success) {
        setSettings(data.settings);
        setMaintenanceForm({
          enabled: data.settings.maintenance_enabled || false,
          scope: data.settings.maintenance_scope || 'platform',
          message: data.settings.maintenance_message || '',
          until: data.settings.maintenance_until || ''
        });
      }
    } catch (e) {
      console.warn('Failed to fetch settings:', e);
    }
  };

  const fetchAuditLogs = async () => {
    try {
      const res = await fetch('/api/super-admin/audit-logs');
      const data = await res.json();
      if (data.success) {
        setAuditLogs(data.logs);
      }
    } catch (e) {
      console.warn('Failed to fetch audit logs:', e);
    }
  };

  // Re-fetch on filter change
  useEffect(() => {
    if (isAuthenticated) fetchMembers();
  }, [userSearch, userFilter, userSort, isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) fetchInvitations();
  }, [invSearch, invFilter, invEventType, isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) fetchContacts();
  }, [contactSearch, contactFilter, isAuthenticated]);

  // Member Suspension
  const handleToggleSuspend = async (userId: string, currentStatus: boolean) => {
    const action = currentStatus ? 'unsuspend' : 'suspend';
    const confirmMsg = currentStatus ? 'Kullanıcının askısını kaldırmak istiyor musunuz?' : 'Bu kullanıcıyı askıya almak istediğinize emin misiniz?';
    if (!confirm(confirmMsg)) return;

    const res = await fetch('/api/super-admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, action })
    });
    if (res.ok) {
      fetchMembers();
      if (selectedUser && selectedUser.id === userId) {
        setSelectedUser({ ...selectedUser, is_suspended: !currentStatus });
      }
    }
  };

  // Invitation Actions
  const handleTogglePublish = async (id: string, currentPaid: boolean) => {
    const res = await fetch('/api/super-admin/invitations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, action: 'toggle_publish', payload: { is_paid: !currentPaid } })
    });
    if (res.ok) {
      fetchInvitations();
      fetchStats();
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
      fetchInvitations();
      fetchStats();
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
        fetchStats();
        fetchAuditLogs();
        setTimeout(() => setSettingsSuccess(''), 3500);
      }
    } catch (e) {
      alert('Ayarlar kaydedilemedi.');
    } finally {
      setSettingsSaving(false);
    }
  };

  // Save Maintenance Mode
  const handleConfirmMaintenance = async () => {
    setSettingsSaving(true);
    try {
      const res = await fetch('/api/super-admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          maintenance_enabled: maintenanceForm.enabled,
          maintenance_scope: maintenanceForm.scope,
          maintenance_message: maintenanceForm.message,
          maintenance_until: maintenanceForm.until || null
        })
      });
      const data = await res.json();
      if (data.success) {
        setSettings({ ...settings, ...data.settings });
        setMaintenanceModalOpen(false);
        fetchStats();
        fetchAuditLogs();
      }
    } catch (e) {
      alert('Bakım modu güncellenemedi.');
    } finally {
      setSettingsSaving(false);
    }
  };

  // Standard Deterministic Date Formatter (No Hydration Errors)
  const formatDateTime = (dateStr?: string | null) => {
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
              className="w-full bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-rose-500/25 cursor-pointer text-sm disabled:opacity-50"
            >
              {authLoading ? 'Doğrulanıyor...' : 'Güvenli Giriş Yap'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5 text-slate-500 text-[11px]">
            Tüm yönetimsel işlemler IP ve zaman damgasıyla kayıt altına alınır.
          </div>
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

      {/* Header Bar */}
      <header className="sticky top-0 z-40 bg-[#0f111e]/90 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 bg-gradient-to-br from-rose-500 via-pink-600 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-rose-500/20">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-extrabold text-white font-serif tracking-tight">Dijital Davetiyeciniz</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 font-mono font-bold border border-rose-500/20">
                  C7 COMMAND CENTER
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">Platform Operasyon & Yönetim Merkezi</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Live System Status Indicator */}
            <div 
              onClick={() => {
                setMaintenanceForm({
                  enabled: isMaintenanceActive,
                  scope: settings?.maintenance_scope || 'platform',
                  message: settings?.maintenance_message || '',
                  until: settings?.maintenance_until || ''
                });
                setMaintenanceModalOpen(true);
              }}
              className={`cursor-pointer px-3.5 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all ${
                isMaintenanceActive 
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-300 hover:bg-amber-500/20' 
                  : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isMaintenanceActive ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'}`} />
              <span>{isMaintenanceActive ? 'Bakım Modu Açık' : 'Platform Canlı'}</span>
            </div>

            <button
              onClick={loadAllData}
              disabled={loading}
              title="Verileri Yenile"
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 transition-all cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-rose-400' : ''}`} />
            </button>

            <button
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-rose-500/20 text-slate-300 hover:text-rose-300 border border-white/10 transition-all text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Çıkış</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex gap-1 overflow-x-auto no-scrollbar border-t border-white/5 pt-1">
          {[
            { id: 'overview', label: 'Genel Bakış', icon: <Activity className="w-4 h-4" /> },
            { id: 'members', label: `Üyeler (${stats?.totalMembers || members.length})`, icon: <Users className="w-4 h-4" /> },
            { id: 'invitations', label: `Davetiyeler (${stats?.totalInvitations || invitations.length})`, icon: <Layers className="w-4 h-4" /> },
            { 
              id: 'contacts', 
              label: 'İletişim & Gelenler', 
              icon: <MessageSquare className="w-4 h-4" />,
              badge: stats?.unreadMessages > 0 ? stats.unreadMessages : null 
            },
            { id: 'system', label: 'Sistem & Bakım', icon: <Settings className="w-4 h-4" /> },
            { id: 'audit', label: 'Denetim Logları', icon: <FileText className="w-4 h-4" /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all flex items-center gap-2 border-b-2 whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? 'border-rose-500 text-white bg-white/5'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/[0.02]'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.badge && (
                <span className="px-1.5 py-0.2 text-[10px] bg-rose-500 text-white font-extrabold rounded-full animate-pulse">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        {/* ============================================================ */}
        {/* TAB 1: OVERVIEW & PLATFORM INTELLIGENCE */}
        {/* ============================================================ */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Top Operational KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* Toplam Üye */}
              <div className="bg-[#0f111e]/90 border border-white/10 rounded-2xl p-5 backdrop-blur-xl relative overflow-hidden shadow-lg">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Toplam Üye</span>
                  <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center">
                    <Users className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl font-black text-white font-mono mb-2">
                  {stats?.totalMembers ?? '-'}
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="text-emerald-400 font-bold">+{stats?.todayMembers || 0}</span> bugün • 
                  <span className="text-slate-300 font-semibold">{stats?.last30DaysMembers || 0}</span> son 30 gün
                </div>
              </div>

              {/* Toplam Davetiye */}
              <div className="bg-[#0f111e]/90 border border-white/10 rounded-2xl p-5 backdrop-blur-xl relative overflow-hidden shadow-lg">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Toplam Davetiye</span>
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                    <Layers className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl font-black text-white font-mono mb-2">
                  {stats?.totalInvitations ?? '-'}
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="text-emerald-400 font-bold">🟢 {stats?.publishedInvitations || 0} Yayında</span>
                  <span className="text-amber-400 font-semibold">🟡 {stats?.draftInvitations || 0} Taslak</span>
                </div>
              </div>

              {/* Gelen İletişim Mesajları */}
              <div className="bg-[#0f111e]/90 border border-white/10 rounded-2xl p-5 backdrop-blur-xl relative overflow-hidden shadow-lg">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">İletişim Mesajları</span>
                  <div className="w-8 h-8 rounded-lg bg-pink-500/10 text-pink-400 flex items-center justify-center">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl font-black text-white font-mono mb-2">
                  {stats?.unreadMessages ?? 0}
                  <span className="text-xs font-normal text-slate-500 ml-2">okunmamış</span>
                </div>
                <div className="text-xs text-slate-400">
                  Toplam {stats?.totalMessages || 0} müşteri mesajı
                </div>
              </div>

              {/* Sistem Durumu */}
              <div className="bg-[#0f111e]/90 border border-white/10 rounded-2xl p-5 backdrop-blur-xl relative overflow-hidden shadow-lg">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sistem Durumu</span>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isMaintenanceActive ? 'bg-amber-500/10 text-amber-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                    <Activity className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${isMaintenanceActive ? 'bg-amber-400 animate-ping' : 'bg-emerald-400'}`} />
                  <span>{isMaintenanceActive ? 'Bakım Modunda' : 'Tüm Sistemler Canlı'}</span>
                </div>
                <div className="text-xs text-slate-400">
                  Kapsam: <strong className="text-slate-300">{settings?.maintenance_scope === 'full' ? 'Tam Bakım' : 'Platform Bakımı (Davetiyeler Açık)'}</strong>
                </div>
              </div>
            </div>

            {/* Platform Analytics: Event Types & Templates */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Event Types Distribution */}
              <div className="bg-[#0f111e]/90 border border-white/10 rounded-3xl p-6 backdrop-blur-xl">
                <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2 font-serif">
                  <BarChart3 className="w-4 h-4 text-rose-400" />
                  Etkinlik Türü Dağılımı
                </h3>
                <div className="space-y-3">
                  {stats?.eventTypeDistribution && Object.keys(stats.eventTypeDistribution).length > 0 ? (
                    Object.entries(stats.eventTypeDistribution).map(([type, count]: any) => {
                      const total = stats.totalInvitations || 1;
                      const percentage = Math.round((count / total) * 100);
                      return (
                        <div key={type} className="space-y-1">
                          <div className="flex justify-between text-xs font-medium">
                            <span className="text-slate-300">{type}</span>
                            <span className="text-slate-400 font-mono">{count} Davetiye ({percentage}%)</span>
                          </div>
                          <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
                            <div 
                              className="bg-gradient-to-r from-rose-500 to-indigo-500 h-full rounded-full transition-all duration-500"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-slate-500 text-xs">Henüz veri yok.</p>
                  )}
                </div>
              </div>

              {/* Top Templates */}
              <div className="bg-[#0f111e]/90 border border-white/10 rounded-3xl p-6 backdrop-blur-xl">
                <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2 font-serif">
                  <TrendingUp className="w-4 h-4 text-indigo-400" />
                  En Çok Kullanılan Tasarımlar
                </h3>
                <div className="space-y-2.5">
                  {stats?.topTemplates && stats.topTemplates.length > 0 ? (
                    stats.topTemplates.map((tpl: any, idx: number) => (
                      <div key={tpl.id} className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] border border-white/5 text-xs">
                        <div className="flex items-center gap-2.5">
                          <span className="w-5 h-5 rounded-md bg-rose-500/10 text-rose-400 flex items-center justify-center text-[10px] font-bold">
                            #{idx + 1}
                          </span>
                          <span className="font-semibold text-slate-200 capitalize">{tpl.id.replace(/-/g, ' ')}</span>
                        </div>
                        <span className="text-slate-400 font-mono font-bold">{tpl.count} davetiye</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-500 text-xs">Henüz şablon verisi yok.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Actions Shortcuts */}
            <div className="bg-gradient-to-r from-rose-500/10 via-indigo-500/10 to-transparent border border-white/10 rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="text-base font-bold text-white font-serif mb-1">Hızlı Operasyon Eylemleri</h4>
                <p className="text-xs text-slate-400">Üye kayıtlarını inceleyin, bakım modunu yönetin veya müşteri mesajlarını yanıtlayın.</p>
              </div>
              <div className="flex flex-wrap gap-2.5">
                <button
                  onClick={() => setActiveTab('members')}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Üyeleri İncele
                </button>
                <button
                  onClick={() => setActiveTab('contacts')}
                  className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-rose-500/20 cursor-pointer"
                >
                  Mesaj Kutusunu Aç
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 2: MEMBERS MANAGEMENT */}
        {/* ============================================================ */}
        {activeTab === 'members' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Search & Filter Bar */}
            <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between bg-[#0f111e]/90 p-4 rounded-2xl border border-white/10">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={userSearch}
                  onChange={e => setUserSearch(e.target.value)}
                  placeholder="Üye adı, e-posta, telefon veya şehir ara..."
                  className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-rose-500 transition-all"
                />
              </div>

              <div className="flex flex-wrap gap-2 items-center">
                <select
                  value={userFilter}
                  onChange={e => setUserFilter(e.target.value)}
                  className="bg-[#141424] border border-white/10 text-white text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-rose-500 cursor-pointer"
                >
                  <option value="all">Tüm Üyeler</option>
                  <option value="new">Yeni Üyeler (Son 7 Gün)</option>
                  <option value="has_invitations">Davetiyesi Olanlar</option>
                  <option value="has_published">Yayında Davetiyesi Olanlar</option>
                  <option value="no_invitations">Davetiyesi Olmayanlar</option>
                  <option value="suspended">Askıya Alınanlar</option>
                </select>

                <select
                  value={userSort}
                  onChange={e => setUserSort(e.target.value)}
                  className="bg-[#141424] border border-white/10 text-white text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-rose-500 cursor-pointer"
                >
                  <option value="newest">En Yeni Kayıt</option>
                  <option value="oldest">En Eski Kayıt</option>
                  <option value="most_invitations">En Çok Davetiye</option>
                  <option value="name">İsme Göre (A-Z)</option>
                </select>
              </div>
            </div>

            {/* Desktop Table & Mobile Cards */}
            <div className="bg-[#0f111e]/90 border border-white/10 rounded-3xl overflow-hidden shadow-xl">
              {members.length === 0 ? (
                <div className="p-12 text-center text-slate-500 text-xs">
                  Aramanızla eşleşen üye bulunamadı.
                </div>
              ) : (
                <>
                  {/* Desktop Table View */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-white/[0.03] text-slate-400 uppercase tracking-wider border-b border-white/5">
                        <tr>
                          <th className="py-3.5 px-5 font-semibold">Üye</th>
                          <th className="py-3.5 px-4 font-semibold">Telefon</th>
                          <th className="py-3.5 px-4 font-semibold">Şehir</th>
                          <th className="py-3.5 px-4 font-semibold">Üyelik Tarihi & Saati</th>
                          <th className="py-3.5 px-4 font-semibold text-center">Toplam Davetiye</th>
                          <th className="py-3.5 px-4 font-semibold text-center">Yayında</th>
                          <th className="py-3.5 px-4 font-semibold">Durum</th>
                          <th className="py-3.5 px-5 font-semibold text-right">Aksiyon</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {members.map(member => (
                          <tr key={member.id} className="hover:bg-white/[0.02] transition-colors">
                            <td className="py-4 px-5">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-500 to-indigo-600 text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-sm">
                                  {(member.first_name || member.email || 'U')[0].toUpperCase()}
                                </div>
                                <div>
                                  <p className="font-bold text-white text-xs">{member.full_name}</p>
                                  <p className="text-slate-400 text-[11px] font-mono">{member.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-4 text-slate-300 font-mono text-[11px]">
                              {member.phone || <span className="text-slate-600">Eklenmemiş</span>}
                            </td>
                            <td className="py-4 px-4 text-slate-300">
                              {member.city || '-'}
                            </td>
                            <td className="py-4 px-4 text-slate-300 font-mono text-[11px]">
                              {formatDateTime(member.created_at)}
                            </td>
                            <td className="py-4 px-4 text-center font-bold text-white font-mono">
                              {member.total_invitations}
                            </td>
                            <td className="py-4 px-4 text-center font-bold text-emerald-400 font-mono">
                              {member.published_invitations}
                            </td>
                            <td className="py-4 px-4">
                              {member.is_suspended ? (
                                <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-bold border border-rose-500/30">
                                  Askıda
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                                  Aktif
                                </span>
                              )}
                            </td>
                            <td className="py-4 px-5 text-right">
                              <button
                                onClick={() => setSelectedUser(member)}
                                className="px-3 py-1.5 bg-white/10 hover:bg-rose-500 text-white rounded-lg text-xs font-bold transition-all cursor-pointer"
                              >
                                Detay
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Card Composition */}
                  <div className="md:hidden divide-y divide-white/5 p-4 space-y-4">
                    {members.map(member => (
                      <div key={member.id} className="pt-4 first:pt-0 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-500 to-indigo-600 text-white font-bold flex items-center justify-center text-xs">
                              {(member.first_name || member.email || 'U')[0].toUpperCase()}
                            </div>
                            <div>
                              <p className="font-bold text-white text-xs">{member.full_name}</p>
                              <p className="text-slate-400 text-[11px] font-mono">{member.email}</p>
                            </div>
                          </div>
                          {member.is_suspended ? (
                            <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-bold">Askıda</span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">Aktif</span>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-[11px] bg-white/[0.02] p-2.5 rounded-xl border border-white/5">
                          <div>
                            <span className="text-slate-500">Telefon: </span>
                            <span className="text-slate-300 font-mono">{member.phone || '-'}</span>
                          </div>
                          <div>
                            <span className="text-slate-500">Şehir: </span>
                            <span className="text-slate-300">{member.city || '-'}</span>
                          </div>
                          <div>
                            <span className="text-slate-500">Toplam Davetiye: </span>
                            <span className="font-bold text-white">{member.total_invitations}</span>
                          </div>
                          <div>
                            <span className="text-slate-500">Kayıt: </span>
                            <span className="text-slate-400 font-mono">{formatDateTime(member.created_at)}</span>
                          </div>
                        </div>

                        <button
                          onClick={() => setSelectedUser(member)}
                          className="w-full py-2 bg-white/10 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-all text-center"
                        >
                          Üye Detayını Aç
                        </button>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 3: INVITATIONS MANAGEMENT */}
        {/* ============================================================ */}
        {activeTab === 'invitations' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Search & Filter */}
            <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between bg-[#0f111e]/90 p-4 rounded-2xl border border-white/10">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={invSearch}
                  onChange={e => setInvSearch(e.target.value)}
                  placeholder="Davetiye adı, sahip e-posta veya slug ara..."
                  className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-rose-500 transition-all"
                />
              </div>

              <div className="flex flex-wrap gap-2 items-center">
                <select
                  value={invFilter}
                  onChange={e => setInvFilter(e.target.value)}
                  className="bg-[#141424] border border-white/10 text-white text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-rose-500 cursor-pointer"
                >
                  <option value="all">Tüm Durumlar</option>
                  <option value="published">🟢 Yayında Olanlar</option>
                  <option value="draft">🟡 Taslaklar</option>
                </select>

                <select
                  value={invEventType}
                  onChange={e => setInvEventType(e.target.value)}
                  className="bg-[#141424] border border-white/10 text-white text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-rose-500 cursor-pointer"
                >
                  <option value="all">Tüm Etkinlik Türleri</option>
                  <option value="Düğün">Düğün</option>
                  <option value="Nişan">Nişan</option>
                  <option value="Kına Gecesi">Kına</option>
                  <option value="Baby Shower">Baby Shower</option>
                  <option value="Doğum Günü">Doğum Günü</option>
                  <option value="Kurumsal">Kurumsal</option>
                </select>
              </div>
            </div>

            {/* Invitations Table */}
            <div className="bg-[#0f111e]/90 border border-white/10 rounded-3xl overflow-hidden shadow-xl">
              {invitations.length === 0 ? (
                <div className="p-12 text-center text-slate-500 text-xs">
                  Aramanızla eşleşen davetiye bulunamadı.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-white/[0.03] text-slate-400 uppercase tracking-wider border-b border-white/5">
                      <tr>
                        <th className="py-3.5 px-5 font-semibold">Davetiye</th>
                        <th className="py-3.5 px-4 font-semibold">Etkinlik Türü</th>
                        <th className="py-3.5 px-4 font-semibold">Şablon</th>
                        <th className="py-3.5 px-4 font-semibold">Oluşturulma</th>
                        <th className="py-3.5 px-4 font-semibold">Yayın Durumu</th>
                        <th className="py-3.5 px-5 font-semibold text-right">Aksiyonlar</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {invitations.map(w => {
                        const title = w.bride_name && w.groom_name ? `${w.bride_name} & ${w.groom_name}` : w.bride_name || 'Davetiye';
                        return (
                          <tr key={w.id} className="hover:bg-white/[0.02] transition-colors">
                            <td className="py-4 px-5">
                              <div>
                                <p className="font-bold text-white text-xs">{title}</p>
                                <p className="text-rose-400 font-mono text-[11px]">/{w.slug}</p>
                                {w.user_email && <p className="text-slate-500 text-[10px]">{w.user_email}</p>}
                              </div>
                            </td>
                            <td className="py-4 px-4 text-slate-300">
                              {w.event_type || 'Düğün'}
                            </td>
                            <td className="py-4 px-4 text-slate-400 font-mono text-[11px]">
                              {w.template_id || 'template1'}
                            </td>
                            <td className="py-4 px-4 text-slate-400 font-mono text-[11px]">
                              {formatDateTime(w.created_at)}
                            </td>
                            <td className="py-4 px-4">
                              <button
                                onClick={() => handleTogglePublish(w.id, w.is_paid)}
                                className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                                  w.is_paid
                                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/30'
                                    : 'bg-amber-500/20 text-amber-300 border-amber-500/30 hover:bg-amber-500/30'
                                }`}
                              >
                                {w.is_paid ? '🟢 Yayında' : '🟡 Taslak'}
                              </button>
                            </td>
                            <td className="py-4 px-5 text-right space-x-2">
                              <Link
                                href={`/${w.slug}`}
                                target="_blank"
                                className="inline-flex items-center gap-1 px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg text-[11px] font-semibold transition-all"
                              >
                                <span>Gör</span>
                                <ArrowUpRight className="w-3 h-3" />
                              </Link>
                              <button
                                onClick={() => handleDeleteInvitation(w.id, title)}
                                className="p-1.5 bg-rose-500/10 hover:bg-rose-500/30 text-rose-400 rounded-lg text-[11px] transition-all cursor-pointer"
                                title="Davetiyeyi Sil"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 4: CONTACT MESSAGES INBOX */}
        {/* ============================================================ */}
        {activeTab === 'contacts' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Search & Filter */}
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-[#0f111e]/90 p-4 rounded-2xl border border-white/10">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={contactSearch}
                  onChange={e => setContactSearch(e.target.value)}
                  placeholder="Mesaj gönderen, e-posta veya konu ara..."
                  className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="flex gap-2 w-full sm:w-auto">
                {['all', 'new', 'read', 'archived'].map(status => (
                  <button
                    key={status}
                    onClick={() => setContactFilter(status)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                      contactFilter === status
                        ? 'bg-rose-500 text-white'
                        : 'bg-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    {status === 'all' ? 'Tümü' : status === 'new' ? 'Yeni' : status === 'read' ? 'Okundu' : 'Arşiv'}
                  </button>
                ))}
              </div>
            </div>

            {/* Messages List */}
            <div className="bg-[#0f111e]/90 border border-white/10 rounded-3xl overflow-hidden shadow-xl">
              {contacts.length === 0 ? (
                <div className="p-12 text-center text-slate-500 text-xs">
                  Henüz gelen bir iletişim mesajı bulunmamaktadır.
                </div>
              ) : (
                <div className="divide-y divide-white/5">
                  {contacts.map(msg => (
                    <div
                      key={msg.id}
                      onClick={() => setSelectedContact(msg)}
                      className={`p-5 hover:bg-white/[0.03] transition-colors cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                        msg.status === 'new' ? 'bg-rose-500/[0.03] border-l-4 border-rose-500' : ''
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2.5">
                          <span className="font-bold text-white text-xs">{msg.name}</span>
                          <span className="text-slate-400 text-[11px] font-mono">({msg.email})</span>
                          {msg.status === 'new' && (
                            <span className="px-2 py-0.2 bg-rose-500 text-white text-[9px] font-bold rounded-full">
                              YENİ
                            </span>
                          )}
                        </div>
                        <p className="font-semibold text-slate-200 text-xs">{msg.subject}</p>
                        <p className="text-slate-400 text-xs line-clamp-1">{msg.message}</p>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-slate-500 font-mono shrink-0">
                        <span>{formatDateTime(msg.created_at)}</span>
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 5: SYSTEM & MAINTENANCE & ANNOUNCEMENT */}
        {/* ============================================================ */}
        {activeTab === 'system' && (
          <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto">
            {settingsSuccess && (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>{settingsSuccess}</span>
              </div>
            )}

            {/* 1. Maintenance Mode Box */}
            <div className="bg-[#0f111e]/90 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-xl">
              <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                  <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400 mb-1">
                    <AlertTriangle className="w-4 h-4" />
                    Sistem Bakım Modu (Maintenance Control)
                  </div>
                  <h3 className="text-xl font-bold text-white font-serif">Platform Bakım Anahtarı</h3>
                  <p className="text-xs text-slate-400 mt-1 max-w-xl leading-relaxed">
                    Bakım modu açıldığında ana sayfa ve yönetim paneli geçici bakım ekranına alınır. 
                    <strong className="text-slate-200"> Varsayılan olarak mevcut yayınlanmış davetiye linkleri çalışmaya devam eder</strong>.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setMaintenanceForm({
                      enabled: !isMaintenanceActive,
                      scope: settings?.maintenance_scope || 'platform',
                      message: settings?.maintenance_message || '',
                      until: settings?.maintenance_until || ''
                    });
                    setMaintenanceModalOpen(true);
                  }}
                  className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer shrink-0 shadow-lg ${
                    isMaintenanceActive 
                      ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-amber-500/20' 
                      : 'bg-white/10 hover:bg-rose-500 text-white'
                  }`}
                >
                  {isMaintenanceActive ? 'Bakım Modunu Kapat' : 'Bakım Modunu Aç'}
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-xs text-slate-400 flex items-center justify-between">
                <div>
                  Mevcut Durum: <strong className={isMaintenanceActive ? 'text-amber-400' : 'text-emerald-400'}>{isMaintenanceActive ? 'BAKIMDA' : 'CANLI'}</strong>
                  {isMaintenanceActive && (
                    <span className="ml-2 text-slate-400">
                      (Kapsam: {settings?.maintenance_scope === 'full' ? 'Tam Bakım (Her Yer Kapalı)' : 'Platform Bakımı (Davetiyeler Açık)'})
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-slate-500">Super Admin Bypass: Aktif</span>
              </div>
            </div>

            {/* 2. Platform Announcement Banner Settings */}
            <form onSubmit={handleSaveSettings} className="space-y-6">
              <div className="bg-[#0f111e]/90 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-xl space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white font-serif">Platform Duyuru Bandı</h3>
                    <p className="text-xs text-slate-400">Tüm kullanıcılara gösterilecek üst bilgi duyurusu.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings?.announcement_enabled || false}
                      onChange={e => setSettings({ ...settings, announcement_enabled: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-500"></div>
                  </label>
                </div>

                {settings?.announcement_enabled && (
                  <div className="space-y-4 pt-2 border-t border-white/5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">Duyuru Türü</label>
                      <select
                        value={settings?.announcement_type || 'info'}
                        onChange={e => setSettings({ ...settings, announcement_type: e.target.value })}
                        className="w-full bg-[#141424] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white"
                      >
                        <option value="info">Bilgilendirme (Mavi/Nötr)</option>
                        <option value="maintenance">Kısa Bakım Bildirimi (Turuncu)</option>
                        <option value="important">Önemli Sistem Uyarısı (Kırmızı)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">Duyuru Metni</label>
                      <input
                        type="text"
                        value={settings?.announcement_message || ''}
                        onChange={e => setSettings({ ...settings, announcement_message: e.target.value })}
                        placeholder="Örn: 21 Ağustos 23:00 - 23:30 arasında kısa bakım çalışması gerçekleştirilecektir."
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* 3. Platform Contact Info Settings */}
              <div className="bg-[#0f111e]/90 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-xl space-y-5">
                <div>
                  <h3 className="text-lg font-bold text-white font-serif">Platform İletişim Bilgileri</h3>
                  <p className="text-xs text-slate-400">Footer ve iletişim sayfasında yer alan kurumsal iletişim bilgileri.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Destek E-posta</label>
                    <input
                      type="email"
                      value={settings?.contact_email || ''}
                      onChange={e => setSettings({ ...settings, contact_email: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Destek Telefon / WhatsApp</label>
                    <input
                      type="text"
                      value={settings?.contact_phone || ''}
                      onChange={e => setSettings({ ...settings, contact_phone: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Ofis / Şirket Adresi</label>
                  <input
                    type="text"
                    value={settings?.contact_address || ''}
                    onChange={e => setSettings({ ...settings, contact_address: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={settingsSaving}
                    className="px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-rose-500/25 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {settingsSaving ? 'Kaydediliyor...' : 'Tüm Ayarları Kaydet'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 6: AUDIT LOGS */}
        {/* ============================================================ */}
        {activeTab === 'audit' && (
          <div className="space-y-6 animate-fadeIn max-w-4xl mx-auto">
            <div className="bg-[#0f111e]/90 border border-white/10 rounded-3xl p-6 backdrop-blur-xl shadow-xl">
              <h3 className="text-base font-bold text-white mb-4 font-serif flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                Yönetimsel Eylem & Güvenlik Denetim Logları
              </h3>

              {auditLogs.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-xs">
                  Henüz kaydedilmiş denetim kaydı yok.
                </div>
              ) : (
                <div className="space-y-3">
                  {auditLogs.map(log => (
                    <div key={log.id} className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 flex items-start justify-between gap-4 text-xs">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-rose-400">{log.action}</span>
                          <span className="text-slate-500">•</span>
                          <span className="text-slate-300 font-semibold">{log.actor_email || 'Super Admin'}</span>
                        </div>
                        {log.details && (
                          <pre className="text-[10px] text-slate-500 font-mono bg-black/30 p-2 rounded-lg max-w-xl overflow-x-auto">
                            {JSON.stringify(log.details, null, 2)}
                          </pre>
                        )}
                      </div>
                      <span className="text-slate-500 font-mono text-[11px] shrink-0">
                        {formatDateTime(log.created_at)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

      </main>

      {/* ============================================================ */}
      {/* DRAWER: MEMBER DETAIL */}
      {/* ============================================================ */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-xl bg-[#0f111e] border-l border-white/10 h-full p-6 sm:p-8 overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <h2 className="text-xl font-bold text-white font-serif flex items-center gap-2">
                <Users className="w-5 h-5 text-rose-400" />
                Üye Detay Kartı
              </h2>
              <button
                onClick={() => setSelectedUser(null)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Profile Overview */}
            <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 to-indigo-600 text-white font-extrabold flex items-center justify-center text-lg shadow-md">
                  {(selectedUser.first_name || selectedUser.email || 'U')[0].toUpperCase()}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">{selectedUser.full_name}</h3>
                  <p className="text-xs text-slate-400 font-mono">{selectedUser.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs pt-3 border-t border-white/5">
                <div>
                  <span className="text-slate-500 block mb-0.5">Telefon</span>
                  <span className="text-slate-200 font-mono">{selectedUser.phone || 'Eklenmemiş'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block mb-0.5">Şehir / Ülke</span>
                  <span className="text-slate-200">{selectedUser.city || 'İstanbul'}, {selectedUser.country || 'Türkiye'}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-500 block mb-0.5">Açık Adres</span>
                  <span className="text-slate-300">{selectedUser.address || 'Adres detayı belirtilmemiş.'}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-500 block mb-0.5">Üyelik Tarihi & Saati</span>
                  <span className="text-slate-200 font-mono font-semibold">{formatDateTime(selectedUser.created_at)}</span>
                </div>
              </div>
            </div>

            {/* Invitation Intelligence */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-bold text-white">Üyenin Davetiyeleri</h4>
                <div className="text-xs space-x-2">
                  <span className="text-slate-400">Toplam: <strong>{selectedUser.total_invitations}</strong></span>
                  <span className="text-emerald-400">Yayında: <strong>{selectedUser.published_invitations}</strong></span>
                  <span className="text-amber-400">Taslak: <strong>{selectedUser.draft_invitations}</strong></span>
                </div>
              </div>

              {selectedUser.invitations && selectedUser.invitations.length > 0 ? (
                <div className="space-y-2.5">
                  {selectedUser.invitations.map((inv: any) => (
                    <div key={inv.id} className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between gap-3 text-xs">
                      <div>
                        <p className="font-bold text-white">{inv.title}</p>
                        <p className="text-rose-400 font-mono text-[11px]">/{inv.slug}</p>
                        <p className="text-slate-500 text-[10px]">{inv.event_type} • {inv.template_id}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          inv.is_paid ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                        }`}>
                          {inv.is_paid ? 'Yayında' : 'Taslak'}
                        </span>
                        <Link
                          href={`/${inv.slug}`}
                          target="_blank"
                          className="p-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg"
                          title="Önizle"
                        >
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 p-4 bg-white/[0.01] rounded-xl text-center border border-white/5">
                  Bu üyeye ait henüz oluşturulmuş bir davetiye bulunmuyor.
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-white/10 flex justify-between items-center">
              <button
                onClick={() => handleToggleSuspend(selectedUser.id, selectedUser.is_suspended)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedUser.is_suspended
                    ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                    : 'bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30'
                }`}
              >
                {selectedUser.is_suspended ? 'Hesap Askısını Kaldır' : 'Hesabı Askıya Al'}
              </button>

              <button
                onClick={() => setSelectedUser(null)}
                className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: CONTACT MESSAGE DETAIL */}
      {/* ============================================================ */}
      {selectedContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg bg-[#0f111e] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-rose-400" />
                <h3 className="text-lg font-bold text-white font-serif">İletişim Mesajı</h3>
              </div>
              <button
                onClick={() => setSelectedContact(null)}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-white/[0.02] p-3.5 rounded-xl border border-white/5">
                <div>
                  <span className="text-slate-500 block mb-0.5">Gönderen</span>
                  <span className="font-bold text-white">{selectedContact.name}</span>
                </div>
                <div>
                  <span className="text-slate-500 block mb-0.5">E-posta</span>
                  <a href={`mailto:${selectedContact.email}`} className="text-rose-400 hover:underline font-mono">{selectedContact.email}</a>
                </div>
                {selectedContact.phone && (
                  <div>
                    <span className="text-slate-500 block mb-0.5">Telefon</span>
                    <span className="text-slate-300 font-mono">{selectedContact.phone}</span>
                  </div>
                )}
                <div>
                  <span className="text-slate-500 block mb-0.5">Tarih</span>
                  <span className="text-slate-400 font-mono">{formatDateTime(selectedContact.created_at)}</span>
                </div>
              </div>

              <div>
                <span className="text-slate-500 block mb-1 font-semibold">Konu:</span>
                <p className="font-bold text-white text-sm">{selectedContact.subject}</p>
              </div>

              <div>
                <span className="text-slate-500 block mb-1 font-semibold">Mesaj:</span>
                <div className="p-4 bg-white/[0.03] border border-white/5 rounded-2xl text-slate-300 leading-relaxed text-xs max-h-60 overflow-y-auto whitespace-pre-wrap">
                  {selectedContact.message}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
              <div className="flex gap-2">
                <button
                  onClick={() => handleContactStatus(selectedContact.id, 'read')}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold cursor-pointer"
                >
                  Okundu Olarak İşaretle
                </button>
                <button
                  onClick={() => handleContactStatus(selectedContact.id, 'archived')}
                  className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white text-xs font-semibold cursor-pointer"
                >
                  Arşivle
                </button>
              </div>

              <a
                href={`mailto:${selectedContact.email}?subject=Re: ${encodeURIComponent(selectedContact.subject)}`}
                className="px-4 py-2 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md shadow-rose-500/25"
              >
                <Send className="w-3.5 h-3.5" />
                <span>E-posta ile Yanıtla</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: MAINTENANCE CONFIRMATION */}
      {/* ============================================================ */}
      {maintenanceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg bg-[#0f111e] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white font-serif">
                  {maintenanceForm.enabled ? 'Bakım Modunu Başlat' : 'Bakım Modunu Kapat'}
                </h3>
                <p className="text-xs text-slate-400">Lütfen bakım kapsamını ve ziyaretçi mesajını onaylayın.</p>
              </div>
            </div>

            {maintenanceForm.enabled ? (
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1.5">Bakım Kapsamı</label>
                  <div className="space-y-2">
                    <label className="flex items-start gap-2.5 p-3 rounded-xl bg-white/[0.03] border border-white/5 cursor-pointer">
                      <input
                        type="radio"
                        name="scope"
                        checked={maintenanceForm.scope === 'platform'}
                        onChange={() => setMaintenanceForm({ ...maintenanceForm, scope: 'platform' })}
                        className="mt-0.5 text-rose-500"
                      />
                      <div>
                        <strong className="text-white block">Platform Bakımı (Önerilen)</strong>
                        <span className="text-slate-400 text-[11px]">
                          Ana sayfa, kayıt ve stüdyo bakım moduna geçer; <strong>mevcut yayınlanmış davetiyeler çalışmaya devam eder</strong>.
                        </span>
                      </div>
                    </label>

                    <label className="flex items-start gap-2.5 p-3 rounded-xl bg-rose-500/[0.05] border border-rose-500/20 cursor-pointer">
                      <input
                        type="radio"
                        name="scope"
                        checked={maintenanceForm.scope === 'full'}
                        onChange={() => setMaintenanceForm({ ...maintenanceForm, scope: 'full' })}
                        className="mt-0.5 text-rose-500"
                      />
                      <div>
                        <strong className="text-rose-300 block">Tam Bakım (Acil Durum)</strong>
                        <span className="text-slate-400 text-[11px]">
                          Yayınlanan davetiyeler dahil tüm platform bakım ekranına alınır.
                        </span>
                      </div>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1.5">Ziyaretçi Mesajı</label>
                  <textarea
                    rows={3}
                    value={maintenanceForm.message}
                    onChange={e => setMaintenanceForm({ ...maintenanceForm, message: e.target.value })}
                    placeholder="Sistemlerimizde kısa süreli bir bakım çalışması yapılmaktadır..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white"
                  />
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-300 bg-white/[0.02] p-4 rounded-xl border border-white/5 leading-relaxed">
                Bakım modu kapatıldığında platform tüm ziyaretçiler için anında canlı kullanıma açılacaktır.
              </p>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setMaintenanceModalOpen(false)}
                className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold cursor-pointer"
              >
                Vazgeç
              </button>
              <button
                type="button"
                onClick={handleConfirmMaintenance}
                disabled={settingsSaving}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold shadow-lg transition-all cursor-pointer disabled:opacity-50 ${
                  maintenanceForm.enabled 
                    ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-amber-500/20'
                    : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20'
                }`}
              >
                {settingsSaving ? 'Uygulanıyor...' : maintenanceForm.enabled ? 'Bakım Modunu Aktif Et' : 'Sistemi Canlıya Al'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
