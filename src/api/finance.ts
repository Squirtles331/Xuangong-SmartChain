import { isMockMode } from './_config'
import { apiDelete, apiGet, apiPost, apiPut, type ApiResponse, type PaginatedData } from './_factory'
import * as mockService from '@/mock/services/finance'

export type FinancePayableStatus = 'open' | 'paid' | 'partial'
export type FinanceReconciliationStatus = 'matched' | 'pending'

export interface FinancePayable {
  id: string
  code: string
  supplier: string
  amount: number
  paid: number
  balance: number
  due_date: string
  status: FinancePayableStatus
}

export interface FinancePayableQuery {
  pageNum: number
  pageSize: number
  code?: string
  supplier?: string
  status?: FinancePayableStatus
}

export interface FinanceCostDetail {
  id: string
  product: string
  material_cost: number
  labor_cost: number
  overhead: number
  total: number
  period: string
}

export interface FinanceCostQuery {
  pageNum: number
  pageSize: number
  product?: string
  period?: string
}

export interface FinanceAccountSummary {
  id: string
  code: string
  account: string
  type: string
  amount: number
}

export interface FinanceLedgerEntry {
  id: string
  date: string
  voucher: string
  account: string
  debit: number
  credit: number
  summary: string
}

export interface FinanceReconciliationItem {
  id: string
  date: string
  voucher: string
  debit_account: string
  credit_account: string
  debit: number
  credit: number
  diff: number
  status: FinanceReconciliationStatus
}

export interface FinanceLedgerCard {
  title: string
  value: number
}

export interface FinanceLedgerOverview {
  cards: FinanceLedgerCard[]
  debitData: FinanceAccountSummary[]
  creditData: FinanceAccountSummary[]
  ledgerData: FinanceLedgerEntry[]
  recData: FinanceReconciliationItem[]
}

export interface FinanceReportMetrics {
  revenue: number
  cost: number
  gross: number
  receivable: number
  payable: number
  profit: number
}

export interface FinanceReportSummary {
  currentMonth: FinanceReportMetrics
  lastMonth: FinanceReportMetrics
}

export function getFinancePayableList(params: FinancePayableQuery) {
  if (isMockMode) return mockService.getFinancePayableList(params) as Promise<ApiResponse<PaginatedData<FinancePayable>>>
  return apiGet<PaginatedData<FinancePayable>>('/finance/payables', { params })
}

export function createFinancePayable(data: Partial<FinancePayable>) {
  if (isMockMode) return mockService.createFinancePayable(data)
  return apiPost<Record<string, never>, Partial<FinancePayable>>('/finance/payables', data)
}

export function updateFinancePayable(id: string, data: Partial<FinancePayable>) {
  if (isMockMode) return mockService.updateFinancePayable(id, data)
  return apiPut<Record<string, never>, Partial<FinancePayable>>(`/finance/payables/${id}`, data)
}

export function deleteFinancePayable(id: string) {
  if (isMockMode) return mockService.deleteFinancePayable(id)
  return apiDelete<Record<string, never>>(`/finance/payables/${id}`)
}

export function getFinanceCostList(params: FinanceCostQuery) {
  if (isMockMode) return mockService.getFinanceCostList(params) as Promise<ApiResponse<PaginatedData<FinanceCostDetail>>>
  return apiGet<PaginatedData<FinanceCostDetail>>('/finance/cost-details', { params })
}

export function getFinanceLedgerOverview() {
  if (isMockMode) return mockService.getFinanceLedgerOverview() as Promise<ApiResponse<FinanceLedgerOverview>>
  return apiGet<FinanceLedgerOverview>('/finance/ledger-overview')
}

export function getFinanceReportSummary() {
  if (isMockMode) return mockService.getFinanceReportSummary() as Promise<ApiResponse<FinanceReportSummary>>
  return apiGet<FinanceReportSummary>('/finance/report-summary')
}
