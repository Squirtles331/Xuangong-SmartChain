import { generateId } from '@/static/utils/id'
import { paginate, searchItems } from '@/static/utils/paginate'
import { MockResponse, wrapCreatedResponse, wrapDetailResponse, wrapListResponse, wrapUpdatedResponse } from '@/static/utils/response'

type WorkOrderRecord = Record<string, any>
type MyTaskRecord = {
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

const workOrders: WorkOrderRecord[] = [
  {
    id: 'WO-001',
    code: 'WO20260721001',
    wo_type: 'production',
    material_id: 'MAT-001',
    material_code: '04.01.001-00001',
    material_name: 'Centrifugal Pump XJP-100',
    planned_qty: 120,
    completed_qty: 60,
    defective_qty: 2,
    status: 'in_progress',
    priority: 'high',
    workshop_name: 'Machining Workshop 1',
    planned_start_date: '2026-07-20',
    planned_end_date: '2026-07-25',
    created_at: '2026-07-19 08:20:00'
  },
  {
    id: 'WO-002',
    code: 'WO20260720008',
    wo_type: 'production',
    material_id: 'MAT-002',
    material_code: '04.02.001-00001',
    material_name: 'Gear Box GBX-200',
    planned_qty: 80,
    completed_qty: 80,
    defective_qty: 1,
    status: 'completed',
    priority: 'normal',
    workshop_name: 'Assembly Workshop',
    planned_start_date: '2026-07-17',
    planned_end_date: '2026-07-20',
    created_at: '2026-07-16 10:10:00'
  },
  {
    id: 'WO-003',
    code: 'WO20260718003',
    wo_type: 'sample',
    material_id: 'MAT-003',
    material_code: '03.01.001-00001',
    material_name: 'Transmission Shaft DS-50',
    planned_qty: 20,
    completed_qty: 0,
    defective_qty: 0,
    status: 'approved',
    priority: 'urgent',
    workshop_name: 'Machining Workshop 2',
    planned_start_date: '2026-07-21',
    planned_end_date: '2026-07-23',
    created_at: '2026-07-18 14:30:00'
  }
]

const workOrderOperations: WorkOrderRecord[] = [
  {
    id: 'OP-001',
    work_order_id: 'WO-001',
    operation_no: 10,
    name: 'Turning',
    status: 'completed',
    assigned_worker_name: 'Zhang Hai',
    worker: 'Zhang Hai',
    work_center_name: 'WC-TURN-01',
    actual_start_time: '2026-07-20 08:00:00',
    actual_end_time: '2026-07-20 12:00:00'
  },
  {
    id: 'OP-002',
    work_order_id: 'WO-001',
    operation_no: 20,
    name: 'Heat Treatment',
    status: 'running',
    assigned_worker_name: 'Li Bin',
    worker: 'Li Bin',
    work_center_name: 'WC-HT-02',
    actual_start_time: '2026-07-21 08:20:00'
  },
  {
    id: 'OP-003',
    work_order_id: 'WO-002',
    operation_no: 10,
    name: 'Assembly',
    status: 'completed',
    assigned_worker_name: 'Wang Qun',
    worker: 'Wang Qun',
    work_center_name: 'WC-ASM-01',
    actual_start_time: '2026-07-19 09:00:00',
    actual_end_time: '2026-07-20 17:00:00'
  }
]

const reportHistory: WorkOrderRecord[] = [
  {
    id: 'RPT-001',
    wo_code: 'WO20260721001',
    time: '2026-07-21 10:20',
    status: 'submitted',
    qualified_qty: 30,
    defective_qty: 1,
    defect_reasons: 'Size out of tolerance',
    actual_hours: 3.5,
    worker: 'Li Bin'
  },
  {
    id: 'RPT-002',
    wo_code: 'WO20260720008',
    time: '2026-07-20 16:10',
    status: 'confirmed',
    qualified_qty: 80,
    defective_qty: 1,
    defect_reasons: 'Appearance scratch',
    actual_hours: 6.2,
    worker: 'Wang Qun'
  }
]

const myTasks: { assigned: MyTaskRecord[]; running: MyTaskRecord[]; completed: MyTaskRecord[] } = {
  assigned: [
    {
      id: 'TASK-001',
      wo_id: 'WO-001',
      wo_code: 'WO20260721001',
      wo_priority: 'high',
      material_name: 'Centrifugal Pump XJP-100',
      operation_no: 20,
      operation_name: 'Heat Treatment',
      work_center: 'WC-HT-02',
      planned_qty: 120,
      reported_qty: 30,
      status: 'assigned'
    }
  ],
  running: [
    {
      id: 'TASK-002',
      wo_id: 'WO-001',
      wo_code: 'WO20260721001',
      wo_priority: 'high',
      material_name: 'Centrifugal Pump XJP-100',
      operation_no: 30,
      operation_name: 'Finish Machining',
      work_center: 'WC-FM-01',
      planned_qty: 120,
      reported_qty: 0,
      status: 'running'
    }
  ],
  completed: [
    {
      id: 'TASK-003',
      wo_id: 'WO-002',
      wo_code: 'WO20260720008',
      wo_priority: 'normal',
      material_name: 'Gear Box GBX-200',
      operation_no: 10,
      operation_name: 'Assembly',
      work_center: 'WC-ASM-01',
      planned_qty: 80,
      reported_qty: 80,
      status: 'completed'
    }
  ]
}

const traceRecords: WorkOrderRecord[] = [
  {
    id: 'TRACE-001',
    wo_code: 'WO20260721001',
    operation_name: 'Heat Treatment',
    worker: 'Li Bin',
    qualified_qty: 30,
    defective_qty: 1,
    defect_reasons: 'Size out of tolerance',
    actual_hours: 3.5,
    time: '2026-07-21 10:20'
  },
  {
    id: 'TRACE-002',
    wo_code: 'WO20260720008',
    operation_name: 'Assembly',
    worker: 'Wang Qun',
    qualified_qty: 80,
    defective_qty: 1,
    defect_reasons: 'Appearance scratch',
    actual_hours: 6.2,
    time: '2026-07-20 16:10'
  }
]

const kanbanOps: WorkOrderRecord[] = [
  {
    id: 'KAN-001',
    wo_code: 'WO20260721001',
    wo_priority: 'high',
    material_name: 'Centrifugal Pump XJP-100',
    operation_no: 20,
    name: 'Heat Treatment',
    work_center: 'WC-HT-02',
    total_hours: 6,
    status: 'running',
    worker: 'Li Bin',
    progress: 48
  },
  {
    id: 'KAN-002',
    wo_code: 'WO20260718003',
    wo_priority: 'urgent',
    material_name: 'Transmission Shaft DS-50',
    operation_no: 10,
    name: 'Turning',
    work_center: 'WC-TURN-02',
    total_hours: 3,
    status: 'assigned',
    worker: 'Zhao Feng',
    progress: 0
  }
]

const outsourceOrders: WorkOrderRecord[] = [
  {
    id: 'OUT-001',
    code: 'OS20260721001',
    material: 'Pump Shaft Finish Grinding',
    qty: 50,
    supplier: 'Suzhou Grinding Services',
    operation: 'Grinding',
    send_date: '2026-07-21',
    due_date: '2026-07-25',
    price: 3200,
    status: 'sent' as const
  },
  {
    id: 'OUT-002',
    code: 'OS20260718002',
    material: 'Heat Treatment Batch A',
    qty: 80,
    supplier: 'Wuxi Heat Treatment Center',
    operation: 'Heat Treatment',
    send_date: '2026-07-18',
    due_date: '2026-07-22',
    price: 5600,
    status: 'processing' as const
  }
]

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
  workshopName?: string
  startDate?: string
  endDate?: string
}) {
  let filtered = [...workOrders]
  if (params.code) filtered = searchItems(filtered, params.code, ['code'])
  if (params.status) filtered = filtered.filter((item) => item.status === params.status)
  if (params.priority) filtered = filtered.filter((item) => item.priority === params.priority)
  if (params.workshopName) filtered = filtered.filter((item) => String(item.workshop_name || '').includes(params.workshopName!))
  if (params.startDate) filtered = filtered.filter((item) => String(item.planned_start_date || '') >= params.startDate!)
  if (params.endDate) filtered = filtered.filter((item) => String(item.planned_end_date || '') <= params.endDate!)
  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function getWorkOrderDetail(id: string) {
  const workOrder = findWorkOrder(id)
  if (!workOrder) return MockResponse.fail(404, 'Work order not found', null)
  const operations = workOrderOperations.filter((item) => String(item.work_order_id || '') === id)
  return wrapDetailResponse({ ...workOrder, operations })
}

export async function createWorkOrder(data: WorkOrderRecord) {
  const id = generateId('wo')
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
  return wrapCreatedResponse(next, 'Work order created')
}

export async function approveWorkOrder(id: string, approved: boolean, comment?: string) {
  const workOrder = findWorkOrder(id)
  if (!workOrder) return MockResponse.fail(404, 'Work order not found', null)
  workOrder.status = approved ? 'approved' : 'draft'
  if (comment) workOrder.approval_opinion = comment
  return wrapUpdatedResponse(workOrder, approved ? 'Work order approved' : 'Work order rejected')
}

export async function releaseWorkOrder(id: string) {
  const workOrder = findWorkOrder(id)
  if (!workOrder) return MockResponse.fail(404, 'Work order not found', null)
  workOrder.status = 'released'
  return wrapUpdatedResponse(workOrder, 'Work order released')
}

export async function closeWorkOrder(id: string, data: { close_type: string; reason?: string; wip_disposition?: string }) {
  const workOrder = findWorkOrder(id)
  if (!workOrder) return MockResponse.fail(404, 'Work order not found', null)
  workOrder.status = 'closed'
  workOrder.close_type = data.close_type
  workOrder.close_reason = data.reason
  workOrder.wip_disposition = data.wip_disposition
  return wrapUpdatedResponse(workOrder, 'Work order closed')
}

export async function getWorkOrderOperations(workOrderId: string) {
  return wrapDetailResponse(workOrderOperations.filter((item) => String(item.work_order_id || '') === workOrderId))
}

export async function assignOperation(operationId: string, data: { team_id: string; worker_id?: string; equipment_id?: string }) {
  const operation = findOperation(operationId)
  if (!operation) return MockResponse.fail(404, 'Operation not found', null)
  operation.status = 'assigned'
  operation.team_id = data.team_id
  operation.worker = data.worker_id || operation.worker
  operation.equipment_id = data.equipment_id
  return wrapUpdatedResponse(operation, 'Operation assigned')
}

export async function startOperation(operationId: string) {
  const operation = findOperation(operationId)
  if (operation) {
    operation.status = 'running'
    operation.actual_start_time = formatDateTime()
    return wrapUpdatedResponse(operation, 'Operation started')
  }

  const task = (myTasks.assigned || []).find((item) => String(item.id) === operationId)
  if (task) {
    task.status = 'running'
    return wrapUpdatedResponse(task, 'Task started')
  }

  return MockResponse.fail(404, 'Operation not found', null)
}

export async function reportOperation(
  operationId: string,
  data: { qualified_qty: number; defective_qty: number; defect_reasons?: string[]; actual_hours: number }
) {
  const operation = findOperation(operationId)
  if (!operation) return MockResponse.fail(404, 'Operation not found', null)
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

  const defectReasons = (data.defect_reasons || []).join(', ')
  const historyItem = {
    id: generateId('report'),
    wo_code: workOrder?.code || '',
    time: now.slice(0, 16),
    status: 'submitted',
    qualified_qty: data.qualified_qty,
    defective_qty: data.defective_qty,
    defect_reasons: defectReasons,
    actual_hours: data.actual_hours,
    worker: operation.worker || operation.assigned_worker_name || '-'
  }
  reportHistory.unshift(historyItem)
  traceRecords.unshift({
    id: generateId('trace'),
    wo_code: historyItem.wo_code,
    operation_name: operation.name || '',
    worker: historyItem.worker,
    qualified_qty: data.qualified_qty,
    defective_qty: data.defective_qty,
    defect_reasons: defectReasons,
    actual_hours: data.actual_hours,
    time: historyItem.time
  })

  return wrapUpdatedResponse(operation, 'Operation reported')
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
  if (params.workOrderCode) filtered = filtered.filter((item) => String(item.wo_code || '').includes(params.workOrderCode!))
  if (params.worker) filtered = filtered.filter((item) => String(item.worker || '').includes(params.worker!))
  if (params.startDate) filtered = filtered.filter((item) => String(item.time || '').slice(0, 10) >= params.startDate!)
  if (params.endDate) filtered = filtered.filter((item) => String(item.time || '').slice(0, 10) <= params.endDate!)
  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function getKanbanData() {
  return wrapDetailResponse(kanbanOps)
}

export async function getMyTasks() {
  return wrapDetailResponse(myTasks)
}

export async function getTraceRecords(params: {
  pageNum: number
  pageSize: number
  wo_code?: string
  worker?: string
  startDate?: string
  endDate?: string
}) {
  let filtered = [...traceRecords]
  if (params.wo_code) filtered = filtered.filter((item) => String(item.wo_code || '').includes(params.wo_code!))
  if (params.worker) filtered = filtered.filter((item) => String(item.worker || '').includes(params.worker!))
  if (params.startDate) filtered = filtered.filter((item) => String(item.time || '').slice(0, 10) >= params.startDate!)
  if (params.endDate) filtered = filtered.filter((item) => String(item.time || '').slice(0, 10) <= params.endDate!)
  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function getOutsourceOrders(params: { pageNum: number; pageSize: number; keyword?: string; status?: string; supplier?: string }) {
  let filtered = [...outsourceOrders]
  if (params.keyword) filtered = searchItems(filtered, params.keyword, ['code', 'material', 'supplier', 'operation'])
  if (params.status) filtered = filtered.filter((item) => item.status === params.status)
  if (params.supplier) filtered = searchItems(filtered, params.supplier, ['supplier'])
  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function createOutsourceOrder(data: Partial<WorkOrderRecord>) {
  const next = {
    id: generateId('outsource'),
    code: data.code || `OS${formatDateCompact()}${String(outsourceOrders.length + 1).padStart(4, '0')}`,
    material: data.material || '',
    qty: Number(data.qty ?? 0),
    supplier: data.supplier || '',
    operation: data.operation || '',
    send_date: data.send_date || formatDate(),
    due_date: data.due_date || formatDate(),
    price: Number(data.price ?? 0),
    status: (data.status as string) || 'sent'
  }
  outsourceOrders.unshift(next)
  return wrapCreatedResponse(next, 'Outsource order created')
}

export async function updateOutsourceOrder(id: string, data: Partial<WorkOrderRecord>) {
  const index = outsourceOrders.findIndex((item) => String(item.id) === id)
  if (index === -1) return MockResponse.fail(404, 'Outsource order not found', null)
  outsourceOrders[index] = { ...outsourceOrders[index], ...data }
  return wrapUpdatedResponse(outsourceOrders[index], 'Outsource order updated')
}

export async function updateOutsourceOrderStatus(id: string, status: string) {
  const order = outsourceOrders.find((item) => String(item.id) === id)
  if (!order) return MockResponse.fail(404, 'Outsource order not found', null)
  order.status = status
  return wrapUpdatedResponse(order, 'Outsource order status updated')
}
