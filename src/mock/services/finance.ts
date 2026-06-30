import {
  financeCostDetails,
  financeCreditAccounts,
  financeDebitAccounts,
  financeLedgerEntries,
  financePayables,
  financeReconciliation,
  financeReportSummary
} from '../modules/finance'
import { simulateDelay } from '../shared/delay'
import { generateId } from '../shared/id'
import { paginate, searchItems } from '../shared/paginate'
import { wrapCreatedResponse, wrapDetailResponse, wrapListResponse, wrapSuccessResponse, wrapUpdatedResponse } from '../shared/response'

type PayableStatus = 'open' | 'paid' | 'partial'

export async function getFinancePayableList(params: { pageNum: number; pageSize: number; code?: string; supplier?: string; status?: PayableStatus }) {
  await simulateDelay()

  let filtered = [...financePayables]

  if (params.code) filtered = searchItems(filtered, params.code, ['code'])
  if (params.supplier) filtered = searchItems(filtered, params.supplier, ['supplier'])
  if (params.status) filtered = filtered.filter((item) => item.status === params.status)

  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function createFinancePayable(data: any) {
  await simulateDelay()

  const next = {
    id: generateId(),
    code: `AP${new Date().toISOString().slice(0, 10).replace(/-/g, '')}${String(financePayables.length + 1).padStart(3, '0')}`,
    balance: Number(data.amount || 0) - Number(data.paid || 0),
    ...data
  }

  financePayables.unshift(next)
  return wrapCreatedResponse(next, '新增应付单成功')
}

export async function updateFinancePayable(id: string, data: any) {
  await simulateDelay()

  const index = financePayables.findIndex((item) => item.id === id)
  if (index > -1) {
    const next = {
      ...financePayables[index],
      ...data
    }
    next.balance = Number(next.amount || 0) - Number(next.paid || 0)
    financePayables[index] = next
    return wrapUpdatedResponse(next, '编辑应付单成功')
  }

  return wrapUpdatedResponse({ id, ...data }, '编辑应付单成功')
}

export async function deleteFinancePayable(id: string) {
  await simulateDelay()

  const index = financePayables.findIndex((item) => item.id === id)
  if (index > -1) financePayables.splice(index, 1)

  return wrapSuccessResponse('删除应付单成功')
}

export async function getFinanceCostList(params: { pageNum: number; pageSize: number; product?: string; period?: string }) {
  await simulateDelay()

  let filtered = [...financeCostDetails]

  if (params.product) filtered = searchItems(filtered, params.product, ['product'])
  if (params.period) filtered = filtered.filter((item) => item.period === params.period)

  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function getFinanceLedgerOverview() {
  await simulateDelay()

  const totalDebit = financeDebitAccounts.reduce((sum, item) => sum + item.amount, 0)
  const totalCredit = financeCreditAccounts.reduce((sum, item) => sum + item.amount, 0)
  const monthlyIncome = financeLedgerEntries.reduce((sum, item) => sum + item.credit, 0)
  const monthlyProfit = financeReportSummary.currentMonth.profit

  return wrapDetailResponse({
    cards: [
      { title: '本期借方合计', value: totalDebit },
      { title: '本期贷方合计', value: totalCredit },
      { title: '本月收入', value: monthlyIncome },
      { title: '本月利润', value: monthlyProfit }
    ],
    debitData: financeDebitAccounts,
    creditData: financeCreditAccounts,
    ledgerData: financeLedgerEntries,
    recData: financeReconciliation
  })
}

export async function getFinanceReportSummary() {
  await simulateDelay()
  return wrapDetailResponse(financeReportSummary)
}
