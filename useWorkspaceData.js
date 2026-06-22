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

  // --- NEW VAULT STATE TRACKERS ---
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
    return []; // Empty book ledger initialization
  });

  // 2. Load all data from localStorage on mount
  useEffect(() => {
    const storageKeys = {
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

  // --- NEW VAULT UPDATER HANDLING ---
  const saveVaultEntry = (dayNum, entryPayload) => {
    const { title, body, tags = [] } = entryPayload;
    
    // Check for explicit privacy flags
    const isSecret = tags.includes('secret') || body.includes('[[secret]]');

    const updatedVault = [...vaultEntries];
    const existingIndex = updatedVault.findIndex(e => e.day === dayNum && e.isSecret === isSecret);

    const targetEntry = {
      id: existingIndex > -1 ? updatedVault[existingIndex].id : `vault-${Date.now()}`,
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

  // Matrix State Modifiers
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

  // Dynamic filter masking restricted notes away from unauthorized sessions
  const visibleEntries = vaultEntries.filter(entry => !entry.isSecret || isVaultUnlocked);

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
    vaultEntries, // Raw copy for special administrative contexts if required
    isVaultUnlocked,
    setIsVaultUnlocked,
    saveVaultEntry,
    deleteVaultEntry
  };
};