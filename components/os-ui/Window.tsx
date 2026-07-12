'use client';

/**
 * Window — draggable, resizable glassmorphism panel.
 *
 * Features:
 *  - position:fixed, transform:translate(x,y) for compositor-accelerated positioning
 *  - backdrop-filter: blur(26px) active / blur(16px) inactive, 150ms transition
 *  - border: --border-strong active / --border inactive, 150ms transition
 *  - WindowTitleBar (drag handle + traffic lights)
 *  - Scrollable content area with role="region"
 *  - ResizeHandle (bottom-right corner)
 *  - role="dialog", aria-modal="true"
 *  - useKeyboardNav focus trap + Escape handler
 *  - Tablet mode: clamp to 90vw × 80vh, drag disabled
 *
 * Requirements: 3.1, 3.4, 3.5, 4.1, 4.2, 4.3, 4.5, 4.6, 4.7, 4.8, 5.7, 8.3, 9.3
 */

import React, { useRef, useCallback, useEffect, useState } from 'react';
import type { WindowState, WindowAction, ContentType } from '@/store/windowManagerStore';
import { useDrag } from '@/hooks/useDrag';
import { useKeyboardNav } from '@/hooks/useKeyboardNav';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { WindowTitleBar } from './WindowTitleBar';
import { ResizeHandle } from './ResizeHandle';
import { contentTypeLabel } from './AppIcon';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface WindowProps {
  state: WindowState;
  isActive: boolean;
  layoutMode: 'desktop' | 'tablet' | 'mobile';
  dockIconRef: React.RefObject<HTMLButtonElement | null>;
  onFocus: (id: string) => void;
  dispatch: React.Dispatch<WindowAction>;
  children?: React.ReactNode;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const TITLE_BAR_HEIGHT = 40;
const TASKBAR_HEIGHT = 68; // matches Taskbar component height (includes floating gap)

/**
 * Returns the center coordinates of the dock icon for minimize animation target.
 * Falls back to bottom-center if the icon ref is unavailable.
 */
export function getMinimizeTarget(
  iconRef: React.RefObject<HTMLButtonElement | null>
): { x: number; y: number } {
  const rect = iconRef.current?.getBoundingClientRect();
  if (!rect) return { x: window.innerWidth / 2, y: window.innerHeight };
  return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };

}

// ─── Component ────────────────────────────────────────────────────────────────

export function Window({
  state,
  isActive,
  layoutMode,
  dockIconRef,
  onFocus,
  dispatch,
  children,
}: WindowProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  const { id, contentType, x, y, width, height, zIndex } = state;
  const label = contentTypeLabel[contentType];

  // ── Open animation ────────────────────────────────────────────────────────

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const anim = el.animate(
      [
        { opacity: '0', scale: '0.85' },
        { opacity: '1', scale: '1' },
      ],
      {
        duration: reducedMotion ? 0 : 220,
        easing: 'ease-out',
        fill: 'none',
      }
    );

    // Ensure element is visible after animation completes
    anim.onfinish = () => {
      el.style.opacity = '1';
    };

    // Start from invisible
    el.style.opacity = '0';
    // Run only on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Minimize / restore animation (macOS Genie effect) ───────────────────────

  const prevMinimizedRef = useRef(state.isMinimized);
  const [visuallyHidden, setVisuallyHidden] = useState(state.isMinimized);

  useEffect(() => {
    const wasMinimized = prevMinimizedRef.current;
    const isMinimized = state.isMinimized;
    prevMinimizedRef.current = isMinimized;

    const el = containerRef.current;
    if (!el) return;

    // Genie effect: window funnels down toward the taskbar icon
    if (!wasMinimized && isMinimized) {
      const target = getMinimizeTarget(dockIconRef);
      const elRect = el.getBoundingClientRect();
      const dx = target.x - (elRect.left + elRect.width / 2);
      const dy = target.y - (elRect.top + elRect.height / 2);

      el.style.transformOrigin = 'bottom center';

      const anim = el.animate(
        [
          {
            offset: 0,
            transform: `translate(${x}px, ${y}px) perspective(800px) rotateX(0deg) scaleX(1) scaleY(1)`,
            opacity: '1',
          },
          {
            offset: 0.4,
            transform: `translate(${x + dx * 0.3}px, ${y + dy * 0.5}px) perspective(800px) rotateX(12deg) scaleX(0.7) scaleY(0.6)`,
            opacity: '0.8',
          },
          {
            offset: 0.7,
            transform: `translate(${x + dx * 0.7}px, ${y + dy * 0.85}px) perspective(800px) rotateX(20deg) scaleX(0.3) scaleY(0.35)`,
            opacity: '0.4',
          },
          {
            offset: 1,
            transform: `translate(${x + dx}px, ${y + dy}px) perspective(800px) rotateX(40deg) scaleX(0.05) scaleY(0.05)`,
            opacity: '0',
          },
        ],
        {
          duration: reducedMotion ? 0 : 500,
          easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
          fill: 'forwards',
        }
      );

      anim.onfinish = () => {
        setVisuallyHidden(true);
      };
    }

    // Reverse genie: window pours back out from the taskbar icon
    if (wasMinimized && !isMinimized) {
      setVisuallyHidden(false);

      const target = getMinimizeTarget(dockIconRef);
      const elRect = el.getBoundingClientRect();
      const dx = target.x - (elRect.left + elRect.width / 2);
      const dy = target.y - (elRect.top + elRect.height / 2);

      el.style.transformOrigin = 'bottom center';

      el.animate(
        [
          {
            offset: 0,
            transform: `translate(${x + dx}px, ${y + dy}px) perspective(800px) rotateX(40deg) scaleX(0.05) scaleY(0.05)`,
            opacity: '0',
          },
          {
            offset: 0.3,
            transform: `translate(${x + dx * 0.6}px, ${y + dy * 0.7}px) perspective(800px) rotateX(20deg) scaleX(0.35) scaleY(0.4)`,
            opacity: '0.5',
          },
          {
            offset: 0.6,
            transform: `translate(${x + dx * 0.2}px, ${y + dy * 0.3}px) perspective(800px) rotateX(8deg) scaleX(0.75) scaleY(0.8)`,
            opacity: '0.85',
          },
          {
            offset: 1,
            transform: `translate(${x}px, ${y}px) perspective(800px) rotateX(0deg) scaleX(1) scaleY(1)`,
            opacity: '1',
          },
        ],
        {
          duration: reducedMotion ? 0 : 500,
          easing: 'cubic-bezier(0, 0, 0.2, 1)',
          fill: 'forwards',
        }
      );
    }
  }, [state.isMinimized, x, y, dockIconRef, reducedMotion]);

  // ── Drag ──────────────────────────────────────────────────────────────────

  const { onPointerDown: onTitleBarPointerDown } = useDrag({
    windowId: id,
    dispatch,
    layoutMode,
  });

  // ── Keyboard nav ──────────────────────────────────────────────────────────

  const onReturnFocus = useCallback(() => {
    dockIconRef.current?.focus();
  }, [dockIconRef]);

  useKeyboardNav({
    windowId: id,
    isActive,
    containerRef: containerRef as React.RefObject<HTMLElement | null>,
    dispatch,
    onReturnFocus,
  });

  // ── Snap-to-maximize on title bar drag to top edge ────────────────────────

  // Handled in useDrag by checking y < 8 on pointerup; trigger SNAP_MAXIMIZE.
  // We hook into pointermove on the title bar to detect the snap condition.
  const handleTitleBarPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      onTitleBarPointerDown(e as React.PointerEvent<HTMLElement>);

      // Listen for pointerup to check snap condition
      function onPointerUp() {
        const el = containerRef.current;
        if (!el) return;
        // Check current y from transform
        const transform = el.style.transform;
        const match = transform.match(/translate\(([^,]+),\s*([^)]+)\)/);
        if (match) {
          const currentY = parseFloat(match[2]);
          if (currentY < 8) {
            dispatch({
              type: 'SNAP_MAXIMIZE',
              id,
              viewportWidth: window.innerWidth,
              viewportHeight: window.innerHeight,
              dockHeight: TASKBAR_HEIGHT,
            });
          }
        }
        window.removeEventListener('pointerup', onPointerUp);
      }
      window.addEventListener('pointerup', onPointerUp);
    },
    [onTitleBarPointerDown, id, dispatch],
  );

  // ── Focus on click ────────────────────────────────────────────────────────

  const handleWindowPointerDown = useCallback(() => {
    if (!isActive) {
      onFocus(id);
    }
  }, [isActive, id, onFocus]);

  // ── Tablet sizing ─────────────────────────────────────────────────────────

  const isTablet = layoutMode === 'tablet';
  const resolvedWidth = isTablet ? Math.min(width, window.innerWidth * 0.9) : width;
  const resolvedHeight = isTablet ? Math.min(height, window.innerHeight * 0.8) : height;

  // ── Glassmorphism style ───────────────────────────────────────────────────

  const blurAmount = isActive ? '26px' : '16px';
  const borderColor = isActive ? 'var(--border-strong)' : 'var(--border)';

  // ── Position style ────────────────────────────────────────────────────────

  // Tablet: center via left/top 50% transform; Desktop: translate(x, y)
  const positionStyle: React.CSSProperties = isTablet
    ? {
        left: '50%',
        top: '50%',
        transform: `translate(-50%, -50%)`,
      }
    : {
        left: 0,
        top: 0,
        transform: `translate(${x}px, ${y}px)`,
      };

  // Don't render DOM at all when visually hidden (after genie animation completes)
  // Use visibility:hidden instead of null to keep ref available for restore animation
  const hiddenStyle: React.CSSProperties = visuallyHidden
    ? { visibility: 'hidden', pointerEvents: 'none' }
    : {};

  return (
    <div
      ref={containerRef}
      role="dialog"
      aria-modal="true"
      aria-label={`${label} window`}
      className="os-window"
      data-window-id={id}
      onPointerDown={handleWindowPointerDown}
      style={{
        ...positionStyle,
        ...hiddenStyle,
        width: `${resolvedWidth}px`,
        height: `${resolvedHeight}px`,
        zIndex,
        // Glassmorphism
        background: 'var(--panel)',
        backdropFilter: `blur(${blurAmount})`,
        WebkitBackdropFilter: `blur(${blurAmount})`,
        borderRadius: 'var(--radius)',
        border: `1px solid ${borderColor}`,
        boxShadow: 'var(--shadow)',
        // Transitions for active/inactive state + maximize/restore
        transition: `width ${reducedMotion ? 0 : 250}ms ease-in-out, height ${reducedMotion ? 0 : 250}ms ease-in-out, border-color 150ms ease, backdrop-filter 150ms ease, -webkit-backdrop-filter 150ms ease`,
      }}
    >
      {/* Title bar */}
      <WindowTitleBar
        title={label}
        contentType={contentType}
        onPointerDown={handleTitleBarPointerDown}
        onClose={() => dispatch({ type: 'CLOSE_WINDOW', id })}
        onMinimize={() => dispatch({ type: 'MINIMIZE_WINDOW', id })}
        onMaximize={() =>
          dispatch({
            type: state.isMaximized ? 'RESTORE_MAX_WINDOW' : 'MAXIMIZE_WINDOW',
            id,
            viewportWidth: window.innerWidth,
            viewportHeight: window.innerHeight,
            dockHeight: TASKBAR_HEIGHT,
          })
        }
      />

      {/* Scrollable content area */}
      <div
        role="region"
        aria-label={`${label} content`}
        style={{
          flex: 1,
          overflow: 'auto',
          position: 'relative',
        }}
      >
        {children}
      </div>

      {/* Resize handle */}
      {!isTablet && <ResizeHandle windowId={id} dispatch={dispatch} />}
    </div>
  );
}
