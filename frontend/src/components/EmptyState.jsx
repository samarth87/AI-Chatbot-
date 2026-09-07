import React from 'react';
import { Sparkles, Code2, BookOpen, Lightbulb, FileText, ArrowUpRight } from 'lucide-react';

export default function EmptyState({ username, onSelectPrompt }) {
  const suggestions = [
    {
      icon: <Lightbulb className="w-4 h-4 text-amber-400" />,
      title: 'Explain Complex Concepts',
      desc: 'Explain quantum computing in simple terms with real-world analogies.',
      prompt: 'Explain quantum computing in simple terms with intuitive real-world analogies.'
    },
    {
      icon: <Code2 className="w-4 h-4 text-emerald-400" />,
      title: 'Generate & Review Code',
      desc: 'Write a Python FastAPI service with JWT authentication and SQLite.',
      prompt: 'Write a clean Python FastAPI service with JWT authentication and SQLite database integration.'
    },
    {
      icon: <FileText className="w-4 h-4 text-indigo-400" />,
      title: 'Document & PDF Analysis',
      desc: 'Summarize key findings, action items, and data tables from an attached file.',
      prompt: 'Summarize the key findings, action items, and data points from the attached document.'
    },
    {
      icon: <BookOpen className="w-4 h-4 text-pink-400" />,
      title: 'Research & Study Guide',
      desc: 'Create an in-depth study guide for distributed database architectures.',
      prompt: 'Create an in-depth, structured study guide on distributed database architectures including CAP theorem and consensus algorithms.'
    }
  ];

  return (
    <div className="h-full flex flex-col items-center justify-center p-6 text-center max-w-2xl mx-auto animate-fadeIn">
      {/* Glow icon */}
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#4285f4] via-[#9b72cb] to-[#d96570] text-white flex items-center justify-center shadow-xl shadow-purple-500/20 mb-5">
        <Sparkles className="w-8 h-8" />
      </div>

      {/* Greeting */}
      <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">
        Hello, <span className="bg-gradient-to-r from-[#4285f4] via-[#9b72cb] to-[#d96570] bg-clip-text text-transparent">{username || 'there'}</span>
      </h2>
      <p className="text-sm sm:text-base text-gray-400 max-w-md mb-8">
        What would you like to explore, analyze, or build today?
      </p>

      {/* Suggestion Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full text-left">
        {suggestions.map((item, idx) => (
          <button
            key={idx}
            onClick={() => onSelectPrompt(item.prompt)}
            className="group p-4 bg-[#121520] hover:bg-[#181c2b] border border-[#222738] hover:border-indigo-500/50 rounded-2xl transition-all flex flex-col justify-between text-left cursor-pointer shadow-sm hover:shadow-md"
          >
            <div className="flex items-center justify-between w-full mb-2">
              <div className="p-2 rounded-xl bg-[#1a1d2c] border border-[#2a3044]">
                {item.icon}
              </div>
              <ArrowUpRight className="w-4 h-4 text-gray-600 group-hover:text-indigo-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white mb-1 group-hover:text-indigo-300 transition-colors">
                {item.title}
              </h3>
              <p className="text-[11px] text-gray-400 line-clamp-2 leading-relaxed">
                {item.desc}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}