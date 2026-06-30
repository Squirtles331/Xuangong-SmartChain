import { isMockMode } from './_config'
import { apiDelete, apiGet, apiPost, apiPut, type ApiResponse, type PaginatedData } from './_factory'
import * as mockService from '@/mock/services/mdm'

export interface OrgNode {
  id: string
  name: string
  code?: string
  type: 'group' | 'company' | 'plant' | 'workshop' | 'line'
  children?: OrgNode[]
}

export function getOrgTree() {
  if (isMockMode) return mockService.getOrgTree()
  return apiGet<OrgNode[]>('/mdm/org-tree')
}

export interface OrgListItem {
  id: string
  name: string
  code: string
  type: OrgNode['type']
  parentName: string
  childCount: number
}

export interface OrgTreeQuery {
  pageNum?: number
  pageSize?: number
  keyword?: string
  type?: OrgNode['type'] | ''
  nodeId?: string
}

export function getOrgNodeDetail(id: string) {
  if (isMockMode) return mockService.getOrgNodeDetail(id)
  return apiGet<OrgNode>(`/mdm/org-tree/${id}`)
}

export function getOrgTreeList(params?: OrgTreeQuery) {
  if (isMockMode) return mockService.getOrgTreeList(params) as Promise<ApiResponse<PaginatedData<OrgListItem>>>
  return apiGet<PaginatedData<OrgListItem>>('/mdm/org-tree/list', { params })
}

export function createOrgNode(data: Partial<OrgNode> & { parentId?: string }) {
  if (isMockMode) return mockService.createOrgNode(data)
  return apiPost<Record<string, never>, Partial<OrgNode> & { parentId?: string }>('/mdm/org-tree', data)
}

export function updateOrgNode(id: string, data: Partial<OrgNode>) {
  if (isMockMode) return mockService.updateOrgNode(id, data)
  return apiPut<Record<string, never>, Partial<OrgNode>>(`/mdm/org-tree/${id}`, data)
}

export function deleteOrgNode(id: string) {
  if (isMockMode) return mockService.deleteOrgNode(id)
  return apiDelete<Record<string, never>>(`/mdm/org-tree/${id}`)
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
  category?: string
}

export interface MaterialQuery {
  pageNum: number
  pageSize: number
  code?: string
  name?: string
  type?: string
  category?: string
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

export interface Resource {
  id: string
  code: string
  name: string
  type: string
  model: string
  status: 'running' | 'idle' | 'repair'
  workCenter: string
}

export interface ResourceQuery {
  pageNum: number
  pageSize: number
  keyword?: string
  status?: Resource['status']
}

export function getResourceList(params: ResourceQuery) {
  if (isMockMode) return mockService.getResourceList(params) as Promise<ApiResponse<PaginatedData<Resource>>>
  return apiGet<PaginatedData<Resource>>('/mdm/resources', { params })
}

export function createResource(data: Partial<Resource>) {
  if (isMockMode) return mockService.createResource(data)
  return apiPost<Record<string, never>, Partial<Resource>>('/mdm/resources', data)
}

export function updateResource(id: string, data: Partial<Resource>) {
  if (isMockMode) return mockService.updateResource(id, data)
  return apiPut<Record<string, never>, Partial<Resource>>(`/mdm/resources/${id}`, data)
}

export function deleteResource(id: string) {
  if (isMockMode) return mockService.deleteResource(id)
  return apiDelete<Record<string, never>>(`/mdm/resources/${id}`)
}

export interface WorkCenter {
  id: string
  code: string
  name: string
  workshop: string
  shift: string
  people: number
  efficiency: number
  costPerHour: number
  status: 'running' | 'idle' | 'repair'
}

export interface WorkCenterQuery {
  pageNum: number
  pageSize: number
  keyword?: string
  workshop?: string
}

export function getWorkCenterList(params: WorkCenterQuery) {
  if (isMockMode) return mockService.getWorkCenterList(params) as Promise<ApiResponse<PaginatedData<WorkCenter>>>
  return apiGet<PaginatedData<WorkCenter>>('/mdm/work-centers', { params })
}

export function createWorkCenter(data: Partial<WorkCenter>) {
  if (isMockMode) return mockService.createWorkCenter(data)
  return apiPost<Record<string, never>, Partial<WorkCenter>>('/mdm/work-centers', data)
}

export function updateWorkCenter(id: string, data: Partial<WorkCenter>) {
  if (isMockMode) return mockService.updateWorkCenter(id, data)
  return apiPut<Record<string, never>, Partial<WorkCenter>>(`/mdm/work-centers/${id}`, data)
}

export function deleteWorkCenter(id: string) {
  if (isMockMode) return mockService.deleteWorkCenter(id)
  return apiDelete<Record<string, never>>(`/mdm/work-centers/${id}`)
}

export interface Mold {
  id: string
  code: string
  name: string
  type: string
  lifeDesign: number
  used: number
  status: 'using' | 'idle' | 'maintain'
}

export interface MoldQuery {
  pageNum: number
  pageSize: number
  keyword?: string
  type?: string
  status?: Mold['status']
}

export function getMoldList(params: MoldQuery) {
  if (isMockMode) return mockService.getMoldList(params) as Promise<ApiResponse<PaginatedData<Mold>>>
  return apiGet<PaginatedData<Mold>>('/mdm/molds', { params })
}

export function createMold(data: Partial<Mold>) {
  if (isMockMode) return mockService.createMold(data)
  return apiPost<Record<string, never>, Partial<Mold>>('/mdm/molds', data)
}

export function updateMold(id: string, data: Partial<Mold>) {
  if (isMockMode) return mockService.updateMold(id, data)
  return apiPut<Record<string, never>, Partial<Mold>>(`/mdm/molds/${id}`, data)
}

export function deleteMold(id: string) {
  if (isMockMode) return mockService.deleteMold(id)
  return apiDelete<Record<string, never>>(`/mdm/molds/${id}`)
}
