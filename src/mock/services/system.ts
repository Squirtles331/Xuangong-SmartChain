import { generateId } from '../shared/id'
import { paginate, searchItems } from '../shared/paginate'
import { wrapCreatedResponse, wrapDetailResponse, wrapListResponse, wrapSuccessResponse, wrapUpdatedResponse } from '../shared/response'
import { simulateDelay } from '../shared/delay'
import { approvalFlows, auditLogs, codeRules, dictItems, dictTypes, menuTree, systemParams, systemRoles, systemUsers } from '../modules/system'

export async function getUserList(params: {
  pageNum: number
  pageSize: number
  username?: string
  realName?: string
  role?: string
  status?: 1 | 0
}) {
  await simulateDelay()

  let filtered = [...systemUsers]

  if (params.username) {
    filtered = searchItems(filtered, params.username, ['username'])
  }

  if (params.realName) {
    filtered = searchItems(filtered, params.realName, ['realName'])
  }

  if (params.role) {
    filtered = filtered.filter((user) => Array.isArray(user.roles) && user.roles.includes(params.role!))
  }

  if (params.status !== undefined) {
    filtered = filtered.filter((user) => user.status === params.status)
  }

  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function createUser(data: any) {
  await simulateDelay()

  const newUser = {
    id: generateId(),
    username: data.username || '',
    realName: data.realName || '',
    email: data.email || '',
    phone: data.phone || '',
    departmentId: data.departmentId || '',
    status: data.status ?? 1,
    roles: Array.isArray(data.roles) ? data.roles : [],
    createdAt: new Date().toISOString().slice(0, 19).replace('T', ' ')
  }

  systemUsers.unshift(newUser)
  return wrapCreatedResponse(newUser, '创建用户成功')
}

export async function updateUser(id: string, data: any) {
  await simulateDelay()

  const index = systemUsers.findIndex((user) => String(user.id) === id)
  const nextUser = {
    id,
    username: data.username || '',
    realName: data.realName || '',
    email: data.email || '',
    phone: data.phone || '',
    departmentId: data.departmentId || '',
    status: data.status ?? 1,
    roles: Array.isArray(data.roles) ? data.roles : [],
    createdAt: data.createdAt || new Date().toISOString().slice(0, 19).replace('T', ' ')
  }

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
  if (index > -1) {
    systemUsers.splice(index, 1)
  }

  return wrapSuccessResponse('删除用户成功')
}

export async function getRoleList(params: { pageNum: number; pageSize: number; name?: string }) {
  await simulateDelay()

  let filtered = [...systemRoles]
  if (params.name) {
    filtered = searchItems(filtered, params.name, ['code', 'name', 'description'])
  }

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
  if (index > -1) {
    systemRoles.splice(index, 1)
  }

  return wrapSuccessResponse('删除角色成功')
}

export async function getMenuTree() {
  await simulateDelay()
  return wrapDetailResponse(menuTree)
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
      if (!Array.isArray(node.children)) {
        node.children = []
      }
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
  if (params.keyword) {
    filtered = searchItems(filtered, params.keyword, ['code', 'name', 'description'])
  }

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

  if (params?.keyword) {
    filtered = searchItems(filtered, params.keyword, ['code', 'name', 'description'])
  }

  if (params?.category) {
    filtered = filtered.filter((item) => item.category === params.category)
  }

  if (params?.status) {
    filtered = filtered.filter((item) => item.status === params.status)
  }

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

  if (params.userName) {
    filtered = searchItems(filtered, params.userName, ['userName'])
  }

  if (params.module) {
    filtered = filtered.filter((log) => log.module === params.module)
  }

  if (params.action) {
    filtered = filtered.filter((log) => log.action === params.action)
  }

  if (params.startDate) {
    filtered = filtered.filter((log) => log.createdAt >= params.startDate!)
  }

  if (params.endDate) {
    filtered = filtered.filter((log) => log.createdAt <= params.endDate!)
  }

  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function getCodeRules() {
  await simulateDelay()
  return wrapDetailResponse(codeRules)
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
  if (index > -1) {
    codeRules.splice(index, 1)
  }

  return wrapSuccessResponse('删除编码规则成功')
}

export async function getApprovalFlows() {
  await simulateDelay()
  return wrapDetailResponse(approvalFlows)
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
  if (index > -1) {
    approvalFlows.splice(index, 1)
  }

  return wrapSuccessResponse('删除审批流成功')
}
