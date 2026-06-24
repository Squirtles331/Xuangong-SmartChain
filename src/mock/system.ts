/**
 * 系统管理 Mock 数据
 * 字典类型、字典项、菜单、系统参数、操作日志、编码规则、审批流
 */
import Mock from 'mockjs'

// ==================== 字典类型 ====================
export const dictTypes = Mock.mock({
  'list|10': [
    {
      'id|+1': 1,
      code: '@pick(["work_order_priority","work_order_status","defect_reason","material_type","warehouse_type","equipment_status","customer_type","payment_method","exception_type","inspection_result"])',
      name: '@pick(["工单优先级","工单状态","不良原因","物料类型","仓库类型","设备状态","客户类型","回款方式","异常类型","质检判定"])',
      description: '@csentence(10,20)',
      'status|1': ['active', 'active', 'active', 'disabled']
    }
  ]
}).list

// ==================== 字典项 ====================
export const dictItems: Record<string, any[]> = {
  work_order_priority: [
    { id: 1, dict_type_code: 'work_order_priority', code: 'urgent', name: '紧急', sort_order: 1, css_class: 'danger', status: 'active' },
    { id: 2, dict_type_code: 'work_order_priority', code: 'high', name: '高', sort_order: 2, css_class: 'warning', status: 'active' },
    { id: 3, dict_type_code: 'work_order_priority', code: 'normal', name: '普通', sort_order: 3, css_class: '', status: 'active' },
    { id: 4, dict_type_code: 'work_order_priority', code: 'low', name: '低', sort_order: 4, css_class: 'info', status: 'active' }
  ],
  work_order_status: [
    { id: 5, dict_type_code: 'work_order_status', code: 'draft', name: '草稿', sort_order: 1, css_class: 'info', status: 'active' },
    { id: 6, dict_type_code: 'work_order_status', code: 'approved', name: '已审批', sort_order: 2, css_class: '', status: 'active' },
    { id: 7, dict_type_code: 'work_order_status', code: 'released', name: '已下发', sort_order: 3, css_class: 'warning', status: 'active' },
    { id: 8, dict_type_code: 'work_order_status', code: 'in_progress', name: '生产中', sort_order: 4, css_class: 'primary', status: 'active' },
    { id: 9, dict_type_code: 'work_order_status', code: 'completed', name: '已完工', sort_order: 5, css_class: 'success', status: 'active' },
    { id: 10, dict_type_code: 'work_order_status', code: 'closed', name: '已关闭', sort_order: 6, css_class: 'info', status: 'active' }
  ],
  defect_reason: [
    { id: 11, dict_type_code: 'defect_reason', code: 'dimension', name: '尺寸超差', sort_order: 1, css_class: '', status: 'active' },
    { id: 12, dict_type_code: 'defect_reason', code: 'appearance', name: '外观缺陷', sort_order: 2, css_class: '', status: 'active' },
    { id: 13, dict_type_code: 'defect_reason', code: 'material', name: '材质问题', sort_order: 3, css_class: '', status: 'active' },
    { id: 14, dict_type_code: 'defect_reason', code: 'equipment', name: '设备精度', sort_order: 4, css_class: '', status: 'active' },
    { id: 15, dict_type_code: 'defect_reason', code: 'operation', name: '操作失误', sort_order: 5, css_class: '', status: 'active' }
  ],
  material_type: [
    { id: 16, dict_type_code: 'material_type', code: 'purchased', name: '外购', sort_order: 1, status: 'active' },
    { id: 17, dict_type_code: 'material_type', code: 'manufactured', name: '自制', sort_order: 2, status: 'active' },
    { id: 18, dict_type_code: 'material_type', code: 'outsourced', name: '委外', sort_order: 3, status: 'active' },
    { id: 19, dict_type_code: 'material_type', code: 'phantom', name: '虚拟件', sort_order: 4, status: 'active' }
  ],
  warehouse_type: [
    { id: 20, dict_type_code: 'warehouse_type', code: 'raw_material', name: '原材料仓', sort_order: 1, status: 'active' },
    { id: 21, dict_type_code: 'warehouse_type', code: 'wip', name: '在制品仓', sort_order: 2, status: 'active' },
    { id: 22, dict_type_code: 'warehouse_type', code: 'finished_goods', name: '成品仓', sort_order: 3, status: 'active' },
    { id: 23, dict_type_code: 'warehouse_type', code: 'spare_parts', name: '备件仓', sort_order: 4, status: 'active' }
  ],
  equipment_status: [
    { id: 24, dict_type_code: 'equipment_status', code: 'running', name: '运行', sort_order: 1, css_class: 'success', status: 'active' },
    { id: 25, dict_type_code: 'equipment_status', code: 'idle', name: '空闲', sort_order: 2, css_class: 'info', status: 'active' },
    { id: 26, dict_type_code: 'equipment_status', code: 'maintenance', name: '保养中', sort_order: 3, css_class: 'warning', status: 'active' },
    { id: 27, dict_type_code: 'equipment_status', code: 'repair', name: '维修中', sort_order: 4, css_class: 'danger', status: 'active' }
  ],
  customer_type: [
    { id: 28, dict_type_code: 'customer_type', code: 'enterprise', name: '企业', sort_order: 1, status: 'active' },
    { id: 29, dict_type_code: 'customer_type', code: 'individual', name: '个人', sort_order: 2, status: 'active' }
  ],
  payment_method: [
    { id: 30, dict_type_code: 'payment_method', code: 'bank', name: '银行转账', sort_order: 1, status: 'active' },
    { id: 31, dict_type_code: 'payment_method', code: 'cash', name: '现金', sort_order: 2, status: 'active' },
    { id: 32, dict_type_code: 'payment_method', code: 'draft', name: '承兑汇票', sort_order: 3, status: 'active' }
  ],
  exception_type: [
    { id: 33, dict_type_code: 'exception_type', code: 'equipment', name: '设备故障', sort_order: 1, status: 'active' },
    { id: 34, dict_type_code: 'exception_type', code: 'material', name: '来料不良', sort_order: 2, status: 'active' },
    { id: 35, dict_type_code: 'exception_type', code: 'process', name: '图纸/工艺错误', sort_order: 3, status: 'active' }
  ],
  inspection_result: [
    { id: 36, dict_type_code: 'inspection_result', code: 'qualified', name: '合格', sort_order: 1, css_class: 'success', status: 'active' },
    { id: 37, dict_type_code: 'inspection_result', code: 'concession', name: '让步接收', sort_order: 2, css_class: 'warning', status: 'active' },
    { id: 38, dict_type_code: 'inspection_result', code: 'sorting', name: '挑选使用', sort_order: 3, css_class: 'warning', status: 'active' },
    { id: 39, dict_type_code: 'inspection_result', code: 'return', name: '退货', sort_order: 4, css_class: 'danger', status: 'active' },
    { id: 40, dict_type_code: 'inspection_result', code: 'scrap', name: '报废', sort_order: 5, css_class: 'danger', status: 'active' }
  ]
}

// ==================== 菜单 ====================
export const menuTree = [
  {
    id: '1',
    parent_id: null,
    name: '首页',
    type: 'menu',
    path: '/',
    component: 'views/HomeView.vue',
    permission_code: 'home:view',
    icon: 'House',
    sort_order: 0,
    visible: true
  },
  {
    id: '2',
    parent_id: null,
    name: '主数据管理',
    type: 'directory',
    permission_code: 'mdm',
    icon: 'DataAnalysis',
    sort_order: 5,
    visible: true,
    children: [
      {
        id: '201',
        parent_id: '2',
        name: '组织管理',
        type: 'menu',
        path: '/mdm/organization',
        component: 'views/mdm/Organization.vue',
        permission_code: 'mdm:org:list',
        icon: 'OfficeBuilding',
        sort_order: 1,
        visible: true
      },
      {
        id: '202',
        parent_id: '2',
        name: '物料管理',
        type: 'menu',
        path: '/mdm/material',
        component: 'views/mdm/Material.vue',
        permission_code: 'mdm:material:list',
        icon: 'Goods',
        sort_order: 2,
        visible: true
      },
      {
        id: '203',
        parent_id: '2',
        name: '制造资源',
        type: 'menu',
        path: '/mdm/resource',
        component: 'views/mdm/Resource.vue',
        permission_code: 'mdm:resource:list',
        icon: 'Cpu',
        sort_order: 3,
        visible: true
      }
    ]
  },
  {
    id: '3',
    parent_id: null,
    name: '系统管理',
    type: 'directory',
    permission_code: 'system',
    icon: 'Setting',
    sort_order: 10,
    visible: true,
    children: [
      {
        id: '301',
        parent_id: '3',
        name: '用户管理',
        type: 'menu',
        path: '/system/user',
        component: 'views/system/user/index.vue',
        permission_code: 'system:user:list',
        icon: 'User',
        sort_order: 1,
        visible: true,
        children: [
          { id: '3011', parent_id: '301', name: '新增用户', type: 'button', permission_code: 'system:user:create', sort_order: 1, visible: true },
          { id: '3012', parent_id: '301', name: '编辑用户', type: 'button', permission_code: 'system:user:edit', sort_order: 2, visible: true },
          { id: '3013', parent_id: '301', name: '删除用户', type: 'button', permission_code: 'system:user:delete', sort_order: 3, visible: true }
        ]
      },
      {
        id: '302',
        parent_id: '3',
        name: '角色管理',
        type: 'menu',
        path: '/system/role',
        component: 'views/system/role/index.vue',
        permission_code: 'system:role:list',
        icon: 'UserFilled',
        sort_order: 2,
        visible: true
      },
      {
        id: '303',
        parent_id: '3',
        name: '菜单管理',
        type: 'menu',
        path: '/system/menu',
        component: 'views/system/menu/index.vue',
        permission_code: 'system:menu:list',
        icon: 'Menu',
        sort_order: 3,
        visible: true
      },
      {
        id: '304',
        parent_id: '3',
        name: '字典管理',
        type: 'menu',
        path: '/system/dict',
        component: 'views/system/dict/index.vue',
        permission_code: 'system:dict:list',
        icon: 'Notebook',
        sort_order: 4,
        visible: true
      },
      {
        id: '305',
        parent_id: '3',
        name: '系统参数',
        type: 'menu',
        path: '/system/params',
        component: 'views/system/params/index.vue',
        permission_code: 'system:params:list',
        icon: 'Tools',
        sort_order: 5,
        visible: true
      },
      {
        id: '306',
        parent_id: '3',
        name: '操作日志',
        type: 'menu',
        path: '/system/audit',
        component: 'views/system/audit/index.vue',
        permission_code: 'system:audit:list',
        icon: 'DocumentChecked',
        sort_order: 6,
        visible: true
      },
      {
        id: '307',
        parent_id: '3',
        name: '编码规则',
        type: 'menu',
        path: '/system/code-rule',
        component: 'views/system/code-rule/index.vue',
        permission_code: 'system:coderule:list',
        icon: 'Stamp',
        sort_order: 7,
        visible: true
      },
      {
        id: '308',
        parent_id: '3',
        name: '审批流配置',
        type: 'menu',
        path: '/system/approval',
        component: 'views/system/approval/index.vue',
        permission_code: 'system:approval:list',
        icon: 'Select',
        sort_order: 8,
        visible: true
      },
      {
        id: '309',
        parent_id: '3',
        name: '文件管理',
        type: 'menu',
        path: '/system/file',
        component: 'views/system/file/index.vue',
        permission_code: 'system:file:list',
        icon: 'FolderOpened',
        sort_order: 9,
        visible: true
      }
    ]
  }
]

// ==================== 系统参数 ====================
export const systemParams = [
  { id: '1', code: 'login_lock_count', name: '登录失败锁定次数', value: '5', description: '连续登录失败N次后锁定账号' },
  { id: '2', code: 'login_lock_minutes', name: '登录锁定时间(分钟)', value: '30', description: '锁定后自动解锁时间' },
  { id: '3', code: 'token_expire_minutes', name: 'Token有效期(分钟)', value: '120', description: 'JWT Token过期时间' },
  { id: '4', code: 'mrp_horizon_days', name: 'MRP展望期(天)', value: '90', description: 'MRP计算的时间范围' },
  { id: '5', code: 'stock_count_approval_threshold', name: '盘点差异审批阈值(元)', value: '1000', description: '超过此金额需升级审批' },
  { id: '6', code: 'work_center_overload_pct', name: '工作中心超负荷阈值(%)', value: '90', description: '负荷率超过此值标记为超负荷' },
  { id: '7', code: 'ar_aging_warn_days', name: '应收账龄警告天数', value: '30', description: '逾期超过此天数标记为警告' },
  { id: '8', code: 'file_upload_max_mb', name: '文件上传大小限制(MB)', value: '10', description: '单个文件最大上传大小' }
]

// ==================== 操作日志 ====================
export const auditLogs = Mock.mock({
  'list|20': [
    {
      'id|+1': 1,
      user_name: '@cname',
      'module|1': ['工单管理', '用户管理', 'BOM管理', '采购管理', '系统管理'],
      'action|1': ['CREATE', 'UPDATE', 'DELETE', 'APPROVE', 'LOGIN'],
      target: '@word(8)',
      ip: '@ip',
      request_params: '@pick([null,"{\\"qty\\":100}","{\\"status\\":\\"approved\\"}"])',
      created_at: '@datetime("yyyy-MM-dd HH:mm:ss")'
    }
  ]
}).list

// ==================== 编码规则 ====================
export const codeRules = [
  { id: '1', code: 'WO', name: '工单编号', prefix: 'WO', date_format: 'YYYYMMDD', serial_length: 4, example: 'WO202501150001' },
  { id: '2', code: 'SO', name: '销售订单编号', prefix: 'SO', date_format: 'YYYYMMDD', serial_length: 4, example: 'SO202501150001' },
  { id: '3', code: 'PR', name: '采购申请编号', prefix: 'PR', date_format: 'YYYYMMDD', serial_length: 4, example: 'PR202501150001' },
  { id: '4', code: 'PO', name: '采购订单编号', prefix: 'PO', date_format: 'YYYYMMDD', serial_length: 4, example: 'PO202501150001' },
  { id: '5', code: 'ECN', name: '变更单编号', prefix: 'ECN', date_format: 'YYYYMMDD', serial_length: 4, example: 'ECN202501150001' },
  { id: '6', code: 'DN', name: '发货通知编号', prefix: 'DN', date_format: 'YYYYMMDD', serial_length: 4, example: 'DN202501150001' },
  { id: '7', code: 'AR', name: '应收单编号', prefix: 'AR', date_format: 'YYYYMMDD', serial_length: 4, example: 'AR202501150001' },
  { id: '8', code: 'RC', name: '回款单编号', prefix: 'RC', date_format: 'YYYYMMDD', serial_length: 4, example: 'RC202501150001' },
  { id: '9', code: 'MRP', name: 'MRP运行编号', prefix: 'MRP', date_format: 'YYYYMMDD', serial_length: 4, example: 'MRP202501150001' },
  { id: '10', code: 'SCH', name: '排程版本编号', prefix: 'SCH', date_format: 'YYYYMMDD', serial_length: 4, example: 'SCH202501150001' }
]

// ==================== 审批流 ====================
export const approvalFlows = [
  { id: '1', name: '普通工单审批', business_type: 'work_order_normal', nodes: ['车间主任'], status: 'active' },
  { id: '2', name: '紧急工单审批', business_type: 'work_order_urgent', nodes: ['车间主任', '生产部长'], status: 'active' },
  { id: '3', name: 'BOM/工艺审批', business_type: 'bom_routing', nodes: ['研发负责人'], status: 'active' },
  { id: '4', name: 'ECN变更审批', business_type: 'ecn', nodes: ['研发负责人', '工艺负责人', '生产负责人', '质量负责人'], status: 'active' },
  { id: '5', name: '销售订单审批', business_type: 'sales_order', nodes: ['销售经理'], status: 'active' },
  { id: '6', name: '采购订单审批', business_type: 'purchase_order', nodes: ['采购经理'], status: 'active' }
]

// ==================== 用户 ====================
export const systemUsers = Mock.mock({
  'list|15': [
    {
      'id|+1': 1,
      username: '@word(6,10)',
      real_name: '@cname',
      email: '@email',
      phone: /1[3-9]\d{9}/,
      'status|1': ['active', 'active', 'active', 'disabled'],
      'roles|1-2': ['@pick(["超级管理员","生产计划员","车间主任","班组长","操作工","质检员","仓管员","采购员","销售员","财务"])'],
      created_at: '@datetime("yyyy-MM-dd HH:mm:ss")'
    }
  ]
}).list
