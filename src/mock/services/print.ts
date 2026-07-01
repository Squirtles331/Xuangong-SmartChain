import type { PrintTemplate } from '@/api/print'
import { printTemplates } from '../modules/print'
import { simulateDelay } from '../shared/delay'
import { generateId } from '../shared/id'
import { paginate, searchItems } from '../shared/paginate'
import { wrapCreatedResponse, wrapDetailResponse, wrapListResponse, wrapSuccessResponse, wrapUpdatedResponse } from '../shared/response'

export async function getPrintTemplateList(params: { pageNum: number; pageSize: number; module?: string; category?: string; keyword?: string }) {
  await simulateDelay()

  let filtered = [...printTemplates]
  if (params.module) filtered = filtered.filter((item) => item.module === params.module)
  if (params.category) filtered = filtered.filter((item) => item.category === params.category)
  if (params.keyword) filtered = searchItems(filtered, params.keyword, ['name', 'templateKey'])

  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function getPrintTemplate(id: string) {
  await simulateDelay()
  const found = printTemplates.find((item) => String(item.id) === String(id))
  return wrapDetailResponse(found ?? null)
}

export async function getPublishedTemplate(templateKey: string) {
  await simulateDelay()
  const found = printTemplates.find((item) => item.templateKey === templateKey && item.status === 'published')
  return wrapDetailResponse(found ?? null)
}

export async function createPrintTemplate(data: Partial<PrintTemplate>) {
  await simulateDelay()
  const now = new Date().toISOString().slice(0, 19).replace('T', ' ')
  const next = {
    id: generateId(),
    version: 1,
    status: 'draft',
    createdAt: now,
    updatedAt: now,
    ...data
  } as PrintTemplate
  printTemplates.unshift(next)
  return wrapCreatedResponse(next, '新增模板成功')
}

export async function updatePrintTemplate(id: string, data: Partial<PrintTemplate>) {
  await simulateDelay()
  const index = printTemplates.findIndex((item) => String(item.id) === String(id))
  const now = new Date().toISOString().slice(0, 19).replace('T', ' ')
  if (index > -1) {
    printTemplates[index] = { ...printTemplates[index], ...data, updatedAt: now }
    return wrapUpdatedResponse(printTemplates[index], '编辑模板成功')
  }
  return wrapUpdatedResponse({ id, ...data } as PrintTemplate, '编辑模板成功')
}

export async function deletePrintTemplate(id: string) {
  await simulateDelay()
  const index = printTemplates.findIndex((item) => String(item.id) === String(id))
  if (index > -1) printTemplates.splice(index, 1)
  return wrapSuccessResponse('删除模板成功')
}

export async function createServerPrintJob(data: { templateKey: string; dataIds: string[] }) {
  await simulateDelay()
  return wrapCreatedResponse({ taskId: generateId(), templateKey: data.templateKey, count: data.dataIds.length }, '已提交批量打印任务')
}
