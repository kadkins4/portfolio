# Portfolio Website - Implementation Plan

## Overview

A personal portfolio website for Kendall Adkins - a multi-purpose site featuring blog posts, project showcases, project tracking, and personal interests. Built with a developer-focused aesthetic and dual theme support (dark default + light).

---

## Tech Stack

| Layer     | Technology                    | Rationale                                                                                |
| --------- | ----------------------------- | ---------------------------------------------------------------------------------------- |
| Framework | **Next.js 15** (App Router)   | React 19 support, async params, improved caching, excellent Vercel integration           |
| Language  | **TypeScript**                | Type safety, better DX                                                                   |
| Styling   | **Tailwind CSS**              | Rapid development, theme support, developer-friendly utility classes                     |
| Theming   | **next-themes**               | Handles dark/light mode with system preference detection                                 |
| Content   | **MDX**                       | Markdown with React components, syntax highlighting, frontmatter metadata                |
| Auth      | **Auth.js v5 + GitHub OAuth** | Latest version, simplified setup, middleware-based protection                            |
| Hosting   | **Vercel**                    | Zero-config deploys, edge functions, analytics                                           |
| Database  | **Vercel Postgres**           | Native Vercel integration, serverless-friendly, sufficient for low-traffic personal site |
| Email     | **Resend**                    | Transactional emails for contact notifications (100/day free)                            |
| Icons     | **simple-icons**              | Technology logo badges                                                                   |

---

## Core Features (MVP)

### 1. Homepage / Landing

- Hero section with name, title, brief intro
- Terminal-style typing animation or ASCII art accent
- Dev Skills Section (Visual Sneak Peek)
- Quick links to main sections
- Recent blog posts preview (with badges)
- Featured projects grid (with tech badges)

### 2. About Page

- Professional bio and background
- Skills/technologies (visual display with badges)
- Work history timeline (pulled from content or LinkedIn data)
- Contact information / social links

### 3. Blog System

- MDX-powered posts stored in `/content/blog/`
- Frontmatter: title, date, tags, description, published status, badges, series
- Syntax highlighting (Shiki or Prism)
- Reading time estimate
- **Reading progress bar**
- **Copy code button on snippets**
- Tag filtering and search
- Pagination or infinite scroll
- **Related posts (manual + auto by tags)**
- **Series support with navigation**
- **Table of contents for long posts**

### Image Handling

- **Storage**: `/public/images/blog/{post-slug}/` for blog images
- **Optimization**: Use Next.js `<Image>` component via custom MDX component
- **MDX usage**: `![Alt text](./image.png)` resolves to post's image folder
- **External images**: Allowed but not optimized; prefer local copies
- **OG images**: Generated at build time using `@vercel/og` (Phase 4)

### 4. Projects Showcase

- Grid/list view of projects
- Categories: Software, Professional, Personal, Learning
- Project cards with: title, description, **tech stack badges**, links (GitHub, live demo)
- **Status badges** (New, WIP, Updated, Archived)
- Detailed project pages with MDX content
- **Private features (when authenticated):**
  - Status tracking (idea → in-progress → completed → archived)
  - Private notes/todos per project
  - Priority/effort estimates

### 5. Interests/Personal Section

- Showcase hobbies, interests outside of code
- Photo galleries, collections, etc.
- Flexible MDX-based content

### 6. Contact Page

- Contact form with fields: Name, Email, Subject (dropdown), Message
- Honeypot field for spam prevention
- Rate limiting to prevent abuse
  - Strategy: IP-based via Vercel KV (or in-memory for dev)
  - Limits: 5 submissions per IP per hour, 20 per day
  - Response: 429 Too Many Requests with retry-after header
- **Triple integration:**
  - Save to database (Vercel Postgres)
  - Email notification via Resend
  - Sync to Obsidian via GitHub repo

### 7. Badge System

- **Tech badges**: Technology icons (React, TypeScript, Python, etc.)
- **Status badges**: New, Updated, Popular, WIP, Archived
- **Content badges**: Series, Tutorial, Deep Dive, Quick Tip
- **Skill level badges**: Beginner, Intermediate, Advanced
- Filterable on listing pages

### 8. Theme System

- **Dark mode** (default) - developer-focused aesthetic
- **Light mode** - clean, accessible for daytime reading
- System preference detection on first visit
- Preference persisted in localStorage
- Smooth transition animations
- **V2**: Sepia and High Contrast themes

### 9. Authentication (Hybrid)

- GitHub OAuth login (only you can authenticate)
- Public visitors see: published blog posts, public project showcases
- Authenticated (you) see: draft posts, private project notes, status tracking, admin controls

### Auth Restriction Implementation

GitHub OAuth is restricted to a single user via allowlist:

```typescript
// lib/auth.ts
const ALLOWED_GITHUB_IDS = [
  process.env.ALLOWED_GITHUB_USER_ID, // Your GitHub user ID (numeric)
];

// In Auth.js callbacks:
callbacks: {
  async signIn({ user, account }) {
    if (account?.provider === "github") {
      return ALLOWED_GITHUB_IDS.includes(account.providerAccountId);
    }
    return false;
  },
}
```

**Required env var:** `ALLOWED_GITHUB_USER_ID` - Find via `gh api user --jq '.id'`

### 10. Integrations

- **GitHub**: Display pinned repos, contribution graph, recent activity
- **LinkedIn**: Link to profile (API is restrictive, so likely just links)
- **Dev.to/Medium**: Cross-posting support via frontmatter flags or manual sync
- **Obsidian**: Contact submissions synced as markdown files

### Cross-posting Workflow

Blog posts can be cross-posted to Dev.to via frontmatter flags:

```yaml
crossPost:
  devto: true # Queue for Dev.to
  medium: false # Skip Medium
```

**Implementation (Phase 4):**

1. Manual workflow (MVP): Export script generates Dev.to-compatible markdown
2. Script sets `canonical_url` pointing back to portfolio site
3. Run `pnpm crosspost` to generate files in `dist/crosspost/`
4. Manually paste into Dev.to editor (their API requires approval)

**Future enhancement:** Automate via Dev.to API once approved for API access.

---

## Site Structure

```
/                       → Homepage
/about                  → About page
/blog                   → Blog listing
/blog/[slug]            → Individual blog post
/blog/series            → All blog series listing
/blog/series/[slug]     → Individual series page
/projects               → Projects showcase
/projects/[slug]        → Individual project detail
/interests              → Personal interests section
/contact                → Contact form page
/dashboard              → Private dashboard (auth required)
/api/auth/*             → Auth.js endpoints
/api/contact            → Contact form handler
/api/github/*           → GitHub integration endpoints
```

---

## File Structure

```
portfolio/
├── app/
│   ├── layout.tsx              # Root layout, theme provider
│   ├── page.tsx                # Homepage
│   ├── about/page.tsx
│   ├── blog/
│   │   ├── page.tsx            # Blog listing
│   │   ├── [slug]/page.tsx     # Blog post
│   │   └── series/
│   │       ├── page.tsx        # All series
│   │       └── [slug]/page.tsx # Series detail
│   ├── projects/
│   │   ├── page.tsx            # Projects listing
│   │   └── [slug]/page.tsx     # Project detail
│   ├── interests/page.tsx
│   ├── contact/page.tsx        # Contact form
│   ├── dashboard/
│   │   └── page.tsx            # Private dashboard
│   └── api/
│       ├── auth/[...nextauth]/route.ts  # Auth.js v5 route handler
│       ├── contact/route.ts    # Contact form handler
│       └── github/route.ts
├── components/
│   ├── ui/                     # Reusable UI components
│   │   ├── Badge.tsx           # Badge component
│   │   ├── BadgeGroup.tsx      # Group of badges
│   │   ├── ThemeToggle.tsx     # Theme switcher
│   │   ├── CommandPalette.tsx  # ⌘K navigation
│   │   └── ...
│   ├── layout/                 # Header, Footer, Nav
│   ├── blog/                   # Blog-specific components
│   │   ├── RelatedPosts.tsx
│   │   ├── SeriesNav.tsx
│   │   ├── PostLink.tsx
│   │   ├── TableOfContents.tsx
│   │   ├── ReadingProgress.tsx
│   │   └── CopyCodeButton.tsx
│   ├── projects/               # Project-specific components
│   ├── contact/                # Contact form components
│   │   └── ContactForm.tsx
│   └── mdx/                    # Custom MDX components
├── content/
│   ├── blog/                   # Blog posts (MDX)
│   ├── projects/               # Project descriptions (MDX)
│   ├── pages/                  # Static page content
│   └── data/
│       ├── tech-badges.json    # Tech badge definitions
│       └── series.json         # Series metadata
├── lib/
│   ├── mdx.ts                  # MDX utilities
│   ├── blog.ts                 # Blog utilities (series, related posts)
│   ├── github.ts               # GitHub API client
│   ├── auth.ts                 # Auth configuration
│   ├── db.ts                   # Database client
│   ├── contact.ts              # Contact submission utilities
│   ├── email.ts                # Resend integration
│   ├── obsidian-sync.ts        # Obsidian sync via GitHub
│   ├── badges.ts               # Badge configurations
│   └── theme.ts                # Theme utilities
├── styles/
│   └── globals.css             # Tailwind + theme tokens
├── public/
│   └── images/                 # Static assets
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## Design System

### Color Palette - Dark Mode (Default)

```
Background:     #0a0a0a (near black)
Surface:        #141414 (elevated surfaces)
Border:         #262626 (subtle borders)
Text Primary:   #fafafa (high contrast)
Text Secondary: #a1a1a1 (muted)
Accent:         #22c55e (green - terminal/code aesthetic)
Accent Alt:     #3b82f6 (blue for links/interactive)
```

### Color Palette - Light Mode

```
Background:     #fafafa (clean white)
Surface:        #ffffff (cards/elevated)
Border:         #e5e5e5 (subtle borders)
Text Primary:   #0a0a0a (high contrast)
Text Secondary: #525252 (muted)
Accent:         #16a34a (green - slightly darker for light bg)
Accent Alt:     #2563eb (blue for links)
```

### Color Palette - Sepia Mode (V2)

```
Background:     #f4ecd8 (warm cream)
Surface:        #faf6eb (light parchment)
Border:         #d4c9a8 (muted tan)
Text Primary:   #3d3322 (dark brown)
Text Secondary: #6b5d4d (warm gray-brown)
Accent:         #8b6914 (golden brown)
Accent Alt:     #7c5e2a (warm amber for links)
```

### Color Palette - High Contrast Mode (V2)

```
Background:     #000000 (pure black)
Surface:        #1a1a1a (near black)
Border:         #ffffff (pure white)
Text Primary:   #ffffff (pure white)
Text Secondary: #ffff00 (yellow for emphasis)
Accent:         #00ff00 (bright green)
Accent Alt:     #00ffff (cyan for links)
```

### Typography

- **Headings**: JetBrains Mono or Fira Code (monospace)
- **Body**: Inter or system-ui (readable sans-serif)
- **Code blocks**: JetBrains Mono with syntax highlighting

### Badge Styles

```
Tech badges:    Colored by technology brand colors
Status badges:
  - New:        Green background
  - Updated:    Blue background
  - Popular:    Purple background
  - WIP:        Yellow/amber background
  - Archived:   Gray background
Content badges: Indigo/purple tones
Level badges:   Gradient (green → yellow → red by difficulty)
```

### Components Style

- Subtle borders, low contrast separation
- Terminal-inspired elements (command prompts, ASCII decorations)
- Smooth micro-interactions (hover states, transitions)
- Code snippet styling prominent throughout
- Theme toggle in header/navigation

---

## Data Models

### Blog Post Frontmatter

```yaml
---
title: 'Post Title'
date: '2024-01-15'
description: 'Brief description for SEO and previews'
tags: ['typescript', 'react', 'tutorial']
published: true
# Linking & Series
series: 'building-a-cli' # Optional: series slug
seriesOrder: 2 # Position in series
relatedPosts: ['slug-1', 'slug-2'] # Manual related posts
# Badges
badges: ['new', 'popular'] # Status badges
readingLevel: 'intermediate' # beginner/intermediate/advanced
# Cross-posting
crossPost:
  devto: true
  medium: false
---
```

### Project Frontmatter

```yaml
---
title: "Project Name"
description: "What this project does"
category: "software" | "professional" | "personal" | "learning"
status: "idea" | "in-progress" | "completed" | "archived"
tech: ["React", "TypeScript", "Node.js"]
github: "https://github.com/..."
live: "https://..."
featured: true
published: true
startDate: "2024-01-01"
endDate: "2024-03-01"
# Badges
badges: ["featured", "wip"]
techBadges: true               # Auto-generate tech stack badges
---
```

### Series Metadata

```yaml
# content/data/series.json or in individual posts
{
  'building-a-cli':
    {
      'title': 'Building a CLI from Scratch',
      'description': 'Learn to build a production CLI tool',
      'posts': ['cli-part-1', 'cli-part-2', 'cli-part-3'],
    },
}
```

### Series Resolution Strategy

The series system uses a **post-first approach**:

1. Series membership is defined in each post's frontmatter (`series`, `seriesOrder`)
2. `content/data/series.json` provides **display metadata only** (title, description)
3. At build time, posts are aggregated by `series` slug to generate series pages
4. If a series exists in posts but not in `series.json`, use the series slug as the title

This avoids keeping two sources in sync - posts are authoritative for membership, JSON is optional enrichment.

### Private Project Data (Database)

```typescript
interface ProjectPrivateData {
  slug: string
  notes: string // Private notes/todos
  priority: 'low' | 'medium' | 'high'
  effort: 'small' | 'medium' | 'large'
  privateStatus: string // Custom status notes
  updatedAt: Date
}
```

### Contact Submission (Database)

```typescript
interface ContactSubmission {
  id: string
  name: string
  email: string
  subject: 'general' | 'project' | 'collaboration' | 'other'
  message: string
  source: 'contact-form' | 'project-inquiry'
  projectSlug?: string // If from project page
  createdAt: Date
  syncedToObsidian: boolean
  obsidianPath?: string
}
```

---

## Implementation Phases

### Phase 1: Foundation (MVP)

1. Initialize Next.js 15 project with TypeScript
2. Set up Tailwind CSS with dual theme configuration
3. Install and configure `next-themes`
4. Create base layout components (Header, Footer, Navigation)
5. Implement ThemeProvider with dark/light toggle
6. Create Badge component system
7. Set up MDX processing pipeline
8. Create homepage with hero section
9. Build blog system (listing + individual posts)
10. Add reading progress bar and copy code button
11. Add related posts component (manual + auto)
12. Add series support and navigation
13. Create contact page with form
14. Set up database schema for contacts
15. Implement contact API (save to DB + send email)
16. Deploy to Vercel

### Phase 2: Projects & Content

1. Build projects showcase page with tech badges
2. Create project detail pages with MDX
3. Add About page
4. Implement tag filtering for blog
5. Add search functionality
6. Create interests/personal section
7. Add GitHub integration (pinned repos, activity)

### Phase 3: Authentication & Private Features

1. Configure Auth.js v5 with GitHub OAuth
2. Expand database schema for private project data
3. Build private dashboard
4. Add project status tracking
5. Implement private notes per project
6. Add draft post visibility (auth only)
7. Create admin controls for content
8. Implement Obsidian sync for contacts (via GitHub)

### Phase 4: Polish & Integrations

1. Add command palette (⌘K) for site navigation
2. Add micro-interactions and animations
3. Add RSS feed generation
4. Set up Dev.to cross-posting workflow
5. SEO optimization (meta tags, OG images)
6. Performance optimization (images, fonts)
7. Analytics setup (Vercel Analytics or Plausible)

---

## Nice-to-Haves (Post-Launch)

- [ ] Guestbook or comments system (Giscus)
- [ ] Newsletter subscription (Buttondown, Resend)
- [ ] Auto-generated OG images for blog posts
- [ ] GitHub-style contribution graph for your projects
- [ ] "Now" page (what you're currently working on/into)
- [ ] Resume/CV page with PDF export
- [ ] Keyboard navigation throughout site
- [ ] View transitions API for smooth page transitions
- [ ] Social share buttons on blog posts

---

## Future Iterations

### V2 Enhancements

- **Visitor Achievements System**
  - Track: pages visited, posts read, time on site, series completed
  - Award badges: "Night Owl" (visited at 2am), "Completionist" (read full series), "Explorer" (visited all sections)
  - Public leaderboard opt-in
  - Uses localStorage + optional account creation

- **Additional Themes**:
  - **Sepia Theme**: Warm cream tones for reduced eye strain and comfortable reading
  - **High Contrast Theme**: WCAG AAA compliant for maximum accessibility

- **AI-powered search**: Semantic search across blog posts

- **Interactive code playgrounds**: Sandpack or similar for runnable examples

- **Analytics dashboard**: Private stats on post performance

### V3 Expansions

- **Series/courses**: Group blog posts into learning paths with progress tracking
- **Quizzes/exercises**: Interactive elements between series posts
- **Completion certificates**: Fun, shareable completion badges
- **Bookmarks/reading list**: Track articles you've read
- **Public API**: Let others fetch your blog posts programmatically
- **Comments system**: Giscus (GitHub Discussions-based)
- **Internationalization**: Multi-language support if needed

---

## Contact System Architecture

````
User submits form
       ↓
   API Route (/api/contact)
       ↓
   ┌───────────────────────────────┐
   │ 1. Validate & sanitize input  │
   │ 2. Check honeypot (spam)      │
   │ 3. Rate limit check           │
   │ 4. Save to DB                 │ → Vercel Postgres
   │ 5. Send email notification    │ → Resend API
   │ 6. Queue Obsidian sync        │ → See below
   └───────────────────────────────┘

Obsidian Sync (Phase 3):
- Target repo: `kendall-adkins/obsidian-vault` (private)
- File path: `Inbox/Contact Submissions/{date}-{sanitized-name}.md`
- Auth: GitHub App or fine-grained PAT with repo write scope
- Implementation:
  1. Format submission as markdown with YAML frontmatter
  2. Use GitHub API to create file (PUT /repos/{owner}/{repo}/contents/{path})
  3. On failure: log error, mark `syncedToObsidian: false`, retry via cron job
  4. Obsidian Git plugin auto-pulls on schedule
- Template:
  ```markdown
  ---
  type: contact-submission
  from: "{{name}}"
  email: "{{email}}"
  subject: "{{subject}}"
  date: {{createdAt}}
  source: {{source}}
  ---

  {{message}}
````

````

---

## Verification & Testing

### Manual Testing
1. Verify all pages render correctly in dark and light modes
2. Test theme toggle persistence across sessions
3. Test responsive design across mobile, tablet, desktop
4. Verify GitHub OAuth flow works correctly
5. Test private routes redirect unauthenticated users
6. Verify MDX content renders with proper syntax highlighting
7. Test badge display on projects and blog posts
8. Verify related posts algorithm returns relevant results
9. Test series navigation (prev/next)
10. Test contact form submission flow
11. Verify email notifications are sent
12. Test all external links and integrations

### Automated Testing
- Unit tests for utility functions (lib/)
- Component tests for key UI components (Badge, ThemeToggle, ContactForm)
- E2E tests with Playwright for critical flows:
  - Navigation through all pages
  - Blog post reading flow
  - Series navigation
  - Authentication flow
  - Project filtering
  - Contact form submission
  - Theme switching

### Performance Targets
- Lighthouse score: 90+ across all categories
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3s
- Core Web Vitals: All green

---

## Dependencies (Key Packages)

```json
{
  "next": "^15.x",
  "react": "^19.x",
  "typescript": "^5.x",
  "tailwindcss": "^3.x",
  "@tailwindcss/typography": "^0.5.x",
  "next-themes": "^0.3.x",
  "next-mdx-remote": "^4.x",
  "next-auth": "^5.x",
  "shiki": "^1.x",
  "gray-matter": "^4.x",
  "date-fns": "^3.x",
  "@vercel/postgres": "^0.x",
  "@vercel/kv": "^0.x",
  "resend": "^3.x",
  "simple-icons": "^11.x",
  "cmdk": "^1.x"
}
````

---

## Estimated Scope

| Phase   | Scope                                                    |
| ------- | -------------------------------------------------------- |
| Phase 1 | Core site, blog, themes, badges, contact, series support |
| Phase 2 | Projects, about, integrations, search                    |
| Phase 3 | Auth, database, private features, Obsidian sync          |
| Phase 4 | Polish, SEO, analytics, command palette                  |

---

## Open Questions (Resolved)

- ✅ Content management: Markdown in repo
- ✅ Hosting: Vercel
- ✅ Auth: GitHub OAuth via Auth.js v5
- ✅ Design: Developer-focused, dark mode default
- ✅ Database: Lightweight (Vercel Postgres) for private data + contacts
- ✅ Themes: Dark (default) + Light at launch
- ✅ Contact flow: DB + Email + Obsidian sync
- ✅ Blog linking: Manual + Auto by tags + Series support
- ✅ Badges: Tech + Status + Content + Level badges

---

## Environment Variables

### Required

```bash
# Auth.js
AUTH_SECRET=                     # Generate: openssl rand -base64 32
AUTH_GITHUB_ID=                  # GitHub OAuth App Client ID
AUTH_GITHUB_SECRET=              # GitHub OAuth App Client Secret
ALLOWED_GITHUB_USER_ID=          # Your GitHub user ID (numeric)

# Database
POSTGRES_URL=                    # Vercel Postgres connection string

# Email
RESEND_API_KEY=                  # Resend API key
CONTACT_EMAIL=                   # Email to receive contact notifications
```

### Optional

```bash
# Obsidian Sync
OBSIDIAN_GITHUB_TOKEN=           # PAT with repo write access
OBSIDIAN_REPO=                   # e.g., "kendall-adkins/obsidian-vault"

# Analytics
NEXT_PUBLIC_VERCEL_ANALYTICS=    # "true" to enable Vercel Analytics

# Development
NEXT_PUBLIC_SITE_URL=            # Production URL for OG images, canonical URLs
```

---

## Next Steps

Upon plan approval:

1. Initialize the Next.js project
2. Set up the base configuration (Tailwind, TypeScript, ESLint, next-themes)
3. Create the foundational layout components with theme support
4. Create the Badge component system
5. Begin Phase 1 implementation
