import http from '@/utils/http'
import type { ApiResponse } from '@/utils/http'
import { isMockMode } from './_config'
import { unwrapApiResponse } from './_factory'
import * as mockService from '@/mock/services/ehs'

// 隐患
export function getEhsHazardList(params: { page: number; page_size: number; keyword?: string; level?: string; status?: string }) {
  if (isMockMode) return mockService.getEhsHazardList(params)
  return unwrapApiResponse(http.get<ApiResponse<any>>('/ehs/hazards', { params }))
}

// 应急预案
export function getEhsEmergencyList(params: { page: number; page_size: number; name?: string; type?: string }) {
  if (isMockMode) return mockService.getEhsEmergencyList(params)
  return unwrapApiResponse(http.get<ApiResponse<any>>('/ehs/emergency', { params }))
}

// 作业票
export function getEhsPermitList(params: { page: number; page_size: number; keyword?: string; type?: string; status?: string }) {
  if (isMockMode) return mockService.getEhsPermitList(params)
  return unwrapApiResponse(http.get<ApiResponse<any>>('/ehs/permits', { params }))
}

// 培训记录
export function getEhsTrainingList(params: { page: number; page_size: number; title?: string; status?: string }) {
  if (isMockMode) return mockService.getEhsTrainingList(params)
  return unwrapApiResponse(http.get<ApiResponse<any>>('/ehs/training', { params }))
}
