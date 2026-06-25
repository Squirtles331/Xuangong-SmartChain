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
          },
          {
            path: 'dict',
            name: 'dict',
            component: () => import('@/views/system/dict/index.vue'),
            meta: { title: '字典管理', icon: 'Notebook', order: 4 }
          },
          {
            path: 'params',
            name: 'params',
            component: () => import('@/views/system/params/index.vue'),
            meta: { title: '系统参数', icon: 'Tools', order: 5 }
          },
          {
            path: 'audit',
            name: 'audit',
            component: () => import('@/views/system/audit/index.vue'),
            meta: { title: '操作日志', icon: 'DocumentChecked', order: 6 }
          },
          {
            path: 'code-rule',
            name: 'codeRule',
            component: () => import('@/views/system/code-rule/index.vue'),
            meta: { title: '编码规则', icon: 'Stamp', order: 7 }
          },
          {
            path: 'approval',
            name: 'approval',
            component: () => import('@/views/system/approval/index.vue'),
            meta: { title: '审批流配置', icon: 'Select', order: 8 }
          },
          {
            path: 'file',
            name: 'file',
            component: () => import('@/views/system/file/index.vue'),
            meta: { title: '文件管理', icon: 'FolderOpened', order: 9 }
          }
        ]
      },
      {
        path: 'work-order',
        name: 'workOrder',
        meta: { title: '生产管理', icon: 'Monitor', order: 20 },
        children: [
          {
            path: 'list',
            name: 'workOrderList',
            component: () => import('@/views/work-order/list/index.vue'),
            meta: { title: '工单管理', icon: 'Tickets', order: 1 }
          },
          {
            path: 'create',
            name: 'workOrderCreate',
            component: () => import('@/views/work-order/create/index.vue'),
            meta: { title: '新建工单', icon: 'Plus', order: 2, hidden: true }
          },
          {
            path: ':id',
            name: 'workOrderDetail',
            component: () => import('@/views/work-order/detail/index.vue'),
            meta: { title: '工单详情', hidden: true }
          },
          {
            path: 'kanban',
            name: 'workOrderKanban',
            component: () => import('@/views/work-order/kanban/index.vue'),
            meta: { title: '车间看板', icon: 'DataBoard', order: 3 }
          },
          {
            path: 'report/:id',
            name: 'workOrderReport',
            component: () => import('@/views/work-order/report/index.vue'),
            meta: { title: '工序报工', hidden: true }
          },
          {
            path: 'my-tasks',
            name: 'workOrderMyTasks',
            component: () => import('@/views/work-order/my-tasks/index.vue'),
            meta: { title: '我的任务', icon: 'User', order: 4 }
          },
          {
            path: 'split',
            name: 'workOrderSplit',
            component: () => import('@/views/work-order/split/index.vue'),
            meta: { title: '工单拆分', hidden: true }
          },
          {
            path: 'trace',
            name: 'workOrderTrace',
            component: () => import('@/views/work-order/trace/index.vue'),
            meta: { title: '报工追溯', icon: 'Clock', order: 5 }
          }
        ]
      },
      {
        path: 'mdm',
        name: 'mdm',
        meta: { title: '主数据管理', icon: 'DataAnalysis', order: 5 },
        children: [
          {
            path: 'organization',
            name: 'mdmOrg',
            component: () => import('@/views/mdm/organization/index.vue'),
            meta: { title: '组织管理', icon: 'OfficeBuilding', order: 1 }
          },
          {
            path: 'material',
            name: 'mdmMaterial',
            component: () => import('@/views/mdm/material/index.vue'),
            meta: { title: '物料管理', icon: 'Goods', order: 2 }
          },
          {
            path: 'resource',
            name: 'mdmResource',
            component: () => import('@/views/mdm/resource/index.vue'),
            meta: { title: '制造资源', icon: 'Cpu', order: 3 }
          }
        ]
      },
      {
        path: 'scm',
        name: 'scm',
        meta: { title: '供应链管理', icon: 'ShoppingBag', order: 35 },
        children: [
          {
            path: 'supplier',
            name: 'scmSupplier',
            component: () => import('@/views/scm/supplier/index.vue'),
            meta: { title: '供应商管理', icon: 'Avatar', order: 1 }
          },
          {
            path: 'purchase-request',
            name: 'scmPR',
            component: () => import('@/views/scm/purchase-request/index.vue'),
            meta: { title: '采购申请', icon: 'Edit', order: 2 }
          },
          {
            path: 'purchase',
            name: 'scmPurchase',
            component: () => import('@/views/scm/purchase/index.vue'),
            meta: { title: '采购订单', icon: 'ShoppingCart', order: 3 }
          },
          {
            path: 'return',
            name: 'scmReturn',
            component: () => import('@/views/scm/return/index.vue'),
            meta: { title: '采购退货', icon: 'Sell', order: 4 }
          }
        ]
      },
      {
        path: 'wms',
        name: 'wms',
        meta: { title: '仓储管理', icon: 'Box', order: 36 },
        children: [
          {
            path: 'inventory',
            name: 'wmsInventory',
            component: () => import('@/views/wms/inventory/index.vue'),
            meta: { title: '库存查询', icon: 'List', order: 1 }
          },
          {
            path: 'picking',
            name: 'wmsPicking',
            component: () => import('@/views/wms/picking/index.vue'),
            meta: { title: '生产领料', icon: 'TakeawayBox', order: 2 }
          },
          {
            path: 'receipt',
            name: 'wmsReceipt',
            component: () => import('@/views/wms/receipt/index.vue'),
            meta: { title: '入库管理', icon: 'Download', order: 3 }
          },
          {
            path: 'delivery',
            name: 'wmsDelivery',
            component: () => import('@/views/wms/delivery/index.vue'),
            meta: { title: '销售出库', icon: 'Upload', order: 4 }
          },
          {
            path: 'return',
            name: 'wmsReturn',
            component: () => import('@/views/wms/return/index.vue'),
            meta: { title: '退料/退货', icon: 'Refresh', order: 5 }
          },
          {
            path: 'stock-count',
            name: 'wmsStockCount',
            component: () => import('@/views/wms/stock-count/index.vue'),
            meta: { title: '库存盘点', icon: 'Checked', order: 6 }
          },
          {
            path: 'transfer',
            name: 'wmsTransfer',
            component: () => import('@/views/wms/transfer/index.vue'),
            meta: { title: '库存调拨', icon: 'Connection', order: 7 }
          }
        ]
      },
      {
        path: 'qms',
        name: 'qms',
        meta: { title: '质量管理', icon: 'Checked', order: 37 },
        children: [
          {
            path: 'inspection',
            name: 'qmsInspection',
            component: () => import('@/views/qms/inspection/index.vue'),
            meta: { title: '质检管理', icon: 'Search', order: 1 }
          },
          {
            path: 'template',
            name: 'qmsTemplate',
            component: () => import('@/views/qms/template/index.vue'),
            meta: { title: '质检模板', icon: 'Notebook', order: 2 }
          },
          {
            path: 'supplier-quality',
            name: 'qmsSupplierQuality',
            component: () => import('@/views/qms/supplier-quality/index.vue'),
            meta: { title: '供应商质量', icon: 'TrendCharts', order: 3 }
          }
        ]
      },
      {
        path: 'bom',
        name: 'bom',
        meta: { title: '研发管理', icon: 'Collection', order: 25 },
        children: [
          {
            path: 'list',
            name: 'bomList',
            component: () => import('@/views/bom/list/index.vue'),
            meta: { title: 'BOM管理', icon: 'List', order: 1 }
          },
          { path: 'compare', name: 'bomCompare', component: () => import('@/views/bom/compare/index.vue'), meta: { title: '版本比较', icon: 'Switch', order: 2 } },
          { path: 'explode', name: 'bomExplode', component: () => import('@/views/bom/explode/index.vue'), meta: { title: '展开/反查', icon: 'Search', order: 3 } },
          { path: 'cost', name: 'bomCost', component: () => import('@/views/bom/cost/index.vue'), meta: { title: '成本卷积', icon: 'Money', order: 4 }
          },
          {
            path: 'editor/:id',
            name: 'bomEditor',
            component: () => import('@/views/bom/editor/index.vue'),
            meta: { title: 'BOM编辑器', hidden: true }
          },
          { path: 'create', name: 'bomCreate', component: () => import('@/views/bom/editor/index.vue'), meta: { title: '新建BOM', hidden: true } }
        ]
      },
      {
        path: 'routing',
        name: 'routing',
        meta: { title: '工艺路线', icon: 'Connection', order: 26, hidden: true },
        children: [
          { path: 'editor/:id', name: 'routingEditor', component: () => import('@/views/routing/editor/index.vue'), meta: { title: '工艺路线编辑' } }
        ]
      },
      {
        path: 'ecn',
        name: 'ecn',
        meta: { title: '变更管理', icon: 'Switch', order: 27 },
        children: [
          {
            path: 'list',
            name: 'ecnList',
            component: () => import('@/views/ecn/list/index.vue'),
            meta: { title: 'ECN变更', icon: 'Switch', order: 1 }
          }
        ]
      },
      {
        path: 'crm',
        name: 'crm',
        meta: { title: '营销中心', icon: 'ShoppingCart', order: 30 },
        children: [
          {
            path: 'customer',
            name: 'crmCustomer',
            component: () => import('@/views/crm/customer/index.vue'),
            meta: { title: '客户管理', icon: 'User', order: 1 }
          },
          {
            path: 'order',
            name: 'crmOrder',
            component: () => import('@/views/crm/order/index.vue'),
            meta: { title: '销售订单', icon: 'Document', order: 2 }
          },
          {
            path: 'receivable',
            name: 'crmReceivable',
            component: () => import('@/views/crm/receivable/index.vue'),
            meta: { title: '应收台账', icon: 'Money', order: 3 }
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
        path: 'aps',
        name: 'aps',
        meta: { title: 'APS排程', icon: 'Timer', order: 40 },
        children: [
          {
            path: 'schedule',
            name: 'apsSchedule',
            component: () => import('@/views/aps/schedule/index.vue'),
            meta: { title: '排程管理', icon: 'Timer', order: 1 }
          }
        ]
      },
      {
        path: 'mrp',
        name: 'mrp',
        meta: { title: 'MRP运算', icon: 'Operation', order: 45 },
        children: [
          {
            path: 'result',
            name: 'mrpResult',
            component: () => import('@/views/mrp/result/index.vue'),
            meta: { title: 'MRP结果', icon: 'Operation', order: 1 }
          },
          {
            path: 'history',
            name: 'mrpHistory',
            component: () => import('@/views/mrp/history/index.vue'),
            meta: { title: '运行历史', icon: 'Clock', order: 2 }
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
        path: 'equipment',
        name: 'equipment',
        meta: { title: '设备中心', icon: 'Cpu', order: 50 },
        children: [
          {
            path: 'list',
            name: 'equipmentList',
            component: () => import('@/views/equipment/list/index.vue'),
            meta: { title: '设备台账', icon: 'Monitor', order: 1 }
          },
          {
            path: 'check',
            name: 'equipmentCheck',
            component: () => import('@/views/equipment/check/index.vue'),
            meta: { title: '点检管理', icon: 'Checked', order: 2 }
          },
          {
            path: 'maintain',
            name: 'equipmentMaintain',
            component: () => import('@/views/equipment/maintain/index.vue'),
            meta: { title: '保养管理', icon: 'SetUp', order: 3 }
          }
        ]
      },
      {
        path: 'iot',
        name: 'iot',
        meta: { title: 'IoT中心', icon: 'Connection', order: 55 },
        children: [
          {
            path: 'monitor',
            name: 'iotMonitor',
            component: () => import('@/views/iot/monitor/index.vue'),
            meta: { title: '设备监控', icon: 'Monitor', order: 1 }
          }
        ]
      },
      {
        path: 'energy',
        name: 'energy',
        meta: { title: '能源中心', icon: 'TrendCharts', order: 60 },
        children: [
          {
            path: 'overview',
            name: 'energyOverview',
            component: () => import('@/views/energy/overview/index.vue'),
            meta: { title: '能耗概览', icon: 'DataLine', order: 1 }
          }
        ]
      },
      {
        path: 'ehs',
        name: 'ehs',
        meta: { title: '安环中心', icon: 'Warning', order: 65 },
        children: [
          {
            path: 'index',
            name: 'ehsIndex',
            component: () => import('@/views/ehs/index/index.vue'),
            meta: { title: '安全管理', icon: 'Warning', order: 1 }
          }
        ]
      },
      {
        path: 'hr',
        name: 'hr',
        meta: { title: '人资中心', icon: 'User', order: 70 },
        children: [
          {
            path: 'index',
            name: 'hrIndex',
            component: () => import('@/views/hr/index/index.vue'),
            meta: { title: '人资管理', icon: 'User', order: 1 }
          }
        ]
      },
      {
        path: 'finance',
        name: 'finance',
        meta: { title: '财务中心', icon: 'Money', order: 75 },
        children: [
          {
            path: 'index',
            name: 'financeIndex',
            component: () => import('@/views/finance/index/index.vue'),
            meta: { title: '财务管理', icon: 'Money', order: 1 }
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

  // 登录检查（开发模式下 Mock 登录可绕过）
  const whiteList = ['/login', '/lock']
  const userStore = useUserStore()
  // 开发模式：如果 localStorage 有 mock_login 标记，跳过登录检查
  const mockLogin = localStorage.getItem('mock_login')
  if (!mockLogin && !userStore.isLoggedIn && !whiteList.includes(to.path)) {
    return next('/login')
  }

  // 已登录用户访问登录页，重定向到首页
  if (userStore.isLoggedIn && to.path === '/login') {
    return next('/')
  }

  next()
})

export default router
