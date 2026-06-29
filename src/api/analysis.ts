import http from '@/utils/http'
import type { ApiResponse } from '@/utils/http'
import { isMockMode } from './_config'
import { unwrapApiResponse } from './_factory'
import * as mockService from '@/mock/services/analysis'

export function getReportList(params: { page: number; page_size: number; name?: string }) {
  if (isMockMode) return mockService.getReportList(params)
  return unwrapApiResponse(http.get<ApiResponse<any>>('/analysis/reports', { params }))
}

export function previewReport(id: number) {
  if (isMockMode) return mockService.previewReport(id)
  return unwrapApiResponse(http.get<ApiResponse<any>>(`/analysis/reports/${id}/preview`))
}

export function downloadReport(id: number) {
  if (isMockMode) return mockService.downloadReport(id)
  return unwrapApiResponse(http.get<ApiResponse<any>>(`/analysis/reports/${id}/download`))
}

export function deleteReport(id: number) {
  if (isMockMode) return mockService.deleteReport(id)
  return unwrapApiResponse(http.delete<ApiResponse<null>>(`/analysis/reports/${id}`))
}
