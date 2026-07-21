import { generateId } from '@/static/utils/id'
import { paginate, searchItems } from '@/static/utils/paginate'
import { wrapDetailResponse, wrapListResponse, wrapSuccessResponse } from '@/static/utils/response'

type BomRecord = Record<string, any>

const bomList: BomRecord[] = [
  {
    id: 'bom-1',
    material_code: '04.01.001-00001',
    material_name: 'Centrifugal Pump XJP-100',
    bom_type: 'EBOM',
    version: 'V2.0',
    status: 'active',
    effective_date: '2026-07-10',
    created_by: 'Zhang Gong',
    createdAt: '2026-07-10'
  },
  {
    id: 'bom-2',
    material_code: '04.01.001-00001',
    material_name: 'Centrifugal Pump XJP-100',
    bom_type: 'MBOM',
    version: 'V1.2',
    status: 'active',
    effective_date: '2026-07-12',
    created_by: 'Li Gong',
    createdAt: '2026-07-12'
  },
  {
    id: 'bom-3',
    material_code: '04.02.001-00001',
    material_name: 'Gear Box GBX-200',
    bom_type: 'MBOM',
    version: 'V1.0',
    status: 'active',
    effective_date: '2026-07-08',
    created_by: 'Wang Gong',
    createdAt: '2026-07-08'
  }
]

const bomTree = [
  {
    id: 'root',
    label: 'Centrifugal Pump XJP-100 x1',
    material_code: '04.01.001-00001',
    material_name: 'Centrifugal Pump XJP-100',
    qty: 1,
    children: [
      {
        id: 'body',
        label: 'Pump Body Assembly x1',
        material_code: '03.01.002-00001',
        material_name: 'Pump Body Assembly',
        qty: 1,
        children: [
          { id: 'casting', label: 'Pump Body Casting x1', material_code: '01.01.001-00001', material_name: 'Pump Body Casting', qty: 1 },
          { id: 'ring', label: 'Wear Ring x2', material_code: '02.01.001-00001', material_name: 'Wear Ring', qty: 2 }
        ]
      },
      {
        id: 'impeller',
        label: 'Impeller Assembly x1',
        material_code: '03.01.003-00001',
        material_name: 'Impeller Assembly',
        qty: 1
      }
    ]
  }
]

const bomPreview = [
  { level: 0, material: 'Centrifugal Pump XJP-100', qty: '1', total: '100', available: 120 },
  { level: 1, material: 'Pump Body Assembly', qty: '1', total: '100', available: 130 },
  { level: 2, material: 'Pump Body Casting', qty: '1', total: '100', available: 85 },
  { level: 2, material: 'Wear Ring', qty: '2', total: '200', available: 260 },
  { level: 1, material: 'Impeller Assembly', qty: '1', total: '100', available: 60 }
]

export async function getBOMList(params: {
  pageNum: number
  pageSize: number
  materialCode?: string
  materialName?: string
  bomType?: string
  status?: string
}) {
  let filtered = [...bomList]

  if (params.materialCode) filtered = searchItems(filtered, params.materialCode, ['material_code'])
  if (params.materialName) filtered = searchItems(filtered, params.materialName, ['material_name'])
  if (params.bomType) filtered = filtered.filter((item) => item.bom_type === params.bomType)
  if (params.status) filtered = filtered.filter((item) => item.status === params.status)

  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function getBOMTree(_versionId: string) {
  return wrapDetailResponse({
    material_name: 'Centrifugal Pump XJP-100',
    version: 'V1.2',
    tree: bomTree
  })
}

export async function saveBOM(data: Record<string, any>) {
  const index = bomList.findIndex((item) => String(item.id) === String(data.id))

  if (index > -1) {
    Object.assign(bomList[index], data)
    return wrapSuccessResponse('BOM updated')
  }

  bomList.unshift({
    id: generateId('bom'),
    createdAt: '2026-07-21',
    created_by: data.created_by || 'System',
    status: 'draft',
    ...data
  })

  return wrapSuccessResponse('BOM created')
}

export async function deleteBOM(id: string) {
  const index = bomList.findIndex((item) => String(item.id) === id)

  if (index > -1) {
    bomList.splice(index, 1)
  }

  return wrapSuccessResponse('BOM deleted')
}

export async function getBOMPreview(_materialCode: string) {
  return wrapDetailResponse(bomPreview)
}
