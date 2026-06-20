import React from 'react';

const CATEGORY_COLORS = {
  SLEEP: { stroke: 'stroke-sky-500', fill: 'fill-sky-950/40', text: 'text-sky-400' },
  WORK: { stroke: 'stroke-indigo-500', fill: 'fill-indigo-950/40', text: 'text-indigo-400' },
  FITNESS: { stroke: 'stroke-emerald-500', fill: 'fill-emerald-950/40', text: 'text-emerald-400' },
  DOWNTIME: { stroke: 'stroke-pink-500', fill: 'fill-pink-950/40', text: 'text-pink-400' },
  IDLE: { stroke: 'stroke-slate-800', fill: 'fill-transparent', text: 'text-slate-600' }
};

export const TimeWheelLog = ({ 
  dayLabel = "Today's Schedule", 
  timeBlocks = {} 
}) => {
  // Fallback default timeline data matching standard daily rhythm
  const defaultBlocks = Array.from({ length: 24 }, (_, hour) => {
    if (hour >= 0 && hour < 7) return 'SLEEP';
    if (hour >= 9 && hour < 17) return 'WORK';
    if (hour === 18 || hour === 19) return 'FITNESS';
    if (hour >= 20 && hour < 23) return 'DOWNTIME';
    return 'IDLE';
  });

  const hourlyData = Object.keys(timeBlocks).length > 0 ? timeBlocks : defaultBlocks;

  const radius = 80;
  const innerRadius = 55;
  const center = 110;

  // Helper math to calculate SVG arc rings for circular slices
  const getCoordinatesForPercent = (percent) => {
    const x = Math.cos(2 * Math.PI * percent - Math.PI / 2);
    const y = Math.sin(2 * Math.PI * percent - Math.PI / 2);
    return [x, y];
  };

  return (
    <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl font-mono text-xs text-slate-300 w-fit flex gap-6 items-center selection:bg-slate-800">
      
      {/* 24-HOUR INTERACTIVE VISUAL WHEEL */}
      <div className="relative w-[220px] h-[220px]">
        <svg width="220" height="220" className="transform -rotate-0">
          {/* Central Anchor Info Text Ring */}
          <circle cx={center} cy={center} r={innerRadius - 5} className="fill-slate-900 stroke-slate-800 stroke-1" />
          
          {Array.from({ length: 24 }).map((_, hour) => {
            const startPercent = hour / 24;
            const endPercent = (hour + 1) / 24;
            const midPercent = (hour + 0.5) / 24;

            const [startX, startY] = getCoordinatesForPercent(startPercent);
            const [endX, endY] = getCoordinatesForPercent(endPercent);
            const [midX, midY] = getCoordinatesForPercent(midPercent);

            const currentCategory = hourlyData[hour] || 'IDLE';
            const designPreset = CATEGORY_COLORS[currentCategory];

            // Outer ring sector paths
            const dOuter = `
              M ${center + startX * innerRadius} ${center + startY * innerRadius}
              L ${center + startX * radius} ${center + startY * radius}
              A ${radius} ${radius} 0 0 1 ${center + endX * radius} ${center + endY * radius}
              L ${center + endX * innerRadius} ${center + endY * innerRadius}
              A ${innerRadius} ${innerRadius} 0 0 0 ${center + startX * innerRadius} ${center + startY * innerRadius}
              Z
            `;

            // Text tick alignment anchors
            const textX = center + midX * (radius + 12);
            const textY = center + midY * (radius + 12);

            return (
              <g key={hour} className="group cursor-pointer">
                {/* Visual Hour Slices */}
                <path 
                  d={dOuter} 
                  className={`${designPreset.fill} ${designPreset.stroke} stroke-[1.5] transition-all duration-150 group-hover:brightness-125`}
                />
                
                {/* 24-Hour Micro Numeric Markers (Shown on main quarterly axis anchors or hover) */}
                {(hour % 3 === 0) && (
                  <text 
                    x={textX} 
                    y={textY} 
                    alignmentBaseline="middle" 
                    textAnchor="middle" 
                    className="text-[9px] fill-slate-600 font-bold tracking-tighter"
                  >
                    {hour === 0 ? '24' : hour}
                  </text>
                )}
                
                <title>{`Hour ${hour}:00 -> ${currentCategory}`}</title>
              </g>
            );
          })}
        </svg>

        {/* Center Clock Core Stat Face */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{dayLabel}</span>
          <span className="text-sm font-black text-indigo-400 mt-0.5">24H</span>
        </div>
      </div>

      {/* COMPACT COLOR METRIC LEGEND */}
      <div className="flex flex-col gap-2 border-l border-slate-900 pl-4">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Legend</span>
        {Object.entries(CATEGORY_COLORS).map(([key, value]) => {
          if (key === 'IDLE') return null;
          const blockCount = hourlyData.filter(h => h === key).length;
          return (
            <div key={key} className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-sm border ${value.stroke} ${value.fill}`} />
              <div className="flex flex-col">
                <span className="text-[10px] font-medium uppercase text-slate-400">{key.toLowerCase()}</span>
                <span className={`text-[9px] font-bold ${value.text}`}>{blockCount} hrs</span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};