import React from 'react';

const EVENT_PRESETS = {
  NOTE: { marker: '◆', color: 'text-indigo-400', border: 'border-indigo-500/30', bg: 'bg-indigo-950/10' },
  FITNESS: { marker: '▲', color: 'text-emerald-400', border: 'border-emerald-500/30', bg: 'bg-emerald-950/10' },
  SYSTEM: { marker: '■', color: 'text-amber-400', border: 'border-amber-500/30', bg: 'bg-amber-950/10' },
  IDEA: { marker: '★', color: 'text-pink-400', border: 'border-pink-500/30', bg: 'bg-pink-950/10' }
};

export const JournalTimeline = ({ events = [] }) => {
  // Balanced default events representing a standard day's chronological sequence
  const defaultEvents = [
    { id: 1, time: "08:30", type: "NOTE", title: "Morning Reflection", desc: "Woke up feeling rested. Ready to tackle the dashboard refactor today." },
    { id: 2, time: "11:15", type: "SYSTEM", title: "Homelab Deployment", desc: "Successfully migrated local DNS container to the secondary high-availability node." },
    { id: 3, time: "14:00", type: "IDEA", title: "Feature Concept: Infinite Canvas", desc: "What if the causality map used standard viewport matrix transforms instead of absolute heavy layout containers?" },
    { id: 4, time: "18:45", type: "FITNESS", title: "Zone 2 Cardio session", desc: "45-minute trail run. Pace felt steady; heart rate recovered within target threshold." },
    { id: 5, time: "22:00", type: "NOTE", title: "Night Wrap-up", desc: "Trackers updated. Turning off major screens early to protect sleep hygiene." }
  ];

  const activeEvents = events.length > 0 ? events : defaultEvents;

  return (
    <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl font-mono text-xs text-slate-300 w-full max-w-xl selection:bg-slate-800">
      {/* Module Header */}
      <div className="flex justify-between items-center mb-6 pb-2 border-b border-slate-800">
        <h3 className="text-sm font-bold tracking-wider uppercase text-slate-400">Chronicle Feed</h3>
        <span className="text-[10px] text-slate-500">LINEAR TIMELINE</span>
      </div>

      {/* Vertical Spine Wrapper */}
      <div className="relative pl-6 border-l border-slate-800 ml-3 space-y-6">
        {activeEvents.map((event) => {
          const config = EVENT_PRESETS[event.type] || EVENT_PRESETS.NOTE;

          return (
            <div key={event.id} className="relative group">
              
              {/* Chronological Spine Node Marker */}
              <span className={`absolute -left-[31px] top-0.5 w-4 h-4 bg-slate-950 rounded-full flex items-center justify-center font-bold text-[10px] ${config.color} transition-transform group-hover:scale-125`}>
                {config.marker}
              </span>

              {/* Event Content Block */}
              <div className={`p-3 border rounded-lg transition-all duration-200 hover:border-slate-700 ${config.border} ${config.bg}`}>
                {/* Meta Row */}
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] font-bold text-slate-500 tracking-wider">{event.time}</span>
                  <span className={`text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 ${config.color}`}>
                    {event.type}
                  </span>
                </div>

                {/* Body Text */}
                <h4 className="font-bold text-slate-200 mb-0.5 tracking-tight">{event.title}</h4>
                <p className="text-slate-400 leading-relaxed text-[11px]">{event.desc}</p>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
};