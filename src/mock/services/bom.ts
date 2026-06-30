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
export async function getBOMList(params: { pageNum: number; pageSize: number; materialCode?: string; materialName?: string; status?: string }) {
  await simulateDelay()
  let filtered = [...bomList]
  if (params.materialCode) filtered = searchItems(filtered, params.materialCode, ['material_code'])
  if (params.materialName) filtered = searchItems(filtered, params.materialName, ['material_name'])
  if (params.status) filtered = filtered.filter((b) => b.status === params.status)
  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
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
  const newBOM = { id: generateId(), createdAt: new Date().toISOString().slice(0, 19).replace('T', ' '), ...data }
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
