import { isMockMode } from './_config'
import { apiGet } from './_factory'
import * as mockService from '@/mock/services/iot'

export function getIoTConfigList(params: { pageNum: number; pageSize: number; keyword?: string; protocol?: string; status?: string }) {
  if (isMockMode) return mockService.getIoTConfigList(params)
  return apiGet<any>('/iot/configs', { params })
}

export function getIoTAutoReportList(params: { pageNum: number; pageSize: number; equipment?: string; status?: string }) {
  if (isMockMode) return mockService.getIoTAutoReportList(params)
  return apiGet<any>('/iot/auto-reports', { params })
}

export function getIoTDeviceHistory(params: { pageNum: number; pageSize: number; device?: string }) {
  if (isMockMode) return mockService.getIoTDeviceHistory(params)
  return apiGet<any>('/iot/history', { params })
}
