import { generateId } from '@/static/utils/id'
import { paginate, searchItems } from '@/static/utils/paginate'
import {
  MockResponse,
  wrapCreatedResponse,
  wrapDetailResponse,
  wrapListResponse,
  wrapSuccessResponse,
  wrapUpdatedResponse
} from '@/static/utils/response'
import type {
  ApsConflictSeverity,
  ApsConstraintFormModel,
  ApsConstraintType,
  ApsHistoryRecord,
  ApsLoadItem,
  ApsLoadTrendSeries,
  ApsRescheduleRecord,
  ApsScheduleConflict,
  ApsScheduleSnapshot,
  ApsScheduleWorkOrder,
  ApsTimelineDay,
  MoldConstraint,
  SkillConstraint,
  ToolConstraint
} from '@/types/aps'

type ConstraintMap = {
  mold: MoldConstraint[]
  tool: ToolConstraint[]
  skill: SkillConstraint[]
}

const timelineDays: ApsTimelineDay[] = Array.from({ length: 14 }, (_, index) => {
  const current = new Date(2026, 6, 15 + index)
  return {
    label: `${current.getMonth() + 1}/${current.getDate()}`,
    isWeekend: current.getDay() === 0 || current.getDay() === 6
  }
})

const ganttSeed: ApsScheduleWorkOrder[] = [
  {
    id: 'wo-1',
    code: 'MO-20260715001',
    material: '离心泵 XJP-100',
    priority: 'urgent',
    dueDate: '2026-07-21',
    segments: [
      { name: '下料', wc: '下料组', left: 0, width: 8, color: '#3b82f6', conflict: false },
      { name: '粗车', wc: '数控车组', left: 8, width: 14, color: '#14b8a6', conflict: false },
      { name: '精车', wc: '数控车组', left: 22, width: 12, color: '#f59e0b', conflict: false },
      { name: '钻孔', wc: '钻床组', left: 34, width: 8, color: '#64748b', conflict: false },
      { name: '装配', wc: '装配组', left: 42, width: 12, color: '#8b5cf6', conflict: false },
      { name: '试压', wc: '测试组', left: 54, width: 10, color: '#10b981', conflict: false }
    ]
  },
  {
    id: 'wo-2',
    code: 'MO-20260715008',
    material: '齿轮箱 GBX-200',
    priority: 'normal',
    dueDate: '2026-07-23',
    segments: [
      { name: '下料', wc: '下料组', left: 10, width: 7, color: '#3b82f6', conflict: false },
      { name: '粗车', wc: '数控车组', left: 17, width: 11, color: '#14b8a6', conflict: false },
      { name: '精车', wc: '数控车组', left: 28, width: 10, color: '#f59e0b', conflict: false },
      { name: '热处理', wc: '热处理组', left: 38, width: 9, color: '#ef4444', conflict: false }
    ]
  },
  {
    id: 'wo-3',
    code: 'MO-20260715012',
    material: '传动轴 DS-50',
    priority: 'low',
    dueDate: '2026-07-25',
    segments: [
      { name: '车削', wc: '数控车组', left: 45, width: 14, color: '#0ea5e9', conflict: false },
      { name: '磨削', wc: '磨床组', left: 59, width: 10, color: '#f97316', conflict: false }
    ]
  }
]

const loadSeed: ApsLoadItem[] = [
  { name: '下料组', capacity: '16h', used: '10.5h', loadPct: 66 },
  { name: '数控车组', capacity: '24h', used: '22.5h', loadPct: 94 },
  { name: '钻床组', capacity: '8h', used: '7h', loadPct: 88 },
  { name: '磨床组', capacity: '8h', used: '6h', loadPct: 75 },
  { name: '装配组', capacity: '12h', used: '11h', loadPct: 92 },
  { name: '测试组', capacity: '8h', used: '4h', loadPct: 50 },
  { name: '热处理组', capacity: '16h', used: '9h', loadPct: 56 }
]

const loadTrendSeed: { days: string[]; series: ApsLoadTrendSeries[] } = {
  days: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
  series: [
    { name: '数控车组', data: [18, 20, 22, 21, 19, 10, 0], color: '#14b8a6' },
    { name: '装配组', data: [9, 10, 8, 11, 10, 4, 0], color: '#8b5cf6' },
    { name: '钻床组', data: [6, 5, 7, 6, 7, 2, 0], color: '#64748b' },
    { name: '热处理组', data: [7, 8, 9, 7, 8, 3, 0], color: '#ef4444' }
  ]
}

const constraintState: ConstraintMap = {
  mold: [
    { id: 'mold-1', code: 'MD-APS-001', name: '泵体铸造模具', applicable: '泵体铸件', life: '10000模次', available: true, utilization: 62 },
    { id: 'mold-2', code: 'MD-APS-002', name: '叶轮锻模', applicable: '叶轮锻件', life: '5000模次', available: false, utilization: 95 }
  ],
  tool: [
    { id: 'tool-1', code: 'TL-APS-001', name: '车刀 CNMG120408', applicable: '数控车组', life: '500件', available: true, utilization: 86 },
    { id: 'tool-2', code: 'TL-APS-002', name: '钻头 Φ10', applicable: '钻床组', life: '300件', available: false, utilization: 100 }
  ],
  skill: [
    { id: 'skill-1', operation: '精车', skill: '数控车床操作', minLevel: 4, workersCount: 1, utilization: 92 },
    { id: 'skill-2', operation: '装配', skill: '总装钳工', minLevel: 3, workersCount: 3, utilization: 72 }
  ]
}

const historyState: ApsHistoryRecord[] = [
  {
    id: 'history-1',
    versionCode: 'APS-V20260715-01',
    planRange: '2026-07-15 ~ 2026-07-21',
    triggerType: 'manual',
    constraintSet: '标准产能 + 当前模治具约束',
    conflictCount: 2,
    workOrderCount: 18,
    generatedBy: '计划员-周颖',
    generatedAt: '2026-07-15 09:40',
    status: 'active',
    note: '用于本周主生产计划冻结',
    snapshotSummary: '主产线满载，装配与精车工位出现局部冲突。',
    adjustments: ['数控车组负荷上调 8%', '装配组顺延 0.5 天']
  },
  {
    id: 'history-2',
    versionCode: 'APS-V20260714-03',
    planRange: '2026-07-14 ~ 2026-07-20',
    triggerType: 'nightly',
    constraintSet: '夜间自动重算',
    conflictCount: 1,
    workOrderCount: 16,
    generatedBy: 'APS定时任务',
    generatedAt: '2026-07-14 23:30',
    status: 'archived',
    note: '夜间自动生成版本',
    snapshotSummary: '整体负荷平稳，钻床资源接近上限。',
    adjustments: ['钻床组夜班借调 1 人']
  },
  {
    id: 'history-3',
    versionCode: 'APS-V20260713-02',
    planRange: '2026-07-13 ~ 2026-07-19',
    triggerType: 'disturbance',
    constraintSet: '设备故障后局部重排',
    conflictCount: 3,
    workOrderCount: 15,
    generatedBy: '计划主管-林浩',
    generatedAt: '2026-07-13 14:15',
    status: 'archived',
    note: '数控车组故障后重算版本',
    snapshotSummary: '精车与热处理链路压缩，版本对交期有轻微影响。',
    adjustments: ['精车工序后移 1 天', '热处理外协占比提升']
  }
]

const rescheduleState: ApsRescheduleRecord[] = [
  {
    id: 'reschedule-1',
    code: 'RS-2026071501',
    disturbanceType: '关键设备停机',
    level: 'L3',
    scope: '数控车组主线',
    affectedOrders: 6,
    affectedCenters: '数控车组 / 装配组',
    suggestion: '将 2 个急单切换至备用车组，其余工单顺延 0.5~1 天。',
    owner: 'APS计划主管',
    status: 'reviewing',
    targetWindow: '2026-07-15 10:00 ~ 2026-07-15 18:00',
    createdAt: '2026-07-15 10:05',
    mesAction: 'MES 接收后重新下发受影响工序任务。',
    riskNote: '若备用车组未按时释放，将影响 2 个交期预警工单。'
  },
  {
    id: 'reschedule-2',
    code: 'RS-2026071502',
    disturbanceType: '物料延迟到货',
    level: 'L2',
    scope: '装配与试压链路',
    affectedOrders: 3,
    affectedCenters: '装配组 / 测试组',
    suggestion: '优先释放替代料工单，原工单顺移至次日早班。',
    owner: 'APS排程员',
    status: 'draft',
    targetWindow: '2026-07-16 08:00 ~ 2026-07-16 12:00',
    createdAt: '2026-07-15 09:20',
    mesAction: 'MES 根据最终建议调整装配派工顺序。',
    riskNote: '替代料若审批延迟，装配节拍仍会出现断点。'
  },
  {
    id: 'reschedule-3',
    code: 'RS-2026071503',
    disturbanceType: '急单插单',
    level: 'L1',
    scope: '下料与粗车前序',
    affectedOrders: 2,
    affectedCenters: '下料组 / 数控车组',
    suggestion: '在不改动周计划主版本的前提下，局部前插 1 个急单。',
    owner: 'APS排程员',
    status: 'released',
    targetWindow: '2026-07-15 13:00 ~ 2026-07-15 16:00',
    createdAt: '2026-07-15 11:30',
    mesAction: 'MES 按建议优先下发急单任务，不调整主版本编码。',
    riskNote: '下料工位切换频繁，可能带来 0.5h 换型损失。'
  }
]

const scheduleState = {
  lastRunTime: '2026-07-15 09:40'
}

function cloneSeed<T>(seed: T): T {
  if (typeof structuredClone === 'function') {
    return structuredClone(seed)
  }

  return JSON.parse(JSON.stringify(seed)) as T
}

function getConstraintUtilizationWarnings(workCenter: string) {
  const warnings: string[] = []
  const relatedTool = constraintState.tool.find((item) => workCenter.includes(item.applicable))
  if (relatedTool && !relatedTool.available) {
    warnings.push(`刀具不可用：${relatedTool.name}`)
  }
  return warnings
}

function buildConflict(
  operation: string,
  workCenter: string,
  severity: ApsConflictSeverity,
  reasons: string[],
  suggestion: string
): ApsScheduleConflict {
  return {
    id: `${operation}-${workCenter}`,
    operation,
    workCenter,
    severity,
    reasons,
    suggestion
  }
}

function resolveScheduleConflicts() {
  const conflicts: ApsScheduleConflict[] = []

  const skillConstraint = constraintState.skill.find((item) => item.operation === '精车')
  if (skillConstraint && skillConstraint.workersCount < 2) {
    conflicts.push(
      buildConflict(
        '精车',
        '数控车组',
        'critical',
        [`技能人手不足：${skillConstraint.skill} 当前仅 ${skillConstraint.workersCount} 人`, '数控车组负荷已接近上限'],
        '建议切换 1 个工单到备用车组，并补充夜班技能人员。'
      )
    )
  }

  const toolWarnings = getConstraintUtilizationWarnings('钻床组')
  if (toolWarnings.length > 0) {
    conflicts.push(buildConflict('钻孔', '钻床组', 'warning', toolWarnings, '建议在排程结果中暂时锁定钻床资源，并等待刀具替换后重排。'))
  }

  conflicts.push(
    buildConflict(
      '装配',
      '装配组',
      'warning',
      ['轴承 6308 到货延迟 1 天', '当前装配窗口将受到上游物料短缺影响'],
      '建议释放替代料工单，并将受影响工单顺延到次日早班。'
    )
  )

  return conflicts
}

function buildScheduleSnapshot(): ApsScheduleSnapshot {
  const conflicts = resolveScheduleConflicts()
  const conflictOps = new Set(conflicts.map((item) => item.operation))
  const ganttData = cloneSeed(ganttSeed).map((order) => ({
    ...order,
    segments: order.segments.map((segment) => ({
      ...segment,
      conflict: conflictOps.has(segment.name)
    }))
  }))
  const overloadedCenters = loadSeed.filter((item) => item.loadPct >= 90).length
  const averageLoadPct = Math.round(loadSeed.reduce((sum, item) => sum + item.loadPct, 0) / loadSeed.length)

  return {
    lastRunTime: scheduleState.lastRunTime,
    days: cloneSeed(timelineDays),
    ganttData,
    loadData: cloneSeed(loadSeed),
    loadTrend: cloneSeed(loadTrendSeed),
    conflicts,
    stats: {
      workOrderCount: ganttData.length,
      conflictCount: conflicts.length,
      overloadedCenters,
      averageLoadPct
    }
  }
}

export async function getApsScheduleSnapshot() {
  return wrapDetailResponse(buildScheduleSnapshot())
}

export async function runApsSchedule() {
  scheduleState.lastRunTime = '2026-07-15 14:20'
  return wrapDetailResponse(buildScheduleSnapshot(), 'APS静态排程已重新计算')
}

export async function getApsConstraintList(params: {
  type: ApsConstraintType
  pageNum: number
  pageSize: number
  keyword?: string
  applicable?: string
}) {
  let filtered = [...constraintState[params.type]]

  if (params.type === 'skill') {
    const skillList = filtered as SkillConstraint[]
    if (params.keyword) {
      filtered = searchItems(skillList as unknown as Record<string, any>[], params.keyword, ['operation', 'skill'] as never) as SkillConstraint[]
    }
  } else {
    if (params.keyword) {
      filtered = searchItems(filtered as unknown as Record<string, any>[], params.keyword, ['code', 'name'] as never) as typeof filtered
    }
    if (params.applicable) {
      filtered = searchItems(filtered as unknown as Record<string, any>[], params.applicable, ['applicable'] as never) as typeof filtered
    }
  }

  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function saveApsConstraint(data: ApsConstraintFormModel & { type: ApsConstraintType }) {
  const list = constraintState[data.type] as Array<Record<string, any>>
  const payload =
    data.type === 'skill'
      ? {
          id: data.id,
          operation: data.operation,
          skill: data.skill,
          minLevel: Number(data.minLevel || 1),
          workersCount: Number(data.workersCount || 1),
          utilization: Number(data.utilization || 0)
        }
      : {
          id: data.id,
          code: data.code,
          name: data.name,
          applicable: data.applicable,
          life: data.life,
          available: data.available,
          utilization: Number(data.utilization || 0)
        }

  const index = list.findIndex((item) => item.id === payload.id)

  if (index === -1) {
    const next = {
      ...payload,
      id: payload.id || generateId()
    }
    list.unshift(next)
    return wrapCreatedResponse(next, '约束记录已新增')
  }

  list[index] = {
    ...list[index],
    ...payload
  }
  return wrapUpdatedResponse(list[index], '约束记录已更新')
}

export async function deleteApsConstraint(type: ApsConstraintType, id: string) {
  const list = constraintState[type]
  const index = list.findIndex((item) => item.id === id)

  if (index === -1) {
    return MockResponse.fail(404, 'Constraint record not found', null)
  }

  list.splice(index, 1)
  return wrapSuccessResponse('约束记录已删除')
}

export async function getApsHistoryList(params: { pageNum: number; pageSize: number; versionCode?: string; triggerType?: string; status?: string }) {
  let filtered = [...historyState]

  if (params.versionCode) {
    filtered = searchItems(filtered, params.versionCode, ['versionCode'])
  }
  if (params.triggerType) {
    filtered = filtered.filter((item) => item.triggerType === params.triggerType)
  }
  if (params.status) {
    filtered = filtered.filter((item) => item.status === params.status)
  }

  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function getApsHistoryDetail(id: string) {
  const target = historyState.find((item) => item.id === id)

  if (!target) {
    return MockResponse.fail(404, 'Schedule history not found', null)
  }

  return wrapDetailResponse(cloneSeed(target))
}

export async function getApsRescheduleList(params: { pageNum: number; pageSize: number; code?: string; level?: string; status?: string }) {
  let filtered = [...rescheduleState]

  if (params.code) {
    filtered = searchItems(filtered, params.code, ['code', 'disturbanceType', 'scope'])
  }
  if (params.level) {
    filtered = filtered.filter((item) => item.level === params.level)
  }
  if (params.status) {
    filtered = filtered.filter((item) => item.status === params.status)
  }

  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function updateApsReschedule(id: string, data: Partial<ApsRescheduleRecord>) {
  const index = rescheduleState.findIndex((item) => item.id === id)

  if (index === -1) {
    return MockResponse.fail(404, 'Reschedule suggestion not found', null)
  }

  rescheduleState[index] = {
    ...rescheduleState[index],
    ...data
  }

  return wrapUpdatedResponse(rescheduleState[index], '重排建议已更新')
}
