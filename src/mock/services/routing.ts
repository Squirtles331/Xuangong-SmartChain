import { routingAutoTimeRecords, routingDetails, routingParallelGroups, routingOperations } from '../modules/routing'
import { simulateDelay } from '../shared/delay'
import { generateId } from '../shared/id'
import { paginate, searchItems } from '../shared/paginate'
import { wrapDetailResponse, wrapListResponse, wrapSuccessResponse } from '../shared/response'

export async function getRoutingList(params: { pageNum: number; pageSize: number; materialCode?: string }) {
  await simulateDelay()
  let filtered = [...routingOperations]
  if (params.materialCode) {
    filtered = filtered.filter((item) => item.material_code === params.materialCode)
  }
  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function saveRouting(data: any) {
  await simulateDelay()
  const detailId = data.routing_id || data.id
  const detail = routingDetails.find((item) => item.id === detailId)

  if (detail) {
    if (data.routing_name) detail.routing_name = data.routing_name
    if (data.version) detail.version = data.version
    if (data.description !== undefined) detail.description = data.description

    const operationIndex = detail.operations.findIndex((item) => item.id === data.id)
    if (operationIndex > -1) {
      Object.assign(detail.operations[operationIndex], data)
      return wrapSuccessResponse('工艺工序更新成功')
    }

    detail.operations.push({
      ...data,
      id: data.id || generateId()
    })
    return wrapSuccessResponse('工艺工序创建成功')
  }

  routingDetails.unshift({
    id: data.id || generateId(),
    material_code: data.material_code || '',
    material_name: data.material_name || '新建工艺路线',
    routing_name: data.routing_name || data.material_name || '新建工艺路线',
    version: data.version || 'V1.0',
    status: data.status || 'enabled',
    description: data.description || '',
    operations: Array.isArray(data.operations) ? data.operations : []
  })

  return wrapSuccessResponse('工艺路线创建成功')
}

export async function deleteRouting(id: string) {
  await simulateDelay()

  const detailIndex = routingDetails.findIndex((item) => item.id === id)
  if (detailIndex > -1) {
    routingDetails.splice(detailIndex, 1)
    return wrapSuccessResponse('工艺路线删除成功')
  }

  routingDetails.forEach((detail) => {
    const index = detail.operations.findIndex((item) => item.id === id)
    if (index > -1) detail.operations.splice(index, 1)
  })

  return wrapSuccessResponse('工艺工序删除成功')
}

export async function getRoutingDetail(id: string) {
  await simulateDelay()
  const detail = routingDetails.find((item) => item.id === id) || null
  return wrapDetailResponse(detail)
}

export async function getRoutingAutoTimeList(params: { pageNum: number; pageSize: number; keyword?: string; deviation?: string }) {
  await simulateDelay()
  let filtered = [...routingAutoTimeRecords]
  if (params.keyword) {
    filtered = searchItems(filtered, params.keyword, ['operation', 'material_name'])
  }
  if (params.deviation === 'low') filtered = filtered.filter((item) => item.deviation <= 10)
  if (params.deviation === 'mid') filtered = filtered.filter((item) => item.deviation > 10 && item.deviation <= 20)
  if (params.deviation === 'high') filtered = filtered.filter((item) => item.deviation > 20)

  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function adoptRoutingAutoTime(id: string) {
  await simulateDelay()
  const record = routingAutoTimeRecords.find((item) => item.id === id)
  if (record) {
    record.std_hours = Math.round(record.actual_avg)
    record.deviation = 0
    record.suggestion = '已采纳建议工时。'
  }
  return wrapSuccessResponse('已采纳工时建议')
}

export async function getRoutingParallelList(params: { pageNum: number; pageSize: number; routingName?: string; mergeRule?: string }) {
  await simulateDelay()
  let filtered = [...routingParallelGroups]
  if (params.routingName) filtered = searchItems(filtered, params.routingName, ['routing_name'])
  if (params.mergeRule) filtered = filtered.filter((item) => item.merge_rule === params.mergeRule)
  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function saveRoutingParallel(data: any) {
  await simulateDelay()
  const index = routingParallelGroups.findIndex((item) => item.id === data.id)
  if (index > -1) {
    Object.assign(routingParallelGroups[index], data)
    return wrapSuccessResponse('并行工序配置更新成功')
  }

  routingParallelGroups.unshift({
    ...data,
    id: data.id || generateId()
  })
  return wrapSuccessResponse('并行工序配置创建成功')
}

export async function deleteRoutingParallel(id: string) {
  await simulateDelay()
  const index = routingParallelGroups.findIndex((item) => item.id === id)
  if (index > -1) routingParallelGroups.splice(index, 1)
  return wrapSuccessResponse('并行工序配置删除成功')
}
