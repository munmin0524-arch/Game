// 그룹 상세 — 누적 현황 + 요약(점수/코칭/패턴) + 리포트 리스트

'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { formatDistanceToNow } from 'date-fns'
import { ko } from 'date-fns/locale'
import {
  ArrowLeft,
  Calendar,
  Gamepad2,
  Users,
  BarChart2,
  Trophy,
  TrendingDown,
  HelpCircle,
  Star,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { EmptyState } from '@/components/common/EmptyState'
import type { Group, Session } from '@/types'

// ─────────────────────────────────────────────────────────────
// 메인 페이지
// ─────────────────────────────────────────────────────────────

export default function GroupDetailPage() {
  const { groupId } = useParams<{ groupId: string }>()
  const router = useRouter()

  const [group, setGroup] = useState<Group | null>(null)
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // TODO: 실제 API 연동
    // 임시 mock 데이터
    Promise.all([
      fetch(`/api/groups/${groupId}`).then((r) => r.json()).catch(() => null),
      fetch(`/api/sessions?group_id=${groupId}&limit=50`).then((r) => r.json()).catch(() => []),
    ])
      .then(([groupData, sessData]) => {
        setGroup(groupData ?? {
          group_id: groupId,
          host_member_id: 'me',
          name: '1학년 3반',
          type: 'manual' as const,
          member_count: 25,
          created_at: '2026-01-15T09:00:00Z',
        })
        setSessions(sessData.data ?? sessData ?? [])
      })
      .finally(() => setLoading(false))
  }, [groupId])

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-24 rounded-lg border bg-white animate-pulse" />
        ))}
      </div>
    )
  }

  if (!group) {
    return <EmptyState icon="👥" title="그룹을 찾을 수 없습니다" />
  }

  const dayCount = Math.max(
    1,
    Math.ceil((Date.now() - new Date(group.created_at).getTime()) / 86400000),
  )
  const totalGames = sessions.length
  const completedGames = sessions.filter((s) => s.status === 'completed')

  // 점수 Top3 / Bottom3 (mock — 실제로는 API에서 계산)
  const scoreTop3 = [
    { nickname: '홍길동', score: 9500 },
    { nickname: '이영희', score: 7800 },
    { nickname: '최지우', score: 6000 },
  ]
  const scoreBottom3 = [
    { nickname: '김철수', score: 4000 },
    { nickname: '박민준', score: 0 },
  ]

  return (
    <div className="space-y-8">
      {/* 헤더 */}
      <div>
        <button
          className="text-sm text-gray-500 hover:text-gray-700 mb-2 flex items-center gap-1"
          onClick={() => router.push('/dashboard/history')}
        >
          <ArrowLeft className="h-4 w-4" /> 지난 게임
        </button>
        <div className="flex items-center gap-3">
          <Users className="h-6 w-6 text-blue-500" />
          <h1 className="text-2xl font-bold">{group.name}</h1>
          <Badge variant="outline" className="text-xs">
            {group.member_count ?? 0}명
          </Badge>
        </div>
      </div>

      {/* 누적 현황 */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-gray-900">누적 현황</h2>
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl border bg-white p-4 text-center">
            <Calendar className="h-5 w-5 text-blue-500 mx-auto mb-1" />
            <p className="text-2xl font-bold text-gray-900">{dayCount}일</p>
            <p className="text-xs text-gray-500">그룹 생성 이후</p>
          </div>
          <div className="rounded-xl border bg-white p-4 text-center">
            <Gamepad2 className="h-5 w-5 text-purple-500 mx-auto mb-1" />
            <p className="text-2xl font-bold text-gray-900">{totalGames}회</p>
            <p className="text-xs text-gray-500">총 게임 수</p>
          </div>
          <div className="rounded-xl border bg-white p-4 text-center">
            <BarChart2 className="h-5 w-5 text-green-500 mx-auto mb-1" />
            <p className="text-2xl font-bold text-gray-900">{completedGames.length}회</p>
            <p className="text-xs text-gray-500">완료된 게임</p>
          </div>
        </div>
      </section>

      {/* 요약 — 점수/코칭/패턴 */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-gray-900">요약</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* 점수 Top3 */}
          <div className="rounded-xl border bg-white p-4">
            <p className="text-sm font-semibold text-green-700 mb-2 flex items-center gap-1">
              <Trophy className="h-4 w-4" /> 점수 Top3
            </p>
            {scoreTop3.map((s, i) => (
              <div key={i} className="flex items-center justify-between text-sm py-1">
                <span className="text-gray-700">
                  <span className="font-bold text-gray-400 mr-2">{i + 1}</span>
                  {s.nickname}
                </span>
                <span className="font-medium text-green-600">{s.score.toLocaleString()}점</span>
              </div>
            ))}
          </div>

          {/* 점수 Bottom3 */}
          <div className="rounded-xl border bg-white p-4">
            <p className="text-sm font-semibold text-orange-700 mb-2 flex items-center gap-1">
              <TrendingDown className="h-4 w-4" /> 점수 하위
            </p>
            {scoreBottom3.map((s, i) => (
              <div key={i} className="flex items-center justify-between text-sm py-1">
                <span className="text-gray-700">{s.nickname}</span>
                <span className="font-medium text-orange-600">{s.score.toLocaleString()}점</span>
              </div>
            ))}
          </div>

          {/* 코칭 필요 */}
          <div className="rounded-xl border bg-white p-4">
            <p className="text-sm font-semibold text-red-700 mb-2 flex items-center gap-1">
              <HelpCircle className="h-4 w-4" /> 코칭 필요
            </p>
            <div className="flex items-center justify-between text-sm py-1">
              <span className="text-gray-700">김철수</span>
              <Badge variant="outline" className="text-[10px] bg-red-50 text-red-600 border-red-200">
                찍기 패턴
              </Badge>
            </div>
            <div className="flex items-center justify-between text-sm py-1">
              <span className="text-gray-700">박민준</span>
              <Badge variant="outline" className="text-[10px] bg-gray-50 text-gray-500 border-gray-200">
                미참여
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* 리포트 리스트 */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-gray-900">리포트 리스트</h2>
        {sessions.length === 0 ? (
          <EmptyState icon="📊" title="이 그룹의 게임 기록이 없습니다" />
        ) : (
          <div className="space-y-2">
            {sessions
              .sort((a, b) => b.created_at.localeCompare(a.created_at))
              .map((s) => (
                <div
                  key={s.session_id}
                  className="flex items-center justify-between rounded-lg border bg-white px-4 py-3 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 truncate">{s.set_title || '퀴즈'}</p>
                    <p className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(s.created_at), { addSuffix: true, locale: ko })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant="secondary" className="text-xs">
                      {s.status === 'completed' ? '완료' : s.status === 'in_progress' ? '진행 중' : '대기'}
                    </Badge>
                    {s.status === 'completed' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/sessions/${s.session_id}/report/questions`)}
                        className="gap-1"
                      >
                        <BarChart2 className="h-3 w-3" />
                        리포트
                      </Button>
                    )}
                  </div>
                </div>
              ))}
          </div>
        )}
      </section>
    </div>
  )
}
