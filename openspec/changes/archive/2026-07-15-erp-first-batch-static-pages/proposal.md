## Why

`APS` 首批静态页已经完成并归档，按当前项目模块顺序，下一步应正式进入 `ERP`。仓库里虽然已经存在 `ERP` 路由和多张页面，但当前实现仍混合了计划输入、计划承接和财务分析语义，尤其 `需求池` 仍是占位页，而部分财务页的菜单命名与页面实际对象也没有完全对齐，容易在后续 mock、API 和跨模块联动阶段持续返工。

## What Changes

- 定义 `ERP` 首批静态页的正式交付范围，限制为：
  - `需求池`
  - `物料需求结果`
  - `物料需求历史`
  - `净变更计划`
  - `总账对账`
- 明确本批页面当前阶段只交付静态页面结构、静态字段、状态表达、默认跳转关系和稳定静态数据，不进入真实 API 联调。
- 明确 `ERP` 首批页面的主对象边界：
  - `ERP` 主责 `计划需求`、`MRP 建议结果`、`MRP 历史运行`、`净变更影响`、`总账分录 / 对账结果`
  - `APS` 继续主责排程结果与排程建议，不反向被 `ERP` 改写
  - `MES`、`WMS`、`CRM` 继续分别主责执行事实、库存事实和销售订单需求源，不被 `ERP` 页面重定义
- 冻结本批页面拆分规则：
  - `需求池` 表达 `ERP` 侧计划输入汇总，不等同于 `CRM` 销售订单列表或 `APS` 排程结果页
  - `物料需求结果` 表达 `ERP` 侧采购建议与生产建议承接，不等同于采购执行页或 MES 工单执行页
  - `物料需求历史` 表达 `ERP` 侧历史运行与版本回看，不等同于 BI 报表
  - `净变更计划` 表达需求/供给变化后的影响重算，不等同于 APS 扰动重排页
  - `总账对账` 表达 ERP 核算承接结果，不等同于业务源单维护页
- 对齐前端基线：
  - `需求池` 优先使用标准 CRUD 页面壳层
  - `MRP` 结果链页面可保留结果视图、建议动作和运行摘要，但必须保持统一页头、动作区和静态数据组织方式
  - `总账对账` 保持查询/台账页语义，不提前扩成经营分析大屏

## Capabilities

### New Capabilities

- `erp-first-batch-static-pages`: 定义 `ERP` 首批静态页的交付范围、对象边界、页面拆分方式、静态数据策略和页面壳层规则

### Modified Capabilities

- `phase-one-page-roadmap`: 将当前主链从 `APS` 完成后正式推进到 `ERP` 首批静态页，并明确首批优先顺序
- `page-ownership-alignment`: 补充 `ERP` 首批页面与 `APS`、`MES`、`WMS`、`CRM` 之间的计划承接、执行事实和财务核算边界

## Impact

- Affected documents:
  - `openspec/specs/phase-one-page-roadmap/spec.md`
  - `openspec/specs/page-ownership-alignment/spec.md`
  - `openspec/specs/erp-first-batch-static-pages/spec.md`
- Affected code:
  - `src/router/modules/erp/index.ts`
  - `src/views/erp/mrp/result/index.vue`
  - `src/views/erp/mrp/history/index.vue`
  - `src/views/erp/mrp/net-change/index.vue`
  - `src/views/erp/finance/ledger/index.vue`
  - `src/views/erp/finance/index/index.vue`
  - `src/static/services/erp.ts` or equivalent ERP static data layer
- Affected systems and boundaries:
  - `ERP`
  - `APS`
  - `MES`
  - `WMS`
  - `CRM`
  - static-page delivery baseline
