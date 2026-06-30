import { isMockMode } from './_config'
import { apiDelete, apiGet, apiPost, apiPut, type ApiResponse, type PaginatedData } from './_factory'
import * as mockService from '@/mock/services/system'

export interface LoginParams {
  tenant_id: string
  username: string
  password: string
}

export interface LoginResult {
  access_token: string
  refresh_token: string
  expires_in: number
  user_info: {
    id: string
    username: string
    real_name: string
    avatar?: string
    roles: string[]
    permissions: string[]
  }
}

export function login(params: LoginParams) {
  return apiPost<LoginResult, LoginParams>('/auth/login', params)
}

export function logout() {
  return apiPost<null>('/auth/logout')
}

export function refreshToken(refreshToken: string) {
  return apiPost<{ access_token: string; refresh_token: string }, { refresh_token: string }>('/auth/refresh', { refresh_token: refreshToken })
}

export interface SysUser {
  id: string
  username: string
  realName: string
  email: string
  phone: string
  departmentId?: string
  status: 1 | 0
  roles: string[]
  createdAt: string
}

export interface UserQuery {
  pageNum: number
  pageSize: number
  username?: string
  realName?: string
  role?: string
  status?: SysUser['status']
}

export function getUserList(params: UserQuery) {
  if (isMockMode) return mockService.getUserList(params) as Promise<ApiResponse<PaginatedData<SysUser>>>
  return apiGet<PaginatedData<SysUser>>('/system/users', { params })
}

export function createUser(data: Partial<SysUser>) {
  if (isMockMode) return mockService.createUser(data)
  return apiPost<SysUser, Partial<SysUser>>('/system/users', data)
}

export function updateUser(id: string, data: Partial<SysUser>) {
  if (isMockMode) return mockService.updateUser(id, data)
  return apiPut<SysUser, Partial<SysUser>>(`/system/users/${id}`, data)
}

export function deleteUser(id: string) {
  if (isMockMode) return mockService.deleteUser(id)
  return apiDelete<Record<string, never>>(`/system/users/${id}`)
}

export function resetUserPassword(id: string, password: string) {
  return apiPut<null, { password: string }>(`/system/users/${id}/reset-password`, { password })
}

export interface SysRole {
  id: string
  code: string
  name: string
  description: string
  status: 'active' | 'disabled'
  permissionIds: string[]
  userCount: number
}

export interface RoleQuery {
  pageNum: number
  pageSize: number
  name?: string
}

export function getRoleList(params: RoleQuery) {
  if (isMockMode) return mockService.getRoleList(params) as Promise<ApiResponse<PaginatedData<SysRole>>>
  return apiGet<PaginatedData<SysRole>>('/system/roles', { params })
}

export function createRole(data: Partial<SysRole>) {
  if (isMockMode) return mockService.createRole(data)
  return apiPost<SysRole, Partial<SysRole>>('/system/roles', data)
}

export function updateRole(id: string, data: Partial<SysRole>) {
  if (isMockMode) return mockService.updateRole(id, data)
  return apiPut<SysRole, Partial<SysRole>>(`/system/roles/${id}`, data)
}

export function deleteRole(id: string) {
  if (isMockMode) return mockService.deleteRole(id)
  return apiDelete<null>(`/system/roles/${id}`)
}

export interface SysMenu {
  id: string
  parentId: string | null
  name: string
  type: 'directory' | 'menu' | 'button'
  path?: string
  component?: string
  permissionCode: string
  icon?: string
  sortOrder: number
  visible: boolean
  children?: SysMenu[]
}

export function getMenuTree() {
  if (isMockMode) return mockService.getMenuTree() as Promise<ApiResponse<SysMenu[]>>
  return apiGet<SysMenu[]>('/system/menus/tree')
}

export function createMenu(data: Partial<SysMenu>) {
  if (isMockMode) return mockService.createMenu(data)
  return apiPost<SysMenu, Partial<SysMenu>>('/system/menus', data)
}

export function updateMenu(id: string, data: Partial<SysMenu>) {
  if (isMockMode) return mockService.updateMenu(id, data)
  return apiPut<SysMenu, Partial<SysMenu>>(`/system/menus/${id}`, data)
}

export function deleteMenu(id: string) {
  if (isMockMode) return mockService.deleteMenu(id)
  return apiDelete<null>(`/system/menus/${id}`)
}

export interface DictType {
  id: string
  code: string
  name: string
  description: string
  status: 'active' | 'disabled'
}

export interface DictItem {
  id: string
  dictTypeCode: string
  dictTypeId: string
  code: string
  name: string
  sortOrder: number
  cssClass?: string
  status: 'active' | 'disabled'
}

export interface DictTypeQuery {
  pageNum: number
  pageSize: number
  keyword?: string
}

export function getDictTypeList(params: DictTypeQuery) {
  if (isMockMode) return mockService.getDictTypeList(params) as Promise<ApiResponse<PaginatedData<DictType>>>
  return apiGet<PaginatedData<DictType>>('/system/dict-types', { params })
}

export function getDictItems(dictTypeCode: string) {
  if (isMockMode) return mockService.getDictItems(dictTypeCode) as Promise<ApiResponse<DictItem[]>>
  return apiGet<DictItem[]>(`/system/dict-items/${dictTypeCode}`)
}

export function createDictType(data: Partial<DictType>) {
  if (isMockMode) return mockService.createDictType(data)
  return apiPost<DictType, Partial<DictType>>('/system/dict-types', data)
}

export function createDictItem(data: Partial<DictItem>) {
  if (isMockMode) return mockService.createDictItem(data)
  return apiPost<DictItem, Partial<DictItem>>('/system/dict-items', data)
}

export function updateDictItem(id: string, data: Partial<DictItem>) {
  if (isMockMode) return mockService.updateDictItem(id, data)
  return apiPut<DictItem, Partial<DictItem>>(`/system/dict-items/${id}`, data)
}

export function deleteDictItem(id: string) {
  if (isMockMode) return mockService.deleteDictItem(id)
  return apiDelete<null>(`/system/dict-items/${id}`)
}

export interface AuditLog {
  id: string
  userName: string
  module: string
  action: string
  target: string
  ip: string
  requestParams?: string
  createdAt: string
}

export interface AuditLogQuery {
  pageNum: number
  pageSize: number
  userName?: string
  module?: string
  action?: string
  startDate?: string
  endDate?: string
}

export function getAuditLogs(params: AuditLogQuery) {
  if (isMockMode) return mockService.getAuditLogs(params) as Promise<ApiResponse<PaginatedData<AuditLog>>>
  return apiGet<PaginatedData<AuditLog>>('/system/audit-logs', { params })
}

export interface SystemParam {
  id: string
  code: string
  name: string
  value: string
  defaultValue: string
  description: string
  category: string
  valueType: 'string' | 'number' | 'boolean' | 'json'
  status: 'active' | 'disabled'
  updatedAt: string
  updatedBy: string
}

export interface SystemParamQuery {
  pageNum: number
  pageSize: number
  category?: string
  keyword?: string
  status?: string
}

export function getSystemParams(params?: Partial<SystemParamQuery>) {
  if (isMockMode) return mockService.getSystemParams(params) as Promise<ApiResponse<PaginatedData<SystemParam>>>
  return apiGet<PaginatedData<SystemParam>>('/system/params', { params })
}

export function updateSystemParam(id: string, value: string) {
  if (isMockMode) return mockService.updateSystemParam(id, value)
  return apiPut<SystemParam, { value: string }>(`/system/params/${id}`, { value })
}

export function batchUpdateSystemParams(updates: { id: string; value: string }[]) {
  if (isMockMode) return mockService.batchUpdateSystemParams(updates)
  return apiPut<null, { updates: { id: string; value: string }[] }>('/system/params/batch', { updates })
}

export function resetSystemParam(id: string) {
  if (isMockMode) return mockService.resetSystemParam(id)
  return apiPut<SystemParam>(`/system/params/${id}/reset`)
}

export interface CodeRule {
  id: string
  code: string
  name: string
  prefix: string
  dateFormat: string
  serialLength: number
  example: string
}

export function getCodeRules() {
  if (isMockMode) return mockService.getCodeRules() as Promise<ApiResponse<CodeRule[]>>
  return apiGet<CodeRule[]>('/system/code-rules')
}

export function createCodeRule(data: Partial<CodeRule>) {
  if (isMockMode) return mockService.createCodeRule(data)
  return apiPost<CodeRule, Partial<CodeRule>>('/system/code-rules', data)
}

export function updateCodeRule(id: string, data: Partial<CodeRule>) {
  if (isMockMode) return mockService.updateCodeRule(id, data)
  return apiPut<CodeRule, Partial<CodeRule>>(`/system/code-rules/${id}`, data)
}

export function deleteCodeRule(id: string) {
  if (isMockMode) return mockService.deleteCodeRule(id)
  return apiDelete<null>(`/system/code-rules/${id}`)
}

export interface ApprovalFlow {
  id: string
  name: string
  businessType: string
  nodes: string[]
  status: 'active' | 'disabled'
}

export function getApprovalFlows() {
  if (isMockMode) return mockService.getApprovalFlows() as Promise<ApiResponse<ApprovalFlow[]>>
  return apiGet<ApprovalFlow[]>('/system/approval-flows')
}

export function createApprovalFlow(data: Partial<ApprovalFlow>) {
  if (isMockMode) return mockService.createApprovalFlow(data)
  return apiPost<ApprovalFlow, Partial<ApprovalFlow>>('/system/approval-flows', data)
}

export function updateApprovalFlow(id: string, data: Partial<ApprovalFlow>) {
  if (isMockMode) return mockService.updateApprovalFlow(id, data)
  return apiPut<ApprovalFlow, Partial<ApprovalFlow>>(`/system/approval-flows/${id}`, data)
}

export function deleteApprovalFlow(id: string) {
  if (isMockMode) return mockService.deleteApprovalFlow(id)
  return apiDelete<null>(`/system/approval-flows/${id}`)
}
