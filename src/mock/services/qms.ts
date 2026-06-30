import { inspectionTasks, qcTemplates, supplierQualityList } from '../modules/qms'
import { simulateDelay } from '../shared/delay'
import { generateId } from '../shared/id'
import { paginate, searchItems } from '../shared/paginate'
import { wrapCreatedResponse, wrapDetailResponse, wrapListResponse, wrapSuccessResponse, wrapUpdatedResponse } from '../shared/response'

export async function getInspectionTaskList(params: {
  pageNum: number
  pageSize: number
  code?: string
  type?: string
  material?: string
  status?: string
}) {
  await simulateDelay()

  let filtered = [...inspectionTasks]
  if (params.code) filtered = searchItems(filtered, params.code, ['code'])
  if (params.type) filtered = filtered.filter((item) => item.type === params.type)
  if (params.material) filtered = searchItems(filtered, params.material, ['material'])
  if (params.status) filtered = filtered.filter((item) => item.status === params.status)

  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function createInspectionTask(data: any) {
  await simulateDelay()
  const next = {
    id: generateId(),
    code: `IQC-2026${String(Math.floor(Math.random() * 100000)).padStart(5, '0')}`,
    status: 'pending',
    verdict: '',
    ...data
  }
  inspectionTasks.unshift(next)
  return wrapCreatedResponse(next, '新增检验任务成功')
}

export async function updateInspectionTask(id: string, data: any) {
  await simulateDelay()
  const index = inspectionTasks.findIndex((item) => String(item.id) === id)
  if (index > -1) {
    inspectionTasks[index] = { ...inspectionTasks[index], ...data }
    return wrapUpdatedResponse(inspectionTasks[index], '编辑检验任务成功')
  }
  return wrapUpdatedResponse({ id, ...data }, '编辑检验任务成功')
}

export async function deleteInspectionTask(id: string) {
  await simulateDelay()
  const index = inspectionTasks.findIndex((item) => String(item.id) === id)
  if (index > -1) inspectionTasks.splice(index, 1)
  return wrapSuccessResponse('删除检验任务成功')
}

export async function getQCTemplateList(params: { pageNum: number; pageSize: number; keyword?: string; category?: string }) {
  await simulateDelay()
  let filtered = [...qcTemplates]
  if (params.keyword) filtered = searchItems(filtered, params.keyword, ['name'])
  if (params.category) filtered = filtered.filter((item) => item.category === params.category)
  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function createQCTemplate(data: any) {
  await simulateDelay()
  const next = { id: generateId(), itemCount: data.items?.length || 0, ...data }
  qcTemplates.unshift(next)
  return wrapCreatedResponse(next, '新增检验模板成功')
}

export async function updateQCTemplate(id: string, data: any) {
  await simulateDelay()
  const index = qcTemplates.findIndex((item) => item.id === id)
  if (index > -1) {
    qcTemplates[index] = { ...qcTemplates[index], ...data, itemCount: data.items?.length || qcTemplates[index].itemCount }
    return wrapUpdatedResponse(qcTemplates[index], '编辑检验模板成功')
  }
  return wrapUpdatedResponse({ id, ...data }, '编辑检验模板成功')
}

export async function deleteQCTemplate(id: string) {
  await simulateDelay()
  const index = qcTemplates.findIndex((item) => item.id === id)
  if (index > -1) qcTemplates.splice(index, 1)
  return wrapSuccessResponse('删除检验模板成功')
}

export async function getSupplierQualityList(params: { pageNum: number; pageSize: number; supplier?: string }) {
  await simulateDelay()
  let filtered = [...supplierQualityList]
  if (params.supplier) filtered = searchItems(filtered, params.supplier, ['supplier'])
  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function createSupplierQuality(data: any) {
  await simulateDelay()
  const next = { id: generateId(), ...data }
  supplierQualityList.unshift(next)
  return wrapCreatedResponse(next, '新增供应商质量记录成功')
}

export async function updateSupplierQuality(id: string, data: any) {
  await simulateDelay()
  const index = supplierQualityList.findIndex((item) => item.id === id)
  if (index > -1) {
    supplierQualityList[index] = { ...supplierQualityList[index], ...data }
    return wrapUpdatedResponse(supplierQualityList[index], '编辑供应商质量记录成功')
  }
  return wrapUpdatedResponse({ id, ...data }, '编辑供应商质量记录成功')
}

export async function deleteSupplierQuality(id: string) {
  await simulateDelay()
  const index = supplierQualityList.findIndex((item) => item.id === id)
  if (index > -1) supplierQualityList.splice(index, 1)
  return wrapSuccessResponse('删除供应商质量记录成功')
}
