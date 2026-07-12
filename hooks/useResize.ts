/**
 * useResize — pointer-event resize logic for Window components.
 *
 * Uses the same Pointer Events pattern as useDrag (setPointerCapture +
 * requestAnimationFrame throttling). Dispatches RESIZE_WINDOW with
 * incremental deltas; the reducer enforces the 320×240 minimum.
 *
 * Requirements: 3.13
 */

import { useRef, useCallback } from 'react';
import type { WindowAction } from '@/store/windowManagerStore';

interface UseResizeOptions {
  windowId: string;
  dispatch: React.Dispatch<WindowAction>;
}

interface UseResizeReturn {
  onPointerDown: (e: React.PointerEvent<HTMLElement>) => void;
}

export function useResize({ windowId, dispatch }: UseResizeOptions): UseResizeReturn {
  const rafIdRef = useRef<number | null>(null);

  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      // Only respond to primary pointer
      if (e.button !== undefined && e.button !== 0) return;

      e.stopPropagation(); // prevent triggering window focus or drag

      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);

      let lastX = e.clientX;
      let lastY = e.clientY;

      function onPointerMove(moveEvent: PointerEvent) {
        if (rafIdRef.current !== null) return;

        const dw = moveEvent.clientX - lastX;
        const dh = moveEvent.clientY - lastY;

        lastX = moveEvent.clientX;
        lastY = moveEvent.clientY;

        rafIdRef.current = requestAnimationFrame(() => {
          dispatch({
            type: 'RESIZE_WINDOW',
            id: windowId,
            dw,
            dh,
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
    [windowId, dispatch],
  );

  return { onPointerDown };
}
