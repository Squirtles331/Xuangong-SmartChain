/**
 * WMS mock service
 */
import { inventory, iotAlertHistory, iotAlertRules, iotDevices, stockCountDiff, stockCountExec, wmsMaterials } from '../modules/wms'
import { simulateDelay } from '../shared/delay'
import { paginate, searchItems } from '../shared/paginate'
import { wrapDetailResponse, wrapListResponse } from '../shared/response'

export async function getInventoryList(params: { page: number; page_size: number; code?: string; name?: string; warehouse?: string }) {
  await simulateDelay()
  let filtered = [...inventory]
  if (params.code) filtered = searchItems(filtered, params.code, ['code'])
  if (params.name) filtered = searchItems(filtered, params.name, ['name'])
  if (params.warehouse) filtered = filtered.filter((item) => (item as any).warehouse === params.warehouse)
  const result = paginate(filtered, params.page, params.page_size)
  return wrapListResponse(result.items, result.total, result.page, result.page_size)
}

export async function getMaterialListForBarcode(params: { page: number; page_size: number; code?: string; name?: string }) {
  await simulateDelay()
  let filtered = [...wmsMaterials]
  if (params.code) filtered = searchItems(filtered, params.code, ['code'])
  if (params.name) filtered = searchItems(filtered, params.name, ['name'])
  const result = paginate(filtered, params.page, params.page_size)
  return wrapListResponse(result.items, result.total, result.page, result.page_size)
}

export async function getStockCountList(params: { page: number; page_size: number; plan_code?: string; warehouse?: string; status?: string }) {
  await simulateDelay()
  let filtered = [...stockCountExec]
  if (params.plan_code) filtered = searchItems(filtered, params.plan_code, ['plan_code'])
  if (params.warehouse) filtered = filtered.filter((item) => (item as any).warehouse === params.warehouse)
  if (params.status) filtered = filtered.filter((item) => (item as any).status === params.status)
  const result = paginate(filtered, params.page, params.page_size)
  return wrapListResponse(result.items, result.total, result.page, result.page_size)
}

export async function getStockCountDiff(params: { page: number; page_size: number; plan_code?: string; material?: string }) {
  await simulateDelay()
  let filtered = [...stockCountDiff]
  if (params.plan_code) filtered = searchItems(filtered, params.plan_code, ['plan_code'])
  if (params.material) filtered = searchItems(filtered, params.material, ['material'])
  const result = paginate(filtered, params.page, params.page_size)
  return wrapListResponse(result.items, result.total, result.page, result.page_size)
}

export async function getIoTDeviceList(params: { page: number; page_size: number; status?: string; type?: string }) {
  await simulateDelay()
  let filtered = [...iotDevices]
  if (params.status) filtered = filtered.filter((item) => (item as any).status === params.status)
  if (params.type) filtered = filtered.filter((item) => (item as any).type === params.type)
  const result = paginate(filtered, params.page, params.page_size)
  return wrapListResponse(result.items, result.total, result.page, result.page_size)
}

export async function getIoTAlertHistory(params: { page: number; page_size: number; device?: string; level?: string }) {
  await simulateDelay()
  let filtered = [...iotAlertHistory]
  if (params.device) filtered = searchItems(filtered, params.device, ['device'])
  if (params.level) filtered = filtered.filter((item) => (item as any).level === params.level)
  const result = paginate(filtered, params.page, params.page_size)
  return wrapListResponse(result.items, result.total, result.page, result.page_size)
}

export async function getIoTAlertRules() {
  await simulateDelay()
  return wrapDetailResponse(iotAlertRules)
}
