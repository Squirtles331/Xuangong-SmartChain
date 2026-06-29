/**
 * 工单管理 Mock Service
 * 模拟分页、过滤、CRUD 等操作
 */
import { simulateDelay } from '../shared/delay'
import { paginate, searchItems } from '../shared/paginate'
import { wrapListResponse, wrapDetailResponse, wrapSuccessResponse } from '../shared/response'
import { generateId } from '../shared/id'
import { workOrders, workOrderOperations, kanbanOps, reportHistory, myTasks } from '../modules/work-order'

// ==================== 工单管理 ====================
export async function getWorkOrderList(params: {
  page: number
  page_size: number
  code?: string
  status?: string
  priority?: string
  workshop_id?: string
  start_date?: string
  end_date?: string
}) {
  await simulateDelay()
  let filtered = [...workOrders]
  if (params.code) filtered = searchItems(filtered, params.code, ['code'])
  if (params.status) filtered = filtered.filter((wo: any) => wo.status === params.status)
  if (params.priority) filtered = filtered.filter((wo: any) => wo.priority === params.priority)
  if (params.workshop_id) filtered = filtered.filter((wo: any) => String(wo.workshop_id || wo.id) === params.workshop_id)
  if (params.start_date) filtered = filtered.filter((wo: any) => wo.planned_start_date >= params.start_date!)
  if (params.end_date) filtered = filtered.filter((wo: any) => wo.planned_end_date <= params.end_date!)
  const result = paginate(filtered, params.page, params.page_size)
  return wrapListResponse(result.items, result.total, result.page, result.page_size)
}

export async function getWorkOrderDetail(id: string) {
  await simulateDelay()
  const wo = workOrders.find((w: any) => String(w.id) === id)
  if (!wo) {
    return { code: 404, data: null, message: '工单不存在' }
  }
  const operations = workOrderOperations.filter((op: any) => String(op.work_order_id || '1') === id)
  return wrapDetailResponse({ ...wo, operations })
}

export async function createWorkOrder(data: any) {
  await simulateDelay()
  const newWo = { id: generateId(), created_at: new Date().toISOString().slice(0, 19), ...data }
  workOrders.unshift(newWo)
  return wrapSuccessResponse('工单创建成功')
}

export async function approveWorkOrder(id: string, approved: boolean, comment?: string) {
  await simulateDelay()
  const wo = workOrders.find((w: any) => String(w.id) === id)
  if (wo) {
    wo.status = approved ? 'approved' : 'draft'
    if (comment) (wo as any).approval_comment = comment
  }
  return wrapSuccessResponse(approved ? '审批通过' : '审批驳回')
}

export async function releaseWorkOrder(id: string) {
  await simulateDelay()
  const wo = workOrders.find((w: any) => String(w.id) === id)
  if (wo) wo.status = 'released'
  return wrapSuccessResponse('工单已下达')
}

export async function closeWorkOrder(id: string, data: { close_type: string; reason?: string; wip_disposition?: string }) {
  await simulateDelay()
  const wo = workOrders.find((w: any) => String(w.id) === id)
  if (wo) {
    wo.status = 'closed'
    ;(wo as any).close_type = data.close_type
    ;(wo as any).close_reason = data.reason
    ;(wo as any).wip_disposition = data.wip_disposition
  }
  return wrapSuccessResponse('工单已关闭')
}

// ==================== 工序相关 ====================
export async function getWorkOrderOperations(workOrderId: string) {
  await simulateDelay()
  const ops = workOrderOperations.filter((op: any) => String(op.work_order_id || '1') === workOrderId)
  return wrapDetailResponse(ops)
}

export async function assignOperation(operationId: string, data: { team_id: string; worker_id?: string; equipment_id?: string }) {
  await simulateDelay()
  const op = workOrderOperations.find((o: any) => String(o.id) === operationId)
  if (op) {
    op.status = 'assigned'
    if (data.worker_id) op.worker = data.worker_id
    if (data.team_id) (op as any).team_id = data.team_id
    if (data.equipment_id) (op as any).equipment_id = data.equipment_id
  }
  return wrapSuccessResponse('工序指派成功')
}

export async function startOperation(operationId: string) {
  await simulateDelay()
  const op = workOrderOperations.find((o: any) => String(o.id) === operationId)
  if (op) {
    op.status = 'running'
    ;(op as any).actual_start_time = new Date().toISOString().slice(0, 19)
  }
  return wrapSuccessResponse('工序已开工')
}

export async function reportOperation(
  operationId: string,
  data: { qualified_qty: number; defective_qty: number; defect_reasons?: string[]; actual_hours: number }
) {
  await simulateDelay()
  const op = workOrderOperations.find((o: any) => String(o.id) === operationId)
  if (op) {
    op.status = 'completed'
    op.qualified_qty = data.qualified_qty
    op.defective_qty = data.defective_qty
    op.actual_hours = data.actual_hours
    ;(op as any).actual_end_time = new Date().toISOString().slice(0, 19)
    ;(op as any).defect_reasons = data.defect_reasons
  }
  // 追加报工记录
  reportHistory.unshift({
    time: new Date().toISOString().slice(0, 16).replace('T', ' '),
    qualified_qty: data.qualified_qty,
    defective_qty: data.defective_qty,
    defect_reasons: (data.defect_reasons || []).join(', '),
    actual_hours: data.actual_hours * 60, // hours → minutes for consistency with existing data
    worker: op?.worker || '-'
  } as any)
  return wrapSuccessResponse('报工成功')
}

// ==================== Kanban 看板 ====================
export async function getKanbanData() {
  await simulateDelay()
  return wrapDetailResponse(kanbanOps)
}

// ==================== 我的任务 ====================
export async function getMyTasks() {
  await simulateDelay()
  return wrapDetailResponse(myTasks)
}

// ==================== 报工记录 ====================
export async function getReportHistory() {
  await simulateDelay()
  return wrapDetailResponse(reportHistory)
}
