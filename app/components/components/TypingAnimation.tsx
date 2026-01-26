'use client'

import { useState, useEffect } from 'react'
import { CodeBlock } from '@/app/components/ui/CodeBlock'

interface TypingAnimationProps {
  text: string
  speed?: number
}

export default function TypingAnimation({
  text,
  speed = 75,
}: TypingAnimationProps) {
  const [displayedText, setDisplayedText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex])
        setCurrentIndex((prev) => prev + 1)
      }, speed)

      return () => clearTimeout(timeout)
    }
  }, [currentIndex, text, speed])

  return (
    <CodeBlock>
      {displayedText}
      <span className="animate-pulse">▋</span>
    </CodeBlock>
  )
}
