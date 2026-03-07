// S-07 컨트롤 패널 (Host)
// 게임 뷰잉 배경 + 플로팅 버튼 → 팝업 오버레이로 대시보드 열기

'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  Users,
  Settings2,
  X,
  Clock,
  Pause,
  Play,
  ChevronRight,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { useToast } from '@/components/ui/use-toast'
import { sessionsApi } from '@/lib/api'
import {
  connectSocket,
  joinSessionRoom,
  leaveSessionRoom,
  onWsEvent,
  pauseGame,
  resumeGame,
  skipQuestion,
  extendTime,
  revealHint,
  forceEndGame,
  sendReaction,
} from '@/lib/websocket'
import type {
  Session,
  WsQuestionShow,
  WsAnswerCountUpdate,
  StudentMonitorData,
  LiveAnalyticsData,
  ReactionPayload,
} from '@/types'

import QuestionPanel from '@/components/host/control/QuestionPanel'
import ControlActions from '@/components/host/control/ControlActions'
import StudentGrid from '@/components/host/control/StudentGrid'
import StudentDetailModal from '@/components/host/control/StudentDetailModal'
import ReactionBar from '@/components/host/control/ReactionBar'
import LiveAnalytics from '@/components/host/control/LiveAnalytics'
import LiveLeaderboard from '@/components/host/control/LiveLeaderboard'

import {
  MOCK_STUDENTS,
  MOCK_ANALYTICS,
  MOCK_LEADERBOARD,
  MOCK_QUESTION,
} from '@/lib/mock/control-mock-data'

// ─────────────────────────────────────────────────────────────
// 상수
// ─────────────────────────────────────────────────────────────

const OPTION_COLORS = [
  '',
  'bg-blue-500',
  'bg-emerald-500',
  'bg-amber-500',
  'bg-rose-500',
  'bg-purple-500',
] as const

// ─────────────────────────────────────────────────────────────
// 상태 타입
// ─────────────────────────────────────────────────────────────

interface ControlState {
  question: WsQuestionShow | null
  isPaused: boolean
  answered: number
  total: number
  distribution: Record<string, number>
  timeRemaining: number
  hintRevealed: boolean
}

const MOCK_STATE: ControlState = {
  question: MOCK_QUESTION,
  isPaused: false,
  answered: 18,
  total: 24,
  distribution: MOCK_ANALYTICS.distribution,
  timeRemaining: 14,
  hintRevealed: false,
}

// ─────────────────────────────────────────────────────────────
// 컴포넌트
// ─────────────────────────────────────────────────────────────

export default function ControlPage() {
  const { sessionId } = useParams<{ sessionId: string }>()
  const router = useRouter()
  const { toast } = useToast()

  // ── 패널 열림/닫힘 ──
  const [panelOpen, setPanelOpen] = useState(false)

  // ── 기존 상태 ──
  const [session, setSession] = useState<Session | null>(null)
  const [ctrl, setCtrl] = useState<ControlState>(MOCK_STATE)
  const [isLastQuestion, setIsLastQuestion] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const cleanupRef = useRef<(() => void)[]>([])

  // ── 학생 모니터링 ──
  const [students] = useState<StudentMonitorData[]>(MOCK_STUDENTS)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [multiSelectMode, setMultiSelectMode] = useState(false)
  const [detailStudent, setDetailStudent] = useState<StudentMonitorData | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)

  // ── 분석/리더보드 ──
  const [leaderboardVisible, setLeaderboardVisible] = useState(true)

  const analytics: LiveAnalyticsData = {
    ...MOCK_ANALYTICS,
    distribution: ctrl.distribution,
    answered: ctrl.answered,
    total: ctrl.total,
  }

  // ── 타이머 ──
  const startTimer = useCallback((timeLimit: number) => {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setCtrl((prev) => {
        if (prev.timeRemaining <= 0) {
          clearInterval(timerRef.current!)
          return prev
        }
        return { ...prev, timeRemaining: prev.timeRemaining - 1 }
      })
    }, 1000)
  }, [])

  // ── WebSocket 연결 ──
  useEffect(() => {
    sessionsApi.get(sessionId).then(setSession).catch(() => {})

    connectSocket('host-token')
    joinSessionRoom(sessionId)

    const unsubs = [
      onWsEvent('question:show', (data: WsQuestionShow) => {
        setCtrl((prev) => ({
          ...prev,
          question: data,
          answered: 0,
          distribution: {},
          timeRemaining: data.timeLimit,
          hintRevealed: false,
        }))
        setIsLastQuestion(data.questionIndex === data.totalQuestions)
        startTimer(data.timeLimit)
      }),
      onWsEvent('answer:count-update', (data: WsAnswerCountUpdate) => {
        setCtrl((prev) => ({
          ...prev,
          answered: data.answered,
          total: data.total,
          distribution: data.distribution,
        }))
      }),
      onWsEvent('game:pause', () => {
        setCtrl((prev) => ({ ...prev, isPaused: true }))
        if (timerRef.current) clearInterval(timerRef.current)
      }),
      onWsEvent('game:resume', () => {
        setCtrl((prev) => ({ ...prev, isPaused: false }))
        startTimer(0)
      }),
      onWsEvent('game:end', () => {
        router.push(`/result/${sessionId}`)
      }),
      onWsEvent('connect_error', () => {
        toast({ title: '연결이 끊겼습니다. 재연결 중...', variant: 'destructive' })
      }),
    ]
    cleanupRef.current = unsubs

    return () => {
      cleanupRef.current.forEach((fn) => fn())
      if (timerRef.current) clearInterval(timerRef.current)
      leaveSessionRoom(sessionId)
    }
  }, [sessionId, router, toast, startTimer])

  // ── 핸들러 ──
  const handlePauseResume = () => {
    ctrl.isPaused ? resumeGame() : pauseGame()
  }
  const handleSkip = () => skipQuestion(sessionId)
  const handleNextQuestion = () => skipQuestion(sessionId)
  const handleHint = () => {
    if (!ctrl.question?.question.hint) {
      toast({ title: '이 문항에는 힌트가 없습니다.' })
      return
    }
    if (ctrl.hintRevealed) {
      toast({ title: '이미 힌트를 공개했습니다.' })
      return
    }
    revealHint(ctrl.question.question.question_id)
    setCtrl((prev) => ({ ...prev, hintRevealed: true }))
    toast({ title: '힌트를 공개했습니다.' })
  }
  const handleExtendTime = (seconds: number) => {
    extendTime(seconds)
    setCtrl((prev) => ({ ...prev, timeRemaining: prev.timeRemaining + seconds }))
    toast({ title: `${seconds}초 연장했습니다.` })
  }
  const handleForceEnd = () => forceEndGame(sessionId)
  const handleSendReaction = (payload: ReactionPayload) => sendReaction(payload)
  const handleSelectStudent = (student: StudentMonitorData) => {
    setDetailStudent(student)
    setDetailOpen(true)
  }

  // ── 파생값 ──
  const q = ctrl.question
  const timePct = q ? Math.round((ctrl.timeRemaining / q.timeLimit) * 100) : 0
  const isTimeCritical = ctrl.timeRemaining <= 5
  const answerPct = ctrl.total > 0 ? Math.round((ctrl.answered / ctrl.total) * 100) : 0

  return (
    <div className="relative flex h-screen flex-col overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800">

      {/* ═══════════════════════════════════════════════════════════
          게임 뷰잉 (배경)
          ═══════════════════════════════════════════════════════════ */}

      {/* 상단 바 */}
      <header className="flex items-center justify-between px-8 py-4">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-white">
            {session?.set_title ?? '수학 1단원 — 집합과 명제'}
          </h1>
          {q && (
            <Badge className="bg-white/20 text-white border-white/30 text-sm font-mono">
              Q{q.questionIndex} / {q.totalQuestions}
            </Badge>
          )}
          {ctrl.isPaused && (
            <Badge className="animate-pulse bg-yellow-400 text-yellow-900 text-sm">
              일시정지
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-white/80">
            <Users className="h-5 w-5" />
            <span className="font-medium">{ctrl.total}명 참여중</span>
          </div>
          {/* 타이머 */}
          {q && (
            <div className="flex items-center gap-2 rounded-full bg-white/15 px-4 py-2">
              <Clock className="h-4 w-4 text-white/80" />
              <span className={`font-mono text-lg font-bold tabular-nums ${isTimeCritical ? 'text-red-300 animate-pulse' : 'text-white'}`}>
                {String(Math.floor(ctrl.timeRemaining / 60)).padStart(2, '0')}:
                {String(ctrl.timeRemaining % 60).padStart(2, '0')}
              </span>
            </div>
          )}
        </div>
      </header>

      {/* 메인 게임 뷰 */}
      <div className="flex flex-1 flex-col items-center justify-center px-8 pb-32">
        {q ? (
          <div className="w-full max-w-3xl space-y-8">
            {/* 문항 내용 */}
            <div className="rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 px-10 py-8">
              <p className="text-center text-2xl font-bold leading-relaxed text-white">
                {q.question.content}
              </p>
            </div>

            {/* 선택지 그리드 */}
            {q.question.options && (
              <div className="grid grid-cols-2 gap-4">
                {q.question.options.map((opt) => (
                  <div
                    key={opt.index}
                    className={`flex items-center gap-4 rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm px-6 py-5 transition-all ${OPTION_COLORS[opt.index] ? '' : ''}`}
                  >
                    <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-white font-bold ${OPTION_COLORS[opt.index] || 'bg-gray-500'}`}>
                      {opt.index}
                    </div>
                    <span className="text-lg font-medium text-white">{opt.text}</span>
                  </div>
                ))}
              </div>
            )}

            {/* OX 표시 */}
            {q.question.type === 'ox' && (
              <div className="grid grid-cols-2 gap-6">
                <div className="flex items-center justify-center rounded-2xl bg-blue-500/30 border border-blue-300/30 py-16 text-6xl font-black text-white">
                  O
                </div>
                <div className="flex items-center justify-center rounded-2xl bg-rose-500/30 border border-rose-300/30 py-16 text-6xl font-black text-white">
                  X
                </div>
              </div>
            )}

            {/* 응답 진행률 바 */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm text-white/70">
                <span>응답 현황</span>
                <span className="font-medium tabular-nums">{ctrl.answered} / {ctrl.total}명 ({answerPct}%)</span>
              </div>
              <Progress value={answerPct} className="h-3 bg-white/20 [&>div]:bg-white/80" />
            </div>
          </div>
        ) : (
          <p className="text-xl text-white/50">문항 대기 중...</p>
        )}
      </div>

      {/* ═══════════════════════════════════════════════════════════
          하단 퀵 컨트롤 바 (항상 보임)
          ═══════════════════════════════════════════════════════════ */}
      <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between bg-black/40 backdrop-blur-md px-8 py-4">
        {/* 좌: 빠른 제어 */}
        <div className="flex items-center gap-3">
          <Button
            size="lg"
            variant="ghost"
            className="text-white hover:bg-white/20"
            onClick={handlePauseResume}
          >
            {ctrl.isPaused ? <Play className="mr-2 h-5 w-5" /> : <Pause className="mr-2 h-5 w-5" />}
            {ctrl.isPaused ? '재개' : '일시정지'}
          </Button>

          {isLastQuestion ? (
            <Button
              size="lg"
              className="bg-white text-blue-700 hover:bg-white/90 font-bold"
              onClick={handleNextQuestion}
              disabled={!q}
            >
              게임 종료
              <ChevronRight className="ml-1 h-5 w-5" />
            </Button>
          ) : (
            <Button
              size="lg"
              className="bg-white text-blue-700 hover:bg-white/90 font-bold"
              onClick={handleNextQuestion}
              disabled={!q}
            >
              다음 문항
              <ChevronRight className="ml-1 h-5 w-5" />
            </Button>
          )}
        </div>

        {/* 우: 컨트롤 패널 열기 버튼 */}
        <Button
          size="lg"
          onClick={() => setPanelOpen(true)}
          className="gap-2 bg-white/20 text-white hover:bg-white/30 border border-white/30 font-semibold"
        >
          <Settings2 className="h-5 w-5" />
          컨트롤 패널
        </Button>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          컨트롤 패널 팝업 오버레이
          ═══════════════════════════════════════════════════════════ */}
      {panelOpen && (
        <div className="absolute inset-0 z-50 flex">
          {/* 반투명 배경 */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setPanelOpen(false)}
          />

          {/* 패널 본체 */}
          <div className="relative mx-auto my-4 flex w-[95vw] max-w-[1600px] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            {/* 패널 헤더 */}
            <header className="flex items-center justify-between border-b px-6 py-3">
              <div className="flex items-center gap-3">
                <Settings2 className="h-5 w-5 text-gray-500" />
                <h2 className="text-base font-bold text-gray-900">컨트롤 패널</h2>
                {q && (
                  <Badge variant="outline" className="font-mono text-xs">
                    Q{q.questionIndex} / {q.totalQuestions}
                  </Badge>
                )}
                <div className="flex items-center gap-1.5 text-sm text-gray-500">
                  <Users className="h-4 w-4" />
                  <span className="tabular-nums">{ctrl.total}명</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPanelOpen(false)}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </header>

            {/* 패널 3-Column 레이아웃 */}
            <div className="flex flex-1 overflow-hidden">
              {/* 좌: 문항 + 제어 */}
              <div className="flex w-[340px] flex-shrink-0 flex-col border-r overflow-hidden">
                <div className="flex-1 overflow-y-auto">
                  <QuestionPanel
                    question={ctrl.question}
                    hintRevealed={ctrl.hintRevealed}
                    timeRemaining={ctrl.timeRemaining}
                    isPaused={ctrl.isPaused}
                  />
                </div>
                <ControlActions
                  isPaused={ctrl.isPaused}
                  isLastQuestion={isLastQuestion}
                  hintRevealed={ctrl.hintRevealed}
                  hasHint={!!ctrl.question?.question.hint}
                  hasQuestion={!!ctrl.question}
                  onPauseResume={handlePauseResume}
                  onHint={handleHint}
                  onSkip={handleSkip}
                  onNextQuestion={handleNextQuestion}
                  onExtendTime={handleExtendTime}
                  onForceEnd={handleForceEnd}
                />
              </div>

              {/* 중앙: 학생 모니터링 */}
              <div className="flex flex-1 flex-col overflow-hidden">
                <div className="flex-1 overflow-y-auto p-4">
                  <StudentGrid
                    students={students}
                    onSelectStudent={handleSelectStudent}
                    selectedIds={selectedIds}
                    onSelectedIdsChange={setSelectedIds}
                    multiSelectMode={multiSelectMode}
                    onMultiSelectModeChange={setMultiSelectMode}
                  />
                </div>
                <div className="border-t bg-white px-4 py-2.5">
                  <ReactionBar
                    selectedStudentIds={selectedIds}
                    onSendReaction={handleSendReaction}
                    sessionId={sessionId}
                  />
                </div>
              </div>

              {/* 우: 분석 + 리더보드 */}
              <div className="flex w-[380px] flex-shrink-0 flex-col border-l overflow-hidden">
                <div className="flex-1 overflow-y-auto">
                  <LiveAnalytics
                    analytics={analytics}
                    question={ctrl.question}
                    hintRevealed={ctrl.hintRevealed}
                  />
                </div>
                <LiveLeaderboard
                  entries={MOCK_LEADERBOARD}
                  visible={leaderboardVisible}
                  onToggleVisibility={() => setLeaderboardVisible(!leaderboardVisible)}
                />
              </div>
            </div>
          </div>

          {/* 학생 상세 모달 */}
          <StudentDetailModal
            student={detailStudent}
            open={detailOpen}
            onOpenChange={setDetailOpen}
          />
        </div>
      )}
    </div>
  )
}
