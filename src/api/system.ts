import http from '@/utils/http'
import type { ApiResponse } from '@/utils/http'

// ==================== 登录 ====================
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
  return http.post<ApiResponse<LoginResult>>('/auth/login', params)
}

export function logout() {
  return http.post('/auth/logout')
}

export function refreshToken(refresh_token: string) {
  return http.post<ApiResponse<{ access_token: string; refresh_token: string }>>('/auth/refresh', { refresh_token })
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
  return http.get<ApiResponse<{ total: number; items: SysUser[] }>>('/system/users', { params })
}

export function createUser(data: Partial<SysUser>) {
  return http.post('/system/users', data)
}

export function updateUser(id: string, data: Partial<SysUser>) {
  return http.put(`/system/users/${id}`, data)
}

export function deleteUser(id: string) {
  return http.delete(`/system/users/${id}`)
}

export function resetUserPassword(id: string, password: string) {
  return http.put(`/system/users/${id}/reset-password`, { password })
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
  return http.get<ApiResponse<{ total: number; items: SysRole[] }>>('/system/roles', { params })
}

export function createRole(data: Partial<SysRole>) {
  return http.post('/system/roles', data)
}

export function updateRole(id: string, data: Partial<SysRole>) {
  return http.put(`/system/roles/${id}`, data)
}

export function deleteRole(id: string) {
  return http.delete(`/system/roles/${id}`)
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
  return http.get<ApiResponse<SysMenu[]>>('/system/menus/tree')
}

export function createMenu(data: Partial<SysMenu>) {
  return http.post('/system/menus', data)
}

export function updateMenu(id: string, data: Partial<SysMenu>) {
  return http.put(`/system/menus/${id}`, data)
}

export function deleteMenu(id: string) {
  return http.delete(`/system/menus/${id}`)
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
  return http.get<ApiResponse<{ total: number; items: DictType[] }>>('/system/dict-types', { params })
}

export function getDictItems(dictTypeCode: string) {
  return http.get<ApiResponse<DictItem[]>>(`/system/dict-items/${dictTypeCode}`)
}

export function createDictType(data: Partial<DictType>) {
  return http.post('/system/dict-types', data)
}

export function createDictItem(data: Partial<DictItem>) {
  return http.post('/system/dict-items', data)
}

export function updateDictItem(id: string, data: Partial<DictItem>) {
  return http.put(`/system/dict-items/${id}`, data)
}

export function deleteDictItem(id: string) {
  return http.delete(`/system/dict-items/${id}`)
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
  return http.get<ApiResponse<{ total: number; items: AuditLog[] }>>('/system/audit-logs', { params })
}

// ==================== 系统参数 ====================
export interface SystemParam {
  id: string
  code: string
  name: string
  value: string
  description: string
}

export function getSystemParams() {
  return http.get<ApiResponse<SystemParam[]>>('/system/params')
}

export function updateSystemParam(id: string, value: string) {
  return http.put(`/system/params/${id}`, { value })
}
