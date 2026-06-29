# Mock API 迁移计划

## 1. 目标

统一项目数据访问链路：

`Page/View -> src/api/* -> mock service / real http`

最终约束：

- 所有页面、组件、store 只允许调用 `src/api/*`
- `src/views`、`src/components`、`src/stores` 不允许直接引用 `@/mock`
- mock 数据统一放在 `src/mock/modules/*`
- mock 业务逻辑统一放在 `src/mock/services/*`
- 不保留任何兼容层，不保留聚合式 `business.ts`

## 2. 当前结论

- `src/api/business.ts` 已删除
- 页面层 direct mock 引用已清零
- `api` 层已具备 mock / real 切换能力
- mock 返回结构已统一为 `ApiResponse<T>`

## 3. 目标目录结构

```text
src/
  api/
    _config.ts
    _factory.ts
    system.ts
    work-order.ts
    crm.ts
    scm.ts
    mdm.ts
    bom.ts
    routing.ts
    ecn.ts
    mrp.ts
    qms.ts
    wms.ts
    dashboard.ts
    analysis.ts
    aps.ts
    equipment.ts
    energy.ts
    finance.ts
    hr.ts
  mock/
    modules/
    services/
    shared/
```

职责划分：

- `mock/modules/*`：原始 mock 数据
- `mock/services/*`：分页、详情、CRUD、状态流转等模拟逻辑
- `mock/shared/*`：响应包装、分页、延迟、ID 等公共能力
- `api/*`：对外唯一入口，内部决定走 mock 还是 real

## 4. 实现原则

### 4.1 API 层原则

- 每个业务域一个独立 API 文件
- 不再新增聚合式 API 文件
- mock 分支和 real 分支返回结构保持一致

### 4.2 页面层原则

- 删除页面中直接导入 mock 的代码
- 页面只感知 `api`
- 列表、详情、创建、编辑、删除、审批、状态变更统一走 `api`

## 5. 已落地内容

- 新增 `src/api/_config.ts`
- 新增 `src/api/_factory.ts`
- 已补齐并统一改造：
  - `crm.ts`
  - `scm.ts`
  - `mdm.ts`
  - `bom.ts`
  - `routing.ts`
  - `ecn.ts`
  - `mrp.ts`
  - `qms.ts`
  - `wms.ts`
  - `dashboard.ts`
  - `analysis.ts`
  - `aps.ts`
  - `equipment.ts`
  - `energy.ts`
  - `finance.ts`
  - `hr.ts`
- 新增 ESLint 限制，禁止页面/组件/store 直接引用 `@/mock`
- `src/api/business.ts` 已删除，不保留兼容入口

## 6. 验收标准

- `src/views` 中 direct mock import 为 0
- `src/components` 中 direct mock import 为 0
- `src/stores` 中 direct mock import 为 0
- 所有业务数据均通过 `src/api/*` 获取
- `src/api/business.ts` 不存在
- mock 模式下页面可运行
- future real 模式切换时不需要改页面层代码
