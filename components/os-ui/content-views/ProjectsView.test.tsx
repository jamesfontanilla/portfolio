import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ProjectsView } from './ProjectsView';

vi.mock('../OSUIProvider', () => ({
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

    fireEvent.click(screen.getByRole('button', { name: '← Back to projects' }));
    expect(screen.getByRole('button', { name: 'Open case study →' })).toBeTruthy();
  });
});
