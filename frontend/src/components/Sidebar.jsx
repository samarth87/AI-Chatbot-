import React, { useState, useMemo } from 'react';
import { 
  Sparkles, Plus, Search, MessageSquare, Trash2, Edit2, Check, X, 
  Settings2, LogOut, Sliders, Cpu, BookOpen, Clock, ChevronDown, ChevronUp,
  PanelLeftClose, Bot
} from 'lucide-react';

export default function Sidebar({
  isOpen,
  onClose,
  chats,
  activeChatId,
  onSelectChat,
  onNewChat,
  onDeleteChat,
  onRenameChat,
  user,
  onLogout,
  config,
  settings,
  onUpdateSettings
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [showSettings, setShowSettings] = useState(false);

  // Group chats by date
  const filteredChats = useMemo(() => {
    if (!searchQuery.trim()) return chats;
    return chats.filter(c => 
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.last_message && c.last_message.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [chats, searchQuery]);

  const groupedChats = useMemo(() => {
    const groups = {
      Today: [],
      Yesterday: [],
      'Previous 7 Days': [],
      Older: []
    };

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const last7Days = new Date(today);
    last7Days.setDate(last7Days.getDate() - 7);

    filteredChats.forEach(chat => {
      const date = new Date(chat.updated_at || chat.created_at);
      if (date >= today) {
        groups.Today.push(chat);
      } else if (date >= yesterday) {
        groups.Yesterday.push(chat);
      } else if (date >= last7Days) {
        groups['Previous 7 Days'].push(chat);
      } else {
        groups.Older.push(chat);
      }
    });

    return groups;
  }, [filteredChats]);

  const handleStartRename = (chat, e) => {
    e.stopPropagation();
    setEditingId(chat.id);
    setEditTitle(chat.title);
  };

  const handleSaveRename = async (chatId, e) => {
    e.stopPropagation();
    if (editTitle.trim()) {
      await onRenameChat(chatId, editTitle.trim());
    }
    setEditingId(null);
  };

  const handleCancelRename = (e) => {
    e.stopPropagation();
    setEditingId(null);
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          onClick={onClose} 
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs md:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-50
        w-72 sm:w-80 flex flex-col
        bg-[#11131a] border-r border-[#222634]
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Brand Header */}
        <div className="p-4 flex items-center justify-between border-b border-[#1f2330]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#4285f4] via-[#9b72cb] to-[#d96570] text-white flex items-center justify-center shadow-md shadow-purple-500/20">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-sm tracking-tight text-white block">AI Info Generator</span>
              <span className="text-[10px] text-gray-400 block -mt-0.5">Advanced AI Engine</span>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="md:hidden p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-[#1c202d]"
          >
            <PanelLeftClose className="w-5 h-5" />
          </button>
        </div>

        {/* New Chat Button & Search */}
        <div className="p-3.5 space-y-2.5">
          <button
            onClick={() => {
              onNewChat();
              if (window.innerWidth < 768) onClose();
            }}
            className="w-full py-2.5 px-3.5 bg-gradient-to-r from-[#3b82f6] via-[#6366f1] to-[#8b5cf6] hover:opacity-95 text-white text-sm font-semibold rounded-xl flex items-center justify-between shadow-lg shadow-indigo-600/20 transition-all cursor-pointer group"
          >
            <span className="flex items-center gap-2">
              <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
              <span>New conversation</span>
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/20 text-white/90">Ctrl+K</span>
          </button>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search conversations..."
              className="w-full pl-8 pr-7 py-2 bg-[#0c0e14] border border-[#1e2230] rounded-lg text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/40 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto px-2 space-y-4 py-1">
          {filteredChats.length === 0 ? (
            <div className="text-center py-8 px-4">
              <MessageSquare className="w-8 h-8 text-gray-600 mx-auto mb-2 opacity-50" />
              <p className="text-xs text-gray-400 font-medium">
                {searchQuery ? 'No matching conversations' : 'No conversations yet'}
              </p>
              <p className="text-[11px] text-gray-600 mt-1">Start a new chat to begin</p>
            </div>
          ) : (
            Object.entries(groupedChats).map(([groupTitle, groupItems]) => {
              if (groupItems.length === 0) return null;
              return (
                <div key={groupTitle} className="space-y-1">
                  <div className="px-2.5 py-1 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                    {groupTitle}
                  </div>
                  {groupItems.map((chat) => {
                    const isActive = chat.id === activeChatId;
                    const isEditing = editingId === chat.id;

                    return (
                      <div
                        key={chat.id}
                        onClick={() => {
                          if (!isEditing) {
                            onSelectChat(chat.id);
                            if (window.innerWidth < 768) onClose();
                          }
                        }}
                        className={`
                          group relative flex items-center justify-between px-3 py-2 rounded-xl text-xs cursor-pointer transition-all
                          ${isActive 
                            ? 'bg-[#1e2230] text-white border border-[#2e3448]' 
                            : 'text-gray-400 hover:text-gray-200 hover:bg-[#161822] border border-transparent'}
                        `}
                      >
                        {isEditing ? (
                          <div className="flex items-center gap-1.5 w-full" onClick={(e) => e.stopPropagation()}>
                            <input
                              type="text"
                              value={editTitle}
                              onChange={(e) => setEditTitle(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSaveRename(chat.id, e);
                                if (e.key === 'Escape') handleCancelRename(e);
                              }}
                              autoFocus
                              className="flex-1 bg-[#0c0e14] border border-indigo-500 rounded px-2 py-1 text-xs text-white focus:outline-none"
                            />
                            <button
                              onClick={(e) => handleSaveRename(chat.id, e)}
                              className="p-1 text-emerald-400 hover:bg-emerald-500/10 rounded"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={handleCancelRename}
                              className="p-1 text-gray-400 hover:bg-gray-500/10 rounded"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-center gap-2.5 min-w-0 flex-1 pr-2">
                              <MessageSquare className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-indigo-400' : 'text-gray-500'}`} />
                              <span className="truncate font-medium">{chat.title}</span>
                            </div>

                            {/* Action Buttons */}
                            <div className={`
                              flex items-center gap-0.5 shrink-0
                              ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity
                            `}>
                              <button
                                onClick={(e) => handleStartRename(chat, e)}
                                title="Rename title"
                                className="p-1 text-gray-400 hover:text-gray-200 hover:bg-[#252a3a] rounded"
                              >
                                <Edit2 className="w-3 h-3" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (window.confirm('Delete this conversation?')) {
                                    onDeleteChat(chat.id);
                                  }
                                }}
                                title="Delete conversation"
                                className="p-1 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })
          )}
        </div>

        {/* AI Model & Controls Drawer */}
        <div className="border-t border-[#1f2330] bg-[#0d0f16]/60 p-3 space-y-2.5">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="w-full flex items-center justify-between text-xs font-semibold text-gray-300 hover:text-white py-1 px-1.5 rounded-lg transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <Sliders className="w-3.5 h-3.5 text-indigo-400" />
              <span>AI Engine & Parameters</span>
            </span>
            {showSettings ? <ChevronUp className="w-3.5 h-3.5 text-gray-500" /> : <ChevronDown className="w-3.5 h-3.5 text-gray-500" />}
          </button>

          {showSettings && (
            <div className="space-y-3 pt-1 pb-1 animate-fadeIn text-xs">
              {/* Model selection */}
              <div>
                <label className="block text-[11px] font-medium text-gray-400 mb-1 flex items-center gap-1.5">
                  <Cpu className="w-3 h-3 text-gray-500" />
                  <span>Model</span>
                </label>
                <select
                  value={settings.model}
                  onChange={(e) => onUpdateSettings({ model: e.target.value })}
                  className="w-full bg-[#141722] border border-[#252a3a] rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                >
                  {(config?.models || []).map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Explanation Level */}
              <div>
                <label className="block text-[11px] font-medium text-gray-400 mb-1 flex items-center gap-1.5">
                  <BookOpen className="w-3 h-3 text-gray-500" />
                  <span>Explanation Level</span>
                </label>
                <div className="grid grid-cols-3 gap-1 bg-[#141722] p-0.5 rounded-lg border border-[#252a3a]">
                  {(config?.levels || ['Beginner', 'Intermediate', 'Advanced']).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => onUpdateSettings({ level: lvl })}
                      className={`py-1 text-[10px] font-medium rounded transition-all ${
                        settings.level === lvl
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'text-gray-400 hover:text-gray-200'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Response Length */}
              <div>
                <label className="block text-[11px] font-medium text-gray-400 mb-1 flex items-center gap-1.5">
                  <Clock className="w-3 h-3 text-gray-500" />
                  <span>Response Length</span>
                </label>
                <div className="grid grid-cols-3 gap-1 bg-[#141722] p-0.5 rounded-lg border border-[#252a3a]">
                  {(config?.lengths || ['Short', 'Medium', 'Detailed']).map((len) => (
                    <button
                      key={len}
                      type="button"
                      onClick={() => onUpdateSettings({ length: len })}
                      className={`py-1 text-[10px] font-medium rounded transition-all ${
                        settings.length === len
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'text-gray-400 hover:text-gray-200'
                      }`}
                    >
                      {len}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Footer */}
        {user && (
          <div className="p-3 border-t border-[#1f2330] flex items-center justify-between bg-[#0e1017]">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white font-bold text-xs flex items-center justify-center shadow-sm shrink-0">
                {getInitials(user.username)}
              </div>
              <div className="min-w-0">
                <span className="block text-xs font-semibold text-white truncate">{user.username}</span>
                <span className="block text-[10px] text-gray-500 truncate">{user.email}</span>
              </div>
            </div>

            <button
              onClick={onLogout}
              title="Sign out"
              className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </aside>
    </>
  );
}