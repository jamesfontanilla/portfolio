'use client';

/**
 * Taskbar — Windows 11 style centered taskbar with macOS glassmorphism aesthetics.
 * 
 * - Centered icon buttons for open windows (like Win11 taskbar)
 * - Glassmorphism blur + rounded pill shape (macOS dock feel)
 * - System tray on the right with clock
 * - Floats above the bottom edge
 */

import React, { useState, useEffect } from 'react';
import type { ContentType, WindowState, Notification } from '@/store/windowManagerStore';
import { contentTypeLabel } from './AppIcon';

// ─── Constants ────────────────────────────────────────────────────────────────

export const TASKBAR_HEIGHT = 68; // includes floating gap

// ─── Props ────────────────────────────────────────────────────────────────────

export interface TaskbarProps {
  windows: WindowState[];
  notifications: Notification[];
  onWindowClick: (type: ContentType) => void;
  onDismissNotification?: (id: string) => void;
}

// ─── Clock ────────────────────────────────────────────────────────────────────

function TaskbarClock() {
  const [time, setTime] = useState('');

  useEffect(() => {
    function update() {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }
    update();
    const id = setInterval(update, 30000);
    return () => clearInterval(id);
  }, []);

  if (!time) return null;

  return (
    <span
      style={{
        fontSize: '0.72rem',
        fontWeight: 500,
        color: 'var(--muted)',
        whiteSpace: 'nowrap',
        padding: '0 8px',
      }}
    >
      {time}
    </span>
  );
}

// ─── Small icon for taskbar buttons ───────────────────────────────────────────

function TaskbarIcon({ type }: { type: ContentType }) {
  const s = 18;
  switch (type) {
    case 'about':
      return (<svg width={s} height={s} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>);
    case 'projects':
      return (<svg width={s} height={s} viewBox="0 0 24 24" fill="none"><rect x="3" y="7" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.8"/><path d="M3 11h18M8 7V5a1 1 0 011-1h6a1 1 0 011 1v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>);
    case 'competitions':
      return (<svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M7 4h10v4a5 5 0 01-10 0V4Z" stroke="currentColor" strokeWidth="1.8"/><path d="M7 6H4v1a4 4 0 004 4M17 6h3v1a4 4 0 01-4 4M12 13v4M8 20h8M9 17h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>);
    case 'certifications':
      return (<svg width={s} height={s} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="10" r="5" stroke="currentColor" strokeWidth="1.8"/><path d="M9 21l3-3 3 3V15.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>);
    case 'events':
      return (<svg width={s} height={s} viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.8"/><path d="M3 10h18M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>);
    case 'contacts':
      return (<svg width={s} height={s} viewBox="0 0 24 24" fill="none"><rect x="3" y="6" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="1.8"/><path d="M3 9l9 6 9-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>);
    case 'blog':
      return (<svg width={s} height={s} viewBox="0 0 24 24" fill="none"><rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="1.8"/><path d="M8 8h8M8 12h6M8 16h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>);
    case 'tech-stack':
      return (<svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M5 7h14M5 12h14M5 17h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><circle cx="9" cy="7" r="2" fill="var(--gold)" stroke="currentColor" strokeWidth="1.1"/><circle cx="15" cy="12" r="2" fill="var(--gold)" stroke="currentColor" strokeWidth="1.1"/><circle cx="11" cy="17" r="2" fill="var(--gold)" stroke="currentColor" strokeWidth="1.1"/></svg>);
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

const ALL_CONTENT_TYPES: ContentType[] = ['about', 'projects', 'competitions', 'certifications', 'events', 'contacts', 'blog', 'tech-stack'];

export function Taskbar({ windows, notifications, onWindowClick, onDismissNotification }: TaskbarProps) {
  const [hoverType, setHoverType] = useState<ContentType | null>(null);
  const [previewHtml, setPreviewHtml] = useState<string | null>(null);
  const hoverTimeout = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-dismiss notifications
  useEffect(() => {
    if (!onDismissNotification || notifications.length === 0) return;
    const timers = notifications.map((n) => {
      const remaining = n.expiresAt - Date.now();
      return setTimeout(() => onDismissNotification(n.id), Math.max(0, remaining));
    });
    return () => timers.forEach(clearTimeout);
  }, [notifications, onDismissNotification]);

  // Get preview HTML when hovering an open window
  function handleMouseEnter(type: ContentType) {
    setHoverType(type);

    // Find the window element and capture its content for preview
    const win = windows.find(w => w.contentType === type && (w.isOpen || w.isMinimized));
    if (win) {
      // Delay slightly to avoid flicker on quick mouse passes
      hoverTimeout.current = setTimeout(() => {
        const el = document.querySelector(`[data-window-id="${win.id}"]`);
        if (el) {
          // Get only the content area (skip title bar)
          const contentRegion = el.querySelector('[role="region"]');
          if (contentRegion) {
            setPreviewHtml(contentRegion.innerHTML);
          }
        }
      }, 250);
    }
  }

  function handleMouseLeave() {
    setHoverType(null);
    setPreviewHtml(null);
    if (hoverTimeout.current) {
      clearTimeout(hoverTimeout.current);
      hoverTimeout.current = null;
    }
  }

  return (
    <div
      role="navigation"
      aria-label="Taskbar"
      className="liquid-glass-taskbar liquid-glass-surface"
      style={{
        position: 'fixed',
        bottom: '12px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        padding: '6px 12px',
        borderRadius: '999px',
        background: 'var(--glass-regular)',
        backdropFilter: 'blur(28px) saturate(1.35)',
        WebkitBackdropFilter: 'blur(28px) saturate(1.35)',
        border: '1px solid var(--glass-border-strong)',
        boxShadow: 'var(--glass-shadow)',
      }}
    >
      {/* Always show all app icons (pinned) */}
      {ALL_CONTENT_TYPES.map((type) => {
        const win = windows.find(w => w.contentType === type);
        const isOpen = win ? (win.isOpen || win.isMinimized) : false;
        const isActive = win ? (win.isOpen && !win.isMinimized) : false;
        const isHovered = hoverType === type;
        const showPreview = isHovered && isOpen && previewHtml;

        return (
          <div key={type} style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {/* Thumbnail preview (for open windows) or tooltip (for closed) */}
            {isHovered && (
              showPreview ? (
                <div
                  className="liquid-glass-taskbar-preview liquid-glass-surface"
                  style={{
                    position: 'absolute',
                    bottom: 'calc(100% + 14px)',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '220px',
                    height: '150px',
                    borderRadius: '10px',
                    background: 'var(--glass-strong)',
                    border: '1px solid var(--glass-border)',
                    boxShadow: 'var(--glass-shadow)',
                    overflow: 'hidden',
                    pointerEvents: 'none',
                    zIndex: 1100,
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  {/* Mini title bar */}
                  <div style={{ padding: '6px 10px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                    <TaskbarIcon type={type} />
                    <span style={{ fontSize: '0.65rem', fontWeight: 600, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {contentTypeLabel[type]}
                    </span>
                  </div>
                  {/* Scaled content preview */}
                  <div
                    style={{
                      flex: 1,
                      overflow: 'hidden',
                      position: 'relative',
                    }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '680px',
                        height: '480px',
                        transform: 'scale(0.3)',
                        transformOrigin: 'top left',
                        pointerEvents: 'none',
                        opacity: 0.85,
                      }}
                      dangerouslySetInnerHTML={{ __html: previewHtml }}
                    />
                  </div>
                </div>
              ) : (
                <div
                  className="liquid-glass-tooltip"
                  role="tooltip"
                  style={{
                    position: 'absolute',
                    bottom: 'calc(100% + 10px)',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    padding: '4px 10px',
                    borderRadius: '8px',
                    background: 'var(--glass-strong)',
                    border: '1px solid var(--glass-border)',
                    color: 'var(--text)',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                    pointerEvents: 'none',
                    zIndex: 1100,
                  }}
                >
                  {contentTypeLabel[type]}
                </div>
              )
            )}

            <button
              onClick={() => onWindowClick(type)}
              onMouseEnter={() => handleMouseEnter(type)}
              onMouseLeave={handleMouseLeave}
              aria-label={contentTypeLabel[type]}
              style={{
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '12px',
                border: 'none',
                background: isActive ? 'var(--glass-control-hover)' : 'transparent',
                color: isActive ? 'var(--text)' : 'var(--muted)',
                cursor: 'pointer',
                transition: 'background 180ms ease, transform 180ms ease, color 180ms ease, box-shadow 180ms ease',
                transform: isHovered ? 'scale(1.15)' : 'scale(1)',
                boxShadow: isHovered ? '0 8px 22px rgba(1, 7, 18, 0.2), 0 1px 0 rgba(255,255,255,0.1) inset' : 'none',
                outline: 'none',
              }}
            >
              <TaskbarIcon type={type} />
            </button>

            {/* Indicator dot — gold if active, muted if minimized, hidden if closed */}
            {isOpen && (
              <div
                style={{
                  width: isActive ? '6px' : '4px',
                  height: '4px',
                  borderRadius: '2px',
                  background: isActive ? 'var(--gold)' : 'var(--muted)',
                  marginTop: '2px',
                  transition: 'width 150ms ease, background 150ms ease',
                }}
              />
            )}
          </div>
        );
      })}

      {/* Separator + Clock */}
      <div style={{ width: '1px', height: '20px', background: 'var(--border)', margin: '0 6px' }} />
      <TaskbarClock />
    </div>
  );
}
