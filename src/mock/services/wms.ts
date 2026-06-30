/**
 * WMS mock service
 */
import { inventory, iotAlertHistory, iotAlertRules, iotDevices, stockCountDiff, stockCountExec, wmsMaterials } from '../modules/wms'
import { simulateDelay } from '../shared/delay'
import { paginate, searchItems } from '../shared/paginate'
import { wrapDetailResponse, wrapListResponse } from '../shared/response'

export async function getInventoryList(params: { pageNum: number; pageSize: number; code?: string; name?: string; warehouse?: string }) {
  await simulateDelay()
  let filtered = [...inventory]
  if (params.code) filtered = searchItems(filtered, params.code, ['code'])
  if (params.name) filtered = searchItems(filtered, params.name, ['name'])
  if (params.warehouse) filtered = filtered.filter((item) => (item as any).warehouse === params.warehouse)
  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function getMaterialListForBarcode(params: { pageNum: number; pageSize: number; code?: string; name?: string }) {
  await simulateDelay()
  let filtered = [...wmsMaterials]
  if (params.code) filtered = searchItems(filtered, params.code, ['code'])
  if (params.name) filtered = searchItems(filtered, params.name, ['name'])
  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function getStockCountList(params: { pageNum: number; pageSize: number; planCode?: string; warehouse?: string; status?: string }) {
  await simulateDelay()
  let filtered = [...stockCountExec]
  if (params.planCode) filtered = searchItems(filtered, params.planCode, ['plan_code'])
  if (params.warehouse) filtered = filtered.filter((item) => (item as any).warehouse === params.warehouse)
  if (params.status) filtered = filtered.filter((item) => (item as any).status === params.status)
  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function getStockCountDiff(params: { pageNum: number; pageSize: number; planCode?: string; material?: string }) {
  await simulateDelay()
  let filtered = [...stockCountDiff]
  if (params.planCode) filtered = searchItems(filtered, params.planCode, ['plan_code'])
  if (params.material) filtered = searchItems(filtered, params.material, ['material'])
  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function getIoTDeviceList(params: { pageNum: number; pageSize: number; status?: string; type?: string }) {
  await simulateDelay()
  let filtered = [...iotDevices]
  if (params.status) filtered = filtered.filter((item) => (item as any).status === params.status)
  if (params.type) filtered = filtered.filter((item) => (item as any).type === params.type)
  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function getIoTAlertHistory(params: { pageNum: number; pageSize: number; device?: string; level?: string }) {
  await simulateDelay()
  let filtered = [...iotAlertHistory]
  if (params.device) filtered = searchItems(filtered, params.device, ['device'])
  if (params.level) filtered = filtered.filter((item) => (item as any).level === params.level)
  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function getIoTAlertRules() {
  await simulateDelay()
  return wrapDetailResponse(iotAlertRules)
}
