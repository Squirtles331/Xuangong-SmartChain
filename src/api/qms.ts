import * as staticService from '@/static/services/qms'
import { isMockMode, isStaticMode } from './_config'
import { apiDelete, apiGet, apiPost, apiPut, type ApiResponse, type PaginatedData } from './_factory'
import * as mockService from '@/mock/services/qms'

export interface InspectionTask {
  id: string
  code: string
  type: string
  material: string
  lot: string
  qty: number
  status: string
  verdict?: string
}

export interface QCTemplateItem {
  name: string
  type: string
  standard: string
  required: boolean
}

export interface QCTemplate {
  id: string
  name: string
  category: string
  itemCount: number
  items: QCTemplateItem[]
}

export interface SupplierQuality {
  id: string
  supplier: string
  total_batches: number
  pass_batches: number
  pass_rate: number
  repeat_issues: number
  last_inspection: string
}

export function getInspectionTaskList(params: {
  pageNum: number
  pageSize: number
  code?: string
  type?: string
  material?: string
  status?: string
}) {
  if (isStaticMode) return staticService.getInspectionTaskList(params) as Promise<ApiResponse<PaginatedData<InspectionTask>>>
  if (isMockMode) return mockService.getInspectionTaskList(params) as Promise<ApiResponse<PaginatedData<InspectionTask>>>
  return apiGet<PaginatedData<InspectionTask>>('/qms/inspections', { params })
}

export function createInspectionTask(data: Partial<InspectionTask>) {
  if (isStaticMode) return staticService.createInspectionTask(data)
  if (isMockMode) return mockService.createInspectionTask(data)
  return apiPost<Record<string, never>, Partial<InspectionTask>>('/qms/inspections', data)
}

export function updateInspectionTask(id: string, data: Partial<InspectionTask>) {
  if (isStaticMode) return staticService.updateInspectionTask(id, data)
  if (isMockMode) return mockService.updateInspectionTask(id, data)
  return apiPut<Record<string, never>, Partial<InspectionTask>>(`/qms/inspections/${id}`, data)
}

export function deleteInspectionTask(id: string) {
  if (isStaticMode) return staticService.deleteInspectionTask(id)
  if (isMockMode) return mockService.deleteInspectionTask(id)
  return apiDelete<Record<string, never>>(`/qms/inspections/${id}`)
}

export function getQCTemplateList(params: { pageNum: number; pageSize: number; keyword?: string; category?: string }) {
  if (isMockMode) return mockService.getQCTemplateList(params) as Promise<ApiResponse<PaginatedData<QCTemplate>>>
  return apiGet<PaginatedData<QCTemplate>>('/qms/templates', { params })
}

export function createQCTemplate(data: Partial<QCTemplate>) {
  if (isMockMode) return mockService.createQCTemplate(data)
  return apiPost<Record<string, never>, Partial<QCTemplate>>('/qms/templates', data)
}

export function updateQCTemplate(id: string, data: Partial<QCTemplate>) {
  if (isMockMode) return mockService.updateQCTemplate(id, data)
  return apiPut<Record<string, never>, Partial<QCTemplate>>(`/qms/templates/${id}`, data)
}

export function deleteQCTemplate(id: string) {
  if (isMockMode) return mockService.deleteQCTemplate(id)
  return apiDelete<Record<string, never>>(`/qms/templates/${id}`)
}

export function getSupplierQualityList(params: { pageNum: number; pageSize: number; supplier?: string }) {
  if (isMockMode) return mockService.getSupplierQualityList(params) as Promise<ApiResponse<PaginatedData<SupplierQuality>>>
  return apiGet<PaginatedData<SupplierQuality>>('/qms/supplier-quality', { params })
}

export function createSupplierQuality(data: Partial<SupplierQuality>) {
  if (isMockMode) return mockService.createSupplierQuality(data)
  return apiPost<Record<string, never>, Partial<SupplierQuality>>('/qms/supplier-quality', data)
}

export function updateSupplierQuality(id: string, data: Partial<SupplierQuality>) {
  if (isMockMode) return mockService.updateSupplierQuality(id, data)
  return apiPut<Record<string, never>, Partial<SupplierQuality>>(`/qms/supplier-quality/${id}`, data)
}

export function deleteSupplierQuality(id: string) {
  if (isMockMode) return mockService.deleteSupplierQuality(id)
  return apiDelete<Record<string, never>>(`/qms/supplier-quality/${id}`)
}
