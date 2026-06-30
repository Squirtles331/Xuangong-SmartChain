import { isMockMode } from './_config'
import { apiDelete, apiGet, apiPost, apiPut } from './_factory'
import * as mockService from '@/mock/services/qms'

export function getInspectionTaskList(params: {
  pageNum: number
  pageSize: number
  code?: string
  type?: string
  material?: string
  status?: string
}) {
  if (isMockMode) return mockService.getInspectionTaskList(params)
  return apiGet<any>('/qms/inspections', { params })
}

export function createInspectionTask(data: any) {
  if (isMockMode) return mockService.createInspectionTask(data)
  return apiPost<Record<string, never>, any>('/qms/inspections', data)
}

export function updateInspectionTask(id: string, data: any) {
  if (isMockMode) return mockService.updateInspectionTask(id, data)
  return apiPut<Record<string, never>, any>(`/qms/inspections/${id}`, data)
}

export function deleteInspectionTask(id: string) {
  if (isMockMode) return mockService.deleteInspectionTask(id)
  return apiDelete<Record<string, never>>(`/qms/inspections/${id}`)
}

export function getQCTemplates() {
  if (isMockMode) return mockService.getQCTemplates()
  return apiGet<any>('/qms/templates')
}

export function getSupplierQualityList(params: { pageNum: number; pageSize: number }) {
  if (isMockMode) return mockService.getSupplierQualityList(params)
  return apiGet<any>('/qms/supplier-quality', { params })
}
