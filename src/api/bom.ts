import { isMockMode } from './_config'
import { apiDelete, apiGet, apiPost, apiPut, type ApiResponse, type PaginatedData } from './_factory'
import * as mockService from '@/mock/services/bom'

export interface BOMVersion {
  id: string
  material_code: string
  material_name: string
  bom_type: 'EBOM' | 'MBOM'
  version: string
  status: 'active' | 'draft' | 'archived'
  effective_date: string
  created_by: string
  createdAt: string
}

export interface BOMListQuery {
  pageNum: number
  pageSize: number
  materialCode?: string
  materialName?: string
  bomType?: string
  status?: string
}

export function getBOMList(params: BOMListQuery) {
  if (isMockMode) return mockService.getBOMList(params) as Promise<ApiResponse<PaginatedData<BOMVersion>>>
  return apiGet<PaginatedData<BOMVersion>>('/bom/list', { params })
}

export function getBOMTree(versionId: string) {
  if (isMockMode) return mockService.getBOMTree(versionId)
  return apiGet<any>(`/bom/tree/${versionId}`)
}

export function saveBOM(data: Partial<BOMVersion>) {
  if (isMockMode) return mockService.saveBOM(data)
  if (data.id) {
    return apiPut<Record<string, never>, Partial<BOMVersion>>(`/bom/${data.id}`, data)
  }
  return apiPost<Record<string, never>, Partial<BOMVersion>>('/bom', data)
}

export function deleteBOM(id: string) {
  if (isMockMode) return mockService.deleteBOM(id)
  return apiDelete<Record<string, never>>(`/bom/${id}`)
}

export function getBOMPreview(materialCode: string) {
  if (isMockMode) return mockService.getBOMPreview(materialCode)
  return apiGet<any>('/bom/preview', { params: { materialCode } })
}
