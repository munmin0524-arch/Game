// S-13 그룹 목록
// 스펙: docs/screens/phase3-group-report.md#s-13

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { formatDistanceToNow } from 'date-fns'
import { ko } from 'date-fns/locale'
import { Users, MoreHorizontal, Plus, Zap, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Skeleton } from '@/components/ui/skeleton'
import { useToast } from '@/components/ui/use-toast'
import { EmptyState } from '@/components/common/EmptyState'
import { groupsApi, questionSetsApi } from '@/lib/api'
import type { Group, GroupType, QuestionSet } from '@/types'

type TabFilter = 'all' | GroupType

const SESSION_STATUS_LABEL: Record<string, string> = {
  waiting: '대기 중',
  in_progress: '진행 중',
  completed: '완료',
  paused: '일시정지',
  cancelled: '취소됨',
}

export default function GroupsPage() {
  const router = useRouter()
  const { toast } = useToast()

  const [groups, setGroups] = useState<Group[]>([])
  const [loading, setLoading] = useState(true)
  const [createOpen, setCreateOpen] = useState(false)
  const [newGroupName, setNewGroupName] = useState('')
  const [creating, setCreating] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Group | null>(null)
  const [tab, setTab] = useState<TabFilter>('all')

  // 세트 선택 Dialog
  const [selectSetGroupId, setSelectSetGroupId] = useState<string | null>(null)
  const [sets, setSets] = useState<QuestionSet[]>([])
  const [setsLoading, setSetsLoading] = useState(false)
  const [setSearch, setSetSearch] = useState('')

  useEffect(() => {
    groupsApi
      .list()
      .then(setGroups)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  // 세트 선택 Dialog 열릴 때 세트 목록 로드
  useEffect(() => {
    if (!selectSetGroupId) return
    setSetsLoading(true)
    questionSetsApi
      .list({ limit: 50, sort: 'updated_at' })
      .then((res) => setSets(res.data))
      .catch(console.error)
      .finally(() => setSetsLoading(false))
  }, [selectSetGroupId])

  const filteredSets = setSearch.trim()
    ? sets.filter((s) => s.title.toLowerCase().includes(setSearch.toLowerCase()))
    : sets

  const filteredGroups = tab === 'all' ? groups : groups.filter((g) => g.type === tab)

  const handleCreate = async () => {
    if (!newGroupName.trim()) {
      toast({ title: '그룹 이름을 입력해 주세요.', variant: 'destructive' })
      return
    }
    setCreating(true)
    try {
      const group = await groupsApi.create(newGroupName.trim())
      setGroups((prev) => [group, ...prev])
      setCreateOpen(false)
      setNewGroupName('')
      toast({ title: '그룹이 생성되었습니다.' })
    } catch {
      toast({ title: '그룹 생성에 실패했습니다.', variant: 'destructive' })
    } finally {
      setCreating(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await groupsApi.delete(deleteTarget.group_id)
      setGroups((prev) => prev.filter((g) => g.group_id !== deleteTarget.group_id))
      toast({ title: '그룹이 삭제되었습니다.' })
    } catch {
      toast({ title: '그룹 삭제에 실패했습니다.', variant: 'destructive' })
    } finally {
      setDeleteTarget(null)
    }
  }

  const tabs: { key: TabFilter; label: string }[] = [
    { key: 'all', label: '전체' },
    { key: 'manual', label: '직접 생성' },
    { key: 'auto_live', label: '자동 생성' },
  ]

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">그룹 목록</h1>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              새 그룹 만들기
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-sm">
            <DialogHeader>
              <DialogTitle>새 그룹 만들기</DialogTitle>
            </DialogHeader>
            <div className="space-y-2 py-2">
              <Label htmlFor="group-name">그룹 이름</Label>
              <Input
                id="group-name"
                placeholder="예: 1학년 A반"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
              />
            </div>
            <DialogFooter>
              <Button onClick={handleCreate} disabled={creating} className="w-full">
                {creating ? '생성 중...' : '만들기'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* 탭 필터 */}
      <div className="flex items-center gap-1 rounded-full bg-gray-100/80 p-1 w-fit">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all
              ${tab === t.key
                ? 'bg-white text-blue-600 font-semibold shadow-sm'
                : 'text-gray-500 hover:text-gray-800'
              }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* 목록 */}
      {loading ? (
        <div className="space-y-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-16 rounded-2xl bg-white animate-pulse shadow-soft" />
          ))}
        </div>
      ) : filteredGroups.length === 0 ? (
        <EmptyState
          icon="👥"
          title={tab === 'all' ? '아직 만든 그룹이 없어요' : tab === 'manual' ? '직접 만든 그룹이 없어요' : '자동 생성된 그룹이 없어요'}
          description={tab === 'auto_live' ? 'QR 공개로 게임을 시작하면 자동으로 그룹이 생성됩니다.' : '그룹을 만들면 멤버를 초대하거나 게임 대상으로 지정할 수 있습니다.'}
          action={tab !== 'auto_live' ? { label: '첫 그룹 만들기', onClick: () => setCreateOpen(true) } : undefined}
        />
      ) : (
        <div className="space-y-2">
          {filteredGroups.map((group) => {
            const isAuto = group.type === 'auto_live'
            return (
              <div
                key={group.group_id}
                className="flex items-center gap-3 rounded-2xl bg-white px-5 py-4 shadow-soft hover:shadow-card transition-all cursor-pointer"
                onClick={() => router.push(`/groups/${group.group_id}`)}
              >
                <div className={`flex h-10 w-10 items-center justify-center rounded-full shrink-0 ${isAuto ? 'bg-emerald-100' : 'bg-blue-100'}`}>
                  <Users className={`h-5 w-5 ${isAuto ? 'text-emerald-500' : 'text-blue-500'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-gray-800 truncate">{group.name}</p>
                    <Badge
                      variant="secondary"
                      className={`rounded-full text-[11px] px-2 py-0 shrink-0 ${
                        isAuto
                          ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                          : 'bg-blue-50 text-blue-600 border-blue-200'
                      }`}
                    >
                      {isAuto ? '자동 생성' : '직접 생성'}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-400 mt-0.5">
                    {group.member_count ?? 0}명
                    {isAuto && group.session_title && (
                      <>
                        {' · '}
                        {group.session_type === 'live' ? '라이브' : '과제'}{' '}
                        {SESSION_STATUS_LABEL[group.session_status ?? ''] ?? ''}
                      </>
                    )}
                    {' · '}
                    {formatDistanceToNow(new Date(group.created_at), {
                      addSuffix: true,
                      locale: ko,
                    })}
                  </p>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 shrink-0"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => router.push(`/groups/${group.group_id}`)}>
                      상세 보기
                    </DropdownMenuItem>
                    {!isAuto && (
                      <DropdownMenuItem
                        onClick={() => setSelectSetGroupId(group.group_id)}
                      >
                        <Zap className="mr-2 h-4 w-4" />
                        이 그룹에 게임 열기
                      </DropdownMenuItem>
                    )}
                    {isAuto && group.session_status === 'completed' && group.session_id && (
                      <DropdownMenuItem
                        onClick={() =>
                          router.push(`/sessions/${group.session_id}/report/questions`)
                        }
                      >
                        리포트 보기
                      </DropdownMenuItem>
                    )}
                    {!isAuto && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-600 focus:text-red-600"
                          onClick={() => setDeleteTarget(group)}
                        >
                          삭제
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )
          })}
        </div>
      )}

      {/* 세트 선택 Dialog */}
      <Dialog open={!!selectSetGroupId} onOpenChange={(o) => { if (!o) { setSelectSetGroupId(null); setSetSearch('') } }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>퀴즈 세트 선택</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="세트 검색..."
                value={setSearch}
                onChange={(e) => setSetSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="max-h-64 overflow-y-auto space-y-1">
              {setsLoading ? (
                [...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-12 rounded-lg" />
                ))
              ) : filteredSets.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-6">세트가 없습니다.</p>
              ) : (
                filteredSets.map((s) => (
                  <button
                    key={s.set_id}
                    className="w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-left hover:bg-gray-50 transition-colors"
                    onClick={() => {
                      router.push(`/sets/${s.set_id}/deploy?groupId=${selectSetGroupId}`)
                      setSelectSetGroupId(null)
                      setSetSearch('')
                    }}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{s.title}</p>
                      <p className="text-xs text-gray-400">
                        {s.question_count ?? 0}문항
                        {s.subject && ` · ${s.subject}`}
                        {s.grade && ` · ${s.grade}`}
                      </p>
                    </div>
                    <Zap className="h-4 w-4 text-gray-300 shrink-0" />
                  </button>
                ))
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* 삭제 확인 Dialog */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>그룹을 삭제할까요?</AlertDialogTitle>
            <AlertDialogDescription>
              <strong>{deleteTarget?.name}</strong> 그룹을 삭제합니다.
              <br />
              기존 세션 데이터는 유지됩니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
