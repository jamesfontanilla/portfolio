# Portfolio

A personal portfolio website built with Next.js and Sanity.

The Next.js app lives in the nested `portfolio/` folder in this repository.

It presents:

- Projects
- Certifications
- Tech events, including media
- Contact links and personal info
- A hidden Sanity Studio for content updates

The design is intentionally dark, glassy, and mobile-friendly, with a desktop layout that scales up cleanly.

## Tech Stack

- Next.js App Router
- React 19
- Sanity Studio
- TypeScript
- Groq / Sanity client

## Features

- CMS-driven homepage content
- Featured project section
- Certifications timeline
- Tech event gallery with images
- Contact section with external links
- Hidden admin studio at `/studio`
- Fallback content when Sanity is not configured

## Content Model

The Sanity studio uses these document types:

- `siteSettings`
- `project`
- `certification`
- `event`

### Site Settings

Use `Site Settings` for:

- name
- role
- tagline
- summary
- intro
- bio
- location
- availability
- contact links

### Projects

Each project can include:

- title
- summary
- status
- stack
- impact
- cover image
- demo URL
- repo URL
- featured flag

### Certifications

Each certification can include:

- title
- issuer
- earned date
- verification URL

### Tech Events

Each event can include:

- title
- type
- role
- date
- location
- summary
- tags
- media image

## Local Setup

1. Install dependencies:

```bash
cd portfolio
npm install
```

2. Create your environment file:

```bash
Copy-Item .env.example .env.local
```

3. Fill in the Sanity values in `.env.local`:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2026-06-22
```

4. Start the development server:

```bash
npm run dev
```

Open:

- `http://localhost:3000` for the portfolio
- `http://localhost:3000/studio` for the CMS

## Build

```bash
npm run build
npm run start
```

This project is configured with `output: "standalone"`, so the production start script runs the standalone Next.js server.

## Sanity Studio

The Studio is mounted at `/studio` and organized around:

- Overview
- Projects
- Certifications
- Tech Events
- Site Settings

The homepage reads content from Sanity when the project ID is available. If Sanity is not configured, the site uses built-in fallback content instead.

## Deployment

This project is ready for Vercel deployment.

Set these environment variables in Vercel:

- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET`
- `NEXT_PUBLIC_SANITY_API_VERSION`

The current codebase does not require a read token for public content fetching.
`SANITY_API_READ_TOKEN` is present in `.env.example` for future authenticated workflows, but it is not used by the current app code.

## Notes

- The hidden admin area is still protected by Sanity auth, not just by being hard to find.
- If you change your profile details or role in Sanity, the public site updates from the same data source.
- If a field is missing in Sanity, the site falls back to safe defaults so the page still renders.
