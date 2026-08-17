/**
 * Property-based tests for windowManagerReducer
 *
 * Uses fast-check + @fast-check/vitest for property tests.
 * All tests run the pure reducer — no side effects, no DOM.
 */

import { describe, it, expect } from 'vitest';
import { test, fc } from '@fast-check/vitest';
import {
  windowManagerReducer,
  initialWindowManagerState,
  ContentType,
  WindowManagerState,
  WindowState,
  WindowAction,
} from './windowManagerStore';

// ─── Arbitraries ─────────────────────────────────────────────────────────────

const contentTypeArb = fc.constantFrom<ContentType>(
  'about',
  'projects',
  'certifications',
  'events',
  'contacts',
  'tech-stack',
);

const viewportArb = fc.record({
  vw: fc.integer({ min: 400, max: 2560 }),
  vh: fc.integer({ min: 400, max: 1600 }),
  dockHeight: fc.integer({ min: 48, max: 120 }),
});

/** Build a state with one open window of the given contentType */
function stateWithWindow(
  contentType: ContentType,
  overrides: Partial<WindowState> = {},
): WindowManagerState {
  const w: WindowState = {
    id: 'test-window-id',
    contentType,
    x: 100,
    y: 100,
    width: 680,
    height: 520,
    zIndex: 100,
    isOpen: true,
    isMinimized: false,
    isMaximized: false,
    preMaximizedRect: null,
    ...overrides,
  };
  return {
    ...initialWindowManagerState,
    windows: [w],
    nextZIndex: 101,
    topZIndex: 100,
  };
}

// ─── Property 4 ──────────────────────────────────────────────────────────────
// Opening any ContentType creates a WindowState with all required fields
// Validates: Requirements 2.3, 3.1, 3.2

describe('Property 4: Opening any ContentType creates a WindowState with all required fields', () => {
  /**
   * **Validates: Requirements 2.3, 3.1, 3.2**
   */
  test.prop([contentTypeArb, viewportArb])(
    'OPEN_WINDOW produces a valid WindowState for any ContentType',
    (contentType, { vw, vh, dockHeight }) => {
      const action: WindowAction = {
        type: 'OPEN_WINDOW',
        contentType,
        viewportWidth: vw,
        viewportHeight: vh,
        dockHeight,
      };

      const next = windowManagerReducer(initialWindowManagerState, action);

      expect(next.windows).toHaveLength(1);
      const w = next.windows[0];

      // Non-empty id
      expect(w.id).toBeTruthy();
      expect(typeof w.id).toBe('string');
      expect(w.id.length).toBeGreaterThan(0);

      // Correct contentType
      expect(w.contentType).toBe(contentType);

      // Non-negative x/y within viewport bounds
      expect(w.x).toBeGreaterThanOrEqual(0);
      expect(w.y).toBeGreaterThanOrEqual(0);
      expect(w.x).toBeLessThanOrEqual(vw);
      expect(w.y).toBeLessThanOrEqual(vh);

      // Minimum size
      expect(w.width).toBeGreaterThanOrEqual(320);
      expect(w.height).toBeGreaterThanOrEqual(240);

      // Positive zIndex
      expect(w.zIndex).toBeGreaterThan(0);

      // Correct flags
      expect(w.isOpen).toBe(true);
      expect(w.isMinimized).toBe(false);
      expect(w.isMaximized).toBe(false);
    },
  );
});

// ─── Property 5 ──────────────────────────────────────────────────────────────
// Focusing any open non-minimized Window gives it the highest z-index
// Validates: Requirements 2.5, 3.6

describe('Property 5: Focusing any open non-minimized Window gives it the highest z-index', () => {
  /**
   * **Validates: Requirements 2.5, 3.6**
   */
  test.prop([
    fc.array(contentTypeArb, { minLength: 1, maxLength: 5 }),
    fc.integer({ min: 0, max: 4 }),
    viewportArb,
  ])(
    'FOCUS_WINDOW raises the targeted window to the max z-index',
    (contentTypes, targetIdx, { vw, vh, dockHeight }) => {
      // Deduplicate content types (reducer prevents duplicate contentTypes)
      const unique = [...new Set(contentTypes)];
      if (unique.length === 0) return;

      // Build a state with multiple open windows
      let state = initialWindowManagerState;
      for (const ct of unique) {
        state = windowManagerReducer(state, {
          type: 'OPEN_WINDOW',
          contentType: ct,
          viewportWidth: vw,
          viewportHeight: vh,
          dockHeight,
        });
      }

      const safeIdx = targetIdx % state.windows.length;
      const target = state.windows[safeIdx];

      const next = windowManagerReducer(state, { type: 'FOCUS_WINDOW', id: target.id });

      const focused = next.windows.find((w) => w.id === target.id)!;
      const maxZ = Math.max(...next.windows.map((w) => w.zIndex));

      expect(focused.zIndex).toBe(maxZ);
    },
  );
});

// ─── Property 6 ──────────────────────────────────────────────────────────────
// Minimize-then-restore is a round trip for any Window
// Validates: Requirements 2.6, 3.8

describe('Property 6: Minimize-then-restore is a round trip for any Window', () => {
  /**
   * **Validates: Requirements 2.6, 3.8**
   */
  test.prop([
    contentTypeArb,
    fc.integer({ min: 0, max: 1000 }),  // x
    fc.integer({ min: 0, max: 1000 }),  // y
    fc.integer({ min: 320, max: 2000 }), // width
    fc.integer({ min: 240, max: 2000 }), // height
  ])(
    'MINIMIZE then RESTORE returns window to exact original position and size',
    (contentType, x, y, width, height) => {
      const state = stateWithWindow(contentType, { x, y, width, height });
      const id = state.windows[0].id;

      const minimized = windowManagerReducer(state, { type: 'MINIMIZE_WINDOW', id });
      const restored = windowManagerReducer(minimized, { type: 'RESTORE_WINDOW', id });

      const w = restored.windows.find((win) => win.id === id)!;
      expect(w.x).toBe(x);
      expect(w.y).toBe(y);
      expect(w.width).toBe(width);
      expect(w.height).toBe(height);
      expect(w.isOpen).toBe(true);
      expect(w.isMinimized).toBe(false);
    },
  );
});

// ─── Property 9 ──────────────────────────────────────────────────────────────
// Resize enforces minimum dimensions for any resize delta
// Validates: Requirements 3.3, 3.13

describe('Property 9: Resize enforces minimum dimensions for any resize delta', () => {
  /**
   * **Validates: Requirements 3.3, 3.13**
   */
  test.prop([
    contentTypeArb,
    fc.integer({ min: 320, max: 2000 }), // initial width
    fc.integer({ min: 240, max: 2000 }), // initial height
    fc.integer({ min: -5000, max: 5000 }), // dw
    fc.integer({ min: -5000, max: 5000 }), // dh
  ])(
    'RESIZE_WINDOW always produces width ≥ 320 and height ≥ 240',
    (contentType, initWidth, initHeight, dw, dh) => {
      const state = stateWithWindow(contentType, { width: initWidth, height: initHeight });
      const id = state.windows[0].id;

      const next = windowManagerReducer(state, { type: 'RESIZE_WINDOW', id, dw, dh });
      const w = next.windows.find((win) => win.id === id)!;

      expect(w.width).toBeGreaterThanOrEqual(320);
      expect(w.height).toBeGreaterThanOrEqual(240);
    },
  );
});

// ─── Property 10 ─────────────────────────────────────────────────────────────
// Drag updates position by the exact clamped drag delta
// Validates: Requirements 3.4, 3.11

describe('Property 10: Drag updates position by the exact clamped drag delta', () => {
  /**
   * **Validates: Requirements 3.4, 3.11**
   */
  test.prop([
    contentTypeArb,
    fc.integer({ min: 0, max: 800 }), // initial x
    fc.integer({ min: 0, max: 600 }), // initial y
    fc.integer({ min: 320, max: 800 }), // width
    fc.integer({ min: 240, max: 600 }), // height
    fc.integer({ min: -2000, max: 2000 }), // dx
    fc.integer({ min: -2000, max: 2000 }), // dy
    viewportArb,
  ])(
    'DRAG_WINDOW position equals clamped(x+dx, y+dy)',
    (contentType, x0, y0, width, height, dx, dy, { vw, vh, dockHeight }) => {
      const state = stateWithWindow(contentType, { x: x0, y: y0, width, height });
      const id = state.windows[0].id;

      const next = windowManagerReducer(state, {
        type: 'DRAG_WINDOW',
        id,
        dx,
        dy,
        viewportWidth: vw,
        viewportHeight: vh,
        dockHeight,
      });
      const w = next.windows.find((win) => win.id === id)!;

      // Expected clamped position
      const TITLE_BAR_HEIGHT = 40;
      const expectedX = Math.min(Math.max(x0 + dx, 0), Math.max(0, vw - width));
      const expectedY = Math.min(
        Math.max(y0 + dy, 0),
        Math.max(0, vh - dockHeight - TITLE_BAR_HEIGHT),
      );

      expect(w.x).toBe(expectedX);
      expect(w.y).toBe(expectedY);
    },
  );
});

// ─── Property 11 ─────────────────────────────────────────────────────────────
// Maximize-then-restore is a round trip for any Window
// Validates: Requirements 3.9, 3.10

describe('Property 11: Maximize-then-restore is a round trip for any Window', () => {
  /**
   * **Validates: Requirements 3.9, 3.10**
   */
  test.prop([
    contentTypeArb,
    fc.integer({ min: 0, max: 800 }),  // x
    fc.integer({ min: 0, max: 600 }),  // y
    fc.integer({ min: 320, max: 1200 }), // width
    fc.integer({ min: 240, max: 900 }),  // height
    viewportArb,
  ])(
    'MAXIMIZE then RESTORE_MAX_WINDOW returns exact pre-maximize rect',
    (contentType, x, y, width, height, { vw, vh, dockHeight }) => {
      const state = stateWithWindow(contentType, { x, y, width, height });
      const id = state.windows[0].id;

      const maximized = windowManagerReducer(state, {
        type: 'MAXIMIZE_WINDOW',
        id,
        viewportWidth: vw,
        viewportHeight: vh,
        dockHeight,
      });

      const maxWin = maximized.windows.find((w) => w.id === id)!;
      expect(maxWin.isMaximized).toBe(true);
      expect(maxWin.x).toBe(0);
      expect(maxWin.y).toBe(0);
      expect(maxWin.width).toBe(vw);
      expect(maxWin.height).toBe(vh - dockHeight);

      const restored = windowManagerReducer(maximized, { type: 'RESTORE_MAX_WINDOW', id });
      const restoredWin = restored.windows.find((w) => w.id === id)!;

      expect(restoredWin.x).toBe(x);
      expect(restoredWin.y).toBe(y);
      expect(restoredWin.width).toBe(width);
      expect(restoredWin.height).toBe(height);
      expect(restoredWin.isMaximized).toBe(false);
      expect(restoredWin.preMaximizedRect).toBeNull();
    },
  );
});
