import { isMockMode } from './_config'
import { apiDelete, apiGet, apiPost, apiPut, type ApiResponse, type PaginatedData } from './_factory'
import * as mockService from '@/mock/services/mdm'

export interface OrgNode {
  id: string
  name: string
  type: 'group' | 'company' | 'plant' | 'workshop' | 'line'
  children?: OrgNode[]
}

export function getOrgTree() {
  if (isMockMode) return mockService.getOrgTree()
  return apiGet<OrgNode[]>('/mdm/org-tree')
}

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
  pageNum: number
  pageSize: number
  code?: string
  name?: string
  type?: string
}

export function getMaterialTree() {
  if (isMockMode) return mockService.getMaterialTree()
  return apiGet<MaterialCategory[]>('/mdm/material-tree')
}

export function getMaterialList(params: MaterialQuery) {
  if (isMockMode) return mockService.getMaterialList(params) as Promise<ApiResponse<PaginatedData<Material>>>
  return apiGet<PaginatedData<Material>>('/mdm/materials', { params })
}

export function createMaterial(data: Partial<Material>) {
  if (isMockMode) return mockService.createMaterial(data)
  return apiPost<Record<string, never>, Partial<Material>>('/mdm/materials', data)
}

export function updateMaterial(id: string, data: Partial<Material>) {
  if (isMockMode) return mockService.updateMaterial(id, data)
  return apiPut<Record<string, never>, Partial<Material>>(`/mdm/materials/${id}`, data)
}

export function deleteMaterial(id: string) {
  if (isMockMode) return mockService.deleteMaterial(id)
  return apiDelete<Record<string, never>>(`/mdm/materials/${id}`)
}

export interface Equipment {
  id: string
  code: string
  name: string
  model: string
  workshop: string
  status: 'running' | 'idle' | 'repair' | 'maintenance'
  purchase_date?: string
  commission_date?: string
}

export interface EquipmentQuery {
  pageNum: number
  pageSize: number
  name?: string
  workshop?: string
  status?: string
}

export function getEquipmentList(params: EquipmentQuery) {
  if (isMockMode) return mockService.getEquipmentList(params) as Promise<ApiResponse<PaginatedData<Equipment>>>
  return apiGet<PaginatedData<Equipment>>('/mdm/equipments', { params })
}

export function createEquipment(data: Partial<Equipment>) {
  if (isMockMode) return mockService.createEquipment(data)
  return apiPost<Record<string, never>, Partial<Equipment>>('/mdm/equipments', data)
}

export function updateEquipment(id: string, data: Partial<Equipment>) {
  if (isMockMode) return mockService.updateEquipment(id, data)
  return apiPut<Record<string, never>, Partial<Equipment>>(`/mdm/equipments/${id}`, data)
}

export function deleteEquipment(id: string) {
  if (isMockMode) return mockService.deleteEquipment(id)
  return apiDelete<Record<string, never>>(`/mdm/equipments/${id}`)
}

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
  return apiGet<WorkCenter[]>('/mdm/work-centers')
}

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
  return apiGet<Mold[]>('/mdm/molds')
}
