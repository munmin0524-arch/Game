// S-05 맞춤형 학습 플레이 — Adaptive Learning
// Phase S-4에서 구현 예정
'use client'

import { useRouter, useParams } from 'next/navigation'
import { Brain, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function AdaptivePage() {
  const router = useRouter()
  const params = useParams()
  const sessionId = params.sessionId as string

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center space-y-6 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-violet-100">
        <Brain className="h-10 w-10 text-violet-500" />
      </div>
      <div>
        <h1 className="text-xl font-bold text-gray-900">맞춤형 학습</h1>
        <p className="mt-2 text-sm text-gray-500">
          AI가 난이도를 자동 조절하는 맞춤형 학습입니다.
          <br />곧 준비됩니다!
        </p>
      </div>
      <Button
        onClick={() => router.push(`/student/game-result/${sessionId}`)}
        className="rounded-xl bg-violet-600 hover:bg-violet-700"
      >
        결과 보기 (테스트)
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  )
}
