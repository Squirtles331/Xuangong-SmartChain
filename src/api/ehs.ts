import { isMockMode } from './_config'
import { apiDelete, apiGet, apiPost, apiPut, type ApiResponse, type PaginatedData } from './_factory'
import * as mockService from '@/mock/services/ehs'

export interface EhsHazard {
  id: string
  code: string
  location: string
  desc: string
  level: 'major' | 'moderate' | 'minor'
  status: 'open' | 'processing' | 'closed'
  finder: string
  found_at: string
}

export interface EhsHazardQuery {
  pageNum: number
  pageSize: number
  keyword?: string
  level?: EhsHazard['level']
  status?: EhsHazard['status']
}

export function getEhsHazardList(params: EhsHazardQuery) {
  if (isMockMode) return mockService.getEhsHazardList(params) as Promise<ApiResponse<PaginatedData<EhsHazard>>>
  return apiGet<PaginatedData<EhsHazard>>('/ehs/hazards', { params })
}

export function saveEhsHazard(data: Partial<EhsHazard>) {
  if (isMockMode) return mockService.saveEhsHazard(data)
  return data.id
    ? apiPut<EhsHazard, Partial<EhsHazard>>(`/ehs/hazards/${data.id}`, data)
    : apiPost<EhsHazard, Partial<EhsHazard>>('/ehs/hazards', data)
}

export function deleteEhsHazard(id: string) {
  if (isMockMode) return mockService.deleteEhsHazard(id)
  return apiDelete<Record<string, never>>(`/ehs/hazards/${id}`)
}

export interface EhsEmergencyPlan {
  id: string
  name: string
  type: '火灾' | '危化品' | '机械' | '电力' | '其他'
  level: 'I' | 'II' | 'III'
  responsible: string
  last_drill: string
}

export interface EhsEmergencyQuery {
  pageNum: number
  pageSize: number
  name?: string
  type?: EhsEmergencyPlan['type']
}

export function getEhsEmergencyList(params: EhsEmergencyQuery) {
  if (isMockMode) return mockService.getEhsEmergencyList(params) as Promise<ApiResponse<PaginatedData<EhsEmergencyPlan>>>
  return apiGet<PaginatedData<EhsEmergencyPlan>>('/ehs/emergency', { params })
}

export function saveEhsEmergency(data: Partial<EhsEmergencyPlan>) {
  if (isMockMode) return mockService.saveEhsEmergency(data)
  return data.id
    ? apiPut<EhsEmergencyPlan, Partial<EhsEmergencyPlan>>(`/ehs/emergency/${data.id}`, data)
    : apiPost<EhsEmergencyPlan, Partial<EhsEmergencyPlan>>('/ehs/emergency', data)
}

export function runEhsEmergencyDrill(id: string) {
  if (isMockMode) return mockService.runEhsEmergencyDrill(id)
  return apiPost<Record<string, never>, Record<string, never>>(`/ehs/emergency/${id}/drill`, {})
}

export interface EhsPermit {
  id: string
  code: string
  type: 'hot' | 'height' | 'confined' | 'electric'
  location: string
  applicant: string
  apply_date: string
  status: 'pending' | 'approved' | 'closed'
}

export interface EhsPermitQuery {
  pageNum: number
  pageSize: number
  keyword?: string
  type?: EhsPermit['type']
  status?: EhsPermit['status']
}

export function getEhsPermitList(params: EhsPermitQuery) {
  if (isMockMode) return mockService.getEhsPermitList(params) as Promise<ApiResponse<PaginatedData<EhsPermit>>>
  return apiGet<PaginatedData<EhsPermit>>('/ehs/permits', { params })
}

export function saveEhsPermit(data: Partial<EhsPermit>) {
  if (isMockMode) return mockService.saveEhsPermit(data)
  return data.id
    ? apiPut<EhsPermit, Partial<EhsPermit>>(`/ehs/permits/${data.id}`, data)
    : apiPost<EhsPermit, Partial<EhsPermit>>('/ehs/permits', data)
}

export function deleteEhsPermit(id: string) {
  if (isMockMode) return mockService.deleteEhsPermit(id)
  return apiDelete<Record<string, never>>(`/ehs/permits/${id}`)
}

export interface EhsTraining {
  id: string
  title: string
  trainer: string
  trainees: string
  plan_date: string
  status: 'pending' | 'completed' | 'expired'
}

export interface EhsTrainingQuery {
  pageNum: number
  pageSize: number
  title?: string
  status?: EhsTraining['status']
}

export function getEhsTrainingList(params: EhsTrainingQuery) {
  if (isMockMode) return mockService.getEhsTrainingList(params) as Promise<ApiResponse<PaginatedData<EhsTraining>>>
  return apiGet<PaginatedData<EhsTraining>>('/ehs/training', { params })
}

export function saveEhsTraining(data: Partial<EhsTraining>) {
  if (isMockMode) return mockService.saveEhsTraining(data)
  return data.id
    ? apiPut<EhsTraining, Partial<EhsTraining>>(`/ehs/training/${data.id}`, data)
    : apiPost<EhsTraining, Partial<EhsTraining>>('/ehs/training', data)
}

export function completeEhsTraining(id: string) {
  if (isMockMode) return mockService.completeEhsTraining(id)
  return apiPost<Record<string, never>, Record<string, never>>(`/ehs/training/${id}/complete`, {})
}
