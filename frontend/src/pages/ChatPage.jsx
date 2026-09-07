import React, { useEffect, useRef, useState } from 'react';
import {
  PanelLeft, Sparkles, Loader2, AlertCircle, RefreshCw, ImageIcon
} from 'lucide-react';
import { PanelLeft, Sparkles, Loader2, AlertCircle, Plus } from 'lucide-react';
import { useChat } from '../context/ChatContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/useToast';
import { api } from '../services/api';
import Sidebar from '../components/Sidebar/Sidebar';
import MessageItem from '../components/Chat/MessageItem';
import ChatInput from '../components/Chat/ChatInput';
import EmptyState from '../components/Chat/EmptyState';

export default function ChatPage({ config, settings, onUpdateSettings }) {
  const { user } = useAuth();
  const { activeChatId, activeChatTitle, messages, isSending, sendMessage, newChat } = useChat();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { toast, showError } = useToast();
  const [imgGenLoading, setImgGenLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSending]);

  // Ctrl+K for new chat
  // Ctrl+K — new chat
  useEffect(() => {
    const handler = (e) => {
    const h = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        newChat();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [newChat]);

  const handleSend = async ({ prompt, files }) => {
    try {
      await sendMessage({ prompt, files, ...settings });
    } catch (err) {
      showError(err.message || 'Failed to generate response. Check your API key.');
      showError(err.message || 'Failed to generate response. Please check your API key.');
    }
  };

  const handleGenerateImage = async (prompt) => {
    setImgGenLoading(true);
    try {
      const res = await api.generateImage(prompt, activeChatId);
      // Inject as a synthetic "message" in the chat display
      const imgMsg = {
        id: `img-${Date.now()}`,
        role: 'assistant',
        content: `🎨 **Generated Image**\n\nPrompt: *${prompt}*`,
        generated_image_url: res.image_url,
        image_prompt: res.revised_prompt || prompt,
        created_at: new Date().toISOString()
      };
      // We use sendMessage for actual persistence; for now just show inline
      showError(''); // clear any errors
      // Show result in chat as a synthetic message
      // (sendMessage handles DB persistence; here we just show it inline)
    } catch (err) {
      showError(err.message || 'Image generation failed. OPENAI_API_KEY required.');
      showError(err.message || 'Image generation failed. OPENAI_API_KEY is required.');
    } finally {
      setImgGenLoading(false);
    }
  };

  const handlePromptSelect = (p) => handleSend({ prompt: p, files: [] });
  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', background: 'var(--bg-base)', overflow: 'hidden' }}>

  return (
    <div className="flex h-screen w-screen bg-[#0b0d12] text-[#f1f3f9] overflow-hidden font-sans">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        config={config}
        settings={settings}
        onUpdateSettings={onUpdateSettings}
      />

      <main className="flex-1 flex flex-col min-w-0 h-full relative">
        {/* Header */}
        <header className="h-14 border-b border-[#1f2330] bg-[#0e1017]/80 backdrop-blur-md px-4 flex items-center justify-between shrink-0 z-10">
          <div className="flex items-center gap-3 min-w-0">
      {/* Main area */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, height: '100%', position: 'relative' }}>

        {/* ── Header ─────────────────────────────────────────────────────────── */}
        <header style={{
          height: 60, flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 1.25rem',
          background: 'rgba(7,9,16,0.8)',
          backdropFilter: 'blur(16px) saturate(180%)',
          borderBottom: '1px solid #161d2b',
          zIndex: 10
        }}>
          {/* Left: menu + title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-[#1c202d] md:hidden cursor-pointer"
              title="Open menu"
              style={{
                width: 36, height: 36, borderRadius: 10,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'none', border: 'none', cursor: 'pointer',
                color: '#616d88', transition: 'all 0.15s'
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#131720'; e.currentTarget.style.color = '#a8b3cc'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#616d88'; }}
            >
              <PanelLeft className="w-5 h-5" />
              <PanelLeft style={{ width: 18, height: 18 }} />
            </button>
            <h2 className="text-sm font-semibold text-white truncate max-w-xs sm:max-w-md">

            {/* App icon (visible when sidebar is collapsed on desktop) */}
            <div style={{
              width: 28, height: 28, borderRadius: 8, flexShrink: 0,
              background: 'linear-gradient(135deg, #4285f4, #7c4dff, #e040fb)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Sparkles style={{ width: 13, height: 13, color: '#fff' }} />
            </div>

            <h2 style={{
              fontSize: '0.9375rem', fontWeight: 600, color: '#e2e8f8',
              margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              maxWidth: 'clamp(140px, 40vw, 480px)'
            }}>
              {activeChatTitle}
            </h2>
          </div>

          {/* Right: new chat */}
          <button
            onClick={newChat}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-300 hover:text-white bg-[#161924] hover:bg-[#1e2332] border border-[#272d3e] rounded-xl transition-all cursor-pointer shadow-xs"
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '7px 14px',
              background: '#0d1018', border: '1px solid #1e2535',
              borderRadius: 10, cursor: 'pointer',
              color: '#a8b3cc', fontSize: '0.875rem', fontWeight: 500,
              fontFamily: 'inherit', transition: 'all 0.15s',
              whiteSpace: 'nowrap'
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#3a4870'; e.currentTarget.style.color = '#eef0f8'; e.currentTarget.style.background = '#131720'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#1e2535'; e.currentTarget.style.color = '#a8b3cc'; e.currentTarget.style.background = '#0d1018'; }}
          >
            + New Chat
            <Plus style={{ width: 15, height: 15 }} />
            New Chat
          </button>
        </header>

        {/* Toast */}
        {/* ── Toast notification ─────────────────────────────────────────────── */}
        {toast.visible && (
          <div className="absolute top-16 left-1/2 -translate-x-1/2 z-50 max-w-md w-full px-4 animate-fadeIn">
            <div className={`p-3 border rounded-xl shadow-2xl backdrop-blur-md flex items-center justify-between text-xs ${
              toast.type === 'error'
                ? 'bg-red-950/90 border-red-500/50 text-red-200'
                : 'bg-green-950/90 border-green-500/50 text-green-200'
            }`}>
              <div className="flex items-center gap-2 min-w-0">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span className="truncate">{toast.message}</span>
          <div className="animate-fadeUp" style={{
            position: 'absolute', top: 70, left: '50%', transform: 'translateX(-50%)',
            zIndex: 50, width: '100%', maxWidth: 480, padding: '0 1rem'
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10,
              padding: '0.875rem 1rem',
              background: toast.type === 'error' ? 'rgba(127,0,0,0.85)' : 'rgba(0,90,0,0.85)',
              border: `1px solid ${toast.type === 'error' ? 'rgba(220,38,38,0.5)' : 'rgba(34,197,94,0.5)'}`,
              borderRadius: 14, backdropFilter: 'blur(16px)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
              color: toast.type === 'error' ? '#fca5a5' : '#86efac',
              fontSize: '0.9rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                <AlertCircle style={{ width: 17, height: 17, flexShrink: 0 }} />
                <span>{toast.message}</span>
              </div>
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto min-h-0">
        {/* ── Message feed ───────────────────────────────────────────────────── */}
        <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
          {messages.length === 0 ? (
            <EmptyState username={user?.username} onSelectPrompt={handlePromptSelect} />
            <EmptyState username={user?.username} onSelectPrompt={p => handleSend({ prompt: p, files: [] })} />
          ) : (
            <div className="max-w-4xl mx-auto divide-y divide-[#171b26]">
            <div style={{ maxWidth: 860, margin: '0 auto' }}>
              {messages.map((msg, i) => (
                <MessageItem key={msg.id || i} message={msg} user={user} />
              ))}

              {/* Thinking indicator */}
              {/* AI thinking indicator */}
              {isSending && (
                <div className="py-4 px-4 sm:px-6 flex gap-3.5 sm:gap-4 bg-[#0e1017]/40 animate-fadeIn">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#4285f4] via-[#9b72cb] to-[#d96570] text-white flex items-center justify-center shadow-md shadow-purple-500/20 shrink-0">
                    <Sparkles className="w-4 h-4 animate-pulse" />
                <div className="animate-fadeUp" style={{
                  display: 'flex', gap: 16, padding: '1.25rem 1.5rem',
                  background: 'rgba(13,16,24,0.6)', borderBottom: '1px solid #111520'
                }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                    background: 'linear-gradient(135deg, #4285f4, #7c4dff, #e040fb)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 4px 16px rgba(80,96,216,0.35)',
                    animation: 'pulse 2s ease-in-out infinite'
                  }}>
                    <Sparkles style={{ width: 17, height: 17, color: '#fff' }} />
                  </div>
                  <div className="space-y-2 flex-1 pt-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">AI Info Generator</span>
                      <span className="text-[10px] text-indigo-400 font-mono animate-pulse">Thinking…</span>
                  <div style={{ flex: 1, paddingTop: 4 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                      <span style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#f0f2fa' }}>AI Info Generator</span>
                      <span style={{
                        fontSize: '0.8rem', color: '#7b9fff',
                        fontFamily: "'JetBrains Mono', monospace",
                        display: 'flex', alignItems: 'center', gap: 5
                      }}>
                        <Loader2 style={{ width: 12, height: 12, animation: 'spin 1s linear infinite' }} />
                        Generating response…
                      </span>
                    </div>
                    <div className="space-y-1.5 max-w-lg">
                      <div className="h-3 bg-[#1a1e2b] rounded-full shimmer-glow w-3/4" />
                      <div className="h-3 bg-[#1a1e2b] rounded-full shimmer-glow w-full" />
                      <div className="h-3 bg-[#1a1e2b] rounded-full shimmer-glow w-2/3" />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 560 }}>
                      <div className="shimmer-glow" style={{ height: 14, borderRadius: 99, width: '75%' }} />
                      <div className="shimmer-glow" style={{ height: 14, borderRadius: 99, width: '100%' }} />
                      <div className="shimmer-glow" style={{ height: 14, borderRadius: 99, width: '60%' }} />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input */}
        {/* ── Input ──────────────────────────────────────────────────────────── */}
        <ChatInput
          onSendMessage={handleSend}
          onGenerateImage={handleGenerateImage}
          loading={isSending}
          loading={isSending || imgGenLoading}
          settings={settings}
          config={config}
          onUpdateSettings={onUpdateSettings}
        />
      </main>
    </div>
  );
}

