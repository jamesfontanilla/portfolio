export type TechCategory = 'Interface' | 'Services' | 'Data & cloud' | '3D & interaction' | 'Tooling';

export type TechStackEntry = {
  id: string;
  name: string;
  category: TechCategory;
  mark: string;
  color: string;
  description: string;
  projects: string[];
};

export type AuditedProject = {
  id: string;
  name: string;
  architecture: string;
  summary: string;
  techIds: string[];
};

/**
 * Evidence-based catalog assembled from the package manifests and project
 * structure under C:/Users/Jaime/Documents/GitHub. The marks are local,
 * dependency-free brand badges so the app still works without remote images.
 */
export const techStack: TechStackEntry[] = [
  {
    id: 'typescript', name: 'TypeScript', category: 'Interface', mark: 'TS', color: '#3178c6',
    description: 'Shared type safety across interfaces, APIs, and the data contracts between them.',
    projects: ['aralivo', 'csnexus', 'devloom', 'elyqora', 'gridweaver', 'lexiloop', 'merewake', 'nodivra', 'portfolio', 'portfolio-3d', 'rillforge', 'rookspan', 'routequilt', 'rowverge', 'sceneatlas'],
  },
  {
    id: 'react', name: 'React', category: 'Interface', mark: 'R', color: '#61dafb',
    description: 'The component model behind the interactive portfolio, products, dashboards, and games.',
    projects: ['aralivo', 'csnexus', 'devloom', 'elyqora', 'gridweaver', 'lexiloop', 'merewake', 'nodivra', 'portfolio', 'portfolio-3d', 'rillforge', 'routequilt', 'rowverge', 'sceneatlas'],
  },
  {
    id: 'nextjs', name: 'Next.js', category: 'Interface', mark: 'N', color: '#f5f5f5',
    description: 'Full-stack React framework used for routing, server rendering, and deployable web apps.',
    projects: ['devloom', 'elyqora', 'lexiloop', 'nodivra', 'portfolio', 'portfolio-3d', 'routequilt', 'rowverge', 'sceneatlas'],
  },
  {
    id: 'vite', name: 'Vite', category: 'Interface', mark: 'V', color: '#a78bfa',
    description: 'Fast browser-first development and build tooling for the 3D apps, mobile shell, and API-backed products.',
    projects: ['aralivo', 'csnexus', 'gridweaver', 'merewake', 'rillforge', 'rookspan'],
  },
  {
    id: 'react-router', name: 'React Router', category: 'Interface', mark: 'RR', color: '#f44250',
    description: 'Client-side navigation for the Vite applications that need multiple product surfaces.',
    projects: ['aralivo', 'csnexus'],
  },
  {
    id: 'tailwind', name: 'Tailwind CSS', category: 'Interface', mark: 'TW', color: '#38bdf8',
    description: 'Utility-first styling used to keep product interfaces consistent while they evolve quickly.',
    projects: ['devloom', 'elyqora', 'lexiloop', 'nodivra', 'routequilt', 'rowverge'],
  },
  {
    id: 'capacitor', name: 'Capacitor', category: 'Interface', mark: 'CP', color: '#53b7e8',
    description: 'Native bridge that packages the CSNexus reviewer as an Android application.',
    projects: ['csnexus'],
  },
  {
    id: 'pwa', name: 'PWA', category: 'Interface', mark: 'PWA', color: '#7c3aed',
    description: 'Installable, resilient web delivery for offline-friendly learning and review workflows.',
    projects: ['csnexus'],
  },
  {
    id: 'fastapi', name: 'FastAPI', category: 'Services', mark: 'FA', color: '#10b981',
    description: 'Python API framework used for focused services with typed request and response models.',
    projects: ['aralivo', 'csnexus'],
  },
  {
    id: 'nestjs', name: 'NestJS', category: 'Services', mark: 'N', color: '#e0234e',
    description: 'Structured Node API framework organizing SceneAtlas server modules and shared contracts.',
    projects: ['sceneatlas'],
  },
  {
    id: 'fastify', name: 'Fastify', category: 'Services', mark: 'F', color: '#d9f99d',
    description: 'Lean Node server foundation for the Rillforge service layer.',
    projects: ['rillforge'],
  },
  {
    id: 'node', name: 'Node.js', category: 'Services', mark: 'JS', color: '#8cc84b',
    description: 'JavaScript runtime supporting API services, scripts, and the shared full-stack toolchain.',
    projects: ['rillforge', 'routequilt', 'sceneatlas'],
  },
  {
    id: 'python-data', name: 'SQLAlchemy + Alembic', category: 'Services', mark: 'SA', color: '#d97706',
    description: 'Python database toolkit and migration layer behind the Aralivo and CSNexus services.',
    projects: ['aralivo', 'csnexus'],
  },
  {
    id: 'supabase', name: 'Supabase', category: 'Data & cloud', mark: 'SB', color: '#3ecf8e',
    description: 'Managed Postgres, authentication, and data APIs used for product data and identity.',
    projects: ['aralivo', 'devloom', 'elyqora', 'lexiloop', 'merewake', 'nodivra', 'rillforge', 'rookspan', 'rowverge', 'portfolio'],
  },
  {
    id: 'postgres', name: 'PostgreSQL', category: 'Data & cloud', mark: 'PG', color: '#6699cc',
    description: 'Relational database foundation for structured product data, accounts, and service records.',
    projects: ['csnexus', 'routequilt', 'sceneatlas'],
  },
  {
    id: 'prisma', name: 'Prisma', category: 'Data & cloud', mark: 'Pr', color: '#8b5cf6',
    description: 'Typed schema and ORM layer that keeps relational queries close to the application model.',
    projects: ['routequilt', 'sceneatlas'],
  },
  {
    id: 'aws-s3', name: 'AWS S3', category: 'Data & cloud', mark: 'S3', color: '#ff9900',
    description: 'Object storage and presigned uploads for Rowverge data workflows.',
    projects: ['rowverge'],
  },
  {
    id: 'indexeddb', name: 'IndexedDB', category: 'Data & cloud', mark: 'ID', color: '#f59e0b',
    description: 'Browser-local persistence that makes CSNexus useful when learning data needs to stay on-device.',
    projects: ['csnexus'],
  },
  {
    id: 'sanity', name: 'Sanity CMS', category: 'Data & cloud', mark: 'S', color: '#f03e2f',
    description: 'Historical content system found in Portfolio 3D; it is documented here for the full repository picture.',
    projects: ['portfolio-3d'],
  },
  {
    id: 'three', name: 'Three.js', category: '3D & interaction', mark: '3D', color: '#f4f4f5',
    description: 'WebGL rendering engine powering the portfolio 3D work and browser-based game experiments.',
    projects: ['gridweaver', 'merewake', 'portfolio-3d', 'rillforge', 'rookspan'],
  },
  {
    id: 'react-three-fiber', name: 'React Three Fiber', category: '3D & interaction', mark: 'R3F', color: '#f472b6',
    description: 'React renderer for Three.js scenes, making 3D objects and interactions composable UI.',
    projects: ['gridweaver', 'merewake', 'portfolio-3d', 'rillforge'],
  },
  {
    id: 'drei', name: 'Drei', category: '3D & interaction', mark: 'D3', color: '#fb7185',
    description: 'Reusable helpers and controls that speed up scene building in Merewake.',
    projects: ['merewake'],
  },
  {
    id: 'zustand', name: 'Zustand', category: '3D & interaction', mark: 'Z', color: '#f59e0b',
    description: 'Small state store used where games and 3D interfaces need fast, direct interaction state.',
    projects: ['gridweaver', 'merewake', 'rillforge'],
  },
  {
    id: 'websockets', name: 'WebSockets', category: '3D & interaction', mark: 'WS', color: '#22d3ee',
    description: 'Live two-way communication for multiplayer or collaborative product behavior in Merewake.',
    projects: ['merewake'],
  },
  {
    id: 'framer-motion', name: 'Framer Motion', category: '3D & interaction', mark: 'FM', color: '#f43f5e',
    description: 'Motion primitives for clear transitions and feedback in the CSNexus mobile experience.',
    projects: ['csnexus'],
  },
  {
    id: 'zod', name: 'Zod', category: 'Tooling', mark: 'Z', color: '#3b82f6',
    description: 'Runtime validation that keeps forms, API boundaries, and imported data honest.',
    projects: ['devloom', 'elyqora', 'lexiloop', 'nodivra', 'routequilt', 'rowverge'],
  },
  {
    id: 'radix', name: 'Radix UI', category: 'Tooling', mark: 'Rx', color: '#f8fafc',
    description: 'Accessible interaction primitives used as the foundation for RouteQuilt controls.',
    projects: ['routequilt'],
  },
  {
    id: 'testing', name: 'Vitest + Testing Library', category: 'Tooling', mark: 'VT', color: '#729b1b',
    description: 'Fast component and behavior tests used to protect the portfolio OS and its interactive flows.',
    projects: ['portfolio'],
  },
  {
    id: 'auth', name: 'JWT + bcrypt', category: 'Tooling', mark: 'JWT', color: '#f97316',
    description: 'Token and password primitives used where the service needs explicit account protection.',
    projects: ['aralivo', 'csnexus', 'routequilt'],
  },
  {
    id: 'stellar', name: 'Stellar SDK', category: 'Tooling', mark: 'XLM', color: '#9ca3af',
    description: 'Blockchain integration layer found in Aralivo for Stellar-oriented product workflows.',
    projects: ['aralivo'],
  },
  {
    id: 'data-import', name: 'CSV + XLSX tooling', category: 'Tooling', mark: 'CSV', color: '#84cc16',
    description: 'Import and parsing tools that let Rowverge turn messy tabular files into usable data.',
    projects: ['rowverge'],
  },
];

export const auditedProjects: AuditedProject[] = [
  {
    id: 'aralivo', name: 'Aralivo', architecture: 'Vite + React client · FastAPI service',
    summary: 'A product surface that pairs a typed browser interface with a Python API, relational data tooling, and Stellar integration.',
    techIds: ['vite', 'react', 'typescript', 'react-router', 'supabase', 'fastapi', 'python-data', 'auth', 'stellar'],
  },
  {
    id: 'csnexus', name: 'CSNexus', architecture: 'Vite + React PWA · Capacitor Android · FastAPI service',
    summary: 'An offline-conscious learning and review system with local browser storage, a Python backend, and an Android delivery path.',
    techIds: ['vite', 'react', 'typescript', 'react-router', 'capacitor', 'pwa', 'indexeddb', 'framer-motion', 'fastapi', 'python-data', 'postgres', 'auth'],
  },
  {
    id: 'devloom', name: 'DevLoom', architecture: 'Next.js + React + Supabase',
    summary: 'A full-stack web product using server-oriented Next.js conventions, Supabase data, utility styling, and validated inputs.',
    techIds: ['nextjs', 'react', 'typescript', 'tailwind', 'supabase', 'zod'],
  },
  {
    id: 'elyqora', name: 'Elyqora', architecture: 'Next.js + React + Supabase SSR',
    summary: 'A server-rendered product interface built around Supabase identity/data access and a compact component system.',
    techIds: ['nextjs', 'react', 'typescript', 'tailwind', 'supabase', 'zod'],
  },
  {
    id: 'gridweaver', name: 'GridWeaver', architecture: 'Vite + React Three Fiber',
    summary: 'A browser-first 3D experiment where Three.js rendering, React composition, and local state work together as the product surface.',
    techIds: ['vite', 'react', 'typescript', 'three', 'react-three-fiber', 'zustand'],
  },
  {
    id: 'lexiloop', name: 'LexiLoop', architecture: 'Next.js + React + Supabase',
    summary: 'A language-learning product that combines a fast web shell, Supabase persistence, validation, and dictionary-oriented APIs.',
    techIds: ['nextjs', 'react', 'typescript', 'tailwind', 'supabase', 'zod'],
  },
  {
    id: 'merewake', name: 'Merewake', architecture: 'Vite + React Three Fiber · realtime layer',
    summary: 'A 3D interaction project with reusable scene helpers, shared state, Supabase data, and WebSocket communication.',
    techIds: ['vite', 'react', 'typescript', 'three', 'react-three-fiber', 'drei', 'zustand', 'supabase', 'websockets'],
  },
  {
    id: 'nodivra', name: 'Nodivra', architecture: 'Next.js + React + Supabase',
    summary: 'A focused web product built with a full-stack React framework, managed data/auth, runtime validation, and QR interactions.',
    techIds: ['nextjs', 'react', 'typescript', 'supabase', 'zod'],
  },
  {
    id: 'portfolio', name: 'Portfolio OS', architecture: 'Next.js + React + Supabase',
    summary: 'This desktop-style portfolio: a window manager, Supabase-backed content, responsive mobile mode, and tested interactive UI.',
    techIds: ['nextjs', 'react', 'typescript', 'supabase', 'testing'],
  },
  {
    id: 'portfolio-3d', name: 'Portfolio 3D', architecture: 'Next.js + React Three Fiber · Sanity',
    summary: 'A previous 3D portfolio direction combining server-rendered React pages, Three.js scenes, and a dedicated content system.',
    techIds: ['nextjs', 'react', 'typescript', 'three', 'react-three-fiber', 'sanity'],
  },
  {
    id: 'rillforge', name: 'Rillforge', architecture: 'Vite + React Three Fiber · Fastify service',
    summary: 'A 3D product experiment backed by a lightweight Node service and Supabase data.',
    techIds: ['vite', 'react', 'typescript', 'three', 'react-three-fiber', 'zustand', 'fastify', 'node', 'supabase'],
  },
  {
    id: 'rookspan', name: 'Rookspan', architecture: 'Vite + Three.js + Supabase',
    summary: 'A compact browser-based 3D project with Vite delivery, direct Three.js rendering, and managed data services.',
    techIds: ['vite', 'typescript', 'three', 'supabase'],
  },
  {
    id: 'routequilt', name: 'RouteQuilt', architecture: 'Next.js + Prisma + PostgreSQL',
    summary: 'A structured full-stack product with relational modeling, accessible UI primitives, validation, and explicit authentication helpers.',
    techIds: ['nextjs', 'react', 'typescript', 'prisma', 'postgres', 'radix', 'zod', 'auth', 'node'],
  },
  {
    id: 'rowverge', name: 'Rowverge', architecture: 'Next.js + Supabase + object storage',
    summary: 'A data-heavy web workflow that accepts tabular files, validates them, and uses cloud object storage around a Supabase-backed app.',
    techIds: ['nextjs', 'react', 'typescript', 'supabase', 'aws-s3', 'data-import', 'zod'],
  },
  {
    id: 'sceneatlas', name: 'SceneAtlas', architecture: 'Next.js web · NestJS API · Prisma/PostgreSQL',
    summary: 'A monorepo with a React web app, a structured Node API, shared packages, and typed relational persistence.',
    techIds: ['nextjs', 'react', 'typescript', 'nestjs', 'node', 'prisma', 'postgres'],
  },
];

export const techCategories: TechCategory[] = ['Interface', 'Services', 'Data & cloud', '3D & interaction', 'Tooling'];

export function techById(id: string): TechStackEntry | undefined {
  return techStack.find((entry) => entry.id === id);
}
