import React, { createContext, useContext, useState, useCallback } from 'react';
import { api } from '../services/api';

const ChatContext = createContext(null);

export function ChatProvider({ children }) {
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [activeChatTitle, setActiveChatTitle] = useState('New Conversation');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const loadChats = useCallback(async () => {
    try {
      const res = await api.getChats();
      setChats(res.chats || []);
    } catch (err) {
      console.error('Failed to load chats:', err);
    }
  }, []);

  const selectChat = useCallback(async (chatId) => {
    if (chatId === activeChatId) return;
    setIsLoading(true);
    try {
      const chatData = await api.getChatDetails(chatId);
      setActiveChatId(chatId);
      setActiveChatTitle(chatData.title);
      setMessages(chatData.messages || []);
    } catch (err) {
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [activeChatId]);

  const newChat = useCallback(() => {
    setActiveChatId(null);
    setActiveChatTitle('New Conversation');
    setMessages([]);
  }, []);

  const renameChat = useCallback(async (chatId, newTitle) => {
    await api.renameChat(chatId, newTitle);
    setChats(prev => prev.map(c => c.id === chatId ? { ...c, title: newTitle } : c));
    if (activeChatId === chatId) setActiveChatTitle(newTitle);
  }, [activeChatId]);

  const deleteChat = useCallback(async (chatId) => {
    await api.deleteChat(chatId);
    setChats(prev => prev.filter(c => c.id !== chatId));
    if (activeChatId === chatId) newChat();
  }, [activeChatId, newChat]);

  const sendMessage = useCallback(async ({ prompt, files, model, level, length }) => {
    // Optimistic user message
    const tempId = `temp-${Date.now()}`;
    const previewImage = files?.find(f => f.name.match(/\.(png|jpg|jpeg|webp)$/i))
      ? URL.createObjectURL(files.find(f => f.name.match(/\.(png|jpg|jpeg|webp)$/i)))
      : null;

    const tempMsg = {
      id: tempId,
      role: 'user',
      content: prompt || (files?.length ? `[Attached ${files.length} file(s)]` : ''),
      created_at: new Date().toISOString(),
      preview_image: previewImage
    };

    setMessages(prev => [...prev, tempMsg]);
    setIsSending(true);

    try {
      const res = await api.sendMessage({
        chatId: activeChatId,
        prompt, files, model, level, length
      });
      setActiveChatId(res.chat_id);
      setActiveChatTitle(res.chat_title);
      setMessages(prev => {
        const filtered = prev.filter(m => m.id !== tempId);
        return [...filtered, res.user_message, res.assistant_message];
      });
      await loadChats();
      return res;
    } catch (err) {
      setMessages(prev => prev.filter(m => m.id !== tempId));
      throw err;
    } finally {
      setIsSending(false);
    }
  }, [activeChatId, loadChats]);

  return (
    <ChatContext.Provider value={{
      chats, activeChatId, activeChatTitle, messages,
      isLoading, isSending,
      loadChats, selectChat, newChat, renameChat, deleteChat, sendMessage
    }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChat must be used inside ChatProvider');
  return ctx;
}

