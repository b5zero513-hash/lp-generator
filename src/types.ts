export interface FaqEntry {
  question: string
  answer: string
}

export interface LpInput {
  industry: string
  businessName: string
  serviceName: string
  description: string
  area: string
  delivery: string
  target: string
  concerns: string
  outcome: string
  strengths: string
  steps: string
  proof: string
  price: string
  terms: string
  faq: FaqEntry[]
  contactMethod: string
  contactUrl: string
  action: string
  tone: 'やさしい' | '誠実' | '親しみやすい'
}

export type SectionId =
  | 'hero'
  | 'problems'
  | 'empathy'
  | 'solution'
  | 'service'
  | 'strengths'
  | 'flow'
  | 'faq'
  | 'cta'

export interface DraftPoint {
  title: string
  text: string
}

export interface DraftSection {
  id: SectionId
  label: string
  kicker: string
  title: string
  lead: string
  body: string
  points: DraftPoint[]
  buttonText?: string
  hint?: string
}

export interface LpDraft {
  angle: string
  sections: DraftSection[]
}
