'use client';

import React, { useState } from 'react';
import { useLayoutMode, usePortfolioData } from '../OSUIProvider';
import { buildImageUrl } from '@/lib/image';
import type { Competition, PortfolioImage } from '@/lib/types';
import { MarkdownContent } from './MarkdownContent';

function Tag({ label, gold = false }: { label: string; gold?: boolean }) {
  return (
    <span
      style={{
        display: 'inline-flex', alignItems: 'center', maxWidth: '100%', padding: '3px 10px',
        borderRadius: '999px', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.05em',
        textTransform: 'uppercase', whiteSpace: 'normal', overflowWrap: 'anywhere',
        background: gold ? 'rgba(231,194,90,0.1)' : 'rgba(255,255,255,0.04)',
        border: `1px solid ${gold ? 'rgba(231,194,90,0.24)' : 'rgba(255,255,255,0.08)'}`,
        color: gold ? 'var(--gold)' : 'var(--muted)',
      }}
    >{label}</span>
  );
}

function textExcerpt(markdown: string, fallback = 'Open the competition record for the full story.') {
  const excerpt = markdown
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[`*_>#~-]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  return excerpt ? `${excerpt.slice(0, 180)}${excerpt.length > 180 ? '…' : ''}` : fallback;
}

function getGallery(competition: Competition) {
  const images = [competition.coverImage, ...(competition.photos ?? [])].filter(
    (image): image is PortfolioImage => Boolean(image && buildImageUrl(image)),
  );
  return images.filter((image, index, all) => buildImageUrl(image) !== buildImageUrl(all[index - 1]));
}

function CompetitionImage({ image, eager = false }: { image: PortfolioImage; eager?: boolean }) {
  const url = buildImageUrl(image);
  if (!url) return null;
  return <img src={url} alt={image.alt} loading={eager ? 'eager' : 'lazy'} style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover' }} />;
}

function CompetitionGallery({ competition, isMobile }: { competition: Competition; isMobile: boolean }) {
  const images = getGallery(competition);
  const [activeIndex, setActiveIndex] = useState(0);
  if (!images.length) return null;
  const activeImage = images[activeIndex] ?? images[0];

  return (
    <section data-competition-gallery="true" className={`competition-gallery-view${isMobile ? ' is-mobile' : ''}`}>
      <div className="competition-gallery-header">
        <div><span style={{ display: 'block', color: 'var(--gold)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Visual record</span><h3 style={{ margin: '4px 0 0', fontSize: '1.15rem', fontWeight: 500 }}>Competition gallery</h3></div>
        <span style={{ color: 'var(--muted)', fontSize: '0.78rem' }}>{images.length} {images.length === 1 ? 'photo' : 'photos'}</span>
      </div>
      <figure className="competition-gallery-feature">
        <div className="competition-gallery-feature-frame"><CompetitionImage image={activeImage} eager /></div>
        <figcaption style={{ padding: '9px 11px', color: 'var(--muted)', fontSize: '0.76rem', overflowWrap: 'anywhere' }}>{activeImage.alt}</figcaption>
      </figure>
      {images.length > 1 ? (
        <div role="list" aria-label="Competition photos" className="competition-gallery-thumbs">
          {images.map((image, index) => (
            <div role="listitem" key={`${buildImageUrl(image)}-${index}`} style={{ minWidth: 0 }}>
              <button type="button" className="competition-gallery-thumb" aria-label={`Show photo ${index + 1}: ${image.alt}`} aria-pressed={index === activeIndex} onClick={() => setActiveIndex(index)} style={{ border: `1px solid ${index === activeIndex ? 'var(--gold)' : 'rgba(255,255,255,0.08)'}`, opacity: index === activeIndex ? 1 : 0.68 }}>
                <CompetitionImage image={image} />
              </button>
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}

function CompetitionCard({ competition, index, onOpen }: { competition: Competition; index: number; onOpen: () => void }) {
  const gallery = getGallery(competition);
  const summary = competition.summary || textExcerpt(competition.body);
  function handleCardClick(event: React.MouseEvent<HTMLElement>) {
    if ((event.target as HTMLElement).closest('a, button')) return;
    onOpen();
  }

  function handleCardKeyDown(event: React.KeyboardEvent<HTMLElement>) {
    if (event.target !== event.currentTarget) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onOpen();
    }
  }

  return (
    <article data-competition-card="true" tabIndex={0} onClick={handleCardClick} onKeyDown={handleCardKeyDown} style={{ position: 'relative', overflow: 'hidden', background: 'linear-gradient(145deg, rgba(231,194,90,0.1), rgba(255,255,255,0.035) 42%, rgba(255,255,255,0.025))', border: '1px solid rgba(231,194,90,0.2)', borderRadius: '22px', padding: '22px', display: 'flex', flex: '0 0 auto', flexDirection: 'column', gap: '14px', cursor: 'pointer', minWidth: 0 }}>
      <div aria-hidden="true" style={{ position: 'absolute', top: '-42px', right: '-28px', width: '140px', height: '140px', borderRadius: '50%', border: '1px solid rgba(231,194,90,0.18)', boxShadow: '0 0 0 18px rgba(231,194,90,0.025), 0 0 0 36px rgba(231,194,90,0.018)' }} />
      {gallery[0] ? <div style={{ overflow: 'hidden', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)' }}><div style={{ aspectRatio: '16 / 8' }}><CompetitionImage image={gallery[0]} /></div></div> : null}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', minWidth: 0 }}>
        <div style={{ display: 'flex', gap: '12px', minWidth: 0 }}>
          <span style={{ flex: '0 0 auto', color: 'var(--gold)', fontFamily: '"Space Grotesk","Manrope",sans-serif', fontSize: '0.76rem', fontWeight: 700, letterSpacing: '0.08em' }}>{String(index + 1).padStart(2, '0')}</span>
          <div style={{ minWidth: 0 }}><p style={{ margin: '0 0 5px', color: 'var(--gold)', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Competition record</p><h3 style={{ margin: 0, color: 'var(--text)', fontFamily: '"Space Grotesk","Manrope",sans-serif', fontSize: '1.05rem', fontWeight: 500, letterSpacing: '-0.02em', overflowWrap: 'anywhere' }}>{competition.title}</h3></div>
        </div>
        <Tag label={competition.status} gold />
      </div>
      <p style={{ margin: 0, color: 'var(--muted)', lineHeight: 1.65, fontSize: '0.88rem', overflowWrap: 'anywhere' }}>{summary}</p>
      {competition.tags.length > 0 ? <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>{competition.tags.map((tag) => <Tag key={tag} label={tag} />)}</div> : null}
      <button type="button" onClick={onOpen} style={{ alignSelf: 'flex-start', marginTop: '2px', padding: 0, border: 0, background: 'transparent', color: 'var(--gold)', fontSize: '0.84rem', fontWeight: 700, cursor: 'pointer' }}>Open case study →</button>
    </article>
  );
}

function CompetitionDetail({ competition, onBack, isMobile }: { competition: Competition; onBack: () => void; isMobile: boolean }) {
  const gallery = getGallery(competition);
  const summary = competition.summary || textExcerpt(competition.body);
  const hasGallery = gallery.length > 0;

  return (
    <div className={`competition-scroll-area competition-detail-view${isMobile ? ' is-mobile' : ''}`} data-competition-detail="true">
      <div className="competition-detail-toolbar"><button type="button" onClick={onBack} style={{ maxWidth: '100%', padding: '8px 12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', color: 'var(--text)', cursor: 'pointer' }}>← Back to competitions</button><span style={{ color: 'var(--muted)', fontSize: '0.76rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Competition case study</span></div>
      <section data-competition-detail-hero="true" data-layout={isMobile ? 'mobile' : 'desktop'} data-has-gallery={hasGallery ? 'true' : 'false'} className="competition-detail-hero">
        <div className="competition-detail-hero-copy"><div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}><Tag label={competition.status} gold />{competition.tags.slice(0, 4).map((tag) => <Tag key={tag} label={tag} />)}</div><h2 className="competition-detail-title">{competition.title}</h2><p className="competition-detail-summary">{summary}</p></div>
        <div data-competition-detail-facts="true" className="competition-detail-facts"><div><span style={{ display: 'block', color: 'var(--muted)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Format</span><strong style={{ display: 'block', marginTop: '4px', lineHeight: 1.4, overflowWrap: 'anywhere' }}>One continuous Markdown record</strong></div>{hasGallery ? <div><span style={{ display: 'block', color: 'var(--muted)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Photos</span><strong style={{ display: 'block', marginTop: '4px' }}>{gallery.length}</strong></div> : null}</div>
      </section>
      {gallery.length ? <CompetitionGallery competition={competition} isMobile={isMobile} /> : null}
      <article data-competition-story="true" className="competition-detail-story"><div><span style={{ color: 'var(--gold)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>The record</span><h3 style={{ margin: '4px 0 0', fontSize: '1.25rem', fontWeight: 500 }}>From the field</h3></div><MarkdownContent source={competition.body} /></article>
    </div>
  );
}

export function CompetitionsView() {
  const data = usePortfolioData().competitions;
  const isMobile = useLayoutMode() === 'mobile';
  const [selectedCompetition, setSelectedCompetition] = useState<Competition | null>(null);

  if (selectedCompetition) return <CompetitionDetail competition={selectedCompetition} isMobile={isMobile} onBack={() => setSelectedCompetition(null)} />;

  return (
    <div className="competition-scroll-area" data-competition-scroll="true" style={{ height: isMobile ? 'auto' : '100%', minHeight: isMobile ? 'auto' : 0, overflowY: isMobile ? 'visible' : 'auto', overflowX: 'hidden', overscrollBehaviorY: 'contain', scrollbarGutter: 'stable', boxSizing: 'border-box', minWidth: 0, padding: isMobile ? '16px 16px 28px' : '24px 24px 28px', display: 'flex', flex: '1 1 auto', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', gap: '12px', flexWrap: 'wrap' }}><div><span style={{ display: 'block', color: 'var(--gold)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Field notes</span><h2 style={{ margin: '5px 0 0', fontFamily: '"Space Grotesk","Manrope",sans-serif', fontWeight: 500, fontSize: '1.5rem', letterSpacing: '-0.04em', color: 'var(--text)' }}>Competitions</h2></div><span style={{ color: 'var(--muted)', fontSize: '0.78rem' }}>{data.length} records</span></div>
      <p style={{ margin: 0, color: 'var(--muted)', lineHeight: 1.6, fontSize: '0.86rem' }}>Select a competition to open its full Markdown record and photo gallery inside this window.</p>
      {data.map((competition, index) => <CompetitionCard key={`${competition.slug ?? competition.title}-${index}`} competition={competition} index={index} onOpen={() => setSelectedCompetition(competition)} />)}
    </div>
  );
}
