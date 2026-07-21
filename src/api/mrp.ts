import { apiGet, apiPost } from './_factory'

export interface MRPForecast {
  id: string
  material_code: string
  material_name: string
  qty: number
  need_date: string
  type: 'sales' | 'independent'
  probability: number
  remark: string
}

export interface MRPForecastQuery {
  pageNum: number
  pageSize: number
  keyword?: string
  type?: MRPForecast['type']
}

export interface NetChangeMRPQuery {
  pageNum?: number
  pageSize?: number
  plantId?: string
  status?: string
  plantIds?: string[]
  changeType?: string
}

export function runMRP(data?: { plantId?: string }) {
  return apiPost<any, { plantId?: string }>('/mrp/run', data)
}

export function getNetChangeMRP(params: NetChangeMRPQuery) {
  return apiGet<any>('/mrp/net-change', { params })
}
