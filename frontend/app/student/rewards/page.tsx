'use client'

import { useState } from 'react'
import { Star, Check, Lock, ChevronDown, ChevronUp, Gift, Sparkles, Candy } from 'lucide-react'

/* ---------- mock data ---------- */

const MOCK_MISSIONS = [
  { icon: '📅', label: '출석', amount: 1, completed: true },
  { icon: '🎮', label: '게임완료', amount: 1, completed: false },
  { icon: '🎯', label: '4종달성', amount: 3, completed: false, current: 2, target: 4 },
  { icon: '📝', label: '10문제', amount: 1, completed: false, current: 3, target: 10 },
  { icon: '🏆', label: '게임승리', amount: 2, completed: false },
  { icon: '📊', label: '80%이상', amount: 2, completed: true },
  { icon: '📖', label: '오답복습', amount: 2, completed: false },
  { icon: '💪', label: '30문제', amount: 2, completed: false, current: 3, target: 30 },
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

const MOCK_HISTORY = [
  { date: '3월 19일 (오늘)', items: [{ label: '게임 승리', amount: 3 }, { label: '출석', amount: 1 }] },
  { date: '3월 18일 (어제)', items: [{ label: '정답률 80%', amount: 2 }, { label: '오답복습', amount: 2 }, { label: '캐릭터 초대', amount: -10 }] },
  { date: '3월 17일', items: [{ label: '게임 완료', amount: 1 }, { label: '출석', amount: 1 }] },
  { date: '3월 16일', items: [{ label: '게임 승리', amount: 3 }] },
  { date: '3월 15일', items: [{ label: '7일 연속 출석', amount: 5 }] },
]

const JELLY_BALANCE = 24

/* ---------- component ---------- */

export default function RewardsPage() {
  const [activeCharIdx, setActiveCharIdx] = useState(0)
  const [showHistory, setShowHistory] = useState(false)
  const [expandedDays, setExpandedDays] = useState<Set<string>>(new Set())
  const [showAllMissions, setShowAllMissions] = useState(false)

  const todayEarned = MOCK_HISTORY[0]?.items.reduce((sum, i) => sum + Math.max(0, i.amount), 0) ?? 0
  const completedCount = MOCK_MISSIONS.filter((m) => m.completed).length
  const maxDailyJelly = MOCK_MISSIONS.reduce((sum, m) => sum + m.amount, 0) + 5 // +5 for bonus

  const toggleDay = (date: string) => {
    setExpandedDays((prev) => {
      const next = new Set(prev)
      if (next.has(date)) next.delete(date)
      else next.add(date)
      return next
    })
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <h1 className="text-xl font-bold text-gray-900">보상·꾸미기</h1>

      {/* ===== 1. Jelly Balance Card ===== */}
      <div className="rounded-2xl bg-amber-100 p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-amber-700">🍬 곰젤리</p>
            <p className="mt-1 text-3xl font-extrabold text-amber-600">{JELLY_BALANCE}개</p>
            <p className="mt-1 text-sm text-amber-600/80">
              오늘 <span className="font-bold text-green-600">+{todayEarned}</span> 획득
            </p>
          </div>
          <Gift className="h-10 w-10 text-amber-400" />
        </div>

        {/* Toggle history dropdown */}
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="mt-3 flex w-full items-center justify-center gap-1 rounded-xl bg-amber-200/60 py-2 text-sm font-medium text-amber-700 hover:bg-amber-200 transition-colors"
        >
          획득 내역 보기
          {showHistory ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>

        {/* History dropdown content */}
        {showHistory && (
          <div className="mt-3 max-h-[200px] overflow-y-auto rounded-xl bg-white/70 p-3 space-y-1.5">
            {MOCK_HISTORY.map((day) => {
              const dayTotal = day.items.reduce((s, i) => s + i.amount, 0)
              const isExpanded = expandedDays.has(day.date)
              return (
                <div key={day.date} className="rounded-lg bg-white overflow-hidden">
                  <button
                    onClick={() => toggleDay(day.date)}
                    className="flex w-full items-center justify-between px-3 py-2 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      {isExpanded ? (
                        <ChevronUp className="h-3 w-3 text-gray-400" />
                      ) : (
                        <ChevronDown className="h-3 w-3 text-gray-400" />
                      )}
                      <span className="text-xs font-semibold text-gray-700">{day.date}</span>
                    </div>
                    <span
                      className={`text-xs font-bold ${dayTotal >= 0 ? 'text-green-600' : 'text-red-500'}`}
                    >
                      {dayTotal >= 0 ? `+${dayTotal}` : dayTotal}
                    </span>
                  </button>

                  {isExpanded && (
                    <div className="border-t border-gray-100 px-3 py-1.5 space-y-1">
                      {day.items.map((item, i) => (
                        <div key={i} className="flex items-center justify-between text-xs">
                          <span className="text-gray-600">{item.label}</span>
                          <span
                            className={`font-semibold ${item.amount >= 0 ? 'text-green-600' : 'text-red-500'}`}
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
          </div>
        )}
      </div>

      {/* ===== 2. Section: 젤리 더 받기 ===== */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">🍬 젤리 더 받기</h2>
          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
            오늘 최대 +{maxDailyJelly} 획득 가능!
          </span>
        </div>

        {/* Horizontal scrollable mission cards */}
        <div className="overflow-x-auto pb-2">
          <div className="flex gap-3">
            {MOCK_MISSIONS.map((mission, idx) => (
              <div
                key={idx}
                className={`relative flex w-20 flex-shrink-0 flex-col items-center rounded-2xl p-2.5 transition-all ${
                  mission.completed
                    ? 'border-2 border-green-400 bg-green-50'
                    : 'border-2 border-gray-200 bg-white'
                }`}
                style={{ height: 100 }}
              >
                {/* Completed badge overlay */}
                {mission.completed && (
                  <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-white">
                    <Check className="h-3 w-3" />
                  </span>
                )}

                {/* Circle icon */}
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full ${
                    mission.completed ? 'bg-green-100' : 'bg-blue-100'
                  }`}
                >
                  <span className="text-lg">{mission.icon}</span>
                </div>

                {/* Mission label */}
                <span className="mt-1.5 text-center text-xs font-medium text-gray-700 leading-tight">
                  {mission.label}
                </span>

                {/* Reward amount */}
                <span className="mt-auto text-xs font-bold text-amber-600">+{mission.amount}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Expandable all missions list */}
        <button
          onClick={() => setShowAllMissions(!showAllMissions)}
          className="mt-2 flex w-full items-center justify-center gap-1 rounded-xl border border-dashed border-gray-300 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-400 transition-colors"
        >
          전체 미션 보기
          {showAllMissions ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>

        {showAllMissions && (
          <div className="mt-2 space-y-2">
            {MOCK_MISSIONS.map((mission, idx) => (
              <div
                key={idx}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 ${
                  mission.completed ? 'bg-green-50' : 'bg-white shadow-sm'
                }`}
              >
                <span className="text-lg">{mission.icon}</span>
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm font-medium ${
                      mission.completed ? 'text-green-700 line-through' : 'text-gray-800'
                    }`}
                  >
                    {mission.label}
                  </p>
                  {mission.target && (
                    <div className="mt-1 flex items-center gap-2">
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-200">
                        <div
                          className={`h-full rounded-full transition-all ${
                            mission.completed ? 'bg-green-500' : 'bg-blue-500'
                          }`}
                          style={{
                            width: `${Math.min(100, ((mission.current ?? 0) / mission.target) * 100)}%`,
                          }}
                        />
                      </div>
                      <span className="whitespace-nowrap text-xs text-gray-500">
                        {mission.current ?? 0}/{mission.target}
                      </span>
                    </div>
                  )}
                </div>
                <span className="whitespace-nowrap text-sm font-bold text-amber-600">
                  +{mission.amount}
                </span>
                {mission.completed && <Check className="h-4 w-4 text-green-500" />}
              </div>
            ))}
          </div>
        )}

        {/* Bonus card */}
        <div className="mt-3 rounded-2xl bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-amber-800">전체 달성 보너스 🍬+5</p>
              <p className="mt-1 text-xs text-amber-600">
                {completedCount}/{MOCK_MISSIONS.length} 달성 —{' '}
                {MOCK_MISSIONS.length - completedCount}개 남았어요!
              </p>
            </div>
            <Sparkles className="h-6 w-6 text-amber-400" />
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-amber-200">
            <div
              className="h-full rounded-full bg-amber-500 transition-all"
              style={{ width: `${(completedCount / MOCK_MISSIONS.length) * 100}%` }}
            />
          </div>
        </div>
      </section>

      {/* ===== 3. Section: 꾸미기 ===== */}
      <section className="rounded-2xl bg-violet-50 p-5">
        <h2 className="mb-4 text-lg font-bold text-gray-900">✨ 꾸미기</h2>

        {/* Characters */}
        <div className="mb-5">
          <h3 className="mb-2 text-sm font-semibold text-violet-700">캐릭터</h3>
          <div className="flex gap-3 overflow-x-auto pb-1">
            {MOCK_CHARACTERS.map((char, idx) => (
              <div
                key={idx}
                onClick={() => char.unlocked && setActiveCharIdx(idx)}
                className={`relative flex w-20 flex-shrink-0 cursor-pointer flex-col items-center rounded-2xl border-2 p-3 transition-colors ${
                  idx === activeCharIdx
                    ? 'border-violet-500 bg-violet-100'
                    : char.unlocked
                    ? 'border-gray-200 bg-white hover:border-violet-300'
                    : 'border-dashed border-gray-300 bg-gray-50'
                }`}
              >
                {idx === activeCharIdx && (
                  <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-violet-500 text-[10px] text-white">
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
        </div>

        {/* Cosmetics */}
        <div className="space-y-4">
          {Object.entries(MOCK_COSMETICS).map(([category, items]) => (
            <div key={category}>
              <h3 className="mb-2 text-sm font-semibold text-violet-700">{category}</h3>
              <div className="flex flex-wrap gap-3">
                {items.map((item, idx) => (
                  <div
                    key={idx}
                    className={`flex h-20 w-20 flex-col items-center justify-center rounded-xl border-2 transition-colors ${
                      item.owned
                        ? 'border-violet-400 bg-violet-100'
                        : 'border-gray-200 bg-white hover:border-amber-300'
                    }`}
                  >
                    <span className="text-2xl">{item.emoji}</span>
                    {item.owned ? (
                      <span className="mt-1 text-[10px] font-semibold text-violet-600">보유중</span>
                    ) : (
                      <span className="mt-1 text-[10px] font-bold text-amber-600">🍬{item.cost}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
