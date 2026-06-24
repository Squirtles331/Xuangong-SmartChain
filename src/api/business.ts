import http from '@/utils/http'
import type { ApiResponse } from '@/utils/http'

// ==================== 营销中心 ====================
export function getCustomerList(params: any) {
  return http.get<ApiResponse<any>>('/crm/customers', { params })
}

export function getSalesOrderList(params: any) {
  return http.get<ApiResponse<any>>('/crm/orders', { params })
}

export function createSalesOrder(data: any) {
  return http.post('/crm/orders', data)
}

export function getDeliveryList(params: any) {
  return http.get<ApiResponse<any>>('/crm/deliveries', { params })
}

export function getReceivableList(params: any) {
  return http.get<ApiResponse<any>>('/crm/receivables', { params })
}

export function createReceipt(data: any) {
  return http.post('/crm/receipts', data)
}

// ==================== MRP ====================
export function runMRP(data?: { plant_id?: string }) {
  return http.post<ApiResponse<{ run_id: string }>>('/mrp/run', data || {})
}

export function getMRPResults(runId: string, params: { type: 'purchase' | 'production' | 'exception'; page: number; page_size: number }) {
  return http.get<ApiResponse<any>>(`/mrp/runs/${runId}/results`, { params })
}

export function confirmMRPSuggestions(runId: string, ids: string[]) {
  return http.put(`/mrp/runs/${runId}/confirm`, { ids })
}

// ==================== BOM 与工艺路线 ====================
export function getBOMList(params: any) {
  return http.get<ApiResponse<any>>('/bom/versions', { params })
}

export function getBOMTree(versionId: string) {
  return http.get<ApiResponse<any>>(`/bom/versions/${versionId}/tree`)
}

export function saveBOM(data: any) {
  return http.post('/bom/versions', data)
}

export function getRoutingList(params: any) {
  return http.get<ApiResponse<any>>('/routing/versions', { params })
}

export function saveRouting(data: any) {
  return http.post('/routing/versions', data)
}

export function getECNList(params: any) {
  return http.get<ApiResponse<any>>('/ecn/orders', { params })
}

// ==================== 采购仓储质检 ====================
export function getSupplierList(params: any) {
  return http.get<ApiResponse<any>>('/scm/suppliers', { params })
}

export function getPurchaseOrderList(params: any) {
  return http.get<ApiResponse<any>>('/scm/purchase-orders', { params })
}

export function getInventoryList(params: any) {
  return http.get<ApiResponse<any>>('/wms/inventory', { params })
}

export function getInspectionTaskList(params: any) {
  return http.get<ApiResponse<any>>('/qms/inspections', { params })
}

// ==================== APS ====================
export function runSchedule(data?: { workshop_id?: string }) {
  return http.post<ApiResponse<{ schedule_id: string }>>('/aps/run', data || {})
}

export function getScheduleGantt(scheduleId: string) {
  return http.get<ApiResponse<any>>(`/aps/schedules/${scheduleId}/gantt`)
}

export function getWorkCenterLoad(scheduleId: string) {
  return http.get<ApiResponse<any>>(`/aps/schedules/${scheduleId}/load`)
}
