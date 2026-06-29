import http from '@/utils/http'
import type { ApiResponse } from '@/utils/http'
import { isMockMode } from './_config'
import { unwrapApiResponse } from './_factory'
import * as mockService from '@/mock/services/aps'

export function getApsScheduleData() {
  if (isMockMode) return mockService.getApsScheduleData()
  return unwrapApiResponse(http.get<ApiResponse<any>>('/aps/schedule'))
}

export function runApsSchedule() {
  if (isMockMode) return mockService.runApsSchedule()
  return unwrapApiResponse(http.post<ApiResponse<null>>('/aps/run'))
}
