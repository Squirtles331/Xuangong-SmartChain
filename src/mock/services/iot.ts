import { iotAutoReportRules, iotConfigs, iotHistoryLogs } from '../modules/iot'
import { simulateDelay } from '../shared/delay'
import { paginate, searchItems } from '../shared/paginate'
import { wrapListResponse } from '../shared/response'

export async function getIoTConfigList(params: { pageNum: number; pageSize: number; keyword?: string; protocol?: string; status?: string }) {
  await simulateDelay()
  let filtered = [...iotConfigs]
  if (params.keyword) filtered = searchItems(filtered, params.keyword, ['name', 'address', 'protocol'])
  if (params.protocol) filtered = filtered.filter((item: any) => item.protocol === params.protocol)
  if (params.status) filtered = filtered.filter((item: any) => item.status === params.status)
  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function getIoTAutoReportList(params: { pageNum: number; pageSize: number; equipment?: string; status?: string }) {
  await simulateDelay()
  let filtered = [...iotAutoReportRules]
  if (params.equipment) filtered = searchItems(filtered, params.equipment, ['equipment'])
  if (params.status) filtered = filtered.filter((item: any) => item.status === params.status)
  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function getIoTDeviceHistory(params: { pageNum: number; pageSize: number; device?: string }) {
  await simulateDelay()
  const filtered = [...iotHistoryLogs]
  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}
