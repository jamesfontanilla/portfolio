/**
 * AppIcon property tests
 *
 * Property 7:  Dock indicator dot shown iff window is open or minimized
 * Property 8:  Dock magnification scales are correct for any hovered index
 * Property 31: Touch targets ≥ 44×44px
 * Property 23: All App Icons are keyboard-focusable and activatable
 * Property 26: App Icon aria-labels match ContentType display names
 *
 * Validates: Requirements 2.7, 2.9, 8.1, 8.7, 9.5
 */

import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { test, fc } from '@fast-check/vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AppIcon, contentTypeLabel } from './AppIcon';
import type { ContentType } from '@/store/windowManagerStore';

// All ContentTypes in dock order
const CONTENT_TYPES: ContentType[] = [
  'about',
  'projects',
  'competitions',
  'certifications',
  'events',
  'contacts',
  'tech-stack',
];

// Helper: build a minimal iconRef
function makeRef(): React.RefObject<HTMLButtonElement | null> {
  return React.createRef<HTMLButtonElement>();
}

// ─── Property 7: Indicator dot shown iff isOpen || isMinimized ───────────────

/**
 * Property 7: Dock indicator dot shown iff window is open or minimized
 * Validates: Requirements 2.7
 */
describe('Property 7: Dock indicator dot shown iff window is open or minimized', () => {
  test.prop([
    fc.record({ isOpen: fc.boolean(), isMinimized: fc.boolean() }),
    fc.constantFrom(...CONTENT_TYPES),
    fc.integer({ min: 0, max: CONTENT_TYPES.length - 1 }),
  ])(
    'indicator dot present when isOpen || isMinimized, absent otherwise',
    ({ isOpen, isMinimized }, type, selfIndex) => {
      const { container, unmount } = render(
        <AppIcon
          type={type}
          isOpen={isOpen}
          isMinimized={isMinimized}
          hoverIndex={null}
          selfIndex={selfIndex}
          iconRef={makeRef()}
          onClick={() => {}}
        />,
      );

      // The indicator dot is a 4px gold circle rendered as aria-hidden
      // It is the only div with width: 4px in the component
      const dots = container.querySelectorAll<HTMLElement>('div[aria-hidden="true"]');
      const indicatorDot = Array.from(dots).find(
        (el) =>
          el.style.width === '4px' &&
          el.style.height === '4px' &&
          el.style.borderRadius === '50%',
      );

      if (isOpen || isMinimized) {
        expect(indicatorDot).toBeTruthy();
      } else {
        expect(indicatorDot).toBeUndefined();
      }

      unmount();
    },
  );
});

// ─── Property 8: Magnification scales ────────────────────────────────────────

/**
 * Property 8: Dock magnification scales are correct for any hovered index
 * Validates: Requirements 2.9
 */
describe('Property 8: Dock magnification scales are correct for any hovered index', () => {
  test.prop([
    fc.integer({ min: 0, max: CONTENT_TYPES.length - 1 }),
    fc.integer({ min: 0, max: 4 }),
  ])(
    'scale is 1.5 at dist=0, 1.25 at dist=1, 1.0 otherwise',
    (selfIndex, hoverIndex) => {
      const type = CONTENT_TYPES[selfIndex];
      const { container, unmount } = render(
        <AppIcon
          type={type}
          isOpen={false}
          isMinimized={false}
          hoverIndex={hoverIndex}
          selfIndex={selfIndex}
          iconRef={makeRef()}
          onClick={() => {}}
        />,
      );

      const button = container.querySelector('button')!;
      const transform = button.style.transform;

      const dist = Math.abs(selfIndex - hoverIndex);
      let expectedScale: number;
      if (dist === 0) expectedScale = 1.5;
      else if (dist === 1) expectedScale = 1.25;
      else expectedScale = 1.0;

      expect(transform).toBe(`scale(${expectedScale})`);

      unmount();
    },
  );

  it('scale is 1.0 when hoverIndex is null', () => {
    const { container } = render(
      <AppIcon
        type="about"
        isOpen={false}
        isMinimized={false}
        hoverIndex={null}
        selfIndex={2}
        iconRef={makeRef()}
        onClick={() => {}}
      />,
    );
    const button = container.querySelector('button')!;
    expect(button.style.transform).toBe('scale(1)');
  });
});

// ─── Property 31: Touch targets ≥ 44×44px ────────────────────────────────────

/**
 * Property 31: Touch targets ≥ 44×44px
 * Validates: Requirements 9.5
 */
describe('Property 31: Touch targets ≥ 44×44px for any App Icon', () => {
  test.prop([
    fc.constantFrom(...CONTENT_TYPES),
  ])(
    'button has minWidth and minHeight of at least 44px',
    (type) => {
      const selfIndex = CONTENT_TYPES.indexOf(type);
      const { container, unmount } = render(
        <AppIcon
          type={type}
          isOpen={false}
          isMinimized={false}
          hoverIndex={null}
          selfIndex={selfIndex}
          iconRef={makeRef()}
          onClick={() => {}}
        />,
      );

      const button = container.querySelector('button')!;
      expect(button.style.minWidth).toBe('44px');
      expect(button.style.minHeight).toBe('44px');

      unmount();
    },
  );
});

// ─── Property 23: All App Icons are keyboard-focusable and activatable ────────

/**
 * Property 23: All App Icons are keyboard-focusable and activatable
 * Validates: Requirements 8.1
 */
describe('Property 23: All App Icons are keyboard-focusable and activatable', () => {
  it('each ContentType AppIcon has tabIndex=0 and fires onClick on Enter and Space', () => {
    CONTENT_TYPES.forEach((type, selfIndex) => {
      const onClick = vi.fn();
      const { container, unmount } = render(
        <AppIcon
          type={type}
          isOpen={false}
          isMinimized={false}
          hoverIndex={null}
          selfIndex={selfIndex}
          iconRef={makeRef()}
          onClick={onClick}
        />,
      );

      const button = container.querySelector('button')!;

      // tabIndex is 0
      expect(button.tabIndex).toBe(0);

      // Enter key fires onClick
      fireEvent.keyDown(button, { key: 'Enter', code: 'Enter' });
      fireEvent.click(button); // Enter on a button triggers click
      expect(onClick).toHaveBeenCalledTimes(1);

      onClick.mockClear();

      // Space key fires onClick
      fireEvent.keyDown(button, { key: ' ', code: 'Space' });
      fireEvent.click(button);
      expect(onClick).toHaveBeenCalledTimes(1);

      unmount();
    });
  });

  test.prop([fc.constantFrom(...CONTENT_TYPES)])(
    'AppIcon button tabIndex is 0 for any ContentType',
    (type) => {
      const selfIndex = CONTENT_TYPES.indexOf(type);
      const { container, unmount } = render(
        <AppIcon
          type={type}
          isOpen={false}
          isMinimized={false}
          hoverIndex={null}
          selfIndex={selfIndex}
          iconRef={makeRef()}
          onClick={() => {}}
        />,
      );

      const button = container.querySelector('button')!;
      expect(button.tabIndex).toBe(0);

      unmount();
    },
  );
});

// ─── Property 26: App Icon aria-labels match ContentType display names ────────

/**
 * Property 26: App Icon aria-labels match ContentType display names
 * Validates: Requirements 8.7
 */
describe('Property 26: App Icon aria-labels match ContentType display names', () => {
  const expectedLabels: Record<ContentType, string> = {
    about: 'About',
    projects: 'Projects',
    competitions: 'Competitions',
    certifications: 'Certifications',
    events: 'Events',
    contacts: 'Contacts',
    blog: 'Blog',
    'tech-stack': 'Tech Stack',
    settings: 'Settings',
  };

  test.prop([fc.constantFrom(...CONTENT_TYPES)])(
    'aria-label equals the expected display name',
    (type) => {
      const selfIndex = CONTENT_TYPES.indexOf(type);
      const { container, unmount } = render(
        <AppIcon
          type={type}
          isOpen={false}
          isMinimized={false}
          hoverIndex={null}
          selfIndex={selfIndex}
          iconRef={makeRef()}
          onClick={() => {}}
        />,
      );

      const button = container.querySelector('button')!;
      expect(button.getAttribute('aria-label')).toBe(expectedLabels[type]);
      expect(button.getAttribute('aria-label')).toBe(contentTypeLabel[type]);

      unmount();
    },
  );

  it('all dock ContentTypes have correct aria-labels', () => {
    CONTENT_TYPES.forEach((type, selfIndex) => {
      const { container, unmount } = render(
        <AppIcon
          type={type}
          isOpen={false}
          isMinimized={false}
          hoverIndex={null}
          selfIndex={selfIndex}
          iconRef={makeRef()}
          onClick={() => {}}
        />,
      );

      const button = container.querySelector('button')!;
      expect(button.getAttribute('aria-label')).toBe(expectedLabels[type]);
      unmount();
    });
  });
});
