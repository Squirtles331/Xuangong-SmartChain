import { generateId } from '@/static/utils/id'
import { paginate, searchItems } from '@/static/utils/paginate'
import { wrapCreatedResponse, wrapDetailResponse, wrapListResponse, wrapSuccessResponse, wrapUpdatedResponse } from '@/static/utils/response'

const energyDetails = [
  { id: '1', workshop: 'Machining Workshop', type: '电', usage: 12580, unit: 'kWh', cost: 11322, period: '2026-01', rate: 0.9 },
  { id: '2', workshop: 'Machining Workshop', type: '水', usage: 856, unit: 'ton', cost: 3424, period: '2026-01', rate: 4.0 },
  { id: '3', workshop: 'Machining Workshop', type: '气', usage: 3200, unit: 'm3', cost: 9600, period: '2026-01', rate: 3.0 },
  { id: '4', workshop: 'Assembly Workshop', type: '电', usage: 8920, unit: 'kWh', cost: 8028, period: '2026-01', rate: 0.9 },
  { id: '5', workshop: 'Assembly Workshop', type: '水', usage: 420, unit: 'ton', cost: 1680, period: '2026-01', rate: 4.0 },
  { id: '6', workshop: 'Assembly Workshop', type: '气', usage: 1800, unit: 'm3', cost: 5400, period: '2026-01', rate: 3.0 },
  { id: '7', workshop: 'Heat Treatment Workshop', type: '电', usage: 15600, unit: 'kWh', cost: 14040, period: '2026-01', rate: 0.9 },
  { id: '8', workshop: 'Heat Treatment Workshop', type: '水', usage: 1200, unit: 'ton', cost: 4800, period: '2026-01', rate: 4.0 },
  { id: '9', workshop: 'Heat Treatment Workshop', type: '气', usage: 5600, unit: 'm3', cost: 16800, period: '2026-01', rate: 3.0 },
  { id: '10', workshop: 'Surface Treatment Workshop', type: '电', usage: 7100, unit: 'kWh', cost: 6390, period: '2026-01', rate: 0.9 },
  { id: '11', workshop: 'Surface Treatment Workshop', type: '水', usage: 680, unit: 'ton', cost: 2720, period: '2026-01', rate: 4.0 },
  { id: '12', workshop: 'Surface Treatment Workshop', type: '气', usage: 2400, unit: 'm3', cost: 7200, period: '2026-01', rate: 3.0 },
  { id: '13', workshop: 'Machining Workshop', type: '电', usage: 11800, unit: 'kWh', cost: 10620, period: '2026-02', rate: 0.9 },
  { id: '14', workshop: 'Assembly Workshop', type: '电', usage: 9150, unit: 'kWh', cost: 8235, period: '2026-02', rate: 0.9 },
  { id: '15', workshop: 'Heat Treatment Workshop', type: '电', usage: 14900, unit: 'kWh', cost: 13410, period: '2026-02', rate: 0.9 },
  { id: '16', workshop: 'Surface Treatment Workshop', type: '电', usage: 7350, unit: 'kWh', cost: 6615, period: '2026-02', rate: 0.9 }
]

function normalizeEnergyType(type?: string) {
  if (!type) return ''
  if (type === 'electricity' || type === '电') return '电'
  if (type === 'water' || type === '水') return '水'
  if (type === 'gas' || type === '气') return '气'
  return type
}

function defaultUnit(type: string) {
  if (type === '电') return 'kWh'
  if (type === '水') return 'ton'
  return 'm3'
}

export async function getEnergyDetailList(params: { pageNum: number; pageSize: number; keyword?: string; type?: string; period?: string }) {
  let filtered = [...energyDetails]

  if (params.keyword) filtered = searchItems(filtered, params.keyword, ['workshop', 'type', 'period'])
  if (params.type) filtered = filtered.filter((item) => item.type === normalizeEnergyType(params.type))
  if (params.period) filtered = filtered.filter((item) => item.period === params.period)

  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function saveEnergyDetail(data: any) {
  const type = normalizeEnergyType(data.type) || '电'
  const usage = Number(data.usage ?? 0)
  const rate = Number(data.rate ?? 0)
  const payload = {
    id: data.id || generateId('energy'),
    workshop: data.workshop || '',
    type,
    usage,
    unit: data.unit || defaultUnit(type),
    cost: Number(data.cost ?? (usage * rate).toFixed(2)),
    period: data.period || '',
    rate
  }

  const index = energyDetails.findIndex((item) => item.id === payload.id)

  if (index > -1) {
    energyDetails[index] = { ...energyDetails[index], ...payload }
    return wrapUpdatedResponse(energyDetails[index], 'Energy detail updated')
  }

  energyDetails.unshift(payload)
  return wrapCreatedResponse(payload, 'Energy detail created')
}

export async function deleteEnergyDetail(id: string) {
  const index = energyDetails.findIndex((item) => item.id === id)

  if (index > -1) {
    energyDetails.splice(index, 1)
  }

  return wrapSuccessResponse('Energy detail deleted')
}

export async function getEnergyOverview(range?: { start?: string; end?: string }) {
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

  return wrapDetailResponse({
    cards: [
      { title: 'Total Electricity', value: totalElectric, unit: 'kWh', trend: 5.2 },
      { title: 'Total Water', value: totalWater, unit: 'ton', trend: -3.1 },
      { title: 'Total Gas', value: totalGas, unit: 'm3', trend: 8.7 },
      { title: 'Carbon Emission', value: carbon, unit: 'tCO2', trend: 4.6 }
    ],
    trend: periods.map((period) => {
      const items = filtered.filter((item) => item.period === period)

      return {
        period,
        electricity: items.filter((item) => item.type === '电').reduce((sum, item) => sum + item.usage, 0),
        water: items.filter((item) => item.type === '水').reduce((sum, item) => sum + item.usage, 0),
        gas: items.filter((item) => item.type === '气').reduce((sum, item) => sum + item.usage, 0)
      }
    }),
    structure: [
      { name: '电', value: totalElectric },
      { name: '水', value: totalWater },
      { name: '气', value: totalGas }
    ]
  })
}

export async function getEnergyBenchmark() {
  return wrapDetailResponse({
    electric: {
      unit: 'kWh/unit',
      xLabels: ['Machining', 'Assembly', 'Heat Treatment', 'Surface Treatment'],
      actual: [12.5, 13.2, 11.8, 12.0],
      benchmark: [10.0, 9.8, 9.5, 9.2],
      advanced: [8.0, 7.8, 7.5, 7.2]
    },
    water: {
      unit: 'ton/unit',
      xLabels: ['Machining', 'Assembly', 'Heat Treatment', 'Surface Treatment'],
      actual: [3.2, 3.5, 2.9, 3.1],
      benchmark: [2.8, 2.7, 2.5, 2.4],
      advanced: [2.2, 2.1, 2.0, 1.9]
    },
    gas: {
      unit: 'm3/unit',
      xLabels: ['Machining', 'Assembly', 'Heat Treatment', 'Surface Treatment'],
      actual: [8.5, 9.0, 7.8, 8.2],
      benchmark: [7.0, 6.8, 6.5, 6.3],
      advanced: [5.5, 5.3, 5.0, 4.8]
    }
  })
}
