import React, { useState } from 'react';

const JOURNAL_PROMPTS = [
  "What drained your battery the most today?",
  "Name one micro-victory you achieved in the last 12 hours.",
  "What problem or decision are you actively avoiding right now?",
  "Describe your current environment using only three distinct sensory details.",
  "If you had to give today a patch-note version title (e.g., v1.2.4), what would it be?",
  "What is the highest priority task cluttering your mental stack?"
];

export const PromptEngine = ({ customPrompts = [] }) => {
  const activePrompts = customPrompts.length > 0 ? customPrompts : JOURNAL_PROMPTS;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [entry, setEntry] = useState('');
  const [savedEntries, setSavedEntries] = useState([]);

  const nextPrompt = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % activePrompts.length);
    setEntry(''); // Clear field for new context
  };

  const saveEntry = (e) => {
    e.preventDefault();
    if (!entry.trim()) return;

    const newLog = {
      id: Date.now(),
      prompt: activePrompts[currentIndex],
      text: entry,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setSavedEntries([newLog, ...savedEntries]);
    setEntry('');
  };

  return (
    <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl font-mono text-xs text-slate-300 w-full max-w-xl selection:bg-slate-800">
      {/* Module Header */}
      <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-800">
        <h3 className="text-sm font-bold tracking-wider uppercase text-slate-400">Reflection Prompt</h3>
        <button 
          onClick={nextPrompt}
          className="text-[10px] text-indigo-400 hover:text-indigo-300 transition-colors uppercase tracking-widest font-bold"
        >
          [ REROLL 🎲 ]
        </button>
      </div>

      {/* Dynamic Prompt Box */}
      <div className="mb-4 p-3 bg-slate-900/40 border border-dashed border-slate-800 rounded-lg">
        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Active Query</span>
        <p className="text-[12px] text-slate-200 font-medium leading-relaxed italic">
          "{activePrompts[currentIndex]}"
        </p>
      </div>

      {/* Input Form Fields */}
      <form onSubmit={saveEntry} className="space-y-2">
        <textarea
          value={entry}
          onChange={(e) => setEntry(e.target.value)}
          placeholder="Type a raw, unfiltered brain dump response..."
          className="w-full h-16 p-2 bg-slate-900 border border-slate-800 rounded-md text-slate-300 placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors resize-none text-[11px]"
        />
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-3 py-1 bg-indigo-950 border border-indigo-800 text-indigo-400 font-bold uppercase rounded hover:bg-indigo-900/50 transition-all text-[10px] tracking-wider"
          >
            Commit Log
          </button>
        </div>
      </form>

      {/* Local Buffer Feed */}
      {savedEntries.length > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-900 space-y-2 max-h-32 overflow-y-auto">
          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">Session Buffer</span>
          {savedEntries.map((log) => (
            <div key={log.id} className="p-2 bg-slate-900/20 border border-slate-900 rounded text-[10px]">
              <div className="flex justify-between text-slate-500 font-bold mb-0.5">
                <span className="truncate max-w-[70%]">{log.prompt}</span>
                <span>{log.timestamp}</span>
              </div>
              <p className="text-slate-400 leading-tight">{log.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};