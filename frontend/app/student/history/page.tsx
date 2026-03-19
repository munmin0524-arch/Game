'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Award,
  Calendar,
  Clock,
  ChevronRight,
  Gamepad2,
  Lightbulb,
  BookOpen,
  Trophy,
  BarChart3,
  Check,
  Lock,
  TrendingDown,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

/* ---------- types ---------- */

type SessionType = 'game' | 'recommended' | 'wrong_note'

interface GameSession {
  id: string
  type: SessionType
  gameMode: string | null
  gameEmoji: string | null
  gameName: string
  subject: string | null
  unit: string | null
  correct: number
  total: number
  accuracy: number
  result: string
  jelly: number
}

interface DayHistory {
  date: string
  sessions: GameSession[]
}

/* ---------- mock data ---------- */

const MOCK_STATS = [
  { label: '총문제', value: '142' },
  { label: '정답률', value: '72%' },
  { label: '출석', value: '15일' },
  { label: '학습시간', value: '8h' },
]

const MOCK_BADGES = [
  { emoji: '🏆', name: '첫 승리', earned: true, color: 'bg-yellow-100' },
  { emoji: '🎯', name: '정답왕', earned: true, color: 'bg-blue-100' },
  { emoji: '🔥', name: '연속 출석', earned: true, color: 'bg-red-100' },
  { emoji: '💎', name: '전과목 마스터', earned: false, color: 'bg-gray-100' },
  { emoji: '🚀', name: '스피드 퀴즈', earned: false, color: 'bg-gray-100' },
  { emoji: '🌟', name: '올클리어', earned: false, color: 'bg-gray-100' },
]

// March 2026 attendance days
const ATTENDED_DAYS = new Set([1, 2, 3, 5, 6, 7, 10, 11, 12, 14, 15, 17, 18, 19])

const MOCK_HISTORY: DayHistory[] = [
  {
    date: '2026-03-19',
    sessions: [
      {
        id: 's1',
        type: 'game',
        gameMode: 'tug_of_war',
        gameEmoji: '🪢',
        gameName: '줄다리기',
        subject: '과학',
        unit: '마찰력',
        correct: 8,
        total: 10,
        accuracy: 80,
        result: 'win',
        jelly: 3,
      },
      {
        id: 's2',
        type: 'recommended',
        gameMode: null,
        gameEmoji: null,
        gameName: '혼자풀기',
        subject: '수학',
        unit: '일차방정식',
        correct: 6,
        total: 10,
        accuracy: 60,
        result: 'complete',
        jelly: 1,
      },
      {
        id: 's3',
        type: 'wrong_note',
        gameMode: null,
        gameEmoji: null,
        gameName: '오답복습',
        subject: null,
        unit: null,
        correct: 4,
        total: 5,
        accuracy: 80,
        result: 'complete',
        jelly: 2,
      },
    ],
  },
  {
    date: '2026-03-18',
    sessions: [
      {
        id: 's4',
        type: 'game',
        gameMode: 'boat_racing',
        gameEmoji: '🚤',
        gameName: '보트레이싱',
        subject: '과학',
        unit: '탄성력',
        correct: 7,
        total: 10,
        accuracy: 70,
        result: 'lose',
        jelly: 1,
      },
    ],
  },
]

const MOCK_LEARNING_MAP: Record<
  string,
  { unit: string; mastery: number | null; message: string }[]
> = {
  과학: [
    { unit: '마찰력', mastery: 40, message: '조금만 더 해보자!' },
    { unit: '탄성력', mastery: null, message: '아직 안 배웠어요' },
    { unit: '중력', mastery: 92, message: '잘하고 있어요!' },
    { unit: '부력', mastery: 35, message: '복습이 필요해요' },
  ],
  수학: [
    { unit: '일차방정식', mastery: 68, message: '꾸준히 하고 있어요' },
    { unit: '부등식', mastery: 45, message: '조금만 더!' },
    { unit: '함수', mastery: null, message: '아직 안 배웠어요' },
  ],
}

const FILTER_OPTIONS = [
  { key: 'all', label: '전체' },
  { key: 'game', label: '🎮일반' },
  { key: 'recommended', label: '💡추천' },
  { key: 'wrong_note', label: '📖오답' },
]

/* ---------- helpers ---------- */

function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  const today = new Date('2026-03-19')
  const yesterday = new Date('2026-03-18')
  const month = d.getMonth() + 1
  const day = d.getDate()
  if (d.toDateString() === today.toDateString()) return `${month}월 ${day}일 (오늘)`
  if (d.toDateString() === yesterday.toDateString()) return `${month}월 ${day}일 (어제)`
  return `${month}월 ${day}일`
}

function typeIcon(type: SessionType) {
  switch (type) {
    case 'game':
      return '🎮'
    case 'recommended':
      return '💡'
    case 'wrong_note':
      return '📖'
  }
}

function resultLabel(result: string) {
  switch (result) {
    case 'win':
      return <span className="font-semibold text-green-600">승리</span>
    case 'lose':
      return <span className="font-semibold text-red-500">패배</span>
    default:
      return <span className="font-semibold text-blue-600">완료</span>
  }
}

function getMasteryColor(mastery: number | null): string {
  if (mastery === null) return 'bg-gray-300'
  if (mastery >= 85) return 'bg-green-500'
  if (mastery >= 65) return 'bg-blue-500'
  if (mastery >= 40) return 'bg-yellow-400'
  return 'bg-red-400'
}

function getMasteryEmoji(mastery: number | null): string {
  if (mastery === null) return '🆕'
  if (mastery >= 85) return '🟢'
  if (mastery >= 65) return '🔵'
  if (mastery >= 40) return '🟡'
  return '🔴'
}

/* ---------- calendar helper ---------- */

function getMarchCalendar() {
  // March 2026 starts on Sunday (day 0)
  const firstDayOfWeek = new Date(2026, 2, 1).getDay() // 0=Sun
  const daysInMonth = 31
  const weeks: (number | null)[][] = []
  let currentWeek: (number | null)[] = Array(firstDayOfWeek).fill(null)

  for (let day = 1; day <= daysInMonth; day++) {
    currentWeek.push(day)
    if (currentWeek.length === 7) {
      weeks.push(currentWeek)
      currentWeek = []
    }
  }
  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) currentWeek.push(null)
    weeks.push(currentWeek)
  }
  return weeks
}

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토']

/* ---------- component ---------- */

export default function HistoryPage() {
  const [activeFilter, setActiveFilter] = useState('all')
  const [activeSubject, setActiveSubject] = useState('과학')

  const filteredHistory = MOCK_HISTORY.map((day) => ({
    ...day,
    sessions:
      activeFilter === 'all'
        ? day.sessions
        : day.sessions.filter((s) => s.type === activeFilter),
  })).filter((day) => day.sessions.length > 0)

  const calendarWeeks = getMarchCalendar()
  const today = 19

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <h1 className="text-xl font-bold text-gray-900">학습이력</h1>

      {/* ===== 1. Medal + Stats Bar ===== */}
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        {/* Medal row */}
        <div className="flex items-end justify-center gap-6 mb-4">
          <div className="flex flex-col items-center">
            <span className="text-3xl opacity-60">🥉</span>
            <span className="mt-1 text-xs text-gray-400">브론즈</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="rounded-full ring-4 ring-blue-300 p-1 scale-125">
              <span className="text-4xl">🥈</span>
            </div>
            <span className="mt-2 text-xs font-bold text-blue-600">실버</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-3xl opacity-40">🥇</span>
            <span className="mt-1 text-xs text-gray-400">골드</span>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-4 divide-x divide-gray-200">
          {MOCK_STATS.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center py-2">
              <span className="text-lg font-bold text-gray-900">{stat.value}</span>
              <span className="text-[11px] text-gray-500">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ===== 2. 업적 뱃지 ===== */}
      <section>
        <h2 className="mb-3 text-lg font-bold text-gray-900">🏅 업적 뱃지</h2>
        <div className="overflow-x-auto pb-1">
          <div className="flex gap-2">
            {MOCK_BADGES.map((badge) => (
              <div
                key={badge.name}
                className={`relative flex w-[70px] h-20 flex-shrink-0 flex-col items-center justify-center rounded-xl ${
                  badge.earned ? badge.color : 'bg-gray-100'
                }`}
              >
                {!badge.earned && (
                  <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-gray-200/50">
                    <Lock className="h-4 w-4 text-gray-400" />
                  </div>
                )}
                <span className={`text-2xl ${badge.earned ? '' : 'grayscale opacity-40'}`}>
                  {badge.emoji}
                </span>
                <span
                  className={`mt-1 text-[10px] font-medium leading-tight text-center ${
                    badge.earned ? 'text-gray-800' : 'text-gray-400'
                  }`}
                >
                  {badge.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 3. 출석 캘린더 ===== */}
      <section>
        <h2 className="mb-3 text-lg font-bold text-gray-900">📅 출석 캘린더</h2>
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <p className="mb-3 text-center text-sm font-semibold text-gray-700">2026년 3월</p>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-1 mb-1">
            {WEEKDAYS.map((wd, i) => (
              <div
                key={wd}
                className={`text-center text-[11px] font-medium ${
                  i === 0 ? 'text-red-400' : i === 6 ? 'text-blue-400' : 'text-gray-400'
                }`}
              >
                {wd}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="space-y-1">
            {calendarWeeks.map((week, wi) => (
              <div key={wi} className="grid grid-cols-7 gap-1">
                {week.map((day, di) => (
                  <div
                    key={di}
                    className={`relative flex h-9 items-center justify-center rounded-lg text-sm ${
                      day === null
                        ? ''
                        : day === today
                        ? 'bg-blue-600 text-white font-bold'
                        : ATTENDED_DAYS.has(day)
                        ? 'bg-blue-50 text-blue-700 font-medium'
                        : 'text-gray-400'
                    }`}
                  >
                    {day !== null && (
                      <>
                        {day}
                        {ATTENDED_DAYS.has(day) && day !== today && (
                          <span className="absolute bottom-0.5 h-1.5 w-1.5 rounded-full bg-blue-400" />
                        )}
                        {day === today && (
                          <span className="absolute bottom-0.5 h-1.5 w-1.5 rounded-full bg-white" />
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Attendance button */}
          <button
            disabled
            className="mt-3 w-full rounded-xl bg-green-100 py-2.5 text-sm font-semibold text-green-700 cursor-not-allowed"
          >
            오늘 출석하기 ✅ 완료
          </button>
        </div>
      </section>

      {/* ===== 4. 학습 이력 ===== */}
      <section>
        <h2 className="mb-3 text-lg font-bold text-gray-900">📋 학습 이력</h2>

        {/* Filter pills */}
        <div className="mb-3 flex items-center gap-2 overflow-x-auto">
          {FILTER_OPTIONS.map((f) => (
            <button
              key={f.key}
              onClick={() => setActiveFilter(f.key)}
              className={`whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                activeFilter === f.key
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Scrollable session list */}
        <div className="max-h-[300px] overflow-y-auto space-y-4 rounded-2xl bg-gray-50 p-3">
          {filteredHistory.length === 0 && (
            <p className="py-8 text-center text-sm text-gray-400">해당 유형의 이력이 없어요</p>
          )}

          {filteredHistory.map((day) => (
            <div key={day.date}>
              {/* Date divider */}
              <div className="mb-2 flex items-center gap-2">
                <div className="h-px flex-1 bg-gray-200" />
                <span className="text-xs font-semibold text-gray-500">{formatDate(day.date)}</span>
                <div className="h-px flex-1 bg-gray-200" />
              </div>

              <div className="space-y-2">
                {day.sessions.map((session) => (
                  <div key={session.id} className="rounded-xl bg-white p-3.5 shadow-sm">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900">
                          {typeIcon(session.type)}{' '}
                          {session.gameEmoji && `${session.gameEmoji} `}
                          {session.gameName}
                          {session.subject && (
                            <span className="text-gray-500">
                              {' '}| {session.subject} &gt; {session.unit}
                            </span>
                          )}
                          {!session.subject && session.type === 'wrong_note' && (
                            <span className="text-gray-500"> | {session.total}문제 완료</span>
                          )}
                        </p>
                        <p className="mt-1 text-sm text-gray-600">
                          {session.correct}/{session.total} 정답 {session.accuracy}%{' '}
                          {resultLabel(session.result)}{' '}
                          <span className="font-semibold text-amber-600">🍬+{session.jelly}</span>
                        </p>
                      </div>
                      <Link
                        href={`/student/game-result/${session.id}?from=history`}
                        className="ml-3 flex items-center gap-0.5 whitespace-nowrap text-sm font-medium text-blue-600 hover:text-blue-700"
                      >
                        상세보기
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== 5. 학습맵 ===== */}
      <section>
        <h2 className="mb-3 text-lg font-bold text-gray-900">🗺️ 학습맵</h2>

        {/* Subject tabs */}
        <div className="mb-3 flex gap-2">
          {Object.keys(MOCK_LEARNING_MAP).map((subject) => (
            <button
              key={subject}
              onClick={() => setActiveSubject(subject)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                activeSubject === subject
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {subject}
            </button>
          ))}
        </div>

        {/* Unit mastery list */}
        <div className="max-h-[280px] overflow-y-auto space-y-2 rounded-2xl bg-gray-50 p-3">
          {(MOCK_LEARNING_MAP[activeSubject] ?? []).map((unit) => {
            const isWeak = unit.mastery !== null && unit.mastery < 40
            const isUnlearned = unit.mastery === null
            const showAction = isWeak || isUnlearned

            return (
              <div
                key={unit.unit}
                className="flex items-center gap-3 rounded-xl bg-white p-4 shadow-sm"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-semibold text-gray-900">{unit.unit}</p>
                      {isWeak && <span className="text-xs">⚠️</span>}
                      {isUnlearned && <span className="text-xs">🆕</span>}
                    </div>
                    <span className="text-sm font-medium text-gray-500">
                      {unit.mastery !== null ? `${unit.mastery}%` : '--'}
                    </span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-200">
                    <div
                      className={`h-full rounded-full transition-all ${getMasteryColor(unit.mastery)}`}
                      style={{ width: `${unit.mastery ?? 0}%` }}
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    {getMasteryEmoji(unit.mastery)} {unit.message}
                  </p>
                </div>

                {showAction && (
                  <Link href="/student/learn">
                    <Button variant="outline" size="sm" className="whitespace-nowrap text-xs">
                      학습하기
                      <ChevronRight className="ml-1 h-3 w-3" />
                    </Button>
                  </Link>
                )}
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
