import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Sparkles, User, Copy, Check, Download } from 'lucide-react';
import { Sparkles, Copy, Check, Download } from 'lucide-react';

/* ── Syntax-highlighted code block ─────────────────────────────────────────── */
function CodeBlock({ language, children }) {
  const [copied, setCopied] = useState(false);
  const code = String(children).replace(/\n$/, '');

  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group my-3 rounded-xl overflow-hidden border border-[#262d3f]">
      <div className="flex items-center justify-between px-4 py-1.5 bg-[#0d1117] border-b border-[#262d3f]">
        <span className="text-xs font-mono text-gray-400">{language || 'code'}</span>
    <div className="code-block-wrapper">
      <div className="code-block-header">
        <span className="code-block-lang">{language || 'code'}</span>
        <button
          onClick={copy}
          className="flex items-center gap-1 text-xs text-gray-500 hover:text-white transition-colors cursor-pointer"
          style={{
            display: 'flex', alignItems: 'center', gap: 5, background: 'none', border: 'none',
            cursor: 'pointer', color: copied ? '#4ade80' : '#616d88', fontSize: '0.8rem',
            transition: 'color 0.15s', fontFamily: 'inherit'
          }}
        >
          {copied ? <><Check className="w-3 h-3 text-green-400" /> Copied</> : <><Copy className="w-3 h-3" /> Copy</>}
          {copied
            ? <><Check style={{ width: 13, height: 13 }} /> Copied!</>
            : <><Copy style={{ width: 13, height: 13 }} /> Copy</>
          }
        </button>
      </div>
      <SyntaxHighlighter
        style={oneDark}
        language={language}
        PreTag="div"
        customStyle={{ margin: 0, padding: '1rem', background: '#0b0d12', fontSize: '0.8rem' }}
        customStyle={{
          margin: 0,
          padding: '1rem 1.25rem',
          background: '#070910',
          fontSize: '0.875rem',
          lineHeight: '1.7',
          fontFamily: "'JetBrains Mono', 'Fira Code', monospace"
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}

/* ── Inline code ────────────────────────────────────────────────────────────── */
function InlineCode({ children }) {
  return (
    <code style={{
      padding: '2px 7px',
      background: '#131720',
      border: '1px solid #252f46',
      borderRadius: 6,
      color: '#a5b4fc',
      fontSize: '0.875em',
      fontFamily: "'JetBrains Mono', monospace"
    }}>
      {children}
    </code>
  );
}

/* ── Main message component ─────────────────────────────────────────────────── */
export default function MessageItem({ message, user }) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';

  const copyContent = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadContent = () => {
    const blob = new Blob([message.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `response-${Date.now()}.txt`;
    a.download = `ai-response-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const time = message.created_at
  const timeStr = message.created_at
    ? new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '';

  const modelLabel = message.model?.includes('Groq') ? 'Groq'
    : message.model?.includes('OpenAI') ? 'OpenAI'
    : message.model ? message.model.split('•')[0]?.trim()
    : null;

  return (
    <div className={`group py-4 px-4 sm:px-6 flex gap-3.5 sm:gap-4 ${isUser ? '' : 'bg-[#0e1017]/50'}`}>
    <div
      className="group"
      style={{
        display: 'flex',
        gap: 16,
        padding: '1.25rem 1.5rem',
        background: isUser ? 'transparent' : 'rgba(13,16,24,0.6)',
        borderBottom: '1px solid #111520',
        transition: 'background 0.15s'
      }}
    >
      {/* Avatar */}
      <div className="shrink-0 mt-0.5">
      <div style={{ flexShrink: 0, marginTop: 2 }}>
        {isUser ? (
          <div className="w-8 h-8 rounded-xl bg-[#1e2332] border border-[#2a3147] text-white flex items-center justify-center text-xs font-bold uppercase">
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: '#131720',
            border: '1.5px solid #252f46',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#a8b3cc', fontSize: '0.875rem', fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: '0.05em'
          }}>
            {user?.username?.[0] || 'U'}
          </div>
        ) : (
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#4285f4] via-[#9b72cb] to-[#d96570] text-white flex items-center justify-center shadow-md shadow-purple-500/20">
            <Sparkles className="w-4 h-4" />
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(135deg, #4285f4 0%, #7c4dff 55%, #e040fb 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(80,96,216,0.35)'
          }}>
            <Sparkles style={{ width: 17, height: 17, color: '#fff' }} />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-xs font-bold text-white">
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Header row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <span style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#f0f2fa' }}>
            {isUser ? (user?.username || 'You') : 'AI Info Generator'}
          </span>
          {message.model && !isUser && (
            <span className="text-[10px] text-indigo-400/70 font-mono px-1.5 py-0.5 bg-indigo-500/10 rounded-full">
              {message.model.split('•')[0]?.trim() || message.model}
          {modelLabel && !isUser && (
            <span style={{
              fontSize: '0.75rem', color: '#7b9fff', fontFamily: "'JetBrains Mono', monospace",
              padding: '2px 8px', background: 'rgba(123,159,255,0.1)',
              border: '1px solid rgba(123,159,255,0.2)', borderRadius: 20
            }}>
              {modelLabel}
            </span>
          )}
          {time && (
            <span className="text-[10px] text-gray-600 ml-auto">{time}</span>
          {timeStr && (
            <span style={{ fontSize: '0.775rem', color: '#3d4a68', marginLeft: 'auto' }}>{timeStr}</span>
          )}
        </div>

        {/* Image preview (from uploaded file) */}
        {/* Image preview */}
        {message.preview_image && (
          <img
            src={message.preview_image}
            alt="Attachment"
            className="max-w-[280px] max-h-[200px] rounded-xl border border-[#262d3f] object-cover mb-2"
            style={{
              maxWidth: 320, maxHeight: 240, borderRadius: 12,
              border: '1px solid #252f46', objectFit: 'cover', marginBottom: 12,
              boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
            }}
          />
        )}

        {/* Generated image */}
        {message.generated_image_url && (
          <div className="mb-2">
          <div style={{ marginBottom: 12 }}>
            <img
              src={message.generated_image_url}
              alt={message.image_prompt || 'Generated image'}
              className="max-w-sm rounded-xl border border-[#262d3f] shadow-lg"
              style={{
                maxWidth: 420, borderRadius: 16,
                border: '1px solid #252f46',
                boxShadow: '0 8px 40px rgba(0,0,0,0.4)'
              }}
            />
            {message.image_prompt && (
              <p className="text-xs text-gray-500 mt-1 italic">{message.image_prompt}</p>
              <p style={{ fontSize: '0.8125rem', color: '#616d88', marginTop: 8, fontStyle: 'italic' }}>
                ✦ {message.image_prompt}
              </p>
            )}
          </div>
        )}

        {/* Message content */}
        {/* Message text */}
        {isUser ? (
          <p className="text-sm text-gray-200 whitespace-pre-wrap break-words leading-relaxed">
          <p style={{
            fontSize: '0.9375rem', color: '#dde2f0', whiteSpace: 'pre-wrap',
            lineHeight: 1.7, margin: 0, wordBreak: 'break-word'
          }}>
            {message.content}
          </p>
        ) : (
          <div className="prose-sm prose-invert max-w-none text-gray-200">
          <div className="prose-chat">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '');
                  return !inline ? (
                    <CodeBlock language={match?.[1]}>{children}</CodeBlock>
                  ) : (
                    <code className="px-1.5 py-0.5 bg-[#1a1e2b] rounded text-indigo-300 text-xs font-mono" {...props}>
                      {children}
                    </code>
                  );
                  return !inline
                    ? <CodeBlock language={match?.[1]}>{children}</CodeBlock>
                    : <InlineCode>{children}</InlineCode>;
                },
                table({ children }) {
                  return (
                    <div className="overflow-x-auto my-3">
                      <table className="border-collapse border border-[#262d3f] text-xs w-full">{children}</table>
                    </div>
                  );
                },
                th({ children }) {
                  return <th className="border border-[#262d3f] px-3 py-2 bg-[#141720] text-left font-semibold text-gray-300">{children}</th>;
                },
                td({ children }) {
                  return <td className="border border-[#262d3f] px-3 py-2 text-gray-300">{children}</td>;
                },
                blockquote({ children }) {
                  return <blockquote className="border-l-2 border-indigo-500 pl-4 my-2 text-gray-400 italic">{children}</blockquote>;
                },
                table: ({ children }) => (
                  <div style={{ overflowX: 'auto', margin: '0.75em 0' }}>
                    <table>{children}</table>
                  </div>
                ),
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        )}

        {/* Action buttons (assistant only) */}
        {/* AI message action buttons */}
        {!isUser && (
          <div className="flex items-center gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={copyContent}
              className="flex items-center gap-1 text-[10px] text-gray-500 hover:text-white transition-colors cursor-pointer"
            >
              {copied ? <><Check className="w-3 h-3 text-green-400" /> Copied</> : <><Copy className="w-3 h-3" /> Copy</>}
            </button>
            <button
              onClick={downloadContent}
              className="flex items-center gap-1 text-[10px] text-gray-500 hover:text-white transition-colors cursor-pointer"
            >
              <Download className="w-3 h-3" /> Download
            </button>
          <div style={{
            display: 'flex', gap: 6, marginTop: 12,
            opacity: 0, transition: 'opacity 0.2s'
          }}
            className="group-hover-actions"
            onMouseEnter={e => e.currentTarget.style.opacity = 1}
            ref={el => {
              if (el) {
                const parent = el.closest('.group');
                if (parent) {
                  parent.addEventListener('mouseenter', () => el.style.opacity = '1');
                  parent.addEventListener('mouseleave', () => el.style.opacity = '0');
                }
              }
            }}
          >
            {[
              { icon: copied ? Check : Copy, label: copied ? 'Copied!' : 'Copy', action: copyContent, active: copied },
              { icon: Download, label: 'Download', action: downloadContent }
            ].map(({ icon: Icon, label, action, active }) => (
              <button
                key={label}
                onClick={action}
                style={{
                  display: 'flex', alignItems: 'center', gap: 5, padding: '4px 10px',
                  background: '#131720', border: '1px solid #252f46', borderRadius: 8,
                  color: active ? '#4ade80' : '#8896b4', fontSize: '0.8125rem',
                  cursor: 'pointer', transition: 'all 0.15s', fontFamily: 'inherit'
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#3a4870'; e.currentTarget.style.color = '#eef0f8'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#252f46'; e.currentTarget.style.color = active ? '#4ade80' : '#8896b4'; }}
              >
                <Icon style={{ width: 13, height: 13 }} />
                {label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

