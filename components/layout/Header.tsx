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
          <div className="ml-2">{/* <ThemeToggle /> */}</div>
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
