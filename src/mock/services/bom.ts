/**
 * BOM Mock Service
 * 模拟 BOM 清单、BOM 树、BOM 预览的 CRUD 操作
 */
import { simulateDelay } from '../shared/delay'
import { paginate, searchItems } from '../shared/paginate'
import { wrapListResponse, wrapDetailResponse, wrapSuccessResponse } from '../shared/response'
import { generateId } from '../shared/id'
import { bomList, bomTree, bomPreview } from '../modules/bom'

// ==================== BOM 列表 ====================
export async function getBOMList(params: {
  page: number
  page_size: number
  material_code?: string
  material_name?: string
  status?: string
}) {
  await simulateDelay()
  let filtered = [...bomList]
  if (params.material_code) filtered = searchItems(filtered, params.material_code, ['material_code'])
  if (params.material_name) filtered = searchItems(filtered, params.material_name, ['material_name'])
  if (params.status) filtered = filtered.filter(b => b.status === params.status)
  const result = paginate(filtered, params.page, params.page_size)
  return wrapListResponse(result.items, result.total, result.page, result.page_size)
}

export async function getBOMTree(versionId: string) {
  await simulateDelay()
  // 忽略 versionId，直接返回全部 BOM 树
  return wrapDetailResponse(bomTree)
}

export async function saveBOM(data: any) {
  await simulateDelay()
  const idx = bomList.findIndex((b: any) => String(b.id) === String(data.id))
  if (idx > -1) {
    Object.assign(bomList[idx], data)
    return wrapSuccessResponse('BOM 更新成功')
  }
  const newBOM = { id: generateId(), created_at: new Date().toISOString().slice(0, 19), ...data }
  bomList.unshift(newBOM)
  return wrapSuccessResponse('BOM 创建成功')
}

export async function deleteBOM(id: string) {
  await simulateDelay()
  const idx = bomList.findIndex((b: any) => String(b.id) === id)
  if (idx > -1) bomList.splice(idx, 1)
  return wrapSuccessResponse('BOM 删除成功')
}

export async function getBOMPreview(materialCode: string) {
  await simulateDelay()
  // 忽略 materialCode，返回全部预览数据
  return wrapDetailResponse(bomPreview)
}
