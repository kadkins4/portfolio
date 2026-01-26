'use client'

import { useState, useEffect } from 'react'

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
    <pre className="bg-zinc-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto border border-zinc-700">
      <code>
        {displayedText}
        <span className="animate-pulse">▋</span>
      </code>
    </pre>
  )
}
