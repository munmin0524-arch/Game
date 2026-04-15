'use client'

// 3-depth cascade 필터
//  1depth: Mode (교과서별/교재별/과목별/테마별) — SetsFilterModePicker에서 처리
//  2depth: 상세 (교과서명·교재명·과목·테마)
//  3depth: 학년/학기
// mode=null 일 때는 아무 cascade도 표시하지 않음(검색만 유효)

import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
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
  TEXTBOOK_OPTIONS,
  THEME_OPTIONS,
  getGradeGroups,
  getUnits,
  getTextbookSubjects,
} from '@/lib/filter-constants'
import { SETS_HUB_LABELS } from '../_labels'
import { SetsFilterModePicker, type FilterMode } from './SetsFilterModePicker'

export interface HubFilters {
  mode: FilterMode
  search: string
  subject: string
  grade: string
  textbook: string
  theme: string
  unit: string
}

export const EMPTY_FILTERS: HubFilters = {
  mode: null,
  search: '',
  subject: '전체',
  grade: '전체',
  textbook: '전체',
  theme: '전체',
  unit: '전체',
}

export function hasActiveFilters(f: HubFilters): boolean {
  return (
    f.mode !== null ||
    f.search.trim() !== '' ||
    f.subject !== '전체' ||
    f.grade !== '전체' ||
    f.textbook !== '전체' ||
    f.theme !== '전체' ||
    f.unit !== '전체'
  )
}

// 과목별로 사용 가능한 학년 그룹 (수학·영어만 세분화, 그 외는 일반 학년 리스트 사용)
function useGradeGroups(subject: string) {
  return getGradeGroups(subject === '전체' ? null : subject)
}

export function SetsFilterBar({
  filters,
  onChange,
  onResetAll,
}: {
  filters: HubFilters
  onChange: (patch: Partial<HubFilters>) => void
  onResetAll: () => void
}) {
  const L = SETS_HUB_LABELS.filter
  const gradeGroups = useGradeGroups(filters.subject)

  // ── 모드 변경 시 하위 초기화 ──
  const handleModeChange = (m: FilterMode) => {
    onChange({
      mode: m,
      textbook: '전체',
      subject: '전체',
      grade: '전체',
      theme: '전체',
      unit: '전체',
    })
  }

  // ── 단원 옵션 ──
  const unitOptions = getUnits(
    filters.subject === '전체' ? null : filters.subject,
    filters.grade === '전체' ? null : filters.grade,
  )

  // ── 교과서 전용: 교과서로 필터링된 과목 옵션 ──
  const textbookSubjects = getTextbookSubjects(filters.textbook === '전체' ? null : filters.textbook)
  const textbookSubjectOptions = textbookSubjects.length > 0
    ? SUBJECT_OPTIONS.filter((s) => textbookSubjects.includes(s.value))
    : SUBJECT_OPTIONS

  // ── 활성 칩 ──
  const chips: Array<{ key: keyof HubFilters; label: string }> = []
  if (filters.search.trim())         chips.push({ key: 'search',   label: `${L.prefixSearch}: "${filters.search.trim()}"` })
  if (filters.textbook !== '전체')    chips.push({ key: 'textbook', label: `${L.prefixTextbook}: ${filters.textbook}` })
  if (filters.subject !== '전체')     chips.push({ key: 'subject',  label: `${L.prefixSubject}: ${filters.subject}` })
  if (filters.grade !== '전체')       chips.push({ key: 'grade',    label: `${L.prefixGrade}: ${filters.grade}` })
  if (filters.unit !== '전체')        chips.push({ key: 'unit',     label: `단원: ${filters.unit}` })
  if (filters.theme !== '전체')       chips.push({ key: 'theme',    label: `${L.prefixTheme}: ${filters.theme.replace('공부력-', '공부력 ')}` })

  const clearChip = (k: keyof HubFilters) => {
    if (k === 'search') onChange({ search: '' })
    else onChange({ [k]: '전체' } as Partial<HubFilters>)
  }

  return (
    <div className="space-y-3">
      {/* 1-depth: 모드 선택기 + 검색 */}
      <SetsFilterModePicker
        mode={filters.mode}
        onModeChange={handleModeChange}
        search={filters.search}
        onSearchChange={(v) => onChange({ search: v })}
      />

      {/* 2·3-depth: 모드에 따라 다른 cascade */}
      {filters.mode && (
        <div className="flex flex-wrap gap-2 animate-in fade-in slide-in-from-top-1 duration-200">
          {/* 교과서별 — 3depth(교과서) > 3depth(과목) > 4depth(학년/학기) > 5depth(단원) */}
          {filters.mode === 'textbook' && (
            <>
              <Select value={filters.textbook} onValueChange={(v) => onChange({ textbook: v, subject: '전체', grade: '전체', unit: '전체' })}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder={`📘 ${L.textbook}`} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="전체">전체 교과서</SelectItem>
                  {TEXTBOOK_OPTIONS.filter((t) => t.kind === 'textbook').map((t) => (
                    <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={filters.subject}
                onValueChange={(v) => onChange({ subject: v, grade: '전체', unit: '전체' })}
                disabled={filters.textbook === '전체'}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder={filters.textbook === '전체' ? '교과서 먼저' : L.subject} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="전체">전체 과목</SelectItem>
                  {textbookSubjectOptions.map((s) => (
                    <SelectItem key={s.value} value={s.value} disabled={!s.enabled}>
                      {s.value}{!s.enabled && s.label ? ` (${s.label})` : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <GradeSelect
                value={filters.grade}
                onChange={(v) => onChange({ grade: v, unit: '전체' })}
                groups={gradeGroups}
                disabled={filters.subject === '전체'}
                placeholder={filters.subject === '전체' ? '과목 먼저' : L.grade}
              />
              <UnitSelect
                value={filters.unit}
                onChange={(v) => onChange({ unit: v })}
                units={unitOptions}
                disabled={filters.grade === '전체'}
                placeholder={
                  filters.grade === '전체'
                    ? '학년/학기 먼저'
                    : unitOptions.length === 0 ? '단원 데이터 준비중' : '단원 선택'
                }
              />
            </>
          )}

          {/* 교재별(문제집) */}
          {filters.mode === 'workbook' && (
            <>
              <Select value={filters.textbook} onValueChange={(v) => onChange({ textbook: v, grade: '전체' })}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder={`📐 문제집`} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="전체">전체 문제집</SelectItem>
                  {TEXTBOOK_OPTIONS.filter((t) => t.kind === 'workbook').map((t) => (
                    <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <GradeSelect
                value={filters.grade}
                onChange={(v) => onChange({ grade: v })}
                groups={getGradeGroups('수학')}
                disabled={filters.textbook === '전체'}
                placeholder={filters.textbook === '전체' ? '문제집 먼저' : L.grade}
              />
            </>
          )}

          {/* 과목별 — 2depth(과목) > 3depth(학년/학기) > 4depth(단원/지식요인) */}
          {filters.mode === 'subject' && (
            <>
              <Select value={filters.subject} onValueChange={(v) => onChange({ subject: v, grade: '전체', unit: '전체' })}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder={`📚 ${L.subject}`} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="전체">전체 과목</SelectItem>
                  {SUBJECT_OPTIONS.map((s) => (
                    <SelectItem key={s.value} value={s.value} disabled={!s.enabled}>
                      {s.value}{!s.enabled && s.label ? ` (${s.label})` : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <GradeSelect
                value={filters.grade}
                onChange={(v) => onChange({ grade: v, unit: '전체' })}
                groups={gradeGroups}
                disabled={filters.subject === '전체'}
                placeholder={filters.subject === '전체' ? '과목 먼저' : L.grade}
              />
              <UnitSelect
                value={filters.unit}
                onChange={(v) => onChange({ unit: v })}
                units={unitOptions}
                disabled={filters.grade === '전체'}
                placeholder={
                  filters.grade === '전체'
                    ? '학년/학기 먼저'
                    : unitOptions.length === 0 ? '단원 데이터 준비중' : '단원/지식요인 선택'
                }
              />
            </>
          )}

          {/* 테마별 */}
          {filters.mode === 'theme' && (
            <>
              <Select value={filters.theme} onValueChange={(v) => onChange({ theme: v })}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder={`🎯 ${L.theme}`} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="전체">전체 테마</SelectItem>
                  {THEME_OPTIONS.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.emoji} {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <GradeSelect
                value={filters.grade}
                onChange={(v) => onChange({ grade: v })}
                groups={getGradeGroups(null)}
                disabled={false}
                placeholder={`${L.grade} (선택)`}
              />
            </>
          )}
        </div>
      )}

      {/* 활성 필터 칩 */}
      {chips.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs text-gray-400">{L.activeLabel}</span>
          {chips.map((c) => (
            <button
              key={c.key}
              onClick={() => clearChip(c.key)}
              className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-xs text-blue-700 ring-1 ring-blue-200 hover:bg-blue-100"
            >
              {c.label}
              <X className="h-3 w-3" />
            </button>
          ))}
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-xs text-gray-500 hover:text-gray-700"
            onClick={onResetAll}
          >
            {L.resetAll}
          </Button>
        </div>
      )}
    </div>
  )
}

function GradeSelect({
  value,
  onChange,
  groups,
  disabled,
  placeholder,
}: {
  value: string
  onChange: (v: string) => void
  groups: ReturnType<typeof getGradeGroups>
  disabled: boolean
  placeholder: string
}) {
  return (
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="전체">전체 학년/학기</SelectItem>
        {groups.map((g) => (
          <SelectGroup key={g.group}>
            <SelectLabel className="text-xs text-gray-400">{g.group}</SelectLabel>
            {g.items.map((item) => (
              <SelectItem key={item} value={item}>{item}</SelectItem>
            ))}
          </SelectGroup>
        ))}
      </SelectContent>
    </Select>
  )
}

function UnitSelect({
  value,
  onChange,
  units,
  disabled,
  placeholder,
}: {
  value: string
  onChange: (v: string) => void
  units: string[]
  disabled: boolean
  placeholder: string
}) {
  const effectiveDisabled = disabled || units.length === 0
  return (
    <Select value={value} onValueChange={onChange} disabled={effectiveDisabled}>
      <SelectTrigger className="w-[220px]">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="전체">전체 단원</SelectItem>
        {units.map((u) => (
          <SelectItem key={u} value={u}>{u}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
