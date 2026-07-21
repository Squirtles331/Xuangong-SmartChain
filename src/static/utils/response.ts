export interface ApiResponse<T = unknown> {
  code: number
  msg: string
  data: T
}

export function wrapSuccessResponse<T>(msg: string = '操作成功'): ApiResponse<T> {
  return {
    code: 0,
    msg,
    data: null as T
  }
}

export function wrapDetailResponse<T>(data: T, msg: string = '获取成功'): ApiResponse<T> {
  return {
    code: 0,
    msg,
    data
  }
}

export function wrapListResponse<T>(
  list: T[],
  total: number,
  pageNum: number,
  pageSize: number,
  msg: string = '获取成功'
): ApiResponse<{ list: T[]; total: number; pageNum: number; pageSize: number; pages: number }> {
  return {
    code: 0,
    msg,
    data: {
      list,
      total,
      pageNum,
      pageSize,
      pages: Math.ceil(total / pageSize)
    }
  }
}

export function wrapCreatedResponse<T>(data: T, msg: string = '创建成功'): ApiResponse<T> {
  return {
    code: 0,
    msg,
    data
  }
}

export function wrapUpdatedResponse<T>(data: T, msg: string = '更新成功'): ApiResponse<T> {
  return {
    code: 0,
    msg,
    data
  }
}

export const MockResponse = {
  fail: (code: number, msg: string, data: any = null): ApiResponse<typeof data> => ({
    code,
    msg,
    data
  })
}
