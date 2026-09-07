import React, { useState, useEffect } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ChatProvider } from './context/ChatContext';
import AuthPage from './components/Auth/AuthPage';
import ChatPage from './pages/ChatPage';
import { api } from './services/api';

// Inner component that has access to AuthContext
function AppInner() {
  const { user, isLoading } = useAuth();
  const [config, setConfig] = useState(null);
  const [settings, setSettings] = useState({
    model: 'Groq • GPT-OSS 120B',
    level: 'Beginner',
    length: 'Medium',
  });

  useEffect(() => {
    api.getConfig()
      .then(cfg => {
        setConfig(cfg);
        if (cfg.defaults) {
          setSettings(prev => ({
            ...prev,
            model: cfg.defaults.model || prev.model,
            level: cfg.defaults.level || prev.level,
            length: cfg.defaults.length || prev.length,
          }));
        }
      })
      .catch(console.error);
  }, []);

  // Loading screen
  if (isLoading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#0b0d12] text-white">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#4285f4] via-[#9b72cb] to-[#d96570] flex items-center justify-center shadow-2xl shadow-purple-500/30 mb-5 animate-pulse">
          <Sparkles className="w-7 h-7 text-white" />
        </div>
        <p className="text-sm font-medium text-gray-400 flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
          <span>Initializing AI Info Generator…</span>
        </p>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  return (
    <ChatProvider>
      <ChatPage
        config={config}
        settings={settings}
        onUpdateSettings={(s) => setSettings(prev => ({ ...prev, ...s }))}
      />
    </ChatProvider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  );
}