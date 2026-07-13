import type { RouteRecordRaw } from 'vue-router'

import { planned, plannedPage } from '../../helpers'

export const wmsRoute: RouteRecordRaw = {
  path: 'wms',
  name: 'wmsCollaboration',
  meta: { title: '仓储物流', icon: 'Box', order: 40, ownerSystem: 'WMS', coreObject: '库存批次 / 领料单' },
  children: [
    {
      path: 'inventory',
      name: 'wmsInventory',
      component: () => import('@/views/wms/inventory/index.vue'),
      meta: { title: '库存台账', icon: 'List', order: 1, ownerSystem: 'WMS', coreObject: '库存批次' }
    },
    {
      path: 'picking',
      name: 'wmsPicking',
      component: () => import('@/views/wms/picking/index.vue'),
      meta: {
        title: '生产领料',
        icon: 'TakeawayBox',
        order: 2,
        ownerSystem: 'WMS',
        collaboratorSystems: ['MES'],
        coreObject: '领料单',
        boundaryNote: '领料表示库存移动，不等于 MES 的实际投料与消耗。'
      }
    },
    {
      path: 'receipt',
      name: 'wmsReceipt',
      component: () => import('@/views/wms/receipt/index.vue'),
      meta: { title: '入库', icon: 'Download', order: 3 }
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
      meta: { title: '退料退货', icon: 'Refresh', order: 5 }
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
    },
    {
      path: 'backflush',
      name: 'wmsBackflush',
      component: () => import('@/views/wms/backflush/index.vue'),
      meta: {
        title: '倒冲',
        icon: 'RefreshLeft',
        order: 8,
        ownerSystem: 'WMS',
        collaboratorSystems: ['MES'],
        coreObject: '倒冲领料',
        boundaryNote: '倒冲属于库存动作确认，不应替代 MES 的消耗事实记录。'
      }
    },
    {
      path: 'barcode',
      name: 'wmsBarcode',
      component: () => import('@/views/wms/barcode/index.vue'),
      meta: { title: '批次条码', icon: 'Postcard', order: 9 }
    },
    {
      path: 'barcode-print',
      name: 'wmsBarcodePrint',
      component: () => import('@/views/wms/barcode-print/index.vue'),
      meta: { title: '条码打印', icon: 'Printer', order: 10 }
    },
    {
      path: 'barcode-scan',
      name: 'wmsBarcodeScan',
      component: () => import('@/views/wms/barcode-scan/index.vue'),
      meta: { title: '扫码作业', icon: 'Scan', order: 11 }
    },
    {
      path: 'batch-quarantine',
      name: 'wmsBatchQuarantine',
      component: plannedPage,
      meta: planned(
        '批次隔离',
        'Lock',
        12,
        '管理批次隔离、冻结放行和质量裁决联动下的库存控制。',
        ['隔离清单', '冻结 / 放行', '裁决联动', '库存控制'],
        {
          ownerSystem: 'WMS',
          collaboratorSystems: ['QMS'],
          coreObject: '库存批次隔离',
          boundaryNote: '库存隔离由 WMS 控制，质量放行或处置结论由 QMS 决策。'
        }
      )
    }
  ]
}
