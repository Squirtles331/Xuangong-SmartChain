import http from '@/utils/http'
import type { ApiResponse } from '@/utils/http'
import { isMockMode } from './_config'
import { unwrapApiResponse } from './_factory'
import * as mockService from '@/mock/services/iot'

// IoT连接配置
export function getIoTConfigList(params: { page: number; page_size: number; keyword?: string; protocol?: string; status?: string }) {
  if (isMockMode) return mockService.getIoTConfigList(params)
  return unwrapApiResponse(http.get<ApiResponse<any>>('/iot/configs', { params }))
}

// 自动报工规则
export function getIoTAutoReportList(params: { page: number; page_size: number; equipment?: string; status?: string }) {
  if (isMockMode) return mockService.getIoTAutoReportList(params)
  return unwrapApiResponse(http.get<ApiResponse<any>>('/iot/auto-reports', { params }))
}

// 设备历史数据
export function getIoTDeviceHistory(params: { page: number; page_size: number; device?: string }) {
  if (isMockMode) return mockService.getIoTDeviceHistory(params)
  return unwrapApiResponse(http.get<ApiResponse<any>>('/iot/history', { params }))
}
