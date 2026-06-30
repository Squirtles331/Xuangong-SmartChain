import {
  portalDeliveries,
  portalOrders,
  portalReconciliation,
  portalTimeline,
  priceRecords,
  purchaseOrders,
  purchaseRequests,
  purchaseReturns,
  suppliers
} from '../modules/scm'
import { simulateDelay } from '../shared/delay'
import { generateId } from '../shared/id'
import { paginate, searchItems } from '../shared/paginate'
import { wrapDetailResponse, wrapListResponse, wrapSuccessResponse } from '../shared/response'

export async function getSupplierList(params: { pageNum: number; pageSize: number; name?: string; status?: string }) {
  await simulateDelay()
  let filtered = [...suppliers]

  if (params.name) filtered = searchItems(filtered, params.name, ['name', 'code', 'contact'])
  if (params.status) filtered = filtered.filter((item) => item.status === params.status)

  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function createSupplier(data: any) {
  await simulateDelay()
  ;(suppliers as any[]).unshift({
    id: generateId(),
    qualified: true,
    ...data
  })
  return wrapSuccessResponse('供应商创建成功')
}

export async function updateSupplier(id: string, data: any) {
  await simulateDelay()
  const index = (suppliers as any[]).findIndex((item: any) => String(item.id) === id)
  if (index > -1) Object.assign((suppliers as any[])[index], data)
  return wrapSuccessResponse('供应商更新成功')
}

export async function deleteSupplier(id: string) {
  await simulateDelay()
  const index = (suppliers as any[]).findIndex((item: any) => String(item.id) === id)
  if (index > -1) (suppliers as any[]).splice(index, 1)
  return wrapSuccessResponse('供应商删除成功')
}

export async function getPurchaseOrderList(params: { pageNum: number; pageSize: number; code?: string; supplier?: string; status?: string }) {
  await simulateDelay()
  let filtered = [...purchaseOrders]

  if (params.code) filtered = searchItems(filtered, params.code, ['code', 'material'])
  if (params.supplier) filtered = searchItems(filtered, params.supplier, ['supplier'])
  if (params.status) filtered = filtered.filter((item) => item.status === params.status)

  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function createPurchaseOrder(data: any) {
  await simulateDelay()
  const qty = Number(data.qty || 0)
  const received = Number(data.received || 0)
  ;(purchaseOrders as any[]).unshift({
    id: generateId(),
    received,
    remain: Math.max(qty - received, 0),
    ...data
  })
  return wrapSuccessResponse('采购订单创建成功')
}

export async function updatePurchaseOrder(id: string, data: any) {
  await simulateDelay()
  const index = (purchaseOrders as any[]).findIndex((item: any) => String(item.id) === id)
  if (index > -1) {
    const current = (purchaseOrders as any[])[index]
    const next = { ...current, ...data }
    next.remain = Math.max(Number(next.qty || 0) - Number(next.received || 0), 0)
    Object.assign(current, next)
  }
  return wrapSuccessResponse('采购订单更新成功')
}

export async function deletePurchaseOrder(id: string) {
  await simulateDelay()
  const index = (purchaseOrders as any[]).findIndex((item: any) => String(item.id) === id)
  if (index > -1) (purchaseOrders as any[]).splice(index, 1)
  return wrapSuccessResponse('采购订单删除成功')
}

export async function getPriceList(params: { pageNum: number; pageSize: number; material?: string; supplier?: string; source?: string }) {
  await simulateDelay()
  let filtered = [...priceRecords]

  if (params.material) filtered = searchItems(filtered, params.material, ['material'])
  if (params.supplier) filtered = searchItems(filtered, params.supplier, ['supplier'])
  if (params.source) filtered = filtered.filter((item) => item.source === params.source)

  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function createPrice(data: any) {
  await simulateDelay()
  ;(priceRecords as any[]).unshift({ id: generateId(), ...data })
  return wrapSuccessResponse('价格记录创建成功')
}

export async function updatePrice(id: string, data: any) {
  await simulateDelay()
  const index = (priceRecords as any[]).findIndex((item: any) => String(item.id) === id)
  if (index > -1) Object.assign((priceRecords as any[])[index], data)
  return wrapSuccessResponse('价格记录更新成功')
}

export async function deletePrice(id: string) {
  await simulateDelay()
  const index = (priceRecords as any[]).findIndex((item: any) => String(item.id) === id)
  if (index > -1) (priceRecords as any[]).splice(index, 1)
  return wrapSuccessResponse('价格记录删除成功')
}

export async function getPurchaseRequestList(params: { pageNum: number; pageSize: number; code?: string; status?: string; source?: string }) {
  await simulateDelay()
  let filtered = [...purchaseRequests]

  if (params.code) filtered = searchItems(filtered, params.code, ['code', 'dept', 'reason'])
  if (params.status) filtered = filtered.filter((item) => item.status === params.status)
  if (params.source) filtered = filtered.filter((item) => item.source === params.source)

  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function createPurchaseRequest(data: any) {
  await simulateDelay()
  ;(purchaseRequests as any[]).unshift({
    id: generateId(),
    created_at: data.created_at || new Date().toISOString().slice(0, 10),
    ...data
  })
  return wrapSuccessResponse('采购申请创建成功')
}

export async function updatePurchaseRequest(id: string, data: any) {
  await simulateDelay()
  const index = (purchaseRequests as any[]).findIndex((item: any) => String(item.id) === id)
  if (index > -1) Object.assign((purchaseRequests as any[])[index], data)
  return wrapSuccessResponse('采购申请更新成功')
}

export async function deletePurchaseRequest(id: string) {
  await simulateDelay()
  const index = (purchaseRequests as any[]).findIndex((item: any) => String(item.id) === id)
  if (index > -1) (purchaseRequests as any[]).splice(index, 1)
  return wrapSuccessResponse('采购申请删除成功')
}

export async function getPurchaseReturnList(params: { pageNum: number; pageSize: number; code?: string; status?: string }) {
  await simulateDelay()
  let filtered = [...purchaseReturns]

  if (params.code) filtered = searchItems(filtered, params.code, ['code', 'po_code', 'supplier', 'material'])
  if (params.status) filtered = filtered.filter((item) => item.status === params.status)

  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function createPurchaseReturn(data: any) {
  await simulateDelay()
  ;(purchaseReturns as any[]).unshift({ id: generateId(), ...data })
  return wrapSuccessResponse('采购退货单创建成功')
}

export async function updatePurchaseReturn(id: string, data: any) {
  await simulateDelay()
  const index = (purchaseReturns as any[]).findIndex((item: any) => String(item.id) === id)
  if (index > -1) Object.assign((purchaseReturns as any[])[index], data)
  return wrapSuccessResponse('采购退货单更新成功')
}

export async function deletePurchaseReturn(id: string) {
  await simulateDelay()
  const index = (purchaseReturns as any[]).findIndex((item: any) => String(item.id) === id)
  if (index > -1) (purchaseReturns as any[]).splice(index, 1)
  return wrapSuccessResponse('采购退货单删除成功')
}

export async function getSupplierPortalData() {
  await simulateDelay()
  return wrapDetailResponse({
    orders: [...portalOrders],
    deliveries: [...portalDeliveries],
    timelineItems: [...portalTimeline],
    recData: [...portalReconciliation]
  })
}

export async function confirmPortalOrder(id: string) {
  await simulateDelay()
  const order = portalOrders.find((item) => item.id === id)
  if (order) order.status = 'confirmed'
  return wrapSuccessResponse('订单已确认')
}

export async function rejectPortalOrder(id: string) {
  await simulateDelay()
  const order = portalOrders.find((item) => item.id === id)
  if (order) order.status = 'rejected'
  return wrapSuccessResponse('订单已驳回')
}

export async function confirmPortalDelivery(id: string) {
  await simulateDelay()
  const delivery = portalDeliveries.find((item) => item.id === id)
  if (delivery) delivery.confirmed = true
  return wrapSuccessResponse(delivery ? `发货单 ${delivery.code} 确认成功` : '发货确认成功')
}
