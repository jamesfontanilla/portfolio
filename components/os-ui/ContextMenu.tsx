'use client';

/**
 * ContextMenu — right-click menu on the desktop surface.
 * Shows options like Refresh, Change Wallpaper, About.
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';

export type WallpaperTheme = 'default' | 'ocean' | 'sunset' | 'aurora';

interface ContextMenuProps {
  onChangeWallpaper: (theme: WallpaperTheme) => void;
  onRefresh: () => void;
}

interface MenuPosition {
  x: number;
  y: number;
}

export const WALLPAPER_THEMES: { id: WallpaperTheme; label: string }[] = [
  { id: 'default', label: 'Gold & Teal' },
  { id: 'ocean', label: 'Deep Ocean' },
  { id: 'sunset', label: 'Warm Sunset' },
  { id: 'aurora', label: 'Northern Lights' },
];

export function ContextMenu({ onChangeWallpaper, onRefresh }: ContextMenuProps) {
  const [position, setPosition] = useState<MenuPosition | null>(null);
  const [showWallpaperSub, setShowWallpaperSub] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleContextMenu = useCallback((e: MouseEvent) => {
    // Only trigger on the desktop surface (not on windows, taskbar, etc.)
    const target = e.target as HTMLElement;
    const isDesktop = target.closest('.os-desktop') !== null;
    const isWindow = target.closest('[data-window-id]') !== null;
    const isTaskbar = target.closest('[aria-label="Taskbar"]') !== null;
    const isDockIcon = target.closest('.desktop-icon-btn') !== null;

    if (isDesktop && !isWindow && !isTaskbar && !isDockIcon) {
      e.preventDefault();
      setPosition({ x: e.clientX, y: e.clientY });
      setShowWallpaperSub(false);
    }
  }, []);

  const close = useCallback(() => {
    setPosition(null);
    setShowWallpaperSub(false);
  }, []);

  useEffect(() => {
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('click', close);
    document.addEventListener('scroll', close);
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('click', close);
      document.removeEventListener('scroll', close);
    };
  }, [handleContextMenu, close]);

  // Clamp position so menu stays in viewport
  useEffect(() => {
    if (!position || !menuRef.current) return;
    const rect = menuRef.current.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    let { x, y } = position;
    if (x + rect.width > vw) x = vw - rect.width - 8;
    if (y + rect.height > vh) y = vh - rect.height - 8;
    if (x !== position.x || y !== position.y) {
      setPosition({ x, y });
    }
  }, [position]);

  if (!position && !showAbout) return null;

  // About dialog
  if (showAbout) {
    return (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(0,0,0,0.4)',
          backdropFilter: 'blur(4px)',
        }}
        onClick={() => setShowAbout(false)}
      >
        <div
          className="liquid-glass-about liquid-glass-surface"
          onClick={(e) => e.stopPropagation()}
          style={{
            padding: '28px 32px',
            borderRadius: '20px',
            background: 'var(--glass-strong)',
            border: '1px solid var(--glass-border-strong)',
            boxShadow: 'var(--glass-shadow)',
            maxWidth: '360px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          <h3 style={{ margin: 0, fontFamily: '"Space Grotesk", sans-serif', fontSize: '1.2rem', fontWeight: 500, color: 'var(--text)' }}>
            About This Portfolio
          </h3>
          <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--muted)', lineHeight: 1.6 }}>
            A browser-based desktop OS experience built with Next.js, React 19, and pure CSS glassmorphism. No external animation libraries — just the Web Animations API and CSS transitions.
          </p>
          <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--muted)' }}>
            Designed & developed by James Fontanilla.
          </p>
          <button
            onClick={() => setShowAbout(false)}
            style={{
              alignSelf: 'flex-end',
              padding: '8px 16px',
              borderRadius: '8px',
              border: '1px solid var(--border)',
              background: 'rgba(255,255,255,0.05)',
              color: 'var(--text)',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              marginTop: '4px',
            }}
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  if (!position) return null;

  return (
    <div
      ref={menuRef}
      role="menu"
      className="liquid-glass-context-menu liquid-glass-surface"
      style={{
        position: 'fixed',
        top: position.y,
        left: position.x,
        zIndex: 9999,
        minWidth: '180px',
        padding: '6px',
        borderRadius: '12px',
        background: 'var(--glass-strong)',
        backdropFilter: 'blur(24px) saturate(1.3)',
        WebkitBackdropFilter: 'blur(24px) saturate(1.3)',
        border: '1px solid var(--glass-border)',
        boxShadow: 'var(--glass-shadow)',
      }}
    >
      {/* Refresh */}
      <button
        role="menuitem"
        onClick={() => { onRefresh(); close(); }}
        style={menuItemStyle}
        onMouseEnter={hoverIn}
        onMouseLeave={hoverOut}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
          <path d="M4 12a8 8 0 0114.93-4M20 12a8 8 0 01-14.93 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <path d="M20 4v4h-4M4 20v-4h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Refresh
      </button>

      {/* Divider */}
      <div style={{ height: '1px', background: 'var(--border)', margin: '4px 8px' }} />

      {/* Change Wallpaper (submenu) */}
      <div style={{ position: 'relative' }}>
        <button
          role="menuitem"
          onClick={() => setShowWallpaperSub(!showWallpaperSub)}
          style={menuItemStyle}
          onMouseEnter={(e) => { hoverIn(e); setShowWallpaperSub(true); }}
          onMouseLeave={hoverOut}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
            <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="2"/>
            <circle cx="8.5" cy="8.5" r="2" fill="currentColor"/>
            <path d="M3 16l5-4 4 3 5-5 4 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Wallpaper
          <span style={{ marginLeft: 'auto', fontSize: '0.7rem', color: 'var(--muted)' }}>▸</span>
        </button>

        {/* Submenu */}
        {showWallpaperSub && (
          <div
            className="liquid-glass-context-submenu liquid-glass-surface"
            style={{
              position: 'absolute',
              left: '100%',
              top: 0,
              marginLeft: '4px',
              minWidth: '140px',
              padding: '6px',
              borderRadius: '10px',
              background: 'var(--glass-strong)',
              backdropFilter: 'blur(24px) saturate(1.3)',
              border: '1px solid var(--glass-border)',
              boxShadow: 'var(--glass-shadow)',
            }}
          >
            {WALLPAPER_THEMES.map((theme) => (
              <button
                key={theme.id}
                role="menuitem"
                onClick={() => { onChangeWallpaper(theme.id); close(); }}
                style={menuItemStyle}
                onMouseEnter={hoverIn}
                onMouseLeave={hoverOut}
              >
                {theme.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Divider */}
      <div style={{ height: '1px', background: 'var(--border)', margin: '4px 8px' }} />

      {/* About */}
      <button
        role="menuitem"
        onClick={() => { close(); setShowAbout(true); }}
        style={menuItemStyle}
        onMouseEnter={hoverIn}
        onMouseLeave={hoverOut}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
          <path d="M12 8v1M12 12v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        About This Portfolio
      </button>
    </div>
  );
}

// ─── Shared styles ────────────────────────────────────────────────────────────

const menuItemStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  width: '100%',
  padding: '8px 12px',
  borderRadius: '8px',
  border: 'none',
  background: 'transparent',
  color: 'var(--text)',
  fontSize: '0.8rem',
  fontWeight: 500,
  cursor: 'pointer',
  textAlign: 'left',
  outline: 'none',
  transition: 'background 100ms ease',
};

function hoverIn(e: React.MouseEvent<HTMLButtonElement>) {
  e.currentTarget.style.background = 'var(--glass-control-hover)';
}

function hoverOut(e: React.MouseEvent<HTMLButtonElement>) {
  e.currentTarget.style.background = 'transparent';
}
