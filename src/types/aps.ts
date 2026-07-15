export type ApsConstraintType = 'mold' | 'tool' | 'skill'
export type ApsConflictSeverity = 'warning' | 'critical'
export type ApsHistoryStatus = 'draft' | 'active' | 'archived'
export type ApsRescheduleLevel = 'L1' | 'L2' | 'L3'
export type ApsRescheduleStatus = 'draft' | 'reviewing' | 'released'

export interface ApsTimelineDay {
  label: string
  isWeekend: boolean
}

export interface ApsScheduleSegment {
  name: string
  wc: string
  left: number
  width: number
  color: string
  conflict: boolean
}

export interface ApsScheduleWorkOrder {
  id: string
  code: string
  material: string
  priority: 'urgent' | 'normal' | 'low'
  dueDate: string
  segments: ApsScheduleSegment[]
}

export interface ApsLoadItem {
  name: string
  capacity: string
  used: string
  loadPct: number
}

export interface ApsLoadTrendSeries {
  name: string
  data: number[]
  color: string
}

export interface ApsScheduleConflict {
  id: string
  operation: string
  workCenter: string
  severity: ApsConflictSeverity
  reasons: string[]
  suggestion: string
}

export interface ApsScheduleStats {
  workOrderCount: number
  conflictCount: number
  overloadedCenters: number
  averageLoadPct: number
}

export interface ApsScheduleSnapshot {
  lastRunTime: string
  days: ApsTimelineDay[]
  ganttData: ApsScheduleWorkOrder[]
  loadData: ApsLoadItem[]
  loadTrend: {
    days: string[]
    series: ApsLoadTrendSeries[]
  }
  conflicts: ApsScheduleConflict[]
  stats: ApsScheduleStats
}

export interface MoldConstraint {
  id: string
  code: string
  name: string
  applicable: string
  life: string
  available: boolean
  utilization: number
}

export interface ToolConstraint {
  id: string
  code: string
  name: string
  applicable: string
  life: string
  available: boolean
  utilization: number
}

export interface SkillConstraint {
  id: string
  operation: string
  skill: string
  minLevel: number
  workersCount: number
  utilization: number
}

export type ApsConstraintRecord = MoldConstraint | ToolConstraint | SkillConstraint

export interface ApsConstraintFormModel {
  id: string
  code: string
  name: string
  applicable: string
  life: string
  available: boolean
  utilization: number
  operation: string
  skill: string
  minLevel: number
  workersCount: number
}

export interface ApsHistoryRecord {
  id: string
  versionCode: string
  planRange: string
  triggerType: 'manual' | 'nightly' | 'disturbance'
  constraintSet: string
  conflictCount: number
  workOrderCount: number
  generatedBy: string
  generatedAt: string
  status: ApsHistoryStatus
  note: string
  snapshotSummary: string
  adjustments: string[]
}

export interface ApsRescheduleRecord {
  id: string
  code: string
  disturbanceType: string
  level: ApsRescheduleLevel
  scope: string
  affectedOrders: number
  affectedCenters: string
  suggestion: string
  owner: string
  status: ApsRescheduleStatus
  targetWindow: string
  createdAt: string
  mesAction: string
  riskNote: string
}
