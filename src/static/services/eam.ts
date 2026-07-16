import { generateId } from '@/mock/shared/id'
import { paginate, searchItems } from '@/mock/shared/paginate'
import { wrapCreatedResponse, wrapListResponse, wrapSuccessResponse, wrapUpdatedResponse } from '@/mock/shared/response'

const REFERENCE_TODAY = '2026-07-16'

export type EquipmentAssetStatus = 'running' | 'idle' | 'maintenance' | 'repair'
export type EquipmentCheckType = 'daily' | 'weekly' | 'monthly'
export type EquipmentCheckStatus = 'pending' | 'done' | 'overdue'
export type EquipmentMaintainType = 'daily' | 'weekly' | 'overhaul'
export type EquipmentMaintainStatus = 'pending' | 'done' | 'overdue'
export type EquipmentRepairPriority = 'urgent' | 'high' | 'normal'
export type EquipmentRepairStatus = 'pending' | 'running' | 'done' | 'verified'

export interface EquipmentAssetRecord {
  id: string
  code: string
  name: string
  model: string
  category: string
  workshop: string
  line: string
  owner: string
  location: string
  status: EquipmentAssetStatus
  runtime_hours: number
  last_check_date: string
  next_maintain_date: string
  purchase_date: string
  commission_date: string
}

export interface EquipmentAssetQuery {
  pageNum: number
  pageSize: number
  keyword?: string
  workshop?: string
  status?: EquipmentAssetStatus
}

export interface EquipmentCheckRecord {
  id: string
  code: string
  equipment_id: string
  equipment_code: string
  equipment: string
  check_type: EquipmentCheckType
  plan_date: string
  executor: string
  shift: string
  runtime_hours: number
  last_result: string
  status: EquipmentCheckStatus
}

export interface EquipmentCheckQuery {
  pageNum: number
  pageSize: number
  keyword?: string
  check_type?: EquipmentCheckType
  status?: EquipmentCheckStatus
}

export interface EquipmentMaintainRecord {
  id: string
  code: string
  equipment_id: string
  equipment_code: string
  equipment: string
  type: EquipmentMaintainType
  plan_date: string
  executor: string
  cycle_days: number
  spare_plan: string
  status: EquipmentMaintainStatus
}

export interface EquipmentMaintainQuery {
  pageNum: number
  pageSize: number
  keyword?: string
  type?: EquipmentMaintainType
  status?: EquipmentMaintainStatus
}

export interface EquipmentRepairRecord {
  id: string
  code: string
  equipment_id: string
  equipment_code: string
  equipment: string
  fault_desc: string
  priority: EquipmentRepairPriority
  status: EquipmentRepairStatus
  worker: string
  created_at: string
  source: string
  downtime_minutes: number
  spare_plan: string
}

export interface EquipmentRepairQuery {
  pageNum: number
  pageSize: number
  keyword?: string
  status?: EquipmentRepairStatus
  priority?: EquipmentRepairPriority
}

export const eamWorkshopOptions = [
  { label: '机加一车间', value: '机加一车间' },
  { label: '机加二车间', value: '机加二车间' },
  { label: '装配车间', value: '装配车间' },
  { label: '热处理车间', value: '热处理车间' }
]

export const eamEquipmentStatusOptions = [
  { value: 'running', label: '运行中', type: 'success' as const },
  { value: 'idle', label: '待机', type: 'info' as const },
  { value: 'maintenance', label: '保养中', type: 'warning' as const },
  { value: 'repair', label: '维修中', type: 'danger' as const }
]

export const eamCheckTypeOptions = [
  { label: '日点检', value: 'daily' },
  { label: '周点检', value: 'weekly' },
  { label: '月点检', value: 'monthly' }
]

export const eamCheckStatusOptions = [
  { value: 'pending', label: '待执行', type: 'warning' as const },
  { value: 'done', label: '已完成', type: 'success' as const },
  { value: 'overdue', label: '已逾期', type: 'danger' as const }
]

export const eamMaintainTypeOptions = [
  { label: '日常保养', value: 'daily' },
  { label: '周保养', value: 'weekly' },
  { label: '大修保养', value: 'overhaul' }
]

export const eamMaintainStatusOptions = [
  { value: 'pending', label: '待执行', type: 'warning' as const },
  { value: 'done', label: '已完成', type: 'success' as const },
  { value: 'overdue', label: '已逾期', type: 'danger' as const }
]

export const eamRepairPriorityOptions = [
  { value: 'urgent', label: '紧急', type: 'danger' as const },
  { value: 'high', label: '高', type: 'warning' as const },
  { value: 'normal', label: '普通', type: 'info' as const }
]

export const eamRepairStatusOptions = [
  { value: 'pending', label: '待派工', type: 'warning' as const },
  { value: 'running', label: '维修中', type: 'primary' as const },
  { value: 'done', label: '待验收', type: 'success' as const },
  { value: 'verified', label: '已验收', type: 'info' as const }
]

export const eamDefaultCheckExecuteItems = [
  { name: '设备外观', result: 'normal' },
  { name: '运行声音', result: 'normal' },
  { name: '润滑油位', result: 'normal' },
  { name: '安全防护', result: 'normal' },
  { name: '仪表读数', result: 'normal' }
]

export const eamDefaultMaintainExecuteItems = [
  { name: '清洁设备表面', result: 'done' },
  { name: '检查润滑油', result: 'done' },
  { name: '紧固螺栓', result: 'done' },
  { name: '更换滤芯', result: 'done' },
  { name: '电气检查', result: 'done' }
]

const equipmentAssetState: EquipmentAssetRecord[] = [
  {
    id: 'eam-asset-001',
    code: 'EQ-CK6150-01',
    name: '数控车床 CK6150',
    model: 'CK6150',
    category: '机加设备',
    workshop: '机加一车间',
    line: '车削产线 A',
    owner: '张维保',
    location: 'A-01 工位',
    status: 'running',
    runtime_hours: 5230,
    last_check_date: '2026-07-15',
    next_maintain_date: '2026-07-21',
    purchase_date: '2023-05-18',
    commission_date: '2023-06-02'
  },
  {
    id: 'eam-asset-002',
    code: 'EQ-Z3050-02',
    name: '摇臂钻床 Z3050',
    model: 'Z3050',
    category: '机加设备',
    workshop: '机加二车间',
    line: '钻攻单元 B',
    owner: '刘机修',
    location: 'B-07 工位',
    status: 'idle',
    runtime_hours: 3180,
    last_check_date: '2026-07-14',
    next_maintain_date: '2026-07-24',
    purchase_date: '2022-11-03',
    commission_date: '2022-11-21'
  },
  {
    id: 'eam-asset-003',
    code: 'EQ-M1432-03',
    name: '外圆磨床 M1432',
    model: 'M1432',
    category: '精加工设备',
    workshop: '装配车间',
    line: '磨削单元 C',
    owner: '王点检',
    location: 'C-03 工位',
    status: 'maintenance',
    runtime_hours: 4465,
    last_check_date: '2026-07-13',
    next_maintain_date: '2026-07-16',
    purchase_date: '2021-08-14',
    commission_date: '2021-09-01'
  },
  {
    id: 'eam-asset-004',
    code: 'EQ-HT01-04',
    name: '箱式热处理炉 HT-01',
    model: 'HT-01',
    category: '热处理设备',
    workshop: '热处理车间',
    line: '热处理产线',
    owner: '陈维修',
    location: 'H-02 工位',
    status: 'repair',
    runtime_hours: 6875,
    last_check_date: '2026-07-12',
    next_maintain_date: '2026-07-28',
    purchase_date: '2020-03-26',
    commission_date: '2020-04-15'
  }
]

const equipmentCheckState: EquipmentCheckRecord[] = [
  {
    id: 'eam-check-001',
    code: 'CHK-202607-001',
    equipment_id: 'eam-asset-001',
    equipment_code: 'EQ-CK6150-01',
    equipment: '数控车床 CK6150',
    check_type: 'daily',
    plan_date: '2026-07-16',
    executor: '王点检',
    shift: '白班',
    runtime_hours: 8,
    last_result: '上次点检正常',
    status: 'pending'
  },
  {
    id: 'eam-check-002',
    code: 'CHK-202607-002',
    equipment_id: 'eam-asset-002',
    equipment_code: 'EQ-Z3050-02',
    equipment: '摇臂钻床 Z3050',
    check_type: 'weekly',
    plan_date: '2026-07-14',
    executor: '李班长',
    shift: '白班',
    runtime_hours: 26,
    last_result: '已确认主轴间隙',
    status: 'done'
  },
  {
    id: 'eam-check-003',
    code: 'CHK-202607-003',
    equipment_id: 'eam-asset-004',
    equipment_code: 'EQ-HT01-04',
    equipment: '箱式热处理炉 HT-01',
    check_type: 'daily',
    plan_date: '2026-07-13',
    executor: '周巡检',
    shift: '夜班',
    runtime_hours: 11,
    last_result: '温区波动需跟进',
    status: 'overdue'
  }
]

const equipmentMaintainState: EquipmentMaintainRecord[] = [
  {
    id: 'eam-maintain-001',
    code: 'PM-202607-001',
    equipment_id: 'eam-asset-001',
    equipment_code: 'EQ-CK6150-01',
    equipment: '数控车床 CK6150',
    type: 'daily',
    plan_date: '2026-07-21',
    executor: '张维保',
    cycle_days: 7,
    spare_plan: '润滑油 / 清洁耗材',
    status: 'pending'
  },
  {
    id: 'eam-maintain-002',
    code: 'PM-202607-002',
    equipment_id: 'eam-asset-003',
    equipment_code: 'EQ-M1432-03',
    equipment: '外圆磨床 M1432',
    type: 'weekly',
    plan_date: '2026-07-16',
    executor: '刘机修',
    cycle_days: 14,
    spare_plan: '过滤芯 / 冷却液',
    status: 'pending'
  },
  {
    id: 'eam-maintain-003',
    code: 'PM-202607-003',
    equipment_id: 'eam-asset-002',
    equipment_code: 'EQ-Z3050-02',
    equipment: '摇臂钻床 Z3050',
    type: 'overhaul',
    plan_date: '2026-07-10',
    executor: '孙工',
    cycle_days: 90,
    spare_plan: '轴承 / 密封组件',
    status: 'done'
  }
]

const equipmentRepairState: EquipmentRepairRecord[] = [
  {
    id: 'eam-repair-001',
    code: 'RP-202607-001',
    equipment_id: 'eam-asset-004',
    equipment_code: 'EQ-HT01-04',
    equipment: '箱式热处理炉 HT-01',
    fault_desc: '二区温度异常波动，存在停线风险',
    priority: 'urgent',
    status: 'running',
    worker: '陈维修',
    created_at: '2026-07-15 08:35',
    source: 'IoT 温度告警',
    downtime_minutes: 85,
    spare_plan: '热电偶 / 接线端子'
  },
  {
    id: 'eam-repair-002',
    code: 'RP-202607-002',
    equipment_id: 'eam-asset-003',
    equipment_code: 'EQ-M1432-03',
    equipment: '外圆磨床 M1432',
    fault_desc: '主轴振动偏高，需复核轴承状态',
    priority: 'high',
    status: 'pending',
    worker: '',
    created_at: '2026-07-16 09:20',
    source: 'MES 停机反馈',
    downtime_minutes: 40,
    spare_plan: '主轴轴承'
  },
  {
    id: 'eam-repair-003',
    code: 'RP-202607-003',
    equipment_id: 'eam-asset-001',
    equipment_code: 'EQ-CK6150-01',
    equipment: '数控车床 CK6150',
    fault_desc: '液压单元渗油处理完成，待工艺复机验收',
    priority: 'normal',
    status: 'done',
    worker: '张维保',
    created_at: '2026-07-14 14:10',
    source: '现场巡检',
    downtime_minutes: 25,
    spare_plan: '密封圈'
  }
]

function getTodayString() {
  return REFERENCE_TODAY
}

function buildCode(prefix: string, size: number) {
  return `${prefix}-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${String(size + 1).padStart(3, '0')}`
}

function getEquipmentAsset(equipmentCode?: string) {
  return equipmentAssetState.find((item) => item.code === equipmentCode) || equipmentAssetState[0]
}

function calcCheckStatus(planDate: string, current?: EquipmentCheckStatus) {
  if (current === 'done') return 'done'
  return planDate < getTodayString() ? 'overdue' : 'pending'
}

function calcMaintainStatus(planDate: string, current?: EquipmentMaintainStatus) {
  if (current === 'done') return 'done'
  return planDate < getTodayString() ? 'overdue' : 'pending'
}

function syncEquipmentStatus(code: string, status: EquipmentAssetStatus) {
  const asset = equipmentAssetState.find((item) => item.code === code)
  if (asset) {
    asset.status = status
  }
}

function normalizeEquipmentAsset(data: Partial<EquipmentAssetRecord>, current?: EquipmentAssetRecord): EquipmentAssetRecord {
  return {
    id: current?.id || data.id || generateId(),
    code: data.code || current?.code || buildCode('EQ', equipmentAssetState.length),
    name: data.name || current?.name || '',
    model: data.model || current?.model || '',
    category: data.category || current?.category || '设备资产',
    workshop: data.workshop || current?.workshop || eamWorkshopOptions[0]?.value || '',
    line: data.line || current?.line || '设备运维单元',
    owner: data.owner || current?.owner || '设备管理员',
    location: data.location || current?.location || '未分配工位',
    status: (data.status || current?.status || 'running') as EquipmentAssetStatus,
    runtime_hours: Number(data.runtime_hours ?? current?.runtime_hours ?? 0),
    last_check_date: data.last_check_date || current?.last_check_date || getTodayString(),
    next_maintain_date: data.next_maintain_date || current?.next_maintain_date || getTodayString(),
    purchase_date: data.purchase_date || current?.purchase_date || getTodayString(),
    commission_date: data.commission_date || current?.commission_date || getTodayString()
  }
}

function normalizeEquipmentCheck(data: Partial<EquipmentCheckRecord>, current?: EquipmentCheckRecord): EquipmentCheckRecord {
  const asset = getEquipmentAsset(data.equipment_code || current?.equipment_code)
  const planDate = data.plan_date || current?.plan_date || getTodayString()

  return {
    id: current?.id || data.id || generateId(),
    code: data.code || current?.code || buildCode('CHK', equipmentCheckState.length),
    equipment_id: asset.id,
    equipment_code: asset.code,
    equipment: asset.name,
    check_type: (data.check_type || current?.check_type || 'daily') as EquipmentCheckType,
    plan_date: planDate,
    executor: data.executor || current?.executor || asset.owner,
    shift: data.shift || current?.shift || '白班',
    runtime_hours: Number(data.runtime_hours ?? current?.runtime_hours ?? Math.max(Math.round(asset.runtime_hours / 30), 1)),
    last_result: data.last_result || current?.last_result || '待执行本次点检',
    status: calcCheckStatus(planDate, (data.status || current?.status) as EquipmentCheckStatus | undefined)
  }
}

function normalizeEquipmentMaintain(data: Partial<EquipmentMaintainRecord>, current?: EquipmentMaintainRecord): EquipmentMaintainRecord {
  const asset = getEquipmentAsset(data.equipment_code || current?.equipment_code)
  const planDate = data.plan_date || current?.plan_date || getTodayString()

  return {
    id: current?.id || data.id || generateId(),
    code: data.code || current?.code || buildCode('PM', equipmentMaintainState.length),
    equipment_id: asset.id,
    equipment_code: asset.code,
    equipment: asset.name,
    type: (data.type || current?.type || 'daily') as EquipmentMaintainType,
    plan_date: planDate,
    executor: data.executor || current?.executor || asset.owner,
    cycle_days: Number(data.cycle_days ?? current?.cycle_days ?? 7),
    spare_plan: data.spare_plan || current?.spare_plan || '常规保养耗材',
    status: calcMaintainStatus(planDate, (data.status || current?.status) as EquipmentMaintainStatus | undefined)
  }
}

function normalizeEquipmentRepair(data: Partial<EquipmentRepairRecord>, current?: EquipmentRepairRecord): EquipmentRepairRecord {
  const asset = getEquipmentAsset(data.equipment_code || current?.equipment_code)

  return {
    id: current?.id || data.id || generateId(),
    code: data.code || current?.code || buildCode('RP', equipmentRepairState.length),
    equipment_id: asset.id,
    equipment_code: asset.code,
    equipment: asset.name,
    fault_desc: data.fault_desc || current?.fault_desc || '',
    priority: (data.priority || current?.priority || 'normal') as EquipmentRepairPriority,
    status: (data.status || current?.status || 'pending') as EquipmentRepairStatus,
    worker: data.worker || current?.worker || '',
    created_at: data.created_at || current?.created_at || `${getTodayString()} 08:00`,
    source: data.source || current?.source || '现场报修',
    downtime_minutes: Number(data.downtime_minutes ?? current?.downtime_minutes ?? 0),
    spare_plan: data.spare_plan || current?.spare_plan || '待评估'
  }
}

function filterEquipmentAssets(params: Omit<EquipmentAssetQuery, 'pageNum' | 'pageSize'>) {
  let filtered = [...equipmentAssetState]

  if (params.keyword) {
    filtered = searchItems(filtered, params.keyword, ['code', 'name', 'model', 'category', 'line', 'location'])
  }
  if (params.workshop) {
    filtered = filtered.filter((item) => item.workshop === params.workshop)
  }
  if (params.status) {
    filtered = filtered.filter((item) => item.status === params.status)
  }

  return filtered
}

function filterEquipmentChecks(params: Omit<EquipmentCheckQuery, 'pageNum' | 'pageSize'>) {
  let filtered = [...equipmentCheckState]

  if (params.keyword) {
    filtered = searchItems(filtered, params.keyword, ['code', 'equipment', 'equipment_code', 'executor', 'last_result'])
  }
  if (params.check_type) {
    filtered = filtered.filter((item) => item.check_type === params.check_type)
  }
  if (params.status) {
    filtered = filtered.filter((item) => item.status === params.status)
  }

  return filtered
}

function filterEquipmentMaintains(params: Omit<EquipmentMaintainQuery, 'pageNum' | 'pageSize'>) {
  let filtered = [...equipmentMaintainState]

  if (params.keyword) {
    filtered = searchItems(filtered, params.keyword, ['code', 'equipment', 'equipment_code', 'executor', 'spare_plan'])
  }
  if (params.type) {
    filtered = filtered.filter((item) => item.type === params.type)
  }
  if (params.status) {
    filtered = filtered.filter((item) => item.status === params.status)
  }

  return filtered
}

function filterEquipmentRepairs(params: Omit<EquipmentRepairQuery, 'pageNum' | 'pageSize'>) {
  let filtered = [...equipmentRepairState]

  if (params.keyword) {
    filtered = searchItems(filtered, params.keyword, ['code', 'equipment', 'equipment_code', 'fault_desc', 'source'])
  }
  if (params.status) {
    filtered = filtered.filter((item) => item.status === params.status)
  }
  if (params.priority) {
    filtered = filtered.filter((item) => item.priority === params.priority)
  }

  return filtered
}

export function getEquipmentAssetOptions() {
  return equipmentAssetState.map((item) => ({
    label: `${item.name} (${item.code})`,
    value: item.code
  }))
}

export async function getEquipmentList(params: EquipmentAssetQuery) {
  const filtered = filterEquipmentAssets(params)
  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function createEquipment(data: Partial<EquipmentAssetRecord>) {
  const record = normalizeEquipmentAsset(data)
  equipmentAssetState.unshift(record)
  return wrapCreatedResponse(record, '设备资产已新增')
}

export async function updateEquipment(id: string, data: Partial<EquipmentAssetRecord>) {
  const index = equipmentAssetState.findIndex((item) => item.id === id)
  if (index >= 0) {
    equipmentAssetState[index] = normalizeEquipmentAsset(data, equipmentAssetState[index])
    return wrapUpdatedResponse(equipmentAssetState[index], '设备资产已更新')
  }

  return wrapUpdatedResponse(normalizeEquipmentAsset(data), '设备资产已更新')
}

export async function deleteEquipment(id: string) {
  const index = equipmentAssetState.findIndex((item) => item.id === id)
  if (index >= 0) {
    equipmentAssetState.splice(index, 1)
  }

  return wrapSuccessResponse('设备资产已删除')
}

export async function getEquipmentCheckList(params: EquipmentCheckQuery) {
  const filtered = filterEquipmentChecks(params)
  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function saveEquipmentCheck(data: Partial<EquipmentCheckRecord>) {
  const index = equipmentCheckState.findIndex((item) => item.id === data.id)
  const record = normalizeEquipmentCheck(data, index >= 0 ? equipmentCheckState[index] : undefined)

  if (index >= 0) {
    equipmentCheckState[index] = record
    return wrapUpdatedResponse(record, '点检计划已更新')
  }

  equipmentCheckState.unshift(record)
  return wrapCreatedResponse(record, '点检计划已新增')
}

export async function executeEquipmentCheck(id: string, data?: { remark?: string }) {
  const target = equipmentCheckState.find((item) => item.id === id)
  if (target) {
    target.status = 'done'
    target.last_result = data?.remark || '点检完成，设备状态正常'
    const asset = equipmentAssetState.find((item) => item.code === target.equipment_code)
    if (asset) {
      asset.last_check_date = getTodayString()
      if (asset.status !== 'maintenance' && asset.status !== 'repair') {
        asset.status = 'running'
      }
    }
  }

  return wrapSuccessResponse('点检执行已完成')
}

export async function deleteEquipmentCheck(id: string) {
  const index = equipmentCheckState.findIndex((item) => item.id === id)
  if (index >= 0) {
    equipmentCheckState.splice(index, 1)
  }

  return wrapSuccessResponse('点检计划已删除')
}

export async function getEquipmentMaintainList(params: EquipmentMaintainQuery) {
  const filtered = filterEquipmentMaintains(params)
  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function saveEquipmentMaintain(data: Partial<EquipmentMaintainRecord>) {
  const index = equipmentMaintainState.findIndex((item) => item.id === data.id)
  const record = normalizeEquipmentMaintain(data, index >= 0 ? equipmentMaintainState[index] : undefined)

  if (index >= 0) {
    equipmentMaintainState[index] = record
    return wrapUpdatedResponse(record, '保养计划已更新')
  }

  equipmentMaintainState.unshift(record)
  return wrapCreatedResponse(record, '保养计划已新增')
}

export async function executeEquipmentMaintain(id: string, data?: { remark?: string }) {
  const target = equipmentMaintainState.find((item) => item.id === id)
  if (target) {
    target.status = 'done'
    target.spare_plan = data?.remark ? `${target.spare_plan} / ${data.remark}` : target.spare_plan
    const asset = equipmentAssetState.find((item) => item.code === target.equipment_code)
    if (asset) {
      asset.next_maintain_date = target.plan_date
      syncEquipmentStatus(asset.code, 'running')
    }
  }

  return wrapSuccessResponse('保养执行已完成')
}

export async function deleteEquipmentMaintain(id: string) {
  const index = equipmentMaintainState.findIndex((item) => item.id === id)
  if (index >= 0) {
    equipmentMaintainState.splice(index, 1)
  }

  return wrapSuccessResponse('保养计划已删除')
}

export async function getEquipmentRepairList(params: EquipmentRepairQuery) {
  const filtered = filterEquipmentRepairs(params)
  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function saveEquipmentRepair(data: Partial<EquipmentRepairRecord>) {
  const index = equipmentRepairState.findIndex((item) => item.id === data.id)
  const record = normalizeEquipmentRepair(data, index >= 0 ? equipmentRepairState[index] : undefined)

  if (index >= 0) {
    equipmentRepairState[index] = record
    return wrapUpdatedResponse(record, '维修工单已更新')
  }

  equipmentRepairState.unshift(record)
  syncEquipmentStatus(record.equipment_code, 'repair')
  return wrapCreatedResponse(record, '维修工单已新增')
}

export async function updateEquipmentRepairStatus(
  id: string,
  data: Partial<Pick<EquipmentRepairRecord, 'status' | 'worker' | 'downtime_minutes' | 'spare_plan'>>
) {
  const target = equipmentRepairState.find((item) => item.id === id)
  if (target) {
    if (data.status) {
      target.status = data.status
    }
    if (typeof data.worker === 'string') {
      target.worker = data.worker
    }
    if (typeof data.downtime_minutes === 'number') {
      target.downtime_minutes = data.downtime_minutes
    }
    if (typeof data.spare_plan === 'string') {
      target.spare_plan = data.spare_plan
    }

    if (target.status === 'pending' || target.status === 'running') {
      syncEquipmentStatus(target.equipment_code, 'repair')
    } else if (target.status === 'done') {
      syncEquipmentStatus(target.equipment_code, 'maintenance')
    } else if (target.status === 'verified') {
      syncEquipmentStatus(target.equipment_code, 'running')
    }

    return wrapUpdatedResponse(target, '维修工单状态已更新')
  }

  return wrapUpdatedResponse(null, '维修工单状态已更新')
}

export async function deleteEquipmentRepair(id: string) {
  const index = equipmentRepairState.findIndex((item) => item.id === id)
  if (index >= 0) {
    const [removed] = equipmentRepairState.splice(index, 1)
    syncEquipmentStatus(removed.equipment_code, 'running')
  }

  return wrapSuccessResponse('维修工单已删除')
}
