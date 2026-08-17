import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ProjectsView } from './ProjectsView';

vi.mock('../OSUIProvider', () => ({
  useLayoutMode: () => 'mobile',
  usePortfolioData: () => ({
    settings: {},
    projects: [{
      title: 'Test Project',
      summary: 'A project summary.',
      status: 'Live',
      stack: ['Next.js'],
      impact: 'Impact: a useful test project.',
      coverImage: { url: '/test-project.png', alt: 'Test screenshot' },
      photos: [{ url: '/test-project-detail.png', alt: 'Test detail photo' }],
      challenge: 'A focused challenge.',
    }],
    competitions: [],
    certifications: [],
    events: [],
  }),
}));

describe('ProjectsView', () => {
  it('opens project details and photos inside the Projects window', () => {
    render(<ProjectsView />);

    fireEvent.click(screen.getByRole('button', { name: 'Open case study →' }));

    expect(screen.getByText('Project case study')).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Test Project' })).toBeTruthy();
    expect(screen.getByText('Project photos')).toBeTruthy();
    expect(screen.getByAltText('Test detail photo')).toBeTruthy();

    const hero = document.querySelector('[data-project-detail-hero]') as HTMLElement;
    const storyGrid = document.querySelector('[data-project-story-grid]') as HTMLElement;
    const galleryGrid = document.querySelector('[data-project-gallery-grid]') as HTMLElement;
    expect(hero.style.gridTemplateColumns).toContain('1fr');
    expect(storyGrid.style.gridTemplateColumns).toContain('1fr');
    expect(galleryGrid.style.gridTemplateColumns).toContain('1fr');

    fireEvent.click(screen.getByRole('button', { name: '← Back to projects' }));
    expect(screen.getByRole('button', { name: 'Open case study →' })).toBeTruthy();
  });
});
