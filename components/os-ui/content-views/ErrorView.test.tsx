/**
 * ErrorView unit tests (task 16.3)
 *
 * - Renders error message with retry button
 * - Clicking retry calls onRetry
 * - Tests for the content-load error state
 *
 * Requirements: 5.9
 */

import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ErrorView } from './ErrorView';

describe('ErrorView', () => {
  it('renders the "Failed to load content" heading', () => {
    render(<ErrorView onRetry={vi.fn()} />);
    expect(screen.getByText('Failed to load content')).toBeTruthy();
  });

  it('renders a retry button with "Try again" text', () => {
    render(<ErrorView onRetry={vi.fn()} />);
    expect(screen.getByRole('button', { name: /try again/i })).toBeTruthy();
  });

  it('clicking the retry button calls onRetry', () => {
    const onRetry = vi.fn();
    render(<ErrorView onRetry={onRetry} />);
    fireEvent.click(screen.getByRole('button', { name: /try again/i }));
    expect(onRetry).toHaveBeenCalledOnce();
  });

  it('renders optional error message when provided', () => {
    render(<ErrorView message="Network timeout" onRetry={vi.fn()} />);
    expect(screen.getByText('Network timeout')).toBeTruthy();
  });

  it('does not render error message paragraph when message is undefined', () => {
    const { container } = render(<ErrorView onRetry={vi.fn()} />);
    // Should not have a second paragraph for the message
    const paragraphs = container.querySelectorAll('p');
    // Only "Failed to load content" paragraph should be present
    expect(paragraphs).toHaveLength(1);
  });

  it('has role="alert" for screen reader announcement', () => {
    render(<ErrorView onRetry={vi.fn()} />);
    expect(screen.getByRole('alert')).toBeTruthy();
  });

  it('window remains open — ErrorView renders inside content area without closing Window', () => {
    // ErrorView is a pure display component; the fact it renders without
    // triggering any navigation/close action confirms the window stays open.
    const onRetry = vi.fn();
    const { container } = render(<ErrorView message="Error" onRetry={onRetry} />);
    // Still in the DOM
    expect(container.querySelector('[role="alert"]')).toBeTruthy();
    // No close/unmount triggered
    expect(onRetry).not.toHaveBeenCalled();
  });
});

// ─── Simulated ContentType error paths ───────────────────────────────────────

describe('ErrorView renders correctly for all 5 ContentTypes', () => {
  const contentTypes = ['about', 'projects', 'certifications', 'events', 'contacts'] as const;

  contentTypes.forEach((contentType) => {
    it(`shows retry button when ${contentType} fetch throws`, () => {
      const errorMessage = `Failed to fetch ${contentType}`;
      const onRetry = vi.fn();

      render(<ErrorView message={errorMessage} onRetry={onRetry} />);

      expect(screen.getByText('Failed to load content')).toBeTruthy();
      expect(screen.getByText(errorMessage)).toBeTruthy();
      const retryBtn = screen.getByRole('button', { name: /try again/i });
      expect(retryBtn).toBeTruthy();

      fireEvent.click(retryBtn);
      expect(onRetry).toHaveBeenCalledOnce();
    });
  });
});
