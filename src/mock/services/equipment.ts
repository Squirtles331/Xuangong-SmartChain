import { equipmentOeeOverview } from '../modules/equipment'
import { simulateDelay } from '../shared/delay'
import { wrapDetailResponse } from '../shared/response'

function buildTrend(startMonth: number, endMonth: number) {
  const count = Math.max(1, endMonth - startMonth + 1)
  const months = Array.from({ length: count }, (_, index) => `${startMonth + index}月`)
  return {
    months,
    oee: Array.from({ length: count }, () => +(70 + Math.random() * 12).toFixed(1)),
    utilization: Array.from({ length: count }, () => +(80 + Math.random() * 10).toFixed(1)),
    performance: Array.from({ length: count }, () => +(88 + Math.random() * 8).toFixed(1)),
    quality: Array.from({ length: count }, () => +(96 + Math.random() * 4).toFixed(1))
  }
}

export async function getEquipmentOeeOverview(params?: { start_month?: string; end_month?: string }) {
  await simulateDelay()

  const startMonth = params?.start_month ? Number(params.start_month.split('-')[1]) : 1
  const endMonth = params?.end_month ? Number(params.end_month.split('-')[1]) : 6

  return wrapDetailResponse({
    cards: equipmentOeeOverview.cards,
    rankData: equipmentOeeOverview.rankData,
    trendData: buildTrend(startMonth, endMonth)
  })
}
