import React from 'react';
import ReactDOM from 'react-dom/client';
import { CanvasViewport } from './canvasviewport';
import { Workspace } from './Workspace';
import './terminalthemes.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CanvasViewport>
      <div className="w-[1920px] p-8 bg-scanlines crt-vignette animate-flicker theme-phosphor-amber pixelated-text">
        <Workspace />
      </div>
    </CanvasViewport>
  </React.StrictMode>
);