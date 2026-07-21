import * as staticService from '@/static/services/analysis'
import { isStaticMode } from './_config'
import { apiDelete, apiGet, type ApiResponse, type PaginatedData } from './_factory'

export interface ReportItem {
  id: number
  name: string
  category: string
  createdAt: string
  creator: string
  status: string
}

export interface ReportQuery {
  pageNum: number
  pageSize: number
  name?: string
}

export function getReportList(params: ReportQuery) {
  if (isStaticMode) return staticService.getReportList(params) as Promise<ApiResponse<PaginatedData<ReportItem>>>
  return apiGet<PaginatedData<ReportItem>>('/analysis/reports', { params })
}

export function previewReport(id: number) {
  if (isStaticMode) return staticService.previewReport(id)
  return apiGet<any>(`/analysis/reports/${id}/preview`)
}

export function downloadReport(id: number) {
  if (isStaticMode) return staticService.downloadReport(id)
  return apiGet<Record<string, never>>(`/analysis/reports/${id}/download`)
}

export function deleteReport(id: number) {
  if (isStaticMode) return staticService.deleteReport(id)
  return apiDelete<Record<string, never>>(`/analysis/reports/${id}`)
}
