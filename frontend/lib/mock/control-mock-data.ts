// ============================================================
// 컨트롤 패널 Mock 데이터 (v3 — 스피드 퀴즈 개별 진행)
// ============================================================

import type {
  StudentMonitorData,
  StudentQuestionResult,
  QuestionAccuracyPoint,
  LeaderboardEntry,
  LiveAnalyticsData,
  PerQuestionAnalytics,
  BehaviorBadge,
  StudentStatus,
} from '@/types'
import type { WsQuestionShow } from '@/types'

// ─────────────────────────────────────────────────────────────
// 아바타 색상 팔레트
// ─────────────────────────────────────────────────────────────

const AVATAR_COLORS = [
  'bg-blue-500',
  'bg-emerald-500',
  'bg-amber-500',
  'bg-rose-500',
  'bg-purple-500',
  'bg-cyan-500',
  'bg-pink-500',
  'bg-indigo-500',
]

function getAvatarColor(nickname: string): string {
  return AVATAR_COLORS[nickname.charCodeAt(0) % AVATAR_COLORS.length]
}

// ─────────────────────────────────────────────────────────────
// 10개 문항 정의
// ─────────────────────────────────────────────────────────────

const QUESTION_CONTENTS = [
  'x² - 5x + 6 = 0의 두 근의 곱은?',
  '직각삼각형에서 두 변의 길이가 5, 12일 때 빗변의 길이는?',
  '연립방정식 { 2x + y = 7, x - y = 2 }의 해 (x, y)는?',
  '반지름이 6cm인 원에서 중심각이 120°인 부채꼴의 넓이는?',
  '주사위 2개를 동시에 던질 때, 합이 8이 되는 경우의 수는?',
  '√48 + √12 를 간단히 하면?',
  '일차함수 y = 2x - 3의 x절편은?',
  '∠A = 60°, AB = 8, AC = 6인 △ABC의 넓이는?',
  '등차수열 3, 7, 11, 15, ...의 제20항은?',
  '이차함수 y = x² - 4x + 7의 꼭짓점 좌표는?',
]

// ─────────────────────────────────────────────────────────────
// 학생별 문항 응답 내역 생성 (10문항)
// ─────────────────────────────────────────────────────────────

function makeQuestionResults(
  correctPattern: (boolean | null)[],
): StudentQuestionResult[] {
  return correctPattern.map((isCorrect, i) => ({
    questionIndex: i + 1,
    questionContent: QUESTION_CONTENTS[i],
    selectedAnswer: isCorrect === null ? null : isCorrect ? String(i + 1) : String(((i + 2) % 4) + 1),
    isCorrect,
    responseTimeSec: isCorrect === null ? null : isCorrect ? 5 + i * 2 : 12 + i,
    isSkipped: isCorrect === null,
  }))
}

// ─────────────────────────────────────────────────────────────
// 10명 Mock 학생 (10문항 기준)
// ─────────────────────────────────────────────────────────────

interface StudentSeed {
  nickname: string
  status: StudentStatus
  score: number
  correctStreak: number
  accuracy: number
  badges: BehaviorBadge[]
  lastResponseTimeSec: number | null
  correctPattern: (boolean | null)[] // null = 아직 안 풀음
  completedQuestions: number
  currentQuestionIndex: number
}

const TOTAL_QUESTIONS = 10

const STUDENT_SEEDS: StudentSeed[] = [
  // ── Star 학생 (2명) — 10/10 완료 ──
  { nickname: '수학천재', status: 'finished', score: 980, correctStreak: 6, accuracy: 90, badges: ['star'], lastResponseTimeSec: 5, correctPattern: [true, true, true, true, true, false, true, true, true, true], completedQuestions: 10, currentQuestionIndex: 10 },
  { nickname: '김민준', status: 'finished', score: 920, correctStreak: 4, accuracy: 80, badges: ['star'], lastResponseTimeSec: 7, correctPattern: [true, true, false, true, true, true, true, false, true, true], completedQuestions: 10, currentQuestionIndex: 10 },

  // ── Struggling 학생 (2명) ──
  { nickname: '박지훈', status: 'answering', score: 120, correctStreak: 0, accuracy: 17, badges: ['struggling'], lastResponseTimeSec: 22, correctPattern: [false, false, true, false, false, false, null, null, null, null], completedQuestions: 6, currentQuestionIndex: 7 },
  { nickname: '최유나', status: 'answering', score: 180, correctStreak: 0, accuracy: 29, badges: ['struggling'], lastResponseTimeSec: 18, correctPattern: [false, true, false, false, true, false, false, null, null, null], completedQuestions: 7, currentQuestionIndex: 8 },

  // ── Guessing 학생 (1명) ──
  { nickname: '한도윤', status: 'answering', score: 240, correctStreak: 0, accuracy: 30, badges: ['guessing'], lastResponseTimeSec: 2, correctPattern: [true, false, false, false, true, false, false, false, null, null], completedQuestions: 8, currentQuestionIndex: 9 },

  // ── Slow 학생 (1명) ──
  { nickname: '윤지아', status: 'answering', score: 200, correctStreak: 1, accuracy: 67, badges: ['slow'], lastResponseTimeSec: null, correctPattern: [true, true, false, null, null, null, null, null, null, null], completedQuestions: 3, currentQuestionIndex: 4 },

  // ── 일반 학생 (3명) ──
  { nickname: '송지호', status: 'finished', score: 760, correctStreak: 2, accuracy: 70, badges: [], lastResponseTimeSec: 9, correctPattern: [true, true, false, true, false, true, true, false, true, true], completedQuestions: 10, currentQuestionIndex: 10 },
  { nickname: '노은서', status: 'answering', score: 540, correctStreak: 0, accuracy: 63, badges: [], lastResponseTimeSec: 11, correctPattern: [true, false, true, true, false, true, true, false, null, null], completedQuestions: 8, currentQuestionIndex: 9 },
  { nickname: '황시우', status: 'answering', score: 460, correctStreak: 2, accuracy: 57, badges: [], lastResponseTimeSec: 8, correctPattern: [false, true, true, false, true, false, true, null, null, null], completedQuestions: 7, currentQuestionIndex: 8 },

  // ── Disconnected (1명) ──
  { nickname: '오현우', status: 'disconnected', score: 300, correctStreak: 0, accuracy: 40, badges: [], lastResponseTimeSec: null, correctPattern: [true, false, true, false, false, null, null, null, null, null], completedQuestions: 5, currentQuestionIndex: 6 },
]

export const MOCK_STUDENTS: StudentMonitorData[] = STUDENT_SEEDS.map(
  (seed, i) => ({
    participantId: `p-${String(i + 1).padStart(2, '0')}`,
    nickname: seed.nickname,
    avatarColor: getAvatarColor(seed.nickname),
    status: seed.status,
    score: seed.score,
    correctStreak: seed.correctStreak,
    accuracy: seed.accuracy,
    badges: seed.badges,
    lastResponseTimeSec: seed.lastResponseTimeSec,
    perQuestionResults: makeQuestionResults(seed.correctPattern),
    completedQuestions: seed.completedQuestions,
    totalQuestions: TOTAL_QUESTIONS,
    currentQuestionIndex: seed.currentQuestionIndex,
    isFinished: seed.status === 'finished',
  }),
)

// ─────────────────────────────────────────────────────────────
// 문항별 분석 데이터 (10문항)
// ─────────────────────────────────────────────────────────────

const TOTAL_MOCK_STUDENTS = 10

export const MOCK_QUESTION_ANALYTICS: PerQuestionAnalytics[] = [
  {
    questionIndex: 1,
    questionContent: 'x² - 5x + 6 = 0의 두 근의 곱은?',
    questionType: 'multiple_choice',
    options: [
      { index: 1, text: '5' },
      { index: 2, text: '6' },
      { index: 3, text: '-6' },
      { index: 4, text: '-5' },
    ],
    correctOptionIndex: 2,
    distribution: { '1': 2, '2': 7, '3': 1, '4': 0 },
    correctCount: 7,
    incorrectCount: 3,
    unansweredCount: 0,
    totalStudents: TOTAL_MOCK_STUDENTS,
    avgResponseTimeSec: 12.5,
  },
  {
    questionIndex: 2,
    questionContent: '직각삼각형에서 두 변의 길이가 5, 12일 때 빗변의 길이는?',
    questionType: 'multiple_choice',
    options: [
      { index: 1, text: '13' },
      { index: 2, text: '15' },
      { index: 3, text: '17' },
      { index: 4, text: '√119' },
    ],
    correctOptionIndex: 1,
    distribution: { '1': 6, '2': 2, '3': 1, '4': 1 },
    correctCount: 6,
    incorrectCount: 4,
    unansweredCount: 0,
    totalStudents: TOTAL_MOCK_STUDENTS,
    avgResponseTimeSec: 15.2,
  },
  {
    questionIndex: 3,
    questionContent: '연립방정식 { 2x + y = 7, x - y = 2 }의 해 (x, y)는?',
    questionType: 'multiple_choice',
    options: [
      { index: 1, text: '(2, 3)' },
      { index: 2, text: '(3, 1)' },
      { index: 3, text: '(4, -1)' },
      { index: 4, text: '(1, 5)' },
    ],
    correctOptionIndex: 2,
    distribution: { '1': 2, '2': 6, '3': 1, '4': 1 },
    correctCount: 6,
    incorrectCount: 4,
    unansweredCount: 0,
    totalStudents: TOTAL_MOCK_STUDENTS,
    avgResponseTimeSec: 20.1,
  },
  {
    questionIndex: 4,
    questionContent: '반지름이 6cm인 원에서 중심각이 120°인 부채꼴의 넓이는?',
    questionType: 'multiple_choice',
    options: [
      { index: 1, text: '6π cm²' },
      { index: 2, text: '12π cm²' },
      { index: 3, text: '24π cm²' },
      { index: 4, text: '36π cm²' },
    ],
    correctOptionIndex: 2,
    distribution: { '1': 2, '2': 4, '3': 2, '4': 1 },
    correctCount: 4,
    incorrectCount: 5,
    unansweredCount: 1,
    totalStudents: TOTAL_MOCK_STUDENTS,
    avgResponseTimeSec: 22.8,
  },
  {
    questionIndex: 5,
    questionContent: '주사위 2개를 동시에 던질 때, 합이 8이 되는 경우의 수는?',
    questionType: 'multiple_choice',
    options: [
      { index: 1, text: '3가지' },
      { index: 2, text: '4가지' },
      { index: 3, text: '5가지' },
      { index: 4, text: '6가지' },
    ],
    correctOptionIndex: 3,
    distribution: { '1': 1, '2': 2, '3': 5, '4': 1 },
    correctCount: 5,
    incorrectCount: 4,
    unansweredCount: 1,
    totalStudents: TOTAL_MOCK_STUDENTS,
    avgResponseTimeSec: 18.4,
  },
  {
    questionIndex: 6,
    questionContent: '√48 + √12 를 간단히 하면?',
    questionType: 'multiple_choice',
    options: [
      { index: 1, text: '6√3' },
      { index: 2, text: '4√3' },
      { index: 3, text: '√60' },
      { index: 4, text: '5√3' },
    ],
    correctOptionIndex: 1,
    distribution: { '1': 4, '2': 2, '3': 1, '4': 1 },
    correctCount: 4,
    incorrectCount: 4,
    unansweredCount: 2,
    totalStudents: TOTAL_MOCK_STUDENTS,
    avgResponseTimeSec: 16.9,
  },
  {
    questionIndex: 7,
    questionContent: '일차함수 y = 2x - 3의 x절편은?',
    questionType: 'multiple_choice',
    options: [
      { index: 1, text: '3/2' },
      { index: 2, text: '-3' },
      { index: 3, text: '2' },
      { index: 4, text: '-3/2' },
    ],
    correctOptionIndex: 1,
    distribution: { '1': 5, '2': 1, '3': 1, '4': 1 },
    correctCount: 5,
    incorrectCount: 3,
    unansweredCount: 2,
    totalStudents: TOTAL_MOCK_STUDENTS,
    avgResponseTimeSec: 14.1,
  },
  {
    questionIndex: 8,
    questionContent: '∠A = 60°, AB = 8, AC = 6인 △ABC의 넓이는?',
    questionType: 'multiple_choice',
    options: [
      { index: 1, text: '12√3' },
      { index: 2, text: '24' },
      { index: 3, text: '24√3' },
      { index: 4, text: '12' },
    ],
    correctOptionIndex: 1,
    distribution: { '1': 3, '2': 2, '3': 1, '4': 1 },
    correctCount: 3,
    incorrectCount: 4,
    unansweredCount: 3,
    totalStudents: TOTAL_MOCK_STUDENTS,
    avgResponseTimeSec: 26.3,
  },
  {
    questionIndex: 9,
    questionContent: '등차수열 3, 7, 11, 15, ...의 제20항은?',
    questionType: 'multiple_choice',
    options: [
      { index: 1, text: '79' },
      { index: 2, text: '83' },
      { index: 3, text: '77' },
      { index: 4, text: '75' },
    ],
    correctOptionIndex: 1,
    distribution: { '1': 3, '2': 1, '3': 1, '4': 0 },
    correctCount: 3,
    incorrectCount: 2,
    unansweredCount: 5,
    totalStudents: TOTAL_MOCK_STUDENTS,
    avgResponseTimeSec: 19.7,
  },
  {
    questionIndex: 10,
    questionContent: '이차함수 y = x² - 4x + 7의 꼭짓점 좌표는?',
    questionType: 'multiple_choice',
    options: [
      { index: 1, text: '(2, 3)' },
      { index: 2, text: '(-2, 3)' },
      { index: 3, text: '(4, 7)' },
      { index: 4, text: '(2, 7)' },
    ],
    correctOptionIndex: 1,
    distribution: { '1': 2, '2': 1, '3': 0, '4': 0 },
    correctCount: 2,
    incorrectCount: 1,
    unansweredCount: 7,
    totalStudents: TOTAL_MOCK_STUDENTS,
    avgResponseTimeSec: 23.5,
  },
]

// ─────────────────────────────────────────────────────────────
// 정답률 추이
// ─────────────────────────────────────────────────────────────

export const MOCK_ACCURACY_TREND: QuestionAccuracyPoint[] =
  MOCK_QUESTION_ANALYTICS.map((q) => ({
    questionIndex: q.questionIndex,
    correctPercent: Math.round((q.correctCount / (q.totalStudents - q.unansweredCount)) * 100),
    avgResponseTimeSec: q.avgResponseTimeSec,
  }))

// ─────────────────────────────────────────────────────────────
// 리더보드 (학생 데이터에서 파생)
// ─────────────────────────────────────────────────────────────

export const MOCK_LEADERBOARD: LeaderboardEntry[] = [...MOCK_STUDENTS]
  .sort((a, b) => b.score - a.score || (a.perQuestionResults.reduce((s, r) => s + (r.responseTimeSec ?? 0), 0)) - (b.perQuestionResults.reduce((s, r) => s + (r.responseTimeSec ?? 0), 0)))
  .map((s, i) => ({
    rank: i + 1,
    participantId: s.participantId,
    nickname: s.nickname,
    totalScore: s.score,
    accuracy: s.accuracy,
    avgResponseTimeSec:
      Math.round(
        (s.perQuestionResults.reduce((sum, r) => sum + (r.responseTimeSec ?? 0), 0) /
          Math.max(s.perQuestionResults.filter((r) => r.responseTimeSec !== null).length, 1)) *
          10,
      ) / 10,
  }))

// ─────────────────────────────────────────────────────────────
// 분석 데이터 (레거시 호환)
// ─────────────────────────────────────────────────────────────

export const MOCK_ANALYTICS: LiveAnalyticsData = {
  distribution: { '1': 2, '2': 3, '3': 4, '4': 1 },
  answered: 8,
  total: 10,
  accuracyTrend: MOCK_ACCURACY_TREND,
  currentQuestionDifficulty: 'hard',
  isConfusing: true,
}

// ─────────────────────────────────────────────────────────────
// 현재 문항 Mock (레거시 호환)
// ─────────────────────────────────────────────────────────────

export const MOCK_QUESTION: WsQuestionShow = {
  question: {
    question_id: 'q-3',
    type: 'multiple_choice',
    content: '연립방정식 { 2x + y = 7, x - y = 2 }의 해 (x, y)는?',
    options: [
      { index: 1, text: '(2, 3)' },
      { index: 2, text: '(3, 1)' },
      { index: 3, text: '(4, -1)' },
      { index: 4, text: '(1, 5)' },
    ],
    hint: '두 식을 더하면 3x = 9가 됩니다.',
  },
  questionIndex: 3,
  totalQuestions: 10,
  timeLimit: 30,
}
