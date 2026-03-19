'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  BarChart3,
  Calendar,
  Clock,
  Award,
  ChevronRight,
  Gamepad2,
  Brain,
  BookOpen,
  Trophy,
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
  { label: '총 문제', value: '142', icon: BarChart3, color: 'bg-blue-100 text-blue-600' },
  { label: '정답률', value: '72%', icon: Trophy, color: 'bg-green-100 text-green-600' },
  { label: '출석', value: '15일', icon: Calendar, color: 'bg-purple-100 text-purple-600' },
  { label: '학습시간', value: '8h', icon: Clock, color: 'bg-amber-100 text-amber-600' },
]

const MOCK_HISTORY: DayHistory[] = [
  {
    date: '2026-03-19',
    sessions: [
      {
        id: 's1',
        type: 'game' as const,
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
        type: 'recommended' as const,
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
        type: 'wrong_note' as const,
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
        type: 'game' as const,
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

const MOCK_LEARNING_MAP = [
  { unit: '마찰력', mastery: 40, color: 'bg-yellow-400', emoji: '🟡', message: '조금만 더!' },
  {
    unit: '탄성력',
    mastery: 0,
    color: 'bg-gray-300',
    emoji: '⚪',
    message: '아직 안 배웠어요',
    unlearned: true,
  },
  { unit: '중력', mastery: 92, color: 'bg-green-500', emoji: '🟢', message: '잘하고 있어요!' },
]

const MOCK_BADGES = [
  { emoji: '🏆', name: '첫 승리', earned: true },
  { emoji: '🎯', name: '정답왕', earned: true },
  { emoji: '🔥', name: '연속 출석', earned: true },
  { emoji: '💎', name: '전과목 마스터', earned: false },
  { emoji: '🚀', name: '스피드 퀴즈', earned: false },
  { emoji: '🌟', name: '올클리어', earned: false },
]

const FILTER_OPTIONS = [
  { key: 'all', label: '전체', icon: null },
  { key: 'game', label: '🎮일반', icon: null },
  { key: 'recommended', label: '💡추천', icon: null },
  { key: 'wrong_note', label: '📖오답', icon: null },
]

const PERIOD_OPTIONS = ['이번 달', '지난 달', '최근 3개월']

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

/* ---------- component ---------- */

export default function HistoryPage() {
  const [activeFilter, setActiveFilter] = useState('all')
  const [period, setPeriod] = useState('이번 달')

  const filteredHistory = MOCK_HISTORY.map((day) => ({
    ...day,
    sessions:
      activeFilter === 'all'
        ? day.sessions
        : day.sessions.filter((s) => s.type === activeFilter),
  })).filter((day) => day.sessions.length > 0)

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <h1 className="text-xl font-bold text-gray-900">학습이력</h1>

      {/* 요약 통계 */}
      <div className="grid grid-cols-2 gap-3">
        {MOCK_STATS.map((stat) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.label}
              className="flex items-center gap-3 rounded-xl bg-white p-4 shadow-sm"
            >
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full ${stat.color}`}
              >
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-gray-500">{stat.label}</p>
                <p className="text-lg font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* 게임 이력 */}
      <section>
        <h2 className="mb-3 text-lg font-bold text-gray-900">게임 이력</h2>

        {/* 필터 */}
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

          {/* period dropdown */}
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="ml-auto rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700"
          >
            {PERIOD_OPTIONS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        {/* 날짜별 이력 */}
        <div className="space-y-4">
          {filteredHistory.map((day) => (
            <div key={day.date}>
              {/* date divider */}
              <div className="mb-2 flex items-center gap-2">
                <div className="h-px flex-1 bg-gray-200" />
                <span className="text-xs font-semibold text-gray-500">
                  {formatDate(day.date)}
                </span>
                <div className="h-px flex-1 bg-gray-200" />
              </div>

              <div className="space-y-2">
                {day.sessions.map((session) => (
                  <div
                    key={session.id}
                    className="rounded-xl bg-white p-4 shadow-sm"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        {/* top line */}
                        <p className="text-sm font-semibold text-gray-900">
                          {typeIcon(session.type)}{' '}
                          {session.gameEmoji && `${session.gameEmoji} `}
                          {session.gameName}
                          {session.subject && (
                            <span className="text-gray-500">
                              {' '}
                              | {session.subject} &gt; {session.unit}
                            </span>
                          )}
                          {!session.subject && session.type === 'wrong_note' && (
                            <span className="text-gray-500">
                              {' '}
                              | {session.total}문제 완료
                            </span>
                          )}
                        </p>

                        {/* stats line */}
                        <p className="mt-1 text-sm text-gray-600">
                          {session.correct}/{session.total} 정답 {session.accuracy}%{' '}
                          {resultLabel(session.result)}{' '}
                          <span className="font-semibold text-amber-600">
                            🍬+{session.jelly}
                          </span>
                        </p>
                      </div>

                      <Link
                        href={`/student/game-result/${session.id}?from=history`}
                        className="ml-3 flex items-center gap-1 whitespace-nowrap text-sm font-medium text-blue-600 hover:text-blue-700"
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

      {/* 학습맵 */}
      <section>
        <h2 className="mb-3 text-lg font-bold text-gray-900">학습맵 (단원별 숙련도)</h2>

        <div className="space-y-3">
          {MOCK_LEARNING_MAP.map((unit) => (
            <div
              key={unit.unit}
              className="flex items-center gap-3 rounded-xl bg-white p-4 shadow-sm"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-gray-900">{unit.unit}</p>
                  <span className="text-sm text-gray-500">
                    {unit.unlearned ? '--' : `${unit.mastery}%`}
                  </span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-200">
                  <div
                    className={`h-full rounded-full transition-all ${unit.color}`}
                    style={{ width: `${unit.mastery}%` }}
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  {unit.emoji} {unit.message}
                </p>
              </div>

              {(unit.unlearned || unit.mastery < 60) && (
                <Link href="/student/learn">
                  <Button
                    variant="outline"
                    size="sm"
                    className="whitespace-nowrap text-xs"
                  >
                    학습하기
                    <ChevronRight className="ml-1 h-3 w-3" />
                  </Button>
                </Link>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 뱃지 */}
      <section>
        <h2 className="mb-3 text-lg font-bold text-gray-900">뱃지</h2>
        <div className="grid grid-cols-3 gap-3">
          {MOCK_BADGES.map((badge) => (
            <div
              key={badge.name}
              className={`flex flex-col items-center rounded-xl p-4 ${
                badge.earned
                  ? 'bg-white shadow-sm'
                  : 'bg-gray-100 opacity-50'
              }`}
            >
              <span className={`text-3xl ${badge.earned ? '' : 'grayscale'}`}>
                {badge.emoji}
              </span>
              <span
                className={`mt-2 text-xs font-medium ${
                  badge.earned ? 'text-gray-800' : 'text-gray-400'
                }`}
              >
                {badge.name}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
