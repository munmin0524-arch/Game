'use client'

import { useState } from 'react'
import { UserPlus, UserCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface FollowButtonProps {
  following: boolean
  followerCount: number
  onToggle?: () => void
}

export function FollowButton({ following: initialFollowing, followerCount: initialCount, onToggle }: FollowButtonProps) {
  const [following, setFollowing] = useState(initialFollowing)
  const [count, setCount] = useState(initialCount)

  const handleClick = () => {
    setFollowing(!following)
    setCount((c) => following ? c - 1 : c + 1)
    onToggle?.()
  }

  return (
    <Button
      variant={following ? 'secondary' : 'default'}
      size="sm"
      onClick={handleClick}
      className="gap-1.5"
    >
      {following ? (
        <>
          <UserCheck className="h-4 w-4" />
          팔로잉
        </>
      ) : (
        <>
          <UserPlus className="h-4 w-4" />
          팔로우
        </>
      )}
      <span className="text-xs opacity-70">{count}</span>
    </Button>
  )
}
