import { isMockMode } from './_config'
import { apiDelete, apiGet, apiPost, apiPut, type ApiResponse, type PaginatedData } from './_factory'
import * as mockService from '@/mock/services/mrp'

export interface MRPForecast {
  id: string
  material_code: string
  material_name: string
  qty: number
  need_date: string
  type: 'sales' | 'independent'
  probability: number
  remark: string
}

export interface MRPForecastQuery {
  pageNum: number
  pageSize: number
  keyword?: string
  type?: MRPForecast['type']
}

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

export function getMRPForecast(params: MRPForecastQuery) {
  if (isMockMode) return mockService.getMRPForecast(params) as Promise<ApiResponse<PaginatedData<MRPForecast>>>
  return apiGet<PaginatedData<MRPForecast>>('/mrp/forecast', { params })
}

export function createMRPForecast(data: Partial<MRPForecast>) {
  if (isMockMode) return mockService.createMRPForecast(data)
  return apiPost<Record<string, never>, Partial<MRPForecast>>('/mrp/forecast', data)
}

export function updateMRPForecast(id: string, data: Partial<MRPForecast>) {
  if (isMockMode) return mockService.updateMRPForecast(id, data)
  return apiPut<Record<string, never>, Partial<MRPForecast>>(`/mrp/forecast/${id}`, data)
}

export function deleteMRPForecast(id: string) {
  if (isMockMode) return mockService.deleteMRPForecast(id)
  return apiDelete<Record<string, never>>(`/mrp/forecast/${id}`)
}

export function getMultiPlantMRP(params: { pageNum: number; pageSize: number; plantIds?: string[] }) {
  if (isMockMode) return mockService.getMultiPlantMRP(params)
  return apiGet<any>('/mrp/multi-plant', { params })
}

export function getNetChangeMRP(params: { pageNum: number; pageSize: number; changeType?: string }) {
  if (isMockMode) return mockService.getNetChangeMRP(params)
  return apiGet<any>('/mrp/net-change', { params })
}
