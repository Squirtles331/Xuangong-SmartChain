/**
 * MDM (Master Data Management) Mock Service
 * 组织架构、物料主数据、制造资源
 */
import { simulateDelay } from '../shared/delay'
import { paginate, searchItems } from '../shared/paginate'
import { wrapListResponse, wrapDetailResponse, wrapSuccessResponse } from '../shared/response'
import { generateId } from '../shared/id'
import { orgTree, materialTree, materialList, equipments, workCenters, molds } from '../modules/mdm'

// ==================== 组织架构 ====================
export async function getOrgTree() {
  await simulateDelay()
  return wrapDetailResponse(orgTree)
}

function cloneOrgTree(nodes: any[]): any[] {
  return JSON.parse(JSON.stringify(nodes))
}

function filterOrgTree(nodes: any[], keyword?: string, type?: string): any[] {
  return nodes
    .map((node) => {
      const children = Array.isArray(node.children) ? filterOrgTree(node.children, keyword, type) : []
      const matchKeyword = !keyword || String(node.name).includes(keyword) || String(node.code || '').includes(keyword)
      const matchType = !type || node.type === type
      const selfMatch = matchKeyword && matchType

      if (selfMatch || children.length > 0) {
        return {
          ...node,
          children
        }
      }

      return null
    })
    .filter(Boolean)
}

function flattenOrgTree(
  nodes: any[],
  parentName = '-'
): Array<{ id: string; name: string; code: string; type: string; parentName: string; childCount: number }> {
  return nodes.flatMap((node) => {
    const current = {
      id: String(node.id),
      name: String(node.name),
      code: String(node.code || '-'),
      type: String(node.type),
      parentName,
      childCount: Array.isArray(node.children) ? node.children.length : 0
    }

    const children = Array.isArray(node.children) ? flattenOrgTree(node.children, String(node.name)) : []
    return [current, ...children]
  })
}

export async function getOrgTreeList(params?: { pageNum?: number; pageSize?: number; keyword?: string; type?: string; nodeId?: string }) {
  await simulateDelay()
  const tree = cloneOrgTree(orgTree as any[])
  const filteredTree = !params?.keyword && !params?.type ? tree : filterOrgTree(tree, params?.keyword, params?.type)
  const flatList = flattenOrgTree(filteredTree)
  const nodeFilteredList = params?.nodeId
    ? flatList.filter((item) => item.id === params.nodeId || isInBranch(filteredTree, params.nodeId, item.id))
    : flatList
  const pageNum = params?.pageNum ?? 1
  const pageSize = params?.pageSize ?? (nodeFilteredList.length || 10)
  const result = paginate(nodeFilteredList, pageNum, pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function getOrgNodeDetail(id: string) {
  await simulateDelay()
  const node = findOrgNode(orgTree as any[], id)
  return wrapDetailResponse(node)
}

function findOrgNode(nodes: any[], id: string): any | null {
  for (const node of nodes) {
    if (String(node.id) === id) return node
    if (node.children?.length) {
      const found = findOrgNode(node.children, id)
      if (found) return found
    }
  }
  return null
}

function isInBranch(nodes: any[], rootId: string, targetId: string): boolean {
  const root = findOrgNode(nodes, rootId)
  if (!root) return false
  if (String(root.id) === targetId) return true

  const stack = [...(root.children || [])]
  while (stack.length) {
    const current = stack.pop()
    if (!current) continue
    if (String(current.id) === targetId) return true
    if (current.children?.length) stack.push(...current.children)
  }
  return false
}

function removeOrgNode(nodes: any[], id: string): boolean {
  for (let index = 0; index < nodes.length; index += 1) {
    if (String(nodes[index].id) === id) {
      nodes.splice(index, 1)
      return true
    }
    if (nodes[index].children?.length && removeOrgNode(nodes[index].children, id)) return true
  }
  return false
}

export async function createOrgNode(data: any) {
  await simulateDelay()
  const newNode = {
    id: generateId(),
    name: data.name,
    code: data.code,
    type: data.type,
    children: []
  }

  if (data.parentId) {
    const parent = findOrgNode(orgTree as any[], data.parentId)
    if (parent) {
      if (!Array.isArray(parent.children)) parent.children = []
      parent.children.push(newNode)
    }
  } else {
    ;(orgTree as any[]).push(newNode)
  }

  return wrapSuccessResponse('组织节点创建成功')
}

export async function updateOrgNode(id: string, data: any) {
  await simulateDelay()
  const target = findOrgNode(orgTree as any[], id)
  if (target) {
    target.name = data.name
    target.code = data.code
  }
  return wrapSuccessResponse('组织节点更新成功')
}

export async function deleteOrgNode(id: string) {
  await simulateDelay()
  removeOrgNode(orgTree as any[], id)
  return wrapSuccessResponse('组织节点删除成功')
}

// ==================== 物料主数据 ====================
export async function getMaterialTree() {
  await simulateDelay()
  return wrapDetailResponse(materialTree)
}

export async function getMaterialList(params: { pageNum: number; pageSize: number; code?: string; name?: string; type?: string }) {
  await simulateDelay()
  let filtered = [...materialList]
  if (params.code) filtered = searchItems(filtered, params.code, ['code'])
  if (params.name) filtered = searchItems(filtered, params.name, ['name'])
  if (params.type) filtered = filtered.filter((m) => (m as any).type === params.type)
  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function createMaterial(data: any) {
  await simulateDelay()
  const newMaterial = { id: generateId(), ...data }
  ;(materialList as any[]).unshift(newMaterial)
  return wrapSuccessResponse('物料创建成功')
}

export async function updateMaterial(id: string, data: any) {
  await simulateDelay()
  const idx = (materialList as any[]).findIndex((m: any) => String(m.id) === id)
  if (idx > -1) Object.assign((materialList as any[])[idx], data)
  return wrapSuccessResponse('物料更新成功')
}

export async function deleteMaterial(id: string) {
  await simulateDelay()
  const idx = (materialList as any[]).findIndex((m: any) => String(m.id) === id)
  if (idx > -1) (materialList as any[]).splice(idx, 1)
  return wrapSuccessResponse('物料删除成功')
}

// ==================== 设备管理 ====================
export async function getEquipmentList(params: { pageNum: number; pageSize: number; name?: string; workshop?: string; status?: string }) {
  await simulateDelay()
  let filtered = [...equipments]
  if (params.name) filtered = searchItems(filtered, params.name, ['name'])
  if (params.workshop) filtered = searchItems(filtered, params.workshop, ['workshop'])
  if (params.status) filtered = filtered.filter((e) => (e as any).status === params.status)
  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function createEquipment(data: any) {
  await simulateDelay()
  const newEquipment = { id: generateId(), ...data }
  ;(equipments as any[]).unshift(newEquipment)
  return wrapSuccessResponse('设备创建成功')
}

export async function updateEquipment(id: string, data: any) {
  await simulateDelay()
  const idx = (equipments as any[]).findIndex((e: any) => String(e.id) === id)
  if (idx > -1) Object.assign((equipments as any[])[idx], data)
  return wrapSuccessResponse('设备更新成功')
}

export async function deleteEquipment(id: string) {
  await simulateDelay()
  const idx = (equipments as any[]).findIndex((e: any) => String(e.id) === id)
  if (idx > -1) (equipments as any[]).splice(idx, 1)
  return wrapSuccessResponse('设备删除成功')
}

// ==================== 工作中心 ====================
export async function getWorkCenterList() {
  await simulateDelay()
  return wrapDetailResponse(workCenters)
}

// ==================== 模具管理 ====================
export async function getMoldList() {
  await simulateDelay()
  return wrapDetailResponse(molds)
}
