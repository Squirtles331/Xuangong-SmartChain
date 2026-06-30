import { isMockMode } from './_config'
import { apiGet, apiPost, apiPut } from './_factory'
import * as mockService from '@/mock/services/mrp'

export function runMRP(data?: { plantId?: string }) {
  if (isMockMode) return mockService.runMRP(data)
  return apiPost<{ runId: string }, { plantId?: string }>('/mrp/run', data || {})
}

export function getMRPResults(runId: string, params: { type: 'purchase' | 'production' | 'exception'; pageNum: number; pageSize: number }) {
  if (isMockMode) return mockService.getMRPResults(runId, params)
  return apiGet<any>(`/mrp/runs/${runId}/results`, { params })
}

export function confirmMRPSuggestions(runId: string, ids: string[]) {
  if (isMockMode) return mockService.confirmMRPSuggestions(runId, ids)
  return apiPut<Record<string, never>, { ids: string[] }>(`/mrp/runs/${runId}/confirm`, { ids })
}

export function getMRPHistory(params: { pageNum: number; pageSize: number; plantId?: string; status?: string }) {
  if (isMockMode) return mockService.getMRPHistory(params)
  return apiGet<any>('/mrp/history', { params })
}

export function getMRPForecast(params: { pageNum: number; pageSize: number; period?: string }) {
  if (isMockMode) return mockService.getMRPForecast(params)
  return apiGet<any>('/mrp/forecast', { params })
}

export function getMultiPlantMRP(params: { pageNum: number; pageSize: number; plantIds?: string[] }) {
  if (isMockMode) return mockService.getMultiPlantMRP(params)
  return apiGet<any>('/mrp/multi-plant', { params })
}

export function getNetChangeMRP(params: { pageNum: number; pageSize: number; changeType?: string }) {
  if (isMockMode) return mockService.getNetChangeMRP(params)
  return apiGet<any>('/mrp/net-change', { params })
}
