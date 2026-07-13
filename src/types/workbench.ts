export type WorkbenchSeverity = 'normal' | 'warning' | 'danger' | 'info'

export interface WorkbenchTodoCard {
  id: string
  title: string
  count: number
  severity: WorkbenchSeverity
  ownerSystem: string
  targetRoute: string
  targetLabel: string
  helperText: string
}

export interface WorkbenchAlertItem {
  id: string
  type: string
  title: string
  level: WorkbenchSeverity
  count: number
  ownerSystem: string
  affectedObject: string
  actionText: string
  targetRoute: string
}

export interface WorkbenchExecutionStat {
  id: string
  title: string
  value: number
  unit: string
  ownerSystem: string
  targetRoute: string
  trendText?: string
  trendDirection?: 'up' | 'down' | 'flat' | 'warning'
}

export interface WorkbenchStatusDistributionItem {
  label: string
  value: number
  color: string
  targetRoute?: string
}

export interface WorkbenchWorkshopLoadItem {
  workshop: string
  utilization: number
  wip: number
  status: 'healthy' | 'busy' | 'warning'
  targetRoute: string
}

export interface WorkbenchExecutionCharts {
  statusDistribution: WorkbenchStatusDistributionItem[]
  workshopLoad: WorkbenchWorkshopLoadItem[]
}

export interface WorkbenchCollaborationSummaryItem {
  label: string
  value: number | string
  level: WorkbenchSeverity
  targetRoute: string
}

export interface WorkbenchCollaborationDomainCard {
  domain: string
  title: string
  ownerSystem: string
  targetRoute: string
  summaryItems: WorkbenchCollaborationSummaryItem[]
}

export interface WorkbenchShortcutItem {
  id: string
  title: string
  group: string
  ownerSystem: string
  targetRoute: string
  badge: string
}

export interface WorkbenchSummaryMetric {
  id: string
  title: string
  value: number
  unit: string
  trendText?: string
  trendDirection?: 'up' | 'down' | 'flat' | 'warning'
  targetRoute: string
}

export interface WorkbenchHomepageData {
  headline: string
  prioritySummary: string
  updatedAt: string
  todoCards: WorkbenchTodoCard[]
  alerts: WorkbenchAlertItem[]
  executionStats: WorkbenchExecutionStat[]
  executionCharts: WorkbenchExecutionCharts
  collaborationDomains: WorkbenchCollaborationDomainCard[]
  shortcuts: WorkbenchShortcutItem[]
  businessSummary: WorkbenchSummaryMetric[]
}
