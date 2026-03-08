// S-03 게임 선택 — 자동매칭 / 직접선택 / 맞춤형 학습
'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Zap, Brain, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

// TODO: 캐릭터/세션 생성 API 연동
const GAMES = [
  {
    id: 'tug_of_war',
    name: '줄다리기',
    description: '팀 대항전! NPC와 힘겨루기',
    gradient: 'from-red-400 to-orange-400',
    emoji: '🪢',
  },
  {
    id: 'boat_racing',
    name: '보트레이싱',
    description: '빠르게 문제를 풀어 결승선을!',
    gradient: 'from-blue-400 to-cyan-400',
    emoji: '🚤',
  },
  {
    id: 'kickboard_racing',
    name: '킥보드',
    description: '정답으로 속도를 높여라!',
    gradient: 'from-green-400 to-emerald-400',
    emoji: '🛴',
  },
  {
    id: 'balloon_flying',
    name: '풍선 날리기',
    description: '정답마다 풍선이 높이 올라가요',
    gradient: 'from-purple-400 to-pink-400',
    emoji: '🎈',
  },
]

export default function GamesPage() {
  const router = useRouter()
  const scrollRef = useRef<HTMLDivElement>(null)
  const [currentGame, setCurrentGame] = useState(0)

  const scrollTo = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return
    const cardWidth = 260
    const newIndex = direction === 'left'
      ? Math.max(0, currentGame - 1)
      : Math.min(GAMES.length - 1, currentGame + 1)
    setCurrentGame(newIndex)
    scrollRef.current.scrollTo({ left: newIndex * cardWidth, behavior: 'smooth' })
  }

  const handleStartGame = (gameType: string) => {
    // TODO: 세션 생성 API 호출 후 sessionId로 이동
    const mockSessionId = `game-${gameType}-${Date.now()}`
    router.push(`/student/game-play/${mockSessionId}`)
  }

  const handleStartAdaptive = () => {
    // TODO: 맞춤형 학습 세션 생성 API
    const mockSessionId = `adaptive-${Date.now()}`
    router.push(`/student/game-adaptive/${mockSessionId}`)
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div>
        <h1 className="text-xl font-bold text-gray-900">게임하기</h1>
        <p className="mt-1 text-sm text-gray-500">원하는 게임을 선택하세요</p>
      </div>

      {/* 자동매칭 게임 */}
      <section>
        <div className="mb-3 flex items-center gap-2">
          <Zap className="h-4 w-4 text-amber-500" />
          <h2 className="text-sm font-semibold text-gray-700">자동매칭 게임</h2>
        </div>
        <div className="rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 p-4 shadow-soft">
          <p className="text-sm text-gray-700">
            오늘의 학습 목표에 맞는 문제가 자동으로 매칭됩니다.
          </p>
          <Button
            onClick={() => handleStartGame('auto')}
            className="mt-3 w-full rounded-lg bg-amber-500 hover:bg-amber-600 font-semibold"
          >
            <Zap className="mr-2 h-4 w-4" />
            바로 시작하기
          </Button>
        </div>
      </section>

      {/* 직접선택 게임 — 캐러셀 */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-blue-500" />
            <h2 className="text-sm font-semibold text-gray-700">직접선택 게임</h2>
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => scrollTo('left')}
              className="rounded-full p-1 hover:bg-gray-100 disabled:opacity-30"
              disabled={currentGame === 0}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => scrollTo('right')}
              className="rounded-full p-1 hover:bg-gray-100 disabled:opacity-30"
              disabled={currentGame === GAMES.length - 1}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none' }}
        >
          {GAMES.map((game) => (
            <div
              key={game.id}
              className="min-w-[240px] snap-start rounded-2xl bg-white shadow-card overflow-hidden"
            >
              <div className={`bg-gradient-to-br ${game.gradient} p-6 text-center`}>
                <span className="text-5xl">{game.emoji}</span>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-gray-900">{game.name}</h3>
                <p className="mt-1 text-xs text-gray-500">{game.description}</p>
                <Button
                  onClick={() => handleStartGame(game.id)}
                  variant="outline"
                  className="mt-3 w-full rounded-lg text-sm font-semibold"
                >
                  게임하기
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* 도트 인디케이터 */}
        <div className="mt-2 flex justify-center gap-1.5">
          {GAMES.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i === currentGame ? 'w-4 bg-blue-500' : 'w-1.5 bg-gray-200'
              }`}
            />
          ))}
        </div>
      </section>

      {/* 맞춤형 학습 */}
      <section>
        <div className="mb-3 flex items-center gap-2">
          <Brain className="h-4 w-4 text-violet-500" />
          <h2 className="text-sm font-semibold text-gray-700">맞춤형 학습</h2>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 p-5 text-white shadow-card">
          <h3 className="text-lg font-bold">AI 맞춤 학습</h3>
          <p className="mt-1 text-sm text-violet-100">
            난이도가 자동으로 조절되는 맞춤형 학습입니다.
            연속 정답이면 어려워지고, 틀리면 쉬워져요.
          </p>
          <Button
            onClick={handleStartAdaptive}
            className="mt-4 w-full rounded-lg bg-white text-violet-600 hover:bg-violet-50 font-semibold"
          >
            <Brain className="mr-2 h-4 w-4" />
            시작하기
          </Button>
        </div>
      </section>

      {/* 캐릭터 바꾸기 */}
      <div className="text-center">
        <button
          onClick={() => router.push('/student/characters')}
          className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
        >
          캐릭터 바꾸기 →
        </button>
      </div>
    </div>
  )
}
