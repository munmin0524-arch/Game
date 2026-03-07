// 크리에이터 프로필

'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Heart, Download, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CertifiedBadge } from '@/components/marketplace/CertifiedBadge'
import { FollowButton } from '@/components/marketplace/FollowButton'
import { SharedSetCard, SharedSetCardSkeleton } from '@/components/marketplace/SharedSetCard'
import type { CreatorProfile, SharedSet } from '@/types'

interface PageProps {
  params: Promise<{ memberId: string }>
}

export default function CreatorProfilePage({ params }: PageProps) {
  const { memberId } = use(params)
  const router = useRouter()
  const [profile, setProfile] = useState<CreatorProfile | null>(null)
  const [sets, setSets] = useState<SharedSet[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/marketplace/creator/${memberId}`)
      .then((res) => res.json())
      .then((data) => {
        setProfile(data.profile)
        setSets(data.sets ?? [])
      })
      .finally(() => setLoading(false))
  }, [memberId])

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-8 space-y-6">
        <div className="h-32 bg-gray-100 rounded-2xl animate-pulse" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <SharedSetCardSkeleton key={i} />
          ))}
        </div>
      </div>
    )
  }

  if (!profile) return null

  return (
    <div className="mx-auto max-w-4xl px-6 py-8 space-y-8">
      <Button variant="ghost" size="sm" className="-ml-2 text-gray-500" onClick={() => router.back()}>
        <ArrowLeft className="h-4 w-4 mr-1" />
        뒤로
      </Button>

      {/* 프로필 헤더 */}
      <div className="rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
        <div className="flex items-start gap-4">
          <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-2xl font-bold shrink-0">
            {profile.nickname[0]}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-gray-900">{profile.nickname}</h1>
              {profile.is_certified && <CertifiedBadge size="md" />}
            </div>
            {profile.bio && (
              <p className="text-sm text-gray-600 mt-1">{profile.bio}</p>
            )}
            <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Heart className="h-3.5 w-3.5" />
                {profile.total_likes}
              </span>
              <span className="flex items-center gap-1">
                <Download className="h-3.5 w-3.5" />
                {profile.total_downloads}
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5" />
                팔로워 {profile.follower_count}
              </span>
            </div>
          </div>
          <FollowButton
            following={profile.is_following ?? false}
            followerCount={profile.follower_count}
          />
        </div>
      </div>

      {/* 공유한 퀴즈 */}
      <section>
        <h2 className="text-lg font-bold text-gray-900 mb-4">
          공유한 퀴즈 ({profile.shared_count})
        </h2>
        {sets.length === 0 ? (
          <p className="text-center py-8 text-gray-400 text-sm">아직 공유한 퀴즈가 없습니다.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {sets.map((s) => (
              <SharedSetCard key={s.shared_set_id} sharedSet={s} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
