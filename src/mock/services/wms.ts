import {
  backflushOrders,
  barcodeScanRecords,
  deliveryOrders,
  inventory,
  iotAlertHistory,
  iotAlertRules,
  iotDevices,
  pickingOrders,
  receiptOrders,
  returnOrders,
  stockCountDiff,
  stockCountExec,
  transferOrders,
  wmsMaterials
} from '../modules/wms'
import { simulateDelay } from '../shared/delay'
import { generateId } from '../shared/id'
import { paginate, searchItems } from '../shared/paginate'
import { wrapDetailResponse, wrapListResponse, wrapSuccessResponse } from '../shared/response'

export async function getInventoryList(params: { pageNum: number; pageSize: number; code?: string; name?: string; warehouse?: string }) {
  await simulateDelay()
  let filtered = [...inventory]
  if (params.code) filtered = searchItems(filtered, params.code, ['code'])
  if (params.name) filtered = searchItems(filtered, params.name, ['name'])
  if (params.warehouse) filtered = filtered.filter((item) => item.warehouse === params.warehouse)
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

export async function getReceiptList(params: { pageNum: number; pageSize: number; code?: string; supplier?: string; status?: string }) {
  await simulateDelay()
  let filtered = [...receiptOrders]
  if (params.code) filtered = searchItems(filtered, params.code, ['code'])
  if (params.supplier) filtered = searchItems(filtered, params.supplier, ['type', 'supplier'])
  if (params.status) filtered = filtered.filter((item) => item.status === params.status)
  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function getDeliveryList(params: { pageNum: number; pageSize: number; code?: string; customer?: string; status?: string }) {
  await simulateDelay()
  let filtered = [...deliveryOrders]
  if (params.code) filtered = searchItems(filtered, params.code, ['code'])
  if (params.customer) filtered = searchItems(filtered, params.customer, ['customer'])
  if (params.status) filtered = filtered.filter((item) => item.status === params.status)
  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function getPickingList(params: { pageNum: number; pageSize: number; code?: string; warehouse?: string; status?: string }) {
  await simulateDelay()
  let filtered = [...pickingOrders]
  if (params.code) filtered = searchItems(filtered, params.code, ['wo_code'])
  if (params.warehouse) filtered = filtered.filter((item) => item.warehouse === params.warehouse)
  if (params.status) filtered = filtered.filter((item) => item.status === params.status)
  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function getTransferList(params: {
  pageNum: number
  pageSize: number
  code?: string
  fromWarehouse?: string
  toWarehouse?: string
  status?: string
}) {
  await simulateDelay()
  let filtered = [...transferOrders]
  if (params.code) filtered = searchItems(filtered, params.code, ['code'])
  if (params.fromWarehouse) filtered = filtered.filter((item) => item.from_wh === params.fromWarehouse)
  if (params.toWarehouse) filtered = filtered.filter((item) => item.to_wh === params.toWarehouse)
  if (params.status) filtered = filtered.filter((item) => item.status === params.status)
  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function getReturnList(params: { pageNum: number; pageSize: number; code?: string; reason?: string; status?: string }) {
  await simulateDelay()
  let filtered = [...returnOrders]
  if (params.code) filtered = searchItems(filtered, params.code, ['code', 'source'])
  if (params.reason) filtered = searchItems(filtered, params.reason, ['reason'])
  if (params.status) filtered = filtered.filter((item) => item.status === params.status)
  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function getBarcodeScanList(params: {
  pageNum: number
  pageSize: number
  barcode?: string
  operator?: string
  startDate?: string
  endDate?: string
}) {
  await simulateDelay()
  let filtered = [...barcodeScanRecords]
  if (params.barcode) filtered = searchItems(filtered, params.barcode, ['barcode'])
  if (params.operator) filtered = searchItems(filtered, params.operator, ['operator'])
  if (params.startDate) filtered = filtered.filter((item) => String(item.time).slice(0, 10) >= params.startDate!)
  if (params.endDate) filtered = filtered.filter((item) => String(item.time).slice(0, 10) <= params.endDate!)
  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function getBackflushList(params: { pageNum: number; pageSize: number; code?: string; material?: string; status?: string }) {
  await simulateDelay()
  let filtered = [...backflushOrders]
  if (params.code) filtered = searchItems(filtered, params.code, ['wo_code'])
  if (params.material) filtered = searchItems(filtered, params.material, ['material'])
  if (params.status) filtered = filtered.filter((item) => item.status === params.status)
  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function getStockCountList(params: { pageNum: number; pageSize: number; planCode?: string; warehouse?: string; status?: string }) {
  await simulateDelay()
  let filtered = [...stockCountExec]
  if (params.planCode) filtered = searchItems(filtered, params.planCode, ['plan_code'])
  if (params.warehouse) filtered = filtered.filter((item) => item.warehouse === params.warehouse)
  if (params.status) filtered = filtered.filter((item) => item.status === params.status)
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
  if (params.status) filtered = filtered.filter((item) => item.status === params.status)
  if (params.type) filtered = filtered.filter((item) => item.type === params.type)
  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function getIoTAlertHistory(params: { pageNum: number; pageSize: number; device?: string; level?: string }) {
  await simulateDelay()
  let filtered = [...iotAlertHistory]
  if (params.device) filtered = searchItems(filtered, params.device, ['device'])
  if (params.level) filtered = filtered.filter((item) => item.level === params.level)
  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function getIoTAlertRules() {
  await simulateDelay()
  return wrapDetailResponse(iotAlertRules)
}

export async function createIoTAlertRule(data: Record<string, any>) {
  await simulateDelay()
  ;(iotAlertRules as any[]).unshift({ id: generateId(), ...data })
  return wrapSuccessResponse('预警规则创建成功')
}

export async function updateIoTAlertRule(id: string, data: Record<string, any>) {
  await simulateDelay()
  const index = (iotAlertRules as any[]).findIndex((item: any) => String(item.id) === id)
  if (index > -1) Object.assign((iotAlertRules as any[])[index], data)
  return wrapSuccessResponse('预警规则更新成功')
}

export async function deleteIoTAlertRule(id: string) {
  await simulateDelay()
  const index = (iotAlertRules as any[]).findIndex((item: any) => String(item.id) === id)
  if (index > -1) (iotAlertRules as any[]).splice(index, 1)
  return wrapSuccessResponse('预警规则删除成功')
}
