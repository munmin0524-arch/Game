// GNB (Global Navigation Bar) — Host 전용
// (host)/layout.tsx에서 사용

'use client'

import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { ChevronDown, LogOut, User } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { PHASES, type Phase } from '@/lib/phase-data'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  {
    label: '퀴즈',
    href: '/sets',
    match: (p: string) =>
      p.startsWith('/sets') ||
      p.startsWith('/live'),
  },
  {
    label: '그룹 관리',
    href: '/groups',
    match: (p: string) => p.startsWith('/groups'),
  },
  {
    label: '퀴즈 광장',
    href: '/marketplace',
    match: (p: string) => p.startsWith('/marketplace'),
  },
  {
    label: '지난 게임',
    href: '/dashboard/history',
    match: (p: string) =>
      p.startsWith('/dashboard/history') ||
      p.startsWith('/sessions'),
  },
] as const

export function GNB() {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()

  // TODO: AuthContext에서 사용자 정보 가져오기
  const nickname = '홍길동'

  const handleLogout = () => {
    router.push('/login')
  }

  const showPhaseTabs = pathname.startsWith('/sets')
  const currentPhase = (searchParams.get('phase') as Phase | null) ?? 'mvp'

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-soft">
      {/* 메인 행 */}
      <div className="flex h-16 items-center justify-between px-6">
        {/* 로고 + 내비 */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex flex-col items-center leading-none select-none">
            <span className="text-[11px] font-black tracking-[0.35em] text-blue-300 uppercase">
              QUIZ
            </span>
            <span className="text-[22px] font-black tracking-wide text-blue-600 uppercase leading-none">
              PARTY
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1 rounded-full bg-gray-100/80 p-1">
            {NAV_ITEMS.map((item) => {
              const isActive = item.match(pathname)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'rounded-full px-4 py-1.5 text-sm font-medium transition-all',
                    isActive
                      ? 'bg-white text-blue-600 font-semibold shadow-sm'
                      : 'text-gray-500 hover:text-gray-800',
                  )}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* 계정 드롭다운 */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-1.5 rounded-full">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
              <span className="hidden sm:inline text-sm font-medium">{nickname}</span>
              <ChevronDown className="h-3 w-3 text-gray-400" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40 rounded-xl">
            <DropdownMenuItem onClick={() => router.push('/profile')}>
              프로필
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              로그아웃
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Phase 서브탭 — /sets 경로에서만 노출 (시연·보고용) */}
      {showPhaseTabs && (
        <div className="border-t border-gray-100 px-6">
          <nav className="flex items-center gap-1 py-2">
            <span className="text-[11px] font-semibold text-gray-400 mr-2 tracking-wider uppercase">
              Demo Phase
            </span>
            {PHASES.map((p) => {
              const active = currentPhase === p.key
              const params = new URLSearchParams(searchParams.toString())
              params.set('phase', p.key)
              return (
                <Link
                  key={p.key}
                  href={`/sets?${params.toString()}`}
                  className={cn(
                    'group inline-flex flex-col rounded-lg px-3 py-1 text-sm font-medium transition-all',
                    active
                      ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-200'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800',
                  )}
                >
                  <span className="leading-tight">{p.label}</span>
                  <span className={cn('text-[10px] leading-tight', active ? 'text-blue-500' : 'text-gray-400')}>
                    {p.sub}
                  </span>
                </Link>
              )
            })}
          </nav>
        </div>
      )}
    </header>
  )
}
