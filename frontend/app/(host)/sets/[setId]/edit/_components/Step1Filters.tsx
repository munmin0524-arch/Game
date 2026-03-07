'use client'

import { useMemo } from 'react'
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
import {
  MATH_HIERARCHY,
  ENGLISH_HIERARCHY,
  DIFFICULTY_OPTIONS,
  SUBJECT_OPTIONS,
  ENGLISH_ASSESSMENT_AREAS,
  getDepth1Keys,
  getDepth2Keys,
  getDepth3Keys,
  getDepth4Keys,
  type HierarchyTree,
} from './FilterHierarchyData'
import { getGradeGroups } from '@/lib/filter-constants'

export interface FilterState {
  subject: string
  grade: string
  depth1: string[]
  depth2: string[]
  depth3: string[]
  depth4: string[]
  difficulty: string[]
  gameType: string[]
  assessmentArea: string[]
  keyword: string
}

const EMPTY_FILTER: FilterState = {
  subject: '',
  grade: '',
  depth1: [],
  depth2: [],
  depth3: [],
  depth4: [],
  difficulty: [],
  gameType: [],
  assessmentArea: [],
  keyword: '',
}

const GAME_TYPE_OPTIONS = [
  { value: 'selection', label: '선택형' },
  { value: 'ox', label: 'OX형' },
  { value: 'unscramble', label: 'Unscramble형' },
]

interface Step1FiltersProps {
  filters: FilterState
  onChange: (filters: FilterState) => void
}

function PillGroup({
  label,
  options,
  selected,
  onToggle,
  color = 'blue',
}: {
  label: string
  options: string[]
  selected: string[]
  onToggle: (value: string) => void
  color?: 'blue' | 'purple' | 'green' | 'red'
}) {
  if (options.length === 0) return null

  const colors = {
    blue: { active: 'bg-blue-100 text-blue-700 border-blue-300', inactive: 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50' },
    purple: { active: 'bg-purple-100 text-purple-700 border-purple-300', inactive: 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50' },
    green: { active: 'bg-green-100 text-green-700 border-green-300', inactive: 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50' },
    red: { active: 'bg-red-100 text-red-700 border-red-300', inactive: 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50' },
  }

  return (
    <div className="flex items-start gap-3">
      <span className="text-xs font-medium text-gray-500 w-16 shrink-0 pt-1.5">{label}</span>
      <div className="flex flex-wrap gap-1.5">
        {options.map((opt) => {
          const isActive = selected.includes(opt)
          return (
            <button
              key={opt}
              onClick={() => onToggle(opt)}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition-all
                ${isActive ? colors[color].active : colors[color].inactive}`}
            >
              {opt}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export function Step1Filters({ filters, onChange }: Step1FiltersProps) {
  const hierarchy: HierarchyTree | null =
    filters.subject === '수학' ? MATH_HIERARCHY :
    filters.subject === '영어' ? ENGLISH_HIERARCHY : null

  const depth1Options = useMemo(() => hierarchy ? getDepth1Keys(hierarchy) : [], [hierarchy])
  const depth2Options = useMemo(() => {
    if (!hierarchy || filters.depth1.length === 0) return []
    return Array.from(new Set(filters.depth1.flatMap((d1) => getDepth2Keys(hierarchy, d1))))
  }, [hierarchy, filters.depth1])
  const depth3Options = useMemo(() => {
    if (!hierarchy || filters.depth2.length === 0) return []
    return Array.from(new Set(
      filters.depth1.flatMap((d1) =>
        filters.depth2.flatMap((d2) => getDepth3Keys(hierarchy, d1, d2))
      )
    ))
  }, [hierarchy, filters.depth1, filters.depth2])
  const depth4Options = useMemo(() => {
    if (!hierarchy || filters.subject !== '수학' || filters.depth3.length === 0) return []
    return Array.from(new Set(
      filters.depth1.flatMap((d1) =>
        filters.depth2.flatMap((d2) =>
          filters.depth3.flatMap((d3) => getDepth4Keys(hierarchy, d1, d2, d3))
        )
      )
    ))
  }, [hierarchy, filters.subject, filters.depth1, filters.depth2, filters.depth3])

  const gradeGroups = useMemo(() => getGradeGroups(filters.subject || null), [filters.subject])

  const toggleInArray = (arr: string[], value: string): string[] =>
    arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value]

  const updateFilters = (patch: Partial<FilterState>) => {
    onChange({ ...filters, ...patch })
  }

  const handleSubjectChange = (subject: string) => {
    onChange({ ...EMPTY_FILTER, subject: filters.subject === subject ? '' : subject })
  }

  const depthLabels = filters.subject === '수학'
    ? ['대영역', '중영역', '소영역', '지식요소']
    : ['대단원', '중단원', '소단원']

  return (
    <div className="space-y-3 p-4 bg-white rounded-xl border">
      {/* 과목 + 학년/학기 */}
      <div className="flex items-center gap-4 flex-wrap">
        {/* 과목 선택 */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium text-gray-500 w-16 shrink-0">과목</span>
          <div className="flex gap-2">
            {SUBJECT_OPTIONS.map(({ value, enabled }) => (
              <button
                key={value}
                onClick={() => enabled && handleSubjectChange(value)}
                disabled={!enabled}
                className={`rounded-full border-2 px-4 py-1.5 text-sm font-bold transition-all
                  ${!enabled
                    ? 'bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed'
                    : filters.subject === value
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'
                  }`}
              >
                {value}
                {!enabled && (
                  <span className="ml-1 text-[10px] font-normal text-gray-400">준비중</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* 학년/학기 드롭다운 */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-gray-500 shrink-0">학년/학기</span>
          <Select
            value={filters.grade || '__all__'}
            onValueChange={(v) => updateFilters({ grade: v === '__all__' ? '' : v })}
          >
            <SelectTrigger className="w-[200px] h-9 text-sm">
              <SelectValue placeholder="전체" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all__">전체</SelectItem>
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
        </div>
      </div>

      {/* 학습맵 계층 (과목 선택 후) */}
      {hierarchy && (
        <div className="border-t pt-3 space-y-3">
          <span className="text-xs font-bold text-gray-600">
            {filters.subject === '영어' ? '학습맵 (대단원/중단원/소단원)' : '학습맵'}
          </span>
          <PillGroup
            label={depthLabels[0]}
            options={depth1Options}
            selected={filters.depth1}
            onToggle={(v) => updateFilters({ depth1: toggleInArray(filters.depth1, v), depth2: [], depth3: [], depth4: [] })}
          />
          {depth2Options.length > 0 && (
            <PillGroup
              label={depthLabels[1]}
              options={depth2Options}
              selected={filters.depth2}
              onToggle={(v) => updateFilters({ depth2: toggleInArray(filters.depth2, v), depth3: [], depth4: [] })}
              color="purple"
            />
          )}
          {depth3Options.length > 0 && (
            <PillGroup
              label={depthLabels[2]}
              options={depth3Options}
              selected={filters.depth3}
              onToggle={(v) => updateFilters({ depth3: toggleInArray(filters.depth3, v), depth4: [] })}
              color="green"
            />
          )}
          {depth4Options.length > 0 && (
            <PillGroup
              label={depthLabels[3]}
              options={depth4Options}
              selected={filters.depth4}
              onToggle={(v) => updateFilters({ depth4: toggleInArray(filters.depth4, v) })}
              color="red"
            />
          )}
        </div>
      )}

      {/* 영어 평가 영역 — 학습맵과 별도 섹션 */}
      {filters.subject === '영어' && (
        <div className="border-t pt-3 space-y-3">
          <span className="text-xs font-bold text-gray-600">평가 영역</span>
          <PillGroup
            label="영역"
            options={[...ENGLISH_ASSESSMENT_AREAS]}
            selected={filters.assessmentArea}
            onToggle={(v) => updateFilters({ assessmentArea: toggleInArray(filters.assessmentArea, v) })}
            color="purple"
          />
        </div>
      )}

      {/* 공통 필터 */}
      <div className="border-t pt-3 space-y-3">
        <PillGroup
          label="난이도"
          options={DIFFICULTY_OPTIONS.map((d) => d.value)}
          selected={filters.difficulty}
          onToggle={(v) => updateFilters({ difficulty: toggleInArray(filters.difficulty, v) })}
          color="red"
        />
        <PillGroup
          label="게임 유형"
          options={GAME_TYPE_OPTIONS.map((g) => g.label)}
          selected={filters.gameType}
          onToggle={(v) => updateFilters({ gameType: toggleInArray(filters.gameType, v) })}
        />
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium text-gray-500 w-16 shrink-0">키워드</span>
          <Input
            value={filters.keyword}
            onChange={(e) => updateFilters({ keyword: e.target.value })}
            placeholder="문항 내용 검색..."
            className="h-8 text-sm"
          />
        </div>
      </div>
    </div>
  )
}

export { EMPTY_FILTER }
