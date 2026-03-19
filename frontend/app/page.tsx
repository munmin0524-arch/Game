// 진입 화면 — Claude/Gemini 스타일 심플 랜딩
// 인사말 + 캐릭터 + CTA + 가이드 칩

'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Rocket, Plus, Store, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { EntryHeader } from '@/components/common/EntryHeader'

// ─── 최근 퀴즈 Mock ───

const RECENT_QUIZZES = [
  { id: 'mock-s-01', title: '중1 정수와 유리수', emoji: '🔢' },
  { id: 'mock-s-02', title: '영어 Lesson 2 어휘', emoji: '🔤' },
]

export default function EntryPage() {
  const router = useRouter()
  const nickname = '홍길동' // TODO: AuthContext

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50/30 to-white">
      <EntryHeader />

      {/* 히어로 영역 */}
      <div className="flex flex-col items-center gap-6 px-4 text-center -mt-8">
        {/* 로고 */}
        <div className="flex flex-col items-center leading-none select-none">
          <span className="text-xs font-black tracking-[0.4em] text-blue-300 uppercase">
            QUIZ
          </span>
          <span className="text-4xl font-black tracking-wide text-blue-600 uppercase leading-none">
            PARTY
          </span>
          <span className="mt-0.5 text-base font-bold text-gray-700 tracking-widest">
            School
          </span>
        </div>

        {/* 인사말 + 캐릭터 */}
        <div className="flex items-center gap-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800">
              {nickname} 선생님, 안녕하세요!
            </h1>
            <p className="mt-1 text-gray-500 text-base">
              어떤 퀴즈를 시작할까요?
            </p>
          </div>
          {/* 마스코트 캐릭터 — public/mascot.png 제공 시 표시 */}
          <div className="relative h-20 w-20 shrink-0">
            <Image
              src="/mascot.png"
              alt="마스코트"
              width={80}
              height={80}
              className="object-contain"
              onError={(e) => {
                // 이미지 없으면 폴백 이모지
                const target = e.currentTarget
                target.style.display = 'none'
                const parent = target.parentElement
                if (parent) {
                  parent.innerHTML = '<span class="text-5xl">🎮</span>'
                }
              }}
            />
          </div>
        </div>

        {/* CTA 버튼 */}
        <Button
          size="lg"
          className="h-14 px-10 text-lg font-bold rounded-full shadow-lg hover:shadow-xl transition-all bg-blue-600 hover:bg-blue-700"
          onClick={() => router.push('/select')}
        >
          <Rocket className="mr-2 h-5 w-5" />
          퀴즈 시작하기
        </Button>

        {/* 가이드 칩 — 최근 퀴즈 + 퀵 액션 */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-2">
          {/* 최근 퀴즈 바로가기 */}
          {RECENT_QUIZZES.map((q) => (
            <button
              key={q.id}
              onClick={() => router.push(`/select/${q.id}/settings`)}
              className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-colors shadow-sm"
            >
              <span>{q.emoji}</span>
              <span>{q.title}</span>
            </button>
          ))}

          {/* 새 퀴즈 만들기 */}
          <button
            onClick={() => router.push('/sets/new/edit')}
            className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-colors shadow-sm"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>새 퀴즈 만들기</span>
          </button>

          {/* 퀴즈 광장 */}
          <button
            onClick={() => router.push('/marketplace')}
            className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-colors shadow-sm"
          >
            <Store className="h-3.5 w-3.5" />
            <span>퀴즈 광장</span>
          </button>

          {/* 사용법 안내 */}
          <button
            onClick={() => {/* TODO: 온보딩/도움말 */}}
            className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-colors shadow-sm"
          >
            <BookOpen className="h-3.5 w-3.5" />
            <span>사용법 안내</span>
          </button>
        </div>
      </div>
    </div>
  )
}
