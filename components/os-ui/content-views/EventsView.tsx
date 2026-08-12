'use client';

/**
 * EventsView — renders all local PortfolioEvent records.
 * Dates formatted as "Month D, YYYY" (e.g. "March 15, 2024").
 * Requirements: 5.1, 5.4, 5.7, 5.8, 5.9
 */

import React from 'react';
import { portfolioData } from '@/lib/portfolio-data';
import type { PortfolioEvent } from '@/lib/types';

/**
 * Formats a date string as "Month D, YYYY".
 * e.g. "2024-03-15" → "March 15, 2024"
 */
export function formatEventDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    const adjusted = new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000);
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }).format(adjusted);
  } catch {
    return dateString;
  }
}

function EventCard({ event }: { event: PortfolioEvent }) {
  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: '20px',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
      }}
    >
      {/* Header row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', flexWrap: 'wrap' }}>
        <div>
          <h3 style={{ margin: '0 0 4px', fontFamily: '"Space Grotesk","Manrope",sans-serif', fontWeight: 500, fontSize: '1rem', color: 'var(--text)', letterSpacing: '-0.02em' }}>
            {event.title}
          </h3>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
            <span
              style={{
                display: 'inline-block',
                padding: '2px 8px',
                borderRadius: '999px',
                fontSize: '0.72rem',
                fontWeight: 700,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                background: 'rgba(231,194,90,0.08)',
                border: '1px solid rgba(231,194,90,0.22)',
                color: 'var(--gold)',
              }}
            >
              {event.type}
            </span>
            {event.location && (
              <span style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>📍 {event.location}</span>
            )}
          </div>
        </div>
        <span style={{ color: 'var(--muted)', fontSize: '0.82rem', flexShrink: 0 }}>
          {formatEventDate(event.date)}
        </span>
      </div>

      {/* Summary */}
      <p style={{ margin: 0, color: 'var(--muted)', lineHeight: 1.65, fontSize: '0.88rem' }}>
        {event.summary}
      </p>
    </div>
  );
}

export function EventsView() {
  const data: PortfolioEvent[] = portfolioData.events;

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <h2 style={{ margin: '0 0 4px', fontFamily: '"Space Grotesk","Manrope",sans-serif', fontWeight: 500, fontSize: '1.3rem', letterSpacing: '-0.03em', color: 'var(--text)' }}>
        Events
      </h2>
      {data.map((event, i) => (
        <EventCard key={`${event.title}-${i}`} event={event} />
      ))}
    </div>
  );
}
