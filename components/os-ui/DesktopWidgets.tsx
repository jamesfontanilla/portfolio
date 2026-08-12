'use client';

/**
 * DesktopWidgets — informational widgets displayed on the desktop surface.
 *
 * - WelcomeWidget: owner name, role, tagline, availability status + socials
 * - ClockWidget: live time + date display
 * - StatsWidget: project/cert/event counts from local portfolio content
 * - HighlightsWidget: latest project, cert, event from local portfolio content
 * - HintText: subtle prompt that fades after first interaction
 */

import React, { useState, useEffect, useCallback } from 'react';
import { portfolioData } from '@/lib/portfolio-data';

// ─── Clock Widget ─────────────────────────────────────────────────────────────

function ClockWidget() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!now) return null;

  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const dateStr = now.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: '4px',
      }}
    >
      <span
        style={{
          fontFamily: '"Space Grotesk", "Manrope", sans-serif',
          fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
          fontWeight: 400,
          color: 'var(--text)',
          letterSpacing: '-0.04em',
          lineHeight: 1,
          textShadow: '0 2px 20px rgba(0,0,0,0.5)',
        }}
      >
        {timeStr}
      </span>
      <span
        style={{
          fontSize: '0.9rem',
          fontWeight: 500,
          color: 'var(--muted)',
          letterSpacing: '0.01em',
          textShadow: '0 1px 8px rgba(0,0,0,0.5)',
        }}
      >
        {dateStr}
      </span>
    </div>
  );
}

// ─── Welcome Widget ───────────────────────────────────────────────────────────

interface WelcomeWidgetProps {
  name: string;
  role: string;
  tagline: string;
  availability: string;
  socials?: { github?: string; linkedin?: string; email?: string; x?: string; facebook?: string };
}

function SocialIcon({ type }: { type: string }) {
  const s = 16;
  switch (type) {
    case 'github':
      return (<svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.8-.22 1.65-.33 2.5-.33.85 0 1.7.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21.5c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z"/></svg>);
    case 'linkedin':
      return (<svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>);
    case 'email':
      return (<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-10 6L2 7"/></svg>);
    case 'x':
      return (<svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>);
    case 'facebook':
      return (<svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>);
    default:
      return null;
  }
}

function WelcomeWidget({ name, role, tagline, availability, socials }: WelcomeWidgetProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        padding: '24px 28px',
        borderRadius: '20px',
        background: 'rgba(28, 28, 28, 0.5)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(255,255,255,0.08)',
        maxWidth: '380px',
        pointerEvents: 'auto',
      }}
    >
      {/* Status badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: '#4ade80',
            boxShadow: '0 0 8px rgba(74, 222, 128, 0.4)',
          }}
        />
        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          {availability}
        </span>
      </div>

      {/* Name */}
      <h1
        style={{
          margin: 0,
          fontFamily: '"Space Grotesk", "Manrope", sans-serif',
          fontSize: 'clamp(1.5rem, 3vw, 2.2rem)',
          fontWeight: 500,
          color: 'var(--text)',
          letterSpacing: '-0.03em',
          lineHeight: 1.1,
        }}
      >
        {name}
      </h1>

      {/* Role */}
      <span
        style={{
          fontSize: '1rem',
          fontWeight: 600,
          color: 'var(--gold)',
          letterSpacing: '-0.01em',
        }}
      >
        {role}
      </span>

      {/* Tagline */}
      <p
        style={{
          margin: 0,
          fontSize: '0.85rem',
          color: 'var(--muted)',
          lineHeight: 1.6,
          maxWidth: '32ch',
        }}
      >
        {tagline}
      </p>

      {/* Social links */}
      {socials && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
          {Object.entries(socials).map(([key, url]) => {
            if (!url) return null;
            return (
              <a
                key={key}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={key}
                style={{
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '8px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: 'var(--muted)',
                  transition: 'background 150ms ease, color 150ms ease, border-color 150ms ease',
                  textDecoration: 'none',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.12)';
                  e.currentTarget.style.color = 'var(--text)';
                  e.currentTarget.style.borderColor = 'rgba(231,194,90,0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                  e.currentTarget.style.color = 'var(--muted)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                }}
              >
                <SocialIcon type={key} />
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Hint Text ────────────────────────────────────────────────────────────────

function HintText() {
  const [visible, setVisible] = useState(true);

  const handleInteraction = useCallback(() => {
    setVisible(false);
  }, []);

  useEffect(() => {
    // Fade out after 6 seconds or on first click anywhere
    const timer = setTimeout(() => setVisible(false), 6000);
    window.addEventListener('pointerdown', handleInteraction, { once: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener('pointerdown', handleInteraction);
    };
  }, [handleInteraction]);

  if (!visible) return null;

  return (
    <span
      style={{
        fontSize: '0.78rem',
        color: 'rgba(241, 238, 231, 0.4)',
        fontWeight: 500,
        letterSpacing: '0.02em',
        textShadow: '0 1px 4px rgba(0,0,0,0.5)',
        transition: 'opacity 500ms ease',
      }}
    >
      Double-click an icon to get started
    </span>
  );
}

// ─── Quick Stats ──────────────────────────────────────────────────────────────

interface StatsWidgetProps {
  projects: number;
  certifications: number;
  events: number;
}

function StatsWidget({ projects, certifications, events }: StatsWidgetProps) {
  const stats = [
    { label: 'Projects', value: projects },
    { label: 'Certs', value: certifications },
    { label: 'Events', value: events },
  ];

  return (
    <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
      {stats.map((s) => (
        <div
          key={s.label}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '5px 10px',
            borderRadius: '999px',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--sand)' }}>{s.value}</span>
          <span style={{ fontSize: '0.7rem', fontWeight: 500, color: 'var(--muted)' }}>{s.label}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Highlights Widget ────────────────────────────────────────────────────────

interface Highlight {
  icon: string;
  label: string;
  title: string;
  meta: string;
  contentType: 'projects' | 'certifications' | 'events';
}

interface HighlightsWidgetProps {
  highlights: Highlight[];
  onOpen: (type: 'projects' | 'certifications' | 'events') => void;
}

function HighlightsWidget({ highlights, onOpen }: HighlightsWidgetProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        padding: '16px 18px',
        borderRadius: '16px',
        background: 'rgba(28, 28, 28, 0.45)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        border: '1px solid rgba(255,255,255,0.06)',
        maxWidth: '280px',
        pointerEvents: 'auto',
      }}
    >
      <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        Highlights
      </span>
      {highlights.map((h, i) => (
        <button
          key={i}
          onClick={() => onOpen(h.contentType)}
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '10px',
            padding: '10px 12px',
            borderRadius: '10px',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.05)',
            cursor: 'pointer',
            textAlign: 'left',
            color: 'var(--text)',
            transition: 'background 150ms ease, border-color 150ms ease',
            outline: 'none',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.07)';
            e.currentTarget.style.borderColor = 'rgba(231,194,90,0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
          }}
        >
          <span style={{ fontSize: '1.1rem', lineHeight: 1 }}>{h.icon}</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', minWidth: 0 }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {h.label}
            </span>
            <span style={{ fontSize: '0.8rem', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {h.title}
            </span>
            <span style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>{h.meta}</span>
          </div>
        </button>
      ))}
    </div>
  );
}

// ─── Location Badge ───────────────────────────────────────────────────────────

function LocationBadge({ location }: { location: string }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '6px 12px',
        borderRadius: '999px',
        background: 'rgba(28, 28, 28, 0.45)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid rgba(255,255,255,0.06)',
        pointerEvents: 'auto',
      }}
    >
      <span style={{ fontSize: '0.8rem' }}>📍</span>
      <span style={{ fontSize: '0.72rem', fontWeight: 500, color: 'var(--muted)' }}>{location}</span>
    </div>
  );
}

// ─── Focus Note Widget ────────────────────────────────────────────────────────

function FocusNoteWidget({ intro }: { intro: string }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        padding: '14px 16px',
        borderRadius: '14px',
        background: 'rgba(28, 28, 28, 0.4)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid rgba(255,255,255,0.06)',
        maxWidth: '240px',
        pointerEvents: 'auto',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span style={{ fontSize: '0.85rem' }}>🎯</span>
        <span style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Current Focus
        </span>
      </div>
      <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text)', lineHeight: 1.5 }}>
        {intro}
      </p>
    </div>
  );
}

// ─── Keyboard Shortcuts Tooltip ───────────────────────────────────────────────

function ShortcutsHint() {
  const [visible, setVisible] = useState(false);

  return (
    <div style={{ pointerEvents: 'auto', position: 'relative' }}>
      <button
        onClick={() => setVisible(!visible)}
        aria-label="Keyboard shortcuts"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          padding: '5px 10px',
          borderRadius: '8px',
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.06)',
          color: 'var(--muted)',
          fontSize: '0.68rem',
          fontWeight: 500,
          cursor: 'pointer',
          outline: 'none',
          transition: 'background 150ms ease',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
      >
        <span style={{ fontFamily: 'monospace', fontSize: '0.7rem' }}>⌨</span>
        Shortcuts
      </button>

      {visible && (
        <div
          style={{
            position: 'absolute',
            bottom: 'calc(100% + 8px)',
            left: 0,
            padding: '12px 14px',
            borderRadius: '12px',
            background: 'var(--panel-strong)',
            border: '1px solid var(--border)',
            boxShadow: '0 8px 30px rgba(0,0,0,0.4)',
            minWidth: '180px',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            zIndex: 1200,
          }}
        >
          <span style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
            Keyboard Shortcuts
          </span>
          {[
            { key: '1', action: 'About' },
            { key: '2', action: 'Projects' },
            { key: '3', action: 'Certifications' },
            { key: '4', action: 'Events' },
            { key: '5', action: 'Contacts' },
            { key: 'Esc', action: 'Close window' },
          ].map((s) => (
            <div key={s.key} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <kbd
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minWidth: '22px',
                  height: '20px',
                  padding: '0 5px',
                  borderRadius: '4px',
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  fontSize: '0.68rem',
                  fontWeight: 600,
                  color: 'var(--text)',
                  fontFamily: 'monospace',
                }}
              >
                {s.key}
              </kbd>
              <span style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>{s.action}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────

export interface DesktopWidgetsProps {
  onOpenWindow?: (type: 'projects' | 'certifications' | 'events') => void;
}

export function DesktopWidgets({ onOpenWindow }: DesktopWidgetsProps) {
  const data = portfolioData;

  // Local content is available synchronously, so widgets render immediately.
  const settings = data.settings;
  const name = settings.name;
  const role = settings.role;
  const tagline = settings.bio;
  const availability = settings.availability;
  const location = settings.location;
  const intro = settings.intro;
  const socials = {
    github: settings.githubUrl,
    linkedin: settings.linkedinUrl,
    email: settings.email ? `mailto:${settings.email}` : undefined,
    x: settings.xUrl,
    facebook: settings.facebookUrl,
  };

  const projectCount = data.projects.length;
  const certCount = data.certifications.length;
  const eventCount = data.events.length;

  // Highlights from live data
  const highlights: Highlight[] = [];

  if (data.projects.length) {
    const p = data.projects[0];
    highlights.push({
      icon: '🚀',
      label: 'Latest Project',
      title: p.title,
      meta: `${p.status} · ${p.stack.join(', ')}`,
      contentType: 'projects',
    });
  }

  if (data.certifications.length) {
    const c = data.certifications[0];
    const dateStr = new Date(c.earnedOn).toLocaleDateString([], { month: 'short', year: 'numeric' });
    highlights.push({
      icon: '🏅',
      label: 'Recent Cert',
      title: c.title,
      meta: `${c.issuer} · ${dateStr}`,
      contentType: 'certifications',
    });
  }

  if (data.events.length) {
    const e = data.events[0];
    const dateStr = new Date(e.date).toLocaleDateString([], { month: 'short', year: 'numeric' });
    highlights.push({
      icon: '📅',
      label: 'Last Event',
      title: e.title,
      meta: `${e.type} · ${dateStr}`,
      contentType: 'events',
    });
  }

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '16px',
        padding: '80px 40px 100px',
        pointerEvents: 'none',
        zIndex: 1,
      }}
    >
      {/* Top-right clock */}
      <div style={{ position: 'absolute', top: '24px', right: '32px' }}>
        <ClockWidget />
      </div>

      {/* Bottom-left: location + focus note + shortcuts */}
      <div style={{ position: 'absolute', bottom: '80px', left: '24px', display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'flex-start' }}>
        <LocationBadge location={location} />
        <FocusNoteWidget intro={intro} />
        <ShortcutsHint />
      </div>

      {/* Bottom-right highlights widget */}
      {highlights.length > 0 && (
        <div style={{ position: 'absolute', bottom: '80px', right: '24px' }}>
          <HighlightsWidget
            highlights={highlights}
            onOpen={onOpenWindow ?? (() => {})}
          />
        </div>
      )}

      {/* Center welcome card + stats */}
      <WelcomeWidget
        name={name}
        role={role}
        tagline={tagline}
        availability={availability}
        socials={socials}
      />
      {data && <StatsWidget projects={projectCount} certifications={certCount} events={eventCount} />}

      {/* Hint */}
      <HintText />
    </div>
  );
}
