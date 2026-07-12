/**
 * Wallpaper tests
 *
 * Task 8.3 — Property test: Property 1 — Wallpaper orb animation durations within [6000ms, 20000ms]
 * Validates: Requirements 1.2
 */

import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import { Wallpaper } from './Wallpaper';

/**
 * Parse an animationDuration CSS value (e.g. "8s", "500ms") into milliseconds.
 */
function parseDurationMs(value: string): number {
  const trimmed = value.trim();
  if (trimmed.endsWith('ms')) {
    return parseFloat(trimmed);
  }
  if (trimmed.endsWith('s')) {
    return parseFloat(trimmed) * 1000;
  }
  return NaN;
}

/**
 * Property 1: Wallpaper orb animation durations are within range [6000ms, 20000ms]
 *
 * Validates: Requirements 1.2
 */
describe('Wallpaper', () => {
  it('renders 4 orb elements with class wallpaper-orb', () => {
    const { container } = render(<Wallpaper />);
    const orbs = container.querySelectorAll('.wallpaper-orb');
    expect(orbs).toHaveLength(4);
  });

  it('Property 1 — each orb animationDuration is within [6000ms, 20000ms]', () => {
    const { container } = render(<Wallpaper />);
    const orbs = container.querySelectorAll<HTMLElement>('.wallpaper-orb');

    expect(orbs.length).toBeGreaterThan(0);

    orbs.forEach((orb, index) => {
      const rawDuration = orb.style.animationDuration;
      expect(rawDuration, `orb ${index} should have an animationDuration`).toBeTruthy();

      const ms = parseDurationMs(rawDuration);
      expect(
        isNaN(ms),
        `orb ${index} animationDuration "${rawDuration}" should be parseable`
      ).toBe(false);

      expect(
        ms,
        `orb ${index} animationDuration ${ms}ms should be ≥ 6000ms`
      ).toBeGreaterThanOrEqual(6000);

      expect(
        ms,
        `orb ${index} animationDuration ${ms}ms should be ≤ 20000ms`
      ).toBeLessThanOrEqual(20000);
    });
  });

  it('each orb uses the orbFloat animation name', () => {
    const { container } = render(<Wallpaper />);
    const orbs = container.querySelectorAll<HTMLElement>('.wallpaper-orb');

    orbs.forEach((orb, index) => {
      expect(
        orb.style.animationName,
        `orb ${index} animationName should be "orbFloat"`
      ).toBe('orbFloat');
    });
  });

  it('each orb uses ease-in-out timing, infinite iteration, and alternate direction', () => {
    const { container } = render(<Wallpaper />);
    const orbs = container.querySelectorAll<HTMLElement>('.wallpaper-orb');

    orbs.forEach((orb, index) => {
      expect(orb.style.animationTimingFunction, `orb ${index} timingFunction`).toBe('ease-in-out');
      expect(orb.style.animationIterationCount, `orb ${index} iterationCount`).toBe('infinite');
      expect(orb.style.animationDirection, `orb ${index} direction`).toBe('alternate');
    });
  });

  it('each orb has explicit width and height', () => {
    const { container } = render(<Wallpaper />);
    const orbs = container.querySelectorAll<HTMLElement>('.wallpaper-orb');

    orbs.forEach((orb, index) => {
      // jsdom stores numeric styles as "Npx"
      const widthVal = parseFloat(orb.style.width);
      const heightVal = parseFloat(orb.style.height);
      expect(widthVal, `orb ${index} width should be > 0`).toBeGreaterThan(0);
      expect(heightVal, `orb ${index} height should be > 0`).toBeGreaterThan(0);
    });
  });
});
