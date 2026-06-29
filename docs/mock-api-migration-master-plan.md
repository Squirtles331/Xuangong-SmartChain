# Mock API 迁移总计划

> 基于 `mock-api-migration-plan.md` 框架，按当前项目真实代码现状制定的完整执行计划。

## 一、现状全景

### 1.1 项目规模

| 维度                    | 数量                              |
| ----------------------- | --------------------------------- |
| 总页面数（index.vue）   | 96                                |
| 业务模块数              | 18                                |
| 直连 `@/mock` 的页面    | 29                                |
| 正确使用 `@/api` 的页面 | 2（ConfigView、dict）             |
| 现有 API 文件           | 3（system、work-order、business） |
| 现有 Mock 文件          | 10（扁平结构，无 service 层）     |

### 1.2 现有架构缺陷

```
当前：Page → @/mock（直连数据）
      Page → @/api → http → 真实后端

目标：Page → @/api → isMockMode ? mock service : http
```

### 1.3 直连 @/mock 的 29 个页面清单

| 模块               | 页面       | 文件                                  |
| ------------------ | ---------- | ------------------------------------- |
| **work-order** (6) | 工单列表   | `views/work-order/list/index.vue`     |
|                    | 工单详情   | `views/work-order/detail/index.vue`   |
|                    | 创建工单   | `views/work-order/create/index.vue`   |
|                    | 工单看板   | `views/work-order/kanban/index.vue`   |
|                    | 我的任务   | `views/work-order/my-tasks/index.vue` |
|                    | 报工记录   | `views/work-order/report/index.vue`   |
| **system** (6)     | 菜单管理   | `views/system/menu/index.vue`         |
|                    | 字典管理   | `views/system/dict/index.vue`         |
|                    | 系统参数   | `views/system/params/index.vue`       |
|                    | 操作日志   | `views/system/audit/index.vue`        |
|                    | 编码规则   | `views/system/code-rule/index.vue`    |
|                    | 审批流配置 | `views/system/approval/index.vue`     |
| **crm** (3)        | 客户管理   | `views/crm/customer/index.vue`        |
|                    | 销售订单   | `views/crm/order/index.vue`           |
|                    | 应收台账   | `views/crm/receivable/index.vue`      |
| **mdm** (3)        | 物料管理   | `views/mdm/material/index.vue`        |
|                    | 组织管理   | `views/mdm/organization/index.vue`    |
|                    | 制造资源   | `views/mdm/resource/index.vue`        |
| **scm** (2)        | 供应商     | `views/scm/supplier/index.vue`        |
|                    | 采购订单   | `views/scm/purchase/index.vue`        |
| **bom** (2)        | BOM 列表   | `views/bom/list/index.vue`            |
|                    | BOM 编辑器 | `views/bom/editor/index.vue`          |
| **routing** (1)    | 工艺编辑器 | `views/routing/editor/index.vue`      |
| **ecn** (1)        | ECN 列表   | `views/ecn/list/index.vue`            |
| **mrp** (1)        | MRP 结果   | `views/mrp/result/index.vue`          |
| **qms** (1)        | 质检任务   | `views/qms/inspection/index.vue`      |
| **wms** (1)        | 条码打印   | `views/wms/barcode-print/index.vue`   |
| **首页** (1)       | 首页       | `views/HomeView.vue`                  |
| **settings** (1)   | 日志视图   | `views/settings/LogView.vue`          |

---

## 二、目标架构

### 2.1 目录结构

```
src/
  api/
    _config.ts              # VITE_API_MODE 判断 + isMockMode
    _factory.ts             # 统一响应包装工厂
    system.ts               # 系统管理（已有，需增强 mock 分支）
    work-order.ts           # 工单管理（已有，需增强 mock 分支）
    crm.ts                  # 【新增】客户/订单/应收
    scm.ts                  # 【新增】供应商/采购/退货
    mdm.ts                  # 【新增】物料/组织/资源/工作中心/模具
    bom.ts                  # 【新增】BOM 管理
    routing.ts              # 【新增】工艺路线
    ecn.ts                  # 【新增】ECN 变更
    mrp.ts                  # 【新增】MRP 运算
    qms.ts                  # 【新增】质量管理
    wms.ts                  # 【新增】仓储管理
    dashboard.ts            # 【新增】首页/仪表盘
  mock/
    modules/                # 原始 mock 数据（从现有 mock/*.ts 迁移）
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
      energy.ts
      finance.ts
      hr.ts
    services/               # mock 服务层（含 CRUD 模拟逻辑）
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
    shared/                 # 公共工具
      response.ts           # ApiResponse 包装
      paginate.ts           # 分页模拟
      delay.ts              # 模拟网络延迟
      id.ts                 # ID 生成器
    index.ts                # 统一导出（保持向后兼容）
```

### 2.2 API 层模式

```ts
// src/api/_config.ts
export const isMockMode = import.meta.env.VITE_API_MODE === 'mock'

// src/api/system.ts（改造后）
import { isMockMode } from './_config'
import http from '@/utils/http'
import * as mockService from '@/mock/services/system'

export function getUserList(params: UserQuery) {
  if (isMockMode) return mockService.getUserList(params)
  return http.get('/system/users', { params })
}
```

### 2.3 Mock Service 返回格式

```ts
// 列表
{ code: 200, data: { items: [], total: 0, page: 1, page_size: 10 }, message: 'success' }

// 详情
{ code: 200, data: { ...item }, message: 'success' }

// 操作
{ code: 200, data: null, message: '操作成功' }
```

---

## 三、18 个模块全量清单 & 页面分级

### 3.1 模块页面总览

| #   | 模块       | 页面数 | 直连mock | 骨架页 | 迁移优先级 |
| --- | ---------- | ------ | -------- | ------ | ---------- |
| 1   | work-order | 9      | 6        | 0      | P0         |
| 2   | system     | 11     | 6        | 0      | P0         |
| 3   | crm        | 8      | 3        | 5      | P1         |
| 4   | scm        | 6      | 2        | 4      | P1         |
| 5   | mdm        | 5      | 3        | 2      | P1         |
| 6   | bom        | 5      | 2        | 3      | P1         |
| 7   | routing    | 3      | 1        | 2      | P2         |
| 8   | ecn        | 1      | 1        | 0      | P2         |
| 9   | mrp        | 5      | 1        | 4      | P1         |
| 10  | qms        | 3      | 1        | 2      | P2         |
| 11  | wms        | 11     | 1        | 10     | P2         |
| 12  | aps        | 2      | 0        | 2      | P3         |
| 13  | energy     | 3      | 0        | 3      | P3         |
| 14  | equipment  | 6      | 0        | 6      | P3         |
| 15  | ehs        | 4      | 0        | 4      | P3         |
| 16  | finance    | 4      | 0        | 4      | P3         |
| 17  | hr         | 5      | 0        | 5      | P3         |
| 18  | iot        | 5      | 0        | 5      | P3         |

### 3.2 各模块完整页面清单

<details>
<summary>work-order（9 页）</summary>

| 页面     | 文件                             | 直连mock | 状态      |
| -------- | -------------------------------- | -------- | --------- |
| 工单列表 | `work-order/list/index.vue`      | ✅       | 含CRUD    |
| 工单详情 | `work-order/detail/index.vue`    | ✅       | 含工序    |
| 创建工单 | `work-order/create/index.vue`    | ✅       | 含BOM预览 |
| 工单看板 | `work-order/kanban/index.vue`    | ✅       | 看板视图  |
| 我的任务 | `work-order/my-tasks/index.vue`  | ✅       | 三栏布局  |
| 报工记录 | `work-order/report/index.vue`    | ✅       | 报工历史  |
| 工单拆分 | `work-order/split/index.vue`     | ❌       | 骨架      |
| 委外加工 | `work-order/outsource/index.vue` | ❌       | 骨架      |
| 工单追溯 | `work-order/trace/index.vue`     | ❌       | 骨架      |

</details>

<details>
<summary>system（11 页）</summary>

| 页面       | 文件                            | 直连mock | 状态           |
| ---------- | ------------------------------- | -------- | -------------- |
| 用户管理   | `system/user/index.vue`         | ❌       | 已接api        |
| 角色管理   | `system/role/index.vue`         | ❌       | 含子组件       |
| 菜单管理   | `system/menu/index.vue`         | ✅       | 树形CRUD       |
| 字典管理   | `system/dict/index.vue`         | ✅       | 同时用api+mock |
| 系统参数   | `system/params/index.vue`       | ✅       | 参数配置       |
| 操作日志   | `system/audit/index.vue`        | ✅       | 日志列表       |
| 编码规则   | `system/code-rule/index.vue`    | ✅       | 规则配置       |
| 审批流配置 | `system/approval/index.vue`     | ✅       | 流程配置       |
| 文件管理   | `system/file/index.vue`         | ❌       | 骨架           |
| 通知管理   | `system/notification/index.vue` | ❌       | 骨架           |
| SSO 配置   | `system/sso/index.vue`          | ❌       | 骨架           |

</details>

<details>
<summary>crm（8 页）</summary>

| 页面     | 文件                         | 直连mock | 状态   |
| -------- | ---------------------------- | -------- | ------ |
| 客户管理 | `crm/customer/index.vue`     | ✅       | 含CRUD |
| 销售订单 | `crm/order/index.vue`        | ✅       | 含CRUD |
| 应收台账 | `crm/receivable/index.vue`   | ✅       | 列表   |
| 合同管理 | `crm/contract/index.vue`     | ❌       | 骨架   |
| 报价管理 | `crm/quotation/index.vue`    | ❌       | 骨架   |
| 发货通知 | `crm/invoice/index.vue`      | ❌       | 骨架   |
| 订单变更 | `crm/order-change/index.vue` | ❌       | 骨架   |
| 商机管理 | `crm/opportunity/index.vue`  | ❌       | 骨架   |

</details>

<details>
<summary>scm（6 页）</summary>

| 页面       | 文件                             | 直连mock | 状态   |
| ---------- | -------------------------------- | -------- | ------ |
| 供应商管理 | `scm/supplier/index.vue`         | ✅       | 含CRUD |
| 采购订单   | `scm/purchase/index.vue`         | ✅       | 含CRUD |
| 采购申请   | `scm/purchase-request/index.vue` | ❌       | 骨架   |
| 价格管理   | `scm/price/index.vue`            | ❌       | 骨架   |
| 退货管理   | `scm/return/index.vue`           | ❌       | 骨架   |
| 供应商门户 | `scm/portal/index.vue`           | ❌       | 骨架   |

</details>

<details>
<summary>mdm（5 页）</summary>

| 页面     | 文件                         | 直连mock | 状态            |
| -------- | ---------------------------- | -------- | --------------- |
| 物料管理 | `mdm/material/index.vue`     | ✅       | 含分类树        |
| 组织管理 | `mdm/organization/index.vue` | ✅       | 含组织树        |
| 制造资源 | `mdm/resource/index.vue`     | ✅       | 含设备/工作中心 |
| 模具管理 | `mdm/mold/index.vue`         | ❌       | 骨架            |
| 工作中心 | `mdm/work-center/index.vue`  | ❌       | 骨架            |

</details>

<details>
<summary>bom（5 页）</summary>

| 页面       | 文件                    | 直连mock | 状态     |
| ---------- | ----------------------- | -------- | -------- |
| BOM 列表   | `bom/list/index.vue`    | ✅       | 版本管理 |
| BOM 编辑器 | `bom/editor/index.vue`  | ✅       | 树形编辑 |
| BOM 对比   | `bom/compare/index.vue` | ❌       | 骨架     |
| BOM 展开   | `bom/explode/index.vue` | ❌       | 骨架     |
| 成本核算   | `bom/cost/index.vue`    | ❌       | 骨架     |

</details>

<details>
<summary>routing（3 页）</summary>

| 页面       | 文件                          | 直连mock | 状态     |
| ---------- | ----------------------------- | -------- | -------- |
| 工艺编辑器 | `routing/editor/index.vue`    | ✅       | 工序序列 |
| 自动工时   | `routing/auto-time/index.vue` | ❌       | 骨架     |
| 并行工序   | `routing/parallel/index.vue`  | ❌       | 骨架     |

</details>

<details>
<summary>mrp（5 页）</summary>

| 页面      | 文件                        | 直连mock | 状态               |
| --------- | --------------------------- | -------- | ------------------ |
| MRP 结果  | `mrp/result/index.vue`      | ✅       | 建议采购/生产/例外 |
| 需求预测  | `mrp/forecast/index.vue`    | ❌       | 骨架               |
| 历史记录  | `mrp/history/index.vue`     | ❌       | 骨架               |
| 多工厂MRP | `mrp/multi-plant/index.vue` | ❌       | 骨架               |
| 净变更MRP | `mrp/net-change/index.vue`  | ❌       | 骨架               |

</details>

<details>
<summary>ecn（1 页）</summary>

| 页面     | 文件                 | 直连mock | 状态     |
| -------- | -------------------- | -------- | -------- |
| ECN 列表 | `ecn/list/index.vue` | ✅       | 变更管理 |

</details>

<details>
<summary>qms（3 页）</summary>

| 页面       | 文件                             | 直连mock | 状态     |
| ---------- | -------------------------------- | -------- | -------- |
| 质检任务   | `qms/inspection/index.vue`       | ✅       | 检验管理 |
| 供应商质量 | `qms/supplier-quality/index.vue` | ❌       | 骨架     |
| 检验模板   | `qms/template/index.vue`         | ❌       | 骨架     |

</details>

<details>
<summary>wms（11 页）</summary>

| 页面     | 文件                          | 直连mock | 状态     |
| -------- | ----------------------------- | -------- | -------- |
| 条码打印 | `wms/barcode-print/index.vue` | ✅       | 打印功能 |
| 库存查询 | `wms/inventory/index.vue`     | ❌       | 骨架     |
| 收货管理 | `wms/receipt/index.vue`       | ❌       | 骨架     |
| 发货管理 | `wms/delivery/index.vue`      | ❌       | 骨架     |
| 拣货管理 | `wms/picking/index.vue`       | ❌       | 骨架     |
| 调拨管理 | `wms/transfer/index.vue`      | ❌       | 骨架     |
| 盘点管理 | `wms/stock-count/index.vue`   | ❌       | 骨架     |
| 退货管理 | `wms/return/index.vue`        | ❌       | 骨架     |
| 倒冲管理 | `wms/backflush/index.vue`     | ❌       | 骨架     |
| 条码管理 | `wms/barcode/index.vue`       | ❌       | 骨架     |
| 扫码管理 | `wms/barcode-scan/index.vue`  | ❌       | 骨架     |

</details>

---

## 四、分阶段执行计划

### 阶段 1：搭建 Mock 基础设施（1 批次）

**目标**：建立统一出口，让 `api` 层能根据 `VITE_API_MODE` 切换 mock/real。

**任务清单**：

| #    | 任务                                            | 产出                                                                    | 状态 |
| ---- | ----------------------------------------------- | ----------------------------------------------------------------------- | ---- |
| 1.1  | 创建 `src/mock/shared/response.ts`              | `wrapListResponse()` / `wrapDetailResponse()` / `wrapSuccessResponse()` | ⬜   |
| 1.2  | 创建 `src/mock/shared/paginate.ts`              | `paginate(array, page, pageSize, filter?)`                              | ⬜   |
| 1.3  | 创建 `src/mock/shared/delay.ts`                 | `simulateDelay(ms?)`                                                    | ⬜   |
| 1.4  | 创建 `src/mock/shared/id.ts`                    | `generateId()`                                                          | ⬜   |
| 1.5  | 创建 `src/api/_config.ts`                       | `isMockMode` 导出                                                       | ⬜   |
| 1.6  | 创建 `src/api/_factory.ts`                      | API 包装工厂（可选）                                                    | ⬜   |
| 1.7  | 添加 `VITE_API_MODE=mock` 到 `.env.development` | 环境变量                                                                | ⬜   |
| 1.8  | 创建 `src/mock/modules/` 目录，迁移现有数据     | 数据与逻辑分离                                                          | ⬜   |
| 1.9  | 创建 `src/mock/services/system.ts`（示范）      | 第一个 mock service                                                     | ⬜   |
| 1.10 | 改造 `src/api/system.ts` 增加 mock 分支（示范） | 验证端到端链路                                                          | ⬜   |

**验收标准**：

- `src/api/system.ts` 在 mock 模式下可返回数据
- `src/api/_config.ts` 的 `isMockMode` 可正常工作
- mock service 返回结构与 `http` 拦截器期望一致

---

### 阶段 2：补全所有模块 API + Mock Service（4 批次）

**目标**：每个模块在 `src/api` 和 `src/mock/services` 中都有完整出口。

#### 批次 2.1：核心业务模块

| #     | API 文件                        | Mock Service                  | Mock Module                  | 涉及页面 |
| ----- | ------------------------------- | ----------------------------- | ---------------------------- | -------- |
| 2.1.1 | `src/api/work-order.ts`（改造） | `mock/services/work-order.ts` | `mock/modules/work-order.ts` | 9页      |
| 2.1.2 | `src/api/crm.ts`（新建）        | `mock/services/crm.ts`        | `mock/modules/crm.ts`        | 8页      |
| 2.1.3 | `src/api/scm.ts`（新建）        | `mock/services/scm.ts`        | `mock/modules/scm.ts`        | 6页      |
| 2.1.4 | `src/api/mdm.ts`（新建）        | `mock/services/mdm.ts`        | `mock/modules/mdm.ts`        | 5页      |

#### 批次 2.2：BOM/工艺/ECN/MRP 模块

| #     | API 文件                     | Mock Service               | Mock Module               | 涉及页面 |
| ----- | ---------------------------- | -------------------------- | ------------------------- | -------- |
| 2.2.1 | `src/api/bom.ts`（新建）     | `mock/services/bom.ts`     | `mock/modules/bom.ts`     | 5页      |
| 2.2.2 | `src/api/routing.ts`（新建） | `mock/services/routing.ts` | `mock/modules/routing.ts` | 3页      |
| 2.2.3 | `src/api/ecn.ts`（新建）     | `mock/services/ecn.ts`     | `mock/modules/ecn.ts`     | 1页      |
| 2.2.4 | `src/api/mrp.ts`（新建）     | `mock/services/mrp.ts`     | `mock/modules/mrp.ts`     | 5页      |

#### 批次 2.3：QMS/WMS 模块

| #     | API 文件                 | Mock Service           | Mock Module           | 涉及页面 |
| ----- | ------------------------ | ---------------------- | --------------------- | -------- |
| 2.3.1 | `src/api/qms.ts`（新建） | `mock/services/qms.ts` | `mock/modules/qms.ts` | 3页      |
| 2.3.2 | `src/api/wms.ts`（新建） | `mock/services/wms.ts` | `mock/modules/wms.ts` | 11页     |

#### 批次 2.4：Dashboard + 清理 business.ts

| #     | API 文件                                          | Mock Service                 | Mock Module                 | 涉及页面 |
| ----- | ------------------------------------------------- | ---------------------------- | --------------------------- | -------- |
| 2.4.1 | `src/api/dashboard.ts`（新建）                    | `mock/services/dashboard.ts` | `mock/modules/dashboard.ts` | HomeView |
| 2.4.2 | 拆分 `src/api/business.ts`，逻辑迁移到新 API 文件 | -                            | -                           | -        |

---

### 阶段 3：逐模块迁移页面（5 批次）

**目标**：29 个直连 mock 的页面全部改为调用 `@/api`。

**通用迁移规则**：

1. 删除 `import { xxx } from '@/mock'`
2. 替换为 `import { xxx } from '@/api/xxx'`
3. 删除页面内本地 mock 过滤/CRUD 逻辑
4. 列表页统一为：`loadList → searchForm → pagination → tableData`
5. 详情页统一为：`loadDetail(id)`
6. 新增/编辑/删除/状态变更统一走 `api`

#### 批次 3.1：work-order 模块（6 页）

| 页面                  | 当前 mock 引用          | 替换为 api                                          |
| --------------------- | ----------------------- | --------------------------------------------------- |
| `work-order/list`     | `workOrders as mockWOs` | `getWorkOrderList()`                                |
| `work-order/detail`   | 工序数据                | `getWorkOrderDetail()` + `getWorkOrderOperations()` |
| `work-order/create`   | BOM 预览                | `createWorkOrder()` + `getBOMTree()`                |
| `work-order/kanban`   | `kanbanOps`             | `getKanbanData()`                                   |
| `work-order/my-tasks` | `myTasks`               | `getMyTasks()`                                      |
| `work-order/report`   | `reportHistory`         | `getReportHistory()` + `reportOperation()`          |

#### 批次 3.2：system 模块（6 页）

| 页面               | 当前 mock 引用            | 替换为 api                                                         |
| ------------------ | ------------------------- | ------------------------------------------------------------------ |
| `system/menu`      | `menuTree`                | `getMenuTree()` / `createMenu()` / `updateMenu()` / `deleteMenu()` |
| `system/dict`      | `dictTypes` / `dictItems` | 已有 api，清理 mock 直引                                           |
| `system/params`    | `systemParams`            | `getSystemParams()` / `updateSystemParam()`                        |
| `system/audit`     | `auditLogs`               | `getAuditLogs()`                                                   |
| `system/code-rule` | `codeRules`               | `getCodeRules()`                                                   |
| `system/approval`  | `approvalFlows`           | `getApprovalFlows()`                                               |

#### 批次 3.3：crm + scm + mdm（8 页）

| 页面               | 当前 mock 引用                         | 替换为 api                                |
| ------------------ | -------------------------------------- | ----------------------------------------- |
| `crm/customer`     | `customers`                            | `getCustomerList()`                       |
| `crm/order`        | `salesOrders`                          | `getSalesOrderList()`                     |
| `crm/receivable`   | `receivables`                          | `getReceivableList()`                     |
| `scm/supplier`     | `suppliers`                            | `getSupplierList()`                       |
| `scm/purchase`     | `purchaseOrders`                       | `getPurchaseOrderList()`                  |
| `mdm/material`     | `materialList` / `materialTree`        | `getMaterialList()` / `getMaterialTree()` |
| `mdm/organization` | `orgTree`                              | `getOrgTree()`                            |
| `mdm/resource`     | `equipments` / `workCenters` / `molds` | `getEquipmentList()` 等                   |

#### 批次 3.4：bom + routing + ecn + mrp + qms（6 页）

| 页面             | 当前 mock 引用                                            | 替换为 api                           |
| ---------------- | --------------------------------------------------------- | ------------------------------------ |
| `bom/list`       | `bomList`                                                 | `getBOMList()`                       |
| `bom/editor`     | `bomTree`                                                 | `getBOMTree()` / `saveBOM()`         |
| `routing/editor` | `routingOperations`                                       | `getRoutingList()` / `saveRouting()` |
| `ecn/list`       | `ecnOrders`                                               | `getECNList()`                       |
| `mrp/result`     | `mrpPurchaseList` / `mrpProductionList` / `mrpExceptions` | `getMRPResults()`                    |
| `qms/inspection` | `inspectionTasks`                                         | `getInspectionTaskList()`            |

#### 批次 3.5：wms + HomeView + settings（3 页）

| 页面                | 当前 mock 引用 | 替换为 api           |
| ------------------- | -------------- | -------------------- |
| `wms/barcode-print` | `wmsMaterials` | `getMaterialList()`  |
| `HomeView`          | 各模块统计     | `getDashboardData()` |
| `settings/LogView`  | 日志数据       | `getAuditLogs()`     |

---

### 阶段 4：收口约束与清理（1 批次）

**目标**：防止后续绕过 `api` 层。

| #   | 任务                                  | 说明                                             |
| --- | ------------------------------------- | ------------------------------------------------ |
| 4.1 | 全局搜索 `@/mock` 残留引用            | 确认 views/components/stores 中为 0              |
| 4.2 | 清理 `src/mock/index.ts` 中的直接导出 | 改为从 `services/` 导出                          |
| 4.3 | 清理 `src/api/business.ts`            | 逻辑全部分散到模块 API 文件后删除                |
| 4.4 | 添加 ESLint 规则                      | 禁止 `src/views`、`src/components` 直引 `@/mock` |
| 4.5 | 更新 `README.md` 开发规范             | 明确新页面必须走 api 层                          |
| 4.6 | 全量功能回归测试                      | mock 模式下所有列表/详情/CRUD 可用               |

---

## 五、总时间线

```
阶段 1（基础设施）    ████████░░░░░░░░░░░░  1 批次
阶段 2（API+Service）  ░░░░░░░░████████████░░  4 批次
阶段 3（页面迁移）    ░░░░░░░░░░░░░░░░░░████  5 批次
阶段 4（收口清理）    ░░░░░░░░░░░░░░░░░░░░██  1 批次
```

| 阶段   | 批次 | 预估工作量                            |
| ------ | ---- | ------------------------------------- |
| 阶段 1 | 1 批 | 基础设施搭建                          |
| 阶段 2 | 4 批 | 10 个新 API 文件 + 12 个 mock service |
| 阶段 3 | 5 批 | 29 个页面迁移                         |
| 阶段 4 | 1 批 | 清理验证                              |

---

## 六、验收标准

改造完成后必须满足：

- [ ] `src/views` 下直接引用 `@/mock` 数量为 **0**
- [ ] `src/components` 下直接引用 `@/mock` 数量为 **0**
- [ ] `src/stores` 下直接引用 `@/mock` 数量为 **0**
- [ ] 所有页面业务数据从 `src/api` 获取
- [ ] mock 模式下，所有模块的列表、详情、创建、编辑、删除、状态流转可运行
- [ ] 切换到 real 模式时，不需要修改页面代码
- [ ] `src/api/business.ts` 已拆分或删除
- [ ] 新 API 文件覆盖所有 18 个模块
