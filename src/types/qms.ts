export type InspectionCategory = 'incoming' | 'process' | 'final'
export type InspectionStatus = 'pending' | 'in_progress' | 'completed'
export type InspectionVerdict = '' | 'pass' | 'concession' | 'rework' | 'return' | 'scrap'

export interface QCTemplateItem {
  name: string
  type: 'measure' | 'count' | 'sensory'
  standard: string
  required: boolean
}

export interface QCTemplate {
  id: string
  name: string
  category: 'raw' | 'purchased' | 'semi-finished' | 'finished'
  itemCount: number
  items: QCTemplateItem[]
}

export interface InspectionTask {
  id: string
  code: string
  category: InspectionCategory
  material: string
  lot: string
  qty: number
  status: InspectionStatus
  verdict?: InspectionVerdict
  sourceCode: string
  sourceName: string
  sourceType: string
  templateName: string
  supplier?: string
  warehouse?: string
  workOrderCode?: string
  operationName?: string
  createdAt: string
  items: QCTemplateItem[]
}

export type NcrSeverity = 'critical' | 'major' | 'minor'
export type NcrStatus = 'open' | 'reviewing' | 'closed'
export type NcrDisposition = 'pending' | 'rework' | 'scrap' | 'concession' | 'reinspect'

export interface NonconformanceRecord {
  id: string
  code: string
  inspectionCode: string
  inspectionCategory: InspectionCategory
  material: string
  sourceCode: string
  sourceType: string
  severity: NcrSeverity
  status: NcrStatus
  disposition: NcrDisposition
  owner: string
  issueDesc: string
  followUp: string
  createdAt: string
}

export interface SupplierQuality {
  id: string
  supplier: string
  total_batches: number
  pass_batches: number
  pass_rate: number
  repeat_issues: number
  last_inspection: string
}

export type ConcessionStatus = 'draft' | 'reviewing' | 'released' | 'rejected'

export interface ConcessionRecord {
  id: string
  code: string
  inspectionCode: string
  material: string
  sourceCode: string
  scope: string
  riskNote: string
  owner: string
  status: ConcessionStatus
  validUntil: string
  createdAt: string
}

export type ReworkReviewStatus = 'open' | 'reviewing' | 'closed'
export type ReworkReviewDecision = 'pending' | 'approved' | 'rejected'

export interface ReworkReviewRecord {
  id: string
  code: string
  ncrCode: string
  material: string
  workOrderCode: string
  sourceCode: string
  reviewRoute: string
  reinspectionRule: string
  owner: string
  status: ReworkReviewStatus
  decision: ReworkReviewDecision
  createdAt: string
}

export type ScrapReviewStatus = 'pending' | 'approved' | 'closed'

export interface ScrapReviewRecord {
  id: string
  code: string
  ncrCode: string
  material: string
  sourceCode: string
  reason: string
  qty: number
  lossAmount: number
  owner: string
  status: ScrapReviewStatus
  createdAt: string
}

export type ReInspectionStatus = 'pending' | 'executing' | 'closed'
export type ReInspectionResult = 'pending' | 'pass' | 'fail'

export interface ReInspectionRecord {
  id: string
  code: string
  sourceCode: string
  inspectionCode: string
  material: string
  previousDecision: string
  unlockAction: string
  owner: string
  status: ReInspectionStatus
  result: ReInspectionResult
  createdAt: string
}
