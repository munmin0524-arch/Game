'use client'

import { useState, useCallback } from 'react'
import { ArrowRight, Square, CheckSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { useToast } from '@/components/ui/use-toast'
import { useWizard } from './WizardContext'
import { Step1Filters, EMPTY_FILTER, isFilterReady, type FilterState } from './Step1Filters'
import type { Question } from '@/types'

const TYPE_LABELS: Record<string, string> = {
  multiple_choice: '객관식',
  ox: 'OX',
  unscramble: '단어배열',
}

const DIFFICULTY_COLORS: Record<string, string> = {
  '상': 'bg-red-50 text-red-600 border-red-200',
  '중': 'bg-yellow-50 text-yellow-600 border-yellow-200',
  '하': 'bg-green-50 text-green-600 border-green-200',
}

// ─── Mock 문항 뱅크 (백엔드 연결 전 폴백) ───

const opts = (...texts: string[]) => texts.map((t, i) => ({ index: i + 1, text: t }))
const mq = (id: string, type: Question['type'], content: string, options: Question['options'], answer: string, idx: number, diff: string, unit: string): Question => ({
  question_id: id, set_id: '', type, content, options, answer, order_index: idx,
  hint: null, explanation: null, media_url: null, created_at: '', difficulty: diff, unit,
})

const MOCK_QUESTIONS: Record<string, Question[]> = {
  '수학': [
    mq('mock-q-m01', 'multiple_choice', '(-3) + (+7)의 값은?', opts('-4', '4', '10', '-10'), '4', 0, '하', 'I. 수와 연산'),
    mq('mock-q-m02', 'multiple_choice', '(-12) ÷ (+4) × (-2)의 값을 구하시오.', opts('6', '-6', '8', '-8'), '6', 1, '중', 'I. 수와 연산'),
    mq('mock-q-m03', 'ox', '두 정수의 곱이 음수이면, 두 수의 부호는 서로 다르다.', opts('O', 'X'), 'O', 2, '하', 'I. 수와 연산'),
    mq('mock-q-m04', 'multiple_choice', '절댓값이 5인 정수를 모두 구하면?', opts('5', '-5', '5와 -5', '0과 5'), '5와 -5', 3, '중', 'I. 수와 연산'),
    mq('mock-q-m05', 'multiple_choice', '(-2)³의 값은?', opts('-8', '8', '-6', '6'), '-8', 4, '중', 'I. 수와 연산'),
    mq('mock-q-m06', 'ox', '0은 양의 정수도 음의 정수도 아니다.', opts('O', 'X'), 'O', 5, '하', 'I. 수와 연산'),
    mq('mock-q-m07', 'multiple_choice', '다음 중 가장 작은 수는? -3, 0, -7, 2, -1', opts('-3', '-7', '-1', '0'), '-7', 6, '하', 'I. 수와 연산'),
    mq('mock-q-m08', 'multiple_choice', '(-5) × (-4) + (-10) ÷ 2의 값은?', opts('15', '25', '-15', '10'), '15', 7, '상', 'I. 수와 연산'),
    mq('mock-q-m09', 'multiple_choice', '문자와 식에서 2a + 3b, a=2, b=-1일 때 값은?', opts('1', '7', '3', '-1'), '1', 0, '중', 'II. 문자와 식'),
    mq('mock-q-m10', 'multiple_choice', '일차방정식 2x + 6 = 0의 해는?', opts('3', '-3', '6', '-6'), '-3', 1, '중', 'II. 문자와 식'),
  ],
  '영어': [
    mq('mock-q-e01', 'multiple_choice', '"apple"의 뜻으로 알맞은 것은?', opts('바나나', '사과', '포도', '딸기'), '사과', 0, '하', 'Lesson 1. Ready for a New Start'),
    mq('mock-q-e02', 'multiple_choice', '"She ___ to school every day." 빈칸에 알맞은 것은?', opts('go', 'goes', 'going', 'went'), 'goes', 1, '중', 'Lesson 1. Ready for a New Start'),
    mq('mock-q-e03', 'ox', '"I am a student."는 올바른 문장이다.', opts('O', 'X'), 'O', 2, '하', 'Lesson 1. Ready for a New Start'),
    mq('mock-q-e04', 'multiple_choice', '다음 중 "행복한"을 뜻하는 영어 단어는?', opts('sad', 'happy', 'angry', 'tired'), 'happy', 3, '하', 'Lesson 2. Happy with My Family'),
    mq('mock-q-e05', 'multiple_choice', '"He can ___ very fast." 빈칸에 알맞은 것은?', opts('runs', 'run', 'running', 'ran'), 'run', 4, '중', 'Lesson 2. Happy with My Family'),
    mq('mock-q-e06', 'unscramble', '다음 단어를 올바른 순서로 배열하시오: "is / my / This / book"', [], 'This is my book', 5, '중', 'Lesson 2. Happy with My Family'),
  ],
}

function getMockResults(filters: FilterState): Question[] {
  const pool = MOCK_QUESTIONS[filters.subject] ?? []

  // 단원 필터
  let filtered = pool
  if (filters.subject === '수학' && filters.mathUnits.length > 0) {
    filtered = filtered.filter((q) => q.unit && filters.mathUnits.includes(q.unit))
  }
  if (filters.subject === '영어' && filters.englishLessons.length > 0) {
    filtered = filtered.filter((q) => q.unit && filters.englishLessons.includes(q.unit))
  }

  // limit
  if (!filters.allQuestions && filters.questionCount > 0) {
    filtered = filtered.slice(0, filters.questionCount)
  }

  return filtered
}

export function Step1Pool() {
  const { state, dispatch } = useWizard()
  const { toast } = useToast()

  const [filters, setFilters] = useState<FilterState>(EMPTY_FILTER)
  const [results, setResults] = useState<Question[]>([])
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  // 검색 실행 (버튼 클릭 시만)
  const fetchResults = useCallback(() => {
    if (!isFilterReady(filters)) return

    setLoading(true)
    setSearched(true)
    const params = new URLSearchParams()

    params.set('subject', filters.subject)
    params.set('grade', filters.grade)
    if (!filters.allQuestions && filters.questionCount > 0) {
      params.set('limit', String(filters.questionCount))
    }
    if (state.setId) params.set('excludeSetId', state.setId)

    // 수학: 대단원
    if (filters.subject === '수학' && filters.mathUnits.length > 0) {
      params.set('units', filters.mathUnits.join(','))
    }

    // 영어: Lesson + 평가 영역 + 세부 유형
    if (filters.subject === '영어') {
      if (filters.englishLessons.length > 0) {
        params.set('lessons', filters.englishLessons.join(','))
      }
      if (filters.englishContentType) {
        params.set('contentType', filters.englishContentType)
      }
      if (filters.englishSubType.length > 0) {
        params.set('subTypes', filters.englishSubType.join(','))
      }
    }

    // TODO: 백엔드 연결 시 fetch 활성화
    // fetch(`/api/question-bank?${params}`) ...
    setTimeout(() => {
      setResults(getMockResults(filters))
      setLoading(false)
    }, 300)
  }, [filters, state.setId])

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleAll = () => {
    if (selectedIds.size === results.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(results.map((q) => q.question_id)))
    }
  }

  const handleAddSelected = () => {
    const toAdd = results
      .filter((q) => selectedIds.has(q.question_id))
      .map((q, i): Question => ({
        ...q,
        question_id: `pool-${Date.now()}-${i}`,
        set_id: state.setId,
        order_index: state.questions.length + i,
      }))

    if (toAdd.length === 0) return

    dispatch({ type: 'ADD_QUESTIONS', questions: toAdd })
    setSelectedIds(new Set())
    toast({ title: `${toAdd.length}개 문항을 추가했습니다.` })
  }

  return (
    <div className="flex h-full flex-col">
      {/* 상단: 필터 영역 (콤팩트) */}
      <div className="shrink-0 px-6 pt-3 pb-2 space-y-2">
        <h2 className="text-base font-bold text-gray-900">문항 검색/추가</h2>
        <Step1Filters filters={filters} onChange={setFilters} onSearch={fetchResults} />
      </div>

      {/* 결과 리스트 */}
      <div className="flex-1 overflow-y-auto px-6 pb-2">
        {/* 전체 선택 헤더 */}
        {searched && (
          <div className="flex items-center justify-between py-2 sticky top-0 bg-slate-50/80 backdrop-blur z-10">
            <button onClick={toggleAll} className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700">
              {selectedIds.size === results.length && results.length > 0
                ? <CheckSquare className="h-3.5 w-3.5" />
                : <Square className="h-3.5 w-3.5" />
              }
              전체 선택
            </button>
            <span className="text-xs text-gray-400">
              {loading ? '검색 중...' : `${results.length}개 결과`}
            </span>
          </div>
        )}

        <div className="space-y-2">
          {results.map((q, idx) => (
            <div
              key={q.question_id}
              className={`flex items-start gap-3 rounded-xl border p-3 bg-white transition-colors cursor-pointer
                ${selectedIds.has(q.question_id)
                  ? 'border-blue-300 bg-blue-50/50'
                  : 'border-gray-100 hover:bg-gray-50'
                }`}
              onClick={() => toggleSelect(q.question_id)}
            >
              <Checkbox
                checked={selectedIds.has(q.question_id)}
                className="mt-0.5 shrink-0"
                onClick={(e) => e.stopPropagation()}
                onCheckedChange={() => toggleSelect(q.question_id)}
              />
              <span className="text-xs font-medium text-gray-400 mt-0.5 w-5 shrink-0">
                {idx + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-800 line-clamp-2">
                  {q.content || '(내용 없음)'}
                </p>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0 rounded-full">
                    {TYPE_LABELS[q.type] ?? q.type}
                  </Badge>
                  {q.difficulty && (
                    <Badge variant="outline" className={`text-[10px] px-1.5 py-0 rounded-full ${DIFFICULTY_COLORS[q.difficulty] ?? ''}`}>
                      {q.difficulty}
                    </Badge>
                  )}
                  {q.unit && (
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0 rounded-full text-gray-500 border-gray-200">
                      {q.unit}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          ))}
          {!searched && !loading && (
            <div className="flex items-center justify-center py-16 text-sm text-gray-300">
              필터를 선택하고 검색하기 버튼을 눌러주세요.
            </div>
          )}
          {searched && !loading && results.length === 0 && (
            <div className="flex items-center justify-center py-16 text-sm text-gray-300">
              검색 결과가 없습니다. 필터를 조정해보세요.
            </div>
          )}
        </div>
      </div>

      {/* 하단 액션바 */}
      <div className="shrink-0 bg-white/90 backdrop-blur border-t px-6 py-3 flex items-center justify-between">
        <span className="text-sm text-gray-500">
          {selectedIds.size > 0 ? `${selectedIds.size}개 선택됨` : '문항을 선택하세요'}
        </span>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => dispatch({ type: 'SET_STEP', step: 2 })}
          >
            편집으로 이동
          </Button>
          <Button
            size="sm"
            disabled={selectedIds.size === 0}
            onClick={handleAddSelected}
            className="gap-1"
          >
            선택한 문항 추가 <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
