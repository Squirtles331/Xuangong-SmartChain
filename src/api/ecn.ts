import http from '@/utils/http'
import type { ApiResponse } from '@/utils/http'
import { isMockMode } from './_config'
import * as mockService from '@/mock/services/ecn'

// ==================== ECN 变更单 ====================
export interface ECNOrder {
  id: string
  code: string
  change_type: 'BOM变更' | '工艺变更' | 'BOM+工艺变更'
  material: string
  current_version: string
  status: 'draft' | 'approved' | 'executed' | 'verified' | 'closed'
  urgency: 'urgent' | 'normal' | 'planned'
  applicant: string
  created_at: string
}

export interface ECNListQuery {
  page: number
  page_size: number
  code?: string
  material?: string
  status?: string
}

export function getECNList(params: ECNListQuery) {
  if (isMockMode) return mockService.getECNList(params)
  return http.get<ApiResponse<{ total: number; items: ECNOrder[] }>>('/ecn/list', { params })
}

export function createECN(data: Partial<ECNOrder>) {
  if (isMockMode) return mockService.createECN(data)
  return http.post('/ecn', data)
}

export function updateECN(id: string, data: Partial<ECNOrder>) {
  if (isMockMode) return mockService.updateECN(id, data)
  return http.put(`/ecn/${id}`, data)
}

export function deleteECN(id: string) {
  if (isMockMode) return mockService.deleteECN(id)
  return http.delete(`/ecn/${id}`)
}
