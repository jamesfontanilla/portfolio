'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  useOSPreferences,
  type AccentColor,
  type MotionMode,
} from '../OSUIProvider';
import { WALLPAPER_THEMES, type WallpaperTheme } from '../ContextMenu';

type SettingsPaneId = 'home' | 'appearance' | 'layout' | 'accessibility' | 'shortcuts' | 'about';

const SETTINGS_STORAGE_KEY = 'portfolio-settings-pane';

const SETTINGS_PANES: { id: SettingsPaneId; label: string; description: string; keywords: string }[] = [
  { id: 'home', label: 'Home', description: 'A quick look at your workspace', keywords: 'overview workspace preferences' },
  { id: 'appearance', label: 'Appearance', description: 'Wallpaper and accent color', keywords: 'theme wallpaper color accent visual' },
  { id: 'layout', label: 'Layout', description: 'Desktop widgets and density', keywords: 'desktop widgets layout density' },
  { id: 'accessibility', label: 'Accessibility', description: 'Motion and readability', keywords: 'motion animation reduced accessibility' },
  { id: 'shortcuts', label: 'Shortcuts', description: 'Move around the portfolio faster', keywords: 'keyboard shortcut navigation command control' },
  { id: 'about', label: 'About this desktop', description: 'How this portfolio works', keywords: 'about version portfolio browser desktop' },
];

const ACCENT_OPTIONS: { id: AccentColor; label: string; description: string; color: string }[] = [
  { id: 'gold', label: 'Gold', description: 'The original James Fontanilla accent', color: '#e7c25a' },
  { id: 'ice', label: 'Ice', description: 'A cooler, technical highlight', color: '#a9d2ff' },
  { id: 'mint', label: 'Mint', description: 'A softer engineering signal', color: '#8fe0c0' },
];

const MOTION_OPTIONS: { id: MotionMode; label: string; description: string }[] = [
  { id: 'system', label: 'Follow device', description: 'Respect the motion preference from your device.' },
  { id: 'reduced', label: 'Reduce motion', description: 'Keep transitions and animations to a minimum.' },
  { id: 'full', label: 'Full motion', description: 'Use the complete desktop animation language.' },
];

function getInitialPane(): SettingsPaneId {
  if (typeof window === 'undefined') return 'home';
  const saved = window.localStorage.getItem(SETTINGS_STORAGE_KEY);
  return SETTINGS_PANES.some((pane) => pane.id === saved) ? saved as SettingsPaneId : 'home';
}

function SettingsIcon({ type }: { type: SettingsPaneId }) {
  const paths: Record<SettingsPaneId, string> = {
    home: 'M4 12a8 8 0 1 0 16 0 8 8 0 1 0-16 0Zm8-4v4l3 2',
    appearance: 'M4 18 14 8l2 2L6 20H4v-2Zm9-11 2-2 4 4-2 2',
    layout: 'M4 5h6v6H4V5Zm10 0h6v6h-6V5ZM4 15h6v4H4v-4Zm10 0h6v4h-6v-4Z',
    accessibility: 'M12 5a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm-5 4h10M12 5v14M8 20l4-6 4 6',
    shortcuts: 'M5 4h14v16H5V4Zm3 4h8M8 12h5M8 16h3',
    about: 'M12 8h.01M10.8 12H12v5h1.2M4 12a8 8 0 1 0 16 0 8 8 0 1 0-16 0Z',
  };

  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d={paths[type]} stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SettingsCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="settings-card">
      <div className="settings-card-heading">
        <div>
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
      </div>
      <div className="settings-card-body">{children}</div>
    </section>
  );
}

function PreferencePill({ label, value }: { label: string; value: string }) {
  return (
    <div className="settings-preference-pill">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

export function SettingsView() {
  const {
    wallpaperTheme,
    setWallpaperTheme,
    accentColor,
    setAccentColor,
    motionMode,
    setMotionMode,
    showWidgets,
    setShowWidgets,
  } = useOSPreferences();
  const [activePane, setActivePane] = useState<SettingsPaneId>(getInitialPane);
  const [query, setQuery] = useState('');

  useEffect(() => {
    window.localStorage.setItem(SETTINGS_STORAGE_KEY, activePane);
  }, [activePane]);

  const normalizedQuery = query.trim().toLowerCase();
  const searchResults = useMemo(
    () => SETTINGS_PANES.filter((pane) => `${pane.label} ${pane.description} ${pane.keywords}`.toLowerCase().includes(normalizedQuery)),
    [normalizedQuery],
  );
  const currentPane = SETTINGS_PANES.find((pane) => pane.id === activePane) ?? SETTINGS_PANES[0];
  const wallpaperLabel = WALLPAPER_THEMES.find((theme) => theme.id === wallpaperTheme)?.label ?? 'Gold & Teal';
  const accentLabel = ACCENT_OPTIONS.find((accent) => accent.id === accentColor)?.label ?? 'Gold';
  const motionLabel = MOTION_OPTIONS.find((motion) => motion.id === motionMode)?.label ?? 'Follow device';

  function resetPreferences() {
    setWallpaperTheme('default');
    setAccentColor('gold');
    setMotionMode('system');
    setShowWidgets(true);
    setActivePane('home');
  }

  function renderPane() {
    if (activePane === 'appearance') {
      return (
        <div className="settings-section-stack">
          <SettingsCard title="Wallpaper" description="Set the atmosphere behind your work.">
            <div className="settings-option-grid">
              {WALLPAPER_THEMES.map((theme) => (
                <button
                  key={theme.id}
                  type="button"
                  className={`settings-option-card${wallpaperTheme === theme.id ? ' is-selected' : ''}`}
                  aria-pressed={wallpaperTheme === theme.id}
                  onClick={() => setWallpaperTheme(theme.id)}
                >
                  <span className={`settings-wallpaper-swatch settings-wallpaper-${theme.id}`} aria-hidden="true" />
                  <span>
                    <strong>{theme.label}</strong>
                    <small>{wallpaperTheme === theme.id ? 'Currently active' : 'Use this wallpaper'}</small>
                  </span>
                </button>
              ))}
            </div>
          </SettingsCard>
          <SettingsCard title="Accent color" description="Tune the details that mark active apps and controls.">
            <div className="settings-option-grid settings-accent-grid">
              {ACCENT_OPTIONS.map((accent) => (
                <button
                  key={accent.id}
                  type="button"
                  className={`settings-option-card${accentColor === accent.id ? ' is-selected' : ''}`}
                  aria-pressed={accentColor === accent.id}
                  onClick={() => setAccentColor(accent.id)}
                >
                  <span className="settings-accent-dot" style={{ background: accent.color }} aria-hidden="true" />
                  <span>
                    <strong>{accent.label}</strong>
                    <small>{accent.description}</small>
                  </span>
                </button>
              ))}
            </div>
          </SettingsCard>
        </div>
      );
    }

    if (activePane === 'layout') {
      return (
        <div className="settings-section-stack">
          <SettingsCard title="Desktop widgets" description="Keep the live portfolio summary visible on the desktop.">
            <label className="settings-toggle-row">
              <span>
                <strong>Show desktop widgets</strong>
                <small>Clock, focus, location, and portfolio highlights.</small>
              </span>
              <input type="checkbox" checked={showWidgets} onChange={(event) => setShowWidgets(event.target.checked)} />
              <span className="settings-switch" aria-hidden="true"><span /></span>
            </label>
          </SettingsCard>
          <SettingsCard title="Window behavior" description="A few habits that make this desktop feel more like a personal computer.">
            <div className="settings-detail-list">
              <div><span>Open project details</span><strong>Inside the active window</strong></div>
              <div><span>Desktop icon layout</span><strong>Column-first, widget-safe</strong></div>
              <div><span>Mobile layout</span><strong>App grid with More menu</strong></div>
            </div>
          </SettingsCard>
        </div>
      );
    }

    if (activePane === 'accessibility') {
      return (
        <div className="settings-section-stack">
          <SettingsCard title="Motion" description="Choose how much movement the desktop should use.">
            <div className="settings-choice-list">
              {MOTION_OPTIONS.map((option) => (
                <label className={`settings-choice-row${motionMode === option.id ? ' is-selected' : ''}`} key={option.id}>
                  <input type="radio" name="motion-mode" value={option.id} checked={motionMode === option.id} onChange={() => setMotionMode(option.id)} />
                  <span><strong>{option.label}</strong><small>{option.description}</small></span>
                </label>
              ))}
            </div>
          </SettingsCard>
          <SettingsCard title="Readable by default" description="The portfolio keeps its keyboard focus states, generous tap targets, and high-contrast text across screen sizes.">
            <div className="settings-callout"><span aria-hidden="true">✦</span><p>Settings changes apply immediately and are remembered on this device.</p></div>
          </SettingsCard>
        </div>
      );
    }

    if (activePane === 'shortcuts') {
      return (
        <SettingsCard title="Keyboard shortcuts" description="The fastest way to move through the portfolio desktop.">
          <div className="settings-shortcut-list">
            {[
              ['1', 'Open About Me'],
              ['2', 'Open Projects'],
              ['3', 'Open Competitions'],
              ['4', 'Open Certifications'],
              ['5', 'Open Events'],
              ['6', 'Open Contacts'],
              ['7', 'Open Blog'],
              ['8', 'Open Tech Stack'],
              ['0', 'Open Task Manager'],
              ['9', 'Open Settings'],
              ['⌘, / Ctrl+,', 'Open Settings'],
              ['Enter / Space', 'Open a selected desktop icon'],
              ['Tab / Shift+Tab', 'Cycle focus within the active window'],
              ['Esc', 'Close the active window or menu'],
              ['⌘ / Ctrl+Alt + ← →', 'Snap the active window left or right'],
              ['⌘ / Ctrl+Alt + ↑', 'Maximize the active window'],
              ['⌘ / Ctrl+Alt + ↓', 'Snap down or restore the active window'],
            ].map(([key, label]) => (
              <div className="settings-shortcut-row" key={key}>
                <kbd>{key}</kbd><span>{label}</span>
              </div>
            ))}
          </div>
        </SettingsCard>
      );
    }

    if (activePane === 'about') {
      return (
        <div className="settings-section-stack">
          <SettingsCard title="About this desktop" description="A portfolio that behaves like a small operating system.">
            <div className="settings-about-block">
              <div className="settings-about-mark">JF</div>
              <div><strong>James Fontanilla Portfolio OS</strong><p>Projects, competitions, writing, and the tools behind them — organized as a calm desktop workspace.</p></div>
            </div>
          </SettingsCard>
          <SettingsCard title="Reset preferences" description="Return the appearance and layout to the original portfolio experience.">
            <button type="button" className="settings-secondary-button" onClick={resetPreferences}>Restore defaults</button>
          </SettingsCard>
        </div>
      );
    }

    return (
      <div className="settings-section-stack">
        <div className="settings-hero-card">
          <div>
            <span className="settings-eyebrow">Workspace control room</span>
            <h2>Make this desktop feel like yours.</h2>
            <p>Personalize the atmosphere, layout, and motion of James&apos;s portfolio without leaving the window.</p>
          </div>
          <div className="settings-hero-orbit" aria-hidden="true"><span /><span /><span /></div>
        </div>
        <div className="settings-summary-grid">
          <SettingsCard title="Appearance" description="Your current visual language.">
            <PreferencePill label="Wallpaper" value={wallpaperLabel} />
            <PreferencePill label="Accent" value={accentLabel} />
            <button type="button" className="settings-text-button" onClick={() => setActivePane('appearance')}>Customize appearance →</button>
          </SettingsCard>
          <SettingsCard title="Accessibility" description="Motion settings for this device.">
            <PreferencePill label="Motion" value={motionLabel} />
            <PreferencePill label="Widgets" value={showWidgets ? 'Visible' : 'Hidden'} />
            <button type="button" className="settings-text-button" onClick={() => setActivePane('accessibility')}>Review accessibility →</button>
          </SettingsCard>
        </div>
        <div className="settings-status-strip"><span className="settings-status-dot" />Live preview <span>·</span> Saved on this device</div>
      </div>
    );
  }

  return (
    <main className="settings-view" aria-label="Settings">
      <header className="settings-header">
        <div>
          <span className="settings-eyebrow">System preferences</span>
          <h1>Settings</h1>
          <p>{normalizedQuery ? `Search results for “${query.trim()}”` : currentPane.description}</p>
        </div>
        <label className="settings-search">
          <span aria-hidden="true">⌕</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search settings" aria-label="Search settings" />
          {query && <button type="button" aria-label="Clear settings search" onClick={() => setQuery('')}>×</button>}
        </label>
      </header>

      <div className="settings-layout">
        <nav className="settings-sidebar" aria-label="Settings sections">
          <span className="settings-sidebar-label">Personalization</span>
          {SETTINGS_PANES.slice(0, 4).map((pane) => (
            <button key={pane.id} type="button" className={`settings-nav-item${activePane === pane.id && !normalizedQuery ? ' is-active' : ''}`} onClick={() => { setQuery(''); setActivePane(pane.id); }}>
              <SettingsIcon type={pane.id} /><span>{pane.label}</span>
            </button>
          ))}
          <span className="settings-sidebar-label">System</span>
          {SETTINGS_PANES.slice(4).map((pane) => (
            <button key={pane.id} type="button" className={`settings-nav-item${activePane === pane.id && !normalizedQuery ? ' is-active' : ''}`} onClick={() => { setQuery(''); setActivePane(pane.id); }}>
              <SettingsIcon type={pane.id} /><span>{pane.label}</span>
            </button>
          ))}
        </nav>

        <section className="settings-content" aria-live="polite">
          {normalizedQuery ? (
            <div className="settings-search-results">
              {searchResults.length > 0 ? searchResults.map((pane) => (
                <button key={pane.id} type="button" className="settings-result-card" onClick={() => { setQuery(''); setActivePane(pane.id); }}>
                  <SettingsIcon type={pane.id} /><span><strong>{pane.label}</strong><small>{pane.description}</small></span><span aria-hidden="true">→</span>
                </button>
              )) : <div className="settings-empty"><strong>No settings found</strong><p>Try “wallpaper”, “motion”, or “shortcuts”.</p></div>}
            </div>
          ) : renderPane()}
        </section>
      </div>
    </main>
  );
}
