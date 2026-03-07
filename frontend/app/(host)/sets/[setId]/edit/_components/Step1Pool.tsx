'use client'

import { useState, useEffect, useCallback } from 'react'
import { ArrowRight, Sparkles, Check, Square, CheckSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { useToast } from '@/components/ui/use-toast'
import { useWizard } from './WizardContext'
import { Step1Filters, EMPTY_FILTER, type FilterState } from './Step1Filters'
import { AiBatchPanel } from './AiBatchPanel'
import type { Question } from '@/types'

const TYPE_LABELS: Record<string, string> = {
  multiple_choice: '객관식',
  ox: 'OX',
  short_answer: '단답형',
  fill_in_blank: '빈칸 채우기',
}

const DIFFICULTY_COLORS: Record<string, string> = {
  '상': 'bg-red-50 text-red-600 border-red-200',
  '중': 'bg-yellow-50 text-yellow-600 border-yellow-200',
  '하': 'bg-green-50 text-green-600 border-green-200',
}

export function Step1Pool() {
  const { state, dispatch } = useWizard()
  const { toast } = useToast()

  const [filters, setFilters] = useState<FilterState>(EMPTY_FILTER)
  const [results, setResults] = useState<Question[]>([])
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(false)
  const [showAiPanel, setShowAiPanel] = useState(false)

  // 필터 변경 시 검색
  const fetchResults = useCallback(() => {
    setLoading(true)
    const params = new URLSearchParams()
    if (filters.keyword) params.set('search', filters.keyword)
    if (filters.subject) params.set('subject', filters.subject)
    if (filters.difficulty.length > 0) params.set('difficulty', filters.difficulty[0])
    if (state.setId) params.set('excludeSetId', state.setId)

    fetch(`/api/question-bank?${params}`)
      .then((r) => r.json())
      .then((data) => setResults(data))
      .finally(() => setLoading(false))
  }, [filters, state.setId])

  useEffect(() => {
    fetchResults()
  }, [fetchResults])

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

  // AI 결과 추가
  const handleAiResults = (aiQuestions: Question[]) => {
    setResults(aiQuestions)
    setSelectedIds(new Set(aiQuestions.map((q) => q.question_id)))
    setShowAiPanel(false)
  }

  return (
    <div className="flex h-full flex-col">
      {/* 상단: 필터 + AI 버튼 */}
      <div className="shrink-0 px-6 pt-4 pb-2 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">문항 검색/추가</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAiPanel(!showAiPanel)}
            className="gap-1.5 text-purple-600 border-purple-200 hover:bg-purple-50"
          >
            <Sparkles className="h-4 w-4" />
            AI 추천
          </Button>
        </div>
        <Step1Filters filters={filters} onChange={setFilters} />
      </div>

      {/* AI 패널 (토글) */}
      {showAiPanel && (
        <div className="shrink-0 px-6 pb-3">
          <AiBatchPanel
            filters={filters}
            onResults={handleAiResults}
            onClose={() => setShowAiPanel(false)}
          />
        </div>
      )}

      {/* 결과 리스트 */}
      <div className="flex-1 overflow-y-auto px-6 pb-2">
        {/* 전체 선택 헤더 */}
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
                  {q.template_code && (
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0 rounded-full text-purple-500 border-purple-200">
                      {q.template_code}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          ))}
          {!loading && results.length === 0 && (
            <div className="flex items-center justify-center py-16 text-sm text-gray-300">
              검색 결과가 없습니다. 필터를 조정하거나 AI 추천을 사용해보세요.
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
