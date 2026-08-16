'use client';

/**
 * ProjectsView — renders all local Project records.
 * Requirements: 5.1, 5.2, 5.7, 5.8, 5.9
 */

import React from 'react';
import Link from 'next/link';
import { usePortfolioData } from '../OSUIProvider';
import { buildImageUrl } from '@/lib/image';
import { getProjectSlug } from '@/lib/project';
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
  const hasCaseStudy = Boolean(project.role || project.period || project.challenge || project.contribution || project.outcome || project.evidence);
  const detailHref = `/projects/${getProjectSlug(project)}`;
  const previewImage = project.coverImage ?? project.photos?.[0];
  const previewImageUrl = previewImage ? buildImageUrl(previewImage) : '';

  function openProject(event: React.MouseEvent<HTMLDivElement>) {
    if ((event.target as HTMLElement).closest('a')) return;
    window.location.href = detailHref;
  }

  function openProjectWithKeyboard(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      window.location.href = detailHref;
    }
  }

  return (
    <div
      role="link"
      tabIndex={0}
      aria-label={`Open ${project.title} case study`}
      onClick={openProject}
      onKeyDown={openProjectWithKeyboard}
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: '20px',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        cursor: 'pointer',
        transition: 'transform 180ms ease, border-color 180ms ease, background 180ms ease',
      }}
    >
      {previewImageUrl && (
        <div style={{ overflow: 'hidden', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.03)' }}>
          <img
            src={previewImageUrl}
            alt={previewImage?.alt ?? `${project.title} preview`}
            loading="lazy"
            style={{ display: 'block', width: '100%', aspectRatio: '16 / 9', objectFit: 'cover' }}
          />
        </div>
      )}

      {/* Title + status */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', flexWrap: 'wrap' }}>
        <h3 style={{ margin: 0, fontFamily: '"Space Grotesk","Manrope",sans-serif', fontWeight: 500, fontSize: '1.05rem', color: 'var(--text)', letterSpacing: '-0.02em' }}>
          <Link href={detailHref} style={{ color: 'inherit' }}>
            {project.title}
          </Link>
        </h3>
        <Tag label={project.status} gold />
      </div>

      {/* Summary */}
      <p style={{ margin: 0, color: 'var(--muted)', lineHeight: 1.65, fontSize: '0.88rem' }}>
        {project.summary}
      </p>

      {hasCaseStudy && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '14px 0 2px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          {(project.role || project.period) && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 18px', color: 'var(--muted)', fontSize: '0.78rem' }}>
              {project.role && <span><strong style={{ color: 'var(--text)' }}>Role</strong> {project.role}</span>}
              {project.period && <span><strong style={{ color: 'var(--text)' }}>Period</strong> {project.period}</span>}
            </div>
          )}
          {project.challenge && <div><strong style={{ display: 'block', marginBottom: '4px', color: 'var(--text)', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Context</strong><p style={{ margin: 0, color: 'var(--muted)', lineHeight: 1.6, fontSize: '0.84rem' }}>{project.challenge}</p></div>}
          {project.contribution && <div><strong style={{ display: 'block', marginBottom: '4px', color: 'var(--text)', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Contribution</strong><p style={{ margin: 0, color: 'var(--muted)', lineHeight: 1.6, fontSize: '0.84rem' }}>{project.contribution}</p></div>}
          {project.outcome && <div><strong style={{ display: 'block', marginBottom: '4px', color: 'var(--text)', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Outcome</strong><p style={{ margin: 0, color: 'var(--muted)', lineHeight: 1.6, fontSize: '0.84rem' }}>{project.outcome}</p></div>}
          {project.evidence && <p style={{ margin: 0, color: 'var(--gold)', lineHeight: 1.55, fontSize: '0.8rem' }}>Evidence trail: {project.evidence}</p>}
        </div>
      )}

      {project.impact && (
        <p style={{ margin: 0, padding: '10px 12px', borderRadius: '10px', background: 'rgba(231,194,90,0.06)', color: 'var(--text)', lineHeight: 1.55, fontSize: '0.82rem' }}>
          {project.impact}
        </p>
      )}

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

      <Link
        href={detailHref}
        style={{ color: 'var(--gold)', fontSize: '0.84rem', fontWeight: 700, marginTop: '2px' }}
      >
        Open case study →
      </Link>
    </div>
  );
}

export function ProjectsView() {
  const data: Project[] = usePortfolioData().projects;

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
