// S-08 오답노트
// Phase S-2에서 구현 예정
'use client'

import { useRouter } from 'next/navigation'
import { ChevronLeft, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function WrongNotesPage() {
  const router = useRouter()

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <button onClick={() => router.back()} className="rounded-lg p-1 hover:bg-gray-100">
          <ChevronLeft className="h-5 w-5 text-gray-600" />
        </button>
        <h1 className="text-lg font-bold text-gray-900">오답노트</h1>
      </div>

      <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-rose-100">
          <BookOpen className="h-8 w-8 text-rose-400" />
        </div>
        <p className="mt-4 text-sm font-medium text-gray-500">
          틀린 문제가 없어요!
        </p>
        <p className="mt-1 text-xs text-gray-400">
          게임을 플레이하면 틀린 문제가 여기에 모입니다.
        </p>
        <Button
          onClick={() => router.push('/student/games')}
          variant="outline"
          className="mt-4 rounded-xl"
        >
          게임하러 가기
        </Button>
      </div>
    </div>
  )
}
