## Why

当前 `PLM` 下的 `BOM` 分析链已经补齐了 `结构版本比较` 与 `用量展开/反查`，但 `结构成本估算` 仍停留在非常早期的单表加饼图工具页形态。

这会带来几个问题：

- 页面没有纳入统一的 `PLM` 页面归属、边界说明和静态优先结构；
- 成本估算虽然不是 `ERP` 的最终核算结果，但它是 `PLM` 在版本评估、ECN 取舍和路线切换前的重要派生分析入口；
- 如果这张页面不先稳定，后续 `ERP`、`MES`、`采购` 侧就会继续各自解释结构成本、工时成本和制造费用口径。

## What Changes

- 将 `PLM` 下的 `结构成本估算` 页面重写为静态优先分析页。
- 在 `PLM` 路由中补齐该页的主责归属、协同系统、核心对象和边界说明。
- 固定成本页的查询区、概览卡片、成本明细表、成本构成图和详情抽屉结构。
- 明确 `PLM` 负责基于 `BOM + 工艺路线` 的估算口径，`ERP` 负责最终财务核算口径。

## Capabilities

### New Capabilities

- `plm-bom-cost-page`: 定义 `PLM` 结构成本估算静态页的结构、成本分层表达和与 `ERP` 的边界。

### Modified Capabilities

- `product-navigation`: 需要让 `结构成本估算` 在路由元信息中表达 `PLM / ERP` 边界。

## Impact

- 受影响文档：`openspec/changes/2026-07-14-stabilize-plm-bom-cost-page/*`
- 受影响代码：`src/router/modules/plm/index.ts`、`src/views/plm/bom/cost/index.vue`
- 受影响业务边界：`PLM`、`ERP`、`MES`
