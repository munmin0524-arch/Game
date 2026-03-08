// S-06 게임 결과
'use client'

import { useRouter, useParams } from 'next/navigation'
import { Trophy, Medal, TrendingUp, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

// TODO: API에서 세션 결과 로드
const MOCK_RESULT = {
  mode: 'game' as const, // 'game' | 'adaptive'
  gameType: 'tug_of_war',
  myScore: 300,
  botScore: 200,
  totalQuestions: 3,
  correctCount: 3,
  result: 'win' as const, // 'win' | 'lose'
  // adaptive 전용
  startDifficulty: '하',
  endDifficulty: '중',
}

export default function ResultPage() {
  const router = useRouter()
  const params = useParams()
  const isWin = MOCK_RESULT.result === 'win'
  const accuracy = Math.round((MOCK_RESULT.correctCount / MOCK_RESULT.totalQuestions) * 100)

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center space-y-6 text-center">
      {/* 결과 아이콘 */}
      {MOCK_RESULT.mode === 'game' ? (
        <>
          <div className={`flex h-24 w-24 items-center justify-center rounded-full ${
            isWin ? 'bg-amber-100' : 'bg-gray-100'
          }`}>
            <Trophy className={`h-12 w-12 ${isWin ? 'text-amber-500' : 'text-gray-400'}`} />
          </div>

          <div>
            <h1 className={`text-3xl font-black ${isWin ? 'text-amber-500' : 'text-gray-500'}`}>
              {isWin ? '승리!' : '아쉬워요!'}
            </h1>
            <p className="mt-2 text-gray-500">
              {isWin ? 'NPC를 이겼어요! 대단해요!' : '다음에는 꼭 이길 수 있어요!'}
            </p>
          </div>

          {/* 포디움 스타일 점수 비교 */}
          <div className="flex items-end gap-6">
            <div className="text-center">
              <div className={`mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-xl ${
                isWin ? 'bg-blue-100' : 'bg-gray-100'
              }`}>
                <span className="text-xl font-bold text-blue-600">{MOCK_RESULT.myScore}</span>
              </div>
              <p className="text-xs font-medium text-gray-500">나</p>
              {isWin && <Medal className="mx-auto mt-1 h-5 w-5 text-amber-400" />}
            </div>
            <div className="text-sm font-bold text-gray-300">VS</div>
            <div className="text-center">
              <div className={`mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-xl ${
                !isWin ? 'bg-red-100' : 'bg-gray-100'
              }`}>
                <span className="text-xl font-bold text-red-500">{MOCK_RESULT.botScore}</span>
              </div>
              <p className="text-xs font-medium text-gray-500">NPC</p>
              {!isWin && <Medal className="mx-auto mt-1 h-5 w-5 text-amber-400" />}
            </div>
          </div>
        </>
      ) : (
        <>
          {/* 맞춤형 학습 결과 */}
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-violet-100">
            <TrendingUp className="h-12 w-12 text-violet-500" />
          </div>

          <div>
            <h1 className="text-3xl font-black text-violet-500">학습 완료!</h1>
            <p className="mt-2 text-gray-500">맞춤형 학습을 마쳤어요</p>
          </div>

          {/* 난이도 변화 */}
          <div className="flex items-center gap-4 rounded-xl bg-violet-50 px-6 py-4">
            <div className="text-center">
              <p className="text-xs text-gray-500">시작 난이도</p>
              <p className="text-xl font-bold text-violet-600">{MOCK_RESULT.startDifficulty}</p>
            </div>
            <ArrowRight className="h-5 w-5 text-violet-400" />
            <div className="text-center">
              <p className="text-xs text-gray-500">종료 난이도</p>
              <p className="text-xl font-bold text-violet-600">{MOCK_RESULT.endDifficulty}</p>
            </div>
          </div>
        </>
      )}

      {/* 요약 통계 */}
      <div className="grid w-full max-w-xs grid-cols-2 gap-3">
        <div className="rounded-xl bg-white p-3 shadow-soft">
          <p className="text-xs text-gray-500">총 문제</p>
          <p className="text-lg font-bold text-gray-900">{MOCK_RESULT.totalQuestions}문제</p>
        </div>
        <div className="rounded-xl bg-white p-3 shadow-soft">
          <p className="text-xs text-gray-500">정답률</p>
          <p className="text-lg font-bold text-gray-900">{accuracy}%</p>
        </div>
      </div>

      {/* 다음 버튼 */}
      <Button
        onClick={() => router.push('/student/rewards')}
        className="w-full max-w-xs h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-base font-semibold"
      >
        다음
        <ArrowRight className="ml-2 h-5 w-5" />
      </Button>
    </div>
  )
}
