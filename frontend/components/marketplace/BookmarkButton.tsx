'use client'

import { useState } from 'react'
import { Bookmark, BookmarkCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface BookmarkButtonProps {
  bookmarked: boolean
  onToggle?: () => void
}

export function BookmarkButton({ bookmarked: initialBookmarked, onToggle }: BookmarkButtonProps) {
  const [bookmarked, setBookmarked] = useState(initialBookmarked)

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setBookmarked(!bookmarked)
    onToggle?.()
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className={`h-8 w-8 ${bookmarked ? 'text-amber-500' : 'text-gray-300 hover:text-amber-400'}`}
      onClick={handleClick}
    >
      {bookmarked ? (
        <BookmarkCheck className="h-4 w-4 fill-current" />
      ) : (
        <Bookmark className="h-4 w-4" />
      )}
    </Button>
  )
}
