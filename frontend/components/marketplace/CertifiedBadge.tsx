'use client'

import { BadgeCheck } from 'lucide-react'

interface CertifiedBadgeProps {
  size?: 'sm' | 'md'
}

export function CertifiedBadge({ size = 'sm' }: CertifiedBadgeProps) {
  const sizeClass = size === 'sm' ? 'h-3.5 w-3.5' : 'h-4.5 w-4.5'
  return (
    <BadgeCheck
      className={`${sizeClass} text-blue-500 fill-blue-500 stroke-white inline-block`}
      aria-label="인증 교사"
    />
  )
}
