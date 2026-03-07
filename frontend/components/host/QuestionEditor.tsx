// QuestionEditor — 문항 편집 폼 (S-03 에디터 우측 패널)
// 유형별 분기: 객관식 / OX / 단답형 / 빈칸 채우기

'use client'

import { useRef, useState } from 'react'
import { Plus, Trash2, ImagePlus, X, ChevronDown, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { QuestionDraft, QuestionType } from '@/types'

interface QuestionEditorProps {
  draft: QuestionDraft
  onChange: (updated: QuestionDraft) => void | Promise<void>
  /** 정답 미지정 상태에서 저장 시도한 경우 */
  showAnswerError?: boolean
}

const DIFFICULTY_OPTIONS = [
  { value: '상', label: '상', color: 'bg-red-50 text-red-600 border-red-200' },
  { value: '중', label: '중', color: 'bg-yellow-50 text-yellow-600 border-yellow-200' },
  { value: '하', label: '하', color: 'bg-green-50 text-green-600 border-green-200' },
]

export function QuestionEditor({ draft, onChange, showAnswerError }: QuestionEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [metaOpen, setMetaOpen] = useState(false)
  const [standardInput, setStandardInput] = useState('')
  const [hashtagInput, setHashtagInput] = useState('')

  const handleTypeChange = (type: QuestionType) => {
    onChange({
      ...draft,
      type,
      options:
        type === 'multiple_choice'
          ? [
              { index: 1, text: '' },
              { index: 2, text: '' },
              { index: 3, text: '' },
              { index: 4, text: '' },
            ]
          : null,
      answer: '',
    })
  }

  const handleOptionText = (index: number, text: string) => {
    if (!draft.options) return
    const updated = draft.options.map((opt) => (opt.index === index ? { ...opt, text } : opt))
    onChange({ ...draft, options: updated })
  }

  const handleAddOption = () => {
    if (!draft.options || draft.options.length >= 5) return
    const nextIndex = draft.options.length + 1
    onChange({ ...draft, options: [...draft.options, { index: nextIndex, text: '' }] })
  }

  const handleRemoveOption = (index: number) => {
    if (!draft.options || draft.options.length <= 2) return
    const updated = draft.options
      .filter((o) => o.index !== index)
      .map((o, i) => ({ ...o, index: i + 1 }))
    const answerNum = parseInt(draft.answer)
    onChange({
      ...draft,
      options: updated,
      answer: answerNum > updated.length ? '' : draft.answer,
    })
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    onChange({ ...draft, media_url: url })
  }

  const handleRemoveImage = () => {
    onChange({ ...draft, media_url: null })
  }

  const handleAddStandard = () => {
    const trimmed = standardInput.trim()
    if (!trimmed) return
    const current = draft.achievement_standards ?? []
    if (!current.includes(trimmed)) {
      onChange({ ...draft, achievement_standards: [...current, trimmed] })
    }
    setStandardInput('')
  }

  const handleRemoveStandard = (std: string) => {
    const current = draft.achievement_standards ?? []
    onChange({ ...draft, achievement_standards: current.filter((s) => s !== std) })
  }

  return (
    <div className="flex h-full flex-col gap-5 overflow-y-auto p-6">
      {/* 유형 선택 */}
      <div className="space-y-1">
        <Label>문항 유형</Label>
        <Select value={draft.type} onValueChange={(v) => handleTypeChange(v as QuestionType)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="multiple_choice">객관식</SelectItem>
            <SelectItem value="ox">OX</SelectItem>
            <SelectItem value="unscramble">단어 배열</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 지문 */}
      <div className="space-y-1">
        <Label>문제</Label>
        <Textarea
          placeholder="문제를 입력하세요"
          rows={3}
          value={draft.content}
          onChange={(e) => onChange({ ...draft, content: e.target.value })}
        />
      </div>

      {/* 이미지 첨부 */}
      <div className="space-y-1">
        <Label className="text-gray-500">이미지 (선택)</Label>
        {draft.media_url ? (
          <div className="relative inline-block">
            <img
              src={draft.media_url}
              alt="첨부 이미지"
              className="max-h-40 rounded-xl border object-contain"
            />
            <button
              className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white shadow hover:bg-red-600"
              onClick={handleRemoveImage}
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          <button
            className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 p-6 text-sm text-gray-400 hover:border-blue-300 hover:text-blue-500 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <ImagePlus className="h-5 w-5" />
            이미지 첨부
          </button>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageSelect}
        />
      </div>

      {/* 객관식 보기 — 라디오 클릭으로 정답 선택 */}
      {draft.type === 'multiple_choice' && draft.options && (
        <div className="space-y-2">
          <Label>
            보기
            {showAnswerError && !draft.answer && (
              <span className="ml-2 text-xs text-red-500">정답을 클릭해 주세요</span>
            )}
          </Label>
          {draft.options.map((opt) => {
            const isAnswer = draft.answer === String(opt.index)
            return (
              <div
                key={opt.index}
                className={`flex items-center gap-2 rounded-xl border-2 p-2 transition-colors cursor-pointer ${
                  isAnswer
                    ? 'bg-green-50 border-green-300'
                    : 'border-gray-200 hover:border-gray-300'
                } ${showAnswerError && !draft.answer ? 'border-red-200' : ''}`}
                onClick={() => onChange({ ...draft, answer: String(opt.index) })}
              >
                {/* 라디오 인디케이터 */}
                <div
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                    isAnswer ? 'border-green-500 bg-green-500' : 'border-gray-300'
                  }`}
                >
                  {isAnswer && <div className="h-2 w-2 rounded-full bg-white" />}
                </div>

                <span className="w-5 text-sm font-medium text-gray-500 shrink-0">
                  {['①', '②', '③', '④', '⑤'][opt.index - 1]}
                </span>
                <Input
                  value={opt.text}
                  onChange={(e) => handleOptionText(opt.index, e.target.value)}
                  placeholder={`보기 ${opt.index}`}
                  className="border-0 bg-transparent shadow-none focus-visible:ring-0 p-0 h-auto"
                  onClick={(e) => e.stopPropagation()}
                />
                {draft.options!.length > 2 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 shrink-0 text-gray-400 hover:text-red-500"
                    onClick={(e) => { e.stopPropagation(); handleRemoveOption(opt.index) }}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>
            )
          })}
          {draft.options.length < 5 && (
            <Button variant="ghost" size="sm" onClick={handleAddOption} className="text-gray-500">
              <Plus className="mr-1 h-4 w-4" />
              보기 추가
            </Button>
          )}
        </div>
      )}

      {/* OX 정답 */}
      {draft.type === 'ox' && (
        <div className="space-y-1">
          <Label>
            정답
            {showAnswerError && !draft.answer && (
              <span className="ml-2 text-xs text-red-500">정답을 지정해 주세요</span>
            )}
          </Label>
          <div className="flex gap-3">
            {(['O', 'X'] as const).map((v) => (
              <button
                key={v}
                onClick={() => onChange({ ...draft, answer: v })}
                className={`flex-1 rounded-lg border-2 py-3 text-2xl font-bold transition-all
                  ${
                    draft.answer === v
                      ? 'border-blue-500 bg-blue-50 text-blue-600'
                      : 'border-gray-200 text-gray-400 hover:border-gray-300'
                  }
                  ${showAnswerError && !draft.answer ? 'border-red-300' : ''}
                `}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 단어 배열 정답 */}
      {draft.type === 'unscramble' && (
        <div className="space-y-1">
          <Label>
            정답 (올바른 순서)
            {showAnswerError && !draft.answer && (
              <span className="ml-2 text-xs text-red-500">정답을 입력해 주세요</span>
            )}
          </Label>
          <Input
            value={draft.answer}
            onChange={(e) => onChange({ ...draft, answer: e.target.value })}
            placeholder="올바른 단어 순서 입력"
            className={showAnswerError && !draft.answer ? 'border-red-400' : ''}
          />
        </div>
      )}

      {/* 힌트 */}
      <div className="space-y-1">
        <Label className="text-gray-500">힌트 (선택)</Label>
        <Input
          value={draft.hint ?? ''}
          onChange={(e) => onChange({ ...draft, hint: e.target.value || null })}
          placeholder="힌트를 입력하세요"
        />
      </div>

      {/* 해설 */}
      <div className="space-y-1">
        <Label className="text-gray-500">해설 (선택)</Label>
        <Textarea
          rows={2}
          value={draft.explanation ?? ''}
          onChange={(e) => onChange({ ...draft, explanation: e.target.value || null })}
          placeholder="정답 해설을 입력하세요"
        />
      </div>

      {/* 메타데이터 (접이식) */}
      <div className="border-t pt-3">
        <button
          className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
          onClick={() => setMetaOpen(!metaOpen)}
        >
          {metaOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          메타데이터
        </button>

        {metaOpen && (
          <div className="mt-3 space-y-4 pl-1">
            {/* 난이도 (필수) */}
            <div className="space-y-1.5">
              <Label>난이도 *</Label>
              <div className="flex gap-2">
                {DIFFICULTY_OPTIONS.map((d) => (
                  <button
                    key={d.value}
                    onClick={() =>
                      onChange({
                        ...draft,
                        difficulty: (draft as any).difficulty === d.value ? undefined : d.value,
                      })
                    }
                    className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                      (draft as any).difficulty === d.value
                        ? d.color + ' border-current'
                        : 'bg-gray-50 text-gray-400 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 게임 템플릿 코드 */}
            {(draft as any).template_code && (
              <div className="space-y-1">
                <Label className="text-gray-500">게임 템플릿</Label>
                <Badge variant="outline" className="text-xs text-purple-600 border-purple-200">
                  {(draft as any).template_code}
                </Badge>
              </div>
            )}

            {/* 단원 */}
            <div className="space-y-1">
              <Label className="text-gray-500">단원</Label>
              <Input
                value={(draft as any).unit ?? ''}
                onChange={(e) => onChange({ ...draft, unit: e.target.value || undefined } as any)}
                placeholder="예: 1단원"
              />
            </div>

            {/* 해시태그 */}
            <div className="space-y-1.5">
              <Label className="text-gray-500">해시태그</Label>
              <div className="flex gap-2">
                <Input
                  value={hashtagInput}
                  onChange={(e) => setHashtagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      const tag = hashtagInput.trim().replace(/^#/, '')
                      if (!tag) return
                      const current = (draft as any).hashtags ?? []
                      if (!current.includes(tag)) {
                        onChange({ ...draft, hashtags: [...current, tag] } as any)
                      }
                      setHashtagInput('')
                    }
                  }}
                  placeholder="# 태그 입력 후 Enter"
                  className="flex-1"
                />
              </div>
              {((draft as any).hashtags ?? []).length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {((draft as any).hashtags ?? []).map((tag: string) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="text-xs text-gray-600 border-gray-300 gap-1 pr-1"
                    >
                      #{tag}
                      <button
                        className="ml-0.5 rounded-full hover:bg-gray-200 p-0.5"
                        onClick={() => {
                          const current = (draft as any).hashtags ?? []
                          onChange({ ...draft, hashtags: current.filter((t: string) => t !== tag) } as any)
                        }}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* 성취기준 */}
            <div className="space-y-1.5">
              <Label className="text-gray-500">성취기준</Label>
              <div className="flex gap-2">
                <Input
                  value={standardInput}
                  onChange={(e) => setStandardInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddStandard() } }}
                  placeholder="예: [9수01-01]"
                  className="flex-1"
                />
                <Button variant="outline" size="sm" onClick={handleAddStandard}>
                  추가
                </Button>
              </div>
              {(draft.achievement_standards ?? []).length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {(draft.achievement_standards ?? []).map((std) => (
                    <Badge
                      key={std}
                      variant="outline"
                      className="text-xs text-blue-600 border-blue-200 gap-1 pr-1"
                    >
                      {std}
                      <button
                        className="ml-0.5 rounded-full hover:bg-blue-100 p-0.5"
                        onClick={() => handleRemoveStandard(std)}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
