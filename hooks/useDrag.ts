'use client';

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

import { useRef, useCallback, useEffect } from 'react';
import type { WindowAction } from '@/store/windowManagerStore';
import { TASKBAR_HEIGHT } from '@/components/os-ui/Taskbar';
import {
  getSnapActionForTarget,
  getSnapPreviewState,
  getSnapTargetFromPoint,
  SNAP_TRIGGER_PX,
  type SnapTarget,
} from '@/lib/windowSnap';

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
  const activePreviewTargetRef = useRef<SnapTarget | null>(null);
  const activeCleanupRef = useRef<(() => void) | null>(null);

  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      // Disable drag on tablet mode per responsive design spec
      if (layoutMode === 'tablet') return;

      // Only respond to primary pointer (mouse left-button / first touch)
      if (e.button !== undefined && e.button !== 0) return;

      // Capture pointer so moves are received even when cursor leaves element
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);

      // If a previous drag was still active, tear it down before starting a new one.
      activeCleanupRef.current?.();
      activeCleanupRef.current = null;

      let lastX = e.clientX;
      let lastY = e.clientY;
      let latestX = e.clientX;
      let latestY = e.clientY;

      function getViewport() {
        return {
          viewportWidth: window.innerWidth,
          viewportHeight: window.innerHeight,
          dockHeight: TASKBAR_HEIGHT,
        };
      }

      function syncDragState(clientX: number, clientY: number) {
        const dx = clientX - lastX;
        const dy = clientY - lastY;

        lastX = clientX;
        lastY = clientY;

        if (dx !== 0 || dy !== 0) {
          dispatch({
            type: 'DRAG_WINDOW',
            id: windowId,
            dx,
            dy,
            viewportWidth: window.innerWidth,
            viewportHeight: window.innerHeight,
            dockHeight: TASKBAR_HEIGHT,
          });
        }

        const viewport = getViewport();
        const snapTarget = getSnapTargetFromPoint(clientX, clientY, viewport, SNAP_TRIGGER_PX);

        if (snapTarget === activePreviewTargetRef.current) return;

        activePreviewTargetRef.current = snapTarget;

        if (snapTarget) {
          dispatch({
            type: 'SET_SNAP_PREVIEW',
            preview: getSnapPreviewState(snapTarget, viewport),
          });
        } else {
          dispatch({ type: 'CLEAR_SNAP_PREVIEW' });
        }
      }

      function cancelScheduledFrame() {
        if (rafIdRef.current === null) return;
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }

      function cleanup() {
        cancelScheduledFrame();
        window.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('pointerup', onPointerUp);
        window.removeEventListener('pointercancel', onPointerCancel);
        if (activeCleanupRef.current === cleanup) {
          activeCleanupRef.current = null;
        }
      }

      function clearPreviewIfNeeded() {
        if (activePreviewTargetRef.current === null) return;
        activePreviewTargetRef.current = null;
        dispatch({ type: 'CLEAR_SNAP_PREVIEW' });
      }

      function finishDrag(shouldSnap: boolean) {
        const viewport = getViewport();
        syncDragState(latestX, latestY);

        if (shouldSnap) {
          const snapTarget = getSnapTargetFromPoint(latestX, latestY, viewport, SNAP_TRIGGER_PX);
          if (snapTarget) {
            dispatch(getSnapActionForTarget(snapTarget, windowId, viewport));
          }
        }

        clearPreviewIfNeeded();
        cleanup();
      }

      function onPointerMove(moveEvent: PointerEvent) {
        latestX = moveEvent.clientX;
        latestY = moveEvent.clientY;

        if (rafIdRef.current !== null) return;

        rafIdRef.current = requestAnimationFrame(() => {
          rafIdRef.current = null;
          syncDragState(latestX, latestY);
        });
      }

      function onPointerUp() {
        finishDrag(true);
      }

      function onPointerCancel() {
        finishDrag(false);
      }

      window.addEventListener('pointermove', onPointerMove);
      window.addEventListener('pointerup', onPointerUp);
      window.addEventListener('pointercancel', onPointerCancel);
      activeCleanupRef.current = cleanup;
    },
    [windowId, dispatch, layoutMode],
  );

  useEffect(() => {
    return () => {
      activeCleanupRef.current?.();
      activeCleanupRef.current = null;
    };
  }, []);

  // Return no-op when in tablet mode (drag disabled)
  if (layoutMode === 'tablet') {
    return { onPointerDown: () => {} };
  }

  return { onPointerDown };
}
