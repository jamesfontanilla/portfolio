'use client';

/**
 * ResizeHandle — 3×3 dot grid in the bottom-right corner of a Window.
 *
 * Uses `.resize-handle` and `.resize-dot` CSS classes (defined in globals.css).
 * Attaches useResize pointer events for dispatching RESIZE_WINDOW actions.
 * aria-hidden + role="presentation" — purely visual, not in the accessibility tree.
 *
 * Requirements: 4.8, 3.13
 */

import React from 'react';
import { useResize } from '@/hooks/useResize';
import type { WindowAction } from '@/store/windowManagerStore';

export interface ResizeHandleProps {
  windowId: string;
  dispatch: React.Dispatch<WindowAction>;
}

export function ResizeHandle({ windowId, dispatch }: ResizeHandleProps) {
  const { onPointerDown } = useResize({ windowId, dispatch });

  return (
    <div
      className="resize-handle"
      onPointerDown={onPointerDown}
      aria-hidden="true"
      role="presentation"
    >
      {Array.from({ length: 9 }).map((_, i) => (
        <div key={i} className="resize-dot" />
      ))}
    </div>
  );
}
