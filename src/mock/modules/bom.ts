/**
 * BOM/工艺/ECN Mock 数据
 */
import Mock from 'mockjs'

// ==================== BOM 列表 ====================
export const bomList = [
  {
    id: '1',
    material_code: '04.01.001-00001',
    material_name: '离心泵 XJP-100',
    bom_type: 'EBOM',
    version: 'V2.0',
    status: 'active',
    effective_date: '2025-01-10',
    created_by: '张工',
    createdAt: '2025-01-10'
  },
  {
    id: '2',
    material_code: '04.01.001-00001',
    material_name: '离心泵 XJP-100',
    bom_type: 'MBOM',
    version: 'V1.2',
    status: 'active',
    effective_date: '2025-01-12',
    created_by: '李工',
    createdAt: '2025-01-12'
  },
  {
    id: '3',
    material_code: '04.02.001-00001',
    material_name: '齿轮箱 GBX-200',
    bom_type: 'EBOM',
    version: 'V1.0',
    status: 'active',
    effective_date: '2025-01-05',
    created_by: '张工',
    createdAt: '2025-01-05'
  },
  {
    id: '4',
    material_code: '04.02.001-00001',
    material_name: '齿轮箱 GBX-200',
    bom_type: 'MBOM',
    version: 'V1.0',
    status: 'active',
    effective_date: '2025-01-08',
    created_by: '李工',
    createdAt: '2025-01-08'
  },
  {
    id: '5',
    material_code: '03.01.001-00001',
    material_name: '传动轴 DS-50',
    bom_type: 'MBOM',
    version: 'V1.1',
    status: 'draft',
    effective_date: '-',
    created_by: '李工',
    createdAt: '2025-01-15'
  },
  {
    id: '6',
    material_code: '04.01.001-00001',
    material_name: '离心泵 XJP-100',
    bom_type: 'MBOM',
    version: 'V1.1',
    status: 'archived',
    effective_date: '2024-12-01',
    created_by: '王工',
    createdAt: '2024-12-01'
  },
  {
    id: '7',
    material_code: '04.01.001-00001',
    material_name: '离心泵 XJP-100',
    bom_type: 'MBOM',
    version: 'V1.0',
    status: 'archived',
    effective_date: '2024-10-15',
    created_by: '王工',
    createdAt: '2024-10-15'
  }
]

// ==================== BOM 树结构 ====================
export const bomTree = [
  {
    id: 'root',
    label: '离心泵 XJP-100 ×1',
    material_code: '04.01.001-00001',
    material_name: '离心泵 XJP-100',
    qty: 1,
    scrap_rate: 0,
    position_no: '',
    material_type: 'normal',
    is_critical: false,
    substitute_allowed: false,
    children: [
      {
        id: 'c1',
        label: '泵体组件 ×1',
        material_code: '03.01.002-00001',
        material_name: '泵体组件',
        qty: 1,
        scrap_rate: 0,
        position_no: 'A1',
        material_type: 'normal',
        is_critical: true,
        substitute_allowed: false,
        children: [
          {
            id: 'c11',
            label: '泵体铸件 ×1',
            material_code: '01.01.001-00001',
            material_name: '泵体铸件',
            qty: 1,
            scrap_rate: 2,
            position_no: 'A1-1',
            material_type: 'normal',
            is_critical: true,
            substitute_allowed: false
          },
          {
            id: 'c12',
            label: '耐磨环 ×2',
            material_code: '02.01.001-00001',
            material_name: '耐磨环',
            qty: 2,
            scrap_rate: 0,
            position_no: 'A1-2',
            material_type: 'normal',
            is_critical: false,
            substitute_allowed: false
          },
          {
            id: 'c13',
            label: '螺栓 M16×60 ×8',
            material_code: '02.02.001-00001',
            material_name: '螺栓 M16×60',
            qty: 8,
            scrap_rate: 1,
            position_no: 'A1-3',
            material_type: 'normal',
            is_critical: false,
            substitute_allowed: true
          }
        ]
      },
      {
        id: 'c2',
        label: '叶轮组件 ×1',
        material_code: '03.01.003-00001',
        material_name: '叶轮组件',
        qty: 1,
        scrap_rate: 0,
        position_no: 'A2',
        material_type: 'normal',
        is_critical: true,
        substitute_allowed: false,
        children: [
          {
            id: 'c21',
            label: '叶轮铸件 ×1',
            material_code: '01.01.002-00001',
            material_name: '叶轮铸件',
            qty: 1,
            scrap_rate: 1.5,
            position_no: 'A2-1',
            material_type: 'normal',
            is_critical: true,
            substitute_allowed: false
          },
          {
            id: 'c22',
            label: '键 8×7×30 ×1',
            material_code: '02.03.001-00001',
            material_name: '键 8×7×30',
            qty: 1,
            scrap_rate: 0,
            position_no: 'A2-2',
            material_type: 'normal',
            is_critical: false,
            substitute_allowed: false
          }
        ]
      },
      {
        id: 'c3',
        label: '轴承架组件 ×1',
        material_code: '03.01.004-00001',
        material_name: '轴承架组件',
        qty: 1,
        scrap_rate: 0,
        position_no: 'A3',
        material_type: 'phantom',
        is_critical: false,
        substitute_allowed: false,
        children: [
          {
            id: 'c31',
            label: '轴承架 ×1',
            material_code: '01.01.003-00001',
            material_name: '轴承架',
            qty: 1,
            scrap_rate: 0,
            position_no: 'A3-1',
            material_type: 'normal',
            is_critical: false,
            substitute_allowed: false
          },
          {
            id: 'c32',
            label: '轴承 6308 ×2',
            material_code: '02.04.001-00001',
            material_name: '轴承 6308',
            qty: 2,
            scrap_rate: 0,
            position_no: 'A3-2',
            material_type: 'normal',
            is_critical: true,
            substitute_allowed: true
          }
        ]
      },
      {
        id: 'c4',
        label: '润滑油 Shell Tellus 46 ×0.5L',
        material_code: '05.01.001-00001',
        material_name: '润滑油 Shell Tellus 46',
        qty: 0.5,
        scrap_rate: 0,
        position_no: '',
        material_type: 'auxiliary',
        is_critical: false,
        substitute_allowed: false
      }
    ]
  }
]

// ==================== 工艺路线 ====================
const legacyRoutingOperations = [
  {
    id: '1',
    operation_no: 10,
    name: '下料',
    work_center: '下料组',
    setup_hours: 15,
    run_hours: 5,
    queue_hours: 0,
    move_hours: 10,
    workers: 1,
    skill: '锯床操作',
    is_qc_gate: false,
    is_outsourced: false,
    instruction: '按图纸尺寸下料，留3mm余量'
  },
  {
    id: '2',
    operation_no: 20,
    name: '粗车',
    work_center: '数控车组',
    setup_hours: 30,
    run_hours: 25,
    queue_hours: 30,
    move_hours: 10,
    workers: 1,
    skill: '数控车床操作',
    is_qc_gate: false,
    is_outsourced: false,
    instruction: ''
  },
  {
    id: '3',
    operation_no: 30,
    name: '精车',
    work_center: '数控车组',
    setup_hours: 20,
    run_hours: 18,
    queue_hours: 20,
    move_hours: 10,
    workers: 1,
    skill: '数控车床操作',
    is_qc_gate: true,
    is_outsourced: false,
    instruction: '保证公差±0.01mm'
  },
  {
    id: '4',
    operation_no: 40,
    name: '钻孔',
    work_center: '钻床组',
    setup_hours: 10,
    run_hours: 8,
    queue_hours: 15,
    move_hours: 10,
    workers: 1,
    skill: '钻床操作',
    is_qc_gate: false,
    is_outsourced: false,
    instruction: ''
  },
  {
    id: '5',
    operation_no: 50,
    name: '热处理',
    work_center: '热处理组',
    setup_hours: 60,
    run_hours: 120,
    queue_hours: 60,
    move_hours: 30,
    workers: 2,
    skill: '热处理操作',
    is_qc_gate: false,
    is_outsourced: true,
    instruction: '淬火+回火，HRC45-50'
  },
  {
    id: '6',
    operation_no: 60,
    name: '磨削',
    work_center: '磨床组',
    setup_hours: 20,
    run_hours: 15,
    queue_hours: 20,
    move_hours: 10,
    workers: 1,
    skill: '磨床操作',
    is_qc_gate: true,
    is_outsourced: false,
    instruction: ''
  },
  {
    id: '7',
    operation_no: 70,
    name: '装配',
    work_center: '装配组',
    setup_hours: 30,
    run_hours: 45,
    queue_hours: 30,
    move_hours: 10,
    workers: 2,
    skill: '装配钳工',
    is_qc_gate: false,
    is_outsourced: false,
    instruction: ''
  },
  {
    id: '8',
    operation_no: 80,
    name: '试压',
    work_center: '测试组',
    setup_hours: 15,
    run_hours: 20,
    queue_hours: 10,
    move_hours: 10,
    workers: 1,
    skill: '测试操作',
    is_qc_gate: true,
    is_outsourced: false,
    instruction: '试验压力2.5MPa，保压30min'
  },
  {
    id: '9',
    operation_no: 90,
    name: '油漆',
    work_center: '涂装组',
    setup_hours: 20,
    run_hours: 30,
    queue_hours: 10,
    move_hours: 10,
    workers: 1,
    skill: '涂装操作',
    is_qc_gate: false,
    is_outsourced: false,
    instruction: ''
  }
]

// ==================== ECN 变更单 ====================
export const ecnOrders = Mock.mock({
  'list|6': [
    {
      'id|+1': 1,
      code: /ECN2025\d{6}/,
      'change_type|1': ['BOM变更', '工艺变更', 'BOM+工艺变更'],
      material: '@pick(["离心泵 XJP-100","齿轮箱 GBX-200","传动轴 DS-50","离心泵 XJP-200"])',
      current_version: '@pick(["MBOM V1.2","MBOM V1.1","MBOM V1.0","标准工艺 V1.0"])',
      'status|1': ['draft', 'approved', 'executed', 'verified', 'closed'],
      'urgency|1': ['urgent', 'normal', 'planned'],
      applicant: '@cname',
      createdAt: '@date("yyyy-MM-dd")'
    }
  ]
}).list

// ==================== BOM 预览（工单创建时用） ====================
export const bomPreview = [
  { level: 0, material: '离心泵 XJP-100', qty: '1', total: '100台' },
  { level: 1, material: '泵体组件', qty: '1', total: '100' },
  { level: 2, material: '泵体铸件', qty: '1', total: '100' },
  { level: 2, material: '耐磨环', qty: '2', total: '200' },
  { level: 2, material: '螺栓 M16×60', qty: '8', total: '800' },
  { level: 1, material: '叶轮组件', qty: '1', total: '100' },
  { level: 1, material: '轴承架组件', qty: '1', total: '100' }
]
