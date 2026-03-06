// S-06 플레이 화면 (학생)
// 스펙: docs/screens/phase1-live-core.md#s-06

'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Lightbulb } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useToast } from '@/components/ui/use-toast'
import { sessionsApi } from '@/lib/api'
import {
  connectSocket,
  joinSessionRoom,
  leaveSessionRoom,
  onWsEvent,
  submitAnswer,
} from '@/lib/websocket'
import type { WsQuestionShow, WsQuestionEnd, QuestionOption } from '@/types'

type PlayPhase = 'guest_entry' | 'waiting' | 'question' | 'feedback' | 'paused' | 'ended'

interface GuestForm {
  email: string
  nickname: string
}

interface FeedbackState {
  correctAnswer: string
  is_correct: boolean
  score_earned: number
  my_rank: number
}

interface CurrentQuestion {
  question_id: string
  type: 'multiple_choice' | 'ox' | 'short_answer'
  content: string
  options: QuestionOption[] | null
  hint: string | null
  questionIndex: number
  totalQuestions: number
  timeLimit: number
}

export default function PlayPage() {
  const { sessionId } = useParams<{ sessionId: string }>()
  const router = useRouter()
  const { toast } = useToast()

  const [phase, setPhase] = useState<PlayPhase>('waiting')
  const [isGuest, setIsGuest] = useState(false)
  const [guestForm, setGuestForm] = useState<GuestForm>({ email: '', nickname: '' })
  const [guestSubmitting, setGuestSubmitting] = useState(false)
  const [showLoginPrompt, setShowLoginPrompt] = useState(false)

  const [currentQ, setCurrentQ] = useState<CurrentQuestion | null>(null)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [shortAnswerText, setShortAnswerText] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [hintVisible, setHintVisible] = useState(false)

  const [timeRemaining, setTimeRemaining] = useState(0)
  const [feedback, setFeedback] = useState<FeedbackState | null>(null)

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const answerStartRef = useRef<number>(Date.now())
  const cleanupRef = useRef<(() => void)[]>([])

  // 게스트 여부 확인 (TODO: 실제 인증 상태 확인)
  useEffect(() => {
    const guestToken = document.cookie.match(/guest_token=([^;]+)/)
    if (!guestToken) {
      setIsGuest(true)
      setPhase('guest_entry')
    }
  }, [])

  const initWebSocket = useCallback(() => {
    // TODO: 실제 auth token 연결
    connectSocket('student-token')
    joinSessionRoom(sessionId)

    const unsubs = [
      onWsEvent('question:show', (data: WsQuestionShow) => {
        setPhase('question')
        setCurrentQ({
          ...data.question,
          questionIndex: data.questionIndex,
          totalQuestions: data.totalQuestions,
          timeLimit: data.timeLimit,
        })
        setSelectedAnswer(null)
        setShortAnswerText('')
        setSubmitted(false)
        setHintVisible(false)
        setTimeRemaining(data.timeLimit)
        answerStartRef.current = Date.now()

        if (timerRef.current) clearInterval(timerRef.current)
        timerRef.current = setInterval(() => {
          setTimeRemaining((prev) => {
            if (prev <= 1) {
              clearInterval(timerRef.current!)
              return 0
            }
            return prev - 1
          })
        }, 1000)
      }),

      onWsEvent('question:end', (data: WsQuestionEnd) => {
        if (timerRef.current) clearInterval(timerRef.current)
        setFeedback({
          correctAnswer: data.correctAnswer,
          is_correct: data.is_correct,
          score_earned: data.score_earned,
          my_rank: data.my_rank,
        })
        setPhase('feedback')
      }),

      onWsEvent('game:pause' as 'game:end', () => {
        setPhase('paused')
        if (timerRef.current) clearInterval(timerRef.current)
      }),

      onWsEvent('game:resume' as 'game:end', () => {
        setPhase('question')
      }),

      onWsEvent('game:end', () => {
        router.push(`/result/${sessionId}`)
      }),

      onWsEvent('connect_error', () => {
        toast({ title: '연결이 끊겼습니다. 재연결 중...', variant: 'destructive' })
      }),
    ]
    cleanupRef.current = unsubs
  }, [sessionId, router, toast])

  useEffect(() => {
    if (phase !== 'guest_entry') {
      initWebSocket()
    }

    return () => {
      cleanupRef.current.forEach((fn) => fn())
      if (timerRef.current) clearInterval(timerRef.current)
      leaveSessionRoom(sessionId)
    }
  }, [phase, sessionId, initWebSocket])

  const handleGuestSubmit = async () => {
    if (!guestForm.email || !guestForm.nickname) {
      toast({ title: '이메일과 닉네임을 모두 입력해 주세요.', variant: 'destructive' })
      return
    }
    setGuestSubmitting(true)
    try {
      await sessionsApi.guestEnter(sessionId, guestForm.email, guestForm.nickname)
      // TODO: 기존 회원 이메일 충돌 → setShowLoginPrompt(true)
      setPhase('waiting')
    } catch (err: unknown) {
      const error = err as { status?: number }
      if (error?.status === 409) {
        setShowLoginPrompt(true)
      } else {
        toast({ title: '입장에 실패했습니다. 다시 시도해 주세요.', variant: 'destructive' })
      }
    } finally {
      setGuestSubmitting(false)
    }
  }

  const handleSelectAnswer = (answer: string) => {
    if (submitted) return
    setSelectedAnswer(answer)
  }

  const handleSubmit = () => {
    if (submitted) return
    const answer =
      currentQ?.type === 'short_answer' ? shortAnswerText.trim() : (selectedAnswer ?? '')
    if (!answer) return

    const timeSpent = Math.round((Date.now() - answerStartRef.current) / 1000)
    submitAnswer(currentQ!.question_id, answer, timeSpent)
    setSubmitted(true)
  }

  const timePct = currentQ ? Math.round((timeRemaining / currentQ.timeLimit) * 100) : 0
  const timerColor =
    timeRemaining <= 5 ? 'text-red-400' : timeRemaining <= 10 ? 'text-yellow-400' : 'text-white'

  // ─── 게스트 입장 모달 ───────────────────────────────────────────────
  if (phase === 'guest_entry') {
    return (
      <>
        <Dialog open>
          <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
            <DialogHeader>
              <DialogTitle>게임 입장</DialogTitle>
              <DialogDescription>이메일과 닉네임을 입력하고 참여하세요.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-1">
                <Label htmlFor="email">이메일</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@email.com"
                  value={guestForm.email}
                  onChange={(e) => setGuestForm((f) => ({ ...f, email: e.target.value }))}
                  onKeyDown={(e) => e.key === 'Enter' && handleGuestSubmit()}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="nickname">닉네임</Label>
                <Input
                  id="nickname"
                  placeholder="게임에서 표시될 이름"
                  value={guestForm.nickname}
                  onChange={(e) => setGuestForm((f) => ({ ...f, nickname: e.target.value }))}
                  onKeyDown={(e) => e.key === 'Enter' && handleGuestSubmit()}
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleGuestSubmit} disabled={guestSubmitting} className="w-full">
                {guestSubmitting ? '입장 중...' : '입장하기'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* 기존 회원 이메일 충돌 팝업 */}
        <Dialog open={showLoginPrompt} onOpenChange={setShowLoginPrompt}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>이미 가입된 이메일입니다</DialogTitle>
              <DialogDescription>
                해당 이메일로 가입된 계정이 있습니다. 로그인하시겠어요?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex gap-2">
              <Button variant="outline" onClick={() => setShowLoginPrompt(false)}>
                게스트로 계속
              </Button>
              <Button onClick={() => router.push('/login')}>로그인</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    )
  }

  // ─── 대기 화면 ──────────────────────────────────────────────────────
  if (phase === 'waiting') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-white border-t-transparent" />
        <p className="text-lg text-gray-300">선생님이 게임을 시작하기를 기다리는 중...</p>
      </div>
    )
  }

  // ─── 일시정지 오버레이 ──────────────────────────────────────────────
  if (phase === 'paused') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gray-900">
        <span className="text-6xl">⏸</span>
        <h2 className="text-2xl font-bold text-white">잠시 멈춤</h2>
        <p className="text-gray-400">선생님이 게임을 일시정지했습니다.</p>
      </div>
    )
  }

  // ─── 피드백 화면 ────────────────────────────────────────────────────
  if (phase === 'feedback' && feedback) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4">
        <div className="text-center">
          <span className="text-5xl">{feedback.is_correct ? '✅' : '❌'}</span>
          <h2 className="mt-4 text-2xl font-bold text-white">
            {feedback.is_correct ? '정답!' : '오답'}
          </h2>
          <p className="mt-2 text-gray-300">
            정답은{' '}
            <span className="font-semibold text-white">{feedback.correctAnswer}</span> 입니다.
          </p>
        </div>

        <div className="rounded-lg bg-white/10 px-8 py-4 text-center">
          <p className="text-sm text-gray-400">획득 점수</p>
          <p className="text-3xl font-bold text-yellow-400">+{feedback.score_earned}</p>
        </div>

        <div className="rounded-lg bg-white/10 px-8 py-4 text-center">
          <p className="text-sm text-gray-400">현재 순위</p>
          <p className="text-2xl font-bold text-white">{feedback.my_rank}위</p>
        </div>

        <p className="text-gray-500 text-sm">다음 문항 준비 중...</p>
      </div>
    )
  }

  // ─── 문항 화면 ──────────────────────────────────────────────────────
  if (!currentQ) return null

  return (
    <div className="flex min-h-screen flex-col">
      {/* 진행률 헤더 */}
      <div className="px-4 pt-4 pb-2">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm text-gray-400">
            {currentQ.questionIndex} / {currentQ.totalQuestions}
          </span>
          <span className={`font-mono text-lg font-bold ${timerColor}`}>
            {String(Math.floor(timeRemaining / 60)).padStart(2, '0')}:
            {String(timeRemaining % 60).padStart(2, '0')}
          </span>
        </div>
        <Progress
          value={timePct}
          className={`h-2 ${timeRemaining <= 5 ? '[&>div]:bg-red-500' : '[&>div]:bg-blue-500'}`}
        />
      </div>

      {/* 문항 내용 */}
      <div className="flex-1 px-4 py-6">
        <h2 className="text-xl font-semibold text-white leading-relaxed mb-8">
          {currentQ.content}
        </h2>

        {/* 객관식 */}
        {currentQ.type === 'multiple_choice' && currentQ.options && (
          <div className="grid grid-cols-2 gap-3">
            {currentQ.options.map((opt) => {
              const val = String(opt.index)
              const isSelected = selectedAnswer === val
              return (
                <button
                  key={opt.index}
                  onClick={() => handleSelectAnswer(val)}
                  disabled={submitted}
                  className={`rounded-xl border-2 p-4 text-left transition-all
                    ${
                      isSelected
                        ? 'border-blue-400 bg-blue-500/30 text-white'
                        : 'border-white/20 bg-white/10 text-gray-200 hover:border-white/40 hover:bg-white/20'
                    }
                    ${submitted && !isSelected ? 'opacity-50' : ''}
                  `}
                >
                  <span className="text-sm font-bold text-blue-300 mr-2">
                    {['①', '②', '③', '④'][opt.index - 1] ?? opt.index}
                  </span>
                  {opt.text}
                </button>
              )
            })}
          </div>
        )}

        {/* OX */}
        {currentQ.type === 'ox' && (
          <div className="grid grid-cols-2 gap-4">
            {(['O', 'X'] as const).map((val) => (
              <button
                key={val}
                onClick={() => handleSelectAnswer(val)}
                disabled={submitted}
                className={`rounded-xl border-2 py-8 text-5xl font-bold transition-all
                  ${
                    selectedAnswer === val
                      ? val === 'O'
                        ? 'border-blue-400 bg-blue-500/30 text-blue-300'
                        : 'border-red-400 bg-red-500/30 text-red-300'
                      : 'border-white/20 bg-white/10 text-white hover:border-white/40 hover:bg-white/20'
                  }
                `}
              >
                {val}
              </button>
            ))}
          </div>
        )}

        {/* 단답형 */}
        {currentQ.type === 'short_answer' && (
          <div className="space-y-3">
            <Input
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-500 text-lg h-12"
              placeholder="답을 입력하세요"
              value={shortAnswerText}
              onChange={(e) => setShortAnswerText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              disabled={submitted}
            />
          </div>
        )}
      </div>

      {/* 힌트 + 제출 버튼 */}
      <div className="px-4 pb-6 space-y-3">
        {currentQ.hint && !submitted && (
          <div>
            {hintVisible ? (
              <div className="rounded-lg bg-yellow-500/20 border border-yellow-400/30 px-4 py-3 text-yellow-300 text-sm">
                <span className="font-semibold">💡 힌트:</span> {currentQ.hint}
              </div>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                className="text-yellow-400 hover:text-yellow-300 hover:bg-yellow-400/10"
                onClick={() => setHintVisible(true)}
              >
                <Lightbulb className="mr-1 h-4 w-4" />
                힌트 보기
              </Button>
            )}
          </div>
        )}

        <Button
          size="lg"
          className="w-full text-base"
          onClick={handleSubmit}
          disabled={
            submitted ||
            (currentQ.type === 'short_answer' ? !shortAnswerText.trim() : !selectedAnswer)
          }
        >
          {submitted ? '제출 완료 ✓' : '제출하기'}
        </Button>
      </div>
    </div>
  )
}
