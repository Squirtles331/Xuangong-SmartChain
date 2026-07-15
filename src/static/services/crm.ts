import { generateId } from '@/mock/shared/id'
import { paginate, searchItems } from '@/mock/shared/paginate'
import { wrapCreatedResponse, wrapDetailResponse, wrapListResponse, wrapSuccessResponse, wrapUpdatedResponse } from '@/mock/shared/response'

const REFERENCE_TODAY = '2026-07-16'

export type SalesOrderStatus = 'confirmed' | 'coordinating' | 'delivering' | 'completed'
export type ContractStatus = 'draft' | 'active' | 'expiring' | 'closed'
export type ReceivableStatus = 'pending' | 'partial' | 'overdue' | 'settled'
export type ReceiptMethod = 'bank' | 'cash' | 'draft'
export type ReceiptStatus = 'unallocated' | 'partial' | 'allocated'
export type OpportunityStage = 'initial' | 'solution' | 'quotation' | 'won' | 'lost'
export type QuotationStatus = 'draft' | 'sent' | 'approved' | 'lost'
export type InvoiceStatus = 'draft' | 'issued' | 'voided' | 'red'

export interface CrmCustomerRelation {
  id: string
  customer_code: string
  customer_name: string
  industry: string
  owner: string
  region: string
  credit_level: 'A' | 'B' | 'C'
}

export interface SalesOrderRecord {
  id: string
  code: string
  customer_code: string
  customer_name: string
  product_name: string
  qty: number
  delivered_qty: number
  amount: number
  promised_date: string
  source_contract_code: string
  erp_order_code: string
  owner: string
  status: SalesOrderStatus
}

export interface SalesOrderQuery {
  pageNum: number
  pageSize: number
  code?: string
  customerCode?: string
  status?: SalesOrderStatus
}

export interface ContractRecord {
  id: string
  code: string
  customer_code: string
  customer_name: string
  order_code: string
  amount: number
  payment_terms: string
  sign_date: string
  start_date: string
  end_date: string
  owner: string
  status: ContractStatus
}

export interface ContractQuery {
  pageNum: number
  pageSize: number
  keyword?: string
  customerCode?: string
  status?: ContractStatus
}

export interface ReceivableRecord {
  id: string
  code: string
  customer_code: string
  customer_name: string
  contract_code: string
  source_order_code: string
  amount: number
  settled: number
  balance: number
  due_date: string
  aging: number
  last_follow_up: string
  status: ReceivableStatus
}

export interface ReceivableQuery {
  pageNum: number
  pageSize: number
  code?: string
  customerCode?: string
  status?: ReceivableStatus
  agingRange?: '0' | '1' | '2' | '3' | '4'
}

export interface ReceiptRecord {
  id: string
  code: string
  customer_code: string
  customer_name: string
  amount: number
  date: string
  method: ReceiptMethod
  allocated_amount: number
  unallocated_amount: number
  status: ReceiptStatus
}

export interface ReceiptCreatePayload {
  customer_code: string
  amount: number
  date?: string
  method?: ReceiptMethod
}

export interface OpportunityRecord {
  id: string
  code: string
  customer_code: string
  customer_name: string
  topic: string
  amount: number
  stage: OpportunityStage
  probability: number
  owner: string
  close_date: string
  next_step: string
}

export interface OpportunityQuery {
  pageNum: number
  pageSize: number
  keyword?: string
  customerCode?: string
  stage?: OpportunityStage
}

export interface QuotationRecord {
  id: string
  code: string
  customer_code: string
  customer_name: string
  opportunity_code: string
  product_name: string
  qty: number
  price: number
  amount: number
  valid_date: string
  owner: string
  status: QuotationStatus
}

export interface QuotationQuery {
  pageNum: number
  pageSize: number
  code?: string
  customerCode?: string
  status?: QuotationStatus
}

export interface InvoiceRecord {
  id: string
  code: string
  customer_code: string
  customer_name: string
  order_code: string
  amount: number
  tax_rate: number
  tax_amount: number
  total: number
  issue_date: string
  owner: string
  status: InvoiceStatus
}

export interface InvoiceQuery {
  pageNum: number
  pageSize: number
  keyword?: string
  customerCode?: string
  status?: InvoiceStatus
}

export interface SalesOrderChangePayload {
  orderId: string
  type: 'qty' | 'date' | 'both'
  new_qty?: number
  new_date?: string
  reason: string
}

export interface SalesOrderChangeRequest {
  id: string
  order_id: string
  order_code: string
  customer_code: string
  type: 'qty' | 'date' | 'both'
  old_qty: number
  new_qty: number
  old_date: string
  new_date: string
  reason: string
  requested_at: string
  status: 'submitted'
}

const customerRelationState: CrmCustomerRelation[] = [
  {
    id: 'crm-customer-001',
    customer_code: 'CUS-001',
    customer_name: '华东重工集团',
    industry: '装备制造',
    owner: '刘颖',
    region: '华东',
    credit_level: 'A'
  },
  {
    id: 'crm-customer-002',
    customer_code: 'CUS-002',
    customer_name: '启明精密制造',
    industry: '汽车零部件',
    owner: '周凯',
    region: '华中',
    credit_level: 'A'
  },
  {
    id: 'crm-customer-003',
    customer_code: 'CUS-003',
    customer_name: '鼎盛动力设备',
    industry: '通用设备',
    owner: '沈悦',
    region: '华南',
    credit_level: 'B'
  }
]

const salesOrderState: SalesOrderRecord[] = [
  {
    id: 'crm-so-001',
    code: 'SO-202607-001',
    customer_code: 'CUS-001',
    customer_name: '华东重工集团',
    product_name: '高压泵总成',
    qty: 48,
    delivered_qty: 0,
    amount: 576000,
    promised_date: '2026-07-26',
    source_contract_code: 'CT-202607-001',
    erp_order_code: 'ERP-SO-240701',
    owner: '刘颖',
    status: 'coordinating'
  },
  {
    id: 'crm-so-002',
    code: 'SO-202607-002',
    customer_code: 'CUS-002',
    customer_name: '启明精密制造',
    product_name: '伺服传动模组',
    qty: 20,
    delivered_qty: 8,
    amount: 398000,
    promised_date: '2026-07-18',
    source_contract_code: 'CT-202606-018',
    erp_order_code: 'ERP-SO-240688',
    owner: '周凯',
    status: 'delivering'
  },
  {
    id: 'crm-so-003',
    code: 'SO-202607-003',
    customer_code: 'CUS-003',
    customer_name: '鼎盛动力设备',
    product_name: '联轴器组件',
    qty: 32,
    delivered_qty: 32,
    amount: 168000,
    promised_date: '2026-07-12',
    source_contract_code: 'CT-202606-009',
    erp_order_code: 'ERP-SO-240645',
    owner: '沈悦',
    status: 'completed'
  }
]

const contractState: ContractRecord[] = [
  {
    id: 'crm-ct-001',
    code: 'CT-202607-001',
    customer_code: 'CUS-001',
    customer_name: '华东重工集团',
    order_code: 'SO-202607-001',
    amount: 820000,
    payment_terms: '发货后 30 天',
    sign_date: '2026-07-01',
    start_date: '2026-07-01',
    end_date: '2026-12-31',
    owner: '刘颖',
    status: 'active'
  },
  {
    id: 'crm-ct-002',
    code: 'CT-202606-018',
    customer_code: 'CUS-002',
    customer_name: '启明精密制造',
    order_code: 'SO-202607-002',
    amount: 398000,
    payment_terms: '月结 45 天',
    sign_date: '2026-06-20',
    start_date: '2026-06-20',
    end_date: '2026-08-10',
    owner: '周凯',
    status: 'expiring'
  },
  {
    id: 'crm-ct-003',
    code: 'CT-202606-009',
    customer_code: 'CUS-003',
    customer_name: '鼎盛动力设备',
    order_code: 'SO-202607-003',
    amount: 268000,
    payment_terms: '预付 30%，验收后结清',
    sign_date: '2026-06-05',
    start_date: '2026-06-06',
    end_date: '2026-09-30',
    owner: '沈悦',
    status: 'active'
  }
]

const receivableState: ReceivableRecord[] = [
  {
    id: 'crm-ar-001',
    code: 'AR-202607-001',
    customer_code: 'CUS-001',
    customer_name: '华东重工集团',
    contract_code: 'CT-202607-001',
    source_order_code: 'SO-202607-001',
    amount: 260000,
    settled: 0,
    balance: 260000,
    due_date: '2026-07-29',
    aging: 0,
    last_follow_up: '已确认客户 7 月底前安排首笔回款',
    status: 'pending'
  },
  {
    id: 'crm-ar-002',
    code: 'AR-202606-018',
    customer_code: 'CUS-002',
    customer_name: '启明精密制造',
    contract_code: 'CT-202606-018',
    source_order_code: 'SO-202607-002',
    amount: 198000,
    settled: 100000,
    balance: 98000,
    due_date: '2026-07-10',
    aging: 6,
    last_follow_up: '客户承诺 3 个工作日内补齐尾款',
    status: 'partial'
  },
  {
    id: 'crm-ar-003',
    code: 'AR-202605-027',
    customer_code: 'CUS-003',
    customer_name: '鼎盛动力设备',
    contract_code: 'CT-202606-009',
    source_order_code: 'SO-202607-003',
    amount: 168000,
    settled: 168000,
    balance: 0,
    due_date: '2026-07-08',
    aging: 8,
    last_follow_up: '已完成回款核销，等待 ERP 财务承接',
    status: 'settled'
  }
]

const receiptState: ReceiptRecord[] = [
  {
    id: 'crm-rc-001',
    code: 'RC-202607-001',
    customer_code: 'CUS-003',
    customer_name: '鼎盛动力设备',
    amount: 168000,
    date: '2026-07-08',
    method: 'bank',
    allocated_amount: 168000,
    unallocated_amount: 0,
    status: 'allocated'
  }
]

const opportunityState: OpportunityRecord[] = [
  {
    id: 'crm-op-001',
    code: 'OP-202607-001',
    customer_code: 'CUS-001',
    customer_name: '华东重工集团',
    topic: '大型泵站年度备件框架项目',
    amount: 980000,
    stage: 'solution',
    probability: 55,
    owner: '刘颖',
    close_date: '2026-08-12',
    next_step: '提交方案与交付节奏说明'
  },
  {
    id: 'crm-op-002',
    code: 'OP-202607-002',
    customer_code: 'CUS-002',
    customer_name: '启明精密制造',
    topic: '伺服传动模组增补采购',
    amount: 420000,
    stage: 'quotation',
    probability: 75,
    owner: '周凯',
    close_date: '2026-07-25',
    next_step: '等待客户完成商务比价'
  },
  {
    id: 'crm-op-003',
    code: 'OP-202606-014',
    customer_code: 'CUS-003',
    customer_name: '鼎盛动力设备',
    topic: '联轴器组件年度补货',
    amount: 260000,
    stage: 'won',
    probability: 100,
    owner: '沈悦',
    close_date: '2026-07-10',
    next_step: '已转入订单协同'
  }
]

const quotationState: QuotationRecord[] = [
  {
    id: 'crm-qt-001',
    code: 'QT-202607-001',
    customer_code: 'CUS-001',
    customer_name: '华东重工集团',
    opportunity_code: 'OP-202607-001',
    product_name: '高压泵备件包',
    qty: 12,
    price: 48000,
    amount: 576000,
    valid_date: '2026-07-30',
    owner: '刘颖',
    status: 'sent'
  },
  {
    id: 'crm-qt-002',
    code: 'QT-202607-002',
    customer_code: 'CUS-002',
    customer_name: '启明精密制造',
    opportunity_code: 'OP-202607-002',
    product_name: '伺服传动模组',
    qty: 20,
    price: 19900,
    amount: 398000,
    valid_date: '2026-07-22',
    owner: '周凯',
    status: 'approved'
  }
]

const invoiceState: InvoiceRecord[] = [
  {
    id: 'crm-iv-001',
    code: 'INV-202607-001',
    customer_code: 'CUS-001',
    customer_name: '华东重工集团',
    order_code: 'SO-202607-001',
    amount: 260000,
    tax_rate: 13,
    tax_amount: 33800,
    total: 293800,
    issue_date: '2026-07-16',
    owner: '刘颖',
    status: 'draft'
  },
  {
    id: 'crm-iv-002',
    code: 'INV-202607-002',
    customer_code: 'CUS-002',
    customer_name: '启明精密制造',
    order_code: 'SO-202607-002',
    amount: 198000,
    tax_rate: 13,
    tax_amount: 25740,
    total: 223740,
    issue_date: '2026-07-12',
    owner: '周凯',
    status: 'issued'
  }
]

const salesOrderChangeState: SalesOrderChangeRequest[] = []

export const crmCustomerOptions = customerRelationState.map((item) => ({
  label: `${item.customer_name} (${item.customer_code})`,
  value: item.customer_code
}))

function getReferenceDate() {
  return new Date(`${REFERENCE_TODAY}T00:00:00`)
}

function getTodayString() {
  return new Date().toISOString().slice(0, 10)
}

function getCustomerRelation(customerCode?: string) {
  return customerRelationState.find((item) => item.customer_code === customerCode) || customerRelationState[0]
}

function buildCode(prefix: string, size: number) {
  return `${prefix}-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${String(size + 1).padStart(3, '0')}`
}

function calcAging(dueDate: string) {
  const diff = getReferenceDate().getTime() - new Date(`${dueDate}T00:00:00`).getTime()
  if (diff <= 0) return 0
  return Math.floor(diff / (24 * 60 * 60 * 1000))
}

function matchAgingRange(aging: number, range?: ReceivableQuery['agingRange']) {
  if (!range) return true
  if (range === '0') return aging <= 0
  if (range === '1') return aging >= 1 && aging <= 30
  if (range === '2') return aging >= 31 && aging <= 60
  if (range === '3') return aging >= 61 && aging <= 90
  return aging > 90
}

function resolveSalesOrderStatus(data: Partial<SalesOrderRecord>) {
  const qty = Number(data.qty || 0)
  const deliveredQty = Math.min(Number(data.delivered_qty || 0), qty)

  if (qty > 0 && deliveredQty >= qty) return 'completed'
  if (deliveredQty > 0) return 'delivering'
  if (data.status === 'coordinating') return 'coordinating'
  return 'confirmed'
}

function resolveReceivableStatus(balance: number, settled: number, aging: number) {
  if (balance <= 0) return 'settled'
  if (aging > 0) return settled > 0 ? 'partial' : 'overdue'
  return settled > 0 ? 'partial' : 'pending'
}

function normalizeSalesOrder(data: Partial<SalesOrderRecord>, current?: SalesOrderRecord): SalesOrderRecord {
  const customer = getCustomerRelation(data.customer_code || current?.customer_code)
  const qty = Number(data.qty ?? current?.qty ?? 0)
  const deliveredQty = Math.min(Number(data.delivered_qty ?? current?.delivered_qty ?? 0), qty)
  const code = data.code || current?.code || buildCode('SO', salesOrderState.length)

  return {
    id: current?.id || data.id || generateId(),
    code,
    customer_code: customer.customer_code,
    customer_name: customer.customer_name,
    product_name: data.product_name || current?.product_name || '',
    qty,
    delivered_qty: deliveredQty,
    amount: Number(data.amount ?? current?.amount ?? 0),
    promised_date: data.promised_date || current?.promised_date || getTodayString(),
    source_contract_code: data.source_contract_code || current?.source_contract_code || '',
    erp_order_code: data.erp_order_code || current?.erp_order_code || `ERP-${code}`,
    owner: data.owner || current?.owner || customer.owner,
    status: resolveSalesOrderStatus({
      ...current,
      ...data,
      qty,
      delivered_qty: deliveredQty
    })
  }
}

function normalizeContract(data: Partial<ContractRecord>, current?: ContractRecord): ContractRecord {
  const customer = getCustomerRelation(data.customer_code || current?.customer_code)
  const code = data.code || current?.code || buildCode('CT', contractState.length)

  return {
    id: current?.id || data.id || generateId(),
    code,
    customer_code: customer.customer_code,
    customer_name: customer.customer_name,
    order_code: data.order_code || current?.order_code || '',
    amount: Number(data.amount ?? current?.amount ?? 0),
    payment_terms: data.payment_terms || current?.payment_terms || '月结 30 天',
    sign_date: data.sign_date || current?.sign_date || getTodayString(),
    start_date: data.start_date || current?.start_date || getTodayString(),
    end_date: data.end_date || current?.end_date || getTodayString(),
    owner: data.owner || current?.owner || customer.owner,
    status: (data.status || current?.status || 'draft') as ContractStatus
  }
}

function normalizeReceivable(data: Partial<ReceivableRecord>, current?: ReceivableRecord): ReceivableRecord {
  const customer = getCustomerRelation(data.customer_code || current?.customer_code)
  const amount = Number(data.amount ?? current?.amount ?? 0)
  const settled = Math.max(0, Math.min(Number(data.settled ?? current?.settled ?? 0), amount))
  const balance = Math.max(amount - settled, 0)
  const dueDate = data.due_date || current?.due_date || getTodayString()
  const aging = calcAging(dueDate)
  const code = data.code || current?.code || buildCode('AR', receivableState.length)

  return {
    id: current?.id || data.id || generateId(),
    code,
    customer_code: customer.customer_code,
    customer_name: customer.customer_name,
    contract_code: data.contract_code || current?.contract_code || '',
    source_order_code: data.source_order_code || current?.source_order_code || '',
    amount,
    settled,
    balance,
    due_date: dueDate,
    aging,
    last_follow_up: data.last_follow_up || current?.last_follow_up || '等待客户回款安排确认',
    status: resolveReceivableStatus(balance, settled, aging)
  }
}

function normalizeOpportunity(data: Partial<OpportunityRecord>, current?: OpportunityRecord): OpportunityRecord {
  const customer = getCustomerRelation(data.customer_code || current?.customer_code)
  const code = data.code || current?.code || buildCode('OP', opportunityState.length)

  return {
    id: current?.id || data.id || generateId(),
    code,
    customer_code: customer.customer_code,
    customer_name: customer.customer_name,
    topic: data.topic || current?.topic || '',
    amount: Number(data.amount ?? current?.amount ?? 0),
    stage: (data.stage || current?.stage || 'initial') as OpportunityStage,
    probability: Number(data.probability ?? current?.probability ?? 20),
    owner: data.owner || current?.owner || customer.owner,
    close_date: data.close_date || current?.close_date || getTodayString(),
    next_step: data.next_step || current?.next_step || '等待客户进一步反馈'
  }
}

function normalizeQuotation(data: Partial<QuotationRecord>, current?: QuotationRecord): QuotationRecord {
  const customer = getCustomerRelation(data.customer_code || current?.customer_code)
  const qty = Number(data.qty ?? current?.qty ?? 1)
  const price = Number(data.price ?? current?.price ?? 0)
  const code = data.code || current?.code || buildCode('QT', quotationState.length)

  return {
    id: current?.id || data.id || generateId(),
    code,
    customer_code: customer.customer_code,
    customer_name: customer.customer_name,
    opportunity_code: data.opportunity_code || current?.opportunity_code || '',
    product_name: data.product_name || current?.product_name || '',
    qty,
    price,
    amount: Number(data.amount ?? current?.amount ?? qty * price),
    valid_date: data.valid_date || current?.valid_date || getTodayString(),
    owner: data.owner || current?.owner || customer.owner,
    status: (data.status || current?.status || 'draft') as QuotationStatus
  }
}

function normalizeInvoice(data: Partial<InvoiceRecord>, current?: InvoiceRecord): InvoiceRecord {
  const customer = getCustomerRelation(data.customer_code || current?.customer_code)
  const amount = Number(data.amount ?? current?.amount ?? 0)
  const taxRate = Number(data.tax_rate ?? current?.tax_rate ?? 13)
  const taxAmount = Math.round(((amount * taxRate) / 100) * 100) / 100
  const total = Math.round((amount + taxAmount) * 100) / 100
  const code = data.code || current?.code || buildCode('INV', invoiceState.length)

  return {
    id: current?.id || data.id || generateId(),
    code,
    customer_code: customer.customer_code,
    customer_name: customer.customer_name,
    order_code: data.order_code || current?.order_code || '',
    amount,
    tax_rate: taxRate,
    tax_amount: Number(data.tax_amount ?? current?.tax_amount ?? taxAmount),
    total: Number(data.total ?? current?.total ?? total),
    issue_date: data.issue_date || current?.issue_date || getTodayString(),
    owner: data.owner || current?.owner || customer.owner,
    status: (data.status || current?.status || 'draft') as InvoiceStatus
  }
}

function filterSalesOrders(params: Omit<SalesOrderQuery, 'pageNum' | 'pageSize'>) {
  let filtered = [...salesOrderState]

  if (params.code) {
    filtered = searchItems(filtered, params.code, ['code', 'product_name', 'source_contract_code', 'erp_order_code'])
  }
  if (params.customerCode) {
    filtered = filtered.filter((item) => item.customer_code === params.customerCode)
  }
  if (params.status) {
    filtered = filtered.filter((item) => item.status === params.status)
  }

  return filtered
}

function filterContracts(params: Omit<ContractQuery, 'pageNum' | 'pageSize'>) {
  let filtered = [...contractState]

  if (params.keyword) {
    filtered = searchItems(filtered, params.keyword, ['code', 'customer_name', 'order_code', 'payment_terms'])
  }
  if (params.customerCode) {
    filtered = filtered.filter((item) => item.customer_code === params.customerCode)
  }
  if (params.status) {
    filtered = filtered.filter((item) => item.status === params.status)
  }

  return filtered
}

function filterReceivables(params: Omit<ReceivableQuery, 'pageNum' | 'pageSize'>) {
  let filtered = [...receivableState].map((item) => normalizeReceivable(item, item))

  if (params.code) {
    filtered = searchItems(filtered, params.code, ['code', 'contract_code', 'source_order_code', 'customer_name'])
  }
  if (params.customerCode) {
    filtered = filtered.filter((item) => item.customer_code === params.customerCode)
  }
  if (params.status) {
    filtered = filtered.filter((item) => item.status === params.status)
  }
  if (params.agingRange) {
    filtered = filtered.filter((item) => matchAgingRange(item.aging, params.agingRange))
  }

  return filtered
}

function filterOpportunities(params: Omit<OpportunityQuery, 'pageNum' | 'pageSize'>) {
  let filtered = [...opportunityState]

  if (params.keyword) {
    filtered = searchItems(filtered, params.keyword, ['code', 'topic', 'customer_name'])
  }
  if (params.customerCode) {
    filtered = filtered.filter((item) => item.customer_code === params.customerCode)
  }
  if (params.stage) {
    filtered = filtered.filter((item) => item.stage === params.stage)
  }

  return filtered
}

function filterQuotations(params: Omit<QuotationQuery, 'pageNum' | 'pageSize'>) {
  let filtered = [...quotationState]

  if (params.code) {
    filtered = searchItems(filtered, params.code, ['code', 'product_name', 'opportunity_code', 'customer_name'])
  }
  if (params.customerCode) {
    filtered = filtered.filter((item) => item.customer_code === params.customerCode)
  }
  if (params.status) {
    filtered = filtered.filter((item) => item.status === params.status)
  }

  return filtered
}

function filterInvoices(params: Omit<InvoiceQuery, 'pageNum' | 'pageSize'>) {
  let filtered = [...invoiceState]

  if (params.keyword) {
    filtered = searchItems(filtered, params.keyword, ['code', 'order_code', 'customer_name'])
  }
  if (params.customerCode) {
    filtered = filtered.filter((item) => item.customer_code === params.customerCode)
  }
  if (params.status) {
    filtered = filtered.filter((item) => item.status === params.status)
  }

  return filtered
}

export async function getSalesOrderList(params: SalesOrderQuery) {
  const filtered = filterSalesOrders(params)
  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function getSalesOrderDetail(id: string) {
  const target = salesOrderState.find((item) => item.id === id) || null
  return wrapDetailResponse(target, target ? '查询成功' : '未找到订单')
}

export async function createSalesOrder(data: Partial<SalesOrderRecord>) {
  const record = normalizeSalesOrder(data)
  salesOrderState.unshift(record)
  return wrapCreatedResponse(record, '销售订单已新增')
}

export async function updateSalesOrder(id: string, data: Partial<SalesOrderRecord>) {
  const index = salesOrderState.findIndex((item) => item.id === id)
  if (index >= 0) {
    salesOrderState[index] = normalizeSalesOrder(data, salesOrderState[index])
    return wrapUpdatedResponse(salesOrderState[index], '销售订单已更新')
  }

  return wrapUpdatedResponse(normalizeSalesOrder(data), '销售订单已更新')
}

export async function deleteSalesOrder(id: string) {
  const index = salesOrderState.findIndex((item) => item.id === id)
  if (index >= 0) {
    salesOrderState.splice(index, 1)
  }

  return wrapSuccessResponse('销售订单已删除')
}

export async function saveContract(data: Partial<ContractRecord>) {
  const index = contractState.findIndex((item) => item.id === data.id)
  const record = normalizeContract(data, index >= 0 ? contractState[index] : undefined)

  if (index >= 0) {
    contractState[index] = record
    return wrapUpdatedResponse(record, '合同已更新')
  }

  contractState.unshift(record)
  return wrapCreatedResponse(record, '合同已新增')
}

export async function getContractList(params: ContractQuery) {
  const filtered = filterContracts(params)
  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function deleteContract(id: string) {
  const index = contractState.findIndex((item) => item.id === id)
  if (index >= 0) {
    contractState.splice(index, 1)
  }

  return wrapSuccessResponse('合同已删除')
}

export async function getReceivableList(params: ReceivableQuery) {
  const filtered = filterReceivables(params)
  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function createReceiptRecord(data: ReceiptCreatePayload) {
  const customer = getCustomerRelation(data.customer_code)
  const amount = Number(data.amount || 0)
  const record: ReceiptRecord = {
    id: generateId(),
    code: buildCode('RC', receiptState.length),
    customer_code: customer.customer_code,
    customer_name: customer.customer_name,
    amount,
    date: data.date || getTodayString(),
    method: data.method || 'bank',
    allocated_amount: 0,
    unallocated_amount: amount,
    status: 'unallocated'
  }

  receiptState.unshift(record)
  return wrapCreatedResponse(record, '回款已登记')
}

export async function settleReceivables(data: { receiptId?: string; items: Array<{ id: string; amount: number }> }) {
  const totalAmount = data.items.reduce((sum, item) => sum + Number(item.amount || 0), 0)

  data.items.forEach((item) => {
    const index = receivableState.findIndex((record) => record.id === item.id)
    if (index < 0) return

    receivableState[index] = normalizeReceivable(
      {
        ...receivableState[index],
        settled: receivableState[index].settled + Number(item.amount || 0),
        last_follow_up: `已登记回款核销 ${Number(item.amount || 0).toLocaleString('zh-CN')} 元`
      },
      receivableState[index]
    )
  })

  if (data.receiptId) {
    const receipt = receiptState.find((item) => item.id === data.receiptId)
    if (receipt) {
      receipt.allocated_amount = Math.min(receipt.allocated_amount + totalAmount, receipt.amount)
      receipt.unallocated_amount = Math.max(receipt.amount - receipt.allocated_amount, 0)
      receipt.status = receipt.unallocated_amount === 0 ? 'allocated' : receipt.allocated_amount > 0 ? 'partial' : 'unallocated'
    }
  }

  return wrapSuccessResponse('应收核销成功')
}

export async function getOpportunityList(params: OpportunityQuery) {
  const filtered = filterOpportunities(params)
  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function saveOpportunity(data: Partial<OpportunityRecord>) {
  const index = opportunityState.findIndex((item) => item.id === data.id)
  const record = normalizeOpportunity(data, index >= 0 ? opportunityState[index] : undefined)

  if (index >= 0) {
    opportunityState[index] = record
    return wrapUpdatedResponse(record, '商机已更新')
  }

  opportunityState.unshift(record)
  return wrapCreatedResponse(record, '商机已新增')
}

export async function deleteOpportunity(id: string) {
  const index = opportunityState.findIndex((item) => item.id === id)
  if (index >= 0) {
    opportunityState.splice(index, 1)
  }

  return wrapSuccessResponse('商机已删除')
}

export async function convertOpportunity(id: string) {
  const target = opportunityState.find((item) => item.id === id)
  if (!target) {
    return wrapSuccessResponse('未找到商机')
  }

  target.stage = target.stage === 'won' ? 'won' : 'quotation'
  target.probability = Math.max(target.probability, target.stage === 'won' ? 100 : 75)
  target.next_step = target.stage === 'won' ? '已转入订单协同' : '已转入报价协同，等待客户确认'

  const exists = quotationState.some((item) => item.opportunity_code === target.code)
  if (!exists) {
    quotationState.unshift(
      normalizeQuotation({
        customer_code: target.customer_code,
        opportunity_code: target.code,
        product_name: target.topic,
        qty: 1,
        price: target.amount,
        amount: target.amount,
        valid_date: target.close_date,
        status: 'draft',
        owner: target.owner
      })
    )
  }

  return wrapSuccessResponse('商机已转入报价协同')
}

export async function getQuotationList(params: QuotationQuery) {
  const filtered = filterQuotations(params)
  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function saveQuotation(data: Partial<QuotationRecord>) {
  const index = quotationState.findIndex((item) => item.id === data.id)
  const record = normalizeQuotation(data, index >= 0 ? quotationState[index] : undefined)

  if (index >= 0) {
    quotationState[index] = record
    return wrapUpdatedResponse(record, '报价单已更新')
  }

  quotationState.unshift(record)
  return wrapCreatedResponse(record, '报价单已新增')
}

export async function deleteQuotation(id: string) {
  const index = quotationState.findIndex((item) => item.id === id)
  if (index >= 0) {
    quotationState.splice(index, 1)
  }

  return wrapSuccessResponse('报价单已删除')
}

export async function getInvoiceList(params: InvoiceQuery) {
  const filtered = filterInvoices(params)
  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function saveInvoice(data: Partial<InvoiceRecord>) {
  const index = invoiceState.findIndex((item) => item.id === data.id)
  const record = normalizeInvoice(data, index >= 0 ? invoiceState[index] : undefined)

  if (index >= 0) {
    invoiceState[index] = record
    return wrapUpdatedResponse(record, '发票协同单已更新')
  }

  invoiceState.unshift(record)
  return wrapCreatedResponse(record, '发票协同单已新增')
}

export async function issueInvoice(id: string) {
  const target = invoiceState.find((item) => item.id === id)
  if (target) {
    target.status = 'issued'
    target.issue_date = getTodayString()
  }

  return wrapSuccessResponse('发票协同单已开具')
}

export async function createSalesOrderChangeRequest(payload: SalesOrderChangePayload) {
  const target = salesOrderState.find((item) => item.id === payload.orderId)
  if (!target) {
    return wrapCreatedResponse(null, '未找到销售订单')
  }

  const request: SalesOrderChangeRequest = {
    id: generateId(),
    order_id: target.id,
    order_code: target.code,
    customer_code: target.customer_code,
    type: payload.type,
    old_qty: target.qty,
    new_qty: payload.type === 'date' ? target.qty : Number(payload.new_qty ?? target.qty),
    old_date: target.promised_date,
    new_date: payload.type === 'qty' ? target.promised_date : payload.new_date || target.promised_date,
    reason: payload.reason,
    requested_at: getTodayString(),
    status: 'submitted'
  }

  salesOrderChangeState.unshift(request)
  const nextQty = request.new_qty
  const nextDelivered = Math.min(target.delivered_qty, nextQty)

  Object.assign(
    target,
    normalizeSalesOrder(
      {
        ...target,
        qty: nextQty,
        delivered_qty: nextDelivered,
        promised_date: request.new_date,
        status: target.status === 'completed' ? 'coordinating' : target.status
      },
      target
    )
  )

  return wrapCreatedResponse(request, '订单变更请求已提交')
}

export function getCustomerRelationOptions() {
  return [...crmCustomerOptions]
}
