// S-10 내 학습 결과 — [요약] [학습맵] 탭
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Medal, BookOpen, Gamepad2, ChevronRight, Star, BarChart3, Map } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { StreakCalendar } from '@/components/student/StreakCalendar'
import { WeeklyTrend } from '@/components/student/WeeklyTrend'
import { UnitMastery } from '@/components/student/UnitMastery'
import { BadgeGrid } from '@/components/student/BadgeGrid'
import { RecentActivity } from '@/components/student/RecentActivity'
import { MedalProgress } from '@/components/student/MedalProgress'
import { LearningMap } from '@/components/student/LearningMap'
import type { LearningNode } from '@/components/student/LearningMap'

// ─── Mock 데이터: 요약 탭 ────────────────────────────────

const MOCK_PROFILE = {
  totalQuestions: 342, totalCorrect: 273, attendanceDays: 15,
  medalGrade: 'silver' as const, totalJelly: 8, totalStudyHours: 12.5,
}

const MOCK_CHARACTER = {
  id: 'pander', name: '팬더', emoji: '🐼',
  color: 'from-sky-400 to-blue-500', gamesPlayed: 28,
}

const MOCK_STREAK = {
  current: 7, longest: 12,
  thisWeek: [true, true, true, true, true, true, true] as boolean[],
  monthlyAttendance: [
    true, true, false, true, true, true, false,
    true, true, true, true, false, true, true,
    true, false, false, false, false, false, false,
    false, false, false, false, false, false, false,
    false, false, false,
  ] as boolean[],
}

const MOCK_WEEKLY = [
  { day: '월', questions: 12, accuracy: 75 }, { day: '화', questions: 8, accuracy: 82 },
  { day: '수', questions: 15, accuracy: 68 }, { day: '목', questions: 10, accuracy: 90 },
  { day: '금', questions: 6, accuracy: 83 },  { day: '토', questions: 20, accuracy: 85 },
  { day: '일', questions: 14, accuracy: 78 },
]
const MOCK_MONTHLY = [
  { day: '1주', questions: 45, accuracy: 72 }, { day: '2주', questions: 62, accuracy: 78 },
  { day: '3주', questions: 55, accuracy: 81 }, { day: '4주', questions: 38, accuracy: 76 },
]

const MOCK_SUBJECTS = [
  {
    subject: '과학',
    units: [
      { unit: '여러 가지 힘', depth: ['물리', '힘과 운동', '여러 가지 힘'], accuracy: 78, total: 18, correct: 14,
        wrongQuestions: [
          { id: 'q1', text: '마찰력의 방향은?', myAnswer: '운동 방향', correctAnswer: '운동 반대 방향' },
        ] },
      { unit: '마찰력', depth: ['물리', '힘과 운동', '마찰력'], accuracy: 52, total: 10, correct: 5,
        wrongQuestions: [
          { id: 'q4', text: '정지 마찰력과 운동 마찰력 중 큰 것은?', myAnswer: '운동 마찰력', correctAnswer: '정지 마찰력' },
        ] },
      { unit: '탄성력', depth: ['물리', '힘과 운동', '탄성력'], accuracy: 30, total: 10, correct: 3,
        wrongQuestions: [
          { id: 'q7', text: '훅의 법칙에서 F=kx의 k는?', myAnswer: '질량', correctAnswer: '탄성 계수' },
        ] },
    ],
  },
  {
    subject: '수학',
    units: [
      { unit: '일차방정식', depth: ['대수', '방정식', '일차방정식'], accuracy: 88, total: 15, correct: 13,
        wrongQuestions: [] },
      { unit: '일차부등식', depth: ['대수', '부등식', '일차부등식'], accuracy: 45, total: 8, correct: 4,
        wrongQuestions: [
          { id: 'q11', text: '-2x > 4 의 해는?', myAnswer: 'x > -2', correctAnswer: 'x < -2' },
        ] },
    ],
  },
]

const MOCK_BADGES = [
  { id: 'first_game', name: '첫 게임', icon: '🎮', description: '첫 번째 게임 완료', earned: true, earnedAt: '2026-02-15' },
  { id: 'q_100', name: '100문제', icon: '📝', description: '100문제 풀기 달성', earned: true, earnedAt: '2026-02-20' },
  { id: 'q_500', name: '500문제', icon: '📚', description: '500문제 풀기 달성', earned: false },
  { id: 'perfect', name: '첫 만점', icon: '🎯', description: '게임에서 만점 받기', earned: true, earnedAt: '2026-02-22' },
  { id: 'streak_3', name: '3일 연속', icon: '✨', description: '3일 연속 학습', earned: true, earnedAt: '2026-02-18' },
  { id: 'streak_7', name: '7일 연속', icon: '🔥', description: '7일 연속 학습', earned: true, earnedAt: '2026-03-01' },
  { id: 'streak_30', name: '30일 연속', icon: '💎', description: '30일 연속 학습', earned: false },
  { id: 'all_games', name: '전종목', icon: '🏅', description: '4종 게임 모두 플레이', earned: false },
  { id: 'tug_10', name: '줄다리기왕', icon: '🏆', description: '줄다리기 10승', earned: false },
  { id: 'wrong_clear', name: '오답정복', icon: '⭐', description: '오답노트 전부 정복', earned: false },
  { id: 'adaptive_done', name: '맞춤완주', icon: '🧠', description: '맞춤형 학습 완주', earned: false },
  { id: 'gold_medal', name: '금메달', icon: '🥇', description: '금메달 달성', earned: false },
]

const MOCK_ACTIVITY = [
  { date: '오늘', gameType: 'tug_of_war', questions: 5, accuracy: 80, result: 'win' as const },
  { date: '어제', gameType: 'adaptive', questions: 8, accuracy: 75, result: 'finished' as const },
  { date: '2일 전', gameType: 'boat_racing', questions: 5, accuracy: 60, result: 'lose' as const },
  { date: '3일 전', gameType: 'kickboard_racing', questions: 5, accuracy: 100, result: 'win' as const },
]

// ─── Mock 데이터: 학습맵 탭 ──────────────────────────────

function makeLeaf(id: string, name: string, acc: number, games: number, level: string, wrongQ: { id: string; text: string; myAnswer: string; correctAnswer: string }[], history: { step: number; level: string; correct: boolean }[]): LearningNode {
  return {
    id, name,
    data: {
      accuracy: acc, totalQuestions: Math.round(acc > 0 ? 100 / acc * 10 : 10), correctQuestions: Math.round(acc / 10),
      gamesPlayed: games, gameAccuracy: acc + Math.round(Math.random() * 5 - 2),
      adaptiveLevel: level,
      adaptiveHistory: history,
      wrongTotal: wrongQ.length + 1, wrongCleared: 1,
      wrongQuestions: wrongQ,
    },
  }
}

const MOCK_LEARNING_MAP: Record<string, LearningNode[]> = {
  '영어': [
    { id: 'grammar', name: '문법', children: [
      { id: 'tense', name: '시제', children: [
        makeLeaf('present', '현재시제', 85, 5, '중', [
          { id: 'e1', text: 'She ___ to school every day.', myAnswer: 'go', correctAnswer: 'goes' },
        ], [
          { step: 1, level: '하', correct: true }, { step: 2, level: '하', correct: true },
          { step: 3, level: '중하', correct: true }, { step: 4, level: '중하', correct: false },
          { step: 5, level: '중', correct: true },
        ]),
        makeLeaf('past', '과거시제', 62, 3, '중하', [
          { id: 'e2', text: 'I ___ there yesterday.', myAnswer: 'goed', correctAnswer: 'went' },
          { id: 'e3', text: 'She ___ a cake last night.', myAnswer: 'maked', correctAnswer: 'made' },
        ], [
          { step: 1, level: '하', correct: true }, { step: 2, level: '하', correct: false },
          { step: 3, level: '하', correct: true }, { step: 4, level: '중하', correct: false },
        ]),
        makeLeaf('future', '미래시제', 90, 4, '중상', [], [
          { step: 1, level: '중', correct: true }, { step: 2, level: '중', correct: true },
          { step: 3, level: '중상', correct: true },
        ]),
      ]},
      { id: 'parts', name: '품사', children: [
        makeLeaf('noun', '명사', 78, 2, '중', [
          { id: 'e4', text: '불가산 명사는?', myAnswer: 'books', correctAnswer: 'information' },
        ], []),
        makeLeaf('verb', '동사', 55, 3, '중하', [
          { id: 'e5', text: '3인칭 단수 현재형 규칙은?', myAnswer: '-ed 붙이기', correctAnswer: '-s/-es 붙이기' },
        ], [
          { step: 1, level: '하', correct: false }, { step: 2, level: '하', correct: true },
          { step: 3, level: '중하', correct: false },
        ]),
      ]},
    ]},
    { id: 'reading', name: '독해', children: [
      makeLeaf('main_idea', '주제 파악', 72, 4, '중', [], []),
      makeLeaf('detail', '세부 정보', 68, 3, '중하', [
        { id: 'e6', text: 'What did the author suggest?', myAnswer: 'To wait', correctAnswer: 'To act now' },
      ], []),
    ]},
  ],
  '수학': [
    { id: 'algebra', name: '대수', children: [
      { id: 'equation', name: '방정식', children: [
        makeLeaf('linear_eq', '일차방정식', 88, 6, '중', [
          { id: 'm1', text: '2x + 3 = 7 의 해는?', myAnswer: '3', correctAnswer: '2' },
        ], [
          { step: 1, level: '하', correct: true }, { step: 2, level: '하', correct: true },
          { step: 3, level: '중하', correct: true }, { step: 4, level: '중하', correct: true },
          { step: 5, level: '중', correct: true },
        ]),
        makeLeaf('quadratic_eq', '이차방정식', 72, 4, '중하', [
          { id: 'm2', text: 'x² - 5x + 6 = 0 의 해는?', myAnswer: 'x=1, x=6', correctAnswer: 'x=2, x=3' },
        ], [
          { step: 1, level: '하', correct: true }, { step: 2, level: '중하', correct: false },
          { step: 3, level: '하', correct: true },
        ]),
      ]},
      { id: 'inequality', name: '부등식', children: [
        makeLeaf('linear_ineq', '일차부등식', 45, 3, '하', [
          { id: 'm3', text: '-2x > 4 의 해는?', myAnswer: 'x > -2', correctAnswer: 'x < -2' },
          { id: 'm4', text: '부등식의 양변에 음수를 곱하면?', myAnswer: '부호 유지', correctAnswer: '부호 반대' },
        ], [
          { step: 1, level: '하', correct: false }, { step: 2, level: '하', correct: false },
        ]),
      ]},
    ]},
    { id: 'geometry', name: '기하', children: [
      { id: 'shapes', name: '도형', children: [
        makeLeaf('triangle', '삼각형', 90, 5, '중상', [], [
          { step: 1, level: '중', correct: true }, { step: 2, level: '중', correct: true },
          { step: 3, level: '중상', correct: true },
        ]),
        makeLeaf('circle_area', '원', 65, 2, '중하', [
          { id: 'm5', text: '반지름 3인 원의 넓이는?', myAnswer: '6π', correctAnswer: '9π' },
        ], [
          { step: 1, level: '하', correct: true }, { step: 2, level: '중하', correct: false },
        ]),
      ]},
    ]},
  ],
  '과학': [
    { id: 'physics', name: '물리', children: [
      { id: 'force', name: '힘과 운동', children: [
        makeLeaf('friction', '마찰력', 52, 3, '하', [
          { id: 's1', text: '정지 마찰력과 운동 마찰력 중 큰 것은?', myAnswer: '운동 마찰력', correctAnswer: '정지 마찰력' },
        ], [
          { step: 1, level: '하', correct: true }, { step: 2, level: '하', correct: false },
        ]),
        makeLeaf('elasticity', '탄성력', 30, 2, '하', [
          { id: 's2', text: '훅의 법칙에서 k는?', myAnswer: '질량', correctAnswer: '탄성 계수' },
        ], [
          { step: 1, level: '하', correct: false }, { step: 2, level: '하', correct: false },
        ]),
        makeLeaf('gravity_w', '중력과 무게', 95, 5, '중상', [], [
          { step: 1, level: '중', correct: true }, { step: 2, level: '중', correct: true },
          { step: 3, level: '중상', correct: true },
        ]),
      ]},
    ]},
  ],
  '사회': [
    { id: 'economy', name: '경제', children: [
      makeLeaf('supply_demand', '수요와 공급', 70, 2, '중하', [
        { id: 'so1', text: '수요가 증가하면 가격은?', myAnswer: '하락', correctAnswer: '상승' },
      ], []),
      makeLeaf('market', '시장 경제', 58, 1, '하', [], []),
    ]},
  ],
}

const MOCK_AI_RECOMMENDATION = {
  unitName: '일차부등식',
  action: '처방학습을 먼저 해보세요!',
  reason: '부등식에서 음수 곱셈 시 부호 반전 개념이 부족합니다. 처방학습으로 난이도를 올려보세요.',
}

// ─── 메달 설정 ───────────────────────────────────────────

const MEDAL_CONFIG = {
  none:   { label: '없음', color: 'text-gray-400', bg: 'bg-gray-100', icon: 'text-gray-300' },
  bronze: { label: '동메달', color: 'text-amber-700', bg: 'bg-amber-50', icon: 'text-amber-700' },
  silver: { label: '은메달', color: 'text-gray-500', bg: 'bg-gradient-to-br from-gray-100 to-gray-200', icon: 'text-gray-400' },
  gold:   { label: '금메달', color: 'text-amber-500', bg: 'bg-gradient-to-br from-amber-50 to-yellow-100', icon: 'text-amber-500' },
}

// ─── 컴포넌트 ────────────────────────────────────────────

export default function MyResultPage() {
  const router = useRouter()
  const [tab, setTab] = useState<'summary' | 'map'>('summary')
  const accuracy = Math.round((MOCK_PROFILE.totalCorrect / MOCK_PROFILE.totalQuestions) * 100)
  const medal = MEDAL_CONFIG[MOCK_PROFILE.medalGrade]

  return (
    <div className="space-y-3">
      {/* 페이지 제목 + 탭 */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">내 결과</h1>
        <div className="flex gap-1 rounded-lg bg-gray-100 p-0.5">
          <button
            onClick={() => setTab('summary')}
            className={`flex items-center gap-1.5 rounded-md px-4 py-1.5 text-xs font-medium transition-colors ${
              tab === 'summary' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <BarChart3 className="h-3.5 w-3.5" /> 요약
          </button>
          <button
            onClick={() => setTab('map')}
            className={`flex items-center gap-1.5 rounded-md px-4 py-1.5 text-xs font-medium transition-colors ${
              tab === 'map' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Map className="h-3.5 w-3.5" /> 학습맵
          </button>
        </div>
      </div>

      {/* ─── 요약 탭 ─── */}
      {tab === 'summary' && (
        <>
          {/* ① 종합 요약 카드 */}
          <div className={`rounded-2xl ${medal.bg} p-4 shadow-soft`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Medal className={`h-10 w-10 ${medal.icon}`} />
                <div>
                  <p className={`text-lg font-bold ${medal.color}`}>{medal.label}</p>
                  <p className="text-xs text-gray-500">꾸준히 학습하고 있어요!</p>
                </div>
              </div>
              <div className="flex divide-x divide-gray-200/60">
                <div className="text-center px-5">
                  <p className="text-xl font-bold text-gray-900">{MOCK_PROFILE.totalQuestions}</p>
                  <p className="text-[10px] text-gray-500">총 문제</p>
                </div>
                <div className="text-center px-5">
                  <p className="text-xl font-bold text-gray-900">{accuracy}%</p>
                  <p className="text-[10px] text-gray-500">정답률</p>
                </div>
                <div className="text-center px-5">
                  <p className="text-xl font-bold text-gray-900">{MOCK_PROFILE.attendanceDays}일</p>
                  <p className="text-[10px] text-gray-500">출석</p>
                </div>
                <div className="text-center px-5">
                  <p className="text-xl font-bold text-gray-900">{MOCK_PROFILE.totalStudyHours}h</p>
                  <p className="text-[10px] text-gray-500">학습시간</p>
                </div>
              </div>
            </div>
          </div>

          {/* ② 뱃지·출석 (좌) + 캐릭터·메달 (우) */}
          <div className="grid grid-cols-5 gap-3">
            {/* 좌측: 뱃지 + 출석 */}
            <div className="col-span-3 space-y-3">
              <BadgeGrid badges={MOCK_BADGES} />
              <StreakCalendar current={MOCK_STREAK.current} longest={MOCK_STREAK.longest}
                thisWeek={MOCK_STREAK.thisWeek} monthlyAttendance={MOCK_STREAK.monthlyAttendance} />
            </div>
            {/* 우측: 캐릭터 + 메달 (좌측과 높이 맞춤) */}
            <div className="col-span-2 flex flex-col gap-3">
              <button onClick={() => router.push('/student/rewards')}
                className="flex-1 rounded-xl bg-white p-4 shadow-soft hover:shadow-card transition-shadow text-left flex flex-col">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">내 캐릭터</h3>
                <div className="flex-1 flex flex-col items-center justify-center gap-2">
                  <div className={`flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br ${MOCK_CHARACTER.color} shadow-md`}>
                    <span className="text-5xl">{MOCK_CHARACTER.emoji}</span>
                  </div>
                  <p className="text-base font-bold text-gray-900">{MOCK_CHARACTER.name}</p>
                  <p className="text-xs text-gray-500">{MOCK_CHARACTER.gamesPlayed}회 함께 플레이</p>
                  <div className="flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5">
                    <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                    <span className="text-xs font-bold text-amber-600">젤리 {MOCK_PROFILE.totalJelly}개</span>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-2">
                  <span className="text-xs text-blue-500 font-medium">학습보상 보기</span>
                  <ChevronRight className="h-4 w-4 text-blue-400" />
                </div>
              </button>
              <div className="flex-1">
                <MedalProgress currentGrade={MOCK_PROFILE.medalGrade} attendance={MOCK_PROFILE.attendanceDays}
                  totalQuestions={MOCK_PROFILE.totalQuestions} accuracy={accuracy} />
              </div>
            </div>
          </div>

          {/* ④ 트렌드 */}
          <WeeklyTrend weeklyData={MOCK_WEEKLY} monthlyData={MOCK_MONTHLY} />

          {/* ⑤ 단원 + 최근 + 액션 */}
          <div className="grid grid-cols-5 gap-3">
            <div className="col-span-3">
              <UnitMastery subjects={MOCK_SUBJECTS} />
            </div>
            <div className="col-span-2 space-y-3">
              <RecentActivity activities={MOCK_ACTIVITY} />
              <Link href="/student/wrong-notes">
                <div className="flex items-center justify-between rounded-xl bg-white p-3 shadow-soft hover:shadow-card transition-shadow">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-100">
                      <BookOpen className="h-4 w-4 text-rose-500" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-900">오답노트</p>
                      <p className="text-[10px] text-gray-500">틀린 문제를 다시 풀어보세요</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>
              </Link>
              <Button onClick={() => router.push('/student/games')}
                className="w-full h-10 rounded-xl bg-blue-600 hover:bg-blue-700 text-sm font-semibold">
                <Gamepad2 className="mr-2 h-4 w-4" /> 학습 게임 하러 가기
              </Button>
            </div>
          </div>
        </>
      )}

      {/* ─── 학습맵 탭 ─── */}
      {tab === 'map' && (
        <LearningMap subjects={MOCK_LEARNING_MAP} aiRecommendation={MOCK_AI_RECOMMENDATION} />
      )}
    </div>
  )
}
