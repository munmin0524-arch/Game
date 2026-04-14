'use client'

import { QuizCard, QuizCardSkeleton } from '@/components/common/QuizCard'
import { EmptyState } from '@/components/common/EmptyState'
import type { QuestionSet } from '@/types'
import type { SetBadgeKind } from '@/components/common/SetBadge'

function badgesFor(s: QuestionSet): SetBadgeKind[] {
  const out: SetBadgeKind[] = []
  if (s.is_official) out.push('official')
  if (s.is_new) out.push('new')
  if ((s.play_count ?? 0) >= 500) out.push('hot')
  return out
}

export function SetsHubGrid({
  sets,
  loading,
  seenIds,
  isMineSection,
  onPreview,
  onQuickStart,
  onEdit,
  onDuplicate,
  onShare,
  onDelete,
  onGameOpen,
  emptyTitle,
  emptyDescription,
}: {
  sets: QuestionSet[]
  loading: boolean
  seenIds: Set<string>
  isMineSection: boolean
  onPreview: (setId: string) => void
  onQuickStart: (setId: string) => void
  onEdit?: (setId: string) => void
  onDuplicate?: (setId: string) => void
  onShare?: (s: QuestionSet) => void
  onDelete?: (setId: string) => void
  onGameOpen?: (setId: string) => void
  emptyTitle: string
  emptyDescription: string
}) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => <QuizCardSkeleton key={i} />)}
      </div>
    )
  }

  if (sets.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {sets.map((s) => (
        <QuizCard
          key={s.set_id}
          id={s.set_id}
          title={s.title}
          questionCount={s.question_count ?? 0}
          subject={s.subject}
          grade={s.grade}
          textbook={s.textbook}
          theme={s.theme}
          difficulty={s.difficulty}
          playCount={s.play_count}
          avgRating={s.rating_avg}
          badges={badgesFor(s)}
          thumbnailVariant={s.thumbnail_variant}
          hostNickname={s.source === 'community' ? s.host_nickname : undefined}
          isCertified={s.is_certified}
          likeCount={s.like_count}
          downloadCount={s.download_count}
          seen={seenIds.has(s.set_id)}
          overlayMode="hover"
          showActions={isMineSection && s.source === 'mine'}
          onClick={() => onPreview(s.set_id)}
          onPreview={() => onPreview(s.set_id)}
          onQuickStart={() => onQuickStart(s.set_id)}
          onEdit={s.source === 'mine' ? () => onEdit?.(s.set_id) : undefined}
          onDuplicate={s.source === 'mine' ? () => onDuplicate?.(s.set_id) : undefined}
          onGameOpen={s.source === 'mine' ? () => onGameOpen?.(s.set_id) : undefined}
          onShare={s.source === 'mine' ? () => onShare?.(s) : undefined}
          onDelete={s.source === 'mine' ? () => onDelete?.(s.set_id) : undefined}
        />
      ))}
    </div>
  )
}
