import http from '@/utils/http'
import type { ApiResponse } from '@/utils/http'
import { isMockMode } from './_config'
import { unwrapApiResponse } from './_factory'
import * as mockService from '@/mock/services/hr'

export function getSkillMatrixData() {
  if (isMockMode) return mockService.getSkillMatrixData()
  return unwrapApiResponse(http.get<ApiResponse<any>>('/hr/skill-matrix'))
}
