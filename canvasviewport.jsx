import React, { useState, useRef, useEffect } from 'react';

export const CanvasViewport = ({ children }) => {
  const canvasRef = useRef(null);
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Handle zooming relative to mouse pointer position
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleWheel = (e) => {
      e.preventDefault(); // Prevents standard browser page zoom
      
      const zoomFactor = 0.05;
      const scaleChange = e.deltaY < 0 ? 1 + zoomFactor : 1 - zoomFactor;
      
      setTransform((prev) => {
        const nextScale = Math.max(0.1, Math.min(prev.scale * scaleChange, 4));
        
        // Get mouse position relative to canvas viewport bounding box
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        // Anchor zoom calculation formula
        const nextX = mouseX - (mouseX - prev.x) * (nextScale / prev.scale);
        const nextY = mouseY - (mouseY - prev.y) * (nextScale / prev.scale);

        return { x: nextX, y: nextY, scale: nextScale };
      });
    };

    // Binding natively to bypass React passive event listener restrictions
    canvas.addEventListener('wheel', handleWheel, { passive: false });
    return () => canvas.removeEventListener('wheel', handleWheel);
  }, []);

  // Pan interaction mouse triggers
  const handleMouseDown = (e) => {
    // Only pan on left click or space+click (middle mouse can be added here)
    if (e.button !== 0) return; 
    setIsDragging(true);
    setDragStart({ x: e.clientX - transform.x, y: e.clientY - transform.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setTransform((prev) => ({
      ...prev,
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    }));
  };

  const handleMouseUp = () => setIsDragging(false);

  return (
    <div 
      ref={canvasRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      className={`w-screen h-screen overflow-hidden bg-slate-950 relative select-none ${
        isDragging ? 'cursor-grabbing' : 'cursor-grab'
      }`}
    >
      {/* Infinite Canvas Coordinate Grid Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-25 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)]"
        style={{
          backgroundSize: `${40 * transform.scale}px ${40 * transform.scale}px`,
          backgroundPosition: `${transform.x}px ${transform.y}px`
        }}
      />

      {/* Hardware-accelerated transformation frame container */}
      <div 
        className="absolute origin-top-left will-change-transform"
        style={{
          transform: `translate3d(${transform.x}px, ${transform.y}px, 0) scale(${transform.scale})`
        }}
      >
        {children}
      </div>

      {/* Persistent Canvas Coordinates HUD Overlay */}
      <div className="absolute bottom-4 right-4 bg-slate-900/80 border border-slate-800 px-3 py-1.5 rounded font-mono text-[10px] text-slate-500 pointer-events-none backdrop-blur-sm">
        PAN: X:{Math.round(transform.x)} Y:{Math.round(transform.y)} | ZOOM: {Math.round(transform.scale * 100)}%
      </div>
    </div>
  );
};