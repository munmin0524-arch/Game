'use client'

import { useMemo } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
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
  SUBJECT_OPTIONS,
  ENGLISH_CONTENT_TYPES,
  getMathUnits,
  getEnglishLessons,
  getEnglishSubTypes,
  type EnglishContentType,
} from './FilterHierarchyData'
import { getGradeGroups } from '@/lib/filter-constants'

// ─── FilterState ───

export interface FilterState {
  subject: string
  grade: string
  // 수학
  mathUnits: string[]
  // 영어
  englishLessons: string[]
  englishContentType: EnglishContentType | ''
  englishSubType: string[]
  // 공통
  questionCount: number
  allQuestions: boolean
}

export const EMPTY_FILTER: FilterState = {
  subject: '',
  grade: '',
  mathUnits: [],
  englishLessons: [],
  englishContentType: '',
  englishSubType: [],
  questionCount: 0,
  allQuestions: false,
}

/** 필터가 충분히 채워져서 검색 가능한지 여부 */
export function isFilterReady(f: FilterState): boolean {
  if (!f.subject || !f.grade) return false
  if (f.subject === '수학' && f.mathUnits.length === 0) return false
  if (f.subject === '영어' && f.englishLessons.length === 0) return false
  return true
}

// ─── 체크박스 리스트 컴포넌트 ───

function CheckboxGroup({
  label,
  options,
  selected,
  onToggle,
}: {
  label: string
  options: string[]
  selected: string[]
  onToggle: (value: string) => void
}) {
  if (options.length === 0) return null

  return (
    <div className="space-y-2">
      <span className="text-xs font-semibold text-gray-600">{label}</span>
      <div className="grid grid-cols-1 gap-1.5 max-h-48 overflow-y-auto">
        {options.map((opt) => {
          const isChecked = selected.includes(opt)
          return (
            <label
              key={opt}
              className={`flex items-center gap-2.5 rounded-lg border px-3 py-2 cursor-pointer transition-all text-sm
                ${isChecked
                  ? 'border-blue-300 bg-blue-50/60'
                  : 'border-gray-100 hover:bg-gray-50'
                }`}
            >
              <Checkbox
                checked={isChecked}
                onCheckedChange={() => onToggle(opt)}
                className="shrink-0"
              />
              <span className={isChecked ? 'text-blue-700 font-medium' : 'text-gray-700'}>
                {opt}
              </span>
            </label>
          )
        })}
      </div>
    </div>
  )
}

// ─── 필 그룹 (어휘/문법 선택용) ───

function PillSelect({
  label,
  options,
  selected,
  onSelect,
}: {
  label: string
  options: string[]
  selected: string
  onSelect: (value: string) => void
}) {
  return (
    <div className="space-y-2">
      <span className="text-xs font-semibold text-gray-600">{label}</span>
      <div className="flex gap-2">
        {options.map((opt) => {
          const isActive = selected === opt
          return (
            <button
              key={opt}
              onClick={() => onSelect(isActive ? '' : opt)}
              className={`rounded-full border-2 px-4 py-1.5 text-sm font-bold transition-all
                ${isActive
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'
                }`}
            >
              {opt}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ─── 메인 필터 컴포넌트 ───

interface Step1FiltersProps {
  filters: FilterState
  onChange: (filters: FilterState) => void
  onSearch?: () => void
}

export function Step1Filters({ filters, onChange, onSearch }: Step1FiltersProps) {
  const gradeGroups = useMemo(() => getGradeGroups(filters.subject || null), [filters.subject])

  // 수학: 학년에 따른 대단원 목록
  const mathUnitOptions = useMemo(() => getMathUnits(filters.grade), [filters.grade])

  // 영어: 학년에 따른 Lesson 목록
  const lessonOptions = useMemo(() => getEnglishLessons(filters.grade), [filters.grade])

  // 영어: 콘텐츠 유형에 따른 세부 유형
  const subTypeOptions = useMemo(
    () => getEnglishSubTypes(filters.englishContentType),
    [filters.englishContentType],
  )

  const toggleInArray = (arr: string[], value: string): string[] =>
    arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value]

  const updateFilters = (patch: Partial<FilterState>) => {
    onChange({ ...filters, ...patch })
  }

  // 과목 변경 시 전체 초기화
  const handleSubjectChange = (subject: string) => {
    if (filters.subject === subject) {
      onChange(EMPTY_FILTER)
    } else {
      onChange({ ...EMPTY_FILTER, subject })
    }
  }

  // 학년 변경 시 하위 필터 초기화
  const handleGradeChange = (grade: string) => {
    updateFilters({
      grade: grade === '__all__' ? '' : grade,
      mathUnits: [],
      englishLessons: [],
      englishContentType: '',
      englishSubType: [],
    })
  }

  // 영어 콘텐츠 유형 변경 시 세부 유형 초기화
  const handleContentTypeChange = (ct: string) => {
    updateFilters({
      englishContentType: ct as EnglishContentType | '',
      englishSubType: [],
    })
  }

  const isMath = filters.subject === '수학'
  const isEnglish = filters.subject === '영어'
  const ready = isFilterReady(filters)

  return (
    <div className="space-y-4 p-4 bg-white rounded-xl border max-h-[45vh] overflow-y-auto">
      {/* ── Row 1: 과목 + 학년/학기 ── */}
      <div className="flex items-center gap-6 flex-wrap">
        {/* 과목 선택 */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium text-gray-500 shrink-0">과목</span>
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
        {filters.subject && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-gray-500 shrink-0">학년/학기</span>
            <Select
              value={filters.grade || '__all__'}
              onValueChange={handleGradeChange}
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
        )}
      </div>

      {/* ── Row 2: 단원 선택 (항상 표시) ── */}
      <div className="border-t pt-4">
        {isMath && mathUnitOptions.length > 0 ? (
          <CheckboxGroup
            label="대단원"
            options={mathUnitOptions}
            selected={filters.mathUnits}
            onToggle={(v) => updateFilters({ mathUnits: toggleInArray(filters.mathUnits, v) })}
          />
        ) : isEnglish && lessonOptions.length > 0 ? (
          <CheckboxGroup
            label="단원"
            options={lessonOptions}
            selected={filters.englishLessons}
            onToggle={(v) => updateFilters({ englishLessons: toggleInArray(filters.englishLessons, v) })}
          />
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-600">단원</span>
            <span className="text-xs text-gray-300">과목과 학년/학기를 먼저 선택하세요</span>
          </div>
        )}
      </div>

      {/* ── Row 3: 평가 영역 (영어 — 항상 표시) ── */}
      {isEnglish && (
        <div className="border-t pt-4">
          <PillSelect
            label="평가 영역"
            options={[...ENGLISH_CONTENT_TYPES]}
            selected={filters.englishContentType}
            onSelect={handleContentTypeChange}
          />
        </div>
      )}

      {/* ── Row 4: 세부 유형 (평가 영역 선택 시) ── */}
      {isEnglish && filters.englishContentType && subTypeOptions.length > 0 && (
        <div className="border-t pt-4">
          <CheckboxGroup
            label={filters.englishContentType === '어휘' ? '어휘 유형' : '문법 유형'}
            options={subTypeOptions}
            selected={filters.englishSubType}
            onToggle={(v) => updateFilters({ englishSubType: toggleInArray(filters.englishSubType, v) })}
          />
        </div>
      )}

      {/* ── Row 5: 문항 수 + 검색하기 ── */}
      <div className="border-t pt-4">
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium text-gray-500 w-16 shrink-0">문항 수</span>
          <Input
            type="number"
            min={0}
            max={200}
            value={filters.questionCount || ''}
            onChange={(e) => updateFilters({ questionCount: Number(e.target.value) || 0, allQuestions: false })}
            placeholder="불러올 문항 수"
            className="h-8 text-sm w-40"
            disabled={filters.allQuestions}
          />
          <label className="flex items-center gap-2 cursor-pointer">
            <Checkbox
              checked={filters.allQuestions}
              onCheckedChange={(checked) =>
                updateFilters({ allQuestions: !!checked, questionCount: checked ? 0 : filters.questionCount })
              }
              className="shrink-0"
            />
            <span className="text-xs font-medium text-gray-600 whitespace-nowrap">전체 문항 불러오기</span>
          </label>
          <div className="ml-auto">
            <Button
              size="sm"
              disabled={!ready}
              onClick={onSearch}
              className="gap-1.5"
            >
              <Search className="h-4 w-4" />
              검색하기
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
