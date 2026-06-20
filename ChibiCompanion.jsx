import React from 'react';

// Map your local artwork files or CDN paths to the corresponding states
const CHIBI_ASSETS = {
  IDLE: {
    img: '/assets/chibi/idle.png', 
    bubble: 'Let\'s get to work! What\'s first on the quest log?',
    color: 'border-slate-700 bg-slate-900'
  },
  TIRED_AF: {
    img: '/assets/chibi/tired.png',
    bubble: 'System resource low... Please tell me we are done soon.',
    color: 'border-amber-900 bg-amber-950/20 text-amber-300'
  },
  SUCCESS: {
    img: '/assets/chibi/success.png',
    bubble: 'Task cleared! Absolute genius performance.',
    color: 'border-emerald-900 bg-emerald-950/20 text-emerald-300'
  },
  LAZY: {
    img: '/assets/chibi/cozy.png',
    bubble: 'Comfy coordinates achieved. Do we *really* have to compile?',
    color: 'border-indigo-900 bg-indigo-950/20 text-indigo-300'
  }
};

export const ChibiCompanion = ({ state = 'IDLE', taskCount = 0 }) => {
  const currentPreset = CHIBI_ASSETS[state] || CHIBI_ASSETS.IDLE;

  // Context-aware dynamic subtitle override if tasks are piling up
  const displayBubble = taskCount > 3 && state === 'IDLE' 
    ? "Whoa, the queue is getting heavy. Focus up!" 
    : currentPreset.bubble;

  return (
    <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl font-mono text-xs flex flex-col items-center w-full max-w-[280px] text-center">
      
      {/* MANGA STYLE DIALOGUE BUBBLE */}
      <div className={`p-2.5 border rounded-lg mb-3 relative text-[11px] leading-tight ${currentPreset.color}`}>
        {displayBubble}
        {/* Little speech bubble down-arrow clip */}
        <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 bg-inherit border-r border-b border-inherit" />
      </div>

      {/* CHIBI AVATAR CONTAINER */}
      <div className="w-32 h-32 relative flex items-center justify-center bg-slate-900/40 border border-slate-900 rounded-full overflow-hidden group">
        {/* Placeholder structural wireframe box until images are mapped */}
        <img 
          src={currentPreset.img} 
          alt={`Chibi Expression: ${state}`}
          className="w-full h-full object-contain pixelated transition-transform duration-200 group-hover:scale-110"
          onError={(e) => {
            // Graceful text fallback if images aren't present in asset directory yet
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'block';
          }}
        />
        <div className="hidden font-bold text-lg tracking-widest animate-pulse text-indigo-400">
          {state === 'IDLE' && '(•ヮ•)'}
          {state === 'TIRED_AF' && '(✖╭╮✖)'}
          {state === 'SUCCESS' && '\\(ﾟヮﾟ)/'}
          {state === 'LAZY' && '(￣o￣)'}
        </div>
      </div>

      {/* META STATUS LABEL */}
      <div className="mt-2 text-[10px] uppercase font-bold tracking-widest text-slate-500">
        Companion Node // <span className="text-slate-300">{state}</span>
      </div>

    </div>
  );
};