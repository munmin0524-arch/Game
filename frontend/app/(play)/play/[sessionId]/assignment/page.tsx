// S-11 과제 플레이 (학생)
// 스펙: docs/screens/phase2-assignment.md#s-11
// 라이브 플레이(S-06)와 달리 WebSocket 없음, 학생이 직접 문항 이동, 제출 확인 팝업

'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { isPast } from 'date-fns'
import { ChevronRight } from 'lucide-react'
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
import { SubmitConfirmModal } from '@/components/play/SubmitConfirmModal'
import { QuestionDisplay } from '@/components/play/QuestionDisplay'
import type { Session, Question, ParticipantResult } from '@/types'

interface GuestForm {
  email: string
  nickname: string
}

type AssignmentPhase =
  | 'guest_entry'   // 게스트 이메일+닉네임 입력
  | 'resume_prompt' // 이어하기 확인
  | 'playing'       // 문항 진행 중
  | 'submit_confirm'// 제출 확인 팝업
  | 'ended'         // 제출 완료 → 결과로 이동

export default function AssignmentPlayPage() {
  const { sessionId } = useParams<{ sessionId: string }>()
  const router = useRouter()
  const { toast } = useToast()

  const [phase, setPhase] = useState<AssignmentPhase>('playing') // 초기값은 확인 후 변경
  const [session, setSession] = useState<Session | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [myResult, setMyResult] = useState<ParticipantResult | null>(null)

  const [currentIndex, setCurrentIndex] = useState(0)
  // questionId → 선택한 답
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [timeRemaining, setTimeRemaining] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const answerStartRef = useRef<number>(Date.now())

  const [isGuest, setIsGuest] = useState(false)
  const [guestForm, setGuestForm] = useState<GuestForm>({ email: '', nickname: '' })
  const [guestSubmitting, setGuestSubmitting] = useState(false)
  const [showLoginPrompt, setShowLoginPrompt] = useState(false)

  const [submitting, setSubmitting] = useState(false)
  const [submitConfirmOpen, setSubmitConfirmOpen] = useState(false)

  // 세션 정보 + 진행 상태 로드
  const loadSession = useCallback(async () => {
    try {
      const [s, qs, result] = await Promise.all([
        fetch(`/api/sessions/${sessionId}`).then((r) => r.json()),
        fetch(`/api/sessions/${sessionId}/questions`).then((r) => r.json()),
        fetch(`/api/sessions/${sessionId}/my-result`).then((r) =>
          r.ok ? r.json() : null
        ),
      ])

      setSession(s)
      setQuestions(qs)
      setMyResult(result)

      // 마감된 과제
      if (s.close_at && isPast(new Date(s.close_at))) {
        toast({ title: '마감된 과제입니다.', variant: 'destructive' })
        router.push('/assignments')
        return
      }

      // 이미 제출한 과제
      if (result?.status === 'submitted') {
        router.push(`/result/${sessionId}`)
        return
      }

      // 게스트 여부 확인
      const guestToken = document.cookie.match(/guest_token=([^;]+)/)
      if (!guestToken) {
        setIsGuest(true)
        setPhase('guest_entry')
        return
      }

      // 이어하기 판단 (이전 진행 있으면 팝업)
      if (result?.status === 'in_progress' && (result.current_q_index ?? 0) > 0) {
        setCurrentIndex(result.current_q_index ?? 0)
        setPhase('resume_prompt')
      } else {
        setPhase('playing')
      }
    } catch {
      toast({ title: '과제를 불러오지 못했습니다.', variant: 'destructive' })
    }
  }, [sessionId, router, toast])

  useEffect(() => {
    loadSession()
  }, [loadSession])

  // 타이머 시작 (문항 교체 시)
  useEffect(() => {
    if (phase !== 'playing' || !session || questions.length === 0) return

    const limit = session.time_limit_per_q
    setTimeRemaining(limit)
    answerStartRef.current = Date.now()

    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!)
          // 시간 초과 → 자동으로 다음 문항 이동
          handleNextQuestion()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, phase])

  const handleGuestSubmit = async () => {
    if (!guestForm.email || !guestForm.nickname) {
      toast({ title: '이메일과 닉네임을 모두 입력해 주세요.', variant: 'destructive' })
      return
    }
    setGuestSubmitting(true)
    try {
      const res = await fetch(`/api/sessions/${sessionId}/guest-enter`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(guestForm),
      })
      if (res.status === 409) {
        setShowLoginPrompt(true)
        return
      }
      if (!res.ok) throw new Error()
      await loadSession()
    } catch {
      toast({ title: '입장에 실패했습니다. 다시 시도해 주세요.', variant: 'destructive' })
    } finally {
      setGuestSubmitting(false)
    }
  }

  const handleNextQuestion = useCallback(() => {
    const currentQ = questions[currentIndex]
    if (!currentQ) return

    const timeSpent = Math.round((Date.now() - answerStartRef.current) / 1000)
    const answer = answers[currentQ.question_id]

    // 과제는 개별 answer REST API 호출 (WebSocket 아님)
    fetch(`/api/sessions/${sessionId}/answer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        questionId: currentQ.question_id,
        answer: answer ?? null,
        timeSpent,
      }),
    }).catch(console.error)

    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1)
    } else {
      // 마지막 문항 → 제출 확인 팝업
      if (timerRef.current) clearInterval(timerRef.current)
      setSubmitConfirmOpen(true)
    }
  }, [currentIndex, questions, answers, sessionId])

  const handleFinalSubmit = async () => {
    setSubmitting(true)
    try {
      await fetch(`/api/sessions/${sessionId}/submit`, { method: 'POST' })
      router.push(`/result/${sessionId}`)
    } catch {
      toast({ title: '제출에 실패했습니다. 다시 시도해 주세요.', variant: 'destructive' })
    } finally {
      setSubmitting(false)
    }
  }

  const currentQ = questions[currentIndex]
  const timePct = session ? Math.round((timeRemaining / session.time_limit_per_q) * 100) : 0
  const unansweredCount = questions.filter((q) => !answers[q.question_id]).length

  // ─── 게스트 입장 ───────────────────────────────────────────────────
  if (phase === 'guest_entry') {
    return (
      <>
        <Dialog open>
          <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
            <DialogHeader>
              <DialogTitle>과제 입장</DialogTitle>
              <DialogDescription>이메일과 닉네임을 입력하고 과제를 시작하세요.</DialogDescription>
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
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="nickname">닉네임</Label>
                <Input
                  id="nickname"
                  placeholder="과제에서 표시될 이름"
                  value={guestForm.nickname}
                  onChange={(e) => setGuestForm((f) => ({ ...f, nickname: e.target.value }))}
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleGuestSubmit} disabled={guestSubmitting} className="w-full">
                {guestSubmitting ? '입장 중...' : '시작하기'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

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

  // ─── 이어하기 팝업 ─────────────────────────────────────────────────
  if (phase === 'resume_prompt') {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-sm rounded-2xl bg-white/10 p-6 space-y-4 text-center">
          <p className="text-lg font-semibold text-white">이전에 풀던 과제가 있어요</p>
          <p className="text-gray-400">
            {currentIndex} / {questions.length} 문항 진행됨
          </p>
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1 border-white/20 text-white hover:bg-white/10"
              onClick={() => {
                setCurrentIndex(0)
                setAnswers({})
                setPhase('playing')
              }}
            >
              처음부터
            </Button>
            <Button className="flex-1" onClick={() => setPhase('playing')}>
              이어하기 →
            </Button>
          </div>
        </div>
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
            {currentIndex + 1} / {questions.length}
          </span>
          <span
            className={`font-mono text-lg font-bold ${
              timeRemaining <= 5
                ? 'text-red-400'
                : timeRemaining <= 10
                ? 'text-yellow-400'
                : 'text-white'
            }`}
          >
            {String(Math.floor(timeRemaining / 60)).padStart(2, '0')}:
            {String(timeRemaining % 60).padStart(2, '0')}
          </span>
        </div>
        <Progress
          value={timePct}
          className={`h-2 ${timeRemaining <= 5 ? '[&>div]:bg-red-500' : '[&>div]:bg-blue-500'}`}
        />
      </div>

      {/* 문항 표시 */}
      <div className="flex-1 px-4 py-6">
        <QuestionDisplay
          type={currentQ.type}
          content={currentQ.content}
          options={currentQ.options}
          selectedAnswer={answers[currentQ.question_id] ?? null}
          shortAnswerValue={answers[currentQ.question_id] ?? ''}
          submitted={false}
          onSelectAnswer={(answer) =>
            setAnswers((prev) => ({ ...prev, [currentQ.question_id]: answer }))
          }
          onShortAnswerChange={(value) =>
            setAnswers((prev) => ({ ...prev, [currentQ.question_id]: value }))
          }
          onShortAnswerSubmit={handleNextQuestion}
        />
      </div>

      {/* 다음 문항 버튼 (라이브와 차이: 학생이 직접 이동) */}
      <div className="px-4 pb-6">
        <Button size="lg" className="w-full" onClick={handleNextQuestion}>
          {currentIndex < questions.length - 1 ? (
            <>
              다음 문항
              <ChevronRight className="ml-1 h-5 w-5" />
            </>
          ) : (
            '제출하기'
          )}
        </Button>
      </div>

      {/* 제출 확인 팝업 */}
      <SubmitConfirmModal
        open={submitConfirmOpen}
        unansweredCount={unansweredCount}
        submitting={submitting}
        onCancel={() => setSubmitConfirmOpen(false)}
        onConfirm={handleFinalSubmit}
      />
    </div>
  )
}
