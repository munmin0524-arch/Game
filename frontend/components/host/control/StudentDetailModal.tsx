'use client'

import type { StudentMonitorData } from '@/types'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

const BADGE_EXPLAIN: Record<string, string> = {
  struggling: '연속 3문항 이상 오답',
  guessing: '응답 시간이 2초 미만 (찍기 의심)',
  star: '연속 3문항 이상 정답',
  slow: '시간 부족 상태에서 미응답',
}

interface StudentDetailModalProps {
  student: StudentMonitorData | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function StudentDetailModal({
  student,
  open,
  onOpenChange,
}: StudentDetailModalProps) {
  if (!student) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div
              className={cn(
                'flex h-10 w-10 items-center justify-center rounded-full text-base font-bold text-white',
                student.avatarColor,
              )}
            >
              {student.nickname.charAt(0)}
            </div>
            <div>
              <span className="text-lg">{student.nickname}</span>
              <p className="text-sm font-normal text-gray-500 mt-0.5">
                {student.score}점 / 정답률 {student.accuracy}% / 연속 {student.correctStreak}문항
              </p>
            </div>
          </DialogTitle>
        </DialogHeader>

        {/* 뱃지 설명 */}
        {student.badges.length > 0 && (
          <div className="space-y-1">
            {student.badges.map((badge) => (
              <div
                key={badge}
                className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2 text-sm"
              >
                <span className="font-semibold text-gray-700 capitalize">{badge}</span>
                <span className="text-gray-500">{BADGE_EXPLAIN[badge]}</span>
              </div>
            ))}
          </div>
        )}

        {/* 문항별 응답 내역 테이블 */}
        <div className="mt-2">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">문항별 응답 내역</h4>
          <div className="overflow-hidden rounded-lg border">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-600">
                  <th className="px-3 py-2 text-left font-medium">Q#</th>
                  <th className="px-3 py-2 text-left font-medium">문항</th>
                  <th className="px-3 py-2 text-center font-medium">답변</th>
                  <th className="px-3 py-2 text-center font-medium">결과</th>
                  <th className="px-3 py-2 text-right font-medium">시간</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {student.perQuestionResults.map((r) => (
                  <tr key={r.questionIndex} className="hover:bg-gray-50/50">
                    <td className="px-3 py-2 font-mono text-gray-500">
                      {r.questionIndex}
                    </td>
                    <td className="px-3 py-2 text-gray-700 max-w-[200px] truncate">
                      {r.questionContent}
                    </td>
                    <td className="px-3 py-2 text-center text-gray-600">
                      {r.isSkipped ? (
                        <span className="text-gray-400">-</span>
                      ) : (
                        r.selectedAnswer
                      )}
                    </td>
                    <td className="px-3 py-2 text-center">
                      {r.isSkipped ? (
                        <span className="text-gray-400 text-xs">건너뜀</span>
                      ) : r.isCorrect ? (
                        <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-green-600 text-xs font-bold">
                          O
                        </span>
                      ) : (
                        <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-100 text-red-600 text-xs font-bold">
                          X
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-2 text-right font-mono text-gray-500">
                      {r.responseTimeSec != null ? `${r.responseTimeSec}s` : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
