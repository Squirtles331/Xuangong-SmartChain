import { generateId } from '../shared/id'
import { paginate, searchItems } from '../shared/paginate'
import { wrapCreatedResponse, wrapDetailResponse, wrapListResponse, wrapSuccessResponse, wrapUpdatedResponse } from '../shared/response'
import { simulateDelay } from '../shared/delay'
import { contracts, customers, invoices, opportunities, quotations, receivables, salesOrders } from '../modules/crm'

function createCode(prefix: string, size: number) {
  return `${prefix}${new Date().toISOString().slice(0, 10).replace(/-/g, '')}${String(size + 1).padStart(4, '0')}`
}

export async function getCustomerList(params: { pageNum: number; pageSize: number; code?: string; name?: string; status?: string }) {
  await simulateDelay()
  let filtered = [...customers]
  if (params.code) filtered = searchItems(filtered, params.code, ['code'])
  if (params.name) filtered = searchItems(filtered, params.name, ['name'])
  if (params.status) filtered = filtered.filter((item) => item.status === params.status)
  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function createCustomer(data: any) {
  await simulateDelay()
  const next = {
    id: generateId(),
    code: data.code || createCode('KH', customers.length),
    name: data.name || '',
    contact_person: data.contact_person || '',
    contact_phone: data.contact_phone || '',
    payment_terms: data.payment_terms || '月结30天',
    credit_limit: data.credit_limit ?? 0,
    status: data.status || 'active'
  }
  customers.unshift(next)
  return wrapCreatedResponse(next, '新增客户成功')
}

export async function updateCustomer(id: string, data: any) {
  await simulateDelay()
  const index = customers.findIndex((item) => item.id === id)
  if (index > -1) {
    customers[index] = { ...customers[index], ...data }
    return wrapUpdatedResponse(customers[index], '编辑客户成功')
  }
  return wrapUpdatedResponse({ id, ...data }, '编辑客户成功')
}

export async function deleteCustomer(id: string) {
  await simulateDelay()
  const index = customers.findIndex((item) => item.id === id)
  if (index > -1) customers.splice(index, 1)
  return wrapSuccessResponse('删除客户成功')
}

export async function getSalesOrderList(params: { pageNum: number; pageSize: number; code?: string; customerName?: string; status?: string }) {
  await simulateDelay()
  let filtered = [...salesOrders]
  if (params.code) filtered = searchItems(filtered, params.code, ['code'])
  if (params.customerName) filtered = searchItems(filtered, params.customerName, ['customer_name'])
  if (params.status) filtered = filtered.filter((item) => item.status === params.status)
  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function getSalesOrderDetail(id: string) {
  await simulateDelay()
  const detail = salesOrders.find((item) => item.id === id) || null
  return wrapDetailResponse(detail)
}

export async function createSalesOrder(data: any) {
  await simulateDelay()
  const next = {
    id: generateId(),
    code: data.code || createCode('SO', salesOrders.length),
    customer_name: data.customer_name || '',
    material_name: data.material_name || '',
    qty: data.qty ?? 0,
    amount: data.amount ?? 0,
    delivery_date: data.delivery_date || '',
    status: data.status || 'approved'
  }
  salesOrders.unshift(next)
  return wrapCreatedResponse(next, '新增销售订单成功')
}

export async function updateSalesOrder(id: string, data: any) {
  await simulateDelay()
  const index = salesOrders.findIndex((item) => item.id === id)
  if (index > -1) {
    salesOrders[index] = { ...salesOrders[index], ...data }
    return wrapUpdatedResponse(salesOrders[index], '编辑销售订单成功')
  }
  return wrapUpdatedResponse({ id, ...data }, '编辑销售订单成功')
}

export async function deleteSalesOrder(id: string) {
  await simulateDelay()
  const index = salesOrders.findIndex((item) => item.id === id)
  if (index > -1) salesOrders.splice(index, 1)
  return wrapSuccessResponse('删除销售订单成功')
}

export async function getQuotationList(params: { pageNum: number; pageSize: number; code?: string; customer?: string; status?: string }) {
  await simulateDelay()
  let filtered = [...quotations]
  if (params.code) filtered = searchItems(filtered, params.code, ['code'])
  if (params.customer) filtered = searchItems(filtered, params.customer, ['customer'])
  if (params.status) filtered = filtered.filter((item) => item.status === params.status)
  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function saveQuotation(data: any) {
  await simulateDelay()
  const payload = {
    id: data.id || generateId(),
    code: data.code || createCode('BJ', quotations.length),
    customer: data.customer || '',
    product: data.product || '',
    qty: data.qty ?? 0,
    price: data.price ?? 0,
    amount: data.amount ?? 0,
    valid_date: data.valid_date || '',
    status: data.status || 'draft'
  }
  const index = quotations.findIndex((item) => item.id === payload.id)
  if (index > -1) {
    quotations[index] = { ...quotations[index], ...payload }
    return wrapUpdatedResponse(quotations[index], '编辑报价单成功')
  }
  quotations.unshift(payload)
  return wrapCreatedResponse(payload, '新增报价单成功')
}

export async function deleteQuotation(id: string) {
  await simulateDelay()
  const index = quotations.findIndex((item) => item.id === id)
  if (index > -1) quotations.splice(index, 1)
  return wrapSuccessResponse('删除报价单成功')
}

export async function getOpportunityList(params: { pageNum: number; pageSize: number; keyword?: string; stage?: string }) {
  await simulateDelay()
  let filtered = [...opportunities]
  if (params.keyword) filtered = searchItems(filtered, params.keyword, ['customer', 'product', 'owner'])
  if (params.stage) filtered = filtered.filter((item) => item.stage === params.stage)
  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function saveOpportunity(data: any) {
  await simulateDelay()
  const payload = {
    id: data.id || generateId(),
    customer: data.customer || '',
    product: data.product || '',
    amount: data.amount ?? 0,
    stage: data.stage || 'initial',
    probability: data.probability ?? 0,
    owner: data.owner || '',
    close_date: data.close_date || ''
  }
  const index = opportunities.findIndex((item) => item.id === payload.id)
  if (index > -1) {
    opportunities[index] = { ...opportunities[index], ...payload }
    return wrapUpdatedResponse(opportunities[index], '编辑商机成功')
  }
  opportunities.unshift(payload)
  return wrapCreatedResponse(payload, '新增商机成功')
}

export async function deleteOpportunity(id: string) {
  await simulateDelay()
  const index = opportunities.findIndex((item) => item.id === id)
  if (index > -1) opportunities.splice(index, 1)
  return wrapSuccessResponse('删除商机成功')
}

export async function convertOpportunity(id: string) {
  await simulateDelay()
  const item = opportunities.find((row) => row.id === id)
  if (item) {
    item.stage = 'won'
    item.probability = 100
  }
  return wrapUpdatedResponse(item || { id }, '商机已转为销售订单')
}

export async function getContractList(params: { pageNum: number; pageSize: number; keyword?: string; status?: string }) {
  await simulateDelay()
  let filtered = [...contracts]
  if (params.keyword) filtered = searchItems(filtered, params.keyword, ['code', 'customer'])
  if (params.status) filtered = filtered.filter((item) => item.status === params.status)
  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function saveContract(data: any) {
  await simulateDelay()
  const payload = {
    id: data.id || generateId(),
    code: data.code || createCode('HT', contracts.length),
    customer: data.customer || '',
    amount: data.amount ?? 0,
    sign_date: data.sign_date || '',
    start_date: data.start_date || '',
    end_date: data.end_date || '',
    status: data.status || 'draft'
  }
  const index = contracts.findIndex((item) => item.id === payload.id)
  if (index > -1) {
    contracts[index] = { ...contracts[index], ...payload }
    return wrapUpdatedResponse(contracts[index], '编辑合同成功')
  }
  contracts.unshift(payload)
  return wrapCreatedResponse(payload, '新增合同成功')
}

export async function deleteContract(id: string) {
  await simulateDelay()
  const index = contracts.findIndex((item) => item.id === id)
  if (index > -1) contracts.splice(index, 1)
  return wrapSuccessResponse('删除合同成功')
}

export async function getInvoiceList(params: { pageNum: number; pageSize: number; keyword?: string; status?: string }) {
  await simulateDelay()
  let filtered = [...invoices]
  if (params.keyword) filtered = searchItems(filtered, params.keyword, ['code', 'customer', 'order_code'])
  if (params.status) filtered = filtered.filter((item) => item.status === params.status)
  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function saveInvoice(data: any) {
  await simulateDelay()
  const payload = {
    id: data.id || generateId(),
    code: data.code || createCode('FP', invoices.length),
    customer: data.customer || '',
    order_code: data.order_code || '',
    amount: data.amount ?? 0,
    tax_rate: data.tax_rate ?? 13,
    tax_amount: data.tax_amount ?? 0,
    total: data.total ?? 0,
    issue_date: data.issue_date || '',
    status: data.status || 'draft'
  }
  const index = invoices.findIndex((item) => item.id === payload.id)
  if (index > -1) {
    invoices[index] = { ...invoices[index], ...payload }
    return wrapUpdatedResponse(invoices[index], '编辑发票成功')
  }
  invoices.unshift(payload)
  return wrapCreatedResponse(payload, '新增发票成功')
}

export async function issueInvoice(id: string) {
  await simulateDelay()
  const item = invoices.find((row) => row.id === id)
  if (item) {
    item.status = 'issued'
    item.issue_date = new Date().toISOString().slice(0, 10)
  }
  return wrapUpdatedResponse(item || { id }, '发票已开具')
}

export async function getReceivableList(params: { pageNum: number; pageSize: number; customer?: string; status?: string; agingRange?: string }) {
  await simulateDelay()
  let filtered = [...receivables]
  if (params.customer) filtered = searchItems(filtered, params.customer, ['customer'])
  if (params.status === 'overdue') filtered = filtered.filter((item) => item.aging > 0)
  if (params.status === 'settled') filtered = filtered.filter((item) => item.balance === 0)
  if (params.status === 'pending') filtered = filtered.filter((item) => item.balance > 0)
  if (params.agingRange) {
    if (params.agingRange === '0') filtered = filtered.filter((item) => item.aging <= 0)
    if (params.agingRange === '1') filtered = filtered.filter((item) => item.aging >= 1 && item.aging <= 30)
    if (params.agingRange === '2') filtered = filtered.filter((item) => item.aging >= 31 && item.aging <= 60)
    if (params.agingRange === '3') filtered = filtered.filter((item) => item.aging >= 61 && item.aging <= 90)
    if (params.agingRange === '4') filtered = filtered.filter((item) => item.aging > 90)
  }
  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function createReceipt(data: any) {
  await simulateDelay()
  const next = {
    id: generateId(),
    code: createCode('YS', receivables.length),
    customer: data.customer || '',
    amount: data.amount ?? 0,
    settled: 0,
    balance: data.amount ?? 0,
    due_date: data.date || new Date().toISOString().slice(0, 10),
    aging: 0
  }
  receivables.unshift(next)
  return wrapCreatedResponse(next, '登记回款成功')
}

export async function settleReceivables(data: { items: Array<{ id: string; amount: number }> }) {
  await simulateDelay()
  data.items.forEach(({ id, amount }) => {
    const target = receivables.find((item) => item.id === id)
    if (!target || amount <= 0) return
    target.settled += amount
    target.balance = Math.max(0, target.amount - target.settled)
  })
  return wrapSuccessResponse('应收核销成功')
}
