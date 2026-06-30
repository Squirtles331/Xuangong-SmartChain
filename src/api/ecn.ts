import { isMockMode } from './_config'
import { apiDelete, apiGet, apiPost, apiPut, type ApiResponse, type PaginatedData } from './_factory'
import * as mockService from '@/mock/services/ecn'

export interface ECNOrder {
  id: string
  code: string
  change_type: 'BOM变更' | '工艺变更' | 'BOM+工艺变更'
  material: string
  current_version: string
  status: 'draft' | 'approved' | 'executed' | 'verified' | 'closed'
  urgency: 'urgent' | 'normal' | 'planned'
  applicant: string
  createdAt: string
}

export interface ECNListQuery {
  pageNum: number
  pageSize: number
  code?: string
  material?: string
  status?: string
}

export function getECNList(params: ECNListQuery) {
  if (isMockMode) return mockService.getECNList(params) as Promise<ApiResponse<PaginatedData<ECNOrder>>>
  return apiGet<PaginatedData<ECNOrder>>('/ecn/list', { params })
}

export function createECN(data: Partial<ECNOrder>) {
  if (isMockMode) return mockService.createECN(data)
  return apiPost<Record<string, never>, Partial<ECNOrder>>('/ecn', data)
}

export function updateECN(id: string, data: Partial<ECNOrder>) {
  if (isMockMode) return mockService.updateECN(id, data)
  return apiPut<Record<string, never>, Partial<ECNOrder>>(`/ecn/${id}`, data)
}

export function deleteECN(id: string) {
  if (isMockMode) return mockService.deleteECN(id)
  return apiDelete<Record<string, never>>(`/ecn/${id}`)
}
