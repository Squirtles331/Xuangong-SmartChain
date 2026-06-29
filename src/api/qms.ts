import * as mockService from '@/mock/services/qms'
import type { ApiResponse } from '@/utils/http'
import http from '@/utils/http'
import { isMockMode } from './_config'
import { unwrapApiResponse } from './_factory'

export function getInspectionTaskList(params: { page: number; page_size: number; code?: string; type?: string; material?: string; status?: string }) {
  if (isMockMode) return mockService.getInspectionTaskList(params)
  return unwrapApiResponse(http.get<ApiResponse<any>>('/qms/inspections', { params }))
}

export function createInspectionTask(data: any) {
  if (isMockMode) return mockService.createInspectionTask(data)
  return unwrapApiResponse(http.post<ApiResponse<null>>('/qms/inspections', data))
}

export function updateInspectionTask(id: string, data: any) {
  if (isMockMode) return mockService.updateInspectionTask(id, data)
  return unwrapApiResponse(http.put<ApiResponse<null>>(`/qms/inspections/${id}`, data))
}

export function deleteInspectionTask(id: string) {
  if (isMockMode) return mockService.deleteInspectionTask(id)
  return unwrapApiResponse(http.delete<ApiResponse<null>>(`/qms/inspections/${id}`))
}

export function getQCTemplates() {
  if (isMockMode) return mockService.getQCTemplates()
  return unwrapApiResponse(http.get<ApiResponse<any>>('/qms/templates'))
}

export function getSupplierQualityList(params: { page: number; page_size: number }) {
  if (isMockMode) return mockService.getSupplierQualityList(params)
  return unwrapApiResponse(http.get<ApiResponse<any>>('/qms/supplier-quality', { params }))
}
