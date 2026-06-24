import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue'),
    meta: { title: '登录', hidden: true }
  },
  {
    path: '/lock',
    name: 'lock',
    component: () => import('@/views/LockView.vue'),
    meta: { title: '锁屏', hidden: true }
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
            component: () => import('@/views/system/user/index.vue'),
            meta: { title: '用户管理', icon: 'User', order: 1 }
          },
          {
            path: 'role',
            name: 'role',
            component: () => import('@/views/system/role/index.vue'),
            meta: { title: '角色管理', icon: 'UserFilled', order: 2 }
          },
          {
            path: 'menu',
            name: 'menu',
            component: () => import('@/views/system/menu/index.vue'),
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

// 锁屏守卫 + 登录守卫
import { useLockStore } from '@/stores/lock'
import { useUserStore } from '@/stores/user'

router.beforeEach((to, _from, next) => {
  // 锁屏检查
  const lockStore = useLockStore()
  if (lockStore.isLocked && to.path !== '/lock') return next('/lock')

  // 登录检查（白名单：login、lock）
  const whiteList = ['/login', '/lock']
  const userStore = useUserStore()
  if (!userStore.isLoggedIn && !whiteList.includes(to.path)) {
    return next('/login')
  }

  // 已登录用户访问登录页，重定向到首页
  if (userStore.isLoggedIn && to.path === '/login') {
    return next('/')
  }

  next()
})

export default router
