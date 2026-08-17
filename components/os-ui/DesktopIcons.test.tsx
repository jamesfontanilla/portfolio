import React from 'react';
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DesktopIcons } from './DesktopIcons';

describe('DesktopIcons responsive layout', () => {
  it('uses column-flowing grid rows inside a protected widget-safe height', () => {
    render(<DesktopIcons onOpen={() => {}} />);

    const shortcuts = document.querySelector('.desktop-icons') as HTMLElement;
    expect(shortcuts.style.display).toBe('grid');
    expect(shortcuts.style.gridAutoFlow).toBe('column');
    expect(shortcuts.style.gridTemplateRows).toBe('repeat(auto-fill, 80px)');
    expect(shortcuts.style.height).toBe('calc(100vh - 300px)');
    expect(screen.getByRole('button', { name: 'Open Tech Stack' })).toBeTruthy();
  });
});
