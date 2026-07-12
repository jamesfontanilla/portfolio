/**
 * useSanityData — generic hook for fetching Sanity content inside Windows.
 *
 * Features:
 *  - Returns { data, loading, error, refetch }
 *  - Checks WindowManagerState.dataCache before fetching (avoids re-fetching)
 *  - Dispatches CACHE_DATA on success
 *  - Sets error state without closing the Window on failure
 *  - Fetch begins within 50ms of component mount (synchronous useEffect)
 *  - Loading state is set synchronously, so skeleton shows within 100ms
 *
 * Requirements: 5.8, 5.9, 11.3
 */

import { useState, useEffect, useCallback, useContext } from 'react';
import { WindowManagerContext } from '@/components/os-ui/OSUIProvider';
import type { ContentType } from '@/store/windowManagerStore';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface UseSanityDataResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * Generic data-fetching hook for Sanity content views.
 *
 * @param fetcher - Async function that fetches the data
 * @param contentType - Optional: if provided, checks/populates the data cache
 */
export function useSanityData<T>(
  fetcher: () => Promise<T>,
  contentType?: ContentType,
): UseSanityDataResult<T> {
  const ctx = useContext(WindowManagerContext);

  // Check cache before initializing loading state
  const cachedData = contentType && ctx
    ? (ctx.state.dataCache[contentType]?.data as T | undefined) ?? null
    : null;

  const [data, setData] = useState<T | null>(cachedData);
  const [loading, setLoading] = useState<boolean>(!cachedData);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await fetcher();
      setData(result);

      // Cache the result if contentType is provided
      if (contentType && ctx) {
        ctx.dispatch({ type: 'CACHE_DATA', contentType, data: result });
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load content'));
      // Do NOT close the Window — just set error state
    } finally {
      setLoading(false);
    }
  }, [fetcher, contentType, ctx]);

  useEffect(() => {
    // If we already have cached data, skip the fetch
    if (cachedData !== null) {
      setLoading(false);
      return;
    }

    // Begin fetch immediately (within 50ms of mount per Requirement 11.3)
    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only on mount

  return {
    data,
    loading,
    error,
    refetch: fetch,
  };
}
