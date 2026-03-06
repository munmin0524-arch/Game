// AssignmentCard — 과제 목록 카드 (S-10)
// 상태별 UI: 진행 중 / 대기 중 / 제출 완료 / 마감됨

'use client'

import { differenceInDays, isPast } from 'date-fns'
import { ClipboardList } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { Session, ParticipantResult } from '@/types'

type AssignmentGroup = 'in_progress' | 'pending' | 'submitted' | 'expired'

interface AssignmentCardProps {
  session: Session
  myResult: ParticipantResult | null
  group: AssignmentGroup
  onAction: () => void  // 시작하기 / 이어하기
  onResult: () => void  // 결과 보기
}

const GROUP_BADGE: Record<AssignmentGroup, { label: string; className: string }> = {
  in_progress: { label: '진행 중', className: 'bg-blue-100 text-blue-700' },
  pending: { label: '대기 중', className: 'bg-gray-100 text-gray-600' },
  submitted: { label: '제출 완료', className: 'bg-green-100 text-green-700' },
  expired: { label: '마감됨', className: 'bg-red-100 text-red-600' },
}

export function AssignmentCard({
  session,
  myResult,
  group,
  onAction,
  onResult,
}: AssignmentCardProps) {
  const badge = GROUP_BADGE[group]
  const isExpired = session.close_at ? isPast(new Date(session.close_at)) : false
  const dDays = session.close_at
    ? differenceInDays(new Date(session.close_at), new Date())
    : null

  const progressPct =
    myResult && session.set_title
      ? Math.round(((myResult.current_q_index ?? 0) / 12) * 100) // TODO: 실제 question_count 사용
      : 0

  return (
    <div className="rounded-xl bg-white/10 border border-white/10 p-4 space-y-3">
      {/* 상단: 제목 + 배지 */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2">
          <ClipboardList className="h-5 w-5 text-gray-400 mt-0.5 shrink-0" />
          <p className="font-medium text-white">{session.set_title}</p>
        </div>
        <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${badge.className}`}>
          {badge.label}
        </span>
      </div>

      {/* 마감일 */}
      <div className="flex items-center gap-2 text-sm text-gray-400">
        {session.close_at ? (
          isExpired ? (
            <span>마감됨</span>
          ) : dDays !== null && dDays >= 0 ? (
            <span>
              마감{' '}
              <span className={dDays <= 1 ? 'text-red-400 font-semibold' : 'text-gray-300'}>
                D-{dDays}
              </span>{' '}
              ({new Date(session.close_at).toLocaleDateString('ko-KR')})
            </span>
          ) : null
        ) : (
          <span>무기한</span>
        )}
      </div>

      {/* 진행 중: 진행률 바 */}
      {group === 'in_progress' && myResult && (
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-gray-400">
            <span>진행률</span>
            <span>
              {myResult.current_q_index ?? 0}문항 진행됨
            </span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-1.5">
            <div
              className="h-1.5 rounded-full bg-blue-400 transition-all"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      )}

      {/* 제출 완료: 점수 */}
      {group === 'submitted' && myResult && (
        <p className="text-sm text-gray-300">
          점수{' '}
          <span className="font-bold text-white">
            {myResult.total_score?.toLocaleString() ?? 0}점
          </span>
        </p>
      )}

      {/* 액션 버튼 */}
      <div className="pt-1">
        {group === 'in_progress' && (
          <Button size="sm" className="w-full" onClick={onAction}>
            이어하기 →
          </Button>
        )}
        {group === 'pending' && (
          <Button size="sm" className="w-full" onClick={onAction}>
            시작하기 →
          </Button>
        )}
        {group === 'submitted' && (
          <Button
            size="sm"
            variant="outline"
            className="w-full border-white/20 text-white hover:bg-white/10"
            onClick={onResult}
          >
            결과 보기 →
          </Button>
        )}
        {group === 'expired' && (
          <Button size="sm" variant="ghost" className="w-full text-gray-500" disabled>
            마감됨
          </Button>
        )}
      </div>
    </div>
  )
}

// 스켈레톤
export function AssignmentCardSkeleton() {
  return (
    <div className="rounded-xl bg-white/10 border border-white/10 p-4 space-y-3 animate-pulse">
      <div className="flex justify-between">
        <div className="h-4 bg-white/20 rounded w-40" />
        <div className="h-4 bg-white/20 rounded w-16" />
      </div>
      <div className="h-3 bg-white/20 rounded w-32" />
      <div className="h-8 bg-white/20 rounded w-full" />
    </div>
  )
}
