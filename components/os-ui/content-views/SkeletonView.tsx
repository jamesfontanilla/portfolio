'use client';

/**
 * SkeletonView — animated loading skeleton placeholder.
 *
 * Renders within the Window content area while a lazy content view is loading.
 * Uses a pulsing animation to indicate loading state.
 *
 * Requirements: 5.8
 */

import React from 'react';

// ─── Skeleton bar component ───────────────────────────────────────────────────

function SkeletonBar({ width = '100%', height = '16px', style }: {
  width?: string;
  height?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      aria-hidden="true"
      style={{
        width,
        height,
        borderRadius: '6px',
        background: 'rgba(255, 255, 255, 0.06)',
        animation: 'skeleton-pulse 1.5s ease-in-out infinite',
        ...style,
      }}
    />
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function SkeletonView() {
  return (
    <div
      role="status"
      aria-label="Loading content"
      aria-busy="true"
      style={{
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}
    >
      {/* Keyframe style injected inline */}
      <style>{`
        @keyframes skeleton-pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
      `}</style>

      {/* Title placeholder */}
      <SkeletonBar width="60%" height="24px" />

      {/* Subtitle placeholder */}
      <SkeletonBar width="40%" height="16px" />

      {/* Content lines */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '8px' }}>
        <SkeletonBar width="100%" height="14px" />
        <SkeletonBar width="95%" height="14px" />
        <SkeletonBar width="88%" height="14px" />
        <SkeletonBar width="72%" height="14px" />
      </div>

      {/* Card placeholder */}
      <div
        aria-hidden="true"
        style={{
          borderRadius: '16px',
          background: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          marginTop: '8px',
        }}
      >
        <SkeletonBar width="50%" height="18px" />
        <SkeletonBar width="80%" height="14px" />
        <SkeletonBar width="65%" height="14px" />
      </div>

      {/* Second card placeholder */}
      <div
        aria-hidden="true"
        style={{
          borderRadius: '16px',
          background: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        <SkeletonBar width="45%" height="18px" />
        <SkeletonBar width="75%" height="14px" />
        <SkeletonBar width="60%" height="14px" />
      </div>
    </div>
  );
}
