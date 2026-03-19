'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Gamepad2,
  BookOpen,
  Lightbulb,
  Flame,
  ChevronRight,
  Candy,
  Check,
} from 'lucide-react'

// TODO: API에서 일일 데이터 로드
const MOCK = {
  nickname: '김학생',
  jellyBalance: 24,
  questionsSolved: 24,
  questionsTarget: 60,
  todayReviewCount: 5,
  recommendCount: 2,
  streakDays: 7,
  recommendedUnit: '과학 > 마찰력',
  recommendedReason: '취약',
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
  const router = useRouter()

  return (
    <div className="space-y-5 pb-6">
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            안녕, {MOCK.nickname}!
          </h1>
          <p className="mt-0.5 text-sm text-gray-400">오늘도 열심히 해볼까요?</p>
        </div>
        <Link
          href="/student/rewards"
          className="flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200 px-3 py-1.5 text-sm font-bold text-amber-600 hover:bg-amber-100 transition"
        >
          <Candy className="h-3.5 w-3.5" />
          {MOCK.jellyBalance}
        </Link>
      </div>

      {/* ── 큰 CTA: 바로 시작하기 ── */}
      <button
        onClick={() => router.push('/student/learn')}
        className="group w-full rounded-2xl bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 p-5 text-left text-white shadow-lg hover:shadow-xl transition-shadow"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
              <Gamepad2 className="h-6 w-6" />
            </div>
            <div>
              <p className="text-lg font-bold">바로 시작하기</p>
              <p className="mt-0.5 text-sm text-blue-100">
                추천: {MOCK.recommendedUnit} ({MOCK.recommendedReason})
              </p>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-blue-200 group-hover:translate-x-1 transition-transform" />
        </div>
        <div className="mt-3 flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-xs text-blue-100">
          <Candy className="h-3 w-3" />
          완료 시 최대 <span className="font-bold text-white">+{MOCK.maxJellyPerGame}</span> 젤리 획득
        </div>
      </button>

      {/* ── 퀵 액션 3칩 ── */}
      <div className="grid grid-cols-3 gap-3">
        <button
          onClick={() => router.push('/student/wrong-notes')}
          className="flex flex-col items-center gap-1.5 rounded-2xl bg-amber-50 border border-amber-100 p-4 hover:bg-amber-100 transition"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
            <BookOpen className="h-5 w-5 text-amber-600" />
          </div>
          <span className="text-xl font-bold text-amber-700">{MOCK.todayReviewCount}</span>
          <span className="text-[11px] font-medium text-amber-600">오답 복습</span>
        </button>

        <button
          onClick={() => router.push('/student/learn')}
          className="flex flex-col items-center gap-1.5 rounded-2xl bg-violet-50 border border-violet-100 p-4 hover:bg-violet-100 transition"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-100">
            <Lightbulb className="h-5 w-5 text-violet-600" />
          </div>
          <span className="text-xl font-bold text-violet-700">{MOCK.recommendCount}</span>
          <span className="text-[11px] font-medium text-violet-600">추천 학습</span>
        </button>

        <div className="flex flex-col items-center gap-1.5 rounded-2xl bg-orange-50 border border-orange-100 p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100">
            <Flame className="h-5 w-5 text-orange-500" />
          </div>
          <span className="text-xl font-bold text-orange-600">{MOCK.streakDays}</span>
          <span className="text-[11px] font-medium text-orange-500">출석 연속</span>
        </div>
      </div>

      {/* ── 오늘의 진도 ── */}
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

      {/* ── 미션 달성 ── */}
      <div className="rounded-2xl bg-white border border-gray-100 p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-gray-700">미션 달성</span>
          <span className="text-xs font-bold text-blue-600">
            {missionsDone}/{MOCK.missions.length}
          </span>
        </div>
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
              {m.done && <Check className="h-3 w-3" />}
              {m.label}
            </span>
          ))}
        </div>
      </div>

      {/* ── 젤리 CTA ── */}
      <Link
        href="/student/rewards"
        className="flex items-center justify-center gap-1.5 rounded-xl bg-amber-50 border border-amber-200 py-3 text-sm font-semibold text-amber-700 hover:bg-amber-100 transition"
      >
        <Candy className="h-4 w-4" />
        젤리 더 받기
        <ChevronRight className="h-4 w-4" />
      </Link>
    </div>
  )
}
