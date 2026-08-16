'use client';

import React from 'react';
import { usePortfolioData } from '../OSUIProvider';
import type { Competition } from '@/lib/types';

function Tag({ label, gold = false }: { label: string; gold?: boolean }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '3px 10px',
        borderRadius: '999px',
        fontSize: '0.72rem',
        fontWeight: 700,
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
        background: gold ? 'rgba(231,194,90,0.1)' : 'rgba(255,255,255,0.04)',
        border: `1px solid ${gold ? 'rgba(231,194,90,0.24)' : 'rgba(255,255,255,0.08)'}`,
        color: gold ? 'var(--gold)' : 'var(--muted)',
      }}
    >
      {label}
    </span>
  );
}

function CompetitionCard({ competition, index }: { competition: Competition; index: number }) {
  const hasDetails = Boolean(competition.role || competition.period || competition.challenge || competition.contribution || competition.outcome || competition.evidence);

  return (
    <article
      style={{
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(145deg, rgba(231,194,90,0.1), rgba(255,255,255,0.035) 42%, rgba(255,255,255,0.025))',
        border: '1px solid rgba(231,194,90,0.2)',
        borderRadius: '22px',
        padding: '22px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
      }}
    >
      <div style={{ position: 'absolute', top: '-42px', right: '-28px', width: '140px', height: '140px', borderRadius: '50%', border: '1px solid rgba(231,194,90,0.18)', boxShadow: '0 0 0 18px rgba(231,194,90,0.025), 0 0 0 36px rgba(231,194,90,0.018)' }} aria-hidden="true" />
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
        <div style={{ display: 'flex', gap: '12px', minWidth: 0 }}>
          <span style={{ color: 'var(--gold)', fontFamily: '"Space Grotesk","Manrope",sans-serif', fontSize: '0.76rem', fontWeight: 700, letterSpacing: '0.08em' }}>{String(index + 1).padStart(2, '0')}</span>
          <div>
            <p style={{ margin: '0 0 5px', color: 'var(--gold)', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Competition log</p>
            <h3 style={{ margin: 0, color: 'var(--text)', fontFamily: '"Space Grotesk","Manrope",sans-serif', fontSize: '1.05rem', fontWeight: 500, letterSpacing: '-0.02em' }}>{competition.title}</h3>
          </div>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-end', gap: '6px' }}>
          <Tag label={competition.status} gold />
          {competition.period ? <Tag label={competition.period} /> : null}
        </div>
      </div>

      <p style={{ margin: 0, color: 'var(--muted)', lineHeight: 1.65, fontSize: '0.88rem' }}>{competition.summary}</p>

      {hasDetails ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingTop: '14px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          {(competition.role || competition.period) ? (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 18px', color: 'var(--muted)', fontSize: '0.78rem' }}>
              {competition.role ? <span><strong style={{ color: 'var(--text)' }}>Role</strong> {competition.role}</span> : null}
              {competition.period ? <span><strong style={{ color: 'var(--text)' }}>Season</strong> {competition.period}</span> : null}
            </div>
          ) : null}
          {competition.challenge ? <div><strong style={{ display: 'block', marginBottom: '4px', color: 'var(--text)', fontSize: '0.76rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Challenge</strong><p style={{ margin: 0, color: 'var(--muted)', fontSize: '0.84rem', lineHeight: 1.6 }}>{competition.challenge}</p></div> : null}
          {competition.contribution ? <div><strong style={{ display: 'block', marginBottom: '4px', color: 'var(--text)', fontSize: '0.76rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Contribution</strong><p style={{ margin: 0, color: 'var(--muted)', fontSize: '0.84rem', lineHeight: 1.6 }}>{competition.contribution}</p></div> : null}
          {competition.outcome ? <div><strong style={{ display: 'block', marginBottom: '4px', color: 'var(--text)', fontSize: '0.76rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Outcome</strong><p style={{ margin: 0, color: 'var(--muted)', fontSize: '0.84rem', lineHeight: 1.6 }}>{competition.outcome}</p></div> : null}
          {competition.evidence ? <p style={{ margin: 0, color: 'var(--gold)', fontSize: '0.8rem', lineHeight: 1.55 }}>Evidence trail: {competition.evidence}</p> : null}
        </div>
      ) : null}

      {competition.impact ? <p style={{ margin: 0, padding: '10px 12px', borderRadius: '10px', background: 'rgba(231,194,90,0.07)', color: 'var(--text)', lineHeight: 1.55, fontSize: '0.82rem' }}>{competition.impact}</p> : null}

      {competition.tags.length > 0 ? <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>{competition.tags.map((tag) => <Tag key={tag} label={tag} />)}</div> : null}
    </article>
  );
}

export function CompetitionsView() {
  const data = usePortfolioData().competitions;

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px', overflowY: 'auto' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginBottom: '2px' }}>
        <p style={{ margin: 0, color: 'var(--gold)', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Field notes</p>
        <h2 style={{ margin: 0, color: 'var(--text)', fontFamily: '"Space Grotesk","Manrope",sans-serif', fontSize: '1.3rem', fontWeight: 500, letterSpacing: '-0.03em' }}>Competitions</h2>
        <p style={{ margin: 0, color: 'var(--muted)', fontSize: '0.84rem', lineHeight: 1.55 }}>Engineering, teamwork, and proof from the moments where the work had to perform.</p>
      </div>
      {data.map((competition, index) => <CompetitionCard key={`${competition.title}-${index}`} competition={competition} index={index} />)}
    </div>
  );
}
