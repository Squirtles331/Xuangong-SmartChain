import {
  reportHistory as reportHistorySeed,
  workOrderOperations as workOrderOperationsSeed,
  workOrders as workOrdersSeed
} from '@/mock/modules/work-order'
import { generateId } from '@/mock/shared/id'
import { paginate, searchItems } from '@/mock/shared/paginate'
import { MockResponse, wrapCreatedResponse, wrapDetailResponse, wrapListResponse, wrapUpdatedResponse } from '@/mock/shared/response'

type WorkOrderRecord = Record<string, any>
type WorkOrderOperationRecord = Record<string, any>
type ReportHistoryRecord = Record<string, any>

const workOrders = cloneSeed(workOrdersSeed) as WorkOrderRecord[]
const workOrderOperations = cloneSeed(workOrderOperationsSeed) as WorkOrderOperationRecord[]
const reportHistory = cloneSeed(reportHistorySeed) as ReportHistoryRecord[]

function cloneSeed<T>(seed: T): T {
  if (typeof structuredClone === 'function') {
    return structuredClone(seed)
  }

  return JSON.parse(JSON.stringify(seed)) as T
}

function pad(value: number) {
  return String(value).padStart(2, '0')
}

function formatDate(date = new Date()) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

function formatDateTime(date = new Date()) {
  return `${formatDate(date)} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}

function formatDateCompact(date = new Date()) {
  return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}`
}

function createWorkOrderCode(id: string) {
  return `WO${formatDateCompact()}${id.slice(-4).padStart(4, '0')}`
}

function findWorkOrder(id: string) {
  return workOrders.find((item) => String(item.id) === id)
}

function findOperation(id: string) {
  return workOrderOperations.find((item) => String(item.id) === id)
}

export async function getWorkOrderList(params: {
  pageNum: number
  pageSize: number
  code?: string
  status?: string
  priority?: string
  workshopId?: string
  startDate?: string
  endDate?: string
}) {
  let filtered = [...workOrders]

  if (params.code) {
    filtered = searchItems(filtered, params.code, ['code'])
  }

  if (params.status) {
    filtered = filtered.filter((item) => item.status === params.status)
  }

  if (params.priority) {
    filtered = filtered.filter((item) => item.priority === params.priority)
  }

  if (params.workshopId) {
    filtered = filtered.filter((item) => String(item.workshop_id || item.id) === params.workshopId)
  }

  if (params.startDate) {
    filtered = filtered.filter((item) => String(item.planned_start_date || '') >= params.startDate!)
  }

  if (params.endDate) {
    filtered = filtered.filter((item) => String(item.planned_end_date || '') <= params.endDate!)
  }

  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function getWorkOrderDetail(id: string) {
  const workOrder = findWorkOrder(id)

  if (!workOrder) {
    return MockResponse.fail(404, '工单不存在', null)
  }

  const operations = workOrderOperations.filter((item) => String(item.work_order_id || '') === id)
  return wrapDetailResponse({ ...workOrder, operations })
}

export async function createWorkOrder(data: WorkOrderRecord) {
  const id = generateId()
  const next = {
    id,
    code: data.code || createWorkOrderCode(id),
    wo_type: data.wo_type || 'production',
    material_id: data.material_id || data.material_code || '',
    material_code: data.material_code || '',
    material_name: data.material_name || '',
    planned_qty: data.planned_qty ?? 0,
    completed_qty: data.completed_qty ?? 0,
    defective_qty: data.defective_qty ?? 0,
    status: data.status || 'draft',
    priority: data.priority || 'normal',
    workshop_name: data.workshop_name || '',
    planned_start_date: data.planned_start_date || formatDate(),
    planned_end_date: data.planned_end_date || formatDate(),
    created_at: formatDateTime(),
    ...data
  }

  workOrders.unshift(next)
  return wrapCreatedResponse(next, '工单创建成功')
}

export async function approveWorkOrder(id: string, approved: boolean, comment?: string) {
  const workOrder = findWorkOrder(id)

  if (!workOrder) {
    return MockResponse.fail(404, '工单不存在', null)
  }

  workOrder.status = approved ? 'approved' : 'draft'

  if (comment) {
    workOrder.approval_opinion = comment
  }

  return wrapUpdatedResponse(workOrder, approved ? '审核通过' : '审核驳回')
}

export async function releaseWorkOrder(id: string) {
  const workOrder = findWorkOrder(id)

  if (!workOrder) {
    return MockResponse.fail(404, '工单不存在', null)
  }

  workOrder.status = 'released'
  return wrapUpdatedResponse(workOrder, '工单已下发')
}

export async function closeWorkOrder(id: string, data: { close_type: string; reason?: string; wip_disposition?: string }) {
  const workOrder = findWorkOrder(id)

  if (!workOrder) {
    return MockResponse.fail(404, '工单不存在', null)
  }

  workOrder.status = 'closed'
  workOrder.close_type = data.close_type
  workOrder.close_reason = data.reason
  workOrder.wip_disposition = data.wip_disposition

  return wrapUpdatedResponse(workOrder, '工单已关闭')
}

export async function getWorkOrderOperations(workOrderId: string) {
  const operations = workOrderOperations.filter((item) => String(item.work_order_id || '') === workOrderId)
  return wrapDetailResponse(operations)
}

export async function reportOperation(
  operationId: string,
  data: { qualified_qty: number; defective_qty: number; defect_reasons?: string[]; actual_hours: number }
) {
  const operation = findOperation(operationId)

  if (!operation) {
    return MockResponse.fail(404, '工序不存在', null)
  }

  const now = formatDateTime()

  operation.status = 'completed'
  operation.qualified_qty = data.qualified_qty
  operation.defective_qty = data.defective_qty
  operation.actual_hours = data.actual_hours
  operation.actual_end_time = now
  operation.defect_reasons = data.defect_reasons || []

  const workOrder = findWorkOrder(String(operation.work_order_id || ''))

  if (workOrder) {
    const reportedTotal = Number(data.qualified_qty || 0) + Number(data.defective_qty || 0)
    workOrder.completed_qty = Number(workOrder.completed_qty || 0) + reportedTotal
    workOrder.defective_qty = Number(workOrder.defective_qty || 0) + Number(data.defective_qty || 0)

    if (Number(workOrder.completed_qty || 0) >= Number(workOrder.planned_qty || 0)) {
      workOrder.status = 'completed'
    } else if (workOrder.status !== 'closed') {
      workOrder.status = 'in_progress'
    }
  }

  reportHistory.unshift({
    wo_code: workOrder?.code || '',
    time: now.slice(0, 16),
    qualified_qty: data.qualified_qty,
    defective_qty: data.defective_qty,
    defect_reasons: (data.defect_reasons || []).join(', '),
    actual_hours: data.actual_hours,
    worker: operation.worker || operation.assigned_worker_name || '-'
  })

  return wrapUpdatedResponse(operation, '报工成功')
}

export async function getReportHistory(params: {
  pageNum: number
  pageSize: number
  workOrderCode?: string
  worker?: string
  startDate?: string
  endDate?: string
}) {
  let filtered = [...reportHistory]

  if (params.workOrderCode) {
    filtered = filtered.filter((item) => String(item.wo_code || '').includes(params.workOrderCode!))
  }

  if (params.worker) {
    filtered = filtered.filter((item) => String(item.worker || '').includes(params.worker!))
  }

  if (params.startDate) {
    filtered = filtered.filter((item) => String(item.time || '').slice(0, 10) >= params.startDate!)
  }

  if (params.endDate) {
    filtered = filtered.filter((item) => String(item.time || '').slice(0, 10) <= params.endDate!)
  }

  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}
