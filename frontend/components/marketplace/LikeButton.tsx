// LikeButton — 좋아요 토글 버튼
// S-M03 세트지 상세에서 사용

'use client'

import { useState } from 'react'
import { Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface LikeButtonProps {
  liked: boolean
  likeCount: number
  onToggle?: () => void
}

export function LikeButton({ liked: initialLiked, likeCount: initialCount, onToggle }: LikeButtonProps) {
  const [liked, setLiked] = useState(initialLiked)
  const [count, setCount] = useState(initialCount)

  const handleToggle = () => {
    setLiked((prev) => !prev)
    setCount((prev) => (liked ? prev - 1 : prev + 1))
    onToggle?.()
    // TODO: marketplaceApi.toggleLike() 호출
  }

  return (
    <Button
      variant={liked ? 'default' : 'outline'}
      size="sm"
      className={`gap-1.5 rounded-full ${liked ? 'bg-rose-500 hover:bg-rose-600 border-rose-500' : ''}`}
      onClick={handleToggle}
    >
      <Heart className={`h-4 w-4 ${liked ? 'fill-white' : ''}`} />
      {count}
    </Button>
  )
}
