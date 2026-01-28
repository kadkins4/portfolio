'use client'

import { useState, useEffect } from 'react'
import { CodeBlock } from '@/components/ui/CodeBlock'
import type { TextItem } from '@/app/types'

export type { TextItem }

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

    if (currentCharIndex < currentItem.text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + currentItem.text[currentCharIndex])
        setCurrentCharIndex((prev) => prev + 1)
      }, currentItem.speed ?? speed)

      return () => clearTimeout(timeout)
    }

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
        if (item.persist && index < currentItemIndex) {
          return (
            <div key={index}>
              {item.isCodeBlock ? (
                <CodeBlock className={item.className}>{item.text}</CodeBlock>
              ) : (
                <p className={item.className || 'text-center'}>
                  <em>{item.text}</em>
                </p>
              )}
            </div>
          )
        }

        if (index === currentItemIndex) {
          return (
            <div key={index}>
              {item.isCodeBlock ? (
                <CodeBlock className={item.className}>
                  {displayedText}
                  <span className="animate-pulse">▋</span>
                </CodeBlock>
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
