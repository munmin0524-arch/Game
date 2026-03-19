// EntryHeader — 진입 화면 상단 바
// Google 스타일 앱 런처 패널 + 계정 드롭다운

'use client'

import { useRouter } from 'next/navigation'
import {
  LayoutGrid,
  User,
  LogOut,
  Rocket,
  PenSquare,
  FolderOpen,
  Users,
  Store,
  History,
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
    label: '퀴즈 시작하기',
    icon: Rocket,
    href: '/marketplace',
    color: 'bg-blue-500',
  },
  {
    label: '문제 만들기',
    icon: PenSquare,
    href: '/sets/new/edit',
    color: 'bg-violet-500',
  },
  {
    label: '내 퀴즈',
    icon: FolderOpen,
    href: '/sets',
    color: 'bg-emerald-500',
  },
  {
    label: '그룹 관리',
    icon: Users,
    href: '/groups',
    color: 'bg-amber-500',
  },
  {
    label: '퀴즈 광장',
    icon: Store,
    href: '/marketplace',
    color: 'bg-pink-500',
  },
  {
    label: '지난 게임',
    icon: History,
    href: '/dashboard/history',
    color: 'bg-slate-500',
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
