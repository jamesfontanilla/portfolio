/**
 * Unit tests for useKeyboardNav hook.
 *
 * Requirements: 8.3, 8.11
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { cleanup, renderHook } from '@testing-library/react';
import { useKeyboardNav } from './useKeyboardNav';
import type { WindowAction } from '@/store/windowManagerStore';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function pressKey(
  key: string,
  options: Pick<KeyboardEventInit, 'shiftKey' | 'ctrlKey' | 'altKey' | 'metaKey'> = {},
) {
  const event = new KeyboardEvent('keydown', { key, bubbles: true, ...options });
  window.dispatchEvent(event);
  return event;
}

function makeContainer(): HTMLElement {
  const container = document.createElement('div');
  container.setAttribute('tabindex', '-1');
  document.body.appendChild(container);
  return container;
}

function addButton(container: HTMLElement, label: string): HTMLButtonElement {
  const btn = document.createElement('button');
  btn.textContent = label;
  container.appendChild(btn);
  return btn;
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('useKeyboardNav', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let dispatch: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let onReturnFocus: any;
  let container: HTMLElement;
  let containerRef: React.RefObject<HTMLElement | null>;
  let windowState: { x: number; y: number; width: number; height: number; isMaximized: boolean };
  const snapViewport = { viewportWidth: 1280, viewportHeight: 800, dockHeight: 68 };

  beforeEach(() => {
    dispatch = vi.fn();
    onReturnFocus = vi.fn();
    container = makeContainer();
    containerRef = { current: container } as React.RefObject<HTMLElement | null>;
    windowState = { x: 100, y: 100, width: 640, height: 480, isMaximized: false };
  });

  afterEach(() => {
    cleanup();
    document.body.removeChild(container);
    vi.restoreAllMocks();
  });

  it('pressing Escape when window is active dispatches CLOSE_WINDOW and calls onReturnFocus', () => {
    renderHook(() =>
      useKeyboardNav({
        windowId: 'win-1',
        isActive: true,
        windowState,
        snapViewport,
        containerRef,
        dispatch: dispatch as React.Dispatch<WindowAction>,
        onReturnFocus,
      }),
    );

    pressKey('Escape');

    expect(dispatch).toHaveBeenCalledOnce();
    expect(dispatch).toHaveBeenCalledWith({ type: 'CLOSE_WINDOW', id: 'win-1' });
    expect(onReturnFocus).toHaveBeenCalledOnce();
  });

  it('pressing Escape when window is NOT active does nothing', () => {
    renderHook(() =>
      useKeyboardNav({
        windowId: 'win-1',
        isActive: false,
        windowState,
        snapViewport,
        containerRef,
        dispatch: dispatch as React.Dispatch<WindowAction>,
        onReturnFocus,
      }),
    );

    pressKey('Escape');

    expect(dispatch).not.toHaveBeenCalled();
    expect(onReturnFocus).not.toHaveBeenCalled();
  });

  it('Tab key wraps from last focusable element to first within the active window', () => {
    const btn1 = addButton(container, 'First');
    const btn2 = addButton(container, 'Second');
    const btn3 = addButton(container, 'Last');

    renderHook(() =>
      useKeyboardNav({
        windowId: 'win-1',
        isActive: true,
        windowState,
        snapViewport,
        containerRef,
        dispatch: dispatch as React.Dispatch<WindowAction>,
        onReturnFocus,
      }),
    );

    btn3.focus();
    expect(document.activeElement).toBe(btn3);

    const tabEvent = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: false, bubbles: true });
    document.dispatchEvent(tabEvent);

    expect(document.activeElement).toBe(btn1);
    void btn2;
  });

  it('Shift+Tab wraps from first focusable element to last within the active window', () => {
    const btn1 = addButton(container, 'First');
    addButton(container, 'Second');
    const btn3 = addButton(container, 'Last');

    renderHook(() =>
      useKeyboardNav({
        windowId: 'win-1',
        isActive: true,
        windowState,
        snapViewport,
        containerRef,
        dispatch: dispatch as React.Dispatch<WindowAction>,
        onReturnFocus,
      }),
    );

    btn1.focus();
    expect(document.activeElement).toBe(btn1);

    const shiftTabEvent = new KeyboardEvent('keydown', {
      key: 'Tab',
      shiftKey: true,
      bubbles: true,
    });
    document.dispatchEvent(shiftTabEvent);

    expect(document.activeElement).toBe(btn3);
  });

  it('focus trap is not active when isActive is false - Tab does not wrap', () => {
    const btn1 = addButton(container, 'First');
    addButton(container, 'Second');
    const btn3 = addButton(container, 'Last');

    renderHook(() =>
      useKeyboardNav({
        windowId: 'win-1',
        isActive: false,
        windowState,
        snapViewport,
        containerRef,
        dispatch: dispatch as React.Dispatch<WindowAction>,
        onReturnFocus,
      }),
    );

    btn3.focus();
    const tabEvent = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: false, bubbles: true });
    document.dispatchEvent(tabEvent);

    expect(document.activeElement).toBe(btn3);
    void btn1;
  });

  it('Ctrl+Alt+ArrowLeft snaps the active window to the left half', () => {
    renderHook(() =>
      useKeyboardNav({
        windowId: 'win-1',
        isActive: true,
        windowState,
        snapViewport,
        containerRef,
        dispatch: dispatch as React.Dispatch<WindowAction>,
        onReturnFocus,
      }),
    );

    pressKey('ArrowLeft', { ctrlKey: true, altKey: true });

    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'SNAP_LEFT', id: 'win-1' }),
    );
  });

  it('Ctrl+Alt+ArrowUp snaps an unsnapped window to maximize', () => {
    renderHook(() =>
      useKeyboardNav({
        windowId: 'win-1',
        isActive: true,
        windowState,
        snapViewport,
        containerRef,
        dispatch: dispatch as React.Dispatch<WindowAction>,
        onReturnFocus,
      }),
    );

    pressKey('ArrowUp', { ctrlKey: true, altKey: true });

    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'SNAP_MAXIMIZE', id: 'win-1' }),
    );
  });

  it('Ctrl+Alt+ArrowDown restores a maximized window', () => {
    windowState = { x: 0, y: 0, width: 1280, height: 732, isMaximized: true };

    renderHook(() =>
      useKeyboardNav({
        windowId: 'win-1',
        isActive: true,
        windowState,
        snapViewport,
        containerRef,
        dispatch: dispatch as React.Dispatch<WindowAction>,
        onReturnFocus,
      }),
    );

    pressKey('ArrowDown', { ctrlKey: true, altKey: true });

    expect(dispatch).toHaveBeenCalledWith({ type: 'RESTORE_MAX_WINDOW', id: 'win-1' });
  });
});
