# Mock 后端 RESTful 响应规范

## 1. 目标

统一项目的 mock 后端响应结构、axios 基础封装、`src/api/*` 返回契约。

最终要求：

- 所有接口统一返回 `code / msg / data`
- 成功业务码固定为 `0`
- 所有字段统一使用 `camelCase`
- 禁止使用下划线命名
- 分页列表固定使用 `list`
- 禁止继续使用 `message`
- 禁止继续使用 `items`
- 禁止页面层自行兼容多种返回结构
- 禁止页面层自行映射成另一套业务字段
- 不保留任何兼容层

本规范确认后，再开始重构 `src/utils/http.ts`、`src/api/_factory.ts`、`src/mock/shared/response.ts` 和各业务 API。

## 2. 统一响应结构

### 2.1 基础响应

```ts
interface ApiResponse<T = unknown> {
  code: number
  msg: string
  data: T
}
```

说明：

- `code`：业务码，成功固定为 `0`
- `msg`：业务提示信息
- `data`：业务数据，不能为空时返回对应对象，空数据统一返回 `{}` 或固定结构

## 3. 分页结构

```ts
interface PageData<T> {
  total: number
  pageNum: number
  pageSize: number
  pages: number
  list: T[]
}
```

说明：

- `total`：总条数
- `pageNum`：当前页码，从 `1` 开始
- `pageSize`：每页条数
- `pages`：总页数，计算规则 `Math.ceil(total / pageSize)`
- `list`：当前页数据

禁止字段：

- `items`
- `page`
- `size`

## 4. 请求参数规范

列表接口查询参数统一使用：

```ts
interface PageQuery {
  pageNum: number
  pageSize: number
}
```

示例：

```json
{
  "pageNum": 1,
  "pageSize": 10,
  "keyword": "张三",
  "status": 1
}
```

## 5. 全场景响应示例

### 5.1 通用成功，无返回内容

适用场景：

- 删除成功
- 重置成功
- 审批成功
- 提交成功

```json
{
  "code": 0,
  "msg": "操作成功",
  "data": {}
}
```

### 5.2 查询详情成功

适用场景：

- 用户详情
- 订单详情
- 工单详情

```json
{
  "code": 0,
  "msg": "查询成功",
  "data": {
    "id": 1,
    "username": "zhangsan",
    "nickname": "张三",
    "status": 1
  }
}
```

### 5.3 查询分页列表成功

```json
{
  "code": 0,
  "msg": "查询列表成功",
  "data": {
    "total": 56,
    "pageNum": 1,
    "pageSize": 10,
    "pages": 6,
    "list": [
      {
        "id": 1,
        "username": "zhangsan",
        "nickname": "张三",
        "status": 1
      },
      {
        "id": 2,
        "username": "wangwu",
        "nickname": "王五",
        "status": 0
      }
    ]
  }
}
```

### 5.4 查询分页列表成功，但为空

```json
{
  "code": 0,
  "msg": "查询列表成功",
  "data": {
    "total": 0,
    "pageNum": 1,
    "pageSize": 10,
    "pages": 0,
    "list": []
  }
}
```

### 5.5 新增成功，返回新建后的完整资源

```json
{
  "code": 0,
  "msg": "创建成功",
  "data": {
    "id": 101,
    "username": "zhaoliu",
    "nickname": "赵六",
    "status": 1,
    "createdAt": "2026-06-30 10:00:00"
  }
}
```

### 5.6 编辑成功，返回更新后的完整资源

```json
{
  "code": 0,
  "msg": "更新成功",
  "data": {
    "id": 101,
    "username": "zhaoliu",
    "nickname": "赵六-已更新",
    "status": 1,
    "updatedAt": "2026-06-30 10:30:00"
  }
}
```

### 5.7 删除成功

```json
{
  "code": 0,
  "msg": "删除成功",
  "data": {}
}
```

### 5.8 批量删除成功

```json
{
  "code": 0,
  "msg": "批量删除成功",
  "data": {}
}
```

### 5.9 批量状态变更成功

```json
{
  "code": 0,
  "msg": "批量启用成功",
  "data": {}
}
```

### 5.10 单条状态切换成功

```json
{
  "code": 0,
  "msg": "状态更新成功",
  "data": {
    "id": 101,
    "status": 0
  }
}
```

### 5.11 查询树结构成功

适用场景：

- 菜单树
- 部门树
- 物料分类树

```json
{
  "code": 0,
  "msg": "查询成功",
  "data": [
    {
      "id": 1,
      "name": "系统管理",
      "children": [
        {
          "id": 11,
          "name": "用户管理",
          "children": []
        }
      ]
    }
  ]
}
```

### 5.12 查询下拉选项成功

适用场景：

- 角色选项
- 状态选项
- 供应商选项

```json
{
  "code": 0,
  "msg": "查询成功",
  "data": [
    {
      "label": "启用",
      "value": 1
    },
    {
      "label": "禁用",
      "value": 0
    }
  ]
}
```

### 5.13 查询统计汇总成功

适用场景：

- 首页统计卡片
- 仪表盘
- 图表汇总

```json
{
  "code": 0,
  "msg": "查询成功",
  "data": {
    "totalUsers": 120,
    "activeUsers": 103,
    "disabledUsers": 17
  }
}
```

### 5.14 文件上传成功

```json
{
  "code": 0,
  "msg": "上传成功",
  "data": {
    "fileId": "file_1001",
    "fileName": "report.pdf",
    "fileUrl": "/mock/files/report.pdf"
  }
}
```

### 5.15 文件下载成功

文件下载不走统一 JSON 包裹，直接返回 `blob`。

规则：

- `responseType` 必须为 `blob`
- axios 拦截器对 `blob` 直接透传

### 5.16 表单校验失败

```json
{
  "code": 10001,
  "msg": "参数校验失败",
  "data": {
    "fieldErrors": [
      {
        "field": "username",
        "msg": "用户名不能为空"
      },
      {
        "field": "phone",
        "msg": "手机号格式不正确"
      }
    ]
  }
}
```

### 5.17 未登录

这类错误优先使用 HTTP 401。

如果后端仍返回 JSON，结构如下：

```json
{
  "code": 401,
  "msg": "登录已过期",
  "data": {}
}
```

### 5.18 无权限

```json
{
  "code": 403,
  "msg": "无权限访问",
  "data": {}
}
```

### 5.19 资源不存在

```json
{
  "code": 404,
  "msg": "数据不存在",
  "data": {}
}
```

### 5.20 服务异常

```json
{
  "code": 500,
  "msg": "服务器内部错误",
  "data": {}
}
```

## 6. 典型业务字段示例

### 6.1 用户

```json
{
  "id": 1,
  "username": "zhangsan",
  "nickname": "张三",
  "phone": "13800138000",
  "email": "zhangsan@test.com",
  "status": 1,
  "roles": ["admin", "planner"],
  "createdAt": "2026-06-30 10:00:00"
}
```

### 6.2 状态值

状态值统一使用后端原值，不使用中文值回写。

示例：

```json
{
  "status": 1
}
```

推荐规则：

- `1`：启用
- `0`：禁用

页面只负责展示转换，不负责请求前再改回另一套字段。

### 6.3 布尔值

布尔字段统一用真正布尔值：

```json
{
  "enabled": true,
  "locked": false
}
```

禁止：

- `"true"`
- `"false"`
- `1/0` 伪装成布尔字段，除非该字段本身就是业务状态字段

### 6.4 时间字段

统一用 `camelCase` 字段名：

```json
{
  "createdAt": "2026-06-30 10:00:00",
  "updatedAt": "2026-06-30 11:00:00"
}
```

禁止：

- `created_at`
- `updated_at`

## 7. TypeScript 基础类型规范

```ts
export interface ApiResponse<T = unknown> {
  code: number
  msg: string
  data: T
}

export interface PageData<T> {
  total: number
  pageNum: number
  pageSize: number
  pages: number
  list: T[]
}
```

因为当前项目 `useTable` 固定要求返回 `{ list, total }`，并且本次不修改 `useTable`，所以后端分页规范直接使用 `list`，不再使用 `records`。

表格层可直接使用：

`useTable` 场景下，`listAPI` 直接返回接口里的 `data` 即可，不需要任何分页转换函数。

约束：

- `useTable` 不改业务字段，只接收 `{ list, total }`
- `src/api/*` 直接返回稳定分页对象
- 页面层禁止再写 `res.data.items || res.data || []`

## 8. axios 封装规范

`src/utils/http.ts` 后续重构要求：

- 统一只识别 `code === 0` 为成功
- 统一读取 `msg`
- 不再读取 `message`
- 拦截器最终统一返回 `ApiResponse<T>`
- 401 刷新 token 逻辑保留
- `get/post/put/patch/delete` 提供统一方法
- `blob` 下载直接透传

推荐方法签名：

```ts
requestApi<T>(config): Promise<ApiResponse<T>>
getApi<T>(url, config): Promise<ApiResponse<T>>
postApi<T, D>(url, data, config): Promise<ApiResponse<T>>
putApi<T, D>(url, data, config): Promise<ApiResponse<T>>
patchApi<T, D>(url, data, config): Promise<ApiResponse<T>>
deleteApi<T>(url, config): Promise<ApiResponse<T>>
```

## 9. mock 响应工厂规范

`src/mock/shared/response.ts` 后续统一提供：

```ts
success<T>(data: T, msg = '操作成功')
detail<T>(data: T, msg = '查询成功')
page<T>(list: T[], total: number, pageNum: number, pageSize: number, msg = '查询列表成功')
empty(msg = '操作成功')
fail<T>(code: number, msg: string, data: T)
```

分页工厂必须返回：

```ts
{
  code: 0,
  msg: '查询列表成功',
  data: {
    total,
    pageNum,
    pageSize,
    pages,
    list
  }
}
```

## 10. 页面层禁止事项

以下写法后续全部禁止：

- `res.data.items`
- `res.data.message`
- `res.data.items || res.data || []`
- `response.data.items.map(...)`
- 页面层把 `realName -> nickname`
- 页面层把 `roles[0] -> role`
- 页面层把 `active/disabled` 或 `1/0` 转成中文后再回写接口

允许的只有：

- 页面直接消费接口原字段
- 页面只做展示层格式化
- `src/api/*` 直接透传统一分页结构

## 11. 重构顺序

确认本规范后，按下面顺序重构：

1. `src/utils/http.ts`
2. `src/api/_factory.ts`
3. `src/mock/shared/response.ts`
4. `src/mock/shared/paginate.ts`
5. `src/api/system.ts`
6. `src/mock/services/system.ts`
7. `src/views/system/*`
8. 其余业务模块 `api + mock + views`

## 12. 验收标准

重构完成后必须满足：

- 全项目响应字段统一为 `code / msg / data`
- 全项目分页字段统一为 `total / pageNum / pageSize / pages / list`
- 全项目不存在业务代码读取 `items`
- 全项目不存在业务代码读取 `message`
- 全项目不存在下划线风格接口字段
- 页面层不存在多结构兜底代码
- mock 与真实接口字段完全一致
- `npm run type-check` 通过

## 13. 当前结论

本次先确认规范，不做全面实现切换。

确认后按本规范直接重构，不保留兼容层，不保留过渡字段，不保留分页转换层。
