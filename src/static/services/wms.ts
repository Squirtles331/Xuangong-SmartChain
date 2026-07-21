import { generateId } from '@/static/utils/id'
import { paginate, searchItems } from '@/static/utils/paginate'
import {
  MockResponse,
  wrapCreatedResponse,
  wrapDetailResponse,
  wrapListResponse,
  wrapSuccessResponse,
  wrapUpdatedResponse
} from '@/static/utils/response'

type WmsRecord = Record<string, any>

const inventoryRecords = [
  {
    id: 'INV-001',
    code: '04.01.001-00001',
    name: 'Centrifugal Pump XJP-100',
    warehouse: 'FG Warehouse',
    qty: 320,
    available: 280,
    safety: 120,
    stock: 320
  },
  { id: 'INV-002', code: '04.02.001-00001', name: 'Gear Box GBX-200', warehouse: 'FG Warehouse', qty: 180, available: 90, safety: 110, stock: 180 },
  {
    id: 'INV-003',
    code: '03.01.001-00001',
    name: 'Transmission Shaft DS-50',
    warehouse: 'Machining Warehouse',
    qty: 560,
    available: 420,
    safety: 150,
    stock: 560
  }
]

const receiptOrders = [
  {
    id: 'RCV-001',
    code: 'RK20260721001',
    type: 'purchase',
    material: 'Pump Body Casting',
    qty: 120,
    warehouse: 'RM Warehouse',
    supplier: 'Nantong Casting Supplier',
    status: 'pending',
    created_at: '2026-07-21 08:30:00'
  },
  {
    id: 'RCV-002',
    code: 'RK20260720002',
    type: 'production',
    material: 'Centrifugal Pump XJP-100',
    qty: 40,
    warehouse: 'FG Warehouse',
    supplier: 'Assembly Workshop Completion',
    status: 'done',
    created_at: '2026-07-20 16:10:00'
  }
]

const deliveryOrders = [
  {
    id: 'DLV-001',
    code: 'FH20260721001',
    order_code: 'SO20260721001',
    customer: 'Huadong Pump Industry',
    material: 'Centrifugal Pump XJP-100',
    qty: 20,
    status: 'pending',
    created_at: '2026-07-21 10:00:00'
  },
  {
    id: 'DLV-002',
    code: 'FH20260720002',
    order_code: 'SO20260720003',
    customer: 'Suzhou Equipment Co.',
    material: 'Gear Box GBX-200',
    qty: 12,
    status: 'completed',
    created_at: '2026-07-20 14:20:00'
  }
]

const pickingOrders = [
  {
    id: 'PCK-001',
    wo_code: 'WO20260721001',
    material: 'Impeller Assembly',
    warehouse: 'Staging Warehouse',
    status: 'pending',
    created_at: '2026-07-21 09:15:00'
  },
  {
    id: 'PCK-002',
    wo_code: 'WO20260720008',
    material: 'Bearing 6308',
    warehouse: 'Staging Warehouse',
    status: 'completed',
    created_at: '2026-07-20 13:40:00'
  }
]

const transferOrders = [
  {
    id: 'TRF-001',
    code: 'DB20260721001',
    material: 'Wear Ring',
    qty: 80,
    from_wh: 'RM Warehouse',
    to_wh: 'Machining Line Warehouse',
    status: 'pending',
    out_time: ''
  },
  {
    id: 'TRF-002',
    code: 'DB20260720003',
    material: 'Centrifugal Pump XJP-100',
    qty: 20,
    from_wh: 'FG Warehouse',
    to_wh: 'Shipping Buffer',
    status: 'done',
    out_time: '2026-07-20 15:05:00'
  }
]

const returnOrders = [
  {
    id: 'RET-001',
    code: 'TH20260721001',
    type: 'return',
    source: 'WO20260721001',
    material: 'Seal Ring',
    qty: 12,
    reason: 'Residual material from changeover',
    status: 'pending'
  },
  {
    id: 'RET-002',
    code: 'TH20260719002',
    type: 'scrap',
    source: 'PO20260718006',
    material: 'Bolt M16x60',
    qty: 30,
    reason: 'Incoming inspection rejection',
    status: 'done'
  }
]

const stockCountExec = [
  {
    id: 'STK-001',
    plan_code: 'PD20260721',
    warehouse: 'FG Warehouse',
    location: 'A-01-01',
    material: 'Centrifugal Pump XJP-100',
    book_qty: 280,
    actual_qty: 278,
    diff: -2,
    status: 'pending'
  },
  {
    id: 'STK-002',
    plan_code: 'PD20260721',
    warehouse: 'FG Warehouse',
    location: 'A-01-02',
    material: 'Gear Box GBX-200',
    book_qty: 90,
    actual_qty: 90,
    diff: 0,
    status: 'pending'
  }
]

const stockCountDiff = [
  {
    id: 'STD-001',
    plan_code: 'PD20260721',
    material: 'Centrifugal Pump XJP-100',
    book_qty: 280,
    actual_qty: 278,
    diff: -2,
    diff_rate: '-0.71%',
    disposition: 'pending-confirm'
  },
  {
    id: 'STD-002',
    plan_code: 'PD20260721',
    material: 'Gear Box GBX-200',
    book_qty: 90,
    actual_qty: 90,
    diff: 0,
    diff_rate: '0.00%',
    disposition: 'no-action'
  }
]

const backflushOrders = [
  {
    id: 'BF-001',
    code: 'HC20260721001',
    wo_code: 'WO20260721001',
    material: 'Impeller Assembly',
    bom_qty: 40,
    actual_qty: 38,
    diff: -2,
    qty: 38,
    status: 'pending',
    backflush_date: '2026-07-21'
  },
  {
    id: 'BF-002',
    code: 'HC20260720004',
    wo_code: 'WO20260720008',
    material: 'Bearing 6308',
    bom_qty: 80,
    actual_qty: 80,
    diff: 0,
    qty: 80,
    status: 'completed',
    backflush_date: '2026-07-20'
  }
]

const barcodeScans = [
  {
    id: 'SCAN-001',
    barcode: 'BC202607210001',
    material_code: '04.01.001-00001',
    material_name: 'Centrifugal Pump XJP-100',
    qty: 2,
    location: 'F-01-01',
    type: '入库',
    time: '2026-07-21 08:40:00'
  },
  {
    id: 'SCAN-002',
    barcode: 'BC202607200008',
    material_code: '02.04.001-00001',
    material_name: 'Bearing 6308',
    qty: 8,
    location: 'B-02-03',
    type: '出库',
    time: '2026-07-20 17:15:00'
  }
]

const iotDevices = [
  { id: 'IOT-001', code: 'DEV-001', name: 'Temperature Sensor 01', type: 'sensor', status: 'online', warehouse: 'FG Warehouse' },
  { id: 'IOT-002', code: 'DEV-002', name: 'RFID Gateway 02', type: 'gateway', status: 'offline', warehouse: 'RM Warehouse' }
]

const iotAlertHistory = [
  {
    id: 'ALERT-001',
    device: 'Temperature Sensor 01',
    level: 'warning',
    content: 'FG warehouse temperature exceeded threshold.',
    time: '2026-07-21 09:20:00'
  },
  {
    id: 'ALERT-002',
    device: 'RFID Gateway 02',
    level: 'danger',
    content: 'Gateway disconnected for more than 10 minutes.',
    time: '2026-07-20 15:40:00'
  }
]

const iotAlertRules: WmsRecord[] = [
  { id: 'RULE-001', name: 'Temperature upper limit', type: 'temperature', threshold: '32C', enabled: true },
  { id: 'RULE-002', name: 'Gateway offline timeout', type: 'network', threshold: '10m', enabled: true }
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

function createCode(prefix: string, id: string) {
  return `${prefix}${formatDateCompact()}${id.slice(-4).padStart(4, '0')}`
}

function findRecord(records: WmsRecord[], id: string) {
  return records.find((item) => String(item.id) === id)
}

function removeRecord(records: WmsRecord[], id: string) {
  const index = records.findIndex((item) => String(item.id) === id)
  if (index > -1) {
    records.splice(index, 1)
    return true
  }
  return false
}

export async function getInventoryList(params: { pageNum: number; pageSize: number; code?: string; name?: string; warehouse?: string }) {
  let filtered = [...inventoryRecords]
  if (params.code) filtered = searchItems(filtered, params.code, ['code'])
  if (params.name) filtered = searchItems(filtered, params.name, ['name'])
  if (params.warehouse) filtered = filtered.filter((item) => item.warehouse === params.warehouse)
  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function getWmsBridgeSummary() {
  return wrapDetailResponse({
    picking: {
      metrics: [
        { label: 'Pending Picking', value: `${pickingOrders.filter((item) => item.status === 'pending').length}`, color: '#e6a23c' },
        { label: 'Completed Picking', value: `${pickingOrders.filter((item) => item.status === 'completed').length}`, color: '#409eff' },
        { label: 'Pending Backflush', value: `${backflushOrders.filter((item) => item.status === 'pending').length}`, color: '#f56c6c' }
      ],
      records: backflushOrders
    },
    receipt: {
      metrics: [
        { label: 'Pending Receipt', value: `${receiptOrders.filter((item) => item.status === 'pending').length}`, color: '#e6a23c' },
        { label: 'Completed Receipt', value: `${receiptOrders.filter((item) => item.status !== 'pending').length}`, color: '#67c23a' }
      ],
      records: receiptOrders
    }
  })
}

export async function getMaterialListForBarcode(params: { pageNum: number; pageSize: number; code?: string; name?: string }) {
  let filtered = [...inventoryRecords]
  if (params.code) filtered = searchItems(filtered, params.code, ['code'])
  if (params.name) filtered = searchItems(filtered, params.name, ['name'])
  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function getStockCountList(params: { pageNum: number; pageSize: number; planCode?: string; warehouse?: string; status?: string }) {
  let filtered = [...stockCountExec]
  if (params.planCode) filtered = searchItems(filtered, params.planCode, ['plan_code'])
  if (params.warehouse) filtered = filtered.filter((item) => item.warehouse === params.warehouse)
  if (params.status) filtered = filtered.filter((item) => item.status === params.status)
  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function getStockCountDiff(params: { pageNum: number; pageSize: number; planCode?: string; material?: string }) {
  let filtered = [...stockCountDiff]
  if (params.planCode) filtered = searchItems(filtered, params.planCode, ['plan_code'])
  if (params.material) filtered = searchItems(filtered, params.material, ['material'])
  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function getIoTDeviceList(params: { pageNum: number; pageSize: number; status?: string; type?: string }) {
  let filtered = [...iotDevices]
  if (params.status) filtered = filtered.filter((item) => item.status === params.status)
  if (params.type) filtered = filtered.filter((item) => item.type === params.type)
  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function getIoTAlertHistory(params: { pageNum: number; pageSize: number; device?: string; level?: string }) {
  let filtered = [...iotAlertHistory]
  if (params.device) filtered = searchItems(filtered, params.device, ['device'])
  if (params.level) filtered = filtered.filter((item) => item.level === params.level)
  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function getIoTAlertRules() {
  return wrapDetailResponse(iotAlertRules)
}

export async function createIoTAlertRule(data: WmsRecord) {
  const next = { id: generateId('rule'), enabled: true, ...data }
  iotAlertRules.unshift(next)
  return wrapCreatedResponse(next, 'IoT alert rule created')
}

export async function updateIoTAlertRule(id: string, data: WmsRecord) {
  const record = findRecord(iotAlertRules, id)
  if (!record) return MockResponse.fail(404, 'IoT alert rule not found', null)
  Object.assign(record, data)
  return wrapUpdatedResponse(record, 'IoT alert rule updated')
}

export async function deleteIoTAlertRule(id: string) {
  const removed = removeRecord(iotAlertRules, id)
  if (!removed) return MockResponse.fail(404, 'IoT alert rule not found', null)
  return wrapSuccessResponse('IoT alert rule deleted')
}

export async function getReceiptList(params: {
  pageNum: number
  pageSize: number
  code?: string
  type?: string
  supplier?: string
  status?: string
}) {
  let filtered = [...receiptOrders]
  if (params.code) filtered = searchItems(filtered, params.code, ['code'])
  if (params.type) filtered = filtered.filter((item) => item.type === params.type)
  if (params.supplier) filtered = searchItems(filtered, params.supplier, ['supplier'])
  if (params.status) filtered = filtered.filter((item) => item.status === params.status)
  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function createReceipt(data: WmsRecord) {
  const id = generateId('receipt')
  const next = {
    id,
    code: data.code || createCode('RK', id),
    type: data.type || 'purchase',
    material: data.material || '',
    qty: Number(data.qty ?? 0),
    warehouse: data.warehouse || '',
    supplier: data.supplier || '',
    status: data.status || 'pending',
    created_at: data.created_at || formatDateTime(),
    ...data
  }
  receiptOrders.unshift(next)
  return wrapCreatedResponse(next, 'Receipt created')
}

export async function updateReceipt(id: string, data: WmsRecord) {
  const record = findRecord(receiptOrders, id)
  if (!record) return MockResponse.fail(404, 'Receipt not found', null)
  Object.assign(record, data)
  return wrapUpdatedResponse(record, 'Receipt updated')
}

export async function deleteReceipt(id: string) {
  const removed = removeRecord(receiptOrders, id)
  if (!removed) return MockResponse.fail(404, 'Receipt not found', null)
  return wrapSuccessResponse('Receipt deleted')
}

export async function getDeliveryList(params: { pageNum: number; pageSize: number; code?: string; customer?: string; status?: string }) {
  let filtered = [...deliveryOrders]
  if (params.code) filtered = searchItems(filtered, params.code, ['code', 'order_code'])
  if (params.customer) filtered = searchItems(filtered, params.customer, ['customer'])
  if (params.status) filtered = filtered.filter((item) => item.status === params.status)
  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function getPickingList(params: { pageNum: number; pageSize: number; code?: string; warehouse?: string; status?: string }) {
  let filtered = [...pickingOrders]
  if (params.code) filtered = searchItems(filtered, params.code, ['wo_code'])
  if (params.warehouse) filtered = filtered.filter((item) => item.warehouse === params.warehouse)
  if (params.status) filtered = filtered.filter((item) => item.status === params.status)
  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function createPicking(data: WmsRecord) {
  const next = {
    id: generateId('pick'),
    wo_code: data.wo_code || data.woCode || '',
    material: data.material || '',
    warehouse: data.warehouse || '',
    status: data.status || 'pending',
    created_at: data.created_at || formatDateTime()
  }
  pickingOrders.unshift(next)
  return wrapCreatedResponse(next, 'Picking order created')
}

export async function updatePicking(id: string, data: WmsRecord) {
  const record = findRecord(pickingOrders, id)
  if (!record) return MockResponse.fail(404, 'Picking order not found', null)
  Object.assign(record, data)
  return wrapUpdatedResponse(record, 'Picking order updated')
}

export async function deletePicking(id: string) {
  const removed = removeRecord(pickingOrders, id)
  if (!removed) return MockResponse.fail(404, 'Picking order not found', null)
  return wrapSuccessResponse('Picking order deleted')
}

export async function getTransferList(params: {
  pageNum: number
  pageSize: number
  code?: string
  fromWarehouse?: string
  toWarehouse?: string
  status?: string
}) {
  let filtered = [...transferOrders]
  if (params.code) filtered = searchItems(filtered, params.code, ['code'])
  if (params.fromWarehouse) filtered = filtered.filter((item) => item.from_wh === params.fromWarehouse)
  if (params.toWarehouse) filtered = filtered.filter((item) => item.to_wh === params.toWarehouse)
  if (params.status) filtered = filtered.filter((item) => item.status === params.status)
  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function createTransfer(data: WmsRecord) {
  const id = generateId('transfer')
  const next = {
    id,
    code: data.code || createCode('DB', id),
    material: data.material || '',
    qty: Number(data.qty ?? 0),
    from_wh: data.from_wh || '',
    to_wh: data.to_wh || '',
    status: data.status || 'pending',
    out_time: data.out_time || ''
  }
  transferOrders.unshift(next)
  return wrapCreatedResponse(next, 'Transfer order created')
}

export async function updateTransfer(id: string, data: WmsRecord) {
  const record = findRecord(transferOrders, id)
  if (!record) return MockResponse.fail(404, 'Transfer order not found', null)
  Object.assign(record, data)
  return wrapUpdatedResponse(record, 'Transfer order updated')
}

export async function getReturnList(params: { pageNum: number; pageSize: number; code?: string; reason?: string; status?: string }) {
  let filtered = [...returnOrders]
  if (params.code) filtered = searchItems(filtered, params.code, ['code', 'source'])
  if (params.reason) filtered = searchItems(filtered, params.reason, ['reason'])
  if (params.status) filtered = filtered.filter((item) => item.status === params.status)
  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function createReturn(data: WmsRecord) {
  const id = generateId('return')
  const next = {
    id,
    code: data.code || createCode('TH', id),
    type: data.type || 'return',
    source: data.source || '',
    material: data.material || '',
    qty: Number(data.qty ?? 0),
    reason: data.reason || '',
    status: data.status || 'pending'
  }
  returnOrders.unshift(next)
  return wrapCreatedResponse(next, 'Return order created')
}

export async function updateReturn(id: string, data: WmsRecord) {
  const record = findRecord(returnOrders, id)
  if (!record) return MockResponse.fail(404, 'Return order not found', null)
  Object.assign(record, data)
  return wrapUpdatedResponse(record, 'Return order updated')
}

export async function getBackflushList(params: { pageNum: number; pageSize: number; code?: string; material?: string; status?: string }) {
  let filtered = [...backflushOrders]
  if (params.code) filtered = searchItems(filtered, params.code, ['code', 'wo_code'])
  if (params.material) filtered = searchItems(filtered, params.material, ['material'])
  if (params.status) filtered = filtered.filter((item) => item.status === params.status)
  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function completeStockCountPlan(
  planCode: string,
  items: Array<{ location: string; material: string; actual: number; disposition?: string }>
) {
  stockCountExec.forEach((item) => {
    if (String(item.plan_code) !== planCode) return
    const matched = items.find((line) => line.location === item.location && line.material === item.material)
    if (!matched) return
    const actualQty = Number(matched.actual ?? item.actual_qty ?? item.book_qty ?? 0)
    item.actual_qty = actualQty
    item.diff = actualQty - Number(item.book_qty ?? 0)
    item.status = 'completed'
  })

  stockCountDiff.forEach((item) => {
    if (String(item.plan_code) !== planCode) return
    const matched = items.find((line) => line.material === item.material)
    if (!matched) return
    const actualQty = Number(matched.actual ?? item.actual_qty ?? item.book_qty ?? 0)
    const bookQty = Number(item.book_qty ?? 0)
    const diff = actualQty - bookQty
    item.actual_qty = actualQty
    item.diff = diff
    item.diff_rate = bookQty > 0 ? `${((diff / bookQty) * 100).toFixed(2)}%` : '0.00%'
  })

  return wrapSuccessResponse('Stock count completed')
}

export async function updateStockCountDiffDispositions(planCode: string, items: Array<{ material: string; disposition: string }>) {
  stockCountDiff.forEach((item) => {
    if (String(item.plan_code) !== planCode) return
    const matched = items.find((line) => line.material === item.material)
    if (!matched) return
    item.disposition = matched.disposition
  })
  return wrapSuccessResponse('Stock count disposition updated')
}

export async function getBarcodeScanList(params: {
  pageNum: number
  pageSize: number
  barcode?: string
  operator?: string
  startDate?: string
  endDate?: string
}) {
  let filtered = [...barcodeScans]
  if (params.barcode) filtered = searchItems(filtered, params.barcode, ['barcode'])
  if (params.startDate) filtered = filtered.filter((item) => item.time.slice(0, 10) >= params.startDate)
  if (params.endDate) filtered = filtered.filter((item) => item.time.slice(0, 10) <= params.endDate)
  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}
