'use client';

import React from 'react';
import type { SnapPreviewState } from '@/lib/windowSnap';
import { getSnapTargetLabel } from '@/lib/windowSnap';

export interface SnapPreviewOverlayProps {
  preview: SnapPreviewState | null;
}

export function SnapPreviewOverlay({ preview }: SnapPreviewOverlayProps) {
  if (!preview) return null;

  return (
    <div
      aria-hidden="true"
      className="snap-preview-overlay liquid-glass-surface"
      style={{
        position: 'fixed',
        left: `${preview.rect.x}px`,
        top: `${preview.rect.y}px`,
        width: `${preview.rect.width}px`,
        height: `${preview.rect.height}px`,
        zIndex: 900,
        pointerEvents: 'none',
        borderRadius: '18px',
        border: '1px solid var(--glass-border-strong)',
        background: 'var(--snap-preview)',
        boxShadow: 'var(--glass-shadow)',
        backdropFilter: 'blur(14px) saturate(1.3)',
        WebkitBackdropFilter: 'blur(14px) saturate(1.3)',
        transition: 'opacity 120ms ease, left 120ms ease, top 120ms ease, width 120ms ease, height 120ms ease',
        opacity: 1,
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          padding: '4px 8px',
          borderRadius: '999px',
          background: 'var(--glass-strong)',
          border: '1px solid var(--glass-border)',
          color: 'rgba(235, 244, 255, 0.95)',
          fontFamily: '"Space Grotesk", "Manrope", sans-serif',
          fontSize: '0.68rem',
          fontWeight: 600,
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
        }}
      >
        {getSnapTargetLabel(preview.target)}
      </div>
    </div>
  );
}
