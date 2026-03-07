'use client'

import { useState } from 'react'
import { Sparkles, X, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { useToast } from '@/components/ui/use-toast'
import type { FilterState } from './Step1Filters'
import type { Question } from '@/types'

interface AiBatchPanelProps {
  filters: FilterState
  onResults: (questions: Question[]) => void
  onClose: () => void
}

const TYPES = [
  { value: 'multiple_choice', label: '객관식' },
  { value: 'ox', label: 'OX' },
  { value: 'short_answer', label: '단답형' },
  { value: 'fill_in_blank', label: '빈칸 채우기' },
]

export function AiBatchPanel({ filters, onResults, onClose }: AiBatchPanelProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  // 난이도별 문항 수
  const [highCount, setHighCount] = useState(2)
  const [midCount, setMidCount] = useState(5)
  const [lowCount, setLowCount] = useState(3)

  // 유형 선택
  const [selectedTypes, setSelectedTypes] = useState<Set<string>>(
    new Set(['multiple_choice', 'ox', 'short_answer']),
  )

  const toggleType = (type: string) => {
    setSelectedTypes((prev) => {
      const next = new Set(prev)
      if (next.has(type)) next.delete(type)
      else next.add(type)
      return next
    })
  }

  const handleGenerate = async () => {
    if (selectedTypes.size === 0) {
      toast({ title: '문항 유형을 하나 이상 선택하세요.', variant: 'destructive' })
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/question-bank/ai-recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: filters.subject || undefined,
          grade: undefined,
          unit: undefined,
          easyCount: lowCount,
          normalCount: midCount,
          hardCount: highCount,
          types: Array.from(selectedTypes),
        }),
      })
      const data: Question[] = await res.json()
      onResults(data)
      toast({ title: `AI가 ${data.length}개 문항을 추천했습니다.` })
    } catch {
      toast({ title: 'AI 추천 요청에 실패했습니다.', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-xl border-2 border-purple-200 bg-purple-50/50 p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-purple-600" />
          <h3 className="text-sm font-bold text-purple-800">AI 문항 추천</h3>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* 난이도별 문항 수 */}
        <div className="space-y-2">
          <Label className="text-xs text-purple-700">난이도별 문항 수</Label>
          <div className="flex items-center gap-2">
            <span className="text-xs text-red-500 w-6">상</span>
            <Input
              type="number" min={0} max={20}
              value={highCount}
              onChange={(e) => setHighCount(Number(e.target.value))}
              className="h-7 w-16 text-xs"
            />
            <span className="text-xs text-yellow-600 w-6">중</span>
            <Input
              type="number" min={0} max={20}
              value={midCount}
              onChange={(e) => setMidCount(Number(e.target.value))}
              className="h-7 w-16 text-xs"
            />
            <span className="text-xs text-green-600 w-6">하</span>
            <Input
              type="number" min={0} max={20}
              value={lowCount}
              onChange={(e) => setLowCount(Number(e.target.value))}
              className="h-7 w-16 text-xs"
            />
          </div>
        </div>

        {/* 유형 선택 */}
        <div className="space-y-2">
          <Label className="text-xs text-purple-700">문항 유형</Label>
          <div className="flex flex-wrap gap-2">
            {TYPES.map(({ value, label }) => (
              <label key={value} className="flex items-center gap-1.5 text-xs cursor-pointer">
                <Checkbox
                  checked={selectedTypes.has(value)}
                  onCheckedChange={() => toggleType(value)}
                />
                {label}
              </label>
            ))}
          </div>
        </div>
      </div>

      <Button
        size="sm"
        onClick={handleGenerate}
        disabled={loading}
        className="w-full gap-1.5 bg-purple-600 hover:bg-purple-700"
      >
        {loading ? (
          <><Loader2 className="h-4 w-4 animate-spin" /> 생성 중...</>
        ) : (
          <><Sparkles className="h-4 w-4" /> 추천 문항 생성 ({highCount + midCount + lowCount}개)</>
        )}
      </Button>
    </div>
  )
}
