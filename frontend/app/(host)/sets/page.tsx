// S-02 세트지 목록
// 스펙: docs/screens/phase1-live-core.md#s-02

'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
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
import { SetListItem } from '@/components/host/SetListItem'
import { EmptyState } from '@/components/common/EmptyState'
import { Skeleton } from '@/components/ui/skeleton'
import { useToast } from '@/components/ui/use-toast'
import { questionSetsApi } from '@/lib/api'
import { SUBJECT_OPTIONS, getGradeGroups } from '@/lib/filter-constants'
import type { QuestionSet } from '@/types'

export default function SetsPage() {
  const { toast } = useToast()
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
      toast({ title: '퀴즈 목록을 불러오지 못했습니다.', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }, [search, subject, grade, toast])

  useEffect(() => {
    const timer = setTimeout(fetchSets, 300) // 검색 디바운스
    return () => clearTimeout(timer)
  }, [fetchSets])

  const handleSubjectChange = (v: string) => {
    setSubject(v)
    setGrade('전체') // 과목 변경 시 학년 초기화
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

        {/* 과목 */}
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

        {/* 학년/학기 */}
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

      {/* 목록 */}
      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-lg" />
          ))}
        </div>
      ) : sets.length === 0 ? (
        <EmptyState
          title={search ? '검색 결과가 없어요' : '아직 퀴즈가 없어요'}
          description={search ? '다른 키워드로 검색해보세요.' : '첫 번째 퀴즈를 만들어보세요.'}
        />
      ) : (
        <div className="divide-y rounded-lg border bg-white">
          {sets.map((set) => (
            <SetListItem
              key={set.set_id}
              set={set}
              onDuplicate={() => handleDuplicate(set.set_id)}
              onDelete={() => handleDelete(set.set_id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
