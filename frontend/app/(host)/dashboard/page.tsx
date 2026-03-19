// S-01 홈 대시보드
// 스펙: docs/screens/phase1-live-core.md#s-01

'use client'

import Link from 'next/link'
import {
  Rocket,
  PenSquare,
  FolderOpen,
  Users,
  Store,
  History,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const MENU_ITEMS = [
  {
    label: '퀴즈 시작하기',
    description: '퀴즈 광장에서 퀴즈를 골라 게임을 시작하세요',
    href: '/marketplace',
    icon: Rocket,
    gradient: 'from-blue-500 to-cyan-400',
    iconBg: 'bg-blue-100 text-blue-600',
    highlight: true,
  },
  {
    label: '문제 만들기',
    description: '새로운 퀴즈 세트를 직접 만들어보세요',
    href: '/sets/new/edit',
    icon: PenSquare,
    gradient: 'from-violet-500 to-purple-400',
    iconBg: 'bg-violet-100 text-violet-600',
  },
  {
    label: '내 퀴즈',
    description: '내가 만든 퀴즈를 관리하고 편집하세요',
    href: '/sets',
    icon: FolderOpen,
    gradient: 'from-emerald-500 to-teal-400',
    iconBg: 'bg-emerald-100 text-emerald-600',
  },
  {
    label: '그룹 관리',
    description: '학생 그룹을 만들고 관리하세요',
    href: '/groups',
    icon: Users,
    gradient: 'from-amber-500 to-orange-400',
    iconBg: 'bg-amber-100 text-amber-600',
  },
  {
    label: '퀴즈 광장',
    description: '다른 선생님이 공유한 퀴즈를 탐색하세요',
    href: '/marketplace',
    icon: Store,
    gradient: 'from-pink-500 to-rose-400',
    iconBg: 'bg-pink-100 text-pink-600',
  },
  {
    label: '지난 게임',
    description: '진행한 게임 기록과 리포트를 확인하세요',
    href: '/dashboard/history',
    icon: History,
    gradient: 'from-slate-500 to-gray-400',
    iconBg: 'bg-slate-100 text-slate-600',
  },
]

export default function DashboardPage() {
  return (
    <div className="space-y-10">
      {/* 관리 센터 배너 */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-700 to-slate-900 px-8 py-8 text-white shadow-card">
        <div className="relative z-10">
          <h1 className="text-2xl font-bold">관리 센터</h1>
          <p className="mt-2 text-slate-300 text-sm leading-relaxed">
            퀴즈를 관리하고, 게임 기록을 확인하세요.
          </p>
          <div className="mt-5">
            <Button size="lg" asChild className="bg-blue-600 text-white hover:bg-blue-700 shadow-md">
              <Link href="/marketplace">
                <Rocket className="mr-2 h-4 w-4" />
                퀴즈 시작하기
              </Link>
            </Button>
          </div>
        </div>
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/5" />
        <div className="absolute -right-4 top-16 h-24 w-24 rounded-full bg-white/5" />
      </div>

      {/* 메뉴 카드 그리드 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {MENU_ITEMS.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`group relative flex items-start gap-4 rounded-2xl bg-white p-5 shadow-soft hover:shadow-card transition-all hover:-translate-y-0.5 ${
                item.highlight ? 'ring-2 ring-blue-200' : ''
              }`}
            >
              <div className={`shrink-0 flex items-center justify-center w-11 h-11 rounded-xl ${item.iconBg}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-gray-900 text-sm group-hover:text-blue-600 transition-colors">
                  {item.label}
                </h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
              {item.highlight && (
                <span className="absolute top-3 right-3 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
                </span>
              )}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
