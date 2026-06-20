import React from 'react';

const PANE_PRESETS = {
  OVERWHELMED: {
    caption: "So much to do!",
    bgClass: "bg-amber-950/20",
    textClass: "text-amber-400",
    placeholderFace: "(╥﹏╥)"
  },
  SUCCESS: {
    caption: "Deadline down!",
    bgClass: "bg-emerald-950/20",
    textClass: "text-emerald-400",
    placeholderFace: "\\( ﾟヮﾟ)/"
  },
  LAZY: {
    caption: "Staying in bed...",
    bgClass: "bg-indigo-950/20",
    textClass: "text-indigo-400",
    placeholderFace: "(￣o￣) zzZ"
  },
  SICK: {
    caption: "Cold & flu? Ugh.",
    bgClass: "bg-rose-950/20",
    textClass: "text-rose-400",
    placeholderFace: "(✖╭╮✖)"
  },
  IDLE: {
    caption: "Cozy work day",
    bgClass: "bg-slate-900/40",
    textClass: "text-slate-400",
    placeholderFace: "( •◡• )"
  }
};

// Added selectedDate and onSelectDate to the props interface
export const StoryCalendar = ({ currentMonth = "June 2026", dailyData = {}, selectedDate, onSelectDate }) => {
  const daysInMonth = Array.from({ length: 30 }, (_, i) => i + 1);
  const weekdays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  const handleDayClick = (day) => {
    // Toggles selection: clicking an active day minimizes/closes it, clicking a new day selects it
    if (selectedDate === day) {
      onSelectDate(null);
    } else {
      onSelectDate(day);
    }
  };

  return (
    <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl font-mono text-xs text-slate-300 w-full max-w-4xl selection:bg-slate-800">
      {/* Calendar Header */}
      <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-800">
        <h2 className="text-base font-bold tracking-wider uppercase text-slate-400">{currentMonth}</h2>
        <span className="text-[10px] text-slate-500">COMIC FRAME MODE</span>
      </div>

      {/* Weekday Labels */}
      <div className="grid grid-cols-7 gap-px mb-1 text-center font-bold text-slate-500 text-[10px]">
        {weekdays.map(day => <div key={day} className="py-1">{day}</div>)}
      </div>

      {/* Grid Canvas */}
      <div className="grid grid-cols-7 gap-2 bg-slate-900/50 p-2 rounded-lg border border-slate-900">
        {daysInMonth.map(day => {
          const dayState = dailyData[day]?.state || 'IDLE';
          const vitals = dailyData[day]?.vitals || { sleep: 0, mood: 0, activity: 0 };
          const currentPreset = PANE_PRESETS[dayState];
          const isSelected = selectedDate === day;

          return (
            <button 
              key={day} 
              onClick={() => handleDayClick(day)}
              className={`aspect-square border text-left flex flex-col justify-between relative transition-all duration-200 rounded-md p-1.5 focus:outline-none 
                ${currentPreset.bgClass} 
                ${isSelected 
                  ? 'border-amber-500 ring-1 ring-amber-500/50 shadow-[0_0_10px_rgba(245,158,11,0.15)] z-10 scale-[1.02]' 
                  : 'border-slate-800 hover:border-slate-600'
                }`}
            >
              {/* Date & Vitals Dot Indicator Strip */}
              <div className="flex justify-between items-start w-full">
                <span className={`text-[10px] font-bold ${isSelected ? 'text-amber-400' : 'text-slate-500'}`}>{day}</span>
                
                {/* Micro High-Density Vitals Ticker */}
                <div className="flex gap-0.5 mt-0.5">
                  <span className={`w-1 h-1 rounded-full ${vitals.sleep >= 7 ? 'bg-sky-400' : 'bg-slate-700'}`} title="Sleep" />
                  <span className={`w-1 h-1 rounded-full ${vitals.mood >= 7 ? 'bg-pink-400' : 'bg-slate-700'}`} title="Mood" />
                  <span className={`w-1 h-1 rounded-full ${vitals.activity >= 1 ? 'bg-emerald-400' : 'bg-slate-700'}`} title="Activity" />
                </div>
              </div>

              {/* Central Illustration Frame */}
              <div className="flex-1 flex items-center justify-center my-1 w-full">
                <div className={`text-center text-sm font-bold tracking-tight ${currentPreset.textClass}`}>
                  {currentPreset.placeholderFace}
                </div>
              </div>

              {/* Handwritten-Style Micro Caption */}
              <div className="text-[8px] leading-tight text-center truncate text-slate-400 w-full scale-95 origin-bottom">
                {currentPreset.caption}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
