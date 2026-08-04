'use client';

/**
 * MobileNav — bottom navigation bar for mobile viewports (< 768px).
 *
 * Replaces the Dock on mobile. Shows icon + text label per ContentType.
 * Minimum 44×44px touch targets. Tracks active panel via local state.
 *
 * Requirements: 9.1, 9.2, 9.5
 */

import React, { useState } from 'react';
import type { ContentType } from '@/store/windowManagerStore';
import { contentTypeLabel } from './AppIcon';

// ─── Constants ────────────────────────────────────────────────────────────────

const CONTENT_TYPES: ContentType[] = [
  'about',
  'projects',
  'certifications',
  'events',
  'contacts',
  'blog',
];

// ─── Simple inline icons (same as AppIcon but smaller) ───────────────────────

function NavIcon({ type }: { type: ContentType }) {
  const size = 20;
  switch (type) {
    case 'about':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8" />
          <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    case 'projects':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect x="3" y="7" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.8" />
          <path d="M3 11h18M8 7V5a1 1 0 011-1h6a1 1 0 011 1v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    case 'certifications':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="10" r="5" stroke="currentColor" strokeWidth="1.8" />
          <path d="M9 21l3-3 3 3V15.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'events':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.8" />
          <path d="M3 10h18M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    case 'contacts':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect x="3" y="6" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="1.8" />
          <path d="M3 9l9 6 9-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'blog':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="1.8" />
          <path d="M8 8h8M8 12h6M8 16h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
  }
}

// ─── Props ────────────────────────────────────────────────────────────────────

export interface MobileNavProps {
  activePanel: ContentType | null;
  onPanelChange: (type: ContentType | null) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function MobileNav({ activePanel, onPanelChange }: MobileNavProps) {
  return (
    <nav
      aria-label="Mobile Navigation"
      className="liquid-glass-mobile-nav liquid-glass-surface"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'stretch',
        background: 'var(--glass-regular)',
        backdropFilter: 'blur(28px) saturate(1.35)',
        WebkitBackdropFilter: 'blur(28px) saturate(1.35)',
        borderTop: '1px solid var(--glass-border)',
        boxShadow: 'var(--glass-shadow)',
      }}
    >
      {/* Home button */}
      <button
        aria-label="Home"
        aria-pressed={activePanel === null}
        onClick={() => onPanelChange(null)}
        style={{
          flex: 0.8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '4px',
          minHeight: '60px',
          minWidth: '44px',
          padding: '8px 4px',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          color: activePanel === null ? 'var(--gold)' : 'var(--muted)',
          transition: 'color 150ms ease',
          outline: 'none',
        }}
      >
        <svg width={20} height={20} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M3 12l9-8 9 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M5 10v9a1 1 0 001 1h4v-5h4v5h4a1 1 0 001-1v-9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span style={{ fontSize: '0.68rem', fontWeight: activePanel === null ? 700 : 500, letterSpacing: '0.02em' }}>
          Home
        </span>
      </button>

      {CONTENT_TYPES.map((type) => {
        const isActive = type === activePanel;
        return (
          <button
            key={type}
            aria-label={contentTypeLabel[type]}
            aria-pressed={isActive}
            onClick={() => onPanelChange(type)}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              minHeight: '60px',
              minWidth: '44px',
              padding: '8px 4px',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: isActive ? 'var(--gold)' : 'var(--muted)',
              transition: 'color 150ms ease',
              outline: 'none',
            }}
          >
            <NavIcon type={type} />
            <span
              style={{
                fontSize: '0.68rem',
                fontWeight: isActive ? 700 : 500,
                letterSpacing: '0.02em',
              }}
            >
              {contentTypeLabel[type]}
            </span>
          </button>
        );
      })}
    </nav>
  );
}

/**
 * useMobileNav — self-contained state for mobile navigation.
 * Used by OSUIProvider in mobile mode.
 * null activePanel = home screen
 */
export function useMobileNav() {
  const [activePanel, setActivePanel] = useState<ContentType | null>(null);
  return { activePanel, setActivePanel };
}
