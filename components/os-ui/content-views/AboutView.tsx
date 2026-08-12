'use client';

/**
 * AboutView — renders portfolio owner info from SiteSettings.
 *
 * Fields: name, role, tagline, summary, bio, location, availability
 * Requirements: 5.1, 5.6, 5.7, 5.8, 5.9
 */

import React from 'react';
import { portfolioData } from '@/lib/portfolio-data';
import type { SiteSettings } from '@/lib/types';

const cardStyle: React.CSSProperties = {
  background: 'rgba(255, 255, 255, 0.04)',
  border: '1px solid rgba(255, 255, 255, 0.07)',
  borderRadius: '16px',
  padding: '16px 20px',
};

export function AboutView() {
  const s: SiteSettings = portfolioData.settings;

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Name + role */}
      <div>
        <h2
          style={{
            margin: '0 0 6px',
            fontFamily: '"Space Grotesk", "Manrope", sans-serif',
            fontWeight: 500,
            fontSize: '1.6rem',
            letterSpacing: '-0.04em',
            color: 'var(--text)',
          }}
        >
          {s.name}
        </h2>
        <p style={{ margin: 0, color: 'var(--gold)', fontWeight: 600, fontSize: '0.9rem' }}>
          {s.role}
        </p>
      </div>

      {/* Tagline */}
      {s.tagline && (
        <p
          style={{
            margin: 0,
            color: 'var(--muted)',
            fontSize: '1rem',
            lineHeight: 1.6,
            fontStyle: 'italic',
          }}
        >
          {s.tagline}
        </p>
      )}

      {/* Summary */}
      {s.summary && (
        <div style={cardStyle}>
          <p style={{ margin: 0, color: 'var(--text)', lineHeight: 1.7, fontSize: '0.92rem' }}>
            {s.summary}
          </p>
        </div>
      )}

      {/* Bio */}
      {s.bio && (
        <div>
          <h3
            style={{
              margin: '0 0 8px',
              fontFamily: '"Space Grotesk", "Manrope", sans-serif',
              fontSize: '0.8rem',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--muted)',
            }}
          >
            About
          </h3>
          <p style={{ margin: 0, color: 'var(--text)', lineHeight: 1.7, fontSize: '0.92rem' }}>
            {s.bio}
          </p>
        </div>
      )}

      {/* Location + availability */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        {s.location && (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '999px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              color: 'var(--muted)',
              fontSize: '0.82rem',
            }}
          >
            📍 {s.location}
          </span>
        )}
        {s.availability && (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '999px',
              background: 'rgba(231, 194, 90, 0.08)',
              border: '1px solid rgba(231, 194, 90, 0.22)',
              color: 'var(--gold)',
              fontSize: '0.82rem',
              fontWeight: 600,
            }}
          >
            ✦ {s.availability}
          </span>
        )}
      </div>
    </div>
  );
}
