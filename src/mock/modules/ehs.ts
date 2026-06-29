// EHS mock data
export const ehsHazards = [
  { id: '1', code: 'YH20250115001', location: '机加工一车间', desc: '冷却液泄漏', level: 'moderate', status: 'open', finder: '李四', found_at: '2025-01-15' },
  { id: '2', code: 'YH20250110002', location: '装配车间', desc: '安全护栏损坏', level: 'major', status: 'processing', finder: '王五', found_at: '2025-01-10' },
  { id: '3', code: 'YH20250105003', location: '热处理车间', desc: '通风不畅', level: 'minor', status: 'closed', finder: '赵六', found_at: '2025-01-05' }
]

export const ehsEmergencyPlans = [
  { id: '1', name: '火灾爆炸应急预案', type: '火灾', level: 'I', responsible: '安全主管-陈工', last_drill: '2024-12-15' },
  { id: '2', name: '化学品泄漏应急预案', type: '危化品', level: 'II', responsible: '车间主任-李四', last_drill: '2024-11-20' },
  { id: '3', name: '机械伤害应急预案', type: '机械', level: 'II', responsible: '设备主管-王工', last_drill: '2024-10-10' },
  { id: '4', name: '停电应急处置方案', type: '电力', level: 'III', responsible: '电工-张工', last_drill: '2024-09-05' }
]

export const ehsPermits = [
  { id: '1', code: 'ZYP20250115001', type: 'hot', location: '机加工一车间', applicant: '李四', apply_date: '2025-01-15', status: 'approved' },
  { id: '2', code: 'ZYP20250116001', type: 'height', location: '装配车间', applicant: '王五', apply_date: '2025-01-16', status: 'pending' }
]

export const ehsTrainingRecords = [
  { id: '1', title: '三级安全教育-新员工入职', trainer: '安全主管-陈工', trainees: '孙八,周九,吴十', plan_date: '2025-01-15', status: 'completed' },
  { id: '2', title: '消防演练培训', trainer: '消防队长-刘工', trainees: '全员', plan_date: '2025-02-01', status: 'pending' },
  { id: '3', title: '危化品操作培训', trainer: '安全主管-陈工', trainees: '李四,王五,赵六', plan_date: '2024-11-20', status: 'expired' }
]
