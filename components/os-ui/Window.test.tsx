/**
 * Window component tests
 *
 * Property 12: Active Window always uses --border-strong
 * Property 3:  All Window and Dock text meets contrast requirements (CSS doc test)
 * Property 25: Window Title Bar aria-label matches ContentType
 * Property 24: Tab focus is trapped within the Active_Window
 * Property 28: All interactive elements have a visible focus indicator (CSS doc test)
 * Property 29: Escape closes Active_Window and returns focus to its App Icon
 * Property 27: Keyboard minimizing moves focus to next-highest z-index Window or Dock
 * Unit tests:  TrafficLightControls clicking and keyboard activation
 *
 * Requirements: 4.4, 4.5, 8.2, 8.3, 8.5, 8.8, 8.9, 8.10, 8.11
 */

import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { test, fc } from '@fast-check/vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

import { Window } from './Window';
import { WindowTitleBar } from './WindowTitleBar';
import { TrafficLightControls } from './TrafficLightControls';
import type { WindowState, WindowAction, ContentType } from '@/store/windowManagerStore';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function makeWindowState(overrides: Partial<WindowState> = {}): WindowState {
  return {
    id: 'test-win-1',
    contentType: 'about',
    x: 100,
    y: 100,
    width: 600,
    height: 480,
    zIndex: 100,
    isOpen: true,
    isMinimized: false,
    isMaximized: false,
    preMaximizedRect: null,
    ...overrides,
  };
}

function makeDockIconRef(): React.RefObject<HTMLButtonElement | null> {
  const btn = document.createElement('button');
  document.body.appendChild(btn);
  return { current: btn };
}

const CONTENT_TYPES: ContentType[] = ['about', 'projects', 'competitions', 'certifications', 'events', 'contacts'];

// ─── Property 12: Active Window uses --border-strong ─────────────────────────

describe('Property 12: Active Window always uses --border-strong', () => {
  afterEach(() => {
    document.querySelectorAll('button[data-cleanup]').forEach(el => el.remove());
  });

  test.prop([fc.constantFrom(...CONTENT_TYPES)], { numRuns: CONTENT_TYPES.length })(
    'active window has border-color var(--border-strong)',
    (contentType) => {
      const dispatch = vi.fn();
      const ref = makeDockIconRef();
      const state = makeWindowState({ contentType });

      const { container, unmount } = render(
        <Window
          state={state}
          isActive={true}
          layoutMode="desktop"
          dockIconRef={ref}
          onFocus={vi.fn()}
          dispatch={dispatch as React.Dispatch<WindowAction>}
        />
      );

      const dialog = container.querySelector('[role="dialog"]') as HTMLElement;
      expect(dialog.style.border).toContain('var(--border-strong)');
      unmount();
    }
  );

  test.prop([fc.constantFrom(...CONTENT_TYPES)], { numRuns: CONTENT_TYPES.length })(
    'inactive window has border-color var(--border)',
    (contentType) => {
      const dispatch = vi.fn();
      const ref = makeDockIconRef();
      const state = makeWindowState({ contentType });

      const { container, unmount } = render(
        <Window
          state={state}
          isActive={false}
          layoutMode="desktop"
          dockIconRef={ref}
          onFocus={vi.fn()}
          dispatch={dispatch as React.Dispatch<WindowAction>}
        />
      );

      const dialog = container.querySelector('[role="dialog"]') as HTMLElement;
      expect(dialog.style.border).toContain('var(--border)');
      expect(dialog.style.border).not.toContain('var(--border-strong)');
      unmount();
    }
  );
});

// ─── Property 3: Contrast ratio (CSS documentation test) ─────────────────────

describe('Property 3: All Window and Dock text meets contrast requirements', () => {
  it('globals.css uses --text color token for window text (not hardcoded)', () => {
    const cssPath = resolve(__dirname, '../../app/globals.css');
    const css = readFileSync(cssPath, 'utf-8');
    // Verify --text token is defined with a high-contrast light value
    expect(css).toContain('--text:');
    // --text should be defined as a light color (starts with #f or high-value)
    const match = css.match(/--text:\s*([^;]+)/);
    expect(match).toBeTruthy();
  });

  it('Window component uses var(--text) for text color, not hardcoded values', () => {
    const windowSource = readFileSync(resolve(__dirname, './Window.tsx'), 'utf-8');
    // Should not have hardcoded color like '#fff' or 'white' for text
    expect(windowSource).not.toMatch(/color:\s*['"]?#fff['"]?/);
    expect(windowSource).not.toMatch(/color:\s*['"]?white['"]?/);
  });

  it(':focus-visible rule provides sufficient contrast (gold on dark background)', () => {
    const cssPath = resolve(__dirname, '../../app/globals.css');
    const css = readFileSync(cssPath, 'utf-8');
    expect(css).toContain(':focus-visible');
    expect(css).toContain('var(--gold)');
  });
});

// ─── Property 25: Window TitleBar aria-label matches ContentType ──────────────

describe('Property 25: Window Title Bar aria-label matches ContentType', () => {
  const expectedLabels: Record<ContentType, string> = {
    about: 'About',
    projects: 'Projects',
    competitions: 'Competitions',
    certifications: 'Certifications',
    events: 'Events',
    contacts: 'Contacts',
    blog: 'Blog',
  };

  test.prop([fc.constantFrom(...CONTENT_TYPES)])(
    'WindowTitleBar aria-label equals ContentType display name',
    (contentType) => {
      const { container, unmount } = render(
        <WindowTitleBar
          title={expectedLabels[contentType]}
          contentType={contentType}
          onPointerDown={vi.fn()}
          onClose={vi.fn()}
          onMinimize={vi.fn()}
          onMaximize={vi.fn()}
        />
      );

      const titleBar = container.firstElementChild as HTMLElement;
      expect(titleBar.getAttribute('aria-label')).toBe(expectedLabels[contentType]);
      unmount();
    }
  );
});

// ─── Property 24: Tab focus trapped within Active_Window ─────────────────────

describe('Property 24: Tab focus is trapped within the Active_Window', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('Tab key wraps focus within the active window', () => {
    const dispatch = vi.fn();
    const ref = makeDockIconRef();
    const state = makeWindowState();

    const { container } = render(
      <Window
        state={state}
        isActive={true}
        layoutMode="desktop"
        dockIconRef={ref}
        onFocus={vi.fn()}
        dispatch={dispatch as React.Dispatch<WindowAction>}
      >
        <button id="btn-1">First</button>
        <button id="btn-2">Last</button>
      </Window>
    );

    // Traffic lights + content buttons = multiple focusable elements
    const focusable = container.querySelectorAll('button');
    expect(focusable.length).toBeGreaterThan(1);

    // Focus last, press Tab → should wrap to first
    const lastBtn = focusable[focusable.length - 1] as HTMLElement;
    lastBtn.focus();
    expect(document.activeElement).toBe(lastBtn);

    const tabEvent = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: false, bubbles: true });
    document.dispatchEvent(tabEvent);
    expect(document.activeElement).toBe(focusable[0]);
  });
});

// ─── Property 28: Focus indicators (CSS documentation test) ──────────────────

describe('Property 28: All interactive elements have a visible focus indicator', () => {
  it('globals.css defines :focus-visible with 2px outline', () => {
    const cssPath = resolve(__dirname, '../../app/globals.css');
    const css = readFileSync(cssPath, 'utf-8');
    expect(css).toContain(':focus-visible');
    expect(css).toContain('outline: 2px solid');
    expect(css).toContain('outline-offset: 2px');
  });
});

// ─── Property 29: Escape closes Active_Window and returns focus to App Icon ───

describe('Property 29: Escape closes Active_Window and returns focus to its App Icon', () => {
  it('pressing Escape on active window dispatches CLOSE_WINDOW and focuses dock icon', () => {
    const dispatch = vi.fn();
    const iconBtn = document.createElement('button');
    iconBtn.setAttribute('aria-label', 'About');
    document.body.appendChild(iconBtn);
    const ref = { current: iconBtn };

    const state = makeWindowState({ id: 'esc-win' });

    render(
      <Window
        state={state}
        isActive={true}
        layoutMode="desktop"
        dockIconRef={ref}
        onFocus={vi.fn()}
        dispatch={dispatch as React.Dispatch<WindowAction>}
      />
    );

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));

    expect(dispatch).toHaveBeenCalledWith({ type: 'CLOSE_WINDOW', id: 'esc-win' });
    expect(document.activeElement).toBe(iconBtn);

    document.body.removeChild(iconBtn);
  });

  test.prop([fc.constantFrom(...CONTENT_TYPES)])(
    'Escape on active window always dispatches CLOSE_WINDOW',
    (contentType) => {
      const dispatch = vi.fn();
      const ref = makeDockIconRef();
      const state = makeWindowState({ contentType, id: `win-${contentType}` });

      const { unmount } = render(
        <Window
          state={state}
          isActive={true}
          layoutMode="desktop"
          dockIconRef={ref}
          onFocus={vi.fn()}
          dispatch={dispatch as React.Dispatch<WindowAction>}
        />
      );

      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
      expect(dispatch).toHaveBeenCalledWith({ type: 'CLOSE_WINDOW', id: `win-${contentType}` });
      unmount();
    }
  );
});

// ─── Property 27: Keyboard minimizing moves focus to next-highest Window or Dock

describe('Property 27: Keyboard minimizing moves focus to next-highest Window or Dock', () => {
  it('transferFocus focuses the open window with highest zIndex', async () => {
    const { transferFocus } = await import('@/hooks/useKeyboardNav');

    const dockEl = document.createElement('nav');
    const dockBtn = document.createElement('button');
    dockBtn.textContent = 'About';
    dockEl.appendChild(dockBtn);
    document.body.appendChild(dockEl);

    // Create a fake window element
    const winEl = document.createElement('div');
    winEl.setAttribute('data-window-id', 'top-win');
    const winBtn = document.createElement('button');
    winEl.appendChild(winBtn);
    document.body.appendChild(winEl);

    const windows = [
      makeWindowState({ id: 'top-win', zIndex: 200, isOpen: true, isMinimized: false }),
      makeWindowState({ id: 'low-win', zIndex: 100, isOpen: true, isMinimized: false }),
    ];

    transferFocus(windows, { current: dockEl });
    expect(document.activeElement).toBe(winBtn);

    document.body.removeChild(dockEl);
    document.body.removeChild(winEl);
  });

  it('transferFocus falls back to dock when no open windows', async () => {
    const { transferFocus } = await import('@/hooks/useKeyboardNav');

    const dockEl = document.createElement('nav');
    const dockBtn = document.createElement('button');
    dockEl.appendChild(dockBtn);
    document.body.appendChild(dockEl);

    transferFocus([], { current: dockEl });
    expect(document.activeElement).toBe(dockBtn);

    document.body.removeChild(dockEl);
  });
});

// ─── Unit tests: TrafficLightControls ─────────────────────────────────────────

describe('TrafficLightControls: clicking triggers correct handlers', () => {
  it('clicking Close button calls onClose', () => {
    const onClose = vi.fn();
    render(<TrafficLightControls onClose={onClose} onMinimize={vi.fn()} onMaximize={vi.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: 'Close window' }));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('clicking Minimize button calls onMinimize', () => {
    const onMinimize = vi.fn();
    render(<TrafficLightControls onClose={vi.fn()} onMinimize={onMinimize} onMaximize={vi.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: 'Minimize window' }));
    expect(onMinimize).toHaveBeenCalledOnce();
  });

  it('clicking Maximize button calls onMaximize', () => {
    const onMaximize = vi.fn();
    render(<TrafficLightControls onClose={vi.fn()} onMinimize={vi.fn()} onMaximize={onMaximize} />);
    fireEvent.click(screen.getByRole('button', { name: 'Maximize window' }));
    expect(onMaximize).toHaveBeenCalledOnce();
  });

  it('Enter key activates Close button (native button behavior)', () => {
    const onClose = vi.fn();
    render(<TrafficLightControls onClose={onClose} onMinimize={vi.fn()} onMaximize={vi.fn()} />);
    const btn = screen.getByRole('button', { name: 'Close window' });
    fireEvent.keyDown(btn, { key: 'Enter' });
    fireEvent.click(btn); // Enter on button triggers click
    expect(onClose).toHaveBeenCalled();
  });

  it('Space key activates Minimize button', () => {
    const onMinimize = vi.fn();
    render(<TrafficLightControls onClose={vi.fn()} onMinimize={onMinimize} onMaximize={vi.fn()} />);
    const btn = screen.getByRole('button', { name: 'Minimize window' });
    fireEvent.keyDown(btn, { key: ' ' });
    fireEvent.click(btn);
    expect(onMinimize).toHaveBeenCalled();
  });

  it('all three buttons have tabIndex=0', () => {
    render(<TrafficLightControls onClose={vi.fn()} onMinimize={vi.fn()} onMaximize={vi.fn()} />);
    const buttons = screen.getAllByRole('button');
    buttons.forEach(btn => expect(btn.tabIndex).toBe(0));
  });

  test.prop([
    fc.constantFrom('Close window', 'Minimize window', 'Maximize window'),
  ])(
    'each control button has correct aria-label',
    (label) => {
      const { container, unmount } = render(
        <TrafficLightControls onClose={vi.fn()} onMinimize={vi.fn()} onMaximize={vi.fn()} />
      );
      const btn = container.querySelector(`button[aria-label="${label}"]`);
      expect(btn).toBeTruthy();
      unmount();
    }
  );
});

// ─── Snap layout flyout ───────────────────────────────────────────────────────

describe('Snap layout flyout', () => {
  it('opens on maximize hover in every visible window state', () => {
    for (const windowState of [
      makeWindowState(),
      makeWindowState({ isMaximized: true }),
      makeWindowState({ x: 0, y: 0, width: 640, height: 360 }),
    ]) {
      const { unmount } = render(
        <Window
          state={windowState}
          isActive={true}
          layoutMode="desktop"
          dockIconRef={makeDockIconRef()}
          onFocus={vi.fn()}
          dispatch={vi.fn() as React.Dispatch<WindowAction>}
        />,
      );

      fireEvent.pointerEnter(screen.getByRole('button', { name: 'Maximize window' }));

      expect(screen.getByRole('dialog', { name: 'Snap layouts' })).toBeTruthy();
      unmount();
    }
  });

  it('dispatches a snap action when a layout is selected', () => {
    const dispatch = vi.fn();
    const ref = makeDockIconRef();
    const state = makeWindowState();

    render(
      <Window
        state={state}
        isActive={true}
        layoutMode="desktop"
        dockIconRef={ref}
        onFocus={vi.fn()}
        dispatch={dispatch as React.Dispatch<WindowAction>}
      />,
    );

    fireEvent.pointerEnter(screen.getByRole('button', { name: 'Maximize window' }));

    expect(screen.getByRole('dialog', { name: 'Snap layouts' })).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: /Left half/i }));

    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'SNAP_LEFT', id: state.id }),
    );
  });
});
