'use client';

/**
 * Wallpaper — rich, layered CSS wallpapers with visible color and depth.
 * Each theme uses stacked radial gradients directly on a full-viewport div
 * (no blur filters — pure gradients for performance and visibility).
 *
 * Requirements: 1.2, 11.4
 */

import React from 'react';
import type { WallpaperTheme } from './ContextMenu';

// ─── Theme backgrounds ────────────────────────────────────────────────────────

const THEME_STYLES: Record<WallpaperTheme, React.CSSProperties> = {
  default: {
    background: `
      radial-gradient(ellipse 80% 80% at 15% 10%, rgba(231, 180, 60, 0.25) 0%, transparent 55%),
      radial-gradient(ellipse 70% 90% at 85% 85%, rgba(50, 100, 120, 0.35) 0%, transparent 55%),
      radial-gradient(ellipse 50% 50% at 70% 25%, rgba(200, 160, 50, 0.12) 0%, transparent 50%),
      radial-gradient(ellipse 60% 60% at 30% 75%, rgba(60, 90, 100, 0.15) 0%, transparent 50%),
      radial-gradient(ellipse 40% 40% at 55% 55%, rgba(180, 140, 40, 0.08) 0%, transparent 45%),
      radial-gradient(ellipse 90% 50% at 50% 100%, rgba(40, 70, 80, 0.2) 0%, transparent 50%),
      radial-gradient(ellipse 45% 80% at 90% 40%, rgba(80, 60, 30, 0.12) 0%, transparent 50%),
      conic-gradient(from 220deg at 50% 50%, #0a0908 0deg, #0f0e0a 60deg, #0c0b08 120deg, #090a08 180deg, #080807 240deg, #0b0a08 300deg, #0a0908 360deg)
    `,
  },
  ocean: {
    background: `
      radial-gradient(ellipse 80% 90% at 10% 80%, rgba(20, 80, 180, 0.35) 0%, transparent 55%),
      radial-gradient(ellipse 70% 70% at 85% 15%, rgba(40, 160, 220, 0.25) 0%, transparent 50%),
      radial-gradient(ellipse 50% 60% at 50% 50%, rgba(15, 50, 100, 0.2) 0%, transparent 50%),
      radial-gradient(ellipse 60% 40% at 30% 20%, rgba(60, 180, 240, 0.12) 0%, transparent 45%),
      radial-gradient(ellipse 80% 60% at 70% 70%, rgba(10, 40, 90, 0.18) 0%, transparent 50%),
      radial-gradient(ellipse 40% 80% at 90% 50%, rgba(30, 120, 180, 0.1) 0%, transparent 45%),
      radial-gradient(ellipse 50% 50% at 20% 50%, rgba(50, 150, 200, 0.08) 0%, transparent 40%),
      conic-gradient(from 180deg at 50% 50%, #040810 0deg, #060e1a 60deg, #050a14 120deg, #030710 180deg, #040810 240deg, #050c16 300deg, #040810 360deg)
    `,
  },
  sunset: {
    background: `
      radial-gradient(ellipse 80% 80% at 10% 85%, rgba(200, 50, 80, 0.3) 0%, transparent 55%),
      radial-gradient(ellipse 70% 70% at 90% 15%, rgba(255, 150, 50, 0.28) 0%, transparent 50%),
      radial-gradient(ellipse 60% 50% at 50% 50%, rgba(150, 30, 60, 0.12) 0%, transparent 50%),
      radial-gradient(ellipse 50% 70% at 70% 80%, rgba(220, 80, 40, 0.15) 0%, transparent 45%),
      radial-gradient(ellipse 80% 40% at 30% 30%, rgba(255, 200, 80, 0.1) 0%, transparent 45%),
      radial-gradient(ellipse 40% 60% at 85% 60%, rgba(120, 20, 50, 0.14) 0%, transparent 45%),
      radial-gradient(ellipse 60% 60% at 15% 40%, rgba(200, 100, 50, 0.08) 0%, transparent 40%),
      conic-gradient(from 300deg at 50% 50%, #100606 0deg, #140808 60deg, #120706 120deg, #0e0505 180deg, #100606 240deg, #130807 300deg, #100606 360deg)
    `,
  },
  aurora: {
    background: `
      radial-gradient(ellipse 80% 70% at 20% 10%, rgba(80, 230, 160, 0.25) 0%, transparent 55%),
      radial-gradient(ellipse 70% 80% at 80% 80%, rgba(140, 60, 230, 0.3) 0%, transparent 55%),
      radial-gradient(ellipse 50% 60% at 55% 40%, rgba(60, 200, 240, 0.12) 0%, transparent 50%),
      radial-gradient(ellipse 60% 50% at 35% 70%, rgba(180, 100, 255, 0.14) 0%, transparent 45%),
      radial-gradient(ellipse 40% 70% at 75% 25%, rgba(100, 250, 180, 0.1) 0%, transparent 45%),
      radial-gradient(ellipse 70% 40% at 50% 90%, rgba(80, 40, 150, 0.15) 0%, transparent 45%),
      radial-gradient(ellipse 50% 50% at 10% 50%, rgba(60, 180, 140, 0.08) 0%, transparent 40%),
      conic-gradient(from 120deg at 50% 50%, #050a08 0deg, #060c0a 60deg, #050810 120deg, #040808 180deg, #050a08 240deg, #060e0c 300deg, #050a08 360deg)
    `,
  },
};

// ─── Animated floating orbs (simple, visible) ─────────────────────────────────

interface OrbDef {
  size: number;
  x: string;
  y: string;
  color: string;
  duration: string;
  delay: string;
}

const DEFAULT_ORBS: Record<WallpaperTheme, OrbDef[]> = {
  default: [
    { size: 500, x: '5%', y: '5%', color: 'rgba(231, 194, 90, 0.15)', duration: '20s', delay: '0s' },
    { size: 450, x: '65%', y: '60%', color: 'rgba(67, 102, 110, 0.2)', duration: '25s', delay: '-6s' },
    { size: 300, x: '45%', y: '15%', color: 'rgba(200, 160, 50, 0.08)', duration: '18s', delay: '-3s' },
    { size: 350, x: '80%', y: '30%', color: 'rgba(50, 80, 90, 0.12)', duration: '22s', delay: '-9s' },
    { size: 250, x: '25%', y: '70%', color: 'rgba(180, 140, 40, 0.07)', duration: '15s', delay: '-4s' },
    { size: 400, x: '55%', y: '80%', color: 'rgba(40, 70, 80, 0.1)', duration: '28s', delay: '-12s' },
  ],
  ocean: [
    { size: 500, x: '5%', y: '60%', color: 'rgba(20, 100, 200, 0.18)', duration: '22s', delay: '0s' },
    { size: 450, x: '70%', y: '5%', color: 'rgba(60, 180, 240, 0.14)', duration: '26s', delay: '-5s' },
    { size: 350, x: '40%', y: '75%', color: 'rgba(15, 60, 130, 0.16)', duration: '19s', delay: '-8s' },
    { size: 300, x: '85%', y: '50%', color: 'rgba(80, 200, 240, 0.08)', duration: '16s', delay: '-3s' },
    { size: 400, x: '20%', y: '20%', color: 'rgba(30, 80, 150, 0.1)', duration: '24s', delay: '-10s' },
    { size: 280, x: '60%', y: '40%', color: 'rgba(50, 160, 200, 0.07)', duration: '14s', delay: '-2s' },
  ],
  sunset: [
    { size: 500, x: '5%', y: '65%', color: 'rgba(220, 60, 80, 0.16)', duration: '21s', delay: '0s' },
    { size: 450, x: '75%', y: '5%', color: 'rgba(255, 160, 60, 0.14)', duration: '25s', delay: '-5s' },
    { size: 350, x: '45%', y: '45%', color: 'rgba(180, 40, 70, 0.1)', duration: '18s', delay: '-7s' },
    { size: 300, x: '20%', y: '20%', color: 'rgba(255, 200, 80, 0.08)', duration: '16s', delay: '-3s' },
    { size: 400, x: '65%', y: '70%', color: 'rgba(150, 30, 60, 0.12)', duration: '23s', delay: '-9s' },
    { size: 250, x: '85%', y: '45%', color: 'rgba(200, 100, 50, 0.07)', duration: '15s', delay: '-4s' },
  ],
  aurora: [
    { size: 500, x: '10%', y: '5%', color: 'rgba(80, 230, 160, 0.14)', duration: '23s', delay: '0s' },
    { size: 450, x: '65%', y: '65%', color: 'rgba(140, 70, 230, 0.16)', duration: '27s', delay: '-6s' },
    { size: 350, x: '50%', y: '25%', color: 'rgba(60, 200, 240, 0.08)', duration: '19s', delay: '-3s' },
    { size: 300, x: '80%', y: '15%', color: 'rgba(100, 240, 180, 0.07)', duration: '17s', delay: '-9s' },
    { size: 400, x: '20%', y: '60%', color: 'rgba(160, 100, 240, 0.1)', duration: '25s', delay: '-5s' },
    { size: 280, x: '40%', y: '80%', color: 'rgba(80, 180, 200, 0.06)', duration: '14s', delay: '-2s' },
  ],
};

// ─── Component ────────────────────────────────────────────────────────────────

interface WallpaperProps {
  theme?: WallpaperTheme;
}

export function Wallpaper({ theme = 'default' }: WallpaperProps) {
  const style = THEME_STYLES[theme];
  const orbs = DEFAULT_ORBS[theme];

  return (
    <>
      {/* Main gradient layer — fills entire viewport */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: '-50px', // overflow to prevent edge clipping on orb movement
          ...style,
        }}
      />

      {/* Floating orbs */}
      {orbs.map((orb, i) => (
        <div
          key={`${theme}-${i}`}
          className="wallpaper-orb"
          style={{
            width: orb.size,
            height: orb.size,
            left: orb.x,
            top: orb.y,
            background: `radial-gradient(circle at center, ${orb.color} 0%, transparent 65%)`,
            animationName: 'orbFloat',
            animationDuration: orb.duration,
            animationDelay: orb.delay,
          }}
        />
      ))}

      {/* Grain texture */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.04,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '150px 150px',
          mixBlendMode: 'overlay',
          pointerEvents: 'none',
        }}
      />

      {/* Vignette */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse 75% 65% at 50% 50%, transparent 0%, rgba(0,0,0,0.35) 100%)',
          pointerEvents: 'none',
        }}
      />
    </>
  );
}
