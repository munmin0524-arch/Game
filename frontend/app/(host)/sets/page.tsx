// S-02 세트지 목록 — 탭 분류 + 카드 그리드 + 공유
// 스펙: docs/screens/phase1-live-core.md#s-02

'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Plus, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
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
import { QuizCard, QuizCardSkeleton } from '@/components/common/QuizCard'
import { PublishDialog } from '@/components/marketplace/PublishDialog'
import { EmptyState } from '@/components/common/EmptyState'
import { useToast } from '@/components/ui/use-toast'
import { questionSetsApi } from '@/lib/api'
import { SUBJECT_OPTIONS, getGradeGroups } from '@/lib/filter-constants'
import type { QuestionSet } from '@/types'

// ─── Mock 데이터 (백엔드 연결 전 폴백) ───

const MOCK_SETS: QuestionSet[] = [
  {
    set_id: 'mock-s-01', host_member_id: 'me', title: '중1 정수와 유리수 단원평가',
    subject: '수학', grade: '중1-1학기', tags: ['정수', '유리수'], is_deleted: false,
    is_shared: false, original_set_id: null, question_count: 15,
    created_at: '2026-03-01T10:00:00Z', updated_at: '2026-03-10T14:30:00Z',
  },
  {
    set_id: 'mock-s-02', host_member_id: 'me', title: '국어 비문학 독해 연습 — 설명문·논설문',
    subject: '국어', grade: '중2-1학기', tags: ['비문학', '독해', '설명문'], is_deleted: false,
    is_shared: true, original_set_id: null, question_count: 20,
    created_at: '2026-02-28T09:00:00Z', updated_at: '2026-03-08T11:00:00Z',
  },
  {
    set_id: 'mock-s-03', host_member_id: 'me', title: '사회 민주주의와 선거제도 OX 퀴즈',
    subject: '사회', grade: '중3-1학기', tags: ['민주주의', '선거', '정치'], is_deleted: false,
    is_shared: false, original_set_id: null, question_count: 12,
    created_at: '2026-02-20T08:00:00Z', updated_at: '2026-03-05T16:00:00Z',
  },
  {
    set_id: 'mock-s-04', host_member_id: 'me', title: '과학 지구와 달의 운동 개념 확인',
    subject: '과학', grade: '중1-2학기', tags: ['지구과학', '달', '자전공전'], is_deleted: false,
    is_shared: false, original_set_id: null, question_count: 10,
    created_at: '2026-02-15T13:00:00Z', updated_at: '2026-03-02T10:00:00Z',
  },
  {
    set_id: 'mock-s-05', host_member_id: 'me', title: '한자 8급 기출 50자 읽기 테스트',
    subject: '한자', grade: '중1-1학기', tags: ['한자8급', '읽기'], is_deleted: false,
    is_shared: true, original_set_id: null, question_count: 25,
    created_at: '2026-02-10T11:00:00Z', updated_at: '2026-02-28T09:30:00Z',
  },
  {
    set_id: 'mock-s-06', host_member_id: 'me', title: '영어 Lesson 3 어휘+문법 종합',
    subject: '영어', grade: '중2-1학기', tags: ['어휘', '문법', '종합'], is_deleted: false,
    is_shared: false, original_set_id: null, question_count: 18,
    created_at: '2026-01-25T14:00:00Z', updated_at: '2026-02-20T17:00:00Z',
  },
  {
    set_id: 'mock-s-07', host_member_id: 'me', title: '국어 문학 감상 — 현대시 핵심 정리',
    subject: '국어', grade: '중3-2학기', tags: ['현대시', '문학', '감상'], is_deleted: false,
    is_shared: false, original_set_id: null, question_count: 14,
    created_at: '2026-01-18T10:00:00Z', updated_at: '2026-02-15T12:00:00Z',
  },
  {
    set_id: 'mock-s-08', host_member_id: 'me', title: '과학 화학 반응식 맞추기 (산화·환원)',
    subject: '과학', grade: '중2-2학기', tags: ['화학', '산화환원', '반응식'], is_deleted: false,
    is_shared: true, original_set_id: null, question_count: 16,
    created_at: '2026-01-10T09:00:00Z', updated_at: '2026-02-10T15:00:00Z',
  },
  {
    set_id: 'mock-s-09', host_member_id: 'me', title: '사회 세계 기후와 자연환경 빈칸 퀴즈',
    subject: '사회', grade: '중1-2학기', tags: ['기후', '자연환경', '지리'], is_deleted: false,
    is_shared: false, original_set_id: null, question_count: 22,
    created_at: '2026-03-05T07:00:00Z', updated_at: '2026-03-12T10:00:00Z',
  },
  {
    set_id: 'mock-s-10', host_member_id: 'me', title: '중2 확률과 통계 실전 문제',
    subject: '수학', grade: '중2-2학기', tags: ['확률', '통계'], is_deleted: false,
    is_shared: false, original_set_id: null, question_count: 15,
    created_at: '2026-02-05T12:00:00Z', updated_at: '2026-03-01T08:00:00Z',
  },
  {
    set_id: 'mock-s-11', host_member_id: 'me', title: '한자 사자성어 60선 의미 맞추기',
    subject: '한자', grade: '중2-1학기', tags: ['사자성어', '의미'], is_deleted: false,
    is_shared: true, original_set_id: null, question_count: 30,
    created_at: '2026-01-28T15:00:00Z', updated_at: '2026-02-25T11:00:00Z',
  },
  {
    set_id: 'mock-s-12', host_member_id: 'me', title: '과학 뉴턴의 운동 법칙 3단계 퀴즈',
    subject: '과학', grade: '중3-1학기', tags: ['물리', '뉴턴', '운동법칙'], is_deleted: false,
    is_shared: false, original_set_id: null, question_count: 12,
    created_at: '2026-01-15T09:30:00Z', updated_at: '2026-02-18T14:00:00Z',
  },
]

// ─── 탭 정의 ───

type TabKey = 'mine' | 'shared' | 'quiz_party'

const TABS: { key: TabKey; label: string }[] = [
  { key: 'mine', label: '내가 만든' },
  { key: 'shared', label: '선생님 공유 퀴즈' },
  { key: 'quiz_party', label: '퀴즈파티 퀴즈' },
]

export default function SetsPage() {
  const router = useRouter()
  const { toast } = useToast()

  const [activeTab, setActiveTab] = useState<TabKey>('mine')
  const [sets, setSets] = useState<QuestionSet[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [subject, setSubject] = useState('전체')
  const [grade, setGrade] = useState('전체')

  // 공유 다이얼로그
  const [publishOpen, setPublishOpen] = useState(false)
  const [publishTarget, setPublishTarget] = useState<QuestionSet | null>(null)

  const gradeGroups = getGradeGroups(subject === '전체' ? null : subject)

  const fetchSets = useCallback(async () => {
    setLoading(true)
    try {
      const res = await questionSetsApi.list({
        search: search || undefined,
        subject: subject === '전체' ? undefined : subject,
        grade: grade === '전체' ? undefined : grade,
        source: activeTab === 'mine' ? undefined : activeTab,
      })
      setSets(res.data)
    } catch {
      setSets(MOCK_SETS)
    } finally {
      setLoading(false)
    }
  }, [search, subject, grade, activeTab, toast])

  useEffect(() => {
    const timer = setTimeout(fetchSets, 300)
    return () => clearTimeout(timer)
  }, [fetchSets])

  const handleSubjectChange = (v: string) => {
    setSubject(v)
    setGrade('전체')
  }

  const handleDuplicate = async (setId: string) => {
    try {
      await questionSetsApi.duplicate(setId)
      toast({ title: '퀴즈가 복제되었습니다.' })
      fetchSets()
    } catch {
      toast({ title: '복제에 실패했습니다.', variant: 'destructive' })
    }
  }

  const handleDelete = async (setId: string) => {
    try {
      await questionSetsApi.delete(setId)
      toast({ title: '퀴즈가 삭제되었습니다.' })
      setSets((prev) => prev.filter((s) => s.set_id !== setId))
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : ''
      toast({
        title: msg.includes('deployed')
          ? '게임에 사용된 퀴즈는 삭제할 수 없습니다.'
          : '삭제에 실패했습니다.',
        variant: 'destructive',
      })
    }
  }

  const handleShare = (qs: QuestionSet) => {
    setPublishTarget(qs)
    setPublishOpen(true)
  }

  const handlePublish = (_form: { title: string; description: string; subject: string; grade: string; tags: string[] }) => {
    // TODO: marketplaceApi.publish(publishTarget.set_id, form)
    toast({ title: '퀴즈 광장에 공유되었습니다.' })
    setPublishOpen(false)
    setPublishTarget(null)
  }

  const isMine = activeTab === 'mine'

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">내 퀴즈</h1>
        <Button asChild>
          <Link href="/sets/new/edit">
            <Plus className="mr-2 h-4 w-4" />
            새 퀴즈
          </Link>
        </Button>
      </div>

      {/* 탭 */}
      <div className="flex gap-1 border-b">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2.5 text-sm font-medium transition-colors relative
              ${activeTab === tab.key
                ? 'text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            {tab.label}
            {activeTab === tab.key && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
            )}
          </button>
        ))}
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
          title={search ? '검색 결과가 없어요' : '아직 퀴즈가 없어요'}
          description={
            search
              ? '다른 키워드로 검색해보세요.'
              : isMine
                ? '첫 번째 퀴즈를 만들어보세요.'
                : '아직 이 카테고리에 퀴즈가 없습니다.'
          }
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {sets.map((qs) => (
            <QuizCard
              key={qs.set_id}
              id={qs.set_id}
              title={qs.title}
              questionCount={qs.question_count ?? 0}
              subject={qs.subject}
              grade={qs.grade}
              showActions={isMine}
              onClick={() => router.push(`/sets/${qs.set_id}/edit`)}
              onEdit={() => router.push(`/sets/${qs.set_id}/edit`)}
              onDuplicate={() => handleDuplicate(qs.set_id)}
              onGameOpen={() => router.push(`/sets/${qs.set_id}/deploy`)}
              onShare={isMine ? () => handleShare(qs) : undefined}
              onDelete={isMine ? () => handleDelete(qs.set_id) : undefined}
            />
          ))}
        </div>
      )}

      {/* 공유 다이얼로그 */}
      <PublishDialog
        open={publishOpen}
        onOpenChange={setPublishOpen}
        defaultTitle={publishTarget?.title ?? ''}
        onPublish={handlePublish}
      />
    </div>
  )
}
