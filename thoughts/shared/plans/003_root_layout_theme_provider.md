# FOUND-004: Root Layout with Theme Provider - Implementation Plan

## Overview

Complete the root layout implementation by fixing font application and verifying all acceptance criteria are met.

## Current State Analysis

**What's already implemented:**
- `app/layout.tsx` exists with ThemeProvider wrapping children
- Metadata configured with title template and description
- Geist fonts loaded via Next.js font optimization
- `suppressHydrationWarning` on html element
- ThemeProvider configured correctly in `app/components/ThemeProvider.tsx`

**Issue discovered:**
- In `globals.css` line 194, the body has `font-family: Arial, Helvetica, sans-serif;`
- This overrides the Geist fonts that are properly loaded and configured as CSS variables
- The fonts are loaded but never actually applied to the page

## Desired End State

- Geist Sans font is applied as the default body font
- Geist Mono font is available via `font-mono` class
- All theme colors work correctly with dark/light mode
- No hydration mismatch errors
- Build passes without warnings

## What We're NOT Doing

- Adding any new features beyond what FOUND-004 requires
- Changing the theme color scheme
- Adding header/footer components (that's LAYOUT-001/002)
- Adding a theme toggle component (that's LAYOUT-003)

## Implementation Approach

This is a minimal fix to complete the already mostly-implemented story.

## Phase 1: Fix Font Application

### Overview

Fix the CSS to properly apply Geist fonts instead of Arial.

### Changes Required:

#### 1. Update globals.css body style
**File**: `app/globals.css`
**Changes**: Update the body font-family to use the CSS variable

```css
body {
  background: var(--background);
  color: var(--foreground);
  font-family: var(--font-sans), ui-sans-serif, system-ui, sans-serif;
}
```

### Success Criteria:

#### Automated Verification:
- [x] Build passes: `pnpm build`
- [x] Lint passes: `pnpm lint`

#### Manual Verification:
- [ ] Open http://localhost:3000 - fonts should look distinctly different from Arial
- [ ] Open http://localhost:3000/test-theme - all theme colors display correctly
- [ ] Toggle system dark/light mode - theme should respond appropriately
- [ ] Check browser DevTools - body should show Geist font family
- [ ] No hydration warnings in console

---

## Phase 2: Verify Complete Implementation

### Overview

Confirm all FOUND-004 acceptance criteria are met and mark story complete.

### Verification Checklist:

| Criterion | Status | Notes |
|-----------|--------|-------|
| `app/layout.tsx` wraps children with ThemeProvider | ✓ | Already implemented |
| Metadata configured (title, description) | ✓ | Title template + description present |
| Font loading optimized | ✓ | After Phase 1 fix |
| Suppress hydration warning on html element | ✓ | Already implemented |

### Changes Required:

#### 1. Update IMPLEMENTATION_STORIES.md
**File**: `IMPLEMENTATION_STORIES.md`
**Changes**: Check off FOUND-004 acceptance criteria

```markdown
### FOUND-004: Create Root Layout with Theme Provider

**Description**: Build the root layout component with theme support and metadata.

**Acceptance Criteria**:

- [x] `app/layout.tsx` wraps children with ThemeProvider
- [x] Metadata configured (title, description)
- [x] Font loading optimized
- [x] Suppress hydration warning on html element
```

### Success Criteria:

#### Manual Verification:
- [x] All 4 acceptance criteria are checked in IMPLEMENTATION_STORIES.md
- [x] Review confirms implementation matches plan requirements

---

## Testing Strategy

### Manual Testing Steps:

1. Run `pnpm dev` and open http://localhost:3000
2. Inspect body element in DevTools - confirm font-family includes "Geist"
3. Navigate to /test-theme page
4. Verify all color boxes render with correct colors
5. Toggle system theme (if possible) or manually test both themes
6. Check console for any hydration warnings
7. Run `pnpm build` to confirm production build succeeds

## Performance Considerations

None - this is a CSS fix with no runtime impact.

## Migration Notes

None - no breaking changes.

## Estimated Complexity

**Low** - Single line CSS change + documentation update.
