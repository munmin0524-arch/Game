'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Home, Gamepad2, Star, BarChart3, ClipboardList, ChevronDown, LogOut, User } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'

const NAV_ITEMS = [
  {
    label: '홈',
    href: '/student',
    icon: Home,
    match: (p: string) => p === '/student',
  },
  {
    label: '학습',
    href: '/student/learn',
    icon: Gamepad2,
    match: (p: string) =>
      p.startsWith('/student/learn') ||
      p.startsWith('/student/game-play') ||
      p.startsWith('/student/game-adaptive') ||
      p.startsWith('/student/game-result') ||
      p.startsWith('/student/wrong-notes'),
  },
  {
    label: '보상·꾸미기',
    href: '/student/rewards',
    icon: Star,
    match: (p: string) =>
      p.startsWith('/student/rewards') ||
      p.startsWith('/student/characters'),
  },
  {
    label: '학습이력',
    href: '/student/history',
    icon: ClipboardList,
    match: (p: string) =>
      p.startsWith('/student/history') ||
      p.startsWith('/student/lms'),
  },
  {
    label: '분석결과',
    href: '/student/my-result',
    icon: BarChart3,
    match: (p: string) =>
      p.startsWith('/student/my-result'),
  },
] as const

export function StudentNav() {
  const pathname = usePathname()
  const router = useRouter()

  // TODO: AuthContext에서 사용자 정보 가져오기
  const nickname = '김학생'

  return (
    <header className="sticky top-0 z-50 flex h-14 items-center justify-between bg-white/80 backdrop-blur-md px-6 shadow-soft">
      {/* 로고 + 내비 */}
      <div className="flex items-center gap-8">
        <Link href="/student" className="flex flex-col items-center leading-none select-none">
          <span className="text-[10px] font-black tracking-[0.35em] text-blue-300 uppercase">
            QUIZ
          </span>
          <span className="text-[18px] font-black tracking-wide text-blue-600 uppercase leading-none">
            PARTY
          </span>
        </Link>

        {/* 메인 내비 — pill 스타일 */}
        <nav className="flex items-center gap-1 rounded-full bg-gray-100/80 p-1">
          {NAV_ITEMS.map((item) => {
            const isActive = item.match(pathname)
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-all
                  ${isActive
                    ? 'bg-white text-blue-600 font-semibold shadow-sm'
                    : 'text-gray-500 hover:text-gray-800'
                  }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* 계정 */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="gap-1.5 rounded-full">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-medium">{nickname}</span>
            <ChevronDown className="h-3 w-3 text-gray-400" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40 rounded-xl">
          <DropdownMenuItem onClick={() => router.push('/student/history')}>
            학습이력
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-red-600 focus:text-red-600">
            <LogOut className="mr-2 h-4 w-4" />
            로그아웃
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
