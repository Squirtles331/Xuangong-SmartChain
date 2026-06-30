import { energyDetails } from '../modules/energy'
import { simulateDelay } from '../shared/delay'
import { generateId } from '../shared/id'
import { paginate, searchItems } from '../shared/paginate'
import { wrapCreatedResponse, wrapDetailResponse, wrapListResponse, wrapSuccessResponse, wrapUpdatedResponse } from '../shared/response'

function matchType(type?: string) {
  if (!type) return ''
  if (type === 'electricity') return '电'
  if (type === 'water') return '水'
  if (type === 'gas') return '气'
  return type
}

export async function getEnergyDetailList(params: { pageNum: number; pageSize: number; keyword?: string; type?: string; period?: string }) {
  await simulateDelay()
  let filtered = [...energyDetails]

  if (params.keyword) filtered = searchItems(filtered, params.keyword, ['workshop', 'type', 'period'])
  if (params.type) filtered = filtered.filter((item) => item.type === matchType(params.type))
  if (params.period) filtered = filtered.filter((item) => item.period === params.period)

  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function saveEnergyDetail(data: any) {
  await simulateDelay()
  const payload = {
    id: data.id || generateId(),
    workshop: data.workshop || '',
    type: matchType(data.type) || '电',
    usage: data.usage ?? 0,
    unit: data.unit || 'kWh',
    cost: data.cost ?? Number((Number(data.usage || 0) * Number(data.rate || 0)).toFixed(2)),
    period: data.period || '',
    rate: data.rate ?? 0
  }

  const index = energyDetails.findIndex((item) => item.id === payload.id)
  if (index > -1) {
    energyDetails[index] = { ...energyDetails[index], ...payload }
    return wrapUpdatedResponse(energyDetails[index], '编辑能耗明细成功')
  }

  energyDetails.unshift(payload)
  return wrapCreatedResponse(payload, '新增能耗明细成功')
}

export async function deleteEnergyDetail(id: string) {
  await simulateDelay()
  const index = energyDetails.findIndex((item) => item.id === id)
  if (index > -1) energyDetails.splice(index, 1)
  return wrapSuccessResponse('删除能耗明细成功')
}

export async function getEnergyOverview(range?: { start?: string; end?: string }) {
  await simulateDelay()
  const filtered = energyDetails.filter((item) => {
    if (range?.start && item.period < range.start) return false
    if (range?.end && item.period > range.end) return false
    return true
  })

  const totalElectric = filtered.filter((item) => item.type === '电').reduce((sum, item) => sum + item.usage, 0)
  const totalWater = filtered.filter((item) => item.type === '水').reduce((sum, item) => sum + item.usage, 0)
  const totalGas = filtered.filter((item) => item.type === '气').reduce((sum, item) => sum + item.usage, 0)
  const carbon = Number((totalElectric * 0.000785 + totalGas * 0.002).toFixed(2))

  const periods = [...new Set(filtered.map((item) => item.period))].sort()
  const trend = periods.map((period) => {
    const items = filtered.filter((item) => item.period === period)
    return {
      period,
      electricity: items.filter((item) => item.type === '电').reduce((sum, item) => sum + item.usage, 0),
      water: items.filter((item) => item.type === '水').reduce((sum, item) => sum + item.usage, 0),
      gas: items.filter((item) => item.type === '气').reduce((sum, item) => sum + item.usage, 0)
    }
  })

  const structure = [
    { name: '电', value: totalElectric },
    { name: '水', value: totalWater },
    { name: '气', value: totalGas }
  ]

  return wrapDetailResponse({
    cards: [
      { title: '累计用电', value: totalElectric, unit: 'kWh', trend: 5.2 },
      { title: '累计用水', value: totalWater, unit: '吨', trend: -3.1 },
      { title: '累计用气', value: totalGas, unit: 'm3', trend: 8.7 },
      { title: '碳排放', value: carbon, unit: '吨CO2', trend: 4.6 }
    ],
    trend,
    structure
  })
}

export async function getEnergyBenchmark() {
  await simulateDelay()
  return wrapDetailResponse({
    electric: {
      unit: 'kWh/件',
      xLabels: ['机加工车间', '装配车间', '热处理车间', '表面处理车间'],
      actual: [12.5, 13.2, 11.8, 12.0],
      benchmark: [10.0, 9.8, 9.5, 9.2],
      advanced: [8.0, 7.8, 7.5, 7.2]
    },
    water: {
      unit: '吨/件',
      xLabels: ['机加工车间', '装配车间', '热处理车间', '表面处理车间'],
      actual: [3.2, 3.5, 2.9, 3.1],
      benchmark: [2.8, 2.7, 2.5, 2.4],
      advanced: [2.2, 2.1, 2.0, 1.9]
    },
    gas: {
      unit: 'm3/件',
      xLabels: ['机加工车间', '装配车间', '热处理车间', '表面处理车间'],
      actual: [8.5, 9.0, 7.8, 8.2],
      benchmark: [7.0, 6.8, 6.5, 6.3],
      advanced: [5.5, 5.3, 5.0, 4.8]
    }
  })
}
