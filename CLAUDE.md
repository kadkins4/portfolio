# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio website for kendalladkins.dev featuring blog posts, project showcases, private project tracking, and interests showcase. Developer-focused aesthetic with dark mode default.

**Status**: Planning phase - see PORTFOLIO_PLAN.md for comprehensive implementation guide.

## Tech Stack

| Layer         | Technology                                        |
| ------------- | ------------------------------------------------- |
| Framework     | Next.js 15 (App Router)                           |
| Language      | TypeScript                                        |
| Styling       | Tailwind CSS + next-themes                        |
| Content       | MDX (next-mdx-remote) + Shiki syntax highlighting |
| Auth          | Auth.js v5 + GitHub OAuth (single-user allowlist) |
| Database      | Vercel Postgres                                   |
| Rate Limiting | Vercel KV                                         |
| Email         | Resend                                            |
| Hosting       | Vercel                                            |

## Build Commands

**Version Management**: This project uses [mise](https://mise.jdx.dev) to manage Node.js and pnpm versions.

```bash
# First-time setup
mise install              # Install Node.js 22.15.0 and pnpm 9

# Development
pnpm install              # Install dependencies
pnpm dev                  # Start dev server (localhost:3000)
pnpm build                # Production build
pnpm start                # Start production server
pnpm lint                 # Run ESLint
pnpm test                 # Run tests

# Or use mise tasks
mise run install          # Install dependencies
mise run dev              # Start dev server
mise run build            # Production build
mise run lint             # Run ESLint
mise run format           # Format code with Prettier
```

## Architecture

```
app/                      # Next.js App Router
├── (auth)/               # Protected routes (dashboard, profile)
├── blog/[slug]/          # Blog posts with series support
├── projects/[slug]/      # Project showcases
├── api/                  # Route handlers (auth, contact, github)
components/
├── ui/                   # Badge, ThemeToggle, CommandPalette
├── layout/               # Header, Footer, Nav
├── blog/                 # SeriesNav, TableOfContents, ReadingProgress
├── mdx/                  # Custom MDX components
content/
├── blog/                 # MDX blog posts with frontmatter
├── projects/             # MDX project descriptions
lib/                      # Utilities (mdx, auth, db, email, github)
```

## Content Conventions

### Blog Post Frontmatter

```yaml
title: 'Post Title'
date: '2024-01-15'
description: 'SEO description'
tags: ['typescript', 'react']
published: true
series: 'series-slug' # Optional
seriesOrder: 2
relatedPosts: ['slug-1'] # Manual related posts
badges: ['new', 'popular']
readingLevel: 'intermediate'
```

### Project Frontmatter

```yaml
title: 'Project Name'
description: 'What this does'
category: 'software' # software | professional | personal | learning
status: 'completed' # idea | in-progress | completed | archived
tech: ['React', 'TypeScript']
github: 'https://github.com/...'
live: 'https://...'
featured: true
published: true
techBadges: true # Auto-generate badges from tech array
```

## Authentication Pattern

Single-user GitHub OAuth restricted via `ALLOWED_GITHUB_USER_ID` environment variable. Middleware-based route protection for dashboard and draft content.

## Environment Variables

```bash
AUTH_SECRET=               # openssl rand -base64 32
AUTH_GITHUB_ID=            # GitHub OAuth Client ID
AUTH_GITHUB_SECRET=        # GitHub OAuth Client Secret
ALLOWED_GITHUB_USER_ID=    # Your GitHub numeric user ID
POSTGRES_URL=              # Vercel Postgres connection
RESEND_API_KEY=            # Resend API key
CONTACT_EMAIL=             # Notification recipient
```

## Theming

CSS variables for theme colors with next-themes. Dark mode default with light mode support. Colors defined in Tailwind config with `dark:` variants.

## Key Implementation Details

- **MDX rendering**: next-mdx-remote with custom components for code blocks (Shiki), images, and interactive elements
- **Blog images**: `/public/images/blog/{post-slug}/`
- **Rate limiting**: Contact form limited to 5/hour, 20/day per IP via Vercel KV
- **Spam prevention**: Honeypot field on contact form
- **Badge system**: Tech badges with simple-icons colors, status badges (new/updated/popular/wip/archived)

## Research-Plan-Implement Framework

This repository uses the Research-Plan-Implement framework with the following workflow commands:

1. `/1_research_codebase` - Deep codebase exploration with parallel AI agents
2. `/2_create_plan` - Create detailed, phased implementation plans
3. `/3_validate_plan` - Verify implementation matches plan
4. `/4_implement_plan` - Execute plan systematically
5. `/5_save_progress` - Save work session state
6. `/6_resume_work` - Resume from saved session
7. `/7_research_cloud` - Analyze cloud infrastructure (READ-ONLY)

Research findings are saved in `thoughts/shared/research/`
Implementation plans are saved in `thoughts/shared/plans/`
Session summaries are saved in `thoughts/shared/sessions/`
Cloud analyses are saved in `thoughts/shared/cloud/`
