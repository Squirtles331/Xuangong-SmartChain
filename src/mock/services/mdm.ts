/**
 * MDM (Master Data Management) Mock Service
 * 组织架构、物料主数据、制造资源
 */
import { simulateDelay } from '../shared/delay'
import { paginate, searchItems } from '../shared/paginate'
import { wrapListResponse, wrapDetailResponse, wrapSuccessResponse } from '../shared/response'
import { generateId } from '../shared/id'
import { orgTree, materialTree, materialList, equipments, workCenters, molds } from '../modules/mdm'

// ==================== 组织架构 ====================
export async function getOrgTree() {
  await simulateDelay()
  return wrapDetailResponse(orgTree)
}

// ==================== 物料主数据 ====================
export async function getMaterialTree() {
  await simulateDelay()
  return wrapDetailResponse(materialTree)
}

export async function getMaterialList(params: { page: number; page_size: number; code?: string; name?: string; type?: string }) {
  await simulateDelay()
  let filtered = [...materialList]
  if (params.code) filtered = searchItems(filtered, params.code, ['code'])
  if (params.name) filtered = searchItems(filtered, params.name, ['name'])
  if (params.type) filtered = filtered.filter((m) => (m as any).type === params.type)
  const result = paginate(filtered, params.page, params.page_size)
  return wrapListResponse(result.items, result.total, result.page, result.page_size)
}

export async function createMaterial(data: any) {
  await simulateDelay()
  const newMaterial = { id: generateId(), ...data }
  ;(materialList as any[]).unshift(newMaterial)
  return wrapSuccessResponse('物料创建成功')
}

export async function updateMaterial(id: string, data: any) {
  await simulateDelay()
  const idx = (materialList as any[]).findIndex((m: any) => String(m.id) === id)
  if (idx > -1) Object.assign((materialList as any[])[idx], data)
  return wrapSuccessResponse('物料更新成功')
}

export async function deleteMaterial(id: string) {
  await simulateDelay()
  const idx = (materialList as any[]).findIndex((m: any) => String(m.id) === id)
  if (idx > -1) (materialList as any[]).splice(idx, 1)
  return wrapSuccessResponse('物料删除成功')
}

// ==================== 设备管理 ====================
export async function getEquipmentList(params: { page: number; page_size: number; name?: string; workshop?: string; status?: string }) {
  await simulateDelay()
  let filtered = [...equipments]
  if (params.name) filtered = searchItems(filtered, params.name, ['name'])
  if (params.workshop) filtered = searchItems(filtered, params.workshop, ['workshop'])
  if (params.status) filtered = filtered.filter((e) => (e as any).status === params.status)
  const result = paginate(filtered, params.page, params.page_size)
  return wrapListResponse(result.items, result.total, result.page, result.page_size)
}

export async function createEquipment(data: any) {
  await simulateDelay()
  const newEquipment = { id: generateId(), ...data }
  ;(equipments as any[]).unshift(newEquipment)
  return wrapSuccessResponse('设备创建成功')
}

export async function updateEquipment(id: string, data: any) {
  await simulateDelay()
  const idx = (equipments as any[]).findIndex((e: any) => String(e.id) === id)
  if (idx > -1) Object.assign((equipments as any[])[idx], data)
  return wrapSuccessResponse('设备更新成功')
}

export async function deleteEquipment(id: string) {
  await simulateDelay()
  const idx = (equipments as any[]).findIndex((e: any) => String(e.id) === id)
  if (idx > -1) (equipments as any[]).splice(idx, 1)
  return wrapSuccessResponse('设备删除成功')
}

// ==================== 工作中心 ====================
export async function getWorkCenterList() {
  await simulateDelay()
  return wrapDetailResponse(workCenters)
}

// ==================== 模具管理 ====================
export async function getMoldList() {
  await simulateDelay()
  return wrapDetailResponse(molds)
}
