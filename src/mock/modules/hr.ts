export const hrEmployees = [
  {
    id: 'emp-1',
    code: 'EMP2026001',
    name: '张建国',
    department: '机加工一车间',
    position: '数控车工',
    phone: '13800138001',
    hire_date: '2022-03-01',
    status: 'active'
  },
  {
    id: 'emp-2',
    code: 'EMP2026002',
    name: '李卫国',
    department: '机加工一车间',
    position: '钻床操作工',
    phone: '13800138002',
    hire_date: '2023-06-15',
    status: 'active'
  },
  {
    id: 'emp-3',
    code: 'EMP2026003',
    name: '王大明',
    department: '装配车间',
    position: '装配工',
    phone: '13800138003',
    hire_date: '2021-09-08',
    status: 'active'
  },
  {
    id: 'emp-4',
    code: 'EMP2026004',
    name: '赵晓明',
    department: '机加工二车间',
    position: '加工中心操作工',
    phone: '13800138004',
    hire_date: '2024-01-10',
    status: 'active'
  },
  {
    id: 'emp-5',
    code: 'EMP2026005',
    name: '陈小丹',
    department: '品质部',
    position: '质检员',
    phone: '13800138005',
    hire_date: '2022-11-20',
    status: 'inactive'
  }
]

export const hrAttendanceRecords = [
  { id: 'att-1', employee: '张建国', date: '2026-06-28', clock_in: '07:53', clock_out: '17:12', result: 'normal' },
  { id: 'att-2', employee: '李卫国', date: '2026-06-28', clock_in: '08:18', clock_out: '17:05', result: 'late' },
  { id: 'att-3', employee: '王大明', date: '2026-06-28', clock_in: '07:58', clock_out: '17:18', result: 'normal' },
  { id: 'att-4', employee: '赵晓明', date: '2026-06-28', clock_in: '', clock_out: '', result: 'absent' }
]

export const hrPieceworkRules = [
  { id: 'piece-1', operation: '下料', unit_price: 2.5, unit: '件', qualified_bonus: 0.5, defective_penalty: 5 },
  { id: 'piece-2', operation: '粗车', unit_price: 8, unit: '件', qualified_bonus: 1, defective_penalty: 15 },
  { id: 'piece-3', operation: '精车', unit_price: 12, unit: '件', qualified_bonus: 1.5, defective_penalty: 20 },
  { id: 'piece-4', operation: '钻孔', unit_price: 3, unit: '件', qualified_bonus: 0.3, defective_penalty: 8 },
  { id: 'piece-5', operation: '磨削', unit_price: 10, unit: '件', qualified_bonus: 1, defective_penalty: 18 },
  { id: 'piece-6', operation: '装配', unit_price: 15, unit: '台', qualified_bonus: 2, defective_penalty: 30 }
]

export const hrPieceworkSummary = [
  { title: '本月计件工资总额', value: 186500, trend: 8.5 },
  { title: '人均计件工资', value: 9325, trend: 3.2 },
  { title: '合格奖励总额', value: 28500, trend: -2.1 },
  { title: '不良扣款总额', value: 4200, trend: -15.3 }
]

export const hrScheduleRecords = [
  { id: 'schedule-1', team: '甲班', shift: 'day', members: '张建国、李卫国、周海峰', leader: '张建国' },
  { id: 'schedule-2', team: '乙班', shift: 'night', members: '王大明、赵晓明、吴春林', leader: '王大明' },
  { id: 'schedule-3', team: '丙班', shift: 'middle', members: '陈小丹、刘志国', leader: '刘志国' }
]

export const hrSkillTree = [
  {
    id: 'dept-machining-1',
    name: '机加工一车间',
    children: [
      { id: 'emp-1', name: '张建国' },
      { id: 'emp-2', name: '李卫国' }
    ]
  },
  {
    id: 'dept-machining-2',
    name: '机加工二车间',
    children: [{ id: 'emp-4', name: '赵晓明' }]
  },
  {
    id: 'dept-assembly',
    name: '装配车间',
    children: [{ id: 'emp-3', name: '王大明' }]
  },
  {
    id: 'dept-quality',
    name: '品质部',
    children: [{ id: 'emp-5', name: '陈小丹' }]
  }
]

export const hrEmployeeSkillDetails: Record<
  string,
  Array<{ id: string; skill_name: string; level: number; cert_number: string; expire_date: string }>
> = {
  'emp-1': [
    { id: 'skill-1', skill_name: '数控车削', level: 5, cert_number: 'NC20230001', expire_date: '2027-12-31' },
    { id: 'skill-2', skill_name: '磨削加工', level: 3, cert_number: '', expire_date: '' }
  ],
  'emp-2': [
    { id: 'skill-3', skill_name: '钻孔加工', level: 4, cert_number: 'DR20240005', expire_date: '2027-06-30' },
    { id: 'skill-4', skill_name: '首件自检', level: 3, cert_number: '', expire_date: '' }
  ],
  'emp-3': [
    { id: 'skill-5', skill_name: '总装作业', level: 5, cert_number: 'AS20220003', expire_date: '2027-08-15' },
    { id: 'skill-6', skill_name: '性能测试', level: 3, cert_number: '', expire_date: '' }
  ],
  'emp-4': [
    { id: 'skill-7', skill_name: '加工中心编程', level: 4, cert_number: 'MC20250002', expire_date: '2028-01-10' },
    { id: 'skill-8', skill_name: '换刀调机', level: 4, cert_number: '', expire_date: '' }
  ],
  'emp-5': [{ id: 'skill-9', skill_name: '来料检验', level: 5, cert_number: 'QI20240001', expire_date: '2027-11-20' }]
}
