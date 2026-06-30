import { ehsEmergencyPlans, ehsHazards, ehsPermits, ehsTrainingRecords } from '../modules/ehs'
import { simulateDelay } from '../shared/delay'
import { paginate, searchItems } from '../shared/paginate'
import { wrapListResponse } from '../shared/response'

export async function getEhsHazardList(params: { pageNum: number; pageSize: number; keyword?: string; level?: string; status?: string }) {
  await simulateDelay()
  let filtered = [...ehsHazards]
  if (params.keyword) filtered = searchItems(filtered, params.keyword, ['desc', 'location', 'code'])
  if (params.level) filtered = filtered.filter((item: any) => item.level === params.level)
  if (params.status) filtered = filtered.filter((item: any) => item.status === params.status)
  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function getEhsEmergencyList(params: { pageNum: number; pageSize: number; name?: string; type?: string }) {
  await simulateDelay()
  let filtered = [...ehsEmergencyPlans]
  if (params.name) filtered = searchItems(filtered, params.name, ['name'])
  if (params.type) filtered = filtered.filter((item: any) => item.type === params.type)
  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function getEhsPermitList(params: { pageNum: number; pageSize: number; keyword?: string; type?: string; status?: string }) {
  await simulateDelay()
  let filtered = [...ehsPermits]
  if (params.keyword) filtered = searchItems(filtered, params.keyword, ['location', 'code'])
  if (params.type) filtered = filtered.filter((item: any) => item.type === params.type)
  if (params.status) filtered = filtered.filter((item: any) => item.status === params.status)
  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function getEhsTrainingList(params: { pageNum: number; pageSize: number; title?: string; status?: string }) {
  await simulateDelay()
  let filtered = [...ehsTrainingRecords]
  if (params.title) filtered = searchItems(filtered, params.title, ['title'])
  if (params.status) filtered = filtered.filter((item: any) => item.status === params.status)
  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}
