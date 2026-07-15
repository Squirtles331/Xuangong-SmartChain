## Why

`ERP` 静态页面功能已经完成并归档，按当前项目的正式模块顺序，下一步应进入 `SRM`，再衔接 `CRM`。仓库里虽然已经存在 `SRM` 路由和多张页面，但当前实现仍停留在旧壳层、旧静态语义和未冻结的对象边界上，如果不先把 `SRM` 第一批静态页范围、协同对象和上下游真相边界正式收口，后续实现、mock 和 API 阶段会持续返工。

## What Changes

- 定义 `SRM` 第一批静态页的正式交付范围，限制为：
  - `采购申请`
  - `采购订单`
  - `采购退货`
- 明确本批页面当前阶段只交付静态页面结构、静态字段、状态表达、默认跳转关系和稳定静态数据，不进入真实 API 联调。
- 冻结第一批页面的主对象边界：
  - `采购申请` 表达 `SRM` 侧采购协同发起对象，不等同于 `ERP` 采购建议真相或 `MDM` 供应商主数据维护页
  - `采购订单` 表达 `SRM` 侧供应商协同订单对象，不等同于 `WMS` 收货事务页或 `ERP` 应付承接页
  - `采购退货` 表达 `SRM` 侧供应商退货协同对象，不等同于 `QMS` 质量裁决页或 `WMS` 库存修正页
- 统一第一批页面的静态壳层规则：
  - `采购申请`、`采购订单`、`采购退货` 统一采用共享 CRUD 页面基线
  - 页面允许扩展供应商响应、收货关联、退货原因等业务块，但不得引入新的页面壳层体系
- 明确第一批排除范围：
  - `价格协议`
  - `供应商协同`

## Capabilities

### New Capabilities
- `srm-first-batch-static-pages`: 定义 `SRM` 第一批静态页的交付范围、主对象边界、静态数据策略和页面壳层规则

### Modified Capabilities
- `phase-one-page-roadmap`: 在 `ERP` 完成后正式把下一批推荐顺序推进到 `SRM`，并明确 `CRM` 跟随 `SRM`
- `page-ownership-alignment`: 补充 `SRM` 第一批页面与 `MDM`、`ERP`、`WMS`、`QMS` 之间的采购协同、收货事务、质量裁决和财务承接边界

## Impact

- Affected documents:
  - `openspec/specs/phase-one-page-roadmap/spec.md`
  - `openspec/specs/page-ownership-alignment/spec.md`
  - `openspec/specs/srm-first-batch-static-pages/spec.md`
- Affected code:
  - `src/router/modules/srm/index.ts`
  - `src/views/srm/purchase-request/index.vue`
  - `src/views/srm/purchase-request/PurchaseRequestFormDialog.vue`
  - `src/views/srm/purchase-request/PurchaseRequestConvertDialog.vue`
  - `src/views/srm/purchase/index.vue`
  - `src/views/srm/purchase/PurchaseFormDialog.vue`
  - `src/views/srm/purchase/PurchaseReceiveDialog.vue`
  - `src/views/srm/return/index.vue`
  - `src/views/srm/return/ReturnFormDialog.vue`
  - `src/static/services/srm.ts` or equivalent SRM static data layer
- Affected systems and boundaries:
  - `SRM`
  - `MDM`
  - `ERP`
  - `WMS`
  - `QMS`
  - static-page delivery baseline
