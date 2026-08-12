'use client';

/**
 * ErrorView — error state with retry action for Content Views.
 *
 * Renders inside the Window content area when a content load fails.
 * The Window itself remains open and functional — only the content area
 * shows the error state.
 *
 * Requirements: 5.9
 */

import React from 'react';

export interface ErrorViewProps {
  message?: string;
  onRetry: () => void;
}

export function ErrorView({ message, onRetry }: ErrorViewProps) {
  return (
    <div
      role="alert"
      style={{
        padding: '32px 24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
        textAlign: 'center',
        minHeight: '200px',
      }}
    >
      {/* Error icon */}
      <div
        aria-hidden="true"
        style={{
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          background: 'rgba(231, 119, 111, 0.12)',
          border: '1px solid rgba(231, 119, 111, 0.24)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--red)',
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.8" />
          <path d="M12 7v5M12 16v1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>

      {/* Error message */}
      <div>
        <p
          style={{
            margin: '0 0 6px',
            color: 'var(--text)',
            fontWeight: 600,
            fontSize: '0.95rem',
          }}
        >
          Failed to load content
        </p>
        {message && (
          <p
            style={{
              margin: 0,
              color: 'var(--muted)',
              fontSize: '0.82rem',
              maxWidth: '280px',
            }}
          >
            {message}
          </p>
        )}
      </div>

      {/* Retry button */}
      <button
        onClick={onRetry}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '8px 20px',
          borderRadius: '999px',
          background: 'rgba(255, 255, 255, 0.06)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          color: 'var(--text)',
          fontSize: '0.85rem',
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'background 150ms ease, border-color 150ms ease',
          outline: 'none',
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M1 4v6h6M23 20v-6h-6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Try again
      </button>
    </div>
  );
}
