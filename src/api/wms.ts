import http from '@/utils/http'
import type { ApiResponse } from '@/utils/http'
import { isMockMode } from './_config'
import * as mockService from '@/mock/services/wms'

// ==================== 库存管理 ====================
export function getInventoryList(params: { page: number; page_size: number; code?: string; name?: string; warehouse?: string }) {
  if (isMockMode) return mockService.getInventoryList(params)
  return http.get<ApiResponse<any>>('/wms/inventory', { params })
}

// ==================== 条码管理 ====================
export function getMaterialListForBarcode(params: { page: number; page_size: number; code?: string; name?: string }) {
  if (isMockMode) return mockService.getMaterialListForBarcode(params)
  return http.get<ApiResponse<any>>('/wms/materials', { params })
}

// ==================== 盘点管理 ====================
export function getStockCountList(params: { page: number; page_size: number; plan_code?: string; warehouse?: string; status?: string }) {
  if (isMockMode) return mockService.getStockCountList(params)
  return http.get<ApiResponse<any>>('/wms/stock-counts', { params })
}

export function getStockCountDiff(params: { page: number; page_size: number; plan_code?: string; material?: string }) {
  if (isMockMode) return mockService.getStockCountDiff(params)
  return http.get<ApiResponse<any>>('/wms/stock-count-diffs', { params })
}

// ==================== IoT 设备管理 ====================
export function getIoTDeviceList(params: { page: number; page_size: number; status?: string; type?: string }) {
  if (isMockMode) return mockService.getIoTDeviceList(params)
  return http.get<ApiResponse<any>>('/wms/iot-devices', { params })
}

export function getIoTAlertHistory(params: { page: number; page_size: number; device?: string; level?: string }) {
  if (isMockMode) return mockService.getIoTAlertHistory(params)
  return http.get<ApiResponse<any>>('/wms/iot-alerts', { params })
}

// ==================== 骨架函数 — 后续页面预留 ====================

/** 收货单列表（骨架） */
export function getReceiptList(params: { page: number; page_size: number; code?: string; supplier?: string; status?: string }) {
  return http.get<ApiResponse<any>>('/wms/receipts', { params })
}

/** 发货单列表（骨架） */
export function getDeliveryList(params: { page: number; page_size: number; code?: string; customer?: string; status?: string }) {
  return http.get<ApiResponse<any>>('/wms/deliveries', { params })
}

/** 拣货单列表（骨架） */
export function getPickingList(params: { page: number; page_size: number; code?: string; warehouse?: string; status?: string }) {
  return http.get<ApiResponse<any>>('/wms/picking', { params })
}

/** 移库单列表（骨架） */
export function getTransferList(params: {
  page: number
  page_size: number
  code?: string
  from_warehouse?: string
  to_warehouse?: string
  status?: string
}) {
  return http.get<ApiResponse<any>>('/wms/transfers', { params })
}

/** 退货单列表（骨架） */
export function getReturnList(params: { page: number; page_size: number; code?: string; reason?: string; status?: string }) {
  return http.get<ApiResponse<any>>('/wms/returns', { params })
}

/** 倒冲单列表（骨架） */
export function getBackflushList(params: { page: number; page_size: number; code?: string; material?: string; status?: string }) {
  return http.get<ApiResponse<any>>('/wms/backflush', { params })
}

/** 条码列表（骨架） */
export function getBarcodeList(params: { page: number; page_size: number; code?: string; material?: string; status?: string }) {
  return http.get<ApiResponse<any>>('/wms/barcodes', { params })
}

/** 条码扫描记录（骨架） */
export function getBarcodeScanList(params: {
  page: number
  page_size: number
  barcode?: string
  operator?: string
  start_date?: string
  end_date?: string
}) {
  return http.get<ApiResponse<any>>('/wms/barcode-scans', { params })
}
