import React, { useState } from 'react';

export const EventModal = ({ day, onClose, onSave }) => {
  const [formData, setFormData] = useState({ title: '', desc: '', type: 'NOTE' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return; // Prevent empty entries
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-sm shadow-2xl p-6 font-mono text-xs">
        
        {/* Modal Header */}
        <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-800">
          <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider">
            New Log — Day {day || 'GLOBAL'}
          </h3>
          <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">
            Data Input Node
          </span>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1">
              Log Classification
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-300 outline-none focus:border-indigo-500 cursor-pointer text-xs"
            >
              <option value="NOTE">NOTE</option>
              <option value="MILESTONE">MILESTONE</option>
              <option value="SYSTEM">SYSTEM ALERT</option>
              <option value="ACHIEVEMENT">ACHIEVEMENT</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1">
              Header Identifier
            </label>
            <input 
              type="text"
              required
              value={formData.title}
              className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-300 outline-none focus:border-indigo-500 placeholder:text-slate-700 text-xs"
              placeholder="Ex: Refined canvas viewport matrix calculations"
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1">
              Descriptive Payload
            </label>
            <textarea 
              value={formData.desc}
              className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-300 outline-none focus:border-indigo-500 placeholder:text-slate-700 h-24 resize-none text-xs"
              placeholder="Enter context, metrics, or follow-up notes..."
              onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
            />
          </div>

          {/* Action Row */}
          <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
            <button 
              type="button"
              onClick={onClose} 
              className="text-[10px] text-slate-500 hover:text-slate-300 uppercase tracking-wider px-3 py-1.5 transition-colors font-bold"
            >
              Abort [×]
            </button>
            <button 
              type="submit"
              className="text-[10px] bg-indigo-600/20 text-indigo-400 border border-indigo-500/40 hover:bg-indigo-600/40 px-4 py-1.5 rounded uppercase tracking-wider font-bold transition-all"
            >
              Commit Entry [↵]
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};