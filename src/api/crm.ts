import { isMockMode } from './_config'
import { apiDelete, apiGet, apiPost, apiPut, type ApiResponse, type PaginatedData } from './_factory'
import * as mockService from '@/mock/services/crm'

export interface Customer {
  id: string
  code: string
  name: string
  contact_person: string
  contact_phone: string
  payment_terms: string
  credit_limit: number
  status: 'active' | 'disabled'
}

export interface CustomerQuery {
  pageNum: number
  pageSize: number
  name?: string
  status?: string
}

export function getCustomerList(params: CustomerQuery) {
  if (isMockMode) return mockService.getCustomerList(params) as Promise<ApiResponse<PaginatedData<Customer>>>
  return apiGet<PaginatedData<Customer>>('/crm/customers', { params })
}

export function createCustomer(data: Partial<Customer>) {
  if (isMockMode) return mockService.createCustomer(data)
  return apiPost<Record<string, never>, Partial<Customer>>('/crm/customers', data)
}

export function updateCustomer(id: string, data: Partial<Customer>) {
  if (isMockMode) return mockService.updateCustomer(id, data)
  return apiPut<Record<string, never>, Partial<Customer>>(`/crm/customers/${id}`, data)
}

export function deleteCustomer(id: string) {
  if (isMockMode) return mockService.deleteCustomer(id)
  return apiDelete<Record<string, never>>(`/crm/customers/${id}`)
}

export interface SalesOrder {
  id: string
  code: string
  customer_name: string
  material_name: string
  qty: number
  amount: number
  delivery_date: string
  status: 'approved' | 'in_production' | 'pending_delivery' | 'completed'
}

export interface SalesOrderQuery {
  pageNum: number
  pageSize: number
  code?: string
  customerName?: string
  status?: string
}

export function getSalesOrderList(params: SalesOrderQuery) {
  if (isMockMode) return mockService.getSalesOrderList(params) as Promise<ApiResponse<PaginatedData<SalesOrder>>>
  return apiGet<PaginatedData<SalesOrder>>('/crm/sales-orders', { params })
}

export function createSalesOrder(data: Partial<SalesOrder>) {
  if (isMockMode) return mockService.createSalesOrder(data)
  return apiPost<Record<string, never>, Partial<SalesOrder>>('/crm/sales-orders', data)
}

export function updateSalesOrder(id: string, data: Partial<SalesOrder>) {
  if (isMockMode) return mockService.updateSalesOrder(id, data)
  return apiPut<Record<string, never>, Partial<SalesOrder>>(`/crm/sales-orders/${id}`, data)
}

export function deleteSalesOrder(id: string) {
  if (isMockMode) return mockService.deleteSalesOrder(id)
  return apiDelete<Record<string, never>>(`/crm/sales-orders/${id}`)
}

export interface Receivable {
  id: string
  code: string
  customer: string
  amount: number
  settled: number
  balance: number
  due_date: string
  aging: number
}

export interface ReceivableQuery {
  pageNum: number
  pageSize: number
  customer?: string
  status?: 'overdue' | 'settled' | 'pending'
}

export function getReceivableList(params: ReceivableQuery) {
  if (isMockMode) return mockService.getReceivableList(params) as Promise<ApiResponse<PaginatedData<Receivable>>>
  return apiGet<PaginatedData<Receivable>>('/crm/receivables', { params })
}

export function createReceipt(data: Partial<Receivable>) {
  if (isMockMode) return mockService.createReceipt(data)
  return apiPost<Record<string, never>, Partial<Receivable>>('/crm/receivables', data)
}
