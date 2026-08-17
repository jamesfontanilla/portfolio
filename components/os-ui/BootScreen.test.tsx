/**
 * Tests for BootScreen component.
 *
 * Property 21: Boot Screen name fallback chain is correct for any name value.
 * Property 22: Boot Screen not shown when boot-shown key exists.
 * Unit test: Boot Screen timing lifecycle.
 *
 * Requirements: 7.1, 7.2, 7.3, 7.4, 7.5
 */

import React from 'react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { test, fc } from '@fast-check/vitest';
import { render, screen, act } from '@testing-library/react';
import { BootScreen } from './BootScreen';

// ─── Mock useReducedMotion ────────────────────────────────────────────────────

vi.mock('@/hooks/useReducedMotion', () => ({
  useReducedMotion: vi.fn(() => false),
}));

import { useReducedMotion } from '@/hooks/useReducedMotion';
const mockUseReducedMotion = vi.mocked(useReducedMotion);

// ─── Mock WAAPI animate ───────────────────────────────────────────────────────

function mockAnimate() {
  let onfinish: (() => void) | null = null;
  const animation = {
    onfinish: null as (() => void) | null,
    cancel: vi.fn(),
    // Simulate the animation finishing synchronously when tests call flush()
    _finish() {
      if (this.onfinish) this.onfinish();
    },
  };
  // Make onfinish a setter so assignments to animation.onfinish are captured
  Object.defineProperty(animation, 'onfinish', {
    set(fn) { onfinish = fn; },
    get() { return onfinish; },
  });
  return animation;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function clearBootShown() {
  sessionStorage.removeItem('boot-shown');
}

function setBootShown() {
  sessionStorage.setItem('boot-shown', '1');
}

// ─── Property 21: name fallback chain ────────────────────────────────────────

describe('Property 21: Boot Screen name fallback chain', () => {
  beforeEach(() => {
    clearBootShown();
    mockUseReducedMotion.mockReturnValue(true); // skip animation for these tests
  });

  afterEach(() => {
    clearBootShown();
    vi.clearAllMocks();
  });

  it('shows full name when name is provided', () => {
    // With reducedMotion=true, BootScreen immediately writes boot-shown and renders null.
    // We need to test the fallback logic in isolation.
    // Instead, render with reducedMotion=false and check text content before fade-out.
    mockUseReducedMotion.mockReturnValue(false);

    const animSpy = vi.spyOn(HTMLElement.prototype, 'animate').mockReturnValue({
      onfinish: null,
      cancel: vi.fn(),
    } as unknown as Animation);

    render(<BootScreen name="James Fontanilla" />);
    expect(screen.getByText('James Fontanilla')).toBeTruthy();

    animSpy.mockRestore();
  });

  it('shows the portfolio mark above the boot name', () => {
    mockUseReducedMotion.mockReturnValue(false);
    const animSpy = vi.spyOn(HTMLElement.prototype, 'animate').mockReturnValue({
      onfinish: null,
      cancel: vi.fn(),
    } as unknown as Animation);

    render(<BootScreen name="James Fontanilla" />);

    const mark = screen.getByRole('img', { name: 'James Fontanilla portfolio mark' });
    expect(mark.getAttribute('src')).toBe('/icon.svg');

    animSpy.mockRestore();
  });

  it('shows em-dash when name is empty string', () => {
    mockUseReducedMotion.mockReturnValue(false);
    const animSpy = vi.spyOn(HTMLElement.prototype, 'animate').mockReturnValue({
      onfinish: null,
      cancel: vi.fn(),
    } as unknown as Animation);

    render(<BootScreen name="" />);
    expect(screen.getByText('—')).toBeTruthy();

    animSpy.mockRestore();
  });

  it('shows em-dash when name is undefined', () => {
    mockUseReducedMotion.mockReturnValue(false);
    const animSpy = vi.spyOn(HTMLElement.prototype, 'animate').mockReturnValue({
      onfinish: null,
      cancel: vi.fn(),
    } as unknown as Animation);

    render(<BootScreen />);
    expect(screen.getByText('—')).toBeTruthy();

    animSpy.mockRestore();
  });

  it('shows em-dash when name is whitespace only', () => {
    mockUseReducedMotion.mockReturnValue(false);
    const animSpy = vi.spyOn(HTMLElement.prototype, 'animate').mockReturnValue({
      onfinish: null,
      cancel: vi.fn(),
    } as unknown as Animation);

    render(<BootScreen name="   " />);
    expect(screen.getByText('—')).toBeTruthy();

    animSpy.mockRestore();
  });

  /**
   * Property 21: for any non-empty name, the BootScreen renders that name.
   * For any empty/undefined name, the BootScreen renders an em-dash.
   */
  test.prop([fc.string()])(
    'renders name when non-empty, em-dash when empty/whitespace',
    (name) => {
      mockUseReducedMotion.mockReturnValue(false);
      const animSpy = vi.spyOn(HTMLElement.prototype, 'animate').mockReturnValue({
        onfinish: null,
        cancel: vi.fn(),
      } as unknown as Animation);

      const { container, unmount } = render(<BootScreen name={name} />);

      const trimmed = name.trim();
      const text = container.textContent ?? '';
      if (trimmed.length > 0) {
        expect(text).toContain(trimmed);
      } else {
        expect(text).toContain('—');
      }

      unmount();
      animSpy.mockRestore();
      clearBootShown();
    },
  );
});

// ─── Property 22: not shown when boot-shown key exists ───────────────────────

describe('Property 22: Boot Screen not shown when boot-shown key exists', () => {
  beforeEach(() => {
    setBootShown();
    mockUseReducedMotion.mockReturnValue(false);
  });

  afterEach(() => {
    clearBootShown();
    vi.clearAllMocks();
  });

  it('renders null when boot-shown is in sessionStorage', () => {
    const { container } = render(<BootScreen name="Test User" />);
    // Should render nothing
    expect(container.firstChild).toBeNull();
  });

  test.prop([fc.string()])(
    'renders null for any name when boot-shown key exists',
    (name) => {
      const { container, unmount } = render(<BootScreen name={name} />);
      expect(container.firstChild).toBeNull();
      unmount();
    },
  );
});

// ─── Unit test: timing lifecycle ─────────────────────────────────────────────

describe('Boot Screen timing lifecycle', () => {
  beforeEach(() => {
    clearBootShown();
    mockUseReducedMotion.mockReturnValue(false);
    vi.useFakeTimers();
  });

  afterEach(() => {
    clearBootShown();
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it('is visible immediately after mount with empty sessionStorage', () => {
    const animSpy = vi.spyOn(HTMLElement.prototype, 'animate').mockReturnValue({
      onfinish: null,
      cancel: vi.fn(),
    } as unknown as Animation);

    render(<BootScreen name="Test" />);
    expect(screen.getByRole('status')).toBeTruthy();

    animSpy.mockRestore();
  });

  it('writes boot-shown and removes overlay after 2500ms + 300ms', async () => {
    let fadeOutOnFinish: (() => void) | undefined;

    const animSpy = vi.spyOn(HTMLElement.prototype, 'animate').mockImplementation(
      (keyframes, options) => {
        const opts = options as KeyframeAnimationOptions;
        const anim = {
          cancel: vi.fn(),
          set onfinish(fn: (() => void) | null) {
            if (fn && opts?.duration === 300 && Array.isArray(keyframes) &&
                (keyframes as Keyframe[])[0]?.opacity === 1) {
              // This is the fade-out animation
              fadeOutOnFinish = fn;
            }
          },
          get onfinish() { return null; },
        };
        return anim as unknown as Animation;
      },
    );

    render(<BootScreen name="Test" />);

    // Overlay should be visible
    expect(screen.getByRole('status')).toBeTruthy();
    expect(sessionStorage.getItem('boot-shown')).toBeNull();

    // Advance past the hold timer (2200ms) to trigger fade-out
    await act(async () => {
      vi.advanceTimersByTime(2200);
    });

    // Simulate fade-out animation completing
    await act(async () => {
      if (fadeOutOnFinish) fadeOutOnFinish();
    });

    // Now boot-shown should be written and overlay gone
    expect(sessionStorage.getItem('boot-shown')).toBe('1');
    expect(screen.queryByRole('status')).toBeNull();

    animSpy.mockRestore();
  });

  it('skips animation and writes boot-shown immediately under reduced-motion', () => {
    mockUseReducedMotion.mockReturnValue(true);

    const { container } = render(<BootScreen name="Test" />);

    expect(container.firstChild).toBeNull();
    expect(sessionStorage.getItem('boot-shown')).toBe('1');
  });
});
