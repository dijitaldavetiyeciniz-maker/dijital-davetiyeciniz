'use client';

import React, { useState, useEffect } from 'react';
import { MessageSquare, X, Send, Clock, CheckCircle2, AlertCircle, Sparkles, User, Mail, ShieldAlert } from 'lucide-react';

interface SupportWidgetProps {
  weddingId?: string;
  defaultEmail?: string;
  defaultName?: string;
}

export default function SupportWidget({ weddingId, defaultEmail = '', defaultName = '' }: SupportWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'new_ticket' | 'my_tickets' | 'thread'>('new_ticket');

  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('Genel Soru');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState(defaultEmail);
  const [name, setName] = useState(defaultName);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Tickets list and active conversation thread
  const [myTickets, setMyTickets] = useState<any[]>([]);
  const [activeConversation, setActiveConversation] = useState<any | null>(null);
  const [threadMessages, setThreadMessages] = useState<any[]>([]);
  const [replyText, setReplyText] = useState('');
  const [isSendingReply, setIsSendingReply] = useState(false);

  const categories = [
    'Genel Soru',
    'Ödeme & Planlar',
    'Tasarım & Şablon',
    'Özel Alan Adı',
    'Teknik Destek'
  ];

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) {
      setErrorMessage('Lütfen konu ve mesajınızı yazın.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const res = await fetch('/api/support/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: subject.trim(),
          category,
          message: message.trim(),
          guest_email: email.trim(),
          guest_name: name.trim(),
          wedding_id: weddingId
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Destek talebi oluşturulamadı.');
      }

      setSuccessMessage('Talebiniz başarıyla iletildi! Temsilcimiz en kısa sürede yanıtlayacaktır.');
      setSubject('');
      setMessage('');
      if (email.trim()) {
        fetchTickets(email.trim());
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Bir hata oluştu.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fetchTickets = async (userEmail: string) => {
    if (!userEmail) return;
    try {
      const res = await fetch(`/api/support/conversations?email=${encodeURIComponent(userEmail)}`);
      const data = await res.json();
      if (data.success) {
        setMyTickets(data.conversations || []);
      }
    } catch {
      // Ignore
    }
  };

  const openThread = async (conv: any) => {
    setActiveConversation(conv);
    setActiveTab('thread');
    try {
      const res = await fetch(`/api/support/conversations/${conv.id}/messages`);
      const data = await res.json();
      if (data.success) {
        setThreadMessages(data.messages || []);
      }
    } catch {
      // Ignore
    }
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !activeConversation) return;

    setIsSendingReply(true);
    try {
      const res = await fetch(`/api/support/conversations/${activeConversation.id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: replyText.trim(),
          sender_name: name || email || 'Kullanıcı',
          sender_type: 'user'
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setThreadMessages(prev => [...prev, data.newMessage]);
        setReplyText('');
      }
    } catch {
      // Ignore
    } finally {
      setIsSendingReply(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        data-testid="support-widget-trigger"
        className="fixed bottom-6 right-6 z-50 p-3.5 bg-rose-600 text-white rounded-full shadow-2xl hover:bg-rose-700 hover:scale-105 active:scale-95 transition flex items-center justify-center cursor-pointer border-2 border-white"
        aria-label="Destek Merkezi"
      >
        {isOpen ? <X className="w-5 h-5" /> : <MessageSquare className="w-5 h-5" />}
      </button>

      {/* Support Dialog */}
      {isOpen && (
        <div
          role="dialog"
          aria-labelledby="support-dialog-title"
          className="fixed bottom-20 right-4 sm:right-6 z-50 w-[calc(100vw-32px)] sm:w-[400px] max-h-[580px] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-200"
        >
          {/* Header */}
          <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-rose-500 flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <div>
                <h3 id="support-dialog-title" className="text-xs font-bold">Destek Merkezi</h3>
                <p className="text-[10px] text-slate-400">Canlı Destek & İletişim</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition"
              aria-label="Kapat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Sub Navigation */}
          <div className="flex border-b border-slate-100 bg-slate-50 text-xs font-bold">
            <button
              type="button"
              onClick={() => { setActiveTab('new_ticket'); setSuccessMessage(null); }}
              className={`flex-1 py-2.5 text-center transition ${
                activeTab === 'new_ticket' ? 'bg-white text-rose-600 border-b-2 border-rose-600' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Yeni Talep
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab('my_tickets'); if (email) fetchTickets(email); }}
              className={`flex-1 py-2.5 text-center transition ${
                activeTab === 'my_tickets' || activeTab === 'thread' ? 'bg-white text-rose-600 border-b-2 border-rose-600' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Taleplerim {myTickets.length > 0 && `(${myTickets.length})`}
            </button>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-4 text-xs">
            {/* TAB 1: NEW TICKET */}
            {activeTab === 'new_ticket' && (
              <form onSubmit={handleCreateTicket} className="space-y-3">
                {successMessage && (
                  <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{successMessage}</span>
                  </div>
                )}

                {errorMessage && (
                  <div className="p-3 bg-rose-50 text-rose-800 rounded-xl border border-rose-200 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Kategori</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Konu</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Örn: Özel alan adı yönlendirme sorunu"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Adınız</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ad Soyad"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">E-posta</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="ornek@mail.com"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Mesajınız</label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={3}
                    placeholder="Nasıl yardımcı olabiliriz? Detayları buraya yazabilirsiniz..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 resize-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Gönderiliyor...' : 'Talebi İlet'}</span>
                </button>
              </form>
            )}

            {/* TAB 2: MY TICKETS */}
            {activeTab === 'my_tickets' && (
              <div className="space-y-3">
                <div className="flex gap-2 mb-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="E-postanızı girin..."
                    className="flex-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={() => fetchTickets(email)}
                    className="px-3 py-1.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800"
                  >
                    Sorgula
                  </button>
                </div>

                {myTickets.length === 0 ? (
                  <div className="text-center py-8 text-slate-400">
                    <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    <p>Henüz açık bir destek talebiniz bulunmuyor.</p>
                  </div>
                ) : (
                  myTickets.map(conv => (
                    <div
                      key={conv.id}
                      onClick={() => openThread(conv)}
                      className="p-3 bg-slate-50 hover:bg-slate-100/80 rounded-2xl border border-slate-200 cursor-pointer transition space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 truncate max-w-[200px]">{conv.subject}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          conv.status === 'open' ? 'bg-amber-100 text-amber-800' :
                          conv.status === 'waiting_user' ? 'bg-rose-100 text-rose-800 font-extrabold animate-pulse' :
                          conv.status === 'resolved' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {conv.status === 'open' ? 'Açık' :
                           conv.status === 'waiting_user' ? 'Yanıtlandı' :
                           conv.status === 'resolved' ? 'Çözüldü' : 'Kapalı'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-slate-400">
                        <span>{conv.category}</span>
                        <span>{new Date(conv.last_message_at).toLocaleDateString('tr-TR')}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* TAB 3: THREAD */}
            {activeTab === 'thread' && activeConversation && (
              <div className="flex flex-col h-full space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div>
                    <h4 className="font-bold text-slate-800 truncate max-w-[220px]">{activeConversation.subject}</h4>
                    <span className="text-[10px] text-slate-400">{activeConversation.category}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('my_tickets')}
                    className="text-[11px] font-bold text-rose-600 hover:underline"
                  >
                    Geri
                  </button>
                </div>

                <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
                  {threadMessages.map((msg, idx) => (
                    <div
                      key={msg.id || idx}
                      className={`p-2.5 rounded-2xl text-xs max-w-[85%] ${
                        msg.sender_type === 'admin'
                          ? 'bg-rose-50 border border-rose-100 text-slate-900 mr-auto'
                          : 'bg-slate-900 text-white ml-auto'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 text-[10px] opacity-70 mb-1">
                        <span className="font-bold">{msg.sender_name}</span>
                        <span>{new Date(msg.created_at).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <p className="leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                    </div>
                  ))}
                </div>

                {activeConversation.status !== 'closed' && (
                  <form onSubmit={handleSendReply} className="flex gap-2 pt-2 border-t border-slate-100">
                    <input
                      type="text"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Cevabınızı yazın..."
                      className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 text-xs"
                    />
                    <button
                      type="submit"
                      disabled={isSendingReply || !replyText.trim()}
                      className="p-2 bg-rose-600 text-white rounded-xl hover:bg-rose-700 transition disabled:opacity-50"
                      aria-label="Cevap Gönder"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
