import { apiDelete, apiGet, apiPost, apiPut, type PaginatedData } from './_factory'

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
  return apiGet<PaginatedData<ECNOrder>>('/ecn/list', { params })
}

export function createECN(data: Partial<ECNOrder>) {
  return apiPost<Record<string, never>, Partial<ECNOrder>>('/ecn', data)
}

export function updateECN(id: string, data: Partial<ECNOrder>) {
  return apiPut<Record<string, never>, Partial<ECNOrder>>(`/ecn/${id}`, data)
}

export function deleteECN(id: string) {
  return apiDelete<Record<string, never>>(`/ecn/${id}`)
}
