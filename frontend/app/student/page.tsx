'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Home,
  Gamepad2,
  Brain,
  BookOpen,
  ChevronRight,
  Target,
  Percent,
  Flame,
  Trophy,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import UnitSelector from '@/components/student/UnitSelector'

// TODO: API에서 일일 데이터 로드
const MOCK_DAILY = {
  nickname: '김학생',
  jellyBalance: 24,
  questionsSolved: 24,
  questionsTarget: 60,
  accuracy: 75,
  streakDays: 7,
  goalsAchieved: 2,
  goalsTotal: 5,
  todayReviewCount: 5,
}

const MOCK_RECOMMENDATIONS = [
  { icon: '💡', label: '미학습 단원: 탄성력' },
  { icon: '📊', label: '취약 단원: 마찰력 (정답률 30%)' },
]

export default function StudentHomePage() {
  const router = useRouter()
  const [unitSelection, setUnitSelection] = useState<{
    subject: string
    unit: string
    subUnit: string
  } | null>(null)

  return (
    <div className="space-y-5">
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">
          안녕, {MOCK_DAILY.nickname}!
        </h1>
        <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-700">
          🍬 곰젤리 {MOCK_DAILY.jellyBalance}
        </span>
      </div>

      <p className="text-sm text-gray-500">오늘도 열심히 공부해볼까요?</p>

      {/* ── Mission 1: 게임 시작하기 ── */}
      <div className="rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 p-5 text-white shadow-card">
        <div className="flex items-center gap-2 text-blue-100">
          <Gamepad2 className="h-4 w-4" />
          <span className="text-xs font-medium">Mission 1</span>
        </div>
        <h2 className="mt-2 text-lg font-bold">게임 시작하기</h2>

        {/* Unit Selector */}
        <div className="mt-3">
          <UnitSelector compact onSelect={setUnitSelection} />
        </div>

        <p className="mt-2 text-xs text-blue-100">10문제 (문항풀에서 출제)</p>

        <Button
          className="mt-3 w-full rounded-xl bg-white text-blue-600 hover:bg-blue-50 font-semibold"
          onClick={() => router.push('/student/learn')}
        >
          게임 시작하기 <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>

      {/* ── Mission 2: 추천 학습 ── */}
      <div className="rounded-2xl bg-gradient-to-br from-violet-500 to-violet-600 p-5 text-white shadow-card">
        <div className="flex items-center gap-2 text-violet-100">
          <Brain className="h-4 w-4" />
          <span className="text-xs font-medium">Mission 2</span>
        </div>
        <h2 className="mt-2 text-lg font-bold">추천 학습</h2>

        <ul className="mt-3 space-y-2">
          {MOCK_RECOMMENDATIONS.map((rec, i) => (
            <li
              key={i}
              className="rounded-lg bg-white/15 px-3 py-2 text-sm"
            >
              {rec.icon} {rec.label}
            </li>
          ))}
        </ul>

        <Button
          className="mt-3 w-full rounded-xl bg-white text-violet-600 hover:bg-violet-50 font-semibold"
          onClick={() => router.push('/student/learn')}
        >
          추천 학습 시작 <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>

      {/* ── Mission 3: 오답노트 복습 ── */}
      <div className="rounded-2xl bg-gradient-to-br from-amber-400 to-amber-500 p-5 text-white shadow-card">
        <div className="flex items-center gap-2 text-amber-100">
          <BookOpen className="h-4 w-4" />
          <span className="text-xs font-medium">Mission 3</span>
        </div>
        <h2 className="mt-2 text-lg font-bold">오답노트 복습</h2>

        <p className="mt-2 rounded-lg bg-white/15 px-3 py-2 text-sm">
          📖 오늘 복습할 문제 {MOCK_DAILY.todayReviewCount}개
        </p>

        <Button
          className="mt-3 w-full rounded-xl bg-white text-amber-600 hover:bg-amber-50 font-semibold"
          onClick={() => router.push('/student/wrong-notes')}
        >
          오답노트 풀기 <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>

      {/* ── 오늘의 요약 ── */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-gray-700">오늘의 요약</h3>
        <div className="grid grid-cols-2 gap-3">
          {/* 풀은 문제 */}
          <div className="rounded-xl bg-white p-4 shadow-soft">
            <div className="flex items-center gap-2 text-gray-500">
              <Target className="h-4 w-4" />
              <span className="text-xs font-medium">풀은 문제</span>
            </div>
            <p className="mt-2 text-2xl font-bold text-gray-900">
              {MOCK_DAILY.questionsSolved}
              <span className="text-sm font-normal text-gray-400">
                /{MOCK_DAILY.questionsTarget}
              </span>
            </p>
          </div>

          {/* 정답률 */}
          <div className="rounded-xl bg-white p-4 shadow-soft">
            <div className="flex items-center gap-2 text-gray-500">
              <Percent className="h-4 w-4" />
              <span className="text-xs font-medium">정답률</span>
            </div>
            <p className="mt-2 text-2xl font-bold text-gray-900">
              {MOCK_DAILY.accuracy}
              <span className="text-sm font-normal text-gray-400">%</span>
            </p>
          </div>

          {/* 출석 연속 */}
          <div className="rounded-xl bg-white p-4 shadow-soft">
            <div className="flex items-center gap-2 text-gray-500">
              <Flame className="h-4 w-4" />
              <span className="text-xs font-medium">출석 연속</span>
            </div>
            <p className="mt-2 text-2xl font-bold text-gray-900">
              {MOCK_DAILY.streakDays}
              <span className="text-sm font-normal text-gray-400">일</span>
            </p>
          </div>

          {/* 달성 목표 */}
          <div className="rounded-xl bg-white p-4 shadow-soft">
            <div className="flex items-center gap-2 text-gray-500">
              <Trophy className="h-4 w-4" />
              <span className="text-xs font-medium">달성 목표</span>
            </div>
            <p className="mt-2 text-2xl font-bold text-gray-900">
              {MOCK_DAILY.goalsAchieved}
              <span className="text-sm font-normal text-gray-400">
                /{MOCK_DAILY.goalsTotal}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* ── 젤리 CTA ── */}
      <Link
        href="/student/rewards"
        className="flex items-center justify-center gap-1 rounded-xl bg-amber-50 py-3 text-sm font-semibold text-amber-700 hover:bg-amber-100 transition-colors"
      >
        🍬 젤리 더 받으러가기 <ChevronRight className="h-4 w-4" />
      </Link>
    </div>
  )
}
