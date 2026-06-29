import http from '@/utils/http'
import type { ApiResponse } from '@/utils/http'
import { isMockMode } from './_config'
import { unwrapApiResponse } from './_factory'
import * as mockService from '@/mock/services/scm'

// ==================== 供应商 ====================
export interface Supplier {
  id: string
  code: string
  name: string
  contact: string
  phone: string
  terms: string
  status: 'active' | 'frozen'
  qualified: boolean
}

export interface SupplierQuery {
  page: number
  page_size: number
  name?: string
  status?: string
}

export function getSupplierList(params: SupplierQuery) {
  if (isMockMode) return mockService.getSupplierList(params)
  return unwrapApiResponse(http.get<ApiResponse<{ total: number; items: Supplier[] }>>('/scm/suppliers', { params }))
}

export function createSupplier(data: Partial<Supplier>) {
  if (isMockMode) return mockService.createSupplier(data)
  return unwrapApiResponse(http.post<ApiResponse<null>>('/scm/suppliers', data))
}

export function updateSupplier(id: string, data: Partial<Supplier>) {
  if (isMockMode) return mockService.updateSupplier(id, data)
  return unwrapApiResponse(http.put<ApiResponse<null>>(`/scm/suppliers/${id}`, data))
}

export function deleteSupplier(id: string) {
  if (isMockMode) return mockService.deleteSupplier(id)
  return unwrapApiResponse(http.delete<ApiResponse<null>>(`/scm/suppliers/${id}`))
}

// ==================== 采购订单 ====================
export interface PurchaseOrder {
  id: string
  code: string
  supplier: string
  material: string
  qty: number
  received: number
  remain: number
  delivery: string
  status: 'sent' | 'partial' | 'received' | 'closed'
}

export interface PurchaseOrderQuery {
  page: number
  page_size: number
  code?: string
  supplier?: string
  status?: string
}

export function getPurchaseOrderList(params: PurchaseOrderQuery) {
  if (isMockMode) return mockService.getPurchaseOrderList(params)
  return unwrapApiResponse(http.get<ApiResponse<{ total: number; items: PurchaseOrder[] }>>('/scm/purchase-orders', { params }))
}

export function createPurchaseOrder(data: Partial<PurchaseOrder>) {
  if (isMockMode) return mockService.createPurchaseOrder(data)
  return unwrapApiResponse(http.post<ApiResponse<null>>('/scm/purchase-orders', data))
}

export function updatePurchaseOrder(id: string, data: Partial<PurchaseOrder>) {
  if (isMockMode) return mockService.updatePurchaseOrder(id, data)
  return unwrapApiResponse(http.put<ApiResponse<null>>(`/scm/purchase-orders/${id}`, data))
}

export function deletePurchaseOrder(id: string) {
  if (isMockMode) return mockService.deletePurchaseOrder(id)
  return unwrapApiResponse(http.delete<ApiResponse<null>>(`/scm/purchase-orders/${id}`))
}

export function getSupplierPortalData() {
  if (isMockMode) return mockService.getSupplierPortalData()
  return unwrapApiResponse(http.get<ApiResponse<any>>('/scm/portal'))
}

export function confirmPortalOrder(id: string) {
  if (isMockMode) return mockService.confirmPortalOrder(id)
  return unwrapApiResponse(http.put<ApiResponse<null>>(`/scm/portal/orders/${id}/confirm`))
}

export function rejectPortalOrder(id: string) {
  if (isMockMode) return mockService.rejectPortalOrder(id)
  return unwrapApiResponse(http.put<ApiResponse<null>>(`/scm/portal/orders/${id}/reject`))
}

export function confirmPortalDelivery(id: string) {
  if (isMockMode) return mockService.confirmPortalDelivery(id)
  return unwrapApiResponse(http.put<ApiResponse<null>>(`/scm/portal/deliveries/${id}/confirm`))
}
