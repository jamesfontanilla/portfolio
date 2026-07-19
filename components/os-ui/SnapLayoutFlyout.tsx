'use client';

import React from 'react';
import { SNAP_LAYOUT_OPTIONS, type SnapTarget } from '@/lib/windowSnap';

export interface SnapLayoutFlyoutProps {
  anchorRect: DOMRect | null;
  onSelect: (target: SnapTarget) => void;
  onPointerEnter?: () => void;
  onPointerLeave?: () => void;
}

const PANEL_WIDTH = 332;
const PANEL_PADDING = 12;

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function getPanelPlacement(anchorRect: DOMRect | null) {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const width = Math.min(PANEL_WIDTH, Math.max(280, viewportWidth - PANEL_PADDING * 2));
  const estimatedHeight = 426;

  const left = clamp(
    (anchorRect?.left ?? PANEL_PADDING) - 6,
    PANEL_PADDING,
    Math.max(PANEL_PADDING, viewportWidth - width - PANEL_PADDING),
  );
  const top = clamp(
    (anchorRect?.bottom ?? PANEL_PADDING) + 10,
    PANEL_PADDING,
    Math.max(PANEL_PADDING, viewportHeight - estimatedHeight - PANEL_PADDING),
  );

  return { left, top, width };
}

function getPreviewFillStyle(target: SnapTarget): React.CSSProperties {
  const common: React.CSSProperties = {
    position: 'absolute',
    borderRadius: '8px',
    border: '1px solid rgba(174, 215, 255, 0.34)',
    background: 'linear-gradient(180deg, rgba(94, 162, 255, 0.58), rgba(64, 132, 244, 0.4))',
    boxShadow: 'inset 0 0 0 1px rgba(8, 16, 34, 0.18)',
  };

  switch (target) {
    case 'maximize':
      return { ...common, inset: '4px' };
    case 'left':
      return { ...common, left: '4px', top: '4px', bottom: '4px', width: 'calc(50% - 6px)' };
    case 'right':
      return { ...common, right: '4px', top: '4px', bottom: '4px', width: 'calc(50% - 6px)' };
    case 'top-left':
      return { ...common, left: '4px', top: '4px', width: 'calc(50% - 6px)', height: 'calc(50% - 6px)' };
    case 'top-right':
      return { ...common, right: '4px', top: '4px', width: 'calc(50% - 6px)', height: 'calc(50% - 6px)' };
    case 'bottom-left':
      return { ...common, left: '4px', bottom: '4px', width: 'calc(50% - 6px)', height: 'calc(50% - 6px)' };
    case 'bottom-right':
      return { ...common, right: '4px', bottom: '4px', width: 'calc(50% - 6px)', height: 'calc(50% - 6px)' };
  }
}

export function SnapLayoutFlyout({
  anchorRect,
  onSelect,
  onPointerEnter,
  onPointerLeave,
}: SnapLayoutFlyoutProps) {
  const placement = getPanelPlacement(anchorRect);

  return (
    <div
      role="dialog"
      aria-label="Snap layouts"
      onPointerDown={(e) => e.stopPropagation()}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      style={{
        position: 'fixed',
        left: `${placement.left}px`,
        top: `${placement.top}px`,
        width: `${placement.width}px`,
        maxWidth: `calc(100vw - ${PANEL_PADDING * 2}px)`,
        maxHeight: `calc(100vh - ${PANEL_PADDING * 2}px)`,
        overflow: 'auto',
        zIndex: 1120,
        padding: '12px',
        borderRadius: '20px',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        background: 'linear-gradient(180deg, rgba(19, 27, 44, 0.96), rgba(12, 18, 30, 0.92))',
        boxShadow: '0 24px 60px rgba(0, 0, 0, 0.45)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          gap: '12px',
          marginBottom: '12px',
        }}
      >
        <div>
          <div
            style={{
              color: 'var(--text)',
              fontFamily: '"Space Grotesk", "Manrope", sans-serif',
              fontSize: '0.98rem',
              fontWeight: 600,
              letterSpacing: '0.01em',
            }}
          >
            Snap layouts
          </div>
          <div
            style={{
              color: 'var(--muted)',
              fontSize: '0.76rem',
              marginTop: '2px',
            }}
          >
            Choose a window layout or use Ctrl + Alt + Arrow keys.
          </div>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
          gap: '10px',
        }}
      >
        {SNAP_LAYOUT_OPTIONS.map((option) => {
          const isMaximize = option.target === 'maximize';

          return (
            <button
              key={option.target}
              type="button"
              aria-label={`${option.label}: ${option.description}`}
              onClick={() => onSelect(option.target)}
              style={{
                gridColumn: isMaximize ? '1 / -1' : 'auto',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                width: '100%',
                minHeight: isMaximize ? '72px' : '68px',
                padding: '12px',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                background: 'rgba(255, 255, 255, 0.04)',
                color: 'var(--text)',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'transform 120ms ease, background 120ms ease, border-color 120ms ease',
              }}
            >
              <div
                aria-hidden="true"
                style={{
                  position: 'relative',
                  flexShrink: 0,
                  width: isMaximize ? '68px' : '48px',
                  height: isMaximize ? '44px' : '34px',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  background: 'rgba(255, 255, 255, 0.03)',
                }}
              >
                <div style={getPreviewFillStyle(option.target)} />
              </div>

              <div style={{ minWidth: 0 }}>
                <div
                  style={{
                    fontSize: '0.88rem',
                    fontWeight: 600,
                    lineHeight: 1.2,
                  }}
                >
                  {option.label}
                </div>
                <div
                  style={{
                    marginTop: '3px',
                    color: 'var(--muted)',
                    fontSize: '0.72rem',
                    lineHeight: 1.35,
                  }}
                >
                  {option.description}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

