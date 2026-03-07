'use client'

import { Star } from 'lucide-react'
import { useState } from 'react'

interface StarRatingProps {
  rating: number
  size?: 'sm' | 'md'
  interactive?: boolean
  onRate?: (rating: number) => void
}

export function StarRating({ rating, size = 'sm', interactive = false, onRate }: StarRatingProps) {
  const [hovered, setHovered] = useState(0)
  const sizeClass = size === 'sm' ? 'h-3.5 w-3.5' : 'h-5 w-5'
  const displayRating = hovered || rating

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= Math.round(displayRating)
        return (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
            onClick={() => interactive && onRate?.(star)}
            onMouseEnter={() => interactive && setHovered(star)}
            onMouseLeave={() => interactive && setHovered(0)}
          >
            <Star
              className={`${sizeClass} ${
                filled
                  ? 'text-amber-400 fill-amber-400'
                  : 'text-gray-200'
              }`}
            />
          </button>
        )
      })}
    </div>
  )
}
