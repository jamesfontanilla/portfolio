'use client';

import React, { useMemo, useState } from 'react';
import {
  siCapacitor,
  siFastapi,
  siFastify,
  siFiles,
  siFramer,
  siJsonwebtokens,
  siNestjs,
  siNodedotjs,
  siNextdotjs,
  siPostgresql,
  siPrisma,
  siPwa,
  siRadixui,
  siReact,
  siReactrouter,
  siSanity,
  siSqlalchemy,
  siSocket,
  siStellar,
  siSupabase,
  siTailwindcss,
  siThreedotjs,
  siTypescript,
  siVitest,
  siVite,
  siZod,
  type SimpleIcon,
} from 'simple-icons';
import { usePortfolioData } from '../OSUIProvider';
import { auditedProjects, techById, techCategories, techStack, type TechCategory, type TechStackEntry } from '@/lib/tech-stack';

const BRAND_ICONS: Partial<Record<string, SimpleIcon>> = {
  typescript: siTypescript,
  react: siReact,
  nextjs: siNextdotjs,
  vite: siVite,
  'react-router': siReactrouter,
  tailwind: siTailwindcss,
  capacitor: siCapacitor,
  pwa: siPwa,
  fastapi: siFastapi,
  nestjs: siNestjs,
  fastify: siFastify,
  node: siNodedotjs,
  'python-data': siSqlalchemy,
  supabase: siSupabase,
  postgres: siPostgresql,
  prisma: siPrisma,
  sanity: siSanity,
  three: siThreedotjs,
  'react-three-fiber': siThreedotjs,
  websockets: siSocket,
  'framer-motion': siFramer,
  zod: siZod,
  radix: siRadixui,
  testing: siVitest,
  auth: siJsonwebtokens,
  stellar: siStellar,
  'data-import': siFiles,
};

const SYMBOL_GLYPHS: Record<string, string> = {
  'aws-s3': '⌁',
  indexeddb: '◫',
  drei: '◇',
  zustand: '✦',
};

function BrandMark({ entry, size = 44 }: { entry: Pick<TechStackEntry, 'id' | 'mark' | 'color' | 'name'>; size?: number }) {
  const icon = BRAND_ICONS[entry.id];
  const glyph = SYMBOL_GLYPHS[entry.id] ?? entry.mark;
  const iconColor = icon?.hex === '000000' ? entry.color : icon ? `#${icon.hex}` : entry.color;

  return (
    <span
      role="img"
      aria-label={`${entry.name} logo mark`}
      title={`${entry.name} logo mark`}
      data-brand-logo={icon ? 'simple-icons' : 'custom-symbol'}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        flexShrink: 0,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: size > 40 ? '13px' : '9px',
        background: `linear-gradient(145deg, ${entry.color}30, rgba(255,255,255,0.05))`,
        border: `1px solid ${entry.color}70`,
        color: iconColor,
        fontSize: size > 40 ? (glyph.length > 2 ? '0.58rem' : '0.92rem') : (glyph.length > 2 ? '0.52rem' : '0.68rem'),
        fontWeight: 800,
        letterSpacing: '-0.04em',
        boxShadow: `0 7px 18px ${iconColor}18`,
      }}
    >
      {icon ? <svg width={size > 40 ? 23 : 14} height={size > 40 ? 23 : 14} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d={icon.path} /></svg> : glyph}
    </span>
  );
}

function TechPill({ id, onClick }: { id: string; onClick?: () => void }) {
  const entry = techById(id);
  if (!entry) return null;

  const content = (
    <>
      <BrandMark entry={entry} size={24} />
      <span>{entry.name}</span>
    </>
  );

  if (!onClick) {
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 9px 4px 4px', borderRadius: '999px', background: 'rgba(255,255,255,0.045)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--muted)', fontSize: '0.7rem', fontWeight: 600 }}>
        {content}
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 9px 4px 4px', borderRadius: '999px', background: 'rgba(255,255,255,0.045)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--muted)', fontSize: '0.7rem', fontWeight: 600, cursor: 'pointer' }}
    >
      {content}
    </button>
  );
}

function SectionHeading({ eyebrow, title, detail }: { eyebrow: string; title: string; detail?: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
      <p style={{ margin: 0, color: 'var(--gold)', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>{eyebrow}</p>
      <h3 style={{ margin: 0, color: 'var(--text)', fontFamily: '"Space Grotesk","Manrope",sans-serif', fontSize: '1.05rem', fontWeight: 500, letterSpacing: '-0.02em' }}>{title}</h3>
      {detail ? <p style={{ margin: 0, color: 'var(--muted)', fontSize: '0.8rem', lineHeight: 1.55 }}>{detail}</p> : null}
    </div>
  );
}

function TechCard({ entry, active, onSelect }: { entry: TechStackEntry; active: boolean; onSelect: () => void }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={active}
      style={{
        position: 'relative',
        minWidth: 0,
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
        padding: '15px',
        textAlign: 'left',
        borderRadius: '17px',
        background: active ? `linear-gradient(145deg, ${entry.color}18, rgba(255,255,255,0.045))` : 'rgba(255,255,255,0.035)',
        border: active ? `1px solid ${entry.color}70` : '1px solid rgba(255,255,255,0.075)',
        color: 'var(--text)',
        cursor: 'pointer',
        transition: 'transform 160ms ease, border-color 160ms ease, background 160ms ease',
      }}
    >
      <BrandMark entry={entry} />
      <span style={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: '5px' }}>
        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
          <strong style={{ color: 'var(--text)', fontSize: '0.86rem', fontWeight: 700 }}>{entry.name}</strong>
          <span style={{ color: entry.color, fontSize: '0.66rem', fontWeight: 700, whiteSpace: 'nowrap' }}>{entry.projects.length} repos</span>
        </span>
        <span style={{ color: 'var(--muted)', fontSize: '0.76rem', lineHeight: 1.5 }}>{entry.description}</span>
        <span style={{ color: entry.color, fontSize: '0.64rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{entry.category}</span>
      </span>
    </button>
  );
}

export function TechStackView() {
  const data = usePortfolioData();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<TechCategory | 'All'>('All');
  const [activeTechId, setActiveTechId] = useState<string | null>(null);

  const normalizedQuery = query.trim().toLowerCase();
  const activeTech = activeTechId ? techById(activeTechId) : undefined;

  const filteredTech = useMemo(() => techStack.filter((entry) => {
    const matchesCategory = category === 'All' || entry.category === category;
    const relatedProjectNames = entry.projects.map((projectId) => auditedProjects.find((project) => project.id === projectId)?.name ?? '').join(' ');
    const matchesQuery = !normalizedQuery || `${entry.name} ${entry.description} ${entry.category} ${relatedProjectNames}`.toLowerCase().includes(normalizedQuery);
    return matchesCategory && matchesQuery;
  }), [category, normalizedQuery]);

  const filteredProjects = useMemo(() => auditedProjects.filter((project) => {
    const matchesTech = !activeTechId || project.techIds.includes(activeTechId);
    const matchesQuery = !normalizedQuery || `${project.name} ${project.architecture} ${project.summary}`.toLowerCase().includes(normalizedQuery);
    return matchesTech && matchesQuery;
  }), [activeTechId, normalizedQuery]);

  function selectCategory(next: TechCategory | 'All') {
    setCategory(next);
    setActiveTechId(null);
  }

  function selectTech(id: string) {
    setActiveTechId((current) => current === id ? null : id);
  }

  return (
    <div style={{ padding: '22px', display: 'flex', flexDirection: 'column', gap: '18px', overflowY: 'auto' }}>
      <section style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ minWidth: 0, maxWidth: '620px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <p style={{ margin: 0, color: 'var(--gold)', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Repository audit · local evidence</p>
            <h2 style={{ margin: 0, color: 'var(--text)', fontFamily: '"Space Grotesk","Manrope",sans-serif', fontSize: '1.35rem', fontWeight: 500, letterSpacing: '-0.04em' }}>Tech Stack</h2>
            <p style={{ margin: 0, color: 'var(--muted)', fontSize: '0.84rem', lineHeight: 1.65 }}>A visual map of the tools actually recurring across the projects in your GitHub folder — with a plain-language explanation of the job each one does.</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 13px', borderRadius: '15px', background: 'rgba(231,194,90,0.08)', border: '1px solid rgba(231,194,90,0.2)' }}>
            <span style={{ color: 'var(--gold)', fontSize: '1.4rem', fontWeight: 700, lineHeight: 1 }}>{auditedProjects.length}</span>
            <span style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}><strong style={{ color: 'var(--text)', fontSize: '0.76rem' }}>local repositories</strong><span style={{ color: 'var(--muted)', fontSize: '0.66rem' }}>audited from manifests</span></span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(145px, 1fr))', gap: '8px' }}>
          {[
            { value: 'React + TS', label: 'interface core', color: '#61dafb' },
            { value: 'Next + Vite', label: 'delivery layer', color: '#a78bfa' },
            { value: 'Supabase + PG', label: 'data backbone', color: '#3ecf8e' },
            { value: 'Three.js', label: '3D thread', color: '#f4f4f5' },
          ].map((pillar) => (
            <div key={pillar.value} style={{ padding: '12px 13px', borderRadius: '14px', background: 'rgba(255,255,255,0.035)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div style={{ color: pillar.color, fontSize: '0.78rem', fontWeight: 700 }}>{pillar.value}</div>
              <div style={{ marginTop: '3px', color: 'var(--muted)', fontSize: '0.68rem' }}>{pillar.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '10px', flexWrap: 'wrap' }}>
          <SectionHeading eyebrow="Browse the catalog" title={`${filteredTech.length} technologies`} detail={activeTech ? `Showing repositories that use ${activeTech.name}. Click its card again to clear the focus.` : 'Select a card to focus the repository map on that technology.'} />
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '220px', padding: '8px 11px', borderRadius: '11px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <span aria-hidden="true" style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>⌕</span>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search tools or projects" aria-label="Search tools or projects" style={{ width: '100%', minWidth: 0, border: 'none', outline: 'none', background: 'transparent', color: 'var(--text)', fontSize: '0.76rem' }} />
          </label>
        </div>

        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }} role="tablist" aria-label="Technology categories">
          {(['All', ...techCategories] as const).map((item) => {
            const isActive = category === item;
            return <button key={item} type="button" role="tab" aria-selected={isActive} onClick={() => selectCategory(item)} style={{ padding: '6px 10px', borderRadius: '999px', border: `1px solid ${isActive ? 'rgba(231,194,90,0.5)' : 'rgba(255,255,255,0.08)'}`, background: isActive ? 'rgba(231,194,90,0.12)' : 'rgba(255,255,255,0.035)', color: isActive ? 'var(--gold)' : 'var(--muted)', fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer' }}>{item}</button>;
          })}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(245px, 1fr))', gap: '9px' }}>
          {filteredTech.map((entry) => <TechCard key={entry.id} entry={entry} active={activeTechId === entry.id} onSelect={() => selectTech(entry.id)} />)}
        </div>
        {filteredTech.length === 0 ? <p style={{ margin: 0, padding: '18px', borderRadius: '14px', background: 'rgba(255,255,255,0.035)', color: 'var(--muted)', fontSize: '0.82rem' }}>No technologies match that search.</p> : null}
      </section>

      <section style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingTop: '4px' }}>
        <SectionHeading eyebrow="Repository map" title={`${filteredProjects.length} projects explained`} detail="Every repository root is represented here so the stack is connected to real work, not just a generic logo wall." />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
          {filteredProjects.map((project, index) => (
            <article key={project.id} style={{ padding: '15px', borderRadius: '17px', background: index % 2 === 0 ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.028)', border: '1px solid rgba(255,255,255,0.075)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
                <div style={{ minWidth: 0 }}>
                  <h4 style={{ margin: 0, color: 'var(--text)', fontSize: '0.94rem', fontWeight: 700 }}>{project.name}</h4>
                  <p style={{ margin: '4px 0 0', color: 'var(--gold)', fontSize: '0.7rem', fontWeight: 600 }}>{project.architecture}</p>
                </div>
                <span style={{ color: 'var(--muted)', fontSize: '0.66rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{String(index + 1).padStart(2, '0')}</span>
              </div>
              <p style={{ margin: '10px 0 11px', color: 'var(--muted)', fontSize: '0.8rem', lineHeight: 1.6 }}>{project.summary}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {project.techIds.map((id) => <TechPill key={id} id={id} onClick={() => selectTech(id)} />)}
              </div>
            </article>
          ))}
        </div>
        {filteredProjects.length === 0 ? <p style={{ margin: 0, padding: '18px', borderRadius: '14px', background: 'rgba(255,255,255,0.035)', color: 'var(--muted)', fontSize: '0.82rem' }}>No audited project matches that filter.</p> : null}
      </section>

      <footer style={{ padding: '12px 0 4px', borderTop: '1px solid rgba(255,255,255,0.07)', color: 'var(--muted)', fontSize: '0.68rem', lineHeight: 1.55 }}>
        Source note: this catalog was assembled from the local repositories under <span style={{ color: 'var(--text)' }}>Documents/GitHub</span>. “Sanity CMS” is shown only as historical evidence from Portfolio 3D; the current portfolio remains Supabase-backed.
        {data.projects.length > 0 ? <span> The live portfolio currently contributes {data.projects.length} published project records to the Projects app.</span> : null}
      </footer>
    </div>
  );
}
