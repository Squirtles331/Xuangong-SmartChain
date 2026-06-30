import { ecnOrders } from '../modules/ecn'
import { simulateDelay } from '../shared/delay'
import { generateId } from '../shared/id'
import { paginate, searchItems } from '../shared/paginate'
import { wrapCreatedResponse, wrapListResponse, wrapSuccessResponse, wrapUpdatedResponse } from '../shared/response'

export async function getECNList(params: { pageNum: number; pageSize: number; code?: string; material?: string; status?: string }) {
  await simulateDelay()

  let filtered = [...ecnOrders]

  if (params.code) filtered = searchItems(filtered, params.code, ['code'])
  if (params.material) filtered = searchItems(filtered, params.material, ['material'])
  if (params.status) filtered = filtered.filter((item) => item.status === params.status)

  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function createECN(data: any) {
  await simulateDelay()
  const next = {
    id: generateId(),
    createdAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
    ...data
  }
  ecnOrders.unshift(next)
  return wrapCreatedResponse(next, '新增 ECN 变更单成功')
}

export async function updateECN(id: string, data: any) {
  await simulateDelay()
  const index = ecnOrders.findIndex((item) => String(item.id) === id)

  if (index > -1) {
    ecnOrders[index] = { ...ecnOrders[index], ...data }
    return wrapUpdatedResponse(ecnOrders[index], '编辑 ECN 变更单成功')
  }

  return wrapUpdatedResponse({ id, ...data }, '编辑 ECN 变更单成功')
}

export async function deleteECN(id: string) {
  await simulateDelay()
  const index = ecnOrders.findIndex((item) => String(item.id) === id)

  if (index > -1) ecnOrders.splice(index, 1)

  return wrapSuccessResponse('删除 ECN 变更单成功')
}
