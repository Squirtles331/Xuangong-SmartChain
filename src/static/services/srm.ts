import { generateId } from '@/mock/shared/id'
import { paginate, searchItems } from '@/mock/shared/paginate'
import { wrapListResponse, wrapSuccessResponse } from '@/mock/shared/response'

export type PurchaseRequestSource = 'erp' | 'manual'
export type PurchaseRequestStatus = 'draft' | 'approved' | 'ordered' | 'rejected'
export type PurchaseOrderStatus = 'sent' | 'partial' | 'received' | 'closed'
export type SupplierResponseStatus = 'pending' | 'confirmed' | 'delayed'
export type PurchaseReturnStatus = 'pending' | 'done'

export interface PurchaseRequestRecord {
  id: string
  code: string
  dept: string
  reason: string
  item_summary: string
  item_count: number
  source: PurchaseRequestSource
  source_code: string
  need_date: string
  status: PurchaseRequestStatus
  created_at: string
}

export interface PurchaseRequestQuery {
  pageNum: number
  pageSize: number
  code?: string
  status?: PurchaseRequestStatus
  source?: PurchaseRequestSource
}

export interface PurchaseOrderRecord {
  id: string
  code: string
  request_code: string
  supplier: string
  material: string
  source_code: string
  qty: number
  received: number
  remain: number
  delivery: string
  status: PurchaseOrderStatus
  response_status: SupplierResponseStatus
  terms: string
}

export interface PurchaseOrderQuery {
  pageNum: number
  pageSize: number
  code?: string
  supplier?: string
  status?: PurchaseOrderStatus
}

export interface PurchaseReturnRecord {
  id: string
  code: string
  po_code: string
  supplier: string
  material: string
  qty: number
  reason: string
  quality_source: string
  created_at: string
  status: PurchaseReturnStatus
}

export interface PurchaseReturnQuery {
  pageNum: number
  pageSize: number
  code?: string
  status?: PurchaseReturnStatus
}

const purchaseRequestState: PurchaseRequestRecord[] = [
  {
    id: 'srm-pr-001',
    code: 'PR-202607-001',
    dept: '生产计划部',
    reason: 'MRP 建议转采购',
    item_summary: '6208 轴承、45#圆钢',
    item_count: 2,
    source: 'erp',
    source_code: 'MRP-20260715-01',
    need_date: '2026-07-20',
    status: 'approved',
    created_at: '2026-07-15'
  },
  {
    id: 'srm-pr-002',
    code: 'PR-202607-002',
    dept: '设备动力部',
    reason: '关键备件补货',
    item_summary: '密封组件、联轴器',
    item_count: 2,
    source: 'manual',
    source_code: 'MANUAL-REQ-018',
    need_date: '2026-07-22',
    status: 'draft',
    created_at: '2026-07-15'
  },
  {
    id: 'srm-pr-003',
    code: 'PR-202607-003',
    dept: '研发试制组',
    reason: '试制样机用料',
    item_summary: '伺服驱动器',
    item_count: 1,
    source: 'manual',
    source_code: 'RD-TRIAL-006',
    need_date: '2026-07-25',
    status: 'ordered',
    created_at: '2026-07-14'
  }
]

const purchaseOrderState: PurchaseOrderRecord[] = [
  {
    id: 'srm-po-001',
    code: 'PO-202607-018',
    request_code: 'PR-202607-001',
    supplier: '苏州精工轴承有限公司',
    material: '6208 轴承',
    source_code: 'MRP-20260715-01',
    qty: 600,
    received: 260,
    remain: 340,
    delivery: '2026-07-19',
    status: 'partial',
    response_status: 'confirmed',
    terms: '月结 30 天'
  },
  {
    id: 'srm-po-002',
    code: 'PO-202607-021',
    request_code: 'PR-202607-002',
    supplier: '常州联传机电制造厂',
    material: '联轴器总成',
    source_code: 'MANUAL-REQ-018',
    qty: 24,
    received: 0,
    remain: 24,
    delivery: '2026-07-18',
    status: 'sent',
    response_status: 'pending',
    terms: '月结 60 天'
  },
  {
    id: 'srm-po-003',
    code: 'PO-202607-011',
    request_code: 'PR-202607-003',
    supplier: '无锡标准件供应商',
    material: '伺服驱动器',
    source_code: 'RD-TRIAL-006',
    qty: 6,
    received: 6,
    remain: 0,
    delivery: '2026-07-13',
    status: 'received',
    response_status: 'confirmed',
    terms: '款到发货'
  },
  {
    id: 'srm-po-004',
    code: 'PO-202607-006',
    request_code: 'PR-202607-000',
    supplier: '南通铸造协同工厂',
    material: '泵体毛坯',
    source_code: 'ERP-PLAN-STATIC',
    qty: 10,
    received: 0,
    remain: 10,
    delivery: '2026-07-14',
    status: 'closed',
    response_status: 'delayed',
    terms: '月结 45 天'
  }
]

const purchaseReturnState: PurchaseReturnRecord[] = [
  {
    id: 'srm-rt-001',
    code: 'RT-202607-001',
    po_code: 'PO-202607-018',
    supplier: '苏州精工轴承有限公司',
    material: '6208 轴承',
    qty: 18,
    reason: '来料外圈磕碰',
    quality_source: 'QMS-IQC-20260715-002',
    created_at: '2026-07-15',
    status: 'pending'
  },
  {
    id: 'srm-rt-002',
    code: 'RT-202607-002',
    po_code: 'PO-202607-011',
    supplier: '无锡标准件供应商',
    material: '伺服驱动器',
    qty: 1,
    reason: '型号不符',
    quality_source: 'QMS-IQC-20260712-006',
    created_at: '2026-07-13',
    status: 'done'
  }
]

function buildRequestCode() {
  return `PR-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${String(purchaseRequestState.length + 1).padStart(3, '0')}`
}

function buildOrderCode() {
  return `PO-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${String(purchaseOrderState.length + 1).padStart(3, '0')}`
}

function buildReturnCode() {
  return `RT-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${String(purchaseReturnState.length + 1).padStart(3, '0')}`
}

function filterPurchaseRequests(params: Omit<PurchaseRequestQuery, 'pageNum' | 'pageSize'>) {
  let filtered = [...purchaseRequestState]

  if (params.code) {
    filtered = searchItems(filtered, params.code, ['code', 'source_code', 'item_summary'])
  }
  if (params.status) {
    filtered = filtered.filter((item) => item.status === params.status)
  }
  if (params.source) {
    filtered = filtered.filter((item) => item.source === params.source)
  }

  return filtered
}

function filterPurchaseOrders(params: Omit<PurchaseOrderQuery, 'pageNum' | 'pageSize'>) {
  let filtered = [...purchaseOrderState]

  if (params.code) {
    filtered = searchItems(filtered, params.code, ['code', 'request_code', 'source_code', 'material'])
  }
  if (params.supplier) {
    filtered = searchItems(filtered, params.supplier, ['supplier'])
  }
  if (params.status) {
    filtered = filtered.filter((item) => item.status === params.status)
  }

  return filtered
}

function filterPurchaseReturns(params: Omit<PurchaseReturnQuery, 'pageNum' | 'pageSize'>) {
  let filtered = [...purchaseReturnState]

  if (params.code) {
    filtered = searchItems(filtered, params.code, ['code', 'po_code', 'material', 'quality_source'])
  }
  if (params.status) {
    filtered = filtered.filter((item) => item.status === params.status)
  }

  return filtered
}

export async function getPurchaseRequestList(params: PurchaseRequestQuery) {
  const filtered = filterPurchaseRequests(params)
  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function createPurchaseRequest(data: Partial<PurchaseRequestRecord>) {
  purchaseRequestState.unshift({
    id: generateId(),
    code: data.code || buildRequestCode(),
    dept: data.dept || '',
    reason: data.reason || '',
    item_summary: data.item_summary || '',
    item_count: data.item_count || 0,
    source: data.source || 'manual',
    source_code: data.source_code || 'MANUAL-NEW',
    need_date: data.need_date || '',
    status: data.status || 'draft',
    created_at: data.created_at || new Date().toISOString().slice(0, 10)
  })

  return wrapSuccessResponse('采购申请已新增')
}

export async function updatePurchaseRequest(id: string, data: Partial<PurchaseRequestRecord>) {
  const target = purchaseRequestState.find((item) => item.id === id)
  if (target) {
    Object.assign(target, data)
  }

  return wrapSuccessResponse('采购申请已更新')
}

export async function deletePurchaseRequest(id: string) {
  const index = purchaseRequestState.findIndex((item) => item.id === id)
  if (index >= 0) {
    purchaseRequestState.splice(index, 1)
  }

  return wrapSuccessResponse('采购申请已删除')
}

export async function getPurchaseOrderList(params: PurchaseOrderQuery) {
  const filtered = filterPurchaseOrders(params)
  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function createPurchaseOrder(data: Partial<PurchaseOrderRecord>) {
  const qty = Number(data.qty || 0)
  const received = Number(data.received || 0)

  purchaseOrderState.unshift({
    id: generateId(),
    code: data.code || buildOrderCode(),
    request_code: data.request_code || 'PR-STATIC',
    supplier: data.supplier || '',
    material: data.material || '',
    source_code: data.source_code || 'SRM-MANUAL',
    qty,
    received,
    remain: Math.max(qty - received, 0),
    delivery: data.delivery || '',
    status: data.status || 'sent',
    response_status: data.response_status || 'pending',
    terms: data.terms || '月结 30 天'
  })

  return wrapSuccessResponse('采购订单已新增')
}

export async function updatePurchaseOrder(id: string, data: Partial<PurchaseOrderRecord>) {
  const target = purchaseOrderState.find((item) => item.id === id)
  if (target) {
    const qty = Number(data.qty ?? target.qty)
    const received = Number(data.received ?? target.received)
    Object.assign(target, data, {
      qty,
      received,
      remain: Math.max(qty - received, 0)
    })
  }

  return wrapSuccessResponse('采购订单已更新')
}

export async function deletePurchaseOrder(id: string) {
  const index = purchaseOrderState.findIndex((item) => item.id === id)
  if (index >= 0) {
    purchaseOrderState.splice(index, 1)
  }

  return wrapSuccessResponse('采购订单已删除')
}

export async function getPurchaseReturnList(params: PurchaseReturnQuery) {
  const filtered = filterPurchaseReturns(params)
  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function createPurchaseReturn(data: Partial<PurchaseReturnRecord>) {
  purchaseReturnState.unshift({
    id: generateId(),
    code: data.code || buildReturnCode(),
    po_code: data.po_code || '',
    supplier: data.supplier || '',
    material: data.material || '',
    qty: Number(data.qty || 0),
    reason: data.reason || '',
    quality_source: data.quality_source || 'QMS-STATIC',
    created_at: data.created_at || new Date().toISOString().slice(0, 10),
    status: data.status || 'pending'
  })

  return wrapSuccessResponse('采购退货已新增')
}

export async function updatePurchaseReturn(id: string, data: Partial<PurchaseReturnRecord>) {
  const target = purchaseReturnState.find((item) => item.id === id)
  if (target) {
    Object.assign(target, data)
  }

  return wrapSuccessResponse('采购退货已更新')
}

export async function deletePurchaseReturn(id: string) {
  const index = purchaseReturnState.findIndex((item) => item.id === id)
  if (index >= 0) {
    purchaseReturnState.splice(index, 1)
  }

  return wrapSuccessResponse('采购退货已删除')
}
