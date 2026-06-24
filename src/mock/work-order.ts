/**
 * 工单管理 Mock 数据
 */
import Mock from 'mockjs'

// ==================== 工单列表 ====================
export const workOrders = Mock.mock({
  'list|12': [{
    'id|+1': 1,
    code: /WO2025\d{6}/,
    'wo_type|1': ['production','production','production','rework','sample'],
    material_code: '@pick(["04.01.001-00001","04.02.001-00001","03.01.001-00001","04.01.002-00001","04.03.001-00001"])',
    material_name: '@pick(["离心泵 XJP-100","齿轮箱 GBX-200","传动轴 DS-50","离心泵 XJP-200","新型泵 NP-001"])',
    material_spec: '@pick(["流量100m³/h","速比1:5","φ50×500","流量200m³/h","试制"])',
    'planned_qty|1': [100,50,30,200,80,60,3],
    'completed_qty|0-100': 1,
    'progress|0-100': 1,
    'status|1': ['draft','approved','released','in_progress','in_progress','completed','closed'],
    'priority|1': ['urgent','high','normal','normal','normal','low'],
    workshop_name: '@pick(["机加工一车间","机加工二车间","装配车间"])',
    current_operation: '@pick(["工序10:下料","工序20:粗车","工序30:精车","工序40:钻孔","全部完工","-"])',
    planned_start_date: '@date("yyyy-MM-dd")',
    planned_end_date: '@date("yyyy-MM-dd")'
  }]
}).list

// ==================== 工单工序 ====================
export const workOrderOperations = [
  { id: '1', operation_no: 10, name: '下料', work_center: '下料组', status: 'completed', worker: '李四', qualified_qty: 100, defective_qty: 2, actual_hours: 8.5, planned_start: '2025-01-11 08:00', planned_end: '2025-01-11 17:00', is_qc_gate: false, setup_hours: 15, run_hours: 5 },
  { id: '2', operation_no: 20, name: '粗车', work_center: '数控车组', status: 'completed', worker: '王五', qualified_qty: 98, defective_qty: 1, actual_hours: 16, planned_start: '2025-01-12 08:00', planned_end: '2025-01-14 12:00', is_qc_gate: false, setup_hours: 30, run_hours: 25 },
  { id: '3', operation_no: 30, name: '精车', work_center: '数控车组', status: 'running', worker: '赵六', qualified_qty: 45, defective_qty: 3, actual_hours: 12, planned_start: '2025-01-14 13:00', planned_end: '2025-01-16 17:00', is_qc_gate: true, setup_hours: 20, run_hours: 18 },
  { id: '4', operation_no: 40, name: '钻孔', work_center: '钻床组', status: 'pending', worker: '-', qualified_qty: 0, defective_qty: 0, actual_hours: 0, planned_start: '2025-01-17 08:00', planned_end: '2025-01-17 17:00', is_qc_gate: false, setup_hours: 10, run_hours: 8 },
  { id: '5', operation_no: 50, name: '磨削', work_center: '磨床组', status: 'pending', worker: '-', qualified_qty: 0, defective_qty: 0, actual_hours: 0, planned_start: '2025-01-18 08:00', planned_end: '2025-01-19 12:00', is_qc_gate: true, setup_hours: 20, run_hours: 15 },
  { id: '6', operation_no: 60, name: '装配', work_center: '装配组', status: 'pending', worker: '-', qualified_qty: 0, defective_qty: 0, actual_hours: 0, planned_start: '2025-01-19 13:00', planned_end: '2025-01-20 12:00', is_qc_gate: false, setup_hours: 30, run_hours: 45 },
  { id: '7', operation_no: 70, name: '试压', work_center: '测试组', status: 'pending', worker: '-', qualified_qty: 0, defective_qty: 0, actual_hours: 0, planned_start: '2025-01-20 13:00', planned_end: '2025-01-20 17:00', is_qc_gate: true, setup_hours: 15, run_hours: 20 },
  { id: '8', operation_no: 80, name: '油漆', work_center: '涂装组', status: 'pending', worker: '-', qualified_qty: 0, defective_qty: 0, actual_hours: 0, planned_start: '2025-01-21 08:00', planned_end: '2025-01-21 12:00', is_qc_gate: false, setup_hours: 20, run_hours: 30 }
]

// ==================== Kanban 看板工序 ====================
export const kanbanOps = [
  { id: '1', wo_code: 'WO202501150001', wo_priority: 'normal', material_name: '离心泵 XJP-100', operation_no: 40, name: '钻孔', work_center: '钻床组', total_hours: 14, status: 'pending' },
  { id: '2', wo_code: 'WO202501150001', wo_priority: 'normal', material_name: '离心泵 XJP-100', operation_no: 50, name: '磨削', work_center: '磨床组', total_hours: 18, status: 'pending' },
  { id: '3', wo_code: 'WO202501160010', wo_priority: 'urgent', material_name: '齿轮箱 GBX-200', operation_no: 10, name: '下料', work_center: '下料组', total_hours: 8, status: 'pending' },
  { id: '4', wo_code: 'WO202501150002', wo_priority: 'high', material_name: '齿轮箱 GBX-200', operation_no: 20, name: '粗车', work_center: '数控车组', total_hours: 32, status: 'assigned', worker: '王五', planned_start: '2025-01-16 08:00' },
  { id: '5', wo_code: 'WO202501150005', wo_priority: 'normal', material_name: '传动轴 DS-50', operation_no: 30, name: '精车', work_center: '数控车组', total_hours: 16, status: 'assigned', worker: '李四', planned_start: '2025-01-16 13:00' },
  { id: '6', wo_code: 'WO202501150001', wo_priority: 'normal', material_name: '离心泵 XJP-100', operation_no: 30, name: '精车', work_center: '数控车组', total_hours: 20, status: 'running', worker: '赵六', progress: 60 },
  { id: '7', wo_code: 'WO202501150005', wo_priority: 'normal', material_name: '传动轴 DS-50', operation_no: 20, name: '车削', work_center: '数控车组', total_hours: 24, status: 'running', worker: '孙八', progress: 35 },
  { id: '8', wo_code: 'WO202501150001', wo_priority: 'normal', material_name: '离心泵 XJP-100', operation_no: 10, name: '下料', work_center: '下料组', total_hours: 8.5, status: 'completed', worker: '李四', qualified_qty: 100, defective_qty: 2 },
  { id: '9', wo_code: 'WO202501150001', wo_priority: 'normal', material_name: '离心泵 XJP-100', operation_no: 20, name: '粗车', work_center: '数控车组', total_hours: 16, status: 'completed', worker: '王五', qualified_qty: 98, defective_qty: 1 }
]

// ==================== 报工记录 ====================
export const reportHistory = [
  { time: '2025-01-15 14:00', qualified_qty: 25, defective_qty: 1, defect_reasons: '尺寸超差', actual_hours: 180, worker: '赵六' },
  { time: '2025-01-15 10:00', qualified_qty: 20, defective_qty: 2, defect_reasons: '外观缺陷, 设备精度', actual_hours: 120, worker: '赵六' }
]

// ==================== 我的任务 ====================
export const myTasks = {
  assigned: [
    { id: '1', wo_id: '1', wo_code: 'WO202501150001', wo_priority: 'normal', material_name: '离心泵 XJP-100', operation_no: 40, operation_name: '钻孔', work_center: '钻床组', planned_qty: 100, reported_qty: 0, planned_start: '2025-01-17 08:00', planned_end: '2025-01-17 17:00', status: 'assigned' },
    { id: '2', wo_id: '2', wo_code: 'WO202501150002', wo_priority: 'high', material_name: '齿轮箱 GBX-200', operation_no: 10, operation_name: '下料', work_center: '下料组', planned_qty: 50, reported_qty: 0, planned_start: '2025-01-16 08:00', planned_end: '2025-01-16 17:00', status: 'assigned' }
  ],
  running: [
    { id: '3', wo_id: '1', wo_code: 'WO202501150001', wo_priority: 'normal', material_name: '离心泵 XJP-100', operation_no: 30, operation_name: '精车', work_center: '数控车组', planned_qty: 100, reported_qty: 45, planned_start: '2025-01-14', planned_end: '2025-01-16', status: 'running' }
  ],
  completed: [
    { id: '4', wo_id: '1', wo_code: 'WO202501150001', wo_priority: 'normal', material_name: '离心泵 XJP-100', operation_no: 20, operation_name: '粗车', work_center: '数控车组', planned_qty: 100, reported_qty: 100, status: 'completed' },
    { id: '5', wo_id: '1', wo_code: 'WO202501150001', wo_priority: 'normal', material_name: '离心泵 XJP-100', operation_no: 10, operation_name: '下料', work_center: '下料组', planned_qty: 100, reported_qty: 100, status: 'completed' },
    { id: '6', wo_id: '3', wo_code: 'WO202501140003', wo_priority: 'normal', material_name: '离心泵 XJP-200', operation_no: 50, operation_name: '磨削', work_center: '磨床组', planned_qty: 30, reported_qty: 30, status: 'completed', qc_required: true, inspected: true }
  ]
}
