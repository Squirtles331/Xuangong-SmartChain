## Why

当前 `PLM` 第一批次中的 `BOM列表`、`BOM编辑`、`工程变更`、`工艺路线`、`工序定义` 已基本进入静态优先形态，但 `结构版本比较` 与 `BOM展开/反查` 仍停留在早期工具页状态。

这两个页面目前存在三个明显问题：

- 页面结构过于轻量，没有承接 `PLM` 页面已经统一的归属说明、概览信息和状态表达；
- `BOM` 差异与结构展开虽然是下游 `MES / WMS / QMS` 频繁消费的分析入口，但当前没有把版本影响、路线绑定、替代策略和变更单关联表达出来；
- 这两页如果不先稳定，后续 `MES` 领料、反查、版本切换和现场问题追溯仍会自行补结构字段，继续破坏上游定义统一。

## What Changes

- 为 `PLM` 下的 `结构版本比较` 页面补齐静态阶段应有的查询区、概览卡片、差异表格、详情抽屉和导出动作。
- 为 `PLM` 下的 `BOM展开/反查` 页面补齐统一的查询条件、模式切换、概览卡片、结果表格和节点详情结构。
- 在 `PLM` 路由中补齐这两张分析页的主责归属、核心对象和边界说明，让页面在导航层也符合统一对象口径。
- 固定 `BOM` 差异与反查页中的版本、工艺路线、变更单、替代策略、库存/执行影响等结构表达，为后续 mock 与接口阶段复用。

## Capabilities

### New Capabilities

- `plm-bom-analysis-pages`: 定义 `PLM` 下 `结构版本比较` 与 `BOM展开/反查` 的静态页结构、状态表达和下游消费边界。

### Modified Capabilities

- `product-navigation`: 需要让 `PLM` 分析页在路由元信息上也清晰表达主责归属与对象边界。

## Impact

- 受影响文档：`openspec/changes/2026-07-14-stabilize-plm-bom-analysis-pages/*`
- 受影响代码：`src/router/modules/plm/index.ts`、`src/views/plm/bom/compare/index.vue`、`src/views/plm/bom/explode/index.vue`
- 受影响业务边界：`PLM`、`MES`、`WMS`、`QMS`
