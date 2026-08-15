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

const proofStories = [
  {
    label: 'Engineering',
    title: 'VEX Robotics World Championship',
    role: 'Notebook Manager · QCU2',
    copy: 'Represented the Philippines on an international robotics stage while documenting the team\'s engineering process, iterations, testing, and decisions.',
    proof: 'Proof trail: competition documentation, team information, and engineering notebook materials.',
  },
  {
    label: 'Community',
    title: 'Microsoft Student Community - QCU',
    role: 'Co-Founder & Executive Vice President',
    copy: 'Helped build a student technology community that brings learning, networking, and technology opportunities closer to QCU students.',
    proof: 'Proof trail: organization page, community events, partnerships, and initiative materials.',
  },
] as const;

const impactTimeline = [
  ['Robotics', 'Represented the Philippines internationally with QCU2.'],
  ['Software', 'Built and shipped AI and full-stack products that are documented in Projects.'],
  ['Community', 'Co-founded MSC-QCU to help bring technology opportunities closer to students.'],
  ['Writing', 'Building a practice of explaining what I learn about AI, engineering, and the Philippine technology ecosystem.'],
] as const;

export function AboutView() {
  const portfolio = usePortfolioData();
  const s: SiteSettings = portfolio.settings;
  const projectCount = portfolio.projects.length;
  const writingCount = portfolio.blogPosts?.length ?? 0;
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

      <section className="about-impact-section">
        <div className="about-section-heading">
          <p className="about-label">Selected impact</p>
          <p>Signals of initiative, execution, and contribution — with room to attach the evidence behind each claim.</p>
        </div>
        <div className="about-impact-grid">
          <article className="about-impact-card about-impact-card-accent">
            <strong>150+</strong>
            <h3>Students reached</h3>
            <p>Through communities, events, and opportunities I helped build or make more accessible.</p>
          </article>
          <article className="about-impact-card">
            <strong>{projectCount}</strong>
            <h3>Projects documented</h3>
            <p>AI, full-stack, learning, and interactive work with a visible path to code and outcomes.</p>
          </article>
          <article className="about-impact-card">
            <strong>1</strong>
            <h3>International robotics championship</h3>
            <p>VEX Robotics World Championship representation with QCU2 and the Philippines.</p>
          </article>
          <article className="about-impact-card">
            <strong>1</strong>
            <h3>Student community co-founded</h3>
            <p>MSC-QCU, focused on bringing technology learning and opportunities closer to students.</p>
          </article>
        </div>
      </section>

      <section className="about-proof-section">
        <div className="about-section-heading">
          <p className="about-label">Proof in context</p>
          <p>Claims are more useful when a reviewer can see the work, the responsibility, and the outcome behind them.</p>
        </div>
        <div className="about-proof-grid">
          {proofStories.map((story) => (
            <article className="about-proof-card" key={story.title}>
              <p className="about-proof-label">{story.label}</p>
              <h3>{story.title}</h3>
              <strong>{story.role}</strong>
              <p>{story.copy}</p>
              <small>{story.proof}</small>
            </article>
          ))}
        </div>
      </section>

      <section className="about-mission-section">
        <div>
          <p className="about-label">What I&apos;m building toward</p>
          <h3>Making technology more accessible while building things that are useful.</h3>
        </div>
        <p>I want to build products, contribute to engineering, and create opportunities that help more Filipino students participate in the technology ecosystem.</p>
      </section>

      <section className="about-timeline-section">
        <div className="about-section-heading">
          <p className="about-label">Impact timeline</p>
          <p>2026 / Building in public</p>
        </div>
        <div className="about-timeline">
          {impactTimeline.map(([label, copy]) => (
            <div className="about-timeline-item" key={label}>
              <span>{label}</span>
              <p>{copy}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="about-writing-section">
        <div>
          <p className="about-label">Writing</p>
          <h3>Build in public. Explain what I learn.</h3>
        </div>
        <p>I write about AI, software engineering, engineering education, robotics, and the Philippine technology ecosystem. {writingCount ? `${writingCount} published note${writingCount === 1 ? '' : 's'} is currently in the portfolio.` : 'New notes will appear here as they are published.'}</p>
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
