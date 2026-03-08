// S-02 학습 내용 선택 — 과목/Level/Lesson
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, Check, Candy } from 'lucide-react'
import { Button } from '@/components/ui/button'

// TODO: API에서 과목/레벨/레슨 데이터 로드
const SUBJECTS = ['과학', '수학', '영어']

const LEVELS: Record<string, string[]> = {
  '과학': ['Level 1', 'Level 2', 'Level 3'],
  '수학': ['Level 1', 'Level 2', 'Level 3', 'Level 4'],
  '영어': ['Level 1', 'Level 2'],
}

const LESSONS: Record<string, Array<{ name: string; completed: boolean; candy: boolean }>> = {
  'Level 1': [
    { name: 'Lesson 1: 힘의 종류', completed: true, candy: true },
    { name: 'Lesson 2: 중력과 무게', completed: true, candy: true },
    { name: 'Lesson 3: 마찰력', completed: false, candy: false },
    { name: 'Lesson 4: 탄성력', completed: false, candy: false },
  ],
  'Level 2': [
    { name: 'Lesson 1: 합력', completed: false, candy: false },
    { name: 'Lesson 2: 평형', completed: false, candy: false },
  ],
  'Level 3': [
    { name: 'Lesson 1: 운동 법칙', completed: false, candy: false },
  ],
  'Level 4': [
    { name: 'Lesson 1: 미적분 기초', completed: false, candy: false },
  ],
}

export default function SelectPage() {
  const router = useRouter()
  const [subject, setSubject] = useState(SUBJECTS[0])
  const [level, setLevel] = useState(LEVELS[SUBJECTS[0]][0])

  const currentLevels = LEVELS[subject] || []
  const currentLessons = LESSONS[level] || []

  return (
    <div className="space-y-5">
      {/* 헤더 */}
      <div className="flex items-center gap-3">
        <button onClick={() => router.back()} className="rounded-lg p-1 hover:bg-gray-100">
          <ChevronLeft className="h-5 w-5 text-gray-600" />
        </button>
        <h1 className="text-lg font-bold text-gray-900">학습 내용 선택</h1>
      </div>

      {/* 과목 선택 */}
      <div>
        <label className="text-sm font-medium text-gray-600">과목</label>
        <div className="mt-2 flex gap-2">
          {SUBJECTS.map((s) => (
            <button
              key={s}
              onClick={() => {
                setSubject(s)
                setLevel(LEVELS[s][0])
              }}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors
                ${s === subject
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Level 선택 */}
      <div>
        <label className="text-sm font-medium text-gray-600">Level</label>
        <div className="mt-2 flex gap-2">
          {currentLevels.map((l) => (
            <button
              key={l}
              onClick={() => setLevel(l)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors
                ${l === level
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* Lesson 리스트 */}
      <div>
        <label className="text-sm font-medium text-gray-600">Lesson</label>
        <div className="mt-2 space-y-2">
          {currentLessons.map((lesson, i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-xl bg-white p-4 shadow-soft"
            >
              <div className="flex items-center gap-3">
                <div className={`flex h-8 w-8 items-center justify-center rounded-full
                  ${lesson.completed ? 'bg-green-100' : 'bg-gray-100'}`}
                >
                  {lesson.completed
                    ? <Check className="h-4 w-4 text-green-600" />
                    : <span className="text-xs font-medium text-gray-400">{i + 1}</span>
                  }
                </div>
                <span className={`text-sm font-medium ${lesson.completed ? 'text-gray-400' : 'text-gray-900'}`}>
                  {lesson.name}
                </span>
              </div>
              {lesson.candy && (
                <Candy className="h-5 w-5 text-pink-400" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 게임 시작 버튼 */}
      <Button
        onClick={() => router.push('/student/games')}
        className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-base font-semibold"
      >
        학습 게임 하러 가기
      </Button>
    </div>
  )
}
