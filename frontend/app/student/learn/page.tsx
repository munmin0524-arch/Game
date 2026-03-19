'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  BookOpen,
  ChevronRight,
  Candy,
  Gamepad2,
  Lightbulb,
  TrendingDown,
  Trophy,
  BarChart3,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

// ── Mock data ──
const MOCK_WRONG_COUNT = 7

const GAME_TYPES = [
  { key: 'tug_of_war', label: '줄다리기', emoji: '🪢', gradient: 'from-red-500 to-orange-500', border: 'border-red-200', activeBorder: 'border-red-500', activeBg: 'bg-red-50' },
  { key: 'boat_racing', label: '보트', emoji: '🚤', gradient: 'from-blue-500 to-cyan-500', border: 'border-blue-200', activeBorder: 'border-blue-500', activeBg: 'bg-blue-50' },
  { key: 'kickboard', label: '킥보드', emoji: '🛴', gradient: 'from-green-500 to-emerald-500', border: 'border-green-200', activeBorder: 'border-green-500', activeBg: 'bg-green-50' },
  { key: 'balloon', label: '풍선', emoji: '🎈', gradient: 'from-purple-500 to-pink-500', border: 'border-purple-200', activeBorder: 'border-purple-500', activeBg: 'bg-purple-50' },
]

const SUBJECTS = ['과학', '수학']
const UNITS: Record<string, string[]> = {
  과학: ['여러 가지 힘', '물질의 상태 변화'],
  수학: ['일차방정식', '함수'],
}
const SUB_UNITS: Record<string, string[]> = {
  '여러 가지 힘': ['마찰력', '탄성력', '중력'],
  '물질의 상태 변화': ['고체→액체', '액체→기체', '상태 변화와 에너지'],
  일차방정식: ['이항', '일차방정식의 풀이', '일차방정식의 활용'],
  함수: ['함수의 뜻', '함수의 그래프', '일차함수'],
}

const RECOMMENDATIONS = [
  { type: 'unlearned' as const, emoji: '💡', unit: '탄성력', subject: '과학', reason: '아직 안 배웠어요' },
  { type: 'weak' as const, emoji: '📊', unit: '마찰력', subject: '과학', reason: '정답률 30%', rate: 30 },
]

export default function StudentLearnPage() {
  const router = useRouter()
  const [gameType, setGameType] = useState('tug_of_war')
  const [subject, setSubject] = useState('')
  const [unit, setUnit] = useState('')
  const [subUnit, setSubUnit] = useState('')

  const unitOptions = subject ? (UNITS[subject] ?? []) : []
  const subUnitOptions = unit ? (SUB_UNITS[unit] ?? []) : []
  const selectedGame = GAME_TYPES.find((g) => g.key === gameType)!
  const canStart = subject && unit

  function handleStart() {
    if (!canStart) return
    router.push(
      `/student/game-play/${Date.now()}?mode=npc&game=${gameType}&subject=${subject}&unit=${unit}&sub=${subUnit}`,
    )
  }

  function handleRecommendStart(rec: (typeof RECOMMENDATIONS)[0]) {
    router.push(
      `/student/game-play/${Date.now()}?mode=npc&game=${gameType}&subject=${rec.subject}&unit=${rec.unit}`,
    )
  }

  return (
    <div className="space-y-6 pb-6">
      {/* ── 1. Wrong notes CTA banner ── */}
      <Link
        href="/student/wrong-notes"
        className="group flex w-full items-center justify-between rounded-2xl bg-amber-50 border border-amber-200 px-4 py-3 hover:bg-amber-100 transition"
      >
        <div className="flex items-center gap-2.5">
          <BookOpen className="h-5 w-5 text-amber-600" />
          <span className="text-sm font-semibold text-amber-700">
            오늘 복습 {MOCK_WRONG_COUNT}문제
          </span>
        </div>
        <div className="flex items-center gap-1 text-sm font-semibold text-amber-600">
          풀기
          <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
        </div>
      </Link>

      {/* ── 2. 나만의 게임 section ── */}
      <section className="rounded-2xl bg-white border border-gray-100 p-5 shadow-sm">
        <h2 className="mb-4 text-base font-bold text-gray-800">나만의 게임</h2>

        {/* Game type grid (4 cols) */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          {GAME_TYPES.map((g) => {
            const isActive = gameType === g.key
            return (
              <button
                key={g.key}
                onClick={() => setGameType(g.key)}
                className={`relative flex flex-col items-center gap-1.5 rounded-2xl border-2 p-3 transition-all ${
                  isActive
                    ? `${g.activeBorder} ${g.activeBg} shadow-sm`
                    : `${g.border} bg-white hover:shadow-sm`
                }`}
              >
                <span className="text-2xl">{g.emoji}</span>
                <span className={`text-[11px] font-semibold ${isActive ? 'text-gray-800' : 'text-gray-500'}`}>
                  {g.label}
                </span>
                {isActive && (
                  <div className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600">
                    <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </button>
            )
          })}
        </div>

        {/* Unit selection: 3 cascading selects */}
        <div className="space-y-2 mb-4">
          <select
            value={subject}
            onChange={(e) => { setSubject(e.target.value); setUnit(''); setSubUnit('') }}
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
          >
            <option value="">과목 선택</option>
            {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>

          <div className="grid grid-cols-2 gap-2">
            <select
              value={unit}
              onChange={(e) => { setUnit(e.target.value); setSubUnit('') }}
              disabled={!subject}
              className="rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm text-gray-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 disabled:opacity-40 transition"
            >
              <option value="">대단원</option>
              {unitOptions.map((u) => <option key={u} value={u}>{u}</option>)}
            </select>
            <select
              value={subUnit}
              onChange={(e) => setSubUnit(e.target.value)}
              disabled={!unit}
              className="rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm text-gray-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 disabled:opacity-40 transition"
            >
              <option value="">중단원</option>
              {subUnitOptions.map((su) => <option key={su} value={su}>{su}</option>)}
            </select>
          </div>
        </div>

        {/* Expected rewards card */}
        <div className="rounded-xl bg-amber-50 border border-amber-100 p-4 mb-4">
          <div className="flex items-center gap-1.5 mb-3">
            <Candy className="h-4 w-4 text-amber-500" />
            <span className="text-xs font-bold text-amber-700">예상 보상</span>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 text-xs text-amber-700">
              <Gamepad2 className="h-3.5 w-3.5 text-amber-500 flex-shrink-0" />
              <span>게임 완료 시 <span className="font-bold">+1</span></span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-amber-700">
              <Trophy className="h-3.5 w-3.5 text-amber-500 flex-shrink-0" />
              <span>NPC 승리 시 <span className="font-bold">+2</span></span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-amber-700">
              <BarChart3 className="h-3.5 w-3.5 text-amber-500 flex-shrink-0" />
              <span>정답률 80% 이상 <span className="font-bold">+2</span></span>
            </div>
          </div>
        </div>

        {/* Start button */}
        <button
          onClick={handleStart}
          disabled={!canStart}
          className={`group w-full rounded-2xl p-5 text-left text-white transition-all ${
            canStart
              ? `bg-gradient-to-br ${selectedGame.gradient} shadow-lg hover:shadow-xl`
              : 'bg-gray-300 cursor-not-allowed'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Gamepad2 className="h-6 w-6" />
              <span className="text-lg font-bold">게임 시작하기</span>
            </div>
            <ChevronRight className="h-5 w-5 opacity-60 group-hover:translate-x-1 transition-transform" />
          </div>
          {canStart ? (
            <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-white/80">
              <span>{subject} &gt; {subUnit || unit}</span>
              <span>·</span>
              <span>{selectedGame.emoji} {selectedGame.label}</span>
              <span>·</span>
              <span>10문제</span>
              <span>·</span>
              <span>NPC 대전</span>
            </div>
          ) : (
            <p className="mt-1 text-sm text-white/60">과목과 단원을 선택해주세요</p>
          )}
        </button>
      </section>

      {/* ── 3. 추천 학습 section (violet bg) ── */}
      <section className="bg-violet-50 rounded-2xl p-5">
        <h2 className="mb-4 text-base font-bold text-violet-800">추천 학습</h2>
        <div className="space-y-3">
          {RECOMMENDATIONS.map((rec) => (
            <button
              key={rec.unit}
              onClick={() => handleRecommendStart(rec)}
              className="group flex w-full items-center justify-between rounded-2xl border border-violet-100 bg-white p-4 text-left shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{rec.emoji}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-gray-900">
                      {rec.subject} &gt; {rec.unit}
                    </p>
                    {rec.type === 'unlearned' && (
                      <span className="rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-bold text-violet-600">
                        NEW
                      </span>
                    )}
                    {rec.type === 'weak' && rec.rate !== undefined && (
                      <span className="flex items-center gap-0.5 rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-bold text-red-500">
                        <TrendingDown className="h-3 w-3" />
                        {rec.rate}%
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">{rec.reason}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-sm font-semibold text-violet-600">
                바로 시작
                <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </button>
          ))}
        </div>
      </section>
    </div>
  )
}
