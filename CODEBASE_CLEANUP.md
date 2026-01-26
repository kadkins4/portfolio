# Portfolio Codebase Cleanup Plan

## Summary

The project is in early stages with good foundational choices (Next.js 15, TypeScript strict, modern Tailwind). The main issues are:

- Components in wrong location (`app/components/` vs root `components/`)
- Code duplication in typing animation components
- Missing Tailwind config for custom theme
- Hardcoded styles instead of CSS variables
- Placeholder metadata in layout

## Recommended Changes

### 1. Reorganize Directory Structure

Move components to root level per the architecture in CLAUDE.md:

```
# Current                    # Target
app/                         app/
├── components/              ├── layout.tsx
│   ├── SequentialTyping.tsx ├── page.tsx
│   └── TypingAnimation.tsx  └── globals.css
├── layout.tsx               components/
├── page.tsx                 ├── ui/
└── globals.css              │   └── CodeBlock.tsx
                             ├── SequentialTyping.tsx
                             └── TypingAnimation.tsx
                             lib/
                             └── types/
                                 └── index.ts
```

**Files to modify:**

- Move `app/components/SequentialTyping.tsx` → `components/SequentialTyping.tsx`
- Move `app/components/TypingAnimation.tsx` → `components/TypingAnimation.tsx`
- Create `components/ui/CodeBlock.tsx` (extract duplicated code)
- Update imports in `app/page.tsx`

### 2. Extract CodeBlock Component

The code block rendering is duplicated 4 times across 2 components. Extract to a reusable component:

**Create:** `components/ui/CodeBlock.tsx`

```tsx
interface CodeBlockProps {
  children: React.ReactNode
  className?: string
}

export function CodeBlock({ children, className }: CodeBlockProps) {
  return (
    <pre
      className={cn(
        'bg-zinc-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto border border-zinc-700',
        className
      )}
    >
      <code>{children}</code>
    </pre>
  )
}
```

**Update:** Both typing components to use `<CodeBlock>` instead of inline `<pre><code>`

### 3. Add Tailwind Config

Create `tailwind.config.ts` to define semantic color tokens that can be themed:

```ts
import type { Config } from 'tailwindcss'

export default {
  darkMode: 'class',
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Semantic colors for theming
        code: {
          bg: 'var(--code-bg)',
          fg: 'var(--code-fg)',
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

**Update:** `globals.css` to define the CSS variables:

```css
:root {
  --code-bg: #18181b; /* zinc-900 */
  --code-fg: #4ade80; /* green-400 */
  --code-border: #3f3f46; /* zinc-700 */
}
```

### 4. Update Layout Metadata

**File:** `app/layout.tsx`

Replace placeholder metadata:

```tsx
export const metadata: Metadata = {
  title: {
    default: 'Kendall Adkins | Software Engineer',
    template: '%s | Kendall Adkins',
  },
  description: 'Personal portfolio and blog for kendalladkins.dev',
}
```

### 5. Add Utility Function

Create `lib/utils.ts` with `cn()` helper for conditional class merging:

```ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

**Dependency:** Add `clsx` and `tailwind-merge`

### 6. Create Types Directory

**Create:** `lib/types/index.ts`

Start with types for the existing components:

```ts
export interface TextItem {
  text: string
  isCode?: boolean
}
```

Move the `TextItem` interface from `SequentialTyping.tsx` to this central location.

---

## Implementation Order

1. Install dependencies: `pnpm add clsx tailwind-merge`
2. Create `tailwind.config.ts`
3. Update `globals.css` with CSS variables
4. Create `lib/utils.ts`
5. Create `lib/types/index.ts`
6. Create `components/ui/CodeBlock.tsx`
7. Move and refactor `SequentialTyping.tsx`
8. Move and refactor `TypingAnimation.tsx`
9. Update `app/page.tsx` imports
10. Update `app/layout.tsx` metadata

## Verification

After changes:

```bash
pnpm lint        # Should pass with no errors
pnpm build       # Should build successfully
pnpm dev         # Visual verification - homepage should look identical
```

## What This Does NOT Include (Intentionally)

- No pre-commit hooks (can add later when team grows)
- No CI/CD setup (add when deploying)
- No additional features or pages
- No over-abstraction of components
