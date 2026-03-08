// S-11 분석 리포트
// Phase S-5에서 구현 예정
'use client'

import { TrendingUp } from 'lucide-react'

export default function LmsAnalysisPage() {
  return (
    <div className="space-y-5">
      <h1 className="text-xl font-bold text-gray-900">분석 리포트</h1>
      <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
          <TrendingUp className="h-8 w-8 text-gray-400" />
        </div>
        <p className="mt-4 text-sm font-medium text-gray-500">분석 데이터가 준비 중이에요</p>
      </div>
    </div>
  )
}
