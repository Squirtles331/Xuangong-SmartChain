import { generateId } from '@/static/utils/id'
import { paginate, searchItems } from '@/static/utils/paginate'
import { wrapCreatedResponse, wrapDetailResponse, wrapListResponse, wrapSuccessResponse, wrapUpdatedResponse } from '@/static/utils/response'

const employees = [
  {
    id: 'emp-1',
    code: 'EMP2026001',
    name: 'Zhang Jianguo',
    department: 'Machining Workshop 1',
    position: 'CNC Operator',
    phone: '13800138001',
    hire_date: '2022-03-01',
    status: 'active' as const
  },
  {
    id: 'emp-2',
    code: 'EMP2026002',
    name: 'Li Weiguo',
    department: 'Machining Workshop 1',
    position: 'Drill Operator',
    phone: '13800138002',
    hire_date: '2023-06-15',
    status: 'active' as const
  },
  {
    id: 'emp-3',
    code: 'EMP2026003',
    name: 'Wang Daming',
    department: 'Assembly Workshop',
    position: 'Assembler',
    phone: '13800138003',
    hire_date: '2021-09-08',
    status: 'active' as const
  },
  {
    id: 'emp-4',
    code: 'EMP2026004',
    name: 'Zhao Xiaoming',
    department: 'Machining Workshop 2',
    position: 'Machining Center Operator',
    phone: '13800138004',
    hire_date: '2024-01-10',
    status: 'active' as const
  },
  {
    id: 'emp-5',
    code: 'EMP2026005',
    name: 'Chen Xiaodan',
    department: 'Quality Department',
    position: 'Inspector',
    phone: '13800138005',
    hire_date: '2022-11-20',
    status: 'inactive' as const
  }
]

const attendanceRecords = [
  { id: 'att-1', employee: 'Zhang Jianguo', date: '2026-06-28', clock_in: '07:53', clock_out: '17:12', result: 'normal' as const },
  { id: 'att-2', employee: 'Li Weiguo', date: '2026-06-28', clock_in: '08:18', clock_out: '17:05', result: 'late' as const },
  { id: 'att-3', employee: 'Wang Daming', date: '2026-06-28', clock_in: '07:58', clock_out: '17:18', result: 'normal' as const },
  { id: 'att-4', employee: 'Zhao Xiaoming', date: '2026-06-28', clock_in: '', clock_out: '', result: 'absent' as const }
]

const pieceworkRules = [
  { id: 'piece-1', operation: 'Blanking', unit_price: 2.5, unit: 'pcs', qualified_bonus: 0.5, defective_penalty: 5 },
  { id: 'piece-2', operation: 'Rough Turning', unit_price: 8, unit: 'pcs', qualified_bonus: 1, defective_penalty: 15 },
  { id: 'piece-3', operation: 'Finish Turning', unit_price: 12, unit: 'pcs', qualified_bonus: 1.5, defective_penalty: 20 },
  { id: 'piece-4', operation: 'Drilling', unit_price: 3, unit: 'pcs', qualified_bonus: 0.3, defective_penalty: 8 },
  { id: 'piece-5', operation: 'Grinding', unit_price: 10, unit: 'pcs', qualified_bonus: 1, defective_penalty: 18 },
  { id: 'piece-6', operation: 'Assembly', unit_price: 15, unit: 'set', qualified_bonus: 2, defective_penalty: 30 }
]

const pieceworkSummary = [
  { title: 'Monthly Piecework Wage', value: 186500, trend: 8.5 },
  { title: 'Average Wage Per Employee', value: 9325, trend: 3.2 },
  { title: 'Qualified Bonus', value: 28500, trend: -2.1 },
  { title: 'Defect Deduction', value: 4200, trend: -15.3 }
]

const scheduleRecords = [
  { id: 'schedule-1', team: 'Team A', shift: 'day' as const, members: 'Zhang Jianguo, Li Weiguo, Zhou Haifeng', leader: 'Zhang Jianguo' },
  { id: 'schedule-2', team: 'Team B', shift: 'night' as const, members: 'Wang Daming, Zhao Xiaoming, Wu Chunlin', leader: 'Wang Daming' },
  { id: 'schedule-3', team: 'Team C', shift: 'middle' as const, members: 'Chen Xiaodan, Liu Zhiguo', leader: 'Liu Zhiguo' }
]

const skillTree = [
  {
    id: 'dept-machining-1',
    name: 'Machining Workshop 1',
    children: [
      { id: 'emp-1', name: 'Zhang Jianguo' },
      { id: 'emp-2', name: 'Li Weiguo' }
    ]
  },
  { id: 'dept-machining-2', name: 'Machining Workshop 2', children: [{ id: 'emp-4', name: 'Zhao Xiaoming' }] },
  { id: 'dept-assembly', name: 'Assembly Workshop', children: [{ id: 'emp-3', name: 'Wang Daming' }] },
  { id: 'dept-quality', name: 'Quality Department', children: [{ id: 'emp-5', name: 'Chen Xiaodan' }] }
]

const employeeSkillDetails: Record<string, Array<{ id: string; skill_name: string; level: number; cert_number: string; expire_date: string }>> = {
  'emp-1': [
    { id: 'skill-1', skill_name: 'CNC Turning', level: 5, cert_number: 'NC20230001', expire_date: '2027-12-31' },
    { id: 'skill-2', skill_name: 'Grinding', level: 3, cert_number: '', expire_date: '' }
  ],
  'emp-2': [
    { id: 'skill-3', skill_name: 'Drilling', level: 4, cert_number: 'DR20240005', expire_date: '2027-06-30' },
    { id: 'skill-4', skill_name: 'First Piece Check', level: 3, cert_number: '', expire_date: '' }
  ],
  'emp-3': [
    { id: 'skill-5', skill_name: 'General Assembly', level: 5, cert_number: 'AS20220003', expire_date: '2027-08-15' },
    { id: 'skill-6', skill_name: 'Performance Test', level: 3, cert_number: '', expire_date: '' }
  ],
  'emp-4': [
    { id: 'skill-7', skill_name: 'Machining Center Programming', level: 4, cert_number: 'MC20250002', expire_date: '2028-01-10' },
    { id: 'skill-8', skill_name: 'Tool Change Setup', level: 4, cert_number: '', expire_date: '' }
  ],
  'emp-5': [{ id: 'skill-9', skill_name: 'Incoming Inspection', level: 5, cert_number: 'QI20240001', expire_date: '2027-11-20' }]
}

export async function getHrEmployeeList(params: { pageNum: number; pageSize: number; keyword?: string; department?: string; status?: string }) {
  let filtered = [...employees]

  if (params.keyword) filtered = searchItems(filtered, params.keyword, ['code', 'name', 'position'])
  if (params.department) filtered = filtered.filter((item) => item.department === params.department)
  if (params.status) filtered = filtered.filter((item) => item.status === params.status)

  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function createHrEmployee(data: any) {
  const next = {
    id: generateId('emp'),
    code: data.code || `EMP${new Date().getFullYear()}${String(employees.length + 1).padStart(3, '0')}`,
    ...data
  }

  employees.unshift(next)
  return wrapCreatedResponse(next, 'Employee created')
}

export async function updateHrEmployee(id: string, data: any) {
  const index = employees.findIndex((item) => item.id === id)

  if (index > -1) {
    employees[index] = { ...employees[index], ...data }
    return wrapUpdatedResponse(employees[index], 'Employee updated')
  }

  return wrapUpdatedResponse({ id, ...data }, 'Employee updated')
}

export async function deleteHrEmployee(id: string) {
  const index = employees.findIndex((item) => item.id === id)

  if (index > -1) {
    employees.splice(index, 1)
  }

  return wrapSuccessResponse('Employee deleted')
}

export async function getHrAttendanceList(params: { pageNum: number; pageSize: number; employee?: string; date?: string; result?: string }) {
  let filtered = [...attendanceRecords]

  if (params.employee) filtered = searchItems(filtered, params.employee, ['employee'])
  if (params.date) filtered = filtered.filter((item) => item.date === params.date)
  if (params.result) filtered = filtered.filter((item) => item.result === params.result)

  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function createHrAttendance(data: any) {
  const next = { id: generateId('att'), ...data }
  attendanceRecords.unshift(next)
  return wrapCreatedResponse(next, 'Attendance created')
}

export async function updateHrAttendance(id: string, data: any) {
  const index = attendanceRecords.findIndex((item) => item.id === id)

  if (index > -1) {
    attendanceRecords[index] = { ...attendanceRecords[index], ...data }
    return wrapUpdatedResponse(attendanceRecords[index], 'Attendance updated')
  }

  return wrapUpdatedResponse({ id, ...data }, 'Attendance updated')
}

export async function deleteHrAttendance(id: string) {
  const index = attendanceRecords.findIndex((item) => item.id === id)

  if (index > -1) {
    attendanceRecords.splice(index, 1)
  }

  return wrapSuccessResponse('Attendance deleted')
}

export async function getHrPieceworkList(params: { pageNum: number; pageSize: number; keyword?: string }) {
  let filtered = [...pieceworkRules]

  if (params.keyword) filtered = searchItems(filtered, params.keyword, ['operation'])

  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function createHrPiecework(data: any) {
  const next = { id: generateId('piece'), ...data }
  pieceworkRules.unshift(next)
  return wrapCreatedResponse(next, 'Piecework rule created')
}

export async function updateHrPiecework(id: string, data: any) {
  const index = pieceworkRules.findIndex((item) => item.id === id)

  if (index > -1) {
    pieceworkRules[index] = { ...pieceworkRules[index], ...data }
    return wrapUpdatedResponse(pieceworkRules[index], 'Piecework rule updated')
  }

  return wrapUpdatedResponse({ id, ...data }, 'Piecework rule updated')
}

export async function getHrPieceworkSummary() {
  return wrapDetailResponse(pieceworkSummary)
}

export async function getHrScheduleList(params: { pageNum: number; pageSize: number; team?: string; shift?: string }) {
  let filtered = [...scheduleRecords]

  if (params.team) filtered = searchItems(filtered, params.team, ['team', 'leader', 'members'])
  if (params.shift) filtered = filtered.filter((item) => item.shift === params.shift)

  const result = paginate(filtered, params.pageNum, params.pageSize)
  return wrapListResponse(result.list, result.total, result.pageNum, result.pageSize)
}

export async function createHrSchedule(data: any) {
  const next = { id: generateId('schedule'), ...data }
  scheduleRecords.unshift(next)
  return wrapCreatedResponse(next, 'Schedule created')
}

export async function updateHrSchedule(id: string, data: any) {
  const index = scheduleRecords.findIndex((item) => item.id === id)

  if (index > -1) {
    scheduleRecords[index] = { ...scheduleRecords[index], ...data }
    return wrapUpdatedResponse(scheduleRecords[index], 'Schedule updated')
  }

  return wrapUpdatedResponse({ id, ...data }, 'Schedule updated')
}

export async function deleteHrSchedule(id: string) {
  const index = scheduleRecords.findIndex((item) => item.id === id)

  if (index > -1) {
    scheduleRecords.splice(index, 1)
  }

  return wrapSuccessResponse('Schedule deleted')
}

export async function getSkillMatrixData() {
  return wrapDetailResponse({
    employees: skillTree,
    skillsByEmployee: employeeSkillDetails
  })
}
