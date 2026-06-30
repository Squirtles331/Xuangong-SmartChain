import { iotAlertHistory, iotAlertRules, iotAutoReportRules, iotConfigs, iotDevices, iotHistoryLogs } from '../modules/iot'
import { simulateDelay } from '../shared/delay'
import { generateId } from '../shared/id'
import { paginate, searchItems } from '../shared/paginate'
import { wrapCreatedResponse, wrapDetailResponse, wrapListResponse, wrapSuccessResponse, wrapUpdatedResponse } from '../shared/response'

export async function getIoTConfigList(params: { pageNum: number; pageSize: number; keyword?: string; protocol?: string; status?: string }) {
  await simulateDelay()
  let filtered = [...iotConfigs]
  if (params.keyword) filtered = searchItems(filtered, params.keyword, ['name', 'address', 'protocol'])
  if (params.protocol) filtered = filtered.filter((item) => item.protocol === params.protocol)
  if (params.status) filtered = filtered.filter((item) => item.status === params.status)
  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function createIoTConfig(data: any) {
  await simulateDelay()
  const next = { id: generateId(), ...data }
  iotConfigs.unshift(next)
  return wrapCreatedResponse(next, '新增连接配置成功')
}

export async function updateIoTConfig(id: string, data: any) {
  await simulateDelay()
  const index = iotConfigs.findIndex((item) => item.id === id)
  if (index > -1) {
    iotConfigs[index] = { ...iotConfigs[index], ...data }
    return wrapUpdatedResponse(iotConfigs[index], '编辑连接配置成功')
  }
  return wrapUpdatedResponse({ id, ...data }, '编辑连接配置成功')
}

export async function deleteIoTConfig(id: string) {
  await simulateDelay()
  const index = iotConfigs.findIndex((item) => item.id === id)
  if (index > -1) iotConfigs.splice(index, 1)
  return wrapSuccessResponse('删除连接配置成功')
}

export async function getIoTAutoReportList(params: { pageNum: number; pageSize: number; equipment?: string; status?: string }) {
  await simulateDelay()
  let filtered = [...iotAutoReportRules]
  if (params.equipment) filtered = searchItems(filtered, params.equipment, ['equipment'])
  if (params.status) filtered = filtered.filter((item) => item.status === params.status)
  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function createIoTAutoReportRule(data: any) {
  await simulateDelay()
  const next = { id: generateId(), ...data }
  iotAutoReportRules.unshift(next)
  return wrapCreatedResponse(next, '新增自动报工规则成功')
}

export async function updateIoTAutoReportRule(id: string, data: any) {
  await simulateDelay()
  const index = iotAutoReportRules.findIndex((item) => item.id === id)
  if (index > -1) {
    iotAutoReportRules[index] = { ...iotAutoReportRules[index], ...data }
    return wrapUpdatedResponse(iotAutoReportRules[index], '编辑自动报工规则成功')
  }
  return wrapUpdatedResponse({ id, ...data }, '编辑自动报工规则成功')
}

export async function getIoTAlertRuleList() {
  await simulateDelay()
  return wrapDetailResponse(iotAlertRules)
}

export async function createIoTAlertRule(data: any) {
  await simulateDelay()
  const next = { id: generateId(), ...data }
  iotAlertRules.unshift(next)
  return wrapCreatedResponse(next, '新增预警规则成功')
}

export async function updateIoTAlertRule(id: string, data: any) {
  await simulateDelay()
  const index = iotAlertRules.findIndex((item) => item.id === id)
  if (index > -1) {
    iotAlertRules[index] = { ...iotAlertRules[index], ...data }
    return wrapUpdatedResponse(iotAlertRules[index], '编辑预警规则成功')
  }
  return wrapUpdatedResponse({ id, ...data }, '编辑预警规则成功')
}

export async function deleteIoTAlertRule(id: string) {
  await simulateDelay()
  const index = iotAlertRules.findIndex((item) => item.id === id)
  if (index > -1) iotAlertRules.splice(index, 1)
  return wrapSuccessResponse('删除预警规则成功')
}

export async function getIoTAlertHistory(params: { pageNum: number; pageSize: number; device?: string; level?: string }) {
  await simulateDelay()
  let filtered = [...iotAlertHistory]
  if (params.device) filtered = searchItems(filtered, params.device, ['device'])
  if (params.level) filtered = filtered.filter((item) => item.level === params.level)
  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function getIoTDeviceList(params: { pageNum: number; pageSize: number; status?: string; type?: string }) {
  await simulateDelay()
  let filtered = [...iotDevices]
  if (params.status) filtered = filtered.filter((item) => item.status === params.status)
  if (params.type) filtered = filtered.filter((item) => item.type === params.type)
  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function getIoTDeviceHistory(params: { pageNum: number; pageSize: number; device?: string }) {
  await simulateDelay()
  let filtered = [...iotHistoryLogs]
  if (params.device) filtered = filtered.filter((item) => item.device === params.device)
  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}
