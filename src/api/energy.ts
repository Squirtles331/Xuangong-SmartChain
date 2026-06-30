import { isMockMode } from './_config'
import { apiDelete, apiGet, apiPost, apiPut, type ApiResponse, type PaginatedData } from './_factory'
import * as mockService from '@/mock/services/energy'

export interface EnergyDetail {
  id: string
  workshop: string
  type: '电' | '水' | '气'
  usage: number
  unit: string
  cost: number
  period: string
  rate: number
}

export interface EnergyDetailQuery {
  pageNum: number
  pageSize: number
  keyword?: string
  type?: 'electricity' | 'water' | 'gas'
  period?: string
}

export function getEnergyDetailList(params: EnergyDetailQuery) {
  if (isMockMode) return mockService.getEnergyDetailList(params) as Promise<ApiResponse<PaginatedData<EnergyDetail>>>
  return apiGet<PaginatedData<EnergyDetail>>('/energy/details', { params })
}

export function saveEnergyDetail(data: Partial<EnergyDetail> & { type?: 'electricity' | 'water' | 'gas' | '电' | '水' | '气' }) {
  if (isMockMode) return mockService.saveEnergyDetail(data)
  return data.id
    ? apiPut<EnergyDetail, Partial<EnergyDetail>>(`/energy/details/${data.id}`, data)
    : apiPost<EnergyDetail, Partial<EnergyDetail>>('/energy/details', data)
}

export function deleteEnergyDetail(id: string) {
  if (isMockMode) return mockService.deleteEnergyDetail(id)
  return apiDelete<Record<string, never>>(`/energy/details/${id}`)
}

export interface EnergyOverviewCard {
  title: string
  value: number
  unit: string
  trend: number
}

export interface EnergyOverviewTrendItem {
  period: string
  electricity: number
  water: number
  gas: number
}

export interface EnergyOverviewData {
  cards: EnergyOverviewCard[]
  trend: EnergyOverviewTrendItem[]
  structure: Array<{ name: string; value: number }>
}

export function getEnergyOverview(params?: { start?: string; end?: string }) {
  if (isMockMode) return mockService.getEnergyOverview(params) as Promise<ApiResponse<EnergyOverviewData>>
  return apiGet<EnergyOverviewData>('/energy/overview', { params })
}

export interface EnergyBenchmarkItem {
  unit: string
  xLabels: string[]
  actual: number[]
  benchmark: number[]
  advanced: number[]
}

export interface EnergyBenchmarkData {
  electric: EnergyBenchmarkItem
  water: EnergyBenchmarkItem
  gas: EnergyBenchmarkItem
}

export function getEnergyBenchmark() {
  if (isMockMode) return mockService.getEnergyBenchmark() as Promise<ApiResponse<EnergyBenchmarkData>>
  return apiGet<EnergyBenchmarkData>('/energy/benchmark')
}
