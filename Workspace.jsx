import React, { useState } from 'react';
import { useWorkspaceData } from './useWorkspaceData';
import { Widget } from './Widget';
import { StoryCalendar } from './StoryCalendar';
import { ChibiCompanion } from './ChibiCompanion';

// Matching your lowercase and pluralized file names precisely:
import { HabitMatrix } from './habitmatrix';
import { TimeWheelLog } from './timewheellog';
import { JournalTimeline } from './journaltimeline';
import { UnifiedChecklist } from './UnifiedChecklists';
import { PromptEngine } from './promptengine';
export const Workspace = () => {
  const [companionState, setCompanionState] = useState('IDLE');
  
  const {
    calendarData,
    habitData,
    timeWheelData,
    timelineEvents,
    checklistTasks,
  } = useWorkspaceData();

  // Real-time calculation of remaining quests
  const pendingTasks = checklistTasks.filter(t => !t.done).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 font-mono selection:bg-slate-800">
      
      {/* MASTER HEADER CONTROL BAR */}
      <header className="flex justify-between items-center mb-6 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl font-black tracking-wider text-indigo-400 uppercase">LIVING DESK CORE</h1>
          <p className="text-[10px] text-slate-500 mt-0.5">V1.0.0 // MODULAR WORKSPACE INTEGRATION</p>
        </div>
        
        {/* Integrated Chibi Companion and Selector */}
        <div className="flex items-center gap-4 bg-slate-900/50 border border-slate-800 px-3 py-1.5 rounded-lg">
          <ChibiCompanion state={companionState} taskCount={pendingTasks} />
          
          <div className="w-px h-10 bg-slate-800 hidden sm:block" /> {/* Visual Divider */}
          
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
          <Widget title="Visual Chronicle Planner">
            <StoryCalendar currentMonth="June 2026" dailyData={calendarData} />
          </Widget>

          <Widget title="Habit Matrix & Sleep Sync">
            <HabitMatrix daysData={habitData} />
          </Widget>
        </div>

        {/* RIGHT COLUMN: ACTIONABLE UTILITIES & DIARY FEEDS (5 Cols) */}
        <div className="xl:col-span-5 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-6">
            <Widget title="24-Hour Distribution Engine">
              <TimeWheelLog dayLabel="Current Cycle" timeBlocks={timeWheelData} />
            </Widget>

            <Widget title="Active Quest Log">
              <UnifiedChecklist initialTasks={checklistTasks} />
            </Widget>
          </div>

          <Widget title="Micro-Reflection Node">
            <PromptEngine />
          </Widget>

          <Widget title="Chronological Activity Stream">
            <JournalTimeline events={timelineEvents} />
          </Widget>
        </div>

      </div>
    </div>
  );
};