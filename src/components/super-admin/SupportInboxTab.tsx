'use client';

import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  User,
  Mail,
  Send,
  Sparkles,
  ShieldAlert,
  ChevronRight
} from 'lucide-react';

export default function SupportInboxTab() {
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedConv, setSelectedConv] = useState<any | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [replyText, setReplyText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isSending, setIsSending] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchConversations();
  }, [statusFilter, categoryFilter, searchTerm]);

  const fetchConversations = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (categoryFilter !== 'all') params.append('category', categoryFilter);
      if (searchTerm.trim()) params.append('search', searchTerm.trim());

      const res = await fetch(`/api/super-admin/support?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setConversations(data.conversations || []);
      }
    } catch {
      // Ignore
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectConversation = async (conv: any) => {
    setSelectedConv(conv);
    try {
      // Mark read
      await fetch('/api/super-admin/support', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: conv.id, mark_read: true })
      });

      const res = await fetch(`/api/support/conversations/${conv.id}/messages`);
      const data = await res.json();
      if (data.success) {
        setMessages(data.messages || []);
      }
      fetchConversations();
    } catch {
      // Ignore
    }
  };

  const handleSendReply = async (newStatus: string = 'waiting_user') => {
    if (!replyText.trim() || !selectedConv) return;

    setIsSending(true);
    try {
      const res = await fetch('/api/super-admin/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversation_id: selectedConv.id,
          message: replyText.trim(),
          sender_name: 'Super Admin',
          status: newStatus
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setMessages(prev => [...prev, data.newMessage]);
        setReplyText('');
        setSelectedConv((prev: any) => ({ ...prev, status: newStatus, unread_admin: false }));
        fetchConversations();
      }
    } catch {
      // Ignore
    } finally {
      setIsSending(false);
    }
  };

  const handleUpdateStatus = async (status: string) => {
    if (!selectedConv) return;
    try {
      await fetch('/api/super-admin/support', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selectedConv.id, status })
      });
      setSelectedConv((prev: any) => ({ ...prev, status }));
      fetchConversations();
    } catch {
      // Ignore
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-rose-600" />
            <h2 className="text-base font-bold text-slate-900">Destek Merkezi & Müşteri Talepleri</h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Kullanıcılardan gelen canlı destek ve yardım mesajlarını tek merkezden yönetin ve yanıtlayın.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Talep veya e-posta ara..."
              className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-rose-500/20 w-48 sm:w-60"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700"
          >
            <option value="all">Tüm Durumlar</option>
            <option value="open">Açık Talepler</option>
            <option value="waiting_admin">Admin Bekliyor</option>
            <option value="waiting_user">Kullanıcı Bekliyor</option>
            <option value="resolved">Çözüldü</option>
            <option value="closed">Kapatıldı</option>
          </select>
        </div>
      </div>

      {/* Main Split Layout: Tickets List vs Active Conversation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Tickets List (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col max-h-[680px]">
          <div className="p-3 bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-700 flex justify-between items-center">
            <span>Talepler ({conversations.length})</span>
            {conversations.filter(c => c.unread_admin).length > 0 && (
              <span className="px-2 py-0.5 bg-rose-600 text-white rounded-full text-[10px] font-black animate-pulse">
                {conversations.filter(c => c.unread_admin).length} Okunmamış
              </span>
            )}
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {conversations.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p>Kriterlere uygun destek talebi bulunamadı.</p>
              </div>
            ) : (
              conversations.map(conv => {
                const isSelected = selectedConv?.id === conv.id;
                return (
                  <div
                    key={conv.id}
                    onClick={() => handleSelectConversation(conv)}
                    className={`p-3.5 transition cursor-pointer flex flex-col gap-1.5 ${
                      isSelected ? 'bg-rose-50/70 border-l-4 border-rose-600' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 truncate">
                        {conv.unread_admin && (
                          <div className="w-2 h-2 rounded-full bg-rose-600 shrink-0" />
                        )}
                        <span className="text-xs font-bold text-slate-900 truncate">{conv.subject}</span>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                        conv.status === 'open' ? 'bg-amber-100 text-amber-800' :
                        conv.status === 'waiting_admin' ? 'bg-rose-100 text-rose-800 font-extrabold' :
                        conv.status === 'resolved' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {conv.status === 'open' ? 'Açık' :
                         conv.status === 'waiting_admin' ? 'Cevap Bekliyor' :
                         conv.status === 'waiting_user' ? 'Kullanıcıda' :
                         conv.status === 'resolved' ? 'Çözüldü' : 'Kapalı'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span className="truncate max-w-[180px]">{conv.guest_email || conv.guest_name || 'Misafir'}</span>
                      <span>{new Date(conv.last_message_at).toLocaleDateString('tr-TR')}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Conversation Thread & Actions (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col min-h-[500px] max-h-[680px]">
          {selectedConv ? (
            <>
              {/* Thread Header */}
              <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{selectedConv.subject}</h3>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                    <User className="w-3 h-3 text-slate-400" />
                    <span>{selectedConv.guest_name || 'İsimsiz'}</span>
                    <span>•</span>
                    <Mail className="w-3 h-3 text-slate-400" />
                    <span>{selectedConv.guest_email || 'E-posta yok'}</span>
                    <span>•</span>
                    <span className="font-semibold text-rose-600">{selectedConv.category}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus('resolved')}
                    className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[11px] font-bold rounded-lg border border-emerald-200 transition flex items-center gap-1 cursor-pointer"
                  >
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Çözüldü</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus('closed')}
                    className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold rounded-lg transition cursor-pointer"
                  >
                    Kapat
                  </button>
                </div>
              </div>

              {/* Message List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50">
                {messages.map((msg, idx) => {
                  const isAdmin = msg.sender_type === 'admin';
                  return (
                    <div
                      key={msg.id || idx}
                      className={`p-3 rounded-2xl text-xs max-w-[80%] space-y-1 ${
                        isAdmin
                          ? 'bg-rose-600 text-white ml-auto shadow-xs'
                          : 'bg-white text-slate-900 mr-auto border border-slate-200 shadow-xs'
                      }`}
                    >
                      <div className={`flex items-center justify-between gap-3 text-[10px] ${isAdmin ? 'text-white/80' : 'text-slate-400'}`}>
                        <span className="font-bold">{msg.sender_name}</span>
                        <span>{new Date(msg.created_at).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <p className="leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                    </div>
                  );
                })}
              </div>

              {/* Reply Box */}
              <div className="p-4 border-t border-slate-200 bg-white space-y-2">
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Kullanıcıya yanıtınızı yazın..."
                  rows={3}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-rose-500/20 resize-none"
                />

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    disabled={isSending || !replyText.trim()}
                    onClick={() => handleSendReply('resolved')}
                    className="px-3 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl hover:bg-emerald-700 transition disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Yanıtla & Çözüldü Yap</span>
                  </button>

                  <button
                    type="button"
                    disabled={isSending || !replyText.trim()}
                    onClick={() => handleSendReply('waiting_user')}
                    className="px-4 py-2 bg-rose-600 text-white text-xs font-bold rounded-xl hover:bg-rose-700 transition disabled:opacity-50 flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSending ? 'Gönderiliyor...' : 'Yanıt Gönder'}</span>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-slate-400">
              <MessageSquare className="w-12 h-12 mb-3 opacity-30" />
              <h4 className="text-sm font-bold text-slate-700">Bir Destek Talebi Seçin</h4>
              <p className="text-xs text-slate-400 max-w-xs mt-1">
                Sol listeden bir talebe tıklayarak mesaj geçmişini görebilir ve yanıt yazabilirsiniz.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
