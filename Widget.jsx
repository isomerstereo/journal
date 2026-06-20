import React, { useState } from 'react';

export const Widget = ({ title = "SYS_MODULE", children }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden font-mono text-xs shadow-2xl transition-all duration-200">
      
      {/* WINDOW HEADER BAR */}
      <div className="bg-slate-900/60 border-b border-slate-800 px-4 py-2 flex justify-between items-center select-none">
        <div className="flex items-center gap-2">
          {/* Decorative Terminal Dots */}
          <span className="w-2 h-2 rounded-full bg-rose-500/40 border border-rose-600/50" />
          <span className="w-2 h-2 rounded-full bg-amber-500/40 border border-amber-600/50" />
          <span className="w-2 h-2 rounded-full bg-emerald-500/40 border border-emerald-600/50" />
          
          {/* Module Title */}
          <span className="font-bold tracking-wider text-slate-400 uppercase ml-1">
            {title}
          </span>
        </div>

        {/* Window Control Actions */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="text-slate-500 hover:text-indigo-400 font-bold transition-colors px-1 text-[11px]"
            title={isOpen ? "Minimize Module" : "Expand Module"}
          >
            {isOpen ? '[ _ ]' : '[ ⤢ ]'}
          </button>
        </div>
      </div>

      {/* WINDOW CONTENT BODY */}
      <div 
        className={`transition-all duration-200 origin-top ${
          isOpen 
            ? 'max-h-[1000px] opacity-100 p-4' 
            : 'max-h-0 opacity-0 pointer-events-none overflow-hidden'
        }`}
      >
        {children}
      </div>

    </div>
  );
};