'use client';

/**
 * Dock — persistent bottom navigation bar.
 *
 * Renders one AppIcon per ContentType. Reads notifications from context
 * and shows floating toasts that auto-dismiss after 3000ms.
 *
 * Requirements: 2.1, 2.2, 2.4, 2.7, 2.8, 2.9, 2.10, 8.6
 */

import React, { useState, useEffect, useRef } from 'react';
import { AppIcon, contentTypeLabel } from './AppIcon';
import type { ContentType, WindowState, Notification } from '@/store/windowManagerStore';

// ─── Constants ────────────────────────────────────────────────────────────────

const CONTENT_TYPES: ContentType[] = [
  'about',
  'projects',
  'certifications',
  'events',
  'contacts',
];

const TOAST_DURATION_MS = 3000;

// ─── Props ────────────────────────────────────────────────────────────────────

export interface DockProps {
  windows: WindowState[];
  notifications: Notification[];
  onIconClick: (type: ContentType) => void;
  /** Map of contentType → ref for minimize animation targeting */
  iconRefs?: Map<ContentType, React.RefObject<HTMLButtonElement | null>>;
  onDismissNotification?: (id: string) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function Dock({
  windows,
  notifications,
  onIconClick,
  iconRefs,
  onDismissNotification,
}: DockProps) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  // Internal refs for icons when no external refs provided
  const internalRefs = useRef<Map<ContentType, React.RefObject<HTMLButtonElement | null>>>(
    new Map(CONTENT_TYPES.map((ct) => [ct, React.createRef<HTMLButtonElement>()])),
  );

  const getIconRef = (type: ContentType) =>
    iconRefs?.get(type) ?? internalRefs.current.get(type)!;

  // Auto-dismiss notifications after 3000ms
  useEffect(() => {
    if (!onDismissNotification || notifications.length === 0) return;

    const timers = notifications.map((n) => {
      const remaining = n.expiresAt - Date.now();
      const delay = Math.max(0, remaining);
      return setTimeout(() => {
        onDismissNotification(n.id);
      }, delay);
    });

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [notifications, onDismissNotification]);

  return (
    <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1000, display: 'flex', flexDirection: 'column', alignItems: 'center', pointerEvents: 'none' }}>
      {/* Toast notifications above Dock */}
      {notifications.length > 0 && (
        <div
          aria-live="polite"
          aria-atomic="false"
          style={{
            position: 'fixed',
            bottom: '90px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            pointerEvents: 'auto',
            zIndex: 1001,
          }}
        >
          {notifications.map((n) => (
            <div
              key={n.id}
              role="alert"
              style={{
                padding: '8px 16px',
                borderRadius: '12px',
                background: 'var(--panel-strong)',
                border: '1px solid var(--border)',
                color: 'var(--text)',
                fontSize: '0.85rem',
                boxShadow: 'var(--shadow)',
                maxWidth: '320px',
                textAlign: 'center',
              }}
            >
              {n.message}
            </div>
          ))}
        </div>
      )}

      {/* Dock bar — positioning handled by .os-dock CSS class */}
      <nav
        aria-label="Application Dock"
        className="os-dock"
        style={{ pointerEvents: 'auto' }}
      >
        {CONTENT_TYPES.map((type, index) => {
          const win = windows.find((w) => w.contentType === type);
          const isOpen = win ? win.isOpen && !win.isMinimized : false;
          const isMinimized = win ? win.isMinimized : false;

          return (
            <AppIcon
              key={type}
              type={type}
              isOpen={isOpen}
              isMinimized={isMinimized}
              hoverIndex={hoverIndex}
              selfIndex={index}
              iconRef={getIconRef(type)}
              onClick={() => onIconClick(type)}
            />
          );
        })}
      </nav>
    </div>
  );
}

// ─── Export helper ────────────────────────────────────────────────────────────

export { CONTENT_TYPES, TOAST_DURATION_MS };
