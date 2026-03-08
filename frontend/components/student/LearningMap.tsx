'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  ChevronRight, ChevronDown, Gamepad2, Zap, Brain, BookOpen,
  Lightbulb, AlertTriangle, CheckCircle2, Circle,
} from 'lucide-react'

// ─── 타입 ────────────────────────────────────────────────

export interface LearningNodeData {
  accuracy: number
  totalQuestions: number
  correctQuestions: number
  gamesPlayed: number
  gameAccuracy: number
  adaptiveLevel: string
  adaptiveHistory: { step: number; level: string; correct: boolean }[]
  wrongTotal: number
  wrongCleared: number
  wrongQuestions: { id: string; text: string; myAnswer: string; correctAnswer: string }[]
}

export interface LearningNode {
  id: string
  name: string
  children?: LearningNode[]
  data?: LearningNodeData
}

interface LearningMapProps {
  subjects: Record<string, LearningNode[]>
  aiRecommendation?: { unitName: string; action: string; reason: string }
}

// ─── 색상 헬퍼 ───────────────────────────────────────────

function getAccuracyColor(acc: number) {
  if (acc >= 80) return { bar: 'bg-green-500', text: 'text-green-600', badge: 'bg-green-100 text-green-700' }
  if (acc >= 50) return { bar: 'bg-amber-400', text: 'text-amber-600', badge: 'bg-amber-100 text-amber-700' }
  return { bar: 'bg-red-400', text: 'text-red-600', badge: 'bg-red-100 text-red-700' }
}

function getLevelColor(level: string) {
  switch (level) {
    case '상': return 'bg-green-500 text-white'
    case '중상': return 'bg-green-400 text-white'
    case '중': return 'bg-blue-400 text-white'
    case '중하': return 'bg-amber-400 text-white'
    case '하': return 'bg-red-400 text-white'
    default: return 'bg-gray-300 text-white'
  }
}

// ─── 트리 노드 ───────────────────────────────────────────

function TreeNode({
  node, depth, selectedId, onSelect,
}: {
  node: LearningNode; depth: number; selectedId: string | null; onSelect: (node: LearningNode) => void
}) {
  const [expanded, setExpanded] = useState(depth < 2)
  const hasChildren = node.children && node.children.length > 0
  const isLeaf = !hasChildren && node.data
  const isSelected = selectedId === node.id

  return (
    <div>
      <button
        onClick={() => {
          if (hasChildren) setExpanded(!expanded)
          if (isLeaf) onSelect(node)
        }}
        className={`w-full flex items-center gap-1.5 rounded-md px-2 py-1.5 text-left transition-colors ${
          isSelected ? 'bg-blue-50 ring-1 ring-blue-300' : 'hover:bg-gray-50'
        }`}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
      >
        {/* 접기/펼치기 아이콘 */}
        {hasChildren ? (
          expanded
            ? <ChevronDown className="h-3 w-3 text-gray-400 shrink-0" />
            : <ChevronRight className="h-3 w-3 text-gray-400 shrink-0" />
        ) : (
          <Circle className="h-2.5 w-2.5 text-gray-300 shrink-0" />
        )}

        {/* 이름 */}
        <span className={`text-xs font-medium truncate ${isLeaf ? 'text-gray-800' : 'text-gray-600'}`}>
          {node.name}
        </span>

        {/* 리프: 정답률 + 뱃지 */}
        {isLeaf && node.data && (
          <div className="ml-auto flex items-center gap-1.5 shrink-0">
            {node.data.wrongTotal - node.data.wrongCleared > 0 && (
              <span className="flex items-center gap-0.5 rounded-full bg-rose-100 px-1.5 py-0.5 text-[8px] font-bold text-rose-600">
                <AlertTriangle className="h-2.5 w-2.5" />
                {node.data.wrongTotal - node.data.wrongCleared}
              </span>
            )}
            <span className={`rounded-full px-1.5 py-0.5 text-[8px] font-bold ${getLevelColor(node.data.adaptiveLevel)}`}>
              {node.data.adaptiveLevel}
            </span>
            <div className="w-12 h-1.5 rounded-full bg-gray-100 overflow-hidden">
              <div
                className={`h-full rounded-full ${getAccuracyColor(node.data.accuracy).bar}`}
                style={{ width: `${node.data.accuracy}%` }}
              />
            </div>
            <span className={`text-[10px] font-bold w-8 text-right ${getAccuracyColor(node.data.accuracy).text}`}>
              {node.data.accuracy}%
            </span>
          </div>
        )}

        {/* 브랜치: 자식 수 */}
        {hasChildren && (
          <span className="ml-auto text-[9px] text-gray-400 shrink-0">
            {node.children!.length}
          </span>
        )}
      </button>

      {/* 자식 렌더 */}
      {expanded && hasChildren && (
        <div>
          {node.children!.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              depth={depth + 1}
              selectedId={selectedId}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// ─── 난이도 변화 미니 그래프 ──────────────────────────────

const LEVEL_Y: Record<string, number> = { '하': 4, '중하': 3, '중': 2, '중상': 1, '상': 0 }
const LEVEL_LABELS = ['상', '중상', '중', '중하', '하']

function AdaptiveGraph({ history }: { history: LearningNodeData['adaptiveHistory'] }) {
  if (history.length === 0) return <p className="text-[10px] text-gray-400">처방 이력 없음</p>

  const cellW = 24
  const cellH = 16
  const w = history.length * cellW
  const h = 5 * cellH

  const points = history.map((h, i) => ({
    x: i * cellW + cellW / 2,
    y: (LEVEL_Y[h.level] ?? 2) * cellH + cellH / 2,
    correct: h.correct,
  }))

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')

  return (
    <div className="flex gap-2">
      {/* Y축 라벨 */}
      <div className="flex flex-col justify-between text-[8px] text-gray-400 py-1">
        {LEVEL_LABELS.map((l) => <span key={l}>{l}</span>)}
      </div>
      <svg width={w} height={h} className="overflow-visible">
        {/* 격자선 */}
        {LEVEL_LABELS.map((_, i) => (
          <line key={i} x1={0} y1={i * cellH + cellH / 2} x2={w} y2={i * cellH + cellH / 2}
            stroke="#f0f0f0" strokeWidth={1} />
        ))}
        {/* 라인 */}
        <path d={linePath} fill="none" stroke="#3b82f6" strokeWidth={2} />
        {/* 점 */}
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={4}
            fill={p.correct ? '#22c55e' : '#ef4444'} stroke="white" strokeWidth={1.5} />
        ))}
      </svg>
    </div>
  )
}

// ─── 상세 패널 ───────────────────────────────────────────

function DetailPanel({ node }: { node: LearningNode }) {
  const router = useRouter()
  const d = node.data!
  const color = getAccuracyColor(d.accuracy)
  const wrongRemaining = d.wrongTotal - d.wrongCleared

  return (
    <div className="rounded-xl bg-white p-3 shadow-soft space-y-3">
      {/* 헤더 */}
      <div>
        <h3 className="text-sm font-bold text-gray-900">{node.name}</h3>
        <div className="flex items-center gap-2 mt-1">
          <div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden">
            <div className={`h-full rounded-full ${color.bar}`} style={{ width: `${d.accuracy}%` }} />
          </div>
          <span className={`text-sm font-bold ${color.text}`}>{d.accuracy}%</span>
        </div>
      </div>

      {/* 4가지 학습 상태 */}
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-lg bg-blue-50 p-2">
          <div className="flex items-center gap-1 mb-0.5">
            <Gamepad2 className="h-3 w-3 text-blue-500" />
            <span className="text-[10px] font-semibold text-blue-700">게임</span>
          </div>
          <p className="text-[10px] text-gray-600">{d.gamesPlayed}회 · {d.gameAccuracy}%</p>
        </div>
        <div className="rounded-lg bg-violet-50 p-2">
          <div className="flex items-center gap-1 mb-0.5">
            <Brain className="h-3 w-3 text-violet-500" />
            <span className="text-[10px] font-semibold text-violet-700">처방</span>
          </div>
          <p className="text-[10px] text-gray-600">난이도: {d.adaptiveLevel}</p>
        </div>
        <div className="rounded-lg bg-amber-50 p-2">
          <div className="flex items-center gap-1 mb-0.5">
            <Zap className="h-3 w-3 text-amber-500" />
            <span className="text-[10px] font-semibold text-amber-700">스피드퀴즈</span>
          </div>
          <p className="text-[10px] text-gray-600">{d.totalQuestions}문제 풀이</p>
        </div>
        <div className="rounded-lg bg-rose-50 p-2">
          <div className="flex items-center gap-1 mb-0.5">
            <BookOpen className="h-3 w-3 text-rose-500" />
            <span className="text-[10px] font-semibold text-rose-700">오답노트</span>
          </div>
          <p className="text-[10px] text-gray-600">
            {wrongRemaining > 0 ? `${wrongRemaining}개 미정복` : '모두 정복!'}
          </p>
        </div>
      </div>

      {/* 처방 난이도 변화 */}
      {d.adaptiveHistory.length > 0 && (
        <div>
          <p className="text-[10px] font-semibold text-gray-600 mb-1">처방 난이도 변화</p>
          <AdaptiveGraph history={d.adaptiveHistory} />
        </div>
      )}

      {/* 틀린 문항 */}
      {d.wrongQuestions.length > 0 && (
        <div>
          <p className="text-[10px] font-semibold text-gray-600 mb-1">
            틀린 문항 ({d.wrongQuestions.length}개)
          </p>
          <div className="space-y-1 max-h-[120px] overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-200">
            {d.wrongQuestions.map((q) => (
              <div key={q.id} className="rounded-md bg-gray-50 p-2 text-[10px]">
                <p className="font-medium text-gray-800">{q.text}</p>
                <div className="flex gap-2 mt-0.5">
                  <span className="text-red-500">내 답: {q.myAnswer}</span>
                  <span className="text-green-600">정답: {q.correctAnswer}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4가지 학습 버튼 */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => router.push('/student/games')}
          className="flex items-center justify-center gap-1 rounded-lg bg-blue-500 py-2 text-[11px] font-semibold text-white hover:bg-blue-600 transition-colors"
        >
          <Gamepad2 className="h-3.5 w-3.5" /> 게임하기
        </button>
        <button
          onClick={() => router.push('/student/games')}
          className="flex items-center justify-center gap-1 rounded-lg bg-amber-500 py-2 text-[11px] font-semibold text-white hover:bg-amber-600 transition-colors"
        >
          <Zap className="h-3.5 w-3.5" /> 스피드퀴즈
        </button>
        <button
          onClick={() => router.push('/student/game-adaptive/new')}
          className="flex items-center justify-center gap-1 rounded-lg bg-violet-500 py-2 text-[11px] font-semibold text-white hover:bg-violet-600 transition-colors"
        >
          <Brain className="h-3.5 w-3.5" /> 처방학습
        </button>
        <button
          onClick={() => router.push('/student/wrong-notes')}
          className="flex items-center justify-center gap-1 rounded-lg bg-rose-500 py-2 text-[11px] font-semibold text-white hover:bg-rose-600 transition-colors"
        >
          <BookOpen className="h-3.5 w-3.5" /> 오답노트
        </button>
      </div>
    </div>
  )
}

// ─── 메인 컴포넌트 ───────────────────────────────────────

const SUBJECT_ORDER = ['영어', '수학', '과학', '사회']

export function LearningMap({ subjects, aiRecommendation }: LearningMapProps) {
  const availableSubjects = SUBJECT_ORDER.filter((s) => subjects[s])
  const [selectedSubject, setSelectedSubject] = useState(availableSubjects[0] ?? '영어')
  const [selectedNode, setSelectedNode] = useState<LearningNode | null>(null)

  const tree = subjects[selectedSubject] ?? []

  return (
    <div className="space-y-3">
      {/* 과목 탭 */}
      <div className="flex gap-1 rounded-lg bg-gray-100 p-0.5">
        {availableSubjects.map((s) => (
          <button
            key={s}
            onClick={() => { setSelectedSubject(s); setSelectedNode(null) }}
            className={`flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              selectedSubject === s
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* 트리 + 상세 패널 */}
      <div className="grid grid-cols-5 gap-3">
        {/* 좌측 트리 */}
        <div className="col-span-3 rounded-xl bg-white p-2 shadow-soft max-h-[480px] overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-200">
          {tree.length > 0 ? (
            tree.map((node) => (
              <TreeNode
                key={node.id}
                node={node}
                depth={0}
                selectedId={selectedNode?.id ?? null}
                onSelect={setSelectedNode}
              />
            ))
          ) : (
            <p className="text-xs text-gray-400 text-center py-8">아직 학습 데이터가 없어요</p>
          )}
        </div>

        {/* 우측 상세 */}
        <div className="col-span-2">
          {selectedNode?.data ? (
            <DetailPanel node={selectedNode} />
          ) : (
            <div className="rounded-xl bg-white p-6 shadow-soft flex flex-col items-center justify-center text-center h-full min-h-[200px]">
              <Circle className="h-8 w-8 text-gray-200 mb-2" />
              <p className="text-xs text-gray-400">단원을 선택하면<br />상세 정보를 볼 수 있어요</p>
            </div>
          )}
        </div>
      </div>

      {/* AI 추천 배너 */}
      {aiRecommendation && (
        <div className="flex items-start gap-2 rounded-xl bg-gradient-to-r from-blue-50 to-violet-50 p-3 shadow-soft">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100">
            <Lightbulb className="h-4 w-4 text-blue-600" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-800">
              AI 추천: &quot;{aiRecommendation.unitName}&quot; {aiRecommendation.action}
            </p>
            <p className="text-[10px] text-gray-500 mt-0.5">{aiRecommendation.reason}</p>
          </div>
        </div>
      )}
    </div>
  )
}
