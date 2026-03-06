// MarketplaceFilters — 마켓플레이스 필터바
// S-M01 홈, S-M02 검색 결과에서 사용

'use client'

import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface MarketplaceFiltersProps {
  search: string
  onSearchChange: (value: string) => void
  subject: string
  onSubjectChange: (value: string) => void
  grade: string
  onGradeChange: (value: string) => void
  onSearch?: () => void
}

const SUBJECTS = ['전체', '수학', '영어', '과학', '사회', '국어', '기타']
const GRADES = ['전체', '초1', '초2', '초3', '초4', '초5', '초6', '중1', '중2', '중3', '고1', '고2', '고3']

export function MarketplaceFilters({
  search,
  onSearchChange,
  subject,
  onSubjectChange,
  grade,
  onGradeChange,
  onSearch,
}: MarketplaceFiltersProps) {
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
      <Select value={subject} onValueChange={onSubjectChange}>
        <SelectTrigger className="w-[120px] rounded-full">
          <SelectValue placeholder="과목" />
        </SelectTrigger>
        <SelectContent>
          {SUBJECTS.map((s) => (
            <SelectItem key={s} value={s}>
              {s}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* 학년 필터 */}
      <Select value={grade} onValueChange={onGradeChange}>
        <SelectTrigger className="w-[120px] rounded-full">
          <SelectValue placeholder="학년" />
        </SelectTrigger>
        <SelectContent>
          {GRADES.map((g) => (
            <SelectItem key={g} value={g}>
              {g}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
