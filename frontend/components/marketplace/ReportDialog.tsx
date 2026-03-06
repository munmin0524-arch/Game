// ReportDialog — 신고 다이얼로그
// S-M03 세트지 상세에서 사용

'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import type { ReportReason } from '@/types'

interface ReportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onReport?: (reason: ReportReason, detail?: string) => void
}

const REASONS: { value: ReportReason; label: string }[] = [
  { value: 'inappropriate', label: '부적절한 내용' },
  { value: 'copyright', label: '저작권 침해' },
  { value: 'spam', label: '스팸/광고' },
  { value: 'other', label: '기타' },
]

export function ReportDialog({ open, onOpenChange, onReport }: ReportDialogProps) {
  const [reason, setReason] = useState<ReportReason | ''>('')
  const [detail, setDetail] = useState('')

  const handleSubmit = () => {
    if (!reason) return
    onReport?.(reason, detail || undefined)
    onOpenChange(false)
    setReason('')
    setDetail('')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>신고하기</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>신고 사유 <span className="text-red-500">*</span></Label>
            <RadioGroup value={reason} onValueChange={(v) => setReason(v as ReportReason)}>
              {REASONS.map((r) => (
                <div key={r.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={r.value} id={`reason-${r.value}`} />
                  <Label htmlFor={`reason-${r.value}`} className="font-normal cursor-pointer">
                    {r.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-1.5">
            <Label>상세 설명</Label>
            <Textarea
              value={detail}
              onChange={(e) => setDetail(e.target.value)}
              placeholder="추가 설명을 입력해주세요 (선택)"
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            취소
          </Button>
          <Button onClick={handleSubmit} disabled={!reason} variant="destructive">
            신고하기
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
