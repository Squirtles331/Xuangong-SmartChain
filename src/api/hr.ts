import * as staticService from '@/static/services/hr'
import { isStaticMode } from './_config'
import { apiDelete, apiGet, apiPost, apiPut, type ApiResponse, type PaginatedData } from './_factory'

export type HrEmployeeStatus = 'active' | 'inactive'
export type HrAttendanceResult = 'normal' | 'late' | 'absent'
export type HrShiftType = 'day' | 'night' | 'middle'

export interface HrEmployee {
  id: string
  code: string
  name: string
  department: string
  position: string
  phone: string
  hire_date: string
  status: HrEmployeeStatus
}

export interface HrEmployeeQuery {
  pageNum: number
  pageSize: number
  keyword?: string
  department?: string
  status?: HrEmployeeStatus
}

export interface HrAttendanceRecord {
  id: string
  employee: string
  date: string
  clock_in: string
  clock_out: string
  result: HrAttendanceResult
}

export interface HrAttendanceQuery {
  pageNum: number
  pageSize: number
  employee?: string
  date?: string
  result?: HrAttendanceResult
}

export interface HrPieceworkRule {
  id: string
  operation: string
  unit_price: number
  unit: string
  qualified_bonus: number
  defective_penalty: number
}

export interface HrPieceworkQuery {
  pageNum: number
  pageSize: number
  keyword?: string
}

export interface HrPieceworkSummaryCard {
  title: string
  value: number
  trend: number
}

export interface HrScheduleRecord {
  id: string
  team: string
  shift: HrShiftType
  members: string
  leader: string
}

export interface HrScheduleQuery {
  pageNum: number
  pageSize: number
  team?: string
  shift?: HrShiftType
}

export interface HrSkillTreeNode {
  id: string
  name: string
  children?: HrSkillTreeNode[]
}

export interface HrSkillItem {
  id: string
  skill_name: string
  level: number
  cert_number: string
  expire_date: string
}

export interface HrSkillMatrixData {
  employees: HrSkillTreeNode[]
  skillsByEmployee: Record<string, HrSkillItem[]>
}

export function getHrEmployeeList(params: HrEmployeeQuery) {
  if (isStaticMode) return staticService.getHrEmployeeList(params) as Promise<ApiResponse<PaginatedData<HrEmployee>>>
  return apiGet<PaginatedData<HrEmployee>>('/hr/employees', { params })
}

export function createHrEmployee(data: Partial<HrEmployee>) {
  if (isStaticMode) return staticService.createHrEmployee(data)
  return apiPost<Record<string, never>, Partial<HrEmployee>>('/hr/employees', data)
}

export function updateHrEmployee(id: string, data: Partial<HrEmployee>) {
  if (isStaticMode) return staticService.updateHrEmployee(id, data)
  return apiPut<Record<string, never>, Partial<HrEmployee>>(`/hr/employees/${id}`, data)
}

export function deleteHrEmployee(id: string) {
  if (isStaticMode) return staticService.deleteHrEmployee(id)
  return apiDelete<Record<string, never>>(`/hr/employees/${id}`)
}

export function getHrAttendanceList(params: HrAttendanceQuery) {
  if (isStaticMode) return staticService.getHrAttendanceList(params) as Promise<ApiResponse<PaginatedData<HrAttendanceRecord>>>
  return apiGet<PaginatedData<HrAttendanceRecord>>('/hr/attendance', { params })
}

export function createHrAttendance(data: Partial<HrAttendanceRecord>) {
  if (isStaticMode) return staticService.createHrAttendance(data)
  return apiPost<Record<string, never>, Partial<HrAttendanceRecord>>('/hr/attendance', data)
}

export function updateHrAttendance(id: string, data: Partial<HrAttendanceRecord>) {
  if (isStaticMode) return staticService.updateHrAttendance(id, data)
  return apiPut<Record<string, never>, Partial<HrAttendanceRecord>>(`/hr/attendance/${id}`, data)
}

export function deleteHrAttendance(id: string) {
  if (isStaticMode) return staticService.deleteHrAttendance(id)
  return apiDelete<Record<string, never>>(`/hr/attendance/${id}`)
}

export function getHrPieceworkList(params: HrPieceworkQuery) {
  if (isStaticMode) return staticService.getHrPieceworkList(params) as Promise<ApiResponse<PaginatedData<HrPieceworkRule>>>
  return apiGet<PaginatedData<HrPieceworkRule>>('/hr/piecework', { params })
}

export function createHrPiecework(data: Partial<HrPieceworkRule>) {
  if (isStaticMode) return staticService.createHrPiecework(data)
  return apiPost<Record<string, never>, Partial<HrPieceworkRule>>('/hr/piecework', data)
}

export function updateHrPiecework(id: string, data: Partial<HrPieceworkRule>) {
  if (isStaticMode) return staticService.updateHrPiecework(id, data)
  return apiPut<Record<string, never>, Partial<HrPieceworkRule>>(`/hr/piecework/${id}`, data)
}

export function getHrPieceworkSummary() {
  if (isStaticMode) return staticService.getHrPieceworkSummary() as Promise<ApiResponse<HrPieceworkSummaryCard[]>>
  return apiGet<HrPieceworkSummaryCard[]>('/hr/piecework/summary')
}

export function getHrScheduleList(params: HrScheduleQuery) {
  if (isStaticMode) return staticService.getHrScheduleList(params) as Promise<ApiResponse<PaginatedData<HrScheduleRecord>>>
  return apiGet<PaginatedData<HrScheduleRecord>>('/hr/schedule', { params })
}

export function createHrSchedule(data: Partial<HrScheduleRecord>) {
  if (isStaticMode) return staticService.createHrSchedule(data)
  return apiPost<Record<string, never>, Partial<HrScheduleRecord>>('/hr/schedule', data)
}

export function updateHrSchedule(id: string, data: Partial<HrScheduleRecord>) {
  if (isStaticMode) return staticService.updateHrSchedule(id, data)
  return apiPut<Record<string, never>, Partial<HrScheduleRecord>>(`/hr/schedule/${id}`, data)
}

export function deleteHrSchedule(id: string) {
  if (isStaticMode) return staticService.deleteHrSchedule(id)
  return apiDelete<Record<string, never>>(`/hr/schedule/${id}`)
}

export function getSkillMatrixData() {
  if (isStaticMode) return staticService.getSkillMatrixData() as Promise<ApiResponse<HrSkillMatrixData>>
  return apiGet<HrSkillMatrixData>('/hr/skill-matrix')
}
