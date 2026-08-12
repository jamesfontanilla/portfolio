'use client';

/**
 * ContactsView — premium contact card with platform-branded tiles.
 * Features a hero header, colored platform icons, and copy-to-clipboard.
 * Requirements: 5.1, 5.5, 5.7, 5.8, 5.9
 */

import React, { useState, useCallback } from 'react';
import { portfolioData } from '@/lib/portfolio-data';
import type { SiteSettings } from '@/lib/types';

// ─── Platform config ──────────────────────────────────────────────────────────

interface PlatformConfig {
  label: string;
  color: string;
  icon: React.ReactNode;
}

const PLATFORM_CONFIG: Record<string, PlatformConfig> = {
  email: {
    label: 'Email',
    color: '#ea4335',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="1.8"/><path d="M22 7l-10 6L2 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  },
  linkedin: {
    label: 'LinkedIn',
    color: '#0a66c2',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>,
  },
  github: {
    label: 'GitHub',
    color: '#f0f0f0',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.8-.22 1.65-.33 2.5-.33.85 0 1.7.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21.5c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z"/></svg>,
  },
  phone: {
    label: 'Phone',
    color: '#4ade80',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  },
  x: {
    label: 'X (Twitter)',
    color: '#f0f0f0',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>,
  },
  threads: {
    label: 'Threads',
    color: '#f0f0f0',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.912 3.59 12c.025 3.088.717 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.346-.79-.952-1.428-1.75-1.866-.18.652-.468 1.247-.879 1.762a4.737 4.737 0 01-1.806 1.442c-.748.361-1.6.543-2.532.543-1.203 0-2.248-.313-3.083-.942-.89-.672-1.363-1.596-1.363-2.656 0-1.295.558-2.321 1.556-2.935.878-.54 2.04-.842 3.398-.892.936-.034 1.882.056 2.78.264-.167-.9-.576-1.603-1.205-2.065-.7-.515-1.668-.778-2.876-.778-.03 0-.06 0-.09.002l.002-2.12c.05-.001.1-.001.15-.001 1.762 0 3.242.435 4.397 1.293 1.068.793 1.783 1.925 2.118 3.358a6.39 6.39 0 011.89.702c1.166.639 2.065 1.558 2.6 2.656.727 1.491.776 4.063-1.266 6.065-1.832 1.794-4.097 2.573-7.323 2.597z"/></svg>,
  },
  instagram: {
    label: 'Instagram',
    color: '#e4405f',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="1.8"/><circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="1.8"/><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor"/></svg>,
  },
  facebook: {
    label: 'Facebook',
    color: '#1877f2',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>,
  },
  resume: {
    label: 'Resume',
    color: '#e7c25a',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  },
};

// ─── Contact field builder ────────────────────────────────────────────────────

interface ContactField {
  platform: string;
  displayValue: string;
  href: string;
  copyValue: string;
}

function buildContactFields(s: SiteSettings): ContactField[] {
  const fields: ContactField[] = [];

  if (s.email) fields.push({ platform: 'email', displayValue: s.email, href: `mailto:${s.email}`, copyValue: s.email });
  if (s.phoneNumber) fields.push({ platform: 'phone', displayValue: s.phoneNumber, href: `tel:${s.phoneNumber}`, copyValue: s.phoneNumber });
  if (s.linkedinUrl) fields.push({ platform: 'linkedin', displayValue: 'LinkedIn Profile', href: s.linkedinUrl, copyValue: s.linkedinUrl });
  if (s.githubUrl) fields.push({ platform: 'github', displayValue: 'GitHub Profile', href: s.githubUrl, copyValue: s.githubUrl });
  if (s.xUrl) fields.push({ platform: 'x', displayValue: '@thinkaboutjaime', href: s.xUrl, copyValue: s.xUrl });
  if (s.threadsUrl) fields.push({ platform: 'threads', displayValue: 'Threads', href: s.threadsUrl, copyValue: s.threadsUrl });
  if (s.instagramUrl) fields.push({ platform: 'instagram', displayValue: '@jxmsnft', href: s.instagramUrl, copyValue: s.instagramUrl });
  if (s.facebookUrl) fields.push({ platform: 'facebook', displayValue: 'Facebook', href: s.facebookUrl, copyValue: s.facebookUrl });
  if (s.resumeUrl && s.resumeUrl !== '#') fields.push({ platform: 'resume', displayValue: 'Download Resume', href: s.resumeUrl, copyValue: s.resumeUrl });

  return fields;
}

// ─── Contact tile ─────────────────────────────────────────────────────────────

function ContactTile({ field }: { field: ContactField }) {
  const [copied, setCopied] = useState(false);
  const config = PLATFORM_CONFIG[field.platform];

  const handleCopy = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(field.copyValue);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [field.copyValue]);

  if (!config) return null;

  return (
    <a
      href={field.href}
      target={!field.href.startsWith('mailto:') && !field.href.startsWith('tel:') ? '_blank' : undefined}
      rel="noopener noreferrer"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        padding: '14px 16px',
        borderRadius: '16px',
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.06)',
        transition: 'border-color 180ms ease, transform 180ms ease, background 180ms ease',
        textDecoration: 'none',
        color: 'inherit',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = `${config.color}44`;
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
      }}
    >
      {/* Platform icon */}
      <div
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '10px',
          background: `${config.color}18`,
          border: `1px solid ${config.color}30`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: config.color,
          flexShrink: 0,
        }}
      >
        {config.icon}
      </div>

      {/* Text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '3px' }}>
          {config.label}
        </div>
        <div style={{ fontSize: '0.85rem', color: 'var(--text)', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {field.displayValue}
        </div>
      </div>

      {/* Copy button */}
      <button
        onClick={handleCopy}
        aria-label={`Copy ${config.label}`}
        style={{
          width: '30px',
          height: '30px',
          borderRadius: '8px',
          background: copied ? 'rgba(74,222,128,0.15)' : 'rgba(255,255,255,0.05)',
          border: copied ? '1px solid rgba(74,222,128,0.3)' : '1px solid rgba(255,255,255,0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: copied ? '#4ade80' : 'var(--muted)',
          transition: 'all 150ms ease',
          outline: 'none',
          flexShrink: 0,
        }}
      >
        {copied ? (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" stroke="currentColor" strokeWidth="2"/></svg>
        )}
      </button>
    </a>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function ContactsView() {
  const settings: SiteSettings = portfolioData.settings;
  const fields = buildContactFields(settings);

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Hero header */}
      <div
        style={{
          padding: '24px',
          borderRadius: '20px',
          background: 'radial-gradient(ellipse at top right, rgba(231,194,90,0.08) 0%, transparent 50%), rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.06)',
          textAlign: 'center',
        }}
      >
        {/* Avatar */}
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #5e45d4, #d9b047)',
            display: 'grid',
            placeItems: 'center',
            margin: '0 auto 14px',
            fontSize: '1.4rem',
            fontWeight: 800,
            color: '#fff',
            boxShadow: '0 8px 24px rgba(217,176,71,0.2)',
          }}
        >
          {settings.name.charAt(0)}
        </div>
        <h2 style={{ margin: '0 0 4px', fontFamily: '"Space Grotesk", sans-serif', fontSize: '1.4rem', fontWeight: 500, color: 'var(--text)', letterSpacing: '-0.03em' }}>
          {settings.name}
        </h2>
        <p style={{ margin: '0 0 8px', fontSize: '0.88rem', color: 'var(--gold)', fontWeight: 600 }}>
          {settings.role}
        </p>
        <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--muted)', lineHeight: 1.5 }}>
          {settings.location} • {settings.availability}
        </p>
      </div>

      {/* Contact tiles */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {fields.map((field) => (
          <ContactTile key={field.platform} field={field} />
        ))}
      </div>

      {/* Footer note */}
      <p style={{ margin: 0, fontSize: '0.72rem', color: 'var(--muted)', textAlign: 'center', lineHeight: 1.5 }}>
        Tap a link to open, or use the copy button on the right.
      </p>
    </div>
  );
}
