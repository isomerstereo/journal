import React, { useState } from 'react';

// --- SAFE HELPER (Moved to global scope for clean access) ---
const parseReviewData = (bodyText) => {
  try {
    const parsed = JSON.parse(bodyText);
    if (parsed && typeof parsed === 'object' && parsed.mediaType) return parsed;
  } catch (e) {}
  return {
    name: '',
    creator: '',
    mediaType: 'BOOK',
    rating: 0,
    thumbnail: '',
    comments: bodyText || ''
  };
};

// --- NEW ISOLATED SUB-COMPONENT ---
// This prevents fields from losing focus when typing
const ReviewForm = ({ activeEntry, workspaceHooks }) => {
  const reviewData = parseReviewData(activeEntry.body);
  // --- OBSIDIAN / WORD STYLE NOTE EDITOR ---
const NoteEditor = ({ activeEntry, workspaceHooks }) => {
  const [isEditing, setIsEditing] = useState(true);

  const handleUpdate = (field, value) => {
    if (!workspaceHooks.saveVaultEntry) return;
    workspaceHooks.saveVaultEntry(activeEntry.day, {
      ...activeEntry,
      [field]: value
    });
  };

  // Simulates document injection (.docx / .md parsing structure)
  const handleDocImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target.result;
      // Appends imported text directly into current log matrix
      handleUpdate('body', (activeEntry.body ? activeEntry.body + "\n" : "") + content);
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-3 h-full flex flex-col justify-between">
      <div className="space-y-2">
        {/* Editor Ribbon Bar */}
        <div className="flex justify-between items-center bg-slate-950 p-1.5 border border-slate-900 rounded">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className={`text-[9px] font-bold px-2 py-0.5 rounded ${isEditing ? 'bg-amber-950 text-amber-400 border border-amber-900' : 'text-slate-500'}`}
            >
              [EDIT_MATRIX]
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className={`text-[9px] font-bold px-2 py-0.5 rounded ${!isEditing ? 'bg-indigo-950 text-indigo-400 border border-indigo-800' : 'text-slate-500'}`}
            >
              [PREVIEW_RENDER]
            </button>
          </div>
          
          {/* External Doc Integration Node */}
          <label className="text-[9px] font-bold bg-slate-900 border border-slate-800 text-slate-400 px-2 py-0.5 rounded hover:text-slate-200 cursor-pointer transition-colors">
            + IMPORT DOC
            <input 
              type="file" 
              accept=".md,.txt,.docx" 
              onChange={handleDocImport} 
              className="hidden" 
            />
          </label>
        </div>

        {/* Dynamic Canvas Node */}
        <input
          type="text"
          value={activeEntry.title || ''}
          onChange={(e) => handleUpdate('title', e.target.value)}
          placeholder="Untitled Log Entry Node"
          className="w-full bg-transparent border-b border-slate-900 text-amber-400 font-bold text-sm tracking-wide pb-1 focus:outline-none focus:border-amber-600 uppercase"
        />

        {isEditing ? (
          <textarea
            value={activeEntry.body || ''}
            onChange={(e) => handleUpdate('body', e.target.value)}
            placeholder="Begin logging terminal stream data structure..."
            className="w-full h-40 bg-slate-950/40 border border-slate-900 p-2 rounded text-slate-300 font-mono text-[11px] focus:outline-none focus:border-slate-800 resize-none leading-relaxed"
          />
        ) : (
          <div className="w-full h-40 bg-slate-950/10 border border-transparent p-2 text-slate-300 font-mono text-[11px] overflow-y-auto whitespace-pre-wrap leading-relaxed pr-1">
            {activeEntry.body || <span className="text-slate-600 italic">No structural string bytes written.</span>}
          </div>
        )}
      </div>
    </div>
  );
};

  
  const saveReviewField = (field, value) => {
    if (!workspaceHooks.saveVaultEntry) return;
    const updatedData = { ...reviewData, [field]: value };
    workspaceHooks.saveVaultEntry(activeEntry.day, {
      title: updatedData.name ? `REVIEW // ${updatedData.name.toUpperCase()}` : activeEntry.title,
      body: JSON.stringify(updatedData),
      tags: [updatedData.mediaType.toLowerCase()]
    });
  };

  return (
    <div className="space-y-3">
      {/* Thumbnail and Title Block Layout */}
      <div className="flex gap-3 bg-slate-950 p-2 border border-slate-900 rounded-lg">
        <div className="w-14 h-20 bg-slate-900 border border-slate-800 rounded overflow-hidden flex-shrink-0 flex items-center justify-center text-slate-600 text-[9px] uppercase relative">
          {reviewData.thumbnail ? (
            <img 
              src={reviewData.thumbnail} 
              alt="Cover" 
              className="w-full h-full object-cover" 
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          ) : <span>No Image</span>}
        </div>
        
        <div className="flex-1 space-y-1.5 min-w-0">
          <input 
            type="text" 
            value={reviewData.name || ''} 
            placeholder="Media Name / Title"
            onChange={(e) => saveReviewField('name', e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 px-2 py-1 rounded text-xs text-indigo-400 font-bold focus:outline-none focus:border-indigo-500"
          />
          <input 
            type="text" 
            value={reviewData.creator || ''} 
            placeholder="Author / Creator"
            onChange={(e) => saveReviewField('creator', e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 px-2 py-0.5 rounded text-[11px] text-slate-300 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Interactive Metadata Grid */}
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-0.5">
          <label className="text-[9px] text-slate-600 font-bold uppercase">Classification</label>
          <select
            value={reviewData.mediaType || 'BOOK'}
            onChange={(e) => saveReviewField('mediaType', e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 p-1 rounded text-slate-300 text-[10px] focus:outline-none"
          >
            <option value="BOOK">BOOK</option>
            <option value="MOVIE">MOVIE</option>
            <option value="SERIES">SERIES</option>
          </select>
        </div>

        <div className="space-y-0.5">
          <label className="text-[9px] text-slate-600 font-bold uppercase">Interactive Evaluation</label>
          <div className="flex items-center h-6 bg-slate-950 border border-slate-800 px-2 rounded gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => saveReviewField('rating', star)}
                className={`text-xs transition-colors ${star <= (reviewData.rating || 0) ? 'text-amber-400' : 'text-slate-800 hover:text-slate-600'}`}
              >
                ★
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-0.5">
        <label className="text-[9px] text-slate-600 font-bold uppercase">Thumbnail Asset URL</label>
        <input 
          type="url" 
          value={reviewData.thumbnail || ''} 
          placeholder="https://image-source-link.png"
          onChange={(e) => saveReviewField('thumbnail', e.target.value)}
          className="w-full bg-slate-950 border border-slate-800 px-2 py-1 rounded text-[10px] text-slate-400 focus:outline-none focus:border-indigo-500"
        />
      </div>

      <div className="space-y-0.5">
        <label className="text-[9px] text-slate-600 font-bold uppercase">Critical Analysis Log</label>
        <textarea 
          value={reviewData.comments || ''} 
          placeholder="Type analytical evaluation or logging notes..."
          onChange={(e) => saveReviewField('comments', e.target.value)}
          className="w-full h-16 bg-slate-950 border border-slate-800 p-2 rounded text-slate-300 font-mono text-[11px] focus:outline-none focus:border-indigo-500 resize-none"
        />
      </div>
    </div>
  );
};

// --- MAIN LEDGER COMPONENT ---
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

  const [mediaFilter, setMediaFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(0);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newBookTitle, setNewBookTitle] = useState('');
  const [newBookSection, setNewBookSection] = useState('review');
  const [newBookType, setNewBookType] = useState('review');

  const entriesPerPage = 5;

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

  if (activeNotebook) {
    const reviewFilteredEntries = visibleEntries.filter(entry => {
      if (activeNotebook.type !== 'review' || mediaFilter === 'ALL') return true;
      const reviewData = parseReviewData(entry.body);
      return reviewData.mediaType === mediaFilter;
    });

    const totalPages = Math.ceil(reviewFilteredEntries.length / entriesPerPage);
    const startIndex = currentPage * entriesPerPage;
    const paginatedEntries = reviewFilteredEntries.slice(startIndex, startIndex + entriesPerPage);
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

            {/* TWO PAGE GRID CONTAINER */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-900/40 p-4 border border-slate-800 rounded-lg">
              
              {/* LEFT PAGE: ARCHIVE DIRECTORY LEDGER */}
              <div className="border-r border-slate-800/60 pr-4 flex flex-col justify-between min-h-[220px]">
                <div>
                  <div className="flex justify-between items-center border-b border-slate-800 pb-2 mb-3">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Index Cased Logs</span>
                    <span className="text-[9px] text-slate-600 font-bold">PG {currentPage + 1}/{totalPages || 1}</span>
                  </div>

                  {/* Media Type Filter Pipeline Control */}
                  {activeNotebook.type === 'review' && (
                    <div className="flex gap-1 mb-3 bg-slate-950 p-1 border border-slate-900 rounded">
                      {['ALL', 'BOOK', 'MOVIE', 'SERIES'].map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => { setMediaFilter(type); setCurrentPage(0); }}
                          className={`flex-1 text-[9px] font-bold py-0.5 rounded transition-all text-center uppercase ${
                            mediaFilter === type
                              ? 'bg-indigo-950 border border-indigo-800 text-indigo-400'
                              : 'text-slate-500 hover:text-slate-300'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  )}

                  {!paginatedEntries || paginatedEntries.length === 0 ? (
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

                {/* Directory Page Controls relocated directly below index listing */}
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
              
              {/* RIGHT PAGE: FIXED CONTENT SHEET (Replaced the placeholder layout box) */}
<div className="pl-0 md:pl-2 pt-4 md:pt-0 flex flex-col justify-between min-h-[220px]">
  {activeEntry ? (
    <div className="h-full flex flex-col justify-between">
      <div>
        <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1 flex justify-between">
          <span>Reading Stream node</span>
          <span className="text-slate-600">{new Date(activeEntry.updatedAt || activeEntry.createdAt).toLocaleDateString()}</span>
        </div>

        {activeNotebook.type === 'review' ? (
          <ReviewForm activeEntry={activeEntry} workspaceHooks={workspaceHooks} />
        ) : (
          <div className="bg-slate-950 p-3 border border-slate-900 rounded text-slate-400 space-y-2">
            <p className="text-amber-400 font-bold text-[11px] uppercase">// {activeEntry.title || `DAY ${activeEntry.day} LOG`}</p>
            <p className="text-[10px] italic text-slate-500">Note contents and interactive checklist are active in the floating editor workspace window.</p>
          </div>
        )}
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

</div> {/* CLOSE GRID */}
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-mono text-xs text-slate-400 items-start">
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

      <div className="md:col-span-3 space-y-12 bg-slate-950/20 p-6 rounded-lg border border-slate-900 relative">
        {filteredNotebooks.length === 0 ? (
          <div className="p-12 text-center text-slate-600 border border-dashed border-slate-900 rounded-lg">
            No active volumes stored on this shelf layer.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-8 gap-x-6">
            {filteredNotebooks.map((book) => (
              <div key={book.id} className="group flex flex-col items-center justify-end h-40 relative">
                <div
                  onClick={() => {
                    setActiveNotebookId(book.id);
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

                <div className="w-full h-2.5 bg-gradient-to-b from-slate-800 to-slate-950 border-t border-slate-700 rounded shadow-md mt-1"></div>

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