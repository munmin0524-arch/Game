// QuestionEditor — 문항 편집 폼 (S-03 에디터 우측 패널)
// 유형별 분기: 객관식 / OX / 단답형

'use client'

import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { QuestionDraft, QuestionType, QuestionOption } from '@/types'

interface QuestionEditorProps {
  draft: QuestionDraft
  onChange: (updated: QuestionDraft) => void | Promise<void>
  /** 정답 미지정 상태에서 저장 시도한 경우 */
  showAnswerError?: boolean
}

export function QuestionEditor({ draft, onChange, showAnswerError }: QuestionEditorProps) {
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
    // 정답이 제거된 선택지였으면 초기화
    const answerNum = parseInt(draft.answer)
    onChange({
      ...draft,
      options: updated,
      answer: answerNum > updated.length ? '' : draft.answer,
    })
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
            <SelectItem value="short_answer">단답형</SelectItem>
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

      {/* 객관식 보기 */}
      {draft.type === 'multiple_choice' && draft.options && (
        <div className="space-y-2">
          <Label>보기</Label>
          {draft.options.map((opt) => (
            <div key={opt.index} className="flex items-center gap-2">
              <span className="w-6 text-sm font-medium text-gray-500 shrink-0">
                {['①', '②', '③', '④', '⑤'][opt.index - 1]}
              </span>
              <Input
                value={opt.text}
                onChange={(e) => handleOptionText(opt.index, e.target.value)}
                placeholder={`보기 ${opt.index}`}
              />
              {draft.options!.length > 2 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 shrink-0 text-gray-400 hover:text-red-500"
                  onClick={() => handleRemoveOption(opt.index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          {draft.options.length < 5 && (
            <Button variant="ghost" size="sm" onClick={handleAddOption} className="text-gray-500">
              <Plus className="mr-1 h-4 w-4" />
              보기 추가
            </Button>
          )}

          {/* 객관식 정답 선택 */}
          <div className="space-y-1 pt-2">
            <Label>
              정답
              {showAnswerError && !draft.answer && (
                <span className="ml-2 text-xs text-red-500">정답을 지정해 주세요</span>
              )}
            </Label>
            <Select value={draft.answer} onValueChange={(v) => onChange({ ...draft, answer: v })}>
              <SelectTrigger className={showAnswerError && !draft.answer ? 'border-red-400' : ''}>
                <SelectValue placeholder="정답 선택" />
              </SelectTrigger>
              <SelectContent>
                {draft.options.map((opt) => (
                  <SelectItem key={opt.index} value={String(opt.index)}>
                    {['①', '②', '③', '④', '⑤'][opt.index - 1]} {opt.text || `보기 ${opt.index}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
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

      {/* 단답형 정답 */}
      {draft.type === 'short_answer' && (
        <div className="space-y-1">
          <Label>
            정답
            {showAnswerError && !draft.answer && (
              <span className="ml-2 text-xs text-red-500">정답을 입력해 주세요</span>
            )}
          </Label>
          <Input
            value={draft.answer}
            onChange={(e) => onChange({ ...draft, answer: e.target.value })}
            placeholder="정답 텍스트 입력"
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
    </div>
  )
}
