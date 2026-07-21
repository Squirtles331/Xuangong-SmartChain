import * as staticService from '@/static/services/equipment'
import { isStaticMode } from './_config'
import { apiGet, apiPost, apiPut, type ApiResponse, type PaginatedData } from './_factory'

export interface EquipmentOeeOverviewData {
  cards: Array<{ title: string; value: number }>
  rankData: Array<{ equipment: string; oee: string; utilization: string; performance: string; quality: string }>
  trendData: {
    months: string[]
    oee: number[]
    utilization: number[]
    performance: number[]
    quality: number[]
  }
}

export function getEquipmentOeeOverview(params?: { start_month?: string; end_month?: string }) {
  if (isStaticMode) return staticService.getEquipmentOeeOverview(params) as Promise<ApiResponse<EquipmentOeeOverviewData>>
  return apiGet<EquipmentOeeOverviewData>('/equipment/oee/overview', { params })
}

export interface EquipmentRepair {
  id: string
  code: string
  equipment: string
  fault_desc: string
  priority: 'urgent' | 'high' | 'normal'
  status: 'pending' | 'running' | 'done'
  worker: string
  created_at: string
}

export interface EquipmentRepairQuery {
  pageNum: number
  pageSize: number
  keyword?: string
  status?: EquipmentRepair['status']
  priority?: EquipmentRepair['priority']
}

export function getEquipmentRepairList(params: EquipmentRepairQuery) {
  if (isStaticMode) return staticService.getEquipmentRepairList(params) as Promise<ApiResponse<PaginatedData<EquipmentRepair>>>
  return apiGet<PaginatedData<EquipmentRepair>>('/equipment/repair', { params })
}

export function saveEquipmentRepair(data: Partial<EquipmentRepair>) {
  if (isStaticMode) return staticService.saveEquipmentRepair(data)
  return data.id
    ? apiPut<EquipmentRepair, Partial<EquipmentRepair>>(`/equipment/repair/${data.id}`, data)
    : apiPost<EquipmentRepair, Partial<EquipmentRepair>>('/equipment/repair', data)
}

export function updateEquipmentRepairStatus(id: string, data: { status: EquipmentRepair['status']; worker?: string }) {
  if (isStaticMode) return staticService.updateEquipmentRepairStatus(id, data)
  return apiPut<EquipmentRepair, { status: EquipmentRepair['status']; worker?: string }>(`/equipment/repair/${id}/status`, data)
}

export interface EquipmentMaintain {
  id: string
  code: string
  equipment: string
  type: 'daily' | 'weekly' | 'overhaul'
  plan_date: string
  executor: string
  status: 'pending' | 'done' | 'overdue'
}

export interface EquipmentMaintainQuery {
  pageNum: number
  pageSize: number
  keyword?: string
  type?: EquipmentMaintain['type']
  status?: EquipmentMaintain['status']
}

export function getEquipmentMaintainList(params: EquipmentMaintainQuery) {
  if (isStaticMode) return staticService.getEquipmentMaintainList(params) as Promise<ApiResponse<PaginatedData<EquipmentMaintain>>>
  return apiGet<PaginatedData<EquipmentMaintain>>('/equipment/maintain', { params })
}

export function saveEquipmentMaintain(data: Partial<EquipmentMaintain>) {
  if (isStaticMode) return staticService.saveEquipmentMaintain(data)
  return data.id
    ? apiPut<EquipmentMaintain, Partial<EquipmentMaintain>>(`/equipment/maintain/${data.id}`, data)
    : apiPost<EquipmentMaintain, Partial<EquipmentMaintain>>('/equipment/maintain', data)
}

export function executeEquipmentMaintain(id: string, data: { remark?: string }) {
  if (isStaticMode) return staticService.executeEquipmentMaintain(id, data)
  return apiPost<Record<string, never>, { remark?: string }>(`/equipment/maintain/${id}/execute`, data)
}

export interface EquipmentCheck {
  id: string
  code: string
  equipment: string
  check_type: '日点检' | '周点检' | '月点检'
  plan_date: string
  executor: string
  status: 'pending' | 'done' | 'overdue'
}

export interface EquipmentCheckQuery {
  pageNum: number
  pageSize: number
  keyword?: string
  check_type?: EquipmentCheck['check_type']
  status?: EquipmentCheck['status']
}

export function getEquipmentCheckList(params: EquipmentCheckQuery) {
  if (isStaticMode) return staticService.getEquipmentCheckList(params) as Promise<ApiResponse<PaginatedData<EquipmentCheck>>>
  return apiGet<PaginatedData<EquipmentCheck>>('/equipment/check', { params })
}

export function saveEquipmentCheck(data: Partial<EquipmentCheck>) {
  if (isStaticMode) return staticService.saveEquipmentCheck(data)
  return data.id
    ? apiPut<EquipmentCheck, Partial<EquipmentCheck>>(`/equipment/check/${data.id}`, data)
    : apiPost<EquipmentCheck, Partial<EquipmentCheck>>('/equipment/check', data)
}

export function executeEquipmentCheck(id: string, data: { remark?: string }) {
  if (isStaticMode) return staticService.executeEquipmentCheck(id, data)
  return apiPost<Record<string, never>, { remark?: string }>(`/equipment/check/${id}/execute`, data)
}

export interface EquipmentSpare {
  id: string
  code: string
  name: string
  spec: string
  applicable_equipment: string
  qty: number
  safety: number
  unit: string
  location: string
}

export interface EquipmentSpareQuery {
  pageNum: number
  pageSize: number
  keyword?: string
  stock_status?: 'ok' | 'low' | 'out'
}

export function getEquipmentSpareList(params: EquipmentSpareQuery) {
  if (isStaticMode) return staticService.getEquipmentSpareList(params) as Promise<ApiResponse<PaginatedData<EquipmentSpare>>>
  return apiGet<PaginatedData<EquipmentSpare>>('/equipment/spare', { params })
}

export function saveEquipmentSpare(data: Partial<EquipmentSpare>) {
  if (isStaticMode) return staticService.saveEquipmentSpare(data)
  return data.id
    ? apiPut<EquipmentSpare, Partial<EquipmentSpare>>(`/equipment/spare/${data.id}`, data)
    : apiPost<EquipmentSpare, Partial<EquipmentSpare>>('/equipment/spare', data)
}

export function updateEquipmentSpareQty(id: string, delta: number) {
  if (isStaticMode) return staticService.updateEquipmentSpareQty(id, delta)
  return apiPut<EquipmentSpare, { delta: number }>(`/equipment/spare/${id}/qty`, { delta })
}
