// S-15 배포 히스토리
// 스펙: docs/screens/phase3-group-report.md#s-15

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { differenceInDays, isPast, formatDistanceToNow } from 'date-fns'
import { ko } from 'date-fns/locale'
import { BarChart2, ClipboardList } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { EmptyState } from '@/components/common/EmptyState'
import type { Session } from '@/types'

type HistoryFilter = 'all' | 'live' | 'assignment'

const STATUS_LABEL: Record<string, string> = {
  waiting: '대기 중',
  in_progress: '진행 중',
  paused: '일시정지',
  completed: '완료',
  cancelled: '취소됨',
}

const STATUS_COLOR: Record<string, string> = {
  waiting: 'secondary',
  in_progress: 'default',
  paused: 'secondary',
  completed: 'secondary',
  cancelled: 'destructive',
}

function HistoryCard({ session, onReport, onSubmissions }: {
  session: Session & { participant_count?: number; completion_rate?: number; submitted_count?: number; total_count?: number }
  onReport: () => void
  onSubmissions: () => void
}) {
  const isAssignment = session.session_type === 'assignment'
  const isExpired = session.close_at ? isPast(new Date(session.close_at)) : false
  const dDays = session.close_at && !isExpired
    ? differenceInDays(new Date(session.close_at), new Date())
    : null

  return (
    <div className="rounded-lg border bg-white p-4 space-y-3">
      {/* 상단 */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          {isAssignment ? (
            <ClipboardList className="h-4 w-4 text-purple-500 shrink-0" />
          ) : (
            <span className="text-sm">🔴</span>
          )}
          <p className="font-medium text-gray-800">{session.set_title}</p>
        </div>
        <Badge variant={(STATUS_COLOR[session.status] ?? 'secondary') as 'default' | 'secondary' | 'destructive' | 'outline'}>
          {STATUS_LABEL[session.status] ?? session.status}
        </Badge>
      </div>

      {/* 메타 */}
      <p className="text-sm text-gray-500">
        {isAssignment ? '📋 과제' : '🔴 라이브'} ·{' '}
        {formatDistanceToNow(new Date(session.created_at), { addSuffix: true, locale: ko })}
        {dDays !== null && (
          <span className={`ml-2 font-semibold ${dDays <= 1 ? 'text-red-500' : 'text-blue-500'}`}>
            마감 D-{dDays}
          </span>
        )}
        {isExpired && session.close_at && (
          <span className="ml-2 text-gray-400">마감됨</span>
        )}
      </p>

      {/* 통계 */}
      <div className="text-sm text-gray-600">
        {isAssignment ? (
          <span>
            제출 {session.submitted_count ?? 0} / {session.total_count ?? 0}명
          </span>
        ) : (
          <span>
            참여 {session.participant_count ?? 0}명
            {session.completion_rate != null && ` · 완료율 ${session.completion_rate}%`}
          </span>
        )}
      </div>

      {/* 액션 버튼 */}
      <div className="flex gap-2">
        {isAssignment && session.status !== 'completed' && !isExpired && (
          <Button variant="outline" size="sm" onClick={onSubmissions}>
            제출 현황
          </Button>
        )}
        {session.status === 'completed' || isExpired ? (
          <Button variant="outline" size="sm" onClick={onReport}>
            <BarChart2 className="mr-1 h-4 w-4" />
            리포트 보기
          </Button>
        ) : null}
      </div>
    </div>
  )
}

export default function HistoryPage() {
  const router = useRouter()
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<HistoryFilter>('all')
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)

  const fetchSessions = (reset = false) => {
    const p = reset ? 1 : page
    const params = new URLSearchParams({ host: 'me', sort: 'created_at', page: String(p), limit: '10' })
    if (filter !== 'all') params.set('session_type', filter)

    setLoading(true)
    fetch(`/api/sessions?${params}`)
      .then((r) => r.json())
      .then((data) => {
        if (reset) {
          setSessions(data.data ?? data)
        } else {
          setSessions((prev) => [...prev, ...(data.data ?? data)])
        }
        setHasMore((data.data ?? data).length === 10)
        if (!reset) setPage((p) => p + 1)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    setPage(1)
    fetchSessions(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter])

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">지난 게임</h1>

      {/* 필터 탭 */}
      <div className="flex gap-1">
        {(['all', 'live', 'assignment'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors
              ${filter === f ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            {f === 'all' ? '전체' : f === 'live' ? '라이브' : '과제'}
          </button>
        ))}
      </div>

      {/* 목록 */}
      {loading && sessions.length === 0 ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 rounded-lg border bg-white animate-pulse" />
          ))}
        </div>
      ) : sessions.length === 0 ? (
        <EmptyState
          icon="📊"
          title="아직 진행한 게임이 없어요"
          description="퀴즈로 게임을 열면 여기서 결과를 확인할 수 있어요."
          action={{ label: '내 퀴즈 보기', onClick: () => router.push('/sets') }}
        />
      ) : (
        <div className="space-y-3">
          {sessions.map((session) => (
            <HistoryCard
              key={session.session_id}
              session={session}
              onReport={() =>
                router.push(`/sessions/${session.session_id}/report/questions`)
              }
              onSubmissions={() =>
                router.push(`/sessions/${session.session_id}/submissions`)
              }
            />
          ))}
          {hasMore && (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => fetchSessions()}
              disabled={loading}
            >
              {loading ? '로딩 중...' : '더 보기'}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
