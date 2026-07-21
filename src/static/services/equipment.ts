import { generateId } from '@/static/utils/id'
import { paginate, searchItems } from '@/static/utils/paginate'
import { wrapCreatedResponse, wrapDetailResponse, wrapListResponse, wrapUpdatedResponse } from '@/static/utils/response'

const oeeOverview = {
  cards: [
    { title: 'OEE', value: 78.5 },
    { title: 'Utilization', value: 85.2 },
    { title: 'Performance', value: 92.1 },
    { title: 'Quality', value: 98.3 }
  ],
  rankData: [
    { equipment: 'CNC Lathe CK6150', oee: '85.2%', utilization: '90.1%', performance: '95.0%', quality: '99.5%' },
    { equipment: 'Drill Z3050', oee: '78.6%', utilization: '82.3%', performance: '93.5%', quality: '98.2%' },
    { equipment: 'Grinder M1432', oee: '72.1%', utilization: '75.0%', performance: '90.2%', quality: '97.8%' },
    { equipment: 'Machining Center VMC850', oee: '80.5%', utilization: '88.0%', performance: '92.8%', quality: '98.8%' }
  ],
  trendData: {
    months: ['01', '02', '03', '04', '05', '06'],
    oee: [75, 76, 78, 77, 79, 78.5],
    utilization: [82, 84, 85, 83, 86, 85.2],
    performance: [90, 91, 92, 91, 93, 92.1],
    quality: [97, 98, 97.5, 98.2, 98.5, 98.3]
  }
}

const repairs = [
  {
    id: 'repair-1',
    code: 'WX202606300001',
    equipment: 'CNC Lathe CK6150',
    fault_desc: 'Spindle noise requires bearing inspection.',
    priority: 'high' as const,
    status: 'pending' as const,
    worker: '',
    created_at: '2026-06-30 09:20:00'
  },
  {
    id: 'repair-2',
    code: 'WX202606280002',
    equipment: 'Drill Z3050',
    fault_desc: 'Hydraulic pressure fluctuates.',
    priority: 'urgent' as const,
    status: 'running' as const,
    worker: 'Zhang Repair',
    created_at: '2026-06-28 14:10:00'
  },
  {
    id: 'repair-3',
    code: 'WX202606260003',
    equipment: 'Grinder M1432',
    fault_desc: 'Guide rail lubrication completed and rechecked.',
    priority: 'normal' as const,
    status: 'done' as const,
    worker: 'Li Repair',
    created_at: '2026-06-26 11:30:00'
  }
]

const maintains = [
  {
    id: 'maintain-1',
    code: 'BY202606300001',
    equipment: 'CNC Lathe CK6150',
    type: 'daily' as const,
    plan_date: '2026-07-01',
    executor: 'Wang Maintain',
    status: 'pending' as const
  },
  {
    id: 'maintain-2',
    code: 'BY202606280002',
    equipment: 'Drill Z3050',
    type: 'weekly' as const,
    plan_date: '2026-06-29',
    executor: 'Zhang Maintain',
    status: 'done' as const
  },
  {
    id: 'maintain-3',
    code: 'BY202606250003',
    equipment: 'Grinder M1432',
    type: 'overhaul' as const,
    plan_date: '2026-06-20',
    executor: 'Li Maintain',
    status: 'overdue' as const
  }
]

const checks = [
  {
    id: 'check-1',
    code: 'DJ202606300001',
    equipment: 'CNC Lathe CK6150',
    check_type: '日点检' as const,
    plan_date: '2026-07-01',
    executor: 'Zhao Check',
    status: 'pending' as const
  },
  {
    id: 'check-2',
    code: 'DJ202606280002',
    equipment: 'Drill Z3050',
    check_type: '周点检' as const,
    plan_date: '2026-06-28',
    executor: 'Qian Check',
    status: 'done' as const
  },
  {
    id: 'check-3',
    code: 'DJ202606250003',
    equipment: 'Grinder M1432',
    check_type: '月点检' as const,
    plan_date: '2026-06-20',
    executor: 'Sun Check',
    status: 'overdue' as const
  }
]

const spares = [
  {
    id: 'spare-1',
    code: 'PJ202606300001',
    name: 'Spindle Bearing',
    spec: '6208-2RS',
    applicable_equipment: 'CNC Lathe CK6150',
    qty: 8,
    safety: 5,
    unit: 'set',
    location: 'A-01-01'
  },
  {
    id: 'spare-2',
    code: 'PJ202606280002',
    name: 'Hydraulic Filter',
    spec: 'HF-20',
    applicable_equipment: 'Drill Z3050',
    qty: 3,
    safety: 5,
    unit: 'pcs',
    location: 'A-01-02'
  },
  {
    id: 'spare-3',
    code: 'PJ202606250003',
    name: 'Rail Dust Cover',
    spec: 'FCZ-M1432',
    applicable_equipment: 'Grinder M1432',
    qty: 0,
    safety: 2,
    unit: 'pcs',
    location: 'B-02-03'
  }
]

function sequenceCode(prefix: string, size: number) {
  return `${prefix}${new Date().toISOString().slice(0, 10).replace(/-/g, '')}${String(size + 1).padStart(4, '0')}`
}

function buildTrend(startMonth: number, endMonth: number) {
  const baseMonths = oeeOverview.trendData.months
  const indexes = baseMonths
    .map((month, index) => ({ month: Number(month), index }))
    .filter((item) => item.month >= startMonth && item.month <= endMonth)
    .map((item) => item.index)
  const matchedIndexes = indexes.length ? indexes : baseMonths.map((_month, index) => index)

  return {
    months: matchedIndexes.map((index) => `${oeeOverview.trendData.months[index]}月`),
    oee: matchedIndexes.map((index) => oeeOverview.trendData.oee[index]),
    utilization: matchedIndexes.map((index) => oeeOverview.trendData.utilization[index]),
    performance: matchedIndexes.map((index) => oeeOverview.trendData.performance[index]),
    quality: matchedIndexes.map((index) => oeeOverview.trendData.quality[index])
  }
}

export async function getEquipmentOeeOverview(params?: { start_month?: string; end_month?: string }) {
  const startMonth = params?.start_month ? Number(params.start_month.split('-')[1]) : 1
  const endMonth = params?.end_month ? Number(params.end_month.split('-')[1]) : 6

  return wrapDetailResponse({
    cards: oeeOverview.cards,
    rankData: oeeOverview.rankData,
    trendData: buildTrend(startMonth, endMonth)
  })
}

export async function getEquipmentRepairList(params: { pageNum: number; pageSize: number; keyword?: string; status?: string; priority?: string }) {
  let filtered = [...repairs]

  if (params.keyword) filtered = searchItems(filtered, params.keyword, ['code', 'equipment', 'fault_desc'])
  if (params.status) filtered = filtered.filter((item) => item.status === params.status)
  if (params.priority) filtered = filtered.filter((item) => item.priority === params.priority)

  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function saveEquipmentRepair(data: any) {
  const payload = {
    id: data.id || generateId('repair'),
    code: data.code || sequenceCode('WX', repairs.length),
    equipment: data.equipment || '',
    fault_desc: data.fault_desc || '',
    priority: data.priority || 'normal',
    status: data.status || 'pending',
    worker: data.worker || '',
    created_at: data.created_at || new Date().toISOString().slice(0, 19).replace('T', ' ')
  }

  const index = repairs.findIndex((item) => item.id === payload.id)

  if (index > -1) {
    repairs[index] = { ...repairs[index], ...payload }
    return wrapUpdatedResponse(repairs[index], 'Repair order updated')
  }

  repairs.unshift(payload)
  return wrapCreatedResponse(payload, 'Repair order created')
}

export async function updateEquipmentRepairStatus(id: string, data: { status: string; worker?: string }) {
  const target = repairs.find((item) => item.id === id)

  if (target) {
    target.status = data.status as any
    if (data.worker !== undefined) target.worker = data.worker
  }

  return wrapUpdatedResponse(target || { id, ...data }, 'Repair status updated')
}

export async function getEquipmentMaintainList(params: { pageNum: number; pageSize: number; keyword?: string; type?: string; status?: string }) {
  let filtered = [...maintains]

  if (params.keyword) filtered = searchItems(filtered, params.keyword, ['code', 'equipment'])
  if (params.type) filtered = filtered.filter((item) => item.type === params.type)
  if (params.status) filtered = filtered.filter((item) => item.status === params.status)

  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function saveEquipmentMaintain(data: any) {
  const payload = {
    id: data.id || generateId('maintain'),
    code: data.code || sequenceCode('BY', maintains.length),
    equipment: data.equipment || '',
    type: data.type || 'daily',
    plan_date: data.plan_date || '',
    executor: data.executor || '',
    status: data.status || 'pending'
  }

  const index = maintains.findIndex((item) => item.id === payload.id)

  if (index > -1) {
    maintains[index] = { ...maintains[index], ...payload }
    return wrapUpdatedResponse(maintains[index], 'Maintain plan updated')
  }

  maintains.unshift(payload)
  return wrapCreatedResponse(payload, 'Maintain plan created')
}

export async function executeEquipmentMaintain(id: string, _data: { remark?: string }) {
  const target = maintains.find((item) => item.id === id)

  if (target) {
    target.status = 'done'
  }

  return wrapUpdatedResponse(target || { id }, 'Maintain plan executed')
}

export async function getEquipmentCheckList(params: { pageNum: number; pageSize: number; keyword?: string; check_type?: string; status?: string }) {
  let filtered = [...checks]

  if (params.keyword) filtered = searchItems(filtered, params.keyword, ['code', 'equipment'])
  if (params.check_type) filtered = filtered.filter((item) => item.check_type === params.check_type)
  if (params.status) filtered = filtered.filter((item) => item.status === params.status)

  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function saveEquipmentCheck(data: any) {
  const payload = {
    id: data.id || generateId('check'),
    code: data.code || sequenceCode('DJ', checks.length),
    equipment: data.equipment || '',
    check_type: data.check_type || '日点检',
    plan_date: data.plan_date || '',
    executor: data.executor || '',
    status: data.status || 'pending'
  }

  const index = checks.findIndex((item) => item.id === payload.id)

  if (index > -1) {
    checks[index] = { ...checks[index], ...payload }
    return wrapUpdatedResponse(checks[index], 'Check plan updated')
  }

  checks.unshift(payload)
  return wrapCreatedResponse(payload, 'Check plan created')
}

export async function executeEquipmentCheck(id: string, _data: { remark?: string }) {
  const target = checks.find((item) => item.id === id)

  if (target) {
    target.status = 'done'
  }

  return wrapUpdatedResponse(target || { id }, 'Check plan executed')
}

export async function getEquipmentSpareList(params: { pageNum: number; pageSize: number; keyword?: string; stock_status?: string }) {
  let filtered = [...spares]

  if (params.keyword) filtered = searchItems(filtered, params.keyword, ['code', 'name', 'spec', 'applicable_equipment'])
  if (params.stock_status === 'ok') filtered = filtered.filter((item) => item.qty > item.safety)
  if (params.stock_status === 'low') filtered = filtered.filter((item) => item.qty > 0 && item.qty <= item.safety)
  if (params.stock_status === 'out') filtered = filtered.filter((item) => item.qty <= 0)

  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function saveEquipmentSpare(data: any) {
  const payload = {
    id: data.id || generateId('spare'),
    code: data.code || sequenceCode('PJ', spares.length),
    name: data.name || '',
    spec: data.spec || '',
    applicable_equipment: data.applicable_equipment || '',
    qty: Number(data.qty ?? 0),
    safety: Number(data.safety ?? 0),
    unit: data.unit || 'pcs',
    location: data.location || ''
  }

  const index = spares.findIndex((item) => item.id === payload.id)

  if (index > -1) {
    spares[index] = { ...spares[index], ...payload }
    return wrapUpdatedResponse(spares[index], 'Spare updated')
  }

  spares.unshift(payload)
  return wrapCreatedResponse(payload, 'Spare created')
}

export async function updateEquipmentSpareQty(id: string, delta: number) {
  const target = spares.find((item) => item.id === id)

  if (target) {
    target.qty = Math.max(0, target.qty + delta)
  }

  return wrapUpdatedResponse(target || { id, delta }, 'Spare stock updated')
}
