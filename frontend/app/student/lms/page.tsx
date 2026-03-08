// S-11 학습 LMS — 학생 시점
// Phase S-5에서 구현 예정
'use client'

import { BarChart3, Clock, TrendingUp } from 'lucide-react'

export default function LmsPage() {
  return (
    <div className="space-y-5">
      <h1 className="text-xl font-bold text-gray-900">학습 현황</h1>

      <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
          <BarChart3 className="h-8 w-8 text-blue-400" />
        </div>
        <p className="mt-4 text-sm font-medium text-gray-500">
          학습 현황 대시보드가 준비 중이에요
        </p>
        <p className="mt-1 text-xs text-gray-400">
          학습 데이터가 쌓이면 여기서 확인할 수 있어요
        </p>
      </div>
    </div>
  )
}
