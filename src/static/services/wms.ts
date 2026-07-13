import { pickingOrders as pickingOrdersSeed } from '@/mock/modules/wms'
import { paginate, searchItems } from '@/mock/shared/paginate'
import { wrapListResponse } from '@/mock/shared/response'

const pickingOrders = cloneSeed(pickingOrdersSeed) as Array<Record<string, any>>

function cloneSeed<T>(seed: T): T {
  if (typeof structuredClone === 'function') {
    return structuredClone(seed)
  }

  return JSON.parse(JSON.stringify(seed)) as T
}

export async function getPickingList(params: { pageNum: number; pageSize: number; code?: string; warehouse?: string; status?: string }) {
  let filtered = [...pickingOrders]

  if (params.code) {
    filtered = searchItems(filtered, params.code, ['wo_code'])
  }

  if (params.warehouse) {
    filtered = filtered.filter((item) => item.warehouse === params.warehouse)
  }

  if (params.status) {
    filtered = filtered.filter((item) => item.status === params.status)
  }

  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}
