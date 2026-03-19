// 세트 선택 — 메인 플로우 (빠른 게임 시작용)
// 카드 클릭 → 미리보기 / 바로 시작 두 가지 경로

'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Eye, Zap } from 'lucide-react'
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
import { Button } from '@/components/ui/button'
import { QuizCardSkeleton } from '@/components/common/QuizCard'
import { EmptyState } from '@/components/common/EmptyState'
import { questionSetsApi } from '@/lib/api'
import { SUBJECT_OPTIONS, getGradeGroups } from '@/lib/filter-constants'
import type { QuestionSet } from '@/types'

// ─── Mock 폴백 ───

const MOCK_SETS: QuestionSet[] = [
  {
    set_id: 'mock-s-01', host_member_id: 'me', title: '중1 정수와 유리수 단원평가',
    subject: '수학', grade: '중1-1학기', tags: ['정수', '유리수'], is_deleted: false,
    is_shared: false, original_set_id: null, question_count: 15,
    created_at: '2026-03-01T10:00:00Z', updated_at: '2026-03-10T14:30:00Z',
  },
  {
    set_id: 'mock-s-02', host_member_id: 'me', title: '영어 Lesson 2 어휘 퀴즈',
    subject: '영어', grade: '중1-1학기', tags: ['어휘'], is_deleted: false,
    is_shared: true, original_set_id: null, question_count: 20,
    created_at: '2026-02-28T09:00:00Z', updated_at: '2026-03-08T11:00:00Z',
  },
  {
    set_id: 'mock-s-03', host_member_id: 'me', title: '중2 연립방정식 기초 연습',
    subject: '수학', grade: '중2-1학기', tags: ['연립방정식'], is_deleted: false,
    is_shared: false, original_set_id: null, question_count: 12,
    created_at: '2026-02-20T08:00:00Z', updated_at: '2026-03-05T16:00:00Z',
  },
  {
    set_id: 'mock-s-04', host_member_id: 'me', title: '영어 문법 OX 퀴즈 (비교급/최상급)',
    subject: '영어', grade: '중2-1학기', tags: ['문법', 'OX'], is_deleted: false,
    is_shared: false, original_set_id: null, question_count: 10,
    created_at: '2026-02-15T13:00:00Z', updated_at: '2026-03-02T10:00:00Z',
  },
  {
    set_id: 'mock-s-05', host_member_id: 'me', title: '중3 이차방정식의 풀이',
    subject: '수학', grade: '중3-1학기', tags: ['이차방정식'], is_deleted: false,
    is_shared: true, original_set_id: null, question_count: 18,
    created_at: '2026-02-10T11:00:00Z', updated_at: '2026-02-28T09:30:00Z',
  },
  {
    set_id: 'mock-s-06', host_member_id: 'me', title: '영어 독해 실전 문제 (Lesson 4)',
    subject: '영어', grade: '중2-2학기', tags: ['독해', '읽기'], is_deleted: false,
    is_shared: false, original_set_id: null, question_count: 8,
    created_at: '2026-01-25T14:00:00Z', updated_at: '2026-02-20T17:00:00Z',
  },
]

export default function SelectPage() {
  const router = useRouter()

  const [sets, setSets] = useState<QuestionSet[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [subject, setSubject] = useState('전체')
  const [grade, setGrade] = useState('전체')

  const gradeGroups = getGradeGroups(subject === '전체' ? null : subject)

  const fetchSets = useCallback(async () => {
    setLoading(true)
    try {
      const res = await questionSetsApi.list({
        search: search || undefined,
        subject: subject === '전체' ? undefined : subject,
        grade: grade === '전체' ? undefined : grade,
      })
      setSets(res.data)
    } catch {
      setSets(MOCK_SETS)
    } finally {
      setLoading(false)
    }
  }, [search, subject, grade])

  useEffect(() => {
    const timer = setTimeout(fetchSets, 300)
    return () => clearTimeout(timer)
  }, [fetchSets])

  const handleSubjectChange = (v: string) => {
    setSubject(v)
    setGrade('전체')
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div>
        <h1 className="text-2xl font-bold">퀴즈 선택</h1>
        <p className="text-sm text-gray-500 mt-1">게임에 사용할 퀴즈를 골라주세요</p>
      </div>

      {/* 검색 + 필터 */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="퀴즈 검색..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={subject} onValueChange={handleSubjectChange}>
          <SelectTrigger className="w-[130px]">
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
        <Select value={grade} onValueChange={setGrade}>
          <SelectTrigger className="w-[200px]">
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
      </div>

      {/* 카드 그리드 */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <QuizCardSkeleton key={i} />
          ))}
        </div>
      ) : sets.length === 0 ? (
        <EmptyState
          title={search ? '검색 결과가 없어요' : '퀴즈가 없어요'}
          description={search ? '다른 키워드로 검색해보세요.' : '먼저 퀴즈를 만들어주세요.'}
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {sets.map((qs) => (
            <SelectableQuizCard
              key={qs.set_id}
              qs={qs}
              onPreview={() => router.push(`/select/${qs.set_id}/preview`)}
              onQuickStart={() => router.push(`/select/${qs.set_id}/settings`)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// ─── 선택용 카드 (미리보기 + 바로 시작) ───

function SelectableQuizCard({
  qs,
  onPreview,
  onQuickStart,
}: {
  qs: QuestionSet
  onPreview: () => void
  onQuickStart: () => void
}) {
  const GRADIENTS = [
    'from-blue-200 to-cyan-100',
    'from-violet-200 to-purple-100',
    'from-rose-200 to-orange-100',
    'from-emerald-200 to-teal-100',
    'from-amber-200 to-yellow-100',
    'from-pink-200 to-rose-100',
  ]
  const hash = qs.set_id.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
  const gradient = GRADIENTS[hash % GRADIENTS.length]

  return (
    <div className="group relative flex flex-col rounded-2xl overflow-hidden shadow-soft hover:shadow-card transition-all">
      {/* 상단 그라디언트 */}
      <div className={`bg-gradient-to-br ${gradient} px-4 pt-4 pb-10 relative`}>
        <p className="font-bold text-gray-800 text-sm leading-snug line-clamp-2">
          {qs.title}
        </p>
        <p className="text-gray-600/70 text-xs mt-1">{qs.question_count ?? 0}문항</p>
      </div>

      {/* 하단: 배지 + 액션 버튼 */}
      <div className="bg-white px-4 py-3 space-y-3">
        <div className="flex items-center gap-1.5 flex-wrap">
          {qs.subject && (
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-medium">
              {qs.subject}
            </span>
          )}
          {qs.grade && (
            <span className="text-[11px] px-2 py-0.5 rounded-full border border-gray-200 text-gray-500">
              {qs.grade}
            </span>
          )}
        </div>

        {/* 두 가지 액션 */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 h-8 text-xs"
            onClick={onPreview}
          >
            <Eye className="mr-1 h-3 w-3" />
            미리보기
          </Button>
          <Button
            size="sm"
            className="flex-1 h-8 text-xs"
            onClick={onQuickStart}
          >
            <Zap className="mr-1 h-3 w-3" />
            바로 시작
          </Button>
        </div>
      </div>
    </div>
  )
}
