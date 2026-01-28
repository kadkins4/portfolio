import { cn } from '@/app/utils'

interface CodeBlockProps {
  children: React.ReactNode
  className?: string
}

export function CodeBlock({ children, className }: CodeBlockProps) {
  return (
    <pre
      className={cn(
        'bg-code-bg text-code-text p-4 rounded-lg font-mono text-sm overflow-x-auto border border-code-border',
        className
      )}
    >
      <code>{children}</code>
    </pre>
  )
}
