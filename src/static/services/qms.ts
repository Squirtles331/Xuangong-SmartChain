import { inspectionTasks as inspectionTasksSeed } from '@/mock/modules/qms'
import { generateId } from '@/mock/shared/id'
import { paginate, searchItems } from '@/mock/shared/paginate'
import { MockResponse, wrapCreatedResponse, wrapListResponse, wrapSuccessResponse, wrapUpdatedResponse } from '@/mock/shared/response'

type InspectionTaskRecord = Record<string, any>

const inspectionTasks = cloneSeed(inspectionTasksSeed) as InspectionTaskRecord[]

function cloneSeed<T>(seed: T): T {
  if (typeof structuredClone === 'function') {
    return structuredClone(seed)
  }

  return JSON.parse(JSON.stringify(seed)) as T
}

function createInspectionCode(id: string) {
  return `IQC-2026${id.slice(-5).padStart(5, '0')}`
}

export async function getInspectionTaskList(params: {
  pageNum: number
  pageSize: number
  code?: string
  type?: string
  material?: string
  status?: string
}) {
  let filtered = [...inspectionTasks]

  if (params.code) {
    filtered = searchItems(filtered, params.code, ['code'])
  }

  if (params.type) {
    filtered = filtered.filter((item) => item.type === params.type)
  }

  if (params.material) {
    filtered = searchItems(filtered, params.material, ['material'])
  }

  if (params.status) {
    filtered = filtered.filter((item) => item.status === params.status)
  }

  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function createInspectionTask(data: InspectionTaskRecord) {
  const id = generateId()
  const next = {
    id,
    code: data.code || createInspectionCode(id),
    status: data.status || 'pending',
    verdict: data.verdict || '',
    ...data
  }

  inspectionTasks.unshift(next)
  return wrapCreatedResponse(next, '新增检验任务成功')
}

export async function updateInspectionTask(id: string, data: InspectionTaskRecord) {
  const index = inspectionTasks.findIndex((item) => String(item.id) === id)

  if (index === -1) {
    return MockResponse.fail(404, '检验任务不存在', null)
  }

  inspectionTasks[index] = {
    ...inspectionTasks[index],
    ...data
  }

  return wrapUpdatedResponse(inspectionTasks[index], '编辑检验任务成功')
}

export async function deleteInspectionTask(id: string) {
  const index = inspectionTasks.findIndex((item) => String(item.id) === id)

  if (index === -1) {
    return MockResponse.fail(404, '检验任务不存在', null)
  }

  inspectionTasks.splice(index, 1)
  return wrapSuccessResponse('删除检验任务成功')
}
