import type { StatusOption } from '@/components/StatusTag.vue'

export const REWORK_STATUS_OPTIONS: StatusOption[] = [
  { value: 'pending_decision', label: '待裁决', type: 'info' },
  { value: 'released', label: '已放行', type: 'primary' },
  { value: 'executing', label: '返工中', type: 'warning' },
  { value: 'pending_recheck', label: '待复检', type: 'danger' },
  { value: 'closed', label: '已关闭', type: 'success' }
]

export const REWORK_PRIORITY_OPTIONS: StatusOption[] = [
  { value: 'high', label: '高优先', type: 'danger' },
  { value: 'normal', label: '普通', type: 'warning' },
  { value: 'low', label: '低优先', type: 'info' }
]

export interface ReworkOrderRecord {
  id: string
  rework_code: string
  status: 'pending_decision' | 'released' | 'executing' | 'pending_recheck' | 'closed'
  priority: 'high' | 'normal' | 'low'
  source_type: string
  source_code: string
  wo_code: string
  material_name: string
  workshop_name: string
  qms_decision_ref: string
  rework_route: string
  current_step: string
  owner_name: string
  planned_finish: string
  recheck_owner: string
  close_note: string
}

export const reworkOrderRecords: ReworkOrderRecord[] = [
  {
    id: 'rw-1',
    rework_code: 'RW-20260714-001',
    status: 'executing',
    priority: 'high',
    source_type: '执行异常',
    source_code: 'EX-20260714-001',
    wo_code: 'WO202501150001',
    material_name: '离心泵 XJP-100',
    workshop_name: '机加一车间',
    qms_decision_ref: 'QMS-RWK-240714-001',
    rework_route: '首件复核 -> 精车返修 -> 复检放行',
    current_step: '精车返修中',
    owner_name: '返工组 赵六',
    planned_finish: '2026-07-14 18:30',
    recheck_owner: '质量工程师 李娜',
    close_note: '待复检通过后关闭'
  },
  {
    id: 'rw-2',
    rework_code: 'RW-20260714-002',
    status: 'released',
    priority: 'normal',
    source_type: '质量不合格',
    source_code: 'NCR-20260714-004',
    wo_code: 'WO202501140003',
    material_name: '离心泵 XJP-200',
    workshop_name: '装配车间',
    qms_decision_ref: 'QMS-RWK-240714-003',
    rework_route: '磨削返工 -> 外观修整 -> 复检',
    current_step: '待返工班组接收',
    owner_name: '返工组 孙八',
    planned_finish: '2026-07-14 17:00',
    recheck_owner: '质检员 刘梅',
    close_note: '返工已放行，待正式执行'
  },
  {
    id: 'rw-3',
    rework_code: 'RW-20260714-003',
    status: 'pending_recheck',
    priority: 'normal',
    source_type: '投料偏差',
    source_code: 'MAT-20260714-001',
    wo_code: 'WO202501150001',
    material_name: '离心泵 XJP-100',
    workshop_name: '机加一车间',
    qms_decision_ref: 'QMS-RWK-240714-006',
    rework_route: '补料修正 -> 工序补报 -> 复检确认',
    current_step: '返工完成，等待复检',
    owner_name: '物料返工岗 何琳',
    planned_finish: '2026-07-14 16:00',
    recheck_owner: '质量工程师 李娜',
    close_note: '待复检结果回传'
  },
  {
    id: 'rw-4',
    rework_code: 'RW-20260714-004',
    status: 'pending_decision',
    priority: 'low',
    source_type: '返修申请',
    source_code: 'REQ-20260714-011',
    wo_code: 'WO202501130004',
    material_name: '新型泵 NP-001',
    workshop_name: '装配车间',
    qms_decision_ref: '待 QMS 裁决',
    rework_route: '待确认是否允许返工',
    current_step: '等待质量裁决',
    owner_name: '样件组 赵晨',
    planned_finish: '2026-07-15 10:00',
    recheck_owner: '质量工程师 李娜',
    close_note: '未裁决前不进入执行'
  }
]

export function cloneFifthBatchData<T>(records: T[]): T[] {
  if (typeof structuredClone === 'function') {
    return structuredClone(records)
  }

  return JSON.parse(JSON.stringify(records)) as T[]
}
