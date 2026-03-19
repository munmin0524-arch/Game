// S-04 / S-09 배포 설정 (라이브 + 과제)
// 스펙: docs/screens/phase1-live-core.md#s-04
//       docs/screens/phase2-assignment.md#s-09

'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { Rocket, Copy, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/components/ui/use-toast'
import { groupsApi, sessionsApi } from '@/lib/api'
import type { Group, DeployFormValues, AnswerReveal, GameMode } from '@/types'
import { GAME_MODES, MODE_TYPE_COLORS } from '@/lib/game-constants'

export default function DeployPage() {
  const { setId } = useParams<{ setId: string }>()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  const presetGroupId = searchParams.get('groupId') ?? undefined

  const [groups, setGroups] = useState<Group[]>([])
  const [deploying, setDeploying] = useState(false)
  const [noDeadline, setNoDeadline] = useState(false)

  const [form, setForm] = useState<DeployFormValues>({
    session_type: 'live',
    game_mode: 'tug_of_war',
    deploy_type: presetGroupId ? 'existing_group' : 'public_qr',
    time_limit_per_q: 20,
    allow_retry: false,
    allow_hint: false,
    group_id: presetGroupId,
    new_group_name: '',
    // 과제 전용
    open_at: undefined,
    close_at: undefined,
    answer_reveal: 'on_submit',
  })

  useEffect(() => {
    groupsApi.list().then(setGroups).catch(console.error)
  }, [])

  const handleDeploy = async () => {
    // 공통 유효성
    if (form.time_limit_per_q < 1) {
      toast({ title: '제한 시간은 1초 이상이어야 합니다.', variant: 'destructive' })
      return
    }
    if (form.deploy_type === 'existing_group' && !form.group_id) {
      toast({ title: '그룹을 선택해 주세요.', variant: 'destructive' })
      return
    }
    if (form.deploy_type === 'new_group' && !form.new_group_name?.trim()) {
      toast({ title: '그룹 이름을 입력해 주세요.', variant: 'destructive' })
      return
    }

    // 과제 유효성
    if (form.session_type === 'assignment' && !noDeadline) {
      if (!form.open_at || !form.close_at) {
        toast({ title: '오픈 기간을 설정해 주세요.', variant: 'destructive' })
        return
      }
      if (new Date(form.close_at) <= new Date(form.open_at)) {
        toast({ title: '마감일이 시작일보다 빠릅니다.', variant: 'destructive' })
        return
      }
      if (new Date(form.close_at) < new Date()) {
        toast({ title: '마감일이 이미 지났습니다.', variant: 'destructive' })
        return
      }
    }

    // 그룹 멤버 0명 경고 (continue 허용)
    if (form.deploy_type === 'existing_group' && form.group_id) {
      const group = groups.find((g) => g.group_id === form.group_id)
      if (group?.member_count === 0) {
        toast({ title: '그룹에 멤버가 없습니다. 게스트도 QR로 입장할 수 있습니다.' })
      }
    }

    setDeploying(true)
    try {
      const payload: DeployFormValues = {
        ...form,
        close_at: noDeadline ? undefined : form.close_at,
      }
      const session = await sessionsApi.create(setId, payload)

      if (form.session_type === 'live') {
        router.push(`/live/${session.session_id}/waiting`)
      } else {
        toast({ title: '과제가 생성되었습니다.' })
        router.push('/dashboard')
      }
    } catch {
      toast({ title: '생성에 실패했습니다.', variant: 'destructive' })
    } finally {
      setDeploying(false)
    }
  }

  const handleCopyGuestLink = () => {
    // TODO: 실제 배포 후 sessionId가 있어야 하지만, 여기서는 preview 용도
    const link = `${window.location.origin}/play/[sessionId]`
    navigator.clipboard.writeText(link)
    toast({ title: '게스트 초대 링크가 복사되었습니다.' })
  }

  const isAssignment = form.session_type === 'assignment'
  const showEmailBanner =
    isAssignment &&
    form.deploy_type === 'existing_group' &&
    form.group_id &&
    (groups.find((g) => g.group_id === form.group_id)?.member_count ?? 0) > 0

  return (
    <div className="max-w-lg mx-auto space-y-8">
      <h1 className="text-2xl font-bold">게임 배포하기</h1>

      {/* 배포 유형 */}
      <section className="space-y-3">
        <Label className="text-base font-semibold">진행 방식</Label>
        <RadioGroup
          value={form.session_type}
          onValueChange={(v) =>
            setForm({ ...form, session_type: v as 'live' | 'assignment' })
          }
          className="flex gap-6"
        >
          <div className="flex items-center gap-2">
            <RadioGroupItem value="live" id="live" />
            <Label htmlFor="live">라이브</Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="assignment" id="assignment" />
            <Label htmlFor="assignment">과제</Label>
          </div>
        </RadioGroup>
      </section>

      {/* 게임 유형 선택 */}
      <section className="space-y-4 rounded-lg border p-4">
        <p className="font-semibold text-sm text-gray-500">게임 유형</p>
        <div className="grid grid-cols-2 gap-2">
          {GAME_MODES.map((mode) => {
            const isSelected = form.game_mode === mode.value
            return (
              <button
                key={mode.value}
                onClick={() => setForm({ ...form, game_mode: mode.value })}
                className={`flex flex-col items-start gap-1.5 rounded-xl border-2 p-3 text-left transition-all
                  ${isSelected
                    ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-200'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
              >
                <div className="flex items-center gap-2 w-full">
                  <span className={`text-sm font-bold ${isSelected ? 'text-blue-700' : 'text-gray-800'}`}>
                    {mode.label}
                  </span>
                  <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${MODE_TYPE_COLORS[mode.type]}`}>
                    {mode.type}
                  </span>
                </div>
                <span className="text-xs text-gray-500">{mode.desc}</span>
              </button>
            )
          })}
        </div>
      </section>

      {/* 과제 전용 설정 */}
      {isAssignment && (
        <section className="space-y-4 rounded-lg border p-4">
          <p className="font-semibold text-sm text-gray-500">과제 설정</p>

          {/* 오픈 기간 */}
          <div className="space-y-2">
            <Label>오픈 기간</Label>
            <div className="flex items-center gap-2">
              <Input
                type="datetime-local"
                className="flex-1"
                value={form.open_at ?? ''}
                onChange={(e) => setForm({ ...form, open_at: e.target.value })}
              />
              <span className="text-gray-400">~</span>
              <Input
                type="datetime-local"
                className="flex-1"
                value={form.close_at ?? ''}
                onChange={(e) => setForm({ ...form, close_at: e.target.value })}
                disabled={noDeadline}
              />
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="no-deadline"
                checked={noDeadline}
                onCheckedChange={(v) => {
                  setNoDeadline(!!v)
                  if (v) setForm({ ...form, close_at: undefined })
                }}
              />
              <Label htmlFor="no-deadline" className="text-sm text-gray-500 cursor-pointer">
                무기한 (마감일 없음)
              </Label>
            </div>
          </div>

        </section>
      )}

      {/* 배포 대상 */}
      <section className="space-y-4 rounded-lg border p-4">
        <p className="font-semibold text-sm text-gray-500">참여 대상</p>

        <RadioGroup
          value={form.deploy_type}
          onValueChange={(v) =>
            setForm({ ...form, deploy_type: v as DeployFormValues['deploy_type'] })
          }
          className="space-y-3"
        >
          <div className="flex items-center gap-2">
            <RadioGroupItem value="public_qr" id="public_qr" />
            <Label htmlFor="public_qr">QR 공개 (누구나 참여)</Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="existing_group" id="existing_group" />
            <Label htmlFor="existing_group">기존 그룹 선택</Label>
          </div>
          {form.deploy_type === 'existing_group' && (
            <Select
              value={form.group_id}
              onValueChange={(v) => setForm({ ...form, group_id: v })}
            >
              <SelectTrigger className="ml-6">
                <SelectValue placeholder="그룹 선택..." />
              </SelectTrigger>
              <SelectContent>
                {groups.map((g) => (
                  <SelectItem key={g.group_id} value={g.group_id}>
                    {g.name} ({g.member_count ?? 0}명)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </RadioGroup>

        {/* 과제: 그룹 선택 시 이메일 발송 안내 */}
        {showEmailBanner && (
          <div className="flex items-start gap-2 rounded-lg bg-blue-50 px-3 py-2.5 text-sm text-blue-700">
            <Info className="h-4 w-4 mt-0.5 shrink-0" />
            <span>그룹 내 멤버에게 과제 안내 이메일이 자동 발송됩니다.</span>
          </div>
        )}

        {/* 과제: 게스트 링크 복사 */}
        {isAssignment && (
          <div className="flex items-center justify-between rounded-lg border border-dashed px-3 py-2.5">
            <p className="text-sm text-gray-600">참여 링크 (직접 공유용)</p>
            <Button variant="outline" size="sm" onClick={handleCopyGuestLink}>
              <Copy className="mr-1 h-3.5 w-3.5" />
              링크 복사
            </Button>
          </div>
        )}
      </section>

      {/* 배포 버튼 */}
      <Button size="lg" className="w-full" onClick={handleDeploy} disabled={deploying}>
        <Rocket className="mr-2 h-5 w-5" />
        {deploying
          ? '준비 중...'
          : isAssignment
          ? '과제 보내기'
          : '게임 열기 →'}
      </Button>
    </div>
  )
}
