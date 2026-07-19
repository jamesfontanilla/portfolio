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
      style={{
        position: 'fixed',
        left: `${preview.rect.x}px`,
        top: `${preview.rect.y}px`,
        width: `${preview.rect.width}px`,
        height: `${preview.rect.height}px`,
        zIndex: 900,
        pointerEvents: 'none',
        borderRadius: '18px',
        border: '1px solid rgba(152, 204, 255, 0.9)',
        background: 'linear-gradient(180deg, rgba(82, 151, 255, 0.24), rgba(59, 118, 230, 0.14))',
        boxShadow: 'inset 0 0 0 1px rgba(9, 17, 34, 0.35), 0 18px 42px rgba(5, 12, 24, 0.35)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
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
          background: 'rgba(10, 16, 28, 0.72)',
          border: '1px solid rgba(180, 220, 255, 0.35)',
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

