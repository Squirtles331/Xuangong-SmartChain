import { inspectionTasks, qcTemplates } from '../modules/qms'
import { simulateDelay } from '../shared/delay'
import { generateId } from '../shared/id'
import { paginate, searchItems } from '../shared/paginate'
import { wrapDetailResponse, wrapListResponse, wrapSuccessResponse } from '../shared/response'

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

  if (params.code) {
    filtered = searchItems(filtered, params.code, ['code'])
  }

  if (params.type) {
    filtered = filtered.filter((item) => (item as any).type === params.type)
  }

  if (params.material) {
    filtered = searchItems(filtered, params.material, ['material'])
  }

  if (params.status) {
    filtered = filtered.filter((item) => (item as any).status === params.status)
  }

  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function createInspectionTask(data: any) {
  await simulateDelay()

  const newTask = {
    id: generateId(),
    code: `IQC-${new Date().getFullYear()}${String(Math.floor(Math.random() * 100000)).padStart(5, '0')}`,
    createdAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
    status: 'pending',
    ...data
  }

  ;(inspectionTasks as any[]).unshift(newTask)
  return wrapSuccessResponse('Inspection task created')
}

export async function updateInspectionTask(id: string, data: any) {
  await simulateDelay()
  const index = (inspectionTasks as any[]).findIndex((item: any) => String(item.id) === id)

  if (index > -1) {
    Object.assign((inspectionTasks as any[])[index], data)
  }

  return wrapSuccessResponse('Inspection task updated')
}

export async function deleteInspectionTask(id: string) {
  await simulateDelay()
  const index = (inspectionTasks as any[]).findIndex((item: any) => String(item.id) === id)

  if (index > -1) {
    ;(inspectionTasks as any[]).splice(index, 1)
  }

  return wrapSuccessResponse('Inspection task deleted')
}

export async function getQCTemplates() {
  await simulateDelay()
  return wrapDetailResponse(qcTemplates)
}

export async function getSupplierQualityList(params: { pageNum: number; pageSize: number }) {
  await simulateDelay()
  return wrapListResponse([], 0, params.pageNum, params.pageSize)
}
