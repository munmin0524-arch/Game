// S-04 게임 플레이 — NPC(AI봇) 대전
'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Trophy, Bot, User, Clock } from 'lucide-react'
import { QuestionDisplay } from '@/components/play/QuestionDisplay'
import type { QuestionOption } from '@/types'

// TODO: API에서 세션 문항 로드
const MOCK_QUESTIONS = [
  {
    question_id: 'q1',
    type: 'multiple_choice' as const,
    content: '다음 중 중력에 대한 설명으로 옳은 것은?',
    options: [
      { index: 1, text: '물체의 질량에 반비례한다' },
      { index: 2, text: '지구가 물체를 당기는 힘이다' },
      { index: 3, text: '물체의 속도에 비례한다' },
      { index: 4, text: '진공에서는 작용하지 않는다' },
    ] as QuestionOption[],
    answer: '2',
  },
  {
    question_id: 'q2',
    type: 'ox' as const,
    content: '마찰력은 물체의 운동 방향과 같은 방향으로 작용한다.',
    options: null,
    answer: 'X',
  },
  {
    question_id: 'q3',
    type: 'unscramble' as const,
    content: '용수철이 원래 길이로 돌아가려는 힘을 무엇이라 하는가?',
    options: null,
    answer: '탄성력',
  },
]

export default function PlayPage() {
  const router = useRouter()
  const params = useParams()
  const sessionId = params.sessionId as string

  const [currentIndex, setCurrentIndex] = useState(0)
  const [myScore, setMyScore] = useState(0)
  const [botScore, setBotScore] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [shortAnswer, setShortAnswer] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [timeLeft, setTimeLeft] = useState(20)

  const question = MOCK_QUESTIONS[currentIndex]
  const totalQuestions = MOCK_QUESTIONS.length

  // 타이머
  useEffect(() => {
    if (submitted) return
    if (timeLeft <= 0) {
      handleSubmit(null)
      return
    }
    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000)
    return () => clearTimeout(timer)
  }, [timeLeft, submitted])

  const handleSubmit = useCallback((answer: string | null) => {
    if (submitted) return
    setSubmitted(true)

    const isCorrect = answer === question.answer
    if (isCorrect) setMyScore((s) => s + 100)

    // NPC 봇 — 70% 확률로 정답
    const botCorrect = Math.random() < 0.7
    if (botCorrect) setBotScore((s) => s + 100)

    // 1.5초 후 다음 문항 or 결과
    setTimeout(() => {
      if (currentIndex < totalQuestions - 1) {
        setCurrentIndex((i) => i + 1)
        setSelectedAnswer(null)
        setShortAnswer('')
        setSubmitted(false)
        setTimeLeft(20)
      } else {
        router.push(`/student/game-result/${sessionId}`)
      }
    }, 1500)
  }, [submitted, question, currentIndex, totalQuestions, sessionId, router])

  const handleSelectAnswer = (answer: string) => {
    if (submitted) return
    setSelectedAnswer(answer)
    handleSubmit(answer)
  }

  const handleShortAnswerSubmit = () => {
    if (submitted || !shortAnswer.trim()) return
    handleSubmit(shortAnswer.trim())
  }

  return (
    <div className="fixed inset-0 bg-gray-900 text-white flex flex-col">
      {/* 상단 바: 점수 + 문항 번호 */}
      <div className="flex items-center justify-between px-4 py-3">
        {/* 내 점수 */}
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500">
            <User className="h-4 w-4" />
          </div>
          <div>
            <p className="text-xs text-gray-400">나</p>
            <p className="text-sm font-bold">{myScore}</p>
          </div>
        </div>

        {/* 문항 번호 */}
        <div className="text-center">
          <p className="text-xs text-gray-400">문항</p>
          <p className="text-lg font-bold">
            {currentIndex + 1}
            <span className="text-sm text-gray-500">/{totalQuestions}</span>
          </p>
        </div>

        {/* 봇 점수 */}
        <div className="flex items-center gap-2">
          <div>
            <p className="text-xs text-gray-400 text-right">NPC</p>
            <p className="text-sm font-bold text-right">{botScore}</p>
          </div>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500">
            <Bot className="h-4 w-4" />
          </div>
        </div>
      </div>

      {/* 타이머 바 */}
      <div className="px-4">
        <div className="flex items-center gap-2 mb-2">
          <Clock className="h-3 w-3 text-gray-400" />
          <span className={`text-xs font-mono ${timeLeft <= 5 ? 'text-red-400' : 'text-gray-400'}`}>
            {timeLeft}초
          </span>
        </div>
        <div className="h-1 overflow-hidden rounded-full bg-gray-700">
          <div
            className={`h-full rounded-full transition-all duration-1000 ${
              timeLeft <= 5 ? 'bg-red-500' : timeLeft <= 10 ? 'bg-yellow-500' : 'bg-blue-500'
            }`}
            style={{ width: `${(timeLeft / 20) * 100}%` }}
          />
        </div>
      </div>

      {/* 문항 */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <QuestionDisplay
          type={question.type}
          content={question.content}
          options={question.options}
          selectedAnswer={selectedAnswer}
          shortAnswerValue={shortAnswer}
          submitted={submitted}
          onSelectAnswer={handleSelectAnswer}
          onShortAnswerChange={(value) => setShortAnswer(value)}
          onShortAnswerSubmit={handleShortAnswerSubmit}
        />

        {/* 제출 후 정답 표시 */}
        {submitted && (
          <div className={`mt-4 rounded-xl p-4 text-center ${
            (selectedAnswer || shortAnswer.trim()) === question.answer
              ? 'bg-green-500/20 text-green-400'
              : 'bg-red-500/20 text-red-400'
          }`}>
            <p className="text-lg font-bold">
              {(selectedAnswer || shortAnswer.trim()) === question.answer ? '정답!' : '오답!'}
            </p>
            <p className="mt-1 text-sm opacity-80">
              정답: {question.answer}
            </p>
          </div>
        )}
      </div>

      {/* 하단 점수 비교 바 */}
      <div className="px-4 pb-6">
        <div className="flex items-center gap-2 rounded-xl bg-gray-800 p-3">
          <div className="flex-1">
            <div className="h-2 overflow-hidden rounded-full bg-gray-700">
              <div
                className="h-full rounded-full bg-blue-500 transition-all"
                style={{ width: `${totalQuestions > 0 ? (myScore / (totalQuestions * 100)) * 100 : 0}%` }}
              />
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Trophy className="h-4 w-4 text-amber-400" />
          </div>
          <div className="flex-1">
            <div className="h-2 overflow-hidden rounded-full bg-gray-700">
              <div
                className="h-full rounded-full bg-red-500 transition-all float-right"
                style={{ width: `${totalQuestions > 0 ? (botScore / (totalQuestions * 100)) * 100 : 0}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
