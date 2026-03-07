'use client'

import { createContext, useContext, useReducer, type ReactNode, type Dispatch } from 'react'
import type { Question, QuestionSet, QuestionDraft } from '@/types'

// ─── State ───

export interface WizardSetMeta {
  title: string
  subject: string | null
  grade: string | null
  tags: string[]
  description?: string | null
  source?: string | null
}

export interface WizardState {
  step: 1 | 2 | 3
  setId: string
  setMeta: WizardSetMeta
  questions: Question[]
  selectedQuestionId: string | null
  isDirty: boolean
  isLoading: boolean
}

const initialState: WizardState = {
  step: 1,
  setId: '',
  setMeta: { title: '', subject: null, grade: null, tags: [] },
  questions: [],
  selectedQuestionId: null,
  isDirty: false,
  isLoading: true,
}

// ─── Actions ───

export type WizardAction =
  | { type: 'SET_STEP'; step: 1 | 2 | 3 }
  | { type: 'LOAD_SET'; set: QuestionSet; questions: Question[] }
  | { type: 'ADD_QUESTIONS'; questions: Question[] }
  | { type: 'ADD_FROM_TEMPLATE'; question: Question }
  | { type: 'UPDATE_QUESTION'; id: string; draft: QuestionDraft }
  | { type: 'DELETE_QUESTION'; id: string }
  | { type: 'DUPLICATE_QUESTION'; id: string }
  | { type: 'REORDER_QUESTIONS'; orderedIds: string[] }
  | { type: 'SELECT_QUESTION'; id: string | null }
  | { type: 'UPDATE_META'; meta: Partial<WizardSetMeta> }
  | { type: 'SET_DIRTY'; dirty: boolean }
  | { type: 'SET_LOADING'; loading: boolean }

// ─── Reducer ───

function wizardReducer(state: WizardState, action: WizardAction): WizardState {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, step: action.step }

    case 'LOAD_SET': {
      const { set, questions } = action
      return {
        ...state,
        setId: set.set_id,
        setMeta: {
          title: set.title,
          subject: set.subject,
          grade: set.grade,
          tags: set.tags ?? [],
          description: set.description,
          source: set.source,
        },
        questions,
        selectedQuestionId: questions.length > 0 ? questions[0].question_id : null,
        isLoading: false,
        isDirty: false,
      }
    }

    case 'ADD_QUESTIONS': {
      const startIndex = state.questions.length
      const newQs = action.questions.map((q, i) => ({
        ...q,
        order_index: startIndex + i,
      }))
      const allQuestions = [...state.questions, ...newQs]
      return {
        ...state,
        questions: allQuestions,
        selectedQuestionId: newQs.length > 0 ? newQs[0].question_id : state.selectedQuestionId,
        isDirty: true,
        step: 2,
      }
    }

    case 'ADD_FROM_TEMPLATE': {
      const allQuestions = [...state.questions, action.question]
      return {
        ...state,
        questions: allQuestions,
        selectedQuestionId: action.question.question_id,
        isDirty: true,
      }
    }

    case 'UPDATE_QUESTION': {
      const questions = state.questions.map((q) =>
        q.question_id === action.id
          ? { ...q, ...action.draft }
          : q,
      )
      return { ...state, questions, isDirty: true }
    }

    case 'DELETE_QUESTION': {
      const questions = state.questions
        .filter((q) => q.question_id !== action.id)
        .map((q, i) => ({ ...q, order_index: i }))
      const selectedQuestionId =
        state.selectedQuestionId === action.id
          ? (questions[0]?.question_id ?? null)
          : state.selectedQuestionId
      return { ...state, questions, selectedQuestionId, isDirty: true }
    }

    case 'DUPLICATE_QUESTION': {
      const src = state.questions.find((q) => q.question_id === action.id)
      if (!src) return state
      const newId = `dup-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
      const newQ: Question = {
        ...src,
        question_id: newId,
        order_index: state.questions.length,
      }
      return {
        ...state,
        questions: [...state.questions, newQ],
        selectedQuestionId: newId,
        isDirty: true,
      }
    }

    case 'REORDER_QUESTIONS': {
      const map = new Map(state.questions.map((q) => [q.question_id, q]))
      const questions = action.orderedIds
        .map((id, i) => {
          const q = map.get(id)
          return q ? { ...q, order_index: i } : null
        })
        .filter(Boolean) as Question[]
      return { ...state, questions, isDirty: true }
    }

    case 'SELECT_QUESTION':
      return { ...state, selectedQuestionId: action.id }

    case 'UPDATE_META':
      return { ...state, setMeta: { ...state.setMeta, ...action.meta }, isDirty: true }

    case 'SET_DIRTY':
      return { ...state, isDirty: action.dirty }

    case 'SET_LOADING':
      return { ...state, isLoading: action.loading }

    default:
      return state
  }
}

// ─── Context ───

interface WizardContextValue {
  state: WizardState
  dispatch: Dispatch<WizardAction>
}

const WizardContext = createContext<WizardContextValue | null>(null)

export function WizardProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(wizardReducer, initialState)
  return (
    <WizardContext.Provider value={{ state, dispatch }}>
      {children}
    </WizardContext.Provider>
  )
}

export function useWizard() {
  const ctx = useContext(WizardContext)
  if (!ctx) throw new Error('useWizard must be used inside WizardProvider')
  return ctx
}
