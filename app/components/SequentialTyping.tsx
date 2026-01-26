'use client'

import { useState, useEffect } from 'react'

export interface TextItem {
  text: string
  className?: string
  isCodeBlock?: boolean
  persist?: boolean
  speed?: number
  pauseBetween?: number
}

interface SequentialTypingProps {
  items: TextItem[]
  speed?: number
  pauseBetween?: number
}

export default function SequentialTyping({
  items,
  speed = 75,
  pauseBetween = 500,
}: SequentialTypingProps) {
  const [currentItemIndex, setCurrentItemIndex] = useState(0)
  const [displayedText, setDisplayedText] = useState('')
  const [currentCharIndex, setCurrentCharIndex] = useState(0)

  const currentItem = items[currentItemIndex]
  const isComplete =
    currentItemIndex === items.length - 1 &&
    currentCharIndex === currentItem?.text.length

  useEffect(() => {
    if (!currentItem) {
      return
    }

    // Typing animation for current item
    if (currentCharIndex < currentItem.text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + currentItem.text[currentCharIndex])
        setCurrentCharIndex((prev) => prev + 1)
      }, currentItem.speed ?? speed)

      return () => clearTimeout(timeout)
    }

    // Current item complete, move to next
    if (
      currentCharIndex === currentItem.text.length &&
      currentItemIndex < items.length - 1
    ) {
      const timeout = setTimeout(() => {
        setCurrentItemIndex((prev) => prev + 1)
        setDisplayedText('')
        setCurrentCharIndex(0)
      }, currentItem.pauseBetween ?? pauseBetween)

      return () => clearTimeout(timeout)
    }
  }, [
    currentCharIndex,
    currentItemIndex,
    currentItem,
    items.length,
    speed,
    pauseBetween,
  ])

  return (
    <>
      {items.map((item, index) => {
        // Only show items that should persist and have been completed
        if (item.persist && index < currentItemIndex) {
          return (
            <div key={index}>
              {item.isCodeBlock ? (
                <pre className="bg-zinc-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto border border-zinc-700">
                  <code>{item.text}</code>
                </pre>
              ) : (
                <p className={item.className || 'text-center'}>
                  <em>{item.text}</em>
                </p>
              )}
            </div>
          )
        }

        // Show currently typing item
        if (index === currentItemIndex) {
          return (
            <div key={index}>
              {item.isCodeBlock ? (
                <pre className="bg-zinc-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto border border-zinc-700">
                  <code>
                    {displayedText}
                    <span className="animate-pulse">▋</span>
                  </code>
                </pre>
              ) : (
                <p className={item.className || 'text-center'}>
                  <em>
                    {displayedText}
                    {!isComplete && <span className="animate-pulse">▋</span>}
                  </em>
                </p>
              )}
            </div>
          )
        }

        return null
      })}
    </>
  )
}
