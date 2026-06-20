import React from 'react';

export const HabitMatrix = ({ 
  habits = ['Train', 'Meditate', 'Planning', 'SMM', 'Read', 'No Sugar', 'Work', 'No Caffeine', 'Diet', 'Pray'],
  daysData = [] 
}) => {
  // Generate fallback mock data if none is passed to match the image style
  const defaultDays = Array.from({ length: 15 }, (_, index) => {
    const dayNum = index + 1;
    return {
      day: dayNum,
      habitsStatus: habits.reduce((acc, habit) => {
        acc[habit] = Math.random() > 0.4 ? 'X' : '•';
        return acc;
      }, {}),
      sleepHours: Math.floor(Math.random() * (9 - 4 + 1)) + 4 // 4hrs to 9hrs
    };
  });

  const activeDays = daysData.length > 0 ? daysData : defaultDays;
  const maxSleepHours = 9;
  const minSleepHours = 4;
  
  // SVG configuration for the vertical line chart
  const svgWidth = 120;
  const rowHeight = 32; // Matches row tracking height
  const chartPaddingLeft = 20;
  const chartPaddingRight = 20;

  // Calculate X coordinate for the sleep hours plot point
  const getXCoordinate = (hours) => {
    const percentage = (hours - minSleepHours) / (maxSleepHours - minSleepHours);
    return chartPaddingLeft + percentage * (svgWidth - chartPaddingLeft - chartPaddingRight);
  };

  // Build the SVG path string connecting the daily sleep data points vertically
  const points = activeDays.map((data, index) => {
    const x = getXCoordinate(data.sleepHours);
    const y = (index * rowHeight) + (rowHeight / 2);
    return { x, y, hours: data.sleepHours };
  });

  const pathD = points.reduce((acc, point, index) => {
    return index === 0 ? `M ${point.x} ${point.y}` : `${acc} L ${point.x} ${point.y}`;
  }, "");

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
                    {/* Vertical Text Rotation for Matrix Headers */}
                    <span className="absolute bottom-2 left-1/2 -translate-x-1/2 origin-bottom-left -rotate-90 whitespace-nowrap text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                      {habit}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {activeDays.map((data) => (
                <tr key={data.day} style={{ height: `${rowHeight}px` }}>
                  <td className="border border-slate-800 font-bold text-slate-500 text-[10px]">{data.day}</td>
                  {habits.map((habit) => {
                    const status = data.habitsStatus[habit] || '•';
                    return (
                      <td 
                        key={habit} 
                        className={`border border-slate-800 font-bold transition-colors ${
                          status === 'X' ? 'text-indigo-400 bg-indigo-950/10' : 'text-slate-700'
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
          {/* Header Axis Matrix for Sleep Hours */}
          <div className="h-24 border-b border-slate-800 flex flex-col justify-end relative" style={{ width: `${svgWidth}px` }}>
            <div className="absolute top-4 left-1/2 -translate-x-1/2 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
              Sleep
            </div>
            <div className="flex justify-between px-4 text-[9px] text-slate-600 pb-1 w-full">
              <span>4h</span>
              <span>5h</span>
              <span>6h</span>
              <span>7h</span>
              <span>8h</span>
              <span>9h</span>
            </div>
          </div>

          {/* SVG Render Area for the Trendline */}
          <div className="relative flex-1" style={{ height: `${activeDays.length * rowHeight}px` }}>
            {/* Background Grid Guidelines */}
            <div className="absolute inset-0 flex justify-between px-4 pointer-events-none">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="w-px h-full border-l border-dashed border-slate-900" />
              ))}
            </div>

            <svg width={svgWidth} height={activeDays.length * rowHeight} className="absolute inset-0 overflow-visible">
              {/* Connected Line Path */}
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

              {/* Individual Data Node Points */}
              {points.map((point, index) => (
                <g key={index}>
                  <circle 
                    cx={point.x} 
                    cy={point.y} 
                    r="3.5" 
                    className="fill-slate-950 stroke-indigo-400 stroke-2 cursor-pointer hover:fill-indigo-400 transition-colors"
                  />
                  {/* Invisible hover hitbox for scanning values */}
                  <title>{`Day ${activeDays[index].day}: ${point.hours} hours sleep`}</title>
                </g>
              ))}
            </svg>
          </div>
        </div>

      </div>
    </div>
  );
};