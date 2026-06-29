import { costDetails, creditData, debitData, ledgerData, recData } from '../modules/finance'
import { simulateDelay } from '../shared/delay'
import { wrapDetailResponse } from '../shared/response'

export async function getCostDetails() {
  await simulateDelay()
  return wrapDetailResponse(costDetails)
}

export async function getFinanceLedgerOverview() {
  await simulateDelay()

  const totalDebit = debitData.reduce((sum, item: any) => sum + (item.amount || 0), 0)
  const totalCredit = creditData.reduce((sum, item: any) => sum + (item.amount || 0), 0)
  const monthIncome = ledgerData.reduce((sum, item: any) => sum + (item.credit || 0), 0)
  const monthProfit = monthIncome - costDetails.reduce((sum, item: any) => sum + (item.overhead || 0), 0)

  return wrapDetailResponse({
    cards: [
      { title: 'Total Debit', value: totalDebit },
      { title: 'Total Credit', value: totalCredit },
      { title: 'Monthly Income', value: monthIncome },
      { title: 'Monthly Profit', value: monthProfit }
    ],
    debitData,
    creditData,
    ledgerData,
    recData
  })
}
