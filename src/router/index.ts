import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue'),
    meta: { title: '登录', hidden: true }
  },
  {
    path: '/',
    component: () => import('@/layout/AppLayout.vue'),
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('@/views/HomeView.vue'),
        meta: { title: '首页', icon: 'House', order: 0 }
      },
      {
        path: 'system',
        name: 'system',
        meta: { title: '系统管理', icon: 'Setting', order: 10 },
        children: [
          {
            path: 'user',
            name: 'user',
            component: () => import('@/views/system/UserView.vue'),
            meta: { title: '用户管理', icon: 'User', order: 1 }
          },
          {
            path: 'role',
            name: 'role',
            component: () => import('@/views/system/RoleView.vue'),
            meta: { title: '角色管理', icon: 'UserFilled', order: 2 }
          },
          {
            path: 'menu',
            name: 'menu',
            component: () => import('@/views/system/MenuView.vue'),
            meta: { title: '菜单管理', icon: 'Menu', order: 3 }
          }
        ]
      },
      {
        path: 'analysis',
        name: 'analysis',
        meta: { title: '数据分析', icon: 'DataLine', order: 20 },
        children: [
          {
            path: 'dashboard',
            name: 'dashboard',
            component: () => import('@/views/analysis/DashboardView.vue'),
            meta: { title: '数据面板', icon: 'Histogram', order: 1 }
          },
          {
            path: 'report',
            name: 'report',
            component: () => import('@/views/analysis/ReportView.vue'),
            meta: { title: '报表管理', icon: 'Document', order: 2 }
          }
        ]
      },
      {
        path: 'settings',
        name: 'settings',

        meta: { title: '系统设置' },
        children: [
          {
            path: 'config',
            name: 'config',
            component: () => import('@/views/settings/ConfigView.vue'),
            meta: { title: '系统配置' }
          },
          {
            path: 'log',
            name: 'log',
            component: () => import('@/views/settings/LogView.vue'),
            meta: { title: '操作日志' }
          }
        ]
      },
      {
        path: 'crm',
        name: 'crm',
        meta: { title: 'CRM', icon: 'Box', order: 30 },
        children: [
          {
            path: '',
            name: 'crm-index',
            component: () => import('@/views/crm/Index.vue'),
            meta: { title: '首页', icon: 'House', order: 1 }
          }
        ]
      },
      {
        path: 'data',
        name: 'data',
        meta: { title: 'DATA', icon: 'Box', order: 40 },
        children: [
          {
            path: '',
            name: 'data-index',
            component: () => import('@/views/data/Index.vue'),
            meta: { title: '首页', icon: 'House', order: 1 }
          }
        ]
      },
      {
        path: 'ehs',
        name: 'ehs',
        meta: { title: 'EHS', icon: 'Box', order: 50 },
        children: [
          {
            path: '',
            name: 'ehs-index',
            component: () => import('@/views/ehs/Index.vue'),
            meta: { title: '首页', icon: 'House', order: 1 }
          }
        ]
      },
      {
        path: 'ems',
        name: 'ems',
        meta: { title: 'EMS', icon: 'Box', order: 60 },
        children: [
          {
            path: '',
            name: 'ems-index',
            component: () => import('@/views/ems/Index.vue'),
            meta: { title: '首页', icon: 'House', order: 1 }
          }
        ]
      },
      {
        path: 'iam',
        name: 'iam',
        meta: { title: 'IAM', icon: 'Box', order: 70 },
        children: [
          {
            path: '',
            name: 'iam-index',
            component: () => import('@/views/iam/Index.vue'),
            meta: { title: '首页', icon: 'House', order: 1 }
          }
        ]
      },
      {
        path: 'mdm',
        name: 'mdm',
        meta: { title: 'MDM', icon: 'Box', order: 80 },
        children: [
          {
            path: '',
            name: 'mdm-index',
            component: () => import('@/views/mdm/Index.vue'),
            meta: { title: '首页', icon: 'House', order: 1 }
          }
        ]
      },
      {
        path: 'mom',
        name: 'mom',
        meta: { title: 'MOM', icon: 'Box', order: 90 },
        children: [
          {
            path: '',
            name: 'mom-index',
            component: () => import('@/views/mom/Index.vue'),
            meta: { title: '首页', icon: 'House', order: 1 }
          }
        ]
      },
      {
        path: 'mp',
        name: 'mp',
        meta: { title: 'MP', icon: 'Box', order: 100 },
        children: [
          {
            path: '',
            name: 'mp-index',
            component: () => import('@/views/mp/Index.vue'),
            meta: { title: '首页', icon: 'House', order: 1 }
          }
        ]
      },
      {
        path: 'plm',
        name: 'plm',
        meta: { title: 'PLM', icon: 'Box', order: 110 },
        children: [
          {
            path: '',
            name: 'plm-index',
            component: () => import('@/views/plm/Index.vue'),
            meta: { title: '首页', icon: 'House', order: 1 }
          }
        ]
      },
      {
        path: 'qms',
        name: 'qms',
        meta: { title: 'QMS', icon: 'Box', order: 120 },
        children: [
          {
            path: '',
            name: 'qms-index',
            component: () => import('@/views/qms/Index.vue'),
            meta: { title: '首页', icon: 'House', order: 1 }
          }
        ]
      },
      {
        path: 'srm',
        name: 'srm',
        meta: { title: 'SRM', icon: 'Box', order: 130 },
        children: [
          {
            path: '',
            name: 'srm-index',
            component: () => import('@/views/srm/Index.vue'),
            meta: { title: '首页', icon: 'House', order: 1 }
          }
        ]
      },
      {
        path: 'wms',
        name: 'wms',
        meta: { title: 'WMS', icon: 'Box', order: 140 },
        children: [
          {
            path: '',
            name: 'wms-index',
            component: () => import('@/views/wms/Index.vue'),
            meta: { title: '首页', icon: 'House', order: 1 }
          }
        ]
      },
      {
        path: 'about',
        name: 'about',
        component: () => import('@/views/AboutView.vue'),
        meta: { title: '关于', hidden: true }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
