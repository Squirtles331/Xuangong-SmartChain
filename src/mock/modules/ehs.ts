export const ehsHazards = [
  {
    id: 'hazard-1',
    code: 'YH202606300001',
    location: '机加工一车间',
    desc: '冷却液泄漏，地面有打滑风险',
    level: 'moderate' as const,
    status: 'open' as const,
    finder: '李四',
    found_at: '2026-06-30'
  },
  {
    id: 'hazard-2',
    code: 'YH202606280002',
    location: '装配车间',
    desc: '安全护栏损坏，需立即更换',
    level: 'major' as const,
    status: 'processing' as const,
    finder: '王五',
    found_at: '2026-06-28'
  },
  {
    id: 'hazard-3',
    code: 'YH202606250003',
    location: '热处理车间',
    desc: '排风不畅，局部温度偏高',
    level: 'minor' as const,
    status: 'closed' as const,
    finder: '赵六',
    found_at: '2026-06-25'
  }
]

export const ehsEmergencyPlans = [
  {
    id: 'emergency-1',
    name: '火灾爆炸应急预案',
    type: '火灾' as const,
    level: 'I' as const,
    responsible: '安全主管-陈工',
    last_drill: '2026-05-15'
  },
  {
    id: 'emergency-2',
    name: '危化品泄漏应急预案',
    type: '危化品' as const,
    level: 'II' as const,
    responsible: '车间主任-李四',
    last_drill: '2026-04-20'
  },
  {
    id: 'emergency-3',
    name: '机械伤害应急预案',
    type: '机械' as const,
    level: 'II' as const,
    responsible: '设备主管-王工',
    last_drill: '2026-03-10'
  },
  {
    id: 'emergency-4',
    name: '停电应急处置方案',
    type: '电力' as const,
    level: 'III' as const,
    responsible: '电工-张工',
    last_drill: '2026-02-05'
  }
]

export const ehsPermits = [
  {
    id: 'permit-1',
    code: 'ZYP202606300001',
    type: 'hot' as const,
    location: '机加工一车间',
    applicant: '李四',
    apply_date: '2026-06-30',
    status: 'approved' as const
  },
  {
    id: 'permit-2',
    code: 'ZYP202606290002',
    type: 'height' as const,
    location: '装配车间',
    applicant: '王五',
    apply_date: '2026-06-29',
    status: 'pending' as const
  },
  {
    id: 'permit-3',
    code: 'ZYP202606270003',
    type: 'confined' as const,
    location: '污水处理区',
    applicant: '赵六',
    apply_date: '2026-06-27',
    status: 'closed' as const
  }
]

export const ehsTrainingRecords = [
  {
    id: 'training-1',
    title: '三级安全教育-新员工入厂',
    trainer: '安全主管-陈工',
    trainees: '孙八、周九、吴十',
    plan_date: '2026-06-30',
    status: 'completed' as const
  },
  {
    id: 'training-2',
    title: '消防演练培训',
    trainer: '消防队长-刘工',
    trainees: '全员',
    plan_date: '2026-07-05',
    status: 'pending' as const
  },
  {
    id: 'training-3',
    title: '危化品操作培训',
    trainer: '安全主管-陈工',
    trainees: '李四、王五、赵六',
    plan_date: '2026-05-20',
    status: 'expired' as const
  }
]
