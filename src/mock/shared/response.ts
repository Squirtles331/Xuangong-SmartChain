/**
 * Mock 公共响应格式工具
 * 统一返回 ApiResponse 结构，与 http.ts 拦截器期望一致
 */

export interface ApiResponse<T = any> {
  code: number
  data: T
  message: string
}

export interface PaginatedData<T> {
  items: T[]
  total: number
  page: number
  page_size: number
}

/** 包装列表响应 */
export function wrapListResponse<T>(items: T[], total: number, page: number, pageSize: number): ApiResponse<PaginatedData<T>> {
  return {
    code: 200,
    data: { items, total, page, page_size: pageSize },
    message: 'success'
  }
}

/** 包装详情响应 */
export function wrapDetailResponse<T>(data: T): ApiResponse<T> {
  return {
    code: 200,
    data,
    message: 'success'
  }
}

/** 包装操作成功响应 */
export function wrapSuccessResponse(message = '操作成功'): ApiResponse<null> {
  return {
    code: 200,
    data: null,
    message
  }
}
