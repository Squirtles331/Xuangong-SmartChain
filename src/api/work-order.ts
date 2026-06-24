import http from '@/utils/http'
import type { ApiResponse } from '@/utils/http'

// ==================== 工单管理 ====================
export interface WorkOrder {
  id: string
  code: string
  wo_type: 'production' | 'rework' | 'sample'
  material_id: string
  material_code: string
  material_name: string
  planned_qty: number
  completed_qty: number
  defective_qty: number
  status: 'draft' | 'approved' | 'released' | 'in_progress' | 'completed' | 'closed'
  priority: 'urgent' | 'high' | 'normal' | 'low'
  workshop_name: string
  planned_start_date: string
  planned_end_date: string
}

export interface WorkOrderQuery {
  page: number
  page_size: number
  code?: string
  status?: string
  priority?: string
  workshop_id?: string
  start_date?: string
  end_date?: string
}

export function getWorkOrderList(params: WorkOrderQuery) {
  return http.get<ApiResponse<{ total: number; items: WorkOrder[] }>>('/work-orders', { params })
}

export function getWorkOrderDetail(id: string) {
  return http.get<ApiResponse<WorkOrder>>(`/work-orders/${id}`)
}

export function createWorkOrder(data: any) {
  return http.post('/work-orders', data)
}

export function approveWorkOrder(id: string, approved: boolean, comment?: string) {
  return http.put(`/work-orders/${id}/approve`, { approved, comment })
}

export function releaseWorkOrder(id: string) {
  return http.put(`/work-orders/${id}/release`)
}

export function closeWorkOrder(id: string, data: { close_type: string; reason?: string; wip_disposition?: string }) {
  return http.put(`/work-orders/${id}/close`, data)
}

// 工序相关
export interface WoOperation {
  id: string
  work_order_id: string
  operation_no: number
  name: string
  status: 'pending' | 'assigned' | 'running' | 'completed' | 'inspected'
  assigned_worker_name?: string
  work_center_name?: string
  planned_start_time?: string
  planned_end_time?: string
  actual_start_time?: string
  actual_end_time?: string
  qualified_qty?: number
  defective_qty?: number
}

export function getWorkOrderOperations(workOrderId: string) {
  return http.get<ApiResponse<WoOperation[]>>(`/work-orders/${workOrderId}/operations`)
}

export function assignOperation(operationId: string, data: { team_id: string; worker_id?: string; equipment_id?: string }) {
  return http.put(`/operations/${operationId}/assign`, data)
}

export function startOperation(operationId: string) {
  return http.put(`/operations/${operationId}/start`)
}

export function reportOperation(
  operationId: string,
  data: { qualified_qty: number; defective_qty: number; defect_reasons?: string[]; actual_hours: number }
) {
  return http.put(`/operations/${operationId}/report`, data)
}
