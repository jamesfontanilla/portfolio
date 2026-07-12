/**
 * useDrag — pointer-event drag logic for Window components.
 *
 * Uses Pointer Events API with setPointerCapture so the pointer can move
 * faster than the window without losing the drag. Position updates are
 * throttled to one per requestAnimationFrame (~60 fps).
 *
 * Returns a no-op handler when layoutMode === 'tablet' (drag disabled on
 * tablet viewport per design spec).
 *
 * Requirements: 3.4, 3.11, 3.12
 */

import { useRef, useCallback } from 'react';
import type { WindowAction } from '@/store/windowManagerStore';

interface UseDragOptions {
  windowId: string;
  dispatch: React.Dispatch<WindowAction>;
  /** When 'tablet', drag is disabled and a no-op handler is returned. */
  layoutMode?: 'desktop' | 'tablet' | 'mobile';
}

interface UseDragReturn {
  onPointerDown: (e: React.PointerEvent<HTMLElement>) => void;
}

export function useDrag({ windowId, dispatch, layoutMode }: UseDragOptions): UseDragReturn {
  const rafIdRef = useRef<number | null>(null);

  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      // Disable drag on tablet mode per responsive design spec
      if (layoutMode === 'tablet') return;

      // Only respond to primary pointer (mouse left-button / first touch)
      if (e.button !== undefined && e.button !== 0) return;

      // Capture pointer so moves are received even when cursor leaves element
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);

      let lastX = e.clientX;
      let lastY = e.clientY;

      function onPointerMove(moveEvent: PointerEvent) {
        // RAF throttle — drop duplicate frames
        if (rafIdRef.current !== null) return;

        const dx = moveEvent.clientX - lastX;
        const dy = moveEvent.clientY - lastY;

        // Update reference point for next incremental delta
        lastX = moveEvent.clientX;
        lastY = moveEvent.clientY;

        rafIdRef.current = requestAnimationFrame(() => {
          dispatch({
            type: 'DRAG_WINDOW',
            id: windowId,
            dx,
            dy,
            viewportWidth: window.innerWidth,
            viewportHeight: window.innerHeight,
            dockHeight: 80, // reasonable default; components can override via context
          });
          rafIdRef.current = null;
        });
      }

      function onPointerUp() {
        window.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('pointerup', onPointerUp);
        if (rafIdRef.current !== null) {
          cancelAnimationFrame(rafIdRef.current);
          rafIdRef.current = null;
        }
      }

      window.addEventListener('pointermove', onPointerMove);
      window.addEventListener('pointerup', onPointerUp);
    },
    [windowId, dispatch, layoutMode],
  );

  // Return no-op when in tablet mode (drag disabled)
  if (layoutMode === 'tablet') {
    return { onPointerDown: () => {} };
  }

  return { onPointerDown };
}
