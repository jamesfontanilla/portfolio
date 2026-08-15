'use client';

/**
 * AboutView — a compact narrative view of the portfolio owner's work.
 *
 * Profile copy is CMS-backed through SiteSettings. The focus cards and
 * through-lines give that copy a visual structure without turning the page
 * into a resume dump.
 */

import React from 'react';
import { usePortfolioData } from '../OSUIProvider';
import type { SiteSettings } from '@/lib/types';

const focusAreas = [
  {
    label: 'AI & software',
    copy: 'Build AI-powered applications, full-stack platforms, and developer tools.',
  },
  {
    label: 'Engineering',
    copy: 'Apply software and hardware thinking to real-world problems, including robotics.',
  },
  {
    label: 'Community',
    copy: 'Create learning spaces, organize opportunities, and connect students with the wider technology ecosystem.',
  },
  {
    label: 'Writing',
    copy: 'Document what I learn about engineering, AI, software, and the Philippine tech ecosystem.',
  },
];

const storyPillars = [
  ['01', 'Builder', 'AI and full-stack products, SaaS experiments, and software that people can use.'],
  ['02', 'Engineer', 'Computer Engineering, robotics, and the habit of understanding how things work.'],
  ['03', 'Competitor', 'Hackathons and an international robotics stage with QCU2.'],
  ['04', 'Community builder', 'Technology communities that make opportunities more reachable for students.'],
  ['05', 'Writer', 'Notes on AI, engineering, software, and the Filipino technology ecosystem.'],
] as const;

export function AboutView() {
  const s: SiteSettings = usePortfolioData().settings;
  const bioParagraphs = s.bio.split(/\n\s*\n/).map((paragraph) => paragraph.trim()).filter(Boolean);

  return (
    <div className="about-view">
      <header className="about-hero-block">
        <div className="about-hero-copy">
          <p className="about-kicker">{s.intro || 'Build / Engineer / Contribute'}</p>
          <h2>{s.name}</h2>
          <p className="about-role">{s.role}</p>
          {s.tagline ? <p className="about-tagline">{s.tagline}</p> : null}
        </div>

        <div className="about-triad" aria-label="Build, Engineer, Contribute">
          {['Build', 'Engineer', 'Contribute'].map((step, index) => (
            <div className="about-triad-step" key={step}>
              <span>0{index + 1}</span>
              <strong>{step}</strong>
            </div>
          ))}
        </div>
      </header>

      {s.summary ? (
        <section className="about-thesis">
          <p className="about-label">At a glance</p>
          <p className="about-thesis-copy">{s.summary}</p>
        </section>
      ) : null}

      <div className="about-main-grid">
        {bioParagraphs.length ? (
          <section className="about-copy-card">
            <p className="about-label">About</p>
            <div className="about-bio">
              {bioParagraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
          </section>
        ) : null}

        <aside className="about-side-card">
          <p className="about-label">Currently</p>
          {s.availability ? (
            <p className="about-status">
              <span className="about-status-dot" aria-hidden="true" />
              {s.availability}
            </p>
          ) : null}
          <div className="about-detail-list">
            {s.location ? <div><span>Based in</span><strong>{s.location}</strong></div> : null}
            <div><span>Exploring</span><strong>AI, software, robotics, communities</strong></div>
          </div>
        </aside>
      </div>

      <section className="about-focus-section">
        <div className="about-section-heading">
          <p className="about-label">What I do</p>
          <p>Turning what I learn into products, engineering work, and openings for other people.</p>
        </div>
        <div className="about-focus-grid">
          {focusAreas.map((area) => (
            <article className="about-focus-card" key={area.label}>
              <h3>{area.label}</h3>
              <p>{area.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="about-story-section">
        <p className="about-label">Through-lines</p>
        <div className="about-pillars-grid">
          {storyPillars.map(([number, label, copy]) => (
            <article className="about-pillar" key={label}>
              <span>{number}</span>
              <h3>{label}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <div className="about-meta" aria-label="Profile details">
        {s.location ? <span>{s.location}</span> : null}
        {s.availability ? <span className="about-meta-accent">{s.availability}</span> : null}
      </div>
    </div>
  );
}
