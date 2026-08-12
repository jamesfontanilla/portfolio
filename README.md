# Portfolio OS

A browser-based desktop OS experience for a personal portfolio. Visitors can
open draggable glassmorphism windows on desktop or use a phone-style app grid
on mobile.

## Current architecture

- Next.js 16 App Router with standalone output
- React 19 and strict TypeScript
- Pure CSS glassmorphism, animated wallpapers, and responsive layouts
- Vitest, Testing Library, and fast-check tests
- Local synchronous portfolio data in `lib/portfolio-data.ts`

The public site does not make a remote content request while rendering. The
current built-in content lives in `lib/site-data.ts`, while
`lib/portfolio-data.ts` provides the small data boundary that can later be
connected to a Supabase-backed admin UI.

## Content model

The existing TypeScript types cover the content that the future admin UI will
manage:

| Content | Main fields |
| --- | --- |
| Site settings | name, role, tagline, summary, bio, location, availability, contact links |
| Projects | title, summary, status, stack, impact, cover image, demo/repository links |
| Certifications | title, issuer, earned date, verification link |
| Events | title, type, role, date, location, summary, tags, media |
| Blog posts | title, slug, excerpt, body, tags, published date, featured flag |

## Local setup

```bash
cd portfolio
npm install
npm run dev
```

Then open `http://localhost:3000`.

No environment variables are required for the current local-data mode. Add
Supabase variables only when the admin UI and database connection are added.

## Features

- Draggable, resizable, minimizable, maximizable, and snap-enabled windows
- Desktop taskbar, app icons, keyboard shortcuts, and mobile navigation
- Animated wallpaper themes with reduced-motion support
- Server-rendered archive pages for projects, certifications, events, contacts,
  and blog posts
- Accessible dialogs, focus handling, visible focus states, and mobile touch
  targets

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm run start` | Run the standalone production server |
| `npm run test` | Run the Vitest suite |
| `npm run test:watch` | Run Vitest in watch mode |
| `npm run test:coverage` | Generate a coverage report |

## Deployment

The project is configured for standalone deployment on Vercel or another Node
host that supports the Next.js standalone output.

Private project. All rights reserved.
