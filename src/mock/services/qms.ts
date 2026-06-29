/**
 * QMS (Quality Management System) Mock Service
 * 质检任务管理、质检模板、供应商质量
 */
import { simulateDelay } from '../shared/delay'
import { paginate, searchItems } from '../shared/paginate'
import { wrapListResponse, wrapDetailResponse, wrapSuccessResponse } from '../shared/response'
import { generateId } from '../shared/id'
import { inspectionTasks, qcTemplates } from '../modules/business'

// ==================== 质检任务列表 ====================
export async function getInspectionTaskList(params: {
  page: number
  page_size: number
  code?: string
  type?: string
  material?: string
  status?: string
}) {
  await simulateDelay()
  let filtered = [...inspectionTasks]
  if (params.code) filtered = searchItems(filtered, params.code, ['code'])
  if (params.type) filtered = filtered.filter((t) => (t as any).type === params.type)
  if (params.material) filtered = searchItems(filtered, params.material, ['material'])
  if (params.status) filtered = filtered.filter((t) => (t as any).status === params.status)
  const result = paginate(filtered, params.page, params.page_size)
  return wrapListResponse(result.items, result.total, result.page, result.page_size)
}

// ==================== 创建质检任务 ====================
export async function createInspectionTask(data: any) {
  await simulateDelay()
  const newTask = {
    id: generateId(),
    code: `IQC-${new Date().getFullYear()}${String(Math.floor(Math.random() * 100000)).padStart(5, '0')}`,
    created_at: new Date().toISOString().slice(0, 19),
    status: 'pending',
    ...data
  }
  ;(inspectionTasks as any[]).unshift(newTask)
  return wrapSuccessResponse('质检任务创建成功')
}

// ==================== 更新质检任务 ====================
export async function updateInspectionTask(id: string, data: any) {
  await simulateDelay()
  const idx = (inspectionTasks as any[]).findIndex((t: any) => String(t.id) === id)
  if (idx > -1) Object.assign((inspectionTasks as any[])[idx], data)
  return wrapSuccessResponse('质检任务更新成功')
}

// ==================== 删除质检任务 ====================
export async function deleteInspectionTask(id: string) {
  await simulateDelay()
  const idx = (inspectionTasks as any[]).findIndex((t: any) => String(t.id) === id)
  if (idx > -1) (inspectionTasks as any[]).splice(idx, 1)
  return wrapSuccessResponse('质检任务删除成功')
}

// ==================== 质检模板 ====================
export async function getQCTemplates() {
  await simulateDelay()
  return wrapDetailResponse(qcTemplates)
}

// ==================== 供应商质量列表（骨架） ====================
export async function getSupplierQualityList(params: { page: number; page_size: number }) {
  await simulateDelay()
  return wrapListResponse([], 0, params.page, params.page_size)
}
