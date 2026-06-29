import http from '@/utils/http'
import type { ApiResponse } from '@/utils/http'
import { isMockMode } from './_config'
import * as mockService from '@/mock/services/crm'

// ==================== 客户 ====================
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
  page: number
  page_size: number
  name?: string
  status?: string
}

export function getCustomerList(params: CustomerQuery) {
  if (isMockMode) return mockService.getCustomerList(params)
  return http.get<ApiResponse<{ total: number; items: Customer[] }>>('/crm/customers', { params })
}

export function createCustomer(data: Partial<Customer>) {
  if (isMockMode) return mockService.createCustomer(data)
  return http.post('/crm/customers', data)
}

export function updateCustomer(id: string, data: Partial<Customer>) {
  if (isMockMode) return mockService.updateCustomer(id, data)
  return http.put(`/crm/customers/${id}`, data)
}

export function deleteCustomer(id: string) {
  if (isMockMode) return mockService.deleteCustomer(id)
  return http.delete(`/crm/customers/${id}`)
}

// ==================== 销售订单 ====================
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
  page: number
  page_size: number
  code?: string
  customer_name?: string
  status?: string
}

export function getSalesOrderList(params: SalesOrderQuery) {
  if (isMockMode) return mockService.getSalesOrderList(params)
  return http.get<ApiResponse<{ total: number; items: SalesOrder[] }>>('/crm/sales-orders', { params })
}

export function createSalesOrder(data: Partial<SalesOrder>) {
  if (isMockMode) return mockService.createSalesOrder(data)
  return http.post('/crm/sales-orders', data)
}

export function updateSalesOrder(id: string, data: Partial<SalesOrder>) {
  if (isMockMode) return mockService.updateSalesOrder(id, data)
  return http.put(`/crm/sales-orders/${id}`, data)
}

export function deleteSalesOrder(id: string) {
  if (isMockMode) return mockService.deleteSalesOrder(id)
  return http.delete(`/crm/sales-orders/${id}`)
}

// ==================== 应收台账 ====================
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
  page: number
  page_size: number
  customer?: string
  status?: 'overdue' | 'settled' | 'pending'
}

export function getReceivableList(params: ReceivableQuery) {
  if (isMockMode) return mockService.getReceivableList(params)
  return http.get<ApiResponse<{ total: number; items: Receivable[] }>>('/crm/receivables', { params })
}

export function createReceipt(data: Partial<Receivable>) {
  if (isMockMode) return mockService.createReceipt(data)
  return http.post('/crm/receivables', data)
}
