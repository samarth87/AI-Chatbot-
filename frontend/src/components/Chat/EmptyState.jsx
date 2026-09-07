import React from 'react';
import { Sparkles, Code2, BookOpen, Lightbulb, FileText } from 'lucide-react';
import { Sparkles, Code2, BookOpen, Lightbulb, FileText, Mic, ImageIcon, Upload } from 'lucide-react';

const SUGGESTIONS = [
  { icon: Code2, label: 'Write code', prompt: 'Write a Python function to parse a JSON file and extract all keys recursively', color: 'text-blue-400' },
  { icon: BookOpen, label: 'Explain concept', prompt: 'Explain machine learning in simple terms with real-world examples', color: 'text-purple-400' },
  { icon: Lightbulb, label: 'Brainstorm', prompt: 'Give me 10 creative startup ideas in the AI space for 2025', color: 'text-yellow-400' },
  { icon: FileText, label: 'Summarize', prompt: 'What are the key differences between REST, GraphQL, and gRPC APIs?', color: 'text-green-400' },
  {
    icon: Code2,
    label: 'Write Code',
    desc: 'Generate, debug, or explain code',
    prompt: 'Write a Python function that reads a CSV file and returns the top 5 rows by a given column value',
    gradient: 'linear-gradient(135deg, #4285f4, #34a8ff)'
  },
  {
    icon: BookOpen,
    label: 'Explain Concept',
    desc: 'Learn anything in simple terms',
    prompt: 'Explain how neural networks work with a beginner-friendly analogy and a real-world example',
    gradient: 'linear-gradient(135deg, #7c4dff, #a78bfa)'
  },
  {
    icon: Lightbulb,
    label: 'Brainstorm Ideas',
    desc: 'Creative suggestions & innovation',
    prompt: 'Give me 10 creative and practical AI startup ideas that could be built by a solo developer in 2025',
    gradient: 'linear-gradient(135deg, #f59e0b, #fbbf24)'
  },
  {
    icon: FileText,
    label: 'Compare & Contrast',
    desc: 'Analyze differences clearly',
    prompt: 'Compare REST, GraphQL, and gRPC APIs — when to use each one, with pros and cons',
    gradient: 'linear-gradient(135deg, #10b981, #34d399)'
  },
];

const CAPABILITY_PILLS = [
  { icon: Upload, text: 'PDF & DOCX upload' },
  { icon: ImageIcon, text: 'Image vision' },
  { icon: Mic, text: 'Voice input' },
  { icon: Sparkles, text: 'DALL-E 3 images' },
];

export default function EmptyState({ username, onSelectPrompt }) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="flex flex-col items-center justify-center h-full px-4 py-16 text-center select-none">
      {/* Logo */}
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#4285f4] via-[#9b72cb] to-[#d96570] flex items-center justify-center shadow-2xl shadow-purple-500/30 mb-6">
        <Sparkles className="w-8 h-8 text-white" />
      </div>
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', height: '100%',
      padding: '2rem 1.5rem', textAlign: 'center', userSelect: 'none',
      overflowY: 'auto'
    }}>

      <h2 className="text-2xl font-bold text-white mb-1">
        {greeting}, <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">{username || 'there'}</span>!
      </h2>
      <p className="text-gray-400 text-sm mb-10 max-w-sm">
        Start a conversation, upload a document, generate an image, or try one of these prompts:
      </p>
      {/* Ambient glow */}
      <div style={{
        position: 'absolute', top: '30%', left: '50%', transform: 'translateX(-50%)',
        width: 500, height: 500, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(80,96,216,0.1) 0%, transparent 70%)',
        pointerEvents: 'none', zIndex: 0
      }} />

      {/* Suggestion cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl">
        {SUGGESTIONS.map(({ icon: Icon, label, prompt, color }) => (
          <button
            key={label}
            onClick={() => onSelectPrompt(prompt)}
            className="group flex items-start gap-3 p-4 bg-[#0e1117] hover:bg-[#121620] border border-[#1f2330] hover:border-indigo-500/40 rounded-2xl text-left transition-all cursor-pointer shadow-sm hover:shadow-indigo-500/10"
          >
            <div className={`${color} mt-0.5 shrink-0 group-hover:scale-110 transition-transform`}>
              <Icon className="w-5 h-5" />
      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 720 }}>

        {/* Logo */}
        <div style={{
          width: 76, height: 76, borderRadius: 22, margin: '0 auto 24px',
          background: 'linear-gradient(135deg, #4285f4 0%, #7c4dff 50%, #e040fb 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 60px rgba(80,96,216,0.4), 0 8px 32px rgba(0,0,0,0.5)'
        }}>
          <Sparkles style={{ width: 36, height: 36, color: '#fff' }} />
        </div>

        {/* Greeting */}
        <h2 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#f0f2fa', margin: '0 0 10px', letterSpacing: '-0.02em' }}>
          {greeting},{' '}
          <span style={{
            background: 'linear-gradient(135deg, #7b9fff, #c084fc)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'
          }}>
            {username || 'there'}!
          </span>
        </h2>
        <p style={{ fontSize: '1rem', color: '#616d88', margin: '0 0 32px', lineHeight: 1.6 }}>
          Start a conversation, upload a document, or try one of the suggestions below.
        </p>

        {/* Capability pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginBottom: 36 }}>
          {CAPABILITY_PILLS.map(({ icon: Icon, text }) => (
            <div key={text} style={{
              display: 'flex', alignItems: 'center', gap: 7,
              padding: '6px 14px', background: '#0d1018',
              border: '1px solid #1e2535', borderRadius: 99,
              fontSize: '0.8125rem', color: '#8896b4'
            }}>
              <Icon style={{ width: 13, height: 13, color: '#5060d8' }} />
              {text}
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-300 mb-0.5">{label}</p>
              <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{prompt}</p>
            </div>
          </button>
        ))}
          ))}
        </div>

        {/* Suggestion cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12 }}>
          {SUGGESTIONS.map(({ icon: Icon, label, desc, prompt, gradient }) => (
            <button
              key={label}
              onClick={() => onSelectPrompt(prompt)}
              style={{
                display: 'flex', alignItems: 'flex-start', gap: 14,
                padding: '1rem 1.125rem',
                background: '#0d1018',
                border: '1px solid #1e2535',
                borderRadius: 16, textAlign: 'left', cursor: 'pointer',
                transition: 'all 0.2s', width: '100%', fontFamily: 'inherit'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = '#3a4870';
                e.currentTarget.style.background = '#111827';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.3)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = '#1e2535';
                e.currentTarget.style.background = '#0d1018';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {/* Icon bubble */}
              <div style={{
                width: 40, height: 40, borderRadius: 12, flexShrink: 0, marginTop: 1,
                background: gradient,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
              }}>
                <Icon style={{ width: 19, height: 19, color: '#fff' }} />
              </div>

              <div style={{ minWidth: 0 }}>
                <p style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#e2e8f8', margin: '0 0 4px' }}>{label}</p>
                <p style={{ fontSize: '0.8125rem', color: '#616d88', margin: '0 0 8px', lineHeight: 1.5 }}>{desc}</p>
                <p style={{
                  fontSize: '0.8125rem', color: '#8896b4', margin: 0, lineHeight: 1.5,
                  display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'
                }}>
                  {prompt}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <p className="text-xs text-gray-600 mt-8">
        Supports PDF · DOCX · TXT · Images · Voice input · DALL-E 3 image generation
      </p>
    </div>
  );
}

