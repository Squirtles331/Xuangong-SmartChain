import http from '@/utils/http'
import type { ApiResponse, PaginatedData } from '@/utils/http'
import { isStaticMode } from './_config'
import { unwrapApiResponse } from './_factory'
import * as staticService from '@/static/services/aps'

export interface ApsConstraintBase {
  id: string
  code?: string
  name?: string
  applicable?: string
  life?: string
  available?: boolean
  utilization?: number
}

export interface MoldConstraint extends ApsConstraintBase {
  code: string
  name: string
  applicable: string
  life: string
  available: boolean
  utilization: number
}

export interface ToolConstraint extends ApsConstraintBase {
  code: string
  name: string
  applicable: string
  life: string
  available: boolean
  utilization: number
}

export interface SkillConstraint {
  id: string
  operation: string
  skill: string
  min_level: number
  workers_count: number
  utilization: number
}

export interface ApsConstraintSnapshot {
  molds: MoldConstraint[]
  tools: ToolConstraint[]
  skills: SkillConstraint[]
  materialShortages: Array<{
    id: string
    material: string
    wo_code: string
    available_date: string
    qty_short: number
  }>
}

export type ConstraintType = 'mold' | 'tool' | 'skill'

export interface ConstraintListQuery {
  type: ConstraintType
  pageNum: number
  pageSize: number
}

export function getApsScheduleData() {
  if (isStaticMode) return staticService.getApsScheduleSnapshot()
  return unwrapApiResponse(http.get<ApiResponse<any>>('/aps/schedule'))
}

export function runApsSchedule() {
  if (isStaticMode) return staticService.runApsSchedule()
  return unwrapApiResponse(http.post<ApiResponse<null>>('/aps/run'))
}

export function getConstraintList<T>(params: ConstraintListQuery) {
  if (isStaticMode) return staticService.getApsConstraintList(params) as Promise<ApiResponse<PaginatedData<T>>>
  return unwrapApiResponse(http.get<ApiResponse<PaginatedData<T>>>('/aps/constraints', { params }))
}

export function getApsConstraintSnapshot(): ApsConstraintSnapshot {
  return {
    molds: [],
    tools: [],
    skills: [],
    materialShortages: []
  }
}

export function saveConstraint(data: Record<string, any>) {
  if (isStaticMode) return staticService.saveApsConstraint(data as any)
  if (data.id) {
    return unwrapApiResponse(http.put<ApiResponse<null>>(`/aps/constraints/${data.id}`, data))
  }
  return unwrapApiResponse(http.post<ApiResponse<null>>('/aps/constraints', data))
}

export function deleteConstraint(type: ConstraintType, id: string) {
  if (isStaticMode) return staticService.deleteApsConstraint(type, id)
  return unwrapApiResponse(http.delete<ApiResponse<null>>(`/aps/constraints/${id}`, { params: { type } }))
}
