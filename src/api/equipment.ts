import http from '@/utils/http'
import type { ApiResponse } from '@/utils/http'
import { isMockMode } from './_config'
import { unwrapApiResponse } from './_factory'
import * as mockService from '@/mock/services/equipment'

export function getEquipmentOeeOverview(params?: { start_month?: string; end_month?: string }) {
  if (isMockMode) return mockService.getEquipmentOeeOverview(params)
  return unwrapApiResponse(http.get<ApiResponse<any>>('/equipment/oee', { params }))
}
