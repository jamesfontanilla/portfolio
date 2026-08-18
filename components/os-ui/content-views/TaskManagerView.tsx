'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { usePortfolioData, useWindowManager } from '../OSUIProvider';
import { contentTypeLabel } from '../AppIcon';
import type { ContentType, WindowState } from '@/store/windowManagerStore';

type PerformanceSnapshot = {
  loadMs: number | null;
  domReadyMs: number | null;
  transferKb: number | null;
  connection: string;
  online: boolean;
  visibility: DocumentVisibilityState;
};

const EMPTY_PERFORMANCE: PerformanceSnapshot = {
  loadMs: null,
  domReadyMs: null,
  transferKb: null,
  connection: 'Unknown',
  online: true,
  visibility: 'visible',
};

const CONTENT_INVENTORY: { type: ContentType; label: string; key: 'projects' | 'competitions' | 'certifications' | 'events' | 'blogPosts' }[] = [
  { type: 'projects', label: 'Projects', key: 'projects' },
  { type: 'competitions', label: 'Competitions', key: 'competitions' },
  { type: 'certifications', label: 'Certifications', key: 'certifications' },
  { type: 'events', label: 'Events', key: 'events' },
  { type: 'blog', label: 'Blog posts', key: 'blogPosts' },
];

function formatDuration(value: number | null) {
  if (value === null || !Number.isFinite(value)) return '—';
  if (value < 1000) return `${Math.round(value)} ms`;
  return `${(value / 1000).toFixed(2)} s`;
}

function readPerformanceSnapshot(): PerformanceSnapshot {
  const navigation = typeof performance !== 'undefined'
    ? performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined
    : undefined;
  const network = (typeof navigator !== 'undefined'
    ? (navigator as Navigator & { connection?: { effectiveType?: string } }).connection
    : undefined);

  return {
    loadMs: navigation?.loadEventEnd ? navigation.loadEventEnd : null,
    domReadyMs: navigation?.domContentLoadedEventEnd ? navigation.domContentLoadedEventEnd : null,
    transferKb: navigation?.transferSize ? navigation.transferSize / 1024 : null,
    connection: network?.effectiveType?.toUpperCase() ?? 'Unknown',
    online: typeof navigator === 'undefined' ? true : navigator.onLine,
    visibility: typeof document === 'undefined' ? 'visible' : document.visibilityState,
  };
}

function Metric({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <div className="task-manager-metric">
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{detail}</small>
    </div>
  );
}

function StatusDot({ tone = 'good' }: { tone?: 'good' | 'muted' | 'gold' }) {
  return <span className={`task-manager-status-dot task-manager-status-${tone}`} aria-hidden="true" />;
}

function WindowRow({
  windowState,
  isActive,
  onFocus,
  onMinimize,
  onClose,
}: {
  windowState: WindowState;
  isActive: boolean;
  onFocus: () => void;
  onMinimize: () => void;
  onClose: () => void;
}) {
  const label = contentTypeLabel[windowState.contentType];
  const minimized = windowState.isMinimized;

  return (
    <div className="task-manager-process-row">
      <div className="task-manager-process-main">
        <span className="task-manager-process-icon" aria-hidden="true">{label.slice(0, 2).toUpperCase()}</span>
        <span className="task-manager-process-copy">
          <strong>{label}</strong>
          <small>{isActive ? 'Foreground app' : minimized ? 'Minimized to taskbar' : 'Open in workspace'}</small>
        </span>
      </div>
      <span className={`task-manager-state-pill${isActive ? ' is-active' : ''}`}>
        <StatusDot tone={isActive ? 'gold' : minimized ? 'muted' : 'good'} />
        {isActive ? 'Active' : minimized ? 'Paused' : 'Running'}
      </span>
      <div className="task-manager-process-actions">
        <button type="button" onClick={onFocus} aria-label={`Focus ${label}`}>
          {minimized ? 'Restore' : isActive ? 'Focused' : 'Focus'}
        </button>
        <button type="button" onClick={onMinimize} disabled={minimized} aria-label={`Minimize ${label}`}>
          Minimize
        </button>
        <button type="button" className="task-manager-end-button" onClick={onClose} aria-label={`End ${label}`}>
          End task
        </button>
      </div>
    </div>
  );
}

export function TaskManagerView() {
  const { state, dispatch } = useWindowManager();
  const portfolio = usePortfolioData();
  const [performanceSnapshot, setPerformanceSnapshot] = useState<PerformanceSnapshot>(EMPTY_PERFORMANCE);

  useEffect(() => {
    const refresh = () => setPerformanceSnapshot(readPerformanceSnapshot());
    refresh();
    const timer = window.setInterval(refresh, 5000);
    const sync = () => refresh();
    window.addEventListener('online', sync);
    window.addEventListener('offline', sync);
    document.addEventListener('visibilitychange', sync);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener('online', sync);
      window.removeEventListener('offline', sync);
      document.removeEventListener('visibilitychange', sync);
    };
  }, []);

  const openWindows = useMemo(
    () => state.windows.filter((windowState) => windowState.isOpen || windowState.isMinimized).sort((a, b) => b.zIndex - a.zIndex),
    [state.windows],
  );
  const foregroundWindow = openWindows.find((windowState) => windowState.isOpen && !windowState.isMinimized);
  const cachedContent = Object.keys(state.dataCache).length;
  const visibleCount = openWindows.filter((windowState) => windowState.isOpen && !windowState.isMinimized).length;

  function openApp(type: ContentType) {
    dispatch({
      type: 'OPEN_WINDOW',
      contentType: type,
      viewportWidth: typeof window === 'undefined' ? 1280 : window.innerWidth,
      viewportHeight: typeof window === 'undefined' ? 800 : window.innerHeight,
      dockHeight: 68,
    });
  }

  function focusWindow(windowState: WindowState) {
    if (windowState.isMinimized) dispatch({ type: 'RESTORE_WINDOW', id: windowState.id });
    dispatch({ type: 'FOCUS_WINDOW', id: windowState.id });
  }

  return (
    <main className="task-manager-view" aria-label="Task Manager">
      <header className="task-manager-header">
        <div>
          <span className="task-manager-eyebrow">System monitor</span>
          <h1>Task Manager</h1>
          <p>See what is active in this portfolio workspace.</p>
        </div>
        <div className="task-manager-live-badge"><StatusDot /><span>Live session</span></div>
      </header>

      <section className="task-manager-hero" aria-label="Workspace summary">
        <div>
          <span className="task-manager-section-kicker">Workspace health</span>
          <h2>{visibleCount} {visibleCount === 1 ? 'app' : 'apps'} in the foreground</h2>
          <p>{foregroundWindow ? `${contentTypeLabel[foregroundWindow.contentType]} is the current focus.` : 'The desktop is ready for your next app.'}</p>
        </div>
        <div className="task-manager-hero-signal" aria-hidden="true">
          <span className="task-manager-signal-core" />
          <span className="task-manager-signal-ring task-manager-signal-ring-one" />
          <span className="task-manager-signal-ring task-manager-signal-ring-two" />
        </div>
      </section>

      <section className="task-manager-metrics" aria-label="Workspace metrics">
        <Metric label="Open apps" value={String(openWindows.length)} detail={`${state.openCount} launches this session`} />
        <Metric label="Page load" value={formatDuration(performanceSnapshot.loadMs)} detail={`DOM ready ${formatDuration(performanceSnapshot.domReadyMs)}`} />
        <Metric label="Data cache" value={String(cachedContent)} detail={cachedContent === 1 ? 'content area cached' : 'content areas cached'} />
        <Metric label="Network" value={performanceSnapshot.online ? performanceSnapshot.connection : 'Offline'} detail={performanceSnapshot.visibility === 'visible' ? 'desktop visible' : 'desktop hidden'} />
      </section>

      <div className="task-manager-content-grid">
        <section className="task-manager-card task-manager-processes-card" aria-labelledby="task-manager-processes-title">
          <header className="task-manager-card-heading">
            <div>
              <span className="task-manager-section-kicker">Processes</span>
              <h2 id="task-manager-processes-title">Open apps</h2>
              <p>Focus, minimize, or close a portfolio window.</p>
            </div>
            <span className="task-manager-count-badge">{openWindows.length}</span>
          </header>
          <div className="task-manager-process-list">
            {openWindows.length > 0 ? openWindows.map((windowState) => (
              <WindowRow
                key={windowState.id}
                windowState={windowState}
                isActive={foregroundWindow?.id === windowState.id}
                onFocus={() => focusWindow(windowState)}
                onMinimize={() => dispatch({ type: 'MINIMIZE_WINDOW', id: windowState.id })}
                onClose={() => dispatch({ type: 'CLOSE_WINDOW', id: windowState.id })}
              />
            )) : (
              <div className="task-manager-empty-state"><strong>No apps are open.</strong><span>Use Start or a desktop icon to launch one.</span></div>
            )}
          </div>
        </section>

        <section className="task-manager-card" aria-labelledby="task-manager-performance-title">
          <header className="task-manager-card-heading">
            <div>
              <span className="task-manager-section-kicker">Performance</span>
              <h2 id="task-manager-performance-title">Browser session</h2>
              <p>Metrics collected from this public visit.</p>
            </div>
          </header>
          <div className="task-manager-detail-list">
            <div><span>Document transfer</span><strong>{performanceSnapshot.transferKb ? `${performanceSnapshot.transferKb.toFixed(1)} KB` : 'Not reported'}</strong></div>
            <div><span>Connection</span><strong>{performanceSnapshot.online ? performanceSnapshot.connection : 'Offline'}</strong></div>
            <div><span>Visibility</span><strong>{performanceSnapshot.visibility === 'visible' ? 'In view' : 'Background tab'}</strong></div>
            <div><span>Measurement</span><strong>Navigation Timing</strong></div>
          </div>
          <p className="task-manager-note">These are browser metrics for this visit, not your device&apos;s private CPU or memory data.</p>
        </section>

        <section className="task-manager-card" aria-labelledby="task-manager-content-title">
          <header className="task-manager-card-heading">
            <div>
              <span className="task-manager-section-kicker">App history</span>
              <h2 id="task-manager-content-title">Portfolio content</h2>
              <p>Open a collection without leaving this monitor.</p>
            </div>
          </header>
          <div className="task-manager-inventory-list">
            {CONTENT_INVENTORY.map(({ type, label, key }) => {
              const count = portfolio[key]?.length ?? 0;
              const running = openWindows.some((windowState) => windowState.contentType === type && windowState.isOpen && !windowState.isMinimized);
              return (
                <div className="task-manager-inventory-row" key={type}>
                  <span><strong>{label}</strong><small>{count} {count === 1 ? 'item' : 'items'}</small></span>
                  <span className={`task-manager-inventory-state${running ? ' is-running' : ''}`}><StatusDot tone={running ? 'gold' : 'muted'} />{running ? 'Open' : 'Ready'}</span>
                  <button type="button" onClick={() => openApp(type)}>{running ? 'Focus' : 'Open'}</button>
                </div>
              );
            })}
          </div>
        </section>

        <section className="task-manager-card task-manager-services-card" aria-labelledby="task-manager-services-title">
          <header className="task-manager-card-heading">
            <div>
              <span className="task-manager-section-kicker">Services</span>
              <h2 id="task-manager-services-title">Workspace services</h2>
              <p>Public-facing services used by the desktop.</p>
            </div>
          </header>
          <div className="task-manager-service-list">
            <div><span><StatusDot /><strong>Portfolio data</strong></span><small>Ready for browsing</small></div>
            <div><span><StatusDot /><strong>Weather widget</strong></span><small>Live desktop signal</small></div>
            <div><span><StatusDot tone="gold" /><strong>Admin CMS</strong></span><small>Private control plane</small></div>
          </div>
          <p className="task-manager-note">Service labels describe this public interface; private credentials and admin diagnostics are never exposed here.</p>
        </section>
      </div>

      <footer className="task-manager-footer"><StatusDot /><span>Public session monitor</span><span>·</span><span>Actions affect this desktop only</span></footer>
    </main>
  );
}
