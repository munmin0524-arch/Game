// S-11 학습 이력
// Phase S-5에서 구현 예정
'use client'

import { Clock } from 'lucide-react'

export default function LmsHistoryPage() {
  return (
    <div className="space-y-5">
      <h1 className="text-xl font-bold text-gray-900">학습 이력</h1>
      <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
          <Clock className="h-8 w-8 text-gray-400" />
        </div>
        <p className="mt-4 text-sm font-medium text-gray-500">학습 이력이 없습니다</p>
      </div>
    </div>
  )
}
