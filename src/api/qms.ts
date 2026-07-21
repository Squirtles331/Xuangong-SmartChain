import * as staticService from '@/static/services/qms'
import { isStaticMode } from './_config'
import { apiDelete, apiGet, apiPost, apiPut, type ApiResponse, type PaginatedData } from './_factory'
export type { InspectionTask, QCTemplate, QCTemplateItem, SupplierQuality } from '@/types/qms'
import type { InspectionTask, QCTemplate, SupplierQuality } from '@/types/qms'

export function getInspectionTaskList(params: {
  pageNum: number
  pageSize: number
  code?: string
  type?: string
  material?: string
  status?: string
}) {
  if (isStaticMode) return staticService.getInspectionTaskList(params) as Promise<ApiResponse<PaginatedData<InspectionTask>>>
  return apiGet<PaginatedData<InspectionTask>>('/qms/inspections', { params })
}

export function createInspectionTask(data: Partial<InspectionTask>) {
  if (isStaticMode) return staticService.createInspectionTask(data)
  return apiPost<Record<string, never>, Partial<InspectionTask>>('/qms/inspections', data)
}

export function updateInspectionTask(id: string, data: Partial<InspectionTask>) {
  if (isStaticMode) return staticService.updateInspectionTask(id, data)
  return apiPut<Record<string, never>, Partial<InspectionTask>>(`/qms/inspections/${id}`, data)
}

export function deleteInspectionTask(id: string) {
  if (isStaticMode) return staticService.deleteInspectionTask(id)
  return apiDelete<Record<string, never>>(`/qms/inspections/${id}`)
}

export function getQCTemplateList(params: { pageNum: number; pageSize: number; keyword?: string; category?: string }) {
  if (isStaticMode) return staticService.getQCTemplateList(params) as Promise<ApiResponse<PaginatedData<QCTemplate>>>
  return apiGet<PaginatedData<QCTemplate>>('/qms/templates', { params })
}

export function createQCTemplate(data: Partial<QCTemplate>) {
  if (isStaticMode) return staticService.createQCTemplate(data)
  return apiPost<Record<string, never>, Partial<QCTemplate>>('/qms/templates', data)
}

export function updateQCTemplate(id: string, data: Partial<QCTemplate>) {
  if (isStaticMode) return staticService.updateQCTemplate(id, data)
  return apiPut<Record<string, never>, Partial<QCTemplate>>(`/qms/templates/${id}`, data)
}

export function deleteQCTemplate(id: string) {
  if (isStaticMode) return staticService.deleteQCTemplate(id)
  return apiDelete<Record<string, never>>(`/qms/templates/${id}`)
}

export function getSupplierQualityList(params: { pageNum: number; pageSize: number; supplier?: string }) {
  if (isStaticMode) return staticService.getSupplierQualityList(params) as Promise<ApiResponse<PaginatedData<SupplierQuality>>>
  return apiGet<PaginatedData<SupplierQuality>>('/qms/supplier-quality', { params })
}

export function createSupplierQuality(data: Partial<SupplierQuality>) {
  if (isStaticMode) return staticService.createSupplierQuality(data)
  return apiPost<Record<string, never>, Partial<SupplierQuality>>('/qms/supplier-quality', data)
}

export function updateSupplierQuality(id: string, data: Partial<SupplierQuality>) {
  if (isStaticMode) return staticService.updateSupplierQuality(id, data)
  return apiPut<Record<string, never>, Partial<SupplierQuality>>(`/qms/supplier-quality/${id}`, data)
}

export function deleteSupplierQuality(id: string) {
  if (isStaticMode) return staticService.deleteSupplierQuality(id)
  return apiDelete<Record<string, never>>(`/qms/supplier-quality/${id}`)
}
