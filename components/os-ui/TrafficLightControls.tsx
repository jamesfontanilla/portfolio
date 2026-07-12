'use client';

/**
 * TrafficLightControls — macOS-style three-button window control group.
 *
 * Colored circles: red (close), yellow/gold (minimize), green/muted (maximize).
 * Shows glyph icons on hover. stopPropagation prevents drag from triggering.
 *
 * Requirements: 4.4, 8.2, 8.10
 */

import React, { useState } from 'react';

export interface TrafficLightControlsProps {
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
}

export function TrafficLightControls({ onClose, onMinimize, onMaximize }: TrafficLightControlsProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{ display: 'flex', alignItems: 'center', gap: '7px', flexShrink: 0 }}
      role="group"
      aria-label="Window controls"
      onPointerDown={(e) => e.stopPropagation()}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Close */}
      <button
        aria-label="Close window"
        tabIndex={0}
        onClick={onClose}
        style={{
          width: '13px',
          height: '13px',
          borderRadius: '50%',
          background: '#ec6a5e',
          border: '1px solid rgba(0,0,0,0.12)',
          cursor: 'pointer',
          padding: 0,
          flexShrink: 0,
          outline: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {hovered && (
          <svg width="7" height="7" viewBox="0 0 7 7" aria-hidden="true">
            <line x1="1" y1="1" x2="6" y2="6" stroke="#4a0002" strokeWidth="1.3" strokeLinecap="round" />
            <line x1="6" y1="1" x2="1" y2="6" stroke="#4a0002" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
        )}
      </button>

      {/* Minimize */}
      <button
        aria-label="Minimize window"
        tabIndex={0}
        onClick={onMinimize}
        style={{
          width: '13px',
          height: '13px',
          borderRadius: '50%',
          background: '#f4bf4f',
          border: '1px solid rgba(0,0,0,0.12)',
          cursor: 'pointer',
          padding: 0,
          flexShrink: 0,
          outline: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {hovered && (
          <svg width="7" height="2" viewBox="0 0 7 2" aria-hidden="true">
            <line x1="0.5" y1="1" x2="6.5" y2="1" stroke="#995700" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
        )}
      </button>

      {/* Maximize */}
      <button
        aria-label="Maximize window"
        tabIndex={0}
        onClick={onMaximize}
        style={{
          width: '13px',
          height: '13px',
          borderRadius: '50%',
          background: '#61c554',
          border: '1px solid rgba(0,0,0,0.12)',
          cursor: 'pointer',
          padding: 0,
          flexShrink: 0,
          outline: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {hovered && (
          <svg width="7" height="7" viewBox="0 0 8 8" aria-hidden="true">
            <path d="M1 5.5L3.5 8M3.5 8L3.5 4.5M3.5 8L7 8M7 2.5L4.5 0M4.5 0L4.5 3.5M4.5 0L1 0" stroke="#0b5400" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
        )}
      </button>
    </div>
  );
}
