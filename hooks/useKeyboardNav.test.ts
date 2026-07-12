/**
 * Unit tests for useKeyboardNav hook.
 *
 * Requirements: 8.3, 8.11
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useKeyboardNav } from './useKeyboardNav';
import type { WindowAction } from '@/store/windowManagerStore';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function pressKey(key: string, shiftKey = false) {
  const event = new KeyboardEvent('keydown', { key, shiftKey, bubbles: true });
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

  beforeEach(() => {
    dispatch = vi.fn();
    onReturnFocus = vi.fn();
    container = makeContainer();
    containerRef = { current: container } as React.RefObject<HTMLElement | null>;
  });

  afterEach(() => {
    document.body.removeChild(container);
    vi.restoreAllMocks();
  });

  // ─── Escape key ─────────────────────────────────────────────────────────────

  it('pressing Escape when window is active dispatches CLOSE_WINDOW and calls onReturnFocus', () => {
    renderHook(() =>
      useKeyboardNav({
        windowId: 'win-1',
        isActive: true,
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
        containerRef,
        dispatch: dispatch as React.Dispatch<WindowAction>,
        onReturnFocus,
      }),
    );

    pressKey('Escape');

    expect(dispatch).not.toHaveBeenCalled();
    expect(onReturnFocus).not.toHaveBeenCalled();
  });

  // ─── Focus trap — Tab wrapping ───────────────────────────────────────────────

  it('Tab key wraps from last focusable element to first within the active window', () => {
    const btn1 = addButton(container, 'First');
    const btn2 = addButton(container, 'Second');
    const btn3 = addButton(container, 'Last');

    renderHook(() =>
      useKeyboardNav({
        windowId: 'win-1',
        isActive: true,
        containerRef,
        dispatch: dispatch as React.Dispatch<WindowAction>,
        onReturnFocus,
      }),
    );

    // Focus the last button then press Tab — should wrap to first
    btn3.focus();
    expect(document.activeElement).toBe(btn3);

    const tabEvent = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: false, bubbles: true });
    document.dispatchEvent(tabEvent);

    expect(document.activeElement).toBe(btn1);

    // Escape key dispatch is unrelated to Tab — clear
    void btn1;
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
        containerRef,
        dispatch: dispatch as React.Dispatch<WindowAction>,
        onReturnFocus,
      }),
    );

    // Focus the first button then press Shift+Tab — should wrap to last
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

  it('focus trap is not active when isActive is false — Tab does not wrap', () => {
    const btn1 = addButton(container, 'First');
    addButton(container, 'Second');
    const btn3 = addButton(container, 'Last');

    renderHook(() =>
      useKeyboardNav({
        windowId: 'win-1',
        isActive: false,
        containerRef,
        dispatch: dispatch as React.Dispatch<WindowAction>,
        onReturnFocus,
      }),
    );

    // Focus last button, press Tab — focus should NOT be intercepted
    btn3.focus();
    const tabEvent = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: false, bubbles: true });
    document.dispatchEvent(tabEvent);

    // Focus should remain on btn3 (not wrapped to btn1)
    expect(document.activeElement).toBe(btn3);
  });
});
