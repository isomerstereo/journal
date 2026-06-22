import React, { useState } from 'react';
import { useWorkspaceData } from './useWorkspaceData';
import { Widget } from './Widget';
import { StoryCalendar } from './StoryCalendar';
import { ChibiCompanion } from './ChibiCompanion';
import { EventModal } from './EventModal'; // Assuming creation of this component

import { HabitMatrix } from './habitmatrix';
import { TimeWheelLog } from './timewheellog';
import { JournalTimeline } from './journaltimeline';
import { UnifiedChecklist } from './UnifiedChecklists';
import { PromptEngine } from './promptengine';

export const Workspace = () => {
  // --- STATE MANAGEMENT ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEditingDay, setCurrentEditingDay] = useState(null);
  const [companionState, setCompanionState] = useState('IDLE');
  const [selectedDate, setSelectedDate] = useState(null);
  const [isPromptMinimized, setIsPromptMinimized] = useState(false);
  const [diaryNotes, setDiaryNotes] = useState({}); 

  const {
    calendarData,
    habitData,
    toggleHabit,  // Extracted function
    updateSleep,  // Extracted function
    timeWheelData,
    setTimeWheelData,
    timelineEvents,
    setTimelineEvents, // Ensure this is explicitly extracted for the modal line to work
    checklistTasks,
    setChecklistTasks,
  } = useWorkspaceData();

  // --- DATA TRANSFORMATION & FILTERING ---
  const activeEvents = selectedDate 
    ? timelineEvents.filter(e => e.day === selectedDate) 
    : timelineEvents;

  const activeTimeBlocks = selectedDate 
    ? (timeWheelData[selectedDate] || {}) 
    : timeWheelData;

  const pendingTasks = checklistTasks.filter(t => !t.done).length;

  // --- EVENT HANDLERS ---
  const handleNoteChange = (day, text) => {
    setDiaryNotes(prev => ({ ...prev, [day]: text }));
  };

  const handleToggleTask = (id) => {
    setChecklistTasks(prev => prev.map(task => 
      task.id === id ? { ...task, done: !task.done } : task
    ));
  };

  const handleToggleHour = (hour) => {
    if (!selectedDate) return;
    const categories = ['IDLE', 'SLEEP', 'WORK', 'FITNESS', 'DOWNTIME'];
    const current = (timeWheelData[selectedDate] || {})[hour] || 'IDLE';
    const currentIndex = categories.indexOf(current);
    const nextCategory = categories[(currentIndex + 1) % categories.length];
    
    setTimeWheelData(prev => ({
      ...prev,
      [selectedDate]: {
        ...(prev[selectedDate] || {}),
        [hour]: nextCategory
      }
    }));
  };

  const handleAddEventTrigger = (day) => {
    setCurrentEditingDay(day);
    setIsModalOpen(true);
  };

  // --- RENDER ---
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 font-mono selection:bg-slate-800">
      
      {/* Header Section */}
      <header className="flex justify-between items-center mb-6 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl font-black tracking-wider text-indigo-400 uppercase">LIVING DESK CORE</h1>
          <p className="text-[10px] text-slate-500 mt-0.5">V1.0.0 // MODULAR WORKSPACE INTEGRATION</p>
        </div>
        <div className="flex items-center gap-4 bg-slate-900/50 border border-slate-800 px-3 py-1.5 rounded-lg">
          <ChibiCompanion state={companionState} taskCount={pendingTasks} />
          <div className="w-px h-10 bg-slate-800 hidden sm:block" />
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Companion Mood:</span>
            <select 
              value={companionState} 
              onChange={(e) => setCompanionState(e.target.value)}
              className="bg-slate-950 border border-slate-700 text-xs font-bold text-emerald-400 rounded px-2 py-0.5 outline-none cursor-pointer focus:border-indigo-500"
            >
              <option value="IDLE">IDLE</option>
              <option value="TIRED_AF">TIRED AF</option>
              <option value="SUCCESS">VICTORIOUS</option>
              <option value="LAZY">COZY</option>
            </select>
          </div>
        </div>
      </header>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Planning & Notes */}
        <div className="xl:col-span-7 space-y-6">
          {selectedDate && (
            <Widget title={`Active Note Entry — Day ${selectedDate}`}>
              <div className="p-2 space-y-3">
                <textarea
                  className="w-full h-32 bg-slate-900 border border-amber-500/30 rounded p-3 text-xs text-amber-400 font-mono focus:outline-none focus:border-amber-500/80 transition-colors"
                  placeholder={`Write your log entry for Day ${selectedDate}...`}
                  value={diaryNotes[selectedDate] || ''}
                  onChange={(e) => handleNoteChange(selectedDate, e.target.value)}
                />
                <button onClick={() => setSelectedDate(null)} className="text-amber-500 text-[10px] hover:underline font-bold uppercase">Collapse View [×]</button>
              </div>
            </Widget>
          )}

          <Widget title="Visual Chronicle Planner">
            <StoryCalendar 
              currentMonth="June 2026" 
              dailyData={calendarData} 
              selectedDate={selectedDate}
              onSelectDate={(day) => {
                setSelectedDate(day);
                if (day) setIsPromptMinimized(false);
              }}
            />
          </Widget>

          {/* Replace your current HabitMatrix instantiation with this: */}
<Widget title={`Habit Matrix ${selectedDate ? `[Day ${selectedDate}]` : ''}`}>
  <HabitMatrix 
    daysData={habitData} 
    activeDay={selectedDate} 
    onSelectDay={setSelectedDate} 
    onToggleHabit={toggleHabit} 
    onUpdateSleep={updateSleep} 
  />
</Widget>
        </div>

        {/* Right Column: Feeds & Engines */}
        <div className="xl:col-span-5 space-y-6">
          <Widget title={`Chronicle Feed ${selectedDate ? `(Day ${selectedDate})` : ''}`}>
            <JournalTimeline 
              events={timelineEvents} 
              activeDay={selectedDate} 
              onAddEvent={() => handleAddEventTrigger(selectedDate)} 
            />
          </Widget>

          <Widget title="Active Quest Log">
            <UnifiedChecklist 
              initialTasks={checklistTasks} 
              activeDay={selectedDate} 
              onToggleTask={handleToggleTask} 
            />
          </Widget>

          <Widget title={`24-Hour Engine ${selectedDate ? `(Day ${selectedDate})` : ''}`}>
            <TimeWheelLog 
              timeBlocks={activeTimeBlocks} 
              activeDay={selectedDate} 
              onToggleHour={handleToggleHour}
            />
          </Widget>

          <Widget title="Micro-Reflection Node" headerControls={selectedDate && (
            <button onClick={() => setIsPromptMinimized(!isPromptMinimized)} className="text-[10px] border border-slate-700 px-2 rounded">
              {isPromptMinimized ? 'Maximize [+]' : 'Minimize [-]'}
            </button>
          )}>
            {!isPromptMinimized && <PromptEngine activeDay={selectedDate} onDeclineHelp={() => setIsPromptMinimized(true)} />}
          </Widget>
        </div>
      </div>

      {/* Global Modals */}
      {isModalOpen && (
        <EventModal 
          day={currentEditingDay} 
          onClose={() => setIsModalOpen(false)} 
          onSave={(data) => {
            // Logic to create a new event and update the state
            const newEvent = {
              id: Date.now(), 
              day: currentEditingDay,
              ...data,
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            
            // This assumes setTimelineEvents exists in your useWorkspaceData hook
            // If your hook returns timelineEvents as a standard array, 
            // ensure you have the 'setTimelineEvents' setter available.
            setTimelineEvents([...timelineEvents, newEvent]);
            
            setIsModalOpen(false);
          }}
        />
      )}
    </div>
  );
};