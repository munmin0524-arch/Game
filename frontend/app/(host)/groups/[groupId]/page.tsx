// S-14 그룹 상세
// 스펙: docs/screens/phase3-group-report.md#s-14

'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { formatDistanceToNow } from 'date-fns'
import { ko } from 'date-fns/locale'
import { BarChart2, Copy, Trash2, UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/components/ui/use-toast'
import { EmptyState } from '@/components/common/EmptyState'
import type { Group, GroupMember } from '@/types'

type MemberFilter = 'all' | 'member' | 'guest'

const SESSION_STATUS_LABEL: Record<string, string> = {
  waiting: '대기 중',
  in_progress: '진행 중',
  completed: '완료',
  paused: '일시정지',
  cancelled: '취소됨',
}

export default function GroupDetailPage() {
  const { groupId } = useParams<{ groupId: string }>()
  const router = useRouter()
  const { toast } = useToast()

  const [group, setGroup] = useState<Group | null>(null)
  const [members, setMembers] = useState<GroupMember[]>([])
  const [loading, setLoading] = useState(true)

  const [inviteEmail, setInviteEmail] = useState('')
  const [inviting, setInviting] = useState(false)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<MemberFilter>('all')
  const [removeTarget, setRemoveTarget] = useState<GroupMember | null>(null)

  const isAuto = group?.type === 'auto_live'

  useEffect(() => {
    Promise.all([
      fetch(`/api/groups/${groupId}`).then((r) => r.json()),
      fetch(`/api/groups/${groupId}/members`).then((r) => r.json()),
    ])
      .then(([g, m]) => {
        setGroup(g)
        setMembers(m)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [groupId])

  const handleInvite = async () => {
    if (!inviteEmail.trim()) return
    setInviting(true)
    try {
      const res = await fetch(`/api/groups/${groupId}/invite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: inviteEmail.trim() }),
      })
      if (res.status === 409) {
        toast({ title: '이미 그룹에 속한 멤버입니다.', variant: 'destructive' })
        return
      }
      if (!res.ok) throw new Error()
      toast({ title: '초대 이메일이 발송되었습니다.' })
      setInviteEmail('')
    } catch {
      toast({ title: '초대에 실패했습니다.', variant: 'destructive' })
    } finally {
      setInviting(false)
    }
  }

  const handleCopyGuestLink = async () => {
    try {
      const res = await fetch(`/api/groups/${groupId}/guest-link`)
      const { link } = await res.json()
      await navigator.clipboard.writeText(link)
      toast({ title: '게스트 초대 링크가 복사되었습니다.' })
    } catch {
      toast({ title: '링크 복사에 실패했습니다.', variant: 'destructive' })
    }
  }

  const handleRemove = async () => {
    if (!removeTarget) return
    try {
      const memberId = removeTarget.member_id ?? removeTarget.guest_id
      await fetch(`/api/groups/${groupId}/members/${memberId}`, { method: 'DELETE' })
      setMembers((prev) => prev.filter((m) => m.group_member_id !== removeTarget.group_member_id))
      toast({ title: '멤버가 제거되었습니다.' })
    } catch {
      toast({ title: '멤버 제거에 실패했습니다.', variant: 'destructive' })
    } finally {
      setRemoveTarget(null)
    }
  }

  const filtered = members.filter((m) => {
    const matchSearch = search
      ? m.nickname?.toLowerCase().includes(search.toLowerCase()) ||
        m.email?.toLowerCase().includes(search.toLowerCase())
      : true
    const matchFilter = filter === 'all' ? true : m.participant_type === filter
    return matchSearch && matchFilter && !m.removed_at
  })

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <button
            className="text-sm text-gray-500 hover:text-gray-700 mb-1"
            onClick={() => router.push('/groups')}
          >
            ← 그룹 목록
          </button>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">
              {group?.name ?? '로딩 중...'}
              <span className="ml-2 text-base font-normal text-gray-400">
                ({group?.member_count ?? 0}명)
              </span>
            </h1>
            {group && (
              <Badge
                variant="secondary"
                className={`rounded-full text-[11px] px-2 py-0 ${
                  isAuto
                    ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                    : 'bg-blue-50 text-blue-600 border-blue-200'
                }`}
              >
                {isAuto ? '자동 생성' : '직접 생성'}
              </Badge>
            )}
          </div>
        </div>
        {!isAuto && (
          <Button onClick={() => router.push(`/sets/new/deploy?groupId=${groupId}`)}>
            이 그룹에 배포 →
          </Button>
        )}
      </div>

      {/* 연결된 세션 카드 (auto_live 전용) */}
      {isAuto && group?.session_id && (
        <div className="rounded-2xl bg-white px-6 py-5 shadow-soft">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">연결된 세션</p>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-800">{group.session_title}</p>
              <p className="text-sm text-gray-500 mt-0.5">
                {group.session_type === 'live' ? '라이브' : '과제'}
                {' · '}
                {SESSION_STATUS_LABEL[group.session_status ?? ''] ?? group.session_status}
                {' · '}
                {group.member_count ?? 0}명 참여
                {' · '}
                {formatDistanceToNow(new Date(group.created_at), { addSuffix: true, locale: ko })}
              </p>
            </div>
            {group.session_status === 'completed' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push(`/sessions/${group.session_id}/report/questions`)}
              >
                <BarChart2 className="mr-1 h-4 w-4" />
                리포트 보기 →
              </Button>
            )}
            {group.session_status === 'in_progress' && (
              <Button
                size="sm"
                onClick={() => router.push(`/live/${group.session_id}/control`)}
                className="bg-green-600 hover:bg-green-700"
              >
                컨트롤 패널 →
              </Button>
            )}
          </div>
        </div>
      )}

      {/* 멤버 초대 (manual 전용) */}
      {!isAuto && (
        <div className="rounded-2xl bg-white p-5 shadow-soft space-y-3">
          <p className="text-sm font-semibold text-gray-600">멤버 초대 (이메일)</p>
          <div className="flex gap-2">
            <Input
              type="email"
              placeholder="member@example.com"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleInvite()}
              className="flex-1"
            />
            <Button onClick={handleInvite} disabled={inviting || !inviteEmail.trim()}>
              <UserPlus className="mr-1 h-4 w-4" />
              {inviting ? '발송 중...' : '초대'}
            </Button>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-dashed px-3 py-2">
            <p className="text-sm text-gray-500">게스트 초대 링크 (수동 발송)</p>
            <Button variant="ghost" size="sm" onClick={handleCopyGuestLink}>
              <Copy className="mr-1 h-3.5 w-3.5" />
              링크 복사
            </Button>
          </div>
        </div>
      )}

      {/* auto_live 안내 */}
      {isAuto && (
        <div className="rounded-2xl bg-emerald-50 px-5 py-3 text-sm text-emerald-700">
          QR 배포로 자동 생성된 그룹입니다. 참여자 목록은 읽기 전용입니다.
        </div>
      )}

      {/* 필터 + 검색 */}
      <div className="flex items-center gap-3">
        <p className="text-sm font-semibold text-gray-600">참여자 목록</p>
        <div className="flex-1" />
        <Select value={filter} onValueChange={(v) => setFilter(v as MemberFilter)}>
          <SelectTrigger className="w-28">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체</SelectItem>
            <SelectItem value="member">Member</SelectItem>
            <SelectItem value="guest">Guest</SelectItem>
          </SelectContent>
        </Select>
        <Input
          placeholder="이름·이메일 검색..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
      </div>

      {/* 멤버 목록 */}
      {loading ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-14 rounded-2xl bg-white animate-pulse shadow-soft" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon="👥"
          title={search ? '검색 결과가 없어요' : '아직 참여자가 없어요'}
          description={search ? undefined : isAuto ? '세션이 시작되면 참여자가 자동으로 추가됩니다.' : '위에서 이메일로 멤버를 초대해 보세요.'}
        />
      ) : (
        <div className="space-y-1 rounded-2xl overflow-hidden bg-white shadow-soft">
          {filtered.map((m) => (
            <div
              key={m.group_member_id}
              className="flex items-center gap-3 px-5 py-3 border-b border-gray-100 last:border-0 hover:bg-gray-50"
            >
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-800 truncate">
                  {m.nickname ?? m.email ?? '-'}
                </p>
                {m.email && (
                  <p className="text-xs text-gray-400">{m.email}</p>
                )}
              </div>
              <Badge
                variant="secondary"
                className={`rounded-full text-[11px] px-2 py-0 ${
                  m.participant_type === 'member'
                    ? 'bg-blue-50 text-blue-600'
                    : 'bg-gray-100 text-gray-500'
                }`}
              >
                {m.participant_type === 'member' ? 'Member' : 'Guest'}
              </Badge>
              <span className="text-xs text-gray-400 hidden sm:block">
                {formatDistanceToNow(new Date(m.joined_at), { addSuffix: true, locale: ko })}
              </span>
              {!isAuto && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-gray-400 hover:text-red-500"
                  onClick={() => setRemoveTarget(m)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* 멤버 제거 확인 */}
      <AlertDialog open={!!removeTarget} onOpenChange={(o) => !o && setRemoveTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>멤버를 제거할까요?</AlertDialogTitle>
            <AlertDialogDescription>
              <strong>{removeTarget?.nickname ?? removeTarget?.email}</strong>을(를) 그룹에서
              제거합니다.
              <br />
              기존 세션 데이터는 유지됩니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={handleRemove} className="bg-red-600 hover:bg-red-700">
              제거
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
