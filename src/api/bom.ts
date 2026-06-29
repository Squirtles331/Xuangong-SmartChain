import http from '@/utils/http'
import type { ApiResponse } from '@/utils/http'
import { isMockMode } from './_config'
import * as mockService from '@/mock/services/bom'

// ==================== BOM 版本 ====================
export interface BOMVersion {
  id: string
  material_code: string
  material_name: string
  bom_type: 'EBOM' | 'MBOM'
  version: string
  status: 'active' | 'draft' | 'archived'
  effective_date: string
  created_by: string
  created_at: string
}

export interface BOMListQuery {
  page: number
  page_size: number
  material_code?: string
  material_name?: string
  status?: string
}

export function getBOMList(params: BOMListQuery) {
  if (isMockMode) return mockService.getBOMList(params)
  return http.get<ApiResponse<{ total: number; items: BOMVersion[] }>>('/bom/list', { params })
}

export function getBOMTree(versionId: string) {
  if (isMockMode) return mockService.getBOMTree(versionId)
  return http.get<ApiResponse<any>>(`/bom/tree/${versionId}`)
}

export function saveBOM(data: Partial<BOMVersion>) {
  if (isMockMode) return mockService.saveBOM(data)
  if (data.id) {
    return http.put(`/bom/${data.id}`, data)
  }
  return http.post('/bom', data)
}

export function deleteBOM(id: string) {
  if (isMockMode) return mockService.deleteBOM(id)
  return http.delete(`/bom/${id}`)
}

export function getBOMPreview(materialCode: string) {
  if (isMockMode) return mockService.getBOMPreview(materialCode)
  return http.get<ApiResponse<any>>('/bom/preview', { params: { material_code: materialCode } })
}
