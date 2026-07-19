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

// ─── Lazy content views ───────────────────────────────────────────────────────

const AboutView = lazy(() => import('./content-views/AboutView').then(m => ({ default: m.AboutView })));
const ProjectsView = lazy(() => import('./content-views/ProjectsView').then(m => ({ default: m.ProjectsView })));
const CertificationsView = lazy(() => import('./content-views/CertificationsView').then(m => ({ default: m.CertificationsView })));
const EventsView = lazy(() => import('./content-views/EventsView').then(m => ({ default: m.EventsView })));
const ContactsView = lazy(() => import('./content-views/ContactsView').then(m => ({ default: m.ContactsView })));
const BlogView = lazy(() => import('./content-views/BlogView').then(m => ({ default: m.BlogView })));

function ContentViewForType({ contentType }: { contentType: ContentType }) {
  return (
    <Suspense fallback={<SkeletonView />}>
      {contentType === 'about' && <AboutView />}
      {contentType === 'projects' && <ProjectsView />}
      {contentType === 'certifications' && <CertificationsView />}
      {contentType === 'events' && <EventsView />}
      {contentType === 'contacts' && <ContactsView />}
      {contentType === 'blog' && <BlogView />}
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

// ─── Component ────────────────────────────────────────────────────────────────

interface OSUIProviderProps {
  children: React.ReactNode;
  suppressChildren?: boolean;
  /** Pathname from the server — used to auto-open a window on load */
  initialRoute?: string;
}

export function OSUIProvider({ children, suppressChildren = true, initialRoute }: OSUIProviderProps) {
  const [state, dispatch] = useReducer(windowManagerReducer, initialWindowManagerState);
  const reducedMotion = useReducedMotion();
  const { activePanel, setActivePanel } = useMobileNav();
  const [wallpaperTheme, setWallpaperTheme] = useState<WallpaperTheme>('default');
  const [mounted, setMounted] = useState(false);

  const [layoutMode, setLayoutMode] = useState<LayoutMode>('desktop');

  // Hydration-safe: only read window dimensions after mount
  useEffect(() => {
    setLayoutMode(getLayoutMode(window.innerWidth));
    setMounted(true);
  }, []);

  // Auto-open window based on initial route (e.g. /contacts → open contacts)
  const hasAutoOpened = useRef(false);
  useEffect(() => {
    if (!mounted || hasAutoOpened.current) return;
    if (!initialRoute || initialRoute === '/') return;

    const ROUTE_MAP: Record<string, ContentType> = {
      '/contacts': 'contacts',
      '/projects': 'projects',
      '/certifications': 'certifications',
      '/events': 'events',
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
      reducedMotion ? 'true' : 'false'
    );
  }, [reducedMotion]);

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

  // Keyboard shortcuts: 1-5 opens apps, Esc closes active window
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const SHORTCUT_MAP: Record<string, ContentType> = {
      '1': 'about',
      '2': 'projects',
      '3': 'certifications',
      '4': 'events',
      '5': 'contacts',
      '6': 'blog',
    };

    function handleKeyDown(e: KeyboardEvent) {
      // Don't trigger when typing in inputs
      const tag = (e.target as HTMLElement).tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

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
  const contentTypes: ContentType[] = ['about', 'projects', 'certifications', 'events', 'contacts', 'blog'];
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
    <WindowManagerContext.Provider value={{ state, dispatch }}>
      <LayoutModeContext.Provider value={layoutMode}>
        {/* Desktop background with wallpaper */}
        <Desktop>
          <Wallpaper theme={wallpaperTheme} />
          {mounted && layoutMode !== 'mobile' && (
            <>
              <DesktopIcons onOpen={handleIconClick} />
              <DesktopWidgets onOpenWindow={handleIconClick} />
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
            style={{
              position: 'fixed',
              inset: 0,
              overflowY: 'auto',
              paddingTop: '12px',
              paddingBottom: '72px',
              zIndex: 1,
              background: 'rgba(10, 10, 10, 0.85)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
            }}
          >
            {/* Section header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 20px 16px', position: 'sticky', top: 0, zIndex: 2, background: 'rgba(10,10,10,0.9)', backdropFilter: 'blur(10px)' }}>
              <button
                onClick={() => setActivePanel(null)}
                aria-label="Back to home"
                style={{
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '8px',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.08)',
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
  );
}
