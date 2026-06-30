/**
 * CRM 模块 Mock Service
 * 客户管理、销售订单、应收台账
 */
import { simulateDelay } from '../shared/delay'
import { paginate, searchItems } from '../shared/paginate'
import { wrapListResponse, wrapDetailResponse, wrapSuccessResponse } from '../shared/response'
import { generateId } from '../shared/id'
import { customers, salesOrders, receivables } from '../modules/crm'

// ==================== 客户管理 ====================
export async function getCustomerList(params: { pageNum: number; pageSize: number; name?: string; status?: string }) {
  await simulateDelay()
  let filtered = [...customers]
  if (params.name) filtered = searchItems(filtered, params.name, ['name'])
  if (params.status) filtered = filtered.filter((c) => (c as any).status === params.status)
  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function createCustomer(data: any) {
  await simulateDelay()
  const newCustomer = { id: generateId(), ...data }
  ;(customers as any[]).unshift(newCustomer)
  return wrapSuccessResponse('客户创建成功')
}

export async function updateCustomer(id: string, data: any) {
  await simulateDelay()
  const idx = (customers as any[]).findIndex((c: any) => String(c.id) === id)
  if (idx > -1) Object.assign((customers as any[])[idx], data)
  return wrapSuccessResponse('客户更新成功')
}

export async function deleteCustomer(id: string) {
  await simulateDelay()
  const idx = (customers as any[]).findIndex((c: any) => String(c.id) === id)
  if (idx > -1) (customers as any[]).splice(idx, 1)
  return wrapSuccessResponse('客户删除成功')
}

// ==================== 销售订单 ====================
export async function getSalesOrderList(params: { pageNum: number; pageSize: number; code?: string; customerName?: string; status?: string }) {
  await simulateDelay()
  let filtered = [...salesOrders]
  if (params.code) filtered = searchItems(filtered, params.code, ['code'])
  if (params.customerName) filtered = searchItems(filtered, params.customerName, ['customer_name'])
  if (params.status) filtered = filtered.filter((o) => (o as any).status === params.status)
  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function createSalesOrder(data: any) {
  await simulateDelay()
  const newOrder = { id: generateId(), ...data }
  ;(salesOrders as any[]).unshift(newOrder)
  return wrapSuccessResponse('销售订单创建成功')
}

export async function updateSalesOrder(id: string, data: any) {
  await simulateDelay()
  const idx = (salesOrders as any[]).findIndex((o: any) => String(o.id) === id)
  if (idx > -1) Object.assign((salesOrders as any[])[idx], data)
  return wrapSuccessResponse('销售订单更新成功')
}

export async function deleteSalesOrder(id: string) {
  await simulateDelay()
  const idx = (salesOrders as any[]).findIndex((o: any) => String(o.id) === id)
  if (idx > -1) (salesOrders as any[]).splice(idx, 1)
  return wrapSuccessResponse('销售订单删除成功')
}

// ==================== 应收台账 ====================
export async function getReceivableList(params: { pageNum: number; pageSize: number; customer?: string; status?: string }) {
  await simulateDelay()
  let filtered = [...receivables]
  if (params.customer) filtered = searchItems(filtered, params.customer, ['customer'])
  if (params.status) {
    // status 映射：overdue -> aging > 0, settled -> balance === 0, pending -> balance > 0 && aging <= 0
    if (params.status === 'overdue') filtered = filtered.filter((r) => (r as any).aging > 0)
    if (params.status === 'settled') filtered = filtered.filter((r) => (r as any).balance === 0)
    if (params.status === 'pending') filtered = filtered.filter((r) => (r as any).balance > 0 && (r as any).aging <= 0)
  }
  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function createReceipt(data: any) {
  await simulateDelay()
  const newReceivable = {
    id: generateId(),
    code: `AR${new Date().toISOString().slice(0, 10).replace(/-/g, '')}${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
    settled: 0,
    balance: data.amount || 0,
    aging: 0,
    ...data
  }
  ;(receivables as any[]).unshift(newReceivable)
  return wrapSuccessResponse('应收记录创建成功')
}
