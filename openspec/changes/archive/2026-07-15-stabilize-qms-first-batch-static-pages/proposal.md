## Why

`WMS` 第一批静态页已经完成当前推荐批次，下一步应按既定模块顺序进入 `QMS`，把质量链正式挂接到执行链上。当前仓库虽然已经存在 `QMS` 的路由、页面骨架和部分 mock/static 服务，但还缺少一份正式变更来冻结这一批页面的范围、页面拆分方式、对象主责边界和静态交付顺序。

如果不先把这些规则写成正式变更，`QMS` 很容易退化成泛质量 CRUD：一方面把来料、过程、完工检验混在同一个任务页里，弱化业务来源对象；另一方面又可能提前把不合格、特采、返工、报废等裁决流与 `MES`、`WMS` 的执行结果混写，导致后续 mock、API 和跨模块联调时反复返工。

## What Changes

- 定义 `QMS` 第一批静态页的正式交付范围，按当前推荐顺序推进：
  - `检验模板`
  - `来料检验`
  - `过程检验`
  - `完工检验`
  - `不合格处置`
- 定义本批页面在当前阶段只交付静态页面结构、静态字段分组、状态标签和静态数据行为，不进入真实 `API` 联调，也不提前扩展复杂 mock 协议。
- 定义本批页面的对象主责边界：
  - `QMS` 主责 `检验任务 / 检验记录 / 不合格处理单 / 裁决结论`
  - `WMS` 继续主责 `到货 / 收货 / 库存批次 / 隔离后的库存控制后果`
  - `MES` 继续主责 `工序执行 / 完工事实 / 返工执行`
- 定义 `QMS` 页面拆分规则：
  - 不再把来料、过程、完工检验长期停留在一个泛化的统一任务入口
  - 三类检验页必须分别挂接 `收货/到货`、`工序执行`、`完工入库` 等来源对象
  - `不合格处置` 作为质量裁决入口单独表达，不与返工执行或库存移动页面混写
- 定义本批页面的前端壳层规则：
  - 标准检验列表页优先使用 `CrudPage`
  - 模板维护页、检验执行页、不合格裁决页在需要明细、结果块、来源关联块时可扩展，但不得脱离统一 CRUD 基线
- 稳定中文菜单命名、路由归属、状态表达、工具栏动作、行操作和默认跳转关系，为后续 mock / API 阶段保留稳定壳层。

## Capabilities

### New Capabilities

- `qms-first-batch-static-pages`: 定义 `QMS` 第一批静态页的页面范围、页面顺序、对象主责边界、静态数据策略和页面壳层规则

### Modified Capabilities

- `phase-one-page-roadmap`: 将阶段路线正式推进到 `WMS` 之后的 `QMS` 第一批页面，并明确这一批优先顺序
- `page-ownership-alignment`: 补充 `QMS` 第一批页面与 `MES`、`WMS` 之间的对象主责和裁决/执行边界

## Impact

- Affected documents:
  - `openspec/changes/stabilize-qms-first-batch-static-pages/*`
- Affected code:
  - `src/router/modules/qms/index.ts`
  - `src/views/qms/template/index.vue`
  - `src/views/qms/inspection/index.vue`
  - `src/views/qms/supplier-quality/index.vue`
  - `src/views/shared/PlannedPage.vue`
  - `src/components/crud/**`
  - `src/static/services/qms.ts`
  - `src/api/qms.ts`
- Affected systems and boundaries:
  - `QMS`
  - `MES`
  - `WMS`
  - static-page delivery baseline
