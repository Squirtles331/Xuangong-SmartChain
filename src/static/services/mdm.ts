import { generateId } from '@/static/utils/id'
import { paginate, searchItems } from '@/static/utils/paginate'
import { wrapDetailResponse, wrapListResponse, wrapSuccessResponse } from '@/static/utils/response'

const orgTree = [
  {
    id: '1',
    name: 'Xuangong Group',
    code: 'ORG-GROUP-001',
    type: 'group',
    children: [
      {
        id: '2',
        name: 'Xuangong Heavy Industry',
        code: 'ORG-COMP-001',
        type: 'company',
        children: [
          {
            id: '3',
            name: 'Plant 1',
            code: 'ORG-PLANT-001',
            type: 'plant',
            children: [
              {
                id: '4',
                name: 'Machining Workshop 1',
                code: 'ORG-WS-001',
                type: 'workshop',
                children: [
                  { id: '41', name: 'Line A', code: 'ORG-LINE-001', type: 'line' },
                  { id: '42', name: 'Line B', code: 'ORG-LINE-002', type: 'line' }
                ]
              },
              { id: '5', name: 'Machining Workshop 2', code: 'ORG-WS-002', type: 'workshop', children: [] },
              { id: '6', name: 'Assembly Workshop', code: 'ORG-WS-003', type: 'workshop', children: [] }
            ]
          }
        ]
      }
    ]
  }
]

const materialTree = [
  {
    id: '1',
    name: 'Raw Material',
    children: [
      {
        id: '11',
        name: 'Steel',
        children: [
          { id: '111', name: 'Round Steel' },
          { id: '112', name: 'Steel Plate' }
        ]
      }
    ]
  },
  {
    id: '2',
    name: 'Purchased Part',
    children: [
      { id: '21', name: 'Bearing' },
      { id: '22', name: 'Fastener' },
      { id: '23', name: 'Seal' }
    ]
  },
  { id: '3', name: 'Semi-finished', children: [] },
  { id: '4', name: 'Finished Goods', children: [] }
]

const materialList = [
  { id: 'mat-1', code: '01.01.001-00001', name: '45 Steel Bar D50', spec: 'D50', type: 'purchased', unit: 'kg', category: 'Raw Material' },
  { id: 'mat-2', code: '02.04.001-00001', name: 'Bearing 6308', spec: 'SKF 6308', type: 'purchased', unit: 'pcs', category: 'Purchased Part' },
  {
    id: 'mat-3',
    code: '03.01.001-00001',
    name: 'Transmission Shaft DS-50',
    spec: 'D50x500',
    type: 'manufactured',
    unit: 'pcs',
    category: 'Semi-finished'
  },
  {
    id: 'mat-4',
    code: '04.01.001-00001',
    name: 'Centrifugal Pump XJP-100',
    spec: '100m3/h',
    type: 'manufactured',
    unit: 'set',
    category: 'Finished Goods'
  }
]

const equipments = [
  {
    id: 'eq-1',
    code: 'EQ0000000001',
    name: 'CNC Lathe',
    model: 'CK6150',
    workshop: 'Machining Workshop 1',
    status: 'running',
    purchase_date: '2023-03-12',
    commission_date: '2023-04-01'
  },
  {
    id: 'eq-2',
    code: 'EQ0000000002',
    name: 'Drill',
    model: 'Z3050',
    workshop: 'Machining Workshop 1',
    status: 'idle',
    purchase_date: '2022-11-18',
    commission_date: '2022-12-06'
  },
  {
    id: 'eq-3',
    code: 'EQ0000000003',
    name: 'Machining Center',
    model: 'VMC850',
    workshop: 'Machining Workshop 2',
    status: 'maintenance',
    purchase_date: '2024-01-09',
    commission_date: '2024-01-28'
  }
]

const resources = [
  { id: 'res-1', code: 'RES00000001', name: 'CNC Lathe', type: 'Machine', model: 'CK6150', status: 'running', workCenter: 'CNC Group' },
  { id: 'res-2', code: 'RES00000002', name: 'CMM', type: 'Inspection', model: 'CMM-7106', status: 'repair', workCenter: 'Quality Group' }
]

const workCenters = [
  {
    id: 'wc-1',
    code: 'WC00000001',
    name: 'CNC Group',
    workshop: 'Machining Workshop 1',
    shift: 'Day',
    people: 12,
    efficiency: 92,
    costPerHour: 150,
    status: 'running'
  },
  {
    id: 'wc-2',
    code: 'WC00000002',
    name: 'Assembly Group',
    workshop: 'Assembly Workshop',
    shift: 'Day',
    people: 10,
    efficiency: 90,
    costPerHour: 100,
    status: 'running'
  }
]

const molds = [
  { id: 'mold-1', code: 'MD0000000001', name: 'Pump Body Mold', type: 'Casting', lifeDesign: 10000, used: 3500, status: 'using' },
  { id: 'mold-2', code: 'MD0000000002', name: 'Impeller Forge Mold', type: 'Forging', lifeDesign: 5000, used: 1200, status: 'idle' }
]

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T
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

function filterOrgTree(nodes: any[], keyword?: string, type?: string): any[] {
  return nodes
    .map((node) => {
      const children = Array.isArray(node.children) ? filterOrgTree(node.children, keyword, type) : []
      const matchKeyword = !keyword || String(node.name).includes(keyword) || String(node.code || '').includes(keyword)
      const matchType = !type || node.type === type

      if ((matchKeyword && matchType) || children.length > 0) {
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

export async function getOrgTree() {
  return wrapDetailResponse(clone(orgTree))
}

export async function getOrgTreeList(params?: { pageNum?: number; pageSize?: number; keyword?: string; type?: string; nodeId?: string }) {
  const tree = clone(orgTree)
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
  return wrapDetailResponse(findOrgNode(orgTree as any[], id))
}

export async function createOrgNode(data: any) {
  const newNode = {
    id: generateId('org'),
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

  return wrapSuccessResponse('Org node created')
}

export async function updateOrgNode(id: string, data: any) {
  const target = findOrgNode(orgTree as any[], id)
  if (target) Object.assign(target, data)
  return wrapSuccessResponse('Org node updated')
}

export async function deleteOrgNode(id: string) {
  removeOrgNode(orgTree as any[], id)
  return wrapSuccessResponse('Org node deleted')
}

export async function getMaterialTree() {
  return wrapDetailResponse(clone(materialTree))
}

export async function getMaterialList(params: { pageNum: number; pageSize: number; code?: string; name?: string; type?: string; category?: string }) {
  let filtered = [...materialList]
  if (params.code) filtered = searchItems(filtered, params.code, ['code'])
  if (params.name) filtered = searchItems(filtered, params.name, ['name'])
  if (params.type) filtered = filtered.filter((item) => item.type === params.type)
  if (params.category) filtered = filtered.filter((item) => item.category === params.category)
  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function createMaterial(data: any) {
  materialList.unshift({ id: generateId('mat'), ...data })
  return wrapSuccessResponse('Material created')
}

export async function updateMaterial(id: string, data: any) {
  const index = materialList.findIndex((item) => item.id === id)
  if (index > -1) Object.assign(materialList[index], data)
  return wrapSuccessResponse('Material updated')
}

export async function deleteMaterial(id: string) {
  const index = materialList.findIndex((item) => item.id === id)
  if (index > -1) materialList.splice(index, 1)
  return wrapSuccessResponse('Material deleted')
}

export async function getEquipmentList(params: { pageNum: number; pageSize: number; name?: string; workshop?: string; status?: string }) {
  let filtered = [...equipments]
  if (params.name) filtered = searchItems(filtered, params.name, ['name'])
  if (params.workshop) filtered = searchItems(filtered, params.workshop, ['workshop'])
  if (params.status) filtered = filtered.filter((item) => item.status === params.status)
  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function createEquipment(data: any) {
  equipments.unshift({ id: generateId('eq'), ...data })
  return wrapSuccessResponse('Equipment created')
}

export async function updateEquipment(id: string, data: any) {
  const index = equipments.findIndex((item) => item.id === id)
  if (index > -1) Object.assign(equipments[index], data)
  return wrapSuccessResponse('Equipment updated')
}

export async function deleteEquipment(id: string) {
  const index = equipments.findIndex((item) => item.id === id)
  if (index > -1) equipments.splice(index, 1)
  return wrapSuccessResponse('Equipment deleted')
}

export async function getWorkCenterList(params: { pageNum: number; pageSize: number; keyword?: string; workshop?: string }) {
  let filtered = [...workCenters]
  if (params.keyword) filtered = searchItems(filtered, params.keyword, ['code', 'name', 'workshop'])
  if (params.workshop) filtered = filtered.filter((item) => item.workshop === params.workshop)
  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function createWorkCenter(data: any) {
  workCenters.unshift({ id: generateId('wc'), ...data })
  return wrapSuccessResponse('Work center created')
}

export async function updateWorkCenter(id: string, data: any) {
  const index = workCenters.findIndex((item) => item.id === id)
  if (index > -1) Object.assign(workCenters[index], data)
  return wrapSuccessResponse('Work center updated')
}

export async function deleteWorkCenter(id: string) {
  const index = workCenters.findIndex((item) => item.id === id)
  if (index > -1) workCenters.splice(index, 1)
  return wrapSuccessResponse('Work center deleted')
}

export async function getResourceList(params: { pageNum: number; pageSize: number; keyword?: string; status?: string }) {
  let filtered = [...resources]
  if (params.keyword) filtered = searchItems(filtered, params.keyword, ['code', 'name', 'type', 'model', 'workCenter'])
  if (params.status) filtered = filtered.filter((item) => item.status === params.status)
  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function createResource(data: any) {
  resources.unshift({ id: generateId('res'), ...data })
  return wrapSuccessResponse('Resource created')
}

export async function updateResource(id: string, data: any) {
  const index = resources.findIndex((item) => item.id === id)
  if (index > -1) Object.assign(resources[index], data)
  return wrapSuccessResponse('Resource updated')
}

export async function deleteResource(id: string) {
  const index = resources.findIndex((item) => item.id === id)
  if (index > -1) resources.splice(index, 1)
  return wrapSuccessResponse('Resource deleted')
}

export async function getMoldList(params: { pageNum: number; pageSize: number; keyword?: string; type?: string; status?: string }) {
  let filtered = [...molds]
  if (params.keyword) filtered = searchItems(filtered, params.keyword, ['code', 'name'])
  if (params.type) filtered = filtered.filter((item) => item.type === params.type)
  if (params.status) filtered = filtered.filter((item) => item.status === params.status)
  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function createMold(data: any) {
  molds.unshift({ id: generateId('mold'), ...data })
  return wrapSuccessResponse('Mold created')
}

export async function updateMold(id: string, data: any) {
  const index = molds.findIndex((item) => item.id === id)
  if (index > -1) Object.assign(molds[index], data)
  return wrapSuccessResponse('Mold updated')
}

export async function deleteMold(id: string) {
  const index = molds.findIndex((item) => item.id === id)
  if (index > -1) molds.splice(index, 1)
  return wrapSuccessResponse('Mold deleted')
}
