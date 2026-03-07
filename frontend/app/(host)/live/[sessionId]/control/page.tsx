// S-07 컨트롤 패널 (Host)
// 헤더 툴바 + 메인(학생 테이블) + 접을 수 있는 우측 사이드바

'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
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

import HeaderControlBar from '@/components/host/control/HeaderControlBar'
import StudentGrid from '@/components/host/control/StudentGrid'
import StudentDetailModal from '@/components/host/control/StudentDetailModal'
import ReactionBar from '@/components/host/control/ReactionBar'
import SidebarTabs from '@/components/host/control/SidebarTabs'

import {
  MOCK_STUDENTS,
  MOCK_ANALYTICS,
  MOCK_LEADERBOARD,
  MOCK_QUESTION,
} from '@/lib/mock/control-mock-data'

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

  const [session, setSession] = useState<Session | null>(null)
  const [ctrl, setCtrl] = useState<ControlState>(MOCK_STATE)
  const [isLastQuestion, setIsLastQuestion] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const cleanupRef = useRef<(() => void)[]>([])

  const [students] = useState<StudentMonitorData[]>(MOCK_STUDENTS)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [multiSelectMode, setMultiSelectMode] = useState(false)
  const [detailStudent, setDetailStudent] = useState<StudentMonitorData | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)

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

  // ── WebSocket ──
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
        setCtrl((prev) => ({ ...prev, answered: data.answered, total: data.total, distribution: data.distribution }))
      }),
      onWsEvent('game:pause', () => {
        setCtrl((prev) => ({ ...prev, isPaused: true }))
        if (timerRef.current) clearInterval(timerRef.current)
      }),
      onWsEvent('game:resume', () => {
        setCtrl((prev) => ({ ...prev, isPaused: false }))
        startTimer(0)
      }),
      onWsEvent('game:end', () => router.push(`/result/${sessionId}`)),
      onWsEvent('connect_error', () => toast({ title: '연결이 끊겼습니다. 재연결 중...', variant: 'destructive' })),
    ]
    cleanupRef.current = unsubs
    return () => {
      cleanupRef.current.forEach((fn) => fn())
      if (timerRef.current) clearInterval(timerRef.current)
      leaveSessionRoom(sessionId)
    }
  }, [sessionId, router, toast, startTimer])

  // ── 핸들러 ──
  const handlePauseResume = () => { ctrl.isPaused ? resumeGame() : pauseGame() }
  const handleSkip = () => skipQuestion(sessionId)
  const handleNextQuestion = () => skipQuestion(sessionId)
  const handleHint = () => {
    if (!ctrl.question?.question.hint) { toast({ title: '이 문항에는 힌트가 없습니다.' }); return }
    if (ctrl.hintRevealed) { toast({ title: '이미 힌트를 공개했습니다.' }); return }
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
  const handleClose = () => router.back()

  return (
    <div className="flex h-screen flex-col bg-gray-50">
      {/* ─── 헤더 툴바 ─── */}
      <HeaderControlBar
        question={ctrl.question}
        isPaused={ctrl.isPaused}
        isLastQuestion={isLastQuestion}
        hintRevealed={ctrl.hintRevealed}
        hasHint={!!ctrl.question?.question.hint}
        timeRemaining={ctrl.timeRemaining}
        total={ctrl.total}
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        onPauseResume={handlePauseResume}
        onHint={handleHint}
        onSkip={handleSkip}
        onNextQuestion={handleNextQuestion}
        onExtendTime={handleExtendTime}
        onForceEnd={handleForceEnd}
        onClose={handleClose}
      />

      {/* ─── 메인 + 사이드바 ─── */}
      <div className="flex flex-1 overflow-hidden">
        {/* ── 메인: 학생 모니터링 ── */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-5">
            <StudentGrid
              students={students}
              onSelectStudent={handleSelectStudent}
              selectedIds={selectedIds}
              onSelectedIdsChange={setSelectedIds}
              multiSelectMode={multiSelectMode}
              onMultiSelectModeChange={setMultiSelectMode}
            />
          </div>
          <div className="border-t bg-white px-5 py-3">
            <ReactionBar
              selectedStudentIds={selectedIds}
              onSendReaction={handleSendReaction}
              sessionId={sessionId}
            />
          </div>
        </div>

        {/* ── 우측 사이드바 (접기 가능) ── */}
        {sidebarOpen && (
          <div className="w-[360px] flex-shrink-0 border-l bg-white overflow-hidden">
            <SidebarTabs
              question={ctrl.question}
              hintRevealed={ctrl.hintRevealed}
              isPaused={ctrl.isPaused}
              analytics={analytics}
              leaderboardEntries={MOCK_LEADERBOARD}
            />
          </div>
        )}
      </div>

      {/* ── 학생 상세 모달 ── */}
      <StudentDetailModal
        student={detailStudent}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />
    </div>
  )
}
