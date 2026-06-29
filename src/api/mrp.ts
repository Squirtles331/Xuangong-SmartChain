import * as mockService from '@/mock/services/mrp'
import type { ApiResponse } from '@/utils/http'
import http from '@/utils/http'
import { isMockMode } from './_config'
import { unwrapApiResponse } from './_factory'

export function runMRP(data?: { plant_id?: string }) {
  if (isMockMode) return mockService.runMRP(data)
  return unwrapApiResponse(http.post<ApiResponse<{ run_id: string }>>('/mrp/run', data || {}))
}

export function getMRPResults(runId: string, params: { type: 'purchase' | 'production' | 'exception'; page: number; page_size: number }) {
  if (isMockMode) return mockService.getMRPResults(runId, params)
  return unwrapApiResponse(http.get<ApiResponse<any>>(`/mrp/runs/${runId}/results`, { params }))
}

export function confirmMRPSuggestions(runId: string, ids: string[]) {
  if (isMockMode) return mockService.confirmMRPSuggestions(runId, ids)
  return unwrapApiResponse(http.put<ApiResponse<null>>(`/mrp/runs/${runId}/confirm`, { ids }))
}

export function getMRPHistory(params: { page: number; page_size: number; plant_id?: string; status?: string }) {
  if (isMockMode) return mockService.getMRPHistory(params)
  return unwrapApiResponse(http.get<ApiResponse<any>>('/mrp/history', { params }))
}

export function getMRPForecast(params: { page: number; page_size: number; period?: string }) {
  if (isMockMode) return mockService.getMRPForecast(params)
  return unwrapApiResponse(http.get<ApiResponse<any>>('/mrp/forecast', { params }))
}

export function getMultiPlantMRP(params: { page: number; page_size: number; plant_ids?: string[] }) {
  if (isMockMode) return mockService.getMultiPlantMRP(params)
  return unwrapApiResponse(http.get<ApiResponse<any>>('/mrp/multi-plant', { params }))
}

export function getNetChangeMRP(params: { page: number; page_size: number; change_type?: string }) {
  if (isMockMode) return mockService.getNetChangeMRP(params)
  return unwrapApiResponse(http.get<ApiResponse<any>>('/mrp/net-change', { params }))
}
