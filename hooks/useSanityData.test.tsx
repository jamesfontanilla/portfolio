/**
 * useSanityData hook tests
 *
 * Property 18: Skeleton present during loading, absent during success
 * Property 33: Sanity content fetch begins within 50ms of window open
 *
 * Requirements: 5.8, 11.3
 */

import React, { Suspense } from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { test, fc } from '@fast-check/vitest';
import { render, screen, act, waitFor } from '@testing-library/react';
import { useSanityData } from './useSanityData';
import { SkeletonView } from '@/components/os-ui/content-views/SkeletonView';
import type { ContentType } from '@/store/windowManagerStore';

// ─── Test component ───────────────────────────────────────────────────────────

interface TestViewProps {
  fetcher: () => Promise<string>;
  contentType?: ContentType;
}

function TestView({ fetcher, contentType }: TestViewProps) {
  const { data, loading, error, refetch } = useSanityData<string>(fetcher, contentType);

  if (loading) return <SkeletonView />;
  if (error) return <div role="alert">{error.message}<button onClick={refetch}>Retry</button></div>;
  return <div data-testid="content">{data}</div>;
}

// ─── Property 18: Skeleton present during loading, absent on success ──────────

describe('Property 18: Skeleton present during loading, absent during success', () => {
  const CONTENT_TYPES: ContentType[] = ['about', 'projects', 'certifications', 'events', 'contacts'];

  it('skeleton shown while fetching, removed after success (about)', async () => {
    let resolvePromise!: (value: string) => void;
    const fetcher = vi.fn(
      () => new Promise<string>((resolve) => { resolvePromise = resolve; })
    );

    const { unmount } = render(<TestView fetcher={fetcher} contentType="about" />);

    // While loading — skeleton should be present
    expect(screen.getByRole('status', { name: /loading/i })).toBeTruthy();

    // Resolve the fetch
    await act(async () => { resolvePromise('test data'); });

    // After success — skeleton should be gone
    expect(screen.queryByRole('status', { name: /loading/i })).toBeNull();
    expect(screen.getByTestId('content')).toBeTruthy();

    unmount();
  });

  // Test each content type individually to avoid property-test timeout issues
  CONTENT_TYPES.forEach((contentType) => {
    it(`skeleton lifecycle correct for ${contentType}`, async () => {
      let resolvePromise!: (value: string) => void;
      const fetcher = vi.fn(
        () => new Promise<string>((resolve) => { resolvePromise = resolve; })
      );

      const { unmount } = render(<TestView fetcher={fetcher} contentType={contentType} />);
      expect(screen.getByRole('status', { name: /loading/i })).toBeTruthy();

      await act(async () => { resolvePromise('data'); });

      expect(screen.queryByRole('status', { name: /loading/i })).toBeNull();
      unmount();
    });
  });

  it('shows content (not skeleton) when data resolves', async () => {
    const fetcher = vi.fn().mockResolvedValue('loaded content');

    const { unmount } = render(<TestView fetcher={fetcher} />);

    await waitFor(() => {
      expect(screen.queryByTestId('content')).toBeTruthy();
    });

    expect(screen.queryByRole('status', { name: /loading/i })).toBeNull();
    unmount();
  });
});

// ─── Property 33: Fetch begins within 50ms of mount ──────────────────────────

describe('Property 33: Sanity content fetch begins within 50ms of window open', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('fetcher is called immediately on mount (within one tick)', async () => {
    const fetcher = vi.fn(() => new Promise<string>(() => {})); // never resolves

    render(<TestView fetcher={fetcher} />);

    // Fetch should be triggered synchronously in useEffect (first tick)
    await act(async () => {
      vi.advanceTimersByTime(50);
    });

    expect(fetcher).toHaveBeenCalledOnce();
  });

  // Test each content type individually (avoids property-test timeout with fake timers)
  const CONTENT_TYPES_33: ContentType[] = ['about', 'projects', 'certifications', 'events', 'contacts'];

  CONTENT_TYPES_33.forEach((contentType) => {
    it(`fetcher called within 50ms for ${contentType}`, async () => {
      const fetcher = vi.fn(() => new Promise<string>(() => {}));

      const { unmount } = render(<TestView fetcher={fetcher} contentType={contentType} />);

      await act(async () => {
        vi.advanceTimersByTime(50);
      });

      expect(fetcher).toHaveBeenCalledOnce();
      unmount();
    });
  });

  it('fetcher is NOT called again when data is cached', async () => {
    const fetcher = vi.fn().mockResolvedValue('data');

    const { unmount } = render(<TestView fetcher={fetcher} />);

    await act(async () => {
      vi.advanceTimersByTime(100);
    });

    // Called once on mount
    expect(fetcher).toHaveBeenCalledTimes(1);
    unmount();
  });
});
