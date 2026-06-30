import { isMockMode } from './_config'
import { apiDelete, apiGet, apiPost, apiPut, type ApiResponse, type PaginatedData } from './_factory'
import * as mockService from '@/mock/services/routing'

export interface RoutingOperation {
  id: string
  operation_no: number
  name: string
  work_center: string
  setup_hours: number
  run_hours: number
  queue_hours: number
  move_hours: number
  workers: number
  skill: string
  is_qc_gate: boolean
  is_outsourced: boolean
  instruction: string
}

export interface RoutingListQuery {
  pageNum: number
  pageSize: number
  materialCode?: string
}

export function getRoutingList(params: RoutingListQuery) {
  if (isMockMode) return mockService.getRoutingList(params) as Promise<ApiResponse<PaginatedData<RoutingOperation>>>
  return apiGet<PaginatedData<RoutingOperation>>('/routing/list', { params })
}

export function saveRouting(data: Partial<RoutingOperation>) {
  if (isMockMode) return mockService.saveRouting(data)
  if (data.id) {
    return apiPut<Record<string, never>, Partial<RoutingOperation>>(`/routing/${data.id}`, data)
  }
  return apiPost<Record<string, never>, Partial<RoutingOperation>>('/routing', data)
}

export function deleteRouting(id: string) {
  if (isMockMode) return mockService.deleteRouting(id)
  return apiDelete<Record<string, never>>(`/routing/${id}`)
}

export function getRoutingDetail(id: string) {
  if (isMockMode) return mockService.getRoutingDetail(id)
  return apiGet<RoutingOperation>(`/routing/${id}`)
}
