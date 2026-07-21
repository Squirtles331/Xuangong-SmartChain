import * as staticService from '@/static/services/scm'
import { isStaticMode } from './_config'
import { apiDelete, apiGet, apiPost, apiPut, type ApiResponse, type PaginatedData } from './_factory'

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
  if (isStaticMode) return staticService.getSupplierList(params) as Promise<ApiResponse<PaginatedData<Supplier>>>
  return apiGet<PaginatedData<Supplier>>('/scm/suppliers', { params })
}

export function createSupplier(data: Partial<Supplier>) {
  if (isStaticMode) return staticService.createSupplier(data)
  return apiPost<Record<string, never>, Partial<Supplier>>('/scm/suppliers', data)
}

export function updateSupplier(id: string, data: Partial<Supplier>) {
  if (isStaticMode) return staticService.updateSupplier(id, data)
  return apiPut<Record<string, never>, Partial<Supplier>>(`/scm/suppliers/${id}`, data)
}

export function deleteSupplier(id: string) {
  if (isStaticMode) return staticService.deleteSupplier(id)
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
  if (isStaticMode) return staticService.getPurchaseOrderList(params) as Promise<ApiResponse<PaginatedData<PurchaseOrder>>>
  return apiGet<PaginatedData<PurchaseOrder>>('/scm/purchase-orders', { params })
}

export function createPurchaseOrder(data: Partial<PurchaseOrder>) {
  if (isStaticMode) return staticService.createPurchaseOrder(data)
  return apiPost<Record<string, never>, Partial<PurchaseOrder>>('/scm/purchase-orders', data)
}

export function updatePurchaseOrder(id: string, data: Partial<PurchaseOrder>) {
  if (isStaticMode) return staticService.updatePurchaseOrder(id, data)
  return apiPut<Record<string, never>, Partial<PurchaseOrder>>(`/scm/purchase-orders/${id}`, data)
}

export function deletePurchaseOrder(id: string) {
  if (isStaticMode) return staticService.deletePurchaseOrder(id)
  return apiDelete<Record<string, never>>(`/scm/purchase-orders/${id}`)
}

export interface PortalOrder {
  id: string
  code: string
  material: string
  qty: number
  delivery_date: string
  status: 'pending' | 'confirmed' | 'rejected'
}

export interface PortalDelivery {
  id: string
  code: string
  material: string
  qty: number
  carrier: string
  tracking_no: string
  confirmed: boolean
}

export interface PortalTimelineItem {
  timestamp: string
  content: string
  color: string
  type: 'primary' | 'success' | 'warning' | 'info'
  hollow: boolean
}

export interface PortalReconciliation {
  period: string
  order_code: string
  material: string
  order_qty: number
  delivered_qty: number
  accepted_qty: number
  amount: number
  rec_status: 'pending' | 'confirmed'
}

export interface SupplierPortalData {
  orders: PortalOrder[]
  deliveries: PortalDelivery[]
  timelineItems: PortalTimelineItem[]
  recData: PortalReconciliation[]
}

export function getSupplierPortalData() {
  if (isStaticMode) return staticService.getSupplierPortalData() as Promise<ApiResponse<SupplierPortalData>>
  return apiGet<SupplierPortalData>('/scm/portal')
}

export function confirmPortalOrder(id: string) {
  if (isStaticMode) return staticService.confirmPortalOrder(id)
  return apiPut<Record<string, never>>(`/scm/portal/orders/${id}/confirm`)
}

export function rejectPortalOrder(id: string) {
  if (isStaticMode) return staticService.rejectPortalOrder(id)
  return apiPut<Record<string, never>>(`/scm/portal/orders/${id}/reject`)
}

export function confirmPortalDelivery(id: string) {
  if (isStaticMode) return staticService.confirmPortalDelivery(id)
  return apiPut<Record<string, never>>(`/scm/portal/deliveries/${id}/confirm`)
}

export interface PriceRecord {
  id: string
  material: string
  supplier: string
  price: number
  currency: string
  valid_from: string
  valid_to: string
  source: string
}

export interface PriceQuery {
  pageNum: number
  pageSize: number
  material?: string
  supplier?: string
  source?: string
}

export function getPriceList(params: PriceQuery) {
  if (isStaticMode) return staticService.getPriceList(params) as Promise<ApiResponse<PaginatedData<PriceRecord>>>
  return apiGet<PaginatedData<PriceRecord>>('/scm/prices', { params })
}

export function createPrice(data: Partial<PriceRecord>) {
  if (isStaticMode) return staticService.createPrice(data)
  return apiPost<Record<string, never>, Partial<PriceRecord>>('/scm/prices', data)
}

export function updatePrice(id: string, data: Partial<PriceRecord>) {
  if (isStaticMode) return staticService.updatePrice(id, data)
  return apiPut<Record<string, never>, Partial<PriceRecord>>(`/scm/prices/${id}`, data)
}

export function deletePrice(id: string) {
  if (isStaticMode) return staticService.deletePrice(id)
  return apiDelete<Record<string, never>>(`/scm/prices/${id}`)
}

export interface PurchaseRequest {
  id: string
  code: string
  dept: string
  reason: string
  need_date: string
  status: 'draft' | 'approved' | 'ordered' | 'rejected'
  source: 'mrp' | 'manual'
  created_at: string
}

export interface PurchaseRequestQuery {
  pageNum: number
  pageSize: number
  code?: string
  status?: string
  source?: string
}

export function getPurchaseRequestList(params: PurchaseRequestQuery) {
  if (isStaticMode) return staticService.getPurchaseRequestList(params) as Promise<ApiResponse<PaginatedData<PurchaseRequest>>>
  return apiGet<PaginatedData<PurchaseRequest>>('/scm/purchase-requests', { params })
}

export function createPurchaseRequest(data: Partial<PurchaseRequest>) {
  if (isStaticMode) return staticService.createPurchaseRequest(data)
  return apiPost<Record<string, never>, Partial<PurchaseRequest>>('/scm/purchase-requests', data)
}

export function updatePurchaseRequest(id: string, data: Partial<PurchaseRequest>) {
  if (isStaticMode) return staticService.updatePurchaseRequest(id, data)
  return apiPut<Record<string, never>, Partial<PurchaseRequest>>(`/scm/purchase-requests/${id}`, data)
}

export function deletePurchaseRequest(id: string) {
  if (isStaticMode) return staticService.deletePurchaseRequest(id)
  return apiDelete<Record<string, never>>(`/scm/purchase-requests/${id}`)
}

export interface PurchaseReturn {
  id: string
  code: string
  po_code: string
  supplier: string
  material: string
  qty: number
  reason: string
  status: 'pending' | 'done'
}

export interface PurchaseReturnQuery {
  pageNum: number
  pageSize: number
  code?: string
  status?: string
}

export function getPurchaseReturnList(params: PurchaseReturnQuery) {
  if (isStaticMode) return staticService.getPurchaseReturnList(params) as Promise<ApiResponse<PaginatedData<PurchaseReturn>>>
  return apiGet<PaginatedData<PurchaseReturn>>('/scm/purchase-returns', { params })
}

export function createPurchaseReturn(data: Partial<PurchaseReturn>) {
  if (isStaticMode) return staticService.createPurchaseReturn(data)
  return apiPost<Record<string, never>, Partial<PurchaseReturn>>('/scm/purchase-returns', data)
}

export function updatePurchaseReturn(id: string, data: Partial<PurchaseReturn>) {
  if (isStaticMode) return staticService.updatePurchaseReturn(id, data)
  return apiPut<Record<string, never>, Partial<PurchaseReturn>>(`/scm/purchase-returns/${id}`, data)
}

export function deletePurchaseReturn(id: string) {
  if (isStaticMode) return staticService.deletePurchaseReturn(id)
  return apiDelete<Record<string, never>>(`/scm/purchase-returns/${id}`)
}
