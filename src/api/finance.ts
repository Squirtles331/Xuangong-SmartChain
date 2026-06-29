import http from '@/utils/http'
import type { ApiResponse } from '@/utils/http'
import { isMockMode } from './_config'
import { unwrapApiResponse } from './_factory'
import * as mockService from '@/mock/services/finance'

export function getCostDetails() {
  if (isMockMode) return mockService.getCostDetails()
  return unwrapApiResponse(http.get<ApiResponse<any>>('/finance/cost-details'))
}

export function getFinanceLedgerOverview() {
  if (isMockMode) return mockService.getFinanceLedgerOverview()
  return unwrapApiResponse(http.get<ApiResponse<any>>('/finance/ledger-overview'))
}
