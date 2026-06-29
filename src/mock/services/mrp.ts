/**
 * MRP (Material Requirements Planning) Mock Service
 * MRP 运算、结果查询、建议确认
 */
import { simulateDelay } from '../shared/delay'
import { paginate } from '../shared/paginate'
import { wrapListResponse, wrapDetailResponse, wrapSuccessResponse } from '../shared/response'
import { generateId } from '../shared/id'
import { mrpPurchaseList, mrpProductionList, mrpExceptions } from '../modules/mrp'

// ==================== MRP 运算 ====================
export async function runMRP(data?: { plant_id?: string }) {
  await simulateDelay(800, 1500)
  const runId = 'MRP' + Date.now()
  return wrapDetailResponse({
    run_id: runId,
    plant_id: data?.plant_id || 'PLANT-001',
    started_at: new Date().toISOString(),
    status: 'running'
  })
}

// ==================== MRP 结果查询 ====================
export async function getMRPResults(runId: string, params: { type: 'purchase' | 'production' | 'exception'; page: number; page_size: number }) {
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

  const result = paginate(sourceData, params.page, params.page_size)
  return wrapListResponse(result.items, result.total, result.page, result.page_size)
}

// ==================== MRP 建议确认 ====================
export async function confirmMRPSuggestions(runId: string, ids: string[]) {
  await simulateDelay()
  return wrapSuccessResponse(`已确认 ${ids.length} 条 MRP 建议，Run ID: ${runId}`)
}

// ==================== MRP 历史记录 ====================
const mrpHistoryStore: any[] = [
  {
    id: 'MRP1704067200000',
    plant_id: 'PLANT-001',
    started_at: '2025-01-01 08:00:00',
    finished_at: '2025-01-01 08:02:30',
    status: 'completed',
    purchase_count: 5,
    production_count: 4,
    exception_count: 3,
    triggered_by: '系统自动'
  },
  {
    id: 'MRP1704153600000',
    plant_id: 'PLANT-001',
    started_at: '2025-01-02 08:00:00',
    finished_at: '2025-01-02 08:03:15',
    status: 'completed',
    purchase_count: 3,
    production_count: 2,
    exception_count: 1,
    triggered_by: '张三'
  },
  {
    id: 'MRP1704240000000',
    plant_id: 'PLANT-002',
    started_at: '2025-01-03 08:00:00',
    finished_at: '2025-01-03 08:01:50',
    status: 'completed',
    purchase_count: 6,
    production_count: 5,
    exception_count: 4,
    triggered_by: '系统自动'
  }
]

export async function getMRPHistory(params: { page: number; page_size: number; plant_id?: string; status?: string }) {
  await simulateDelay()
  let filtered = [...mrpHistoryStore]
  if (params.plant_id) filtered = filtered.filter((r) => r.plant_id === params.plant_id)
  if (params.status) filtered = filtered.filter((r) => r.status === params.status)
  const result = paginate(filtered, params.page, params.page_size)
  return wrapListResponse(result.items, result.total, result.page, result.page_size)
}

// ==================== MRP 预测（骨架） ====================
export async function getMRPForecast(params: { page: number; page_size: number; period?: string }) {
  await simulateDelay()
  return wrapListResponse([], 0, params.page, params.page_size)
}

// ==================== 多工厂 MRP（骨架） ====================
export async function getMultiPlantMRP(params: { page: number; page_size: number; plant_ids?: string[] }) {
  await simulateDelay()
  return wrapListResponse([], 0, params.page, params.page_size)
}

// ==================== 净变更 MRP（骨架） ====================
export async function getNetChangeMRP(params: { page: number; page_size: number; change_type?: string }) {
  await simulateDelay()
  return wrapListResponse([], 0, params.page, params.page_size)
}
