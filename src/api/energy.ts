import http from '@/utils/http'
import type { ApiResponse } from '@/utils/http'
import { isMockMode } from './_config'
import { unwrapApiResponse } from './_factory'
import * as mockService from '@/mock/services/energy'

export function getEnergyDetailList() {
  if (isMockMode) return mockService.getEnergyDetailList()
  return unwrapApiResponse(http.get<ApiResponse<any>>('/energy/details'))
}
