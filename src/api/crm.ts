import { isStaticMode } from './_config'
import { apiDelete, apiGet, apiPost, apiPut, type ApiResponse, type PaginatedData } from './_factory'
import * as staticService from '@/static/services/crm'

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
  code?: string
  name?: string
  status?: string
}

export function getCustomerList(params: CustomerQuery) {
  if (isStaticMode) return staticService.getCustomerList(params as any) as unknown as Promise<ApiResponse<PaginatedData<Customer>>>
  return apiGet<PaginatedData<Customer>>('/crm/customers', { params })
}

export function createCustomer(data: Partial<Customer>) {
  if (isStaticMode) return staticService.createCustomer(data as any) as unknown as Promise<ApiResponse<Record<string, never>>>
  return apiPost<Record<string, never>, Partial<Customer>>('/crm/customers', data)
}

export function updateCustomer(id: string, data: Partial<Customer>) {
  if (isStaticMode) return staticService.updateCustomer(id, data as any) as unknown as Promise<ApiResponse<Record<string, never>>>
  return apiPut<Record<string, never>, Partial<Customer>>(`/crm/customers/${id}`, data)
}

export function deleteCustomer(id: string) {
  if (isStaticMode) return staticService.deleteCustomer(id) as unknown as Promise<ApiResponse<Record<string, never>>>
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
  if (isStaticMode) return staticService.getSalesOrderList(params as any) as unknown as Promise<ApiResponse<PaginatedData<SalesOrder>>>
  return apiGet<PaginatedData<SalesOrder>>('/crm/sales-orders', { params })
}

export function getSalesOrderDetail(id: string) {
  if (isStaticMode) return staticService.getSalesOrderDetail(id) as unknown as Promise<ApiResponse<SalesOrder | null>>
  return apiGet<SalesOrder>(`/crm/sales-orders/${id}`)
}

export function createSalesOrder(data: Partial<SalesOrder>) {
  if (isStaticMode) return staticService.createSalesOrder(data as any) as unknown as Promise<ApiResponse<Record<string, never>>>
  return apiPost<Record<string, never>, Partial<SalesOrder>>('/crm/sales-orders', data)
}

export function updateSalesOrder(id: string, data: Partial<SalesOrder>) {
  if (isStaticMode) return staticService.updateSalesOrder(id, data as any) as unknown as Promise<ApiResponse<Record<string, never>>>
  return apiPut<Record<string, never>, Partial<SalesOrder>>(`/crm/sales-orders/${id}`, data)
}

export function deleteSalesOrder(id: string) {
  if (isStaticMode) return staticService.deleteSalesOrder(id) as unknown as Promise<ApiResponse<Record<string, never>>>
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
  agingRange?: '0' | '1' | '2' | '3' | '4'
}

export function getReceivableList(params: ReceivableQuery) {
  if (isStaticMode) return staticService.getReceivableList(params as any) as unknown as Promise<ApiResponse<PaginatedData<Receivable>>>
  return apiGet<PaginatedData<Receivable>>('/crm/receivables', { params })
}

export function createReceipt(data: Partial<Receivable>) {
  if (isStaticMode) return staticService.createReceipt(data as any) as unknown as Promise<ApiResponse<Record<string, never>>>
  return apiPost<Record<string, never>, Partial<Receivable>>('/crm/receivables', data)
}

export interface ReceiptCreatePayload {
  customer: string
  amount: number
  date?: string
  method?: string
}

export function createReceiptRecord(data: ReceiptCreatePayload) {
  if (isStaticMode) return staticService.createReceipt(data as any) as unknown as Promise<ApiResponse<Record<string, never>>>
  return apiPost<Record<string, never>, ReceiptCreatePayload>('/crm/receivables', data)
}

export interface Quotation {
  id: string
  code: string
  customer: string
  product: string
  qty: number
  price: number
  amount: number
  valid_date: string
  status: 'draft' | 'sent' | 'approved' | 'lost'
}

export interface QuotationQuery {
  pageNum: number
  pageSize: number
  code?: string
  customer?: string
  status?: Quotation['status']
}

export function getQuotationList(params: QuotationQuery) {
  if (isStaticMode) return staticService.getQuotationList(params as any) as unknown as Promise<ApiResponse<PaginatedData<Quotation>>>
  return apiGet<PaginatedData<Quotation>>('/crm/quotations', { params })
}

export function saveQuotation(data: Partial<Quotation>) {
  if (isStaticMode) return staticService.saveQuotation(data as any) as unknown as Promise<ApiResponse<Quotation>>
  return data.id
    ? apiPut<Quotation, Partial<Quotation>>(`/crm/quotations/${data.id}`, data)
    : apiPost<Quotation, Partial<Quotation>>('/crm/quotations', data)
}

export function deleteQuotation(id: string) {
  if (isStaticMode) return staticService.deleteQuotation(id) as unknown as Promise<ApiResponse<Record<string, never>>>
  return apiDelete<Record<string, never>>(`/crm/quotations/${id}`)
}

export interface Opportunity {
  id: string
  customer: string
  product: string
  amount: number
  stage: 'initial' | 'solution' | 'quotation' | 'won'
  probability: number
  owner: string
  close_date: string
}

export interface OpportunityQuery {
  pageNum: number
  pageSize: number
  keyword?: string
  stage?: Opportunity['stage']
}

export function getOpportunityList(params: OpportunityQuery) {
  if (isStaticMode) return staticService.getOpportunityList(params as any) as unknown as Promise<ApiResponse<PaginatedData<Opportunity>>>
  return apiGet<PaginatedData<Opportunity>>('/crm/opportunities', { params })
}

export function saveOpportunity(data: Partial<Opportunity>) {
  if (isStaticMode) return staticService.saveOpportunity(data as any) as unknown as Promise<ApiResponse<Opportunity>>
  return data.id
    ? apiPut<Opportunity, Partial<Opportunity>>(`/crm/opportunities/${data.id}`, data)
    : apiPost<Opportunity, Partial<Opportunity>>('/crm/opportunities', data)
}

export function deleteOpportunity(id: string) {
  if (isStaticMode) return staticService.deleteOpportunity(id) as unknown as Promise<ApiResponse<Record<string, never>>>
  return apiDelete<Record<string, never>>(`/crm/opportunities/${id}`)
}

export function convertOpportunity(id: string) {
  if (isStaticMode) return staticService.convertOpportunity(id) as unknown as Promise<ApiResponse<Record<string, never>>>
  return apiPut<Record<string, never>>(`/crm/opportunities/${id}/convert`)
}

export interface Contract {
  id: string
  code: string
  customer: string
  amount: number
  sign_date: string
  start_date: string
  end_date: string
  status: 'draft' | 'active' | 'expired' | 'terminated'
}

export interface ContractQuery {
  pageNum: number
  pageSize: number
  keyword?: string
  status?: Contract['status']
}

export function getContractList(params: ContractQuery) {
  if (isStaticMode) return staticService.getContractList(params as any) as unknown as Promise<ApiResponse<PaginatedData<Contract>>>
  return apiGet<PaginatedData<Contract>>('/crm/contracts', { params })
}

export function saveContract(data: Partial<Contract>) {
  if (isStaticMode) return staticService.saveContract(data as any) as unknown as Promise<ApiResponse<Contract>>
  return data.id
    ? apiPut<Contract, Partial<Contract>>(`/crm/contracts/${data.id}`, data)
    : apiPost<Contract, Partial<Contract>>('/crm/contracts', data)
}

export function deleteContract(id: string) {
  if (isStaticMode) return staticService.deleteContract(id) as unknown as Promise<ApiResponse<Record<string, never>>>
  return apiDelete<Record<string, never>>(`/crm/contracts/${id}`)
}

export interface Invoice {
  id: string
  code: string
  customer: string
  order_code: string
  amount: number
  tax_rate: number
  tax_amount: number
  total: number
  issue_date: string
  status: 'draft' | 'issued' | 'voided' | 'red'
}

export interface InvoiceQuery {
  pageNum: number
  pageSize: number
  keyword?: string
  status?: Invoice['status']
}

export function getInvoiceList(params: InvoiceQuery) {
  if (isStaticMode) return staticService.getInvoiceList(params as any) as unknown as Promise<ApiResponse<PaginatedData<Invoice>>>
  return apiGet<PaginatedData<Invoice>>('/crm/invoices', { params })
}

export function saveInvoice(data: Partial<Invoice>) {
  if (isStaticMode) return staticService.saveInvoice(data as any) as unknown as Promise<ApiResponse<Invoice>>
  return data.id ? apiPut<Invoice, Partial<Invoice>>(`/crm/invoices/${data.id}`, data) : apiPost<Invoice, Partial<Invoice>>('/crm/invoices', data)
}

export function issueInvoice(id: string) {
  if (isStaticMode) return staticService.issueInvoice(id) as unknown as Promise<ApiResponse<Record<string, never>>>
  return apiPut<Record<string, never>>(`/crm/invoices/${id}/issue`)
}

export function settleReceivables(data: { items: Array<{ id: string; amount: number }> }) {
  if (isStaticMode) return staticService.settleReceivables(data as any) as unknown as Promise<ApiResponse<Record<string, never>>>
  return apiPost<Record<string, never>, { items: Array<{ id: string; amount: number }> }>('/crm/receivables/settle', data)
}
