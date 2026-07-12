'use client';

/**
 * Desktop — full-viewport background layer for the OS_UI.
 *
 * Uses position: fixed; inset: 0 so it always fills 100vw × 100vh.
 * The body::before grid-line overlay from globals.css renders on top of
 * this automatically — no extra markup needed.
 *
 * Requirements: 1.1, 1.3, 1.4
 */

import React from 'react';

// No props — fills viewport via CSS
export function Desktop({ children }: { children?: React.ReactNode }) {
  return (
    <div className="os-desktop" aria-hidden="true">
      {children}
    </div>
  );
}
