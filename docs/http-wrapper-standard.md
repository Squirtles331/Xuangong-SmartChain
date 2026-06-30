# HTTP 封装规范

## 1. 目标

重构 `src/utils/http.ts`，把当前“仅能发请求和做基础拦截”的简单封装，升级为项目统一的请求基础设施。

最终要求：

- `http` 层只负责传输、认证、拦截、错误处理、重试、下载
- `src/api/*` 层只负责业务接口声明和数据类型约束
- 页面层不直接调用 axios
- mock 和真实接口共用同一套返回契约
- 所有业务接口都建立在统一封装之上
- 不保留任何兼容层

## 2. 分层职责

### 2.1 `src/utils/http.ts`

职责：

- 创建 axios 实例
- 注入 token、租户、通用 header
- 处理超时、网络错误、401、403、404、500
- 处理业务码 `code !== 0`
- 处理 `blob`
- 提供通用请求方法
- 提供请求配置扩展能力

不负责：

- 业务字段映射
- 页面提示文案拼装
- 表格分页转换
- mock 数据构造

### 2.2 `src/api/_factory.ts`

职责：

- 对 `http.ts` 的通用方法做二次包装
- 统一导出项目 API 基础类型
- 提供统一 API 调用入口
- 为 `src/api/*` 提供统一调用入口

### 2.3 `src/api/*.ts`

职责：

- 定义每个业务域的接口类型
- 定义接口路径
- 调用 `apiGet / apiPost / apiPut / apiDelete`
- 在 mock 与真实接口之间切换
- 直接返回稳定分页结构

### 2.4 页面层

职责：

- 调用 `src/api/*`
- 消费稳定返回结构
- 只做展示层格式化

禁止：

- 直接 `axios.get/post`
- 自己处理 token
- 自己兜底 `res.data || res`
- 自己判断 `code`

## 3. 标准返回契约

`http` 封装默认配合下面的响应模型：

```ts
interface ApiResponse<T = unknown> {
  code: number
  msg: string
  data: T
}
```

成功标准：

```ts
code === 0
```

不再兼容：

- `message`
- `success`
- `errno`
- `items`

## 4. axios 实例规范

推荐结构：

```ts
const http = axios.create({
  baseURL,
  timeout: 15000
})
```

必须支持：

- `baseURL`
- `timeout`
- `headers`
- `responseType`

建议支持：

- 请求取消
- 幂等重试
- 自定义静默模式
- 跳过认证重定向

## 5. 请求拦截器规范

### 5.1 注入内容

- `Authorization: Bearer <token>`
- `X-Tenant-Id`
- 必要的 `Content-Type`

示例：

```ts
http.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  const tenantId = localStorage.getItem('tenant_id')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  if (tenantId) {
    config.headers['X-Tenant-Id'] = tenantId
  }

  return config
})
```

### 5.2 禁止事项

- 在请求拦截器里写业务判断
- 在请求拦截器里弹业务成功提示
- 在请求拦截器里映射业务字段

## 6. 响应拦截器规范

### 6.1 `blob` 直接透传

```ts
if (response.config.responseType === 'blob') {
  return response
}
```

### 6.2 业务码校验

```ts
if (response.data.code !== 0) {
  throw new Error(response.data.msg || '请求失败')
}
```

### 6.3 HTTP 状态处理

必须统一处理：

- `401`
- `403`
- `404`
- `500`
- 超时
- 网络异常

### 6.4 401 处理

推荐流程：

1. 遇到 `401`
2. 检查是否已重试过
3. 调用刷新 token 接口
4. 刷新成功则重放原请求
5. 刷新失败则清理登录态并跳转登录页

## 7. 错误处理规范

### 7.1 统一错误来源

错误分为三类：

1. HTTP 错误
2. 业务错误
3. 网络错误

### 7.2 统一错误提示

`http.ts` 默认负责基础提示。

页面层只在以下情况补充提示：

- 明确的表单校验
- 明确的业务二次确认
- 组件内局部交互反馈

### 7.3 静默请求

需要支持：

```ts
interface ApiRequestConfig {
  silent?: boolean
}
```

适用场景：

- 轮询
- 预加载
- 后台刷新
- 页面销毁前请求

## 8. Token 刷新规范

必须支持：

- 读取 `refresh_token`
- 调用 `/auth/refresh`
- 更新本地 `access_token`
- 更新本地 `refresh_token`
- 失败时清空认证信息

推荐返回结构：

```json
{
  "code": 0,
  "msg": "刷新成功",
  "data": {
    "accessToken": "new-token",
    "refreshToken": "new-refresh-token"
  }
}
```

## 9. 通用方法签名规范

推荐导出：

```ts
requestApi<T, D = unknown>(config: ApiRequestConfig<D>): Promise<ApiResponse<T>>
getApi<T>(url: string, config?: ApiRequestConfig): Promise<ApiResponse<T>>
postApi<T, D = unknown>(url: string, data?: D, config?: ApiRequestConfig<D>): Promise<ApiResponse<T>>
putApi<T, D = unknown>(url: string, data?: D, config?: ApiRequestConfig<D>): Promise<ApiResponse<T>>
patchApi<T, D = unknown>(url: string, data?: D, config?: ApiRequestConfig<D>): Promise<ApiResponse<T>>
deleteApi<T>(url: string, config?: ApiRequestConfig): Promise<ApiResponse<T>>
```

## 10. 配置项规范

推荐扩展配置：

```ts
interface ApiRequestConfig<D = unknown> extends AxiosRequestConfig<D> {
  silent?: boolean
  skipAuthRedirect?: boolean
  retry?: number
  rawResponse?: boolean
}
```

说明：

- `silent`：静默失败，不弹全局提示
- `skipAuthRedirect`：401 时不自动跳转登录
- `retry`：失败重试次数
- `rawResponse`：是否返回原始 axios response

## 11. 文件上传下载规范

### 11.1 上传

文件上传仍走统一请求封装，但 `data` 为 `FormData`

示例：

```ts
const formData = new FormData()
formData.append('file', file)

postApi<UploadResult, FormData>('/files/upload', formData)
```

### 11.2 下载

下载不走统一 JSON 校验。

示例：

```ts
http.request({
  url: '/files/export',
  method: 'get',
  responseType: 'blob'
})
```

或者封装独立方法：

```ts
downloadApi(url, config): Promise<Blob>
```

## 12. API 工厂层规范

`src/api/_factory.ts` 推荐提供：

```ts
export type { ApiResponse, ApiRequestConfig }
export type PageData<T> = ...

export function apiGet<T>(...)
export function apiPost<T, D>(...)
export function apiPut<T, D>(...)
export function apiPatch<T, D>(...)
export function apiDelete<T>(...)
```

## 13. 业务 API 调用示例

### 13.1 普通详情接口

```ts
export function getUserDetail(id: string) {
  return apiGet<UserDetail>(`/system/users/${id}`)
}
```

### 13.2 分页列表接口

```ts
export function getUserList(params: UserListQuery) {
  return apiGet<PageData<UserItem>>('/system/users', { params })
}
```

### 13.3 新增接口

```ts
export function createUser(data: CreateUserDto) {
  return apiPost<UserItem, CreateUserDto>('/system/users', data)
}
```

### 13.4 更新接口

```ts
export function updateUser(id: string, data: UpdateUserDto) {
  return apiPut<UserItem, UpdateUserDto>(`/system/users/${id}`, data)
}
```

### 13.5 删除接口

```ts
export function deleteUser(id: string) {
  return apiDelete<Record<string, never>>(`/system/users/${id}`)
}
```

## 14. 页面层使用示例

### 14.1 `useTable`

```ts
const { tableData, pagination, loading } = useTable<UserItem>({
  listAPI: async ({ page, size }) => {
    const res = await getUserList({
      pageNum: page,
      pageSize: size
    })

    return res.data
  }
})
```

### 14.2 普通提交

```ts
async function handleSubmit(form: CreateUserDto) {
  await createUser(form)
}
```

## 15. 当前封装的主要问题

当前简单封装通常会有这些问题：

- `http.ts` 只做了最基础的 axios 包装
- `ApiResponse` 契约不稳定
- 业务码判断不统一
- `401` 刷新逻辑不完整
- 没有独立的下载能力
- 缺少静默模式
- 缺少重试控制
- `src/api/*` 仍在重复写底层逻辑
- 页面层容易出现多结构兼容代码

本次重构目标就是把这些问题收敛到基础层。

## 16. 禁止事项

以下写法后续全部禁止：

- 页面直接 `axios.get(...)`
- 页面直接判断 `res.code`
- 页面直接判断 `res.msg`
- 页面直接处理 token 过期
- 页面写 `res.data || res`
- 页面兼容 `message/msg`
- 页面兼容 `items/list`
- `src/api/*` 重复写拦截器逻辑

## 17. 重构顺序

建议顺序：

1. `docs/mock-restful-response-standard.md`
2. `docs/http-wrapper-standard.md`
3. `src/utils/http.ts`
4. `src/api/_factory.ts`
5. `src/mock/shared/response.ts`
6. `src/api/system.ts`
7. `src/mock/services/system.ts`
8. 其他业务模块

## 18. 验收标准

重构完成后必须满足：

- 页面层不直接调用 axios
- 全项目统一通过 `src/api/*` 请求数据
- `http.ts` 统一处理认证、错误、重试、下载
- `src/api/*` 不再重复底层请求逻辑
- `mock` 和真实接口使用同一套响应契约
- `npm run type-check` 通过
