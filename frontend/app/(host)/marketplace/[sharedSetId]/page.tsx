// S-M03: 마켓플레이스 세트지 상세 (2패널 뷰어)
// /marketplace/[sharedSetId]

'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Flag, Copy, CheckSquare, Square } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { LikeButton } from '@/components/marketplace/LikeButton'
import { BookmarkButton } from '@/components/marketplace/BookmarkButton'
import { CertifiedBadge } from '@/components/marketplace/CertifiedBadge'
import { ReviewSection } from '@/components/marketplace/ReviewSection'
import { ReportDialog } from '@/components/marketplace/ReportDialog'
import { QuestionPreview } from '@/components/host/QuestionPreview'
import type { SharedSet, Question } from '@/types'

interface PageProps {
  params: Promise<{ sharedSetId: string }>
}

const TYPE_LABELS: Record<string, string> = {
  multiple_choice: '객관식',
  ox: 'OX',
  short_answer: '단답형',
  fill_in_blank: '빈칸 채우기',
}

export default function SharedSetDetailPage({ params }: PageProps) {
  const { sharedSetId } = use(params)
  const router = useRouter()
  const [detail, setDetail] = useState<SharedSet | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null)
  const [reportOpen, setReportOpen] = useState(false)
  const [showReview, setShowReview] = useState(false)

  useEffect(() => {
    fetch(`/api/marketplace/${sharedSetId}`)
      .then((res) => res.json())
      .then((data) => {
        setDetail(data)
        const qs = (data.questions ?? []) as Question[]
        if (qs.length > 0) setSelectedQuestionId(qs[0].question_id)
      })
      .finally(() => setLoading(false))
  }, [sharedSetId])

  if (loading) {
    return (
      <div className="flex h-screen flex-col">
        <div className="h-14 bg-white border-b animate-pulse" />
        <div className="flex flex-1">
          <div className="w-72 border-r bg-slate-50 p-3 space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded-xl animate-pulse" />
            ))}
          </div>
          <div className="flex-1 p-8">
            <div className="h-48 bg-gray-100 rounded-2xl animate-pulse" />
          </div>
        </div>
      </div>
    )
  }

  if (!detail) return null

  const questions = (detail.questions ?? []) as Question[]
  const selectedQuestion = questions.find((q) => q.question_id === selectedQuestionId) ?? null

  const toggleQuestion = (qId: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(qId)) next.delete(qId)
      else next.add(qId)
      return next
    })
  }

  const toggleAll = () => {
    if (selectedIds.size === questions.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(questions.map((q) => q.question_id)))
    }
  }

  const handleCopySelected = () => {
    alert(`${selectedIds.size}개 문항을 내 세트에 추가합니다. (TODO: 세트 선택 다이얼로그)`)
  }

  const handleCopyAll = () => {
    alert('전체 세트를 복사합니다. (TODO: 새 세트 생성)')
  }

  return (
    <div className="flex h-screen flex-col">
      {/* 상단 바 */}
      <header className="flex items-center gap-3 bg-white px-6 py-3 shadow-soft shrink-0">
        <Button variant="ghost" size="icon" className="shrink-0" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>

        <div className="min-w-0 flex-1">
          <h1 className="text-lg font-bold text-gray-900 truncate">{detail.title}</h1>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span
              className="hover:text-blue-500 cursor-pointer transition-colors"
              onClick={() => router.push(`/marketplace/creator/${detail.host_member_id}`)}
            >
              by {detail.host_nickname ?? '교사'}
              {detail.is_certified && <> <CertifiedBadge size="sm" /></>}
            </span>
            <span>·</span>
            <Badge variant="secondary" className="rounded-full text-[10px] px-1.5 py-0">
              {detail.subject}
            </Badge>
            <Badge variant="outline" className="rounded-full text-[10px] px-1.5 py-0">
              {detail.grade}
            </Badge>
            <span>·</span>
            <span>{detail.question_count}문항</span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <LikeButton liked={detail.is_liked ?? false} likeCount={detail.like_count} />
          <BookmarkButton bookmarked={detail.is_bookmarked ?? false} />
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-red-500"
            onClick={() => setReportOpen(true)}
          >
            <Flag className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* 본문 2패널 */}
      <div className="flex flex-1 overflow-hidden">
        {/* 좌: 문항 목록 */}
        <aside className="flex w-72 flex-col border-r bg-slate-50/80 shrink-0">
          {/* 전체 선택 바 */}
          <div className="flex items-center justify-between border-b bg-white px-3 py-2 shrink-0">
            <Button variant="ghost" size="sm" onClick={toggleAll} className="text-xs gap-1">
              {selectedIds.size === questions.length ? (
                <><CheckSquare className="h-3.5 w-3.5" /> 전체 해제</>
              ) : (
                <><Square className="h-3.5 w-3.5" /> 전체 선택</>
              )}
            </Button>
            <span className="text-xs text-gray-400">{questions.length}개</span>
          </div>

          {/* 문항 카드 목록 */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {questions.map((q, idx) => (
              <div
                key={q.question_id}
                className={`group flex items-start gap-2 rounded-xl border p-2.5 cursor-pointer text-sm transition-colors
                  ${selectedQuestionId === q.question_id
                    ? 'bg-blue-50 border-blue-300'
                    : 'bg-white hover:bg-gray-50 border-gray-100'}`}
                onClick={() => setSelectedQuestionId(q.question_id)}
              >
                <Checkbox
                  checked={selectedIds.has(q.question_id)}
                  className="mt-0.5 shrink-0"
                  onClick={(e) => e.stopPropagation()}
                  onCheckedChange={() => toggleQuestion(q.question_id)}
                />
                <span className="mt-0.5 w-5 shrink-0 text-center text-xs font-medium text-gray-400">
                  {idx + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-gray-800">{q.content || '(내용 없음)'}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0 rounded-full">
                      {TYPE_LABELS[q.type] ?? q.type}
                    </Badge>
                    {q.difficulty && (
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0 rounded-full">
                        {q.difficulty}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* 우: 문항 미리보기 */}
        <main className="flex-1 overflow-y-auto bg-white">
          {selectedQuestion ? (
            <div className="flex flex-col h-full">
              {/* 미리보기 */}
              <div className="flex-1 bg-gradient-to-b from-slate-50 to-white">
                <QuestionPreview
                  question={selectedQuestion}
                  questionIndex={questions.findIndex((q) => q.question_id === selectedQuestionId)}
                  totalQuestions={questions.length}
                />

                {/* 문항 상세 정보 */}
                <div className="px-6 pb-6 space-y-3">
                  {detail.achievement_standards && detail.achievement_standards.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {detail.achievement_standards.map((std) => (
                        <Badge key={std} variant="outline" className="text-xs text-blue-600 border-blue-200">
                          {std}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {detail.description && (
                    <p className="text-gray-600 bg-gray-50 rounded-xl p-4 text-sm leading-relaxed">
                      {detail.description}
                    </p>
                  )}
                </div>
              </div>

              {/* 리뷰 토글 */}
              <div className="border-t px-6 py-3">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-500"
                  onClick={() => setShowReview(!showReview)}
                >
                  {showReview ? '리뷰 닫기' : '리뷰 보기'}
                  {detail.review_count != null && ` (${detail.review_count})`}
                </Button>
                {showReview && (
                  <div className="mt-3">
                    <ReviewSection
                      sharedSetId={sharedSetId}
                      avgRating={detail.avg_rating}
                      reviewCount={detail.review_count}
                    />
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex h-full items-center justify-center text-gray-300">
              <p>좌측에서 문항을 선택하세요</p>
            </div>
          )}
        </main>
      </div>

      {/* 하단 고정 바 */}
      <div className="shrink-0 bg-white/90 backdrop-blur border-t px-6 py-3 flex items-center justify-between">
        <span className="text-sm text-gray-500">
          {selectedIds.size > 0 ? `${selectedIds.size}개 선택` : '문항을 선택하세요'}
        </span>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={selectedIds.size === 0}
            onClick={handleCopySelected}
            className="gap-1"
          >
            <Copy className="h-4 w-4" />
            선택 문항 내 세트에 추가
          </Button>
          <Button size="sm" onClick={handleCopyAll} className="gap-1">
            <Copy className="h-4 w-4" />
            전체 세트 복사
          </Button>
        </div>
      </div>

      {/* 신고 다이얼로그 */}
      <ReportDialog
        open={reportOpen}
        onOpenChange={setReportOpen}
        onReport={(reason, detail) => {
          console.log('Report:', reason, detail)
        }}
      />
    </div>
  )
}
