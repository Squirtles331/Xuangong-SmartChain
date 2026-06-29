// HR mock data
export const hrEmployees = [
  { id: '1', code: 'EMP001', name: 'Zhang Jianguo', dept: 'Machining', position: 'CNC Operator', level: 4, phone: '13800138001', status: 'active' },
  { id: '2', code: 'EMP002', name: 'Li Weiguo', dept: 'Machining', position: 'Drill Operator', level: 3, phone: '13800138002', status: 'active' },
  { id: '3', code: 'EMP003', name: 'Wang Daming', dept: 'Assembly', position: 'Assembler', level: 3, phone: '13800138003', status: 'active' },
  { id: '4', code: 'EMP004', name: 'Zhao Xiaoming', dept: 'Assembly', position: 'Assembly Lead', level: 5, phone: '13800138004', status: 'active' },
  {
    id: '5',
    code: 'EMP005',
    name: 'Chen Xiaodan',
    dept: 'Quality',
    position: 'Heat Treatment Operator',
    level: 4,
    phone: '13800138005',
    status: 'active'
  },
  { id: '6', code: 'EMP006', name: 'Liu Zhiguo', dept: 'Quality', position: 'Inspector', level: 3, phone: '13800138006', status: 'active' }
]

export const skillMatrix = [
  { id: '1', emp_name: 'Zhang Jianguo', position: 'CNC Operator', cnc: 5, drilling: 2, grinding: 3, assembly: 1, inspection: 1 },
  { id: '2', emp_name: 'Li Weiguo', position: 'Drill Operator', cnc: 2, drilling: 5, grinding: 2, assembly: 1, inspection: 1 },
  { id: '3', emp_name: 'Wang Daming', position: 'Assembler', cnc: 1, drilling: 1, grinding: 1, assembly: 4, inspection: 2 },
  { id: '4', emp_name: 'Zhao Xiaoming', position: 'Assembly Lead', cnc: 2, drilling: 2, grinding: 2, assembly: 5, inspection: 3 },
  { id: '5', emp_name: 'Chen Xiaodan', position: 'Heat Treatment Operator', cnc: 1, drilling: 1, grinding: 1, assembly: 1, inspection: 1 },
  { id: '6', emp_name: 'Liu Zhiguo', position: 'Inspector', cnc: 1, drilling: 1, grinding: 1, assembly: 2, inspection: 5 }
]

export const skillTree = [
  {
    id: 'dept-machining',
    name: 'Machining',
    children: [
      { id: '1', name: 'Zhang Jianguo' },
      { id: '2', name: 'Li Weiguo' }
    ]
  },
  {
    id: 'dept-assembly',
    name: 'Assembly',
    children: [
      { id: '3', name: 'Wang Daming' },
      { id: '4', name: 'Zhao Xiaoming' }
    ]
  },
  {
    id: 'dept-quality',
    name: 'Quality',
    children: [
      { id: '5', name: 'Chen Xiaodan' },
      { id: '6', name: 'Liu Zhiguo' }
    ]
  }
]

export const employeeSkillDetails: Record<
  string,
  Array<{ id: string; skill_name: string; level: number; cert_number: string; expire_date: string }>
> = {
  '1': [
    { id: 's1', skill_name: 'CNC operation', level: 4, cert_number: 'NC20230001', expire_date: '2026-12-31' },
    { id: 's2', skill_name: 'Grinding', level: 3, cert_number: '', expire_date: '' }
  ],
  '2': [
    { id: 's3', skill_name: 'Drilling', level: 4, cert_number: 'DR20230001', expire_date: '2025-06-30' },
    { id: 's4', skill_name: 'Inspection basics', level: 2, cert_number: '', expire_date: '' }
  ],
  '3': [
    { id: 's5', skill_name: 'Assembly', level: 5, cert_number: 'AS20220001', expire_date: '2027-03-15' },
    { id: 's6', skill_name: 'Testing', level: 3, cert_number: '', expire_date: '' }
  ],
  '4': [
    { id: 's7', skill_name: 'Assembly leadership', level: 5, cert_number: 'AL20240002', expire_date: '2027-01-10' },
    { id: 's8', skill_name: 'CNC operation', level: 3, cert_number: '', expire_date: '' }
  ],
  '5': [{ id: 's9', skill_name: 'Heat treatment', level: 4, cert_number: 'HT20230005', expire_date: '2026-09-30' }],
  '6': [{ id: 's10', skill_name: 'Quality inspection', level: 5, cert_number: 'QI20240001', expire_date: '2027-11-20' }]
}
