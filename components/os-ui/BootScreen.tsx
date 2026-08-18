'use client';

/**
 * BootScreen — full-viewport intro overlay shown once per browser session.
 *
 * Lifecycle:
 *  1. If sessionStorage has 'boot-shown' key → render null immediately.
 *  2. If prefers-reduced-motion → write 'boot-shown' and render null.
 *  3. Otherwise: fade-in owner name (300ms ease-out), hold for ≤2500ms total,
 *     fade-out (300ms ease-in), write 'boot-shown', unmount.
 *
 * Requirements: 7.1, 7.2, 7.3, 7.4, 7.5
 */

import React, { useState, useEffect, useRef } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Derive display text from the owner name:
 * - Non-empty name  → show the name as-is
 * - Otherwise       → em-dash fallback
 */
function getDisplayName(name?: string): string {
  if (name && name.trim().length > 0) return name.trim();
  return '\u2014'; // em-dash
}

// ─── Component ────────────────────────────────────────────────────────────────

export interface BootScreenProps {
  /** Owner name sourced from SiteSettings. May be undefined. */
  name?: string;
  /** Effective motion preference, including the in-app Settings choice. */
  reducedMotion?: boolean;
}

export function BootScreen({ name, reducedMotion: reducedMotionOverride }: BootScreenProps) {
  const systemReducedMotion = useReducedMotion();
  const reducedMotion = reducedMotionOverride ?? systemReducedMotion;
  const overlayRef = useRef<HTMLDivElement>(null);

  // Tracks whether the overlay is still in the DOM.
  const [visible, setVisible] = useState<boolean>(() => {
    // Synchronous sessionStorage check — prevents flash on repeat visits.
    if (typeof window === 'undefined') return false;
    return !sessionStorage.getItem('boot-shown');
  });

  useEffect(() => {
    if (!visible) return;

    // Reduced-motion: skip immediately.
    if (reducedMotion) {
      sessionStorage.setItem('boot-shown', '1');
      setVisible(false);
      return;
    }

    const el = overlayRef.current;
    if (!el) return;

    // Fade-in: opacity 0 → 1 over 300ms ease-out
    const fadeIn = el.animate([{ opacity: 0 }, { opacity: 1 }], {
      duration: 300,
      easing: 'ease-out',
      fill: 'forwards',
    });

    let cancelled = false;

    // After 2200ms (2500ms total minus 300ms fade-out), start fade-out.
    const holdTimer = setTimeout(() => {
      if (cancelled) return;

      const fadeOut = el.animate([{ opacity: 1 }, { opacity: 0 }], {
        duration: 300,
        easing: 'ease-in',
        fill: 'forwards',
      });

      fadeOut.onfinish = () => {
        if (cancelled) return;
        sessionStorage.setItem('boot-shown', '1');
        setVisible(false);
      };
    }, 2200);

    return () => {
      cancelled = true;
      clearTimeout(holdTimer);
      fadeIn.cancel();
    };
  }, [visible, reducedMotion]);

  if (!visible) return null;

  const displayName = getDisplayName(name);

  return (
    <div
      ref={overlayRef}
      role="status"
      aria-live="polite"
      aria-label="Loading portfolio"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 2000,
        background: 'var(--bg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 0, // WAAPI handles the transition from 0
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 'clamp(1rem, 2.5vw, 1.5rem)',
          maxWidth: '100%',
          padding: '1.5rem',
          textAlign: 'center',
        }}
      >
        <img
          src="/icon.svg"
          alt="James Fontanilla portfolio mark"
          width={88}
          height={88}
          style={{
            display: 'block',
            width: 'clamp(56px, 13vw, 88px)',
            height: 'auto',
            borderRadius: 'clamp(16px, 3vw, 22px)',
            boxShadow: '0 18px 54px rgba(1, 7, 18, 0.32), 0 0 0 1px rgba(169, 210, 255, 0.12)',
          }}
        />
        <span
          style={{
            fontFamily: '"Space Grotesk", "Manrope", sans-serif',
            fontSize: 'clamp(2rem, 5vw, 4rem)',
            fontWeight: 500,
            color: 'var(--gold)',
            letterSpacing: '-0.04em',
            userSelect: 'none',
          }}
        >
          {displayName}
        </span>
      </div>
    </div>
  );
}
