## Why

`MES` 模块已经完成当前推荐批次，项目下一步应按既定主链顺序进入 `WMS`，先把领料、入库、库存这些仓储事务页稳定下来，再进入 `QMS`。当前代码里虽然已经存在 `WMS` 路由和多张页面骨架，但还缺少一份正式变更来锁定这批页面的静态阶段范围、对象边界、页面顺序和前端壳层规则。

如果不先把这些规则写成正式变更，后续开发很容易出现两类漂移：一类是 `WMS` 页面提前带入接口和 mock 心智，绕过当前“静态结构优先”的交付顺序；另一类是页面虽然都在 `WMS` 下，却没有稳定地区分“库存事务真相”“MES 执行引用”“QMS 质量裁决联动”三类边界，导致后面返工。

## What Changes

- 定义 `WMS` 第一批静态事务页的正式范围，按当前推荐顺序推进：
  - `收货入库`
  - `生产领料`
  - `库存台账`
  - `退料退货`
  - `库存盘点`
  - `库存调拨`
- 定义这批页面在当前阶段只交付静态页面和静态数据，不进入真实 `API` 联调，也不提前扩展复杂 mock 协议。
- 定义这批页面的主要对象边界：
  - `WMS` 维护库存批次、库存余额、收发存事务真相
  - `MES` 只作为领料、完工入库、倒冲等来源对象或协同对象出现
  - `QMS` 只负责质量裁决结论，不在本批页面中改写库存真相
- 定义 `WMS` 第一批页面的前端壳层规则：
  - 标准列表事务页优先使用 `CrudPage`
  - 仅在明显属于详情页、执行页、结构页时，才不强行套用 `CrudPage`
- 定义 `MES -> WMS` 当前阶段优先补齐的桥接表达：
  - 生产领料申请/执行关系
  - 完工入库确认关系
  - 倒冲记录关系
- 稳定页面中文命名、菜单归属、状态标签、工具栏动作、行操作和默认跳转关系，为后续 mock / API 阶段留下稳定壳层。

## Capabilities

### New Capabilities

- `wms-first-batch-static-pages`: 定义 `WMS` 第一批静态事务页的页面范围、页面顺序、对象边界、静态数据策略和 CRUD 壳层规则

### Modified Capabilities

- `phase-one-page-roadmap`: 将阶段路线正式推进到 `MES` 之后的 `WMS` 第一批页面，并明确本批优先顺序
- `page-ownership-alignment`: 补充 `WMS` 第一批页面与 `MES`、`QMS` 之间的对象主责和引用边界

## Impact

- Affected documents:
  - `openspec/changes/stabilize-wms-first-batch-static-pages/*`
- Affected code:
  - `src/router/modules/wms/index.ts`
  - `src/views/wms/receipt/index.vue`
  - `src/views/wms/picking/index.vue`
  - `src/views/wms/inventory/index.vue`
  - `src/views/wms/return/index.vue`
  - `src/views/wms/stock-count/index.vue`
  - `src/views/wms/transfer/index.vue`
  - `src/components/crud/**`
  - `src/static/services/wms.ts`
- Affected systems and boundaries:
  - `WMS`
  - `MES`
  - `QMS`
  - static-page delivery baseline
