import http from '@/utils/http'
import type { ApiResponse } from '@/utils/http'
import { isMockMode } from './_config'
import * as mockService from '@/mock/services/work-order'

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
  if (isMockMode) return mockService.getWorkOrderList(params)
  return http.get<ApiResponse<{ total: number; items: WorkOrder[] }>>('/work-orders', { params })
}

export function getWorkOrderDetail(id: string) {
  if (isMockMode) return mockService.getWorkOrderDetail(id)
  return http.get<ApiResponse<WorkOrder>>(`/work-orders/${id}`)
}

export function createWorkOrder(data: any) {
  if (isMockMode) return mockService.createWorkOrder(data)
  return http.post('/work-orders', data)
}

export function approveWorkOrder(id: string, approved: boolean, comment?: string) {
  if (isMockMode) return mockService.approveWorkOrder(id, approved, comment)
  return http.put(`/work-orders/${id}/approve`, { approved, comment })
}

export function releaseWorkOrder(id: string) {
  if (isMockMode) return mockService.releaseWorkOrder(id)
  return http.put(`/work-orders/${id}/release`)
}

export function closeWorkOrder(id: string, data: { close_type: string; reason?: string; wip_disposition?: string }) {
  if (isMockMode) return mockService.closeWorkOrder(id, data)
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
  if (isMockMode) return mockService.getWorkOrderOperations(workOrderId)
  return http.get<ApiResponse<WoOperation[]>>(`/work-orders/${workOrderId}/operations`)
}

export function assignOperation(operationId: string, data: { team_id: string; worker_id?: string; equipment_id?: string }) {
  if (isMockMode) return mockService.assignOperation(operationId, data)
  return http.put(`/operations/${operationId}/assign`, data)
}

export function startOperation(operationId: string) {
  if (isMockMode) return mockService.startOperation(operationId)
  return http.put(`/operations/${operationId}/start`)
}

export function reportOperation(
  operationId: string,
  data: { qualified_qty: number; defective_qty: number; defect_reasons?: string[]; actual_hours: number }
) {
  if (isMockMode) return mockService.reportOperation(operationId, data)
  return http.put(`/operations/${operationId}/report`, data)
}

// ==================== Kanban 看板 ====================
export interface KanbanOp {
  id: string
  wo_code: string
  wo_priority: string
  material_name: string
  operation_no: number
  name: string
  work_center: string
  total_hours: number
  status: string
  worker?: string
  planned_start?: string
  progress?: number
  qualified_qty?: number
  defective_qty?: number
}

export function getKanbanData() {
  if (isMockMode) return mockService.getKanbanData()
  return http.get<ApiResponse<KanbanOp[]>>('/work-orders/kanban')
}

// ==================== 我的任务 ====================
export interface MyTask {
  id: string
  wo_id: string
  wo_code: string
  wo_priority: string
  material_name: string
  operation_no: number
  operation_name: string
  work_center: string
  planned_qty: number
  reported_qty: number
  planned_start?: string
  planned_end?: string
  status: string
  qc_required?: boolean
  inspected?: boolean
}

export interface MyTasksData {
  assigned: MyTask[]
  running: MyTask[]
  completed: MyTask[]
}

export function getMyTasks() {
  if (isMockMode) return mockService.getMyTasks()
  return http.get<ApiResponse<MyTasksData>>('/work-orders/my-tasks')
}

// ==================== 报工记录 ====================
export interface ReportRecord {
  time: string
  qualified_qty: number
  defective_qty: number
  defect_reasons: string
  actual_hours: number
  worker: string
}

export function getReportHistory() {
  if (isMockMode) return mockService.getReportHistory()
  return http.get<ApiResponse<ReportRecord[]>>('/work-orders/report-history')
}
