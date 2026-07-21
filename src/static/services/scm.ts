import { generateId } from '@/static/utils/id'
import { paginate, searchItems } from '@/static/utils/paginate'
import { wrapDetailResponse, wrapListResponse, wrapSuccessResponse } from '@/static/utils/response'

const suppliers = [
  {
    id: '1',
    code: 'SUP20250001',
    name: 'Suzhou Precision Steel Co.',
    contact: 'Zhang Jianguo',
    phone: '13812345678',
    terms: 'Net 30',
    status: 'active',
    qualified: true
  },
  {
    id: '2',
    code: 'SUP20250002',
    name: 'Changzhou Bearing Plant',
    contact: 'Li Guoqiang',
    phone: '13912345679',
    terms: 'Net 60',
    status: 'active',
    qualified: true
  },
  {
    id: '3',
    code: 'SUP20250003',
    name: 'Wuxi Fastener Co.',
    contact: 'Wang Xiulan',
    phone: '13712345670',
    terms: 'Prepaid',
    status: 'active',
    qualified: true
  },
  {
    id: '4',
    code: 'SUP20250004',
    name: 'Nantong Casting Supplier',
    contact: 'Zhao Dehai',
    phone: '13612345671',
    terms: 'Net 30',
    status: 'frozen',
    qualified: false
  }
]

const purchaseOrders = [
  {
    id: '1',
    code: 'PO202501150001',
    supplier: 'Suzhou Precision Steel Co.',
    material: '45 Steel Bar D50',
    qty: 500,
    received: 200,
    remain: 300,
    delivery: '2026-07-24',
    status: 'partial' as const
  },
  {
    id: '2',
    code: 'PO202501140002',
    supplier: 'Changzhou Bearing Plant',
    material: 'Bearing 6308',
    qty: 200,
    received: 0,
    remain: 200,
    delivery: '2026-07-25',
    status: 'sent' as const
  },
  {
    id: '3',
    code: 'PO202501130003',
    supplier: 'Wuxi Fastener Co.',
    material: 'Bolt M16x60',
    qty: 1200,
    received: 1200,
    remain: 0,
    delivery: '2026-07-18',
    status: 'received' as const
  }
]

const priceRecords = [
  {
    id: '1',
    material: '45 Steel Bar D50',
    supplier: 'Suzhou Precision Steel Co.',
    price: 5.8,
    currency: 'CNY',
    valid_from: '2026-01-01',
    valid_to: '2026-12-31',
    source: 'Annual Contract'
  },
  {
    id: '2',
    material: 'Bearing 6308',
    supplier: 'Changzhou Bearing Plant',
    price: 85,
    currency: 'CNY',
    valid_from: '2026-01-01',
    valid_to: '2026-12-31',
    source: 'Annual Contract'
  },
  {
    id: '3',
    material: 'Pump Body Casting',
    supplier: 'Nantong Casting Supplier',
    price: 168,
    currency: 'CNY',
    valid_from: '2026-02-01',
    valid_to: '2026-08-31',
    source: 'Quotation'
  }
]

const purchaseRequests = [
  {
    id: '1',
    code: 'PR202607150001',
    dept: 'Production',
    reason: 'Production demand',
    need_date: '2026-07-25',
    status: 'draft' as const,
    source: 'manual' as const,
    created_at: '2026-07-15'
  },
  {
    id: '2',
    code: 'PR202607150002',
    dept: 'Production',
    reason: 'Safety stock replenishment',
    need_date: '2026-07-26',
    status: 'approved' as const,
    source: 'mrp' as const,
    created_at: '2026-07-15'
  }
]

const purchaseReturns = [
  {
    id: '1',
    code: 'PRT20260715001',
    po_code: 'PO202501140002',
    supplier: 'Changzhou Bearing Plant',
    material: 'Bearing 6308',
    qty: 20,
    reason: 'Dimension out of tolerance',
    status: 'pending' as const
  },
  {
    id: '2',
    code: 'PRT20260710002',
    po_code: 'PO202501150001',
    supplier: 'Suzhou Precision Steel Co.',
    material: '45 Steel Bar D50',
    qty: 100,
    reason: 'Material not qualified',
    status: 'done' as const
  }
]

const portalOrders = [
  { id: '1', code: 'PO202607210001', material: '45 Steel Bar D50', qty: 500, delivery_date: '2026-07-24', status: 'pending' as const },
  { id: '2', code: 'PO202607180002', material: 'Bearing 6308', qty: 200, delivery_date: '2026-07-23', status: 'confirmed' as const },
  { id: '3', code: 'PO202607160003', material: 'Bolt M16x60', qty: 1500, delivery_date: '2026-07-26', status: 'rejected' as const }
]

const portalDeliveries = [
  { id: '1', code: 'FH20260721001', material: '45 Steel Bar D50', qty: 500, carrier: 'SF Express', tracking_no: 'SF1234567890', confirmed: false },
  { id: '2', code: 'FH20260718002', material: 'Bearing 6308', qty: 200, carrier: 'Deppon', tracking_no: 'DB9876543210', confirmed: true }
]

const portalTimeline = [
  { timestamp: '2026-07-21 09:30', content: 'Purchase order created', color: '#0bbd87', type: 'primary' as const, hollow: false },
  { timestamp: '2026-07-21 10:15', content: 'Supplier confirmed order', color: '#0bbd87', type: 'success' as const, hollow: false },
  { timestamp: '2026-07-22 14:00', content: 'Goods prepared for pickup', color: '#0bbd87', type: 'primary' as const, hollow: false }
]

const portalReconciliation = [
  {
    period: '2026-07',
    order_code: 'PO202607210001',
    material: '45 Steel Bar D50',
    order_qty: 500,
    delivered_qty: 500,
    accepted_qty: 480,
    amount: 2784,
    rec_status: 'pending' as const
  },
  {
    period: '2026-07',
    order_code: 'PO202607180002',
    material: 'Bearing 6308',
    order_qty: 200,
    delivered_qty: 200,
    accepted_qty: 200,
    amount: 17000,
    rec_status: 'confirmed' as const
  }
]

export async function getSupplierList(params: { pageNum: number; pageSize: number; name?: string; status?: string }) {
  let filtered = [...suppliers]
  if (params.name) filtered = searchItems(filtered, params.name, ['name', 'code', 'contact'])
  if (params.status) filtered = filtered.filter((item) => item.status === params.status)
  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function createSupplier(data: any) {
  suppliers.unshift({ id: generateId('supplier'), qualified: true, ...data })
  return wrapSuccessResponse('Supplier created')
}

export async function updateSupplier(id: string, data: any) {
  const index = suppliers.findIndex((item) => item.id === id)
  if (index > -1) Object.assign(suppliers[index], data)
  return wrapSuccessResponse('Supplier updated')
}

export async function deleteSupplier(id: string) {
  const index = suppliers.findIndex((item) => item.id === id)
  if (index > -1) suppliers.splice(index, 1)
  return wrapSuccessResponse('Supplier deleted')
}

export async function getPurchaseOrderList(params: { pageNum: number; pageSize: number; code?: string; supplier?: string; status?: string }) {
  let filtered = [...purchaseOrders]
  if (params.code) filtered = searchItems(filtered, params.code, ['code', 'material'])
  if (params.supplier) filtered = searchItems(filtered, params.supplier, ['supplier'])
  if (params.status) filtered = filtered.filter((item) => item.status === params.status)
  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function createPurchaseOrder(data: any) {
  const qty = Number(data.qty || 0)
  const received = Number(data.received || 0)
  purchaseOrders.unshift({ id: generateId('po'), received, remain: Math.max(qty - received, 0), ...data })
  return wrapSuccessResponse('Purchase order created')
}

export async function updatePurchaseOrder(id: string, data: any) {
  const index = purchaseOrders.findIndex((item) => item.id === id)
  if (index > -1) {
    const next = { ...purchaseOrders[index], ...data }
    next.remain = Math.max(Number(next.qty || 0) - Number(next.received || 0), 0)
    Object.assign(purchaseOrders[index], next)
  }
  return wrapSuccessResponse('Purchase order updated')
}

export async function deletePurchaseOrder(id: string) {
  const index = purchaseOrders.findIndex((item) => item.id === id)
  if (index > -1) purchaseOrders.splice(index, 1)
  return wrapSuccessResponse('Purchase order deleted')
}

export async function getPriceList(params: { pageNum: number; pageSize: number; material?: string; supplier?: string; source?: string }) {
  let filtered = [...priceRecords]
  if (params.material) filtered = searchItems(filtered, params.material, ['material'])
  if (params.supplier) filtered = searchItems(filtered, params.supplier, ['supplier'])
  if (params.source) filtered = filtered.filter((item) => item.source === params.source)
  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function createPrice(data: any) {
  priceRecords.unshift({ id: generateId('price'), ...data })
  return wrapSuccessResponse('Price record created')
}

export async function updatePrice(id: string, data: any) {
  const index = priceRecords.findIndex((item) => item.id === id)
  if (index > -1) Object.assign(priceRecords[index], data)
  return wrapSuccessResponse('Price record updated')
}

export async function deletePrice(id: string) {
  const index = priceRecords.findIndex((item) => item.id === id)
  if (index > -1) priceRecords.splice(index, 1)
  return wrapSuccessResponse('Price record deleted')
}

export async function getPurchaseRequestList(params: { pageNum: number; pageSize: number; code?: string; status?: string; source?: string }) {
  let filtered = [...purchaseRequests]
  if (params.code) filtered = searchItems(filtered, params.code, ['code', 'dept', 'reason'])
  if (params.status) filtered = filtered.filter((item) => item.status === params.status)
  if (params.source) filtered = filtered.filter((item) => item.source === params.source)
  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function createPurchaseRequest(data: any) {
  purchaseRequests.unshift({ id: generateId('pr'), created_at: data.created_at || '2026-07-21', ...data })
  return wrapSuccessResponse('Purchase request created')
}

export async function updatePurchaseRequest(id: string, data: any) {
  const index = purchaseRequests.findIndex((item) => item.id === id)
  if (index > -1) Object.assign(purchaseRequests[index], data)
  return wrapSuccessResponse('Purchase request updated')
}

export async function deletePurchaseRequest(id: string) {
  const index = purchaseRequests.findIndex((item) => item.id === id)
  if (index > -1) purchaseRequests.splice(index, 1)
  return wrapSuccessResponse('Purchase request deleted')
}

export async function getPurchaseReturnList(params: { pageNum: number; pageSize: number; code?: string; status?: string }) {
  let filtered = [...purchaseReturns]
  if (params.code) filtered = searchItems(filtered, params.code, ['code', 'po_code', 'supplier', 'material'])
  if (params.status) filtered = filtered.filter((item) => item.status === params.status)
  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function createPurchaseReturn(data: any) {
  purchaseReturns.unshift({ id: generateId('prt'), ...data })
  return wrapSuccessResponse('Purchase return created')
}

export async function updatePurchaseReturn(id: string, data: any) {
  const index = purchaseReturns.findIndex((item) => item.id === id)
  if (index > -1) Object.assign(purchaseReturns[index], data)
  return wrapSuccessResponse('Purchase return updated')
}

export async function deletePurchaseReturn(id: string) {
  const index = purchaseReturns.findIndex((item) => item.id === id)
  if (index > -1) purchaseReturns.splice(index, 1)
  return wrapSuccessResponse('Purchase return deleted')
}

export async function getSupplierPortalData() {
  return wrapDetailResponse({
    orders: [...portalOrders],
    deliveries: [...portalDeliveries],
    timelineItems: [...portalTimeline],
    recData: [...portalReconciliation]
  })
}

export async function confirmPortalOrder(id: string) {
  const order = portalOrders.find((item) => item.id === id)
  if (order) order.status = 'confirmed'
  return wrapSuccessResponse('Portal order confirmed')
}

export async function rejectPortalOrder(id: string) {
  const order = portalOrders.find((item) => item.id === id)
  if (order) order.status = 'rejected'
  return wrapSuccessResponse('Portal order rejected')
}

export async function confirmPortalDelivery(id: string) {
  const delivery = portalDeliveries.find((item) => item.id === id)
  if (delivery) delivery.confirmed = true
  return wrapSuccessResponse('Portal delivery confirmed')
}
