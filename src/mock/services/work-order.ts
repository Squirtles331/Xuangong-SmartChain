import { kanbanOps, myTasks, outsourceOrders, reportHistory, traceRecords, workOrderOperations, workOrders } from '../modules/work-order'
import { simulateDelay } from '../shared/delay'
import { generateId } from '../shared/id'
import { paginate, searchItems } from '../shared/paginate'
import { wrapDetailResponse, wrapListResponse } from '../shared/response'

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
  await simulateDelay()

  let filtered = [...workOrders]

  if (params.code) {
    filtered = searchItems(filtered, params.code, ['code'])
  }

  if (params.status) {
    filtered = filtered.filter((workOrder: any) => workOrder.status === params.status)
  }

  if (params.priority) {
    filtered = filtered.filter((workOrder: any) => workOrder.priority === params.priority)
  }

  if (params.workshopId) {
    filtered = filtered.filter((workOrder: any) => String(workOrder.workshop_id || workOrder.id) === params.workshopId)
  }

  if (params.startDate) {
    filtered = filtered.filter((workOrder: any) => workOrder.planned_start_date >= params.startDate!)
  }

  if (params.endDate) {
    filtered = filtered.filter((workOrder: any) => workOrder.planned_end_date <= params.endDate!)
  }

  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function getWorkOrderDetail(id: string) {
  await simulateDelay()

  const workOrder = workOrders.find((item: any) => String(item.id) === id)
  if (!workOrder) {
    return { code: 404, msg: '工单不存在', data: null }
  }

  const operations = workOrderOperations.filter((item: any) => String(item.work_order_id || '1') === id)
  return wrapDetailResponse({ ...workOrder, operations })
}

export async function createWorkOrder(data: any) {
  await simulateDelay()
  const newWorkOrder = {
    id: generateId(),
    created_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
    ...data
  }
  workOrders.unshift(newWorkOrder)
  return wrapDetailResponse(newWorkOrder, '工单创建成功')
}

export async function approveWorkOrder(id: string, approved: boolean, comment?: string) {
  await simulateDelay()
  const workOrder = workOrders.find((item: any) => String(item.id) === id)

  if (workOrder) {
    workOrder.status = approved ? 'approved' : 'draft'
    if (comment) {
      ;(workOrder as any).approval_opinion = comment
    }
  }

  return wrapDetailResponse(workOrder || null, approved ? '审核通过' : '审核驳回')
}

export async function releaseWorkOrder(id: string) {
  await simulateDelay()
  const workOrder = workOrders.find((item: any) => String(item.id) === id)

  if (workOrder) {
    workOrder.status = 'released'
  }

  return wrapDetailResponse(workOrder || null, '工单已下发')
}

export async function closeWorkOrder(id: string, data: { close_type: string; reason?: string; wip_disposition?: string }) {
  await simulateDelay()
  const workOrder = workOrders.find((item: any) => String(item.id) === id)

  if (workOrder) {
    workOrder.status = 'closed'
    ;(workOrder as any).close_type = data.close_type
    ;(workOrder as any).close_reason = data.reason
    ;(workOrder as any).wip_disposition = data.wip_disposition
  }

  return wrapDetailResponse(workOrder || null, '工单已关闭')
}

export async function getWorkOrderOperations(workOrderId: string) {
  await simulateDelay()
  const operations = workOrderOperations.filter((item: any) => String(item.work_order_id || '1') === workOrderId)
  return wrapDetailResponse(operations)
}

export async function assignOperation(operationId: string, data: { team_id: string; worker_id?: string; equipment_id?: string }) {
  await simulateDelay()
  const operation = workOrderOperations.find((item: any) => String(item.id) === operationId)

  if (operation) {
    operation.status = 'assigned'
    if (data.worker_id) operation.worker = data.worker_id
    if (data.team_id) (operation as any).team_id = data.team_id
    if (data.equipment_id) (operation as any).equipment_id = data.equipment_id
  }

  return wrapDetailResponse(operation || null, '工序派工成功')
}

export async function startOperation(operationId: string) {
  await simulateDelay()
  const operation = workOrderOperations.find((item: any) => String(item.id) === operationId)

  if (operation) {
    operation.status = 'running'
    ;(operation as any).actual_start_time = new Date().toISOString().slice(0, 19).replace('T', ' ')
  }

  return wrapDetailResponse(operation || null, '工序已开工')
}

export async function reportOperation(
  operationId: string,
  data: { qualified_qty: number; defective_qty: number; defect_reasons?: string[]; actual_hours: number }
) {
  await simulateDelay()
  const operation = workOrderOperations.find((item: any) => String(item.id) === operationId)

  if (operation) {
    operation.status = 'completed'
    operation.qualified_qty = data.qualified_qty
    operation.defective_qty = data.defective_qty
    operation.actual_hours = data.actual_hours
    ;(operation as any).actual_end_time = new Date().toISOString().slice(0, 19).replace('T', ' ')
    ;(operation as any).defect_reasons = data.defect_reasons
  }

  reportHistory.unshift({
    wo_code: workOrders.find((item: any) => item.id === operation?.work_order_id)?.code || '',
    time: new Date().toISOString().slice(0, 16).replace('T', ' '),
    status: 'submitted',
    qualified_qty: data.qualified_qty,
    defective_qty: data.defective_qty,
    defect_reasons: (data.defect_reasons || []).join(', '),
    actual_hours: data.actual_hours * 60,
    worker: operation?.worker || '-'
  } as any)

  return wrapDetailResponse(operation || null, '报工成功')
}

export async function getKanbanData() {
  await simulateDelay()
  return wrapDetailResponse(kanbanOps)
}

export async function getMyTasks() {
  await simulateDelay()
  return wrapDetailResponse(myTasks)
}

export async function getReportHistory(params: {
  pageNum: number
  pageSize: number
  workOrderCode?: string
  worker?: string
  startDate?: string
  endDate?: string
}) {
  await simulateDelay()

  let filtered = [...reportHistory]
  if (params.workOrderCode) {
    filtered = filtered.filter((item: any) => String(item.wo_code || '').includes(params.workOrderCode!))
  }
  if (params.worker) {
    filtered = filtered.filter((item: any) => String(item.worker || '').includes(params.worker!))
  }
  if (params.startDate) {
    filtered = filtered.filter((item: any) => String(item.time || '').slice(0, 10) >= params.startDate!)
  }
  if (params.endDate) {
    filtered = filtered.filter((item: any) => String(item.time || '').slice(0, 10) <= params.endDate!)
  }

  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function getOutsourceOrders(params: { pageNum: number; pageSize: number; keyword?: string; status?: string; supplier?: string }) {
  await simulateDelay()

  let filtered = [...outsourceOrders]
  if (params.keyword) {
    filtered = searchItems(filtered, params.keyword, ['code', 'material', 'supplier', 'operation'])
  }
  if (params.status) {
    filtered = filtered.filter((item: any) => item.status === params.status)
  }
  if (params.supplier) {
    filtered = filtered.filter((item: any) => String(item.supplier).includes(params.supplier!))
  }

  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function createOutsourceOrder(data: any) {
  await simulateDelay()
  const next = {
    id: generateId(),
    code: data.code || '',
    material: data.material || '',
    qty: data.qty ?? 0,
    supplier: data.supplier || '',
    operation: data.operation || '',
    send_date: data.send_date || '',
    due_date: data.due_date || '',
    price: data.price ?? 0,
    status: data.status || 'sent'
  }
  outsourceOrders.unshift(next)
  return wrapDetailResponse(next, '创建委外单成功')
}

export async function updateOutsourceOrder(id: string, data: any) {
  await simulateDelay()
  const index = outsourceOrders.findIndex((item: any) => String(item.id) === id)
  if (index > -1) {
    outsourceOrders[index] = { ...outsourceOrders[index], ...data }
    return wrapDetailResponse(outsourceOrders[index], '更新委外单成功')
  }
  return wrapDetailResponse({ id, ...data }, '更新委外单成功')
}

export async function updateOutsourceOrderStatus(id: string, status: 'sent' | 'processing' | 'received' | 'settled') {
  await simulateDelay()
  const index = outsourceOrders.findIndex((item: any) => String(item.id) === id)
  if (index > -1) {
    outsourceOrders[index].status = status
    return wrapDetailResponse(outsourceOrders[index], '更新委外状态成功')
  }
  return wrapDetailResponse({ id, status }, '更新委外状态成功')
}

export async function getTraceRecords(params: {
  pageNum: number
  pageSize: number
  wo_code?: string
  worker?: string
  startDate?: string
  endDate?: string
}) {
  await simulateDelay()

  let filtered = [...traceRecords]
  if (params.wo_code) {
    filtered = filtered.filter((item: any) => String(item.wo_code).includes(params.wo_code!))
  }
  if (params.worker) {
    filtered = filtered.filter((item: any) => String(item.worker).includes(params.worker!))
  }
  if (params.startDate) {
    filtered = filtered.filter((item: any) => String(item.time).slice(0, 10) >= params.startDate!)
  }
  if (params.endDate) {
    filtered = filtered.filter((item: any) => String(item.time).slice(0, 10) <= params.endDate!)
  }

  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}
