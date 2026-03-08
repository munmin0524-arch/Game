'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronDown, ChevronRight, BookOpen, RotateCcw } from 'lucide-react'

interface WrongQuestion {
  id: string
  text: string
  myAnswer: string
  correctAnswer: string
}

interface UnitData {
  unit: string
  depth: string[]
  accuracy: number
  total: number
  correct: number
  wrongQuestions: WrongQuestion[]
}

interface SubjectData {
  subject: string
  units: UnitData[]
}

interface UnitMasteryProps {
  subjects: SubjectData[]
}

function getColor(accuracy: number) {
  if (accuracy >= 80) return { bar: 'bg-green-500', text: 'text-green-600' }
  if (accuracy >= 50) return { bar: 'bg-amber-400', text: 'text-amber-600' }
  return { bar: 'bg-red-400', text: 'text-red-600' }
}

export function UnitMastery({ subjects }: UnitMasteryProps) {
  const router = useRouter()
  const [selectedSubject, setSelectedSubject] = useState(0)
  const [expandedUnit, setExpandedUnit] = useState<string | null>(null)

  const currentSubject = subjects[selectedSubject]
  const units = currentSubject?.units ?? []
  const weakest = units.filter((d) => d.accuracy < 50).sort((a, b) => a.accuracy - b.accuracy)

  return (
    <div className="rounded-xl bg-white p-3 shadow-soft">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-gray-700">단원별 이해도</h3>
        <span className="text-[10px] text-gray-400">{units.length}개 단원</span>
      </div>

      {/* 과목 탭 */}
      {subjects.length > 1 && (
        <div className="flex gap-1 mb-3 rounded-lg bg-gray-100 p-0.5">
          {subjects.map((s, i) => (
            <button
              key={s.subject}
              onClick={() => { setSelectedSubject(i); setExpandedUnit(null) }}
              className={`flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                selectedSubject === i
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {s.subject}
            </button>
          ))}
        </div>
      )}

      {/* 단원 목록 */}
      <div className="space-y-1.5 max-h-[320px] overflow-y-auto pr-1 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-200">
        {units.map((unit) => {
          const color = getColor(unit.accuracy)
          const isExpanded = expandedUnit === unit.unit
          const hasWrong = unit.wrongQuestions.length > 0

          return (
            <div key={unit.unit} className="rounded-lg border border-gray-100">
              {/* 단원 헤더 */}
              <button
                onClick={() => setExpandedUnit(isExpanded ? null : unit.unit)}
                className="w-full text-left px-2.5 py-2 group"
              >
                {/* 뎁스 경로 */}
                <div className="flex items-center gap-1 mb-0.5">
                  {unit.depth.map((d, di) => (
                    <span key={di} className="text-[9px] text-gray-400">
                      {di > 0 && <span className="mx-0.5">{'>'}</span>}
                      {d}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    {hasWrong ? (
                      isExpanded
                        ? <ChevronDown className="h-3 w-3 text-gray-400" />
                        : <ChevronRight className="h-3 w-3 text-gray-400" />
                    ) : (
                      <span className="w-3" />
                    )}
                    <span className="text-xs font-medium text-gray-700 group-hover:text-blue-600 transition-colors">
                      {unit.unit}
                    </span>
                  </div>
                  <span className={`text-xs font-bold ${color.text}`}>
                    {unit.accuracy}%
                    <span className="text-[9px] font-normal text-gray-400 ml-1">
                      ({unit.correct}/{unit.total})
                    </span>
                  </span>
                </div>

                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className={`h-full rounded-full ${color.bar} transition-all`}
                    style={{ width: `${unit.accuracy}%` }}
                  />
                </div>
              </button>

              {/* 틀린 문항 펼침 */}
              {isExpanded && hasWrong && (
                <div className="border-t border-gray-100 px-2.5 py-2 bg-gray-50/50">
                  <p className="text-[10px] font-semibold text-gray-500 mb-1.5">
                    틀린 문항 ({unit.wrongQuestions.length}개)
                  </p>
                  <div className="space-y-1.5">
                    {unit.wrongQuestions.map((q) => (
                      <div key={q.id} className="rounded-md bg-white p-2 text-[11px]">
                        <p className="font-medium text-gray-800">{q.text}</p>
                        <div className="mt-1 flex gap-3">
                          <span className="text-red-500">내 답: {q.myAnswer}</span>
                          <span className="text-green-600">정답: {q.correctAnswer}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => router.push('/student/wrong-notes')}
                      className="flex-1 flex items-center justify-center gap-1 rounded-lg bg-rose-50 py-1.5 text-[10px] font-semibold text-rose-600 hover:bg-rose-100 transition-colors"
                    >
                      <BookOpen className="h-3 w-3" />
                      오답노트
                    </button>
                    <button
                      onClick={() => router.push('/student/games')}
                      className="flex-1 flex items-center justify-center gap-1 rounded-lg bg-blue-50 py-1.5 text-[10px] font-semibold text-blue-600 hover:bg-blue-100 transition-colors"
                    >
                      <RotateCcw className="h-3 w-3" />
                      재도전
                    </button>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* 약점 추천 */}
      {weakest.length > 0 && (
        <div className="mt-2 rounded-lg bg-red-50 p-2">
          <p className="text-[11px] font-semibold text-red-600">
            &quot;{weakest[0].unit}&quot; 복습 추천!
          </p>
          <p className="text-[9px] text-red-400">
            정답률이 낮은 단원을 먼저 복습해보세요
          </p>
        </div>
      )}
    </div>
  )
}
