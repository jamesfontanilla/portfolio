'use client';

/**
 * ProjectsView renders the project collection and its detail view inside the
 * desktop Projects window. Project details intentionally stay in the OS UI.
 */

import React, { useState } from 'react';
import { useLayoutMode, usePortfolioData } from '../OSUIProvider';
import { buildImageUrl } from '@/lib/image';
import type { PortfolioImage, Project } from '@/lib/types';

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
        minWidth: 0,
        maxWidth: '100%',
        whiteSpace: 'normal',
        overflowWrap: 'anywhere',
      }}
    >
      {label}
    </span>
  );
}

function ProjectImage({ image, eager = false }: { image: PortfolioImage; eager?: boolean }) {
  const url = buildImageUrl(image);
  if (!url) return null;

  return (
    <img
      src={url}
      alt={image.alt}
      loading={eager ? 'eager' : 'lazy'}
      style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover' }}
    />
  );
}

function ProjectCard({ project, onOpen }: { project: Project; onOpen: () => void }) {
  const hasLinks = Boolean(project.demoUrl || project.repoUrl);
  const hasCaseStudy = Boolean(project.role || project.period || project.challenge || project.contribution || project.outcome || project.evidence);
  const previewImage = project.coverImage ?? project.photos?.[0];

  function handleCardClick(event: React.MouseEvent<HTMLElement>) {
    if ((event.target as HTMLElement).closest('a, button')) return;
    onOpen();
  }

  return (
    <article
      data-project-card="true"
      onClick={handleCardClick}
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
      {previewImage && buildImageUrl(previewImage) ? (
        <div style={{ overflow: 'hidden', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.03)' }}>
          <div style={{ aspectRatio: '16 / 9' }}>
            <ProjectImage image={previewImage} />
          </div>
        </div>
      ) : null}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', flexWrap: 'wrap' }}>
        <h3 style={{ margin: 0, fontFamily: '"Space Grotesk","Manrope",sans-serif', fontWeight: 500, fontSize: '1.05rem', color: 'var(--text)', letterSpacing: '-0.02em' }}>
          {project.title}
        </h3>
        <Tag label={project.status} gold />
      </div>

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

      {project.stack.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {project.stack.map((tech) => <Tag key={tech} label={tech} />)}
        </div>
      )}

      {hasLinks && (
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '4px' }}>
          {project.demoUrl && (
            <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" onClick={(event) => event.stopPropagation()} style={{ color: 'var(--gold)', fontSize: '0.84rem', fontWeight: 600, textDecoration: 'underline', textUnderlineOffset: '3px' }}>
              Live demo ↗
            </a>
          )}
          {project.repoUrl && (
            <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" onClick={(event) => event.stopPropagation()} style={{ color: 'var(--muted)', fontSize: '0.84rem', fontWeight: 600, textDecoration: 'underline', textUnderlineOffset: '3px' }}>
              Repository ↗
            </a>
          )}
        </div>
      )}

      <button
        type="button"
        onClick={onOpen}
        style={{ alignSelf: 'flex-start', marginTop: '2px', padding: '0', border: 0, background: 'transparent', color: 'var(--gold)', fontSize: '0.84rem', fontWeight: 700, cursor: 'pointer' }}
      >
        Open case study →
      </button>
    </article>
  );
}

function StoryField({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div style={{ display: 'grid', gap: '5px' }}>
      <strong style={{ color: 'var(--text)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</strong>
      <p style={{ margin: 0, color: 'var(--muted)', lineHeight: 1.65, fontSize: '0.88rem' }}>{value}</p>
    </div>
  );
}

function ProjectDetail({ project, onBack, isMobile }: { project: Project; onBack: () => void; isMobile: boolean }) {
  const gallery = [project.coverImage, ...(project.photos ?? [])].filter(
    (image): image is PortfolioImage => Boolean(image && buildImageUrl(image)),
  );

  return (
    <div data-project-detail="true" style={{ height: isMobile ? 'auto' : '100%', minHeight: isMobile ? '100%' : undefined, overflowY: isMobile ? 'visible' : 'auto', overflowX: 'hidden', boxSizing: 'border-box', minWidth: 0, padding: isMobile ? '16px' : '22px', display: 'flex', flexDirection: 'column', gap: isMobile ? '16px' : '18px' }}>
      <div style={{ display: 'flex', alignItems: isMobile ? 'flex-start' : 'center', justifyContent: 'space-between', gap: '12px', flexDirection: isMobile ? 'column' : 'row', flexWrap: 'wrap', minWidth: 0 }}>
        <button type="button" onClick={onBack} style={{ maxWidth: '100%', padding: '8px 12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', color: 'var(--text)', cursor: 'pointer' }}>
          ← Back to projects
        </button>
        <span style={{ color: 'var(--muted)', fontSize: '0.76rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Project case study</span>
      </div>

      <section data-project-detail-hero="true" style={{ display: 'grid', gridTemplateColumns: isMobile ? 'minmax(0, 1fr)' : 'minmax(0, 1.4fr) minmax(220px, 0.6fr)', gap: isMobile ? '14px' : '20px', padding: isMobile ? '16px' : '22px', borderRadius: '18px', border: '1px solid rgba(255,255,255,0.1)', background: 'linear-gradient(135deg, rgba(112,180,255,0.1), rgba(231,194,90,0.07)), rgba(255,255,255,0.04)', minWidth: 0 }}>
        <div style={{ display: 'grid', gap: '12px', alignContent: 'start', minWidth: 0 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            <Tag label={project.status} gold />
            {project.stack.slice(0, 4).map((item) => <Tag key={item} label={item} />)}
          </div>
          <h2 style={{ margin: 0, maxWidth: isMobile ? '100%' : '14ch', color: 'var(--text)', fontFamily: '"Space Grotesk","Manrope",sans-serif', fontSize: isMobile ? 'clamp(1.8rem, 11vw, 2.8rem)' : 'clamp(1.8rem, 4vw, 3.8rem)', fontWeight: 500, letterSpacing: '-0.06em', lineHeight: 0.96, overflowWrap: 'anywhere' }}>{project.title}</h2>
          <p style={{ margin: 0, color: 'var(--muted)', lineHeight: 1.7, fontSize: '0.92rem', overflowWrap: 'anywhere' }}>{project.summary}</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '4px', minWidth: 0 }}>
            {project.demoUrl && <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--gold)', fontSize: '0.84rem', fontWeight: 700 }}>Open demo ↗</a>}
            {project.repoUrl && <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--muted)', fontSize: '0.84rem', fontWeight: 700 }}>View repository ↗</a>}
          </div>
        </div>
        <div style={{ display: 'grid', alignContent: 'start', gap: '14px', padding: isMobile ? '14px' : '16px', borderRadius: '14px', background: 'rgba(0,0,0,0.14)', border: '1px solid rgba(255,255,255,0.08)', minWidth: 0 }}>
          {project.role && <div style={{ minWidth: 0 }}><span style={{ display: 'block', color: 'var(--muted)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Role</span><strong style={{ display: 'block', marginTop: '4px', lineHeight: 1.4, overflowWrap: 'anywhere' }}>{project.role}</strong></div>}
          {project.period && <div style={{ minWidth: 0 }}><span style={{ display: 'block', color: 'var(--muted)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Period</span><strong style={{ display: 'block', marginTop: '4px', overflowWrap: 'anywhere' }}>{project.period}</strong></div>}
          <div style={{ minWidth: 0 }}><span style={{ display: 'block', color: 'var(--muted)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Impact</span><strong style={{ display: 'block', marginTop: '4px', lineHeight: 1.4, overflowWrap: 'anywhere' }}>{project.impact || 'Documented project work'}</strong></div>
        </div>
      </section>

      {gallery.length > 0 && (
        <section style={{ display: 'grid', gap: '10px', minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'end', flexDirection: isMobile ? 'column' : 'row', gap: '8px 12px', flexWrap: 'wrap', minWidth: 0 }}>
            <div><span style={{ display: 'block', color: 'var(--gold)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Visual notes</span><h3 style={{ margin: '4px 0 0', fontSize: '1.15rem', fontWeight: 500 }}>Project photos</h3></div>
            <span style={{ color: 'var(--muted)', fontSize: '0.78rem' }}>{gallery.length} {gallery.length === 1 ? 'photo' : 'photos'}</span>
          </div>
          <div data-project-gallery-grid="true" style={{ display: 'grid', gridTemplateColumns: gallery.length === 1 || isMobile ? 'minmax(0, 1fr)' : 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px', minWidth: 0 }}>
            {gallery.map((image, index) => (
              <figure key={`${buildImageUrl(image)}-${index}`} style={{ margin: 0, minWidth: 0, overflow: 'hidden', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)' }}>
                <div style={{ aspectRatio: gallery.length === 1 ? '16 / 8' : '16 / 10' }}><ProjectImage image={image} eager={index === 0} /></div>
                <figcaption style={{ padding: '8px 10px', color: 'var(--muted)', fontSize: '0.75rem', overflowWrap: 'anywhere' }}>{image.alt}</figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}

      <section data-project-story-grid="true" style={{ display: 'grid', gridTemplateColumns: isMobile ? 'minmax(0, 1fr)' : 'minmax(0, 1.3fr) minmax(220px, 0.7fr)', gap: isMobile ? '12px' : '14px', minWidth: 0 }}>
        <article style={{ display: 'grid', gap: '16px', padding: isMobile ? '16px' : '20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.035)', minWidth: 0 }}>
          <div><span style={{ color: 'var(--gold)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>The story</span><h3 style={{ margin: '4px 0 0', fontSize: '1.25rem', fontWeight: 500 }}>From challenge to outcome</h3></div>
          <div style={{ display: 'grid', gap: '16px' }}>
            <StoryField label="Challenge" value={project.challenge} />
            <StoryField label="Contribution" value={project.contribution} />
            <StoryField label="Outcome" value={project.outcome} />
            <StoryField label="Evidence" value={project.evidence} />
            {!project.challenge && !project.contribution && !project.outcome && !project.evidence ? <p style={{ margin: 0, color: 'var(--muted)', fontSize: '0.88rem' }}>Add the project story in the admin studio to expand this case study.</p> : null}
          </div>
        </article>
        <aside style={{ display: 'grid', alignContent: 'start', gap: '14px', padding: isMobile ? '16px' : '20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.035)', minWidth: 0 }}>
          <div><span style={{ color: 'var(--gold)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Built with</span><h3 style={{ margin: '4px 0 0', fontSize: '1.25rem', fontWeight: 500 }}>Tools and technologies</h3></div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>{project.stack.map((item) => <Tag key={item} label={item} />)}</div>
        </aside>
      </section>
    </div>
  );
}

export function ProjectsView() {
  const data: Project[] = usePortfolioData().projects;
  const isMobile = useLayoutMode() === 'mobile';
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  if (selectedProject) {
    return <ProjectDetail project={selectedProject} isMobile={isMobile} onBack={() => setSelectedProject(null)} />;
  }

  return (
    <div style={{ height: isMobile ? 'auto' : '100%', overflowY: isMobile ? 'visible' : 'auto', overflowX: 'hidden', boxSizing: 'border-box', minWidth: 0, padding: isMobile ? '16px' : '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', gap: '12px' }}>
        <div>
          <span style={{ display: 'block', color: 'var(--gold)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Work archive</span>
          <h2 style={{ margin: '5px 0 0', fontFamily: '"Space Grotesk","Manrope",sans-serif', fontWeight: 500, fontSize: '1.5rem', letterSpacing: '-0.04em', color: 'var(--text)' }}>Projects</h2>
        </div>
        <span style={{ color: 'var(--muted)', fontSize: '0.78rem' }}>{data.length} projects</span>
      </div>
      <p style={{ margin: 0, color: 'var(--muted)', lineHeight: 1.6, fontSize: '0.86rem' }}>Select a project to open its case study inside this window.</p>
      {data.map((project, i) => <ProjectCard key={`${project.title}-${i}`} project={project} onOpen={() => setSelectedProject(project)} />)}
    </div>
  );
}
