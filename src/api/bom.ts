import * as staticService from '@/static/services/bom'
import { isStaticMode } from './_config'
import { apiDelete, apiGet, apiPost, apiPut, type ApiResponse, type PaginatedData } from './_factory'

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
  if (isStaticMode) return staticService.getBOMList(params) as Promise<ApiResponse<PaginatedData<BOMVersion>>>
  return apiGet<PaginatedData<BOMVersion>>('/bom/list', { params })
}

export function getBOMTree(versionId: string) {
  if (isStaticMode) return staticService.getBOMTree(versionId)
  return apiGet<any>(`/bom/tree/${versionId}`)
}

export function saveBOM(data: Partial<BOMVersion>) {
  if (isStaticMode) return staticService.saveBOM(data)
  return data.id
    ? apiPut<Record<string, never>, Partial<BOMVersion>>(`/bom/${data.id}`, data)
    : apiPost<Record<string, never>, Partial<BOMVersion>>('/bom', data)
}

export function deleteBOM(id: string) {
  if (isStaticMode) return staticService.deleteBOM(id)
  return apiDelete<Record<string, never>>(`/bom/${id}`)
}

export function getBOMPreview(materialCode: string) {
  if (isStaticMode) return staticService.getBOMPreview(materialCode)
  return apiGet<any>('/bom/preview', { params: { materialCode } })
}
