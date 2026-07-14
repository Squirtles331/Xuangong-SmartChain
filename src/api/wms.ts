import * as staticService from '@/static/services/wms'
import { isMockMode, isStaticMode } from './_config'
import { apiDelete, apiGet, apiPost, apiPut } from './_factory'
import * as mockService from '@/mock/services/wms'

export function getInventoryList(params: { pageNum: number; pageSize: number; code?: string; name?: string; warehouse?: string }) {
  if (isStaticMode) return staticService.getInventoryList(params)
  if (isMockMode) return mockService.getInventoryList(params)
  return apiGet<any>('/wms/inventory', { params })
}

export function getWmsBridgeSummary() {
  if (isStaticMode || isMockMode) return staticService.getWmsBridgeSummary()
  return apiGet<any>('/wms/bridge-summary')
}

export function getMaterialListForBarcode(params: { pageNum: number; pageSize: number; code?: string; name?: string }) {
  if (isMockMode) return mockService.getMaterialListForBarcode(params)
  return apiGet<any>('/wms/materials', { params })
}

export function getStockCountList(params: { pageNum: number; pageSize: number; planCode?: string; warehouse?: string; status?: string }) {
  if (isStaticMode) return staticService.getStockCountList(params)
  if (isMockMode) return mockService.getStockCountList(params)
  return apiGet<any>('/wms/stock-counts', { params })
}

export function getStockCountDiff(params: { pageNum: number; pageSize: number; planCode?: string; material?: string }) {
  if (isStaticMode) return staticService.getStockCountDiff(params)
  if (isMockMode) return mockService.getStockCountDiff(params)
  return apiGet<any>('/wms/stock-count-diffs', { params })
}

export function getIoTDeviceList(params: { pageNum: number; pageSize: number; status?: string; type?: string }) {
  if (isMockMode) return mockService.getIoTDeviceList(params)
  return apiGet<any>('/wms/iot-devices', { params })
}

export function getIoTAlertHistory(params: { pageNum: number; pageSize: number; device?: string; level?: string }) {
  if (isMockMode) return mockService.getIoTAlertHistory(params)
  return apiGet<any>('/wms/iot-alerts', { params })
}

export function getIoTAlertRules() {
  if (isMockMode) return mockService.getIoTAlertRules()
  return apiGet<any>('/wms/iot-alert-rules')
}

export function createIoTAlertRule(data: Record<string, any>) {
  if (isMockMode) return mockService.createIoTAlertRule(data)
  return apiPost<Record<string, never>, Record<string, any>>('/wms/iot-alert-rules', data)
}

export function updateIoTAlertRule(id: string, data: Record<string, any>) {
  if (isMockMode) return mockService.updateIoTAlertRule(id, data)
  return apiPut<Record<string, never>, Record<string, any>>(`/wms/iot-alert-rules/${id}`, data)
}

export function deleteIoTAlertRule(id: string) {
  if (isMockMode) return mockService.deleteIoTAlertRule(id)
  return apiDelete<Record<string, never>>(`/wms/iot-alert-rules/${id}`)
}

export function getReceiptList(params: { pageNum: number; pageSize: number; code?: string; type?: string; supplier?: string; status?: string }) {
  if (isStaticMode) return staticService.getReceiptList(params)
  if (isMockMode) return mockService.getReceiptList(params)
  return apiGet<any>('/wms/receipts', { params })
}

export function createReceipt(data: Record<string, any>) {
  if (isStaticMode) return staticService.createReceipt(data)
  return apiPost<Record<string, never>, Record<string, any>>('/wms/receipts', data)
}

export function updateReceipt(id: string, data: Record<string, any>) {
  if (isStaticMode) return staticService.updateReceipt(id, data)
  return apiPut<Record<string, never>, Record<string, any>>(`/wms/receipts/${id}`, data)
}

export function deleteReceipt(id: string) {
  if (isStaticMode) return staticService.deleteReceipt(id)
  return apiDelete<Record<string, never>>(`/wms/receipts/${id}`)
}

export function getDeliveryList(params: { pageNum: number; pageSize: number; code?: string; customer?: string; status?: string }) {
  if (isMockMode) return mockService.getDeliveryList(params)
  return apiGet<any>('/wms/deliveries', { params })
}

export function getPickingList(params: { pageNum: number; pageSize: number; code?: string; warehouse?: string; status?: string }) {
  if (isStaticMode) return staticService.getPickingList(params)
  if (isMockMode) return mockService.getPickingList(params)
  return apiGet<any>('/wms/picking', { params })
}

export function createPicking(data: Record<string, any>) {
  if (isStaticMode) return staticService.createPicking(data)
  return apiPost<Record<string, never>, Record<string, any>>('/wms/picking', data)
}

export function updatePicking(id: string, data: Record<string, any>) {
  if (isStaticMode) return staticService.updatePicking(id, data)
  return apiPut<Record<string, never>, Record<string, any>>(`/wms/picking/${id}`, data)
}

export function deletePicking(id: string) {
  if (isStaticMode) return staticService.deletePicking(id)
  return apiDelete<Record<string, never>>(`/wms/picking/${id}`)
}

export function getTransferList(params: {
  pageNum: number
  pageSize: number
  code?: string
  fromWarehouse?: string
  toWarehouse?: string
  status?: string
}) {
  if (isStaticMode) return staticService.getTransferList(params)
  if (isMockMode) return mockService.getTransferList(params)
  return apiGet<any>('/wms/transfers', { params })
}

export function createTransfer(data: Record<string, any>) {
  if (isStaticMode) return staticService.createTransfer(data)
  return apiPost<Record<string, never>, Record<string, any>>('/wms/transfers', data)
}

export function updateTransfer(id: string, data: Record<string, any>) {
  if (isStaticMode) return staticService.updateTransfer(id, data)
  return apiPut<Record<string, never>, Record<string, any>>(`/wms/transfers/${id}`, data)
}

export function getReturnList(params: { pageNum: number; pageSize: number; code?: string; reason?: string; status?: string }) {
  if (isStaticMode) return staticService.getReturnList(params)
  if (isMockMode) return mockService.getReturnList(params)
  return apiGet<any>('/wms/returns', { params })
}

export function createReturn(data: Record<string, any>) {
  if (isStaticMode) return staticService.createReturn(data)
  return apiPost<Record<string, never>, Record<string, any>>('/wms/returns', data)
}

export function updateReturn(id: string, data: Record<string, any>) {
  if (isStaticMode) return staticService.updateReturn(id, data)
  return apiPut<Record<string, never>, Record<string, any>>(`/wms/returns/${id}`, data)
}

export function getBackflushList(params: { pageNum: number; pageSize: number; code?: string; material?: string; status?: string }) {
  if (isMockMode) return mockService.getBackflushList(params)
  return apiGet<any>('/wms/backflush', { params })
}

export function completeStockCountPlan(planCode: string, items: Array<{ location: string; material: string; actual: number; disposition?: string }>) {
  if (isStaticMode) return staticService.completeStockCountPlan(planCode, items)
  return apiPost<Record<string, never>, { items: Array<{ location: string; material: string; actual: number; disposition?: string }> }>(
    `/wms/stock-counts/${planCode}/complete`,
    { items }
  )
}

export function updateStockCountDiffDispositions(planCode: string, items: Array<{ material: string; disposition: string }>) {
  if (isStaticMode) return staticService.updateStockCountDiffDispositions(planCode, items)
  return apiPut<Record<string, never>, { items: Array<{ material: string; disposition: string }> }>(`/wms/stock-count-diffs/${planCode}`, { items })
}

export function getBarcodeList(params: { pageNum: number; pageSize: number; code?: string; material?: string; status?: string }) {
  return apiGet<any>('/wms/barcodes', { params })
}

export function getBarcodeScanList(params: {
  pageNum: number
  pageSize: number
  barcode?: string
  operator?: string
  startDate?: string
  endDate?: string
}) {
  if (isMockMode) return mockService.getBarcodeScanList(params)
  return apiGet<any>('/wms/barcode-scans', { params })
}
