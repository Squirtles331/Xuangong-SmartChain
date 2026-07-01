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

function normalizeUser(user: Partial<SysUser>): SysUser {
  return {
    id: user.id || '',
    username: user.username || '',
    realName: user.realName || '',
    email: user.email || '',
    phone: user.phone || '',
    departmentId: user.departmentId,
    status: user.status ?? 1,
    roles: Array.isArray(user.roles) ? user.roles : [],
    createdAt: user.createdAt || ''
  }
}

export function getUserList(params: UserQuery) {
  if (isMockMode) {
    return mockService.getUserList(params).then((response) => ({
      ...response,
      data: {
        ...response.data,
        list: response.data.list.map((user) => normalizeUser(user))
      }
    })) as Promise<ApiResponse<PaginatedData<SysUser>>>
  }

  return apiGet<PaginatedData<SysUser>>('/system/users', { params }).then((response) => ({
    ...response,
    data: {
      ...response.data,
      list: response.data.list.map((user) => normalizeUser(user))
    }
  }))
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
  parentName?: string
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

export interface MenuQuery {
  pageNum: number
  pageSize: number
  keyword?: string
  type?: SysMenu['type']
}

export function getMenuList(params: MenuQuery) {
  if (isMockMode) return mockService.getMenuList(params) as Promise<ApiResponse<PaginatedData<SysMenu>>>
  return apiGet<PaginatedData<SysMenu>>('/system/menus', { params })
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

export function updateDictType(id: string, data: Partial<DictType>) {
  if (isMockMode) return mockService.updateDictType(id, data)
  return apiPut<DictType, Partial<DictType>>(`/system/dict-types/${id}`, data)
}

export function deleteDictType(id: string) {
  if (isMockMode) return mockService.deleteDictType(id)
  return apiDelete<null>(`/system/dict-types/${id}`)
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

export interface CodeRuleQuery {
  pageNum: number
  pageSize: number
  keyword?: string
}

export function getCodeRules(params: CodeRuleQuery) {
  if (isMockMode) return mockService.getCodeRules(params) as Promise<ApiResponse<PaginatedData<CodeRule>>>
  return apiGet<PaginatedData<CodeRule>>('/system/code-rules', { params })
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

export interface ApprovalFlowQuery {
  pageNum: number
  pageSize: number
  name?: string
  businessType?: string
  status?: ApprovalFlow['status']
}

export function getApprovalFlows(params: ApprovalFlowQuery) {
  if (isMockMode) return mockService.getApprovalFlows(params) as Promise<ApiResponse<PaginatedData<ApprovalFlow>>>
  return apiGet<PaginatedData<ApprovalFlow>>('/system/approval-flows', { params })
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

export interface SystemFile {
  id: string
  name: string
  module: string
  objectType: string
  size: number
  type: 'pdf' | 'word' | 'excel' | 'image' | 'video'
  url: string
  uploadedAt: string
}

export interface SystemFileQuery {
  pageNum: number
  pageSize: number
  keyword?: string
}

export function getSystemFiles(params: SystemFileQuery) {
  if (isMockMode) return mockService.getSystemFiles(params) as Promise<ApiResponse<PaginatedData<SystemFile>>>
  return apiGet<PaginatedData<SystemFile>>('/system/files', { params })
}

export function uploadSystemFile(data: Partial<SystemFile>) {
  if (isMockMode) return mockService.uploadSystemFile(data)
  return apiPost<SystemFile, Partial<SystemFile>>('/system/files', data)
}

export function deleteSystemFile(id: string) {
  if (isMockMode) return mockService.deleteSystemFile(id)
  return apiDelete<null>(`/system/files/${id}`)
}

export interface NotificationRule {
  id: string
  bizType: string
  channel: 'wecom' | 'dingtalk' | 'internal'
  webhookUrl: string
  status: 'active' | 'disabled'
}

export interface NotificationRuleQuery {
  pageNum: number
  pageSize: number
  keyword?: string
  channel?: NotificationRule['channel']
  status?: NotificationRule['status']
}

export function getNotificationRules(params: NotificationRuleQuery) {
  if (isMockMode) return mockService.getNotificationRules(params) as Promise<ApiResponse<PaginatedData<NotificationRule>>>
  return apiGet<PaginatedData<NotificationRule>>('/system/notification-rules', { params })
}

export function createNotificationRule(data: Partial<NotificationRule>) {
  if (isMockMode) return mockService.createNotificationRule(data)
  return apiPost<NotificationRule, Partial<NotificationRule>>('/system/notification-rules', data)
}

export function updateNotificationRule(id: string, data: Partial<NotificationRule>) {
  if (isMockMode) return mockService.updateNotificationRule(id, data)
  return apiPut<NotificationRule, Partial<NotificationRule>>(`/system/notification-rules/${id}`, data)
}

export function deleteNotificationRule(id: string) {
  if (isMockMode) return mockService.deleteNotificationRule(id)
  return apiDelete<null>(`/system/notification-rules/${id}`)
}

export function testNotificationRule(id: string) {
  if (isMockMode) return mockService.testNotificationRule(id)
  return apiPost<null>(`/system/notification-rules/${id}/test`)
}

export function toggleNotificationRule(id: string) {
  if (isMockMode) return mockService.toggleNotificationRule(id)
  return apiPut<NotificationRule>(`/system/notification-rules/${id}/toggle`)
}

export function createSystemParam(data: Partial<SystemParam>) {
  if (isMockMode) return mockService.createSystemParam(data)
  return apiPost<SystemParam, Partial<SystemParam>>('/system/params', data)
}

export function deleteSystemParam(id: string) {
  if (isMockMode) return mockService.deleteSystemParam(id)
  return apiDelete<null>(`/system/params/${id}`)
}

export interface SsoConfig {
  id: string
  name: string
  protocol: 'oauth2' | 'oidc' | 'saml' | 'ldap'
  url: string
  clientId: string
  clientSecret: string
  redirectUri: string
  defaultRole: string
  enabled: boolean
  status: 'online' | 'offline'
  lastSyncAt: string
}

export interface SsoConfigQuery {
  pageNum: number
  pageSize: number
  keyword?: string
  protocol?: SsoConfig['protocol']
  enabled?: boolean
}

export function getSsoConfigs(params: SsoConfigQuery) {
  if (isMockMode) return mockService.getSsoConfigs(params) as Promise<ApiResponse<PaginatedData<SsoConfig>>>
  return apiGet<PaginatedData<SsoConfig>>('/system/sso-configs', { params })
}

export function createSsoConfig(data: Partial<SsoConfig>) {
  if (isMockMode) return mockService.createSsoConfig(data)
  return apiPost<SsoConfig, Partial<SsoConfig>>('/system/sso-configs', data)
}

export function updateSsoConfig(id: string, data: Partial<SsoConfig>) {
  if (isMockMode) return mockService.updateSsoConfig(id, data)
  return apiPut<SsoConfig, Partial<SsoConfig>>(`/system/sso-configs/${id}`, data)
}

export function deleteSsoConfig(id: string) {
  if (isMockMode) return mockService.deleteSsoConfig(id)
  return apiDelete<null>(`/system/sso-configs/${id}`)
}

export function testSsoConfig(id: string) {
  if (isMockMode) return mockService.testSsoConfig(id)
  return apiPost<null>(`/system/sso-configs/${id}/test`)
}

export interface PrintTemplateCategory {
  id: string
  name: string
  code: string
  parentId: string | null
  parentName?: string
  level: number
  createdBy: string
  createdAt: string
  updatedBy: string
  updatedAt: string
  children?: PrintTemplateCategory[]
}

export interface PrintTemplateCategoryQuery {
  pageNum: number
  pageSize: number
  keyword?: string
}

export function getPrintTemplateCategoryTree() {
  if (isMockMode) return mockService.getPrintTemplateCategoryTree() as Promise<ApiResponse<PrintTemplateCategory[]>>
  return apiGet<PrintTemplateCategory[]>('/system/print-template-categories/tree')
}

export function getPrintTemplateCategoryList(params: PrintTemplateCategoryQuery) {
  if (isMockMode) return mockService.getPrintTemplateCategoryList(params) as Promise<ApiResponse<PaginatedData<PrintTemplateCategory>>>
  return apiGet<PaginatedData<PrintTemplateCategory>>('/system/print-template-categories', { params })
}

export function createPrintTemplateCategory(data: Partial<PrintTemplateCategory>) {
  if (isMockMode) return mockService.createPrintTemplateCategory(data)
  return apiPost<PrintTemplateCategory, Partial<PrintTemplateCategory>>('/system/print-template-categories', data)
}

export function updatePrintTemplateCategory(id: string, data: Partial<PrintTemplateCategory>) {
  if (isMockMode) return mockService.updatePrintTemplateCategory(id, data)
  return apiPut<PrintTemplateCategory, Partial<PrintTemplateCategory>>(`/system/print-template-categories/${id}`, data)
}

export function deletePrintTemplateCategory(id: string) {
  if (isMockMode) return mockService.deletePrintTemplateCategory(id)
  return apiDelete<null>(`/system/print-template-categories/${id}`)
}

export interface PrintTemplate {
  id: string
  categoryId: string
  categoryName?: string
  name: string
  systemBuiltin: boolean
  isDefault: boolean
  remark: string
  templateData?: unknown
  createdBy: string
  createdAt: string
  updatedBy: string
  updatedAt: string
}

export interface PrintTemplateQuery {
  pageNum: number
  pageSize: number
  categoryId?: string
  keyword?: string
  systemBuiltin?: boolean
}

export function getPrintTemplateList(params: PrintTemplateQuery) {
  if (isMockMode) return mockService.getPrintTemplateList(params) as Promise<ApiResponse<PaginatedData<PrintTemplate>>>
  return apiGet<PaginatedData<PrintTemplate>>('/system/print-templates', { params })
}

export function getPrintTemplateDetail(id: string) {
  if (isMockMode) return mockService.getPrintTemplateDetail(id) as Promise<ApiResponse<PrintTemplate>>
  return apiGet<PrintTemplate>(`/system/print-templates/${id}`)
}

export function createPrintTemplate(data: Partial<PrintTemplate>) {
  if (isMockMode) return mockService.createPrintTemplate(data)
  return apiPost<PrintTemplate, Partial<PrintTemplate>>('/system/print-templates', data)
}

export function updatePrintTemplate(id: string, data: Partial<PrintTemplate>) {
  if (isMockMode) return mockService.updatePrintTemplate(id, data)
  return apiPut<PrintTemplate, Partial<PrintTemplate>>(`/system/print-templates/${id}`, data)
}

export function deletePrintTemplate(id: string) {
  if (isMockMode) return mockService.deletePrintTemplate(id)
  return apiDelete<null>(`/system/print-templates/${id}`)
}

export function setPrintTemplateDefault(id: string) {
  if (isMockMode) return mockService.setPrintTemplateDefault(id)
  return apiPut<PrintTemplate>(`/system/print-templates/${id}/default`)
}

export function updatePrintTemplateDesign(id: string, templateData: unknown) {
  if (isMockMode) return mockService.updatePrintTemplateDesign(id, templateData)
  return apiPut<PrintTemplate, { templateData: unknown }>(`/system/print-templates/${id}/design`, { templateData })
}
