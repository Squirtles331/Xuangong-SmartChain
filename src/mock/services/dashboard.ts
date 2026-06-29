import { mrpExceptions } from '../modules/mrp'
import { inspectionTasks } from '../modules/qms'
import { iotAlertHistory, iotDevices } from '../modules/wms'
import { inventory } from '../modules/wms'
import { workOrders } from '../modules/work-order'
import { simulateDelay } from '../shared/delay'
import { wrapDetailResponse } from '../shared/response'

export async function getDashboardStats() {
  await simulateDelay(300, 600)

  const totalWorkOrders = workOrders.length
  const activeWorkOrders = (workOrders as any[]).filter((wo: any) => ['approved', 'released', 'in_progress'].includes(wo.status)).length
  const completedWorkOrders = (workOrders as any[]).filter((wo: any) => wo.status === 'completed').length
  const urgentWorkOrders = (workOrders as any[]).filter((wo: any) => wo.priority === 'urgent').length

  const totalInspections = inspectionTasks.length
  const pendingInspections = (inspectionTasks as any[]).filter((task: any) => task.status === 'pending').length
  const doneInspections = (inspectionTasks as any[]).filter((task: any) => task.status === 'done').length

  const totalStockItems = inventory.length
  const lowStockItems = (inventory as any[]).filter((item: any) => item.available < item.safety).length
  const totalStockQty = (inventory as any[]).reduce((sum: number, item: any) => sum + (item.qty || 0), 0)

  const severeExceptions = mrpExceptions.filter((item: any) => item.level === 'severe').length
  const warningExceptions = mrpExceptions.filter((item: any) => item.level === 'warning').length

  const totalDevices = iotDevices.length
  const runningDevices = iotDevices.filter((item: any) => item.status === 'running').length
  const idleDevices = iotDevices.filter((item: any) => item.status === 'idle').length
  const maintenanceDevices = iotDevices.filter((item: any) => item.status === 'maintenance').length

  const todayOutput = 125
  const planCompletionRate = totalWorkOrders > 0 ? Math.round((completedWorkOrders / totalWorkOrders) * 100) : 0
  const inspectionPassRate = totalInspections > 0 ? Math.round((doneInspections / totalInspections) * 100) : 0

  return wrapDetailResponse({
    revenue: 850,
    revenue_trend: 12.5,
    active_orders: activeWorkOrders,
    orders_trend: -5.2,
    oee: 78.5,
    oee_trend: 3.1,
    delivery_rate: 94.2,
    delivery_trend: 1.8,
    top_products: [
      { material: '离心泵 XJP-100', qty: 182 },
      { material: '齿轮箱 GBX-200', qty: 156 },
      { material: '传动轴 DS-50', qty: 121 },
      { material: '阀门组件 VL-300', qty: 96 }
    ],
    totalWorkOrders,
    activeWorkOrders,
    completedWorkOrders,
    urgentWorkOrders,
    planCompletionRate,
    totalInspections,
    pendingInspections,
    doneInspections,
    inspectionPassRate,
    totalStockItems,
    lowStockItems,
    totalStockQty,
    severeExceptions,
    warningExceptions,
    totalDevices,
    runningDevices,
    idleDevices,
    maintenanceDevices,
    todayOutput
  })
}

export async function getHomeCharts() {
  await simulateDelay(400, 700)

  const outputTrend = []
  for (let offset = 6; offset >= 0; offset -= 1) {
    const current = new Date()
    current.setDate(current.getDate() - offset)
    outputTrend.push({
      date: current.toISOString().slice(0, 10),
      planned: Math.floor(Math.random() * 30) + 80,
      actual: Math.floor(Math.random() * 30) + 75
    })
  }

  const stockAlertTop5 = (inventory as any[])
    .filter((item: any) => item.available < item.safety)
    .slice(0, 5)
    .map((item: any) => ({
      code: item.code,
      name: item.name,
      available: item.available,
      safety: item.safety,
      gap: item.safety - item.available
    }))

  return wrapDetailResponse({
    trend: {
      months: ['7月', '8月', '9月', '10月', '11月', '12月', '1月'],
      revenue: [680, 720, 780, 750, 820, 800, 850],
      cost: [520, 550, 580, 570, 600, 590, 620],
      profit: [160, 170, 200, 180, 220, 210, 230]
    },
    order_status: [
      { value: 12, name: '已下发' },
      { value: 28, name: '生产中' },
      { value: 8, name: '已完工' },
      { value: 5, name: '待审批' },
      { value: 3, name: '已关闭' }
    ],
    capacity: {
      legend: ['一车间', '二车间', '装配车间'],
      days: ['周一', '周二', '周三', '周四', '周五', '周六'],
      series: [
        { name: '一车间', data: [85, 88, 82, 90, 86, 45], color: '#409eff' },
        { name: '二车间', data: [78, 80, 75, 82, 79, 40], color: '#67c23a' },
        { name: '装配车间', data: [92, 90, 88, 95, 91, 50], color: '#e6a23c' }
      ]
    },
    woStatusDistribution: [
      { name: '草稿', value: (workOrders as any[]).filter((item: any) => item.status === 'draft').length },
      { name: '已审批', value: (workOrders as any[]).filter((item: any) => item.status === 'approved').length },
      { name: '已下达', value: (workOrders as any[]).filter((item: any) => item.status === 'released').length },
      { name: '生产中', value: (workOrders as any[]).filter((item: any) => item.status === 'in_progress').length },
      { name: '已完成', value: (workOrders as any[]).filter((item: any) => item.status === 'completed').length },
      { name: '已关闭', value: (workOrders as any[]).filter((item: any) => item.status === 'closed').length }
    ],
    outputTrend,
    stockAlertTop5,
    workshopUtilization: [
      { workshop: '机加工一车间', utilization: 78, trend: 'up' },
      { workshop: '机加工二车间', utilization: 65, trend: 'stable' },
      { workshop: '装配车间', utilization: 92, trend: 'up' }
    ],
    qualityTrend: outputTrend.map((item) => ({
      date: item.date,
      inspected: Math.floor(Math.random() * 20) + 10,
      passed: Math.floor(Math.random() * 20) + 8,
      failed: Math.floor(Math.random() * 3)
    })),
    iotAlertStats: [
      { level: 'danger', count: iotAlertHistory.filter((item: any) => item.level === 'danger').length },
      { level: 'warning', count: iotAlertHistory.filter((item: any) => item.level === 'warning').length },
      { level: 'info', count: iotAlertHistory.filter((item: any) => item.level === 'info').length }
    ],
    mrpExceptionSummary: mrpExceptions.map((item: any) => ({
      type: item.type,
      level: item.level,
      material: item.material,
      detail: item.detail,
      action: item.action
    }))
  })
}
