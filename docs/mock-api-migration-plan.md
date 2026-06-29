# Mock 接口统一改造计划

## 1. 目标

本次改造目标不是“把页面里的静态数据换个位置”，而是统一成下面这一层关系：

`Page/View -> src/api/* -> mock/real data source`

最终约束：

- 所有页面、组件、store 只能调用 `src/api`。
- 页面层禁止直接 `import '@/mock'`。
- mock 数据单独收敛到 `src/mock` 目录，不再分散在页面内。
- 后续切换真实接口时，只改 `src/api` 或 `src/mock` 切换逻辑，不改页面。

## 2. 当前现状

结合当前项目代码，现状如下：

- 已有统一请求封装：`src/utils/http.ts`
- 已有 API 文件：`src/api/system.ts`、`src/api/work-order.ts`、`src/api/business.ts`
- 已有 mock 目录：`src/mock`
- 当前没有完整的“mock 通过 api 输出”的统一机制
- 当前直接使用 `@/api` 的文件较少，只有 4 个：
  - `src/stores/user.ts`
  - `src/stores/permission.ts`
  - `src/views/settings/ConfigView.vue`
  - `src/views/system/dict/index.vue`
- 当前直接使用 `@/mock` 的页面有 29 个，说明大部分页面仍然绕过了 `api` 层

结论：

- 现有 `src/mock` 可以保留，但需要规范化
- 不建议再新建第二个 mock 根目录，避免出现 `src/mock` 和 `src/mocks` 双轨并存
- 应直接把现有 `src/mock` 升级为唯一的 mock 数据模拟目录

## 3. 目标目录结构

建议在现有基础上整理为：

```text
src/
  api/
    _config.ts
    _factory.ts
    system.ts
    work-order.ts
    business.ts
    ...
  mock/
    modules/
      system.ts
      work-order.ts
      business.ts
      bom.ts
      mrp.ts
    services/
      system.ts
      work-order.ts
      business.ts
      bom.ts
      mrp.ts
    shared/
      response.ts
      paginate.ts
      delay.ts
      id.ts
    index.ts
```

职责划分：

- `mock/modules/*`：只放原始 mock 数据
- `mock/services/*`：模拟查询、分页、详情、增删改、状态流转
- `mock/shared/*`：公共返回体、分页、延迟、ID 生成等工具
- `api/*`：统一对外接口，负责决定调用 mock 还是 real

## 4. 推荐实现方式

因为你要求“mock 接口在 api 文件中使用”，当前项目最稳的做法是：

1. 在 `src/api` 内增加统一切换配置
2. 在每个 `api` 文件里优先调用 mock service
3. 保留真实 `http` 请求分支，后续可切换

建议增加环境变量：

```env
VITE_API_MODE=mock
```

建议增加统一判断：

```ts
export const isMockMode = import.meta.env.VITE_API_MODE === 'mock'
```

建议 API 层使用这种模式：

```ts
export function getUserList(params) {
  if (isMockMode) return mockSystemService.getUserList(params)
  return http.get('/system/users', { params })
}
```

这样做的优点：

- 符合“所有页面使用 api 文件接口”
- 不依赖额外 mock server 插件
- 不需要改 axios 拦截器主逻辑
- 后续接真实后端时，只切换 `VITE_API_MODE`

## 5. 页面改造规则

所有页面迁移时统一遵守以下规则：

1. 删除页面内 `@/mock` 直接导入。
2. 页面只从 `@/api/*` 取数据。
3. 页面内部不再维护“源数据数组 + 本地过滤模拟 CRUD”作为主流程。
4. 列表页统一改为：
   - `loadList`
   - `searchForm`
   - `pagination`
   - `tableData`
5. 详情页统一改为：
   - `loadDetail(id)`
6. 新增/编辑/删除/审批/下发/关闭等动作统一走 `api`
7. 页面允许保留纯 UI 状态，但业务数据来源必须来自 `api`

## 6. 分阶段执行计划

### 阶段 1：打基础

目标：先把统一出口搭起来，再迁页面。

任务：

- 整理 `src/mock` 目录结构
- 抽离 mock 公共响应格式
- 抽离分页工具、延迟工具、ID 工具
- 新增 `src/api/_config.ts`
- 新增 `src/api/_factory.ts` 或等价适配层
- 约定所有 mock service 返回格式与 `ApiResponse` 保持一致

完成标准：

- `api` 可以根据配置切换 mock/real
- mock 返回结构与 `http` 返回结构一致

### 阶段 2：补全 API 文件

目标：先让每个模块在 `src/api` 中都有完整出口。

任务：

- 按模块补齐 API 文件，不足的新增：
  - `src/api/bom.ts`
  - `src/api/mrp.ts`
  - `src/api/crm.ts`
  - `src/api/scm.ts`
  - `src/api/mdm.ts`
  - `src/api/qms.ts`
  - `src/api/dashboard.ts`
- 每个 API 方法对应一个 mock service 方法
- 列表、详情、创建、编辑、删除、状态变更分开定义

完成标准：

- 页面需要的接口在 `src/api` 全部能找到
- 页面不需要再直接拼装 mock 数据逻辑

### 阶段 3：迁移直接依赖 mock 的页面

优先迁移当前直接 `import '@/mock'` 的 29 个页面。

建议按模块分批：

第一批，先迁核心流程：

- `work-order/list`
- `work-order/detail`
- `work-order/create`
- `work-order/report`
- `work-order/my-tasks`
- `work-order/kanban`
- `HomeView`

第二批，迁系统基础页：

- `system/menu`
- `system/dict`
- `system/params`
- `system/audit`
- `system/code-rule`
- `system/approval`
- `settings/LogView`

第三批，迁业务主数据页：

- `crm/customer`
- `crm/order`
- `crm/receivable`
- `scm/supplier`
- `scm/purchase`
- `qms/inspection`
- `mdm/material`
- `mdm/resource`
- `mdm/organization`

第四批，迁 BOM / MRP / ECN：

- `bom/list`
- `bom/editor`
- `routing/editor`
- `ecn/list`
- `mrp/result`

完成标准：

- 以上页面不再直接引用 `@/mock`
- 所有读写动作改为调用 `@/api`

### 阶段 4：收口与约束

目标：防止后续继续绕过 `api`。

任务：

- 清理页面遗留的本地 mock 过滤和本地 CRUD 主逻辑
- 统一返回结构和错误提示
- 增加 lint 约束或约定检查，禁止 `src/views` 下直接引用 `@/mock`
- 更新 README 或开发规范

完成标准：

- `src/views`、`src/components`、`src/stores` 中不再出现 `@/mock`
- 新页面默认按 `api -> mock/real` 结构开发

## 7. 模块映射建议

建议按业务边界拆分，而不是继续把过多模块塞进 `business.ts`：

- `api/system.ts` 对应 `mock/services/system.ts`
- `api/work-order.ts` 对应 `mock/services/work-order.ts`
- `api/bom.ts` 对应 `mock/services/bom.ts`
- `api/mrp.ts` 对应 `mock/services/mrp.ts`
- `api/crm.ts` 对应 `mock/services/crm.ts`
- `api/scm.ts` 对应 `mock/services/scm.ts`
- `api/qms.ts` 对应 `mock/services/qms.ts`
- `api/mdm.ts` 对应 `mock/services/mdm.ts`
- `api/dashboard.ts` 对应 `mock/services/dashboard.ts`

不建议继续扩张 `src/api/business.ts`，否则后面会越来越难维护。

## 8. 返回格式约定

mock service 建议统一返回：

```ts
interface ApiResponse<T = any> {
  code: number
  data: T
  message: string
}
```

列表接口统一返回：

```ts
{
  code: 200,
  data: {
    items: [],
    total: 0,
    page: 1,
    page_size: 10
  },
  message: 'success'
}
```

这样页面层可以不关心当前是 mock 还是 real。

## 9. 验收标准

改造完成后，至少满足以下验收项：

- `src/views` 下直接引用 `@/mock` 数量为 0
- `src/components` 下直接引用 `@/mock` 数量为 0
- `src/stores` 下直接引用 `@/mock` 数量为 0
- 所有页面业务数据都从 `src/api` 获取
- mock 模式下，列表、详情、创建、编辑、删除、状态流转都可运行
- 切换到 real 模式时，不需要修改页面代码

## 10. 实施建议

建议按下面顺序落地，不要一口气全改：

1. 先完成 `api` 与 `mock service` 的统一适配
2. 再迁 `work-order` 和 `system` 两条主链路
3. 之后按模块批量替换页面
4. 最后增加规则，禁止页面直连 `mock`

如果要我继续执行，下一步最合理的是直接开始做“阶段 1 + 阶段 2”的代码落地：

- 规范 `src/mock` 结构
- 增加 `VITE_API_MODE`
- 先把 `work-order`、`system` 两个模块改成 `api -> mock service`
