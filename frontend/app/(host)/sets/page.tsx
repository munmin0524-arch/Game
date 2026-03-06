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
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { SetListItem } from '@/components/host/SetListItem'
import { EmptyState } from '@/components/common/EmptyState'
import { Skeleton } from '@/components/ui/skeleton'
import { useToast } from '@/components/ui/use-toast'
import { questionSetsApi } from '@/lib/api'
import type { QuestionSet } from '@/types'

const SUBJECTS = ['전체', '국어', '수학', '영어', '과학', '사회']
const GRADES = ['전체', '1학년', '2학년', '3학년']

export default function SetsPage() {
  const { toast } = useToast()
  const [sets, setSets] = useState<QuestionSet[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [subject, setSubject] = useState('전체')
  const [grade, setGrade] = useState('전체')

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
      toast({ title: '세트지 목록을 불러오지 못했습니다.', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }, [search, subject, grade, toast])

  useEffect(() => {
    const timer = setTimeout(fetchSets, 300) // 검색 디바운스
    return () => clearTimeout(timer)
  }, [fetchSets])

  const handleDuplicate = async (setId: string) => {
    try {
      await questionSetsApi.duplicate(setId)
      toast({ title: '세트지가 복제되었습니다.' })
      fetchSets()
    } catch {
      toast({ title: '복제에 실패했습니다.', variant: 'destructive' })
    }
  }

  const handleDelete = async (setId: string) => {
    try {
      await questionSetsApi.delete(setId)
      toast({ title: '세트지가 삭제되었습니다.' })
      setSets((prev) => prev.filter((s) => s.set_id !== setId))
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : ''
      // 배포 이력 있는 경우 서버에서 409 에러
      toast({
        title: msg.includes('deployed')
          ? '이미 배포된 세트지는 삭제할 수 없습니다.'
          : '삭제에 실패했습니다.',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">세트지 목록</h1>
        <Button asChild>
          <Link href="/sets/new/edit">
            <Plus className="mr-2 h-4 w-4" />
            새 세트지
          </Link>
        </Button>
      </div>

      {/* 검색 + 필터 */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="세트지 검색..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={subject} onValueChange={setSubject}>
          <SelectTrigger className="w-28">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SUBJECTS.map((s) => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={grade} onValueChange={setGrade}>
          <SelectTrigger className="w-28">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {GRADES.map((g) => (
              <SelectItem key={g} value={g}>{g}</SelectItem>
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
          title={search ? '검색 결과가 없어요' : '아직 세트지가 없어요'}
          description={search ? '다른 키워드로 검색해보세요.' : '첫 번째 세트지를 만들어보세요.'}
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
