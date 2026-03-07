// MarketplaceFilters — 마켓플레이스 필터바
// S-M01 홈, S-M02 검색 결과에서 사용

'use client'

import { useMemo } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { SUBJECT_OPTIONS, getGradeGroups } from '@/lib/filter-constants'

interface MarketplaceFiltersProps {
  search: string
  onSearchChange: (value: string) => void
  subject: string
  onSubjectChange: (value: string) => void
  grade: string
  onGradeChange: (value: string) => void
  questionType?: string
  onTypeChange?: (value: string) => void
  onSearch?: () => void
}

const QUESTION_TYPES = [
  { value: '전체', label: '전체' },
  { value: 'multiple_choice', label: '객관식' },
  { value: 'ox', label: 'OX' },
]

export function MarketplaceFilters({
  search,
  onSearchChange,
  subject,
  onSubjectChange,
  grade,
  onGradeChange,
  questionType,
  onTypeChange,
  onSearch,
}: MarketplaceFiltersProps) {
  const gradeGroups = useMemo(
    () => getGradeGroups(subject === '전체' ? null : subject),
    [subject],
  )

  const handleSubjectChange = (v: string) => {
    onSubjectChange(v)
    onGradeChange('전체') // 과목 변경 시 학년 초기화
  }

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {/* 검색 입력 */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="퀴즈 검색..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onSearch?.()}
          className="pl-9 rounded-full"
        />
      </div>

      {/* 과목 필터 */}
      <Select value={subject} onValueChange={handleSubjectChange}>
        <SelectTrigger className="w-[130px] rounded-full">
          <SelectValue placeholder="과목" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="전체">전체 과목</SelectItem>
          {SUBJECT_OPTIONS.map((s) => (
            <SelectItem key={s.value} value={s.value} disabled={!s.enabled}>
              {s.value}{!s.enabled && ` (${s.label})`}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* 학년/학기 필터 */}
      <Select value={grade} onValueChange={onGradeChange}>
        <SelectTrigger className="w-[200px] rounded-full">
          <SelectValue placeholder="학년/학기" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="전체">전체 학년/학기</SelectItem>
          {gradeGroups.map((group) => (
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

      {/* 문항 유형 필터 */}
      {onTypeChange && (
        <Select value={questionType ?? '전체'} onValueChange={onTypeChange}>
          <SelectTrigger className="w-[120px] rounded-full">
            <SelectValue placeholder="유형" />
          </SelectTrigger>
          <SelectContent>
            {QUESTION_TYPES.map((t) => (
              <SelectItem key={t.value} value={t.value}>
                {t.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  )
}
