// (main) 라우트 그룹 레이아웃
// 역할: 메인 플로우 (빠른 게임 시작) — GNB 없음

'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, User, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const nickname = '홍길동' // TODO: AuthContext

  return (
    <div className="min-h-screen bg-white">
      {/* 슬림 상단 바 */}
      <header className="sticky top-0 z-50 flex h-14 items-center justify-between bg-white/80 backdrop-blur-md px-6 border-b border-gray-100">
        {/* 좌측: 뒤로가기 + 로고 */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Link href="/" className="flex items-baseline gap-1 select-none">
            <span className="text-sm font-black tracking-wide text-blue-600 uppercase">
              QUIZ PARTY
            </span>
          </Link>
        </div>

        {/* 우측: 계정 */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-1.5 rounded-full">
              <div className="h-7 w-7 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                <User className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="hidden sm:inline text-sm font-medium">{nickname}</span>
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

      <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
    </div>
  )
}
