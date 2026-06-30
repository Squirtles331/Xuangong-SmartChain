import { isMockMode } from './_config'
import { apiGet } from './_factory'
import * as mockService from '@/mock/services/ehs'

export function getEhsHazardList(params: { pageNum: number; pageSize: number; keyword?: string; level?: string; status?: string }) {
  if (isMockMode) return mockService.getEhsHazardList(params)
  return apiGet<any>('/ehs/hazards', { params })
}

export function getEhsEmergencyList(params: { pageNum: number; pageSize: number; name?: string; type?: string }) {
  if (isMockMode) return mockService.getEhsEmergencyList(params)
  return apiGet<any>('/ehs/emergency', { params })
}

export function getEhsPermitList(params: { pageNum: number; pageSize: number; keyword?: string; type?: string; status?: string }) {
  if (isMockMode) return mockService.getEhsPermitList(params)
  return apiGet<any>('/ehs/permits', { params })
}

export function getEhsTrainingList(params: { pageNum: number; pageSize: number; title?: string; status?: string }) {
  if (isMockMode) return mockService.getEhsTrainingList(params)
  return apiGet<any>('/ehs/training', { params })
}
