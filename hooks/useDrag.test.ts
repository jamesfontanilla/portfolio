/**
 * Unit tests for useDrag hook.
 *
 * Requirements: 3.4, 3.12
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useDrag } from './useDrag';
import type { WindowAction } from '@/store/windowManagerStore';

// ─── RAF mock helpers ─────────────────────────────────────────────────────────

function setupRAF() {
  const callbacks: FrameRequestCallback[] = [];
  const raf = vi.fn((cb: FrameRequestCallback) => {
    callbacks.push(cb);
    return callbacks.length; // return id
  });
  const caf = vi.fn((id: number) => {
    // Mark as cancelled — simplistic approach: just remove if possible
    callbacks.splice(id - 1, 1, () => {});
  });

  vi.stubGlobal('requestAnimationFrame', raf);
  vi.stubGlobal('cancelAnimationFrame', caf);

  function flush() {
    // Execute all pending RAF callbacks (in order)
    const pending = callbacks.splice(0);
    pending.forEach((cb) => cb(performance.now()));
  }

  return { raf, callbacks, flush };
}

// ─── Pointer event helpers ────────────────────────────────────────────────────

function makePointerEvent(type: string, x: number, y: number): PointerEvent {
  return new PointerEvent(type, {
    clientX: x,
    clientY: y,
    button: 0,
    pointerId: 1,
    bubbles: true,
  });
}

function makeReactPointerEvent(
  type: string,
  x: number,
  y: number,
  target: HTMLElement,
): React.PointerEvent<HTMLElement> {
  const nativeEvent = makePointerEvent(type, x, y);
  return {
    ...nativeEvent,
    nativeEvent,
    currentTarget: target,
    target,
    button: 0,
    pointerId: 1,
    clientX: x,
    clientY: y,
    preventDefault: vi.fn(),
    stopPropagation: vi.fn(),
  } as unknown as React.PointerEvent<HTMLElement>;
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('useDrag', () => {
  let dispatch: ReturnType<typeof vi.fn>;
  let element: HTMLElement;
  let rafSetup: ReturnType<typeof setupRAF>;

  beforeEach(() => {
    dispatch = vi.fn();
    element = document.createElement('div');
    document.body.appendChild(element);
    element.setPointerCapture = vi.fn();

    rafSetup = setupRAF();

    // Mock window dimensions
    Object.defineProperty(window, 'innerWidth', { value: 1280, configurable: true });
    Object.defineProperty(window, 'innerHeight', { value: 800, configurable: true });
  });

  afterEach(() => {
    document.body.removeChild(element);
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('pointer down + move dispatches DRAG_WINDOW with correct deltas', () => {
    const { result } = renderHook(() =>
      useDrag({ windowId: 'win-1', dispatch: dispatch as React.Dispatch<WindowAction> }),
    );

    // Simulate pointer down at (100, 200)
    const downEvent = makeReactPointerEvent('pointerdown', 100, 200, element);
    result.current.onPointerDown(downEvent);

    // Simulate pointer move to (130, 220) → dx=30, dy=20
    const moveEvent = makePointerEvent('pointermove', 130, 220);
    window.dispatchEvent(moveEvent);

    // Flush RAF so dispatch fires
    rafSetup.flush();

    expect(dispatch).toHaveBeenCalledOnce();
    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'DRAG_WINDOW',
        id: 'win-1',
        dx: 30,
        dy: 20,
      }),
    );
  });

  it('pointer up stops dispatching on subsequent moves', () => {
    const { result } = renderHook(() =>
      useDrag({ windowId: 'win-1', dispatch: dispatch as React.Dispatch<WindowAction> }),
    );

    result.current.onPointerDown(makeReactPointerEvent('pointerdown', 0, 0, element));

    // Move while dragging
    window.dispatchEvent(makePointerEvent('pointermove', 10, 10));
    rafSetup.flush();
    expect(dispatch).toHaveBeenCalledOnce();
    dispatch.mockClear();

    // Release pointer
    window.dispatchEvent(new PointerEvent('pointerup', { bubbles: true }));

    // Move after pointer up — should not dispatch
    window.dispatchEvent(makePointerEvent('pointermove', 50, 50));
    rafSetup.flush();
    expect(dispatch).not.toHaveBeenCalled();
  });

  it('RAF throttling — two rapid pointermove events in the same frame only dispatch once', () => {
    const { result } = renderHook(() =>
      useDrag({ windowId: 'win-1', dispatch: dispatch as React.Dispatch<WindowAction> }),
    );

    result.current.onPointerDown(makeReactPointerEvent('pointerdown', 0, 0, element));

    // Fire two moves before flushing RAF
    window.dispatchEvent(makePointerEvent('pointermove', 5, 5));
    window.dispatchEvent(makePointerEvent('pointermove', 10, 10));

    // Flush RAF — only the first move should have queued a frame
    rafSetup.flush();

    // Only one dispatch for the first move (second was throttled)
    expect(dispatch).toHaveBeenCalledOnce();
  });

  it('tablet mode returns a no-op — no dispatch on pointer down', () => {
    const { result } = renderHook(() =>
      useDrag({
        windowId: 'win-1',
        dispatch: dispatch as React.Dispatch<WindowAction>,
        layoutMode: 'tablet',
      }),
    );

    result.current.onPointerDown(makeReactPointerEvent('pointerdown', 0, 0, element));

    // Move and flush
    window.dispatchEvent(makePointerEvent('pointermove', 20, 20));
    rafSetup.flush();

    expect(dispatch).not.toHaveBeenCalled();
  });

  it('dispatches incremental deltas, not absolute position', () => {
    const { result } = renderHook(() =>
      useDrag({ windowId: 'win-1', dispatch: dispatch as React.Dispatch<WindowAction> }),
    );

    result.current.onPointerDown(makeReactPointerEvent('pointerdown', 100, 100, element));

    // First move: 100→110 = dx:10, dy:5
    window.dispatchEvent(makePointerEvent('pointermove', 110, 105));
    rafSetup.flush();

    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'DRAG_WINDOW', dx: 10, dy: 5 }),
    );
    dispatch.mockClear();

    // Second move: 110→120 = dx:10, dy:10 (incremental from last position)
    window.dispatchEvent(makePointerEvent('pointermove', 120, 115));
    rafSetup.flush();

    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'DRAG_WINDOW', dx: 10, dy: 10 }),
    );
  });
});
