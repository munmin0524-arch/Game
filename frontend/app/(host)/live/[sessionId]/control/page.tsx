// S-07 컨트롤 패널 (Host)
// 스펙: docs/screens/phase1-live-core.md#s-07

'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  Pause,
  Play,
  SkipForward,
  Lightbulb,
  Clock,
  XCircle,
  ChevronRight,
  Users,
  CheckCircle2,
  Timer,
  LightbulbOff,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
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
} from '@/lib/websocket'
import type { Session, WsQuestionShow, WsAnswerCountUpdate, QuestionType } from '@/types'

// ─────────────────────────────────────────────────────────────
// 상수
// ─────────────────────────────────────────────────────────────

const CIRCLE_NUMBERS = ['', '\u2460', '\u2461', '\u2462', '\u2463', '\u2464'] as const
const OPTION_COLORS = [
  '', // 0 unused
  'bg-blue-500',
  'bg-emerald-500',
  'bg-amber-500',
  'bg-rose-500',
  'bg-purple-500',
] as const
const OPTION_LIGHT_COLORS = [
  '',
  'bg-blue-50 border-blue-200 text-blue-700',
  'bg-emerald-50 border-emerald-200 text-emerald-700',
  'bg-amber-50 border-amber-200 text-amber-700',
  'bg-rose-50 border-rose-200 text-rose-700',
  'bg-purple-50 border-purple-200 text-purple-700',
] as const

const QUESTION_TYPE_LABEL: Record<QuestionType, string> = {
  multiple_choice: '객관식',
  ox: 'O/X',
  short_answer: '단답형',
  fill_in_blank: '빈칸 채우기',
}

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

// ─────────────────────────────────────────────────────────────
// Mock 데이터 (WS 미연결 상태에서도 UI 확인용)
// ─────────────────────────────────────────────────────────────

const MOCK_STATE: ControlState = {
  question: {
    question: {
      question_id: 'q-1',
      type: 'multiple_choice',
      content: '다음 중 소수(Prime Number)가 아닌 것은?',
      options: [
        { index: 1, text: '2' },
        { index: 2, text: '3' },
        { index: 3, text: '4' },
        { index: 4, text: '5' },
      ],
      hint: '소수는 1과 자기 자신만으로 나누어지는 수입니다.',
    },
    questionIndex: 2,
    totalQuestions: 5,
    timeLimit: 20,
  },
  isPaused: false,
  answered: 18,
  total: 24,
  distribution: { '1': 5, '2': 4, '3': 7, '4': 2 },
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

  // ── 타이머 시작 ──
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

    // TODO: 실제 auth token 연결
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
        startTimer(0) // 재개 시 남은 시간부터 카운트다운
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
    if (ctrl.isPaused) {
      resumeGame()
    } else {
      pauseGame()
    }
  }

  const handleSkip = () => {
    skipQuestion(sessionId)
  }

  const handleNextQuestion = () => {
    skipQuestion(sessionId) // 다음 문항으로 진행 (서버가 다음 question:show를 발송)
  }

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

  const handleExtendTime = () => {
    extendTime(30)
    setCtrl((prev) => ({ ...prev, timeRemaining: prev.timeRemaining + 30 }))
    toast({ title: '30초 연장했습니다.' })
  }

  const handleForceEnd = () => {
    forceEndGame(sessionId)
  }

  // ── 파생값 ──
  const answerPct = ctrl.total > 0 ? Math.round((ctrl.answered / ctrl.total) * 100) : 0
  const timePct = ctrl.question
    ? Math.round((ctrl.timeRemaining / ctrl.question.timeLimit) * 100)
    : 0
  const isTimeCritical = ctrl.timeRemaining <= 5
  const allAnswered = ctrl.total > 0 && ctrl.answered >= ctrl.total
  const distributionEntries = Object.entries(ctrl.distribution)
  const maxDistCount = distributionEntries.length > 0
    ? Math.max(...distributionEntries.map(([, c]) => c))
    : 0

  return (
    <div className="flex h-screen flex-col bg-gray-50">
      {/* ─── 헤더 ─── */}
      <header className="flex items-center justify-between border-b bg-white px-6 py-3 shadow-sm">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-semibold text-gray-900">
            {session?.set_title ?? '로딩 중...'}
          </h1>
          {ctrl.question && (
            <>
              <Badge variant="outline" className="font-mono">
                {ctrl.question.questionIndex} / {ctrl.question.totalQuestions}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {QUESTION_TYPE_LABEL[ctrl.question.question.type]}
              </Badge>
            </>
          )}
          {ctrl.isPaused && (
            <Badge className="animate-pulse bg-yellow-100 text-yellow-700 border border-yellow-300">
              일시정지
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* 참여자 수 요약 */}
          <div className="flex items-center gap-1.5 text-sm text-gray-500">
            <Users className="h-4 w-4" />
            <span className="font-medium">{ctrl.total}명</span>
          </div>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <XCircle className="mr-1 h-4 w-4" />
                강제 종료
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>게임을 강제 종료할까요?</AlertDialogTitle>
                <AlertDialogDescription>
                  지금 종료하면 현재까지의 결과로 랭킹이 집계됩니다.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>취소</AlertDialogCancel>
                <AlertDialogAction onClick={handleForceEnd} className="bg-red-600 hover:bg-red-700">
                  종료
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </header>

      {/* ─── 메인 콘텐츠 ─── */}
      <div className="flex flex-1 overflow-hidden">
        {/* 좌: 현재 문항 미리보기 */}
        <div className="flex w-[420px] flex-col border-r bg-white">
          <div className="border-b px-6 py-3">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
              현재 문항
            </h2>
          </div>

          {ctrl.question ? (
            <div className="flex flex-1 flex-col gap-5 overflow-y-auto p-6">
              {/* 문항 내용 */}
              <div className="rounded-xl border bg-gray-50 p-5">
                <p className="text-[15px] leading-relaxed text-gray-800 font-medium">
                  {ctrl.question.question.content}
                </p>
              </div>

              {/* 선택지 */}
              {ctrl.question.question.options && (
                <div className="grid grid-cols-2 gap-2">
                  {ctrl.question.question.options.map((opt) => (
                    <div
                      key={opt.index}
                      className={`rounded-lg border p-3 text-sm ${OPTION_LIGHT_COLORS[opt.index] || 'bg-gray-50 text-gray-700'}`}
                    >
                      <span className="font-semibold">{CIRCLE_NUMBERS[opt.index]}</span>{' '}
                      {opt.text}
                    </div>
                  ))}
                </div>
              )}

              {/* OX 표시 */}
              {ctrl.question.question.type === 'ox' && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center justify-center rounded-xl border-2 border-blue-200 bg-blue-50 py-6 text-3xl font-bold text-blue-600">
                    O
                  </div>
                  <div className="flex items-center justify-center rounded-xl border-2 border-rose-200 bg-rose-50 py-6 text-3xl font-bold text-rose-600">
                    X
                  </div>
                </div>
              )}

              {/* 단답형 표시 */}
              {ctrl.question.question.type === 'short_answer' && (
                <div className="rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 py-6 text-center text-sm text-gray-400">
                  학생이 직접 답을 입력합니다
                </div>
              )}

              {/* 힌트 상태 */}
              {ctrl.question.question.hint && (
                <div
                  className={`rounded-lg border p-3 text-sm ${
                    ctrl.hintRevealed
                      ? 'border-amber-200 bg-amber-50 text-amber-800'
                      : 'border-gray-200 bg-gray-50 text-gray-400'
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    {ctrl.hintRevealed ? (
                      <Lightbulb className="h-4 w-4 text-amber-500" />
                    ) : (
                      <LightbulbOff className="h-4 w-4" />
                    )}
                    <span className="font-medium text-xs uppercase tracking-wide">
                      {ctrl.hintRevealed ? '힌트 공개됨' : '힌트 대기'}
                    </span>
                  </div>
                  {ctrl.hintRevealed ? (
                    <p>{ctrl.question.question.hint}</p>
                  ) : (
                    <p className="italic">공개 전에는 표시되지 않습니다</p>
                  )}
                </div>
              )}

              {/* 타이머 */}
              <div className="mt-auto space-y-3 rounded-xl border bg-gray-50 p-4">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    남은 시간
                  </span>
                  <span
                    className={`font-mono text-2xl font-bold tabular-nums transition-colors ${
                      isTimeCritical ? 'text-red-600 animate-pulse' : 'text-gray-900'
                    }`}
                  >
                    {String(Math.floor(ctrl.timeRemaining / 60)).padStart(2, '0')}:
                    {String(ctrl.timeRemaining % 60).padStart(2, '0')}
                  </span>
                </div>
                <Progress
                  value={timePct}
                  className={`h-2 transition-all ${isTimeCritical ? '[&>div]:bg-red-500' : '[&>div]:bg-blue-500'}`}
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={handleExtendTime}
                >
                  <Timer className="mr-1.5 h-4 w-4" />
                  +30초 연장
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-1 items-center justify-center text-gray-400 text-sm">
              문항 대기 중...
            </div>
          )}
        </div>

        {/* 우: 응답 현황 */}
        <div className="flex flex-1 flex-col">
          <div className="border-b px-6 py-3">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
              응답 현황
            </h2>
          </div>

          <div className="flex flex-1 flex-col gap-6 overflow-y-auto p-6">
            {/* 응답 집계 카드 */}
            <div className="rounded-xl border bg-white p-5 shadow-sm">
              <div className="flex items-end justify-between mb-3">
                <div>
                  <p className="text-sm text-gray-500 mb-1">응답 완료</p>
                  <p className="text-3xl font-bold text-gray-900 tabular-nums">
                    {ctrl.answered}
                    <span className="text-lg font-normal text-gray-400"> / {ctrl.total}명</span>
                  </p>
                </div>
                <div className="text-right">
                  <div
                    className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-semibold ${
                      allAnswered
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {allAnswered && <CheckCircle2 className="h-4 w-4" />}
                    {answerPct}%
                  </div>
                </div>
              </div>
              <Progress value={answerPct} className="h-3 [&>div]:bg-blue-500" />
              {allAnswered && (
                <p className="mt-2 text-sm text-green-600 font-medium">
                  모든 학생이 응답을 완료했습니다
                </p>
              )}
            </div>

            {/* 선택지 분포 */}
            {distributionEntries.length > 0 && (
              <div className="rounded-xl border bg-white p-5 shadow-sm">
                <p className="text-sm font-semibold text-gray-700 mb-4">실시간 선택 분포</p>
                <div className="space-y-3">
                  {distributionEntries.map(([key, count]) => {
                    const pct = ctrl.answered > 0 ? Math.round((count / ctrl.answered) * 100) : 0
                    const barPct = maxDistCount > 0 ? Math.round((count / maxDistCount) * 100) : 0
                    const idx = Number(key)
                    const isNumericOption = !isNaN(idx) && idx >= 1 && idx <= 5

                    return (
                      <div key={key} className="group">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-gray-700">
                            {key === 'O' || key === 'X'
                              ? key
                              : isNumericOption
                                ? `${CIRCLE_NUMBERS[idx]} ${ctrl.question?.question.options?.[idx - 1]?.text ?? ''}`
                                : key}
                          </span>
                          <span className="text-sm tabular-nums text-gray-500">
                            {count}명 ({pct}%)
                          </span>
                        </div>
                        <div className="h-8 w-full rounded-lg bg-gray-100 overflow-hidden">
                          <div
                            className={`h-full rounded-lg transition-all duration-500 ease-out flex items-center ${
                              isNumericOption
                                ? OPTION_COLORS[idx] || 'bg-gray-400'
                                : key === 'O'
                                  ? 'bg-blue-500'
                                  : key === 'X'
                                    ? 'bg-rose-500'
                                    : 'bg-gray-400'
                            }`}
                            style={{ width: `${Math.max(barPct, 2)}%` }}
                          >
                            {barPct > 15 && (
                              <span className="pl-3 text-xs font-semibold text-white">{count}명</span>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* 미응답 표시 */}
                {ctrl.total - ctrl.answered > 0 && (
                  <div className="mt-3 pt-3 border-t text-sm text-gray-400">
                    미응답: {ctrl.total - ctrl.answered}명
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ─── 하단 컨트롤 바 ─── */}
      <div className="border-t bg-white px-6 py-4 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
        <div className="flex items-center justify-center gap-3">
          {/* 일시정지 / 재개 */}
          <Button
            size="lg"
            variant={ctrl.isPaused ? 'default' : 'outline'}
            onClick={handlePauseResume}
            className="min-w-[130px]"
          >
            {ctrl.isPaused ? (
              <>
                <Play className="mr-2 h-5 w-5" />
                재개
              </>
            ) : (
              <>
                <Pause className="mr-2 h-5 w-5" />
                일시정지
              </>
            )}
          </Button>

          {/* 힌트 공개 */}
          <Button
            size="lg"
            variant="outline"
            onClick={handleHint}
            className="min-w-[130px]"
            disabled={!ctrl.question || ctrl.hintRevealed || !ctrl.question?.question.hint}
          >
            <Lightbulb className={`mr-2 h-5 w-5 ${ctrl.hintRevealed ? 'text-amber-500' : ''}`} />
            {ctrl.hintRevealed ? '힌트 공개됨' : '힌트 공개'}
          </Button>

          {/* 건너뛰기 */}
          {isLastQuestion ? (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button size="lg" variant="outline" className="min-w-[130px]">
                  <SkipForward className="mr-2 h-5 w-5" />
                  건너뛰기
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>마지막 문항입니다</AlertDialogTitle>
                  <AlertDialogDescription>
                    건너뛰면 게임이 종료됩니다. 계속하시겠어요?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>취소</AlertDialogCancel>
                  <AlertDialogAction onClick={handleSkip}>종료</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          ) : (
            <Button
              size="lg"
              variant="outline"
              onClick={handleSkip}
              className="min-w-[130px]"
              disabled={!ctrl.question}
            >
              <SkipForward className="mr-2 h-5 w-5" />
              건너뛰기
            </Button>
          )}

          {/* 구분선 */}
          <div className="mx-2 h-8 w-px bg-gray-200" />

          {/* 다음 문항 (핵심 CTA) */}
          {isLastQuestion ? (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  size="lg"
                  className="min-w-[160px] bg-blue-600 hover:bg-blue-700"
                  disabled={!ctrl.question}
                >
                  게임 종료
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>마지막 문항입니다</AlertDialogTitle>
                  <AlertDialogDescription>
                    다음으로 넘어가면 게임이 종료되고 결과 화면으로 이동합니다.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>취소</AlertDialogCancel>
                  <AlertDialogAction onClick={handleNextQuestion}>게임 종료</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          ) : (
            <Button
              size="lg"
              className="min-w-[160px] bg-blue-600 hover:bg-blue-700"
              onClick={handleNextQuestion}
              disabled={!ctrl.question}
            >
              다음 문항
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
