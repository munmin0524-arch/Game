// 지난 게임 — 종합 대시보드 + [게임별 | 그룹별] 탭
// 기존 /dashboard/history 대체

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { formatDistanceToNow } from 'date-fns'
import { ko } from 'date-fns/locale'
import {
  BarChart2,
  Calendar,
  Gamepad2,
  Trophy,
  TrendingDown,
  Users,
  HelpCircle,
  Star,
  Play,
  CheckCircle2,
  Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { EmptyState } from '@/components/common/EmptyState'
import type { Session, Group } from '@/types'

type ActiveTab = 'games' | 'groups'

// ─────────────────────────────────────────────────────────────
// 상태 라벨
// ─────────────────────────────────────────────────────────────

const STATUS_LABEL: Record<string, string> = {
  waiting: '대기 중',
  in_progress: '진행 중',
  paused: '일시정지',
  completed: '완료',
  cancelled: '취소됨',
}

const STATUS_BADGE: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; icon: typeof Play }> = {
  waiting: { variant: 'secondary', icon: Loader2 },
  in_progress: { variant: 'default', icon: Play },
  completed: { variant: 'secondary', icon: CheckCircle2 },
}

// ─────────────────────────────────────────────────────────────
// 종합 대시보드
// ─────────────────────────────────────────────────────────────

function DashboardSummary({
  sessions,
  groups,
}: {
  sessions: Session[]
  groups: Group[]
}) {
  // 누적 현황
  const firstSession = sessions.length > 0
    ? sessions.reduce((a, b) => (a.created_at < b.created_at ? a : b))
    : null
  const dayCount = firstSession
    ? Math.max(1, Math.ceil((Date.now() - new Date(firstSession.created_at).getTime()) / 86400000))
    : 0
  const totalGames = sessions.length

  // 최근 시작 게임 Top3
  const recentStarted = [...sessions]
    .filter((s) => s.status === 'in_progress' || s.status === 'waiting')
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
    .slice(0, 3)

  // 최근 종료 게임 Top3
  const recentCompleted = [...sessions]
    .filter((s) => s.status === 'completed')
    .sort((a, b) => b.updated_at.localeCompare(a.updated_at))
    .slice(0, 3)

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-bold text-gray-900">종합 대시보드</h2>

      {/* 누적 현황 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl border bg-white p-4 text-center">
          <Calendar className="h-5 w-5 text-blue-500 mx-auto mb-1" />
          <p className="text-2xl font-bold text-gray-900">{dayCount}일</p>
          <p className="text-xs text-gray-500">함께한 날</p>
        </div>
        <div className="rounded-xl border bg-white p-4 text-center">
          <Gamepad2 className="h-5 w-5 text-purple-500 mx-auto mb-1" />
          <p className="text-2xl font-bold text-gray-900">{totalGames}회</p>
          <p className="text-xs text-gray-500">총 게임 수</p>
        </div>
        <div className="rounded-xl border bg-white p-4 text-center">
          <Users className="h-5 w-5 text-green-500 mx-auto mb-1" />
          <p className="text-2xl font-bold text-gray-900">{groups.length}개</p>
          <p className="text-xs text-gray-500">나의 그룹</p>
        </div>
        <div className="rounded-xl border bg-white p-4 text-center">
          <CheckCircle2 className="h-5 w-5 text-amber-500 mx-auto mb-1" />
          <p className="text-2xl font-bold text-gray-900">
            {sessions.filter((s) => s.status === 'completed').length}회
          </p>
          <p className="text-xs text-gray-500">완료된 게임</p>
        </div>
      </div>

      {/* 타임라인 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* 최근 시작 */}
        <div className="rounded-xl border bg-white p-4">
          <p className="text-sm font-semibold text-blue-700 mb-3 flex items-center gap-1.5">
            <Play className="h-4 w-4" /> 최근 시작 게임
          </p>
          {recentStarted.length === 0 ? (
            <p className="text-xs text-gray-400">진행 중인 게임 없음</p>
          ) : recentStarted.map((s) => (
            <div key={s.session_id} className="flex items-center justify-between py-1.5 text-sm">
              <span className="text-gray-700 truncate flex-1">{s.set_title || '퀴즈'}</span>
              <Badge variant="outline" className="text-xs shrink-0 ml-2">
                {STATUS_LABEL[s.status]}
              </Badge>
            </div>
          ))}
        </div>

        {/* 최근 종료 */}
        <div className="rounded-xl border bg-white p-4">
          <p className="text-sm font-semibold text-green-700 mb-3 flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4" /> 최근 종료 게임
          </p>
          {recentCompleted.length === 0 ? (
            <p className="text-xs text-gray-400">종료된 게임 없음</p>
          ) : recentCompleted.map((s) => (
            <div key={s.session_id} className="flex items-center justify-between py-1.5 text-sm">
              <span className="text-gray-700 truncate flex-1">{s.set_title || '퀴즈'}</span>
              <span className="text-xs text-gray-400 shrink-0 ml-2">
                {formatDistanceToNow(new Date(s.updated_at), { addSuffix: true, locale: ko })}
              </span>
            </div>
          ))}
        </div>
      </div>

    </section>
  )
}

// ─────────────────────────────────────────────────────────────
// 게임별 탭
// ─────────────────────────────────────────────────────────────

function GameCard({
  session,
  onReport,
}: {
  session: Session & { participant_count?: number; completion_rate?: number }
  onReport: () => void
}) {
  const isInProgress = session.status === 'in_progress' || session.status === 'waiting'
  const isCompleted = session.status === 'completed'
  const StatusIcon = STATUS_BADGE[session.status]?.icon ?? CheckCircle2

  return (
    <div className="rounded-lg border bg-white p-4 space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="text-sm">🎮</span>
          <p className="font-medium text-gray-800 truncate">{session.set_title || '퀴즈'}</p>
        </div>
        <Badge variant={STATUS_BADGE[session.status]?.variant ?? 'secondary'} className="gap-1 shrink-0">
          <StatusIcon className="h-3 w-3" />
          {STATUS_LABEL[session.status] ?? session.status}
        </Badge>
      </div>

      <p className="text-sm text-gray-500">
        {formatDistanceToNow(new Date(session.created_at), { addSuffix: true, locale: ko })}
        {session.participant_count != null && ` · ${session.participant_count}명 참여`}
      </p>

      {/* 진행 중 → 현 상태 분석 */}
      {isInProgress && (
        <div className="rounded-lg bg-blue-50 p-3 text-sm text-blue-700">
          <p className="font-medium">진행 중</p>
          <p className="text-xs text-blue-500 mt-0.5">
            실시간 참여 현황을 확인하세요
          </p>
        </div>
      )}

      {/* 완료 → 리포트 버튼 */}
      {isCompleted && (
        <Button variant="outline" size="sm" onClick={onReport} className="gap-1">
          <BarChart2 className="h-4 w-4" />
          리포트 보기
        </Button>
      )}
    </div>
  )
}

function GamesTab({ sessions }: { sessions: Session[] }) {
  const router = useRouter()
  const sorted = [...sessions].sort((a, b) => b.created_at.localeCompare(a.created_at))

  if (sorted.length === 0) {
    return <EmptyState icon="🎮" title="아직 진행한 게임이 없어요" description="퀴즈로 게임을 열면 여기서 확인할 수 있어요." />
  }

  return (
    <div className="space-y-3">
      {sorted.map((session) => (
        <GameCard
          key={session.session_id}
          session={session}
          onReport={() => router.push(`/sessions/${session.session_id}/report/questions`)}
        />
      ))}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// 그룹별 탭
// ─────────────────────────────────────────────────────────────

function GroupsTab({ groups }: { groups: Group[] }) {
  const router = useRouter()

  if (groups.length === 0) {
    return <EmptyState icon="👥" title="생성한 그룹이 없어요" description="게임 배포 시 그룹이 자동 생성됩니다." />
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {groups.map((g) => (
        <div
          key={g.group_id}
          onClick={() => router.push(`/dashboard/groups/${g.group_id}`)}
          className="rounded-lg border bg-white p-4 hover:border-blue-300 hover:shadow-sm cursor-pointer transition-all space-y-2"
        >
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-blue-500" />
            <p className="font-medium text-gray-800">{g.name}</p>
          </div>
          <div className="flex gap-4 text-sm text-gray-500">
            <span>{g.member_count ?? 0}명</span>
            <span>{g.type === 'manual' ? '직접 생성' : '자동 생성'}</span>
          </div>
          {g.session_title && (
            <p className="text-xs text-gray-400 truncate">최근: {g.session_title}</p>
          )}
        </div>
      ))}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// 메인 페이지
// ─────────────────────────────────────────────────────────────

export default function HistoryPage() {
  const router = useRouter()
  const [sessions, setSessions] = useState<Session[]>([])
  const [groups, setGroups] = useState<Group[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<ActiveTab>('games')

  useEffect(() => {
    Promise.all([
      fetch('/api/sessions?host=me&sort=created_at&limit=50').then((r) => r.json()),
      fetch('/api/groups').then((r) => r.json()),
    ])
      .then(([sessData, groupData]) => {
        setSessions(sessData.data ?? sessData ?? [])
        setGroups(groupData.data ?? groupData ?? [])
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">지난 게임</h1>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 rounded-lg border bg-white animate-pulse" />
          ))}
        </div>
      ) : (
        <>
          {/* 종합 대시보드 */}
          <DashboardSummary sessions={sessions} groups={groups} />

          {/* 탭 */}
          <div className="border-b">
            <div className="flex gap-1 -mb-px">
              {([
                { key: 'games' as const, label: '게임별', icon: Gamepad2 },
                { key: 'groups' as const, label: '그룹별', icon: Users },
              ]).map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors
                    ${activeTab === key
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* 탭 컨텐츠 */}
          {activeTab === 'games' ? (
            <GamesTab sessions={sessions} />
          ) : (
            <GroupsTab groups={groups} />
          )}
        </>
      )}
    </div>
  )
}
