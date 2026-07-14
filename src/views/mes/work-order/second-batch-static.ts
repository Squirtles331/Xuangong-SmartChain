import type { StatusOption } from '@/components/StatusTag.vue'

export const TASK_POOL_STATUS_OPTIONS: StatusOption[] = [
  { value: 'pending', label: '待排产', type: 'info' },
  { value: 'assigned', label: '已派工', type: 'primary' },
  { value: 'running', label: '执行中', type: 'warning' },
  { value: 'completed', label: '已完成', type: 'success' }
]

export const TASK_PRIORITY_OPTIONS: StatusOption[] = [
  { value: 'urgent', label: '紧急', type: 'danger' },
  { value: 'high', label: '高', type: 'warning' },
  { value: 'normal', label: '普通', type: 'info' },
  { value: 'low', label: '低', type: 'info' }
]

export const WIP_STATUS_OPTIONS: StatusOption[] = [
  { value: 'queued', label: '待流转', type: 'info' },
  { value: 'processing', label: '加工中', type: 'primary' },
  { value: 'frozen', label: '已冻结', type: 'danger' },
  { value: 'rework', label: '返工中', type: 'warning' },
  { value: 'completed', label: '已完成', type: 'success' }
]

export const KANBAN_SIGNAL_OPTIONS: StatusOption[] = [
  { value: 'normal', label: '正常', type: 'success' },
  { value: 'attention', label: '关注', type: 'warning' },
  { value: 'overdue', label: '逾期', type: 'danger' }
]

export const EXCEPTION_STATUS_OPTIONS: StatusOption[] = [
  { value: 'identified', label: '已识别', type: 'info' },
  { value: 'locked', label: '已锁定', type: 'danger' },
  { value: 'processing', label: '处理中', type: 'warning' },
  { value: 'awaiting_release', label: '待放行', type: 'primary' },
  { value: 'released', label: '已放行', type: 'success' },
  { value: 'closed', label: '已关闭', type: 'info' }
]

export const EXCEPTION_LEVEL_OPTIONS: StatusOption[] = [
  { value: 'P1', label: 'P1', type: 'danger' },
  { value: 'P2', label: 'P2', type: 'warning' },
  { value: 'P3', label: 'P3', type: 'info' }
]

export interface OperationTaskPoolRecord {
  id: string
  task_code: string
  wo_id: string
  wo_code: string
  material_name: string
  operation_no: number
  operation_name: string
  workshop_name: string
  line_name: string
  work_center: string
  priority: 'urgent' | 'high' | 'normal' | 'low'
  status: 'pending' | 'assigned' | 'running' | 'completed'
  blocked: boolean
  blocked_reason: string
  dependency_task: string
  dependency_ready: boolean
  team_name: string
  worker_name: string
  planned_qty: number
  reported_qty: number
  planned_start: string
  planned_end: string
  delay_hours: number
  release_note: string
}

export interface WipBatchRecord {
  id: string
  batch_code: string
  wo_id: string
  wo_code: string
  material_name: string
  workshop_name: string
  current_operation: string
  next_operation: string
  qty: number
  status: 'queued' | 'processing' | 'frozen' | 'rework' | 'completed'
  hold_owner: string
  freeze_reason: string
  rework_route: string
  last_report_time: string
  signal: 'normal' | 'attention' | 'overdue'
}

export interface ExecutionExceptionRecord {
  id: string
  exception_code: string
  level: 'P1' | 'P2' | 'P3'
  status: 'identified' | 'locked' | 'processing' | 'awaiting_release' | 'released' | 'closed'
  source_object: string
  wo_id: string
  wo_code: string
  operation_name: string
  workshop_name: string
  lock_scope: string
  owner_name: string
  collaborator_systems: string[]
  release_gate: string
  discovered_at: string
  action_summary: string
}

export const operationTaskPoolRecords: OperationTaskPoolRecord[] = [
  {
    id: 'task-pool-1',
    task_code: 'OPT-20260714-001',
    wo_id: '1',
    wo_code: 'WO202501150001',
    material_name: '离心泵 XJP-100',
    operation_no: 30,
    operation_name: '精车',
    workshop_name: '机加一车间',
    line_name: '产线A',
    work_center: '数控车组',
    priority: 'urgent',
    status: 'running',
    blocked: true,
    blocked_reason: '待首件复核后继续放量',
    dependency_task: 'OPT-20260714-000',
    dependency_ready: true,
    team_name: '甲班',
    worker_name: '赵六',
    planned_qty: 100,
    reported_qty: 45,
    planned_start: '2026-07-14 08:00',
    planned_end: '2026-07-14 18:00',
    delay_hours: 2,
    release_note: '待异常中心确认首件放行'
  },
  {
    id: 'task-pool-2',
    task_code: 'OPT-20260714-002',
    wo_id: '2',
    wo_code: 'WO202501150002',
    material_name: '齿轮箱 GBX-200',
    operation_no: 10,
    operation_name: '下料',
    workshop_name: '机加二车间',
    line_name: '产线B',
    work_center: '下料组',
    priority: 'high',
    status: 'assigned',
    blocked: false,
    blocked_reason: '',
    dependency_task: '无',
    dependency_ready: true,
    team_name: '乙班',
    worker_name: '王五',
    planned_qty: 50,
    reported_qty: 0,
    planned_start: '2026-07-14 09:00',
    planned_end: '2026-07-14 17:00',
    delay_hours: 0,
    release_note: '待班组确认设备占用'
  },
  {
    id: 'task-pool-3',
    task_code: 'OPT-20260714-003',
    wo_id: '3',
    wo_code: 'WO202501140003',
    material_name: '离心泵 XJP-200',
    operation_no: 50,
    operation_name: '磨削',
    workshop_name: '装配车间',
    line_name: '产线C',
    work_center: '磨床组',
    priority: 'normal',
    status: 'completed',
    blocked: false,
    blocked_reason: '',
    dependency_task: 'OPT-20260714-001',
    dependency_ready: true,
    team_name: '丙班',
    worker_name: '孙八',
    planned_qty: 30,
    reported_qty: 30,
    planned_start: '2026-07-13 08:00',
    planned_end: '2026-07-13 18:00',
    delay_hours: 0,
    release_note: '已转入完工确认'
  },
  {
    id: 'task-pool-4',
    task_code: 'OPT-20260714-004',
    wo_id: '1',
    wo_code: 'WO202501150001',
    material_name: '离心泵 XJP-100',
    operation_no: 40,
    operation_name: '钻孔',
    workshop_name: '机加一车间',
    line_name: '产线A',
    work_center: '钻床组',
    priority: 'high',
    status: 'pending',
    blocked: true,
    blocked_reason: '上道 WIP 冻结，禁止前推',
    dependency_task: 'OPT-20260714-001',
    dependency_ready: false,
    team_name: '甲班',
    worker_name: '',
    planned_qty: 100,
    reported_qty: 0,
    planned_start: '2026-07-14 14:00',
    planned_end: '2026-07-14 22:00',
    delay_hours: 4,
    release_note: '待 WIP 解冻后可派工'
  }
]

export const wipBatchRecords: WipBatchRecord[] = [
  {
    id: 'wip-1',
    batch_code: 'WIP-20260714-001',
    wo_id: '1',
    wo_code: 'WO202501150001',
    material_name: '离心泵 XJP-100',
    workshop_name: '机加一车间',
    current_operation: '精车',
    next_operation: '钻孔',
    qty: 55,
    status: 'processing',
    hold_owner: '赵六',
    freeze_reason: '',
    rework_route: '',
    last_report_time: '2026-07-14 10:35',
    signal: 'attention'
  },
  {
    id: 'wip-2',
    batch_code: 'WIP-20260714-002',
    wo_id: '1',
    wo_code: 'WO202501150001',
    material_name: '离心泵 XJP-100',
    workshop_name: '机加一车间',
    current_operation: '待钻孔缓存区',
    next_operation: '钻孔',
    qty: 40,
    status: 'frozen',
    hold_owner: '异常中心',
    freeze_reason: '首件尺寸复核未放行',
    rework_route: '',
    last_report_time: '2026-07-14 11:10',
    signal: 'overdue'
  },
  {
    id: 'wip-3',
    batch_code: 'WIP-20260714-003',
    wo_id: '2',
    wo_code: 'WO202501150002',
    material_name: '齿轮箱 GBX-200',
    workshop_name: '机加二车间',
    current_operation: '下料待上线',
    next_operation: '粗铣',
    qty: 50,
    status: 'queued',
    hold_owner: '王五',
    freeze_reason: '',
    rework_route: '',
    last_report_time: '2026-07-14 09:20',
    signal: 'normal'
  },
  {
    id: 'wip-4',
    batch_code: 'WIP-20260714-004',
    wo_id: '3',
    wo_code: 'WO202501140003',
    material_name: '离心泵 XJP-200',
    workshop_name: '装配车间',
    current_operation: '返工磨削',
    next_operation: '复检',
    qty: 6,
    status: 'rework',
    hold_owner: '孙八',
    freeze_reason: '',
    rework_route: '异常返工 -> 磨削 -> 复检',
    last_report_time: '2026-07-14 08:45',
    signal: 'attention'
  },
  {
    id: 'wip-5',
    batch_code: 'WIP-20260714-005',
    wo_id: '3',
    wo_code: 'WO202501140003',
    material_name: '离心泵 XJP-200',
    workshop_name: '装配车间',
    current_operation: '完工缓存区',
    next_operation: '完工确认',
    qty: 24,
    status: 'completed',
    hold_owner: '完工岗',
    freeze_reason: '',
    rework_route: '',
    last_report_time: '2026-07-14 07:50',
    signal: 'normal'
  }
]

export const executionExceptionRecords: ExecutionExceptionRecord[] = [
  {
    id: 'exp-1',
    exception_code: 'EX-20260714-001',
    level: 'P1',
    status: 'locked',
    source_object: '首件偏差',
    wo_id: '1',
    wo_code: 'WO202501150001',
    operation_name: '精车',
    workshop_name: '机加一车间',
    lock_scope: 'WIP-20260714-002 / 工序30',
    owner_name: '工艺工程师 周舟',
    collaborator_systems: ['QMS', 'PLM'],
    release_gate: '首件复测通过并完成版本影响确认',
    discovered_at: '2026-07-14 10:50',
    action_summary: '已锁定批次，待复测结果回传'
  },
  {
    id: 'exp-2',
    exception_code: 'EX-20260714-002',
    level: 'P2',
    status: 'processing',
    source_object: '设备抖动',
    wo_id: '2',
    wo_code: 'WO202501150002',
    operation_name: '下料',
    workshop_name: '机加二车间',
    lock_scope: '下料组设备 CNC-02',
    owner_name: '设备员 刘工',
    collaborator_systems: ['IoT', 'MES'],
    release_gate: '设备点检恢复稳定后解除限制',
    discovered_at: '2026-07-14 09:40',
    action_summary: '维修中，任务池保留待执行状态'
  },
  {
    id: 'exp-3',
    exception_code: 'EX-20260714-003',
    level: 'P2',
    status: 'awaiting_release',
    source_object: '返工批次复检',
    wo_id: '3',
    wo_code: 'WO202501140003',
    operation_name: '磨削',
    workshop_name: '装配车间',
    lock_scope: '返工批次 WIP-20260714-004',
    owner_name: '质量工程师 李娜',
    collaborator_systems: ['QMS', 'MES'],
    release_gate: '复检合格后放行回流',
    discovered_at: '2026-07-14 08:20',
    action_summary: '复检结论已出，待异常中心完成放行'
  },
  {
    id: 'exp-4',
    exception_code: 'EX-20260714-004',
    level: 'P3',
    status: 'identified',
    source_object: '缺料预警',
    wo_id: '1',
    wo_code: 'WO202501150001',
    operation_name: '钻孔',
    workshop_name: '机加一车间',
    lock_scope: '待派工任务 OPT-20260714-004',
    owner_name: '计划员 张敏',
    collaborator_systems: ['WMS', 'MES'],
    release_gate: '确认补料到位后允许继续排程',
    discovered_at: '2026-07-14 11:30',
    action_summary: '已识别，不影响当前在制批次'
  }
]

export function cloneSecondBatchData<T>(records: T[]): T[] {
  if (typeof structuredClone === 'function') {
    return structuredClone(records)
  }

  return JSON.parse(JSON.stringify(records)) as T[]
}
