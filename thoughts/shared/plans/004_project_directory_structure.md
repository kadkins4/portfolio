# FOUND-005: Project Directory Structure - Implementation Plan

## Overview

Set up the standard project directory structure for components, lib, content, and public assets, including migrating existing components from `app/components/` to root-level `components/` following the architecture defined in CLAUDE.md.

## Current State Analysis

**What exists:**
- `app/components/` with 4 files:
  - `ThemeProvider.tsx` - next-themes wrapper component
  - `CodeBlock.tsx` - code display component
  - `SequentialTyping.tsx` - typing animation component
  - `TypingAnimation.tsx` - typing effect component
- `app/types/index.ts` - type definitions
- `app/utils.ts` - utility functions
- `app/test-theme/page.tsx` - theme testing page

**What's missing:**
- Root-level `components/` with subdirectories: ui, layout, blog, mdx, contact
- `lib/` directory for utilities
- `content/` with subdirectories: blog, projects, data
- `public/images/` directory structure

## Desired End State

```
portfolio/
├── components/
│   ├── ui/                   # Reusable UI components (Badge, ThemeToggle, etc.)
│   │   ├── ThemeProvider.tsx
│   │   ├── CodeBlock.tsx
│   │   ├── SequentialTyping.tsx
│   │   └── TypingAnimation.tsx
│   ├── layout/               # Header, Footer, Nav
│   ├── blog/                 # Blog-specific components
│   ├── mdx/                  # MDX rendering components
│   └── contact/              # Contact form components
├── lib/                      # Utilities (mdx, auth, db, email, github)
├── content/
│   ├── blog/                 # MDX blog posts
│   ├── projects/             # MDX project descriptions
│   └── data/                 # Static data (tech-badges.json, etc.)
├── public/
│   └── images/
│       ├── blog/             # Blog post images
│       ├── projects/         # Project screenshots
│       └── general/          # Site-wide images
└── app/
    ├── layout.tsx            # Updated imports
    ├── page.tsx              # Updated imports
    └── test-theme/page.tsx
```

## What We're NOT Doing

- Creating component implementations (that's future stories)
- Adding README files to directories
- Setting up index files with barrel exports (can be added later as needed)
- Moving `app/types/` - keeping Next.js-specific types in app/
- Moving `app/utils.ts` - will evaluate if it should move to `lib/` later

## Implementation Approach

This is a structural change with component migration:
1. Create all new directories
2. Move existing components to appropriate locations
3. Update all imports throughout the codebase
4. Clean up empty directories
5. Add `.gitkeep` files to keep empty directories in git

---

## Phase 1: Create New Directory Structure

### Overview

Create all the directories specified in FOUND-005 acceptance criteria.

### Changes Required:

#### 1. Create components subdirectories
**Action**: Create directories

```bash
mkdir -p components/ui
mkdir -p components/layout
mkdir -p components/blog
mkdir -p components/mdx
mkdir -p components/contact
```

#### 2. Create lib directory
**Action**: Create directory

```bash
mkdir -p lib
```

#### 3. Create content subdirectories
**Action**: Create directories

```bash
mkdir -p content/blog
mkdir -p content/projects
mkdir -p content/data
```

#### 4. Create public/images structure
**Action**: Create directories

```bash
mkdir -p public/images/blog
mkdir -p public/images/projects
mkdir -p public/images/general
```

### Success Criteria:

#### Automated Verification:
- [ ] All directories exist

---

## Phase 2: Move Existing Components

### Overview

Move existing components from `app/components/` to `components/ui/` since they are general-purpose UI components.

### Changes Required:

#### 1. Move ThemeProvider
**From**: `app/components/ThemeProvider.tsx`
**To**: `components/ui/ThemeProvider.tsx`

#### 2. Move CodeBlock
**From**: `app/components/CodeBlock.tsx`
**To**: `components/ui/CodeBlock.tsx`

#### 3. Move SequentialTyping
**From**: `app/components/SequentialTyping.tsx`
**To**: `components/ui/SequentialTyping.tsx`

#### 4. Move TypingAnimation
**From**: `app/components/TypingAnimation.tsx`
**To**: `components/ui/TypingAnimation.tsx`

### Success Criteria:

#### Automated Verification:
- [ ] All 4 files exist in `components/ui/`
- [ ] `app/components/` directory is empty (can be deleted)

---

## Phase 3: Update Imports

### Overview

Update all files that import from `app/components/` to use the new paths.

### Changes Required:

#### 1. Update app/layout.tsx
**File**: `app/layout.tsx`
**Change**: Update ThemeProvider import

```typescript
// Before
import { ThemeProvider } from './components/ThemeProvider'

// After
import { ThemeProvider } from '@/components/ui/ThemeProvider'
```

#### 2. Update app/page.tsx
**File**: `app/page.tsx`
**Change**: Update any component imports (SequentialTyping, etc.)

```typescript
// Before
import { SequentialTyping } from './components/SequentialTyping'

// After
import { SequentialTyping } from '@/components/ui/SequentialTyping'
```

#### 3. Update app/test-theme/page.tsx (if needed)
**File**: `app/test-theme/page.tsx`
**Change**: Update any component imports if present

### Success Criteria:

#### Automated Verification:
- [ ] TypeScript compiles: `pnpm build`
- [ ] Lint passes: `pnpm lint`
- [ ] Dev server starts: `pnpm dev`

#### Manual Verification:
- [ ] Homepage renders correctly at http://localhost:3000
- [ ] Theme toggle works (if visible)
- [ ] Typing animations work correctly

---

## Phase 4: Cleanup and Git Tracking

### Overview

Clean up old directories and ensure empty directories are tracked in git.

### Changes Required:

#### 1. Add .gitkeep files to empty directories
**Action**: Create placeholder files

Files to create:
- `components/layout/.gitkeep`
- `components/blog/.gitkeep`
- `components/mdx/.gitkeep`
- `components/contact/.gitkeep`
- `lib/.gitkeep`
- `content/blog/.gitkeep`
- `content/projects/.gitkeep`
- `content/data/.gitkeep`
- `public/images/blog/.gitkeep`
- `public/images/projects/.gitkeep`
- `public/images/general/.gitkeep`

#### 2. Remove old app/components directory
**Action**: Delete empty directory

```bash
rmdir app/components
```

### Success Criteria:

#### Automated Verification:
- [ ] `app/components/` directory no longer exists
- [ ] All `.gitkeep` files are created
- [ ] `git status` shows new directories are tracked

---

## Phase 5: Update TypeScript Configuration (if needed)

### Overview

Ensure the `@/` path alias works correctly for the new directories.

### Verification:

Check `tsconfig.json` for paths configuration:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

This should already be configured by Next.js. If imports with `@/components/...` don't work, we'll need to verify this setting.

### Success Criteria:

#### Automated Verification:
- [ ] Imports using `@/components/...` resolve correctly
- [ ] Imports using `@/lib/...` resolve correctly
- [ ] Imports using `@/content/...` resolve correctly

---

## Testing Strategy

### Automated:
- `pnpm build` - TypeScript compilation
- `pnpm lint` - ESLint passes
- `pnpm dev` - Dev server starts

### Manual Testing Steps:
1. Run `pnpm dev` and open http://localhost:3000
2. Verify homepage renders correctly with typing animations
3. Navigate to /test-theme to verify theme page works
4. Check browser console for any import errors
5. Verify directory structure matches the plan

---

## Performance Considerations

None - this is purely a structural change with no runtime impact.

## Migration Notes

If any other files import from `app/components/`, they will need to be updated. The main files to check are:
- `app/layout.tsx`
- `app/page.tsx`
- `app/test-theme/page.tsx`

## Rollback Plan

If issues occur:
1. Move files back from `components/ui/` to `app/components/`
2. Revert import changes in affected files
3. Delete the new empty directories

## Files Changed Summary

| Action | Path |
|--------|------|
| Create | `components/ui/` |
| Create | `components/layout/` |
| Create | `components/blog/` |
| Create | `components/mdx/` |
| Create | `components/contact/` |
| Create | `lib/` |
| Create | `content/blog/` |
| Create | `content/projects/` |
| Create | `content/data/` |
| Create | `public/images/blog/` |
| Create | `public/images/projects/` |
| Create | `public/images/general/` |
| Move | `app/components/ThemeProvider.tsx` → `components/ui/ThemeProvider.tsx` |
| Move | `app/components/CodeBlock.tsx` → `components/ui/CodeBlock.tsx` |
| Move | `app/components/SequentialTyping.tsx` → `components/ui/SequentialTyping.tsx` |
| Move | `app/components/TypingAnimation.tsx` → `components/ui/TypingAnimation.tsx` |
| Edit | `app/layout.tsx` - update imports |
| Edit | `app/page.tsx` - update imports |
| Delete | `app/components/` |
