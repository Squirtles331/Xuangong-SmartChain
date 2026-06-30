import type { ApiResponse, PaginatedData } from '@/utils/http'

export class MockResponse {
  static success<T>(data: T, msg = '操作成功'): ApiResponse<T> {
    return {
      code: 0,
      data,
      msg
    }
  }

  static detail<T>(data: T, msg = '查询成功'): ApiResponse<T> {
    return this.success(data, msg)
  }

  static paginated<T>(list: T[], total: number, pageNum: number, pageSize: number, msg = '查询列表成功'): ApiResponse<PaginatedData<T>> {
    const pages = pageSize > 0 ? Math.ceil(total / pageSize) : 0

    return this.success(
      {
        total,
        pageNum,
        pageSize,
        pages,
        list
      },
      msg
    )
  }

  static created<T>(data: T, msg = '创建成功'): ApiResponse<T> {
    return this.success(data, msg)
  }

  static updated<T>(data: T, msg = '更新成功'): ApiResponse<T> {
    return this.success(data, msg)
  }

  static empty(msg = '操作成功'): ApiResponse<Record<string, never>> {
    return this.success({}, msg)
  }

  static fail<T>(code: number, msg: string, data: T): ApiResponse<T> {
    return {
      code,
      msg,
      data
    }
  }
}

export function wrapListResponse<T>(list: T[], total: number, pageNum: number, pageSize: number) {
  return MockResponse.paginated(list, total, pageNum, pageSize)
}

export function wrapDetailResponse<T>(data: T, msg?: string) {
  return MockResponse.detail(data, msg)
}

export function wrapCreatedResponse<T>(data: T, msg?: string) {
  return MockResponse.created(data, msg)
}

export function wrapUpdatedResponse<T>(data: T, msg?: string) {
  return MockResponse.updated(data, msg)
}

export function wrapSuccessResponse(msg = '操作成功') {
  return MockResponse.empty(msg)
}
