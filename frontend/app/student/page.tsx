'use client'

import Link from 'next/link'
import {
  Gamepad2,
  Lightbulb,
  BookOpen,
  Flame,
  ChevronRight,
  Candy,
  Check,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const MOCK = {
  nickname: '김학생',
  jellyBalance: 24,
  questionsSolved: 24,
  questionsTarget: 60,
  todayReviewCount: 5,
  streakDays: 7,
  recommendedUnit: '과학 > 마찰력',
  recommendedReason: '정답률 30% 취약',
  maxJellyPerGame: 5,
  missions: [
    { label: '출석', done: true },
    { label: '10문제', done: false },
    { label: '게임승리', done: false },
    { label: '80%↑', done: false },
    { label: '오답복습', done: false },
  ],
}

const progressPct = Math.round((MOCK.questionsSolved / MOCK.questionsTarget) * 100)
const missionsDone = MOCK.missions.filter((m) => m.done).length

export default function StudentHomePage() {
  return (
    <div className="space-y-5 pb-6">
      {/* ── 1. Header row ── */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">안녕, {MOCK.nickname}!</h1>
        <Link
          href="/student/rewards"
          className="flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-200 px-3 py-1.5 text-sm font-bold text-amber-600 hover:bg-amber-100 transition"
        >
          <Candy className="h-3.5 w-3.5" />
          {MOCK.jellyBalance}
        </Link>
      </div>

      {/* ── 2. Two CTA cards side by side ── */}
      <div className="grid grid-cols-2 gap-3">
        {/* 게임 시작하기 */}
        <div className="rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 p-4 text-white shadow-md">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 mb-3">
            <Gamepad2 className="h-5 w-5" />
          </div>
          <p className="text-base font-bold leading-tight">게임 시작하기</p>
          <p className="mt-1 text-xs text-blue-100">단원 선택 후 시작</p>
          <div className="mt-1.5 flex items-center gap-1 text-[11px] text-blue-200">
            <Candy className="h-3 w-3" />
            최대 <span className="font-bold text-white">+{MOCK.maxJellyPerGame}</span>
          </div>
          <Link href="/student/learn">
            <Button
              size="sm"
              className="mt-3 w-full rounded-xl bg-white/20 text-white hover:bg-white/30 text-xs font-semibold"
            >
              시작하기
              <ChevronRight className="ml-1 h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>

        {/* 추천 학습 */}
        <div className="rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 p-4 text-white shadow-md">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 mb-3">
            <Lightbulb className="h-5 w-5" />
          </div>
          <p className="text-base font-bold leading-tight">추천 학습</p>
          <p className="mt-1 text-xs text-violet-100">{MOCK.recommendedUnit}</p>
          <p className="mt-0.5 text-[11px] text-violet-200">{MOCK.recommendedReason}</p>
          <Link href="/student/learn?recommended=true">
            <Button
              size="sm"
              className="mt-3 w-full rounded-xl bg-white/20 text-white hover:bg-white/30 text-xs font-semibold"
            >
              바로 시작
              <ChevronRight className="ml-1 h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* ── 3. Two action chips ── */}
      <div className="grid grid-cols-2 gap-3">
        <Link
          href="/student/wrong-notes"
          className="flex items-center gap-2.5 rounded-2xl bg-amber-50 border border-amber-100 px-4 py-3 hover:bg-amber-100 transition"
        >
          <BookOpen className="h-4.5 w-4.5 text-amber-600" />
          <span className="text-sm font-semibold text-amber-700">
            오답 복습 {MOCK.todayReviewCount}개
          </span>
        </Link>

        <div className="flex items-center gap-2.5 rounded-2xl bg-orange-50 border border-orange-100 px-4 py-3">
          <Flame className="h-4.5 w-4.5 text-orange-500" />
          <span className="text-sm font-semibold text-orange-600">
            출석 {MOCK.streakDays}일 연속
          </span>
        </div>
      </div>

      {/* ── 4. Progress bar ── */}
      <div className="rounded-2xl bg-white border border-gray-100 p-4 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-gray-700">오늘의 진도</span>
          <span className="text-xs text-gray-400">
            {MOCK.questionsSolved}/{MOCK.questionsTarget} 문제
          </span>
        </div>
        <div className="relative h-3 overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <p className="mt-1.5 text-right text-xs font-semibold text-blue-600">{progressPct}%</p>
      </div>

      {/* ── 5. Mission + Jelly CTA combined card ── */}
      <div className="rounded-2xl bg-white border border-gray-100 p-4 shadow-sm">
        {/* Mission header */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-gray-700">미션 달성</span>
          <span className="text-xs font-bold text-blue-600">
            {missionsDone}/{MOCK.missions.length}
          </span>
        </div>

        {/* Mission chips */}
        <div className="flex flex-wrap gap-2">
          {MOCK.missions.map((m) => (
            <span
              key={m.label}
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${
                m.done
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-400'
              }`}
            >
              {m.done ? <Check className="h-3 w-3" /> : '⬜'}
              {m.label}
            </span>
          ))}
        </div>

        {/* Divider */}
        <div className="my-3 border-t border-gray-100" />

        {/* Jelly CTA link */}
        <Link
          href="/student/rewards"
          className="flex items-center justify-center gap-1.5 text-sm font-semibold text-amber-700 hover:text-amber-800 transition"
        >
          <Candy className="h-4 w-4 text-amber-500" />
          젤리 더 받으러가기
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  )
}
