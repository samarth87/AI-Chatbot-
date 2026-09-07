import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, Paperclip, X, FileText, Image as ImageIcon, Loader2, Sparkles,
  CornerDownLeft
} from 'lucide-react';

export default function ChatInput({ 
  onSendMessage, 
  loading, 
  settings, 
  onUpdateSettings,
  config 
}) {
  const [prompt, setPrompt] = useState('');
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  // Auto-grow textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.min(scrollHeight, 180)}px`;
    }
  }, [prompt]);

  const handleFileChange = (e) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...selectedFiles]);
    }
    // reset input so the same file can be selected again if removed
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (loading) return;
    if (!prompt.trim() && files.length === 0) return;

    onSendMessage({
      prompt: prompt.trim(),
      files,
    });

    setPrompt('');
    setFiles([]);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const isImage = (name) => {
    const ext = name.toLowerCase();
    return ext.endsWith('.png') || ext.endsWith('.jpg') || ext.endsWith('.jpeg') || ext.endsWith('.webp');
  };

  return (
    <div className="p-3 sm:p-4 bg-gradient-to-t from-[#0b0d12] via-[#0b0d12] to-transparent">
      <div className="max-w-4xl mx-auto">
        {/* Attached files pill preview list */}
        {files.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2 px-1">
            {files.map((file, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 bg-[#181b26] border border-[#272d3e] rounded-xl px-2.5 py-1.5 text-xs text-gray-200 shadow-sm animate-fadeIn"
              >
                {isImage(file.name) ? (
                  <ImageIcon className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                ) : (
                  <FileText className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                )}
                <span className="max-w-[140px] truncate font-medium">{file.name}</span>
                <span className="text-[10px] text-gray-500">({formatFileSize(file.size)})</span>
                <button
                  type="button"
                  onClick={() => removeFile(idx)}
                  className="text-gray-400 hover:text-red-400 p-0.5 rounded transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Composer Box */}
        <form
          onSubmit={handleSubmit}
          className="relative bg-[#13151f] border border-[#222736] focus-within:border-indigo-500/80 rounded-2xl shadow-xl transition-all"
        >
          {/* Text Input */}
          <textarea
            ref={textareaRef}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={files.length > 0 ? "Ask a question about the attached files or press Enter to analyze..." : "Ask anything... (Shift + Enter for new line)"}
            rows={1}
            disabled={loading}
            className="w-full bg-transparent px-4 pt-3.5 pb-2 text-sm text-white placeholder-gray-500 focus:outline-none resize-none leading-relaxed"
            style={{ maxHeight: '180px' }}
          />

          {/* Bottom Bar inside Composer */}
          <div className="flex items-center justify-between px-3 pb-2.5 pt-1">
            {/* Left Tools & Model Indicator */}
            <div className="flex items-center gap-2 flex-wrap">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.txt,.docx,.png,.jpg,.jpeg,.webp"
                onChange={handleFileChange}
                className="hidden"
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={loading}
                title="Attach documents or images (PDF, DOCX, TXT, PNG, JPG, WEBP)"
                className="p-1.5 text-gray-400 hover:text-white hover:bg-[#1f2433] rounded-lg transition-all flex items-center gap-1.5 text-xs font-medium cursor-pointer"
              >
                <Paperclip className="w-4 h-4" />
                <span className="hidden sm:inline">Attach</span>
              </button>

              {/* Quick Settings Badges */}
              <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-gray-400 pl-1 border-l border-[#242938]">
                <span className="px-2 py-0.5 rounded-full bg-[#1c202d] text-gray-300 font-medium border border-[#2c3244]">
                  {settings.model.includes('Groq') ? 'Groq 120B' : 'OpenAI GPT-5.6'}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#1c202d] text-gray-300 font-medium border border-[#2c3244]">
                  {settings.level}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#1c202d] text-gray-300 font-medium border border-[#2c3244]">
                  {settings.length}
                </span>
              </div>
            </div>

            {/* Right Submit Button */}
            <div className="flex items-center gap-1.5">
              <button
                type="submit"
                disabled={loading || (!prompt.trim() && files.length === 0)}
                className="p-2 bg-gradient-to-r from-[#4285f4] via-[#6366f1] to-[#8b5cf6] hover:opacity-95 text-white rounded-xl shadow-md shadow-indigo-600/25 disabled:opacity-30 disabled:shadow-none transition-all flex items-center justify-center cursor-pointer"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </form>

        <div className="text-center mt-2">
          <p className="text-[11px] text-gray-500">
            AI Info Generator provides high-accuracy AI responses. Always verify critical facts.
          </p>
        </div>
      </div>
    </div>
  );
}