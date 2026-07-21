import * as staticService from '@/static/services/work-order'
import { isStaticMode } from './_config'
import { apiGet, apiPost, apiPut, type ApiResponse, type PaginatedData } from './_factory'

export interface WorkOrder {
  id: string
  code: string
  wo_type: 'production' | 'rework' | 'sample'
  material_id: string
  material_code: string
  material_name: string
  material_spec?: string
  planned_qty: number
  completed_qty: number
  defective_qty: number
  status: 'draft' | 'approved' | 'released' | 'in_progress' | 'completed' | 'closed'
  priority: 'urgent' | 'high' | 'normal' | 'low'
  workshop_name: string
  line_name?: string
  current_operation?: string
  bom_version?: string
  routing_version?: string
  customer_po?: string
  planned_start_date: string
  planned_end_date: string
  actual_start_date?: string
  created_by?: string
  created_at?: string
}

export interface WorkOrderQuery {
  pageNum: number
  pageSize: number
  code?: string
  status?: string
  priority?: string
  workshopId?: string
  workshopName?: string
  startDate?: string
  endDate?: string
}

export function getWorkOrderList(params: WorkOrderQuery) {
  if (isStaticMode) return staticService.getWorkOrderList(params) as Promise<ApiResponse<PaginatedData<WorkOrder>>>
  return apiGet<PaginatedData<WorkOrder>>('/work-orders', { params })
}

export function getWorkOrderDetail(id: string) {
  if (isStaticMode) return staticService.getWorkOrderDetail(id)
  return apiGet<WorkOrder>(`/work-orders/${id}`)
}

export function createWorkOrder(data: any) {
  if (isStaticMode) return staticService.createWorkOrder(data)
  return apiPost<Record<string, never>, any>('/work-orders', data)
}

export function approveWorkOrder(id: string, approved: boolean, comment?: string) {
  if (isStaticMode) return staticService.approveWorkOrder(id, approved, comment)
  return apiPut<Record<string, never>, { approved: boolean; comment?: string }>(`/work-orders/${id}/approve`, { approved, comment })
}

export function releaseWorkOrder(id: string) {
  if (isStaticMode) return staticService.releaseWorkOrder(id)
  return apiPut<Record<string, never>>(`/work-orders/${id}/release`)
}

export function closeWorkOrder(id: string, data: { close_type: string; reason?: string; wip_disposition?: string }) {
  if (isStaticMode) return staticService.closeWorkOrder(id, data)
  return apiPut<Record<string, never>, { close_type: string; reason?: string; wip_disposition?: string }>(`/work-orders/${id}/close`, data)
}

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
  if (isStaticMode) return staticService.getWorkOrderOperations(workOrderId)
  return apiGet<WoOperation[]>(`/work-orders/${workOrderId}/operations`)
}

export function assignOperation(operationId: string, data: { team_id: string; worker_id?: string; equipment_id?: string }) {
  if (isStaticMode) return staticService.assignOperation(operationId, data)
  return apiPut<Record<string, never>, { team_id: string; worker_id?: string; equipment_id?: string }>(`/operations/${operationId}/assign`, data)
}

export function startOperation(operationId: string) {
  if (isStaticMode) return staticService.startOperation(operationId)
  return apiPut<Record<string, never>>(`/operations/${operationId}/start`)
}

export function reportOperation(
  operationId: string,
  data: { qualified_qty: number; defective_qty: number; defect_reasons?: string[]; actual_hours: number }
) {
  if (isStaticMode) return staticService.reportOperation(operationId, data)
  return apiPut<Record<string, never>, { qualified_qty: number; defective_qty: number; defect_reasons?: string[]; actual_hours: number }>(
    `/operations/${operationId}/report`,
    data
  )
}

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
  if (isStaticMode) return staticService.getKanbanData()
  return apiGet<KanbanOp[]>('/work-orders/kanban')
}

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
  if (isStaticMode) return staticService.getMyTasks()
  return apiGet<MyTasksData>('/work-orders/my-tasks')
}

export interface ReportRecord {
  time: string
  qualified_qty: number
  defective_qty: number
  defect_reasons: string
  actual_hours: number
  worker: string
  status?: 'draft' | 'submitted' | 'confirmed' | 'rejected'
}

export interface ReportHistoryQuery {
  pageNum: number
  pageSize: number
  workOrderCode?: string
  worker?: string
  startDate?: string
  endDate?: string
}

export function getReportHistory(params: ReportHistoryQuery) {
  if (isStaticMode) return staticService.getReportHistory(params) as Promise<ApiResponse<PaginatedData<ReportRecord>>>
  return apiGet<PaginatedData<ReportRecord>>('/work-orders/report-history', { params })
}

export interface OutsourceOrder {
  id: string
  code: string
  material: string
  qty: number
  supplier: string
  operation: string
  send_date: string
  due_date: string
  price: number
  status: 'sent' | 'processing' | 'received' | 'settled'
}

export interface OutsourceOrderQuery {
  pageNum: number
  pageSize: number
  keyword?: string
  status?: OutsourceOrder['status']
  supplier?: string
}

export function getOutsourceOrders(params: OutsourceOrderQuery) {
  if (isStaticMode) return staticService.getOutsourceOrders(params) as Promise<ApiResponse<PaginatedData<OutsourceOrder>>>
  return apiGet<PaginatedData<OutsourceOrder>>('/work-orders/outsource', { params })
}

export function createOutsourceOrder(data: Partial<OutsourceOrder>) {
  if (isStaticMode) return staticService.createOutsourceOrder(data)
  return apiPost<OutsourceOrder, Partial<OutsourceOrder>>('/work-orders/outsource', data)
}

export function updateOutsourceOrder(id: string, data: Partial<OutsourceOrder>) {
  if (isStaticMode) return staticService.updateOutsourceOrder(id, data)
  return apiPut<OutsourceOrder, Partial<OutsourceOrder>>(`/work-orders/outsource/${id}`, data)
}

export function updateOutsourceOrderStatus(id: string, status: OutsourceOrder['status']) {
  if (isStaticMode) return staticService.updateOutsourceOrderStatus(id, status)
  return apiPut<OutsourceOrder, { status: OutsourceOrder['status'] }>(`/work-orders/outsource/${id}/status`, { status })
}

export interface TraceRecord {
  id: string
  wo_code: string
  operation_name: string
  worker: string
  qualified_qty: number
  defective_qty: number
  defect_reasons: string
  actual_hours: number
  time: string
}

export interface TraceRecordQuery {
  pageNum: number
  pageSize: number
  wo_code?: string
  worker?: string
  startDate?: string
  endDate?: string
}

export function getTraceRecords(params: TraceRecordQuery) {
  if (isStaticMode) return staticService.getTraceRecords(params).then(mapTraceRecordResponse)
  return apiGet<PaginatedData<any>>('/work-orders/trace-records', { params }).then(mapTraceRecordResponse)
}

function mapTraceRecordResponse(response: ApiResponse<PaginatedData<any>>): ApiResponse<PaginatedData<TraceRecord>> {
  return {
    ...response,
    data: {
      ...response.data,
      list: (response.data?.list || []).map(mapTraceRecord)
    }
  }
}

function mapTraceRecord(item: any): TraceRecord {
  return {
    id: String(item.id || ''),
    wo_code: item.wo_code || '',
    operation_name: item.operation_name || item.op_name || '',
    worker: item.worker || '',
    qualified_qty: Number(item.qualified_qty ?? item.qualified ?? 0),
    defective_qty: Number(item.defective_qty ?? item.defective ?? 0),
    defect_reasons: item.defect_reasons || item.reasons || '',
    actual_hours: Number(item.actual_hours ?? item.hours ?? 0),
    time: item.time || ''
  }
}
