/**
 * Desktop tests
 *
 * Task 8.4 — Property test: Property 2 — Desktop fills any viewport dimension
 * Validates: Requirements 1.4
 */

import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import { fc, test } from '@fast-check/vitest';
import { Desktop } from './Desktop';

describe('Desktop', () => {
  it('renders with class os-desktop', () => {
    const { container } = render(<Desktop />);
    const el = container.firstElementChild as HTMLElement;
    expect(el).not.toBeNull();
    expect(el.classList.contains('os-desktop')).toBe(true);
  });

  it('renders children inside the os-desktop element', () => {
    const { getByText } = render(
      <Desktop>
        <span>hello</span>
      </Desktop>
    );
    expect(getByText('hello')).toBeTruthy();
  });

  it('renders without children', () => {
    const { container } = render(<Desktop />);
    const el = container.firstElementChild as HTMLElement;
    expect(el.children).toHaveLength(0);
  });

  it('has aria-hidden="true" to keep decorative layer out of accessibility tree', () => {
    const { container } = render(<Desktop />);
    const el = container.firstElementChild as HTMLElement;
    expect(el.getAttribute('aria-hidden')).toBe('true');
  });
});

/**
 * Property 2: Desktop fills any viewport dimension.
 *
 * jsdom doesn't compute layout, so we verify the structural property:
 * for any viewport size (width, height), the desktop element always has
 * class `os-desktop`, which maps to `position: fixed; inset: 0` in CSS —
 * meaning it fills the viewport regardless of its dimensions.
 *
 * Validates: Requirements 1.4
 */
describe('Property 2 — Desktop fills any viewport dimension', () => {
  test.prop([
    fc.integer({ min: 1, max: 7680 }),  // width: 1px–8K
    fc.integer({ min: 1, max: 4320 }),  // height: 1px–8K
  ])('has class os-desktop for any viewport size', (width, height) => {
    // Simulate setting the viewport size in jsdom
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: width });
    Object.defineProperty(window, 'innerHeight', { writable: true, configurable: true, value: height });

    const { container } = render(<Desktop />);
    const el = container.firstElementChild as HTMLElement;

    // The class os-desktop is always present — CSS then handles position: fixed; inset: 0
    expect(el.classList.contains('os-desktop')).toBe(true);
  });
});
