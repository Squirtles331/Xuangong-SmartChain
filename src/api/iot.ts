import { isMockMode } from './_config'
import { apiDelete, apiGet, apiPost, apiPut } from './_factory'
import * as mockService from '@/mock/services/iot'

export function getIoTConfigList(params: { pageNum: number; pageSize: number; keyword?: string; protocol?: string; status?: string }) {
  if (isMockMode) return mockService.getIoTConfigList(params)
  return apiGet<any>('/iot/configs', { params })
}

export function createIoTConfig(data: Record<string, any>) {
  if (isMockMode) return mockService.createIoTConfig(data)
  return apiPost<Record<string, never>, Record<string, any>>('/iot/configs', data)
}

export function updateIoTConfig(id: string, data: Record<string, any>) {
  if (isMockMode) return mockService.updateIoTConfig(id, data)
  return apiPut<Record<string, never>, Record<string, any>>(`/iot/configs/${id}`, data)
}

export function deleteIoTConfig(id: string) {
  if (isMockMode) return mockService.deleteIoTConfig(id)
  return apiDelete<Record<string, never>>(`/iot/configs/${id}`)
}

export function getIoTAutoReportList(params: { pageNum: number; pageSize: number; equipment?: string; status?: string }) {
  if (isMockMode) return mockService.getIoTAutoReportList(params)
  return apiGet<any>('/iot/auto-reports', { params })
}

export function createIoTAutoReportRule(data: Record<string, any>) {
  if (isMockMode) return mockService.createIoTAutoReportRule(data)
  return apiPost<Record<string, never>, Record<string, any>>('/iot/auto-reports', data)
}

export function updateIoTAutoReportRule(id: string, data: Record<string, any>) {
  if (isMockMode) return mockService.updateIoTAutoReportRule(id, data)
  return apiPut<Record<string, never>, Record<string, any>>(`/iot/auto-reports/${id}`, data)
}

export function getIoTDeviceHistory(params: { pageNum: number; pageSize: number; device?: string }) {
  if (isMockMode) return mockService.getIoTDeviceHistory(params)
  return apiGet<any>('/iot/history', { params })
}
