'use client';

/**
 * OSUIProvider — top-level client boundary for the OS UI system.
 *
 * Provides:
 *  - WindowManagerContext: { state, dispatch }
 *  - LayoutModeContext: 'desktop' | 'tablet' | 'mobile'
 *
 * Renders (for non-/studio routes):
 *  - Desktop + Wallpaper (background layer)
 *  - WindowManager (all open, non-minimized Windows)
 *  - Dock (desktop/tablet) or MobileNav (mobile)
 *  - BootScreen (session-gated intro)
 *
 * Suppresses children for OS routes (content comes through Windows).
 *
 * Requirements: 9.1, 9.3, 9.4, 11.2
 */

import React, {
  createContext,
  useContext,
  useReducer,
  useState,
  useEffect,
  useRef,
  lazy,
  Suspense,
} from 'react';
import {
  windowManagerReducer,
  initialWindowManagerState,
  type WindowManagerState,
  type WindowAction,
  type ContentType,
} from '@/store/windowManagerStore';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { Desktop } from './Desktop';
import { Wallpaper } from './Wallpaper';
import { DesktopIcons } from './DesktopIcons';
import { DesktopWidgets } from './DesktopWidgets';
import { ContextMenu, type WallpaperTheme } from './ContextMenu';
import { Taskbar, TASKBAR_HEIGHT } from './Taskbar';
import { SnapPreviewOverlay } from './SnapPreviewOverlay';
import { MobileNav, useMobileNav } from './MobileNav';
import { MobileHomeScreen } from './MobileHomeScreen';
import { Window } from './Window';
import { BootScreen } from './BootScreen';
import { SkeletonView } from './content-views/SkeletonView';
import { contentTypeLabel } from './AppIcon';
import type { HomeData } from '@/lib/types';
import { fallbackHomeData as portfolioData } from '@/lib/site-data';

// ─── Lazy content views ───────────────────────────────────────────────────────

const AboutView = lazy(() => import('./content-views/AboutView').then(m => ({ default: m.AboutView })));
const ProjectsView = lazy(() => import('./content-views/ProjectsView').then(m => ({ default: m.ProjectsView })));
const CompetitionsView = lazy(() => import('./content-views/CompetitionsView').then(m => ({ default: m.CompetitionsView })));
const CertificationsView = lazy(() => import('./content-views/CertificationsView').then(m => ({ default: m.CertificationsView })));
const EventsView = lazy(() => import('./content-views/EventsView').then(m => ({ default: m.EventsView })));
const ContactsView = lazy(() => import('./content-views/ContactsView').then(m => ({ default: m.ContactsView })));
const BlogView = lazy(() => import('./content-views/BlogView').then(m => ({ default: m.BlogView })));
const TechStackView = lazy(() => import('./content-views/TechStackView').then(m => ({ default: m.TechStackView })));
const SettingsView = lazy(() => import('./content-views/SettingsView').then(m => ({ default: m.SettingsView })));

function ContentViewForType({ contentType }: { contentType: ContentType }) {
  return (
    <Suspense fallback={<SkeletonView />}>
      {contentType === 'about' && <AboutView />}
      {contentType === 'projects' && <ProjectsView />}
      {contentType === 'competitions' && <CompetitionsView />}
      {contentType === 'certifications' && <CertificationsView />}
      {contentType === 'events' && <EventsView />}
      {contentType === 'contacts' && <ContactsView />}
      {contentType === 'blog' && <BlogView />}
      {contentType === 'tech-stack' && <TechStackView />}
      {contentType === 'settings' && <SettingsView />}
    </Suspense>
  );
}

// ─── Layout Mode ──────────────────────────────────────────────────────────────

export type LayoutMode = 'desktop' | 'tablet' | 'mobile';

export function getLayoutMode(width: number): LayoutMode {
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
}

// ─── Contexts ─────────────────────────────────────────────────────────────────

export const WindowManagerContext = createContext<{
  state: WindowManagerState;
  dispatch: React.Dispatch<WindowAction>;
} | null>(null);

export const LayoutModeContext = createContext<LayoutMode | null>(null);
export const PortfolioDataContext = createContext<HomeData>(portfolioData);

export type AccentColor = 'gold' | 'ice' | 'mint';
export type MotionMode = 'system' | 'reduced' | 'full';

export interface OSPreferences {
  wallpaperTheme: WallpaperTheme;
  accentColor: AccentColor;
  motionMode: MotionMode;
  showWidgets: boolean;
  setWallpaperTheme: (theme: WallpaperTheme) => void;
  setAccentColor: (accent: AccentColor) => void;
  setMotionMode: (mode: MotionMode) => void;
  setShowWidgets: (show: boolean) => void;
}

export const OSPreferencesContext = createContext<OSPreferences | null>(null);

const DEFAULT_OS_PREFERENCES = {
  wallpaperTheme: 'default' as WallpaperTheme,
  accentColor: 'gold' as AccentColor,
  motionMode: 'system' as MotionMode,
  showWidgets: true,
};

const ACCENT_TOKENS: Record<AccentColor, { gold: string; goldSoft: string; borderStrong: string }> = {
  gold: { gold: '#e7c25a', goldSoft: 'rgba(231, 194, 90, 0.22)', borderStrong: 'rgba(239, 196, 84, 0.28)' },
  ice: { gold: '#a9d2ff', goldSoft: 'rgba(169, 210, 255, 0.2)', borderStrong: 'rgba(169, 210, 255, 0.3)' },
  mint: { gold: '#8fe0c0', goldSoft: 'rgba(143, 224, 192, 0.2)', borderStrong: 'rgba(143, 224, 192, 0.3)' },
};

// ─── Custom hooks ─────────────────────────────────────────────────────────────

export function useWindowManager() {
  const ctx = useContext(WindowManagerContext);
  if (!ctx) throw new Error('useWindowManager must be used within an OSUIProvider');
  return ctx;
}

export function useLayoutMode(): LayoutMode {
  const ctx = useContext(LayoutModeContext);
  if (ctx === null) throw new Error('useLayoutMode must be used within an OSUIProvider');
  return ctx;
}

export function usePortfolioData() {
  return useContext(PortfolioDataContext);
}

export function useOSPreferences() {
  const ctx = useContext(OSPreferencesContext);
  if (!ctx) throw new Error('useOSPreferences must be used within an OSUIProvider');
  return ctx;
}

// ─── Component ────────────────────────────────────────────────────────────────

interface OSUIProviderProps {
  children: React.ReactNode;
  suppressChildren?: boolean;
  /** Pathname from the server — used to auto-open a window on load */
  initialRoute?: string;
  initialData?: HomeData;
}

export function OSUIProvider({ children, suppressChildren = true, initialRoute, initialData }: OSUIProviderProps) {
  const [state, dispatch] = useReducer(windowManagerReducer, initialWindowManagerState);
  const reducedMotion = useReducedMotion();
  const { activePanel, setActivePanel } = useMobileNav();
  const [preferences, setPreferences] = useState({ ...DEFAULT_OS_PREFERENCES });
  const [preferencesHydrated, setPreferencesHydrated] = useState(false);
  const [mounted, setMounted] = useState(false);

  const [layoutMode, setLayoutMode] = useState<LayoutMode>('desktop');

  // Hydration-safe: only read window dimensions after mount
  useEffect(() => {
    setLayoutMode(getLayoutMode(window.innerWidth));
    setMounted(true);
  }, []);

  // Preferences are local to this browser so the desktop remembers how it was arranged.
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem('portfolio-os-preferences');
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<typeof DEFAULT_OS_PREFERENCES>;
        setPreferences({
          ...DEFAULT_OS_PREFERENCES,
          wallpaperTheme: ['default', 'ocean', 'sunset', 'aurora'].includes(parsed.wallpaperTheme ?? '')
            ? parsed.wallpaperTheme as WallpaperTheme
            : DEFAULT_OS_PREFERENCES.wallpaperTheme,
          accentColor: ['gold', 'ice', 'mint'].includes(parsed.accentColor ?? '')
            ? parsed.accentColor as AccentColor
            : DEFAULT_OS_PREFERENCES.accentColor,
          motionMode: ['system', 'reduced', 'full'].includes(parsed.motionMode ?? '')
            ? parsed.motionMode as MotionMode
            : DEFAULT_OS_PREFERENCES.motionMode,
          showWidgets: typeof parsed.showWidgets === 'boolean' ? parsed.showWidgets : DEFAULT_OS_PREFERENCES.showWidgets,
        });
      }
    } catch {
      // A malformed local preference should never prevent the portfolio from opening.
    } finally {
      setPreferencesHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!preferencesHydrated) return;
    window.localStorage.setItem('portfolio-os-preferences', JSON.stringify({
      wallpaperTheme: preferences.wallpaperTheme,
      accentColor: preferences.accentColor,
      motionMode: preferences.motionMode,
      showWidgets: preferences.showWidgets,
    }));
  }, [preferences, preferencesHydrated]);

  const setWallpaperTheme = (theme: WallpaperTheme) => setPreferences((current) => ({ ...current, wallpaperTheme: theme }));
  const setAccentColor = (accentColor: AccentColor) => setPreferences((current) => ({ ...current, accentColor }));
  const setMotionMode = (motionMode: MotionMode) => setPreferences((current) => ({ ...current, motionMode }));
  const setShowWidgets = (showWidgets: boolean) => setPreferences((current) => ({ ...current, showWidgets }));
  const effectiveReducedMotion = preferences.motionMode === 'reduced' || (preferences.motionMode === 'system' && reducedMotion);

  // Auto-open window based on initial route (e.g. /contacts → open contacts)
  const hasAutoOpened = useRef(false);
  useEffect(() => {
    if (!mounted || hasAutoOpened.current) return;
    if (!initialRoute || initialRoute === '/') return;

    const ROUTE_MAP: Record<string, ContentType> = {
      '/contacts': 'contacts',
      '/projects': 'projects',
      '/competitions': 'competitions',
      '/certifications': 'certifications',
      '/events': 'events',
      '/tech-stack': 'tech-stack',
    };

    const contentType = ROUTE_MAP[initialRoute];
    if (contentType) {
      hasAutoOpened.current = true;
      if (layoutMode === 'mobile') {
        setActivePanel(contentType);
      } else {
        handleIconClick(contentType);
      }
    }
  }, [mounted, initialRoute, layoutMode]);

  // Apply data-reduced-motion attribute to <html>
  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.documentElement.setAttribute(
      'data-reduced-motion',
      effectiveReducedMotion ? 'true' : 'false'
    );
  }, [effectiveReducedMotion]);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    const tokens = ACCENT_TOKENS[preferences.accentColor];
    root.style.setProperty('--gold', tokens.gold);
    root.style.setProperty('--gold-soft', tokens.goldSoft);
    root.style.setProperty('--border-strong', tokens.borderStrong);
  }, [preferences.accentColor]);

  // Lock viewport scrolling when OS UI is active
  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    document.body.style.height = '100vh';
    return () => {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      document.body.style.height = '';
    };
  }, []);

  // Respond to viewport resize
  useEffect(() => {
    if (typeof window === 'undefined') return;
    function handleResize() {
      setLayoutMode(getLayoutMode(window.innerWidth));
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Keyboard shortcuts: number keys open apps, Cmd/Ctrl+, opens Settings, Esc closes active window
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const SHORTCUT_MAP: Record<string, ContentType> = {
      '1': 'about',
      '2': 'projects',
      '3': 'competitions',
      '4': 'certifications',
      '5': 'events',
      '6': 'contacts',
      '7': 'blog',
      '8': 'tech-stack',
      '9': 'settings',
    };

    function handleKeyDown(e: KeyboardEvent) {
      // Don't trigger when typing in inputs
      const tag = (e.target as HTMLElement).tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || (e.target as HTMLElement).isContentEditable) return;

      if ((e.metaKey || e.ctrlKey) && e.key === ',') {
        e.preventDefault();
        handleIconClick('settings');
        return;
      }

      const ct = SHORTCUT_MAP[e.key];
      if (ct) {
        e.preventDefault();
        handleIconClick(ct);
        return;
      }

      if (e.key === 'Escape') {
        // Close the topmost open, non-minimized window
        const openWins = state.windows.filter(w => w.isOpen && !w.isMinimized);
        if (openWins.length > 0) {
          const top = openWins.reduce((a, b) => (a.zIndex > b.zIndex ? a : b));
          dispatch({ type: 'CLOSE_WINDOW', id: top.id });
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  // Refs for dock icons — used for minimize animation targeting
  const dockIconRefs = useRef<Map<ContentType, React.RefObject<HTMLButtonElement | null>>>(
    new Map()
  );

  // Ensure refs exist for all content types
  const contentTypes: ContentType[] = ['about', 'projects', 'competitions', 'certifications', 'events', 'contacts', 'blog', 'tech-stack', 'settings'];
  for (const ct of contentTypes) {
    if (!dockIconRefs.current.has(ct)) {
      dockIconRefs.current.set(ct, React.createRef<HTMLButtonElement>());
    }
  }

  // Handle App Icon click → OPEN_WINDOW (or focus/restore if exists)
  function handleIconClick(type: ContentType) {
    dispatch({
      type: 'OPEN_WINDOW',
      contentType: type,
      viewportWidth: typeof window !== 'undefined' ? window.innerWidth : 1280,
      viewportHeight: typeof window !== 'undefined' ? window.innerHeight : 800,
      dockHeight: TASKBAR_HEIGHT,
    });
  }

  // Handle taskbar window button click → open, focus, or minimize
  function handleTaskbarWindowClick(type: ContentType) {
    const win = state.windows.find(w => w.contentType === type);
    if (!win) {
      // Not open yet — open it
      handleIconClick(type);
      return;
    }
    if (win.isMinimized) {
      dispatch({ type: 'RESTORE_WINDOW', id: win.id });
      dispatch({ type: 'FOCUS_WINDOW', id: win.id });
    } else if (win.isOpen) {
      // If it's the active window, minimize it; otherwise focus it
      const visibleWindows = state.windows.filter(w => w.isOpen && !w.isMinimized);
      const topWindow = visibleWindows.length > 0
        ? visibleWindows.reduce((a, b) => (a.zIndex > b.zIndex ? a : b))
        : null;
      if (topWindow && topWindow.id === win.id) {
        dispatch({ type: 'MINIMIZE_WINDOW', id: win.id });
      } else {
        dispatch({ type: 'FOCUS_WINDOW', id: win.id });
      }
    }
  }

  // Open windows — render ALL that exist (including minimized, for animation)
  const renderedWindows = state.windows.filter(w => w.isOpen || w.isMinimized);
  const activeWindowId = renderedWindows.filter(w => w.isOpen && !w.isMinimized).length > 0
    ? renderedWindows.filter(w => w.isOpen && !w.isMinimized).reduce((a, b) => (a.zIndex > b.zIndex ? a : b)).id
    : null;

  return (
    <OSPreferencesContext.Provider value={{
      ...preferences,
      setWallpaperTheme,
      setAccentColor,
      setMotionMode,
      setShowWidgets,
    }}>
    <PortfolioDataContext.Provider value={initialData ?? portfolioData}>
      <WindowManagerContext.Provider value={{ state, dispatch }}>
        <LayoutModeContext.Provider value={layoutMode}>
        {/* Desktop background with wallpaper */}
        <Desktop>
          <Wallpaper theme={preferences.wallpaperTheme} />
          {mounted && layoutMode !== 'mobile' && (
            <>
              <DesktopIcons onOpen={handleIconClick} />
              {preferences.showWidgets && <DesktopWidgets onOpenWindow={handleIconClick} />}
            </>
          )}
        </Desktop>

        {/* Right-click context menu */}
        {mounted && layoutMode !== 'mobile' && (
          <ContextMenu
            onChangeWallpaper={setWallpaperTheme}
            onRefresh={() => window.location.reload()}
          />
        )}

        {/* Boot screen — shown once per session */}
        <BootScreen />

        {/* Global snap preview overlay */}
        {mounted && layoutMode !== 'mobile' && (
          <SnapPreviewOverlay preview={state.snapPreview} />
        )}

        {/* Window manager — renders all windows (including minimized for genie animation) */}
        {mounted && layoutMode !== 'mobile' && renderedWindows.map(win => (
          <Window
            key={win.id}
            state={win}
            isActive={win.id === activeWindowId}
            layoutMode={layoutMode}
            dockIconRef={dockIconRefs.current.get(win.contentType) ?? React.createRef()}
            onFocus={(id) => dispatch({ type: 'FOCUS_WINDOW', id })}
            dispatch={dispatch}
          >
            <ContentViewForType contentType={win.contentType} />
          </Window>
        ))}

        {/* Mobile: home screen or content panel */}
        {mounted && layoutMode === 'mobile' && activePanel === null && (
          <MobileHomeScreen onOpenApp={(type) => setActivePanel(type)} />
        )}
        {mounted && layoutMode === 'mobile' && activePanel !== null && (
          <div
            className="mobile-content-screen"
            style={{
              position: 'fixed',
              inset: 0,
              overflowY: 'auto',
              paddingTop: 'env(safe-area-inset-top, 0px)',
              paddingBottom: 'calc(78px + env(safe-area-inset-bottom, 0px))',
              zIndex: 1,
              background: 'var(--bg)',
            }}
          >
            {/* Section header */}
            <div className="mobile-content-header" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 20px 16px', position: 'sticky', top: 0, zIndex: 2, background: 'rgba(7,11,20,0.88)', backdropFilter: 'blur(18px) saturate(1.2)', WebkitBackdropFilter: 'blur(18px) saturate(1.2)' }}>
              <button
                onClick={() => setActivePanel(null)}
                aria-label="Back to home"
                className="mobile-back-button"
                style={{
                  width: '44px',
                  height: '44px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '14px',
                  background: 'var(--glass-control)',
                  border: '1px solid var(--glass-border)',
                  color: 'var(--text)',
                  cursor: 'pointer',
                  outline: 'none',
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <span style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: '1.1rem', fontWeight: 500, color: 'var(--text)' }}>
                {contentTypeLabel[activePanel]}
              </span>
            </div>
            <ContentViewForType contentType={activePanel} />
          </div>
        )}

        {/* Navigation — Taskbar (desktop/tablet) or MobileNav (mobile) */}
        {mounted && (layoutMode === 'mobile' ? (
          <MobileNav activePanel={activePanel} onPanelChange={setActivePanel} />
        ) : (
          <Taskbar
            windows={state.windows}
            notifications={state.notifications}
            onWindowClick={handleTaskbarWindowClick}
            onDismissNotification={(id) => dispatch({ type: 'DISMISS_NOTIFICATION', id })}
          />
        ))}

        {/* Children suppressed for OS routes; preserved hidden for SEO */}
        {!suppressChildren && children}
        {suppressChildren && (
          <div aria-hidden="true" style={{ display: 'none' }}>
            {children}
          </div>
        )}
        </LayoutModeContext.Provider>
      </WindowManagerContext.Provider>
    </PortfolioDataContext.Provider>
    </OSPreferencesContext.Provider>
  );
}
