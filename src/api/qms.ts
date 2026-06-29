import http from '@/utils/http'
import type { ApiResponse } from '@/utils/http'
import { isMockMode } from './_config'
import * as mockService from '@/mock/services/qms'

// ==================== 质检任务管理 ====================
export function getInspectionTaskList(params: { page: number; page_size: number; code?: string; type?: string; material?: string; status?: string }) {
  if (isMockMode) return mockService.getInspectionTaskList(params)
  return http.get<ApiResponse<any>>('/qms/inspections', { params })
}

export function createInspectionTask(data: any) {
  if (isMockMode) return mockService.createInspectionTask(data)
  return http.post('/qms/inspections', data)
}

export function updateInspectionTask(id: string, data: any) {
  if (isMockMode) return mockService.updateInspectionTask(id, data)
  return http.put(`/qms/inspections/${id}`, data)
}

export function deleteInspectionTask(id: string) {
  if (isMockMode) return mockService.deleteInspectionTask(id)
  return http.delete(`/qms/inspections/${id}`)
}

// ==================== 质检模板 ====================
export function getQCTemplates() {
  if (isMockMode) return mockService.getQCTemplates()
  return http.get<ApiResponse<any>>('/qms/templates')
}

// ==================== 供应商质量（骨架 — 后续页面预留） ====================
export function getSupplierQualityList(params: { page: number; page_size: number }) {
  if (isMockMode) return mockService.getSupplierQualityList(params)
  return http.get<ApiResponse<any>>('/qms/supplier-quality', { params })
}
