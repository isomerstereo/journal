import { useState, useEffect } from 'react';

export const useWorkspaceData = () => {
  // 1. Core State Hooks
  const [calendarData, setCalendarData] = useState({});
  
  // Initialize matrix state with a clean 15-day baseline if localStorage is empty
  const [habitData, setHabitData] = useState(() => {
    const saved = localStorage.getItem('desk_habits');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse initial habit data:", e);
      }
    }
    return Array.from({ length: 15 }, (_, index) => ({
      day: index + 1,
      habitsStatus: {},
      sleepHours: 7
    }));
  });

  const [timeWheelData, setTimeWheelData] = useState({});
  const [timelineEvents, setTimelineEvents] = useState([]);
  const [checklistTasks, setChecklistTasks] = useState([]);
// --- to track which subsystem view is open ---
  const [activeView, setActiveView] = React.useState('SHELF'); // Views: 'SHELF', 'JOURNAL_CORE', etc.
  const [activeNotebookId, setActiveNotebookId] = React.useState(null);

  // --- LIBRARY & SHELF MANAGEMENT STATE ---
  // Tracks the active top-level library view (e.g., 'all', 'journal', 'review', 'thoughts', 'projects')
  const [activeSection, setActiveSection] = useState('all');
  
  // Tracks the currently opened notebook object (null means user is looking at the bookshelf)
  const [activeView, setActiveView] = React.useState('SHELF'); // Views: 'SHELF', 'JOURNAL_CORE', etc.
  const [activeNotebookId, setActiveNotebookId] = React.useState(null);

  // Core Notebooks Registry State
  const [notebooks, setNotebooks] = useState(() => {
    const saved = localStorage.getItem('desk_library_notebooks');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error("Library parse failed:", e); }
    }
    // Baseline Volumes matching your system architecture
    return [
      {
        id: 'nb-journal-default',
        sectionId: 'journal',
        title: 'Daily Journal',
        coverImage: 'journal-yellow',
        type: 'journal', // Special type utilizing your StoryCalendar entries
        rating: 0
      },
      {
        id: 'nb-pathology-review',
        sectionId: 'review',
        title: 'Robbins Pathology Review',
        coverImage: 'medical-blue',
        type: 'review', // Displays review metrics & star ratings
        rating: 5,
        status: 'In Progress'
      }
    ];
  });

  // --- VAULT CORE & SECURITY STORAGE ---
  const [isVaultUnlocked, setIsVaultUnlocked] = useState(false);
  const [vaultEntries, setVaultEntries] = useState(() => {
    const saved = localStorage.getItem('desk_vault_entries');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse initial vault entries:", e);
      }
    }
    return [];
  });

  // Fetch or set secret entry master passcode baseline
  const [vaultPasscode, setVaultPasscode] = useState(() => {
    const savedPass = localStorage.getItem('desk_vault_passcode');
    if (!savedPass) {
      localStorage.setItem('desk_vault_passcode', '1234');
      return '1234';
    }
    return savedPass;
  });

  // 2. Load all data from localStorage on mount
  useEffect(() => {
    const storageKeys = {
      library_notebooks: 'desk_library_notebooks',
      calendar: 'desk_calendar',
      habits: 'desk_habits',
      timewheel: 'desk_timewheel',
      timeline: 'desk_timeline',
      tasks: 'desk_tasks',
      vault: 'desk_vault_entries'
    };

    try {
      const cal = localStorage.getItem(storageKeys.calendar);
      const hab = localStorage.getItem(storageKeys.habits);
      const wheel = localStorage.getItem(storageKeys.timewheel);
      const time = localStorage.getItem(storageKeys.timeline);
      const task = localStorage.getItem(storageKeys.tasks);
      const vlt = localStorage.getItem(storageKeys.vault);
      const libBooks = localStorage.getItem('desk_library_notebooks');
      if (libBooks) setNotebooks(JSON.parse(libBooks));
      if (cal) setCalendarData(JSON.parse(cal));
      if (hab) setHabitData(JSON.parse(hab));
      if (wheel) setTimeWheelData(JSON.parse(wheel));
      if (time) setTimelineEvents(JSON.parse(time));
      if (task) setChecklistTasks(JSON.parse(task));
      if (vlt) setVaultEntries(JSON.parse(vlt));
    } catch (e) {
      console.error("Failed to load workspace data:", e);
    }
  }, []);

  // 3. Sync helpers (Auto-save logic)
  const saveToStorage = (key, data) => localStorage.setItem(key, JSON.stringify(data));

  // 4. Wrapped Setters (These update state AND localStorage)
  const updateTimeline = (newEvents) => {
    setTimelineEvents(newEvents);
    saveToStorage('desk_timeline', newEvents);
  };

  const updateTimeWheel = (newData) => {
    setTimeWheelData(newData);
    saveToStorage('desk_timewheel', newData);
  };

  const updateChecklist = (newTasks) => {
    setChecklistTasks(newTasks);
    saveToStorage('desk_tasks', newTasks);
  };
  // --- LIBRARY ARCHITECTURE MUTATORS ---
  const createNotebook = (title, sectionId, type, coverImage = 'default-gray') => {
    const newNotebook = {
      id: `notebook-${Date.now()}`,
      sectionId, // 'review', 'thoughts', 'projects', etc.
      title: title || 'Untitled Volume',
      type,      // 'journal' | 'review' | 'thoughts' | 'planning'
      coverImage,
      rating: 0,
      status: 'Active',
      createdAt: new Date().toISOString()
    };

    const updated = [...notebooks, newNotebook];
    setNotebooks(updated);
    saveToStorage('desk_library_notebooks', updated);
    return newNotebook;
  };

  const updateNotebookRating = (notebookId, nextRating) => {
    const updated = notebooks.map(book => 
      book.id === notebookId ? { ...book, rating: nextRating } : book
    );
    setNotebooks(updated);
    saveToStorage('desk_library_notebooks', updated);
  };

  const deleteNotebook = (notebookId) => {
    const updated = notebooks.filter(book => book.id !== notebookId);
    setNotebooks(updated);
    saveToStorage('desk_library_notebooks', updated);
    if (activeNotebookId === notebookId) setActiveNotebookId(null);
  };

  // --- SECURE VAULT PASSPHRASE MUTATOR ---
  const changeVaultPasscode = (oldPass, newPass) => {
    if (oldPass !== vaultPasscode) {
      alert("ERROR: INVALID SECURITY AUTHORIZATION KEY");
      return false;
    }
    if (!newPass || newPass.trim() === "") {
      alert("ERROR: PASSCODE CANNOT BE BLANK");
      return false;
    }
    setVaultPasscode(newPass);
    saveToStorage('desk_vault_passcode', newPass);
    alert("SECURITY CONFIGURATION REFRESHED // NEW KEY STORED");
    return true;
  };

  // --- VAULT STORAGE JOURNAL UPDATER ---
  // --- SCOPED LIBRARY ENTRY UPDATER ---
  const saveVaultEntry = (dayNum, entryPayload) => {
    const { title, body, tags = [] } = entryPayload;
    
    const isSecret = tags.includes('secret') || body.includes('[[secret]]');
    const scopeId = activeNotebookId || 'nb-journal-default'; // Fallback to baseline journal

    const updatedVault = [...vaultEntries];
    // Scope search by matching BOTH the day/id AND the specific parent notebook ID
    const existingIndex = updatedVault.findIndex(e => 
      e.day === dayNum && 
      e.notebookId === scopeId && 
      e.isSecret === isSecret
    );

    const targetEntry = {
      id: existingIndex > -1 ? updatedVault[existingIndex].id : `vault-${Date.now()}`,
      notebookId: scopeId, // Link this specific page entry directly to the active volume
      day: dayNum,
      title: title || `LOG ENTRY — DAY ${dayNum}`,
      body: body || '',
      tags: tags,
      isSecret: isSecret,
      updatedAt: new Date().toISOString()
    };

    if (existingIndex > -1) {
      updatedVault[existingIndex] = targetEntry;
    } else {
      updatedVault.push(targetEntry);
    }

    setVaultEntries(updatedVault);
    saveToStorage('desk_vault_entries', updatedVault);
  };

  const deleteVaultEntry = (entryId) => {
    const updatedVault = vaultEntries.filter(e => e.id !== entryId);
    setVaultEntries(updatedVault);
    saveToStorage('desk_vault_entries', updatedVault);
  };

  // Matrix Habit State Modifiers
  const toggleHabit = (dayNum, habitName) => {
    const updatedHabits = habitData.map(dayObj => {
      if (dayObj.day !== dayNum) return dayObj;
      
      const currentStatus = dayObj.habitsStatus?.[habitName] || '•';
      const nextStatus = currentStatus === 'X' ? '•' : 'X';
      
      return {
        ...dayObj,
        habitsStatus: {
          ...(dayObj.habitsStatus || {}),
          [habitName]: nextStatus
        }
      };
    });
    
    setHabitData(updatedHabits);
    saveToStorage('desk_habits', updatedHabits);
  };

  const updateSleep = (dayNum, nextHours) => {
    const updatedHabits = habitData.map(dayObj => 
      dayObj.day === dayNum 
        ? { ...dayObj, sleepHours: nextHours } 
        : dayObj
    );

    setHabitData(updatedHabits);
    saveToStorage('desk_habits', updatedHabits);
  };

  // Dynamic filter masking restricted notes away from unauthorized sessions, matching current book scope
  const currentScopeId = activeNotebookId || 'nb-journal-default';
  const visibleEntries = vaultEntries.filter(entry => 
    entry.notebookId === currentScopeId && 
    (!entry.isSecret || isVaultUnlocked)
  );

  // 5. Exposed API
  return {
    // Calendar
    calendarData,
    setCalendarData,
    
    // Habits Matrix
    habitData,
    setHabitData,
    toggleHabit,
    updateSleep,
    
    // TimeWheel
    timeWheelData,
    setTimeWheelData: updateTimeWheel,
    
    // Timeline
    timelineEvents,
    setTimelineEvents: updateTimeline,
    
    // Checklist
    checklistTasks,
    setChecklistTasks: updateChecklist,

    // Encrypted Vault Extensions
    visibleEntries,
    vaultEntries,
    isVaultUnlocked,
    setIsVaultUnlocked,
    vaultPasscode,
    saveVaultEntry,
    deleteVaultEntry,
    changeVaultPasscode,

    // Library & Bookshelf Engine
    activeSection,
    setActiveSection,
    activeNotebookId,
    setActiveNotebookId,
    notebooks,
    createNotebook,
    updateNotebookRating,
    deleteNotebook,
    
    // Quick Reference Derivative Filter
    filteredNotebooks: notebooks.filter(b => activeSection === 'all' || b.sectionId === activeSection),
    activeNotebook: notebooks.find(b => b.id === activeNotebookId) || null,
  };
};