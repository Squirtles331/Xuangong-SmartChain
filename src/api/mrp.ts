import http from '@/utils/http'
import type { ApiResponse } from '@/utils/http'
import { isMockMode } from './_config'
import * as mockService from '@/mock/services/mrp'

// ==================== MRP 运算 ====================
export function runMRP(data?: { plant_id?: string }) {
  if (isMockMode) return mockService.runMRP(data)
  return http.post<ApiResponse<{ run_id: string }>>('/mrp/run', data || {})
}

// ==================== MRP 结果查询 ====================
export function getMRPResults(
  runId: string,
  params: { type: 'purchase' | 'production' | 'exception'; page: number; page_size: number }
) {
  if (isMockMode) return mockService.getMRPResults(runId, params)
  return http.get<ApiResponse<any>>(`/mrp/runs/${runId}/results`, { params })
}

// ==================== MRP 建议确认 ====================
export function confirmMRPSuggestions(runId: string, ids: string[]) {
  if (isMockMode) return mockService.confirmMRPSuggestions(runId, ids)
  return http.put(`/mrp/runs/${runId}/confirm`, { ids })
}

// ==================== MRP 历史记录 ====================
export function getMRPHistory(params: { page: number; page_size: number; plant_id?: string; status?: string }) {
  if (isMockMode) return mockService.getMRPHistory(params)
  return http.get<ApiResponse<any>>('/mrp/history', { params })
}

// ==================== MRP 预测（骨架 — 后续页面预留） ====================
export function getMRPForecast(params: { page: number; page_size: number; period?: string }) {
  if (isMockMode) return mockService.getMRPForecast(params)
  return http.get<ApiResponse<any>>('/mrp/forecast', { params })
}

// ==================== 多工厂 MRP（骨架 — 后续页面预留） ====================
export function getMultiPlantMRP(params: { page: number; page_size: number; plant_ids?: string[] }) {
  if (isMockMode) return mockService.getMultiPlantMRP(params)
  return http.get<ApiResponse<any>>('/mrp/multi-plant', { params })
}

// ==================== 净变更 MRP（骨架 — 后续页面预留） ====================
export function getNetChangeMRP(params: { page: number; page_size: number; change_type?: string }) {
  if (isMockMode) return mockService.getNetChangeMRP(params)
  return http.get<ApiResponse<any>>('/mrp/net-change', { params })
}
