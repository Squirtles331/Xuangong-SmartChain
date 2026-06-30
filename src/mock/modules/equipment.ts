export const equipmentOeeOverview = {
  cards: [
    { title: 'OEE综合', value: 78.5 },
    { title: '设备利用率', value: 85.2 },
    { title: '性能效率', value: 92.1 },
    { title: '合格品率', value: 98.3 }
  ],
  rankData: [
    { equipment: '数控车床 CK6150', oee: '85.2%', utilization: '90.1%', performance: '95.0%', quality: '99.5%' },
    { equipment: '钻床 Z3050', oee: '78.6%', utilization: '82.3%', performance: '93.5%', quality: '98.2%' },
    { equipment: '磨床 M1432', oee: '72.1%', utilization: '75.0%', performance: '90.2%', quality: '97.8%' },
    { equipment: '加工中心 VMC850', oee: '80.5%', utilization: '88.0%', performance: '92.8%', quality: '98.8%' }
  ],
  trendData: {
    months: ['1月', '2月', '3月', '4月', '5月', '6月'],
    oee: [75, 76, 78, 77, 79, 78.5],
    utilization: [82, 84, 85, 83, 86, 85.2],
    performance: [90, 91, 92, 91, 93, 92.1],
    quality: [97, 98, 97.5, 98.2, 98.5, 98.3]
  }
}

export const equipmentRepairs = [
  {
    id: 'repair-1',
    code: 'WX202606300001',
    equipment: '数控车床 CK6150',
    fault_desc: '主轴异响，需要检查轴承状态',
    priority: 'high' as const,
    status: 'pending' as const,
    worker: '',
    created_at: '2026-06-30 09:20:00'
  },
  {
    id: 'repair-2',
    code: 'WX202606280002',
    equipment: '钻床 Z3050',
    fault_desc: '液压系统压力波动',
    priority: 'urgent' as const,
    status: 'running' as const,
    worker: '张维修',
    created_at: '2026-06-28 14:10:00'
  },
  {
    id: 'repair-3',
    code: 'WX202606260003',
    equipment: '磨床 M1432',
    fault_desc: '导轨润滑不足，已补充并复检',
    priority: 'normal' as const,
    status: 'done' as const,
    worker: '李维修',
    created_at: '2026-06-26 11:30:00'
  }
]

export const equipmentMaintains = [
  {
    id: 'maintain-1',
    code: 'BY202606300001',
    equipment: '数控车床 CK6150',
    type: 'daily' as const,
    plan_date: '2026-07-01',
    executor: '王保养',
    status: 'pending' as const
  },
  {
    id: 'maintain-2',
    code: 'BY202606280002',
    equipment: '钻床 Z3050',
    type: 'weekly' as const,
    plan_date: '2026-06-29',
    executor: '张保养',
    status: 'done' as const
  },
  {
    id: 'maintain-3',
    code: 'BY202606250003',
    equipment: '磨床 M1432',
    type: 'overhaul' as const,
    plan_date: '2026-06-20',
    executor: '李保养',
    status: 'overdue' as const
  }
]

export const equipmentChecks = [
  {
    id: 'check-1',
    code: 'DJ202606300001',
    equipment: '数控车床 CK6150',
    check_type: '日点检',
    plan_date: '2026-07-01',
    executor: '赵点检',
    status: 'pending' as const
  },
  {
    id: 'check-2',
    code: 'DJ202606280002',
    equipment: '钻床 Z3050',
    check_type: '周点检',
    plan_date: '2026-06-28',
    executor: '钱点检',
    status: 'done' as const
  },
  {
    id: 'check-3',
    code: 'DJ202606250003',
    equipment: '磨床 M1432',
    check_type: '月点检',
    plan_date: '2026-06-20',
    executor: '孙点检',
    status: 'overdue' as const
  }
]

export const equipmentSpares = [
  {
    id: 'spare-1',
    code: 'PJ202606300001',
    name: '主轴轴承',
    spec: '6208-2RS',
    applicable_equipment: '数控车床 CK6150',
    qty: 8,
    safety: 5,
    unit: '套',
    location: 'A-01-01'
  },
  {
    id: 'spare-2',
    code: 'PJ202606280002',
    name: '液压油滤芯',
    spec: 'HF-20',
    applicable_equipment: '钻床 Z3050',
    qty: 3,
    safety: 5,
    unit: '个',
    location: 'A-01-02'
  },
  {
    id: 'spare-3',
    code: 'PJ202606250003',
    name: '导轨防尘罩',
    spec: 'FCZ-M1432',
    applicable_equipment: '磨床 M1432',
    qty: 0,
    safety: 2,
    unit: '件',
    location: 'B-02-03'
  }
]
