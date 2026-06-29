/**
 * 工艺路线 Mock Service
 * 模拟工艺路线操作的 CRUD 操作
 */
import { simulateDelay } from '../shared/delay'
import { paginate, searchItems } from '../shared/paginate'
import { wrapListResponse, wrapDetailResponse, wrapSuccessResponse } from '../shared/response'
import { generateId } from '../shared/id'
import { routingOperations } from '../modules/bom'

// ==================== 工艺路线 ====================
export async function getRoutingList(params: { page: number; page_size: number; material_code?: string }) {
  await simulateDelay()
  let filtered = [...routingOperations]
  if (params.material_code) filtered = searchItems(filtered, params.material_code, ['work_center'])
  const result = paginate(filtered, params.page, params.page_size)
  return wrapListResponse(result.items, result.total, result.page, result.page_size)
}

export async function saveRouting(data: any) {
  await simulateDelay()
  const idx = routingOperations.findIndex((r: any) => String(r.id) === String(data.id))
  if (idx > -1) {
    Object.assign(routingOperations[idx], data)
    return wrapSuccessResponse('工艺路线更新成功')
  }
  const newRouting = { id: generateId(), ...data }
  routingOperations.push(newRouting)
  return wrapSuccessResponse('工艺路线创建成功')
}

export async function deleteRouting(id: string) {
  await simulateDelay()
  const idx = routingOperations.findIndex((r: any) => String(r.id) === id)
  if (idx > -1) routingOperations.splice(idx, 1)
  return wrapSuccessResponse('工艺路线删除成功')
}

export async function getRoutingDetail(id: string) {
  await simulateDelay()
  const item = routingOperations.find((r: any) => String(r.id) === id) || null
  return wrapDetailResponse(item)
}
