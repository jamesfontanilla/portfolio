# Portfolio OS

A browser-based desktop OS experience built as a personal portfolio. Visitors interact with draggable glassmorphism windows, a centered taskbar, animated wallpapers, and desktop widgets — all powered by Sanity CMS.

## Preview

- **Desktop:** Full windowing system with drag, resize, minimize (Genie effect), maximize, and snap-to-top
- **Mobile:** Phone-style home screen with app grid, back navigation, and full-screen content panels
- **CMS:** Hidden Sanity Studio at `/studio` for content management

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, standalone output) |
| UI | React 19, TypeScript 5.8 (strict) |
| CMS | Sanity v5, GROQ queries |
| Styling | Pure CSS glassmorphism, CSS custom properties |
| Animation | Web Animations API (WAAPI), CSS transitions |
| Fonts | Manrope, Space Grotesk (Google Fonts) |
| Testing | Vitest, Testing Library, fast-check (property-based) |

No Tailwind. No Framer Motion. No external animation libraries.

## Features

### OS-Style Desktop UI

- **Draggable, resizable windows** with glassmorphism (`backdrop-filter: blur`) and gold border accents
- **macOS Genie effect** on minimize/restore using 3D perspective transforms
- **Windows 11 centered taskbar** with live thumbnail previews on hover
- **Desktop icons** (double-click or Enter to open) arranged in a vertical column
- **macOS traffic light controls** (close, minimize, maximize) with hover glyphs
- **Snap-to-maximize** when dragging a window to the top edge
- **Staggered window positioning** — each new window cascades by 30px offset

### Desktop Widgets (CMS-driven)

- Welcome card with name, role, availability status, and social links
- Live clock + date (top-right)
- Quick stats (project/cert/event counts)
- Highlights widget (latest project, cert, event — clickable)
- Location badge
- Current Focus note
- Keyboard shortcuts popup

### Wallpaper System

4 switchable themes via right-click context menu:
- **Gold & Teal** (default)
- **Deep Ocean**
- **Warm Sunset**
- **Northern Lights**

Each theme uses layered radial/conic gradients, animated floating orbs, noise texture overlay, and a soft vignette.

### Context Menu

Right-click the desktop for:
- Refresh
- Wallpaper theme picker (submenu)
- About This Portfolio (modal)

### Boot Screen

Session-gated intro animation (300ms fade-in → hold → 300ms fade-out). Shows owner name in gold. Skipped on repeat visits and when `prefers-reduced-motion` is active.

### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `1` | Open About |
| `2` | Open Projects |
| `3` | Open Certifications |
| `4` | Open Events |
| `5` | Open Contacts |
| `6` | Open Blog |
| `Esc` | Close active window |

### Responsive Design

| Viewport | Behavior |
|----------|----------|
| ≥ 1024px (desktop) | Full windowing system with drag, resize, taskbar |
| 768–1023px (tablet) | Windows centered and clamped to 90vw × 80vh, drag disabled |
| < 768px (mobile) | Home screen with app grid, bottom nav, full-screen panels |

### Accessibility

- Focus trapping within active windows (Tab/Shift+Tab)
- `role="dialog"` + `aria-modal="true"` on windows
- `aria-live="polite"` on notifications and boot screen
- `:focus-visible` gold outline indicators
- `prefers-reduced-motion` support (all animations disabled)
- Semantic navigation landmarks
- 44×44px minimum touch targets on mobile

## Content Model (Sanity CMS)

| Document Type | Fields |
|---------------|--------|
| `siteSettings` | name, role, tagline, summary, intro, bio, location, availability, email, phone, social URLs |
| `project` | title, summary, status, stack[], impact, coverImage, demoUrl, repoUrl, featured |
| `certification` | title, issuer, earnedOn, verificationUrl |
| `event` | title, type, role, date, location, summary, tags[], media |
| `blogPost` | title, slug, excerpt, body (rich text + images + code), coverImage, tags[], publishedAt, featured |

## Project Structure

```
portfolio/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout (server component, conditional OS wrapper)
│   ├── page.tsx            # Home page (SEO content)
│   ├── blog/              # Blog listing (indexable)
│   ├── contacts/          # Contact page (indexable, NFC-ready)
│   ├── projects/          # Projects archive
│   ├── certifications/    # Certifications archive
│   ├── events/            # Events archive
│   └── studio/            # Sanity Studio (no OS wrapper)
├── components/os-ui/       # OS desktop UI system
│   ├── OSUIProvider.tsx    # Top-level client boundary + window manager
│   ├── Window.tsx          # Draggable/resizable glassmorphism panel
│   ├── Taskbar.tsx         # Windows 11 style centered taskbar
│   ├── DesktopIcons.tsx    # Desktop shortcut icons
│   ├── DesktopWidgets.tsx  # CMS-driven info widgets
│   ├── Wallpaper.tsx       # Multi-theme animated wallpapers
│   ├── ContextMenu.tsx     # Right-click desktop menu
│   ├── BootScreen.tsx      # Session-gated intro animation
│   ├── MobileHomeScreen.tsx # Phone-style home screen
│   ├── MobileNav.tsx       # Mobile bottom navigation
│   ├── WindowTitleBar.tsx  # Title bar + traffic lights
│   ├── TrafficLightControls.tsx # macOS-style window buttons
│   ├── ResizeHandle.tsx    # Bottom-right resize grip
│   ├── Desktop.tsx         # Fixed full-viewport background
│   ├── Dock.tsx            # Legacy dock (replaced by Taskbar)
│   ├── AppIcon.tsx         # Icon component with labels
│   └── content-views/     # Lazy-loaded window content
│       ├── AboutView.tsx
│       ├── ProjectsView.tsx
│       ├── CertificationsView.tsx
│       ├── EventsView.tsx
│       ├── ContactsView.tsx
│       ├── BlogView.tsx
│       ├── SkeletonView.tsx
│       └── ErrorView.tsx
├── store/                  # State management
│   └── windowManagerStore.ts  # Pure reducer (open/close/focus/drag/resize/minimize/maximize)
├── hooks/                  # Custom React hooks
│   ├── useDrag.ts          # Pointer-event drag with RAF throttle
│   ├── useResize.ts        # Resize handle logic
│   ├── useKeyboardNav.ts   # Focus trap + Escape handler
│   ├── useReducedMotion.ts # prefers-reduced-motion detection
│   └── useSanityData.ts    # Generic CMS data fetcher with caching
├── lib/                    # Utilities
│   ├── cms.ts              # Sanity client + GROQ queries
│   ├── types.ts            # TypeScript types for all content
│   ├── site-data.ts        # Fallback content (no CMS required)
│   └── format.ts           # Date formatting helpers
├── sanity/                 # Sanity CMS configuration
│   ├── schemaTypes/        # Document schemas
│   │   ├── siteSettings.ts
│   │   ├── project.ts
│   │   ├── certification.ts
│   │   ├── event.ts
│   │   └── blogPost.ts
│   ├── structure.tsx       # Studio sidebar structure
│   └── lib/image.ts        # Image URL builder
├── middleware.ts           # Injects x-pathname header for RSC routing
├── sanity.config.ts        # Sanity Studio configuration
├── next.config.ts          # Next.js config (standalone output)
├── vitest.config.ts        # Test configuration
└── package.json
```

## Local Setup

1. Install dependencies:

```bash
cd portfolio
npm install
```

2. Create your environment file:

```bash
cp .env.example .env.local
```

3. Fill in the Sanity values in `.env.local`:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2026-06-22
```

> If you don't configure Sanity, the site uses built-in fallback content. Everything still works.

4. Start the development server:

```bash
npm run dev
```

- Portfolio: `http://localhost:3000`
- CMS Studio: `http://localhost:3000/studio`

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Run standalone production server |
| `npm run test` | Run tests (Vitest) |
| `npm run test:watch` | Watch mode |
| `npm run test:coverage` | Coverage report (v8) |

## Architecture

```
Browser Request
     │
     ▼
middleware.ts ──► injects x-pathname header
     │
     ▼
app/layout.tsx (RSC) ──► reads x-pathname
     │
     ├── /studio → renders children directly (Sanity Studio)
     │
     └── all other routes → wraps in <OSUIProvider>
              │
              ├── Desktop + Wallpaper (background)
              ├── DesktopIcons + DesktopWidgets (desktop only)
              ├── Window[] (draggable panels with lazy content)
              ├── Taskbar or MobileNav (navigation)
              └── children (hidden, preserved for SEO)
```

Page routes (`/projects`, `/contacts`, `/blog`, etc.) are server-rendered for SEO but visually suppressed when the OS UI is active. Content is served exclusively through Window content views that fetch from Sanity.

## SEO & Indexing

Each content section has a corresponding route page that renders server-side HTML for crawlers:

- `/` — Home (about, stats)
- `/projects` — All projects
- `/certifications` — All certifications
- `/events` — All events
- `/contacts` — Contact links (NFC card-ready)
- `/blog` — Blog posts

These pages include proper `<meta>` tags and render real content. The OS UI wraps them visually but doesn't block indexing.

## Deployment

Ready for Vercel (or any Node.js host supporting standalone Next.js).

Set these environment variables:

- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET`
- `NEXT_PUBLIC_SANITY_API_VERSION`

`SANITY_API_READ_TOKEN` is reserved for future authenticated workflows but not currently used.

## License

Private project. All rights reserved.
