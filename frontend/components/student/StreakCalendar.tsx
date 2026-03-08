'use client'

import { useRouter } from 'next/navigation'
import { Flame, CalendarCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface StreakCalendarProps {
  current: number
  longest: number
  thisWeek: boolean[]
  monthlyAttendance?: boolean[]
}

const DAYS = ['월', '화', '수', '목', '금', '토', '일']

export function StreakCalendar({ current, longest, thisWeek, monthlyAttendance }: StreakCalendarProps) {
  const router = useRouter()

  // 이번달 정보
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDayOfWeek = (new Date(year, month, 1).getDay() + 6) % 7 // 월요일 기준

  const attendedCount = monthlyAttendance?.filter(Boolean).length ?? 0

  return (
    <div className="rounded-xl bg-white p-3 shadow-soft">
      {/* 스트릭 헤더 */}
      <div className="flex items-center gap-2 mb-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100">
          <Flame className="h-4 w-4 text-orange-500" />
        </div>
        <div>
          <p className="text-sm font-bold text-gray-900">
            {current}일 <span className="text-xs font-normal text-gray-500">연속 학습 중!</span>
          </p>
        </div>
        <span className="ml-auto text-[10px] text-gray-400">최장 {longest}일</span>
      </div>

      {/* 이번 주 달력 */}
      <div className="grid grid-cols-7 gap-1">
        {DAYS.map((day, i) => (
          <div key={day} className="flex flex-col items-center gap-0.5">
            <span className="text-[9px] text-gray-400">{day}</span>
            <div
              className={`flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold ${
                thisWeek[i]
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-300'
              }`}
            >
              {thisWeek[i] ? '✓' : ''}
            </div>
          </div>
        ))}
      </div>

      {/* 월간 출석 캘린더 */}
      {monthlyAttendance && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-semibold text-gray-600">
              {month + 1}월 출석
            </h4>
            <span className="text-[10px] text-gray-400">{attendedCount}/{daysInMonth}일</span>
          </div>

          {/* 요일 헤더 */}
          <div className="grid grid-cols-7 gap-px mb-0.5">
            {DAYS.map((d) => (
              <span key={d} className="text-center text-[8px] text-gray-400">{d}</span>
            ))}
          </div>

          {/* 날짜 그리드 */}
          <div className="grid grid-cols-7 gap-px">
            {/* 빈 칸 (월 시작 전) */}
            {Array.from({ length: firstDayOfWeek }).map((_, i) => (
              <div key={`empty-${i}`} className="h-5" />
            ))}
            {/* 날짜 */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const attended = monthlyAttendance[i] ?? false
              const isToday = i + 1 === now.getDate()
              return (
                <div
                  key={i}
                  className={`flex h-5 items-center justify-center rounded text-[8px] font-medium ${
                    attended
                      ? 'bg-orange-400 text-white'
                      : isToday
                        ? 'bg-blue-100 text-blue-600 ring-1 ring-blue-300'
                        : 'text-gray-300'
                  }`}
                >
                  {i + 1}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* 출석하러가기 */}
      <Button
        onClick={() => router.push('/student/games')}
        variant="outline"
        className="w-full mt-3 h-8 rounded-lg text-xs font-semibold border-orange-200 text-orange-600 hover:bg-orange-50"
      >
        <CalendarCheck className="mr-1.5 h-3.5 w-3.5" />
        출석하러 가기
      </Button>
    </div>
  )
}
