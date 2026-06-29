import { iotAutoReportRules, iotConfigs, iotHistoryLogs } from '../modules/iot'
import { simulateDelay } from '../shared/delay'
import { paginate, searchItems } from '../shared/paginate'
import { wrapListResponse } from '../shared/response'

export async function getIoTConfigList(params: { page: number; page_size: number; keyword?: string; protocol?: string; status?: string }) {
  await simulateDelay()
  let filtered = [...iotConfigs]
  if (params.keyword) filtered = searchItems(filtered, params.keyword, ['name', 'address', 'protocol'])
  if (params.protocol) filtered = filtered.filter((item: any) => item.protocol === params.protocol)
  if (params.status) filtered = filtered.filter((item: any) => item.status === params.status)
  const result = paginate(filtered, params.page, params.page_size)
  return wrapListResponse(result.items, result.total, result.page, result.page_size)
}

export async function getIoTAutoReportList(params: { page: number; page_size: number; equipment?: string; status?: string }) {
  await simulateDelay()
  let filtered = [...iotAutoReportRules]
  if (params.equipment) filtered = searchItems(filtered, params.equipment, ['equipment'])
  if (params.status) filtered = filtered.filter((item: any) => item.status === params.status)
  const result = paginate(filtered, params.page, params.page_size)
  return wrapListResponse(result.items, result.total, result.page, result.page_size)
}

export async function getIoTDeviceHistory(params: { page: number; page_size: number; device?: string }) {
  await simulateDelay()
  const filtered = [...iotHistoryLogs]
  const result = paginate(filtered, params.page, params.page_size)
  return wrapListResponse(result.items, result.total, result.page, result.page_size)
}
