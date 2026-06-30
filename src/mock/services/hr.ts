import {
  hrAttendanceRecords,
  hrEmployees,
  hrEmployeeSkillDetails,
  hrPieceworkRules,
  hrPieceworkSummary,
  hrScheduleRecords,
  hrSkillTree
} from '../modules/hr'
import { simulateDelay } from '../shared/delay'
import { generateId } from '../shared/id'
import { paginate, searchItems } from '../shared/paginate'
import { wrapCreatedResponse, wrapDetailResponse, wrapListResponse, wrapSuccessResponse, wrapUpdatedResponse } from '../shared/response'

export async function getHrEmployeeList(params: { pageNum: number; pageSize: number; keyword?: string; department?: string; status?: string }) {
  await simulateDelay()

  let filtered = [...hrEmployees]
  if (params.keyword) filtered = searchItems(filtered, params.keyword, ['code', 'name', 'position'])
  if (params.department) filtered = filtered.filter((item) => item.department === params.department)
  if (params.status) filtered = filtered.filter((item) => item.status === params.status)

  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function createHrEmployee(data: any) {
  await simulateDelay()

  const next = {
    id: generateId(),
    code: data.code || `EMP${new Date().getFullYear()}${String(hrEmployees.length + 1).padStart(3, '0')}`,
    ...data
  }

  hrEmployees.unshift(next)
  return wrapCreatedResponse(next, '新增员工成功')
}

export async function updateHrEmployee(id: string, data: any) {
  await simulateDelay()

  const index = hrEmployees.findIndex((item) => item.id === id)
  if (index > -1) {
    hrEmployees[index] = { ...hrEmployees[index], ...data }
    return wrapUpdatedResponse(hrEmployees[index], '编辑员工成功')
  }

  return wrapUpdatedResponse({ id, ...data }, '编辑员工成功')
}

export async function deleteHrEmployee(id: string) {
  await simulateDelay()

  const index = hrEmployees.findIndex((item) => item.id === id)
  if (index > -1) hrEmployees.splice(index, 1)

  return wrapSuccessResponse('删除员工成功')
}

export async function getHrAttendanceList(params: { pageNum: number; pageSize: number; employee?: string; date?: string; result?: string }) {
  await simulateDelay()

  let filtered = [...hrAttendanceRecords]
  if (params.employee) filtered = searchItems(filtered, params.employee, ['employee'])
  if (params.date) filtered = filtered.filter((item) => item.date === params.date)
  if (params.result) filtered = filtered.filter((item) => item.result === params.result)

  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function createHrAttendance(data: any) {
  await simulateDelay()

  const next = { id: generateId(), ...data }
  hrAttendanceRecords.unshift(next)
  return wrapCreatedResponse(next, '新增考勤成功')
}

export async function updateHrAttendance(id: string, data: any) {
  await simulateDelay()

  const index = hrAttendanceRecords.findIndex((item) => item.id === id)
  if (index > -1) {
    hrAttendanceRecords[index] = { ...hrAttendanceRecords[index], ...data }
    return wrapUpdatedResponse(hrAttendanceRecords[index], '编辑考勤成功')
  }

  return wrapUpdatedResponse({ id, ...data }, '编辑考勤成功')
}

export async function deleteHrAttendance(id: string) {
  await simulateDelay()

  const index = hrAttendanceRecords.findIndex((item) => item.id === id)
  if (index > -1) hrAttendanceRecords.splice(index, 1)

  return wrapSuccessResponse('删除考勤成功')
}

export async function getHrPieceworkList(params: { pageNum: number; pageSize: number; keyword?: string }) {
  await simulateDelay()

  let filtered = [...hrPieceworkRules]
  if (params.keyword) filtered = searchItems(filtered, params.keyword, ['operation'])

  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function createHrPiecework(data: any) {
  await simulateDelay()

  const next = { id: generateId(), ...data }
  hrPieceworkRules.unshift(next)
  return wrapCreatedResponse(next, '新增计件单价成功')
}

export async function updateHrPiecework(id: string, data: any) {
  await simulateDelay()

  const index = hrPieceworkRules.findIndex((item) => item.id === id)
  if (index > -1) {
    hrPieceworkRules[index] = { ...hrPieceworkRules[index], ...data }
    return wrapUpdatedResponse(hrPieceworkRules[index], '编辑计件单价成功')
  }

  return wrapUpdatedResponse({ id, ...data }, '编辑计件单价成功')
}

export async function getHrPieceworkSummary() {
  await simulateDelay()
  return wrapDetailResponse(hrPieceworkSummary)
}

export async function getHrScheduleList(params: { pageNum: number; pageSize: number; team?: string; shift?: string }) {
  await simulateDelay()

  let filtered = [...hrScheduleRecords]
  if (params.team) filtered = searchItems(filtered, params.team, ['team', 'leader', 'members'])
  if (params.shift) filtered = filtered.filter((item) => item.shift === params.shift)

  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function createHrSchedule(data: any) {
  await simulateDelay()

  const next = { id: generateId(), ...data }
  hrScheduleRecords.unshift(next)
  return wrapCreatedResponse(next, '新增排班成功')
}

export async function updateHrSchedule(id: string, data: any) {
  await simulateDelay()

  const index = hrScheduleRecords.findIndex((item) => item.id === id)
  if (index > -1) {
    hrScheduleRecords[index] = { ...hrScheduleRecords[index], ...data }
    return wrapUpdatedResponse(hrScheduleRecords[index], '编辑排班成功')
  }

  return wrapUpdatedResponse({ id, ...data }, '编辑排班成功')
}

export async function deleteHrSchedule(id: string) {
  await simulateDelay()

  const index = hrScheduleRecords.findIndex((item) => item.id === id)
  if (index > -1) hrScheduleRecords.splice(index, 1)

  return wrapSuccessResponse('删除排班成功')
}

export async function getSkillMatrixData() {
  await simulateDelay()
  return wrapDetailResponse({
    employees: hrSkillTree,
    skillsByEmployee: hrEmployeeSkillDetails
  })
}
