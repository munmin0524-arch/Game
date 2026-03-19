// EntryHeader — 진입 화면 상단 바
// Google 스타일 앱 런처 패널 + 계정 드롭다운

'use client'

import { useRouter } from 'next/navigation'
import {
  LayoutGrid,
  User,
  LogOut,
  FileText,
  History,
  BarChart3,
  Users,
  Share2,
  Settings,
  ArrowRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

// ─── 대시보드 메뉴 항목 ───

const DASHBOARD_ITEMS = [
  {
    label: '문제 만들기',
    desc: '새로운 퀴즈와 문항을 생성합니다',
    icon: FileText,
    href: '/sets',
    color: 'bg-amber-400',
  },
  {
    label: '학습 히스토리',
    desc: '지난 수업 기록을 확인합니다',
    icon: History,
    href: '/dashboard/history',
    color: 'bg-cyan-500',
  },
  {
    label: '게임 학습 통계',
    desc: '학생들의 성취도를 분석합니다',
    icon: BarChart3,
    href: '/dashboard/history',
    color: 'bg-purple-500',
  },
  {
    label: '그룹 / 파티 관리',
    desc: '클래스 및 소그룹을 설정합니다',
    icon: Users,
    href: '/groups',
    color: 'bg-green-500',
  },
  {
    label: '문항 공유',
    desc: '다른 교사와 리소스를 공유합니다',
    icon: Share2,
    href: '/marketplace',
    color: 'bg-orange-500',
  },
  {
    label: '설정',
    desc: '계정 정보 및 환경을 관리합니다',
    icon: Settings,
    href: '/profile',
    color: 'bg-purple-400',
  },
] as const

export function EntryHeader() {
  const router = useRouter()
  const nickname = '홍길동' // TODO: AuthContext

  return (
    <header className="absolute top-0 left-0 right-0 z-50 flex h-16 items-center justify-end gap-3 px-6">
      {/* 대시보드 앱 런처 */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-full hover:bg-gray-100"
            title="대시보드"
          >
            <LayoutGrid className="h-5 w-5 text-gray-600" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="end"
          className="w-[340px] rounded-2xl p-0 shadow-xl border-0"
          sideOffset={8}
        >
          {/* 메뉴 그리드 */}
          <div className="grid grid-cols-3 gap-1 p-3">
            {DASHBOARD_ITEMS.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.label}
                  onClick={() => router.push(item.href)}
                  className="flex flex-col items-center gap-2 rounded-xl p-3 hover:bg-gray-50 transition-colors"
                >
                  <div className={`h-11 w-11 rounded-full ${item.color} flex items-center justify-center`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-[11px] font-medium text-gray-700 text-center leading-tight">
                    {item.label}
                  </span>
                </button>
              )
            })}
          </div>

          {/* 전체 보기 */}
          <div className="border-t px-3 py-2.5">
            <button
              onClick={() => router.push('/dashboard')}
              className="flex items-center justify-center gap-1.5 w-full rounded-lg py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 transition-colors"
            >
              전체 보기
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </PopoverContent>
      </Popover>

      {/* 계정 드롭다운 */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="gap-1.5 rounded-full hover:bg-gray-100">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </div>
            <span className="hidden sm:inline text-sm font-medium text-gray-700">{nickname}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40 rounded-xl">
          <DropdownMenuItem onClick={() => router.push('/profile')}>
            프로필
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => router.push('/login')}
            className="text-red-600 focus:text-red-600"
          >
            <LogOut className="mr-2 h-4 w-4" />
            로그아웃
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
