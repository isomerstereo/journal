import React from 'react';

export const HabitMatrix = ({ 
  habits = ['Train', 'Meditate', 'Planning', 'SMM', 'Read', 'No Sugar', 'Work', 'No Caffeine', 'Diet', 'Pray'],
  daysData = [],
  onToggleHabit,
  onUpdateSleep
}) => {
  const maxSleepHours = 9;
  const minSleepHours = 4;
  
  // SVG configuration for the vertical line chart
  const svgWidth = 120;
  const rowHeight = 32; // Matches row tracking height
  const chartPaddingLeft = 20;
  const chartPaddingRight = 20;

  // Calculate X coordinate for the sleep hours plot point
  const getXCoordinate = (hours) => {
    const clampedHours = Math.max(minSleepHours, Math.min(maxSleepHours, hours || 0));
    const percentage = (clampedHours - minSleepHours) / (maxSleepHours - minSleepHours);
    return chartPaddingLeft + percentage * (svgWidth - chartPaddingLeft - chartPaddingRight);
  };

  // Build the SVG path string connecting the daily sleep data points vertically
  const points = daysData.map((data, index) => {
    const x = getXCoordinate(data.sleepHours || 0);
    const y = (index * rowHeight) + (rowHeight / 2);
    return { x, y, hours: data.sleepHours || 0 };
  });

  const pathD = points.reduce((acc, point, index) => {
    return index === 0 ? `M ${point.x} ${point.y}` : `${acc} L ${point.x} ${point.y}`;
  }, "");

  // Cycle sleep hours between min and max on click
  const handleSleepClick = (day, currentHours) => {
    if (!onUpdateSleep) return;
    let nextHours = (currentHours || 0) + 1;
    if (nextHours > maxSleepHours) nextHours = minSleepHours;
    onUpdateSleep(day, nextHours);
  };

  return (
    <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl font-mono text-xs text-slate-300 w-fit selection:bg-slate-800">
      <div className="flex">
        
        {/* LEFT SIDE: THE HABIT GRID MATRIX */}
        <div>
          <table className="border-collapse text-center">
            <thead>
              <tr>
                <th className="border border-slate-800 p-1 text-[10px] text-slate-500 font-bold w-10 h-24 align-bottom">DAYS</th>
                {habits.map((habit) => (
                  <th key={habit} className="border border-slate-800 p-1 w-8 h-24 relative align-bottom">
                    <span className="absolute bottom-2 left-1/2 -translate-x-1/2 origin-bottom-left -rotate-90 whitespace-nowrap text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                      {habit}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {daysData.map((data) => (
                <tr key={data.day} style={{ height: `${rowHeight}px` }}>
                  <td className="border border-slate-800 font-bold text-slate-500 text-[10px]">{data.day}</td>
                  {habits.map((habit) => {
                    const status = data.habitsStatus?.[habit] || '•';
                    return (
                      <td 
                        key={habit} 
                        onClick={() => onToggleHabit && onToggleHabit(data.day, habit)}
                        className={`border border-slate-800 font-bold transition-colors cursor-pointer select-none ${
                          status === 'X' 
                            ? 'text-indigo-400 bg-indigo-950/20 hover:bg-indigo-900/30' 
                            : 'text-slate-700 hover:text-slate-500 hover:bg-slate-900/40'
                        }`}
                      >
                        {status}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* RIGHT SIDE: THE SYNCHRONIZED VERTICAL SLEEP GRAPH */}
        <div className="border-t border-r border-b border-slate-800 bg-slate-900/10 flex flex-col">
          <div className="h-24 border-b border-slate-800 flex flex-col justify-end relative" style={{ width: `${svgWidth}px` }}>
            <div className="absolute top-4 left-1/2 -translate-x-1/2 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
              Sleep
            </div>
            <div className="flex justify-between px-4 text-[9px] text-slate-600 pb-1 w-full">
              <span>4h</span>
              <span>9h</span>
            </div>
          </div>

          <div className="relative flex-1" style={{ height: `${daysData.length * rowHeight}px` }}>
            <div className="absolute inset-0 flex justify-between px-4 pointer-events-none">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="w-px h-full border-l border-dashed border-slate-900" />
              ))}
            </div>

            <svg width={svgWidth} height={daysData.length * rowHeight} className="absolute inset-0 overflow-visible">
              {pathD && (
                <path 
                  d={pathD} 
                  fill="none" 
                  stroke="#818cf8" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  className="drop-shadow-[0_0_3px_rgba(129,140,248,0.3)]"
                />
              )}

              {points.map((point, index) => (
                <g key={index}>
                  <circle 
                    cx={point.x} 
                    cy={point.y} 
                    r="4" 
                    onClick={() => handleSleepClick(daysData[index].day, point.hours)}
                    className="fill-slate-950 stroke-indigo-400 stroke-2 cursor-pointer hover:fill-indigo-400 transition-all duration-150"
                  />
                  <title>{`Day ${daysData[index].day}: ${point.hours} hours sleep`}</title>
                </g>
              ))}
            </svg>
          </div>
        </div>

      </div>
    </div>
  );
};