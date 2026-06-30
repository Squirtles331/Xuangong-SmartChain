import {
  mrpExceptions,
  mrpForecastList,
  mrpProductionList,
  mrpPurchaseList,
  multiPlantCapacity,
  multiPlantResults,
  netChangeAffected
} from '../modules/mrp'
import { simulateDelay } from '../shared/delay'
import { paginate, searchItems } from '../shared/paginate'
import { wrapCreatedResponse, wrapDetailResponse, wrapListResponse, wrapSuccessResponse, wrapUpdatedResponse } from '../shared/response'
import { generateId } from '../shared/id'

export async function runMRP(data?: { plantId?: string }) {
  await simulateDelay(800, 1500)
  const runId = `MRP${Date.now()}`

  return wrapDetailResponse({
    runId,
    plantId: data?.plantId || 'PLANT-001',
    startedAt: new Date().toISOString(),
    status: 'running'
  })
}

export async function getMRPResults(runId: string, params: { type: 'purchase' | 'production' | 'exception'; pageNum: number; pageSize: number }) {
  await simulateDelay()

  let sourceData: any[] = []
  if (params.type === 'purchase') sourceData = mrpPurchaseList
  if (params.type === 'production') sourceData = mrpProductionList
  if (params.type === 'exception') sourceData = mrpExceptions

  const result = paginate(sourceData, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function confirmMRPSuggestions(runId: string, ids: string[]) {
  await simulateDelay()
  return wrapSuccessResponse(`已确认 ${ids.length} 条建议，运算批次 ${runId}`)
}

const mrpHistoryStore: any[] = [
  {
    id: 'MRP202606300001',
    run_time: '2026-06-30 08:00:00',
    operator: '系统',
    scope: '一号工厂',
    date_range: '2026-07-01 ~ 2026-07-31',
    include_safety_stock: true,
    include_in_transit: true,
    lead_time_mode: '标准',
    strategy: '全量重算',
    orders: 12,
    purchase_suggestions: 5,
    transfer_suggestions: 2,
    production_suggestions: 4,
    suggestions: 11,
    status: 'completed'
  },
  {
    id: 'MRP202606290001',
    run_time: '2026-06-29 08:10:00',
    operator: '计划员',
    scope: '一号工厂',
    date_range: '2026-07-01 ~ 2026-07-31',
    include_safety_stock: true,
    include_in_transit: false,
    lead_time_mode: '标准',
    strategy: '净变更',
    orders: 9,
    purchase_suggestions: 3,
    transfer_suggestions: 1,
    production_suggestions: 2,
    suggestions: 6,
    status: 'completed'
  }
]

export async function getMRPHistory(params: { pageNum: number; pageSize: number; plantId?: string; status?: string }) {
  await simulateDelay()

  let filtered = [...mrpHistoryStore]
  if (params.plantId) filtered = filtered.filter((item) => item.scope === params.plantId)
  if (params.status) filtered = filtered.filter((item) => item.status === params.status)

  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function getMRPForecast(params: { pageNum: number; pageSize: number; keyword?: string; type?: string }) {
  await simulateDelay()

  let filtered = [...mrpForecastList]
  if (params.keyword) filtered = searchItems(filtered, params.keyword, ['material_code', 'material_name'])
  if (params.type) filtered = filtered.filter((item) => item.type === params.type)

  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function createMRPForecast(data: any) {
  await simulateDelay()
  const next = { id: generateId(), ...data }
  mrpForecastList.unshift(next)
  return wrapCreatedResponse(next, '新增预测需求成功')
}

export async function updateMRPForecast(id: string, data: any) {
  await simulateDelay()
  const index = mrpForecastList.findIndex((item) => item.id === id)
  if (index > -1) {
    mrpForecastList[index] = { ...mrpForecastList[index], ...data }
    return wrapUpdatedResponse(mrpForecastList[index], '编辑预测需求成功')
  }
  return wrapUpdatedResponse({ id, ...data }, '编辑预测需求成功')
}

export async function deleteMRPForecast(id: string) {
  await simulateDelay()
  const index = mrpForecastList.findIndex((item) => item.id === id)
  if (index > -1) mrpForecastList.splice(index, 1)
  return wrapSuccessResponse('删除预测需求成功')
}

export async function getMultiPlantMRP(params: { pageNum: number; pageSize: number; plantIds?: string[] }) {
  await simulateDelay()

  const plantIds = params.plantIds || []
  const capacity = plantIds.length > 0 ? multiPlantCapacity.filter((item) => plantIds.includes(item.plant)) : multiPlantCapacity
  const results =
    plantIds.length > 0
      ? multiPlantResults.filter((item) => plantIds.includes(item.from_plant) || plantIds.includes(item.to_plant))
      : multiPlantResults

  return wrapDetailResponse({
    plantCapacity: capacity,
    results: paginate(results, params.pageNum, params.pageSize).list
  })
}

export async function getNetChangeMRP(params: { pageNum: number; pageSize: number; changeType?: string }) {
  await simulateDelay()
  const events = params.changeType ? mrpExceptions.filter((item) => item.type === params.changeType) : mrpExceptions

  return wrapDetailResponse({
    events: paginate(events, params.pageNum, params.pageSize).list.map((item, index) => ({
      id: item.id,
      type: item.type,
      detail: item.detail,
      time: `2026-06-${String(20 + index).padStart(2, '0')} 10:00:00`
    })),
    affected: netChangeAffected
  })
}
