// 학습 탭 — 게임 모드 선택 + 오답노트 복습
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { BookOpen, Gamepad2, Zap, Brain, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

// --- Mock data ---
const MOCK_WRONG_COUNT = 7

const SUBJECTS = ['과학', '수학']
const UNITS: Record<string, string[]> = {
  과학: ['여러 가지 힘', '물질의 상태 변화'],
  수학: [],
}
const SUB_UNITS: Record<string, string[]> = {
  '여러 가지 힘': ['마찰력', '탄성력', '중력'],
  '물질의 상태 변화': [],
}

const GAME_TYPES = [
  { key: 'tug_of_war', label: '줄다리기', emoji: '🪢', gradient: 'from-red-400 to-orange-400' },
  { key: 'boat_racing', label: '보트레이싱', emoji: '🚤', gradient: 'from-blue-400 to-cyan-400' },
  { key: 'kickboard', label: '킥보드', emoji: '🛴', gradient: 'from-green-400 to-emerald-400' },
  { key: 'balloon', label: '풍선날리기', emoji: '🎈', gradient: 'from-purple-400 to-pink-400' },
]

type Mode = 'npc' | 'solo'

export default function StudentLearnPage() {
  const router = useRouter()
  const [mode, setMode] = useState<Mode>('npc')
  const [subject, setSubject] = useState('')
  const [unit, setUnit] = useState('')
  const [subUnit, setSubUnit] = useState('')

  const unitOptions = subject ? (UNITS[subject] ?? []) : []
  const subUnitOptions = unit ? (SUB_UNITS[unit] ?? []) : []

  function handleAutoMatch() {
    router.push(`/student/game-play/${Date.now()}?mode=${mode}`)
  }

  function handleManualStart() {
    if (!subject || !unit) return
    router.push(
      `/student/game-play/${Date.now()}?mode=${mode}&subject=${subject}&unit=${unit}&sub=${subUnit}`
    )
  }

  return (
    <div className="space-y-6">
      {/* ---------- 오답노트 복습 CTA ---------- */}
      <button
        onClick={() => router.push('/student/wrong-notes')}
        className="w-full rounded-2xl bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 p-4 text-left shadow-soft transition hover:shadow-md"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
              <BookOpen className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">
                오늘 복습할 문제 <span className="text-amber-600">{MOCK_WRONG_COUNT}개</span>
              </p>
              <p className="text-xs text-gray-500">틀린 문제를 다시 풀어보세요</p>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-gray-400" />
        </div>
      </button>

      {/* ---------- 게임 모드 선택 ---------- */}
      <div>
        <h2 className="mb-3 text-base font-bold text-gray-900">게임 모드 선택</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setMode('npc')}
            className={`flex-1 rounded-xl px-4 py-3 text-sm font-semibold transition ${
              mode === 'npc'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Gamepad2 className="mr-1.5 inline h-4 w-4" />
            NPC 대전
          </button>
          <button
            onClick={() => setMode('solo')}
            className={`flex-1 rounded-xl px-4 py-3 text-sm font-semibold transition ${
              mode === 'solo'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Brain className="mr-1.5 inline h-4 w-4" />
            혼자 풀기
          </button>
        </div>
      </div>

      {/* ---------- 자동 매칭 ---------- */}
      <div className="rounded-2xl bg-white p-5 shadow-soft">
        <div className="flex items-center gap-2 text-gray-500">
          <Zap className="h-4 w-4 text-yellow-500" />
          <span className="text-xs font-medium">자동 매칭</span>
        </div>
        <h3 className="mt-2 text-base font-bold text-gray-900">추천 단원으로 바로 시작</h3>
        <p className="mt-1 text-sm text-gray-500">
          AI가 취약 단원을 분석하여 최적의 문제를 추천합니다.
        </p>
        <Button onClick={handleAutoMatch} className="mt-4 w-full" size="lg">
          바로 시작하기
        </Button>
      </div>

      {/* ---------- 직접 선택 ---------- */}
      <div className="rounded-2xl bg-white p-5 shadow-soft">
        <h3 className="text-base font-bold text-gray-900">직접 선택</h3>
        <div className="mt-4 space-y-3">
          {/* 과목 */}
          <select
            value={subject}
            onChange={(e) => {
              setSubject(e.target.value)
              setUnit('')
              setSubUnit('')
            }}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          >
            <option value="">과목 선택</option>
            {SUBJECTS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          {/* 대단원 */}
          <select
            value={unit}
            onChange={(e) => {
              setUnit(e.target.value)
              setSubUnit('')
            }}
            disabled={!subject}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 disabled:opacity-50"
          >
            <option value="">대단원 선택</option>
            {unitOptions.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>

          {/* 중단원 */}
          <select
            value={subUnit}
            onChange={(e) => setSubUnit(e.target.value)}
            disabled={!unit}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 disabled:opacity-50"
          >
            <option value="">중단원 선택</option>
            {subUnitOptions.map((su) => (
              <option key={su} value={su}>
                {su}
              </option>
            ))}
          </select>

          <Button
            onClick={handleManualStart}
            disabled={!subject || !unit}
            className="w-full"
            size="lg"
          >
            게임 시작하기
          </Button>
        </div>
      </div>

      {/* ---------- 게임 종류 (NPC 모드일 때만) ---------- */}
      {mode === 'npc' && (
        <div>
          <h3 className="mb-3 text-base font-bold text-gray-900">게임 종류</h3>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {GAME_TYPES.map((g) => (
              <div
                key={g.key}
                className={`flex-shrink-0 w-32 rounded-2xl bg-gradient-to-br ${g.gradient} p-4 text-white shadow-sm`}
              >
                <span className="text-3xl">{g.emoji}</span>
                <p className="mt-2 text-sm font-bold">{g.label}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
