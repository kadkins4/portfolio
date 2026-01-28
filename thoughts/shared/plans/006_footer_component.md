# LAYOUT-002: Footer Component Implementation Plan

## Overview

Create a minimal Footer component with copyright notice and social links (GitHub, LinkedIn, Instagram). The footer matches the terminal-style aesthetic of the Header and sticks to the bottom of the page using the existing flex layout structure.

## Current State Analysis

### What Exists:
- Root layout ([app/layout.tsx](app/layout.tsx)) has `min-h-screen flex-col` structure ready for Footer
- Header component ([components/layout/Header.tsx](components/layout/Header.tsx)) establishes terminal-style patterns
- Full theme system with CSS variables for both light/dark modes
- `cn()` utility in [app/utils.ts](app/utils.ts) for className merging

### What's Missing:
- Footer component
- Social link icons
- Integration into root layout

## Desired End State

### Success Criteria (from IMPLEMENTATION_STORIES.md):
- [x] Footer component in `components/layout/Footer.tsx`
- [x] Copyright with current year
- [x] Social links: GitHub, LinkedIn, Instagram
- [x] Proper semantic HTML (`<footer>`)

### Additional Requirements:
- [x] Terminal-style aesthetic matching Header
- [x] Uses existing theme CSS variables
- [x] Works in both dark and light modes
- [x] Responsive design (icons stack appropriately on mobile)

## What We're NOT Doing

- **NOT** including navigation links (user preference)
- **NOT** including "Built with Next.js" attribution (user preference)
- **NOT** including email/mailto link (user preference)
- **NOT** implementing complex multi-column layout

## Implementation Approach

**Strategy**: Create a simple, single-row Footer with copyright on the left and social icons on the right. Use inline SVG icons to avoid external dependencies. Style to match Header's terminal aesthetic.

**Layout**: Centered container with flexbox, items justified between copyright text and social icons.

---

## Phase 1: Create Footer Component

### Overview
Build the Footer component with copyright and social links.

### Changes Required:

#### 1. Create Footer Component
**File**: `components/layout/Footer.tsx`

```tsx
import { cn } from '@/app/utils'

const socialLinks = [
  {
    name: 'GitHub',
    href: 'https://github.com/kendalladkins',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
      </svg>
    ),
  },
  {
    name: 'LinkedIn',
    href: 'https://linkedin.com/in/kendalladkins',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
      </svg>
    ),
  },
  {
    name: 'Instagram',
    href: 'https://instagram.com/kendalladkins',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
]

interface FooterProps {
  className?: string
}

export function Footer({ className }: FooterProps) {
  const currentYear = new Date().getFullYear()

  return (
    <footer
      className={cn(
        'w-full border-t border-border bg-background',
        className
      )}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Copyright */}
        <p className="font-mono text-sm text-muted-foreground">
          &copy; {currentYear} Kendall Adkins
        </p>

        {/* Social Links */}
        <div className="flex items-center gap-4">
          {socialLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground transition-colors hover:text-accent"
              aria-label={link.name}
            >
              {link.icon}
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}
```

**Key Decisions:**
- **Static footer**: No sticky positioning - stays at page bottom naturally via flex layout
- **Border top**: Matches Header's border style for visual consistency
- **Height**: Same `h-16` as Header for balance
- **Icons**: Inline SVG to avoid external dependencies
- **Target blank**: Social links open in new tab
- **Accessibility**: `aria-label` on each social link
- **Dynamic year**: `new Date().getFullYear()` for auto-updating copyright

### Success Criteria:

#### Automated Verification:
- [x] No TypeScript errors: `pnpm build`
- [x] No linting errors: `pnpm lint`
- [ ] Component renders without errors in dev server

#### Manual Verification:
- [ ] Footer appears at bottom of page
- [ ] Copyright shows current year
- [ ] All 3 social icons visible and clickable
- [ ] Hover states work (color changes to accent)
- [ ] Links open in new tab
- [ ] Works correctly in both dark and light modes

---

## Phase 2: Integrate Footer into Root Layout

### Overview
Add the Footer component to the root layout below the main content area.

### Changes Required:

#### 1. Update Root Layout
**File**: `app/layout.tsx`

**Current** (lines 35-40):
```tsx
<ThemeProvider>
  <div className="relative flex min-h-screen flex-col">
    <Header />
    <main className="flex-1">{children}</main>
  </div>
</ThemeProvider>
```

**New**:
```tsx
import { Footer } from '@/components/layout/Footer'

// ... existing code ...

<ThemeProvider>
  <div className="relative flex min-h-screen flex-col">
    <Header />
    <main className="flex-1">{children}</main>
    <Footer />
  </div>
</ThemeProvider>
```

**Rationale**: The existing `flex min-h-screen flex-col` with `flex-1` on main ensures Footer sticks to bottom when content is short.

### Success Criteria:

#### Automated Verification:
- [x] `pnpm build` completes without errors
- [x] `pnpm lint` passes
- [ ] No hydration mismatch warnings

#### Manual Verification:
- [ ] Footer appears on homepage
- [ ] Footer appears on all routes
- [ ] Footer stays at bottom on short pages
- [ ] Footer scrolls with content on long pages

---

## Phase 3: Verification & Polish

### Overview
Test the footer across different viewport sizes and themes.

### Testing Steps:

#### 1. Desktop Testing (>768px)
- [ ] Copyright and social icons on same row
- [ ] Copyright left-aligned, icons right-aligned
- [ ] Icons have correct hover states
- [ ] All social links work (open in new tab)

#### 2. Mobile Testing (<768px)
- [ ] Layout remains functional (flexbox adapts)
- [ ] Icons have enough touch target size (20px icons + gap)
- [ ] Copyright text doesn't wrap awkwardly

#### 3. Theme Testing
- [ ] Footer background changes with theme
- [ ] Text colors update for both themes
- [ ] Border color updates
- [ ] Icon hover color (accent) appropriate for both themes

#### 4. Accessibility Checks
- [ ] Proper semantic HTML (`<footer>`)
- [ ] Social links have `aria-label`
- [ ] Links are keyboard navigable
- [ ] `rel="noopener noreferrer"` on external links

### Success Criteria:

#### Automated Verification:
- [x] `pnpm build` succeeds
- [x] `pnpm lint` passes
- [ ] No console errors in browser

#### Manual Verification:
- [ ] Footer renders correctly at all breakpoints
- [ ] All social links work
- [ ] Theme compatibility confirmed
- [ ] Semantic HTML in place

---

## Testing Strategy

### Unit Tests:
Not required for this story - Footer is a presentational component.

### Integration Tests:
Not required for MVP - will be covered by E2E tests in later stories.

### Manual Testing Steps:
1. Start dev server: `pnpm dev`
2. Visit `http://localhost:3000`
3. Verify footer appears at bottom with copyright and 3 social icons
4. Click each social link - verify opens in new tab
5. Resize browser - verify layout adapts
6. Scroll page - verify footer behavior
7. Test theme toggle (verify colors in both modes)

---

## Performance Considerations

### Bundle Size:
- Single component (~2-3KB unminified)
- No external dependencies
- Inline SVG icons (no icon library)

### Runtime Performance:
- Static component (no state)
- CSS-based responsive design
- `new Date().getFullYear()` called once per render (negligible)

---

## Migration Notes

### Backwards Compatibility:
- No breaking changes to existing pages
- Homepage will now have footer below current content

### Future Integrations:
- **LAYOUT-004**: Main Layout Wrapper will use this Footer
- Social links can be expanded later if needed

---

## Files Summary

### Files to Create:
- `components/layout/Footer.tsx`

### Files to Modify:
- `app/layout.tsx` (add Footer import and component)

### Files to Delete:
- None

---

## Reference

### Related Stories:
- **Prerequisite**: LAYOUT-001 (Header Component) - Complete
- **Enables**: LAYOUT-004 (Main Layout Wrapper)

### Social Links:
| Platform | URL |
|----------|-----|
| GitHub | https://github.com/kendalladkins |
| LinkedIn | https://linkedin.com/in/kendalladkins |
| Instagram | https://instagram.com/kendalladkins |

**Note**: Update the social link URLs with actual profile URLs before implementation.
