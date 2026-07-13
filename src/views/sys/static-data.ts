import { ref } from 'vue'

import type {
  ApprovalFlow,
  AuditLog,
  CodeRule,
  DictItem,
  DictType,
  NotificationRule,
  PrintTemplate,
  PrintTemplateCategory,
  SsoConfig,
  SysMenu,
  SysRole,
  SystemFile,
  SystemParam
} from '@/api/system'

export const sysRoleRecords = ref<SysRole[]>([
  {
    id: 'ROLE-001',
    code: 'platform_admin',
    name: '平台管理员',
    description: '负责平台账户、菜单、参数与基础配置维护',
    status: 'active',
    permissionIds: ['menu:user', 'menu:role', 'menu:menu', 'menu:params'],
    userCount: 3
  },
  {
    id: 'ROLE-002',
    code: 'plan_manager',
    name: '计划主管',
    description: '负责主计划、APS 协同与跨域任务推进',
    status: 'active',
    permissionIds: ['mes:work-order', 'aps:schedule', 'erp:mrp'],
    userCount: 8
  },
  {
    id: 'ROLE-003',
    code: 'quality_engineer',
    name: '质量工程师',
    description: '负责检验放行、异常处置与质量协同',
    status: 'active',
    permissionIds: ['qms:inspection', 'mes:exception', 'sys:approval'],
    userCount: 5
  },
  {
    id: 'ROLE-004',
    code: 'warehouse_operator',
    name: '仓储专员',
    description: '负责收货、上架、拣配与库存事务执行',
    status: 'disabled',
    permissionIds: ['wms:receipt', 'wms:picking', 'wms:inventory'],
    userCount: 4
  }
])

export const sysMenuRecords = ref<SysMenu[]>([
  {
    id: 'MENU-001',
    parentId: null,
    name: '系统平台',
    type: 'directory',
    path: '/sys',
    component: '@/layout/AppLayout.vue',
    permissionCode: 'sys',
    icon: 'Setting',
    sortOrder: 1,
    visible: true
  },
  {
    id: 'MENU-002',
    parentId: 'MENU-001',
    name: '权限中心',
    type: 'directory',
    path: '/sys/auth',
    component: '',
    permissionCode: 'sys.auth',
    icon: 'UserFilled',
    sortOrder: 1,
    visible: true
  },
  {
    id: 'MENU-003',
    parentId: 'MENU-002',
    name: '用户管理',
    type: 'menu',
    path: '/sys/user',
    component: '@/views/sys/user/index.vue',
    permissionCode: 'sys.user.view',
    icon: 'User',
    sortOrder: 1,
    visible: true
  },
  {
    id: 'MENU-004',
    parentId: 'MENU-002',
    name: '角色管理',
    type: 'menu',
    path: '/sys/role',
    component: '@/views/sys/role/index.vue',
    permissionCode: 'sys.role.view',
    icon: 'Avatar',
    sortOrder: 2,
    visible: true
  },
  {
    id: 'MENU-005',
    parentId: 'MENU-001',
    name: '配置中心',
    type: 'directory',
    path: '/sys/configuration',
    component: '',
    permissionCode: 'sys.configuration',
    icon: 'Tools',
    sortOrder: 2,
    visible: true
  },
  {
    id: 'MENU-006',
    parentId: 'MENU-005',
    name: '菜单管理',
    type: 'menu',
    path: '/sys/menu',
    component: '@/views/sys/menu/index.vue',
    permissionCode: 'sys.menu.view',
    icon: 'Menu',
    sortOrder: 1,
    visible: true
  },
  {
    id: 'MENU-007',
    parentId: 'MENU-005',
    name: '数据字典',
    type: 'menu',
    path: '/sys/dict',
    component: '@/views/sys/dict/index.vue',
    permissionCode: 'sys.dict.view',
    icon: 'Notebook',
    sortOrder: 2,
    visible: true
  },
  {
    id: 'MENU-008',
    parentId: 'MENU-005',
    name: '参数配置',
    type: 'menu',
    path: '/sys/params',
    component: '@/views/sys/params/index.vue',
    permissionCode: 'sys.params.view',
    icon: 'Operation',
    sortOrder: 3,
    visible: true
  },
  {
    id: 'MENU-009',
    parentId: 'MENU-005',
    name: '审批流配置',
    type: 'menu',
    path: '/sys/approval',
    component: '@/views/sys/approval/index.vue',
    permissionCode: 'sys.approval.view',
    icon: 'Select',
    sortOrder: 4,
    visible: true
  },
  {
    id: 'MENU-010',
    parentId: 'MENU-001',
    name: '审计与运维',
    type: 'directory',
    path: '/sys/governance',
    component: '',
    permissionCode: 'sys.governance',
    icon: 'DocumentChecked',
    sortOrder: 3,
    visible: true
  },
  {
    id: 'MENU-011',
    parentId: 'MENU-010',
    name: '平台设置',
    type: 'menu',
    path: '/sys/config',
    component: '@/views/sys/settings/ConfigView.vue',
    permissionCode: 'sys.config.view',
    icon: 'Tools',
    sortOrder: 1,
    visible: true
  },
  {
    id: 'MENU-012',
    parentId: 'MENU-010',
    name: '设置日志',
    type: 'menu',
    path: '/sys/log',
    component: '@/views/sys/settings/LogView.vue',
    permissionCode: 'sys.log.view',
    icon: 'Document',
    sortOrder: 2,
    visible: true
  },
  {
    id: 'MENU-013',
    parentId: 'MENU-006',
    name: '保存菜单',
    type: 'button',
    path: '',
    component: '',
    permissionCode: 'sys.menu.save',
    icon: '',
    sortOrder: 1,
    visible: true
  }
])

export const sysDictTypeRecords = ref<DictType[]>([
  {
    id: 'DICT-TYPE-001',
    code: 'work_order_priority',
    name: '工单优先级',
    description: '用于工单与异常任务优先级展示',
    status: 'active'
  },
  {
    id: 'DICT-TYPE-002',
    code: 'inspection_result',
    name: '检验结果',
    description: '用于 IQC/IPQC/OQC 检验结果表达',
    status: 'active'
  },
  {
    id: 'DICT-TYPE-003',
    code: 'exception_level',
    name: '异常等级',
    description: '用于执行异常与质量异常分级',
    status: 'disabled'
  }
])

export const sysDictItemRecords = ref<Record<string, DictItem[]>>({
  work_order_priority: [
    {
      id: 'DICT-ITEM-001',
      dictTypeCode: 'work_order_priority',
      dictTypeId: 'DICT-TYPE-001',
      code: 'normal',
      name: '普通',
      sortOrder: 1,
      cssClass: 'info',
      status: 'active'
    },
    {
      id: 'DICT-ITEM-002',
      dictTypeCode: 'work_order_priority',
      dictTypeId: 'DICT-TYPE-001',
      code: 'urgent',
      name: '紧急',
      sortOrder: 2,
      cssClass: 'warning',
      status: 'active'
    },
    {
      id: 'DICT-ITEM-003',
      dictTypeCode: 'work_order_priority',
      dictTypeId: 'DICT-TYPE-001',
      code: 'critical',
      name: '特急',
      sortOrder: 3,
      cssClass: 'danger',
      status: 'active'
    }
  ],
  inspection_result: [
    {
      id: 'DICT-ITEM-004',
      dictTypeCode: 'inspection_result',
      dictTypeId: 'DICT-TYPE-002',
      code: 'pass',
      name: '合格',
      sortOrder: 1,
      cssClass: 'success',
      status: 'active'
    },
    {
      id: 'DICT-ITEM-005',
      dictTypeCode: 'inspection_result',
      dictTypeId: 'DICT-TYPE-002',
      code: 'hold',
      name: '待判',
      sortOrder: 2,
      cssClass: 'warning',
      status: 'active'
    },
    {
      id: 'DICT-ITEM-006',
      dictTypeCode: 'inspection_result',
      dictTypeId: 'DICT-TYPE-002',
      code: 'reject',
      name: '不合格',
      sortOrder: 3,
      cssClass: 'danger',
      status: 'active'
    }
  ],
  exception_level: [
    {
      id: 'DICT-ITEM-007',
      dictTypeCode: 'exception_level',
      dictTypeId: 'DICT-TYPE-003',
      code: 'L1',
      name: '一级',
      sortOrder: 1,
      cssClass: 'info',
      status: 'active'
    },
    {
      id: 'DICT-ITEM-008',
      dictTypeCode: 'exception_level',
      dictTypeId: 'DICT-TYPE-003',
      code: 'L2',
      name: '二级',
      sortOrder: 2,
      cssClass: 'warning',
      status: 'active'
    }
  ]
})

export const sysApprovalFlowRecords = ref<ApprovalFlow[]>([
  {
    id: 'FLOW-001',
    name: '普通工单审批流',
    businessType: 'workOrderNormal',
    nodes: ['车间主管', '制造经理'],
    status: 'active'
  },
  {
    id: 'FLOW-002',
    name: 'BOM 变更审批流',
    businessType: 'bomRouting',
    nodes: ['工艺工程师', 'PLM 负责人', '制造经理'],
    status: 'active'
  },
  {
    id: 'FLOW-003',
    name: '采购订单放行流',
    businessType: 'purchaseOrder',
    nodes: ['采购主管', '供应链经理'],
    status: 'disabled'
  }
])

export const sysSystemParamRecords = ref<SystemParam[]>([
  {
    id: 'PARAM-001',
    code: 'loginLockCount',
    name: '登录失败锁定次数',
    value: '5',
    defaultValue: '5',
    description: '连续失败达到指定次数后锁定账号',
    category: 'auth',
    valueType: 'number',
    status: 'active',
    updatedAt: '2026-07-12 09:10',
    updatedBy: '平台管理员'
  },
  {
    id: 'PARAM-002',
    code: 'tokenExpireMinutes',
    name: 'Token 有效期',
    value: '120',
    defaultValue: '120',
    description: '登录令牌有效时长，单位分钟',
    category: 'security',
    valueType: 'number',
    status: 'active',
    updatedAt: '2026-07-12 10:30',
    updatedBy: '平台管理员'
  },
  {
    id: 'PARAM-003',
    code: 'mes.reportTimeoutMinutes',
    name: '报工超时阈值',
    value: '30',
    defaultValue: '20',
    description: '报工长时间未完成时进入异常跟踪池',
    category: 'production',
    valueType: 'number',
    status: 'active',
    updatedAt: '2026-07-11 18:00',
    updatedBy: '制造主管'
  },
  {
    id: 'PARAM-004',
    code: 'fileUploadMaxMb',
    name: '上传大小限制',
    value: '50',
    defaultValue: '20',
    description: '单个文件允许上传的最大大小',
    category: 'file',
    valueType: 'number',
    status: 'disabled',
    updatedAt: '2026-07-10 16:20',
    updatedBy: '系统配置员'
  }
])

export const sysAuditLogRecords = ref<AuditLog[]>([
  {
    id: 'AUDIT-001',
    userName: 'admin',
    module: '系统管理',
    action: 'LOGIN',
    target: 'user:admin',
    ip: '10.10.1.10',
    requestParams: '{"tenant":"玄工智链示范工厂","result":"success"}',
    createdAt: '2026-07-13 08:20:00'
  },
  {
    id: 'AUDIT-002',
    userName: 'plan.zhang',
    module: '菜单管理',
    action: 'UPDATE',
    target: 'menu:system',
    ip: '10.10.1.26',
    requestParams: '{"name":"系统平台","visible":true}',
    createdAt: '2026-07-13 09:05:00'
  },
  {
    id: 'AUDIT-003',
    userName: 'qms.wang',
    module: '审批流配置',
    action: 'APPROVE',
    target: 'flow:FLOW-002',
    ip: '10.10.1.42',
    requestParams: '{"flow":"BOM 变更审批流","status":"active"}',
    createdAt: '2026-07-12 15:12:00'
  },
  {
    id: 'AUDIT-004',
    userName: 'warehouse.zhao',
    module: '参数配置',
    action: 'CREATE',
    target: 'param:fileUploadMaxMb',
    ip: '10.10.1.57',
    requestParams: '{"code":"fileUploadMaxMb","value":"50"}',
    createdAt: '2026-07-12 11:30:00'
  },
  {
    id: 'AUDIT-005',
    userName: 'admin',
    module: '角色管理',
    action: 'DELETE',
    target: 'role:warehouse_operator',
    ip: '10.10.1.10',
    requestParams: '{"code":"warehouse_operator"}',
    createdAt: '2026-07-11 18:42:00'
  }
])

export const sysCodeRuleRecords = ref<CodeRule[]>([
  {
    id: 'RULE-001',
    code: 'WORK_ORDER',
    name: '工单编码规则',
    prefix: 'MO',
    dateFormat: 'YYYYMMDD',
    serialLength: 4,
    example: 'MO202607130001'
  },
  {
    id: 'RULE-002',
    code: 'PURCHASE_ORDER',
    name: '采购订单编码规则',
    prefix: 'PO',
    dateFormat: 'YYYYMMDD',
    serialLength: 5,
    example: 'PO2026071300001'
  },
  {
    id: 'RULE-003',
    code: 'INSPECTION_LOT',
    name: '检验批编码规则',
    prefix: 'IQC',
    dateFormat: 'YYMMDD',
    serialLength: 4,
    example: 'IQC2607130001'
  }
])

export const sysFileRecords = ref<SystemFile[]>([
  {
    id: 'FILE-001',
    name: 'MES生产报工模板.xlsx',
    module: 'MES',
    objectType: '导入模板',
    size: 245760,
    type: 'excel',
    url: '/static/files/mes-report-template.xlsx',
    uploadedAt: '2026-07-13 09:20'
  },
  {
    id: 'FILE-002',
    name: 'QMS来料检验规范.pdf',
    module: 'QMS',
    objectType: '质量文档',
    size: 1843200,
    type: 'pdf',
    url: '/static/files/qms-iqc-standard.pdf',
    uploadedAt: '2026-07-12 16:05'
  },
  {
    id: 'FILE-003',
    name: '设备点检照片-冲压线A.png',
    module: 'EAM',
    objectType: '现场附件',
    size: 524288,
    type: 'image',
    url: '/static/files/eam-inspection-line-a.png',
    uploadedAt: '2026-07-12 11:48'
  },
  {
    id: 'FILE-004',
    name: '仓储上架作业指引.docx',
    module: 'WMS',
    objectType: '作业指导',
    size: 132096,
    type: 'word',
    url: '/static/files/wms-putaway-guide.docx',
    uploadedAt: '2026-07-11 14:30'
  }
])

export const sysNotificationRuleRecords = ref<NotificationRule[]>([
  {
    id: 'NOTICE-001',
    bizType: '工单审批',
    channel: 'wecom',
    webhookUrl: 'https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=work-order',
    status: 'active'
  },
  {
    id: 'NOTICE-002',
    bizType: '质量放行',
    channel: 'dingtalk',
    webhookUrl: 'https://oapi.dingtalk.com/robot/send?access_token=qms-release',
    status: 'active'
  },
  {
    id: 'NOTICE-003',
    bizType: '设备异常',
    channel: 'internal',
    webhookUrl: '站内消息中心',
    status: 'disabled'
  }
])

export const sysSsoConfigRecords = ref<SsoConfig[]>([
  {
    id: 'SSO-001',
    name: '企业微信统一认证',
    protocol: 'oauth2',
    url: 'https://open.work.weixin.qq.com/wwopen/sso/qrConnect',
    clientId: 'wx-enterprise-portal',
    clientSecret: '******',
    redirectUri: 'https://portal.xuangong.local/auth/callback/wecom',
    defaultRole: '普通员工',
    enabled: true,
    status: 'online',
    lastSyncAt: '2026-07-13 08:30'
  },
  {
    id: 'SSO-002',
    name: '集团OIDC门户',
    protocol: 'oidc',
    url: 'https://iam.group.local/oidc',
    clientId: 'xgzl-portal',
    clientSecret: '******',
    redirectUri: 'https://portal.xuangong.local/auth/callback/oidc',
    defaultRole: '集团访客',
    enabled: true,
    status: 'online',
    lastSyncAt: '2026-07-13 07:55'
  },
  {
    id: 'SSO-003',
    name: '车间域控LDAP',
    protocol: 'ldap',
    url: 'ldap://10.10.20.18:389',
    clientId: 'workshop-domain',
    clientSecret: '',
    redirectUri: '',
    defaultRole: '车间操作员',
    enabled: false,
    status: 'offline',
    lastSyncAt: '2026-07-10 19:20'
  }
])

export const sysPrintTemplateCategoryRecords = ref<PrintTemplateCategory[]>([
  {
    id: 'PTC-001',
    name: '生产执行',
    code: 'MES',
    parentId: null,
    level: 1,
    createdBy: '平台管理员',
    createdAt: '2026-07-05 09:10',
    updatedBy: '平台管理员',
    updatedAt: '2026-07-12 16:30'
  },
  {
    id: 'PTC-002',
    name: '工单与报工',
    code: 'MES-WO',
    parentId: 'PTC-001',
    level: 2,
    createdBy: 'MES实施顾问',
    createdAt: '2026-07-05 11:20',
    updatedBy: 'MES实施顾问',
    updatedAt: '2026-07-11 18:05'
  },
  {
    id: 'PTC-003',
    name: '质量检验',
    code: 'QMS',
    parentId: null,
    level: 1,
    createdBy: '质量经理',
    createdAt: '2026-07-06 10:00',
    updatedBy: '质量经理',
    updatedAt: '2026-07-12 09:40'
  },
  {
    id: 'PTC-004',
    name: '采购协同',
    code: 'SRM',
    parentId: null,
    level: 1,
    createdBy: '供应链经理',
    createdAt: '2026-07-06 15:18',
    updatedBy: '供应链经理',
    updatedAt: '2026-07-11 15:26'
  }
])

export const sysPrintTemplateRecords = ref<PrintTemplate[]>([
  {
    id: 'PT-001',
    categoryId: 'PTC-002',
    categoryName: '工单与报工',
    name: '生产工单派工单',
    systemBuiltin: true,
    isDefault: true,
    remark: '用于车间派工、报工联动打印。',
    templateData: {
      version: 'static-demo',
      title: '生产工单派工单',
      blocks: ['header', 'work-order-info', 'routing', 'footer']
    },
    createdBy: 'MES实施顾问',
    createdAt: '2026-07-07 09:30',
    updatedBy: 'MES实施顾问',
    updatedAt: '2026-07-12 18:20'
  },
  {
    id: 'PT-002',
    categoryId: 'PTC-003',
    categoryName: '质量检验',
    name: '来料检验报告单',
    systemBuiltin: true,
    isDefault: true,
    remark: '用于IQC检验结果归档打印。',
    templateData: {
      version: 'static-demo',
      title: '来料检验报告单',
      blocks: ['header', 'supplier', 'inspection-items', 'signature']
    },
    createdBy: '质量经理',
    createdAt: '2026-07-07 13:20',
    updatedBy: '质量经理',
    updatedAt: '2026-07-12 14:35'
  },
  {
    id: 'PT-003',
    categoryId: 'PTC-004',
    categoryName: '采购协同',
    name: '采购送货通知单',
    systemBuiltin: false,
    isDefault: false,
    remark: '用于供应商送货预约与收货确认。',
    templateData: {
      version: 'static-demo',
      title: '采购送货通知单',
      blocks: ['header', 'supplier', 'delivery-lines', 'sign-off']
    },
    createdBy: '供应链经理',
    createdAt: '2026-07-08 10:15',
    updatedBy: '平台管理员',
    updatedAt: '2026-07-11 17:00'
  }
])

export function buildPrintTemplateCategoryTree(records = sysPrintTemplateCategoryRecords.value) {
  const nodeMap = new Map<string, PrintTemplateCategory>()
  const roots: PrintTemplateCategory[] = []

  records.forEach((record) => {
    nodeMap.set(record.id, { ...record, children: [] })
  })

  nodeMap.forEach((node) => {
    if (!node.parentId) {
      roots.push(node)
      return
    }

    const parent = nodeMap.get(node.parentId)
    if (parent) {
      parent.children = [...(parent.children || []), node]
    } else {
      roots.push(node)
    }
  })

  return roots
}

export function buildPrintTemplateCategoryRows(records = sysPrintTemplateCategoryRecords.value) {
  const nameMap = new Map(records.map((record) => [record.id, record.name]))
  return records.map((record) => ({
    ...record,
    parentName: record.parentId ? nameMap.get(record.parentId) || '-' : '-'
  }))
}

export function getPrintTemplateCategoryName(categoryId: string) {
  return sysPrintTemplateCategoryRecords.value.find((record) => record.id === categoryId)?.name || ''
}

export function buildMenuTree(records = sysMenuRecords.value) {
  const nodeMap = new Map<string, SysMenu>()
  const roots: SysMenu[] = []

  records
    .slice()
    .sort((left, right) => left.sortOrder - right.sortOrder)
    .forEach((record) => {
      nodeMap.set(record.id, { ...record, children: [] })
    })

  nodeMap.forEach((node) => {
    if (!node.parentId) {
      roots.push(node)
      return
    }

    const parent = nodeMap.get(node.parentId)
    if (parent) {
      parent.children = [...(parent.children || []), node]
    } else {
      roots.push(node)
    }
  })

  return roots
}

export function buildMenuRows(records = sysMenuRecords.value) {
  const nameMap = new Map(records.map((record) => [record.id, record.name]))
  return records
    .slice()
    .sort((left, right) => left.sortOrder - right.sortOrder)
    .map((record) => ({
      ...record,
      parentName: record.parentId ? nameMap.get(record.parentId) || '-' : '根节点'
    }))
}
