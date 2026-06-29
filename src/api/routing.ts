import http from '@/utils/http'
import type { ApiResponse } from '@/utils/http'
import { isMockMode } from './_config'
import * as mockService from '@/mock/services/routing'

// ==================== 工艺路线 ====================
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
  page: number
  page_size: number
  material_code?: string
}

export function getRoutingList(params: RoutingListQuery) {
  if (isMockMode) return mockService.getRoutingList(params)
  return http.get<ApiResponse<{ total: number; items: RoutingOperation[] }>>('/routing/list', { params })
}

export function saveRouting(data: Partial<RoutingOperation>) {
  if (isMockMode) return mockService.saveRouting(data)
  if (data.id) {
    return http.put(`/routing/${data.id}`, data)
  }
  return http.post('/routing', data)
}

export function deleteRouting(id: string) {
  if (isMockMode) return mockService.deleteRouting(id)
  return http.delete(`/routing/${id}`)
}

export function getRoutingDetail(id: string) {
  if (isMockMode) return mockService.getRoutingDetail(id)
  return http.get<ApiResponse<RoutingOperation>>(`/routing/${id}`)
}
