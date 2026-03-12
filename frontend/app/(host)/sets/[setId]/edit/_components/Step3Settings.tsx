'use client'

import { useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, Rocket } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/components/ui/use-toast'
import { questionSetsApi, questionsApi } from '@/lib/api'
import { SUBJECT_OPTIONS, getGradeGroups } from '@/lib/filter-constants'
import { useWizard } from './WizardContext'
import { findTemplate } from './GameTemplateData'

const TYPE_LABELS: Record<string, string> = {
  multiple_choice: '선택형',
  ox: 'OX형',
}

export function Step3Settings() {
  const router = useRouter()
  const { toast } = useToast()
  const { state, dispatch } = useWizard()
  const { setMeta, questions, setId } = state

  // 요약 통계
  const summary = useMemo(() => {
    const byType: Record<string, number> = {}
    const byDifficulty: Record<string, number> = {}
    const byTemplate: Record<string, number> = {}

    for (const q of questions) {
      byType[q.type] = (byType[q.type] ?? 0) + 1
      if (q.difficulty) byDifficulty[q.difficulty] = (byDifficulty[q.difficulty] ?? 0) + 1
      if (q.template_code) byTemplate[q.template_code] = (byTemplate[q.template_code] ?? 0) + 1
    }

    return { byType, byDifficulty, byTemplate, total: questions.length }
  }, [questions])

  const handleSave = async (deploy: boolean) => {
    // 검증
    if (!setMeta.title.trim()) {
      toast({ title: '퀴즈 제목을 입력해주세요.', variant: 'destructive' })
      return
    }
    if (questions.length === 0) {
      toast({ title: '문항을 1개 이상 추가해주세요.', variant: 'destructive' })
      return
    }
    const unanswered = questions.filter((q) => !q.answer)
    if (unanswered.length > 0) {
      toast({
        title: `${unanswered.length}개 문항에 정답이 지정되지 않았습니다.`,
        variant: 'destructive',
      })
      dispatch({ type: 'SET_STEP', step: 2 })
      dispatch({ type: 'SELECT_QUESTION', id: unanswered[0].question_id })
      return
    }

    try {
      await questionSetsApi.updateTitle(setId, setMeta.title)
      await questionsApi.reorder(setId, questions.map((q) => q.question_id))
      dispatch({ type: 'SET_DIRTY', dirty: false })
      toast({ title: '저장되었습니다.' })

      if (deploy) {
        router.push(`/sets/${setId}/deploy`)
      } else {
        router.push('/sets')
      }
    } catch {
      toast({ title: '저장에 실패했습니다.', variant: 'destructive' })
    }
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-xl px-6 py-8 space-y-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">세트 설정</h2>
            <p className="text-sm text-gray-500 mt-1">퀴즈 정보를 입력하고 저장하세요</p>
          </div>

          {/* 제목 */}
          <div className="space-y-1.5">
            <Label>퀴즈 제목 *</Label>
            <Input
              value={setMeta.title}
              onChange={(e) => dispatch({ type: 'UPDATE_META', meta: { title: e.target.value } })}
              placeholder="예: 수학 1단원 소인수분해 퀴즈"
              className="text-lg font-medium"
            />
          </div>

          {/* 과목 & 학년/학기 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>과목</Label>
              <Select
                value={setMeta.subject ?? ''}
                onValueChange={(v) => {
                  dispatch({ type: 'UPDATE_META', meta: { subject: v || null, grade: null } })
                }}
              >
                <SelectTrigger><SelectValue placeholder="과목 선택" /></SelectTrigger>
                <SelectContent>
                  {SUBJECT_OPTIONS.map((s) => (
                    <SelectItem key={s.value} value={s.value} disabled={!s.enabled}>
                      {s.value}{!s.enabled && ` (${s.label})`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>학년/학기</Label>
              <Select
                value={setMeta.grade ?? ''}
                onValueChange={(v) => dispatch({ type: 'UPDATE_META', meta: { grade: v || null } })}
              >
                <SelectTrigger><SelectValue placeholder="학년/학기 선택" /></SelectTrigger>
                <SelectContent>
                  {getGradeGroups(setMeta.subject).map((group) => (
                    <SelectGroup key={group.group}>
                      <SelectLabel className="text-xs text-gray-400">{group.group}</SelectLabel>
                      {group.items.map((item) => (
                        <SelectItem key={item} value={item}>
                          {item}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 설명 */}
          <div className="space-y-1.5">
            <Label className="text-gray-500">설명 (선택)</Label>
            <Textarea
              value={setMeta.description ?? ''}
              onChange={(e) => dispatch({ type: 'UPDATE_META', meta: { description: e.target.value || null } })}
              placeholder="이 퀴즈의 목적이나 범위를 간단히 설명하세요"
              rows={2}
            />
          </div>

          {/* 출처 */}
          <div className="space-y-1.5">
            <Label className="text-gray-500">출처 (선택)</Label>
            <Input
              value={setMeta.source ?? ''}
              onChange={(e) => dispatch({ type: 'UPDATE_META', meta: { source: e.target.value || null } })}
              placeholder="예: 2024 중1 기말고사"
            />
          </div>

          {/* 요약 */}
          <div className="rounded-2xl bg-gray-50 border p-5 space-y-3">
            <h3 className="text-sm font-bold text-gray-700">요약</h3>
            <p className="text-2xl font-bold text-gray-900">총 {summary.total}문항</p>

            {/* 유형별 */}
            <div className="flex flex-wrap gap-2">
              {Object.entries(summary.byType).map(([type, count]) => (
                <Badge key={type} variant="secondary" className="text-xs">
                  {TYPE_LABELS[type] ?? type} {count}
                </Badge>
              ))}
            </div>

            {/* 난이도별 */}
            {Object.keys(summary.byDifficulty).length > 0 && (
              <div className="flex flex-wrap gap-2">
                {['상', '중', '하'].map((d) =>
                  summary.byDifficulty[d] ? (
                    <Badge key={d} variant="outline" className="text-xs">
                      {d} {summary.byDifficulty[d]}
                    </Badge>
                  ) : null,
                )}
              </div>
            )}

            {/* 템플릿별 */}
            {Object.keys(summary.byTemplate).length > 0 && (
              <div className="flex flex-wrap gap-2">
                {Object.entries(summary.byTemplate).map(([code, count]) => (
                  <Badge key={code} variant="outline" className="text-xs text-purple-600 border-purple-200">
                    {code} ({count})
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 하단 액션 */}
      <div className="shrink-0 bg-white border-t px-6 py-3 flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => dispatch({ type: 'SET_STEP', step: 2 })}
          className="gap-1"
        >
          <ArrowLeft className="h-4 w-4" /> 문항 편집
        </Button>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleSave(false)}
            className="gap-1"
          >
            <Save className="h-4 w-4" /> 저장
          </Button>
          <Button
            size="sm"
            onClick={() => handleSave(true)}
            className="gap-1"
          >
            <Rocket className="h-4 w-4" /> 저장 후 게임 출제
          </Button>
        </div>
      </div>
    </div>
  )
}
