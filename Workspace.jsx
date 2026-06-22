import React, { useState } from 'react';
import { useWorkspaceData } from './useWorkspaceData';
import { Widget } from './Widget';
import { StoryCalendar } from './StoryCalendar';
import { ChibiCompanion } from './ChibiCompanion';
import { EventModal } from './EventModal'; 

import { BookLedger } from './BookLedger';
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

  // 1. Capture the full raw hook package object first for BookLedger
  const workspaceHooks = useWorkspaceData();

  // 2. Destructure individual values cleanly from that same instance bundle
  const {
    calendarData,
    habitData,
    toggleHabit,  
    updateSleep,  
    timeWheelData,
    setTimeWheelData,
    timelineEvents,
    setTimelineEvents, 
    checklistTasks,
    setChecklistTasks,
    visibleEntries,
    isVaultUnlocked,
    setIsVaultUnlocked,
    vaultPasscode,    
    saveVaultEntry,
    changeVaultPasscode,  
  } = workspaceHooks;

  // --- DATA TRANSFORMATION & FILTERING ---
  const activeEvents = selectedDate 
    ? timelineEvents.filter(e => e.day === selectedDate) 
    : timelineEvents;

  const activeTimeBlocks = selectedDate 
    ? (timeWheelData[selectedDate] || {}) 
    : timeWheelData;

  const pendingTasks = checklistTasks.filter(t => !t.done).length;

  // Find current day text matching the active lock status
  const currentEntry = visibleEntries.find(e => e.day === selectedDate);
  const currentNoteText = currentEntry ? currentEntry.body : '';

  // --- EVENT HANDLERS ---
  const handleNoteChange = (day, text) => {
    const tagMatches = text.match(/#\w+/g) || [];
    const cleanTags = tagMatches.map(t => t.replace('#', ''));
    
    saveVaultEntry(day, {
      title: `LOG REFRESH — DAY ${day}`,
      body: text,
      tags: cleanTags
    });
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
          <div className="flex items-center gap-2 mt-0.5">
            <p className="text-[10px] text-slate-500">V1.0.0 // MODULAR WORKSPACE INTEGRATION</p>
            
            <button 
              onClick={(e) => {
                if (e.shiftKey) {
                  const oldP = prompt("CONFIRM CURRENT PHRASE:");
                  const newP = prompt("ESTABLISH NEW PASSPHRASE:");
                  if (oldP !== null && newP !== null) {
                    changeVaultPasscode(oldP, newP);
                  }
                  return;
                }

                if (isVaultUnlocked) {
                  setIsVaultUnlocked(false);
                  alert("SESSION LOCKED // DECRYPTION TERMINATED");
                } else {
                  const pass = prompt("ENTER MASTER MATRIX VAULT PHRASE:");
                  if (pass === null) return;
                  
                  if (pass === vaultPasscode) { 
                    setIsVaultUnlocked(true);
                    alert("ACCESS GRANTED // SECRET DECRYPTION ACTIVE");
                  } else {
                    alert("ACCESS DENIED // INCORRECT THRESHOLD PROTOCOL");
                    setIsVaultUnlocked(false);
                  }
                }
              }}
              className={`w-1 h-1 rounded-full transition-colors duration-500 focus:outline-none ${
                isVaultUnlocked ? 'bg-emerald-500 animate-pulse' : 'bg-slate-800 hover:bg-slate-700'
              }`}
              title="System Debug Node (Shift+Click to configure)"
            />
          </div>
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
            <Widget title={`Active Note Entry — Day ${selectedDate} ${currentEntry?.isSecret ? '[ENCRYPTED]' : ''}`}>
              <div className="p-2 space-y-3">
                <textarea
                  className="w-full h-32 bg-slate-900 border border-amber-500/30 rounded p-3 text-xs text-amber-400 font-mono focus:outline-none focus:border-amber-500/80 transition-colors"
                  placeholder={`Write your log entry for Day ${selectedDate}... Tag [[secret]] to encrypt.`}
                  value={currentNoteText}
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

          <Widget title={`Habit Matrix ${selectedDate ? `[Day ${selectedDate}]` : ''}`}>
            <HabitMatrix 
              daysData={habitData} 
              activeDay={selectedDate} 
              onSelectDay={setSelectedDate} 
              onToggleHabit={toggleHabit} 
              onUpdateSleep={updateSleep} 
            />
          </Widget>

          {/* MOUNTED MODULE FRAMEWORK LAYER */}
          <Widget title="Unified Archives & Reports Ledger Book">
            <BookLedger 
              workspaceHooks={workspaceHooks} 
              activeDay={selectedDate} 
              onSelectDay={(dayNum) => setSelectedDate(dayNum)} 
            />
          </Widget>
        </div>

        {/* Right Column: Feeds & Engines */}
        <div className="xl:col-span-5 space-y-6">
          <Widget title={`Chronicle Feed ${selectedDate ? `(Day ${selectedDate})` : ''}`}>
            <JournalTimeline 
              events={activeEvents} 
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
            const newEvent = {
              id: Date.now(), 
              day: currentEditingDay,
              ...data,
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setTimelineEvents([...timelineEvents, newEvent]);
            setIsModalOpen(false);
          }}
        />
      )}
    </div>
  );
};