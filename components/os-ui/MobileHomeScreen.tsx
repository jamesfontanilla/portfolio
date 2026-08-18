'use client';

/**
 * MobileHomeScreen — an iPhone-inspired launcher for the portfolio OS.
 * The launcher uses fixed 4 × 6 app pages and supports horizontal swipes.
 */

import React, { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import type { ContentType } from '@/store/windowManagerStore';
import { contentTypeLabel } from './AppIcon';
import { usePortfolioData } from './OSUIProvider';

function AppGridIcon({ type }: { type: ContentType }) {
  const s = 28;

  switch (type) {
    case 'about':
      return (<svg width={s} height={s} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.6"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>);
    case 'projects':
      return (<svg width={s} height={s} viewBox="0 0 24 24" fill="none"><rect x="3" y="7" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.6"/><path d="M3 11h18M8 7V5a1 1 0 011-1h6a1 1 0 011 1v2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>);
    case 'competitions':
      return (<svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M7 4h10v4a5 5 0 01-10 0V4Z" stroke="currentColor" strokeWidth="1.6"/><path d="M7 6H4v1a4 4 0 004 4M17 6h3v1a4 4 0 01-4 4M12 13v4M8 20h8M9 17h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>);
    case 'certifications':
      return (<svg width={s} height={s} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="10" r="5" stroke="currentColor" strokeWidth="1.6"/><path d="M9 21l3-3 3 3V15.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>);
    case 'events':
      return (<svg width={s} height={s} viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.6"/><path d="M3 10h18M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>);
    case 'contacts':
      return (<svg width={s} height={s} viewBox="0 0 24 24" fill="none"><rect x="3" y="6" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="1.6"/><path d="M3 9l9 6 9-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>);
    case 'blog':
      return (<svg width={s} height={s} viewBox="0 0 24 24" fill="none"><rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="1.6"/><path d="M8 8h8M8 12h6M8 16h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>);
    case 'tech-stack':
      return (<svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M5 7h14M5 12h14M5 17h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/><circle cx="9" cy="7" r="2" fill="var(--gold)" stroke="currentColor" strokeWidth="1.1"/><circle cx="15" cy="12" r="2" fill="var(--gold)" stroke="currentColor" strokeWidth="1.1"/><circle cx="11" cy="17" r="2" fill="var(--gold)" stroke="currentColor" strokeWidth="1.1"/></svg>);
    case 'task-manager':
      return (<svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M5 19V10M12 19V5M19 19v-7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/><path d="M3.5 19h17" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/><path d="M5 10l2.5-2 2 1.5L12 5l2.5 3 2-1.5L19 12" stroke="var(--gold)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>);
    case 'settings':
      return (<svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.64 5.64l1.42 1.42M16.94 16.94l1.42 1.42M18.36 5.64l-1.42 1.42M7.06 16.94l-1.42 1.42" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/><circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.7"/><circle cx="12" cy="12" r="1.2" fill="var(--gold)"/></svg>);
  }
}

const HOME_PAGES: { label: string; apps: ContentType[] }[] = [
  { label: 'Portfolio', apps: ['about', 'projects', 'competitions', 'certifications', 'events'] },
  { label: 'More', apps: ['contacts', 'blog', 'tech-stack', 'task-manager', 'settings'] },
];

const PAGE_SLOTS = 24;

interface MobileHomeScreenProps {
  onOpenApp: (type: ContentType) => void;
}

export function MobileHomeScreen({ onOpenApp }: MobileHomeScreenProps) {
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');
  const [page, setPage] = useState(0);
  const pointerStartX = useRef<number | null>(null);
  const reducedMotion = useReducedMotion();
  const { settings } = usePortfolioData();

  useEffect(() => {
    function update() {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setDate(now.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' }));
    }

    update();
    const id = setInterval(update, 30000);
    return () => clearInterval(id);
  }, []);

  function movePage(nextPage: number) {
    setPage(Math.max(0, Math.min(HOME_PAGES.length - 1, nextPage)));
  }

  function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (event.pointerType === 'mouse' && event.buttons !== 1) return;
    pointerStartX.current = event.clientX;
  }

  function handlePointerUp(event: React.PointerEvent<HTMLDivElement>) {
    if (pointerStartX.current === null) return;
    const distance = event.clientX - pointerStartX.current;
    pointerStartX.current = null;
    if (Math.abs(distance) < 45) return;
    movePage(page + (distance < 0 ? 1 : -1));
  }

  function handlePointerCancel() {
    pointerStartX.current = null;
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      movePage(page + 1);
    }
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      movePage(page - 1);
    }
  }

  return (
    <main
      className="mobile-home-screen"
      aria-label="Portfolio home screen"
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        padding: 'calc(22px + var(--mobile-safe-top)) 18px calc(88px + var(--mobile-safe-bottom))',
        zIndex: 1,
        overflow: 'hidden',
        color: 'var(--text)',
      }}
    >
      <header className="mobile-home-status">
        <div>
          <div className="mobile-home-status-time">{time}</div>
          <div className="mobile-home-status-date">{date}</div>
        </div>
        <div className="mobile-home-status-profile" aria-label={`${settings.name}, ${settings.role}`}>
          <span className="mobile-home-status-mark">JF</span>
          <span>
            <strong>{settings.name}</strong>
            <small>{settings.role}</small>
          </span>
        </div>
      </header>

      <section
        className="mobile-home-pages-viewport"
        aria-label="Home screen pages"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
      >
        <div
          className="mobile-home-pages"
          style={{
            width: `${HOME_PAGES.length * 100}%`,
            transform: `translateX(-${page * (100 / HOME_PAGES.length)}%)`,
            transition: reducedMotion ? 'none' : 'transform 320ms cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        >
          {HOME_PAGES.map((homePage, pageIndex) => (
            <section
              key={homePage.label}
              className="mobile-home-page"
              aria-label={`${homePage.label} apps, page ${pageIndex + 1} of ${HOME_PAGES.length}`}
              aria-hidden={pageIndex !== page}
            >
              {Array.from({ length: PAGE_SLOTS }, (_, slotIndex) => {
                const type = homePage.apps[slotIndex];
                if (!type) return <div key={`empty-${slotIndex}`} aria-hidden="true" />;

                return (
                  <button
                    key={type}
                    type="button"
                    className="mobile-home-app"
                    onClick={() => onOpenApp(type)}
                    aria-label={`Open ${contentTypeLabel[type]}`}
                    tabIndex={pageIndex === page ? 0 : -1}
                  >
                    <span className="mobile-home-app-icon" aria-hidden="true">
                      <AppGridIcon type={type} />
                    </span>
                    <span className="mobile-home-app-label">{contentTypeLabel[type]}</span>
                  </button>
                );
              })}
            </section>
          ))}
        </div>
      </section>

      <div className="mobile-home-page-footer">
        <span className="mobile-home-page-label">{HOME_PAGES[page].label}</span>
        <div className="mobile-home-page-dots" aria-label={`Page ${page + 1} of ${HOME_PAGES.length}`}>
          {HOME_PAGES.map((homePage, index) => (
            <button
              key={homePage.label}
              type="button"
              className={`mobile-home-page-dot${index === page ? ' is-active' : ''}`}
              aria-label={`Go to ${homePage.label} apps`}
              aria-current={index === page ? 'page' : undefined}
              onClick={() => movePage(index)}
            />
          ))}
        </div>
        <span className="mobile-home-page-hint">Swipe</span>
      </div>
    </main>
  );
}
