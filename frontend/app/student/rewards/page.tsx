// S-07 학습보상 — 5개 달성 목표 카드
// Phase S-2에서 구현 예정
'use client'

import Link from 'next/link'
import { Star, Check, Lock, BookOpen, ChevronRight } from 'lucide-react'

// TODO: API에서 일일 목표 달성 현황 로드
const GOALS = [
  { id: 1, title: '오늘도 출석', progress: 1, target: 1, done: true },
  { id: 2, title: '게임 종류 다 하기', progress: 2, target: 4, done: false },
  { id: 3, title: '문제 30개 풀기', progress: 24, target: 30, done: false },
  { id: 4, title: '정답률 80% 달성', progress: 75, target: 80, done: false },
  { id: 5, title: '오답노트 풀기', progress: 0, target: 3, done: false },
]

export default function RewardsPage() {
  const achieved = GOALS.filter((g) => g.done).length

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900">학습보상</h1>
        <p className="mt-1 text-sm text-gray-500">
          목표를 달성하고 보상을 받으세요! ({achieved}/{GOALS.length})
        </p>
      </div>

      {/* 달성 목표 카드 */}
      <div className="space-y-3">
        {GOALS.map((goal) => (
          <div
            key={goal.id}
            className={`flex items-center gap-4 rounded-xl p-4 shadow-soft ${
              goal.done ? 'bg-green-50' : 'bg-white'
            }`}
          >
            <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
              goal.done ? 'bg-green-100' : 'bg-gray-100'
            }`}>
              {goal.done
                ? <Check className="h-5 w-5 text-green-600" />
                : <Star className="h-5 w-5 text-gray-400" />
              }
            </div>
            <div className="flex-1">
              <p className={`text-sm font-semibold ${goal.done ? 'text-green-700' : 'text-gray-900'}`}>
                {goal.title}
              </p>
              <div className="mt-1 flex items-center gap-2">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-200">
                  <div
                    className={`h-full rounded-full transition-all ${goal.done ? 'bg-green-500' : 'bg-blue-500'}`}
                    style={{ width: `${Math.min(100, (goal.progress / goal.target) * 100)}%` }}
                  />
                </div>
                <span className="text-xs text-gray-500">
                  {goal.progress}/{goal.target}
                </span>
              </div>
            </div>
            <button
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                goal.done
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
              disabled={!goal.done}
            >
              {goal.done ? '달성' : '미달성'}
            </button>
          </div>
        ))}
      </div>

      {/* 전체 달성 보상 */}
      <div className={`rounded-xl p-5 text-center shadow-soft ${
        achieved === GOALS.length ? 'bg-amber-50' : 'bg-gray-50'
      }`}>
        {achieved === GOALS.length ? (
          <>
            <p className="text-lg font-bold text-amber-600">모든 목표 달성!</p>
            <p className="mt-1 text-sm text-gray-600">죽순사탕을 받으세요</p>
            <button className="mt-3 rounded-lg bg-amber-500 px-6 py-2 text-sm font-semibold text-white hover:bg-amber-600">
              보상 받기
            </button>
          </>
        ) : (
          <>
            <Lock className="mx-auto h-8 w-8 text-gray-300" />
            <p className="mt-2 text-sm font-medium text-gray-400">
              모든 목표를 달성하면 보상을 받을 수 있어요
            </p>
          </>
        )}
      </div>

      {/* 오답노트 바로가기 */}
      <Link href="/student/wrong-notes">
        <div className="flex items-center justify-between rounded-xl bg-white p-4 shadow-soft">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-100">
              <BookOpen className="h-5 w-5 text-rose-500" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">오답노트</p>
              <p className="text-xs text-gray-500">틀린 문제를 다시 풀어보세요</p>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-gray-400" />
        </div>
      </Link>
    </div>
  )
}
