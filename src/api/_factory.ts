import type { AxiosResponse } from 'axios'
import {
  deleteApi,
  getApi,
  patchApi,
  postApi,
  putApi,
  type ApiRequestConfig,
  type ApiResponse,
  type PageData,
  type PaginatedData
} from '@/utils/http'

export type { ApiRequestConfig, ApiResponse, PageData, PaginatedData }

export type ApiRequest<T> = Promise<AxiosResponse<ApiResponse<T>>> | Promise<ApiResponse<T>>

function isAxiosApiResponse<T>(value: ApiResponse<T> | AxiosResponse<ApiResponse<T>>): value is AxiosResponse<ApiResponse<T>> {
  return typeof value === 'object' && value !== null && 'status' in value && 'data' in value
}

export function unwrapApiResponse<T>(request: ApiRequest<T>): Promise<ApiResponse<T>> {
  return request.then((response) => (isAxiosApiResponse(response) ? response.data : response))
}

export function apiGet<T>(url: string, config?: ApiRequestConfig) {
  return getApi<T>(url, config)
}

export function apiPost<T, D = unknown>(url: string, data?: D, config?: ApiRequestConfig<D>) {
  return postApi<T, D>(url, data, config)
}

export function apiPut<T, D = unknown>(url: string, data?: D, config?: ApiRequestConfig<D>) {
  return putApi<T, D>(url, data, config)
}

export function apiPatch<T, D = unknown>(url: string, data?: D, config?: ApiRequestConfig<D>) {
  return patchApi<T, D>(url, data, config)
}

export function apiDelete<T>(url: string, config?: ApiRequestConfig) {
  return deleteApi<T>(url, config)
}

export function toTablePage<T>(data: PaginatedData<T>) {
  return {
    list: data.list,
    total: data.total
  }
}
