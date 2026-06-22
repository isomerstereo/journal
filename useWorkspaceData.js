import { useState, useEffect } from 'react';

export const useWorkspaceData = () => {
  // 1. Core State Hooks
  const [calendarData, setCalendarData] = useState({});
  const [habitData, setHabitData] = useState([]);
  const [timeWheelData, setTimeWheelData] = useState({});
  const [timelineEvents, setTimelineEvents] = useState([]);
  const [checklistTasks, setChecklistTasks] = useState([]);

  // 2. Load all data from localStorage on mount
  useEffect(() => {
    const storageKeys = {
      calendar: 'desk_calendar',
      habits: 'desk_habits',
      timewheel: 'desk_timewheel',
      timeline: 'desk_timeline',
      tasks: 'desk_tasks',
    };

    try {
      const cal = localStorage.getItem(storageKeys.calendar);
      const hab = localStorage.getItem(storageKeys.habits);
      const wheel = localStorage.getItem(storageKeys.timewheel);
      const time = localStorage.getItem(storageKeys.timeline);
      const task = localStorage.getItem(storageKeys.tasks);

      if (cal) setCalendarData(JSON.parse(cal));
      if (hab) setHabitData(JSON.parse(hab));
      if (wheel) setTimeWheelData(JSON.parse(wheel));
      if (time) setTimelineEvents(JSON.parse(time));
      if (task) setChecklistTasks(JSON.parse(task));
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

  // 5. Exposed API
  return {
    // Calendar
    calendarData,
    setCalendarData,
    
    // Habits
    habitData,
    setHabitData,
    
    // TimeWheel
    timeWheelData,
    setTimeWheelData: updateTimeWheel, // Use the sync-enabled setter
    
    // Timeline
    timelineEvents,
    setTimelineEvents: updateTimeline, // Use the sync-enabled setter
    
    // Checklist
    checklistTasks,
    setChecklistTasks: updateChecklist, // Use the sync-enabled setter
  };
};