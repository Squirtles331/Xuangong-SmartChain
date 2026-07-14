import type { StatusOption } from '@/components/StatusTag.vue'

export const KITTING_STATUS_OPTIONS: StatusOption[] = [
  { value: 'collecting', label: '收集中', type: 'info' },
  { value: 'ready', label: '已就绪', type: 'primary' },
  { value: 'blocked', label: '已阻塞', type: 'danger' },
  { value: 'released', label: '已放行', type: 'success' }
]

export const READINESS_SIGNAL_OPTIONS: StatusOption[] = [
  { value: 'ready', label: '已满足', type: 'success' },
  { value: 'warning', label: '待确认', type: 'warning' },
  { value: 'blocked', label: '已阻塞', type: 'danger' }
]

export const CONSUMPTION_STATUS_OPTIONS: StatusOption[] = [
  { value: 'draft', label: '待执行', type: 'info' },
  { value: 'in_use', label: '使用中', type: 'warning' },
  { value: 'reconciled', label: '已对账', type: 'primary' },
  { value: 'closed', label: '已关闭', type: 'success' }
]

export const CONSUMPTION_VARIANCE_OPTIONS: StatusOption[] = [
  { value: 'normal', label: '正常', type: 'success' },
  { value: 'over', label: '超耗', type: 'danger' },
  { value: 'under', label: '欠耗', type: 'warning' }
]

export interface KittingRecord {
  id: string
  release_code: string
  wo_id: string
  wo_code: string
  material_name: string
  workshop_name: string
  line_name: string
  planned_start: string
  bom_version: string
  routing_version: string
  material_signal: 'ready' | 'warning' | 'blocked'
  version_signal: 'ready' | 'warning' | 'blocked'
  batch_signal: 'ready' | 'warning' | 'blocked'
  quality_signal: 'ready' | 'warning' | 'blocked'
  status: 'collecting' | 'ready' | 'blocked' | 'released'
  blocker_reason: string
  release_owner: string
  release_note: string
}

export interface ConsumptionRecord {
  id: string
  record_code: string
  wo_id: string
  wo_code: string
  material_code: string
  material_name: string
  workshop_name: string
  operation_name: string
  batch_code: string
  planned_qty: number
  actual_qty: number
  unit: string
  variance_type: 'normal' | 'over' | 'under'
  variance_qty: number
  status: 'draft' | 'in_use' | 'reconciled' | 'closed'
  warehouse_ref: string
  supplement_ref: string
  substitute_ref: string
  recorder: string
  last_time: string
}

export const kittingRecords: KittingRecord[] = [
  {
    id: 'kit-1',
    release_code: 'KIT-20260714-001',
    wo_id: '1',
    wo_code: 'WO202501150001',
    material_name: '离心泵 XJP-100',
    workshop_name: '机加一车间',
    line_name: '产线A',
    planned_start: '2026-07-14 13:30',
    bom_version: 'EBOM V2.1',
    routing_version: '标准工艺 V1.1',
    material_signal: 'ready',
    version_signal: 'ready',
    batch_signal: 'blocked',
    quality_signal: 'warning',
    status: 'blocked',
    blocker_reason: '关键来料批次待复核，首件放行未完成',
    release_owner: '工艺工程师 周舟',
    release_note: '待异常中心解除首件限制后再放行'
  },
  {
    id: 'kit-2',
    release_code: 'KIT-20260714-002',
    wo_id: '2',
    wo_code: 'WO202501150002',
    material_name: '齿轮箱 GBX-200',
    workshop_name: '机加二车间',
    line_name: '产线B',
    planned_start: '2026-07-14 14:00',
    bom_version: 'EBOM V1.4',
    routing_version: '标准工艺 V1.0',
    material_signal: 'ready',
    version_signal: 'ready',
    batch_signal: 'ready',
    quality_signal: 'ready',
    status: 'ready',
    blocker_reason: '',
    release_owner: '计划员 张敏',
    release_note: '满足开工条件，可进入放行确认'
  },
  {
    id: 'kit-3',
    release_code: 'KIT-20260714-003',
    wo_id: '3',
    wo_code: 'WO202501140003',
    material_name: '离心泵 XJP-200',
    workshop_name: '装配车间',
    line_name: '产线C',
    planned_start: '2026-07-14 08:30',
    bom_version: 'EBOM V2.0',
    routing_version: '返工工艺 V1.0',
    material_signal: 'ready',
    version_signal: 'ready',
    batch_signal: 'ready',
    quality_signal: 'ready',
    status: 'released',
    blocker_reason: '',
    release_owner: '质量工程师 李娜',
    release_note: '返工批次已获放行，允许继续执行'
  },
  {
    id: 'kit-4',
    release_code: 'KIT-20260714-004',
    wo_id: '4',
    wo_code: 'WO202501130004',
    material_name: '新型泵 NP-001',
    workshop_name: '装配车间',
    line_name: '样件线',
    planned_start: '2026-07-15 09:00',
    bom_version: '试制 BOM V0.9',
    routing_version: '试制工艺 V0.8',
    material_signal: 'warning',
    version_signal: 'warning',
    batch_signal: 'warning',
    quality_signal: 'warning',
    status: 'collecting',
    blocker_reason: '样件版本、备料和试制放行资料仍在收集',
    release_owner: '研发工艺 赵晨',
    release_note: '需补齐版本与来料确认后再进入就绪'
  }
]

export const consumptionRecords: ConsumptionRecord[] = [
  {
    id: 'con-1',
    record_code: 'MAT-20260714-001',
    wo_id: '1',
    wo_code: 'WO202501150001',
    material_code: '04.01.001-00001-A',
    material_name: '泵体毛坯',
    workshop_name: '机加一车间',
    operation_name: '精车',
    batch_code: 'LOT-240714-01',
    planned_qty: 50,
    actual_qty: 52,
    unit: '件',
    variance_type: 'over',
    variance_qty: 2,
    status: 'in_use',
    warehouse_ref: 'WMS-ISSUE-240714-001',
    supplement_ref: '补料单 BL-240714-002',
    substitute_ref: '',
    recorder: '赵六',
    last_time: '2026-07-14 10:20'
  },
  {
    id: 'con-2',
    record_code: 'MAT-20260714-002',
    wo_id: '2',
    wo_code: 'WO202501150002',
    material_code: '04.02.001-00003',
    material_name: '齿轮坯料',
    workshop_name: '机加二车间',
    operation_name: '下料',
    batch_code: 'LOT-240714-08',
    planned_qty: 50,
    actual_qty: 50,
    unit: '件',
    variance_type: 'normal',
    variance_qty: 0,
    status: 'reconciled',
    warehouse_ref: 'WMS-ISSUE-240714-006',
    supplement_ref: '',
    substitute_ref: '',
    recorder: '王五',
    last_time: '2026-07-14 09:50'
  },
  {
    id: 'con-3',
    record_code: 'MAT-20260714-003',
    wo_id: '3',
    wo_code: 'WO202501140003',
    material_code: '04.01.002-00008',
    material_name: '返工磨削耗材',
    workshop_name: '装配车间',
    operation_name: '磨削',
    batch_code: 'LOT-240714-11',
    planned_qty: 12,
    actual_qty: 10,
    unit: '包',
    variance_type: 'under',
    variance_qty: 2,
    status: 'draft',
    warehouse_ref: 'WMS-ISSUE-240714-010',
    supplement_ref: '',
    substitute_ref: '替代料 TD-240714-001',
    recorder: '孙八',
    last_time: '2026-07-14 08:30'
  },
  {
    id: 'con-4',
    record_code: 'MAT-20260714-004',
    wo_id: '1',
    wo_code: 'WO202501150001',
    material_code: '04.01.001-00009',
    material_name: '钻孔冷却液',
    workshop_name: '机加一车间',
    operation_name: '钻孔',
    batch_code: 'LOT-240714-15',
    planned_qty: 6,
    actual_qty: 6,
    unit: '桶',
    variance_type: 'normal',
    variance_qty: 0,
    status: 'closed',
    warehouse_ref: 'WMS-ISSUE-240714-014',
    supplement_ref: '',
    substitute_ref: '',
    recorder: '辅料岗 何琳',
    last_time: '2026-07-14 11:00'
  }
]

export function cloneThirdBatchData<T>(records: T[]): T[] {
  if (typeof structuredClone === 'function') {
    return structuredClone(records)
  }

  return JSON.parse(JSON.stringify(records)) as T[]
}
