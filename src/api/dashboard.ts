import http from '@/utils/http'
import type { ApiResponse } from '@/utils/http'
import { isMockMode } from './_config'
import * as mockService from '@/mock/services/dashboard'

// ==================== 仪表盘统计 ====================
export function getDashboardStats() {
  if (isMockMode) return mockService.getDashboardStats()
  return http.get<ApiResponse<any>>('/dashboard/stats')
}

// ==================== 首页图表数据 ====================
export function getHomeCharts() {
  if (isMockMode) return mockService.getHomeCharts()
  return http.get<ApiResponse<any>>('/dashboard/charts')
}
