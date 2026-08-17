'use client';

/**
 * DesktopIcons — grid of shortcut icons on the desktop surface.
 * Arranged in a vertical column from top-left, like Windows desktop icons.
 * Double-click (or Enter key) to open the corresponding window.
 */

import React, { useState, useCallback } from 'react';
import type { ContentType } from '@/store/windowManagerStore';

// ─── Icon SVGs (larger versions for desktop) ──────────────────────────────────

function IconAbout() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.5" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function IconProjects() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="7" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3 11h18M8 7V5a1 1 0 011-1h6a1 1 0 011 1v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function IconCertifications() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="10" r="5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M9 21l3-3 3 3V15.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconCompetitions() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M7 4h10v4a5 5 0 01-10 0V4Z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M7 6H4v1a4 4 0 004 4M17 6h3v1a4 4 0 01-4 4M12 13v4M8 20h8M9 17h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconEvents() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3 10h18M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function IconContacts() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="6" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3 9l9 6 9-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconBlog() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 8h8M8 12h6M8 16h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function IconTechStack() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 7h14M5 12h14M5 17h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="9" cy="7" r="2" fill="var(--gold)" stroke="currentColor" strokeWidth="1.1" />
      <circle cx="15" cy="12" r="2" fill="var(--gold)" stroke="currentColor" strokeWidth="1.1" />
      <circle cx="11" cy="17" r="2" fill="var(--gold)" stroke="currentColor" strokeWidth="1.1" />
    </svg>
  );
}

const iconMap: Record<ContentType, React.ReactNode> = {
  about: <IconAbout />,
  projects: <IconProjects />,
  competitions: <IconCompetitions />,
  certifications: <IconCertifications />,
  events: <IconEvents />,
  contacts: <IconContacts />,
  blog: <IconBlog />,
  'tech-stack': <IconTechStack />,
};

const labelMap: Record<ContentType, string> = {
  about: 'About Me',
  projects: 'Projects',
  competitions: 'Competitions',
  certifications: 'Certifications',
  events: 'Events',
  contacts: 'Contacts',
  blog: 'Blog',
  'tech-stack': 'Tech Stack',
};

// ─── Types ────────────────────────────────────────────────────────────────────

interface DesktopIconsProps {
  onOpen: (type: ContentType) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

const CONTENT_TYPES: ContentType[] = ['about', 'projects', 'competitions', 'certifications', 'events', 'contacts', 'blog', 'tech-stack'];

export function DesktopIcons({ onOpen }: DesktopIconsProps) {
  const [selected, setSelected] = useState<ContentType | null>(null);

  const handleDoubleClick = useCallback((type: ContentType) => {
    onOpen(type);
  }, [onOpen]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent, type: ContentType) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onOpen(type);
    }
  }, [onOpen]);

  return (
    <div
      className="desktop-icons"
      style={{
        position: 'absolute',
        top: '16px',
        left: '16px',
        // Keep a protected lane above the bottom-left widgets. CSS Grid fills
        // the first column top-to-bottom, then starts the next column instead
        // of shrinking/overflowing icons into the location badge.
        display: 'grid',
        gridAutoFlow: 'column',
        gridTemplateRows: 'repeat(auto-fill, 80px)',
        gridAutoColumns: '80px',
        gap: '4px',
        height: 'calc(100vh - 300px)',
        maxHeight: 'calc(100vh - 300px)',
        alignContent: 'start',
        zIndex: 1,
      }}
    >
      {CONTENT_TYPES.map((type) => (
        <button
          key={type}
          className="desktop-icon-btn"
          aria-label={`Open ${labelMap[type]}`}
          tabIndex={0}
          onClick={() => setSelected(type)}
          onDoubleClick={() => handleDoubleClick(type)}
          onKeyDown={(e) => handleKeyDown(e, type)}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            width: '80px',
            height: '80px',
            padding: '8px 4px',
            border: selected === type ? '1px solid rgba(255,255,255,0.25)' : '1px solid transparent',
            borderRadius: '8px',
            background: selected === type ? 'rgba(255,255,255,0.08)' : 'transparent',
            cursor: 'pointer',
            color: 'var(--text)',
            outline: 'none',
            flex: '0 0 80px',
            transition: 'background 100ms ease, border-color 100ms ease',
          }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '8px',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            {iconMap[type]}
          </div>
          <span
            style={{
              fontSize: '0.68rem',
              fontWeight: 500,
              textAlign: 'center',
              lineHeight: 1.2,
              maxWidth: '72px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              textShadow: '0 1px 3px rgba(0,0,0,0.8)',
            }}
          >
            {labelMap[type]}
          </span>
        </button>
      ))}
    </div>
  );
}
