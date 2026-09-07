import React, { useState, useRef, useEffect } from 'react';
import {
  Paperclip, Send, Mic, MicOff, X, Image, Loader2, Square
  Paperclip, Send, Mic, X, Image as ImageIcon,
  Loader2, Square, Sparkles, Globe
} from 'lucide-react';
import { useVoice } from '../../hooks/useVoice';

const ACCEPTED_FILES = '.pdf,.docx,.txt,.png,.jpg,.jpeg,.webp';
const MAX_FILE_SIZE_MB = 20;
const MAX_FILE_MB = 20;

export default function ChatInput({ onSendMessage, onGenerateImage, loading, settings, config }) {
export default function ChatInput({ onSendMessage, onGenerateImage, loading, settings, config, onUpdateSettings }) {
  const [prompt, setPrompt] = useState('');
  const [files, setFiles] = useState([]);
  const [imagePrompt, setImagePrompt] = useState('');
  const [imageMode, setImageMode] = useState(false);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const { isRecording, isTranscribing, transcript, error: voiceError, startRecording, stopRecording } = useVoice();

  // Auto-insert transcript into textarea
  useEffect(() => {
    if (transcript) {
      setPrompt(t => (t ? t + ' ' + transcript : transcript));
    }
    if (transcript) setPrompt(t => t ? `${t} ${transcript}` : transcript);
  }, [transcript]);

  // Auto-resize textarea
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = Math.min(ta.scrollHeight, 180) + 'px';
    ta.style.height = Math.min(ta.scrollHeight, 200) + 'px';
  }, [prompt]);

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files || []);
    const valid = selected.filter(f => {
      if (f.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        alert(`"${f.name}" exceeds ${MAX_FILE_SIZE_MB} MB limit.`);
        return false;
      }
  const handleFiles = (e) => {
    const sel = Array.from(e.target.files || []).filter(f => {
      if (f.size > MAX_FILE_MB * 1024 * 1024) { alert(`"${f.name}" exceeds ${MAX_FILE_MB} MB.`); return false; }
      return true;
    });
    setFiles(prev => [...prev, ...valid]);
    setFiles(p => [...p, ...sel]);
    e.target.value = '';
  };

  const removeFile = (idx) => setFiles(prev => prev.filter((_, i) => i !== idx));
  const removeFile = (i) => setFiles(p => p.filter((_, idx) => idx !== i));

  const handleSend = () => {
  const send = () => {
    if (loading) return;
    if (imageMode) {
      const ip = imagePrompt.trim();
      if (!ip) return;
      onGenerateImage?.(ip);
      const p = imagePrompt.trim();
      if (!p) return;
      onGenerateImage?.(p);
      setImagePrompt('');
      setImageMode(false);
      return;
    }
    const p = prompt.trim();
    if (!p && files.length === 0) return;
    onSendMessage({ prompt: p, files });
    setPrompt('');
    setFiles([]);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  const keyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  };

  const isImage = (f) => f.name.match(/\.(png|jpg|jpeg|webp)$/i);
  const isImg = (f) => /\.(png|jpg|jpeg|webp)$/i.test(f.name);
  const fileIcon = (f) => f.name.endsWith('.pdf') ? '📄' : f.name.endsWith('.docx') ? '📝' : '📃';

  const canSend = !loading && !isRecording && (imageMode ? imagePrompt.trim() : (prompt.trim() || files.length > 0));

  return (
    <div className="border-t border-[#1f2330] bg-[#0b0d12] px-4 py-3">
      <div className="max-w-4xl mx-auto">
        {/* File attachment previews */}
    <div style={{
      borderTop: '1px solid #1e2535',
      background: 'var(--bg-base)',
      padding: '0.875rem 1rem 1rem',
      flexShrink: 0
    }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>

        {/* Attachment chips */}
        {files.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
            {files.map((f, i) => (
              <div
                key={i}
                className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#141720] border border-[#262d3f] rounded-lg text-xs text-gray-300 max-w-[200px]"
              >
                {isImage(f) ? (
                  <img
                    src={URL.createObjectURL(f)}
                    className="w-5 h-5 rounded object-cover shrink-0"
                    alt=""
                  />
                ) : (
                  <span className="shrink-0">{f.name.endsWith('.pdf') ? '📄' : f.name.endsWith('.docx') ? '📝' : '📃'}</span>
                )}
                <span className="truncate">{f.name}</span>
                <button
                  onClick={() => removeFile(i)}
                  className="ml-1 text-gray-500 hover:text-red-400 shrink-0 cursor-pointer"
                >
                  <X className="w-3 h-3" />
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '5px 10px 5px 8px',
                background: '#131720', border: '1px solid #252f46', borderRadius: 10,
                fontSize: '0.8125rem', color: '#a8b3cc', maxWidth: 220
              }}>
                {isImg(f)
                  ? <img src={URL.createObjectURL(f)} style={{ width: 22, height: 22, borderRadius: 5, objectFit: 'cover', flexShrink: 0 }} alt="" />
                  : <span style={{ flexShrink: 0 }}>{fileIcon(f)}</span>
                }
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>{f.name}</span>
                <button onClick={() => removeFile(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#616d88', display: 'flex', padding: 0, flexShrink: 0 }}>
                  <X style={{ width: 13, height: 13 }} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Voice error */}
        {voiceError && (
          <p className="text-xs text-red-400 mb-2">{voiceError}</p>
          <p style={{ fontSize: '0.8125rem', color: '#f87171', marginBottom: 8 }}>{voiceError}</p>
        )}

        {/* Image mode banner */}
        {imageMode && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '8px 12px', background: 'rgba(224,64,251,0.08)',
            border: '1px solid rgba(224,64,251,0.2)', borderRadius: 10, marginBottom: 10
          }}>
            <Sparkles style={{ width: 14, height: 14, color: '#e040fb', flexShrink: 0 }} />
            <span style={{ fontSize: '0.8125rem', color: '#d68fff' }}>Image generation mode — Powered by DALL-E 3</span>
            <button onClick={() => setImageMode(false)} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: '#616d88', display: 'flex' }}>
              <X style={{ width: 13, height: 13 }} />
            </button>
          </div>
        )}

        {/* Main input box */}
        <div className="flex items-end gap-2 bg-[#0e1117] border border-[#262d3f] rounded-2xl px-3 py-2 focus-within:border-indigo-500/60 focus-within:ring-1 focus-within:ring-indigo-500/20 transition-all">
          {/* File attach */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-1.5 text-gray-500 hover:text-indigo-400 transition-colors cursor-pointer shrink-0 mb-0.5"
            title="Attach file (PDF, DOCX, TXT, Image)"
          >
            <Paperclip className="w-4 h-4" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={ACCEPTED_FILES}
            onChange={handleFileChange}
            className="hidden"
          />
        <div style={{
          display: 'flex', alignItems: 'flex-end', gap: 8,
          background: '#0d1018',
          border: isRecording ? '1.5px solid rgba(239,68,68,0.5)' : '1.5px solid #1e2535',
          borderRadius: 16,
          padding: '8px 10px 8px 14px',
          boxShadow: '0 2px 20px rgba(0,0,0,0.3)',
          transition: 'border-color 0.2s, box-shadow 0.2s'
        }}
          onFocus={(e) => e.currentTarget.style.borderColor = '#5060d8'}
          onBlur={(e) => e.currentTarget.style.borderColor = isRecording ? 'rgba(239,68,68,0.5)' : '#1e2535'}
        >

          {/* Image generation toggle */}
          <button
            type="button"
            onClick={() => setImageMode(m => !m)}
            title="Generate image with DALL-E 3"
            className={`p-1.5 transition-colors cursor-pointer shrink-0 mb-0.5 ${imageMode ? 'text-pink-400' : 'text-gray-500 hover:text-pink-400'}`}
          >
            <Image className="w-4 h-4" />
          </button>
          {/* Left actions */}
          <div style={{ display: 'flex', gap: 2, alignItems: 'center', paddingBottom: 4, flexShrink: 0 }}>
            {/* Attach file */}
            <button
              onClick={() => fileInputRef.current?.click()}
              title="Attach file (PDF, DOCX, TXT, Image)"
              style={{
                width: 34, height: 34, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'none', border: 'none', cursor: 'pointer', color: '#616d88',
                transition: 'color 0.15s, background 0.15s'
              }}
              onMouseEnter={e => { e.currentTarget.style.color = '#7b9fff'; e.currentTarget.style.background = '#131720'; }}
              onMouseLeave={e => { e.currentTarget.style.color = '#616d88'; e.currentTarget.style.background = 'none'; }}
            >
              <Paperclip style={{ width: 17, height: 17 }} />
            </button>
            <input ref={fileInputRef} type="file" multiple accept={ACCEPTED_FILES} onChange={handleFiles} style={{ display: 'none' }} />

          {/* Textarea */}
            {/* Image generation */}
            <button
              onClick={() => setImageMode(m => !m)}
              title="Generate image (DALL-E 3)"
              style={{
                width: 34, height: 34, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: imageMode ? 'rgba(224,64,251,0.12)' : 'none',
                border: 'none', cursor: 'pointer', color: imageMode ? '#e040fb' : '#616d88',
                transition: 'color 0.15s, background 0.15s'
              }}
              onMouseEnter={e => { if (!imageMode) { e.currentTarget.style.color = '#d68fff'; e.currentTarget.style.background = '#131720'; } }}
              onMouseLeave={e => { if (!imageMode) { e.currentTarget.style.color = '#616d88'; e.currentTarget.style.background = 'none'; } }}
            >
              <ImageIcon style={{ width: 17, height: 17 }} />
            </button>
          </div>

          {/* Textarea / image prompt */}
          {imageMode ? (
            <input
              type="text"
              value={imagePrompt}
              onChange={e => setImagePrompt(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Describe the image to generate…"
              className="flex-1 bg-transparent text-sm text-white placeholder:text-gray-500 focus:outline-none resize-none py-1.5"
              onKeyDown={e => e.key === 'Enter' && send()}
              placeholder="Describe the image you want to generate…"
              style={{
                flex: 1, background: 'none', border: 'none', outline: 'none',
                color: '#eef0f8', fontSize: '0.9375rem', padding: '6px 0', lineHeight: 1.5,
                fontFamily: 'inherit'
              }}
            />
          ) : (
            <textarea
              ref={textareaRef}
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={files.length > 0 ? 'Add a message (or just send the file)…' : 'Ask anything…'}
              onKeyDown={keyDown}
              placeholder={
                isRecording ? '🎤 Recording… tap stop when done'
                : isTranscribing ? '⏳ Transcribing your voice…'
                : files.length > 0 ? 'Add a message or just send the file…'
                : 'Ask anything… (Enter to send, Shift+Enter for new line)'
              }
              rows={1}
              className="flex-1 bg-transparent text-sm text-white placeholder:text-gray-500 focus:outline-none resize-none py-1.5 max-h-[180px] overflow-y-auto"
              style={{
                flex: 1, background: 'none', border: 'none', outline: 'none', resize: 'none',
                color: '#eef0f8', fontSize: '0.9375rem', padding: '6px 0', lineHeight: 1.6,
                maxHeight: 200, overflowY: 'auto', fontFamily: 'inherit'
              }}
            />
          )}

          {/* Voice mic button */}
          <button
            type="button"
            onClick={isRecording ? stopRecording : startRecording}
            disabled={isTranscribing || loading}
            title={isRecording ? 'Stop recording' : 'Start voice input'}
            className={`p-1.5 transition-colors cursor-pointer shrink-0 mb-0.5 disabled:opacity-40 ${
              isRecording ? 'text-red-400 animate-pulse' : 'text-gray-500 hover:text-indigo-400'
            }`}
          >
            {isTranscribing ? (
              <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
            ) : isRecording ? (
              <Square className="w-4 h-4" />
            ) : (
              <Mic className="w-4 h-4" />
            )}
          </button>
          {/* Right actions */}
          <div style={{ display: 'flex', gap: 6, alignItems: 'center', paddingBottom: 4, flexShrink: 0 }}>
            {/* Voice */}
            <button
              onClick={isRecording ? stopRecording : startRecording}
              disabled={isTranscribing || loading}
              title={isRecording ? 'Stop recording' : 'Voice input (Groq Whisper)'}
              style={{
                width: 34, height: 34, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: isRecording ? 'rgba(239,68,68,0.15)' : 'none',
                border: 'none', cursor: isTranscribing || loading ? 'not-allowed' : 'pointer',
                color: isRecording ? '#f87171' : isTranscribing ? '#7b9fff' : '#616d88',
                opacity: (isTranscribing || loading) ? 0.5 : 1,
                transition: 'all 0.15s'
              }}
            >
              {isTranscribing
                ? <Loader2 style={{ width: 17, height: 17, animation: 'spin 1s linear infinite' }} />
                : isRecording
                  ? <Square style={{ width: 15, height: 15 }} />
                  : <Mic style={{ width: 17, height: 17 }} />
              }
            </button>

          {/* Send button */}
          <button
            type="button"
            onClick={handleSend}
            disabled={loading || isRecording || (!prompt.trim() && files.length === 0 && !imagePrompt.trim())}
            className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 disabled:cursor-not-allowed text-white transition-all cursor-pointer shrink-0"
            title="Send (Enter)"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
            {/* Send */}
            <button
              onClick={send}
              disabled={!canSend}
              style={{
                width: 38, height: 38, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: canSend ? 'linear-gradient(135deg, #4f5fc8, #6c47d9)' : '#131720',
                border: `1px solid ${canSend ? 'transparent' : '#1e2535'}`,
                cursor: canSend ? 'pointer' : 'not-allowed', color: canSend ? '#fff' : '#3d4a68',
                boxShadow: canSend ? '0 4px 16px rgba(80,96,216,0.35)' : 'none',
                transition: 'all 0.2s', flexShrink: 0
              }}
            >
              {loading
                ? <Loader2 style={{ width: 16, height: 16, animation: 'spin 1s linear infinite' }} />
                : <Send style={{ width: 16, height: 16 }} />
              }
            </button>
          </div>
        </div>

        {/* Footer hint */}
        <p className="text-center text-[10px] text-gray-600 mt-2">
          {imageMode ? 'Image generation powered by DALL-E 3 · OpenAI API key required' : 'Enter to send · Shift+Enter for new line · 🎤 for voice'}
        </p>
        {/* Settings row */}
        {config && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
            <Globe style={{ width: 13, height: 13, color: '#3d4a68', flexShrink: 0 }} />
            {[
              { key: 'model', options: config.models?.map(m => ({ value: m.id, label: m.id })) },
              { key: 'level', options: config.levels?.map(l => ({ value: l, label: l })) },
              { key: 'length', options: config.lengths?.map(l => ({ value: l, label: l })) }
            ].map(({ key, options }) => (
              <select
                key={key}
                value={settings?.[key]}
                onChange={e => onUpdateSettings?.({ [key]: e.target.value })}
                style={{
                  background: '#0d1018', border: '1px solid #1e2535', color: '#a8b3cc',
                  borderRadius: 8, padding: '3px 8px', fontSize: '0.8rem', cursor: 'pointer',
                  outline: 'none', fontFamily: 'inherit'
                }}
              >
                {options?.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            ))}
            <span style={{ fontSize: '0.75rem', color: '#3d4a68', marginLeft: 'auto' }}>
              Enter ↵ to send · Shift+Enter for new line
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

