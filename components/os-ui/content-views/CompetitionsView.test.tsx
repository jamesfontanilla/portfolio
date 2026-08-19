import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { CompetitionsView } from './CompetitionsView';

vi.mock('../OSUIProvider', () => ({
  useLayoutMode: () => 'mobile',
  usePortfolioData: () => ({
    settings: {},
    projects: [],
    competitions: [{
      slug: 'vex-qcu2',
      title: 'VEX QCU2',
      summary: 'An international robotics record.',
      status: 'International Robotics',
      tags: ['VEX', 'Robotics'],
      body: '# The season\n\n**Built under pressure.**\n\n- Notebook\n- Teamwork',
      photos: [
        { url: '/vex-robot.jpg', alt: 'VEX robot' },
        { url: '/vex-team.jpg', alt: 'VEX team' },
      ],
    }],
    certifications: [],
    events: [],
  }),
}));

describe('CompetitionsView', () => {
  it('opens a Markdown competition record and responsive gallery inside the window', () => {
    render(<CompetitionsView />);

    fireEvent.click(screen.getByRole('button', { name: 'Open case study →' }));

    expect(screen.getByText('Competition case study')).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'VEX QCU2' })).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'The season' })).toBeTruthy();
    expect(screen.getByText('Built under pressure.')).toBeTruthy();
    expect(screen.getAllByAltText('VEX robot').length).toBeGreaterThan(0);
    expect(screen.getAllByAltText('VEX team').length).toBeGreaterThan(0);

    const hero = document.querySelector('[data-competition-detail-hero]') as HTMLElement;
    expect(hero.style.gridTemplateColumns).toContain('1fr');

    fireEvent.click(screen.getByRole('button', { name: 'Show photo 2: VEX team' }));
    expect(screen.getByText('VEX team')).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: '← Back to competitions' }));
    expect(screen.getByRole('button', { name: 'Open case study →' })).toBeTruthy();
  });

  it('opens the full record when the competition card is activated', () => {
    render(<CompetitionsView />);

    const card = document.querySelector('[data-competition-card="true"]');
    expect(card).toBeTruthy();
    fireEvent.keyDown(card as HTMLElement, { key: 'Enter' });

    expect(document.querySelector('[data-competition-detail="true"]')).toBeTruthy();
  });
});
