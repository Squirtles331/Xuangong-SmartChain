import { simulateDelay } from '../shared/delay'
import { generateId } from '../shared/id'
import { paginate, searchItems } from '../shared/paginate'
import { wrapDetailResponse, wrapListResponse, wrapSuccessResponse } from '../shared/response'

const bomList = [
  {
    id: '1',
    material_code: '04.01.001-00001',
    material_name: '离心泵 XJP-100',
    bom_type: 'EBOM',
    version: 'V2.0',
    status: 'active',
    effective_date: '2025-01-10',
    created_by: '张工',
    createdAt: '2025-01-10'
  },
  {
    id: '2',
    material_code: '04.01.001-00001',
    material_name: '离心泵 XJP-100',
    bom_type: 'MBOM',
    version: 'V1.2',
    status: 'active',
    effective_date: '2025-01-12',
    created_by: '李工',
    createdAt: '2025-01-12'
  },
  {
    id: '3',
    material_code: '04.02.001-00001',
    material_name: '齿轮箱 GBX-200',
    bom_type: 'EBOM',
    version: 'V1.0',
    status: 'active',
    effective_date: '2025-01-05',
    created_by: '张工',
    createdAt: '2025-01-05'
  },
  {
    id: '4',
    material_code: '04.02.001-00001',
    material_name: '齿轮箱 GBX-200',
    bom_type: 'MBOM',
    version: 'V1.0',
    status: 'active',
    effective_date: '2025-01-08',
    created_by: '李工',
    createdAt: '2025-01-08'
  },
  {
    id: '5',
    material_code: '03.01.001-00001',
    material_name: '传动轴 DS-50',
    bom_type: 'MBOM',
    version: 'V1.1',
    status: 'draft',
    effective_date: '-',
    created_by: '李工',
    createdAt: '2025-01-15'
  },
  {
    id: '6',
    material_code: '04.01.001-00001',
    material_name: '离心泵 XJP-100',
    bom_type: 'MBOM',
    version: 'V1.1',
    status: 'archived',
    effective_date: '2024-12-01',
    created_by: '王工',
    createdAt: '2024-12-01'
  }
]

const bomTree = [
  {
    id: 'root',
    label: '离心泵 XJP-100 ×1',
    material_code: '04.01.001-00001',
    material_name: '离心泵 XJP-100',
    qty: 1,
    scrap_rate: 0,
    position_no: '',
    material_type: 'normal',
    is_critical: false,
    substitute_allowed: false,
    children: [
      {
        id: 'c1',
        label: '泵体组件 ×1',
        material_code: '03.01.002-00001',
        material_name: '泵体组件',
        qty: 1,
        scrap_rate: 0,
        position_no: 'A1',
        material_type: 'normal',
        is_critical: true,
        substitute_allowed: false,
        children: [
          {
            id: 'c11',
            label: '泵体铸件 ×1',
            material_code: '01.01.001-00001',
            material_name: '泵体铸件',
            qty: 1,
            scrap_rate: 2,
            position_no: 'A1-1',
            material_type: 'normal',
            is_critical: true,
            substitute_allowed: false
          },
          {
            id: 'c12',
            label: '耐磨环 ×2',
            material_code: '02.01.001-00001',
            material_name: '耐磨环',
            qty: 2,
            scrap_rate: 0,
            position_no: 'A1-2',
            material_type: 'normal',
            is_critical: false,
            substitute_allowed: false
          },
          {
            id: 'c13',
            label: '螺栓 M16×60 ×8',
            material_code: '02.02.001-00001',
            material_name: '螺栓 M16×60',
            qty: 8,
            scrap_rate: 1,
            position_no: 'A1-3',
            material_type: 'normal',
            is_critical: false,
            substitute_allowed: true
          }
        ]
      },
      {
        id: 'c2',
        label: '叶轮组件 ×1',
        material_code: '03.01.003-00001',
        material_name: '叶轮组件',
        qty: 1,
        scrap_rate: 0,
        position_no: 'A2',
        material_type: 'normal',
        is_critical: true,
        substitute_allowed: false,
        children: [
          {
            id: 'c21',
            label: '叶轮铸件 ×1',
            material_code: '01.01.002-00001',
            material_name: '叶轮铸件',
            qty: 1,
            scrap_rate: 1.5,
            position_no: 'A2-1',
            material_type: 'normal',
            is_critical: true,
            substitute_allowed: false
          },
          {
            id: 'c22',
            label: '键 8×7×30 ×1',
            material_code: '02.03.001-00001',
            material_name: '键 8×7×30',
            qty: 1,
            scrap_rate: 0,
            position_no: 'A2-2',
            material_type: 'normal',
            is_critical: false,
            substitute_allowed: false
          }
        ]
      },
      {
        id: 'c3',
        label: '轴承架组件 ×1',
        material_code: '03.01.004-00001',
        material_name: '轴承架组件',
        qty: 1,
        scrap_rate: 0,
        position_no: 'A3',
        material_type: 'phantom',
        is_critical: false,
        substitute_allowed: false,
        children: [
          {
            id: 'c31',
            label: '轴承架 ×1',
            material_code: '01.01.003-00001',
            material_name: '轴承架',
            qty: 1,
            scrap_rate: 0,
            position_no: 'A3-1',
            material_type: 'normal',
            is_critical: false,
            substitute_allowed: false
          },
          {
            id: 'c32',
            label: '轴承 6308 ×2',
            material_code: '02.04.001-00001',
            material_name: '轴承 6308',
            qty: 2,
            scrap_rate: 0,
            position_no: 'A3-2',
            material_type: 'normal',
            is_critical: true,
            substitute_allowed: true
          }
        ]
      },
      {
        id: 'c4',
        label: '润滑油 Shell Tellus 46 ×0.5L',
        material_code: '05.01.001-00001',
        material_name: '润滑油 Shell Tellus 46',
        qty: 0.5,
        scrap_rate: 0,
        position_no: '',
        material_type: 'auxiliary',
        is_critical: false,
        substitute_allowed: false
      }
    ]
  }
]

const bomPreview = [
  { level: 0, material: '离心泵 XJP-100', qty: '1', total: '100台' },
  { level: 1, material: '泵体组件', qty: '1', total: '100' },
  { level: 2, material: '泵体铸件', qty: '1', total: '100' },
  { level: 2, material: '耐磨环', qty: '2', total: '200' },
  { level: 2, material: '螺栓 M16×60', qty: '8', total: '800' },
  { level: 1, material: '叶轮组件', qty: '1', total: '100' },
  { level: 1, material: '轴承架组件', qty: '1', total: '100' }
]

export async function getBOMList(params: {
  pageNum: number
  pageSize: number
  materialCode?: string
  materialName?: string
  bomType?: string
  status?: string
}) {
  await simulateDelay()
  let filtered = [...bomList]
  if (params.materialCode) filtered = searchItems(filtered, params.materialCode, ['material_code'])
  if (params.materialName) filtered = searchItems(filtered, params.materialName, ['material_name'])
  if (params.bomType) filtered = filtered.filter((item) => item.bom_type === params.bomType)
  if (params.status) filtered = filtered.filter((item) => item.status === params.status)
  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function getBOMTree(_versionId: string) {
  await simulateDelay()
  return wrapDetailResponse({
    material_name: '离心泵 XJP-100',
    version: 'V1.2',
    tree: bomTree
  })
}

export async function saveBOM(data: any) {
  await simulateDelay()
  const index = bomList.findIndex((item: any) => String(item.id) === String(data.id))
  if (index > -1) {
    Object.assign(bomList[index], data)
    return wrapSuccessResponse('BOM 更新成功')
  }

  bomList.unshift({
    id: generateId(),
    createdAt: new Date().toISOString().slice(0, 10),
    created_by: data.created_by || '系统',
    ...data
  })
  return wrapSuccessResponse('BOM 创建成功')
}

export async function deleteBOM(id: string) {
  await simulateDelay()
  const index = bomList.findIndex((item: any) => String(item.id) === id)
  if (index > -1) bomList.splice(index, 1)
  return wrapSuccessResponse('BOM 删除成功')
}

export async function getBOMPreview(_materialCode: string) {
  await simulateDelay()
  return wrapDetailResponse(bomPreview)
}
