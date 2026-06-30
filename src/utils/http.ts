import axios, { type AxiosError, type AxiosRequestConfig, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios'
import { ElMessage } from 'element-plus'

export interface ApiResponse<T = unknown> {
  code: number
  msg: string
  data: T
}

export interface PaginatedData<T> {
  total: number
  pageNum: number
  pageSize: number
  pages: number
  list: T[]
}

export type PageData<T> = PaginatedData<T>

export interface ApiRequestConfig<D = unknown> extends AxiosRequestConfig<D> {
  silent?: boolean
  skipAuthRedirect?: boolean
}

interface RequestConfig<D = unknown> extends InternalAxiosRequestConfig<D> {
  silent?: boolean
  skipAuthRedirect?: boolean
  _retry?: boolean
}

interface RefreshTokenData {
  accessToken: string
  refreshToken: string
}

const successCode = 0
const baseURL = import.meta.env.VITE_API_URL || '/api'
const timeout = 15000

const http = axios.create({
  baseURL,
  timeout
})

let refreshTokenRequest: Promise<string> | null = null

function getAccessToken() {
  return localStorage.getItem('access_token') || ''
}

function getRefreshToken() {
  return localStorage.getItem('refresh_token') || ''
}

function getTenantId() {
  return localStorage.getItem('tenant_id') || ''
}

function saveAccessToken(token: string) {
  localStorage.setItem('access_token', token)
}

function saveRefreshToken(token: string) {
  localStorage.setItem('refresh_token', token)
}

function clearAuthStorage() {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
  localStorage.removeItem('user_info')
}

function redirectToLogin() {
  if (typeof window === 'undefined') return
  if (window.location.pathname === '/login') return
  window.location.assign('/login')
}

function setHeader(config: { headers?: unknown }, key: string, value: string) {
  if (!config.headers) {
    config.headers = {}
  }

  if (typeof (config.headers as { set?: unknown }).set === 'function') {
    ;(config.headers as { set: (name: string, headerValue: string) => void }).set(key, value)
    return
  }

  ;(config.headers as Record<string, string>)[key] = value
}

function isApiResponse<T>(value: unknown): value is ApiResponse<T> {
  if (!value || typeof value !== 'object') return false
  return 'code' in value && 'msg' in value && 'data' in value
}

function extractMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    const responseData = error.response?.data

    if (isApiResponse(responseData) && responseData.msg) {
      return responseData.msg
    }

    if (typeof responseData === 'object' && responseData && 'msg' in responseData) {
      return String((responseData as { msg?: unknown }).msg || '')
    }

    if (error.message) {
      return error.message
    }
  }

  if (error instanceof Error) {
    return error.message
  }

  return '请求失败'
}

function showErrorMessage(error: unknown, silent?: boolean) {
  if (silent) return
  const msg = extractMessage(error)
  if (msg) {
    ElMessage.error(msg)
  }
}

function createBusinessError<T>(response: ApiResponse<T>) {
  const error = new Error(response.msg || '请求失败') as Error & { response?: ApiResponse<T> }
  error.response = response
  return error
}

async function refreshAccessToken() {
  const refreshToken = getRefreshToken()
  if (!refreshToken) {
    throw new Error('登录已过期')
  }

  if (!refreshTokenRequest) {
    refreshTokenRequest = axios
      .post<ApiResponse<RefreshTokenData>, AxiosResponse<ApiResponse<RefreshTokenData>>, { refreshToken: string }>(
        '/auth/refresh',
        { refreshToken },
        { baseURL, timeout }
      )
      .then((response) => {
        const result = response.data

        if (!isApiResponse<RefreshTokenData>(result) || result.code !== successCode) {
          throw createBusinessError(result)
        }

        const accessToken = result.data?.accessToken
        const nextRefreshToken = result.data?.refreshToken

        if (!accessToken || !nextRefreshToken) {
          throw new Error('刷新令牌响应无效')
        }

        saveAccessToken(accessToken)
        saveRefreshToken(nextRefreshToken)
        return accessToken
      })
      .finally(() => {
        refreshTokenRequest = null
      })
  }

  return refreshTokenRequest
}

http.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const requestConfig = config as RequestConfig
    const accessToken = getAccessToken()
    const tenantId = getTenantId()

    if (accessToken) {
      setHeader(requestConfig, 'Authorization', `Bearer ${accessToken}`)
    }

    if (tenantId) {
      setHeader(requestConfig, 'X-Tenant-Id', tenantId)
    }

    return requestConfig
  },
  (error) => Promise.reject(error)
)

http.interceptors.response.use(
  (response) => {
    if (response.config.responseType === 'blob') {
      return response
    }

    const result = response.data

    if (!isApiResponse(result)) {
      return result
    }

    if (result.code === successCode) {
      return result
    }

    throw createBusinessError(result)
  },
  async (error: AxiosError<ApiResponse<unknown>>) => {
    const config = (error.config || {}) as RequestConfig

    if (error.response?.status === 401 && !config._retry) {
      try {
        config._retry = true
        const accessToken = await refreshAccessToken()
        setHeader(config, 'Authorization', `Bearer ${accessToken}`)
        return http.request(config)
      } catch (refreshError) {
        clearAuthStorage()

        if (!config.skipAuthRedirect) {
          redirectToLogin()
        }

        showErrorMessage(refreshError, config.silent)
        return Promise.reject(refreshError)
      }
    }

    showErrorMessage(error, config.silent)
    return Promise.reject(error)
  }
)

export function requestApi<T, D = unknown>(config: ApiRequestConfig<D>) {
  return http.request<ApiResponse<T>, ApiResponse<T>, D>(config)
}

export function getApi<T>(url: string, config?: ApiRequestConfig) {
  return requestApi<T>({ ...config, url, method: 'get' })
}

export function postApi<T, D = unknown>(url: string, data?: D, config?: ApiRequestConfig<D>) {
  return requestApi<T, D>({ ...config, url, data, method: 'post' })
}

export function putApi<T, D = unknown>(url: string, data?: D, config?: ApiRequestConfig<D>) {
  return requestApi<T, D>({ ...config, url, data, method: 'put' })
}

export function patchApi<T, D = unknown>(url: string, data?: D, config?: ApiRequestConfig<D>) {
  return requestApi<T, D>({ ...config, url, data, method: 'patch' })
}

export function deleteApi<T>(url: string, config?: ApiRequestConfig) {
  return requestApi<T>({ ...config, url, method: 'delete' })
}

export default http
