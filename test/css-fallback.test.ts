/**
 * Documentation test: verifies that the @supports fallback for backdrop-filter
 * is present in globals.css.
 *
 * CSS @supports rules are applied by the browser engine at runtime and cannot
 * be tested directly in jsdom/vitest. This test checks the source file
 * directly to confirm the intended fallback is authored.
 *
 * Requirements: 1.5
 */

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const GLOBALS_CSS_PATH = resolve(__dirname, '../app/globals.css');

describe('@supports backdrop-filter fallback in globals.css', () => {
  let css: string;

  // Read the CSS file once for all tests
  try {
    css = readFileSync(GLOBALS_CSS_PATH, 'utf-8');
  } catch {
    css = '';
  }

  it('contains @supports not (backdrop-filter: blur(1px)) rule', () => {
    expect(css).toContain('@supports not (backdrop-filter: blur(1px))');
  });

  it('applies --panel-strong background inside the @supports block', () => {
    expect(css).toContain('background: var(--panel-strong)');
  });

  it('@supports block targets .os-window class', () => {
    // Find the @supports block and check it contains .os-window
    const supportsStart = css.indexOf('@supports not (backdrop-filter: blur(1px))');
    expect(supportsStart).toBeGreaterThan(-1);

    // Grab the content of the @supports block (from its opening brace to matching close brace)
    const braceOpen = css.indexOf('{', supportsStart);
    let depth = 0;
    let braceClose = -1;
    for (let i = braceOpen; i < css.length; i++) {
      if (css[i] === '{') depth++;
      else if (css[i] === '}') {
        depth--;
        if (depth === 0) {
          braceClose = i;
          break;
        }
      }
    }

    const block = css.slice(braceOpen, braceClose + 1);
    expect(block).toContain('.os-window');
  });

  it('@supports block targets .os-dock class', () => {
    const supportsStart = css.indexOf('@supports not (backdrop-filter: blur(1px))');
    const braceOpen = css.indexOf('{', supportsStart);
    let depth = 0;
    let braceClose = -1;
    for (let i = braceOpen; i < css.length; i++) {
      if (css[i] === '{') depth++;
      else if (css[i] === '}') {
        depth--;
        if (depth === 0) {
          braceClose = i;
          break;
        }
      }
    }

    const block = css.slice(braceOpen, braceClose + 1);
    expect(block).toContain('.os-dock');
  });

  it('@supports block targets .glass-panel and .glass-card', () => {
    const supportsStart = css.indexOf('@supports not (backdrop-filter: blur(1px))');
    const braceOpen = css.indexOf('{', supportsStart);
    let depth = 0;
    let braceClose = -1;
    for (let i = braceOpen; i < css.length; i++) {
      if (css[i] === '{') depth++;
      else if (css[i] === '}') {
        depth--;
        if (depth === 0) {
          braceClose = i;
          break;
        }
      }
    }

    const block = css.slice(braceOpen, braceClose + 1);
    expect(block).toContain('.glass-panel');
    expect(block).toContain('.glass-card');
  });
});
