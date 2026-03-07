// S-M04: 내가 공유한 세트지 관리
// /marketplace/my

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Heart, Download, MoreVertical, Eye, EyeOff, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { SharedSet } from '@/types'

export default function MySharedSetsPage() {
  const router = useRouter()
  const [sets, setSets] = useState<SharedSet[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/marketplace/my')
      .then((res) => res.json())
      .then((data) => setSets(data))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-6 py-8">
      {/* 헤더 */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => router.push('/marketplace')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold text-gray-900">내가 공유한 퀴즈</h1>
      </div>

      {/* 목록 */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-20 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : sets.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg font-medium">공유한 퀴즈가 없습니다</p>
          <p className="text-sm mt-1">내 퀴즈에서 &quot;퀴즈 광장에 공유&quot;를 눌러보세요.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sets.map((s) => (
            <div
              key={s.shared_set_id}
              className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100 hover:border-gray-200 transition-colors"
            >
              <div
                className="flex-1 min-w-0 cursor-pointer"
                onClick={() => router.push(`/marketplace/${s.shared_set_id}`)}
              >
                <p className="font-medium text-gray-900 truncate">{s.title}</p>
                <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                  <span>{s.question_count}문항</span>
                  <span className="flex items-center gap-0.5">
                    <Heart className="h-3 w-3" />
                    {s.like_count}
                  </span>
                  <span className="flex items-center gap-0.5">
                    <Download className="h-3 w-3" />
                    {s.download_count}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant={s.status === 'published' ? 'default' : 'secondary'}
                  className="text-xs"
                >
                  {s.status === 'published' ? '게시 중' : s.status === 'hidden' ? '숨김' : '관리자 제거'}
                </Badge>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      {s.status === 'published' ? (
                        <>
                          <EyeOff className="mr-2 h-4 w-4" />
                          숨기기
                        </>
                      ) : (
                        <>
                          <Eye className="mr-2 h-4 w-4" />
                          다시 공개
                        </>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600 focus:text-red-600">
                      <Trash2 className="mr-2 h-4 w-4" />
                      공유 해제
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
