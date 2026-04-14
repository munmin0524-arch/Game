'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  Zap,
  Edit,
  Copy,
  Star,
  BookOpen,
} from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { SetBadge } from '@/components/common/SetBadge'
import { cn } from '@/lib/utils'
import {
  buildMockPreviewQuestions,
  getHubSetById,
} from '../_mocks/setsHubMockData'
import type { Question } from '@/types'

const GRADIENTS = [
  'from-blue-200 to-cyan-100',
  'from-violet-200 to-purple-100',
  'from-rose-200 to-orange-100',
  'from-emerald-200 to-teal-100',
  'from-amber-200 to-yellow-100',
  'from-pink-200 to-rose-100',
]

function typeLabel(t: Question['type']): string {
  return t === 'multiple_choice' ? '객관식' : t === 'ox' ? 'OX' : '재배열'
}

export function SetPreviewSheet({
  open,
  onOpenChange,
  setId,
  onMarkSeen,
}: {
  open: boolean
  onOpenChange: (o: boolean) => void
  setId: string | null
  onMarkSeen: (setId: string) => void
}) {
  const router = useRouter()
  const set = setId ? getHubSetById(setId) : undefined
  const questions = useMemo(() => (setId ? buildMockPreviewQuestions(setId, 5) : []), [setId])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [rating, setRating] = useState(0)

  // Sheet 열릴 때 상태 리셋 + seen 기록
  useEffect(() => {
    if (open && setId) {
      setCurrentIndex(0)
      setRating(0)
      onMarkSeen(setId)
    }
  }, [open, setId, onMarkSeen])

  // 키보드 네비 (← →)
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') setCurrentIndex((i) => Math.max(0, i - 1))
      if (e.key === 'ArrowRight') setCurrentIndex((i) => Math.min(questions.length - 1, i + 1))
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, questions.length])

  if (!set) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent />
      </Sheet>
    )
  }

  const current = questions[currentIndex]
  const gradient = GRADIENTS[(set.thumbnail_variant ?? 0) % GRADIENTS.length]
  const isMine = set.source === 'mine'

  const handleStart = () => {
    onOpenChange(false)
    router.push(`/sets/${set.set_id}/deploy`)
  }
  const handleEdit = () => {
    onOpenChange(false)
    router.push(`/sets/${set.set_id}/edit`)
  }
  const handleDuplicate = () => {
    // TODO: questionSetsApi.duplicate(set.set_id) → 이후 편집 페이지 이동
    onOpenChange(false)
    router.push(`/sets/${set.set_id}/edit`)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="p-0">
        <div className="flex flex-col h-full">
          {/* ─── 헤더 (썸네일 밴드) ─── */}
          <div className={cn('bg-gradient-to-br px-6 pt-6 pb-5 relative shrink-0', gradient)}>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {set.is_official && <SetBadge kind="official" />}
              {set.is_new && <SetBadge kind="new" />}
              {(set.play_count ?? 0) >= 500 && <SetBadge kind="hot" />}
              {set.textbook && <SetBadge kind="textbook" text={set.textbook} />}
              {set.theme && <SetBadge kind="theme" text={set.theme.replace('공부력-', '공부력 ')} />}
            </div>

            <SheetHeader>
              <SheetTitle className="text-xl leading-snug pr-8">{set.title}</SheetTitle>
            </SheetHeader>

            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-gray-700">
              {set.subject && <Badge variant="secondary" className="rounded-full">{set.subject}</Badge>}
              {set.grade && <Badge variant="outline" className="rounded-full bg-white/60">{set.grade}</Badge>}
              {set.unit && (
                <span className="inline-flex items-center gap-1 text-gray-700">
                  <BookOpen className="h-3.5 w-3.5" />
                  {set.unit}
                </span>
              )}
              <span className="text-gray-600">·</span>
              <span className="font-semibold text-gray-800">{set.question_count ?? 0}문항</span>
              {set.difficulty && (
                <>
                  <span className="text-gray-600">·</span>
                  <span>난이도 {set.difficulty}</span>
                </>
              )}
            </div>

            {/* 저작자 / 평점 */}
            <div className="mt-3 flex items-center justify-between text-xs text-gray-700">
              <div>
                {set.source === 'quiz_party' ? (
                  <span className="font-semibold text-blue-700">🎉 퀴즈파티 제공</span>
                ) : set.source === 'community' ? (
                  <span>
                    by <span className="font-semibold">{set.host_nickname}</span>
                    {set.is_certified && <span className="ml-1 text-blue-600">✓ 인증</span>}
                  </span>
                ) : (
                  <span className="text-gray-600">내가 만든 세트지</span>
                )}
              </div>
              {set.rating_avg != null && (
                <span className="text-amber-600 font-semibold">
                  ★ {set.rating_avg.toFixed(1)}
                </span>
              )}
            </div>
          </div>

          {/* ─── 문항 브라우저 ─── */}
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-xs font-semibold text-gray-700">
                문항 {currentIndex + 1} / {questions.length}
              </div>
              <div className="flex gap-1">
                {questions.map((_, i) => (
                  <span
                    key={i}
                    className={cn(
                      'h-1.5 rounded-full transition-all',
                      i === currentIndex ? 'bg-blue-600 w-6' : 'bg-gray-200 w-1.5',
                    )}
                  />
                ))}
              </div>
            </div>

            {/* 문항 카드 */}
            <div className="rounded-2xl border bg-white p-5 shadow-sm space-y-3">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="rounded-full text-[10px]">
                  {typeLabel(current.type)}
                </Badge>
              </div>
              <p className="text-base font-semibold text-gray-900 leading-relaxed">
                {current.content}
              </p>
              {current.options && current.options.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  {current.options.map((opt) => {
                    const isAnswer = current.answer === String(opt.index) || current.answer.includes(String(opt.index))
                    return (
                      <div
                        key={opt.index}
                        className={cn(
                          'flex items-start gap-2 rounded-lg border px-3 py-2 text-sm',
                          isAnswer ? 'border-emerald-300 bg-emerald-50 text-emerald-900' : 'border-gray-200 text-gray-700',
                        )}
                      >
                        <span className="font-semibold shrink-0">{opt.index}.</span>
                        <span>{opt.text}</span>
                        {isAnswer && (
                          <span className="ml-auto text-[10px] font-bold text-emerald-600">정답</span>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
              {current.type === 'ox' && (
                <div className="flex gap-2 pt-1">
                  {(['O', 'X'] as const).map((v) => {
                    const isAnswer = current.answer === v
                    return (
                      <div
                        key={v}
                        className={cn(
                          'flex-1 rounded-lg border py-3 text-center text-lg font-bold',
                          isAnswer ? 'border-emerald-300 bg-emerald-50 text-emerald-700' : 'border-gray-200 text-gray-400',
                        )}
                      >
                        {v}
                      </div>
                    )
                  })}
                </div>
              )}
              {current.explanation && (
                <p className="text-xs text-gray-500 pt-2 border-t">
                  💡 {current.explanation}
                </p>
              )}
            </div>

            {/* 좌우 네비 */}
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
                className="rounded-full"
              >
                <ChevronLeft className="h-4 w-4 mr-1" /> 이전 문항
              </Button>
              <span className="text-xs text-gray-400">← → 키로 이동</span>
              <Button
                variant="outline"
                size="sm"
                disabled={currentIndex >= questions.length - 1}
                onClick={() => setCurrentIndex((i) => Math.min(questions.length - 1, i + 1))}
                className="rounded-full"
              >
                다음 문항 <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>

            {/* 세트 평점 */}
            <div className="rounded-xl bg-gray-50 border p-4 space-y-2">
              <p className="text-xs font-semibold text-gray-700">이 세트지는 어떠셨나요?</p>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    onClick={() => setRating(n)}
                    className="p-0.5 hover:scale-110 transition-transform"
                    aria-label={`${n}점`}
                  >
                    <Star
                      className={cn(
                        'h-6 w-6',
                        n <= rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300',
                      )}
                    />
                  </button>
                ))}
                {rating > 0 && (
                  <span className="ml-2 text-sm font-semibold text-amber-600">
                    {rating}점 평가됨!
                  </span>
                )}
              </div>
              <p className="text-[11px] text-gray-400">
                평가는 다음 버전부터 반영됩니다.
              </p>
            </div>
          </div>

          {/* ─── Footer 액션 (sticky) ─── */}
          <div className="border-t bg-white px-6 py-4 shrink-0 flex items-center gap-2">
            <Button variant="ghost" size="icon" className="rounded-full shrink-0" aria-label="저장">
              <Heart className={cn('h-5 w-5', set.is_bookmarked && 'fill-rose-500 text-rose-500')} />
            </Button>
            {isMine ? (
              <Button variant="outline" onClick={handleEdit} className="rounded-full">
                <Edit className="h-4 w-4 mr-1.5" /> 편집
              </Button>
            ) : (
              <Button variant="outline" onClick={handleDuplicate} className="rounded-full">
                <Copy className="h-4 w-4 mr-1.5" /> 내 퀴즈로 복제
              </Button>
            )}
            <Button
              onClick={handleStart}
              className="ml-auto rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6"
            >
              <Zap className="h-4 w-4 mr-1.5" />
              이 세트로 바로 시작
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
