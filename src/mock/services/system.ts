import { generateId } from '../shared/id'
import { paginate, searchItems } from '../shared/paginate'
import { wrapCreatedResponse, wrapDetailResponse, wrapListResponse, wrapSuccessResponse, wrapUpdatedResponse } from '../shared/response'
import { simulateDelay } from '../shared/delay'
import {
  approvalFlows,
  auditLogs,
  codeRules,
  dictItems,
  dictTypes,
  menuTree,
  notificationRules,
  printTemplateCategories,
  printTemplates,
  ssoConfigs,
  systemFiles,
  systemParams,
  systemRoles,
  systemUsers
} from '../modules/system'

function buildSystemUser(data: Partial<(typeof systemUsers)[number]> & { id: string }) {
  return {
    id: data.id,
    username: data.username || '',
    realName: data.realName || '',
    email: data.email || '',
    phone: data.phone || '',
    departmentId: data.departmentId || '',
    status: data.status ?? 1,
    roles: Array.isArray(data.roles) ? data.roles : [],
    createdAt: data.createdAt || new Date().toISOString().slice(0, 19).replace('T', ' ')
  }
}

function flattenMenuTree(nodes: any[], parentName = ''): any[] {
  return nodes.flatMap((node) => {
    const current = {
      ...node,
      parentName
    }
    const children = Array.isArray(node.children) ? flattenMenuTree(node.children, node.name) : []
    return [current, ...children]
  })
}

function walkMenuTree(nodes: any[], callback: (node: any, index: number, parent: any[] | null) => boolean): boolean {
  for (let index = 0; index < nodes.length; index += 1) {
    const node = nodes[index]
    if (callback(node, index, nodes)) {
      return true
    }
    if (Array.isArray(node.children) && walkMenuTree(node.children, callback)) {
      return true
    }
  }
  return false
}

function flattenPrintTemplateCategories(nodes: any[], parentName = ''): any[] {
  return nodes.flatMap((node) => {
    const current = {
      ...node,
      parentName
    }
    const children = Array.isArray(node.children) ? flattenPrintTemplateCategories(node.children, node.name) : []
    return [current, ...children]
  })
}

function walkPrintTemplateCategoryTree(nodes: any[], callback: (node: any, index: number, parent: any[] | null) => boolean): boolean {
  for (let index = 0; index < nodes.length; index += 1) {
    const node = nodes[index]
    if (callback(node, index, nodes)) {
      return true
    }
    if (Array.isArray(node.children) && walkPrintTemplateCategoryTree(node.children, callback)) {
      return true
    }
  }
  return false
}

function collectPrintTemplateCategoryIds(nodes: any[], ids: Set<string> = new Set()) {
  nodes.forEach((node) => {
    ids.add(String(node.id))
    if (Array.isArray(node.children)) collectPrintTemplateCategoryIds(node.children, ids)
  })
  return ids
}

function getPrintTemplateCategoryNode(categoryId: string) {
  let found: any = null
  walkPrintTemplateCategoryTree(printTemplateCategories, (node) => {
    if (String(node.id) !== categoryId) return false
    found = node
    return true
  })
  return found
}

function getPrintTemplateCategoryDescendantIds(categoryId: string) {
  const result = new Set<string>()
  walkPrintTemplateCategoryTree(printTemplateCategories, (node) => {
    if (String(node.id) !== categoryId) return false
    collectPrintTemplateCategoryIds([node], result)
    return true
  })
  return result
}

function fillPrintTemplateCategoryMeta(node: any, parentName = ''): any {
  const current = {
    ...node,
    parentName
  }
  if (Array.isArray(node.children)) {
    current.children = node.children.map((child: any) => fillPrintTemplateCategoryMeta(child, node.name))
  }
  return current
}

export async function getUserList(params: {
  pageNum: number
  pageSize: number
  username?: string
  realName?: string
  role?: string
  status?: 1 | 0
}) {
  await simulateDelay()

  const normalizedUsers = systemUsers.map((user) => buildSystemUser(user))
  systemUsers.splice(0, systemUsers.length, ...normalizedUsers)
  let filtered = [...systemUsers]

  if (params.username) filtered = searchItems(filtered, params.username, ['username'])
  if (params.realName) filtered = searchItems(filtered, params.realName, ['realName'])
  if (params.role) filtered = filtered.filter((user) => Array.isArray(user.roles) && user.roles.includes(params.role!))
  if (params.status !== undefined) filtered = filtered.filter((user) => user.status === params.status)

  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function createUser(data: any) {
  await simulateDelay()

  const newUser = buildSystemUser({
    ...data,
    id: generateId()
  })

  systemUsers.unshift(newUser)
  return wrapCreatedResponse(newUser, '创建用户成功')
}

export async function updateUser(id: string, data: any) {
  await simulateDelay()

  const index = systemUsers.findIndex((user) => String(user.id) === id)
  const nextUser = buildSystemUser({ ...data, id })

  if (index > -1) {
    systemUsers[index] = { ...systemUsers[index], ...nextUser }
    return wrapUpdatedResponse(systemUsers[index], '更新用户成功')
  }

  systemUsers.unshift(nextUser)
  return wrapUpdatedResponse(nextUser, '更新用户成功')
}

export async function deleteUser(id: string) {
  await simulateDelay()

  const index = systemUsers.findIndex((user) => String(user.id) === id)
  if (index > -1) systemUsers.splice(index, 1)

  return wrapSuccessResponse('删除用户成功')
}

export async function getRoleList(params: { pageNum: number; pageSize: number; name?: string }) {
  await simulateDelay()

  let filtered = [...systemRoles]
  if (params.name) filtered = searchItems(filtered, params.name, ['code', 'name', 'description'])

  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function createRole(data: any) {
  await simulateDelay()

  const role = {
    id: generateId(),
    code: data.code || '',
    name: data.name || '',
    description: data.description || '',
    status: data.status || 'active',
    permissionIds: Array.isArray(data.permissionIds) ? data.permissionIds : [],
    userCount: data.userCount ?? 0
  }

  systemRoles.unshift(role)
  return wrapCreatedResponse(role, '创建角色成功')
}

export async function updateRole(id: string, data: any) {
  await simulateDelay()

  const index = systemRoles.findIndex((role) => String(role.id) === id)
  if (index > -1) {
    systemRoles[index] = { ...systemRoles[index], ...data }
    return wrapUpdatedResponse(systemRoles[index], '更新角色成功')
  }

  return wrapUpdatedResponse({ id, ...data }, '更新角色成功')
}

export async function deleteRole(id: string) {
  await simulateDelay()

  const index = systemRoles.findIndex((role) => String(role.id) === id)
  if (index > -1) systemRoles.splice(index, 1)

  return wrapSuccessResponse('删除角色成功')
}

export async function getMenuTree() {
  await simulateDelay()
  return wrapDetailResponse(menuTree)
}

export async function getMenuList(params: { pageNum: number; pageSize: number; keyword?: string; type?: string }) {
  await simulateDelay()

  let filtered = flattenMenuTree(menuTree)
  if (params.keyword) filtered = searchItems(filtered, params.keyword, ['name', 'path', 'permissionCode', 'parentName'])
  if (params.type) filtered = filtered.filter((item) => item.type === params.type)

  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function createMenu(data: any) {
  await simulateDelay()

  const newMenu = {
    id: generateId(),
    parentId: data.parentId ?? null,
    name: data.name || '',
    type: data.type || 'menu',
    path: data.path || '',
    component: data.component || '',
    permissionCode: data.permissionCode || '',
    icon: data.icon || '',
    sortOrder: data.sortOrder ?? 1,
    visible: data.visible ?? true
  }

  if (!newMenu.parentId) {
    menuTree.push(newMenu)
  } else {
    walkMenuTree(menuTree, (node) => {
      if (node.id !== newMenu.parentId) return false
      if (!Array.isArray(node.children)) node.children = []
      node.children.push(newMenu)
      return true
    })
  }

  return wrapCreatedResponse(newMenu, '创建菜单成功')
}

export async function updateMenu(id: string, data: any) {
  await simulateDelay()

  let updatedNode: any = null
  walkMenuTree(menuTree, (node) => {
    if (node.id !== id) return false
    Object.assign(node, data)
    updatedNode = node
    return true
  })

  return wrapUpdatedResponse(updatedNode || { id, ...data }, '更新菜单成功')
}

export async function deleteMenu(id: string) {
  await simulateDelay()

  walkMenuTree(menuTree, (node, index, parent) => {
    if (node.id !== id || !parent) return false
    parent.splice(index, 1)
    return true
  })

  return wrapSuccessResponse('删除菜单成功')
}

export async function getDictTypeList(params: { pageNum: number; pageSize: number; keyword?: string }) {
  await simulateDelay()

  let filtered = [...dictTypes]
  if (params.keyword) filtered = searchItems(filtered, params.keyword, ['code', 'name', 'description'])

  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function getDictItems(dictTypeCode: string) {
  await simulateDelay()
  return wrapDetailResponse(dictItems[dictTypeCode] || [])
}

export async function createDictType(data: any) {
  await simulateDelay()

  const nextType = {
    id: generateId(),
    code: data.code || '',
    name: data.name || '',
    description: data.description || '',
    status: data.status || 'active'
  }

  dictTypes.unshift(nextType)
  return wrapCreatedResponse(nextType, '创建字典类型成功')
}

export async function updateDictType(id: string, data: any) {
  await simulateDelay()

  const index = dictTypes.findIndex((item) => String(item.id) === id)
  if (index > -1) {
    dictTypes[index] = { ...dictTypes[index], ...data }
    return wrapUpdatedResponse(dictTypes[index], '更新字典类型成功')
  }

  return wrapUpdatedResponse({ id, ...data }, '更新字典类型成功')
}

export async function deleteDictType(id: string) {
  await simulateDelay()

  const index = dictTypes.findIndex((item) => String(item.id) === id)
  if (index > -1) {
    const dictType = dictTypes[index]
    delete dictItems[dictType.code]
    dictTypes.splice(index, 1)
  }

  return wrapSuccessResponse('删除字典类型成功')
}

export async function createDictItem(data: any) {
  await simulateDelay()

  const dictTypeCode = data.dictTypeCode || dictTypes.find((item) => item.id === data.dictTypeId)?.code || ''
  const list = dictItems[dictTypeCode] || []
  const nextItem = {
    id: generateId(),
    dictTypeCode,
    dictTypeId: data.dictTypeId || dictTypes.find((item) => item.code === dictTypeCode)?.id || '',
    code: data.code || '',
    name: data.name || '',
    sortOrder: data.sortOrder ?? 1,
    cssClass: data.cssClass || '',
    status: data.status || 'active'
  }

  list.push(nextItem)
  dictItems[dictTypeCode] = list

  return wrapCreatedResponse(nextItem, '创建字典项成功')
}

export async function updateDictItem(id: string, data: any) {
  await simulateDelay()

  let updatedItem: any = null
  for (const list of Object.values(dictItems) as any[]) {
    const index = list.findIndex((item: any) => String(item.id) === id)
    if (index > -1) {
      list[index] = { ...list[index], ...data }
      updatedItem = list[index]
      break
    }
  }

  return wrapUpdatedResponse(updatedItem || { id, ...data }, '更新字典项成功')
}

export async function deleteDictItem(id: string) {
  await simulateDelay()

  for (const list of Object.values(dictItems) as any[]) {
    const index = list.findIndex((item: any) => String(item.id) === id)
    if (index > -1) {
      list.splice(index, 1)
      break
    }
  }

  return wrapSuccessResponse('删除字典项成功')
}

export async function getSystemParams(params?: { pageNum?: number; pageSize?: number; category?: string; keyword?: string; status?: string }) {
  await simulateDelay()

  let filtered = [...systemParams]
  if (params?.keyword) filtered = searchItems(filtered, params.keyword, ['code', 'name', 'description'])
  if (params?.category) filtered = filtered.filter((item) => item.category === params.category)
  if (params?.status) filtered = filtered.filter((item) => item.status === params.status)

  const pageNum = params?.pageNum || 1
  const pageSize = params?.pageSize || 20
  const result = paginate(filtered, pageNum, pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function updateSystemParam(id: string, value: string) {
  await simulateDelay()

  const item = systemParams.find((param) => param.id === id)
  if (item) {
    item.value = value
    item.updatedAt = new Date().toISOString().slice(0, 19).replace('T', ' ')
  }

  return wrapUpdatedResponse(item || { id, value }, '更新参数成功')
}

export async function createSystemParam(data: any) {
  await simulateDelay()

  const nextParam = {
    id: generateId(),
    code: data.code || '',
    name: data.name || '',
    value: data.value || '',
    defaultValue: data.defaultValue || data.value || '',
    description: data.description || '',
    category: data.category || 'general',
    valueType: data.valueType || 'string',
    status: data.status || 'active',
    updatedAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
    updatedBy: data.updatedBy || 'admin'
  }

  systemParams.unshift(nextParam)
  return wrapCreatedResponse(nextParam, '创建参数成功')
}

export async function batchUpdateSystemParams(updates: { id: string; value: string }[]) {
  await simulateDelay()

  updates.forEach((update) => {
    const item = systemParams.find((param) => param.id === update.id)
    if (item) {
      item.value = update.value
      item.updatedAt = new Date().toISOString().slice(0, 19).replace('T', ' ')
    }
  })

  return wrapSuccessResponse('批量更新成功')
}

export async function resetSystemParam(id: string) {
  await simulateDelay()

  const item = systemParams.find((param) => param.id === id)
  if (item) {
    item.value = item.defaultValue
    item.updatedAt = new Date().toISOString().slice(0, 19).replace('T', ' ')
  }

  return wrapUpdatedResponse(item || { id }, '重置参数成功')
}

export async function deleteSystemParam(id: string) {
  await simulateDelay()

  const index = systemParams.findIndex((param) => param.id === id)
  if (index > -1) systemParams.splice(index, 1)

  return wrapSuccessResponse('删除参数成功')
}

export async function getAuditLogs(params: {
  pageNum: number
  pageSize: number
  userName?: string
  module?: string
  action?: string
  startDate?: string
  endDate?: string
}) {
  await simulateDelay()

  let filtered = [...auditLogs]
  if (params.userName) filtered = searchItems(filtered, params.userName, ['userName'])
  if (params.module) filtered = filtered.filter((log) => log.module === params.module)
  if (params.action) filtered = filtered.filter((log) => log.action === params.action)
  if (params.startDate) filtered = filtered.filter((log) => log.createdAt >= params.startDate!)
  if (params.endDate) filtered = filtered.filter((log) => log.createdAt <= params.endDate!)

  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function getCodeRules(params: { pageNum: number; pageSize: number; keyword?: string }) {
  await simulateDelay()

  let filtered = [...codeRules]
  if (params.keyword) filtered = searchItems(filtered, params.keyword, ['code', 'name', 'prefix', 'example'])

  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function createCodeRule(data: any) {
  await simulateDelay()

  const nextRule = {
    id: generateId(),
    code: data.code || '',
    name: data.name || '',
    prefix: data.prefix || '',
    dateFormat: data.dateFormat || 'YYYYMMDD',
    serialLength: data.serialLength ?? 4,
    example: data.example || ''
  }

  codeRules.unshift(nextRule)
  return wrapCreatedResponse(nextRule, '创建编码规则成功')
}

export async function updateCodeRule(id: string, data: any) {
  await simulateDelay()

  const index = codeRules.findIndex((rule) => String(rule.id) === id)
  if (index > -1) {
    codeRules[index] = { ...codeRules[index], ...data }
    return wrapUpdatedResponse(codeRules[index], '更新编码规则成功')
  }

  return wrapUpdatedResponse({ id, ...data }, '更新编码规则成功')
}

export async function deleteCodeRule(id: string) {
  await simulateDelay()

  const index = codeRules.findIndex((rule) => String(rule.id) === id)
  if (index > -1) codeRules.splice(index, 1)

  return wrapSuccessResponse('删除编码规则成功')
}

export async function getApprovalFlows(params: {
  pageNum: number
  pageSize: number
  name?: string
  businessType?: string
  status?: 'active' | 'disabled'
}) {
  await simulateDelay()

  let filtered = [...approvalFlows]
  if (params.name) filtered = searchItems(filtered, params.name, ['name'])
  if (params.businessType) filtered = filtered.filter((item) => item.businessType === params.businessType)
  if (params.status) filtered = filtered.filter((item) => item.status === params.status)

  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function createApprovalFlow(data: any) {
  await simulateDelay()

  const nextFlow = {
    id: generateId(),
    name: data.name || '',
    businessType: data.businessType || '',
    nodes: Array.isArray(data.nodes) ? data.nodes : [],
    status: data.status || 'active'
  }

  approvalFlows.unshift(nextFlow)
  return wrapCreatedResponse(nextFlow, '创建审批流成功')
}

export async function updateApprovalFlow(id: string, data: any) {
  await simulateDelay()

  const index = approvalFlows.findIndex((flow) => String(flow.id) === id)
  if (index > -1) {
    approvalFlows[index] = { ...approvalFlows[index], ...data }
    return wrapUpdatedResponse(approvalFlows[index], '更新审批流成功')
  }

  return wrapUpdatedResponse({ id, ...data }, '更新审批流成功')
}

export async function deleteApprovalFlow(id: string) {
  await simulateDelay()

  const index = approvalFlows.findIndex((flow) => String(flow.id) === id)
  if (index > -1) approvalFlows.splice(index, 1)

  return wrapSuccessResponse('删除审批流成功')
}

export async function getSystemFiles(params: { pageNum: number; pageSize: number; keyword?: string }) {
  await simulateDelay()

  let filtered = [...systemFiles]
  if (params.keyword) filtered = searchItems(filtered, params.keyword, ['name', 'module', 'objectType'])

  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function uploadSystemFile(data: any) {
  await simulateDelay()

  const nextFile = {
    id: generateId(),
    name: data.name || '未命名文件',
    module: data.module || '系统管理',
    objectType: data.objectType || '通用附件',
    size: data.size ?? 0,
    type: data.type || 'pdf',
    url: data.url || '',
    uploadedAt: new Date().toISOString().slice(0, 19).replace('T', ' ')
  }

  systemFiles.unshift(nextFile)
  return wrapCreatedResponse(nextFile, '上传文件成功')
}

export async function deleteSystemFile(id: string) {
  await simulateDelay()

  const index = systemFiles.findIndex((item) => String(item.id) === id)
  if (index > -1) systemFiles.splice(index, 1)

  return wrapSuccessResponse('删除文件成功')
}

export async function getNotificationRules(params: {
  pageNum: number
  pageSize: number
  keyword?: string
  channel?: 'wecom' | 'dingtalk' | 'internal'
  status?: 'active' | 'disabled'
}) {
  await simulateDelay()

  let filtered = [...notificationRules]
  if (params.keyword) filtered = searchItems(filtered, params.keyword, ['bizType', 'webhookUrl'])
  if (params.channel) filtered = filtered.filter((item) => item.channel === params.channel)
  if (params.status) filtered = filtered.filter((item) => item.status === params.status)

  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function createNotificationRule(data: any) {
  await simulateDelay()

  const nextRule = {
    id: generateId(),
    bizType: data.bizType || '',
    channel: data.channel || 'wecom',
    webhookUrl: data.webhookUrl || '',
    status: data.status || 'active'
  }

  notificationRules.unshift(nextRule)
  return wrapCreatedResponse(nextRule, '创建通知规则成功')
}

export async function updateNotificationRule(id: string, data: any) {
  await simulateDelay()

  const index = notificationRules.findIndex((item) => String(item.id) === id)
  if (index > -1) {
    notificationRules[index] = { ...notificationRules[index], ...data }
    return wrapUpdatedResponse(notificationRules[index], '更新通知规则成功')
  }

  return wrapUpdatedResponse({ id, ...data }, '更新通知规则成功')
}

export async function deleteNotificationRule(id: string) {
  await simulateDelay()

  const index = notificationRules.findIndex((item) => String(item.id) === id)
  if (index > -1) notificationRules.splice(index, 1)

  return wrapSuccessResponse('删除通知规则成功')
}

export async function testNotificationRule(id: string) {
  await simulateDelay()

  const item = notificationRules.find((rule) => String(rule.id) === id)
  return wrapSuccessResponse(item ? `已发送测试消息：${item.bizType}` : '已发送测试消息')
}

export async function toggleNotificationRule(id: string) {
  await simulateDelay()

  const item = notificationRules.find((rule) => String(rule.id) === id)
  if (item) item.status = item.status === 'active' ? 'disabled' : 'active'

  return wrapUpdatedResponse(item || { id }, '切换通知规则状态成功')
}

export async function getSsoConfigs(params: {
  pageNum: number
  pageSize: number
  keyword?: string
  protocol?: 'oauth2' | 'oidc' | 'saml' | 'ldap'
  enabled?: boolean
}) {
  await simulateDelay()

  let filtered = [...ssoConfigs]
  if (params.keyword) filtered = searchItems(filtered, params.keyword, ['name', 'url', 'clientId', 'defaultRole'])
  if (params.protocol) filtered = filtered.filter((item) => item.protocol === params.protocol)
  if (params.enabled !== undefined) filtered = filtered.filter((item) => item.enabled === params.enabled)

  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function createSsoConfig(data: any) {
  await simulateDelay()

  const nextConfig = {
    id: generateId(),
    name: data.name || '',
    protocol: data.protocol || 'oauth2',
    url: data.url || '',
    clientId: data.clientId || '',
    clientSecret: data.clientSecret || '',
    redirectUri: data.redirectUri || '',
    defaultRole: data.defaultRole || '',
    enabled: data.enabled ?? false,
    status: data.status || (data.enabled ? 'online' : 'offline'),
    lastSyncAt: data.lastSyncAt || new Date().toISOString().slice(0, 19).replace('T', ' ')
  }

  ssoConfigs.unshift(nextConfig)
  return wrapCreatedResponse(nextConfig, '创建单点登录配置成功')
}

export async function updateSsoConfig(id: string, data: any) {
  await simulateDelay()

  const index = ssoConfigs.findIndex((item) => String(item.id) === id)
  if (index > -1) {
    ssoConfigs[index] = { ...ssoConfigs[index], ...data }
    return wrapUpdatedResponse(ssoConfigs[index], '更新单点登录配置成功')
  }

  return wrapUpdatedResponse({ id, ...data }, '更新单点登录配置成功')
}

export async function deleteSsoConfig(id: string) {
  await simulateDelay()

  const index = ssoConfigs.findIndex((item) => String(item.id) === id)
  if (index > -1) ssoConfigs.splice(index, 1)

  return wrapSuccessResponse('删除单点登录配置成功')
}

export async function testSsoConfig(id: string) {
  await simulateDelay()

  const item = ssoConfigs.find((config) => String(config.id) === id)
  if (item) {
    item.status = 'online'
    item.lastSyncAt = new Date().toISOString().slice(0, 19).replace('T', ' ')
  }

  return wrapSuccessResponse('连接测试成功')
}

export async function getPrintTemplateCategoryTree() {
  await simulateDelay()
  return wrapDetailResponse(printTemplateCategories.map((item) => fillPrintTemplateCategoryMeta(item)))
}

export async function getPrintTemplateCategoryList(params: { pageNum: number; pageSize: number; keyword?: string }) {
  await simulateDelay()

  let filtered = flattenPrintTemplateCategories(printTemplateCategories)
  if (params.keyword) filtered = searchItems(filtered, params.keyword, ['name', 'code', 'parentName'])

  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function createPrintTemplateCategory(data: any) {
  await simulateDelay()

  const parent = data.parentId ? getPrintTemplateCategoryNode(String(data.parentId)) : null
  const nextCategory = {
    id: generateId(),
    name: data.name || '',
    code: data.code || '',
    parentId: parent?.id || null,
    level: parent ? Number(parent.level || 0) + 1 : 0,
    createdBy: data.createdBy || '超级管理员',
    createdAt: data.createdAt || new Date().toISOString().slice(0, 19).replace('T', ' '),
    updatedBy: data.updatedBy || '超级管理员',
    updatedAt: data.updatedAt || new Date().toISOString().slice(0, 19).replace('T', ' ')
  }

  if (!parent) {
    printTemplateCategories.unshift(nextCategory)
  } else {
    if (!Array.isArray(parent.children)) parent.children = []
    parent.children.unshift(nextCategory)
  }

  return wrapCreatedResponse({ ...nextCategory, parentName: parent?.name || '' }, '创建打印模板分类成功')
}

export async function updatePrintTemplateCategory(id: string, data: any) {
  await simulateDelay()

  let updatedNode: any = null
  walkPrintTemplateCategoryTree(printTemplateCategories, (node) => {
    if (String(node.id) !== id) return false
    Object.assign(node, {
      name: data.name ?? node.name,
      code: data.code ?? node.code,
      updatedBy: data.updatedBy || '超级管理员',
      updatedAt: data.updatedAt || new Date().toISOString().slice(0, 19).replace('T', ' ')
    })
    updatedNode = node
    return true
  })

  return wrapUpdatedResponse(updatedNode || { id, ...data }, '更新打印模板分类成功')
}

export async function deletePrintTemplateCategory(id: string) {
  await simulateDelay()

  const deleteIds = new Set<string>()
  walkPrintTemplateCategoryTree(printTemplateCategories, (node) => {
    if (String(node.id) !== id) return false
    collectPrintTemplateCategoryIds([node], deleteIds)
    return true
  })

  const rootIndex = printTemplateCategories.findIndex((item) => String(item.id) === id)
  if (rootIndex > -1) {
    printTemplateCategories.splice(rootIndex, 1)
  } else {
    walkPrintTemplateCategoryTree(printTemplateCategories, (node, index, parent) => {
      if (String(node.id) !== id || !parent) return false
      parent.splice(index, 1)
      return true
    })
  }

  for (let index = printTemplates.length - 1; index >= 0; index -= 1) {
    if (deleteIds.has(String(printTemplates[index].categoryId))) {
      printTemplates.splice(index, 1)
    }
  }

  return wrapSuccessResponse('删除打印模板分类成功')
}

export async function getPrintTemplateList(params: {
  pageNum: number
  pageSize: number
  categoryId?: string
  keyword?: string
  systemBuiltin?: boolean
}) {
  await simulateDelay()

  const categoryMap = new Map(flattenPrintTemplateCategories(printTemplateCategories).map((item) => [String(item.id), item]))
  let filtered = printTemplates.map((item) => ({
    ...item,
    categoryName: categoryMap.get(String(item.categoryId))?.name || ''
  }))

  if (params.categoryId) {
    const ids = getPrintTemplateCategoryDescendantIds(String(params.categoryId))
    filtered = filtered.filter((item) => ids.has(String(item.categoryId)))
  }
  if (params.keyword) filtered = searchItems(filtered, params.keyword, ['name', 'remark', 'categoryName'])
  if (params.systemBuiltin !== undefined) filtered = filtered.filter((item) => item.systemBuiltin === params.systemBuiltin)

  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function getPrintTemplateDetail(id: string) {
  await simulateDelay()

  const categoryMap = new Map(flattenPrintTemplateCategories(printTemplateCategories).map((item) => [String(item.id), item]))
  const template = printTemplates.find((item) => String(item.id) === id)
  return wrapDetailResponse(
    template
      ? {
          ...template,
          categoryName: categoryMap.get(String(template.categoryId))?.name || ''
        }
      : ({} as any)
  )
}

export async function createPrintTemplate(data: any) {
  await simulateDelay()

  if (data.isDefault) {
    printTemplates.forEach((item) => {
      if (String(item.categoryId) === String(data.categoryId)) item.isDefault = false
    })
  }

  const nextTemplate = {
    id: generateId(),
    categoryId: data.categoryId || '',
    name: data.name || '',
    systemBuiltin: data.systemBuiltin ?? false,
    isDefault: data.isDefault ?? false,
    remark: data.remark || '',
    templateData: data.templateData ?? {
      version: '1.0.0',
      page: { width: 210, height: 297, unit: 'mm' },
      components: []
    },
    createdBy: data.createdBy || '超级管理员',
    createdAt: data.createdAt || new Date().toISOString().slice(0, 19).replace('T', ' '),
    updatedBy: data.updatedBy || '超级管理员',
    updatedAt: data.updatedAt || new Date().toISOString().slice(0, 19).replace('T', ' ')
  }

  printTemplates.unshift(nextTemplate)
  return wrapCreatedResponse(nextTemplate, '创建打印模板成功')
}

export async function updatePrintTemplate(id: string, data: any) {
  await simulateDelay()

  const index = printTemplates.findIndex((item) => String(item.id) === id)
  if (data.isDefault) {
    printTemplates.forEach((item) => {
      if (String(item.categoryId) === String(data.categoryId ?? printTemplates[index]?.categoryId) && String(item.id) !== id) {
        item.isDefault = false
      }
    })
  }

  if (index > -1) {
    printTemplates[index] = {
      ...printTemplates[index],
      ...data,
      updatedBy: data.updatedBy || '超级管理员',
      updatedAt: data.updatedAt || new Date().toISOString().slice(0, 19).replace('T', ' ')
    }
    return wrapUpdatedResponse(printTemplates[index], '更新打印模板成功')
  }

  return wrapUpdatedResponse({ id, ...data }, '更新打印模板成功')
}

export async function deletePrintTemplate(id: string) {
  await simulateDelay()

  const index = printTemplates.findIndex((item) => String(item.id) === id)
  if (index > -1) printTemplates.splice(index, 1)

  return wrapSuccessResponse('删除打印模板成功')
}

export async function setPrintTemplateDefault(id: string) {
  await simulateDelay()

  const current = printTemplates.find((item) => String(item.id) === id)
  if (current) {
    printTemplates.forEach((item) => {
      if (String(item.categoryId) === String(current.categoryId)) {
        item.isDefault = String(item.id) === id
      }
    })
    current.updatedBy = '超级管理员'
    current.updatedAt = new Date().toISOString().slice(0, 19).replace('T', ' ')
  }

  return wrapUpdatedResponse(current || { id }, '设置默认打印模板成功')
}

export async function updatePrintTemplateDesign(id: string, templateData: unknown) {
  await simulateDelay()

  const current = printTemplates.find((item) => String(item.id) === id)
  if (current) {
    current.templateData = templateData as typeof current.templateData
    current.updatedBy = '超级管理员'
    current.updatedAt = new Date().toISOString().slice(0, 19).replace('T', ' ')
  }

  return wrapUpdatedResponse(current || { id, templateData }, '保存打印模板设计成功')
}
