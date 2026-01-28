# LAYOUT-001: Header Component Implementation Plan

## Overview

Create a responsive Header component with terminal-style navigation for the portfolio site. The header includes site branding ("Kendall Adkins"), navigation links styled as terminal commands (e.g., `~/blog`), and placeholder slots for ThemeToggle and mobile navigation (separate stories).

## Current State Analysis

### What Exists:
- Empty `components/layout/` directory with `.gitkeep`
- Root layout (`app/layout.tsx`) wraps children in ThemeProvider but has no Header
- Full theme system with CSS variables (background, foreground, muted, accent, border, etc.)
- `cn()` utility in `app/utils.ts` for className merging
- Tailwind v4 configured with `@theme inline` directive

### What's Missing:
- Header component
- Navigation component
- Integration into root layout

## Desired End State

### Success Criteria (from IMPLEMENTATION_STORIES.md):
- [x] Header component in `components/layout/Header.tsx`
- [x] Logo/site name ("Kendall Adkins") linking to home
- [x] Navigation links: Blog, Projects, About, Contact
- [x] Slot for ThemeToggle component
- [x] Responsive design (mobile menu placeholder)
- [x] Proper semantic HTML (`<header>`, `<nav>`)

### Additional Requirements:
- [x] Terminal-style navigation (e.g., `~/blog`, `~/projects`)
- [x] Standard mobile breakpoint at `md` (768px)
- [x] Uses existing theme CSS variables
- [x] Works in both dark and light modes

## What We're NOT Doing

- **NOT** implementing ThemeToggle component (LAYOUT-003)
- **NOT** implementing mobile hamburger menu functionality (LAYOUT-005)
- **NOT** implementing active link highlighting (LAYOUT-006)
- **NOT** creating Footer component (LAYOUT-002)

## Implementation Approach

**Strategy**: Create a single Header component with inline navigation. Use semantic HTML (`<header>`, `<nav>`) and Tailwind for styling. Include placeholder elements for ThemeToggle and mobile menu that will be implemented in later stories.

**Navigation Style**: Terminal-inspired with `~/` prefix for each route (e.g., `~/blog`, `~/projects`).

---

## Phase 1: Create Header Component

### Overview
Build the main Header component with site branding and desktop navigation.

### Changes Required:

#### 1. Create Header Component
**File**: `components/layout/Header.tsx`

```tsx
import Link from 'next/link'
import { cn } from '@/app/utils'

const navItems = [
  { href: '/blog', label: '~/blog' },
  { href: '/projects', label: '~/projects' },
  { href: '/about', label: '~/about' },
  { href: '/contact', label: '~/contact' },
]

interface HeaderProps {
  className?: string
}

export function Header({ className }: HeaderProps) {
  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
        className
      )}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo / Site Name */}
        <Link
          href="/"
          className="font-mono text-lg font-semibold text-foreground transition-colors hover:text-accent"
        >
          Kendall Adkins
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="font-mono text-sm text-muted-foreground transition-colors hover:text-accent"
            >
              {item.label}
            </Link>
          ))}

          {/* ThemeToggle placeholder - will be replaced in LAYOUT-003 */}
          <div className="ml-2">
            {/* <ThemeToggle /> */}
          </div>
        </nav>

        {/* Mobile Menu Button placeholder - will be implemented in LAYOUT-005 */}
        <button
          className="md:hidden p-2 text-muted-foreground hover:text-foreground"
          aria-label="Open menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="4" x2="20" y1="12" y2="12" />
            <line x1="4" x2="20" y1="6" y2="6" />
            <line x1="4" x2="20" y1="18" y2="18" />
          </svg>
        </button>
      </div>
    </header>
  )
}
```

**Key Decisions:**
- **Sticky header**: Uses `sticky top-0` for persistent visibility while scrolling
- **Backdrop blur**: Semi-transparent background with blur effect for modern aesthetic
- **Terminal-style nav**: Links prefixed with `~/` (e.g., `~/blog`)
- **Font**: Monospace (`font-mono`) for terminal aesthetic
- **Colors**: Uses theme variables (`text-foreground`, `text-muted-foreground`, `text-accent`)
- **Mobile**: Hamburger button visible below `md` breakpoint, nav hidden

### Success Criteria:

#### Automated Verification:
- [x] No TypeScript errors: `pnpm build`
- [x] No linting errors: `pnpm lint`
- [ ] Component renders without errors in dev server

#### Manual Verification:
- [ ] Header appears at top of page
- [ ] "Kendall Adkins" links to home (`/`)
- [ ] Navigation links visible on desktop (>768px)
- [ ] Hamburger icon visible on mobile (<768px)
- [ ] Hover states work on links (color changes to accent)
- [ ] Header is sticky when scrolling
- [ ] Works correctly in both dark and light modes

---

## Phase 2: Integrate Header into Root Layout

### Overview
Add the Header component to the root layout so it appears on all pages.

### Changes Required:

#### 1. Update Root Layout
**File**: `app/layout.tsx`

**Current** (lines 24-38):
```tsx
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
```

**New**:
```tsx
import { Header } from '@/components/layout/Header'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          <div className="relative flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
```

**Key Decisions:**
- **Flexbox layout**: `flex min-h-screen flex-col` ensures footer (when added) stays at bottom
- **Main wrapper**: `flex-1` on main allows content to expand and push footer down
- **Relative positioning**: Needed for sticky header z-index stacking context

#### 2. Update Tailwind Content Paths
**File**: `tailwind.config.ts`

**Current** (line 5):
```typescript
content: ['./app/**/*.{ts,tsx}'],
```

**New**:
```typescript
content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
```

**Rationale**: Header is in `components/layout/`, which needs to be scanned for Tailwind classes.

### Success Criteria:

#### Automated Verification:
- [x] `pnpm build` completes without errors
- [x] `pnpm lint` passes
- [ ] No hydration mismatch warnings

#### Manual Verification:
- [ ] Header appears on homepage
- [ ] Header appears on all routes (test `/test-theme` if exists)
- [ ] Page content renders below header
- [ ] Scrolling behavior works correctly

---

## Phase 3: Verification & Polish

### Overview
Test the header across different viewport sizes and themes.

### Testing Steps:

#### 1. Desktop Testing (>768px)
- [ ] All navigation links are visible
- [ ] Links have correct href values
- [ ] Hover states work (accent color on hover)
- [ ] Header has backdrop blur effect
- [ ] Sticky behavior works on scroll

#### 2. Mobile Testing (<768px)
- [ ] Navigation links are hidden
- [ ] Hamburger menu icon is visible
- [ ] "Kendall Adkins" branding still visible
- [ ] Button doesn't do anything yet (expected - LAYOUT-005)

#### 3. Theme Testing
- [ ] Toggle theme in browser DevTools (or `/test-theme` page if available)
- [ ] Header background changes appropriately
- [ ] Text colors update for both themes
- [ ] Border color updates

#### 4. Accessibility Checks
- [ ] Proper semantic HTML (`<header>`, `<nav>`)
- [ ] Links are keyboard navigable
- [ ] Menu button has `aria-label`
- [ ] No color contrast issues

### Success Criteria:

#### Automated Verification:
- [x] `pnpm build` succeeds
- [x] `pnpm lint` passes
- [ ] No console errors in browser

#### Manual Verification:
- [ ] Header renders correctly at all breakpoints
- [ ] All navigation links work
- [ ] Theme compatibility confirmed
- [ ] Semantic HTML in place

---

## Testing Strategy

### Unit Tests:
Not required for this story - Header is a presentational component.

### Integration Tests:
Not required for MVP - will be covered by E2E tests in DEPLOY-002.

### Manual Testing Steps:
1. Start dev server: `pnpm dev`
2. Visit `http://localhost:3000`
3. Verify header appears with "Kendall Adkins" and navigation
4. Click each nav link - verify routing works
5. Resize browser below 768px - verify mobile layout
6. Scroll page - verify sticky behavior
7. Test theme toggle (if DevTools)

---

## Performance Considerations

### Bundle Size:
- Single component (~1-2KB unminified)
- No external dependencies
- Inline SVG for hamburger icon (no icon library)

### Runtime Performance:
- Static component (no state)
- CSS-based responsive design (no JS media queries)
- Backdrop blur has minimal performance impact on modern browsers

---

## Migration Notes

### Backwards Compatibility:
- No breaking changes to existing pages
- Homepage will now have header above current content

### Future Integrations:
- **LAYOUT-003**: Will add ThemeToggle component in the placeholder slot
- **LAYOUT-005**: Will implement mobile menu functionality using the hamburger button
- **LAYOUT-006**: Will add active link highlighting using `usePathname()`
- **LAYOUT-002**: Footer will be added to the layout wrapper

---

## Files Summary

### Files to Create:
- `components/layout/Header.tsx`

### Files to Modify:
- `app/layout.tsx` (add Header import and layout structure)
- `tailwind.config.ts` (add components path to content)

### Files to Delete:
- `components/layout/.gitkeep` (optional, after Header is created)

---

## Reference

### Related Stories:
- **Prerequisite**: FOUND-004 (Root Layout with Theme Provider) - Complete
- **Enables**: LAYOUT-003 (ThemeToggle), LAYOUT-005 (Mobile Nav), LAYOUT-006 (Active Links)

### Navigation Routes:
| Label | Path | Description |
|-------|------|-------------|
| ~/blog | /blog | Blog listing page |
| ~/projects | /projects | Projects showcase |
| ~/about | /about | About page |
| ~/contact | /contact | Contact form |
