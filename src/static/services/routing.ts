import { generateId } from '@/static/utils/id'
import { paginate, searchItems } from '@/static/utils/paginate'
import { wrapDetailResponse, wrapListResponse, wrapSuccessResponse } from '@/static/utils/response'

const routingDetails = [
  {
    id: 'routing-1',
    material_code: '04.01.001-00001',
    material_name: 'Centrifugal Pump XJP-100',
    routing_name: 'Centrifugal Pump Standard Routing',
    version: 'V1.1',
    status: 'enabled',
    description: 'Standard manufacturing path for XJP-100.',
    operations: [
      {
        id: 'routing-1-op-10',
        operation_no: 10,
        name: 'Blanking',
        work_center: 'Blanking Group',
        setup_hours: 15,
        run_hours: 5,
        queue_hours: 0,
        move_hours: 10,
        workers: 1,
        skill: 'Blanking',
        is_qc_gate: false,
        is_outsourced: false,
        instruction: 'Leave 2mm machining allowance.'
      },
      {
        id: 'routing-1-op-20',
        operation_no: 20,
        name: 'Rough Turning',
        work_center: 'CNC Turning Group',
        setup_hours: 30,
        run_hours: 25,
        queue_hours: 30,
        move_hours: 10,
        workers: 1,
        skill: 'CNC Turning',
        is_qc_gate: false,
        is_outsourced: false,
        instruction: 'Finish rough turning for external surfaces.'
      },
      {
        id: 'routing-1-op-30',
        operation_no: 30,
        name: 'Finish Turning',
        work_center: 'CNC Turning Group',
        setup_hours: 20,
        run_hours: 18,
        queue_hours: 20,
        move_hours: 10,
        workers: 1,
        skill: 'CNC Turning',
        is_qc_gate: true,
        is_outsourced: false,
        instruction: 'Keep key dimensions within ±0.01mm.'
      }
    ]
  },
  {
    id: 'routing-2',
    material_code: '04.02.001-00001',
    material_name: 'Gear Box GBX-200',
    routing_name: 'Gear Box Standard Routing',
    version: 'V1.0',
    status: 'enabled',
    description: 'Standard manufacturing path for GBX-200.',
    operations: [
      {
        id: 'routing-2-op-10',
        operation_no: 10,
        name: 'Blanking',
        work_center: 'Blanking Group',
        setup_hours: 12,
        run_hours: 6,
        queue_hours: 5,
        move_hours: 10,
        workers: 1,
        skill: 'Blanking',
        is_qc_gate: false,
        is_outsourced: false,
        instruction: 'Cut based on nesting plan.'
      },
      {
        id: 'routing-2-op-20',
        operation_no: 20,
        name: 'Rough Milling',
        work_center: 'Machining Center',
        setup_hours: 25,
        run_hours: 22,
        queue_hours: 15,
        move_hours: 10,
        workers: 1,
        skill: 'Machining Center',
        is_qc_gate: false,
        is_outsourced: false,
        instruction: 'Complete rough milling on key faces.'
      }
    ]
  }
]

const routingAutoTimeRecords = [
  {
    id: 'routing-time-1',
    operation: 'Blanking',
    material_name: 'Centrifugal Pump XJP-100',
    std_hours: 5,
    actual_avg: 4.2,
    deviation: 16,
    samples: 120,
    suggestion: 'Adjust standard time to 4 minutes.'
  },
  {
    id: 'routing-time-2',
    operation: 'Finish Turning',
    material_name: 'Centrifugal Pump XJP-100',
    std_hours: 18,
    actual_avg: 20.5,
    deviation: 14,
    samples: 85,
    suggestion: 'Adjust standard time to 21 minutes.'
  },
  {
    id: 'routing-time-3',
    operation: 'Drilling',
    material_name: 'Centrifugal Pump XJP-100',
    std_hours: 8,
    actual_avg: 7.8,
    deviation: 3,
    samples: 110,
    suggestion: 'Deviation is acceptable; keep watching.'
  }
]

const routingParallelGroups = [
  {
    id: 'routing-parallel-1',
    routing_id: 'routing-1',
    routing_name: 'Centrifugal Pump Standard Routing',
    operations: ['Op40: Drilling', 'Op50: Heat Treatment'],
    merge_rule: 'all-complete',
    remark: 'Merge after both operations complete.'
  },
  {
    id: 'routing-parallel-2',
    routing_id: 'routing-2',
    routing_name: 'Gear Box Standard Routing',
    operations: ['Op30: Finish Turning', 'Op40: Grinding'],
    merge_rule: 'any-complete',
    remark: 'Used for rush-order trial run.'
  }
]

const routingOperations = routingDetails.flatMap((item) =>
  item.operations.map((operation) => ({
    ...operation,
    routing_id: item.id,
    routing_name: item.routing_name,
    material_code: item.material_code,
    material_name: item.material_name,
    version: item.version,
    status: item.status
  }))
)

export async function getRoutingList(params: { pageNum: number; pageSize: number; materialCode?: string }) {
  let filtered = [...routingOperations]

  if (params.materialCode) {
    filtered = filtered.filter((item) => item.material_code === params.materialCode)
  }

  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function saveRouting(data: any) {
  const detailId = data.routing_id || data.id
  const detail = routingDetails.find((item) => item.id === detailId)

  if (detail) {
    if (data.routing_name) detail.routing_name = data.routing_name
    if (data.version) detail.version = data.version
    if (data.description !== undefined) detail.description = data.description

    const operationIndex = detail.operations.findIndex((item) => item.id === data.id)

    if (operationIndex > -1) {
      Object.assign(detail.operations[operationIndex], data)
      return wrapSuccessResponse('Routing operation updated')
    }

    detail.operations.push({
      ...data,
      id: data.id || generateId('routing-op')
    })
    return wrapSuccessResponse('Routing operation created')
  }

  routingDetails.unshift({
    id: data.id || generateId('routing'),
    material_code: data.material_code || '',
    material_name: data.material_name || 'New Routing',
    routing_name: data.routing_name || data.material_name || 'New Routing',
    version: data.version || 'V1.0',
    status: data.status || 'enabled',
    description: data.description || '',
    operations: Array.isArray(data.operations) ? data.operations : []
  })

  return wrapSuccessResponse('Routing created')
}

export async function deleteRouting(id: string) {
  const detailIndex = routingDetails.findIndex((item) => item.id === id)

  if (detailIndex > -1) {
    routingDetails.splice(detailIndex, 1)
    return wrapSuccessResponse('Routing deleted')
  }

  routingDetails.forEach((detail) => {
    const index = detail.operations.findIndex((item) => item.id === id)
    if (index > -1) detail.operations.splice(index, 1)
  })

  return wrapSuccessResponse('Routing operation deleted')
}

export async function getRoutingDetail(id: string) {
  const detail = routingDetails.find((item) => item.id === id) || null
  return wrapDetailResponse(detail)
}

export async function getRoutingAutoTimeList(params: { pageNum: number; pageSize: number; keyword?: string; deviation?: string }) {
  let filtered = [...routingAutoTimeRecords]

  if (params.keyword) filtered = searchItems(filtered, params.keyword, ['operation', 'material_name'])
  if (params.deviation === 'low') filtered = filtered.filter((item) => item.deviation <= 10)
  if (params.deviation === 'mid') filtered = filtered.filter((item) => item.deviation > 10 && item.deviation <= 20)
  if (params.deviation === 'high') filtered = filtered.filter((item) => item.deviation > 20)

  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function adoptRoutingAutoTime(id: string) {
  const record = routingAutoTimeRecords.find((item) => item.id === id)

  if (record) {
    record.std_hours = Math.round(record.actual_avg)
    record.deviation = 0
    record.suggestion = 'Standard time suggestion adopted.'
  }

  return wrapSuccessResponse('Routing time suggestion adopted')
}

export async function getRoutingParallelList(params: { pageNum: number; pageSize: number; routingName?: string; mergeRule?: string }) {
  let filtered = [...routingParallelGroups]

  if (params.routingName) filtered = searchItems(filtered, params.routingName, ['routing_name'])
  if (params.mergeRule) filtered = filtered.filter((item) => item.merge_rule === params.mergeRule)

  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function saveRoutingParallel(data: any) {
  const index = routingParallelGroups.findIndex((item) => item.id === data.id)

  if (index > -1) {
    Object.assign(routingParallelGroups[index], data)
    return wrapSuccessResponse('Parallel routing updated')
  }

  routingParallelGroups.unshift({
    ...data,
    id: data.id || generateId('routing-parallel')
  })
  return wrapSuccessResponse('Parallel routing created')
}

export async function deleteRoutingParallel(id: string) {
  const index = routingParallelGroups.findIndex((item) => item.id === id)

  if (index > -1) {
    routingParallelGroups.splice(index, 1)
  }

  return wrapSuccessResponse('Parallel routing deleted')
}
