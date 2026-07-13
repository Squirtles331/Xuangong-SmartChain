import type { RouteRecordRaw } from 'vue-router'

export const sysRoute: RouteRecordRaw = {
  path: 'sys',
  name: 'platformSystem',
  meta: {
    title: '系统平台',
    icon: 'Setting',
    order: 120,
    ownerSystem: 'SYS',
    coreObject: '系统平台与基础配置'
  },
  children: [
    {
      path: 'user',
      name: 'user',
      component: () => import('@/views/sys/user/index.vue'),
      meta: { title: '用户管理', icon: 'User', order: 1 }
    },
    {
      path: 'role',
      name: 'role',
      component: () => import('@/views/sys/role/index.vue'),
      meta: { title: '角色管理', icon: 'UserFilled', order: 2 }
    },
    {
      path: 'menu',
      name: 'menu',
      component: () => import('@/views/sys/menu/index.vue'),
      meta: { title: '菜单管理', icon: 'Menu', order: 3 }
    },
    {
      path: 'dict',
      name: 'dict',
      component: () => import('@/views/sys/dict/index.vue'),
      meta: { title: '数据字典', icon: 'Notebook', order: 4 }
    },
    {
      path: 'params',
      name: 'params',
      component: () => import('@/views/sys/params/index.vue'),
      meta: { title: '参数配置', icon: 'Tools', order: 5 }
    },
    {
      path: 'audit',
      name: 'audit',
      component: () => import('@/views/sys/audit/index.vue'),
      meta: { title: '操作日志', icon: 'DocumentChecked', order: 6 }
    },
    {
      path: 'code-rule',
      name: 'codeRule',
      component: () => import('@/views/sys/code-rule/index.vue'),
      meta: { title: '编码规则', icon: 'Stamp', order: 7 }
    },
    {
      path: 'approval',
      name: 'approval',
      component: () => import('@/views/sys/approval/index.vue'),
      meta: { title: '审批流程', icon: 'Select', order: 8 }
    },
    {
      path: 'file',
      name: 'file',
      component: () => import('@/views/sys/file/index.vue'),
      meta: { title: '文件中心', icon: 'FolderOpened', order: 9 }
    },
    {
      path: 'notification',
      name: 'systemNotification',
      component: () => import('@/views/sys/notification/index.vue'),
      meta: { title: '通知中心', icon: 'Bell', order: 10 }
    },
    {
      path: 'sso',
      name: 'systemSSO',
      component: () => import('@/views/sys/sso/index.vue'),
      meta: { title: '单点登录', icon: 'Key', order: 11 }
    },
    {
      path: 'print-template',
      redirect: { name: 'printTemplate' },
      meta: { title: '打印配置', icon: 'Printer', order: 12 },
      children: [
        {
          path: 'list',
          name: 'printTemplate',
          component: () => import('@/views/sys/print-template/index.vue'),
          meta: { title: '打印模板', icon: 'Printer', order: 1 }
        },
        {
          path: 'templates/:categoryId?',
          name: 'printTemplateSettings',
          component: () => import('@/views/sys/print-template/template-list.vue'),
          meta: { title: '模板参数设置', icon: 'Setting', order: 2 }
        },
        {
          path: 'designer/:id',
          name: 'printTemplateDesigner',
          component: () => import('@/views/sys/print-template/designer.vue'),
          meta: { title: '模板设计器', hidden: true, activeMenu: '/sys/print-template/list' }
        }
      ]
    },
    {
      path: 'config',
      name: 'config',
      component: () => import('@/views/sys/settings/ConfigView.vue'),
      meta: { title: '平台设置', icon: 'Tools', order: 13 }
    },
    {
      path: 'log',
      name: 'log',
      component: () => import('@/views/sys/settings/LogView.vue'),
      meta: { title: '设置日志', icon: 'DocumentChecked', order: 14 }
    }
  ]
}
