'use client'

import { useState } from 'react'
import { Star, Check, Lock, ChevronDown, ChevronUp, Gift, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

/* ---------- mock data ---------- */

const MOCK_MISSIONS = [
  { label: '오늘 출석하기', amount: 1, completed: true, current: 1, target: 1 },
  { label: '게임 1판 완료', amount: 1, completed: false, current: 0, target: 1 },
  { label: '게임 종류 4종 다하기', amount: 3, completed: false, current: 2, target: 4 },
  { label: '10문제 풀기', amount: 1, completed: false, current: 3, target: 10 },
  { label: '30문제 풀기', amount: 2, completed: false, current: 3, target: 30 },
  { label: '정답률 80% 이상', amount: 2, completed: true, current: 85, target: 80 },
  { label: '오답 복습 완료', amount: 2, completed: false, current: 0, target: 1 },
  { label: '게임 승리', amount: 2, completed: false, current: 0, target: 1 },
]

const MOCK_CHARACTERS = [
  { name: '레서', emoji: '🐕', unlocked: true, active: true },
  { name: '팬더', emoji: '🐼', unlocked: true, active: false },
  { name: '덤덤', emoji: '🐻', unlocked: true, active: false },
  { name: '???', emoji: '🔒', unlocked: false, active: false, cost: 10 },
]

const MOCK_COSMETICS = {
  모자: [
    { emoji: '👑', cost: 5, owned: true },
    { emoji: '🎀', cost: 5, owned: false },
    { emoji: '🎩', cost: 5, owned: false },
  ],
  배경: [
    { emoji: '🌲', cost: 3, owned: true },
    { emoji: '🌊', cost: 3, owned: false },
    { emoji: '🌅', cost: 3, owned: false },
  ],
  이펙트: [
    { emoji: '✨', cost: 8, owned: false },
    { emoji: '💕', cost: 8, owned: false },
  ],
}

const MOCK_JELLY_HISTORY = [
  {
    date: '3월 19일 (오늘)',
    items: [
      { label: '게임 승리', amount: 3 },
      { label: '출석', amount: 1 },
    ],
  },
  {
    date: '3월 18일 (어제)',
    items: [
      { label: '정답률 80%', amount: 2 },
      { label: '오답복습', amount: 2 },
      { label: '캐릭터 초대', amount: -10 },
    ],
  },
  {
    date: '3월 17일',
    items: [
      { label: '게임 완료', amount: 1 },
      { label: '출석', amount: 1 },
      { label: '10문제 풀기', amount: 1 },
    ],
  },
  {
    date: '3월 16일',
    items: [
      { label: '게임 승리', amount: 3 },
      { label: '오답복습', amount: 2 },
    ],
  },
  {
    date: '3월 15일',
    items: [
      { label: '출석', amount: 1 },
      { label: '7일 연속 출석', amount: 5 },
    ],
  },
]

const JELLY_BALANCE = 24

/* ---------- component ---------- */

export default function RewardsPage() {
  const [activeCharIdx, setActiveCharIdx] = useState(0)
  const [expandedDays, setExpandedDays] = useState<Set<string>>(new Set())
  const [showAllHistory, setShowAllHistory] = useState(false)

  const todayEarned = MOCK_JELLY_HISTORY[0]?.items.reduce((sum, i) => sum + Math.max(0, i.amount), 0) ?? 0

  const toggleDay = (date: string) => {
    setExpandedDays((prev) => {
      const next = new Set(prev)
      if (next.has(date)) next.delete(date)
      else next.add(date)
      return next
    })
  }

  const visibleHistory = showAllHistory ? MOCK_JELLY_HISTORY : MOCK_JELLY_HISTORY.slice(0, 3)

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <h1 className="text-xl font-bold text-gray-900">보상·꾸미기</h1>

      {/* 곰젤리 잔액 카드 */}
      <div className="rounded-2xl bg-amber-100 p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-amber-700">곰젤리 잔액</p>
            <p className="mt-1 text-3xl font-extrabold text-amber-600">🍬 {JELLY_BALANCE}개</p>
            <p className="mt-1 text-sm text-amber-600/80">오늘 <span className="font-bold text-green-600">+{todayEarned}</span> 획득</p>
          </div>
          <Gift className="h-10 w-10 text-amber-400" />
        </div>
      </div>

      {/* 젤리 더 받기 (일일 미션) */}
      <section>
        <h2 className="mb-3 text-lg font-bold text-gray-900">젤리 더 받기</h2>
        <div className="space-y-2">
          {MOCK_MISSIONS.map((mission, idx) => (
            <div
              key={idx}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 ${
                mission.completed ? 'bg-green-50' : 'bg-white shadow-sm'
              }`}
            >
              {/* checkbox icon */}
              <span className="text-lg">{mission.completed ? '✅' : '⬜'}</span>

              {/* label + progress */}
              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm font-medium ${
                    mission.completed ? 'text-green-700 line-through' : 'text-gray-800'
                  }`}
                >
                  {mission.label}
                </p>
                <div className="mt-1 flex items-center gap-2">
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-200">
                    <div
                      className={`h-full rounded-full transition-all ${
                        mission.completed ? 'bg-green-500' : 'bg-blue-500'
                      }`}
                      style={{
                        width: `${Math.min(100, (mission.current / mission.target) * 100)}%`,
                      }}
                    />
                  </div>
                  <span className="whitespace-nowrap text-xs text-gray-500">
                    {mission.current}/{mission.target}
                  </span>
                </div>
              </div>

              {/* reward */}
              <span className="whitespace-nowrap text-sm font-bold text-amber-600">
                +{mission.amount}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 캐릭터 */}
      <section>
        <h2 className="mb-3 text-lg font-bold text-gray-900">캐릭터</h2>
        <div className="flex gap-3 overflow-x-auto pb-1">
          {MOCK_CHARACTERS.map((char, idx) => (
            <div
              key={idx}
              onClick={() => char.unlocked && setActiveCharIdx(idx)}
              className={`relative flex w-20 flex-shrink-0 cursor-pointer flex-col items-center rounded-2xl border-2 p-3 transition-colors ${
                idx === activeCharIdx
                  ? 'border-green-500 bg-green-50'
                  : char.unlocked
                  ? 'border-gray-200 bg-white hover:border-gray-300'
                  : 'border-dashed border-gray-300 bg-gray-50'
              }`}
            >
              {idx === activeCharIdx && (
                <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-[10px] text-white">
                  <Check className="h-3 w-3" />
                </span>
              )}
              <span className="text-3xl">{char.emoji}</span>
              <span className="mt-1 text-xs font-semibold text-gray-700">{char.name}</span>
              {!char.unlocked && (
                <button className="mt-1 whitespace-nowrap rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
                  🍬{char.cost} 초대하기
                </button>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 꾸미기 */}
      <section>
        <h2 className="mb-3 text-lg font-bold text-gray-900">꾸미기</h2>
        <div className="space-y-4">
          {Object.entries(MOCK_COSMETICS).map(([category, items]) => (
            <div key={category}>
              <h3 className="mb-2 text-sm font-semibold text-gray-600">{category}</h3>
              <div className="flex flex-wrap gap-3">
                {items.map((item, idx) => (
                  <div
                    key={idx}
                    className={`flex h-20 w-20 flex-col items-center justify-center rounded-xl border-2 transition-colors ${
                      item.owned
                        ? 'border-green-400 bg-green-50'
                        : 'border-gray-200 bg-white hover:border-amber-300'
                    }`}
                  >
                    <span className="text-2xl">{item.emoji}</span>
                    {item.owned ? (
                      <span className="mt-1 text-[10px] font-semibold text-green-600">보유중</span>
                    ) : (
                      <span className="mt-1 text-[10px] font-bold text-amber-600">
                        🍬{item.cost}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 획득 히스토리 */}
      <section>
        <h2 className="mb-3 text-lg font-bold text-gray-900">획득 히스토리</h2>
        <div className="space-y-2">
          {visibleHistory.map((day) => {
            const dayTotal = day.items.reduce((s, i) => s + i.amount, 0)
            const isExpanded = expandedDays.has(day.date)
            return (
              <div key={day.date} className="rounded-xl bg-gray-50 overflow-hidden">
                {/* 날짜 헤더 — 클릭하면 펼치기 */}
                <button
                  onClick={() => toggleDay(day.date)}
                  className="flex w-full items-center justify-between px-4 py-3 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    {isExpanded ? (
                      <ChevronUp className="h-3.5 w-3.5 text-gray-400" />
                    ) : (
                      <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
                    )}
                    <span className="text-sm font-semibold text-gray-700">{day.date}</span>
                    {!isExpanded && (
                      <span className="text-xs text-gray-400">
                        {day.items.map((i) => i.label).join(', ')}
                      </span>
                    )}
                  </div>
                  <span
                    className={`text-sm font-bold ${
                      dayTotal >= 0 ? 'text-green-600' : 'text-red-500'
                    }`}
                  >
                    {dayTotal >= 0 ? `+${dayTotal}` : dayTotal}
                  </span>
                </button>

                {/* 펼쳐진 개별 항목 */}
                {isExpanded && (
                  <div className="border-t border-gray-100 px-4 py-2 space-y-1.5">
                    {day.items.map((item, i) => (
                      <div key={i} className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">{item.label}</span>
                        <span
                          className={`font-semibold ${
                            item.amount >= 0 ? 'text-green-600' : 'text-red-500'
                          }`}
                        >
                          {item.amount >= 0 ? `+${item.amount}` : item.amount}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}

          {/* 더보기 */}
          {!showAllHistory && MOCK_JELLY_HISTORY.length > 3 && (
            <button
              onClick={() => setShowAllHistory(true)}
              className="w-full rounded-xl border border-dashed border-gray-300 py-2.5 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-400 transition-colors"
            >
              이전 기록 더보기 ({MOCK_JELLY_HISTORY.length - 3}일)
            </button>
          )}
        </div>
      </section>
    </div>
  )
}
