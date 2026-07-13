import http from '@/utils/http'
import type { ApiResponse } from '@/utils/http'
import * as staticService from '@/static/services/workbench'
import type { WorkbenchHomepageData } from '@/types/workbench'
import { isMockMode } from './_config'
import { unwrapApiResponse } from './_factory'
import * as mockService from '@/mock/services/dashboard'

// ==================== 仪表盘统计 ====================
export function getDashboardStats() {
  if (isMockMode) return mockService.getDashboardStats()
  return unwrapApiResponse(http.get<ApiResponse<any>>('/dashboard/stats'))
}

// ==================== 首页图表数据 ====================
export function getHomeCharts() {
  if (isMockMode) return mockService.getHomeCharts()
  return unwrapApiResponse(http.get<ApiResponse<any>>('/dashboard/charts'))
}

// ==================== 工作台首页聚合数据 ====================
export function getWorkbenchHomepageData() {
  if (isMockMode) return staticService.getWorkbenchHomepageData() as Promise<ApiResponse<WorkbenchHomepageData>>
  return unwrapApiResponse(http.get<ApiResponse<WorkbenchHomepageData>>('/dashboard/workbench'))
}
