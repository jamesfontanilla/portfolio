import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { MobileNav } from './MobileNav';

describe('MobileNav', () => {
  it('keeps primary sections visible and exposes secondary sections in More', () => {
    const onPanelChange = vi.fn();

    render(<MobileNav activePanel={null} onPanelChange={onPanelChange} />);

    expect(screen.getByRole('button', { name: 'Home' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Projects' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'About' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Contacts' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'More sections' })).toBeTruthy();
    expect(screen.queryByRole('menu')).toBeNull();

    fireEvent.click(screen.getByRole('button', { name: 'More sections' }));

    expect(screen.getByRole('menu', { name: 'More sections' })).toBeTruthy();
    expect(screen.getByRole('menuitem', { name: 'Certifications' })).toBeTruthy();
    expect(screen.getByRole('menuitem', { name: 'Events' })).toBeTruthy();
    expect(screen.getByRole('menuitem', { name: 'Blog' })).toBeTruthy();

    fireEvent.click(screen.getByRole('menuitem', { name: 'Blog' }));

    expect(onPanelChange).toHaveBeenCalledWith('blog');
    expect(screen.queryByRole('menu')).toBeNull();
  });
});
