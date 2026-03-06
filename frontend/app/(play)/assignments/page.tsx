// S-10 학생 과제 목록 (Member 전용)
// 스펙: docs/screens/phase2-assignment.md#s-10

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { differenceInDays, isPast, formatDistanceToNow } from 'date-fns'
import { ko } from 'date-fns/locale'
import { AssignmentCard, AssignmentCardSkeleton } from '@/components/play/AssignmentCard'
import { EmptyState } from '@/components/common/EmptyState'
import type { Session, ParticipantResult } from '@/types'

// 과제 목록 API 응답 타입 (세션 + 본인 결과 포함)
interface AssignmentItem {
  session: Session
  myResult: ParticipantResult | null
}

type AssignmentGroup = 'in_progress' | 'pending' | 'submitted' | 'expired'

function getGroup(item: AssignmentItem): AssignmentGroup {
  const { session, myResult } = item

  if (myResult?.status === 'submitted') return 'submitted'

  // 마감됐으면
  if (session.close_at && isPast(new Date(session.close_at))) return 'expired'

  if (myResult?.status === 'in_progress') return 'in_progress'

  return 'pending'
}

export default function AssignmentsPage() {
  const router = useRouter()
  const [items, setItems] = useState<AssignmentItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // TODO: 실제 API 연결
    fetch('/api/assignments')
      .then((r) => r.json())
      .then(setItems)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const grouped: Record<AssignmentGroup, AssignmentItem[]> = {
    in_progress: [],
    pending: [],
    submitted: [],
    expired: [],
  }
  items.forEach((item) => grouped[getGroup(item)].push(item))

  const sections: { key: AssignmentGroup; label: string }[] = [
    { key: 'in_progress', label: '진행 중' },
    { key: 'pending', label: '대기 중' },
    { key: 'submitted', label: '제출 완료' },
    { key: 'expired', label: '마감됨 (미제출)' },
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6 space-y-6">
        <h1 className="text-xl font-bold">내 과제 목록</h1>
        {[...Array(3)].map((_, i) => (
          <AssignmentCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  const hasAny = items.length > 0

  return (
    <div className="min-h-screen bg-gray-900 text-white px-4 py-6 space-y-8 max-w-lg mx-auto">
      <h1 className="text-xl font-bold">내 과제 목록</h1>

      {!hasAny && (
        <EmptyState
          icon="📋"
          title="아직 배정된 과제가 없어요"
          description="선생님이 과제를 배포하면 여기서 확인할 수 있습니다."
        />
      )}

      {sections.map(({ key, label }) => {
        const list = grouped[key]
        if (list.length === 0) return null
        return (
          <section key={key} className="space-y-3">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">
              {label} ({list.length})
            </h2>
            {list.map((item) => (
              <AssignmentCard
                key={item.session.session_id}
                session={item.session}
                myResult={item.myResult}
                group={key}
                onAction={() => router.push(`/play/${item.session.session_id}`)}
                onResult={() => router.push(`/result/${item.session.session_id}`)}
              />
            ))}
          </section>
        )
      })}
    </div>
  )
}
