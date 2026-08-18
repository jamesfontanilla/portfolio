'use client';

/**
 * MobileNav — a four-slot iPhone-style dock for mobile viewports.
 * The home grid remains the source of truth for all other portfolio apps.
 */

import React, { useState } from 'react';
import type { ContentType } from '@/store/windowManagerStore';
import { contentTypeLabel } from './AppIcon';

function NavIcon({ type }: { type: ContentType }) {
  const size = 20;

  switch (type) {
    case 'about':
      return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>);
    case 'projects':
      return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3" y="7" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.8"/><path d="M3 11h18M8 7V5a1 1 0 011-1h6a1 1 0 011 1v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>);
    case 'contacts':
      return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3" y="6" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="1.8"/><path d="M3 9l9 6 9-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>);
    default:
      return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="5" cy="12" r="1.6" fill="currentColor"/><circle cx="12" cy="12" r="1.6" fill="currentColor"/><circle cx="19" cy="12" r="1.6" fill="currentColor"/></svg>);
  }
}

function HomeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3 12l9-8 9 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 10v9a1 1 0 001 1h4v-5h4v5h4a1 1 0 001-1v-9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const DOCK_ITEMS: Array<{ type: ContentType | null; label: string }> = [
  { type: null, label: 'Home' },
  { type: 'projects', label: 'Projects' },
  { type: 'about', label: 'About Me' },
  { type: 'contacts', label: 'Contacts' },
];

export interface MobileNavProps {
  activePanel: ContentType | null;
  onPanelChange: (type: ContentType | null) => void;
}

export function MobileNav({ activePanel, onPanelChange }: MobileNavProps) {
  return (
    <nav
      aria-label="Mobile dock"
      className="liquid-glass-mobile-nav liquid-glass-surface"
      style={{
        position: 'fixed',
        left: '12px',
        right: '12px',
        bottom: 'calc(10px + var(--mobile-safe-bottom))',
        zIndex: 1000,
        display: 'grid',
        gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
        alignItems: 'stretch',
        gap: '4px',
        padding: '7px',
        borderRadius: '26px',
        background: 'var(--glass-regular)',
        backdropFilter: 'blur(28px) saturate(1.35)',
        WebkitBackdropFilter: 'blur(28px) saturate(1.35)',
        border: '1px solid var(--glass-border)',
        boxShadow: 'var(--glass-shadow)',
      }}
    >
      {DOCK_ITEMS.map(({ type, label }) => {
        const isActive = type === null ? activePanel === null : activePanel === type;

        return (
          <button
            key={label}
            type="button"
            aria-label={label}
            aria-pressed={isActive}
            aria-current={isActive ? 'page' : undefined}
            onClick={() => onPanelChange(type)}
            className="mobile-nav-item"
            style={{
              minWidth: 0,
              minHeight: '54px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              padding: '7px 4px',
              border: 'none',
              borderRadius: '18px',
              background: isActive ? 'var(--glass-control-hover)' : 'transparent',
              color: isActive ? 'var(--gold)' : 'var(--muted)',
              cursor: 'pointer',
              outline: 'none',
              transition: 'color 150ms ease, background 150ms ease, transform 150ms ease',
              touchAction: 'manipulation',
            }}
          >
            {type === null ? <HomeIcon /> : <NavIcon type={type} />}
            <span style={{ fontSize: '0.64rem', fontWeight: isActive ? 700 : 500, letterSpacing: '0.01em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '100%' }}>
              {type === null ? label : contentTypeLabel[type]}
            </span>
          </button>
        );
      })}
    </nav>
  );
}

/**
 * useMobileNav — self-contained state for mobile navigation.
 * null activePanel = home screen.
 */
export function useMobileNav() {
  const [activePanel, setActivePanel] = useState<ContentType | null>(null);
  return { activePanel, setActivePanel };
}
