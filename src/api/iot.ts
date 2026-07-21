import { isStaticMode } from './_config'
import { apiDelete, apiGet, apiPost, apiPut, type ApiResponse, type PaginatedData } from './_factory'
import * as staticService from '@/static/services/iot-api'

export type IoTConnectionStatus = 'connected' | 'disconnected'
export type IoTRuleStatus = 'active' | 'disabled'
export type IoTTriggerType = 'cycle_complete' | 'count_reached' | 'power_off' | 'continuous'
export type IoTAlertMetric = 'temp' | 'rpm' | 'vibration' | 'current'
export type IoTAlertLevel = 'critical' | 'warning' | 'info'
export type IoTAlertHistoryStatus = 'triggered' | 'recovered'

export interface IoTConfig {
  id: string
  name: string
  protocol: string
  address: string
  port: number
  interval: string
  status: IoTConnectionStatus
}

export interface IoTConfigQuery {
  pageNum: number
  pageSize: number
  keyword?: string
  protocol?: string
  status?: IoTConnectionStatus
}

export interface IoTAutoReportRule {
  id: string
  equipment: string
  trigger: IoTTriggerType
  threshold: number
  wo_field: string
  default_qty: number
  status: IoTRuleStatus
}

export interface IoTAutoReportQuery {
  pageNum: number
  pageSize: number
  equipment?: string
  status?: IoTRuleStatus
}

export interface IoTAlertRule {
  id: string
  device: string
  metric: IoTAlertMetric
  operator: string
  threshold: number
  level: IoTAlertLevel
  status: IoTRuleStatus
}

export interface IoTAlertHistoryItem {
  id: string
  device: string
  metric: IoTAlertMetric
  actual_value: number
  threshold: number
  level: IoTAlertLevel
  status: IoTAlertHistoryStatus
  triggered_at: string
  recovered_at: string
}

export interface IoTAlertHistoryQuery {
  pageNum: number
  pageSize: number
  device?: string
  level?: IoTAlertLevel
}

export interface IoTDevice {
  id: string
  name: string
  type: string
  status: 'running' | 'idle' | 'maintenance'
  rpm: number
  temp: number
  power: number
}

export interface IoTDeviceQuery {
  pageNum: number
  pageSize: number
  status?: string
  type?: string
}

export interface IoTDeviceHistoryItem {
  id: string
  device: string
  time: string
  rpm: number
  temp: number
  current: number
  vibration: number
}

export interface IoTDeviceHistoryQuery {
  pageNum: number
  pageSize: number
  device?: string
}

export function getIoTConfigList(params: IoTConfigQuery) {
  if (isStaticMode) return staticService.getIoTConfigList(params as any) as unknown as Promise<ApiResponse<PaginatedData<IoTConfig>>>
  return apiGet<PaginatedData<IoTConfig>>('/iot/configs', { params })
}

export function createIoTConfig(data: Partial<IoTConfig>) {
  if (isStaticMode) return staticService.createIoTConfig(data as any) as unknown as Promise<ApiResponse<Record<string, never>>>
  return apiPost<Record<string, never>, Partial<IoTConfig>>('/iot/configs', data)
}

export function updateIoTConfig(id: string, data: Partial<IoTConfig>) {
  if (isStaticMode) return staticService.updateIoTConfig(id, data as any) as unknown as Promise<ApiResponse<Record<string, never>>>
  return apiPut<Record<string, never>, Partial<IoTConfig>>(`/iot/configs/${id}`, data)
}

export function deleteIoTConfig(id: string) {
  if (isStaticMode) return staticService.deleteIoTConfig(id) as unknown as Promise<ApiResponse<Record<string, never>>>
  return apiDelete<Record<string, never>>(`/iot/configs/${id}`)
}

export function getIoTAutoReportList(params: IoTAutoReportQuery) {
  if (isStaticMode) return staticService.getIoTAutoReportList(params as any) as unknown as Promise<ApiResponse<PaginatedData<IoTAutoReportRule>>>
  return apiGet<PaginatedData<IoTAutoReportRule>>('/iot/auto-reports', { params })
}

export function createIoTAutoReportRule(data: Partial<IoTAutoReportRule>) {
  if (isStaticMode) return staticService.createIoTAutoReportRule(data as any) as unknown as Promise<ApiResponse<Record<string, never>>>
  return apiPost<Record<string, never>, Partial<IoTAutoReportRule>>('/iot/auto-reports', data)
}

export function updateIoTAutoReportRule(id: string, data: Partial<IoTAutoReportRule>) {
  if (isStaticMode) return staticService.updateIoTAutoReportRule(id, data as any) as unknown as Promise<ApiResponse<Record<string, never>>>
  return apiPut<Record<string, never>, Partial<IoTAutoReportRule>>(`/iot/auto-reports/${id}`, data)
}

export function getIoTAlertRuleList() {
  if (isStaticMode) return staticService.getIoTAlertRuleList() as unknown as Promise<ApiResponse<IoTAlertRule[]>>
  return apiGet<IoTAlertRule[]>('/iot/alert-rules')
}

export function createIoTAlertRule(data: Partial<IoTAlertRule>) {
  if (isStaticMode) return staticService.createIoTAlertRule(data as any) as unknown as Promise<ApiResponse<Record<string, never>>>
  return apiPost<Record<string, never>, Partial<IoTAlertRule>>('/iot/alert-rules', data)
}

export function updateIoTAlertRule(id: string, data: Partial<IoTAlertRule>) {
  if (isStaticMode) return staticService.updateIoTAlertRule(id, data as any) as unknown as Promise<ApiResponse<Record<string, never>>>
  return apiPut<Record<string, never>, Partial<IoTAlertRule>>(`/iot/alert-rules/${id}`, data)
}

export function deleteIoTAlertRule(id: string) {
  if (isStaticMode) return staticService.deleteIoTAlertRule(id) as unknown as Promise<ApiResponse<Record<string, never>>>
  return apiDelete<Record<string, never>>(`/iot/alert-rules/${id}`)
}

export function getIoTAlertHistory(params: IoTAlertHistoryQuery) {
  if (isStaticMode) return staticService.getIoTAlertHistory(params as any) as unknown as Promise<ApiResponse<PaginatedData<IoTAlertHistoryItem>>>
  return apiGet<PaginatedData<IoTAlertHistoryItem>>('/iot/alert-history', { params })
}

export function getIoTDeviceList(params: IoTDeviceQuery) {
  if (isStaticMode) return staticService.getIoTDeviceList(params as any) as unknown as Promise<ApiResponse<PaginatedData<IoTDevice>>>
  return apiGet<PaginatedData<IoTDevice>>('/iot/devices', { params })
}

export function getIoTDeviceHistory(params: IoTDeviceHistoryQuery) {
  if (isStaticMode) return staticService.getIoTDeviceHistory(params as any) as unknown as Promise<ApiResponse<PaginatedData<IoTDeviceHistoryItem>>>
  return apiGet<PaginatedData<IoTDeviceHistoryItem>>('/iot/history', { params })
}
