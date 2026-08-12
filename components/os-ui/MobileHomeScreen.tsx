'use client';

/**
 * MobileHomeScreen — phone-style home screen with app grid and compact info.
 * Shown when no content panel is active on mobile.
 */

import React, { useState, useEffect } from 'react';
import { usePortfolioData } from './OSUIProvider';
import type { ContentType } from '@/store/windowManagerStore';
import { contentTypeLabel } from './AppIcon';

// ─── App icons for home screen grid ──────────────────────────────────────────

function AppGridIcon({ type }: { type: ContentType }) {
  const s = 28;
  switch (type) {
    case 'about':
      return (<svg width={s} height={s} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.6"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>);
    case 'projects':
      return (<svg width={s} height={s} viewBox="0 0 24 24" fill="none"><rect x="3" y="7" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.6"/><path d="M3 11h18M8 7V5a1 1 0 011-1h6a1 1 0 011 1v2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>);
    case 'certifications':
      return (<svg width={s} height={s} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="10" r="5" stroke="currentColor" strokeWidth="1.6"/><path d="M9 21l3-3 3 3V15.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>);
    case 'events':
      return (<svg width={s} height={s} viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.6"/><path d="M3 10h18M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>);
    case 'contacts':
      return (<svg width={s} height={s} viewBox="0 0 24 24" fill="none"><rect x="3" y="6" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="1.6"/><path d="M3 9l9 6 9-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>);
    case 'blog':
      return (<svg width={s} height={s} viewBox="0 0 24 24" fill="none"><rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="1.6"/><path d="M8 8h8M8 12h6M8 16h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>);
  }
}

const CONTENT_TYPES: ContentType[] = ['about', 'projects', 'certifications', 'events', 'contacts', 'blog'];

// ─── Props ────────────────────────────────────────────────────────────────────

interface MobileHomeScreenProps {
  onOpenApp: (type: ContentType) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function MobileHomeScreen({ onOpenApp }: MobileHomeScreenProps) {
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    function update() {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setDate(now.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' }));
    }
    update();
    const id = setInterval(update, 30000);
    return () => clearInterval(id);
  }, []);

  const data = usePortfolioData();
  const { settings } = data;
  const name = settings.name;
  const role = settings.role;
  const availability = settings.availability;

  return (
    <div
      className="mobile-home-screen"
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '48px 24px 80px',
        zIndex: 1,
        overflowY: 'auto',
      }}
    >
      {/* Time & Date */}
      <div className="mobile-home-time" style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div
          style={{
            fontFamily: '"Space Grotesk", sans-serif',
            fontSize: '3.5rem',
            fontWeight: 300,
            color: 'var(--text)',
            letterSpacing: '-0.04em',
            lineHeight: 1,
            textShadow: '0 2px 12px rgba(0,0,0,0.5)',
          }}
        >
          {time}
        </div>
        <div
          style={{
            fontSize: '0.85rem',
            color: 'var(--muted)',
            marginTop: '6px',
            textShadow: '0 1px 6px rgba(0,0,0,0.4)',
          }}
        >
          {date}
        </div>
      </div>

      {/* Welcome card */}
      <div
        className="mobile-home-identity"
        style={{
          width: '100%',
          maxWidth: '340px',
          padding: '18px 20px',
          borderRadius: '18px',
          background: 'rgba(28, 28, 28, 0.55)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(255,255,255,0.08)',
          marginBottom: '28px',
          textAlign: 'center',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginBottom: '8px' }}>
          <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 6px rgba(74,222,128,0.4)' }} />
          <span style={{ fontSize: '0.68rem', fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {availability}
          </span>
        </div>
        <h1 style={{ margin: '0 0 4px', fontFamily: '"Space Grotesk", sans-serif', fontSize: '1.5rem', fontWeight: 500, color: 'var(--text)', letterSpacing: '-0.03em' }}>
          {name}
        </h1>
        <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--gold)' }}>{role}</span>
      </div>

      {/* App grid */}
      <div
        className="mobile-home-app-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '16px',
          width: '100%',
          maxWidth: '300px',
        }}
      >
        {CONTENT_TYPES.map((type) => (
          <button
            key={type}
            onClick={() => onOpenApp(type)}
            aria-label={contentTypeLabel[type]}
            className="mobile-home-app"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 8px',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              outline: 'none',
              color: 'var(--text)',
            }}
          >
            <div
              className="mobile-home-app-icon"
              style={{
                width: '54px',
                height: '54px',
                borderRadius: '14px',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
              }}
            >
              <AppGridIcon type={type} />
            </div>
            <span style={{ fontSize: '0.7rem', fontWeight: 500, color: 'var(--muted)' }}>
              {contentTypeLabel[type]}
            </span>
          </button>
        ))}
      </div>

      {/* Quick stats */}
      {data && (
        <div className="mobile-home-stats" style={{ display: 'flex', gap: '12px', marginTop: '24px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {[
            { n: data.projects.length, label: 'Projects' },
            { n: data.certifications.length, label: 'Certs' },
            { n: data.events.length, label: 'Events' },
          ].map((s) => (
            <div
              key={s.label}
              style={{
                padding: '4px 10px',
                borderRadius: '999px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.06)',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
              }}
            >
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--sand)' }}>{s.n}</span>
              <span style={{ fontSize: '0.65rem', color: 'var(--muted)' }}>{s.label}</span>
            </div>
          ))}
        </div>
      )}

      {/* Social links */}
      {settings && (
        <div className="mobile-home-socials" style={{ display: 'flex', gap: '8px', marginTop: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {[
            { url: settings.githubUrl, label: 'GitHub', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.8-.22 1.65-.33 2.5-.33.85 0 1.7.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21.5c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z"/></svg> },
            { url: settings.linkedinUrl, label: 'LinkedIn', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg> },
            { url: settings.email ? `mailto:${settings.email}` : undefined, label: 'Email', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-10 6L2 7"/></svg> },
            { url: settings.xUrl, label: 'X', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> },
            { url: settings.facebookUrl, label: 'Facebook', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg> },
          ].filter(s => s.url).map((s) => (
            <a
              key={s.label}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.label}
              style={{
                width: '44px',
                height: '44px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '10px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: 'var(--muted)',
                textDecoration: 'none',
              }}
            >
              {s.icon}
            </a>
          ))}
        </div>
      )}

      {/* Location badge */}
      {settings?.location && (
        <div className="mobile-home-location" style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '16px', padding: '6px 12px', borderRadius: '999px', background: 'rgba(28,28,28,0.45)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <span style={{ fontSize: '0.8rem' }}>📍</span>
          <span style={{ fontSize: '0.72rem', fontWeight: 500, color: 'var(--muted)' }}>{settings.location}</span>
        </div>
      )}

      {/* Focus note */}
      {settings?.intro && (
        <div
          className="mobile-home-focus"
          style={{
            width: '100%',
            maxWidth: '300px',
            marginTop: '16px',
            padding: '12px 14px',
            borderRadius: '14px',
            background: 'rgba(28, 28, 28, 0.4)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.8rem' }}>🎯</span>
            <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Current Focus</span>
          </div>
          <p style={{ margin: 0, fontSize: '0.76rem', color: 'var(--text)', lineHeight: 1.5 }}>{settings.intro}</p>
        </div>
      )}

      {/* Highlights */}
      {data && (data.projects.length > 0 || data.certifications.length > 0 || data.events.length > 0) && (
        <div
          className="mobile-home-highlights"
          style={{
            width: '100%',
            maxWidth: '300px',
            marginTop: '16px',
            padding: '14px 16px',
            borderRadius: '14px',
            background: 'rgba(28, 28, 28, 0.4)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.06)',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Highlights</span>
          {data.projects.length > 0 && (
            <button
              onClick={() => onOpenApp('projects')}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 10px', borderRadius: '10px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer', color: 'var(--text)', textAlign: 'left', outline: 'none' }}
            >
              <span style={{ fontSize: '1rem' }}>🚀</span>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: '0.65rem', fontWeight: 600, color: 'var(--gold)', textTransform: 'uppercase' }}>Latest Project</div>
                <div style={{ fontSize: '0.76rem', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{data.projects[0].title}</div>
              </div>
            </button>
          )}
          {data.certifications.length > 0 && (
            <button
              onClick={() => onOpenApp('certifications')}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 10px', borderRadius: '10px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer', color: 'var(--text)', textAlign: 'left', outline: 'none' }}
            >
              <span style={{ fontSize: '1rem' }}>🏅</span>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: '0.65rem', fontWeight: 600, color: 'var(--gold)', textTransform: 'uppercase' }}>Recent Cert</div>
                <div style={{ fontSize: '0.76rem', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{data.certifications[0].title}</div>
              </div>
            </button>
          )}
          {data.events.length > 0 && (
            <button
              onClick={() => onOpenApp('events')}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 10px', borderRadius: '10px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer', color: 'var(--text)', textAlign: 'left', outline: 'none' }}
            >
              <span style={{ fontSize: '1rem' }}>📅</span>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: '0.65rem', fontWeight: 600, color: 'var(--gold)', textTransform: 'uppercase' }}>Last Event</div>
                <div style={{ fontSize: '0.76rem', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{data.events[0].title}</div>
              </div>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
