import axios from 'axios'
import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { ElMessage } from 'element-plus'
import router from '@/router'

// 响应数据结构（后端统一返回格式）
export interface ApiResponse<T = any> {
  code: number
  data: T
  message: string
}

const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || '/api',
  timeout: 15000
})

// ==================== 请求拦截器 ====================
http.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Token 注入
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    // 租户 ID 注入（多租户场景）
    const tenantId = localStorage.getItem('tenant_id')
    if (tenantId) {
      config.headers['X-Tenant-Id'] = tenantId
    }
    return config
  },
  (error) => Promise.reject(error)
)

// ==================== 响应拦截器 ====================
http.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    const { data } = response

    // 文件下载等特殊响应，直接返回
    if (response.config.responseType === 'blob') {
      return response
    }

    // 业务码判断（假设后端 code=0 或 200 表示成功）
    if (data.code !== 0 && data.code !== 200) {
      ElMessage.error(data.message || '请求失败')
      return Promise.reject(new Error(data.message || '请求失败'))
    }

    return response
  },
  async (error) => {
    if (error.response) {
      const { status, data } = error.response

      switch (status) {
        case 401:
          // Token 过期，尝试刷新
          const refreshed = await tryRefreshToken()
          if (refreshed) {
            // 刷新成功，重试原请求
            return http(error.config)
          }
          // 刷新失败，跳转登录
          ElMessage.error('登录已过期，请重新登录')
          clearAuthAndRedirect()
          break
        case 403:
          ElMessage.error('没有权限执行此操作')
          break
        case 404:
          ElMessage.error('请求的资源不存在')
          break
        case 500:
          ElMessage.error(data?.message || '服务器内部错误')
          break
        default:
          ElMessage.error(data?.message || `请求失败 (${status})`)
      }
    } else if (error.code === 'ECONNABORTED') {
      ElMessage.error('请求超时，请稍后重试')
    } else {
      ElMessage.error('网络异常，请检查网络连接')
    }

    return Promise.reject(error)
  }
)

// ==================== Token 刷新 ====================
async function tryRefreshToken(): Promise<boolean> {
  const refreshToken = localStorage.getItem('refresh_token')
  if (!refreshToken) return false

  try {
    const res = await axios.post(
      `${http.defaults.baseURL}/auth/refresh`,
      { refresh_token: refreshToken }
    )
    if (res.data?.data?.access_token) {
      localStorage.setItem('access_token', res.data.data.access_token)
      if (res.data.data.refresh_token) {
        localStorage.setItem('refresh_token', res.data.data.refresh_token)
      }
      return true
    }
    return false
  } catch {
    return false
  }
}

function clearAuthAndRedirect() {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
  localStorage.removeItem('user_info')
  router.push('/login')
}

export default http
