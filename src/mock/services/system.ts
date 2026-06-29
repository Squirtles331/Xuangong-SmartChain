/**
 * 系统管理 Mock Service
 * 模拟 CRUD、分页、搜索等操作
 */
import { simulateDelay } from '../shared/delay'
import { paginate, searchItems } from '../shared/paginate'
import { wrapListResponse, wrapDetailResponse, wrapSuccessResponse } from '../shared/response'
import { generateId } from '../shared/id'
import {
  dictTypes,
  dictItems,
  menuTree,
  systemParams,
  auditLogs,
  codeRules,
  approvalFlows,
  systemUsers
} from '../modules/system'

// ==================== 用户管理 ====================
export async function getUserList(params: {
  page: number
  page_size: number
  username?: string
  real_name?: string
  status?: string
}) {
  await simulateDelay()
  let filtered = [...systemUsers]
  if (params.username) filtered = searchItems(filtered, params.username, ['username'])
  if (params.real_name) filtered = searchItems(filtered, params.real_name, ['real_name'])
  if (params.status) filtered = filtered.filter(u => u.status === params.status)
  const result = paginate(filtered, params.page, params.page_size)
  return wrapListResponse(result.items, result.total, result.page, result.page_size)
}

export async function createUser(data: any) {
  await simulateDelay()
  const newUser = { id: generateId(), created_at: new Date().toISOString().slice(0, 19), ...data }
  systemUsers.unshift(newUser)
  return wrapSuccessResponse('用户创建成功')
}

export async function updateUser(id: string, data: any) {
  await simulateDelay()
  const idx = systemUsers.findIndex((u: any) => String(u.id) === id)
  if (idx > -1) Object.assign(systemUsers[idx], data)
  return wrapSuccessResponse('用户更新成功')
}

export async function deleteUser(id: string) {
  await simulateDelay()
  const idx = systemUsers.findIndex((u: any) => String(u.id) === id)
  if (idx > -1) systemUsers.splice(idx, 1)
  return wrapSuccessResponse('用户删除成功')
}

// ==================== 角色管理 ====================
// 角色数据暂存在 system mock 中，后续可扩展
const roleStore: any[] = []

export async function getRoleList(params: { page: number; page_size: number; name?: string }) {
  await simulateDelay()
  let filtered = [...roleStore]
  if (params.name) filtered = searchItems(filtered, params.name, ['name'])
  const result = paginate(filtered, params.page, params.page_size)
  return wrapListResponse(result.items, result.total, result.page, result.page_size)
}

// ==================== 菜单管理 ====================
export async function getMenuTree() {
  await simulateDelay()
  return wrapDetailResponse(menuTree)
}

export async function createMenu(data: any) {
  await simulateDelay()
  const newMenu = { id: generateId(), ...data }
  // 简化：添加到根级
  menuTree.push(newMenu)
  return wrapSuccessResponse('菜单创建成功')
}

export async function updateMenu(id: string, data: any) {
  await simulateDelay()
  // 递归查找并更新
  const updateInTree = (nodes: any[]): boolean => {
    for (const node of nodes) {
      if (node.id === id) { Object.assign(node, data); return true }
      if (node.children && updateInTree(node.children)) return true
    }
    return false
  }
  updateInTree(menuTree)
  return wrapSuccessResponse('菜单更新成功')
}

export async function deleteMenu(id: string) {
  await simulateDelay()
  const removeFromTree = (nodes: any[]): boolean => {
    const idx = nodes.findIndex(n => n.id === id)
    if (idx > -1) { nodes.splice(idx, 1); return true }
    for (const node of nodes) {
      if (node.children && removeFromTree(node.children)) return true
    }
    return false
  }
  removeFromTree(menuTree)
  return wrapSuccessResponse('菜单删除成功')
}

// ==================== 字典管理 ====================
export async function getDictTypeList(params: { page: number; page_size: number }) {
  await simulateDelay()
  const result = paginate(dictTypes, params.page, params.page_size)
  return wrapListResponse(result.items, result.total, result.page, result.page_size)
}

export async function getDictItems(dictTypeCode: string) {
  await simulateDelay()
  const items = dictItems[dictTypeCode] || []
  return wrapDetailResponse(items)
}

export async function createDictType(data: any) {
  await simulateDelay()
  dictTypes.push({ id: generateId(), ...data })
  return wrapSuccessResponse('字典类型创建成功')
}

export async function createDictItem(data: any) {
  await simulateDelay()
  const items = dictItems[data.dict_type_code] || []
  items.push({ id: generateId(), ...data })
  if (!dictItems[data.dict_type_code]) dictItems[data.dict_type_code] = items
  return wrapSuccessResponse('字典项创建成功')
}

export async function updateDictItem(id: string, data: any) {
  await simulateDelay()
  for (const items of Object.values(dictItems) as any[]) {
    const idx = items.findIndex((item: any) => String(item.id) === id)
    if (idx > -1) { Object.assign(items[idx], data); break }
  }
  return wrapSuccessResponse('字典项更新成功')
}

export async function deleteDictItem(id: string) {
  await simulateDelay()
  for (const items of Object.values(dictItems) as any[]) {
    const idx = items.findIndex((item: any) => String(item.id) === id)
    if (idx > -1) { items.splice(idx, 1); break }
  }
  return wrapSuccessResponse('字典项删除成功')
}

// ==================== 系统参数 ====================
export async function getSystemParams(params?: { page?: number; page_size?: number; category?: string; keyword?: string; status?: string }) {
  await simulateDelay()
  let filtered = [...systemParams]
  if (params?.keyword) filtered = searchItems(filtered, params.keyword, ['code', 'name', 'description'])
  const result = paginate(filtered, params?.page || 1, params?.page_size || 20)
  return wrapListResponse(result.items, result.total, result.page, result.page_size)
}

export async function updateSystemParam(id: string, value: string) {
  await simulateDelay()
  const item = systemParams.find(p => p.id === id)
  if (item) item.value = value
  return wrapDetailResponse(item)
}

export async function batchUpdateSystemParams(updates: { id: string; value: string }[]) {
  await simulateDelay()
  for (const u of updates) {
    const item = systemParams.find(p => p.id === u.id)
    if (item) item.value = u.value
  }
  return wrapSuccessResponse('批量更新成功')
}

export async function resetSystemParam(id: string) {
  await simulateDelay()
  // 简化：重置逻辑（无 default_value 存储，此处仅示意）
  return wrapSuccessResponse('参数已重置')
}

// ==================== 操作日志 ====================
export async function getAuditLogs(params: {
  page: number
  page_size: number
  user_name?: string
  module?: string
  start_date?: string
  end_date?: string
}) {
  await simulateDelay()
  let filtered = [...auditLogs]
  if (params.user_name) filtered = searchItems(filtered, params.user_name, ['user_name'])
  if (params.module) filtered = filtered.filter(l => l.module === params.module)
  const result = paginate(filtered, params.page, params.page_size)
  return wrapListResponse(result.items, result.total, result.page, result.page_size)
}

// ==================== 编码规则 ====================
export async function getCodeRules() {
  await simulateDelay()
  return wrapDetailResponse(codeRules)
}

export async function createCodeRule(data: any) {
  await simulateDelay()
  codeRules.push({ id: generateId(), ...data })
  return wrapSuccessResponse('编码规则创建成功')
}

export async function updateCodeRule(id: string, data: any) {
  await simulateDelay()
  const idx = codeRules.findIndex(r => r.id === id)
  if (idx > -1) Object.assign(codeRules[idx], data)
  return wrapSuccessResponse('编码规则更新成功')
}

export async function deleteCodeRule(id: string) {
  await simulateDelay()
  const idx = codeRules.findIndex(r => r.id === id)
  if (idx > -1) codeRules.splice(idx, 1)
  return wrapSuccessResponse('编码规则删除成功')
}

// ==================== 审批流 ====================
export async function getApprovalFlows() {
  await simulateDelay()
  return wrapDetailResponse(approvalFlows)
}

export async function createApprovalFlow(data: any) {
  await simulateDelay()
  approvalFlows.push({ id: generateId(), ...data })
  return wrapSuccessResponse('审批流创建成功')
}

export async function updateApprovalFlow(id: string, data: any) {
  await simulateDelay()
  const idx = approvalFlows.findIndex(f => f.id === id)
  if (idx > -1) Object.assign(approvalFlows[idx], data)
  return wrapSuccessResponse('审批流更新成功')
}

export async function deleteApprovalFlow(id: string) {
  await simulateDelay()
  const idx = approvalFlows.findIndex(f => f.id === id)
  if (idx > -1) approvalFlows.splice(idx, 1)
  return wrapSuccessResponse('审批流删除成功')
}
