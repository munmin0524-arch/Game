// S-01 홈 — 오늘의 할일
'use client'

import Link from 'next/link'
import { Target, TrendingUp, Star, ChevronRight, Gamepad2, ListChecks } from 'lucide-react'
import { Button } from '@/components/ui/button'

// TODO: API에서 일일 목표 데이터 로드
const MOCK_DAILY = {
  targetUnit: '여러 가지 힘',
  targetQuestions: 60,
  actualQuestions: 24,
  actualCorrect: 18,
  goalsAchieved: 2,
  goalsTotal: 5,
}

export default function StudentHomePage() {
  const progress = Math.round((MOCK_DAILY.actualQuestions / MOCK_DAILY.targetQuestions) * 100)
  const accuracy = MOCK_DAILY.actualQuestions > 0
    ? Math.round((MOCK_DAILY.actualCorrect / MOCK_DAILY.actualQuestions) * 100)
    : 0

  return (
    <div className="space-y-5">
      {/* 인사 헤더 */}
      <div>
        <h1 className="text-xl font-bold text-gray-900">오늘의 할일</h1>
        <p className="mt-1 text-sm text-gray-500">매일 학습 목표를 달성해보세요!</p>
      </div>

      {/* 자동 매칭 학습 목표 카드 */}
      <div className="rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 p-5 text-white shadow-card">
        <div className="flex items-center gap-2 text-blue-100">
          <Target className="h-4 w-4" />
          <span className="text-xs font-medium">오늘의 학습 목표</span>
        </div>
        <h2 className="mt-2 text-lg font-bold">{MOCK_DAILY.targetUnit}</h2>
        <p className="mt-1 text-sm text-blue-100">
          {MOCK_DAILY.targetQuestions}문제 중 {MOCK_DAILY.actualQuestions}문제 완료
        </p>

        {/* 진도 바 */}
        <div className="mt-3">
          <div className="h-2 overflow-hidden rounded-full bg-blue-400/40">
            <div
              className="h-full rounded-full bg-white transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-1 flex items-center justify-between text-xs text-blue-100">
            <span>{progress}% 완료</span>
            <span>정답률 {accuracy}%</span>
          </div>
        </div>
      </div>

      {/* 오늘의 진도 */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-white p-4 shadow-soft">
          <div className="flex items-center gap-2 text-gray-500">
            <TrendingUp className="h-4 w-4" />
            <span className="text-xs font-medium">풀은 문제</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-gray-900">
            {MOCK_DAILY.actualQuestions}
            <span className="text-sm font-normal text-gray-400">/{MOCK_DAILY.targetQuestions}</span>
          </p>
        </div>
        <div className="rounded-xl bg-white p-4 shadow-soft">
          <div className="flex items-center gap-2 text-gray-500">
            <Target className="h-4 w-4" />
            <span className="text-xs font-medium">정답률</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-gray-900">
            {accuracy}
            <span className="text-sm font-normal text-gray-400">%</span>
          </p>
        </div>
      </div>

      {/* 학습보상 미리보기 */}
      <Link href="/student/rewards">
        <div className="flex items-center justify-between rounded-xl bg-amber-50 p-4 shadow-soft">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
              <Star className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">오늘의 학습보상</p>
              <p className="text-xs text-gray-500">
                달성 {MOCK_DAILY.goalsAchieved}/{MOCK_DAILY.goalsTotal}
              </p>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-gray-400" />
        </div>
      </Link>

      {/* 액션 버튼들 */}
      <div className="flex gap-3">
        <Button asChild className="flex-1 h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-base font-semibold">
          <Link href="/student/games">
            <Gamepad2 className="mr-2 h-5 w-5" />
            학습 게임 하러 가기
          </Link>
        </Button>
        <Button asChild variant="outline" className="h-12 rounded-xl border-gray-200">
          <Link href="/student/select">
            <ListChecks className="mr-2 h-5 w-5" />
            직접 선택
          </Link>
        </Button>
      </div>
    </div>
  )
}
