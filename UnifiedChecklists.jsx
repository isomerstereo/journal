import React, { useState } from 'react';

export const UnifiedChecklist = ({ initialTasks = [] }) => {
  // Production fallback tracking structured quest parameters
  const defaultTasks = [
    { id: 1, text: "Configure Vaultwarden backup script over SSH", priority: "A", energy: 3, done: true, category: "Homelab" },
    { id: 2, text: "Map viewport matrix transforms for Causality Canvas", priority: "A", energy: 2, done: false, category: "Dev" },
    { id: 3, text: "Review behavioral data log parameters from morning notes", priority: "B", energy: 1, done: false, category: "Journal" },
    { id: 4, text: "Clean and mount the new unRAID array expansion drive", priority: "C", energy: 3, done: false, category: "Hardware" }
  ];

  const [tasks, setTasks] = useState(initialTasks.length > 0 ? initialTasks : defaultTasks);

  const toggleTask = (id) => {
    setTasks(tasks.map(task => task.id === id ? { ...task, done: !task.done } : task));
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'A': return 'text-rose-400 bg-rose-950/30 border-rose-800';
      case 'B': return 'text-amber-400 bg-amber-950/30 border-amber-800';
      default: return 'text-sky-400 bg-sky-950/30 border-sky-800';
    }
  };

  return (
    <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl font-mono text-xs text-slate-300 w-full max-w-xl selection:bg-slate-800">
      {/* Module Header */}
      <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-800">
        <h3 className="text-sm font-bold tracking-wider uppercase text-slate-400">Quest Core</h3>
        <span className="text-[10px] text-slate-500">AGGREGATED OUTLINER</span>
      </div>

      {/* Task Stack */}
      <div className="space-y-2">
        {tasks.map((task) => (
          <div 
            key={task.id}
            onClick={() => toggleTask(task.id)}
            className={`flex items-center justify-between p-2.5 border rounded-lg cursor-pointer transition-all duration-150 ${
              task.done 
                ? 'bg-slate-900/20 border-slate-900 opacity-40 line-through text-slate-500' 
                : 'bg-slate-900/50 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
            }`}
          >
            {/* Left Box: Custom Markdown Styled Box & Text */}
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <span className={`font-bold shrink-0 text-[13px] ${task.done ? 'text-indigo-500' : 'text-slate-600'}`}>
                {task.done ? '[x]' : '[ ]'}
              </span>
              <span className="truncate text-[11px] leading-tight font-medium">
                {task.text}
              </span>
            </div>

            {/* Right Box: Metadata Meta Badges */}
            <div className="flex items-center gap-2 shrink-0 ml-4 pointer-events-none">
              {/* Category Tag */}
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-500 font-bold uppercase tracking-wider">
                {task.category}
              </span>

              {/* Energy Metric indicator */}
              <span className="text-amber-500 tracking-tighter text-[10px]">
                {Array.from({ length: task.energy }).map(() => '⚡')}
              </span>

              {/* Priority Marker */}
              <span className={`text-[9px] font-bold w-5 h-5 flex items-center justify-center border rounded ${getPriorityColor(task.priority)}`}>
                #{task.priority}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};