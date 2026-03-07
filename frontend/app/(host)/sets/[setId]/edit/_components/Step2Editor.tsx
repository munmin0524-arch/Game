'use client'

import { useState, useCallback } from 'react'
import {
  Plus, Trash2, Copy, ChevronUp, ChevronDown, Shuffle, GripVertical,
  PanelBottom, Search, ArrowLeft, ArrowRight,
} from 'lucide-react'
import { DragDropContext, Droppable, Draggable, type DropResult } from '@hello-pangea/dnd'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { QuestionEditor } from '@/components/host/QuestionEditor'
import { QuestionPreview } from '@/components/host/QuestionPreview'
import { useToast } from '@/components/ui/use-toast'
import { questionsApi } from '@/lib/api'
import { useWizard } from './WizardContext'
import { GameTemplateGrid } from './GameTemplateGrid'
import { findTemplate } from './GameTemplateData'
import type { Question, QuestionDraft, SubjectKey } from '@/types'

const TYPE_LABELS: Record<string, string> = {
  multiple_choice: '객관식',
  ox: 'OX',
  short_answer: '단답형',
  fill_in_blank: '빈칸 채우기',
}

export function Step2Editor() {
  const { state, dispatch } = useWizard()
  const { toast } = useToast()
  const { questions, selectedQuestionId, setId, setMeta } = state

  const [showTemplates, setShowTemplates] = useState(false)
  const [splitView, setSplitView] = useState(false)
  const [showAnswerError, setShowAnswerError] = useState(false)

  const selectedQuestion = questions.find((q) => q.question_id === selectedQuestionId) ?? null

  const subjectKey: SubjectKey | null =
    setMeta.subject === '수학' ? 'math' :
    setMeta.subject === '영어' ? 'english' : null

  // 템플릿에서 문항 추가
  const handleAddFromTemplate = useCallback(async (templateCode: string, optionCount: number) => {
    const template = findTemplate(templateCode)
    const isOx = template?.category === 'ox'
    const isSelection = template?.category === 'selection'

    const newQ: Question = {
      question_id: `new-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      set_id: setId,
      type: isOx ? 'ox' : isSelection ? 'multiple_choice' : 'short_answer',
      order_index: questions.length,
      content: '',
      options: isSelection && optionCount > 0
        ? Array.from({ length: optionCount }, (_, i) => ({ index: i + 1, text: '' }))
        : null,
      answer: '',
      hint: null,
      explanation: null,
      media_url: null,
      template_code: templateCode,
      created_at: new Date().toISOString(),
    }

    dispatch({ type: 'ADD_FROM_TEMPLATE', question: newQ })
    setShowTemplates(false)
  }, [setId, questions.length, dispatch])

  // 문항 편집
  const handleUpdateQuestion = useCallback((draft: QuestionDraft) => {
    if (!selectedQuestionId) return
    dispatch({ type: 'UPDATE_QUESTION', id: selectedQuestionId, draft })
  }, [selectedQuestionId, dispatch])

  // 드래그 앤 드롭
  const handleDragEnd = useCallback((result: DropResult) => {
    if (!result.destination) return
    const from = result.source.index
    const to = result.destination.index
    if (from === to) return
    const ids = questions.map((q) => q.question_id)
    const [moved] = ids.splice(from, 1)
    ids.splice(to, 0, moved)
    dispatch({ type: 'REORDER_QUESTIONS', orderedIds: ids })
  }, [questions, dispatch])

  // 셔플
  const handleShuffle = useCallback(() => {
    const ids = [...questions.map((q) => q.question_id)]
    for (let i = ids.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[ids[i], ids[j]] = [ids[j], ids[i]]
    }
    dispatch({ type: 'REORDER_QUESTIONS', orderedIds: ids })
  }, [questions, dispatch])

  // 템플릿 선택 모드
  if (showTemplates) {
    return (
      <div className="flex h-full flex-col bg-white">
        <div className="px-6 py-3 border-b bg-gray-50">
          <h3 className="text-sm font-bold text-gray-700">게임 템플릿 선택</h3>
          <p className="text-xs text-gray-400 mt-0.5">
            과목: {setMeta.subject ?? '미설정'} — 사용할 템플릿을 선택하세요
          </p>
        </div>
        <GameTemplateGrid
          subject={subjectKey}
          onSelect={handleAddFromTemplate}
          onCancel={() => setShowTemplates(false)}
        />
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-1 overflow-hidden">
        {/* 좌측: 문항 목록 */}
        <aside className="flex w-72 flex-col border-r bg-white shrink-0">
          {/* 툴바 */}
          <div className="flex items-center justify-between border-b px-3 py-2 shrink-0">
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" onClick={() => setShowTemplates(true)} className="text-xs gap-1">
                <Plus className="h-3.5 w-3.5" /> 문항 추가
              </Button>
              <Button variant="ghost" size="sm" onClick={() => dispatch({ type: 'SET_STEP', step: 1 })} className="text-xs gap-1">
                <Search className="h-3.5 w-3.5" /> 검색 추가
              </Button>
            </div>
            <div className="flex items-center gap-0.5">
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleShuffle} title="셔플">
                <Shuffle className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost" size="icon" className="h-7 w-7"
                onClick={() => setSplitView(!splitView)}
                title="Split View"
              >
                <PanelBottom className={`h-3.5 w-3.5 ${splitView ? 'text-blue-600' : ''}`} />
              </Button>
            </div>
          </div>

          {/* 문항 리스트 (DnD) */}
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="question-list">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="flex-1 overflow-y-auto p-2 space-y-1.5"
                >
                  {questions.map((q, idx) => (
                    <Draggable key={q.question_id} draggableId={q.question_id} index={idx}>
                      {(drag, snapshot) => (
                        <div
                          ref={drag.innerRef}
                          {...drag.draggableProps}
                          className={`group flex items-start gap-1.5 rounded-xl border p-2 cursor-pointer text-sm transition-all
                            ${snapshot.isDragging ? 'shadow-lg ring-2 ring-blue-300' : ''}
                            ${selectedQuestionId === q.question_id
                              ? 'bg-blue-50 border-blue-300'
                              : 'bg-white hover:bg-gray-50 border-gray-100'
                            }`}
                          onClick={() => dispatch({ type: 'SELECT_QUESTION', id: q.question_id })}
                        >
                          <div {...drag.dragHandleProps} className="mt-1 shrink-0 cursor-grab active:cursor-grabbing text-gray-300 hover:text-gray-500">
                            <GripVertical className="h-3.5 w-3.5" />
                          </div>
                          <span className="mt-0.5 w-5 shrink-0 text-center text-xs font-medium text-gray-400">
                            {idx + 1}
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="truncate font-medium text-gray-800 text-xs">
                              {q.content || '(내용 없음)'}
                            </p>
                            <div className="flex items-center gap-1 mt-0.5">
                              <Badge variant="secondary" className="text-[10px] px-1 py-0 rounded-full">
                                {TYPE_LABELS[q.type] ?? q.type}
                              </Badge>
                              {q.template_code && (
                                <Badge variant="outline" className="text-[10px] px-1 py-0 rounded-full text-purple-500 border-purple-200">
                                  {q.template_code}
                                </Badge>
                              )}
                              {q.difficulty && (
                                <Badge variant="outline" className="text-[10px] px-1 py-0 rounded-full">
                                  {q.difficulty}
                                </Badge>
                              )}
                            </div>
                          </div>
                          {/* 호버 액션 */}
                          <div className="hidden group-hover:flex items-center gap-0.5 shrink-0">
                            <button
                              className="p-0.5 rounded hover:bg-gray-200 text-gray-400"
                              onClick={(e) => { e.stopPropagation(); dispatch({ type: 'DUPLICATE_QUESTION', id: q.question_id }) }}
                              title="복제"
                            >
                              <Copy className="h-3 w-3" />
                            </button>
                            <button
                              className="p-0.5 rounded hover:bg-red-100 text-gray-400 hover:text-red-500"
                              onClick={(e) => { e.stopPropagation(); dispatch({ type: 'DELETE_QUESTION', id: q.question_id }) }}
                              title="삭제"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                  {questions.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-12 text-gray-300 text-sm">
                      <p>문항이 없습니다</p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-3"
                        onClick={() => setShowTemplates(true)}
                      >
                        <Plus className="mr-1 h-4 w-4" /> 문항 추가
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </Droppable>
          </DragDropContext>

          {/* 문항 수 */}
          <div className="border-t px-3 py-2 text-xs text-gray-400 shrink-0">
            총 {questions.length}개 문항
          </div>
        </aside>

        {/* 우측: 편집기 + 프리뷰 */}
        <main className="flex-1 overflow-hidden flex flex-col bg-white">
          {selectedQuestion ? (
            splitView ? (
              /* Split View: 60% 편집 + 40% 프리뷰 */
              <>
                <div className="flex-[6] overflow-y-auto border-b">
                  <QuestionEditor
                    draft={selectedQuestion}
                    onChange={handleUpdateQuestion}
                    showAnswerError={showAnswerError && !selectedQuestion.answer}
                  />
                </div>
                <div className="flex-[4] overflow-y-auto bg-gradient-to-b from-slate-50 to-white">
                  <QuestionPreview
                    question={selectedQuestion}
                    questionIndex={questions.findIndex((q) => q.question_id === selectedQuestionId)}
                    totalQuestions={questions.length}
                    compact
                  />
                </div>
              </>
            ) : (
              <div className="flex-1 overflow-y-auto">
                <QuestionEditor
                  draft={selectedQuestion}
                  onChange={handleUpdateQuestion}
                  showAnswerError={showAnswerError && !selectedQuestion.answer}
                />
              </div>
            )
          ) : (
            <div className="flex h-full items-center justify-center text-gray-300">
              <p>좌측에서 문항을 선택하거나 새로 추가하세요</p>
            </div>
          )}
        </main>
      </div>

      {/* 하단 네비게이션 */}
      <div className="shrink-0 bg-white border-t px-6 py-3 flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => dispatch({ type: 'SET_STEP', step: 1 })}
          className="gap-1"
        >
          <ArrowLeft className="h-4 w-4" /> 문항 검색
        </Button>
        <Button
          size="sm"
          onClick={() => dispatch({ type: 'SET_STEP', step: 3 })}
          className="gap-1"
        >
          다음: 설정 <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
