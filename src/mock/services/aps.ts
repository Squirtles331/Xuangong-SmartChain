import { apsConstraintData, apsScheduleData } from '../modules/aps'
import { simulateDelay } from '../shared/delay'
import { generateId } from '../shared/id'
import { paginate } from '../shared/paginate'
import { wrapDetailResponse, wrapListResponse, wrapSuccessResponse } from '../shared/response'

type ConstraintType = 'mold' | 'tool' | 'skill'

const constraintMap: Record<ConstraintType, any[]> = {
  mold: apsConstraintData.molds,
  tool: apsConstraintData.tools,
  skill: apsConstraintData.skills
}

export async function getApsScheduleData() {
  await simulateDelay()
  return wrapDetailResponse(apsScheduleData)
}

export async function runApsSchedule() {
  await simulateDelay(500, 900)
  return wrapSuccessResponse('排程已重新计算')
}

export async function getConstraintList(params: { type: ConstraintType; pageNum: number; pageSize: number }) {
  await simulateDelay()
  const list = constraintMap[params.type] || []
  const result = paginate(list, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function saveConstraint(data: any) {
  await simulateDelay()
  const list = constraintMap[data.type as ConstraintType]
  if (!list) return wrapSuccessResponse('保存成功')

  const index = list.findIndex((item) => item.id === data.id)
  const payload = { ...data }
  delete payload.type

  if (index > -1) {
    Object.assign(list[index], payload)
    return wrapSuccessResponse('约束更新成功')
  }

  list.unshift({
    ...payload,
    id: payload.id || generateId()
  })
  return wrapSuccessResponse('约束创建成功')
}

export async function deleteConstraint(type: ConstraintType, id: string) {
  await simulateDelay()
  const list = constraintMap[type]
  if (!list) return wrapSuccessResponse('约束删除成功')
  const index = list.findIndex((item) => item.id === id)
  if (index > -1) list.splice(index, 1)
  return wrapSuccessResponse('约束删除成功')
}
