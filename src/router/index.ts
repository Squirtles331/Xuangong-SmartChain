import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

import { apsRoute } from './modules/aps'
import { biRoute } from './modules/bi'
import { crmRoute } from './modules/crm'
import { eamRoute } from './modules/eam'
import { erpRoute } from './modules/erp'
import { iotRoute } from './modules/iot'
import { mdmRoute } from './modules/mdm'
import { mesRoute } from './modules/mes'
import { plmRoute } from './modules/plm'
import { qmsRoute } from './modules/qms'
import { srmRoute } from './modules/srm'
import { sysRoute } from './modules/sys'
import { wmsRoute } from './modules/wms'

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
        meta: { title: '工作台', icon: 'House', order: 0, ownerSystem: 'PLATFORM', coreObject: '工作台' }
      },
      mesRoute,
      plmRoute,
      apsRoute,
      wmsRoute,
      qmsRoute,
      srmRoute,
      eamRoute,
      iotRoute,
      crmRoute,
      erpRoute,
      biRoute,
      sysRoute,
      mdmRoute,
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
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

import { useLockStore } from '@/stores/lock'
import { useUserStore } from '@/stores/user'

router.beforeEach((to, _from, next) => {
  const lockStore = useLockStore()
  if (lockStore.isLocked && to.path !== '/lock') return next('/lock')

  const whiteList = ['/login', '/lock']
  const userStore = useUserStore()
  const mockLogin = localStorage.getItem('mock_login')
  if (!mockLogin && !userStore.isLoggedIn && !whiteList.includes(to.path)) {
    return next('/login')
  }

  if (userStore.isLoggedIn && to.path === '/login') {
    return next('/')
  }

  next()
})

export default router
