import { iotAutoReportRules, iotConfigs, iotHistoryLogs } from '../modules/iot'
import { simulateDelay } from '../shared/delay'
import { generateId } from '../shared/id'
import { paginate, searchItems } from '../shared/paginate'
import { wrapListResponse, wrapSuccessResponse } from '../shared/response'

export async function getIoTConfigList(params: { pageNum: number; pageSize: number; keyword?: string; protocol?: string; status?: string }) {
  await simulateDelay()
  let filtered = [...iotConfigs]
  if (params.keyword) filtered = searchItems(filtered, params.keyword, ['name', 'address', 'protocol'])
  if (params.protocol) filtered = filtered.filter((item: any) => item.protocol === params.protocol)
  if (params.status) filtered = filtered.filter((item: any) => item.status === params.status)
  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function createIoTConfig(data: any) {
  await simulateDelay()
  ;(iotConfigs as any[]).unshift({ id: generateId(), ...data })
  return wrapSuccessResponse('连接配置创建成功')
}

export async function updateIoTConfig(id: string, data: any) {
  await simulateDelay()
  const index = (iotConfigs as any[]).findIndex((item: any) => String(item.id) === id)
  if (index > -1) Object.assign((iotConfigs as any[])[index], data)
  return wrapSuccessResponse('连接配置更新成功')
}

export async function deleteIoTConfig(id: string) {
  await simulateDelay()
  const index = (iotConfigs as any[]).findIndex((item: any) => String(item.id) === id)
  if (index > -1) (iotConfigs as any[]).splice(index, 1)
  return wrapSuccessResponse('连接配置删除成功')
}

export async function getIoTAutoReportList(params: { pageNum: number; pageSize: number; equipment?: string; status?: string }) {
  await simulateDelay()
  let filtered = [...iotAutoReportRules]
  if (params.equipment) filtered = searchItems(filtered, params.equipment, ['equipment'])
  if (params.status) filtered = filtered.filter((item: any) => item.status === params.status)
  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function createIoTAutoReportRule(data: any) {
  await simulateDelay()
  ;(iotAutoReportRules as any[]).unshift({ id: generateId(), ...data })
  return wrapSuccessResponse('自动报工规则创建成功')
}

export async function updateIoTAutoReportRule(id: string, data: any) {
  await simulateDelay()
  const index = (iotAutoReportRules as any[]).findIndex((item: any) => String(item.id) === id)
  if (index > -1) Object.assign((iotAutoReportRules as any[])[index], data)
  return wrapSuccessResponse('自动报工规则更新成功')
}

export async function getIoTDeviceHistory(params: { pageNum: number; pageSize: number; device?: string }) {
  await simulateDelay()
  const filtered = [...iotHistoryLogs]
  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}
