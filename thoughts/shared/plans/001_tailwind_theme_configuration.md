# Tailwind Theme Configuration Implementation Plan

## Overview

Configure Tailwind CSS v4 with comprehensive theme variables, install Typography plugin, and establish developer-focused monochrome color palette for the portfolio. This implements FOUND-002 from the implementation stories.

## Current State Analysis

### What Exists:
- Tailwind CSS v4.1.18 installed with PostCSS plugin (`@tailwindcss/postcss`)
- Basic `tailwind.config.ts` with `darkMode: 'class'` configured
- CSS variables defined in `globals.css` for 5 colors (background, foreground, code-bg, code-text, code-border)
- `@theme inline` directive integration (Tailwind v4 CSS-first approach)
- Font loading via Next.js Font Optimizer (Geist Sans & Geist Mono)
- Dark mode via `@media (prefers-color-scheme: dark)` media query
- Utility helper: `cn()` function in `app/utils.ts` using clsx + tailwind-merge

### Key Issues:
1. **Redundant theme configuration**: Theme customization exists in both `tailwind.config.ts` (v3 pattern) and `globals.css` @theme inline (v4 pattern)
2. **Incomplete color palette**: Only 5 CSS variables defined, insufficient for full UI
3. **Missing Typography plugin**: Required for MDX blog post rendering
4. **Outdated content paths**: tailwind.config.ts references non-existent `/components/**/*.{ts,tsx}` path

### Architecture Note:
This project uses **Tailwind v4**, which has significant differences from v3:
- Uses `@import 'tailwindcss'` instead of `@tailwind` directives
- Theme customization via `@theme inline` in CSS (not JavaScript config)
- Requires `@tailwindcss/postcss` plugin instead of `tailwindcss` plugin

## Desired End State

### Success Criteria:
- [x] @tailwindcss/typography plugin installed and configured
- [x] Comprehensive monochrome color palette (zinc/slate grays + green accent)
- [x] All theme tokens defined in `@theme inline` (CSS-first approach)
- [x] `tailwind.config.ts` simplified to minimal v4-compliant configuration
- [x] Typography plugin configured for prose content in both light/dark modes
- [x] All CSS variables work correctly in light and dark themes
- [x] Fonts remain Geist Sans and Geist Mono (no changes needed)
- [x] Type checking passes (`pnpm run typecheck` if available, or `npx tsc --noEmit`)
- [x] Dev server runs without errors

## What We're NOT Doing

- ❌ Not installing or configuring next-themes (that's FOUND-003)
- ❌ Not creating theme toggle component (that's LAYOUT-003)
- ❌ Not changing fonts from Geist to Inter/JetBrains Mono
- ❌ Not implementing full design system with primary/secondary/accent colors
- ❌ Not migrating to standard CSS (staying with Tailwind)
- ❌ Not updating existing components to use new variables (just making them available)

## Implementation Approach

**Strategy**: Use Tailwind v4's CSS-first approach by defining all theme tokens in `@theme inline` directive in globals.css. Remove redundant JavaScript configuration. Install Typography plugin for MDX content rendering.

**Color Philosophy**: Developer-focused monochrome palette using zinc/slate grays with green accent for code, maintaining terminal-inspired aesthetic.

---

## Phase 1: Install Dependencies & Clean Configuration

### Overview
Install @tailwindcss/typography plugin and simplify tailwind.config.ts to remove v3 legacy patterns and redundancy with @theme inline.

### Changes Required:

#### 1. Install Typography Plugin
**Command**:
```bash
pnpm add -D @tailwindcss/typography
```

**Verification**: Check `package.json` devDependencies includes `"@tailwindcss/typography": "^0.5.x"`

#### 2. Simplify Tailwind Config
**File**: `tailwind.config.ts`

**Changes**: Remove redundant theme.extend configuration (already handled by @theme inline), fix content paths, add Typography plugin

**Current**:
```typescript
import type { Config } from 'tailwindcss'

export default {
  darkMode: 'class',
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        code: {
          bg: 'var(--code-bg)',
          text: 'var(--code-text)',
          border: 'var(--code-border)',
        },
      },
      fontFamily: {
        mono: ['var(--font-geist-mono)'],
        sans: ['var(--font-geist-sans)'],
      },
    },
  },
  plugins: [],
} satisfies Config
```

**New**:
```typescript
import type { Config } from 'tailwindcss'

export default {
  darkMode: 'class',
  content: ['./app/**/*.{ts,tsx}'],
  plugins: [require('@tailwindcss/typography')],
} satisfies Config
```

**Rationale**:
- Removed `theme.extend` - colors and fonts now defined in @theme inline (v4 best practice)
- Removed `/components/**/*.{ts,tsx}` - this path doesn't exist (all components in `/app/components/`)
- Added Typography plugin to plugins array
- Kept `darkMode: 'class'` for next-themes integration in FOUND-003

### Success Criteria:

#### Automated Verification:
- [x] `pnpm install` completes successfully
- [x] `@tailwindcss/typography` appears in `package.json` devDependencies
- [x] `pnpm dev` starts without errors
- [x] No TypeScript errors in tailwind.config.ts

#### Manual Verification:
- [x] Existing components still render correctly (CodeBlock, home page)
- [x] No console warnings about missing plugins or invalid config

---

## Phase 2: Expand CSS Variable System

### Overview
Add comprehensive color variables for all UI elements following a developer-focused monochrome palette (zinc/slate with green accent). Integrate all variables into @theme inline for Tailwind utility generation.

### Changes Required:

#### 1. Expand Color Palette in globals.css
**File**: `app/globals.css`

**Changes**: Add comprehensive color system while preserving existing code block colors

**Current** (lines 3-29):
```css
:root {
  --background: #ffffff;
  --foreground: #171717;
  --code-bg: #f4f4f5;
  --code-text: #16a34a;
  --code-border: #e4e4e7;
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-code-bg: var(--code-bg);
  --color-code-text: var(--code-text);
  --color-code-border: var(--code-border);
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
}

@media (prefers-color-scheme: dark) {
  :root {
    --background: #0a0a0a;
    --foreground: #ededed;
    --code-bg: #18181b;
    --code-text: #4ade80;
    --code-border: #3f3f46;
  }
}
```

**New** (replace lines 3-29):
```css
:root {
  /* Base colors */
  --background: #ffffff;
  --foreground: #09090b;

  /* Muted colors for secondary content */
  --muted: #f4f4f5;
  --muted-foreground: #71717a;

  /* Card backgrounds */
  --card: #ffffff;
  --card-foreground: #09090b;

  /* Borders */
  --border: #e4e4e7;
  --input: #e4e4e7;

  /* Accent color (green for developer aesthetic) */
  --accent: #16a34a;
  --accent-foreground: #ffffff;

  /* Destructive/error states */
  --destructive: #dc2626;
  --destructive-foreground: #ffffff;

  /* Code block colors (preserve existing) */
  --code-bg: #f4f4f5;
  --code-text: #16a34a;
  --code-border: #e4e4e7;

  /* Ring color for focus states */
  --ring: #18181b;
}

@theme inline {
  /* Base colors */
  --color-background: var(--background);
  --color-foreground: var(--foreground);

  /* Muted */
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);

  /* Card */
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);

  /* Border */
  --color-border: var(--border);
  --color-input: var(--input);

  /* Accent */
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);

  /* Destructive */
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);

  /* Code */
  --color-code-bg: var(--code-bg);
  --color-code-text: var(--code-text);
  --color-code-border: var(--code-border);

  /* Ring */
  --color-ring: var(--ring);

  /* Fonts */
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
}

@media (prefers-color-scheme: dark) {
  :root {
    /* Base colors */
    --background: #09090b;
    --foreground: #fafafa;

    /* Muted */
    --muted: #27272a;
    --muted-foreground: #a1a1aa;

    /* Card */
    --card: #09090b;
    --card-foreground: #fafafa;

    /* Border */
    --border: #27272a;
    --input: #27272a;

    /* Accent */
    --accent: #22c55e;
    --accent-foreground: #09090b;

    /* Destructive */
    --destructive: #ef4444;
    --destructive-foreground: #fafafa;

    /* Code (preserve existing) */
    --code-bg: #18181b;
    --code-text: #4ade80;
    --code-border: #3f3f46;

    /* Ring */
    --ring: #d4d4d8;
  }
}
```

**Color Reference**:

| Variable | Light Mode | Dark Mode | Purpose |
|----------|------------|-----------|---------|
| background | #ffffff (white) | #09090b (zinc-950) | Main page background |
| foreground | #09090b (zinc-950) | #fafafa (zinc-50) | Main text color |
| muted | #f4f4f5 (zinc-100) | #27272a (zinc-800) | Secondary backgrounds |
| muted-foreground | #71717a (zinc-500) | #a1a1aa (zinc-400) | Secondary text |
| card | #ffffff (white) | #09090b (zinc-950) | Card backgrounds |
| card-foreground | #09090b (zinc-950) | #fafafa (zinc-50) | Card text |
| border | #e4e4e7 (zinc-200) | #27272a (zinc-800) | Border color |
| accent | #16a34a (green-600) | #22c55e (green-500) | Accent/links |
| destructive | #dc2626 (red-600) | #ef4444 (red-500) | Error states |
| code-bg | #f4f4f5 (zinc-100) | #18181b (zinc-900) | Code block background |
| code-text | #16a34a (green-600) | #4ade80 (green-400) | Code highlight color |

**Available Tailwind Utilities After This Change**:
- `bg-background`, `text-foreground`
- `bg-muted`, `text-muted-foreground`
- `bg-card`, `text-card-foreground`
- `border-border`, `border-input`
- `bg-accent`, `text-accent-foreground`
- `bg-destructive`, `text-destructive-foreground`
- `bg-code-bg`, `text-code-text`, `border-code-border`
- `ring-ring`

### Success Criteria:

#### Automated Verification:
- [x] `pnpm dev` runs without CSS errors
- [x] No warnings about invalid CSS variables
- [x] Browser DevTools shows all CSS variables defined in :root

#### Manual Verification:
- [x] Inspect element in browser shows --background, --foreground, --muted, etc. in :root
- [x] Toggle browser to dark mode (via DevTools) - all variables update
- [x] Existing CodeBlock component still renders with correct colors
- [x] Home page still displays correctly

---

## Phase 3: Configure Typography Plugin

### Overview
Configure the @tailwindcss/typography plugin for prose content styling in MDX blog posts. Set up dark mode prose variants and code block integration.

### Changes Required:

#### 1. Add Typography Configuration to Tailwind Config
**File**: `tailwind.config.ts`

**Changes**: Add typography plugin options for dark mode and code styling

**Replace**:
```typescript
import type { Config } from 'tailwindcss'

export default {
  darkMode: 'class',
  content: ['./app/**/*.{ts,tsx}'],
  plugins: [require('@tailwindcss/typography')],
} satisfies Config
```

**With**:
```typescript
import type { Config } from 'tailwindcss'

export default {
  darkMode: 'class',
  content: ['./app/**/*.{ts,tsx}'],
  plugins: [
    require('@tailwindcss/typography'),
  ],
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            '--tw-prose-body': 'var(--foreground)',
            '--tw-prose-headings': 'var(--foreground)',
            '--tw-prose-links': 'var(--accent)',
            '--tw-prose-code': 'var(--code-text)',
            '--tw-prose-pre-bg': 'var(--code-bg)',
            '--tw-prose-pre-code': 'var(--code-text)',
            '--tw-prose-quotes': 'var(--muted-foreground)',
            '--tw-prose-quote-borders': 'var(--border)',
          },
        },
      },
    },
  },
} satisfies Config
```

**Rationale**:
- Typography plugin uses its own CSS variable system (--tw-prose-*)
- We map prose variables to our theme variables for consistency
- This ensures MDX content matches the site's color scheme
- Dark mode will automatically work via our CSS variable updates

#### 2. Add Prose Dark Mode Support to globals.css
**File**: `app/globals.css`

**Changes**: Add dark mode prose variable overrides

**Add after the closing brace of `@media (prefers-color-scheme: dark)` block** (around line 90):

```css
/* Typography dark mode support */
.dark {
  --tw-prose-body: var(--foreground);
  --tw-prose-headings: var(--foreground);
  --tw-prose-links: var(--accent);
  --tw-prose-code: var(--code-text);
  --tw-prose-pre-bg: var(--code-bg);
  --tw-prose-pre-code: var(--code-text);
  --tw-prose-quotes: var(--muted-foreground);
  --tw-prose-quote-borders: var(--border);
}
```

**Note**: This ensures when next-themes adds `.dark` class to `<html>`, prose content updates correctly.

### Success Criteria:

#### Automated Verification:
- [x] TypeScript compiles without errors
- [x] `pnpm dev` runs without errors
- [x] No console warnings about typography configuration

#### Manual Verification:
- [x] Create test MDX content with headings, paragraphs, links, code blocks
- [x] Apply `prose` class to container: `<div className="prose">...</div>`
- [x] Verify prose content renders with correct spacing and typography
- [x] Toggle dark mode in browser - prose content updates to dark theme colors
- [x] Code blocks within prose use --code-bg and --code-text colors

---

## Phase 4: Verification & Testing

### Overview
Validate all changes work correctly in both light and dark modes, and that existing components are not broken.

### Testing Steps:

#### 1. Visual Verification
**Manual Testing**:
1. Start dev server: `pnpm dev`
2. Open http://localhost:3000 in browser
3. Open DevTools → Elements → Computed styles
4. Verify all CSS variables are defined in :root:
   - [x] --background, --foreground
   - [x] --muted, --muted-foreground
   - [x] --card, --card-foreground
   - [x] --border, --input
   - [x] --accent, --accent-foreground
   - [x] --destructive, --destructive-foreground
   - [x] --code-bg, --code-text, --code-border
   - [x] --ring

5. Toggle dark mode via browser DevTools (Rendering → Emulate: prefers-color-scheme: dark)
6. Verify all CSS variables update to dark values
7. Check existing components still render:
   - [x] CodeBlock component displays correctly
   - [x] Home page renders without errors
   - [x] No visual regressions

#### 2. Utility Class Testing
**Create test component** (temporary file for testing):

**File**: `app/test-theme/page.tsx`
```tsx
export default function TestTheme() {
  return (
    <div className="p-8 space-y-4">
      <div className="bg-background text-foreground p-4 border border-border">
        Background / Foreground
      </div>
      <div className="bg-muted text-muted-foreground p-4">
        Muted Background
      </div>
      <div className="bg-card text-card-foreground p-4 border border-border">
        Card
      </div>
      <div className="bg-accent text-accent-foreground p-4">
        Accent
      </div>
      <div className="bg-code-bg text-code-text p-4 border border-code-border font-mono">
        Code Block Colors
      </div>

      <div className="prose">
        <h1>Typography Test</h1>
        <p>This is a paragraph with <a href="#">a link</a> inside.</p>
        <pre><code>const test = "code block";</code></pre>
        <blockquote>This is a quote</blockquote>
      </div>
    </div>
  )
}
```

**Test**:
- [x] Visit http://localhost:3000/test-theme
- [x] All color blocks display correctly in light mode
- [x] Toggle to dark mode - all colors update appropriately
- [x] Typography prose content renders with correct spacing
- [x] Delete test file after verification: `rm app/test-theme/page.tsx`

#### 3. Build Verification
**Commands**:
```bash
pnpm build
```

**Verify**:
- [x] Build completes without errors
- [x] No PostCSS warnings
- [x] No Tailwind configuration errors
- [x] CSS bundle includes typography styles

#### 4. Type Checking (if available)
**Commands**:
```bash
npx tsc --noEmit
```

**Verify**:
- [x] No TypeScript errors in tailwind.config.ts
- [x] All type definitions resolve correctly

### Success Criteria:

#### Automated Verification:
- [x] `pnpm dev` starts successfully
- [x] `pnpm build` completes without errors
- [x] No TypeScript errors
- [x] No console warnings or errors

#### Manual Verification:
- [x] All new color utilities work: bg-background, text-foreground, bg-muted, etc.
- [x] Dark mode media query switches colors correctly
- [x] Existing components (CodeBlock, home page) render correctly
- [x] Typography prose class renders formatted content
- [x] No visual regressions in existing pages

---

## Testing Strategy

### Unit Tests:
Not applicable - this is a configuration change with no logic to test.

### Integration Tests:
Not applicable for this phase - component integration testing will occur in later stories (BLOG-003, MDX-004).

### Manual Testing Steps:
1. **Color Variable Test**: Inspect :root in DevTools, verify all 20+ variables exist
2. **Dark Mode Test**: Toggle prefers-color-scheme, verify variable values change
3. **Utility Class Test**: Create test component using new utilities, verify rendering
4. **Typography Test**: Apply prose class to formatted content, verify styling
5. **Regression Test**: Check CodeBlock and home page still work
6. **Build Test**: Run production build, verify no errors

---

## Performance Considerations

### CSS Bundle Size:
- Adding @tailwindcss/typography increases CSS bundle by ~8-10KB
- 15 new color variables (30 total with dark mode) adds ~2KB
- Impact: Minimal (acceptable for improved content rendering)

### Runtime Performance:
- CSS variables have negligible runtime cost
- No JavaScript overhead (pure CSS solution)
- Dark mode switching via media query is instant (no JS theme toggle yet)

### Build Performance:
- Typography plugin adds ~100-200ms to build time (acceptable)
- No impact on development hot reload speed

---

## Migration Notes

### Backwards Compatibility:
- **Existing components remain compatible**: CodeBlock still uses `bg-code-bg`, `text-code-text` - these utilities still work
- **New utilities available but optional**: Developers can start using `bg-muted`, `text-accent`, etc. as needed
- **No breaking changes**: This is purely additive

### Future Migrations:
- **FOUND-003**: Will add next-themes provider, enabling class-based dark mode (`.dark` class)
- **LAYOUT-003**: Will create ThemeToggle component using `useTheme()` hook
- **Component stories**: Will gradually adopt new color variables (bg-card, border-border, etc.)

### Rollback Plan:
If issues arise:
1. Revert `tailwind.config.ts` to original version
2. Revert `app/globals.css` to original version
3. Uninstall Typography: `pnpm remove @tailwindcss/typography`
4. Run `pnpm dev` to verify rollback successful

---

## Reference Documentation

### Files Modified:
- `/Users/kendalladkins/Desktop/me/programming/portfolio/tailwind.config.ts` (lines 1-22)
- `/Users/kendalladkins/Desktop/me/programming/portfolio/app/globals.css` (lines 3-90+)
- `/Users/kendalladkins/Desktop/me/programming/portfolio/package.json` (devDependencies)

### Files to Create (for testing):
- `app/test-theme/page.tsx` (temporary - delete after verification)

### Dependencies Added:
- `@tailwindcss/typography` (^0.5.x)

### Related Stories:
- **Prerequisite**: FOUND-001 (Next.js initialization) ✅ Complete
- **Depends on**: None
- **Enables**: FOUND-003 (next-themes), MDX-004 (MDX components), BLOG-003 (blog post rendering)

### External Resources:
- [Tailwind v4 Documentation](https://tailwindcss.com/docs/v4-beta)
- [@theme inline directive](https://tailwindcss.com/docs/v4-beta#using-css-variables)
- [Typography Plugin Docs](https://tailwindcss.com/docs/typography-plugin)
- [CSS Variables in Tailwind](https://tailwindcss.com/docs/customizing-colors#using-css-variables)
