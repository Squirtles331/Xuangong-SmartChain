import type { AxiosResponse } from 'axios'
import type { ApiResponse } from '@/utils/http'

export type ApiRequest<T> = Promise<AxiosResponse<ApiResponse<T>>>

export function unwrapApiResponse<T>(request: ApiRequest<T>): Promise<ApiResponse<T>> {
  return request.then((response) => response.data)
}
