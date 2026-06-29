/**
 * ECN 变更单 Mock Service
 * 模拟 ECN 变更单的 CRUD 操作
 */
import { simulateDelay } from '../shared/delay'
import { paginate, searchItems } from '../shared/paginate'
import { wrapListResponse, wrapDetailResponse, wrapSuccessResponse } from '../shared/response'
import { generateId } from '../shared/id'
import { ecnOrders } from '../modules/bom'

// ==================== ECN 变更单 ====================
export async function getECNList(params: {
  page: number
  page_size: number
  code?: string
  material?: string
  status?: string
}) {
  await simulateDelay()
  let filtered = [...ecnOrders]
  if (params.code) filtered = searchItems(filtered, params.code, ['code'])
  if (params.material) filtered = searchItems(filtered, params.material, ['material'])
  if (params.status) filtered = filtered.filter((e: any) => e.status === params.status)
  const result = paginate(filtered, params.page, params.page_size)
  return wrapListResponse(result.items, result.total, result.page, result.page_size)
}

export async function createECN(data: any) {
  await simulateDelay()
  const newECN = { id: generateId(), created_at: new Date().toISOString().slice(0, 19), ...data }
  ecnOrders.unshift(newECN)
  return wrapSuccessResponse('ECN 变更单创建成功')
}

export async function updateECN(id: string, data: any) {
  await simulateDelay()
  const idx = ecnOrders.findIndex((e: any) => String(e.id) === id)
  if (idx > -1) Object.assign(ecnOrders[idx], data)
  return wrapSuccessResponse('ECN 变更单更新成功')
}

export async function deleteECN(id: string) {
  await simulateDelay()
  const idx = ecnOrders.findIndex((e: any) => String(e.id) === id)
  if (idx > -1) ecnOrders.splice(idx, 1)
  return wrapSuccessResponse('ECN 变更单删除成功')
}
