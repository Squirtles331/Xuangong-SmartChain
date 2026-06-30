import { equipmentChecks, equipmentMaintains, equipmentOeeOverview, equipmentRepairs, equipmentSpares } from '../modules/equipment'
import { simulateDelay } from '../shared/delay'
import { generateId } from '../shared/id'
import { paginate, searchItems } from '../shared/paginate'
import { wrapCreatedResponse, wrapDetailResponse, wrapListResponse, wrapUpdatedResponse } from '../shared/response'

function buildTrend(startMonth: number, endMonth: number) {
  const count = Math.max(1, endMonth - startMonth + 1)
  const months = Array.from({ length: count }, (_, index) => `${startMonth + index}月`)
  return {
    months,
    oee: Array.from({ length: count }, () => +(70 + Math.random() * 12).toFixed(1)),
    utilization: Array.from({ length: count }, () => +(80 + Math.random() * 10).toFixed(1)),
    performance: Array.from({ length: count }, () => +(88 + Math.random() * 8).toFixed(1)),
    quality: Array.from({ length: count }, () => +(96 + Math.random() * 4).toFixed(1))
  }
}

export async function getEquipmentOeeOverview(params?: { start_month?: string; end_month?: string }) {
  await simulateDelay()

  const startMonth = params?.start_month ? Number(params.start_month.split('-')[1]) : 1
  const endMonth = params?.end_month ? Number(params.end_month.split('-')[1]) : 6

  return wrapDetailResponse({
    cards: equipmentOeeOverview.cards,
    rankData: equipmentOeeOverview.rankData,
    trendData: buildTrend(startMonth, endMonth)
  })
}

export async function getEquipmentRepairList(params: { pageNum: number; pageSize: number; keyword?: string; status?: string; priority?: string }) {
  await simulateDelay()
  let filtered = [...equipmentRepairs]
  if (params.keyword) filtered = searchItems(filtered, params.keyword, ['code', 'equipment', 'fault_desc'])
  if (params.status) filtered = filtered.filter((item) => item.status === params.status)
  if (params.priority) filtered = filtered.filter((item) => item.priority === params.priority)
  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function saveEquipmentRepair(data: any) {
  await simulateDelay()
  const payload = {
    id: data.id || generateId(),
    code: data.code || `WX${new Date().toISOString().slice(0, 10).replace(/-/g, '')}${String(equipmentRepairs.length + 1).padStart(4, '0')}`,
    equipment: data.equipment || '',
    fault_desc: data.fault_desc || '',
    priority: data.priority || 'normal',
    status: data.status || 'pending',
    worker: data.worker || '',
    created_at: data.created_at || new Date().toISOString().slice(0, 19).replace('T', ' ')
  }
  const index = equipmentRepairs.findIndex((item) => item.id === payload.id)
  if (index > -1) {
    equipmentRepairs[index] = { ...equipmentRepairs[index], ...payload }
    return wrapUpdatedResponse(equipmentRepairs[index], '编辑维修工单成功')
  }
  equipmentRepairs.unshift(payload)
  return wrapCreatedResponse(payload, '新增维修工单成功')
}

export async function updateEquipmentRepairStatus(id: string, data: { status: string; worker?: string }) {
  await simulateDelay()
  const target = equipmentRepairs.find((item) => item.id === id)
  if (target) {
    target.status = data.status as any
    if (data.worker !== undefined) target.worker = data.worker
  }
  return wrapUpdatedResponse(target || { id, ...data }, '维修状态更新成功')
}

export async function getEquipmentMaintainList(params: { pageNum: number; pageSize: number; keyword?: string; type?: string; status?: string }) {
  await simulateDelay()
  let filtered = [...equipmentMaintains]
  if (params.keyword) filtered = searchItems(filtered, params.keyword, ['code', 'equipment'])
  if (params.type) filtered = filtered.filter((item) => item.type === params.type)
  if (params.status) filtered = filtered.filter((item) => item.status === params.status)
  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function saveEquipmentMaintain(data: any) {
  await simulateDelay()
  const payload = {
    id: data.id || generateId(),
    code: data.code || `BY${new Date().toISOString().slice(0, 10).replace(/-/g, '')}${String(equipmentMaintains.length + 1).padStart(4, '0')}`,
    equipment: data.equipment || '',
    type: data.type || 'daily',
    plan_date: data.plan_date || '',
    executor: data.executor || '',
    status: data.status || 'pending'
  }
  const index = equipmentMaintains.findIndex((item) => item.id === payload.id)
  if (index > -1) {
    equipmentMaintains[index] = { ...equipmentMaintains[index], ...payload }
    return wrapUpdatedResponse(equipmentMaintains[index], '编辑保养计划成功')
  }
  equipmentMaintains.unshift(payload)
  return wrapCreatedResponse(payload, '新增保养计划成功')
}

export async function executeEquipmentMaintain(id: string, _data: { remark?: string }) {
  await simulateDelay()
  const target = equipmentMaintains.find((item) => item.id === id)
  if (target) target.status = 'done'
  return wrapUpdatedResponse(target || { id }, '保养执行成功')
}

export async function getEquipmentCheckList(params: { pageNum: number; pageSize: number; keyword?: string; check_type?: string; status?: string }) {
  await simulateDelay()
  let filtered = [...equipmentChecks]
  if (params.keyword) filtered = searchItems(filtered, params.keyword, ['code', 'equipment'])
  if (params.check_type) filtered = filtered.filter((item) => item.check_type === params.check_type)
  if (params.status) filtered = filtered.filter((item) => item.status === params.status)
  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function saveEquipmentCheck(data: any) {
  await simulateDelay()
  const payload = {
    id: data.id || generateId(),
    code: data.code || `DJ${new Date().toISOString().slice(0, 10).replace(/-/g, '')}${String(equipmentChecks.length + 1).padStart(4, '0')}`,
    equipment: data.equipment || '',
    check_type: data.check_type || '日点检',
    plan_date: data.plan_date || '',
    executor: data.executor || '',
    status: data.status || 'pending'
  }
  const index = equipmentChecks.findIndex((item) => item.id === payload.id)
  if (index > -1) {
    equipmentChecks[index] = { ...equipmentChecks[index], ...payload }
    return wrapUpdatedResponse(equipmentChecks[index], '编辑点检计划成功')
  }
  equipmentChecks.unshift(payload)
  return wrapCreatedResponse(payload, '新增点检计划成功')
}

export async function executeEquipmentCheck(id: string, _data: { remark?: string }) {
  await simulateDelay()
  const target = equipmentChecks.find((item) => item.id === id)
  if (target) target.status = 'done'
  return wrapUpdatedResponse(target || { id }, '点检执行成功')
}

export async function getEquipmentSpareList(params: { pageNum: number; pageSize: number; keyword?: string; stock_status?: string }) {
  await simulateDelay()
  let filtered = [...equipmentSpares]
  if (params.keyword) filtered = searchItems(filtered, params.keyword, ['code', 'name', 'spec', 'applicable_equipment'])
  if (params.stock_status === 'ok') filtered = filtered.filter((item) => item.qty > item.safety)
  if (params.stock_status === 'low') filtered = filtered.filter((item) => item.qty > 0 && item.qty <= item.safety)
  if (params.stock_status === 'out') filtered = filtered.filter((item) => item.qty <= 0)
  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function saveEquipmentSpare(data: any) {
  await simulateDelay()
  const payload = {
    id: data.id || generateId(),
    code: data.code || `PJ${new Date().toISOString().slice(0, 10).replace(/-/g, '')}${String(equipmentSpares.length + 1).padStart(4, '0')}`,
    name: data.name || '',
    spec: data.spec || '',
    applicable_equipment: data.applicable_equipment || '',
    qty: data.qty ?? 0,
    safety: data.safety ?? 0,
    unit: data.unit || '件',
    location: data.location || ''
  }
  const index = equipmentSpares.findIndex((item) => item.id === payload.id)
  if (index > -1) {
    equipmentSpares[index] = { ...equipmentSpares[index], ...payload }
    return wrapUpdatedResponse(equipmentSpares[index], '编辑备件成功')
  }
  equipmentSpares.unshift(payload)
  return wrapCreatedResponse(payload, '新增备件成功')
}

export async function updateEquipmentSpareQty(id: string, delta: number) {
  await simulateDelay()
  const target = equipmentSpares.find((item) => item.id === id)
  if (target) target.qty = Math.max(0, target.qty + delta)
  return wrapUpdatedResponse(target || { id, delta }, '备件库存更新成功')
}
