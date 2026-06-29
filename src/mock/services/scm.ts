/**
 * SCM (Supply Chain Management) Mock Service
 * 供应商管理、采购订单
 */
import { simulateDelay } from '../shared/delay'
import { paginate, searchItems } from '../shared/paginate'
import { wrapListResponse, wrapDetailResponse, wrapSuccessResponse } from '../shared/response'
import { generateId } from '../shared/id'
import { suppliers, purchaseOrders } from '../modules/business'

// ==================== 供应商管理 ====================
export async function getSupplierList(params: { page: number; page_size: number; name?: string; status?: string }) {
  await simulateDelay()
  let filtered = [...suppliers]
  if (params.name) filtered = searchItems(filtered, params.name, ['name'])
  if (params.status) filtered = filtered.filter((s) => (s as any).status === params.status)
  const result = paginate(filtered, params.page, params.page_size)
  return wrapListResponse(result.items, result.total, result.page, result.page_size)
}

export async function createSupplier(data: any) {
  await simulateDelay()
  const newSupplier = { id: generateId(), ...data }
  ;(suppliers as any[]).unshift(newSupplier)
  return wrapSuccessResponse('供应商创建成功')
}

export async function updateSupplier(id: string, data: any) {
  await simulateDelay()
  const idx = (suppliers as any[]).findIndex((s: any) => String(s.id) === id)
  if (idx > -1) Object.assign((suppliers as any[])[idx], data)
  return wrapSuccessResponse('供应商更新成功')
}

export async function deleteSupplier(id: string) {
  await simulateDelay()
  const idx = (suppliers as any[]).findIndex((s: any) => String(s.id) === id)
  if (idx > -1) (suppliers as any[]).splice(idx, 1)
  return wrapSuccessResponse('供应商删除成功')
}

// ==================== 采购订单 ====================
export async function getPurchaseOrderList(params: { page: number; page_size: number; code?: string; supplier?: string; status?: string }) {
  await simulateDelay()
  let filtered = [...purchaseOrders]
  if (params.code) filtered = searchItems(filtered, params.code, ['code'])
  if (params.supplier) filtered = searchItems(filtered, params.supplier, ['supplier'])
  if (params.status) filtered = filtered.filter((o) => (o as any).status === params.status)
  const result = paginate(filtered, params.page, params.page_size)
  return wrapListResponse(result.items, result.total, result.page, result.page_size)
}

export async function createPurchaseOrder(data: any) {
  await simulateDelay()
  const newOrder = { id: generateId(), ...data }
  ;(purchaseOrders as any[]).unshift(newOrder)
  return wrapSuccessResponse('采购订单创建成功')
}

export async function updatePurchaseOrder(id: string, data: any) {
  await simulateDelay()
  const idx = (purchaseOrders as any[]).findIndex((o: any) => String(o.id) === id)
  if (idx > -1) Object.assign((purchaseOrders as any[])[idx], data)
  return wrapSuccessResponse('采购订单更新成功')
}

export async function deletePurchaseOrder(id: string) {
  await simulateDelay()
  const idx = (purchaseOrders as any[]).findIndex((o: any) => String(o.id) === id)
  if (idx > -1) (purchaseOrders as any[]).splice(idx, 1)
  return wrapSuccessResponse('采购订单删除成功')
}
