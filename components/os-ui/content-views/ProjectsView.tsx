'use client';

/**
 * ProjectsView — renders all local Project records.
 * Requirements: 5.1, 5.2, 5.7, 5.8, 5.9
 */

import React from 'react';
import { portfolioData } from '@/lib/portfolio-data';
import type { Project } from '@/lib/types';

function Tag({ label, gold }: { label: string; gold?: boolean }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '3px 10px',
        borderRadius: '999px',
        fontSize: '0.74rem',
        fontWeight: 700,
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
        background: gold ? 'rgba(231,194,90,0.08)' : 'rgba(255,255,255,0.04)',
        border: `1px solid ${gold ? 'rgba(231,194,90,0.22)' : 'rgba(255,255,255,0.08)'}`,
        color: gold ? 'var(--gold)' : 'var(--muted)',
      }}
    >
      {label}
    </span>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const hasLinks = Boolean(project.demoUrl || project.repoUrl);

  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: '20px',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}
    >
      {/* Title + status */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', flexWrap: 'wrap' }}>
        <h3 style={{ margin: 0, fontFamily: '"Space Grotesk","Manrope",sans-serif', fontWeight: 500, fontSize: '1.05rem', color: 'var(--text)', letterSpacing: '-0.02em' }}>
          {project.title}
        </h3>
        <Tag label={project.status} gold />
      </div>

      {/* Summary */}
      <p style={{ margin: 0, color: 'var(--muted)', lineHeight: 1.65, fontSize: '0.88rem' }}>
        {project.summary}
      </p>

      {/* Stack tags */}
      {project.stack.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {project.stack.map((tech) => <Tag key={tech} label={tech} />)}
        </div>
      )}

      {/* Links — suppressed entirely if both absent */}
      {hasLinks && (
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '4px' }}>
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--gold)', fontSize: '0.84rem', fontWeight: 600, textDecoration: 'underline', textUnderlineOffset: '3px' }}
            >
              Live demo ↗
            </a>
          )}
          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--muted)', fontSize: '0.84rem', fontWeight: 600, textDecoration: 'underline', textUnderlineOffset: '3px' }}
            >
              Repository ↗
            </a>
          )}
        </div>
      )}
    </div>
  );
}

export function ProjectsView() {
  const data: Project[] = portfolioData.projects;

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto' }}>
      <h2 style={{ margin: '0 0 4px', fontFamily: '"Space Grotesk","Manrope",sans-serif', fontWeight: 500, fontSize: '1.3rem', letterSpacing: '-0.03em', color: 'var(--text)' }}>
        Projects
      </h2>
      {data.map((project, i) => (
        <ProjectCard key={`${project.title}-${i}`} project={project} />
      ))}
    </div>
  );
}
