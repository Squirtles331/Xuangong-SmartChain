## Why

`ERP` 首批静态页已经完成了计划承接与总账承接主链，但现有剩余页面仍停留在旧 API/旧 mock 语义上，页面命名、对象边界和静态数据口径都还没有正式冻结。继续推进 `ERP` 时，需要把第二批扩展页在静态阶段先稳定下来，避免后续 `SRM`、`CRM` 和财务分析扩展时继续返工。

## What Changes

- 定义 `ERP` 第二批静态页的正式交付范围，限定为：
  - `预测需求`
  - `多工厂计划`
  - `应付管理`
  - `成本分析`
  - `财务报表`
- 将第二批页面统一切换到 `src/static/services/erp.ts` 的稳定静态数据结构，不再要求页面依赖真实 API 才能验收。
- 冻结第二批页面的主对象边界：
  - `预测需求` 表达 `ERP` 对预测需求的承接与维护，不改写 `CRM` 的订单需求真相
  - `多工厂计划` 表达跨工厂供需平衡建议，不改写 `APS` 排程真相或 `WMS` 库存真相
  - `应付管理` 表达 `ERP` 应付承接对象，不等同于源单据维护页或资金执行页
  - `成本分析` 表达 `ERP` 成本结果聚合，不改写 `PLM`、`MES`、`WMS` 的源事实
  - `财务报表` 表达 `ERP` 经营报表聚合，不扩展成 `BI` 驾驶舱
- 统一第二批页面的静态壳层：
  - `预测需求`、`应付管理` 使用共享 CRUD 壳层
  - `多工厂计划`、`成本分析`、`财务报表` 使用结果/分析页壳层，但仍保持共享头部、摘要卡片和静态数据组织基线

## Capabilities

### New Capabilities
- `erp-second-batch-static-pages`: 定义 `ERP` 第二批静态页的范围、对象边界、静态数据策略和页面壳层规则

### Modified Capabilities
- `phase-one-page-roadmap`: 在 `ERP` 首批页面完成后，继续明确 `ERP` 第二批扩展页的静态推进顺序
- `page-ownership-alignment`: 补充 `ERP` 第二批页面与 `CRM`、`APS`、`PLM`、`MES`、`WMS`、`SRM` 之间的对象边界

## Impact

- Affected documents:
  - `openspec/specs/phase-one-page-roadmap/spec.md`
  - `openspec/specs/page-ownership-alignment/spec.md`
  - `openspec/specs/erp-second-batch-static-pages/spec.md`
- Affected code:
  - `src/static/services/erp.ts`
  - `src/views/erp/mrp/forecast/index.vue`
  - `src/views/erp/mrp/multi-plant/index.vue`
  - `src/views/erp/mrp/forecast/ForecastFormDialog.vue`
  - `src/views/erp/finance/index/index.vue`
  - `src/views/erp/finance/index/FinanceIndexFormDialog.vue`
  - `src/views/erp/finance/cost/index.vue`
  - `src/views/erp/finance/report/index.vue`
- Affected systems and boundaries:
  - `ERP`
  - `CRM`
  - `APS`
  - `PLM`
  - `MES`
  - `WMS`
  - `SRM`
