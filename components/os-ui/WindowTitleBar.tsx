'use client';

/**
 * WindowTitleBar — 40px drag handle with Traffic Light Controls and window title.
 *
 * The title is centered via flex:1 + textAlign:center. TrafficLightControls are
 * left-aligned. Attach onPointerDown for drag initiation.
 *
 * Requirements: 4.3, 8.5
 */

import React from 'react';
import type { ContentType } from '@/store/windowManagerStore';
import { contentTypeLabel } from './AppIcon';
import { TrafficLightControls } from './TrafficLightControls';

export interface WindowTitleBarProps {
  title: string;
  contentType: ContentType;
  onPointerDown: (e: React.PointerEvent<HTMLDivElement>) => void;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onMaximizeHoverStart?: (anchorRect: DOMRect) => void;
  onMaximizeHoverEnd?: () => void;
}

export function WindowTitleBar({
  title,
  contentType,
  onPointerDown,
  onClose,
  onMinimize,
  onMaximize,
  onMaximizeHoverStart,
  onMaximizeHoverEnd,
}: WindowTitleBarProps) {
  return (
    <div
      aria-label={contentTypeLabel[contentType]}
      onPointerDown={onPointerDown}
      style={{
        height: '40px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '0 12px',
        flexShrink: 0,
        cursor: 'default',
        userSelect: 'none',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <TrafficLightControls
        onClose={onClose}
        onMinimize={onMinimize}
        onMaximize={onMaximize}
        onMaximizeHoverStart={onMaximizeHoverStart}
        onMaximizeHoverEnd={onMaximizeHoverEnd}
      />
      <span
        style={{
          fontFamily: '"Space Grotesk", "Manrope", sans-serif',
          fontSize: '0.82rem',
          fontWeight: 500,
          color: 'var(--text)',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          flex: 1,
          textAlign: 'center',
          paddingRight: '48px', /* balance the traffic lights width */
        }}
      >
        {title}
      </span>
    </div>
  );
}
