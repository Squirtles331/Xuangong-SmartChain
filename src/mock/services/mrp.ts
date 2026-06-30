import { mrpExceptions, mrpProductionList, mrpPurchaseList, multiPlantCapacity, multiPlantResults, netChangeAffected } from '../modules/mrp'
import { simulateDelay } from '../shared/delay'
import { paginate } from '../shared/paginate'
import { wrapDetailResponse, wrapListResponse, wrapSuccessResponse } from '../shared/response'

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

  let sourceData: any[]

  switch (params.type) {
    case 'purchase':
      sourceData = mrpPurchaseList
      break
    case 'production':
      sourceData = mrpProductionList
      break
    case 'exception':
      sourceData = mrpExceptions
      break
    default:
      sourceData = []
  }

  const result = paginate(sourceData, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function confirmMRPSuggestions(runId: string, ids: string[]) {
  await simulateDelay()
  return wrapSuccessResponse(`Confirmed ${ids.length} suggestions for run ${runId}`)
}

const mrpHistoryStore: any[] = [
  {
    id: 'MRP1704067200000',
    plantId: 'PLANT-001',
    startedAt: '2025-01-01 08:00:00',
    finishedAt: '2025-01-01 08:02:30',
    status: 'completed',
    purchaseCount: 5,
    productionCount: 4,
    exceptionCount: 3,
    triggeredBy: 'system'
  },
  {
    id: 'MRP1704153600000',
    plantId: 'PLANT-001',
    startedAt: '2025-01-02 08:00:00',
    finishedAt: '2025-01-02 08:03:15',
    status: 'completed',
    purchaseCount: 3,
    productionCount: 2,
    exceptionCount: 1,
    triggeredBy: 'user'
  }
]

export async function getMRPHistory(params: { pageNum: number; pageSize: number; plantId?: string; status?: string }) {
  await simulateDelay()

  let filtered = [...mrpHistoryStore]

  if (params.plantId) {
    filtered = filtered.filter((item) => item.plantId === params.plantId)
  }

  if (params.status) {
    filtered = filtered.filter((item) => item.status === params.status)
  }

  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function getMRPForecast(params: { pageNum: number; pageSize: number; period?: string }) {
  await simulateDelay()
  return wrapListResponse([], 0, params.pageNum, params.pageSize)
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
  const events = params.changeType ? mrpExceptions.filter((item: any) => item.type === params.changeType) : mrpExceptions

  return wrapDetailResponse({
    events: paginate(events, params.pageNum, params.pageSize).list.map((item: any, index: number) => ({
      id: item.id,
      type: item.type,
      detail: item.detail,
      time: `2025-01-${String(10 + index).padStart(2, '0')} 10:00:00`
    })),
    affected: netChangeAffected
  })
}
