import http from '@/utils/http'
import type { ApiResponse } from '@/utils/http'
import * as dashboardStaticService from '@/static/services/dashboard'
import * as workbenchStaticService from '@/static/services/workbench'
import type { WorkbenchHomepageData } from '@/types/workbench'
import { isStaticMode } from './_config'
import { unwrapApiResponse } from './_factory'

export function getDashboardStats() {
  if (isStaticMode) return dashboardStaticService.getDashboardStats()
  return unwrapApiResponse(http.get<ApiResponse<any>>('/dashboard/stats'))
}

export function getHomeCharts() {
  if (isStaticMode) return dashboardStaticService.getHomeCharts()
  return unwrapApiResponse(http.get<ApiResponse<any>>('/dashboard/charts'))
}

export function getWorkbenchHomepageData() {
  if (isStaticMode) return workbenchStaticService.getWorkbenchHomepageData() as Promise<ApiResponse<WorkbenchHomepageData>>
  return unwrapApiResponse(http.get<ApiResponse<WorkbenchHomepageData>>('/dashboard/workbench'))
}
