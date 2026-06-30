/**
 * System domain mock data.
 * Keep field names aligned with the frontend API contracts.
 */

export const systemRoles = [
  {
    id: 'role-1',
    code: 'admin',
    name: '超级管理员',
    description: '系统超级管理员',
    status: 'active' as const,
    permissionIds: ['system:user:list', 'system:role:list', 'system:menu:list'],
    userCount: 2
  },
  {
    id: 'role-2',
    code: 'planner',
    name: '生产计划员',
    description: '负责计划与排程',
    status: 'active' as const,
    permissionIds: ['plan:list', 'work-order:list'],
    userCount: 3
  },
  {
    id: 'role-3',
    code: 'quality',
    name: '质检员',
    description: '负责来料与过程检验',
    status: 'active' as const,
    permissionIds: ['qms:list'],
    userCount: 4
  },
  {
    id: 'role-4',
    code: 'warehouse',
    name: '仓管员',
    description: '负责出入库作业',
    status: 'disabled' as const,
    permissionIds: ['wms:list'],
    userCount: 2
  }
]

export const systemUsers = [
  {
    id: 'user-1',
    username: 'admin',
    realName: '管理员',
    email: 'admin@example.com',
    phone: '13800000001',
    departmentId: 'dept-1',
    status: 1 as const,
    roles: ['超级管理员'],
    createdAt: '2026-06-01 09:00:00'
  },
  {
    id: 'user-2',
    username: 'planner01',
    realName: '张计划',
    email: 'planner01@example.com',
    phone: '13800000002',
    departmentId: 'dept-2',
    status: 1 as const,
    roles: ['生产计划员'],
    createdAt: '2026-06-02 10:15:00'
  },
  {
    id: 'user-3',
    username: 'quality01',
    realName: '李质检',
    email: 'quality01@example.com',
    phone: '13800000003',
    departmentId: 'dept-3',
    status: 1 as const,
    roles: ['质检员'],
    createdAt: '2026-06-03 11:20:00'
  },
  {
    id: 'user-4',
    username: 'warehouse01',
    realName: '王仓管',
    email: 'warehouse01@example.com',
    phone: '13800000004',
    departmentId: 'dept-4',
    status: 0 as const,
    roles: ['仓管员'],
    createdAt: '2026-06-04 13:30:00'
  }
]

export const dictTypes = [
  {
    id: 'dict-type-1',
    code: 'workOrderPriority',
    name: '工单优先级',
    description: '工单优先级字典',
    status: 'active' as const
  },
  {
    id: 'dict-type-2',
    code: 'workOrderStatus',
    name: '工单状态',
    description: '工单状态字典',
    status: 'active' as const
  },
  {
    id: 'dict-type-3',
    code: 'inspectionResult',
    name: '检验结果',
    description: '质检结果字典',
    status: 'active' as const
  }
]

export const dictItems: Record<string, any[]> = {
  workOrderPriority: [
    {
      id: 'dict-item-1',
      dictTypeCode: 'workOrderPriority',
      dictTypeId: 'dict-type-1',
      code: 'urgent',
      name: '紧急',
      sortOrder: 1,
      cssClass: 'danger',
      status: 'active'
    },
    {
      id: 'dict-item-2',
      dictTypeCode: 'workOrderPriority',
      dictTypeId: 'dict-type-1',
      code: 'high',
      name: '高',
      sortOrder: 2,
      cssClass: 'warning',
      status: 'active'
    },
    {
      id: 'dict-item-3',
      dictTypeCode: 'workOrderPriority',
      dictTypeId: 'dict-type-1',
      code: 'normal',
      name: '普通',
      sortOrder: 3,
      cssClass: '',
      status: 'active'
    }
  ],
  workOrderStatus: [
    {
      id: 'dict-item-4',
      dictTypeCode: 'workOrderStatus',
      dictTypeId: 'dict-type-2',
      code: 'draft',
      name: '草稿',
      sortOrder: 1,
      cssClass: 'info',
      status: 'active'
    },
    {
      id: 'dict-item-5',
      dictTypeCode: 'workOrderStatus',
      dictTypeId: 'dict-type-2',
      code: 'released',
      name: '已下发',
      sortOrder: 2,
      cssClass: 'primary',
      status: 'active'
    },
    {
      id: 'dict-item-6',
      dictTypeCode: 'workOrderStatus',
      dictTypeId: 'dict-type-2',
      code: 'completed',
      name: '已完成',
      sortOrder: 3,
      cssClass: 'success',
      status: 'active'
    }
  ],
  inspectionResult: [
    {
      id: 'dict-item-7',
      dictTypeCode: 'inspectionResult',
      dictTypeId: 'dict-type-3',
      code: 'qualified',
      name: '合格',
      sortOrder: 1,
      cssClass: 'success',
      status: 'active'
    },
    {
      id: 'dict-item-8',
      dictTypeCode: 'inspectionResult',
      dictTypeId: 'dict-type-3',
      code: 'return',
      name: '退货',
      sortOrder: 2,
      cssClass: 'danger',
      status: 'active'
    }
  ]
}

export const menuTree = [
  {
    id: 'menu-1',
    parentId: null,
    name: '首页',
    type: 'menu' as const,
    path: '/',
    component: 'views/home/index.vue',
    permissionCode: 'home:view',
    icon: 'House',
    sortOrder: 1,
    visible: true
  },
  {
    id: 'menu-2',
    parentId: null,
    name: '系统管理',
    type: 'directory' as const,
    path: '/system',
    component: '',
    permissionCode: 'system',
    icon: 'Setting',
    sortOrder: 2,
    visible: true,
    children: [
      {
        id: 'menu-2-1',
        parentId: 'menu-2',
        name: '用户管理',
        type: 'menu' as const,
        path: '/system/user',
        component: 'views/system/user/index.vue',
        permissionCode: 'system:user:list',
        icon: 'User',
        sortOrder: 1,
        visible: true
      },
      {
        id: 'menu-2-2',
        parentId: 'menu-2',
        name: '角色管理',
        type: 'menu' as const,
        path: '/system/role',
        component: 'views/system/role/index.vue',
        permissionCode: 'system:role:list',
        icon: 'UserFilled',
        sortOrder: 2,
        visible: true
      },
      {
        id: 'menu-2-3',
        parentId: 'menu-2',
        name: '菜单管理',
        type: 'menu' as const,
        path: '/system/menu',
        component: 'views/system/menu/index.vue',
        permissionCode: 'system:menu:list',
        icon: 'Menu',
        sortOrder: 3,
        visible: true
      }
    ]
  }
]

export const systemParams = [
  {
    id: 'param-1',
    code: 'loginLockCount',
    name: '登录失败锁定次数',
    value: '5',
    defaultValue: '5',
    description: '连续失败达到该次数后锁定账户',
    category: 'security',
    valueType: 'number' as const,
    status: 'active' as const,
    updatedAt: '2026-06-01 08:00:00',
    updatedBy: 'admin'
  },
  {
    id: 'param-2',
    code: 'tokenExpireMinutes',
    name: 'Token 有效期',
    value: '120',
    defaultValue: '120',
    description: '登录令牌有效期，单位分钟',
    category: 'security',
    valueType: 'number' as const,
    status: 'active' as const,
    updatedAt: '2026-06-01 08:00:00',
    updatedBy: 'admin'
  },
  {
    id: 'param-3',
    code: 'fileUploadMaxMb',
    name: '上传大小限制',
    value: '10',
    defaultValue: '10',
    description: '单文件最大上传大小，单位 MB',
    category: 'file',
    valueType: 'number' as const,
    status: 'active' as const,
    updatedAt: '2026-06-01 08:00:00',
    updatedBy: 'admin'
  }
]

export const auditLogs = [
  {
    id: 'audit-1',
    userName: 'admin',
    module: '用户管理',
    action: 'CREATE',
    target: '用户 planner01',
    ip: '192.168.1.10',
    requestParams: '{"username":"planner01"}',
    createdAt: '2026-06-10 09:30:00'
  },
  {
    id: 'audit-2',
    userName: 'admin',
    module: '菜单管理',
    action: 'UPDATE',
    target: '菜单 系统管理',
    ip: '192.168.1.10',
    requestParams: '{"name":"系统管理"}',
    createdAt: '2026-06-11 14:00:00'
  },
  {
    id: 'audit-3',
    userName: 'quality01',
    module: '质检管理',
    action: 'APPROVE',
    target: '检验单 IQC-001',
    ip: '192.168.1.18',
    requestParams: '{"result":"qualified"}',
    createdAt: '2026-06-12 15:10:00'
  }
]

export const codeRules = [
  { id: 'code-rule-1', code: 'workOrder', name: '工单编号', prefix: 'WO', dateFormat: 'YYYYMMDD', serialLength: 4, example: 'WO202606300001' },
  {
    id: 'code-rule-2',
    code: 'purchaseOrder',
    name: '采购订单编号',
    prefix: 'PO',
    dateFormat: 'YYYYMMDD',
    serialLength: 4,
    example: 'PO202606300001'
  },
  { id: 'code-rule-3', code: 'ecn', name: 'ECN 变更编号', prefix: 'ECN', dateFormat: 'YYYYMMDD', serialLength: 4, example: 'ECN202606300001' }
]

export const approvalFlows = [
  {
    id: 'approval-1',
    name: '普通工单审批',
    businessType: 'workOrderNormal',
    nodes: ['车间主任'],
    status: 'active' as const
  },
  {
    id: 'approval-2',
    name: '紧急工单审批',
    businessType: 'workOrderUrgent',
    nodes: ['车间主任', '生产部长'],
    status: 'active' as const
  },
  {
    id: 'approval-3',
    name: 'ECN 变更审批',
    businessType: 'ecn',
    nodes: ['研发负责人', '工艺负责人', '质量负责人'],
    status: 'disabled' as const
  }
]
