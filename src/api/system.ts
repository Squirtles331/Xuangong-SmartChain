import http from '@/utils/http'
import type { ApiResponse } from '@/utils/http'
import { isMockMode } from './_config'
import { unwrapApiResponse } from './_factory'
import * as mockService from '@/mock/services/system'

// ==================== 登录（始终走真实接口） ====================
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
  return unwrapApiResponse(http.post<ApiResponse<LoginResult>>('/auth/login', params))
}

export function logout() {
  return unwrapApiResponse(http.post<ApiResponse<null>>('/auth/logout'))
}

export function refreshToken(refresh_token: string) {
  return unwrapApiResponse(http.post<ApiResponse<{ access_token: string; refresh_token: string }>>('/auth/refresh', { refresh_token }))
}

// ==================== 用户管理 ====================
export interface SysUser {
  id: string
  username: string
  real_name: string
  email: string
  phone: string
  department_id?: string
  status: 'active' | 'disabled'
  roles: string[]
  created_at: string
}

export interface UserQuery {
  page: number
  page_size: number
  username?: string
  real_name?: string
  status?: string
}

export function getUserList(params: UserQuery) {
  if (isMockMode) return mockService.getUserList(params)
  return unwrapApiResponse(http.get<ApiResponse<{ total: number; items: SysUser[] }>>('/system/users', { params }))
}

export function createUser(data: Partial<SysUser>) {
  if (isMockMode) return mockService.createUser(data)
  return unwrapApiResponse(http.post<ApiResponse<null>>('/system/users', data))
}

export function updateUser(id: string, data: Partial<SysUser>) {
  if (isMockMode) return mockService.updateUser(id, data)
  return unwrapApiResponse(http.put<ApiResponse<null>>(`/system/users/${id}`, data))
}

export function deleteUser(id: string) {
  if (isMockMode) return mockService.deleteUser(id)
  return unwrapApiResponse(http.delete<ApiResponse<null>>(`/system/users/${id}`))
}

export function resetUserPassword(id: string, password: string) {
  return unwrapApiResponse(http.put<ApiResponse<null>>(`/system/users/${id}/reset-password`, { password }))
}

// ==================== 角色管理 ====================
export interface SysRole {
  id: string
  code: string
  name: string
  description: string
  status: 'active' | 'disabled'
  permission_ids: string[]
  user_count: number
}

export function getRoleList(params: { page: number; page_size: number; name?: string }) {
  if (isMockMode) return mockService.getRoleList(params)
  return unwrapApiResponse(http.get<ApiResponse<{ total: number; items: SysRole[] }>>('/system/roles', { params }))
}

export function createRole(data: Partial<SysRole>) {
  return unwrapApiResponse(http.post<ApiResponse<null>>('/system/roles', data))
}

export function updateRole(id: string, data: Partial<SysRole>) {
  return unwrapApiResponse(http.put<ApiResponse<null>>(`/system/roles/${id}`, data))
}

export function deleteRole(id: string) {
  return unwrapApiResponse(http.delete<ApiResponse<null>>(`/system/roles/${id}`))
}

// ==================== 菜单管理 ====================
export interface SysMenu {
  id: string
  parent_id: string | null
  name: string
  type: 'directory' | 'menu' | 'button'
  path?: string
  component?: string
  permission_code: string
  icon?: string
  sort_order: number
  visible: boolean
  children?: SysMenu[]
}

export function getMenuTree() {
  if (isMockMode) return mockService.getMenuTree()
  return unwrapApiResponse(http.get<ApiResponse<SysMenu[]>>('/system/menus/tree'))
}

export function createMenu(data: Partial<SysMenu>) {
  if (isMockMode) return mockService.createMenu(data)
  return unwrapApiResponse(http.post<ApiResponse<null>>('/system/menus', data))
}

export function updateMenu(id: string, data: Partial<SysMenu>) {
  if (isMockMode) return mockService.updateMenu(id, data)
  return unwrapApiResponse(http.put<ApiResponse<null>>(`/system/menus/${id}`, data))
}

export function deleteMenu(id: string) {
  if (isMockMode) return mockService.deleteMenu(id)
  return unwrapApiResponse(http.delete<ApiResponse<null>>(`/system/menus/${id}`))
}

// ==================== 字典管理 ====================
export interface DictType {
  id: string
  code: string
  name: string
  description: string
  status: 'active' | 'disabled'
}

export interface DictItem {
  id: string
  dict_type_id: string
  code: string
  name: string
  sort_order: number
  css_class?: string
  status: 'active' | 'disabled'
}

export function getDictTypeList(params: { page: number; page_size: number }) {
  if (isMockMode) return mockService.getDictTypeList(params)
  return unwrapApiResponse(http.get<ApiResponse<{ total: number; items: DictType[] }>>('/system/dict-types', { params }))
}

export function getDictItems(dictTypeCode: string) {
  if (isMockMode) return mockService.getDictItems(dictTypeCode)
  return unwrapApiResponse(http.get<ApiResponse<DictItem[]>>(`/system/dict-items/${dictTypeCode}`))
}

export function createDictType(data: Partial<DictType>) {
  if (isMockMode) return mockService.createDictType(data)
  return unwrapApiResponse(http.post<ApiResponse<null>>('/system/dict-types', data))
}

export function createDictItem(data: Partial<DictItem>) {
  if (isMockMode) return mockService.createDictItem(data)
  return unwrapApiResponse(http.post<ApiResponse<null>>('/system/dict-items', data))
}

export function updateDictItem(id: string, data: Partial<DictItem>) {
  if (isMockMode) return mockService.updateDictItem(id, data)
  return unwrapApiResponse(http.put<ApiResponse<null>>(`/system/dict-items/${id}`, data))
}

export function deleteDictItem(id: string) {
  if (isMockMode) return mockService.deleteDictItem(id)
  return unwrapApiResponse(http.delete<ApiResponse<null>>(`/system/dict-items/${id}`))
}

// ==================== 操作日志 ====================
export interface AuditLog {
  id: string
  user_name: string
  module: string
  action: string
  target: string
  ip: string
  request_params?: string
  created_at: string
}

export function getAuditLogs(params: {
  page: number
  page_size: number
  user_name?: string
  module?: string
  start_date?: string
  end_date?: string
}) {
  if (isMockMode) return mockService.getAuditLogs(params)
  return unwrapApiResponse(http.get<ApiResponse<{ total: number; items: AuditLog[] }>>('/system/audit-logs', { params }))
}

// ==================== 系统参数 ====================
export interface SystemParam {
  id: string
  code: string
  name: string
  value: string
  default_value: string
  description: string
  category: string
  value_type: 'string' | 'number' | 'boolean' | 'json'
  status: 'active' | 'disabled'
  updated_at: string
  updated_by: string
}

export interface SystemParamQuery {
  page: number
  page_size: number
  category?: string
  keyword?: string
  status?: string
}

export function getSystemParams(params?: Partial<SystemParamQuery>) {
  if (isMockMode) return mockService.getSystemParams(params)
  return unwrapApiResponse(http.get<ApiResponse<{ total: number; items: SystemParam[] }>>('/system/params', { params }))
}

export function updateSystemParam(id: string, value: string) {
  if (isMockMode) return mockService.updateSystemParam(id, value)
  return unwrapApiResponse(http.put<ApiResponse<SystemParam>>(`/system/params/${id}`, { value }))
}

export function batchUpdateSystemParams(updates: { id: string; value: string }[]) {
  if (isMockMode) return mockService.batchUpdateSystemParams(updates)
  return unwrapApiResponse(http.put<ApiResponse<null>>('/system/params/batch', { updates }))
}

export function resetSystemParam(id: string) {
  if (isMockMode) return mockService.resetSystemParam(id)
  return unwrapApiResponse(http.put<ApiResponse<SystemParam>>(`/system/params/${id}/reset`))
}

// ==================== 编码规则 ====================
export function getCodeRules() {
  if (isMockMode) return mockService.getCodeRules()
  return unwrapApiResponse(http.get<ApiResponse<any>>('/system/code-rules'))
}

export function createCodeRule(data: any) {
  if (isMockMode) return mockService.createCodeRule(data)
  return unwrapApiResponse(http.post<ApiResponse<null>>('/system/code-rules', data))
}

export function updateCodeRule(id: string, data: any) {
  if (isMockMode) return mockService.updateCodeRule(id, data)
  return unwrapApiResponse(http.put<ApiResponse<null>>(`/system/code-rules/${id}`, data))
}

export function deleteCodeRule(id: string) {
  if (isMockMode) return mockService.deleteCodeRule(id)
  return unwrapApiResponse(http.delete<ApiResponse<null>>(`/system/code-rules/${id}`))
}

// ==================== 审批流 ====================
export function getApprovalFlows() {
  if (isMockMode) return mockService.getApprovalFlows()
  return unwrapApiResponse(http.get<ApiResponse<any>>('/system/approval-flows'))
}

export function createApprovalFlow(data: any) {
  if (isMockMode) return mockService.createApprovalFlow(data)
  return unwrapApiResponse(http.post<ApiResponse<null>>('/system/approval-flows', data))
}

export function updateApprovalFlow(id: string, data: any) {
  if (isMockMode) return mockService.updateApprovalFlow(id, data)
  return unwrapApiResponse(http.put<ApiResponse<null>>(`/system/approval-flows/${id}`, data))
}

export function deleteApprovalFlow(id: string) {
  if (isMockMode) return mockService.deleteApprovalFlow(id)
  return unwrapApiResponse(http.delete<ApiResponse<null>>(`/system/approval-flows/${id}`))
}
