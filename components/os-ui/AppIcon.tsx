'use client';

/**
 * AppIcon — a single icon button in the Dock.
 *
 * Features:
 *  - aria-label + aria-pressed for accessibility
 *  - Gold indicator dot when window is open or minimized
 *  - Tooltip on hover
 *  - Magnification effect: hovered=1.5×, adjacent=1.25×, others=1.0×
 *  - Minimum 44×44px touch target
 *
 * Requirements: 2.2, 2.7, 2.8, 2.9, 8.1, 8.7, 9.5
 */

import React, { useState } from 'react';
import type { ContentType } from '@/store/windowManagerStore';

// ─── Labels ───────────────────────────────────────────────────────────────────

export const contentTypeLabel: Record<ContentType, string> = {
  about: 'About',
  projects: 'Projects',
  certifications: 'Certifications',
  events: 'Events',
  contacts: 'Contacts',
  blog: 'Blog',
};

// ─── Icons ────────────────────────────────────────────────────────────────────

function IconAbout() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M4 20c0-4 3.6-7 8-7s8 3 8 7"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconProjects() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect
        x="3"
        y="7"
        width="18"
        height="14"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M3 11h18M8 7V5a1 1 0 011-1h6a1 1 0 011 1v2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconCertifications() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="10" r="5" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M9 21l3-3 3 3V15.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconEvents() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect
        x="3"
        y="5"
        width="18"
        height="16"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M3 10h18M8 3v4M16 3v4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconContacts() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect
        x="3"
        y="6"
        width="18"
        height="13"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M3 9l9 6 9-6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconBlog() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 4h16v16H4z" stroke="currentColor" strokeWidth="1.8" rx="2" />
      <path d="M8 8h8M8 12h6M8 16h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

const iconMap: Record<ContentType, React.ReactNode> = {
  about: <IconAbout />,
  projects: <IconProjects />,
  certifications: <IconCertifications />,
  events: <IconEvents />,
  contacts: <IconContacts />,
  blog: <IconBlog />,
};

// ─── Magnification ────────────────────────────────────────────────────────────

function getScale(selfIndex: number, hoverIndex: number | null): number {
  if (hoverIndex === null) return 1.0;
  const dist = Math.abs(selfIndex - hoverIndex);
  if (dist === 0) return 1.5;
  if (dist === 1) return 1.25;
  return 1.0;
}

// ─── Props ────────────────────────────────────────────────────────────────────

export interface AppIconProps {
  type: ContentType;
  isOpen: boolean;
  isMinimized: boolean;
  /** Index of the currently hovered icon in the dock, or null. */
  hoverIndex: number | null;
  /** This icon's position index in the dock. */
  selfIndex: number;
  iconRef: React.RefObject<HTMLButtonElement | null>;
  onClick: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function AppIcon({
  type,
  isOpen,
  isMinimized,
  hoverIndex,
  selfIndex,
  iconRef,
  onClick,
}: AppIconProps) {
  const [isHovered, setIsHovered] = useState(false);
  const scale = getScale(selfIndex, hoverIndex);
  const showIndicator = isOpen || isMinimized;
  const label = contentTypeLabel[type];

  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '4px',
      }}
    >
      {/* Tooltip */}
      {isHovered && (
        <div
          role="tooltip"
          id={`tooltip-${type}`}
          className="liquid-glass-tooltip"
          style={{
            position: 'absolute',
            bottom: 'calc(100% + 10px)',
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '4px 10px',
            borderRadius: '8px',
            background: 'var(--glass-strong)',
            border: '1px solid var(--glass-border)',
            color: 'var(--text)',
            fontSize: '0.76rem',
            fontWeight: 600,
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            zIndex: 1100,
          }}
        >
          {label}
        </div>
      )}

      {/* Icon button */}
      <button
        ref={iconRef}
        aria-label={label}
        aria-pressed={showIndicator}
        aria-describedby={isHovered ? `tooltip-${type}` : undefined}
        tabIndex={0}
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onFocus={() => setIsHovered(true)}
        onBlur={() => setIsHovered(false)}
        style={{
          minWidth: '44px',
          minHeight: '44px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: `scale(${scale})`,
          transition: 'transform 180ms ease-out, background 180ms ease, box-shadow 180ms ease',
          background: isHovered || showIndicator ? 'var(--glass-control)' : 'transparent',
          border: 'none',
          cursor: 'pointer',
          borderRadius: 'var(--radius-sm)',
          padding: '8px',
          color: 'var(--text)',
          outline: 'none', // :focus-visible handled globally by globals.css
          boxShadow: isHovered ? '0 8px 22px rgba(1, 7, 18, 0.2), 0 1px 0 rgba(255,255,255,0.1) inset' : 'none',
        }}
      >
        {iconMap[type]}
      </button>

      {/* Gold indicator dot */}
      {showIndicator && (
        <div
          aria-hidden="true"
          style={{
            width: '4px',
            height: '4px',
            borderRadius: '50%',
            background: 'var(--gold)',
            flexShrink: 0,
          }}
        />
      )}
    </div>
  );
}
