'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import type { HomeData } from '@/lib/types';
import type { ContentType } from '@/store/windowManagerStore';
import { contentTypeLabel } from './AppIcon';

type StartMenuVariant = 'desktop' | 'mobile';

interface StartMenuProps {
  data: HomeData;
  variant?: StartMenuVariant;
  onOpenApp: (type: ContentType) => void;
  onRefresh?: () => void;
}

const ALL_APPS: { type: ContentType; description: string; glyph: string }[] = [
  { type: 'projects', description: 'Browse the work archive', glyph: 'P' },
  { type: 'about', description: 'Meet James', glyph: 'A' },
  { type: 'tech-stack', description: 'Tools behind the work', glyph: 'TS' },
  { type: 'task-manager', description: 'Monitor this workspace', glyph: 'TM' },
  { type: 'contacts', description: 'Start a conversation', glyph: 'C' },
  { type: 'settings', description: 'Tune this desktop', glyph: '⚙' },
  { type: 'competitions', description: 'See the field record', glyph: '🏆' },
  { type: 'certifications', description: 'Browse credentials', glyph: '✓' },
  { type: 'events', description: 'Timeline and appearances', glyph: 'E' },
  { type: 'blog', description: 'Read the notes', glyph: 'B' },
];

const PINNED_APPS = ALL_APPS.slice(0, 5);

function StartMark() {
  return <span className="start-mark" aria-hidden="true">JF</span>;
}

function StartAppGlyph({ type, glyph }: { type: ContentType; glyph: string }) {
  return <span className={`start-app-glyph start-app-glyph-${type}`}>{glyph}</span>;
}

export function StartMenu({ data, variant = 'desktop', onOpenApp, onRefresh }: StartMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [showAllApps, setShowAllApps] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const normalizedQuery = query.trim().toLowerCase();

  const appResults = useMemo(
    () => ALL_APPS.filter((app) => {
      const searchable = `${contentTypeLabel[app.type]} ${app.description}`.toLowerCase();
      return !normalizedQuery || searchable.includes(normalizedQuery);
    }),
    [normalizedQuery],
  );

  const contentResults = useMemo(() => {
    if (!normalizedQuery) return [];
    return data.projects
      .filter((project) => `${project.title} ${project.summary} ${project.stack.join(' ')}`.toLowerCase().includes(normalizedQuery))
      .slice(0, 3);
  }, [data.projects, normalizedQuery]);

  useEffect(() => {
    if (!isOpen) return;

    function handlePointerDown(event: PointerEvent) {
      if (!containerRef.current?.contains(event.target as Node)) setIsOpen(false);
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setIsOpen(false);
    }

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  function closeMenu() {
    setIsOpen(false);
    setQuery('');
    setShowAllApps(false);
  }

  function openApp(type: ContentType) {
    closeMenu();
    onOpenApp(type);
  }

  const latestProject = data.projects[0];
  const latestPost = data.blogPosts?.[0];

  return (
    <div className={`start-menu-container start-menu-${variant}`} ref={containerRef}>
      <button
        type="button"
        className="start-menu-trigger"
        aria-label={isOpen ? 'Close Start menu' : 'Open Start menu'}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
      >
        <StartMark />
        <span className="start-menu-trigger-label">Start</span>
        <svg className="start-menu-trigger-chevron" width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="m7 10 5 5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {isOpen && (
        <div className="start-menu-panel liquid-glass-surface" role="dialog" aria-label="Start menu">
          <div className="start-menu-heading">
            <div className="start-menu-profile">
              <StartMark />
              <span><strong>{data.settings.name}</strong><small>{data.settings.role}</small></span>
            </div>
            <span className="start-menu-system-label">Portfolio OS</span>
          </div>

          <label className="start-menu-search">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.7" />
              <path d="m16 16 4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
            </svg>
            <input
              value={query}
              onChange={(event) => { setQuery(event.target.value); setShowAllApps(false); }}
              placeholder="Search apps and projects"
              aria-label="Search apps and projects"
              autoFocus
            />
            {query && <button type="button" aria-label="Clear Start search" onClick={() => setQuery('')}>×</button>}
          </label>

          {normalizedQuery || showAllApps ? (
            <div className="start-menu-search-results">
              <span className="start-menu-section-label">{normalizedQuery ? 'Search results' : 'All apps'}</span>
              {appResults.map((app) => (
                <button type="button" className="start-menu-result" key={app.type} onClick={() => openApp(app.type)}>
                  <StartAppGlyph type={app.type} glyph={app.glyph} />
                  <span><strong>{contentTypeLabel[app.type]}</strong><small>{app.description}</small></span>
                  <span className="start-menu-result-arrow" aria-hidden="true">↗</span>
                </button>
              ))}
              {contentResults.map((project) => (
                <button type="button" className="start-menu-result" key={project.title} onClick={() => openApp('projects')}>
                  <span className="start-content-glyph" aria-hidden="true">⌁</span>
                  <span><strong>{project.title}</strong><small>Project in Projects</small></span>
                  <span className="start-menu-result-arrow" aria-hidden="true">↗</span>
                </button>
              ))}
              {appResults.length === 0 && contentResults.length === 0 && (
                <div className="start-menu-empty"><strong>No matches</strong><span>Try a project name, “contact”, or “settings”.</span></div>
              )}
            </div>
          ) : (
            <>
              <div className="start-menu-section-heading"><span>Pinned</span><button type="button" onClick={() => setShowAllApps(true)}>All apps <span aria-hidden="true">›</span></button></div>
              <div className="start-menu-pinned">
                {PINNED_APPS.map((app) => (
                  <button type="button" className="start-menu-app" key={app.type} onClick={() => openApp(app.type)}>
                    <StartAppGlyph type={app.type} glyph={app.glyph} />
                    <span>{contentTypeLabel[app.type]}</span>
                  </button>
                ))}
              </div>

              <div className="start-menu-section-heading start-menu-recommended-heading"><span>Recommended</span><span className="start-menu-muted-label">Recent signals</span></div>
              <div className="start-menu-recommended">
                {latestProject && (
                  <button type="button" className="start-menu-recommended-item" onClick={() => openApp('projects')}>
                    <span className="start-recommended-icon" aria-hidden="true">↗</span>
                    <span><strong>{latestProject.title}</strong><small>Latest project</small></span>
                  </button>
                )}
                {latestPost && (
                  <button type="button" className="start-menu-recommended-item" onClick={() => openApp('blog')}>
                    <span className="start-recommended-icon" aria-hidden="true">✎</span>
                    <span><strong>{latestPost.title}</strong><small>Latest writing</small></span>
                  </button>
                )}
                {!latestProject && !latestPost && <span className="start-menu-empty-inline">Your latest work will appear here.</span>}
              </div>
            </>
          )}

          <div className="start-menu-footer">
            <span className="start-menu-location"><span className="start-menu-status-dot" />{data.settings.location}</span>
            <div className="start-menu-quick-actions">
              {data.settings.resumeUrl && <a href={data.settings.resumeUrl} target="_blank" rel="noopener noreferrer" onClick={closeMenu}>Résumé ↗</a>}
              <button type="button" onClick={() => openApp('contacts')}>Contact</button>
              <button type="button" onClick={() => openApp('settings')}>Settings</button>
              {onRefresh && <button type="button" aria-label="Refresh portfolio" onClick={() => { closeMenu(); onRefresh(); }}>↻</button>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
