// S-07 컨트롤 패널 (Host) — v3 스피드 퀴즈 개별 진행
// 2-패널: 좌측(학생 테이블 flex-3) + 우측(문항+분석 flex-2)

'use client'

import { useEffect, useState, useRef, useCallback, useMemo } from 'react'
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
  forceEndGame,
} from '@/lib/websocket'
import type {
  Session,
  WsAnswerCountUpdate,
  StudentMonitorData,
} from '@/types'

import HeaderControlBar from '@/components/host/control/HeaderControlBar'
import StudentGrid from '@/components/host/control/StudentGrid'
import StudentDetailModal from '@/components/host/control/StudentDetailModal'
import QuestionAnalyticsPanel from '@/components/host/control/QuestionAnalyticsPanel'

import {
  MOCK_STUDENTS,
  MOCK_QUESTION_ANALYTICS,
} from '@/lib/mock/control-mock-data'

// ─────────────────────────────────────────────────────────────
// 컴포넌트
// ─────────────────────────────────────────────────────────────

export default function ControlPage() {
  const { sessionId } = useParams<{ sessionId: string }>()
  const router = useRouter()
  const { toast } = useToast()

  const [session, setSession] = useState<Session | null>(null)
  const [isPaused, setIsPaused] = useState(false)
  const [elapsedTime, setElapsedTime] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const cleanupRef = useRef<(() => void)[]>([])

  const [students] = useState<StudentMonitorData[]>(MOCK_STUDENTS)
  const [detailStudent, setDetailStudent] = useState<StudentMonitorData | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0)

  const finishedCount = useMemo(
    () => students.filter((s) => s.isFinished).length,
    [students],
  )

  // ── 타이머 (경과 시간 카운트업) ──
  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setElapsedTime((prev) => prev + 1)
    }, 1000)
  }, [])

  // ── WebSocket ──
  useEffect(() => {
    sessionsApi.get(sessionId).then(setSession).catch(() => {})
    connectSocket('host-token')
    joinSessionRoom(sessionId)
    startTimer()

    const unsubs = [
      onWsEvent('answer:count-update', (_data: WsAnswerCountUpdate) => {
        // TODO: 학생별 진행도 업데이트
      }),
      onWsEvent('game:pause', () => {
        setIsPaused(true)
        if (timerRef.current) clearInterval(timerRef.current)
      }),
      onWsEvent('game:resume', () => {
        setIsPaused(false)
        startTimer()
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
  const handlePauseResume = () => { isPaused ? resumeGame() : pauseGame() }
  const handleForceEnd = () => forceEndGame(sessionId)
  const handleSelectStudent = (student: StudentMonitorData) => {
    setDetailStudent(student)
    setDetailOpen(true)
  }
  const handleClose = () => router.back()

  return (
    <div className="flex h-screen flex-col bg-gray-50">
      {/* ─── 헤더 툴바 ─── */}
      <HeaderControlBar
        isPaused={isPaused}
        elapsedTime={elapsedTime}
        totalStudents={students.length}
        finishedCount={finishedCount}
        onPauseResume={handlePauseResume}
        onForceEnd={handleForceEnd}
        onClose={handleClose}
      />

      {/* ─── 메인: 2패널 (3:2) ─── */}
      <div className="flex flex-1 overflow-hidden">
        {/* ── 좌측: 학생 모니터링 (flex-3) ── */}
        <div className="flex flex-[3] flex-col overflow-hidden border-r">
          <div className="flex-1 overflow-y-auto p-5">
            <StudentGrid
              students={students}
              onSelectStudent={handleSelectStudent}
            />
          </div>
        </div>

        {/* ── 우측: 문항 + 분석 (flex-2) ── */}
        <div className="flex-[2] bg-white overflow-hidden">
          <QuestionAnalyticsPanel
            questions={MOCK_QUESTION_ANALYTICS}
            students={students}
            selectedIndex={selectedQuestionIndex}
            onSelectedIndexChange={setSelectedQuestionIndex}
          />
        </div>
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
