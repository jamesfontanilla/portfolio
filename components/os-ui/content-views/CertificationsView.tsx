'use client';

/**
 * CertificationsView — renders all Certification records from Sanity.
 * Dates formatted as "Month YYYY" using Intl.DateTimeFormat.
 * Requirements: 5.1, 5.3, 5.7, 5.8, 5.9
 */

import React from 'react';
import { useSanityData } from '@/hooks/useSanityData';
import { getHomeData } from '@/lib/cms';
import type { Certification } from '@/lib/types';
import { SkeletonView } from './SkeletonView';
import { ErrorView } from './ErrorView';

/**
 * Formats a date string (ISO or YYYY-MM-DD) as "Month YYYY".
 * e.g. "2024-03-15" → "March 2024"
 */
export function formatMonthYear(dateString: string): string {
  try {
    const date = new Date(dateString);
    // Add timezone offset to avoid off-by-one day issues with UTC dates
    const adjusted = new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000);
    return new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(adjusted);
  } catch {
    return dateString;
  }
}

function CertificationCard({ cert }: { cert: Certification }) {
  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: '20px',
        padding: '18px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', flexWrap: 'wrap' }}>
        <h3 style={{ margin: 0, fontFamily: '"Space Grotesk","Manrope",sans-serif', fontWeight: 500, fontSize: '1rem', color: 'var(--text)', letterSpacing: '-0.02em' }}>
          {cert.title}
        </h3>
        <span style={{ color: 'var(--muted)', fontSize: '0.82rem', flexShrink: 0 }}>
          {formatMonthYear(cert.earnedOn)}
        </span>
      </div>

      <p style={{ margin: 0, color: 'var(--muted)', fontSize: '0.86rem' }}>
        {cert.issuer}
      </p>

      {cert.verificationUrl && (
        <a
          href={cert.verificationUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'var(--gold)', fontSize: '0.82rem', fontWeight: 600, textDecoration: 'underline', textUnderlineOffset: '3px', alignSelf: 'flex-start' }}
        >
          Verify ↗
        </a>
      )}
    </div>
  );
}

export function CertificationsView() {
  const { data, loading, error, refetch } = useSanityData<Certification[]>(
    async () => {
      const home = await getHomeData();
      return home.certifications;
    },
    'certifications',
  );

  if (loading) return <SkeletonView />;
  if (error) return <ErrorView message={error.message} onRetry={refetch} />;
  if (!data) return <SkeletonView />;

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <h2 style={{ margin: '0 0 4px', fontFamily: '"Space Grotesk","Manrope",sans-serif', fontWeight: 500, fontSize: '1.3rem', letterSpacing: '-0.03em', color: 'var(--text)' }}>
        Certifications
      </h2>
      {data.map((cert, i) => (
        <CertificationCard key={`${cert.title}-${i}`} cert={cert} />
      ))}
    </div>
  );
}
