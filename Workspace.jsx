import React, { useState } from 'react';
import { useWorkspaceData } from './useWorkspaceData';
import { Widget } from './Widget';
import { StoryCalendar } from './StoryCalendar';
import { ChibiCompanion } from './ChibiCompanion';

import { HabitMatrix } from './habitmatrix';
import { TimeWheelLog } from './timewheellog';
import { JournalTimeline } from './journaltimeline';
import { UnifiedChecklist } from './UnifiedChecklists';
import { PromptEngine } from './promptengine';

export const Workspace = () => {
  const [companionState, setCompanionState] = useState('IDLE');
  
  // --- NEW CENTRALIZED INTERACTIVE STATES ---
  const [selectedDate, setSelectedDate] = useState(null);
  const [isPromptMinimized, setIsPromptMinimized] = useState(false);
  const [diaryNotes, setDiaryNotes] = useState({}); // Stores text notes indexed by day number

  const {
    calendarData,
    habitData,
    timeWheelData,
    timelineEvents,
    checklistTasks,
  } = useWorkspaceData();

  const pendingTasks = checklistTasks.filter(t => !t.done).length;

  // Handle saving the note entry text locally per day
  const handleNoteChange = (day, text) => {
    setDiaryNotes(prev => ({
      ...prev,
      [day]: text
    }));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 font-mono selection:bg-slate-800">

      {/* MASTER HEADER CONTROL BAR */}
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

      {/* DASHBOARD GRID SYSTEM */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">

        {/* LEFT COLUMN: HIGH-DENSITY TRACKING ARTIFACTS (7 Cols) */}
        <div className="xl:col-span-7 space-y-6">
          
          {/* DYNAMIC SHIFT: Note Log screen slides in ABOVE the calendar when a day is selected */}
          {selectedDate && (
            <Widget title={`Active Note Entry — Day ${selectedDate}`}>
              <div className="p-2 space-y-3">
                <textarea
                  className="w-full h-32 bg-slate-900 border border-amber-500/30 rounded p-3 text-xs text-amber-400 font-mono focus:outline-none focus:border-amber-500/80 transition-colors"
                  placeholder={`Write your log entry for Day ${selectedDate}...`}
                  value={diaryNotes[selectedDate] || ''}
                  onChange={(e) => handleNoteChange(selectedDate, e.target.value)}
                />
                <div className="flex justify-between items-center text-[10px] text-slate-500">
                  <span>// DATA STAGES LOCALLY UNTIL BACKEND COMPILATION</span>
                  <button 
                    onClick={() => setSelectedDate(null)} 
                    className="text-amber-500 hover:underline font-bold uppercase"
                  >
                    Collapse View [×]
                  </button>
                </div>
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
                if (day) setIsPromptMinimized(false); // Reset prompt window state on new day activation
              }}
            />
          </Widget>

          <Widget title={`Habit Matrix & Sleep Sync ${selectedDate ? `[Day ${selectedDate}]` : '(Global Preview)'}`}>
            <HabitMatrix daysData={habitData} activeDay={selectedDate} />
          </Widget>
        </div>

        {/* RIGHT COLUMN: ACTIONABLE UTILITIES & DIARY FEEDS (5 Cols) */}
        <div className="xl:col-span-5 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-6">
            <Widget title={`24-Hour Distribution Engine ${selectedDate ? `— Cycle ${selectedDate}` : ''}`}>
              <TimeWheelLog dayLabel={selectedDate ? `Day ${selectedDate}` : "Current Cycle"} timeBlocks={timeWheelData} activeDay={selectedDate} />
            </Widget>

            <Widget title="Active Quest Log">
              <UnifiedChecklist initialTasks={checklistTasks} activeDay={selectedDate} />
            </Widget>
          </div>

          {/* MICRO-REFLECTION PROMPT NODE (With Adaptive Minimization Shell) */}
          <Widget 
            title="Micro-Reflection Node" 
            headerControls={
              selectedDate && (
                <button 
                  onClick={() => setIsPromptMinimized(!isPromptMinimized)}
                  className="text-[10px] bg-slate-900 px-1.5 py-0.5 border border-slate-700 hover:border-slate-500 text-slate-400 rounded transition-all"
                >
                  {isPromptMinimized ? 'Maximize [+]' : 'Minimize [-]'}
                </button>
              )
            }
          >
            {isPromptMinimized ? (
              <div className="p-2 text-center text-[10px] text-slate-500 italic bg-slate-900/30 border border-dashed border-slate-800 rounded">
                Prompt entry minimized for Day {selectedDate}. Click Maximize to answer.
              </div>
            ) : (
              <PromptEngine 
                activeDay={selectedDate} 
                onDeclineHelp={() => setIsPromptMinimized(true)} 
              />
            )}
          </Widget>

          <Widget title="Chronological Activity Stream">
            <JournalTimeline events={timelineEvents} activeDay={selectedDate} />
          </Widget>
        </div>

      </div>
    </div>
  );
};
