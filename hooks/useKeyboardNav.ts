/**
 * useKeyboardNav — keyboard navigation for the OS UI window system.
 *
 * Exports:
 *  - useFocusTrap(containerRef, active): intercepts Tab/Shift+Tab to cycle
 *    focus within a container's focusable elements.
 *  - transferFocus(windows, dockRef): moves focus to the open window with
 *    the highest zIndex, or the first focusable dock element if none.
 *  - useKeyboardNav({ windowId, isActive, containerRef, dispatch, onReturnFocus }):
 *    wires Escape key handler + focus trap for a window.
 *
 * Requirements: 8.3, 8.4, 8.8, 8.11
 */

import { useEffect, useCallback } from 'react';
import type { WindowState, WindowAction } from '@/store/windowManagerStore';
import { getKeyboardSnapTarget, getSnapActionForTarget, type SnapViewport } from '@/lib/windowSnap';

// ─── Constants ────────────────────────────────────────────────────────────────

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getFocusableElements(container: HTMLElement | null): HTMLElement[] {
  if (!container) return [];
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    (el) => !el.closest('[hidden]') && el.getAttribute('tabindex') !== '-1',
  );
}

// ─── useFocusTrap ─────────────────────────────────────────────────────────────

/**
 * When `active` is true, intercepts Tab / Shift+Tab to cycle focus within
 * the container's focusable elements (wrapping at both ends).
 */
export function useFocusTrap(
  containerRef: React.RefObject<HTMLElement | null>,
  active: boolean,
): void {
  useEffect(() => {
    if (!active) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== 'Tab') return;

      const focusable = getFocusableElements(containerRef.current);
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const current = document.activeElement as HTMLElement | null;

      if (e.shiftKey) {
        // Shift+Tab: wrap from first → last
        if (current === first || !containerRef.current?.contains(current)) {
          e.preventDefault();
          last.focus();
        }
      } else {
        // Tab: wrap from last → first
        if (current === last || !containerRef.current?.contains(current)) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [containerRef, active]);
}

// ─── transferFocus ────────────────────────────────────────────────────────────

/**
 * Moves focus to the open (non-minimized) window with the highest zIndex.
 * Falls back to the first focusable element of the dock if no windows are open.
 */
export function transferFocus(
  windows: WindowState[],
  dockRef: React.RefObject<HTMLElement | null>,
): void {
  const openWindows = windows.filter((w) => w.isOpen && !w.isMinimized);

  if (openWindows.length > 0) {
    // Find the window element with the highest zIndex
    const topWindow = openWindows.reduce((a, b) => (a.zIndex > b.zIndex ? a : b));
    const windowEl = document.querySelector<HTMLElement>(`[data-window-id="${topWindow.id}"]`);
    if (windowEl) {
      const focusable = getFocusableElements(windowEl);
      if (focusable.length > 0) {
        focusable[0].focus();
        return;
      }
      windowEl.focus();
      return;
    }
  }

  // Fall back to dock
  const dockFocusable = getFocusableElements(dockRef.current);
  if (dockFocusable.length > 0) {
    dockFocusable[0].focus();
  }
}

// ─── useKeyboardNav ───────────────────────────────────────────────────────────

interface UseKeyboardNavOptions {
  /** ID of the window this hook is attached to. */
  windowId: string;
  /** Whether this window is currently the active (focused) window. */
  isActive: boolean;
  /** Current window state, used for snap shortcut resolution. */
  windowState: Pick<WindowState, 'x' | 'y' | 'width' | 'height' | 'isMaximized'>;
  /** Current viewport measurements, used for snap shortcut resolution. */
  snapViewport: SnapViewport;
  /** Ref to the window container element for focus trapping. */
  containerRef: React.RefObject<HTMLElement | null>;
  /** Reducer dispatch for CLOSE_WINDOW. */
  dispatch: React.Dispatch<WindowAction>;
  /** Called after CLOSE_WINDOW so focus can return to the App Icon. */
  onReturnFocus: () => void;
}

/**
 * Wires:
 *  1. Escape key → CLOSE_WINDOW + onReturnFocus when this window is active.
 *  2. Focus trap (Tab/Shift+Tab wrapping) when this window is active.
 */
export function useKeyboardNav({
  windowId,
  isActive,
  windowState,
  snapViewport,
  containerRef,
  dispatch,
  onReturnFocus,
}: UseKeyboardNavOptions): void {
  // Focus trap for Tab/Shift+Tab
  useFocusTrap(containerRef, isActive);

  // Escape handler
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isActive) return;

      const target = e.target as HTMLElement | null;
      if (target) {
        const tag = target.tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || target.isContentEditable) {
          return;
        }
      }

      if ((e.metaKey || (e.ctrlKey && e.altKey)) && e.key === 'ArrowDown' && windowState.isMaximized) {
        e.preventDefault();
        dispatch({ type: 'RESTORE_MAX_WINDOW', id: windowId });
        return;
      }

      const snapTarget = getKeyboardSnapTarget(e, windowState, snapViewport);
      if (snapTarget) {
        e.preventDefault();
        dispatch(getSnapActionForTarget(snapTarget, windowId, snapViewport));
        return;
      }

      if (e.key !== 'Escape') return;

      dispatch({ type: 'CLOSE_WINDOW', id: windowId });
      onReturnFocus();
    },
    [isActive, windowId, dispatch, onReturnFocus, snapViewport, windowState],
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
}
