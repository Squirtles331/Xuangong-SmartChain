import { ecnOrders } from '../modules/bom'
import { simulateDelay } from '../shared/delay'
import { generateId } from '../shared/id'
import { paginate, searchItems } from '../shared/paginate'
import { wrapDetailResponse, wrapListResponse, wrapSuccessResponse } from '../shared/response'

export async function getECNList(params: { pageNum: number; pageSize: number; code?: string; material?: string; status?: string }) {
  await simulateDelay()

  let filtered = [...ecnOrders]

  if (params.code) {
    filtered = searchItems(filtered, params.code, ['code'])
  }

  if (params.material) {
    filtered = searchItems(filtered, params.material, ['material'])
  }

  if (params.status) {
    filtered = filtered.filter((item: any) => item.status === params.status)
  }

  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function createECN(data: any) {
  await simulateDelay()
  const newECN = { id: generateId(), createdAt: new Date().toISOString().slice(0, 19).replace('T', ' '), ...data }
  ecnOrders.unshift(newECN)
  return wrapSuccessResponse('ECN变更单创建成功')
}

export async function updateECN(id: string, data: any) {
  await simulateDelay()
  const index = ecnOrders.findIndex((item: any) => String(item.id) === id)

  if (index > -1) {
    Object.assign(ecnOrders[index], data)
  }

  return wrapSuccessResponse('ECN变更单更新成功')
}

export async function deleteECN(id: string) {
  await simulateDelay()
  const index = ecnOrders.findIndex((item: any) => String(item.id) === id)

  if (index > -1) {
    ecnOrders.splice(index, 1)
  }

  return wrapSuccessResponse('ECN变更单删除成功')
}
