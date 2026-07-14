import {
  backflushOrders as backflushOrdersSeed,
  inventory as inventorySeed,
  pickingOrders as pickingOrdersSeed,
  receiptOrders as receiptOrdersSeed,
  returnOrders as returnOrdersSeed,
  stockCountDiff as stockCountDiffSeed,
  stockCountExec as stockCountExecSeed,
  transferOrders as transferOrdersSeed
} from '@/mock/modules/wms'
import { generateId } from '@/mock/shared/id'
import { paginate, searchItems } from '@/mock/shared/paginate'
import {
  MockResponse,
  wrapCreatedResponse,
  wrapDetailResponse,
  wrapListResponse,
  wrapSuccessResponse,
  wrapUpdatedResponse
} from '@/mock/shared/response'

type WmsRecord = Record<string, any>

const backflushOrders = cloneSeed(backflushOrdersSeed) as WmsRecord[]
const inventoryRecords = cloneSeed(inventorySeed) as WmsRecord[]
const pickingOrders = cloneSeed(pickingOrdersSeed) as WmsRecord[]
const receiptOrders = cloneSeed(receiptOrdersSeed) as WmsRecord[]
const returnOrders = cloneSeed(returnOrdersSeed) as WmsRecord[]
const stockCountExec = cloneSeed(stockCountExecSeed) as WmsRecord[]
const stockCountDiff = cloneSeed(stockCountDiffSeed) as WmsRecord[]
const transferOrders = cloneSeed(transferOrdersSeed) as WmsRecord[]

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

function getLatestValue(records: WmsRecord[], field: string) {
  return records
    .map((item) => String(item[field] || ''))
    .filter(Boolean)
    .sort((left, right) => right.localeCompare(left))[0]
}

const pickingBridgeRecords = [
  {
    requestCode: 'MES-LLSQ-20250115-001',
    woCode: 'WO202501150001',
    material: '离心泵 XJP-100',
    requestStatus: 'MES 已下发',
    pickingStatus: '待拣料',
    backflushStatus: '待倒冲'
  },
  {
    requestCode: 'MES-LLSQ-20250114-002',
    woCode: 'WO202501150002',
    material: '齿轮箱 GBX-200',
    requestStatus: 'MES 已下发',
    pickingStatus: '已拣料',
    backflushStatus: '已倒冲'
  },
  {
    requestCode: 'MES-LLSQ-20250113-003',
    woCode: 'WO202501140003',
    material: '离心泵 XJP-200',
    requestStatus: 'MES 已下发',
    pickingStatus: '已出库',
    backflushStatus: '已倒冲'
  }
]

const receiptBridgeRecords = [
  {
    completionCode: 'MES-WG-20250115-001',
    woCode: 'WO202501150001',
    material: '离心泵 XJP-100',
    receiptCode: '',
    receiptStatus: '待生成入库单',
    qualityStatus: '待完工确认'
  },
  {
    completionCode: 'MES-WG-20250114-002',
    woCode: 'WO202501140003',
    material: '离心泵 XJP-100',
    receiptCode: 'RK20250114002',
    receiptStatus: '已入库',
    qualityStatus: '待质量放行'
  },
  {
    completionCode: 'MES-WG-20250113-003',
    woCode: 'WO202501130002',
    material: '齿轮泵 CBP-50',
    receiptCode: 'RK20250113006',
    receiptStatus: '待入库',
    qualityStatus: '让步接收'
  }
]

export async function getInventoryList(params: { pageNum: number; pageSize: number; code?: string; name?: string; warehouse?: string }) {
  let filtered = [...inventoryRecords]

  if (params.code) {
    filtered = searchItems(filtered, params.code, ['code'])
  }

  if (params.name) {
    filtered = searchItems(filtered, params.name, ['name'])
  }

  if (params.warehouse) {
    filtered = filtered.filter((item) => item.warehouse === params.warehouse)
  }

  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function getWmsBridgeSummary() {
  const pickingExecutedCount = pickingOrders.filter((item) => ['picked', 'completed'].includes(String(item.status || ''))).length
  const pickingPendingCount = pickingOrders.filter((item) => String(item.status || '') === 'pending').length
  const backflushPendingCount = backflushOrders.filter((item) => String(item.status || '') === 'pending').length
  const backflushCompletedCount = backflushOrders.filter((item) => String(item.status || '') === 'completed').length
  const receiptReadyCount = receiptBridgeRecords.filter((item) => item.receiptStatus === '待生成入库单').length
  const receiptPendingCount = receiptBridgeRecords.filter((item) => item.receiptStatus === '待入库').length
  const receiptCompletedCount = receiptBridgeRecords.filter((item) => item.receiptStatus === '已入库').length

  return wrapDetailResponse({
    picking: {
      metrics: [
        { label: '待执行申请', value: `${pickingPendingCount} 单`, color: '#e6a23c' },
        { label: '已执行领料', value: `${pickingExecutedCount} 单`, color: '#409eff' },
        { label: '待跟进倒冲', value: `${backflushPendingCount} 条`, color: '#f56c6c' }
      ],
      flow: [
        {
          title: 'MES 领料申请',
          ownerSystem: 'MES',
          description: '按工单与 BOM 生成领料需求，WMS 只承接申请上下文，不维护生产消耗真相。'
        },
        {
          title: 'WMS 领料执行',
          ownerSystem: 'WMS',
          description: '生成领料单并确认仓库出库，沉淀仓储事务与库存移动真相。'
        },
        {
          title: 'MES 投料 / 倒冲',
          ownerSystem: 'MES',
          description: '记录实际投料与消耗事实，当前页面仅展示倒冲记录摘要用于桥接。'
        }
      ],
      records: pickingBridgeRecords,
      backflushSummary: [
        { label: '待倒冲记录', value: `${backflushPendingCount} 条`, color: '#e6a23c' },
        { label: '已倒冲记录', value: `${backflushCompletedCount} 条`, color: '#67c23a' },
        { label: '最近倒冲日期', value: getLatestValue(backflushOrders, 'backflush_date') || '-', color: '#909399' }
      ],
      note: 'WMS 维护领料单与出库事务，MES 维护实际投料、消耗与倒冲事实。'
    },
    receipt: {
      metrics: [
        { label: '待完工回传', value: `${receiptReadyCount} 单`, color: '#e6a23c' },
        { label: '待执行入库', value: `${receiptPendingCount} 单`, color: '#409eff' },
        { label: '已完成入库', value: `${receiptCompletedCount} 单`, color: '#67c23a' }
      ],
      flow: [
        {
          title: 'MES 完工确认',
          ownerSystem: 'MES',
          description: 'MES 负责工单报工与完工数量确认，决定何时触发入库上下文。'
        },
        {
          title: 'WMS 收货入库',
          ownerSystem: 'WMS',
          description: 'WMS 负责生成入库单并完成仓储过账，维护库存增加真相。'
        },
        {
          title: 'QMS 质量裁决',
          ownerSystem: 'QMS',
          description: '质量放行、让步接收或隔离结论由 QMS 决定，WMS 只消费结果。'
        }
      ],
      records: receiptBridgeRecords,
      note: '收货入库只表达仓储事务完成，不能替代 MES 完工确认或 QMS 质量裁决。'
    }
  })
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

  if (params.code) {
    filtered = searchItems(filtered, params.code, ['code'])
  }

  if (params.type) {
    filtered = filtered.filter((item) => item.type === params.type)
  }

  if (params.supplier) {
    filtered = searchItems(filtered, params.supplier, ['supplier'])
  }

  if (params.status) {
    filtered = filtered.filter((item) => item.status === params.status)
  }

  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function createReceipt(data: WmsRecord) {
  const id = generateId()
  const next = {
    id,
    code: data.code || createCode('RK', id),
    type: data.type || 'purchase',
    material: data.material || '',
    qty: Number(data.qty ?? 0),
    warehouse: data.warehouse || '',
    supplier: data.supplier || (data.type === 'production' ? '总装车间完工来源' : '静态来源单据'),
    status: data.status || 'pending',
    created_at: data.created_at || formatDateTime(),
    ...data
  }

  receiptOrders.unshift(next)
  return wrapCreatedResponse(next, '新增入库单成功')
}

export async function updateReceipt(id: string, data: WmsRecord) {
  const record = findRecord(receiptOrders, id)

  if (!record) {
    return MockResponse.fail(404, '入库单不存在', null)
  }

  Object.assign(record, data)
  return wrapUpdatedResponse(record, '入库单更新成功')
}

export async function deleteReceipt(id: string) {
  const removed = removeRecord(receiptOrders, id)

  if (!removed) {
    return MockResponse.fail(404, '入库单不存在', null)
  }

  return wrapSuccessResponse('入库单删除成功')
}

export async function getPickingList(params: { pageNum: number; pageSize: number; code?: string; warehouse?: string; status?: string }) {
  let filtered = [...pickingOrders]

  if (params.code) {
    filtered = searchItems(filtered, params.code, ['wo_code'])
  }

  if (params.warehouse) {
    filtered = filtered.filter((item) => item.warehouse === params.warehouse)
  }

  if (params.status) {
    filtered = filtered.filter((item) => item.status === params.status)
  }

  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function createPicking(data: WmsRecord) {
  const id = generateId()
  const next = {
    id,
    wo_code: data.wo_code || data.woCode || '',
    material: data.material || '',
    warehouse: data.warehouse || '',
    status: data.status || 'pending',
    created_at: data.created_at || formatDateTime()
  }

  pickingOrders.unshift(next)
  return wrapCreatedResponse(next, '新增领料单成功')
}

export async function updatePicking(id: string, data: WmsRecord) {
  const record = findRecord(pickingOrders, id)

  if (!record) {
    return MockResponse.fail(404, '领料单不存在', null)
  }

  Object.assign(record, data)
  return wrapUpdatedResponse(record, '领料单更新成功')
}

export async function deletePicking(id: string) {
  const removed = removeRecord(pickingOrders, id)

  if (!removed) {
    return MockResponse.fail(404, '领料单不存在', null)
  }

  return wrapSuccessResponse('领料单删除成功')
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

  if (params.code) {
    filtered = searchItems(filtered, params.code, ['code'])
  }

  if (params.fromWarehouse) {
    filtered = filtered.filter((item) => item.from_wh === params.fromWarehouse)
  }

  if (params.toWarehouse) {
    filtered = filtered.filter((item) => item.to_wh === params.toWarehouse)
  }

  if (params.status) {
    filtered = filtered.filter((item) => item.status === params.status)
  }

  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function createTransfer(data: WmsRecord) {
  const id = generateId()
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
  return wrapCreatedResponse(next, '新增调拨单成功')
}

export async function updateTransfer(id: string, data: WmsRecord) {
  const record = findRecord(transferOrders, id)

  if (!record) {
    return MockResponse.fail(404, '调拨单不存在', null)
  }

  Object.assign(record, data)
  return wrapUpdatedResponse(record, '调拨单更新成功')
}

export async function getReturnList(params: { pageNum: number; pageSize: number; code?: string; reason?: string; status?: string }) {
  let filtered = [...returnOrders]

  if (params.code) {
    filtered = searchItems(filtered, params.code, ['code', 'source'])
  }

  if (params.reason) {
    filtered = searchItems(filtered, params.reason, ['reason'])
  }

  if (params.status) {
    filtered = filtered.filter((item) => item.status === params.status)
  }

  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function createReturn(data: WmsRecord) {
  const id = generateId()
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
  return wrapCreatedResponse(next, '新增退料退货单成功')
}

export async function updateReturn(id: string, data: WmsRecord) {
  const record = findRecord(returnOrders, id)

  if (!record) {
    return MockResponse.fail(404, '退料退货单不存在', null)
  }

  Object.assign(record, data)
  return wrapUpdatedResponse(record, '退料退货单更新成功')
}

export async function getStockCountList(params: { pageNum: number; pageSize: number; planCode?: string; warehouse?: string; status?: string }) {
  let filtered = [...stockCountExec]

  if (params.planCode) {
    filtered = searchItems(filtered, params.planCode, ['plan_code'])
  }

  if (params.warehouse) {
    filtered = filtered.filter((item) => item.warehouse === params.warehouse)
  }

  if (params.status) {
    filtered = filtered.filter((item) => item.status === params.status)
  }

  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function getStockCountDiff(params: { pageNum: number; pageSize: number; planCode?: string; material?: string }) {
  let filtered = [...stockCountDiff]

  if (params.planCode) {
    filtered = searchItems(filtered, params.planCode, ['plan_code'])
  }

  if (params.material) {
    filtered = searchItems(filtered, params.material, ['material'])
  }

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

  return wrapSuccessResponse('盘点结果提交成功')
}

export async function updateStockCountDiffDispositions(planCode: string, items: Array<{ material: string; disposition: string }>) {
  stockCountDiff.forEach((item) => {
    if (String(item.plan_code) !== planCode) return

    const matched = items.find((line) => line.material === item.material)
    if (!matched) return

    item.disposition = matched.disposition
  })

  return wrapSuccessResponse('盘点差异处理已确认')
}
