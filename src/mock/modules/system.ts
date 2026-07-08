/**
 * System domain mock data.
 * Keep field names aligned with the frontend API contracts.
 */

interface SystemUserRecord {
  id: string
  username: string
  realName: string
  email: string
  phone: string
  departmentId: string
  status: 1 | 0
  roles: string[]
  createdAt: string
}

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

export const systemFiles = [
  {
    id: 'file-1',
    name: '离心泵装配图.pdf',
    module: 'BOM管理',
    objectType: '物料图纸',
    size: 2.5 * 1024 * 1024,
    type: 'pdf' as const,
    url: '',
    uploadedAt: '2026-06-15 09:00:00'
  },
  {
    id: 'file-2',
    name: '工单异常照片.jpg',
    module: '工单管理',
    objectType: '异常附件',
    size: 1.2 * 1024 * 1024,
    type: 'image' as const,
    url: 'https://via.placeholder.com/800x600',
    uploadedAt: '2026-06-16 10:30:00'
  },
  {
    id: 'file-3',
    name: '来料检验报告.xlsx',
    module: '质检管理',
    objectType: '检验报告',
    size: 0.5 * 1024 * 1024,
    type: 'excel' as const,
    url: '',
    uploadedAt: '2026-06-17 14:00:00'
  },
  {
    id: 'file-4',
    name: '作业指导书SOP.docx',
    module: '工艺路线',
    objectType: '操作指导',
    size: 3.1 * 1024 * 1024,
    type: 'word' as const,
    url: '',
    uploadedAt: '2026-06-18 11:00:00'
  }
]

export const notificationRules = [
  {
    id: 'notice-1',
    bizType: '工单审批',
    channel: 'wecom' as const,
    webhookUrl: 'https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=prod-001',
    status: 'active' as const
  },
  {
    id: 'notice-2',
    bizType: '工序派工',
    channel: 'dingtalk' as const,
    webhookUrl: 'https://oapi.dingtalk.com/robot/send?access_token=prod-002',
    status: 'active' as const
  },
  {
    id: 'notice-3',
    bizType: '质检通知',
    channel: 'internal' as const,
    webhookUrl: '站内消息',
    status: 'active' as const
  },
  {
    id: 'notice-4',
    bizType: '异常上报',
    channel: 'wecom' as const,
    webhookUrl: 'https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=prod-004',
    status: 'disabled' as const
  }
]

export const ssoConfigs = [
  {
    id: 'sso-1',
    name: '总部统一认证',
    protocol: 'oauth2' as const,
    url: 'https://sso.xuangong.local/auth',
    clientId: 'xgzl-web',
    clientSecret: 'secret-001',
    redirectUri: 'https://mos.xuangong.local/auth/callback',
    defaultRole: '操作工',
    enabled: true,
    status: 'online' as const,
    lastSyncAt: '2026-06-29 10:30:00'
  },
  {
    id: 'sso-2',
    name: '制造中心OIDC',
    protocol: 'oidc' as const,
    url: 'https://oidc.xuangong.local/connect/authorize',
    clientId: 'manufacture-app',
    clientSecret: 'secret-002',
    redirectUri: 'https://mes.xuangong.local/auth/callback',
    defaultRole: '车间主任',
    enabled: false,
    status: 'offline' as const,
    lastSyncAt: '2026-06-28 16:20:00'
  }
]

export const systemUsers: SystemUserRecord[] = [
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
    path: '/platform-foundation/system',
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
        path: '/platform-foundation/system/user',
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
        path: '/platform-foundation/system/role',
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
        path: '/platform-foundation/system/menu',
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

export const printTemplateCategories = [
  {
    id: 'print-cat-1',
    name: '库存管理',
    code: 'Ware',
    parentId: null,
    level: 0,
    createdBy: '超级管理员',
    createdAt: '2022-08-08 23:54:38',
    updatedBy: '超级管理员',
    updatedAt: '2023-02-10 18:28:41',
    children: [
      {
        id: 'print-cat-1-1',
        name: '出库单',
        code: 'Ware_OutWareHouseBill',
        parentId: 'print-cat-1',
        level: 1,
        createdBy: '超级管理员',
        createdAt: '2022-08-27 20:17:42',
        updatedBy: '超级管理员',
        updatedAt: '2023-04-12 17:29:31'
      },
      {
        id: 'print-cat-1-2',
        name: '入库单',
        code: 'Ware_WareHouseBill',
        parentId: 'print-cat-1',
        level: 1,
        createdBy: '超级管理员',
        createdAt: '2022-08-27 20:17:56',
        updatedBy: '超级管理员',
        updatedAt: '2023-04-12 17:29:45'
      }
    ]
  },
  {
    id: 'print-cat-2',
    name: '设备管理',
    code: 'Equip',
    parentId: null,
    level: 0,
    createdBy: '超级管理员',
    createdAt: '2022-12-07 20:21:40',
    updatedBy: '',
    updatedAt: ''
  },
  {
    id: 'print-cat-3',
    name: '生产管理',
    code: 'Production',
    parentId: null,
    level: 0,
    createdBy: '超级管理员',
    createdAt: '2022-08-08 23:53:21',
    updatedBy: '超级管理员',
    updatedAt: '2022-11-25 09:47:03',
    children: [
      {
        id: 'print-cat-3-1',
        name: '销售订单',
        code: 'Production_SaleOrder',
        parentId: 'print-cat-3',
        level: 1,
        createdBy: '超级管理员',
        createdAt: '2022-08-20 14:00:00',
        updatedBy: '超级管理员',
        updatedAt: '2023-12-02 11:25:18'
      },
      {
        id: 'print-cat-3-2',
        name: '装配工单',
        code: 'Production_AssembleWorkOrder',
        parentId: 'print-cat-3',
        level: 1,
        createdBy: '超级管理员',
        createdAt: '2022-08-20 14:10:00',
        updatedBy: '超级管理员',
        updatedAt: '2023-12-02 11:28:45'
      },
      {
        id: 'print-cat-3-3',
        name: '生产计划',
        code: 'Production_Plan',
        parentId: 'print-cat-3',
        level: 1,
        createdBy: '超级管理员',
        createdAt: '2022-08-20 14:20:00',
        updatedBy: '超级管理员',
        updatedAt: '2026-07-01 23:36:20'
      }
    ]
  }
]

export const printTemplates = [
  {
    id: 'print-tpl-1',
    categoryId: 'print-cat-3-3',
    name: '生产计划打印',
    systemBuiltin: true,
    isDefault: true,
    remark: '系统内置模板',
    templateData: {
      version: '1.0.0',
      page: { width: 210, height: 297, unit: 'mm' },
      components: []
    },
    createdBy: '超级管理员',
    createdAt: '2022-08-27 20:15:31',
    updatedBy: '超级管理员',
    updatedAt: '2026-07-01 23:36:20'
  },
  {
    id: 'print-tpl-2',
    categoryId: 'print-cat-3-2',
    name: '装配工单标签',
    systemBuiltin: false,
    isDefault: true,
    remark: '车间默认模板',
    templateData: {
      version: '1.0.0',
      page: { width: 100, height: 150, unit: 'mm' },
      components: []
    },
    createdBy: '超级管理员',
    createdAt: '2024-03-18 10:20:00',
    updatedBy: '超级管理员',
    updatedAt: '2026-06-28 18:10:00'
  },
  {
    id: 'print-tpl-3',
    categoryId: 'print-cat-1-1',
    name: '出库单标准模板',
    systemBuiltin: true,
    isDefault: true,
    remark: '标准发货单模板',
    templateData: {
      version: '1.0.0',
      page: { width: 210, height: 140, unit: 'mm' },
      components: []
    },
    createdBy: '超级管理员',
    createdAt: '2023-04-12 17:00:00',
    updatedBy: '超级管理员',
    updatedAt: '2025-11-05 09:12:00'
  }
]
