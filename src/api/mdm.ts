import http from '@/utils/http'
import type { ApiResponse } from '@/utils/http'
import { isMockMode } from './_config'
import { unwrapApiResponse } from './_factory'
import * as mockService from '@/mock/services/mdm'

// ==================== 组织架构 ====================
export interface OrgNode {
  id: string
  name: string
  type: 'group' | 'company' | 'plant' | 'workshop' | 'line'
  children?: OrgNode[]
}

export function getOrgTree() {
  if (isMockMode) return mockService.getOrgTree()
  return unwrapApiResponse(http.get<ApiResponse<OrgNode[]>>('/mdm/org-tree'))
}

// ==================== 物料主数据 ====================
export interface MaterialCategory {
  id: string
  name: string
  children?: MaterialCategory[]
}

export interface Material {
  id: string
  code: string
  name: string
  spec: string
  type: 'purchased' | 'manufactured' | 'outsourced'
  unit: string
}

export interface MaterialQuery {
  page: number
  page_size: number
  code?: string
  name?: string
  type?: string
}

export function getMaterialTree() {
  if (isMockMode) return mockService.getMaterialTree()
  return unwrapApiResponse(http.get<ApiResponse<MaterialCategory[]>>('/mdm/material-tree'))
}

export function getMaterialList(params: MaterialQuery) {
  if (isMockMode) return mockService.getMaterialList(params)
  return unwrapApiResponse(http.get<ApiResponse<{ total: number; items: Material[] }>>('/mdm/materials', { params }))
}

export function createMaterial(data: Partial<Material>) {
  if (isMockMode) return mockService.createMaterial(data)
  return unwrapApiResponse(http.post<ApiResponse<null>>('/mdm/materials', data))
}

export function updateMaterial(id: string, data: Partial<Material>) {
  if (isMockMode) return mockService.updateMaterial(id, data)
  return unwrapApiResponse(http.put<ApiResponse<null>>(`/mdm/materials/${id}`, data))
}

export function deleteMaterial(id: string) {
  if (isMockMode) return mockService.deleteMaterial(id)
  return unwrapApiResponse(http.delete<ApiResponse<null>>(`/mdm/materials/${id}`))
}

// ==================== 设备管理 ====================
export interface Equipment {
  id: string
  code: string
  name: string
  model: string
  workshop: string
  status: 'running' | 'idle' | 'repair'
}

export interface EquipmentQuery {
  page: number
  page_size: number
  name?: string
  workshop?: string
  status?: string
}

export function getEquipmentList(params: EquipmentQuery) {
  if (isMockMode) return mockService.getEquipmentList(params)
  return unwrapApiResponse(http.get<ApiResponse<{ total: number; items: Equipment[] }>>('/mdm/equipments', { params }))
}

export function createEquipment(data: Partial<Equipment>) {
  if (isMockMode) return mockService.createEquipment(data)
  return unwrapApiResponse(http.post<ApiResponse<null>>('/mdm/equipments', data))
}

export function updateEquipment(id: string, data: Partial<Equipment>) {
  if (isMockMode) return mockService.updateEquipment(id, data)
  return unwrapApiResponse(http.put<ApiResponse<null>>(`/mdm/equipments/${id}`, data))
}

export function deleteEquipment(id: string) {
  if (isMockMode) return mockService.deleteEquipment(id)
  return unwrapApiResponse(http.delete<ApiResponse<null>>(`/mdm/equipments/${id}`))
}

// ==================== 工作中心 ====================
export interface WorkCenter {
  id: string
  code: string
  name: string
  workshop: string
  capacity: string
  cost: string
}

export function getWorkCenterList() {
  if (isMockMode) return mockService.getWorkCenterList()
  return unwrapApiResponse(http.get<ApiResponse<WorkCenter[]>>('/mdm/work-centers'))
}

// ==================== 模具管理 ====================
export interface Mold {
  id: string
  code: string
  name: string
  type: string
  life: string
  used: string
}

export function getMoldList() {
  if (isMockMode) return mockService.getMoldList()
  return unwrapApiResponse(http.get<ApiResponse<Mold[]>>('/mdm/molds'))
}
