import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { 
  Sparkles, User, Copy, Check, Download, FileText, Image as ImageIcon,
  CheckCheck
} from 'lucide-react';

export default function MessageItem({ message, user }) {
  const isUser = message.role === 'user';
  const [copied, setCopied] = useState(false);

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const handleDownloadTxt = () => {
    const element = document.createElement('a');
    const file = new Blob([message.content], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `ai-response-${Date.now()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const formatTime = (isoString) => {
    if (!isoString) return '';
    try {
      const d = new Date(isoString);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  return (
    <div className={`py-4 px-4 sm:px-6 flex gap-3.5 sm:gap-4 transition-colors ${
      isUser ? 'bg-[#10121a]/70' : 'bg-[#0e1017]/40'
    }`}>
      {/* Avatar */}
      <div className="shrink-0 mt-0.5">
        {isUser ? (
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white font-bold text-xs flex items-center justify-center shadow-sm">
            {(user?.username || 'U').slice(0, 2).toUpperCase()}
          </div>
        ) : (
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#4285f4] via-[#9b72cb] to-[#d96570] text-white flex items-center justify-center shadow-md shadow-purple-500/20">
            <Sparkles className="w-4 h-4" />
          </div>
        )}
      </div>

      {/* Message Body */}
      <div className="flex-1 min-w-0 space-y-2">
        {/* Name and Time Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold tracking-tight text-white">
              {isUser ? (user?.username || 'You') : 'AI Info Generator'}
            </span>
            <span className="text-[10px] text-gray-500 font-medium">
              {formatTime(message.created_at)}
            </span>
          </div>

          {/* Assistant Action Buttons */}
          {!isUser && (
            <div className="flex items-center gap-1 opacity-80 hover:opacity-100 transition-opacity">
              <button
                onClick={handleCopyText}
                title="Copy response"
                className="p-1.5 text-gray-400 hover:text-white hover:bg-[#1f2331] rounded-lg text-xs flex items-center gap-1 transition-all cursor-pointer"
              >
                {copied ? <CheckCheck className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline text-[11px]">{copied ? 'Copied' : 'Copy'}</span>
              </button>

              <button
                onClick={handleDownloadTxt}
                title="Download answer as text file"
                className="p-1.5 text-gray-400 hover:text-white hover:bg-[#1f2331] rounded-lg text-xs flex items-center gap-1 transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline text-[11px]">Download</span>
              </button>
            </div>
          )}
        </div>

        {/* Content rendering */}
        {isUser ? (
          <div className="text-sm text-gray-100 whitespace-pre-wrap leading-relaxed">
            {message.preview_image && (
              <div className="mb-3">
                <img
                  src={message.preview_image}
                  alt="Uploaded preview"
                  className="max-h-60 max-w-xs rounded-xl border border-[#2b3042] object-cover shadow-md"
                />
              </div>
            )}
            {message.content}
          </div>
        ) : (
          <div className="markdown-content text-sm">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '');
                  const codeString = String(children).replace(/\n$/, '');

                  if (!inline && match) {
                    return (
                      <CodeBlock language={match[1]} value={codeString}>
                        {children}
                      </CodeBlock>
                    );
                  }
                  return (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                }
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}

function CodeBlock({ language, value, children }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error('Copy failed', e);
    }
  };

  return (
    <div className="relative group my-3 rounded-xl overflow-hidden border border-[#252b3c] bg-[#12141c]">
      {/* Code header bar */}
      <div className="flex items-center justify-between px-3.5 py-1.5 bg-[#171a25] border-b border-[#252b3c] text-[11px] text-gray-400 font-mono">
        <span className="text-indigo-400 font-semibold">{language || 'code'}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-gray-400 hover:text-white px-2 py-0.5 rounded hover:bg-[#232838] transition-all cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-400" />
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code body */}
      <pre className="p-3.5 text-xs font-mono text-gray-200 overflow-x-auto m-0! bg-transparent! border-0! rounded-none!">
        <code>{value}</code>
      </pre>
    </div>
  );
}