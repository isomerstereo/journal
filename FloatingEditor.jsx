import React, { useState } from 'react';
import ReactDOM from 'react-dom';

export const FloatingEditor = ({ selectedDate, setSelectedDate, workspaceHooks }) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isEditing, setIsEditing] = useState(true);

  if (!selectedDate) return null;

  const { visibleEntries, saveVaultEntry, checklistTasks, setChecklistTasks } = workspaceHooks;
  
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
    
    // Sync with the core checklist component space
    if (setChecklistTasks) {
      setChecklistTasks(prev => prev.map(t => t.id === todoId ? { ...t, done: !t.done } : t));
    }
  };

  const addTodo = (text) => {
    if (!text.trim()) return;
    const newTodo = { id: Date.now().toString(), text, done: false };
    handleUpdate('todos', [...todos, newTodo]);
    
    // Sync back up into global state core arrays
    if (setChecklistTasks) {
      setChecklistTasks(prev => [...prev, { id: newTodo.id, day: selectedDate, text, done: false }]);
    }
  };

  // --- PORTAL ELEMENT CONSTRUCTION ---
  const editorMarkup = (
    <div className="fixed bottom-6 right-6 w-80 bg-slate-950 border-2 border-indigo-500 rounded-xl shadow-2xl font-mono text-xs z-[9999] text-slate-200 overflow-hidden">
      {/* Header Panel Bar */}
      <div className="bg-indigo-950/80 border-b border-indigo-900 px-3 py-2 flex justify-between items-center select-none">
        <span className="font-bold text-indigo-300 uppercase tracking-wider">
          Workspace Node // Day {selectedDate}
        </span>
        <div className="flex gap-2">
          <button 
            onClick={() => setIsMinimized(!isMinimized)} 
            className="text-slate-400 hover:text-white font-bold"
          >
            {isMinimized ? '[ + ]' : '[ _ ]'}
          </button>
          <button 
            onClick={() => setSelectedDate(null)} 
            className="text-rose-400 hover:text-rose-300 font-bold"
          >
            [ X ]
          </button>
        </div>
      </div>

      {!isMinimized && (
        <div className="p-4 space-y-4">
          {/* Note Input Frame */}
          <div>
            <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider block mb-1">
              Active Shift Reflections
            </span>
            <textarea
              value={currentEntry.body}
              onChange={(e) => handleUpdate('body', e.target.value)}
              placeholder="Inject rapid notes or observation matrices..."
              className="w-full h-24 bg-black border border-slate-800 rounded p-2 text-xs text-slate-300 focus:outline-none focus:border-indigo-500 font-mono resize-none"
            />
          </div>

          {/* Quick Tasks Panel */}
          <div className="border-t border-slate-900 pt-3">
            <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider block mb-2">
              Internal Quest Tracker
            </span>
            <ul className="space-y-1 max-h-28 overflow-y-auto pr-1">
              {todos.map(todo => (
                <li key={todo.id} className="flex items-center gap-2 text-[11px]">
                  <input 
                    type="checkbox" 
                    checked={todo.done} 
                    onChange={() => toggleTodo(todo.id)}
                    className="accent-indigo-500 bg-black border-slate-800 rounded cursor-pointer"
                  />
                  <span className={todo.done ? "line-through text-slate-600" : "text-slate-300"}>
                    {todo.text}
                  </span>
                </li>
              ))}
              {todos.length === 0 && (
                <li className="text-slate-600 italic text-[10px]">No targets initialized.</li>
              )}
            </ul>
            <input 
              type="text"
              placeholder="+ Initialize quick target entry..."
              onKeyDown={(e) => { 
                if (e.key === 'Enter') { 
                  addTodo(e.target.value); 
                  e.target.value = ''; 
                } 
              }}
              className="w-full mt-2 bg-black border border-slate-900 rounded px-2 py-1 text-[11px] focus:outline-none focus:border-indigo-600 text-slate-400"
            />
          </div>
        </div>
      )}
    </div>
  );

  return ReactDOM.createPortal(editorMarkup, document.body);
};