import React, { useState } from 'react';
import { Sparkles, Mail, Lock, User, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';
import { Sparkles, Mail, Lock, User, Eye, EyeOff, Loader2, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AuthPage() {
  const { login, signup } = useAuth();
  const [tab, setTab] = useState('login');
  const [form, setForm] = useState({ username: '', email: '', identifier: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (tab === 'login') {
        await login(form.identifier, form.password);
      } else {
        if (!form.username.trim()) { setError('Username is required.'); return; }
        if (!form.email.trim()) { setError('Email is required.'); return; }
        if (!form.username.trim()) { setError('Username is required.'); setLoading(false); return; }
        if (!form.email.trim()) { setError('Email is required.'); setLoading(false); return; }
        await signup(form.username, form.email, form.password);
      }
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const InputWrapper = ({ icon: Icon, children }) => (
    <div className="relative">
      <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#3d4a68] pointer-events-none" style={{ width: 18, height: 18 }} />
      {children}
    </div>
  );

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-[#0b0d12] p-4">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-indigo-600/10 blur-[120px]" />
        <div className="absolute top-2/3 left-1/3 w-[400px] h-[400px] rounded-full bg-purple-600/8 blur-[100px]" />
    <div className="min-h-screen w-screen flex items-center justify-center p-4" style={{ background: 'var(--bg-base)' }}>
      {/* Ambient background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div style={{
          position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)',
          width: 700, height: 700, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(80,96,216,0.12) 0%, transparent 70%)',
          filter: 'blur(40px)'
        }} />
        <div style={{
          position: 'absolute', bottom: '10%', right: '20%',
          width: 400, height: 400, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(224,64,251,0.08) 0%, transparent 70%)',
          filter: 'blur(60px)'
        }} />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
      <div className="relative z-10 w-full" style={{ maxWidth: 440 }}>

        {/* Logo + Brand */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#4285f4] via-[#9b72cb] to-[#d96570] flex items-center justify-center shadow-2xl shadow-purple-500/30 mb-4">
            <Sparkles className="w-7 h-7 text-white" />
          <div style={{
            width: 68, height: 68, borderRadius: 20,
            background: 'linear-gradient(135deg, #4285f4 0%, #7c4dff 50%, #e040fb 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 40px rgba(80,96,216,0.4), 0 8px 32px rgba(0,0,0,0.4)',
            marginBottom: 20
          }}>
            <Sparkles style={{ width: 30, height: 30, color: '#fff' }} />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">AI Info Generator</h1>
          <p className="text-sm text-gray-400 mt-1">Your intelligent AI assistant</p>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.025em', color: '#f0f2fa', margin: 0 }}>
            AI Info Generator
          </h1>
          <p style={{ fontSize: '0.975rem', color: '#616d88', marginTop: 6 }}>
            Your intelligent AI assistant
          </p>
        </div>

        {/* Card */}
        <div className="bg-[#0e1117]/80 border border-[#1f2330] rounded-2xl shadow-2xl backdrop-blur-sm overflow-hidden">
        <div style={{
          background: '#0d1018',
          border: '1px solid #1e2535',
          borderRadius: 20,
          overflow: 'hidden',
          boxShadow: '0 24px 80px rgba(0,0,0,0.5)'
        }}>

          {/* Tabs */}
          <div className="flex border-b border-[#1f2330]">
            {['login', 'signup'].map(t => (
          <div style={{ display: 'flex', borderBottom: '1px solid #1e2535' }}>
            {[['login', 'Sign In'], ['signup', 'Create Account']].map(([t, label]) => (
              <button
                key={t}
                onClick={() => { setTab(t); setError(''); }}
                className={`flex-1 py-3.5 text-sm font-semibold capitalize transition-all cursor-pointer ${
                  tab === t
                    ? 'text-white border-b-2 border-indigo-500 bg-indigo-500/5'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
                style={{
                  flex: 1, padding: '1rem', fontSize: '0.9375rem', fontWeight: 600,
                  cursor: 'pointer', border: 'none', background: 'transparent',
                  color: tab === t ? '#f0f2fa' : '#616d88',
                  borderBottom: tab === t ? '2px solid #5060d8' : '2px solid transparent',
                  transition: 'all 0.2s'
                }}
              >
                {t === 'login' ? 'Sign In' : 'Create Account'}
                {label}
              </button>
            ))}
          </div>

          <form onSubmit={submit} className="p-6 space-y-4">
            {/* Error Banner */}
          <form onSubmit={submit} style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-950/60 border border-red-500/40 rounded-xl text-red-300 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
              <div className="animate-fadeUp" style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '0.875rem 1rem',
                background: 'rgba(220,38,38,0.12)',
                border: '1px solid rgba(220,38,38,0.3)',
                borderRadius: 12, color: '#fca5a5', fontSize: '0.9rem'
              }}>
                <AlertCircle style={{ width: 16, height: 16, flexShrink: 0 }} />
                <span>{error}</span>
              </div>
            )}

            {/* Username (signup only) */}
            {tab === 'signup' && (
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              <InputWrapper icon={User}>
                <input
                  type="text"
                  placeholder="Username"
                  placeholder="Choose a username"
                  value={form.username}
                  onChange={e => update('username', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-[#141720] border border-[#262d3f] rounded-xl text-white placeholder:text-gray-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all"
                  required
                  autoFocus
                  className="input-field"
                  style={{ paddingLeft: '2.75rem' }}
                />
              </div>
              </InputWrapper>
            )}

            {/* Email or identifier */}
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            {/* Email / identifier */}
            <InputWrapper icon={Mail}>
              {tab === 'signup' ? (
                <input
                  type="email"
                  placeholder="Email address"
                  value={form.email}
                  onChange={e => update('email', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-[#141720] border border-[#262d3f] rounded-xl text-white placeholder:text-gray-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all"
                  required
                  className="input-field"
                  style={{ paddingLeft: '2.75rem' }}
                />
              ) : (
                <input
                  type="text"
                  placeholder="Username or email"
                  value={form.identifier}
                  onChange={e => update('identifier', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-[#141720] border border-[#262d3f] rounded-xl text-white placeholder:text-gray-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all"
                  required
                  autoFocus
                  className="input-field"
                  style={{ paddingLeft: '2.75rem' }}
                />
              )}
            </div>
            </InputWrapper>

            {/* Password */}
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              <Lock className="absolute top-1/2 -translate-y-1/2 text-[#3d4a68] pointer-events-none" style={{ left: 16, width: 18, height: 18 }} />
              <input
                type={showPass ? 'text' : 'password'}
                placeholder="Password"
                placeholder="Password (min. 6 characters)"
                value={form.password}
                onChange={e => update('password', e.target.value)}
                className="w-full pl-10 pr-10 py-3 bg-[#141720] border border-[#262d3f] rounded-xl text-white placeholder:text-gray-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all"
                required
                minLength={6}
                className="input-field"
                style={{ paddingLeft: '2.75rem', paddingRight: '3rem' }}
              />
              <button
                type="button"
                onClick={() => setShowPass(s => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 cursor-pointer"
                style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#616d88', cursor: 'pointer', padding: 4, display: 'flex' }}
              >
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                {showPass ? <EyeOff style={{ width: 17, height: 17 }} /> : <Eye style={{ width: 17, height: 17 }} />}
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-xl transition-all shadow-lg shadow-indigo-500/25 cursor-pointer flex items-center justify-center gap-2"
            >
            <button type="submit" disabled={loading} className="btn-primary" style={{ marginTop: 4 }}>
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</>
                <><Loader2 style={{ width: 18, height: 18, animation: 'spin 1s linear infinite' }} /> Processing…</>
              ) : (
                tab === 'login' ? 'Sign In' : 'Create Account'
                <>{tab === 'login' ? 'Sign In' : 'Create Account'} <ArrowRight style={{ width: 17, height: 17 }} /></>
              )}
            </button>

            {/* Switch tab hint */}
            <p style={{ textAlign: 'center', fontSize: '0.875rem', color: '#616d88', margin: 0 }}>
              {tab === 'login' ? "Don't have an account? " : "Already have an account? "}
              <button
                type="button"
                onClick={() => { setTab(tab === 'login' ? 'signup' : 'login'); setError(''); }}
                style={{ color: '#7b9fff', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}
              >
                {tab === 'login' ? 'Sign up free' : 'Sign in'}
              </button>
            </p>
          </form>
        </div>

        <p className="text-center text-xs text-gray-600 mt-6">
          AI Info Generator v3.0 — Powered by Groq & OpenAI
        <p style={{ textAlign: 'center', fontSize: '0.8125rem', color: '#3d4a68', marginTop: 24 }}>
          Powered by Groq & OpenAI · AI Info Generator v3.0
        </p>
      </div>
    </div>
  );
}

