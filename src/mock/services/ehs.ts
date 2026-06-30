import { ehsEmergencyPlans, ehsHazards, ehsPermits, ehsTrainingRecords } from '../modules/ehs'
import { simulateDelay } from '../shared/delay'
import { generateId } from '../shared/id'
import { paginate, searchItems } from '../shared/paginate'
import { wrapCreatedResponse, wrapListResponse, wrapSuccessResponse, wrapUpdatedResponse } from '../shared/response'

function createCode(prefix: string, size: number) {
  return `${prefix}${new Date().toISOString().slice(0, 10).replace(/-/g, '')}${String(size + 1).padStart(4, '0')}`
}

export async function getEhsHazardList(params: { pageNum: number; pageSize: number; keyword?: string; level?: string; status?: string }) {
  await simulateDelay()
  let filtered = [...ehsHazards]
  if (params.keyword) filtered = searchItems(filtered, params.keyword, ['desc', 'location', 'code'])
  if (params.level) filtered = filtered.filter((item) => item.level === params.level)
  if (params.status) filtered = filtered.filter((item) => item.status === params.status)
  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function saveEhsHazard(data: any) {
  await simulateDelay()
  const payload = {
    id: data.id || generateId(),
    code: data.code || createCode('YH', ehsHazards.length),
    location: data.location || '',
    desc: data.desc || '',
    level: data.level || 'moderate',
    status: data.status || 'open',
    finder: data.finder || '',
    found_at: data.found_at || new Date().toISOString().slice(0, 10)
  }
  const index = ehsHazards.findIndex((item) => item.id === payload.id)
  if (index > -1) {
    ehsHazards[index] = { ...ehsHazards[index], ...payload }
    return wrapUpdatedResponse(ehsHazards[index], '编辑隐患成功')
  }
  ehsHazards.unshift(payload)
  return wrapCreatedResponse(payload, '新增隐患成功')
}

export async function deleteEhsHazard(id: string) {
  await simulateDelay()
  const index = ehsHazards.findIndex((item) => item.id === id)
  if (index > -1) ehsHazards.splice(index, 1)
  return wrapSuccessResponse('删除隐患成功')
}

export async function getEhsEmergencyList(params: { pageNum: number; pageSize: number; name?: string; type?: string }) {
  await simulateDelay()
  let filtered = [...ehsEmergencyPlans]
  if (params.name) filtered = searchItems(filtered, params.name, ['name'])
  if (params.type) filtered = filtered.filter((item) => item.type === params.type)
  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function saveEhsEmergency(data: any) {
  await simulateDelay()
  const payload = {
    id: data.id || generateId(),
    name: data.name || '',
    type: data.type || '火灾',
    level: data.level || 'II',
    responsible: data.responsible || '',
    last_drill: data.last_drill || ''
  }
  const index = ehsEmergencyPlans.findIndex((item) => item.id === payload.id)
  if (index > -1) {
    ehsEmergencyPlans[index] = { ...ehsEmergencyPlans[index], ...payload }
    return wrapUpdatedResponse(ehsEmergencyPlans[index], '编辑预案成功')
  }
  ehsEmergencyPlans.unshift(payload)
  return wrapCreatedResponse(payload, '新增预案成功')
}

export async function runEhsEmergencyDrill(id: string) {
  await simulateDelay()
  const target = ehsEmergencyPlans.find((item) => item.id === id)
  if (target) target.last_drill = new Date().toISOString().slice(0, 10)
  return wrapUpdatedResponse(target || { id }, '应急演练完成')
}

export async function getEhsPermitList(params: { pageNum: number; pageSize: number; keyword?: string; type?: string; status?: string }) {
  await simulateDelay()
  let filtered = [...ehsPermits]
  if (params.keyword) filtered = searchItems(filtered, params.keyword, ['location', 'code'])
  if (params.type) filtered = filtered.filter((item) => item.type === params.type)
  if (params.status) filtered = filtered.filter((item) => item.status === params.status)
  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function saveEhsPermit(data: any) {
  await simulateDelay()
  const payload = {
    id: data.id || generateId(),
    code: data.code || createCode('ZYP', ehsPermits.length),
    type: data.type || 'hot',
    location: data.location || '',
    applicant: data.applicant || '',
    apply_date: data.apply_date || new Date().toISOString().slice(0, 10),
    status: data.status || 'pending'
  }
  const index = ehsPermits.findIndex((item) => item.id === payload.id)
  if (index > -1) {
    ehsPermits[index] = { ...ehsPermits[index], ...payload }
    return wrapUpdatedResponse(ehsPermits[index], '编辑作业票成功')
  }
  ehsPermits.unshift(payload)
  return wrapCreatedResponse(payload, '新增作业票成功')
}

export async function deleteEhsPermit(id: string) {
  await simulateDelay()
  const index = ehsPermits.findIndex((item) => item.id === id)
  if (index > -1) ehsPermits.splice(index, 1)
  return wrapSuccessResponse('删除作业票成功')
}

export async function getEhsTrainingList(params: { pageNum: number; pageSize: number; title?: string; status?: string }) {
  await simulateDelay()
  let filtered = [...ehsTrainingRecords]
  if (params.title) filtered = searchItems(filtered, params.title, ['title'])
  if (params.status) filtered = filtered.filter((item) => item.status === params.status)
  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function saveEhsTraining(data: any) {
  await simulateDelay()
  const payload = {
    id: data.id || generateId(),
    title: data.title || '',
    trainer: data.trainer || '',
    trainees: data.trainees || '',
    plan_date: data.plan_date || '',
    status: data.status || 'pending'
  }
  const index = ehsTrainingRecords.findIndex((item) => item.id === payload.id)
  if (index > -1) {
    ehsTrainingRecords[index] = { ...ehsTrainingRecords[index], ...payload }
    return wrapUpdatedResponse(ehsTrainingRecords[index], '编辑培训记录成功')
  }
  ehsTrainingRecords.unshift(payload)
  return wrapCreatedResponse(payload, '新增培训记录成功')
}

export async function completeEhsTraining(id: string) {
  await simulateDelay()
  const target = ehsTrainingRecords.find((item) => item.id === id)
  if (target) target.status = 'completed'
  return wrapUpdatedResponse(target || { id }, '培训完成')
}
