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

const PRIMARY_TYPES: ContentType[] = ['projects', 'about', 'contacts'];
const MORE_TYPES: ContentType[] = ['competitions', 'certifications', 'events', 'blog'];

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
    case 'competitions':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M7 4h10v4a5 5 0 01-10 0V4Z" stroke="currentColor" strokeWidth="1.8" />
          <path d="M7 6H4v1a4 4 0 004 4M17 6h3v1a4 4 0 01-4 4M12 13v4M8 20h8M9 17h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
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
  const [moreOpen, setMoreOpen] = useState(false);
  const moreActive = activePanel !== null && MORE_TYPES.includes(activePanel);

  function selectPanel(type: ContentType | null) {
    onPanelChange(type);
    setMoreOpen(false);
  }

  return (
    <nav
      aria-label="Primary navigation"
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
        padding: '6px 8px calc(6px + env(safe-area-inset-bottom, 0px))',
        gap: '4px',
      }}
    >
      {/* Home button */}
      <button
        aria-label="Home"
        aria-pressed={activePanel === null}
        aria-current={activePanel === null ? 'page' : undefined}
        onClick={() => selectPanel(null)}
        className="mobile-nav-item"
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '4px',
          minHeight: '54px',
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

      {PRIMARY_TYPES.map((type) => {
        const isActive = type === activePanel;
        return (
          <button
            key={type}
            aria-label={contentTypeLabel[type]}
            aria-pressed={isActive}
            aria-current={isActive ? 'page' : undefined}
            onClick={() => selectPanel(type)}
            className="mobile-nav-item"
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              minHeight: '54px',
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

      <button
        aria-label="More sections"
        aria-pressed={moreActive}
        aria-expanded={moreOpen}
        aria-controls="mobile-more-menu"
        onClick={() => setMoreOpen((open) => !open)}
        className="mobile-nav-item"
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '4px',
          minHeight: '54px',
          minWidth: '44px',
          padding: '8px 4px',
          background: moreOpen || moreActive ? 'var(--glass-control-hover)' : 'transparent',
          border: 'none',
          borderRadius: '14px',
          cursor: 'pointer',
          color: moreActive || moreOpen ? 'var(--gold)' : 'var(--muted)',
          transition: 'color 150ms ease, background 150ms ease',
          outline: 'none',
        }}
      >
        <svg width={20} height={20} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="5" cy="12" r="1.6" fill="currentColor" />
          <circle cx="12" cy="12" r="1.6" fill="currentColor" />
          <circle cx="19" cy="12" r="1.6" fill="currentColor" />
        </svg>
        <span style={{ fontSize: '0.68rem', fontWeight: moreActive || moreOpen ? 700 : 500, letterSpacing: '0.02em' }}>
          More
        </span>
      </button>

      {moreOpen && (
        <div
          id="mobile-more-menu"
          role="menu"
          aria-label="More sections"
          className="mobile-more-menu liquid-glass-surface"
          style={{
            position: 'fixed',
            left: '12px',
            right: '12px',
            bottom: 'calc(74px + env(safe-area-inset-bottom, 0px))',
            zIndex: 1001,
            padding: '10px',
            borderRadius: '24px',
            background: 'var(--glass-strong)',
            backdropFilter: 'blur(28px) saturate(1.35)',
            WebkitBackdropFilter: 'blur(28px) saturate(1.35)',
            border: '1px solid var(--glass-border)',
            boxShadow: 'var(--glass-shadow)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 8px 8px' }}>
            <span style={{ color: 'var(--text)', fontSize: '0.82rem', fontWeight: 700 }}>More sections</span>
            <button
              type="button"
              aria-label="Close more sections"
              onClick={() => setMoreOpen(false)}
              style={{
                width: '44px',
                height: '44px',
                display: 'grid',
                placeItems: 'center',
                margin: '-8px -4px -8px 0',
                border: 'none',
                borderRadius: '12px',
                background: 'transparent',
                color: 'var(--muted)',
                cursor: 'pointer',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </button>
          </div>
          <div style={{ display: 'grid', gap: '4px' }}>
            {MORE_TYPES.map((type) => {
              const isActive = type === activePanel;
              return (
                <button
                  key={type}
                  type="button"
                  role="menuitem"
                  aria-pressed={isActive}
                  onClick={() => selectPanel(type)}
                  style={{
                    minHeight: '48px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '8px 12px',
                    border: '1px solid transparent',
                    borderRadius: '14px',
                    background: isActive ? 'var(--glass-control-hover)' : 'transparent',
                    color: isActive ? 'var(--gold)' : 'var(--text)',
                    textAlign: 'left',
                    cursor: 'pointer',
                  }}
                >
                  <NavIcon type={type} />
                  <span style={{ fontSize: '0.88rem', fontWeight: isActive ? 700 : 600 }}>{contentTypeLabel[type]}</span>
                  {isActive && <span aria-hidden="true" style={{ width: '6px', height: '6px', marginLeft: 'auto', borderRadius: '50%', background: 'currentColor' }} />}
                </button>
              );
            })}
          </div>
        </div>
      )}
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
