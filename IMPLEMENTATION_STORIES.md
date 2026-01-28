# Portfolio Website - Phase 1 Implementation Stories

## Overview

Detailed story breakdown for the MVP portfolio website. Each story is sized for 1-2 hours of work and includes inline testing requirements.

**Total Stories**: 47
**Estimated Effort**: ~60-80 hours

---

## Epic 1: Infrastructure & Prerequisites (7 stories)

### INFRA-001: Create Vercel Account & Project

**Description**: Set up Vercel account and create the portfolio project for deployment.

**Acceptance Criteria**:

- [ ] Vercel account created
- [ ] New project created named "portfolio" or "kendalladkins-dev"
- [ ] GitHub repo connected for automatic deployments
- [ ] Document project URL in README

---

### INFRA-002: Create GitHub OAuth Application

**Description**: Register a GitHub OAuth app for authentication.

**Acceptance Criteria**:

- [ ] OAuth app created at github.com/settings/developers
- [ ] Client ID and Secret generated
- [ ] Callback URL set to `http://localhost:3000/api/auth/callback/github` (dev)
- [ ] Production callback URL documented for later
- [ ] Store credentials securely (not in code)

---

### INFRA-003: Provision Vercel Postgres Database

**Description**: Create a Vercel Postgres database for storing contacts and private data.

**Acceptance Criteria**:

- [ ] Database created in Vercel dashboard (Storage → Create → Postgres)
- [ ] Connection string obtained
- [ ] Environment variable `POSTGRES_URL` documented

---

### INFRA-004: Provision Vercel KV Store

**Description**: Create a Vercel KV store for rate limiting.

**Acceptance Criteria**:

- [ ] KV store created in Vercel dashboard (Storage → Create → KV)
- [ ] Connection details obtained
- [ ] Environment variables documented (`KV_URL`, `KV_REST_API_URL`, etc.)

---

### INFRA-005: Create Resend Account & API Key

**Description**: Set up Resend for transactional email notifications.

**Acceptance Criteria**:

- [ ] Resend account created at resend.com
- [ ] Domain verified (or use resend.dev for testing)
- [ ] API key generated
- [ ] `RESEND_API_KEY` documented

---

### INFRA-006: Get GitHub User ID

**Description**: Retrieve your numeric GitHub user ID for auth restriction.

**Acceptance Criteria**:

- [ ] Run `gh api user --jq '.id'` to get numeric ID
- [ ] Document as `ALLOWED_GITHUB_USER_ID`

---

### INFRA-007: Create Local Environment File Template

**Description**: Create `.env.example` template with all required variables.

**Acceptance Criteria**:

- [ ] `.env.example` created with placeholders for all env vars
- [ ] `.env.local` added to `.gitignore`
- [ ] README updated with environment setup instructions

---

## Epic 2: Project Foundation (6 stories)

### FOUND-001: Initialize Next.js 15 Project

**Description**: Create the Next.js 15 project with TypeScript and pnpm.

**Acceptance Criteria**:

- [x] Run `pnpm create next-app@latest` with App Router, TypeScript, Tailwind, ESLint, Prettier
- [x] Project starts with `pnpm dev`
- [x] TypeScript compiles without errors
- [x] Default page renders at localhost:3000

---

### FOUND-002: Configure Tailwind with Theme Variables

**Description**: Set up Tailwind CSS with custom color palette and CSS variables for theming.

**Acceptance Criteria**:

- [x] `tailwind.config.ts` extended with custom colors
- [x] CSS variables defined in `globals.css` for dark/light themes
- [x] Typography plugin installed (`@tailwindcss/typography`)
- [x] Custom fonts configured (Geist Sans, Geist Mono)

---

### FOUND-003: Install and Configure next-themes

**Description**: Set up next-themes for dark/light mode switching.

**Acceptance Criteria**:

- [x] `next-themes` package installed
- [x] ThemeProvider wrapper created
- [x] Default theme set to "dark"
- [x] System preference detection enabled
- [x] No hydration mismatch errors

---

### FOUND-004: Create Root Layout with Theme Provider

**Description**: Build the root layout component with theme support and metadata.

**Acceptance Criteria**:

- [x] `app/layout.tsx` wraps children with ThemeProvider
- [x] Metadata configured (title, description)
- [x] Font loading optimized
- [x] Suppress hydration warning on html element

---

### FOUND-005: Set Up Project Directory Structure

**Description**: Create the folder structure for components, lib, content, and styles.

**Acceptance Criteria**:

- [ ] `components/` with subdirectories: ui, layout, blog, mdx, contact
- [ ] `lib/` directory created
- [ ] `content/` with subdirectories: blog, projects, data
- [ ] `public/images/` directory structure

---

### FOUND-006: Configure ESLint and Prettier

**Description**: Set up consistent code formatting and linting rules.

**Acceptance Criteria**:

- [ ] ESLint config extended with recommended rules
- [ ] Prettier installed and configured
- [ ] Scripts added: `pnpm lint`, `pnpm format`
- [ ] Editor config file created

---

## Epic 3: Layout & Navigation (6 stories)

### LAYOUT-001: Create Header Component

**Description**: Build the site header with logo, navigation links, and theme toggle slot.

**Acceptance Criteria**:

- [ ] Header component in `components/layout/Header.tsx`
- [ ] Logo/site name linking to home
- [ ] Navigation links: Blog, Projects, About, Contact
- [ ] Slot for ThemeToggle component
- [ ] Responsive design (mobile menu placeholder)
- [ ] Proper semantic HTML (`<header>`, `<nav>`)

---

### LAYOUT-002: Create Footer Component

**Description**: Build the site footer with copyright, social links, and site info.

**Acceptance Criteria**:

- [ ] Footer component in `components/layout/Footer.tsx`
- [ ] Copyright with current year
- [ ] Social links (GitHub, LinkedIn, etc.)
- [ ] Built with Next.js attribution (optional)
- [ ] Proper semantic HTML (`<footer>`)

---

### LAYOUT-003: Create ThemeToggle Component

**Description**: Build the theme toggle button with sun/moon icons.

**Acceptance Criteria**:

- [ ] ThemeToggle in `components/ui/ThemeToggle.tsx`
- [ ] Uses `useTheme` hook from next-themes
- [ ] Displays sun icon for dark mode, moon for light
- [ ] Smooth icon transition animation
- [ ] Accessible (aria-label, keyboard navigation)
- [ ] Test: toggle persists across page navigation

---

### LAYOUT-004: Create Main Layout Wrapper

**Description**: Build a consistent page layout wrapper with Header and Footer.

**Acceptance Criteria**:

- [ ] Layout includes Header, main content area, Footer
- [ ] Main content has max-width container
- [ ] Proper spacing and padding
- [ ] Skip to content link for accessibility

---

### LAYOUT-005: Implement Mobile Navigation Menu

**Description**: Create responsive mobile menu with hamburger toggle.

**Acceptance Criteria**:

- [ ] Hamburger button visible on mobile breakpoints
- [ ] Menu slides/fades in when opened
- [ ] Menu closes on link click or outside click
- [ ] Focus trap when menu is open
- [ ] Animated transitions

---

### LAYOUT-006: Add Active Link Highlighting

**Description**: Highlight the current page in navigation.

**Acceptance Criteria**:

- [ ] Use `usePathname` to detect current route
- [ ] Active link has distinct styling (underline, color)
- [ ] Works for nested routes (e.g., /blog/\*)

---

## Epic 4: Badge System (4 stories)

### BADGE-001: Create Base Badge Component

**Description**: Build the core Badge component with variants.

**Acceptance Criteria**:

- [ ] Badge component in `components/ui/Badge.tsx`
- [ ] Props: label, variant, size, icon (optional)
- [ ] Variants: tech, status, content, level
- [ ] Sizes: sm, md, lg
- [ ] TypeScript types for all props
- [ ] Test: renders correctly for each variant

---

### BADGE-002: Create Tech Badge Data Configuration

**Description**: Set up tech badge definitions with brand colors.

**Acceptance Criteria**:

- [ ] `content/data/tech-badges.json` with common technologies
- [ ] Each entry: slug, label, color, icon (simple-icons name)
- [ ] Include: React, TypeScript, Python, Next.js, Node.js, Tailwind, etc.
- [ ] Utility function to look up badge by slug

---

### BADGE-003: Create BadgeGroup Component

**Description**: Component to display multiple badges together.

**Acceptance Criteria**:

- [ ] BadgeGroup in `components/ui/BadgeGroup.tsx`
- [ ] Props: badges array, maxVisible (with "+N more")
- [ ] Proper spacing between badges
- [ ] Responsive wrapping

---

### BADGE-004: Create Status and Content Badge Presets

**Description**: Define preset badges for status and content types.

**Acceptance Criteria**:

- [ ] Status badges: New (green), Updated (blue), Popular (purple), WIP (amber), Archived (gray)
- [ ] Content badges: Tutorial, Deep Dive, Quick Tip, Series
- [ ] Level badges: Beginner, Intermediate, Advanced
- [ ] Export utility functions for badge lookups

---

## Epic 5: MDX Pipeline (5 stories)

### MDX-001: Install MDX Dependencies

**Description**: Install and configure packages for MDX processing.

**Acceptance Criteria**:

- [ ] Install: `next-mdx-remote`, `gray-matter`, `shiki`
- [ ] Install: `reading-time`, `rehype-slug`, `rehype-autolink-headings`
- [ ] All packages at latest stable versions

---

### MDX-002: Create MDX Processing Utilities

**Description**: Build utility functions to parse and render MDX content.

**Acceptance Criteria**:

- [ ] `lib/mdx.ts` with functions:
  - `getMdxContent(slug, type)` - read and parse single file
  - `getAllContent(type)` - list all content of a type
  - `serializeMdx(content)` - compile MDX to renderable format
- [ ] Frontmatter extraction with gray-matter
- [ ] Reading time calculation
- [ ] Test: parse sample MDX file successfully

---

### MDX-003: Configure Shiki Syntax Highlighting

**Description**: Set up Shiki for code block syntax highlighting.

**Acceptance Criteria**:

- [ ] Shiki highlighter initialized
- [ ] Theme: `github-dark` for dark mode, `github-light` for light
- [ ] Common languages enabled: js, ts, tsx, jsx, python, bash, json, yaml, css
- [ ] Rehype plugin integration

---

### MDX-004: Create Custom MDX Components

**Description**: Build React components for rendering MDX elements.

**Acceptance Criteria**:

- [ ] `components/mdx/` with custom components:
  - Enhanced code blocks with copy button
  - Responsive images with Next.js Image
  - Custom blockquotes/callouts
  - Linked headings
- [ ] MDXComponents map exported for use with next-mdx-remote

---

### MDX-005: Create CopyCodeButton Component

**Description**: Add copy-to-clipboard functionality for code blocks.

**Acceptance Criteria**:

- [ ] CopyCodeButton in `components/ui/CopyCodeButton.tsx`
- [ ] Uses Clipboard API
- [ ] Visual feedback on copy (checkmark icon, "Copied!")
- [ ] Resets after 2 seconds
- [ ] Accessible button with aria-label
- [ ] Test: clicking copies code to clipboard

---

## Epic 6: Homepage (5 stories)

### HOME-001: Create Homepage Layout

**Description**: Build the homepage structure with sections.

**Acceptance Criteria**:

- [ ] `app/page.tsx` with section containers
- [ ] Sections: Hero, Skills Preview, Recent Posts, Featured Projects
- [ ] Responsive grid layouts
- [ ] Proper semantic sectioning (`<section>`)

---

### HOME-002: Build Hero Section

**Description**: Create the hero section with name, title, and intro.

**Acceptance Criteria**:

- [ ] Large heading with name
- [ ] Subtitle with role/title
- [ ] Brief intro paragraph
- [ ] Call-to-action buttons (View Projects, Read Blog)
- [ ] Terminal-style accent or typing animation (optional)

---

### HOME-003: Create Skills Preview Section

**Description**: Visual display of key technologies/skills.

**Acceptance Criteria**:

- [ ] Grid of tech badges
- [ ] Grouped by category (Frontend, Backend, Tools)
- [ ] Hover effects on badges
- [ ] Link to full About page

---

### HOME-004: Build Recent Posts Preview

**Description**: Display 3-4 most recent blog posts.

**Acceptance Criteria**:

- [ ] Fetch latest published posts
- [ ] PostCard component with title, date, description, badges
- [ ] "View all posts" link
- [ ] Handles empty state gracefully

---

### HOME-005: Build Featured Projects Preview

**Description**: Display featured projects grid.

**Acceptance Criteria**:

- [ ] Fetch projects with `featured: true`
- [ ] ProjectCard with title, description, tech badges
- [ ] Links to project detail or external URL
- [ ] "View all projects" link

---

## Epic 7: Blog System (10 stories)

### BLOG-001: Create Blog Listing Page

**Description**: Build the main blog index page.

**Acceptance Criteria**:

- [ ] `app/blog/page.tsx` listing all published posts
- [ ] Posts sorted by date (newest first)
- [ ] PostCard for each post with metadata
- [ ] Page title and description

---

### BLOG-002: Create PostCard Component

**Description**: Card component for blog post previews.

**Acceptance Criteria**:

- [ ] `components/blog/PostCard.tsx`
- [ ] Props: post object with frontmatter
- [ ] Displays: title, date, description, tags, badges
- [ ] Reading time display
- [ ] Hover state animation
- [ ] Links to full post

---

### BLOG-003: Create Blog Post Detail Page

**Description**: Dynamic route for individual blog posts.

**Acceptance Criteria**:

- [ ] `app/blog/[slug]/page.tsx`
- [ ] Fetch post by slug
- [ ] Render MDX content with custom components
- [ ] Display frontmatter metadata
- [ ] 404 for non-existent slugs
- [ ] Generate static params for all posts

---

### BLOG-004: Create ReadingProgress Component

**Description**: Progress bar showing reading position.

**Acceptance Criteria**:

- [ ] `components/blog/ReadingProgress.tsx`
- [ ] Fixed position at top of viewport
- [ ] Width based on scroll percentage
- [ ] Smooth animation
- [ ] Accent color themed
- [ ] Test: progress updates on scroll

---

### BLOG-005: Create TableOfContents Component

**Description**: Auto-generated table of contents from headings.

**Acceptance Criteria**:

- [ ] `components/blog/TableOfContents.tsx`
- [ ] Extract headings from MDX content
- [ ] Nested list for h2/h3 hierarchy
- [ ] Scroll to heading on click
- [ ] Highlight current section (scroll spy)
- [ ] Collapsible on mobile

---

### BLOG-006: Implement Related Posts Component

**Description**: Show related posts based on tags and manual selection.

**Acceptance Criteria**:

- [ ] `components/blog/RelatedPosts.tsx`
- [ ] Props: currentPost, allPosts
- [ ] Priority: manual `relatedPosts` frontmatter
- [ ] Fallback: auto-match by shared tags
- [ ] Display 2-3 related posts
- [ ] Test: correct posts selected

---

### BLOG-007: Implement Series Support

**Description**: Add blog series functionality for multi-part posts.

**Acceptance Criteria**:

- [ ] Posts can specify `series` and `seriesOrder` in frontmatter
- [ ] `lib/blog.ts` function to get all posts in a series
- [ ] Series sorted by seriesOrder

---

### BLOG-008: Create SeriesNav Component

**Description**: Navigation between posts in a series.

**Acceptance Criteria**:

- [ ] `components/blog/SeriesNav.tsx`
- [ ] Shows series title and current position (e.g., "Part 2 of 5")
- [ ] Links to previous/next posts in series
- [ ] Full series post list (collapsible)
- [ ] Visual indication of current post

---

### BLOG-009: Create Series Listing Page

**Description**: Page showing all blog series.

**Acceptance Criteria**:

- [ ] `app/blog/series/page.tsx`
- [ ] List all series with metadata
- [ ] Post count per series
- [ ] Link to first post or series detail page

---

### BLOG-010: Create Sample Blog Post Content

**Description**: Create 2-3 sample MDX blog posts for testing.

**Acceptance Criteria**:

- [ ] At least one standalone post
- [ ] At least one series (2 posts)
- [ ] Various frontmatter configurations
- [ ] Code blocks for syntax highlighting test
- [ ] Images for image handling test

---

## Epic 8: Contact System (8 stories)

### CONTACT-001: Create Contact Page Layout

**Description**: Build the contact page with form container.

**Acceptance Criteria**:

- [ ] `app/contact/page.tsx`
- [ ] Page title and introduction text
- [ ] Form container with proper styling
- [ ] Alternative contact info (email, social links)

---

### CONTACT-002: Create ContactForm Component

**Description**: Build the contact form with validation.

**Acceptance Criteria**:

- [ ] `components/contact/ContactForm.tsx`
- [ ] Fields: name, email, subject (dropdown), message
- [ ] Client-side validation (required fields, email format)
- [ ] Honeypot hidden field for spam prevention
- [ ] Submit button with loading state
- [ ] Success/error message display

---

### CONTACT-003: Create Database Schema for Contacts

**Description**: Set up database table for contact submissions.

**Acceptance Criteria**:

- [ ] `lib/db.ts` with database client setup
- [ ] SQL schema for `contact_submissions` table
- [ ] Fields: id, name, email, subject, message, created_at, synced_to_obsidian
- [ ] Migration script or schema file

---

### CONTACT-004: Create Contact API Route Handler

**Description**: Build the API endpoint for contact form submissions.

**Acceptance Criteria**:

- [ ] `app/api/contact/route.ts` with POST handler
- [ ] Input validation and sanitization
- [ ] Honeypot check (reject if filled)
- [ ] Return appropriate status codes
- [ ] TypeScript types for request/response
- [ ] Test: valid submission returns 200

---

### CONTACT-005: Implement Rate Limiting

**Description**: Add IP-based rate limiting using Vercel KV.

**Acceptance Criteria**:

- [ ] `lib/rate-limit.ts` utility
- [ ] Limits: 5/hour, 20/day per IP
- [ ] Uses Vercel KV for storage
- [ ] Returns 429 when exceeded
- [ ] Includes retry-after header
- [ ] Test: rate limit triggers after threshold

---

### CONTACT-006: Integrate Database Saving

**Description**: Save contact submissions to Vercel Postgres.

**Acceptance Criteria**:

- [ ] Contact API saves to database on valid submission
- [ ] Proper error handling for DB failures
- [ ] Returns submission ID in response

---

### CONTACT-007: Implement Email Notifications

**Description**: Send email notification on contact submission.

**Acceptance Criteria**:

- [ ] `lib/email.ts` with Resend client
- [ ] Email template for contact notifications
- [ ] Includes all submission details
- [ ] Sends to `CONTACT_EMAIL` env var
- [ ] Non-blocking (don't fail submission if email fails)
- [ ] Test: email sent on submission

---

### CONTACT-008: Create Contact Form Success/Error States

**Description**: Polish the form UX with proper feedback states.

**Acceptance Criteria**:

- [ ] Loading spinner during submission
- [ ] Success message with reset option
- [ ] Error message with retry option
- [ ] Rate limit message with time until retry
- [ ] Form preserves input on error

---

## Epic 9: Deployment (2 stories)

### DEPLOY-001: Configure Vercel Deployment

**Description**: Set up production deployment configuration.

**Acceptance Criteria**:

- [ ] `vercel.json` with any needed configuration
- [ ] Environment variables set in Vercel dashboard
- [ ] Preview deployments working for PRs
- [ ] Production deployment on main branch push

---

### DEPLOY-002: Verify Production Deployment

**Description**: Test all features in production environment.

**Acceptance Criteria**:

- [ ] All pages render correctly
- [ ] Theme toggle works
- [ ] Blog posts display with syntax highlighting
- [ ] Contact form submits successfully
- [ ] Database connections working
- [ ] Email notifications sending
- [ ] Rate limiting functional
- [ ] No console errors

---

## Story Dependencies

```
INFRA-* → FOUND-001 (infrastructure before code)
FOUND-001 → FOUND-002 → FOUND-003 → FOUND-004 (sequential setup)
FOUND-004 → LAYOUT-* (layout needs root layout)
LAYOUT-003 → FOUND-003 (theme toggle needs next-themes)

MDX-001 → MDX-002 → MDX-003 → MDX-004 (sequential MDX setup)
MDX-002 → BLOG-* (blog needs MDX utilities)

BADGE-001 → BADGE-002 → BADGE-003 (badge system build-up)

HOME-004 → BLOG-002, MDX-002 (needs posts and cards)
HOME-005 → BADGE-001 (needs badges for projects)

BLOG-001 → BLOG-002 (listing needs cards)
BLOG-003 → MDX-004 (detail needs MDX components)
BLOG-007 → BLOG-008 (series nav needs series support)

CONTACT-003 → CONTACT-006 (DB schema before saving)
CONTACT-004 → CONTACT-005, CONTACT-006, CONTACT-007 (API integrates all)
INFRA-003 → CONTACT-003 (need DB provisioned)
INFRA-004 → CONTACT-005 (need KV provisioned)
INFRA-005 → CONTACT-007 (need Resend for email)

DEPLOY-001 → DEPLOY-002 (deploy before verify)
All other stories → DEPLOY-001 (deploy after implementation)
```

---

## Suggested Sprint Groupings

### Sprint 1: Infrastructure & Foundation

- INFRA-001 through INFRA-007
- FOUND-001 through FOUND-006

### Sprint 2: Layout & Theme System

- LAYOUT-001 through LAYOUT-006
- BADGE-001 through BADGE-004

### Sprint 3: MDX & Homepage

- MDX-001 through MDX-005
- HOME-001 through HOME-005

### Sprint 4: Blog System

- BLOG-001 through BLOG-010

### Sprint 5: Contact System & Deployment

- CONTACT-001 through CONTACT-008
- DEPLOY-001, DEPLOY-002

---

## Verification Checklist

After Phase 1 completion, verify:

- [ ] Site loads in both dark and light themes
- [ ] Theme preference persists across sessions
- [ ] Mobile navigation works smoothly
- [ ] All badge variants display correctly
- [ ] Blog posts render with syntax highlighting
- [ ] Code copy button works
- [ ] Reading progress bar updates on scroll
- [ ] Table of contents links work
- [ ] Related posts display correctly
- [ ] Series navigation works
- [ ] Contact form validates input
- [ ] Contact form rate limits work
- [ ] Contact submissions saved to database
- [ ] Email notifications sent
- [ ] Site deployed and accessible at production URL
