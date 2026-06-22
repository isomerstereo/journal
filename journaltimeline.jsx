import React from 'react';

const EVENT_PRESETS = {
  NOTE: { marker: '◆', color: 'text-indigo-400', border: 'border-indigo-500/30', bg: 'bg-indigo-950/10' },
  FITNESS: { marker: '▲', color: 'text-emerald-400', border: 'border-emerald-500/30', bg: 'bg-emerald-950/10' },
  SYSTEM: { marker: '■', color: 'text-amber-400', border: 'border-amber-500/30', bg: 'bg-amber-950/10' },
  IDEA: { marker: '★', color: 'text-pink-400', border: 'border-pink-500/30', bg: 'bg-pink-950/10' }
};

export const JournalTimeline = ({ events = [], activeDay, onAddEvent }) => {
  // Filter events based on activeDay.
  const displayEvents = activeDay 
    ? events.filter(e => e.day === activeDay) 
    : events;

  return (
    <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl font-mono text-xs text-slate-300 w-full max-w-xl selection:bg-slate-800">
      <div className="flex justify-between items-center mb-6 pb-2 border-b border-slate-800">
        <h3 className="text-sm font-bold tracking-wider uppercase text-slate-400">Chronicle Feed</h3>
        
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-slate-500 uppercase">
            {activeDay ? `Day ${activeDay} Log` : "Global Stream"}
          </span>
          {activeDay && (
            <button 
              onClick={onAddEvent}
              className="text-[10px] bg-indigo-950/50 hover:bg-indigo-900 border border-indigo-500/50 text-indigo-400 px-2 py-0.5 rounded transition-colors"
            >
              + ADD LOG
            </button>
          )}
        </div>
      </div>

      <div className="relative pl-6 border-l border-slate-800 ml-3 space-y-6">
        {displayEvents.length > 0 ? (
          displayEvents.map((event) => {
            const config = EVENT_PRESETS[event.type] || EVENT_PRESETS.NOTE;

            return (
              <div key={event.id} className="relative group">
                <span className={`absolute -left-[31px] top-0.5 w-4 h-4 bg-slate-950 rounded-full flex items-center justify-center font-bold text-[10px] ${config.color} transition-transform group-hover:scale-125`}>
                  {config.marker}
                </span>

                <div className={`p-3 border rounded-lg transition-all duration-200 hover:border-slate-700 ${config.border} ${config.bg}`}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] font-bold text-slate-500 tracking-wider">{event.time}</span>
                    <span className={`text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 ${config.color}`}>
                      {event.type}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-200 mb-0.5 tracking-tight">{event.title}</h4>
                  <p className="text-slate-400 leading-relaxed text-[11px]">{event.desc}</p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-8 text-center text-[10px] text-slate-600 italic border border-dashed border-slate-800 rounded">
            // No events logged for this cycle.
          </div>
        )}
      </div>
    </div>
  );
};