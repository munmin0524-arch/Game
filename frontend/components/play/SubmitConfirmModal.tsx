// SubmitConfirmModal — 과제 최종 제출 확인 팝업 (S-11)
// 미응답 문항 수를 표시하고 제출 여부를 최종 확인

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface SubmitConfirmModalProps {
  open: boolean
  unansweredCount: number
  submitting: boolean
  onCancel: () => void
  onConfirm: () => void
}

export function SubmitConfirmModal({
  open,
  unansweredCount,
  submitting,
  onCancel,
  onConfirm,
}: SubmitConfirmModalProps) {
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onCancel()}>
      <DialogContent className="sm:max-w-sm" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>과제를 제출할까요?</DialogTitle>
          <DialogDescription className="space-y-1 pt-1">
            <span className="block">• 제출 후에는 수정이 불가능합니다.</span>
            {unansweredCount > 0 && (
              <span className="block text-amber-600 font-medium">
                • 미응답 문항: {unansweredCount}개
              </span>
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex gap-2 sm:gap-2">
          <Button variant="outline" onClick={onCancel} disabled={submitting} className="flex-1">
            취소
          </Button>
          <Button onClick={onConfirm} disabled={submitting} className="flex-1">
            {submitting ? '제출 중...' : '제출하기'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
