import * as mockService from '@/mock/services/wms'
import type { ApiResponse } from '@/utils/http'
import http from '@/utils/http'
import { isMockMode } from './_config'
import { unwrapApiResponse } from './_factory'

export function getInventoryList(params: { page: number; page_size: number; code?: string; name?: string; warehouse?: string }) {
  if (isMockMode) return mockService.getInventoryList(params)
  return unwrapApiResponse(http.get<ApiResponse<any>>('/wms/inventory', { params }))
}

export function getMaterialListForBarcode(params: { page: number; page_size: number; code?: string; name?: string }) {
  if (isMockMode) return mockService.getMaterialListForBarcode(params)
  return unwrapApiResponse(http.get<ApiResponse<any>>('/wms/materials', { params }))
}

export function getStockCountList(params: { page: number; page_size: number; plan_code?: string; warehouse?: string; status?: string }) {
  if (isMockMode) return mockService.getStockCountList(params)
  return unwrapApiResponse(http.get<ApiResponse<any>>('/wms/stock-counts', { params }))
}

export function getStockCountDiff(params: { page: number; page_size: number; plan_code?: string; material?: string }) {
  if (isMockMode) return mockService.getStockCountDiff(params)
  return unwrapApiResponse(http.get<ApiResponse<any>>('/wms/stock-count-diffs', { params }))
}

export function getIoTDeviceList(params: { page: number; page_size: number; status?: string; type?: string }) {
  if (isMockMode) return mockService.getIoTDeviceList(params)
  return unwrapApiResponse(http.get<ApiResponse<any>>('/wms/iot-devices', { params }))
}

export function getIoTAlertHistory(params: { page: number; page_size: number; device?: string; level?: string }) {
  if (isMockMode) return mockService.getIoTAlertHistory(params)
  return unwrapApiResponse(http.get<ApiResponse<any>>('/wms/iot-alerts', { params }))
}

export function getIoTAlertRules() {
  if (isMockMode) return mockService.getIoTAlertRules()
  return unwrapApiResponse(http.get<ApiResponse<any>>('/wms/iot-alert-rules'))
}

export function getReceiptList(params: { page: number; page_size: number; code?: string; supplier?: string; status?: string }) {
  return unwrapApiResponse(http.get<ApiResponse<any>>('/wms/receipts', { params }))
}

export function getDeliveryList(params: { page: number; page_size: number; code?: string; customer?: string; status?: string }) {
  return unwrapApiResponse(http.get<ApiResponse<any>>('/wms/deliveries', { params }))
}

export function getPickingList(params: { page: number; page_size: number; code?: string; warehouse?: string; status?: string }) {
  return unwrapApiResponse(http.get<ApiResponse<any>>('/wms/picking', { params }))
}

export function getTransferList(params: {
  page: number
  page_size: number
  code?: string
  from_warehouse?: string
  to_warehouse?: string
  status?: string
}) {
  return unwrapApiResponse(http.get<ApiResponse<any>>('/wms/transfers', { params }))
}

export function getReturnList(params: { page: number; page_size: number; code?: string; reason?: string; status?: string }) {
  return unwrapApiResponse(http.get<ApiResponse<any>>('/wms/returns', { params }))
}

export function getBackflushList(params: { page: number; page_size: number; code?: string; material?: string; status?: string }) {
  return unwrapApiResponse(http.get<ApiResponse<any>>('/wms/backflush', { params }))
}

export function getBarcodeList(params: { page: number; page_size: number; code?: string; material?: string; status?: string }) {
  return unwrapApiResponse(http.get<ApiResponse<any>>('/wms/barcodes', { params }))
}

export function getBarcodeScanList(params: {
  page: number
  page_size: number
  barcode?: string
  operator?: string
  start_date?: string
  end_date?: string
}) {
  return unwrapApiResponse(http.get<ApiResponse<any>>('/wms/barcode-scans', { params }))
}
