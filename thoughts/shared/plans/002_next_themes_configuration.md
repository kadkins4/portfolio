# next-themes Configuration Implementation Plan

## Overview

Install and configure `next-themes` to enable user-controlled dark/light mode switching with system preference detection and localStorage persistence. This implements FOUND-003 from the implementation stories.

## Current State Analysis

### What Exists:
- Tailwind CSS v4 configured with `darkMode: 'class'` (ready for class-based theme switching)
- Comprehensive CSS variables defined in `globals.css` for all UI colors
- Light mode values in `:root` and dark mode values in `@media (prefers-color-scheme: dark)`
- Typography plugin configured with dark mode prose variables
- Geist Sans and Geist Mono fonts loaded via Next.js Font Optimizer
- `cn()` utility function available for className composition

### Key Issues:
1. **No next-themes package installed** - cannot control theme via JavaScript
2. **Dark mode uses media query only** - `@media (prefers-color-scheme: dark)` doesn't support user preference override
3. **No ThemeProvider in layout** - layout.tsx renders children directly without any provider
4. **Missing hydration warning suppression** - required for next-themes to avoid React hydration mismatch

### Architecture Note:
The existing CSS variable system is well-designed. We need to:
1. Add `.dark` class-based selectors that mirror the media query values
2. Wrap the app in a ThemeProvider that adds/removes the `.dark` class on `<html>`
3. Let next-themes handle localStorage persistence and system preference detection

## Desired End State

### Success Criteria:
- [ ] `next-themes` package installed
- [ ] ThemeProvider component created as client component
- [ ] RootLayout wraps children with ThemeProvider
- [ ] `<html>` tag has `suppressHydrationWarning` attribute
- [ ] Dark mode works via `.dark` class (not just media query)
- [ ] Theme preference persists in localStorage
- [ ] System preference detection works when theme is set to "system"
- [ ] Default theme is "dark" per PORTFOLIO_PLAN.md requirements
- [ ] No hydration warnings in console
- [ ] Dev server runs without errors
- [ ] Build completes successfully

## What We're NOT Doing

- ❌ Not creating ThemeToggle UI component (that's a separate story - LAYOUT-003)
- ❌ Not adding smooth transition animations between themes (can be added later)
- ❌ Not implementing sepia or high-contrast themes (V2 feature per plan)
- ❌ Not modifying existing components to be theme-aware (they already use CSS variables)
- ❌ Not adding theme to URL or cookies (localStorage is sufficient)

## Implementation Approach

**Strategy**: Install next-themes and create a minimal ThemeProvider wrapper. Update CSS to use both `.dark` class and media query (for no-JS fallback). Configure next-themes with `attribute="class"`, `defaultTheme="dark"`, and `enableSystem`.

**Why both `.dark` class AND media query?**
- `.dark` class: Enables user preference override via next-themes
- Media query: Provides correct initial theme before JavaScript loads (prevents flash)

---

## Phase 1: Install Dependencies

### Overview
Install the next-themes package.

### Changes Required:

#### 1. Install next-themes
**Command**:
```bash
pnpm add next-themes
```

**Verification**: Check `package.json` dependencies includes `"next-themes": "^0.4.x"` (or latest)

### Success Criteria:

#### Automated Verification:
- [ ] `pnpm install` completes successfully
- [ ] `next-themes` appears in `package.json` dependencies
- [ ] No peer dependency warnings

---

## Phase 2: Create ThemeProvider Component

### Overview
Create a client component wrapper for next-themes' ThemeProvider to be used in the root layout.

### Changes Required:

#### 1. Create ThemeProvider Component
**File**: `app/components/ThemeProvider.tsx`

**Create new file**:
```tsx
'use client'

import { ThemeProvider as NextThemesProvider } from 'next-themes'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  )
}
```

**Configuration Explanation**:
| Option | Value | Purpose |
|--------|-------|---------|
| `attribute` | `"class"` | Adds theme as class on `<html>` (e.g., `class="dark"`) - matches Tailwind's `darkMode: 'class'` |
| `defaultTheme` | `"dark"` | Sets dark as default per PORTFOLIO_PLAN.md (developer-focused aesthetic) |
| `enableSystem` | `true` | Respects `prefers-color-scheme` when user hasn't explicitly chosen |
| `disableTransitionOnChange` | `true` | Prevents flash during theme change; smoother transitions can be added later |

### Success Criteria:

#### Automated Verification:
- [ ] File exists at `app/components/ThemeProvider.tsx`
- [ ] TypeScript compiles without errors
- [ ] No ESLint errors

---

## Phase 3: Update Root Layout

### Overview
Modify the root layout to wrap children with ThemeProvider and add `suppressHydrationWarning` to the `<html>` tag.

### Changes Required:

#### 1. Update layout.tsx
**File**: `app/layout.tsx`

**Current** (lines 23-37):
```tsx
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  )
}
```

**New** (replace lines 1-37):
```tsx
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { ThemeProvider } from './components/ThemeProvider'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: {
    default: 'Kendall Adkins | Software Engineer',
    template: '%s | Kendall Adkins',
  },
  description: 'Personal portfolio and blog for kendalladkins.dev',
}

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

**Changes Made**:
1. Added import for `ThemeProvider`
2. Added `suppressHydrationWarning` to `<html>` tag
3. Wrapped `{children}` with `<ThemeProvider>`

**Why `suppressHydrationWarning`?**
next-themes modifies the `<html>` element's class attribute on the client after reading from localStorage. Without this attribute, React would warn about hydration mismatch since the server-rendered HTML doesn't know the user's theme preference.

### Success Criteria:

#### Automated Verification:
- [ ] TypeScript compiles without errors
- [ ] `pnpm dev` starts without errors
- [ ] No console errors about missing imports

---

## Phase 4: Update CSS for Class-Based Dark Mode

### Overview
Add `.dark` class selectors to CSS that mirror the existing media query dark mode values. This enables next-themes to control the theme while preserving the media query for no-JS fallback.

### Changes Required:

#### 1. Update globals.css
**File**: `app/globals.css`

**Add AFTER the `@media (prefers-color-scheme: dark)` block** (after line 109):

```css
/* Class-based dark mode for next-themes */
.dark {
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

  /* Code */
  --code-bg: #18181b;
  --code-text: #4ade80;
  --code-border: #3f3f46;

  /* Ring */
  --ring: #d4d4d8;
}
```

**Also add `.light` class for explicit light mode** (after the `.dark` block):

```css
/* Class-based light mode for next-themes */
.light {
  /* Base colors */
  --background: #ffffff;
  --foreground: #09090b;

  /* Muted */
  --muted: #f4f4f5;
  --muted-foreground: #71717a;

  /* Card */
  --card: #ffffff;
  --card-foreground: #09090b;

  /* Border */
  --border: #e4e4e7;
  --input: #e4e4e7;

  /* Accent */
  --accent: #16a34a;
  --accent-foreground: #ffffff;

  /* Destructive */
  --destructive: #dc2626;
  --destructive-foreground: #ffffff;

  /* Code */
  --code-bg: #f4f4f5;
  --code-text: #16a34a;
  --code-border: #e4e4e7;

  /* Ring */
  --ring: #18181b;
}
```

**Update the existing `.dark` typography block** to include all prose variables (line 112-121 already exists, verify it's complete).

**Final globals.css structure**:
```
Lines 1-35:     :root (light mode defaults)
Lines 37-73:    @theme inline (Tailwind v4 integration)
Lines 75-109:   @media (prefers-color-scheme: dark) - no-JS fallback
Lines 111-121:  .dark typography variables (existing)
Lines 122+:     .dark class (all variables) - NEW
Lines XXX+:     .light class (all variables) - NEW
Lines XXX+:     body styles
```

### Success Criteria:

#### Automated Verification:
- [ ] No CSS syntax errors
- [ ] `pnpm dev` runs without PostCSS errors
- [ ] Browser DevTools shows `.dark` and `.light` rules

#### Manual Verification:
- [ ] Inspect `<html>` element - should have `class="dark"` by default
- [ ] All CSS variables update when class changes

---

## Phase 5: Verification & Testing

### Overview
Validate that next-themes is working correctly and the theme system functions as expected.

### Testing Steps:

#### 1. Basic Functionality Test
**Manual Testing**:
1. Start dev server: `pnpm dev`
2. Open http://localhost:3000 in browser
3. Open DevTools → Elements tab
4. Verify `<html>` has `class="dark"` (default theme)
5. All components should render in dark mode colors

#### 2. Console Check
**Verify no errors**:
- [ ] No "Hydration mismatch" warnings
- [ ] No "Text content does not match" errors
- [ ] No errors about ThemeProvider or next-themes

#### 3. localStorage Persistence Test
**Steps**:
1. Open DevTools → Application → Local Storage
2. Look for `theme` key
3. Should show `"dark"` (or `"system"` depending on implementation)
4. Value persists across page refreshes

#### 4. Theme Switching Test (via DevTools)
Since we're not building the toggle UI in this story, test via console:
```javascript
// In browser DevTools console:
localStorage.setItem('theme', 'light')
location.reload()
// Page should reload in light mode
// html element should have class="light"

localStorage.setItem('theme', 'dark')
location.reload()
// Page should reload in dark mode
// html element should have class="dark"

localStorage.setItem('theme', 'system')
location.reload()
// Should follow browser preference
```

#### 5. System Preference Test
**Steps**:
1. Set theme to "system" via localStorage
2. In DevTools → Rendering → Emulate CSS media feature `prefers-color-scheme`
3. Toggle between "dark" and "light"
4. Page should update to match (may require refresh)

#### 6. No-JS Fallback Test
**Steps**:
1. In DevTools → Settings → Debugger → Disable JavaScript
2. Refresh page
3. Theme should match browser's `prefers-color-scheme` preference
4. Re-enable JavaScript

#### 7. Build Test
**Commands**:
```bash
pnpm build
pnpm start
```

**Verify**:
- [ ] Build completes without errors
- [ ] Production server starts
- [ ] Theme works correctly in production mode

### Success Criteria:

#### Automated Verification:
- [ ] `pnpm dev` starts successfully
- [ ] `pnpm build` completes without errors
- [ ] No TypeScript errors
- [ ] No console errors or warnings related to hydration

#### Manual Verification:
- [ ] Default theme is dark
- [ ] `<html>` element has correct class (`dark` or `light`)
- [ ] Theme persists in localStorage
- [ ] System preference detection works
- [ ] No flash of wrong theme on page load
- [ ] Existing components render correctly (CodeBlock, home page)

---

## Testing Strategy

### Unit Tests:
Not applicable - this is primarily configuration with no testable logic.

### Integration Tests:
Recommend adding E2E test in future story:
```typescript
// Example Playwright test (not part of this story)
test('theme switching works', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('html')).toHaveClass(/dark/)

  await page.evaluate(() => localStorage.setItem('theme', 'light'))
  await page.reload()
  await expect(page.locator('html')).toHaveClass(/light/)
})
```

### Manual Testing Steps:
1. **Default State**: Verify dark mode loads by default
2. **Persistence**: Manually set theme via localStorage, refresh, verify it persists
3. **System Detection**: Set to "system", change browser preference, verify detection
4. **No Flash**: Hard refresh (Cmd+Shift+R), verify no flash of wrong theme
5. **Regression**: Verify existing pages/components still render correctly

---

## Performance Considerations

### Bundle Size:
- next-themes adds ~3KB gzipped to client bundle
- Minimal impact on page load performance

### Flash of Incorrect Theme (FOIT):
The media query fallback (`@media (prefers-color-scheme: dark)`) ensures users see the correct theme even before JavaScript loads, preventing the dreaded "flash of white" on dark mode sites.

### Build Performance:
- No impact on build time
- ThemeProvider is a thin wrapper

---

## Migration Notes

### Backwards Compatibility:
- All existing components continue to work unchanged (they use CSS variables)
- No breaking changes to component APIs
- Theme toggle UI can be added independently

### Future Enhancements (not part of this story):
1. **LAYOUT-003**: Create ThemeToggle component with `useTheme()` hook
2. **V2**: Add sepia and high-contrast themes
3. **V2**: Add smooth transition animations
4. **V2**: Consider `enableColorScheme` for native form controls

### Rollback Plan:
If issues arise:
1. Remove ThemeProvider wrapper from `layout.tsx`
2. Remove `suppressHydrationWarning` from `<html>`
3. Delete `app/components/ThemeProvider.tsx`
4. Remove `.dark` and `.light` class blocks from `globals.css`
5. Uninstall: `pnpm remove next-themes`
6. Run `pnpm dev` to verify rollback successful

---

## Files Modified

### Files to Create:
- `app/components/ThemeProvider.tsx`

### Files to Modify:
- `app/layout.tsx` (add import, suppressHydrationWarning, ThemeProvider wrapper)
- `app/globals.css` (add .dark and .light class blocks)
- `package.json` (next-themes dependency added automatically by pnpm)

### Dependencies Added:
- `next-themes` (^0.4.x or latest)

### Related Stories:
- **Prerequisite**: FOUND-001 (Next.js initialization) ✅ Complete
- **Prerequisite**: FOUND-002 (Tailwind configuration) ✅ Complete
- **Depends on**: None (this story)
- **Enables**: LAYOUT-003 (ThemeToggle component), all future UI work

### External Resources:
- [next-themes GitHub](https://github.com/pacocoursey/next-themes)
- [next-themes Documentation](https://github.com/pacocoursey/next-themes#readme)
- [Tailwind Dark Mode Docs](https://tailwindcss.com/docs/dark-mode)
- [Next.js App Router with next-themes](https://github.com/pacocoursey/next-themes#with-app)
