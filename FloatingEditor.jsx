import React, { useState } from 'react';

export const FloatingEditor = ({ selectedDate, setSelectedDate, workspaceHooks }) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isEditing, setIsEditing] = useState(true);

  if (!selectedDate) return null;

  const { visibleEntries, saveVaultEntry } = workspaceHooks;
  const currentEntry = visibleEntries.find(e => e.day === selectedDate) || {
    day: selectedDate,
    title: `LOG REFRESH — DAY ${selectedDate}`,
    body: '',
    tags: [],
    todos: []
  };

  const todos = currentEntry.todos || [];

  const handleUpdate = (field, value) => {
    saveVaultEntry(selectedDate, {
      ...currentEntry,
      [field]: value
    });
  };

  const toggleTodo = (todoId) => {
    const updatedTodos = todos.map(todo => 
      todo.id === todoId ? { ...todo, done: !todo.done } : todo
    );
    handleUpdate('todos', updatedTodos);
  };

  const addTodo = (text) => {
    if (!text.trim()) return;
    const newTodo = { id: Date.now().toString(), text, done: false };
    handleUpdate('todos', [...todos, newTodo]);
  };

  if (isMinimized) {
    return (
      <div 
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-6 right-6 bg-indigo-950 border border-indigo-500 text-indigo-300 px-4 py-2 rounded shadow-2xl z-50 font-mono text-xs font-bold cursor-pointer hover:bg-indigo-900 uppercase tracking-wider"
      >
        📂 [Restore Journal Node: Day {selectedDate}]
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 max-h-[500px] bg-slate-950 border border-slate-800 rounded-lg shadow-2xl z-50 flex flex-col font-mono text-xs">
      {/* Window Title Ribbon */}
      <div className="flex justify-between items-center bg-slate-900 px-3 py-2 border-b border-slate-800 rounded-t-lg">
        <span className="text-[10px] text-indigo-400 font-bold tracking-wider uppercase">// JOURNAL_EDITOR // DAY {selectedDate}</span>
        <div className="flex gap-2">
          <button type="button" onClick={() => setIsMinimized(true)} className="text-slate-500 hover:text-amber-400 font-bold">[_]</button>
          <button type="button" onClick={() => setSelectedDate(null)} className="text-slate-500 hover:text-rose-400 font-bold">[X]</button>
        </div>
      </div>

      <div className="p-4 flex-1 overflow-y-auto space-y-4">
        {/* Toggle Mode Ribbon */}
        <div className="flex justify-between items-center bg-slate-900 p-1 rounded border border-slate-800">
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className={`text-[9px] font-bold px-2 py-0.5 rounded ${isEditing ? 'bg-amber-950 text-amber-400 border border-amber-900' : 'text-slate-500'}`}
            >
              [EDIT]
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className={`text-[9px] font-bold px-2 py-0.5 rounded ${!isEditing ? 'bg-indigo-950 text-indigo-400 border border-indigo-900' : 'text-slate-500'}`}
            >
              [PREVIEW]
            </button>
          </div>
        </div>

        {/* Title Node */}
        <input
          type="text"
          value={currentEntry.title || ''}
          onChange={(e) => handleUpdate('title', e.target.value)}
          placeholder="Untitled Log Entry Node"
          className="w-full bg-transparent border-b border-slate-900 text-amber-400 font-bold focus:outline-none focus:border-amber-600 uppercase pb-1"
        />

        {/* Content Canvas */}
        {isEditing ? (
          <textarea
            value={currentEntry.body || ''}
            onChange={(e) => handleUpdate('body', e.target.value)}
            placeholder="Begin typing stream data structure..."
            className="w-full h-32 bg-slate-900 border border-slate-800 p-2 rounded text-slate-300 focus:outline-none focus:border-slate-700 resize-none leading-relaxed text-[11px]"
          />
        ) : (
          <div className="w-full h-32 bg-slate-900/40 border border-transparent p-2 text-slate-300 overflow-y-auto whitespace-pre-wrap leading-relaxed text-[11px]">
            {currentEntry.body || <span className="text-slate-600 italic">No notes written.</span>}
          </div>
        )}

        {/* Active Checklist Section */}
        <div className="border-t border-slate-900 pt-3">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-2">Journal Task Registers</span>
          <ul className="space-y-1 max-h-24 overflow-y-auto">
            {todos.map(todo => (
              <li key={todo.id} className="flex items-center gap-2 text-[11px]">
                <input 
                  type="checkbox" 
                  checked={todo.done} 
                  onChange={() => toggleTodo(todo.id)}
                  className="accent-indigo-500 bg-slate-950 border-slate-800 rounded cursor-pointer"
                />
                <span className={todo.done ? "line-through text-slate-600" : "text-slate-300"}>{todo.text}</span>
              </li>
            ))}
          </ul>
          <input 
            type="text"
            placeholder="+ Deploy new journal check target..."
            onKeyDown={(e) => { 
              if (e.key === 'Enter') { 
                addTodo(e.target.value); 
                e.target.value = ''; 
              } 
            }}
            className="w-full mt-2 bg-slate-900 border border-slate-800 rounded p-1 text-[10px] text-slate-400 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>
    </div>
  );
};