// S-03 에디터
// 스펙: docs/screens/phase1-live-core.md#s-03

'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  Save, Eye, Plus, Trash2, Copy,
  ChevronUp, ChevronDown, Shuffle, Library, Search, ArrowLeft, Check,
  Sparkles, RefreshCw, GripVertical, PanelBottom,
} from 'lucide-react'
import { DragDropContext, Droppable, Draggable, type DropResult } from '@hello-pangea/dnd'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { QuestionEditor } from '@/components/host/QuestionEditor'
import { QuestionPreview } from '@/components/host/QuestionPreview'
import {
  QuestionTemplateCard,
  QUESTION_TEMPLATES,
  type QuestionTemplate,
} from '@/components/host/QuestionTemplateCard'
import { useToast } from '@/components/ui/use-toast'
import { questionSetsApi, questionsApi } from '@/lib/api'
import type { QuestionSet, Question, QuestionDraft, QuestionType } from '@/types'

// question-bank API 응답 형태
interface BankQuestion extends Question {
  set_title: string
}

const TYPE_LABELS: Record<QuestionType, string> = {
  multiple_choice: '객관식',
  ox: 'OX',
  short_answer: '단답형',
  fill_in_blank: '빈칸 채우기',
}

const DIFFICULTY_COLORS: Record<string, string> = {
  '쉬움': 'bg-green-50 text-green-600',
  '보통': 'bg-yellow-50 text-yellow-600',
  '어려움': 'bg-red-50 text-red-600',
}

type EditorMode = 'edit' | 'template' | 'import' | 'ai' | 'preview'

export default function EditorPage() {
  const { setId } = useParams<{ setId: string }>()
  const router = useRouter()
  const { toast } = useToast()

  const [set, setSet] = useState<QuestionSet | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [showAnswerError, setShowAnswerError] = useState(false)
  const [mode, setMode] = useState<EditorMode>('edit')
  const [splitView, setSplitView] = useState(false)

  // 문항 불러오기 필터
  const [bankSearch, setBankSearch] = useState('')
  const [bankType, setBankType] = useState('')
  const [bankSubject, setBankSubject] = useState('')
  const [bankGrade, setBankGrade] = useState('')
  const [bankDifficulty, setBankDifficulty] = useState('')
  const [bankUnit, setBankUnit] = useState('')
  const [bankResults, setBankResults] = useState<BankQuestion[]>([])
  const [selectedBankIds, setSelectedBankIds] = useState<Set<string>>(new Set())
  const [bankLoading, setBankLoading] = useState(false)

  // AI 추천 상태
  const [aiSubject, setAiSubject] = useState('')
  const [aiGrade, setAiGrade] = useState('')
  const [aiUnit, setAiUnit] = useState('')
  const [aiEasyCount, setAiEasyCount] = useState(3)
  const [aiNormalCount, setAiNormalCount] = useState(5)
  const [aiHardCount, setAiHardCount] = useState(2)
  const [aiTypes, setAiTypes] = useState<Set<string>>(new Set(['multiple_choice', 'ox', 'short_answer']))
  const [aiResults, setAiResults] = useState<Question[]>([])
  const [aiSelectedIds, setAiSelectedIds] = useState<Set<string>>(new Set())
  const [aiLoading, setAiLoading] = useState(false)
  const [aiFetched, setAiFetched] = useState(false)

  const isNew = setId === 'new'
  const selectedQuestion = questions.find((q) => q.question_id === selectedId) ?? null

  // 세트지 로드
  useEffect(() => {
    if (isNew) {
      questionSetsApi.create('새 퀴즈').then((newSet) => {
        router.replace(`/sets/${newSet.set_id}/edit`)
      })
      return
    }

    questionSetsApi.get(setId)
      .then(({ questions: qs, ...s }) => {
        setSet(s)
        setQuestions(qs)
        if (qs.length > 0) setSelectedId(qs[0].question_id)
      })
      .catch(() => toast({ title: '불러오기 실패', variant: 'destructive' }))
      .finally(() => setLoading(false))
  }, [setId, isNew, router, toast])

  // 문항 불러오기 검색
  const fetchBankQuestions = useCallback(() => {
    setBankLoading(true)
    const params = new URLSearchParams()
    if (bankSearch) params.set('search', bankSearch)
    if (bankType) params.set('type', bankType)
    if (bankSubject) params.set('subject', bankSubject)
    if (bankGrade) params.set('grade', bankGrade)
    if (bankDifficulty) params.set('difficulty', bankDifficulty)
    if (bankUnit) params.set('unit', bankUnit)
    if (setId && setId !== 'new') params.set('excludeSetId', setId)

    fetch(`/api/question-bank?${params}`)
      .then((r) => r.json())
      .then(setBankResults)
      .finally(() => setBankLoading(false))
  }, [bankSearch, bankType, bankSubject, bankGrade, bankDifficulty, bankUnit, setId])

  useEffect(() => {
    if (mode === 'import') fetchBankQuestions()
  }, [mode, fetchBankQuestions])

  const handleTitleChange = async (title: string) => {
    if (!set) return
    setSet({ ...set, title })
    await questionSetsApi.updateTitle(set.set_id, title)
  }

  const handleAddFromTemplate = async (template: QuestionTemplate) => {
    if (!set) return
    const draft: QuestionDraft = {
      type: template.type,
      order_index: questions.length,
      content: '',
      options:
        template.type === 'multiple_choice'
          ? Array.from({ length: template.optionCount }, (_, i) => ({
              index: i + 1,
              text: '',
            }))
          : null,
      answer: '',
      hint: null,
      explanation: null,
      media_url: null,
    }
    const newQ = await questionsApi.create(set.set_id, draft)
    setQuestions((prev) => [...prev, newQ])
    setSelectedId(newQ.question_id)
    setMode('edit')
  }

  const handleUpdateQuestion = async (updated: QuestionDraft) => {
    if (!set || !selectedId) return
    const q = await questionsApi.update(set.set_id, selectedId, updated)
    setQuestions((prev) => prev.map((p) => (p.question_id === selectedId ? q : p)))
  }

  const handleDeleteQuestion = async (questionId: string) => {
    if (!set) return
    await questionsApi.delete(set.set_id, questionId)
    const remaining = questions.filter((q) => q.question_id !== questionId)
    setQuestions(remaining)
    if (selectedId === questionId) {
      setSelectedId(remaining[0]?.question_id ?? null)
    }
  }

  const handleDuplicate = (questionId: string) => {
    const q = questions.find((q) => q.question_id === questionId)
    if (!q) return
    const copy: Question = {
      ...q,
      question_id: `copy-${Date.now()}`,
      content: q.content + ' (복사본)',
    }
    setQuestions((prev) => {
      const idx = prev.findIndex((q) => q.question_id === questionId)
      const next = [...prev]
      next.splice(idx + 1, 0, copy)
      return next
    })
    setSelectedId(copy.question_id)
  }

  const handleMoveUp = (questionId: string) => {
    setQuestions((prev) => {
      const idx = prev.findIndex((q) => q.question_id === questionId)
      if (idx <= 0) return prev
      const next = [...prev]
      ;[next[idx - 1], next[idx]] = [next[idx], next[idx - 1]]
      return next
    })
  }

  const handleMoveDown = (questionId: string) => {
    setQuestions((prev) => {
      const idx = prev.findIndex((q) => q.question_id === questionId)
      if (idx >= prev.length - 1) return prev
      const next = [...prev]
      ;[next[idx], next[idx + 1]] = [next[idx + 1], next[idx]]
      return next
    })
  }

  const handleShuffle = () => {
    setQuestions((prev) => {
      const arr = [...prev]
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[arr[i], arr[j]] = [arr[j], arr[i]]
      }
      return arr
    })
  }

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return
    const from = result.source.index
    const to = result.destination.index
    if (from === to) return
    setQuestions((prev) => {
      const next = [...prev]
      const [moved] = next.splice(from, 1)
      next.splice(to, 0, moved)
      return next
    })
  }

  const toggleBankSelect = (id: string) => {
    setSelectedBankIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handleImportSelected = () => {
    const toAdd = bankResults
      .filter((q) => selectedBankIds.has(q.question_id))
      .map((q, i): Question => ({
        ...q,
        question_id: `imported-${Date.now()}-${i}`,
        set_id: setId,
        order_index: questions.length + i,
      }))
    setQuestions((prev) => [...prev, ...toAdd])
    if (toAdd.length > 0) setSelectedId(toAdd[0].question_id)
    setSelectedBankIds(new Set())
    setMode('edit')
    toast({ title: `${toAdd.length}개 문항을 추가했습니다.` })
  }

  // AI 추천
  const fetchAiRecommend = async () => {
    if (aiTypes.size === 0) {
      toast({ title: '문항 유형을 하나 이상 선택하세요.', variant: 'destructive' })
      return
    }
    setAiLoading(true)
    try {
      const res = await fetch('/api/question-bank/ai-recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: aiSubject || undefined,
          grade: aiGrade || undefined,
          unit: aiUnit || undefined,
          easyCount: aiEasyCount,
          normalCount: aiNormalCount,
          hardCount: aiHardCount,
          types: Array.from(aiTypes),
        }),
      })
      const data: Question[] = await res.json()
      setAiResults(data)
      setAiSelectedIds(new Set(data.map((q) => q.question_id)))
      setAiFetched(true)
    } catch {
      toast({ title: 'AI 추천 요청에 실패했습니다.', variant: 'destructive' })
    } finally {
      setAiLoading(false)
    }
  }

  const toggleAiSelect = (id: string) => {
    setAiSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleAiSelectAll = () => {
    if (aiSelectedIds.size === aiResults.length) {
      setAiSelectedIds(new Set())
    } else {
      setAiSelectedIds(new Set(aiResults.map((q) => q.question_id)))
    }
  }

  const handleAiImport = () => {
    const toAdd = aiResults
      .filter((q) => aiSelectedIds.has(q.question_id))
      .map((q, i): Question => ({
        ...q,
        question_id: `ai-import-${Date.now()}-${i}`,
        set_id: setId,
        order_index: questions.length + i,
      }))
    setQuestions((prev) => [...prev, ...toAdd])
    if (toAdd.length > 0) setSelectedId(toAdd[0].question_id)
    setAiResults([])
    setAiSelectedIds(new Set())
    setAiFetched(false)
    setMode('edit')
    toast({ title: `${toAdd.length}개 AI 추천 문항을 추가했습니다.` })
  }

  const toggleAiType = (type: string) => {
    setAiTypes((prev) => {
      const next = new Set(prev)
      if (next.has(type)) next.delete(type)
      else next.add(type)
      return next
    })
  }

  const handleSave = async () => {
    const unanswered = questions.filter((q) => !q.answer)
    if (unanswered.length > 0) {
      setShowAnswerError(true)
      toast({
        title: `${unanswered.length}개 문항에 정답이 지정되지 않았습니다.`,
        variant: 'destructive',
      })
      setSelectedId(unanswered[0].question_id)
      return
    }
    setShowAnswerError(false)
    setSaving(true)
    await questionsApi.reorder(set!.set_id, questions.map((q) => q.question_id))
    setSaving(false)
    toast({ title: '저장되었습니다.' })
  }

  const resetBankFilters = () => {
    setBankSearch('')
    setBankType('')
    setBankSubject('')
    setBankGrade('')
    setBankDifficulty('')
    setBankUnit('')
  }

  if (loading || isNew) {
    return <div className="flex h-screen items-center justify-center text-gray-400">로딩 중...</div>
  }

  // ─── 문항 불러오기 전체 화면 ─────────────────────────────
  if (mode === 'import') {
    return (
      <div className="flex h-screen flex-col bg-slate-50/80">
        {/* 헤더 */}
        <header className="flex items-center gap-4 bg-white px-6 py-3 shadow-soft shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => { setMode('edit'); resetBankFilters() }}
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            에디터로 돌아가기
          </Button>
          <h2 className="text-lg font-bold">문항 불러오기</h2>
          <span className="text-sm text-gray-400">
            문항 뱅크에서 검색하고 세트에 추가하세요
          </span>
        </header>

        <div className="flex-1 overflow-hidden flex flex-col mx-auto w-full max-w-4xl px-4 py-6">
          {/* 필터 영역 */}
          <div className="bg-white rounded-2xl shadow-soft p-5 mb-4 space-y-3 shrink-0">
            <div className="flex flex-wrap gap-2">
              <Select value={bankGrade || 'all'} onValueChange={(v) => setBankGrade(v === 'all' ? '' : v)}>
                <SelectTrigger className="w-28">
                  <SelectValue placeholder="학년" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체 학년</SelectItem>
                  <SelectItem value="1학년">1학년</SelectItem>
                  <SelectItem value="2학년">2학년</SelectItem>
                  <SelectItem value="3학년">3학년</SelectItem>
                </SelectContent>
              </Select>

              <Select value={bankSubject || 'all'} onValueChange={(v) => setBankSubject(v === 'all' ? '' : v)}>
                <SelectTrigger className="w-28">
                  <SelectValue placeholder="과목" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체 과목</SelectItem>
                  <SelectItem value="수학">수학</SelectItem>
                  <SelectItem value="영어">영어</SelectItem>
                  <SelectItem value="과학">과학</SelectItem>
                  <SelectItem value="국어">국어</SelectItem>
                  <SelectItem value="사회">사회</SelectItem>
                </SelectContent>
              </Select>

              <Select value={bankUnit || 'all'} onValueChange={(v) => setBankUnit(v === 'all' ? '' : v)}>
                <SelectTrigger className="w-28">
                  <SelectValue placeholder="단원" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체 단원</SelectItem>
                  <SelectItem value="1단원">1단원</SelectItem>
                  <SelectItem value="2단원">2단원</SelectItem>
                  <SelectItem value="3단원">3단원</SelectItem>
                  <SelectItem value="4단원">4단원</SelectItem>
                  <SelectItem value="5단원">5단원</SelectItem>
                </SelectContent>
              </Select>

              <Select value={bankDifficulty || 'all'} onValueChange={(v) => setBankDifficulty(v === 'all' ? '' : v)}>
                <SelectTrigger className="w-28">
                  <SelectValue placeholder="난이도" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체 난이도</SelectItem>
                  <SelectItem value="쉬움">쉬움</SelectItem>
                  <SelectItem value="보통">보통</SelectItem>
                  <SelectItem value="어려움">어려움</SelectItem>
                </SelectContent>
              </Select>

              <Select value={bankType || 'all'} onValueChange={(v) => setBankType(v === 'all' ? '' : v)}>
                <SelectTrigger className="w-28">
                  <SelectValue placeholder="유형" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체 유형</SelectItem>
                  <SelectItem value="multiple_choice">객관식</SelectItem>
                  <SelectItem value="ox">OX</SelectItem>
                  <SelectItem value="short_answer">단답형</SelectItem>
                  <SelectItem value="fill_in_blank">빈칸 채우기</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="문항 내용 검색..."
                className="pl-9"
                value={bankSearch}
                onChange={(e) => setBankSearch(e.target.value)}
              />
            </div>
          </div>

          {/* 검색 결과 수 */}
          <div className="flex items-center justify-between mb-3 px-1">
            <p className="text-sm text-gray-500">
              검색 결과: <span className="font-semibold text-gray-700">{bankResults.length}개</span> 문항
            </p>
            {selectedBankIds.size > 0 && (
              <span className="text-sm font-medium text-blue-600">
                {selectedBankIds.size}개 선택됨
              </span>
            )}
          </div>

          {/* 문항 목록 */}
          <div className="flex-1 overflow-y-auto space-y-2 pb-20">
            {bankLoading ? (
              <div className="py-20 text-center text-sm text-gray-400">불러오는 중...</div>
            ) : bankResults.length === 0 ? (
              <div className="py-20 text-center">
                <p className="text-sm text-gray-400">검색 결과가 없습니다</p>
                <p className="text-xs text-gray-300 mt-1">필터를 변경해 보세요</p>
              </div>
            ) : (
              bankResults.map((q) => {
                const isChecked = selectedBankIds.has(q.question_id)
                return (
                  <label
                    key={q.question_id}
                    className={`flex cursor-pointer items-start gap-3 rounded-2xl border-2 bg-white p-4 transition-all ${
                      isChecked
                        ? 'border-blue-400 bg-blue-50/50 shadow-sm'
                        : 'border-transparent shadow-soft hover:shadow-card'
                    }`}
                  >
                    <div className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-colors ${
                      isChecked ? 'bg-blue-500 border-blue-500' : 'border-gray-300'
                    }`}>
                      {isChecked && <Check className="h-3 w-3 text-white" />}
                    </div>
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={isChecked}
                      onChange={() => toggleBankSelect(q.question_id)}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-gray-800">{q.content}</p>

                      {/* 선택지 미리보기 */}
                      {q.type === 'multiple_choice' && q.options && (
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {q.options.map((opt) => (
                            <span
                              key={opt.index}
                              className={`rounded-lg px-2 py-0.5 text-xs ${
                                q.answer === String(opt.index)
                                  ? 'bg-green-100 text-green-700 font-semibold'
                                  : 'bg-gray-100 text-gray-500'
                              }`}
                            >
                              {opt.index}. {opt.text}
                            </span>
                          ))}
                        </div>
                      )}
                      {q.type === 'ox' && (
                        <p className="mt-1 text-xs text-gray-500">
                          정답: <span className="font-semibold text-green-600">{q.answer}</span>
                        </p>
                      )}
                      {q.type === 'short_answer' && (
                        <p className="mt-1 text-xs text-gray-500">
                          정답: <span className="font-semibold text-green-600">{q.answer}</span>
                        </p>
                      )}

                      {/* 메타 정보 */}
                      <div className="mt-2 flex flex-wrap items-center gap-1.5">
                        <Badge variant="secondary" className="rounded-full text-[10px] px-1.5 py-0">
                          {TYPE_LABELS[q.type] ?? q.type}
                        </Badge>
                        <Badge variant="secondary" className="rounded-full text-[10px] px-1.5 py-0">
                          {q.set_title}
                        </Badge>
                        {q.grade && (
                          <Badge variant="secondary" className="rounded-full text-[10px] px-1.5 py-0">
                            {q.grade}
                          </Badge>
                        )}
                        {q.unit && (
                          <Badge variant="secondary" className="rounded-full text-[10px] px-1.5 py-0">
                            {q.unit}
                          </Badge>
                        )}
                        {q.difficulty && (
                          <Badge
                            variant="secondary"
                            className={`rounded-full text-[10px] px-1.5 py-0 ${DIFFICULTY_COLORS[q.difficulty] ?? ''}`}
                          >
                            {q.difficulty}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </label>
                )
              })
            )}
          </div>

          {/* 하단 고정 액션 바 */}
          {selectedBankIds.size > 0 && (
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 rounded-2xl bg-white px-6 py-3 shadow-card border">
              <span className="text-sm font-medium text-gray-700">
                {selectedBankIds.size}개 문항 선택됨
              </span>
              <Button onClick={handleImportSelected}>
                <Plus className="mr-1 h-4 w-4" />
                선택한 문항 추가
              </Button>
            </div>
          )}
        </div>
      </div>
    )
  }

  // ─── AI 추천 전체 화면 ─────────────────────────────────────
  if (mode === 'ai') {
    const totalCount = aiEasyCount + aiNormalCount + aiHardCount
    return (
      <div className="flex h-screen flex-col bg-slate-50/80">
        <header className="flex items-center gap-4 bg-white px-6 py-3 shadow-soft shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => { setMode('edit'); setAiResults([]); setAiFetched(false) }}
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            에디터로 돌아가기
          </Button>
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-500" />
            AI 추천 문항
          </h2>
          <span className="text-sm text-gray-400">
            조건을 설정하고 AI가 추천하는 문항을 받아보세요
          </span>
        </header>

        <div className="flex-1 overflow-hidden flex flex-col mx-auto w-full max-w-4xl px-4 py-6">
          {/* 설정 영역 */}
          <div className="bg-white rounded-2xl shadow-soft p-5 mb-4 space-y-4 shrink-0">
            {/* 과목 / 학년 / 단원 */}
            <div className="flex flex-wrap gap-2">
              <Select value={aiSubject || 'all'} onValueChange={(v) => setAiSubject(v === 'all' ? '' : v)}>
                <SelectTrigger className="w-28">
                  <SelectValue placeholder="과목" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체 과목</SelectItem>
                  <SelectItem value="수학">수학</SelectItem>
                  <SelectItem value="영어">영어</SelectItem>
                  <SelectItem value="과학">과학</SelectItem>
                  <SelectItem value="국어">국어</SelectItem>
                  <SelectItem value="사회">사회</SelectItem>
                </SelectContent>
              </Select>

              <Select value={aiGrade || 'all'} onValueChange={(v) => setAiGrade(v === 'all' ? '' : v)}>
                <SelectTrigger className="w-28">
                  <SelectValue placeholder="학년" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체 학년</SelectItem>
                  <SelectItem value="1학년">1학년</SelectItem>
                  <SelectItem value="2학년">2학년</SelectItem>
                  <SelectItem value="3학년">3학년</SelectItem>
                </SelectContent>
              </Select>

              <Select value={aiUnit || 'all'} onValueChange={(v) => setAiUnit(v === 'all' ? '' : v)}>
                <SelectTrigger className="w-28">
                  <SelectValue placeholder="단원" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체 단원</SelectItem>
                  <SelectItem value="1단원">1단원</SelectItem>
                  <SelectItem value="2단원">2단원</SelectItem>
                  <SelectItem value="3단원">3단원</SelectItem>
                  <SelectItem value="4단원">4단원</SelectItem>
                  <SelectItem value="5단원">5단원</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 난이도별 문항 수 */}
            <div>
              <p className="text-sm font-semibold text-gray-600 mb-2">난이도별 문항 수</p>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <span className="inline-flex items-center rounded-full bg-green-50 text-green-600 px-2.5 py-0.5 text-xs font-medium">쉬움</span>
                  <Input
                    type="number"
                    min={0}
                    max={20}
                    value={aiEasyCount}
                    onChange={(e) => setAiEasyCount(Math.max(0, Number(e.target.value)))}
                    className="w-16 text-center"
                  />
                </label>
                <label className="flex items-center gap-2">
                  <span className="inline-flex items-center rounded-full bg-yellow-50 text-yellow-600 px-2.5 py-0.5 text-xs font-medium">보통</span>
                  <Input
                    type="number"
                    min={0}
                    max={20}
                    value={aiNormalCount}
                    onChange={(e) => setAiNormalCount(Math.max(0, Number(e.target.value)))}
                    className="w-16 text-center"
                  />
                </label>
                <label className="flex items-center gap-2">
                  <span className="inline-flex items-center rounded-full bg-red-50 text-red-600 px-2.5 py-0.5 text-xs font-medium">어려움</span>
                  <Input
                    type="number"
                    min={0}
                    max={20}
                    value={aiHardCount}
                    onChange={(e) => setAiHardCount(Math.max(0, Number(e.target.value)))}
                    className="w-16 text-center"
                  />
                </label>
                <span className="text-sm text-gray-400 ml-2">
                  총 <span className="font-semibold text-gray-600">{totalCount}</span>개
                </span>
              </div>
            </div>

            {/* 문항 유형 체크박스 */}
            <div>
              <p className="text-sm font-semibold text-gray-600 mb-2">문항 유형</p>
              <div className="flex items-center gap-3">
                {[
                  { key: 'multiple_choice', label: '객관식' },
                  { key: 'ox', label: 'OX' },
                  { key: 'short_answer', label: '단답형' },
                  { key: 'fill_in_blank', label: '빈칸 채우기' },
                ].map(({ key, label }) => (
                  <label key={key} className="flex items-center gap-1.5 cursor-pointer">
                    <div
                      className={`flex h-4.5 w-4.5 items-center justify-center rounded border-2 transition-colors ${
                        aiTypes.has(key) ? 'bg-purple-500 border-purple-500' : 'border-gray-300'
                      }`}
                      onClick={() => toggleAiType(key)}
                    >
                      {aiTypes.has(key) && <Check className="h-3 w-3 text-white" />}
                    </div>
                    <span className="text-sm text-gray-700">{label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* 추천 받기 버튼 */}
            <Button
              onClick={fetchAiRecommend}
              disabled={aiLoading || totalCount === 0}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {aiLoading ? (
                <>
                  <RefreshCw className="mr-1 h-4 w-4 animate-spin" />
                  추천 중...
                </>
              ) : (
                <>
                  <Sparkles className="mr-1 h-4 w-4" />
                  {aiFetched ? '다시 추천 받기' : `${totalCount}개 문항 추천 받기`}
                </>
              )}
            </Button>
          </div>

          {/* 결과 영역 */}
          {aiFetched && (
            <>
              <div className="flex items-center justify-between mb-3 px-1">
                <p className="text-sm text-gray-500">
                  추천 결과: <span className="font-semibold text-gray-700">{aiResults.length}개</span> 문항
                </p>
                <div className="flex items-center gap-3">
                  <button
                    className="text-sm text-purple-600 hover:underline"
                    onClick={toggleAiSelectAll}
                  >
                    {aiSelectedIds.size === aiResults.length ? '전체 해제' : '전체 선택'}
                  </button>
                  {aiSelectedIds.size > 0 && (
                    <span className="text-sm font-medium text-purple-600">
                      {aiSelectedIds.size}개 선택됨
                    </span>
                  )}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto space-y-2 pb-20">
                {aiResults.length === 0 ? (
                  <div className="py-16 text-center">
                    <p className="text-sm text-gray-400">조건에 맞는 문항이 없습니다</p>
                    <p className="text-xs text-gray-300 mt-1">필터를 변경하거나 문항 수를 줄여보세요</p>
                  </div>
                ) : (
                  aiResults.map((q) => {
                    const isChecked = aiSelectedIds.has(q.question_id)
                    return (
                      <label
                        key={q.question_id}
                        className={`flex cursor-pointer items-start gap-3 rounded-2xl border-2 bg-white p-4 transition-all ${
                          isChecked
                            ? 'border-purple-400 bg-purple-50/50 shadow-sm'
                            : 'border-transparent shadow-soft hover:shadow-card'
                        }`}
                      >
                        <div className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-colors ${
                          isChecked ? 'bg-purple-500 border-purple-500' : 'border-gray-300'
                        }`}>
                          {isChecked && <Check className="h-3 w-3 text-white" />}
                        </div>
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={isChecked}
                          onChange={() => toggleAiSelect(q.question_id)}
                        />
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-gray-800">{q.content}</p>

                          {q.type === 'multiple_choice' && q.options && (
                            <div className="mt-2 flex flex-wrap gap-1.5">
                              {q.options.map((opt) => (
                                <span
                                  key={opt.index}
                                  className={`rounded-lg px-2 py-0.5 text-xs ${
                                    q.answer === String(opt.index)
                                      ? 'bg-green-100 text-green-700 font-semibold'
                                      : 'bg-gray-100 text-gray-500'
                                  }`}
                                >
                                  {opt.index}. {opt.text}
                                </span>
                              ))}
                            </div>
                          )}
                          {q.type === 'ox' && (
                            <p className="mt-1 text-xs text-gray-500">
                              정답: <span className="font-semibold text-green-600">{q.answer}</span>
                            </p>
                          )}
                          {q.type === 'short_answer' && (
                            <p className="mt-1 text-xs text-gray-500">
                              정답: <span className="font-semibold text-green-600">{q.answer}</span>
                            </p>
                          )}

                          <div className="mt-2 flex flex-wrap items-center gap-1.5">
                            <Badge variant="secondary" className="rounded-full text-[10px] px-1.5 py-0">
                              {TYPE_LABELS[q.type as QuestionType] ?? q.type}
                            </Badge>
                            {q.grade && (
                              <Badge variant="secondary" className="rounded-full text-[10px] px-1.5 py-0">
                                {q.grade}
                              </Badge>
                            )}
                            {q.unit && (
                              <Badge variant="secondary" className="rounded-full text-[10px] px-1.5 py-0">
                                {q.unit}
                              </Badge>
                            )}
                            {q.difficulty && (
                              <Badge
                                variant="secondary"
                                className={`rounded-full text-[10px] px-1.5 py-0 ${DIFFICULTY_COLORS[q.difficulty] ?? ''}`}
                              >
                                {q.difficulty}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </label>
                    )
                  })
                )}
              </div>

              {/* 하단 고정 액션 바 */}
              {aiSelectedIds.size > 0 && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 rounded-2xl bg-white px-6 py-3 shadow-card border">
                  <span className="text-sm font-medium text-gray-700">
                    {aiSelectedIds.size}개 문항 선택됨
                  </span>
                  <Button onClick={handleAiImport} className="bg-purple-600 hover:bg-purple-700">
                    <Plus className="mr-1 h-4 w-4" />
                    선택한 문항 추가
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    )
  }

  // ─── 에디터 모드 ─────────────────────────────────────────
  return (
    <div className="flex h-screen flex-col">
      {/* 상단 툴바 */}
      <header className="flex items-center gap-4 bg-white px-6 py-3 shadow-soft shrink-0">
        <Input
          value={set?.title ?? ''}
          onChange={(e) => handleTitleChange(e.target.value)}
          className="max-w-xs font-semibold"
          placeholder="퀴즈 제목"
        />
        <div className="ml-auto flex gap-2">
          <Button
            variant={splitView ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSplitView(!splitView)}
            title="분할 보기"
          >
            <PanelBottom className="mr-1 h-4 w-4" />
            분할
          </Button>
          <Button
            variant={mode === 'preview' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setMode(mode === 'preview' ? 'edit' : 'preview')}
          >
            <Eye className="mr-1 h-4 w-4" />
            {mode === 'preview' ? '편집으로' : '미리보기'}
          </Button>
          <Button size="sm" onClick={handleSave} disabled={saving}>
            <Save className="mr-1 h-4 w-4" />
            {saving ? '저장 중...' : '저장'}
          </Button>
        </div>
      </header>

      {/* 본문 2패널 */}
      <div className="flex flex-1 overflow-hidden">
        {/* 좌: 문항 목록 */}
        <aside className="flex w-72 flex-col border-r bg-slate-50/80 shrink-0">
          {/* 좌측 패널 툴바 */}
          <div className="flex items-center gap-1.5 border-b bg-white px-3 py-2 shrink-0">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 text-xs"
              onClick={() => { resetBankFilters(); setMode('import') }}
            >
              <Library className="mr-1 h-3.5 w-3.5" />
              불러오기
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1 text-xs text-purple-600 border-purple-200 hover:bg-purple-50 hover:text-purple-700"
              onClick={() => setMode('ai')}
            >
              <Sparkles className="mr-1 h-3.5 w-3.5" />
              AI 추천
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-gray-500 shrink-0"
              onClick={handleShuffle}
              disabled={questions.length < 2}
              title="순서 섞기"
            >
              <Shuffle className="h-4 w-4" />
            </Button>
            <span className="whitespace-nowrap text-xs text-gray-400 pr-1">
              {questions.length}개
            </span>
          </div>

          {/* 문항 카드 목록 */}
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="question-list">
              {(provided) => (
                <div
                  className="flex-1 overflow-y-auto p-3 space-y-2"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {questions.length === 0 && mode !== 'template' && (
                    <p className="pt-8 text-center text-sm text-gray-400">
                      첫 문항을 추가해보세요
                    </p>
                  )}
                  {questions.map((q, idx) => (
                    <Draggable key={q.question_id} draggableId={q.question_id} index={idx}>
                      {(dragProvided, snapshot) => (
                        <div
                          ref={dragProvided.innerRef}
                          {...dragProvided.draggableProps}
                          className={`group flex items-start gap-1 rounded-xl border p-2.5 cursor-pointer text-sm transition-colors
                            ${selectedId === q.question_id
                              ? 'bg-blue-50 border-blue-300'
                              : 'bg-white hover:bg-gray-50'}
                            ${snapshot.isDragging ? 'shadow-lg ring-2 ring-blue-300' : ''}`}
                          onClick={() => { setSelectedId(q.question_id); setMode('edit') }}
                        >
                          {/* 드래그 핸들 */}
                          <div
                            {...dragProvided.dragHandleProps}
                            className="mt-0.5 shrink-0 cursor-grab text-gray-300 hover:text-gray-500 active:cursor-grabbing"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <GripVertical className="h-4 w-4" />
                          </div>

                          {/* 순서 번호 */}
                          <span className="mt-0.5 w-5 shrink-0 text-center text-xs font-medium text-gray-400">
                            {idx + 1}
                          </span>

                          {/* 문항 내용 */}
                          <div className="min-w-0 flex-1">
                            <p className="truncate font-medium">{q.content || '(내용 없음)'}</p>
                            <p className="text-xs text-gray-400">{TYPE_LABELS[q.type] ?? q.type}</p>
                            {!q.answer && showAnswerError && (
                              <span className="text-xs text-red-400">정답 없음</span>
                            )}
                          </div>

                          {/* 액션 버튼들 */}
                          <div className="flex flex-col gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                            <button
                              className="rounded p-0.5 text-gray-300 hover:bg-gray-100 hover:text-gray-600 disabled:opacity-30"
                              onClick={(e) => { e.stopPropagation(); handleMoveUp(q.question_id) }}
                              disabled={idx === 0}
                              title="위로"
                            >
                              <ChevronUp className="h-3.5 w-3.5" />
                            </button>
                            <button
                              className="rounded p-0.5 text-gray-300 hover:bg-gray-100 hover:text-gray-600 disabled:opacity-30"
                              onClick={(e) => { e.stopPropagation(); handleMoveDown(q.question_id) }}
                              disabled={idx === questions.length - 1}
                              title="아래로"
                            >
                              <ChevronDown className="h-3.5 w-3.5" />
                            </button>
                            <button
                              className="rounded p-0.5 text-gray-300 hover:bg-blue-50 hover:text-blue-500"
                              onClick={(e) => { e.stopPropagation(); handleDuplicate(q.question_id) }}
                              title="복제"
                            >
                              <Copy className="h-3.5 w-3.5" />
                            </button>
                            <button
                              className="rounded p-0.5 text-gray-300 hover:bg-red-50 hover:text-red-400"
                              onClick={(e) => { e.stopPropagation(); handleDeleteQuestion(q.question_id) }}
                              title="삭제"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}

                  {/* 문항 추가 버튼 */}
                  <button
                    className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 p-3 text-sm text-gray-400 hover:border-blue-300 hover:text-blue-500 transition-colors"
                    onClick={() => setMode('template')}
                  >
                    <Plus className="h-4 w-4" />
                    문항 추가
                  </button>
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </aside>

        {/* 우: 문항 편집기 또는 템플릿 선택 */}
        <main className="flex-1 overflow-hidden bg-white">
          {mode === 'preview' ? (
            /* ── 미리보기 모드 ── */
            selectedQuestion ? (
              <div className="h-full overflow-y-auto bg-gradient-to-b from-slate-50 to-white">
                <QuestionPreview
                  question={selectedQuestion}
                  questionIndex={questions.findIndex((q) => q.question_id === selectedId)}
                  totalQuestions={questions.length}
                />
              </div>
            ) : (
              <div className="flex h-full items-center justify-center text-gray-300">
                <p>좌측에서 문항을 선택하세요</p>
              </div>
            )
          ) : mode === 'template' ? (
            /* ── 템플릿 선택 화면 ── */
            <div className="flex h-full flex-col items-center justify-center p-8">
              <h2 className="text-lg font-bold text-gray-800 mb-2">문항 유형을 선택하세요</h2>
              <p className="text-sm text-gray-400 mb-8">
                원하는 유형을 클릭하면 새 문항이 추가됩니다
              </p>
              <div className="grid grid-cols-5 gap-4 max-w-2xl w-full">
                {QUESTION_TEMPLATES.map((tmpl) => (
                  <QuestionTemplateCard
                    key={tmpl.id}
                    template={tmpl}
                    onClick={() => handleAddFromTemplate(tmpl)}
                  />
                ))}
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="mt-6 text-gray-400"
                onClick={() => setMode('edit')}
              >
                취소
              </Button>
            </div>
          ) : selectedQuestion ? (
            splitView ? (
              /* ── Split View: 편집기 + 실시간 프리뷰 ── */
              <div className="flex h-full flex-col">
                <div className="flex-[6] overflow-hidden border-b">
                  <QuestionEditor
                    draft={selectedQuestion}
                    onChange={handleUpdateQuestion}
                    showAnswerError={showAnswerError}
                  />
                </div>
                <div className="flex-[4] overflow-y-auto bg-gradient-to-b from-slate-50 to-white">
                  <QuestionPreview
                    question={selectedQuestion}
                    questionIndex={questions.findIndex((q) => q.question_id === selectedId)}
                    totalQuestions={questions.length}
                    compact
                  />
                </div>
              </div>
            ) : (
              <QuestionEditor
                draft={selectedQuestion}
                onChange={handleUpdateQuestion}
                showAnswerError={showAnswerError}
              />
            )
          ) : (
            <div className="flex h-full flex-col items-center justify-center text-gray-300">
              <p>좌측에서 문항을 선택하거나</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-3"
                onClick={() => setMode('template')}
              >
                <Plus className="mr-1 h-4 w-4" />
                새 문항 추가
              </Button>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
