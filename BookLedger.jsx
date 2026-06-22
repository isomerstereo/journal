import React, { useState } from 'react';

export const BookLedger = ({ workspaceHooks, activeDay = null, onSelectDay }) => {
  const {
    activeSection,
    setActiveSection,
    activeNotebookId,
    setActiveNotebookId,
    filteredNotebooks,
    activeNotebook,
    createNotebook,
    updateNotebookRating,
    deleteNotebook,
    visibleEntries
  } = workspaceHooks;

  // Ledger configuration states
  const [currentPage, setCurrentPage] = useState(0);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newBookTitle, setNewBookTitle] = useState('');
  const [newBookSection, setNewBookSection] = useState('review');
  const [newBookType, setNewBookType] = useState('review');

  const entriesPerPage = 5;

  // Sidebar shelves taxonomy mapping
  const shelves = [
    { id: 'all', title: 'All Volumes' },
    { id: 'journal', title: 'Journals' },
    { id: 'review', title: 'Review Library' },
    { id: 'thoughts', title: 'Shower Thoughts' },
    { id: 'projects', title: 'Planning Projects' }
  ];

  const handleCreateBook = (e) => {
    e.preventDefault();
    if (!newBookTitle.trim()) return;
    
    const coverMap = {
      journal: 'bg-amber-800 border-amber-950 text-amber-200',
      review: 'bg-emerald-800 border-emerald-950 text-emerald-200',
      thoughts: 'bg-indigo-800 border-indigo-950 text-indigo-200',
      planning: 'bg-cyan-800 border-cyan-950 text-cyan-200'
    };

    createNotebook(newBookTitle, newBookSection, newBookType, coverMap[newBookType] || 'bg-slate-700');
    setNewBookTitle('');
    setShowCreateModal(false);
  };

  // --- RENDERING AN OPEN VOLUME ---
  if (activeNotebook) {
    // Scoped calculations for the open ledger view
    const totalPages = Math.ceil(visibleEntries.length / entriesPerPage);
    const startIndex = currentPage * entriesPerPage;
    const paginatedEntries = visibleEntries.slice(startIndex, startIndex + entriesPerPage);
    const activeEntry = visibleEntries.find(e => e.day === activeDay);

    return (
      <div className="space-y-4 font-mono text-xs">
        {/* Navigation Breadcrumb Bar */}
        <div className="flex justify-between items-center bg-slate-950/60 p-3 border border-slate-900 rounded-lg">
          <div>
            <span className="text-[9px] text-indigo-400 uppercase tracking-widest font-bold">// LOCATION: {activeNotebook.type} shelf</span>
            <h2 className="text-sm font-bold text-slate-200 tracking-tight">{activeNotebook.title}</h2>
          </div>
          <button 
            onClick={() => { setActiveNotebookId(null); setCurrentPage(0); }}
            className="px-3 py-1 bg-slate-900 border border-slate-800 hover:border-slate-700 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded text-[11px] transition-colors"
          >
            [◂ Close & Return to Shelf]
          </button>
        </div>

        {/* 1. JOURNAL & REVIEW SUBTYPES: Open Two-Page Ledger View */}
        {(activeNotebook.type === 'journal' || activeNotebook.type === 'review') && (
          <div className="space-y-4">
            {activeNotebook.type === 'review' && (
              <div className="flex items-center gap-4 bg-slate-950/40 p-3 border border-slate-900 rounded-lg">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Evaluation Score:</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => updateNotebookRating(activeNotebook.id, star)}
                      className={`text-sm transition-colors ${star <= (activeNotebook.rating || 0) ? 'text-amber-400' : 'text-slate-800'}`}
                    >
                      ★
                  </button>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-900/40 p-4 border border-slate-800 rounded-lg">
              {/* LEFT PAGE: ARCHIVE DIRECTORY LEDGER */}
              <div className="border-r border-slate-800/60 pr-4 flex flex-col justify-between min-h-[220px]">
                <div>
                  <div className="flex justify-between items-center border-b border-slate-800 pb-2 mb-3">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Index Cased Logs</span>
                    <span className="text-[9px] text-slate-600 font-bold">PG {currentPage + 1}/{totalPages || 1}</span>
                  </div>

                  {visibleEntries.length === 0 ? (
                    <div className="text-slate-600 italic py-4 text-center">No synchronized logs found in this scope.</div>
                  ) : (
                    <ul className="space-y-1.5">
                      {paginatedEntries.map((entry) => (
                        <li 
                          key={entry.id}
                          onClick={() => onSelectDay && onSelectDay(entry.day)}
                          className={`p-2 rounded border cursor-pointer transition-all select-none flex justify-between items-center ${
                            activeDay === entry.day
                              ? 'bg-indigo-950/40 border-indigo-500/50 text-indigo-300'
                              : 'bg-slate-950/60 border-slate-900 text-slate-400 hover:border-slate-800 hover:text-slate-200'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                              entry.isSecret ? 'bg-rose-950/60 text-rose-400 border border-rose-900/50' : 'bg-slate-900 text-slate-500'
                            }`}>
                              DAY {entry.day}
                            </span>
                            <span className="truncate uppercase font-bold text-[11px] tracking-tight">{entry.title}</span>
                          </div>
                          {entry.isSecret && <span className="text-rose-400 text-[10px] ml-1">🔒</span>}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Directory Page Controls */}
                {totalPages > 1 && (
                  <div className="flex justify-between pt-3 border-t border-slate-900 text-[10px] mt-2">
                    <button 
                      disabled={currentPage === 0}
                      onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
                      className="text-indigo-400 disabled:text-slate-700 font-bold hover:underline uppercase"
                    >
                      [◂ Prev]
                    </button>
                    <button 
                      disabled={currentPage >= totalPages - 1}
                      onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
                      className="text-indigo-400 disabled:text-slate-700 font-bold hover:underline uppercase"
                    >
                      [Next ▸]
                    </button>
                  </div>
                )}
              </div>

              {/* RIGHT PAGE: RENDERED MANUSCRIPT DETAILED SHEET VIEW */}
              <div className="pl-0 md:pl-2 pt-4 md:pt-0 flex flex-col justify-between min-h-[220px]">
                {activeEntry ? (
                  <div className="h-full flex flex-col justify-between">
                    <div>
                      <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1 flex justify-between">
                        <span>Reading Stream node</span>
                        <span className="text-slate-600">{new Date(activeEntry.updatedAt || activeEntry.createdAt).toLocaleDateString()}</span>
                      </div>
                      <h3 className="text-amber-400 font-bold text-sm tracking-wide border-b border-slate-900 pb-1 mb-2 uppercase">
                        {activeEntry.title}
                      </h3>
                      <div className="text-slate-300 leading-relaxed text-[11px] max-h-36 overflow-y-auto whitespace-pre-wrap pr-1">
                        {activeEntry.body}
                      </div>
                    </div>

                    {activeEntry.tags && activeEntry.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3 pt-2 border-t border-slate-900">
                        {activeEntry.tags.map(t => (
                          <span key={t} className="text-[9px] bg-slate-950 border border-slate-800 text-slate-500 px-1 rounded">
                            #{t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center border border-dashed border-slate-900 rounded p-4 text-center">
                    <span className="text-slate-600 font-bold tracking-tight uppercase text-[10px]">
                      {activeDay ? `No data recorded for Day ${activeDay}. Use control panel to write.` : 'Select a log row link from the directory index to deploy data matrix reader.'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 2. SHOWER THOUGHTS ENGINE PLACEHOLDER */}
        {activeNotebook.type === 'thoughts' && (
          <div className="p-12 border border-dashed border-slate-800 rounded-lg text-center text-slate-500">
            [STREAM ENGINE ACTIVE] Atomic Rapid Stream Feed Buffer
          </div>
        )}

        {/* 3. PLANNING PROJECTS ENGINE PLACEHOLDER */}
        {activeNotebook.type === 'planning' && (
          <div className="p-12 border border-dashed border-slate-800 rounded-lg text-center text-slate-500">
            [BLUEPRINT MATRIX ACTIVE] Kanban Boards & Node Graph Mapping
          </div>
        )}
      </div>
    );
  }

  // --- RENDERING THE SKEUOMORPHIC SHELF VIEW ---
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-mono text-xs text-slate-400 items-start">
      
      {/* LEFT DRAWER: SHELF FILTER SYSTEM */}
      <div className="space-y-1 bg-slate-950/80 p-3 border border-slate-900 rounded-lg">
        <span className="text-[9px] font-bold uppercase tracking-wider text-slate-600 block px-2 mb-2">Shelf Layouts</span>
        {shelves.map(shelf => (
          <button
            key={shelf.id}
            onClick={() => { setActiveSection(shelf.id); }}
            className={`w-full text-left px-3 py-1.5 rounded transition-all ${
              activeSection === shelf.id 
                ? 'bg-slate-900 border border-slate-800 text-indigo-400 font-bold pl-4' 
                : 'hover:bg-slate-900/50 text-slate-500 hover:text-slate-300'
            }`}
          >
            {activeSection === shelf.id ? '▪ ' : '▫ '} {shelf.title}
          </button>
        ))}
        <button
          onClick={() => setShowCreateModal(true)}
          className="w-full mt-4 text-center px-3 py-1.5 bg-indigo-950/20 hover:bg-indigo-950/40 text-indigo-400 rounded border border-indigo-900/40 transition-all font-bold"
        >
          + Create New Volume
        </button>
      </div>

      {/* RIGHT MAIN PANEL: SKEUOMORPHIC LEDGE SYSTEM */}
      <div className="md:col-span-3 space-y-12 bg-slate-950/20 p-6 rounded-lg border border-slate-900 relative">
        {filteredNotebooks.length === 0 ? (
          <div className="p-12 text-center text-slate-600 border border-dashed border-slate-900 rounded-lg">
            No active volumes stored on this shelf layer.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-8 gap-x-6">
            {filteredNotebooks.map((book) => (
              <div key={book.id} className="group flex flex-col items-center justify-end h-40 relative">
                
                {/* 3D Moving Spine Representation */}
               {/* 3D Moving Spine Representation */}
<div
  onClick={() => {
    // 1. Core assignment setting your open book instance id
    setActiveNotebookId(book.id);

    // 2. If it's a journal volume type, set the view router layout to show the main grid dashboard panels
    if (book.type === 'journal' && typeof workspaceHooks.setActiveView === 'function') {
      workspaceHooks.setActiveView('JOURNAL_CORE');
    }
  }}
  className={`w-20 h-28 rounded-r shadow-2xl border-l-[4px] border-black/30 transform group-hover:-translate-y-2 cursor-pointer transition-all duration-300 flex flex-col justify-between p-2 select-none ${book.coverImage}`}
>
                  <div className="text-[8px] opacity-40 font-bold tracking-tighter uppercase truncate">{book.type}</div>
                  <div className="text-[10px] font-bold text-slate-100 leading-tight text-center truncate line-clamp-3 my-auto drop-shadow-md">
                    {book.title}
                  </div>
                  
                  {book.type === 'review' && (book.rating || 0) > 0 && (
                    <div className="text-[8px] text-amber-400 text-center tracking-tighter">
                      {'★'.repeat(book.rating)}
                    </div>
                  )}
                </div>

                {/* THE WOOD PLANK HORIZONTAL LEDGE */}
                <div className="w-full h-2.5 bg-gradient-to-b from-slate-800 to-slate-950 border-t border-slate-700 rounded shadow-md mt-1"></div>

                {/* Rapid Deletion Control */}
                <button
                  onClick={(e) => { e.stopPropagation(); if(confirm('Purge this notebook from history local storage?')) deleteNotebook(book.id); }}
                  className="absolute top-0 right-2 opacity-0 group-hover:opacity-100 text-[8px] bg-rose-950/80 border border-rose-900 text-rose-400 px-1 rounded transition-opacity"
                >
                  [DEL]
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* OVERLAY SHEET: NEW RECORD ARCHIVE FORM */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 backdrop-blur-xs">
          <form onSubmit={handleCreateBook} className="bg-slate-950 border border-slate-800 p-5 rounded-lg max-w-xs w-full space-y-4">
            <h3 className="text-xs font-bold text-slate-200 border-b border-slate-900 pb-2 uppercase text-indigo-400">
              » Provision Volume Manifest
            </h3>
            
            <div className="space-y-1">
              <label className="text-slate-500 block text-[9px] uppercase font-bold">Identifier Title</label>
              <input
                type="text"
                required
                value={newBookTitle}
                onChange={(e) => setNewBookTitle(e.target.value)}
                placeholder="e.g., Clinical Anatomy Review"
                className="w-full bg-slate-900 border border-slate-800 rounded p-1.5 text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-slate-500 block text-[9px] uppercase font-bold">Target Shelf Ledge</label>
                <select
                  value={newBookSection}
                  onChange={(e) => setNewBookSection(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded p-1.5 text-slate-300 focus:outline-none"
                >
                  <option value="journal">Journals</option>
                  <option value="review">Review Library</option>
                  <option value="thoughts">Shower Thoughts</option>
                  <option value="projects">Planning Projects</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-slate-500 block text-[9px] uppercase font-bold">Functional Module Type</label>
                <select
                  value={newBookType}
                  onChange={(e) => setNewBookType(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded p-1.5 text-slate-300 focus:outline-none"
                >
                  <option value="journal">Journal Sub-log</option>
                  <option value="review">Review Ledger (Stars)</option>
                  <option value="thoughts">Atomic Thoughts Feed</option>
                  <option value="planning">Project Blueprint Grid</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2 pt-2 justify-end text-[10px] font-bold">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 rounded text-slate-500"
              >
                [ABORT]
              </button>
              <button
                type="submit"
                className="px-2.5 py-1 bg-indigo-950/60 border border-indigo-800 hover:bg-indigo-900 text-indigo-300 rounded"
              >
                [COMMIT TO DISK]
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};