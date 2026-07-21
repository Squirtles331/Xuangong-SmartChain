import * as staticService from '@/static/services/routing'
import { isStaticMode } from './_config'
import { apiDelete, apiGet, apiPost, apiPut, type ApiResponse, type PaginatedData } from './_factory'

export interface RoutingOperation {
  id: string
  routing_id?: string
  routing_name?: string
  material_code?: string
  material_name?: string
  version?: string
  status?: string
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

export interface RoutingDetail {
  id: string
  material_code: string
  material_name: string
  routing_name: string
  version: string
  status: string
  description: string
  operations: RoutingOperation[]
}

export interface RoutingListQuery {
  pageNum: number
  pageSize: number
  materialCode?: string
}

export interface RoutingAutoTimeRecord {
  id: string
  operation: string
  material_name: string
  std_hours: number
  actual_avg: number
  deviation: number
  samples: number
  suggestion: string
}

export interface RoutingAutoTimeQuery {
  pageNum: number
  pageSize: number
  keyword?: string
  deviation?: string
}

export interface RoutingParallelGroup {
  id: string
  routing_id: string
  routing_name: string
  operations: string[]
  merge_rule: string
  remark?: string
}

export interface RoutingParallelQuery {
  pageNum: number
  pageSize: number
  routingName?: string
  mergeRule?: string
}

export function getRoutingList(params: RoutingListQuery) {
  if (isStaticMode) return staticService.getRoutingList(params) as Promise<ApiResponse<PaginatedData<RoutingOperation>>>
  return apiGet<PaginatedData<RoutingOperation>>('/routing/list', { params })
}

export function saveRouting(data: Partial<RoutingOperation | RoutingDetail>) {
  if (isStaticMode) return staticService.saveRouting(data)
  return data.id
    ? apiPut<Record<string, never>, Partial<RoutingOperation | RoutingDetail>>(`/routing/${data.id}`, data)
    : apiPost<Record<string, never>, Partial<RoutingOperation | RoutingDetail>>('/routing', data)
}

export function deleteRouting(id: string) {
  if (isStaticMode) return staticService.deleteRouting(id)
  return apiDelete<Record<string, never>>(`/routing/${id}`)
}

export function getRoutingDetail(id: string) {
  if (isStaticMode) return staticService.getRoutingDetail(id) as Promise<ApiResponse<RoutingDetail | null>>
  return apiGet<RoutingDetail>(`/routing/${id}`)
}

export function getRoutingAutoTimeList(params: RoutingAutoTimeQuery) {
  if (isStaticMode) return staticService.getRoutingAutoTimeList(params) as Promise<ApiResponse<PaginatedData<RoutingAutoTimeRecord>>>
  return apiGet<PaginatedData<RoutingAutoTimeRecord>>('/routing/auto-time', { params })
}

export function adoptRoutingAutoTime(id: string) {
  if (isStaticMode) return staticService.adoptRoutingAutoTime(id)
  return apiPost<Record<string, never>>(`/routing/auto-time/${id}/adopt`)
}

export function getRoutingParallelList(params: RoutingParallelQuery) {
  if (isStaticMode) return staticService.getRoutingParallelList(params) as Promise<ApiResponse<PaginatedData<RoutingParallelGroup>>>
  return apiGet<PaginatedData<RoutingParallelGroup>>('/routing/parallel', { params })
}

export function saveRoutingParallel(data: Partial<RoutingParallelGroup>) {
  if (isStaticMode) return staticService.saveRoutingParallel(data)
  return data.id
    ? apiPut<Record<string, never>, Partial<RoutingParallelGroup>>(`/routing/parallel/${data.id}`, data)
    : apiPost<Record<string, never>, Partial<RoutingParallelGroup>>('/routing/parallel', data)
}

export function deleteRoutingParallel(id: string) {
  if (isStaticMode) return staticService.deleteRoutingParallel(id)
  return apiDelete<Record<string, never>>(`/routing/parallel/${id}`)
}
