'use client';

/**
 * Window - draggable, resizable glassmorphism panel.
 *
 * Features:
 *  - position: fixed, transform: translate(x, y) for compositor-accelerated positioning
 *  - backdrop-filter blur with active/inactive transitions
 *  - WindowTitleBar (drag handle + traffic lights)
 *  - Snap layout flyout on maximize hover
 *  - Scrollable content area with role="region"
 *  - ResizeHandle (bottom-right corner)
 *  - role="dialog", aria-modal="true"
 *  - useKeyboardNav focus trap + Escape handler
 *  - Tablet mode: clamp to 90vw x 80vh, drag disabled
 *
 * Requirements: 3.1, 3.4, 3.5, 4.1, 4.2, 4.3, 4.5, 4.6, 4.7, 4.8, 5.7, 8.3, 9.3
 */

import React, { useRef, useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import type { WindowState, WindowAction, ContentType } from '@/store/windowManagerStore';
import { useDrag } from '@/hooks/useDrag';
import { useKeyboardNav } from '@/hooks/useKeyboardNav';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { TASKBAR_HEIGHT } from './Taskbar';
import { WindowTitleBar } from './WindowTitleBar';
import { ResizeHandle } from './ResizeHandle';
import { SnapLayoutFlyout } from './SnapLayoutFlyout';
import { contentTypeLabel } from './AppIcon';
import { getSnapActionForTarget, type SnapTarget } from '@/lib/windowSnap';

export interface WindowProps {
  state: WindowState;
  isActive: boolean;
  layoutMode: 'desktop' | 'tablet' | 'mobile';
  dockIconRef: React.RefObject<HTMLButtonElement | null>;
  onFocus: (id: string) => void;
  dispatch: React.Dispatch<WindowAction>;
  children?: React.ReactNode;
}

/**
 * Returns the center coordinates of the dock icon for minimize animation target.
 * Falls back to bottom-center if the icon ref is unavailable.
 */
export function getMinimizeTarget(
  iconRef: React.RefObject<HTMLButtonElement | null>,
): { x: number; y: number } {
  const rect = iconRef.current?.getBoundingClientRect();
  if (!rect) return { x: window.innerWidth / 2, y: window.innerHeight };
  return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
}

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
      },
    );

    anim.onfinish = () => {
      el.style.opacity = '1';
    };

    el.style.opacity = '0';
    // Run only on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const prevMinimizedRef = useRef(state.isMinimized);
  const [visuallyHidden, setVisuallyHidden] = useState(state.isMinimized);
  const activeAnimRef = useRef<Animation | null>(null);

  useEffect(() => {
    if (activeAnimRef.current && !state.isMinimized) {
      activeAnimRef.current.cancel();
      activeAnimRef.current = null;
    }
  }, [x, y, width, height, state.isMaximized, state.isMinimized]);

  useEffect(() => {
    const wasMinimized = prevMinimizedRef.current;
    const isMinimized = state.isMinimized;
    prevMinimizedRef.current = isMinimized;

    const el = containerRef.current;
    if (!el) return;

    if (activeAnimRef.current) {
      activeAnimRef.current.cancel();
      activeAnimRef.current = null;
    }

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
        },
      );

      activeAnimRef.current = anim;

      anim.onfinish = () => {
        setVisuallyHidden(true);
      };
    }

    if (wasMinimized && !isMinimized) {
      setVisuallyHidden(false);

      const target = getMinimizeTarget(dockIconRef);
      const elRect = el.getBoundingClientRect();
      const dx = target.x - (elRect.left + elRect.width / 2);
      const dy = target.y - (elRect.top + elRect.height / 2);

      el.style.transformOrigin = 'bottom center';

      const anim = el.animate(
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
        },
      );

      activeAnimRef.current = anim;

      anim.onfinish = () => {
        activeAnimRef.current = null;
      };
    }
  }, [state.isMinimized, x, y, dockIconRef, reducedMotion]);

  const { onPointerDown: onTitleBarPointerDown } = useDrag({
    windowId: id,
    dispatch,
    layoutMode,
  });

  const snapViewport = {
    viewportWidth: window.innerWidth,
    viewportHeight: window.innerHeight,
    dockHeight: TASKBAR_HEIGHT,
  };

  const closeSnapFlyoutTimerRef = useRef<number | null>(null);
  const [snapFlyoutOpen, setSnapFlyoutOpen] = useState(false);
  const [snapFlyoutAnchor, setSnapFlyoutAnchor] = useState<DOMRect | null>(null);

  const clearSnapFlyoutTimer = useCallback(() => {
    if (closeSnapFlyoutTimerRef.current !== null) {
      window.clearTimeout(closeSnapFlyoutTimerRef.current);
      closeSnapFlyoutTimerRef.current = null;
    }
  }, []);

  const dismissSnapFlyout = useCallback(() => {
    clearSnapFlyoutTimer();
    setSnapFlyoutOpen(false);
  }, [clearSnapFlyoutTimer]);

  const requestSnapFlyoutClose = useCallback(() => {
    clearSnapFlyoutTimer();
    closeSnapFlyoutTimerRef.current = window.setTimeout(() => {
      closeSnapFlyoutTimerRef.current = null;
      setSnapFlyoutOpen(false);
    }, 120);
  }, [clearSnapFlyoutTimer]);

  const openSnapFlyout = useCallback(
    (anchorRect: DOMRect) => {
      clearSnapFlyoutTimer();
      setSnapFlyoutAnchor(anchorRect);
      setSnapFlyoutOpen(true);
    },
    [clearSnapFlyoutTimer],
  );

  useEffect(() => {
    return () => clearSnapFlyoutTimer();
  }, [clearSnapFlyoutTimer]);

  useEffect(() => {
    if (state.isMinimized) {
      dismissSnapFlyout();
    }
  }, [state.isMinimized, dismissSnapFlyout]);

  const onReturnFocus = useCallback(() => {
    dockIconRef.current?.focus();
  }, [dockIconRef]);

  useKeyboardNav({
    windowId: id,
    isActive,
    windowState: state,
    snapViewport,
    containerRef: containerRef as React.RefObject<HTMLElement | null>,
    dispatch,
    onReturnFocus,
  });

  const handleSnapLayoutSelect = useCallback(
    (target: SnapTarget) => {
      dismissSnapFlyout();
      dispatch(getSnapActionForTarget(target, id, snapViewport));
    },
    [dismissSnapFlyout, dispatch, id, snapViewport],
  );

  const handleMaximize = useCallback(() => {
    dismissSnapFlyout();

    if (state.isMaximized) {
      dispatch({ type: 'RESTORE_MAX_WINDOW', id });
      return;
    }

    dispatch({
      type: 'MAXIMIZE_WINDOW',
      id,
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
      dockHeight: TASKBAR_HEIGHT,
    });
  }, [dismissSnapFlyout, dispatch, id, state.isMaximized]);

  const handleWindowPointerDown = useCallback(() => {
    dismissSnapFlyout();
    if (!isActive) {
      onFocus(id);
    }
  }, [dismissSnapFlyout, isActive, id, onFocus]);

  const isTablet = layoutMode === 'tablet';
  const resolvedWidth = isTablet ? Math.min(width, window.innerWidth * 0.9) : width;
  const resolvedHeight = isTablet ? Math.min(height, window.innerHeight * 0.8) : height;

  const blurAmount = isActive ? '26px' : '16px';
  const borderColor = isActive ? 'var(--border-strong)' : 'var(--border)';

  const positionStyle: React.CSSProperties = isTablet
    ? {
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
      }
    : {
        left: 0,
        top: 0,
        transform: `translate(${x}px, ${y}px)`,
      };

  const hiddenStyle: React.CSSProperties = visuallyHidden
    ? { visibility: 'hidden', pointerEvents: 'none' }
    : {};

  return (
    <div
      ref={containerRef}
      role="dialog"
      aria-modal="true"
      aria-label={`${label} window`}
      className="os-window liquid-glass-surface"
      data-window-id={id}
      onPointerDown={handleWindowPointerDown}
      style={{
        ...positionStyle,
        ...hiddenStyle,
        width: `${resolvedWidth}px`,
        height: `${resolvedHeight}px`,
        zIndex,
        background: isActive ? 'var(--window-surface-active)' : 'var(--window-surface)',
        backdropFilter: `blur(${blurAmount}) saturate(1.28)`,
        WebkitBackdropFilter: `blur(${blurAmount}) saturate(1.28)`,
        borderRadius: 'var(--radius)',
        border: `1px solid ${borderColor}`,
        boxShadow: 'var(--glass-shadow)',
        transition: `width ${reducedMotion ? 0 : 250}ms ease-in-out, height ${reducedMotion ? 0 : 250}ms ease-in-out, border-color 150ms ease, backdrop-filter 150ms ease, -webkit-backdrop-filter 150ms ease`,
      }}
    >
      <WindowTitleBar
        title={label}
        contentType={contentType}
        onPointerDown={onTitleBarPointerDown}
        onClose={() => dispatch({ type: 'CLOSE_WINDOW', id })}
        onMinimize={() => dispatch({ type: 'MINIMIZE_WINDOW', id })}
        onMaximize={handleMaximize}
        onMaximizeHoverStart={openSnapFlyout}
        onMaximizeHoverEnd={requestSnapFlyoutClose}
      />

      {snapFlyoutOpen &&
        snapFlyoutAnchor &&
        typeof document !== 'undefined' &&
        createPortal(
          <SnapLayoutFlyout
            anchorRect={snapFlyoutAnchor}
            onSelect={handleSnapLayoutSelect}
            onPointerEnter={clearSnapFlyoutTimer}
            onPointerLeave={requestSnapFlyoutClose}
          />,
          document.body,
        )}

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

      {!isTablet && <ResizeHandle windowId={id} dispatch={dispatch} />}
    </div>
  );
}
