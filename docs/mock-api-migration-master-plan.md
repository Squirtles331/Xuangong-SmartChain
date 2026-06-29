# Mock API 迁移总计划

## 1. 架构结论

统一架构如下：

`Page -> src/api/* -> isMockMode ? mockService : http`

强制规则：

- 不保留兼容层
- 不保留 `src/api/business.ts`
- 不允许页面层绕过 `api`

## 2. 模块拆分

当前 API 应按业务边界拆分为：

- `system.ts`
- `work-order.ts`
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

## 3. mock 目录职责

```text
src/mock/
  modules/   # 原始数据
  services/  # mock service
  shared/    # response / paginate / delay / id
```

## 4. 执行批次

### 批次 1：基础设施

- 建立 `src/api/_config.ts`
- 建立 `src/api/_factory.ts`
- 统一 mock 响应结构
- 建立 mock shared 工具

状态：已完成

### 批次 2：API 文件拆分

- 将业务接口拆到独立域文件
- 建立对应 mock service
- 删除聚合兼容文件 `src/api/business.ts`

状态：已完成

### 批次 3：页面迁移

- 页面从 direct mock 改为只调用 `api`
- 清理页面内旧 mock 变量
- 修复统一响应结构后的消费差异

状态：已完成

### 批次 4：收口

- 增加 lint 限制
- 清理 direct mock import
- 校验 type-check
- 校验文档和实现一致

状态：已完成

## 5. 当前验收状态

- [x] `src/views` 不再直接引用 `@/mock`
- [x] `src/components` 不再直接引用 `@/mock`
- [x] `src/stores` 不再直接引用 `@/mock`
- [x] 所有业务页面通过 `src/api/*` 获取数据
- [x] `src/api/business.ts` 已删除
- [x] `npm run type-check` 通过

## 6. 后续规则

- 新页面默认只能新增到某个独立业务 API 文件
- 不允许恢复 `business.ts` 一类聚合兼容入口
- mock 与 real 的切换只能发生在 `src/api/*`
