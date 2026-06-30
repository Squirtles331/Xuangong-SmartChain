import { isMockMode } from './_config'
import { apiDelete, apiGet, apiPost, apiPut, type ApiResponse, type PaginatedData } from './_factory'
import * as mockService from '@/mock/services/scm'

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
  pageNum: number
  pageSize: number
  name?: string
  status?: string
}

export function getSupplierList(params: SupplierQuery) {
  if (isMockMode) return mockService.getSupplierList(params) as Promise<ApiResponse<PaginatedData<Supplier>>>
  return apiGet<PaginatedData<Supplier>>('/scm/suppliers', { params })
}

export function createSupplier(data: Partial<Supplier>) {
  if (isMockMode) return mockService.createSupplier(data)
  return apiPost<Record<string, never>, Partial<Supplier>>('/scm/suppliers', data)
}

export function updateSupplier(id: string, data: Partial<Supplier>) {
  if (isMockMode) return mockService.updateSupplier(id, data)
  return apiPut<Record<string, never>, Partial<Supplier>>(`/scm/suppliers/${id}`, data)
}

export function deleteSupplier(id: string) {
  if (isMockMode) return mockService.deleteSupplier(id)
  return apiDelete<Record<string, never>>(`/scm/suppliers/${id}`)
}

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
  pageNum: number
  pageSize: number
  code?: string
  supplier?: string
  status?: string
}

export function getPurchaseOrderList(params: PurchaseOrderQuery) {
  if (isMockMode) return mockService.getPurchaseOrderList(params) as Promise<ApiResponse<PaginatedData<PurchaseOrder>>>
  return apiGet<PaginatedData<PurchaseOrder>>('/scm/purchase-orders', { params })
}

export function createPurchaseOrder(data: Partial<PurchaseOrder>) {
  if (isMockMode) return mockService.createPurchaseOrder(data)
  return apiPost<Record<string, never>, Partial<PurchaseOrder>>('/scm/purchase-orders', data)
}

export function updatePurchaseOrder(id: string, data: Partial<PurchaseOrder>) {
  if (isMockMode) return mockService.updatePurchaseOrder(id, data)
  return apiPut<Record<string, never>, Partial<PurchaseOrder>>(`/scm/purchase-orders/${id}`, data)
}

export function deletePurchaseOrder(id: string) {
  if (isMockMode) return mockService.deletePurchaseOrder(id)
  return apiDelete<Record<string, never>>(`/scm/purchase-orders/${id}`)
}

export function getSupplierPortalData() {
  if (isMockMode) return mockService.getSupplierPortalData()
  return apiGet<any>('/scm/portal')
}

export function confirmPortalOrder(id: string) {
  if (isMockMode) return mockService.confirmPortalOrder(id)
  return apiPut<Record<string, never>>(`/scm/portal/orders/${id}/confirm`)
}

export function rejectPortalOrder(id: string) {
  if (isMockMode) return mockService.rejectPortalOrder(id)
  return apiPut<Record<string, never>>(`/scm/portal/orders/${id}/reject`)
}

export function confirmPortalDelivery(id: string) {
  if (isMockMode) return mockService.confirmPortalDelivery(id)
  return apiPut<Record<string, never>>(`/scm/portal/deliveries/${id}/confirm`)
}
