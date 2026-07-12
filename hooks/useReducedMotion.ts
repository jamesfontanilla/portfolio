/**
 * useReducedMotion — reads the `prefers-reduced-motion: reduce` media query.
 *
 * Returns true when the user has requested reduced motion. Subscribes to
 * media query changes so the value updates if the user changes their OS
 * preference while the page is open.
 *
 * Requirements: 6.8, 7.5
 */

import { useState, useEffect } from 'react';

const MEDIA_QUERY = '(prefers-reduced-motion: reduce)';

function getMatches(): boolean {
  // Guard against SSR — window is not defined on the server
  if (typeof window === 'undefined') return false;
  return window.matchMedia(MEDIA_QUERY).matches;
}

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState<boolean>(getMatches);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mq = window.matchMedia(MEDIA_QUERY);

    function onChange(e: MediaQueryListEvent) {
      setReduced(e.matches);
    }

    // Modern API
    mq.addEventListener('change', onChange);
    return () => {
      mq.removeEventListener('change', onChange);
    };
  }, []);

  return reduced;
}
