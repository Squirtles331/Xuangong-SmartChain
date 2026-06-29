/**
 * Dashboard Mock Service
 * 首页仪表盘统计与图表数据
 */
import { simulateDelay } from '../shared/delay'
import { wrapDetailResponse } from '../shared/response'
import { workOrders } from '../modules/work-order'
import { inspectionTasks } from '../modules/business'
import { inventory } from '../modules/business'
import { mrpExceptions } from '../modules/mrp'
import { iotDevices, iotAlertHistory } from '../modules/wms'

// ==================== 仪表盘统计 ====================
export async function getDashboardStats() {
  await simulateDelay(300, 600)

  // 统计工单状态
  const totalWorkOrders = workOrders.length
  const activeWorkOrders = (workOrders as any[]).filter((wo: any) => ['approved', 'released', 'in_progress'].includes(wo.status)).length
  const completedWorkOrders = (workOrders as any[]).filter((wo: any) => wo.status === 'completed').length
  const urgentWorkOrders = (workOrders as any[]).filter((wo: any) => wo.priority === 'urgent').length

  // 统计质检任务
  const totalInspections = inspectionTasks.length
  const pendingInspections = (inspectionTasks as any[]).filter((t: any) => t.status === 'pending').length
  const doneInspections = (inspectionTasks as any[]).filter((t: any) => t.status === 'done').length

  // 统计库存
  const totalStockItems = inventory.length
  const lowStockItems = (inventory as any[]).filter((i: any) => i.available < i.safety).length
  const totalStockQty = (inventory as any[]).reduce((sum: number, i: any) => sum + (i.qty || 0), 0)

  // 统计 MRP 例外
  const severeExceptions = mrpExceptions.filter((e: any) => e.level === 'severe').length
  const warningExceptions = mrpExceptions.filter((e: any) => e.level === 'warning').length

  // 统计 IoT 设备
  const totalDevices = iotDevices.length
  const runningDevices = iotDevices.filter((d: any) => d.status === 'running').length
  const idleDevices = iotDevices.filter((d: any) => d.status === 'idle').length
  const maintenanceDevices = iotDevices.filter((d: any) => d.status === 'maintenance').length

  // 今日产出（模拟）
  const todayOutput = 125

  // 计划完成率
  const planCompletionRate = totalWorkOrders > 0 ? Math.round((completedWorkOrders / totalWorkOrders) * 100) : 0

  // 质检合格率
  const inspectionPassRate = totalInspections > 0 ? Math.round((doneInspections / totalInspections) * 100) : 0

  return wrapDetailResponse({
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

// ==================== 首页图表数据 ====================
export async function getHomeCharts() {
  await simulateDelay(400, 700)

  // 工单状态分布
  const woStatusDistribution = [
    { name: '草稿', value: (workOrders as any[]).filter((w: any) => w.status === 'draft').length },
    { name: '已审批', value: (workOrders as any[]).filter((w: any) => w.status === 'approved').length },
    { name: '已下达', value: (workOrders as any[]).filter((w: any) => w.status === 'released').length },
    { name: '生产中', value: (workOrders as any[]).filter((w: any) => w.status === 'in_progress').length },
    { name: '已完成', value: (workOrders as any[]).filter((w: any) => w.status === 'completed').length },
    { name: '已关闭', value: (workOrders as any[]).filter((w: any) => w.status === 'closed').length }
  ]

  // 近7天产出趋势
  const outputTrend = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    outputTrend.push({
      date: d.toISOString().slice(0, 10),
      planned: Math.floor(Math.random() * 30) + 80,
      actual: Math.floor(Math.random() * 30) + 75
    })
  }

  // 库存预警 Top5
  const stockAlertTop5 = (inventory as any[])
    .filter((i: any) => i.available < i.safety)
    .slice(0, 5)
    .map((i: any) => ({
      code: i.code,
      name: i.name,
      available: i.available,
      safety: i.safety,
      gap: i.safety - i.available
    }))

  // 车间产能利用率
  const workshopUtilization = [
    { workshop: '机加工一车间', utilization: 78, trend: 'up' },
    { workshop: '机加工二车间', utilization: 65, trend: 'stable' },
    { workshop: '装配车间', utilization: 92, trend: 'up' }
  ]

  // 质检趋势（近7天）
  const qualityTrend = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    qualityTrend.push({
      date: d.toISOString().slice(0, 10),
      inspected: Math.floor(Math.random() * 20) + 10,
      passed: Math.floor(Math.random() * 20) + 8,
      failed: Math.floor(Math.random() * 3) + 0
    })
  }

  // IoT 告警统计
  const iotAlertStats = [
    { level: 'danger', count: iotAlertHistory.filter((a: any) => a.level === 'danger').length },
    { level: 'warning', count: iotAlertHistory.filter((a: any) => a.level === 'warning').length },
    { level: 'info', count: iotAlertHistory.filter((a: any) => a.level === 'info').length }
  ]

  // 近期 MRP 例外摘要
  const mrpExceptionSummary = mrpExceptions.map((e: any) => ({
    type: e.type,
    level: e.level,
    material: e.material,
    detail: e.detail,
    action: e.action
  }))

  return wrapDetailResponse({
    woStatusDistribution,
    outputTrend,
    stockAlertTop5,
    workshopUtilization,
    qualityTrend,
    iotAlertStats,
    mrpExceptionSummary
  })
}
