'use client'

// 필터 순서: 검색 → 교재 → 과목 → 학년 → 테마 → 난이도
// 근거: 교사의 수업 준비 흐름은 "어떤 교재"가 1번, 그 다음 과목/학년 세부 선택.

import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
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
  DIFFICULTY_OPTIONS,
  getGradeGroups,
} from '@/lib/filter-constants'
import { SETS_HUB_LABELS } from '../_labels'
import type { SourceTab } from './SetsSourcePills'

export interface HubFilters {
  search: string
  subject: string
  grade: string
  textbook: string
  theme: string
  difficulty: string
}

export const EMPTY_FILTERS: HubFilters = {
  search: '',
  subject: '전체',
  grade: '전체',
  textbook: '전체',
  theme: '전체',
  difficulty: '전체',
}

export function hasActiveFilters(f: HubFilters): boolean {
  return (
    f.search.trim() !== '' ||
    f.subject !== '전체' ||
    f.grade !== '전체' ||
    f.textbook !== '전체' ||
    f.theme !== '전체' ||
    f.difficulty !== '전체'
  )
}

export function SetsFilterBar({
  filters,
  onChange,
  onResetAll,
  source,
}: {
  filters: HubFilters
  onChange: (patch: Partial<HubFilters>) => void
  onResetAll: () => void
  source: SourceTab
}) {
  const L = SETS_HUB_LABELS.filter
  const gradeGroups = getGradeGroups(filters.subject === '전체' ? null : filters.subject)
  const showTextbook = source === 'all' || source === 'quiz_party' || source === 'community'

  const chips: Array<{ key: keyof HubFilters; label: string }> = []
  if (filters.search.trim())         chips.push({ key: 'search',     label: `${L.prefixSearch}: "${filters.search.trim()}"` })
  if (filters.textbook !== '전체')    chips.push({ key: 'textbook',   label: `${L.prefixTextbook}: ${filters.textbook}` })
  if (filters.subject !== '전체')     chips.push({ key: 'subject',    label: `${L.prefixSubject}: ${filters.subject}` })
  if (filters.grade !== '전체')       chips.push({ key: 'grade',      label: `${L.prefixGrade}: ${filters.grade}` })
  if (filters.theme !== '전체')       chips.push({ key: 'theme',      label: `${L.prefixTheme}: ${filters.theme.replace('공부력-', '공부력 ')}` })
  if (filters.difficulty !== '전체')  chips.push({ key: 'difficulty', label: `${L.prefixDifficulty}: ${filters.difficulty}` })

  const clearChip = (k: keyof HubFilters) => {
    if (k === 'search') onChange({ search: '' })
    else onChange({ [k]: '전체' } as Partial<HubFilters>)
  }

  return (
    <div className="space-y-3">
      {/* 필터 드롭다운 행 — 검색 · 교재 · 과목 · 학년 · 테마 · 난이도 */}
      <div className="flex flex-wrap gap-2">
        <div className="relative min-w-[220px] flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder={L.searchPlaceholder}
            className="pl-9"
            value={filters.search}
            onChange={(e) => onChange({ search: e.target.value })}
          />
        </div>

        {/* ① 교재 (교사 우선순위) */}
        {showTextbook && (
          <Select value={filters.textbook} onValueChange={(v) => onChange({ textbook: v })}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder={L.textbook} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="전체">전체 교재</SelectItem>
              <SelectGroup>
                <SelectLabel className="text-xs text-gray-400">교과서</SelectLabel>
                {TEXTBOOK_OPTIONS.filter((t) => t.kind === 'textbook').map((t) => (
                  <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                ))}
              </SelectGroup>
              <SelectGroup>
                <SelectLabel className="text-xs text-gray-400">문제집</SelectLabel>
                {TEXTBOOK_OPTIONS.filter((t) => t.kind === 'workbook').map((t) => (
                  <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        )}

        {/* ② 과목 */}
        <Select value={filters.subject} onValueChange={(v) => onChange({ subject: v, grade: '전체' })}>
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder={L.subject} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="전체">전체 과목</SelectItem>
            {SUBJECT_OPTIONS.map((s) => (
              <SelectItem key={s.value} value={s.value} disabled={!s.enabled}>
                {s.value}{!s.enabled && ` (${s.label})`}
              </SelectItem>
            ))}
            <SelectItem value="국어">국어</SelectItem>
            <SelectItem value="한자">한자</SelectItem>
            <SelectItem value="한국사">한국사</SelectItem>
          </SelectContent>
        </Select>

        {/* ③ 학년 */}
        <Select value={filters.grade} onValueChange={(v) => onChange({ grade: v })}>
          <SelectTrigger className="w-[170px]">
            <SelectValue placeholder={L.grade} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="전체">전체 학년/학기</SelectItem>
            {gradeGroups.map((g) => (
              <SelectGroup key={g.group}>
                <SelectLabel className="text-xs text-gray-400">{g.group}</SelectLabel>
                {g.items.map((item) => (
                  <SelectItem key={item} value={item}>{item}</SelectItem>
                ))}
              </SelectGroup>
            ))}
          </SelectContent>
        </Select>

        {/* ④ 테마 */}
        <Select value={filters.theme} onValueChange={(v) => onChange({ theme: v })}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder={L.theme} />
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

        {/* ⑤ 난이도 */}
        <Select value={filters.difficulty} onValueChange={(v) => onChange({ difficulty: v })}>
          <SelectTrigger className="w-[110px]">
            <SelectValue placeholder={L.difficulty} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="전체">전체 난이도</SelectItem>
            {DIFFICULTY_OPTIONS.map((d) => (
              <SelectItem key={d} value={d}>{d}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

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
