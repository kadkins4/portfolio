import type { Config } from 'tailwindcss'
import typography from '@tailwindcss/typography'

export default {
  darkMode: 'class',
  content: ['./app/**/*.{ts,tsx}'],
  plugins: [typography],
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
