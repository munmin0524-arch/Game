// S-01 홈 대시보드
// 스펙: docs/screens/phase1-live-core.md#s-01

'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, Rocket } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { QuestionSetCard } from '@/components/host/QuestionSetCard'
import { RecentDeployBanner } from '@/components/host/RecentDeployBanner'
import { EmptyState } from '@/components/common/EmptyState'
import { Skeleton } from '@/components/ui/skeleton'
import { questionSetsApi, sessionsApi } from '@/lib/api'
import type { QuestionSet, Session } from '@/types'

export default function DashboardPage() {
  const [sets, setSets] = useState<QuestionSet[]>([])
  const [latestSession, setLatestSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      questionSetsApi.list({ limit: 5, sort: 'updated_at' }),
      sessionsApi.get('latest'), // TODO: /api/sessions?limit=1 API 확정 후 수정
    ])
      .then(([setsRes, sessionRes]) => {
        setSets(setsRes.data)
        setLatestSession(sessionRes)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-10">
      {/* 관리 센터 배너 */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-700 to-slate-900 px-8 py-8 text-white shadow-card">
        <div className="relative z-10">
          <h1 className="text-2xl font-bold">
            관리 센터
          </h1>
          <p className="mt-2 text-slate-300 text-sm leading-relaxed">
            퀴즈를 관리하고, 게임 기록을 확인하세요.
          </p>
          <div className="mt-5 flex gap-3">
            <Button size="lg" asChild className="bg-blue-600 text-white hover:bg-blue-700 shadow-md">
              <Link href="/select">
                <Rocket className="mr-2 h-4 w-4" />
                퀴즈 시작하기
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="border-white/30 text-white hover:bg-white/10">
              <Link href="/sets/new/edit">
                <Plus className="mr-2 h-4 w-4" />
                새 퀴즈 만들기
              </Link>
            </Button>
          </div>
        </div>
        {/* 데코 원형 */}
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/5" />
        <div className="absolute -right-4 top-16 h-24 w-24 rounded-full bg-white/5" />
      </div>

      {/* 내 퀴즈 섹션 */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-baseline gap-3">
            <h2 className="text-lg font-bold text-gray-900">내 퀴즈</h2>
            <span className="text-sm text-gray-400">퀴즈를 만들고 문항을 편집하세요</span>
          </div>
          <Link href="/sets" className="text-sm text-blue-600 hover:underline font-medium">
            전체 보기 →
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-2xl" />
            ))}
          </div>
        ) : sets.length === 0 ? (
          <EmptyState
            title="아직 만든 퀴즈가 없어요"
            description="첫 번째 퀴즈 세트를 만들어보세요."
            action={
              <Button asChild>
                <Link href="/sets/new/edit">
                  <Plus className="mr-2 h-4 w-4" />
                  새 퀴즈 만들기
                </Link>
              </Button>
            }
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {sets.map((set) => (
              <QuestionSetCard key={set.set_id} set={set} />
            ))}
          </div>
        )}
      </section>

      {/* 구분선 */}
      <hr className="border-gray-200" />

      {/* 히스토리 섹션 */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-baseline gap-3">
            <h2 className="text-lg font-bold text-gray-900">지난 게임</h2>
            <span className="text-sm text-gray-400">진행한 게임 기록과 리포트</span>
          </div>
          <Link href="/dashboard/history" className="text-sm text-blue-600 hover:underline font-medium">
            전체 보기 →
          </Link>
        </div>

        {latestSession ? (
          <RecentDeployBanner session={latestSession} />
        ) : (
          <div className="rounded-2xl bg-white px-6 py-8 shadow-soft text-center">
            <p className="text-sm text-gray-400">아직 진행한 게임이 없어요.</p>
            <p className="text-xs text-gray-300 mt-1">퀴즈를 만들고 게임을 열면 여기에 기록돼요.</p>
          </div>
        )}
      </section>
    </div>
  )
}
