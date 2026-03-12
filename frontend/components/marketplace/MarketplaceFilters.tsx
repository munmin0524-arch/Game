// MarketplaceFilters — 마켓플레이스 필터바 (단원 필터 포함)
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
import {
  getMathUnits,
  getEnglishLessons,
} from '@/app/(host)/sets/[setId]/edit/_components/FilterHierarchyData'

interface MarketplaceFiltersProps {
  search: string
  onSearchChange: (value: string) => void
  subject: string
  onSubjectChange: (value: string) => void
  grade: string
  onGradeChange: (value: string) => void
  unit?: string
  onUnitChange?: (value: string) => void
  onSearch?: () => void
}

export function MarketplaceFilters({
  search,
  onSearchChange,
  subject,
  onSubjectChange,
  grade,
  onGradeChange,
  unit,
  onUnitChange,
  onSearch,
}: MarketplaceFiltersProps) {
  const gradeGroups = useMemo(
    () => getGradeGroups(subject === '전체' ? null : subject),
    [subject],
  )

  // 단원 목록: 과목+학년에 따라 동적 생성
  const unitOptions = useMemo(() => {
    if (grade === '전체' || !grade) return []
    if (subject === '수학') return getMathUnits(grade)
    if (subject === '영어') return getEnglishLessons(grade)
    return []
  }, [subject, grade])

  const handleSubjectChange = (v: string) => {
    onSubjectChange(v)
    onGradeChange('전체')
    onUnitChange?.('전체')
  }

  const handleGradeChange = (v: string) => {
    onGradeChange(v)
    onUnitChange?.('전체')
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
      <Select value={grade} onValueChange={handleGradeChange}>
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

      {/* 단원 필터 (과목+학년 선택 후 활성화) */}
      {onUnitChange && unitOptions.length > 0 && (
        <Select value={unit ?? '전체'} onValueChange={onUnitChange}>
          <SelectTrigger className="w-[220px] rounded-full">
            <SelectValue placeholder="단원" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="전체">전체 단원</SelectItem>
            {unitOptions.map((u) => (
              <SelectItem key={u} value={u}>
                {u}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  )
}
