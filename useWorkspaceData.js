import { useState, useEffect } from 'react';

export const useWorkspaceData = () => {
  // 1. Core State Hooks for all widgets
  const [calendarData, setCalendarData] = useState({});
  const [habitData, setHabitData] = useState([]);
  const [timeWheelData, setTimeWheelData] = useState({});
  const [timelineEvents, setTimelineEvents] = useState([]);
  const [checklistTasks, setChecklistTasks] = useState([]);

  // 2. Load all data from localStorage on mount
  useEffect(() => {
    const storage = {
      calendar: localStorage.getItem('desk_calendar'),
      habits: localStorage.getItem('desk_habits'),
      timewheel: localStorage.getItem('desk_timewheel'),
      timeline: localStorage.getItem('desk_timeline'),
      tasks: localStorage.getItem('desk_tasks'),
    };

    if (storage.calendar) setCalendarData(JSON.parse(storage.calendar));
    if (storage.habits) setHabitData(JSON.parse(storage.habits));
    if (storage.timewheel) setTimeWheelData(JSON.parse(storage.timewheel));
    if (storage.timeline) setTimelineEvents(JSON.parse(storage.timeline));
    if (storage.tasks) setChecklistTasks(JSON.parse(storage.tasks));
  }, []);

  // 3. State Updaters (Actions)
  const updateCalendarDay = (day, state, vitals) => {
    const updated = { ...calendarData, [day]: { state, vitals } };
    setCalendarData(updated);
    localStorage.setItem('desk_calendar', JSON.stringify(updated));
  };

  const toggleChecklistTask = (id) => {
    const updated = checklistTasks.map(task => 
      task.id === id ? { ...task, done: !task.done } : task
    );
    setChecklistTasks(updated);
    localStorage.setItem('desk_tasks', JSON.stringify(updated));
  };

  const addTimelineEvent = (type, title, desc) => {
    const newEvent = {
      id: Date.now(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type,
      title,
      desc
    };
    const updated = [newEvent, ...timelineEvents];
    setTimelineEvents(updated);
    localStorage.setItem('desk_timeline', JSON.stringify(updated));
  };

  const updateTimeWheelHour = (hour, category) => {
    const updated = { ...timeWheelData, [hour]: category };
    setTimeWheelData(updated);
    localStorage.setItem('desk_timewheel', JSON.stringify(updated));
  };

  return {
    calendarData,
    updateCalendarDay,
    habitData,
    setHabitData,
    timeWheelData,
    updateTimeWheelHour,
    timelineEvents,
    addTimelineEvent,
    checklistTasks,
    toggleChecklistTask,
    setChecklistTasks
  };
};