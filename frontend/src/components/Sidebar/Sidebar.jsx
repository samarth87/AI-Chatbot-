import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles, Plus, Search, Trash2, Pencil, Check, X,
  MessageSquare, ChevronDown, LogOut, User, Settings,
  ChevronRight, Cpu
  MessageSquare, ChevronDown, LogOut, Cpu
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useChat } from '../../context/ChatContext';

function groupByDate(chats) {
  const now = new Date();
  const groups = { Today: [], Yesterday: [], 'This Week': [], Older: [] };
  chats.forEach(chat => {
    const d = new Date(chat.updated_at);
    const diff = Math.floor((now - d) / 86400000);
    if (diff === 0) groups.Today.push(chat);
    else if (diff === 1) groups.Yesterday.push(chat);
    else if (diff <= 7) groups['This Week'].push(chat);
    else groups.Older.push(chat);
  });
  return groups;
}

function ChatItem({ chat, isActive, onSelect, onDelete, onRename }) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(chat.title);
  const [hover, setHover] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => { if (editing) inputRef.current?.focus(); }, [editing]);

  const saveRename = () => {
    const t = title.trim();
    if (t && t !== chat.title) onRename(chat.id, t);
    setEditing(false);
  };

  return (
    <div
      className={`group relative flex items-center gap-2 px-3 py-2 rounded-xl cursor-pointer transition-all ${
        isActive ? 'bg-indigo-500/15 border border-indigo-500/30' : 'hover:bg-[#161924] border border-transparent'
      }`}
      className="group"
      onClick={() => !editing && onSelect(chat.id)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 9,
        padding: '9px 10px', borderRadius: 10, cursor: 'pointer',
        background: isActive ? 'rgba(80,96,216,0.14)' : 'transparent',
        border: isActive ? '1px solid rgba(80,96,216,0.25)' : '1px solid transparent',
        transition: 'all 0.15s', position: 'relative'
      }}
      onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = '#131720'; e.currentTarget.style.borderColor = '#1e2535'; } }}
      onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'transparent'; } }}
    >
      <MessageSquare className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-indigo-400' : 'text-gray-500'}`} />
      <MessageSquare style={{
        width: 15, height: 15, flexShrink: 0,
        color: isActive ? '#7b9fff' : '#3d4a68'
      }} />

      {editing ? (
        <input
          ref={inputRef}
          value={title}
          onChange={e => setTitle(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') saveRename(); if (e.key === 'Escape') setEditing(false); }}
          onKeyDown={e => { if (e.key === 'Enter') saveRename(); if (e.key === 'Escape') { setEditing(false); setTitle(chat.title); } }}
          onClick={e => e.stopPropagation()}
          className="flex-1 bg-transparent text-xs text-white focus:outline-none"
          style={{
            flex: 1, background: 'none', border: 'none', outline: 'none',
            color: '#eef0f8', fontSize: '0.875rem', fontFamily: 'inherit'
          }}
        />
      ) : (
        <span className="flex-1 text-xs text-gray-300 truncate">{chat.title}</span>
        <span style={{
          flex: 1, fontSize: '0.875rem', color: isActive ? '#e2e8f8' : '#a8b3cc',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
        }}>
          {chat.title}
        </span>
      )}

      {/* Action icons */}
      <div className={`flex items-center gap-1 shrink-0 ${(hover || editing) ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity`}>
      {/* Actions */}
      <div className="chat-item-actions" style={{
        display: 'flex', gap: 3, flexShrink: 0,
        opacity: 0, transition: 'opacity 0.15s'
      }}
        ref={el => {
          if (el) {
            const p = el.closest('.group');
            if (p) {
              p.addEventListener('mouseenter', () => el.style.opacity = '1');
              p.addEventListener('mouseleave', () => el.style.opacity = '0');
            }
          }
        }}
      >
        {editing ? (
          <>
            <button onClick={e => { e.stopPropagation(); saveRename(); }} className="text-green-400 hover:text-green-300 cursor-pointer"><Check className="w-3 h-3" /></button>
            <button onClick={e => { e.stopPropagation(); setEditing(false); setTitle(chat.title); }} className="text-gray-500 hover:text-gray-300 cursor-pointer"><X className="w-3 h-3" /></button>
            <button onClick={e => { e.stopPropagation(); saveRename(); }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#4ade80', padding: 3, display: 'flex' }}>
              <Check style={{ width: 13, height: 13 }} />
            </button>
            <button onClick={e => { e.stopPropagation(); setEditing(false); setTitle(chat.title); }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#616d88', padding: 3, display: 'flex' }}>
              <X style={{ width: 13, height: 13 }} />
            </button>
          </>
        ) : (
          <>
            <button onClick={e => { e.stopPropagation(); setEditing(true); }} className="text-gray-500 hover:text-gray-300 cursor-pointer" title="Rename"><Pencil className="w-3 h-3" /></button>
            <button onClick={e => { e.stopPropagation(); onDelete(chat.id); }} className="text-gray-500 hover:text-red-400 cursor-pointer" title="Delete"><Trash2 className="w-3 h-3" /></button>
            <button onClick={e => { e.stopPropagation(); setEditing(true); }} title="Rename"
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#616d88', padding: 3, display: 'flex',
                transition: 'color 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.color = '#a8b3cc'}
              onMouseLeave={e => e.currentTarget.style.color = '#616d88'}
            >
              <Pencil style={{ width: 13, height: 13 }} />
            </button>
            <button onClick={e => { e.stopPropagation(); onDelete(chat.id); }} title="Delete"
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#616d88', padding: 3, display: 'flex',
                transition: 'color 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.color = '#f87171'}
              onMouseLeave={e => e.currentTarget.style.color = '#616d88'}
            >
              <Trash2 style={{ width: 13, height: 13 }} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default function Sidebar({ isOpen, onClose, config, settings, onUpdateSettings }) {
  const { user, logout } = useAuth();
  const { chats, activeChatId, loadChats, selectChat, newChat, renameChat, deleteChat } = useChat();
  const [search, setSearch] = useState('');
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => { if (user) loadChats(); }, [user]);

  const filtered = chats.filter(c => c.title.toLowerCase().includes(search.toLowerCase()));
  const grouped = groupByDate(filtered);
  const groupOrder = ['Today', 'Yesterday', 'This Week', 'Older'];

  return (
    <>
      {/* Mobile overlay */}
      {/* Mobile backdrop */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 z-30 md:hidden" onClick={onClose} />
        <div
          onClick={onClose}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)',
            zIndex: 30, display: 'block'
          }}
          className="md:hidden"
        />
      )}

      {/* Sidebar panel */}
      <aside className={`
        fixed md:relative inset-y-0 left-0 z-40 md:z-auto
        w-72 flex flex-col h-full bg-[#0a0c10] border-r border-[#1a1f2e]
        transform transition-transform duration-300
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
      {/* Sidebar */}
      <aside style={{
        position: window.innerWidth < 768 ? 'fixed' : 'relative',
        top: 0, left: 0, bottom: 0, zIndex: window.innerWidth < 768 ? 40 : 'auto',
        width: 272, flexShrink: 0,
        display: 'flex', flexDirection: 'column', height: '100%',
        background: '#0a0c12',
        borderRight: '1px solid #161d2b',
        transform: (window.innerWidth < 768 && !isOpen) ? 'translateX(-100%)' : 'translateX(0)',
        transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1)'
      }}>

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-[#1a1f2e] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#4285f4] via-[#9b72cb] to-[#d96570] flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Sparkles className="w-4 h-4 text-white" />
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '1rem 1rem 0.875rem',
          borderBottom: '1px solid #161d2b'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 34, height: 34, borderRadius: 10, flexShrink: 0,
              background: 'linear-gradient(135deg, #4285f4 0%, #7c4dff 55%, #e040fb 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 16px rgba(80,96,216,0.35)'
            }}>
              <Sparkles style={{ width: 16, height: 16, color: '#fff' }} />
            </div>
            <span className="text-sm font-bold text-white">AI Info Generator</span>
            <span style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#f0f2fa', letterSpacing: '-0.01em' }}>
              AI Info Generator
            </span>
          </div>
          <button onClick={onClose} className="md:hidden p-1 text-gray-500 hover:text-white cursor-pointer"><X className="w-4 h-4" /></button>
          {/* Close (mobile) */}
          <button onClick={onClose} style={{
            background: 'none', border: 'none', cursor: 'pointer', color: '#616d88', display: 'flex', padding: 4
          }}>
            <X style={{ width: 18, height: 18 }} />
          </button>
        </div>

        {/* New chat button */}
        <div className="px-3 pt-3 pb-2 shrink-0">
        {/* New Chat button */}
        <div style={{ padding: '0.875rem 0.875rem 0.5rem' }}>
          <button
            onClick={() => { newChat(); onClose(); }}
            className="w-full flex items-center gap-2 px-3 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition-all shadow-md shadow-indigo-500/20 cursor-pointer"
            style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 8,
              padding: '0.75rem 1rem',
              background: 'linear-gradient(135deg, #3d4fc0, #5a38c4)',
              border: 'none', borderRadius: 12, cursor: 'pointer',
              color: '#fff', fontSize: '0.9rem', fontWeight: 600, fontFamily: 'inherit',
              boxShadow: '0 4px 20px rgba(80,96,216,0.3)',
              transition: 'opacity 0.15s, transform 0.15s'
            }}
            onMouseEnter={e => { e.currentTarget.style.opacity = '0.9'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'none'; }}
          >
            <Plus className="w-4 h-4" />
            New Chat
            <span className="ml-auto text-[10px] text-indigo-300 font-mono">Ctrl+K</span>
            <Plus style={{ width: 18, height: 18 }} />
            New Conversation
            <span style={{ marginLeft: 'auto', fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', fontFamily: "'JetBrains Mono', monospace" }}>
              Ctrl+K
            </span>
          </button>
        </div>

        {/* Search */}
        <div className="px-3 pb-2 shrink-0">
          <div className="flex items-center gap-2 px-3 py-2 bg-[#0e1117] border border-[#1f2330] rounded-xl">
            <Search className="w-3.5 h-3.5 text-gray-500 shrink-0" />
        <div style={{ padding: '0 0.875rem 0.75rem' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '8px 12px',
            background: '#0d1018', border: '1px solid #1e2535', borderRadius: 10
          }}>
            <Search style={{ width: 14, height: 14, color: '#3d4a68', flexShrink: 0 }} />
            <input
              type="text"
              placeholder="Search conversations…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="flex-1 bg-transparent text-xs text-white placeholder:text-gray-500 focus:outline-none"
              style={{
                flex: 1, background: 'none', border: 'none', outline: 'none',
                color: '#eef0f8', fontSize: '0.875rem', fontFamily: 'inherit'
              }}
            />
            {search && <button onClick={() => setSearch('')} className="text-gray-500 hover:text-white cursor-pointer"><X className="w-3 h-3" /></button>}
            {search && (
              <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#616d88', display: 'flex', padding: 0 }}>
                <X style={{ width: 13, height: 13 }} />
              </button>
            )}
          </div>
        </div>

        {/* Chat list */}
        <div className="flex-1 overflow-y-auto px-3 pb-2 space-y-1 scrollbar-thin">
          {Object.entries(grouped).map(([group, items]) =>
            items.length > 0 ? (
              <div key={group}>
                <p className="text-[10px] font-semibold text-gray-600 uppercase tracking-wider px-1 pt-3 pb-1.5">{group}</p>
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 0.75rem 0.5rem' }}>
          {groupOrder.map(group => {
            const items = grouped[group];
            if (!items?.length) return null;
            return (
              <div key={group} style={{ marginBottom: 4 }}>
                <p style={{
                  fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.08em',
                  textTransform: 'uppercase', color: '#3d4a68',
                  padding: '10px 4px 6px', margin: 0
                }}>
                  {group}
                </p>
                {items.map(chat => (
                  <ChatItem
                    key={chat.id}
                    chat={chat}
                    isActive={chat.id === activeChatId}
                    onSelect={(id) => { selectChat(id); onClose(); }}
                    onSelect={id => { selectChat(id); onClose(); }}
                    onDelete={deleteChat}
                    onRename={renameChat}
                  />
                ))}
              </div>
            ) : null
          )}
            );
          })}

          {chats.length === 0 && (
            <p className="text-xs text-gray-600 text-center py-8">No conversations yet. Start a new chat!</p>
            <div style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
              <MessageSquare style={{ width: 28, height: 28, color: '#252f46', margin: '0 auto 12px' }} />
              <p style={{ fontSize: '0.875rem', color: '#3d4a68', margin: 0 }}>No conversations yet</p>
              <p style={{ fontSize: '0.8125rem', color: '#252f46', margin: '4px 0 0' }}>Start a new chat above</p>
            </div>
          )}
          {chats.length > 0 && filtered.length === 0 && (
            <p className="text-xs text-gray-600 text-center py-8">No conversations match your search.</p>
            <p style={{ textAlign: 'center', fontSize: '0.875rem', color: '#3d4a68', padding: '2rem 1rem', margin: 0 }}>
              No results for "{search}"
            </p>
          )}
        </div>

        {/* Model & Settings */}
        {/* Model settings */}
        {config && (
          <div className="px-3 pb-2 pt-2 border-t border-[#1a1f2e] shrink-0">
          <div style={{ borderTop: '1px solid #161d2b', padding: '0.75rem 0.875rem 0.5rem', flexShrink: 0 }}>
            <button
              onClick={() => setShowSettings(s => !s)}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-[#161924] text-xs text-gray-400 hover:text-gray-200 transition-all cursor-pointer"
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px',
                background: 'none', border: 'none', cursor: 'pointer', borderRadius: 10,
                color: '#616d88', fontFamily: 'inherit', transition: 'all 0.15s'
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#131720'; e.currentTarget.style.color = '#a8b3cc'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#616d88'; }}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span className="truncate flex-1 text-left">{settings.model}</span>
              <ChevronDown className={`w-3 h-3 transition-transform ${showSettings ? 'rotate-180' : ''}`} />
              <Cpu style={{ width: 15, height: 15, flexShrink: 0 }} />
              <span style={{ flex: 1, textAlign: 'left', fontSize: '0.875rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {settings?.model || 'Settings'}
              </span>
              <ChevronDown style={{ width: 14, height: 14, transform: showSettings ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            </button>

            {showSettings && (
              <div className="mt-2 space-y-2 px-1">
                {/* Model */}
                <div>
                  <label className="text-[10px] text-gray-500 uppercase tracking-wider">Model</label>
                  <select
                    value={settings.model}
                    onChange={e => onUpdateSettings({ model: e.target.value })}
                    className="w-full mt-1 bg-[#0e1117] border border-[#262d3f] rounded-lg text-xs text-white px-2 py-1.5 focus:outline-none focus:border-indigo-500 cursor-pointer"
                  >
                    {config.models?.map(m => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
                </div>
                {/* Level */}
                <div>
                  <label className="text-[10px] text-gray-500 uppercase tracking-wider">Level</label>
                  <select
                    value={settings.level}
                    onChange={e => onUpdateSettings({ level: e.target.value })}
                    className="w-full mt-1 bg-[#0e1117] border border-[#262d3f] rounded-lg text-xs text-white px-2 py-1.5 focus:outline-none focus:border-indigo-500 cursor-pointer"
                  >
                    {config.levels?.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
                {/* Length */}
                <div>
                  <label className="text-[10px] text-gray-500 uppercase tracking-wider">Length</label>
                  <select
                    value={settings.length}
                    onChange={e => onUpdateSettings({ length: e.target.value })}
                    className="w-full mt-1 bg-[#0e1117] border border-[#262d3f] rounded-lg text-xs text-white px-2 py-1.5 focus:outline-none focus:border-indigo-500 cursor-pointer"
                  >
                    {config.lengths?.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
              <div style={{ padding: '10px 4px 4px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { label: 'Model', key: 'model', options: config.models?.map(m => ({ v: m.id, l: m.name })) },
                  { label: 'Level', key: 'level', options: config.levels?.map(l => ({ v: l, l })) },
                  { label: 'Length', key: 'length', options: config.lengths?.map(l => ({ v: l, l })) }
                ].map(({ label, key, options }) => (
                  <div key={key}>
                    <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#3d4a68', marginBottom: 5 }}>
                      {label}
                    </label>
                    <select
                      value={settings?.[key]}
                      onChange={e => onUpdateSettings?.({ [key]: e.target.value })}
                      style={{
                        width: '100%', background: '#0d1018', border: '1px solid #1e2535',
                        borderRadius: 9, color: '#c5cee8', padding: '7px 10px',
                        fontSize: '0.875rem', cursor: 'pointer', outline: 'none', fontFamily: 'inherit'
                      }}
                    >
                      {options?.map(o => <option key={o.v} value={o.v}>{o.l || o.v}</option>)}
                    </select>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* User profile / logout */}
        <div className="px-3 pb-4 pt-2 border-t border-[#1a1f2e] shrink-0">
          <div className="flex items-center gap-2.5 px-2 py-1.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white text-xs font-bold uppercase shrink-0">
        {/* User profile */}
        <div style={{ borderTop: '1px solid #161d2b', padding: '0.875rem', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 8px', borderRadius: 12 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10, flexShrink: 0,
              background: 'linear-gradient(135deg, #4f5fc8, #7c4dff)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontSize: '0.9375rem', fontWeight: 700, textTransform: 'uppercase'
            }}>
              {user?.username?.[0] || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">{user?.username}</p>
              <p className="text-[10px] text-gray-500 truncate">{user?.email}</p>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: '0.9rem', fontWeight: 600, color: '#e2e8f8', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user?.username}
              </p>
              <p style={{ fontSize: '0.775rem', color: '#3d4a68', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user?.email}
              </p>
            </div>
            <button
              onClick={logout}
              title="Sign out"
              className="p-1.5 text-gray-500 hover:text-red-400 transition-colors cursor-pointer"
              style={{
                background: 'none', border: 'none', cursor: 'pointer', color: '#616d88', padding: 6, display: 'flex',
                borderRadius: 8, transition: 'all 0.15s', flexShrink: 0
              }}
              onMouseEnter={e => { e.currentTarget.style.color = '#f87171'; e.currentTarget.style.background = 'rgba(248,113,113,0.1)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = '#616d88'; e.currentTarget.style.background = 'none'; }}
            >
              <LogOut className="w-4 h-4" />
              <LogOut style={{ width: 17, height: 17 }} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

