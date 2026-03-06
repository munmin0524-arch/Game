// SetListItem — 세트지 목록 행 컴포넌트 (S-02)

'use client'

import { useRouter } from 'next/navigation'
import { formatDistanceToNow } from 'date-fns'
import { ko } from 'date-fns/locale'
import { MoreHorizontal, Edit, Copy, Zap, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { QuestionSet } from '@/types'

interface SetListItemProps {
  questionSet?: QuestionSet
  set?: QuestionSet           // sets/page.tsx가 set={set}으로 넘기는 경우 대응
  onDuplicate: (setId: string) => void
  onDelete: (setId: string) => void
}

export function SetListItem({ questionSet, set, onDuplicate, onDelete }: SetListItemProps) {
  const qs = questionSet ?? set!
  const router = useRouter()
  const updatedAgo = formatDistanceToNow(new Date(qs.updated_at), {
    addSuffix: true,
    locale: ko,
  })

  return (
    <div className="flex items-center gap-3 rounded-lg border bg-white px-4 py-3 hover:bg-gray-50 transition-colors">
      {/* 세트지명 */}
      <div
        className="flex-1 min-w-0 cursor-pointer"
        onClick={() => router.push(`/sets/${qs.set_id}/edit`)}
      >
        <p className="font-medium text-gray-800 truncate">{qs.title}</p>
        {qs.subject && (
          <p className="text-xs text-gray-400 mt-0.5">{qs.subject}</p>
        )}
      </div>

      {/* 문항 수 */}
      <span className="text-sm text-gray-500 w-16 shrink-0 text-center">
        {qs.question_count ?? 0}문항
      </span>

      {/* 수정일 */}
      <span className="text-sm text-gray-400 w-20 shrink-0 text-right hidden sm:block">
        {updatedAgo}
      </span>

      {/* 컨텍스트 메뉴 */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => router.push(`/sets/${qs.set_id}/edit`)}>
            <Edit className="mr-2 h-4 w-4" />
            편집
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onDuplicate(qs.set_id)}>
            <Copy className="mr-2 h-4 w-4" />
            복제
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push(`/sets/${qs.set_id}/deploy`)}>
            <Zap className="mr-2 h-4 w-4" />
            배포하기
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => onDelete(qs.set_id)}
            className="text-red-600 focus:text-red-600"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            삭제
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

// 스켈레톤
export function SetListItemSkeleton() {
  return (
    <div className="flex items-center gap-3 rounded-lg border bg-white px-4 py-3 animate-pulse">
      <div className="flex-1 space-y-1.5">
        <div className="h-4 bg-gray-200 rounded w-2/3" />
        <div className="h-3 bg-gray-200 rounded w-1/4" />
      </div>
      <div className="h-4 bg-gray-200 rounded w-12" />
      <div className="h-4 bg-gray-200 rounded w-16 hidden sm:block" />
      <div className="h-8 w-8 bg-gray-200 rounded" />
    </div>
  )
}
