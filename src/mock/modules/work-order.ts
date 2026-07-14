export const workOrders = [
  {
    id: '1',
    code: 'WO202501150001',
    wo_type: 'production',
    material_id: 'mat-1',
    material_code: '04.01.001-00001',
    material_name: '离心泵 XJP-100',
    material_spec: '流量 100m3/h',
    planned_qty: 100,
    completed_qty: 45,
    defective_qty: 3,
    status: 'in_progress',
    priority: 'normal',
    workshop_name: '机加工一车间',
    line_name: '产线A',
    current_operation: '工序30：精车',
    planned_start_date: '2025-01-14',
    planned_end_date: '2025-01-16',
    actual_start_date: '2025-01-14 08:00:00',
    bom_version: 'EBOM V2.1',
    routing_version: '标准工艺 V1.1',
    customer_po: 'PO20250112001',
    remark: '重点保障交付',
    created_by: '计划员张敏',
    created_at: '2025-01-13 09:30:00'
  },
  {
    id: '2',
    code: 'WO202501150002',
    wo_type: 'production',
    material_id: 'mat-2',
    material_code: '04.02.001-00001',
    material_name: '齿轮箱 GBX-200',
    material_spec: '速比 1:5',
    planned_qty: 50,
    completed_qty: 0,
    defective_qty: 0,
    status: 'approved',
    priority: 'high',
    workshop_name: '机加工二车间',
    line_name: '产线B',
    current_operation: '工序10：下料',
    planned_start_date: '2025-01-16',
    planned_end_date: '2025-01-20',
    bom_version: 'EBOM V1.4',
    routing_version: '标准工艺 V1.0',
    customer_po: 'PO20250113007',
    remark: '待车间排产',
    created_by: '计划员王磊',
    created_at: '2025-01-14 10:20:00'
  },
  {
    id: '3',
    code: 'WO202501140003',
    wo_type: 'rework',
    material_id: 'mat-3',
    material_code: '04.01.002-00001',
    material_name: '离心泵 XJP-200',
    material_spec: '流量 200m3/h',
    planned_qty: 30,
    completed_qty: 30,
    defective_qty: 0,
    status: 'completed',
    priority: 'urgent',
    workshop_name: '装配车间',
    line_name: '产线C',
    current_operation: '全部完工',
    planned_start_date: '2025-01-10',
    planned_end_date: '2025-01-14',
    actual_start_date: '2025-01-10 08:30:00',
    bom_version: 'EBOM V2.0',
    routing_version: '返工工艺 V1.0',
    customer_po: 'PO20250108003',
    remark: '返工后复检合格',
    created_by: '质检员李娜',
    created_at: '2025-01-09 16:10:00'
  },
  {
    id: '4',
    code: 'WO202501130004',
    wo_type: 'sample',
    material_id: 'mat-4',
    material_code: '04.03.001-00001',
    material_name: '新型泵 NP-001',
    material_spec: '试制样件',
    planned_qty: 3,
    completed_qty: 0,
    defective_qty: 0,
    status: 'draft',
    priority: 'low',
    workshop_name: '装配车间',
    line_name: '',
    current_operation: '-',
    planned_start_date: '2025-01-18',
    planned_end_date: '2025-01-22',
    actual_start_date: '',
    bom_version: '',
    routing_version: '',
    customer_po: '',
    remark: '等待研发确认',
    created_by: '研发工程师周舟',
    created_at: '2025-01-13 14:50:00'
  }
]

export const workOrderOperations = [
  {
    id: '1',
    work_order_id: '1',
    operation_no: 10,
    name: '下料',
    work_center: '下料组',
    status: 'completed',
    worker: '李四',
    qualified_qty: 100,
    defective_qty: 2,
    actual_hours: 8.5,
    planned_start: '2025-01-11 08:00',
    planned_end: '2025-01-11 17:00',
    is_qc_gate: false,
    setup_hours: 15,
    run_hours: 5
  },
  {
    id: '2',
    work_order_id: '1',
    operation_no: 20,
    name: '粗车',
    work_center: '数控车组',
    status: 'completed',
    worker: '王五',
    qualified_qty: 98,
    defective_qty: 1,
    actual_hours: 16,
    planned_start: '2025-01-12 08:00',
    planned_end: '2025-01-14 12:00',
    is_qc_gate: false,
    setup_hours: 30,
    run_hours: 25
  },
  {
    id: '3',
    work_order_id: '1',
    operation_no: 30,
    name: '精车',
    work_center: '数控车组',
    status: 'running',
    worker: '赵六',
    qualified_qty: 45,
    defective_qty: 3,
    actual_hours: 12,
    planned_start: '2025-01-14 13:00',
    planned_end: '2025-01-16 17:00',
    is_qc_gate: true,
    setup_hours: 20,
    run_hours: 18
  },
  {
    id: '4',
    work_order_id: '1',
    operation_no: 40,
    name: '钻孔',
    work_center: '钻床组',
    status: 'pending',
    worker: '',
    qualified_qty: 0,
    defective_qty: 0,
    actual_hours: 0,
    planned_start: '2025-01-17 08:00',
    planned_end: '2025-01-17 17:00',
    is_qc_gate: false,
    setup_hours: 10,
    run_hours: 8
  }
]

export const kanbanOps = [
  {
    id: 'kanban-1',
    wo_code: 'WO202501150001',
    wo_priority: 'normal',
    material_name: '离心泵 XJP-100',
    operation_no: 40,
    name: '钻孔',
    work_center: '钻床组',
    total_hours: 14,
    status: 'pending'
  },
  {
    id: 'kanban-2',
    wo_code: 'WO202501150002',
    wo_priority: 'high',
    material_name: '齿轮箱 GBX-200',
    operation_no: 10,
    name: '下料',
    work_center: '下料组',
    total_hours: 8,
    status: 'assigned',
    worker: '王五',
    planned_start: '2025-01-16 08:00'
  },
  {
    id: 'kanban-3',
    wo_code: 'WO202501150001',
    wo_priority: 'normal',
    material_name: '离心泵 XJP-100',
    operation_no: 30,
    name: '精车',
    work_center: '数控车组',
    total_hours: 20,
    status: 'running',
    worker: '赵六',
    progress: 60
  },
  {
    id: 'kanban-4',
    wo_code: 'WO202501140003',
    wo_priority: 'urgent',
    material_name: '离心泵 XJP-200',
    operation_no: 50,
    name: '磨削',
    work_center: '磨床组',
    total_hours: 16,
    status: 'completed',
    worker: '孙八',
    qualified_qty: 30,
    defective_qty: 0
  }
]

export const reportHistory = [
  {
    wo_code: 'WO202501150001',
    time: '2025-01-15 14:00',
    status: 'confirmed',
    qualified_qty: 25,
    defective_qty: 1,
    defect_reasons: '尺寸超差',
    actual_hours: 180,
    worker: '赵六'
  },
  {
    wo_code: 'WO202501150001',
    time: '2025-01-15 10:00',
    status: 'submitted',
    qualified_qty: 20,
    defective_qty: 2,
    defect_reasons: '外观缺陷, 设备精度异常',
    actual_hours: 120,
    worker: '赵六'
  }
]

export const myTasks = {
  assigned: [
    {
      id: 'task-1',
      wo_id: '2',
      wo_code: 'WO202501150002',
      wo_priority: 'high',
      material_name: '齿轮箱 GBX-200',
      operation_no: 10,
      operation_name: '下料',
      work_center: '下料组',
      planned_qty: 50,
      reported_qty: 0,
      planned_start: '2025-01-16 08:00',
      planned_end: '2025-01-16 17:00',
      status: 'assigned',
      qc_required: false,
      inspected: false
    }
  ],
  running: [
    {
      id: 'task-2',
      wo_id: '1',
      wo_code: 'WO202501150001',
      wo_priority: 'normal',
      material_name: '离心泵 XJP-100',
      operation_no: 30,
      operation_name: '精车',
      work_center: '数控车组',
      planned_qty: 100,
      reported_qty: 45,
      planned_start: '2025-01-14 13:00',
      planned_end: '2025-01-16 17:00',
      status: 'running',
      qc_required: true,
      inspected: false
    }
  ],
  completed: [
    {
      id: 'task-3',
      wo_id: '3',
      wo_code: 'WO202501140003',
      wo_priority: 'urgent',
      material_name: '离心泵 XJP-200',
      operation_no: 50,
      operation_name: '磨削',
      work_center: '磨床组',
      planned_qty: 30,
      reported_qty: 30,
      planned_start: '2025-01-12 08:00',
      planned_end: '2025-01-14 18:00',
      status: 'completed',
      qc_required: true,
      inspected: true
    }
  ]
}

export const outsourceOrders = [
  {
    id: 'out-1',
    code: 'WW20250115001',
    material: '泵体毛坯',
    qty: 100,
    supplier: '苏州精密加工厂',
    operation: '外协铸造',
    send_date: '2025-01-15',
    due_date: '2025-01-20',
    price: 12500,
    status: 'processing'
  },
  {
    id: 'out-2',
    code: 'WW20250112002',
    material: '轴套组件',
    qty: 60,
    supplier: '昆山热处理中心',
    operation: '外协热处理',
    send_date: '2025-01-12',
    due_date: '2025-01-18',
    price: 4800,
    status: 'sent'
  },
  {
    id: 'out-3',
    code: 'WW20250108003',
    material: '齿轮箱壳体',
    qty: 30,
    supplier: '无锡机加服务商',
    operation: '精密镗孔',
    send_date: '2025-01-08',
    due_date: '2025-01-14',
    price: 9600,
    status: 'received'
  }
]

export const traceRecords = [
  {
    id: 'trace-1',
    wo_code: 'WO202501150001',
    op_name: '精车',
    worker: '赵六',
    qualified: 25,
    defective: 1,
    reasons: '尺寸超差',
    hours: 180,
    time: '2025-01-15 14:00'
  },
  {
    id: 'trace-2',
    wo_code: 'WO202501150001',
    op_name: '精车',
    worker: '赵六',
    qualified: 20,
    defective: 2,
    reasons: '外观缺陷, 设备精度异常',
    hours: 120,
    time: '2025-01-15 10:00'
  },
  {
    id: 'trace-3',
    wo_code: 'WO202501140003',
    op_name: '磨削',
    worker: '孙八',
    qualified: 30,
    defective: 0,
    reasons: '',
    hours: 160,
    time: '2025-01-14 16:20'
  }
]
