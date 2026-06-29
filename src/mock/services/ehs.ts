import { ehsEmergencyPlans, ehsHazards, ehsPermits, ehsTrainingRecords } from '../modules/ehs'
import { simulateDelay } from '../shared/delay'
import { paginate, searchItems } from '../shared/paginate'
import { wrapListResponse } from '../shared/response'

export async function getEhsHazardList(params: { page: number; page_size: number; keyword?: string; level?: string; status?: string }) {
  await simulateDelay()
  let filtered = [...ehsHazards]
  if (params.keyword) filtered = searchItems(filtered, params.keyword, ['desc', 'location', 'code'])
  if (params.level) filtered = filtered.filter((item: any) => item.level === params.level)
  if (params.status) filtered = filtered.filter((item: any) => item.status === params.status)
  const result = paginate(filtered, params.page, params.page_size)
  return wrapListResponse(result.items, result.total, result.page, result.page_size)
}

export async function getEhsEmergencyList(params: { page: number; page_size: number; name?: string; type?: string }) {
  await simulateDelay()
  let filtered = [...ehsEmergencyPlans]
  if (params.name) filtered = searchItems(filtered, params.name, ['name'])
  if (params.type) filtered = filtered.filter((item: any) => item.type === params.type)
  const result = paginate(filtered, params.page, params.page_size)
  return wrapListResponse(result.items, result.total, result.page, result.page_size)
}

export async function getEhsPermitList(params: { page: number; page_size: number; keyword?: string; type?: string; status?: string }) {
  await simulateDelay()
  let filtered = [...ehsPermits]
  if (params.keyword) filtered = searchItems(filtered, params.keyword, ['location', 'code'])
  if (params.type) filtered = filtered.filter((item: any) => item.type === params.type)
  if (params.status) filtered = filtered.filter((item: any) => item.status === params.status)
  const result = paginate(filtered, params.page, params.page_size)
  return wrapListResponse(result.items, result.total, result.page, result.page_size)
}

export async function getEhsTrainingList(params: { page: number; page_size: number; title?: string; status?: string }) {
  await simulateDelay()
  let filtered = [...ehsTrainingRecords]
  if (params.title) filtered = searchItems(filtered, params.title, ['title'])
  if (params.status) filtered = filtered.filter((item: any) => item.status === params.status)
  const result = paginate(filtered, params.page, params.page_size)
  return wrapListResponse(result.items, result.total, result.page, result.page_size)
}
