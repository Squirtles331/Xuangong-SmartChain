# 静态页面基线变更实施审计说明

## 1. 文档目的

本说明用于补充 `establish-unified-object-static-page-baseline` 变更在归档时未回填 `tasks.md` 勾选状态的问题。

结论先行：

- 这条变更不是“全部未开发”
- 更准确的状态是“文档基线与大量静态页面已落地，但 tasks 未同步回填”
- `mock / API` 相关任务基本尚未正式开始，因此保持未完成是合理的

## 2. 总体判断

按归档时的实际代码和文档状态，可将任务分成三类：

1. 已实际完成，但未在 `tasks.md` 中勾选
2. 已完成主要页面或材料，但交付口径还不够完整，只能算部分完成
3. 尚未正式进入实施阶段

## 3. 已完成但未勾选

### 3.1 基线收敛

以下任务应视为“已完成但未回填”：

- `1.1` 将 `docs/` 中的对象目录、字段标准、状态流和页面路线图整理为统一开发参考入口
- `1.2` 为第一阶段核心对象建立页面-对象-字段-状态对照清单
- `1.3` 为静态页评审建立统一检查项

对应材料：

- [docs/master-data-object-catalog.md](D:/Project/玄工智链/docs/master-data-object-catalog.md)
- [docs/core-data-field-standard.md](D:/Project/玄工智链/docs/core-data-field-standard.md)
- [docs/object-state-flow-matrix.md](D:/Project/玄工智链/docs/object-state-flow-matrix.md)
- [docs/page-development-priority-roadmap.md](D:/Project/玄工智链/docs/page-development-priority-roadmap.md)
- [docs/page-object-mapping-matrix.md](D:/Project/玄工智链/docs/page-object-mapping-matrix.md)
- [docs/page-refactor-standard.md](D:/Project/玄工智链/docs/page-refactor-standard.md)
- [docs/ui-foundation-baseline-plan.md](D:/Project/玄工智链/docs/ui-foundation-baseline-plan.md)

### 3.2 MDM 第一批静态页

以下任务应视为“页面已完成”：

- `2.1` 物料静态页
- `2.2` 仓库 / 库位静态页
- `2.3` 客户 / 供应商静态页

对应页面：

- [src/views/mdm/material/index.vue](D:/Project/玄工智链/src/views/mdm/material/index.vue)
- [src/views/mdm/warehouse/index.vue](D:/Project/玄工智链/src/views/mdm/warehouse/index.vue)
- [src/views/mdm/warehouse-location/index.vue](D:/Project/玄工智链/src/views/mdm/warehouse-location/index.vue)
- [src/views/mdm/customer/index.vue](D:/Project/玄工智链/src/views/mdm/customer/index.vue)
- [src/views/mdm/supplier/index.vue](D:/Project/玄工智链/src/views/mdm/supplier/index.vue)

此外，本次还实际补齐了更多主数据页，超出原任务最低要求：

- `batch-strategy`
- `bom-master`
- `code-rule`
- `equipment`
- `inspection-item`
- `inspection-standard`
- `material-category`
- `operation-master`
- `process-parameter`
- `production-line`
- `resource-capability`
- `routing-master`
- `status-dict`
- `substitute-strategy`
- `unit`
- `work-center`

### 3.3 PLM 第一批静态页

以下任务应视为“页面已完成”：

- `3.1` `EBOM / MBOM` 页面结构、版本表达、状态标签
- `3.2` `工艺路线 / 工序定义` 页面结构和详情区块
- `3.3` `ECN` 页面结构和状态流展示

对应页面：

- [src/views/plm/bom/list/index.vue](D:/Project/玄工智链/src/views/plm/bom/list/index.vue)
- [src/views/plm/bom/editor/index.vue](D:/Project/玄工智链/src/views/plm/bom/editor/index.vue)
- [src/views/plm/bom/compare/index.vue](D:/Project/玄工智链/src/views/plm/bom/compare/index.vue)
- [src/views/plm/bom/explode/index.vue](D:/Project/玄工智链/src/views/plm/bom/explode/index.vue)
- [src/views/plm/ecn/list/index.vue](D:/Project/玄工智链/src/views/plm/ecn/list/index.vue)
- [src/views/plm/routing/index.vue](D:/Project/玄工智链/src/views/plm/routing/index.vue)
- [src/views/plm/routing/editor/index.vue](D:/Project/玄工智链/src/views/plm/routing/editor/index.vue)

### 3.4 执行链路入口页

以下任务应视为“已完成主要静态页交付”：

- `4.1` 工单页面
- `4.2` 报工页面
- `4.3` 领料 / 退料 / 入库页面

对应页面：

- [src/views/mes/work-order/list/index.vue](D:/Project/玄工智链/src/views/mes/work-order/list/index.vue)
- [src/views/mes/work-order/detail/index.vue](D:/Project/玄工智链/src/views/mes/work-order/detail/index.vue)
- [src/views/mes/work-order/report/index.vue](D:/Project/玄工智链/src/views/mes/work-order/report/index.vue)
- [src/views/wms/picking/index.vue](D:/Project/玄工智链/src/views/wms/picking/index.vue)
- [src/views/wms/return/index.vue](D:/Project/玄工智链/src/views/wms/return/index.vue)
- [src/views/wms/receipt/index.vue](D:/Project/玄工智链/src/views/wms/receipt/index.vue)

## 4. 部分完成但不建议直接勾选

以下任务已有明显成果，但从交付口径看，还不建议简单改为“已完成”：

- `2.4` 沉淀 `MDM` 第一批统一静态数据结构与字段映射说明
- `3.4` 沉淀 `PLM` 第一批统一静态数据结构与字段映射说明
- `4.4` 设计 `来料 / 过程 / 完工检验` 页面结构与裁决区块

原因如下：

### 4.1 `2.4` / `3.4`

虽然已有以下支撑文档：

- [docs/page-object-mapping-matrix.md](D:/Project/玄工智链/docs/page-object-mapping-matrix.md)
- [docs/master-data-object-catalog.md](D:/Project/玄工智链/docs/master-data-object-catalog.md)
- [docs/object-state-flow-matrix.md](D:/Project/玄工智链/docs/object-state-flow-matrix.md)

但它们更偏“全局基线文档”，并非严格针对“MDM 第一批”或“PLM 第一批”的独立交付说明。

因此更准确的判断是：

- 相关能力已经形成
- 但任务要求的专项成果未单独收口

### 4.2 `4.4`

已有质量相关页面：

- [src/views/qms/inspection/index.vue](D:/Project/玄工智链/src/views/qms/inspection/index.vue)
- [src/views/qms/template/index.vue](D:/Project/玄工智链/src/views/qms/template/index.vue)
- [src/views/qms/supplier-quality/index.vue](D:/Project/玄工智链/src/views/qms/supplier-quality/index.vue)

但从任务语义看，原意更接近：

- 明确拆分并表达 `来料检验`
- `过程检验`
- `完工检验`
- 以及对应的裁决区块

当前页面已经有基础，但未完全体现为“三类检验分型 + 裁决结构完全收口”的状态，因此判定为“部分完成”更准确。

## 5. 尚未开始或未正式进入实施阶段

以下任务应视为“未完成”：

- `5.1` 静态页评审通过清单，作为进入 mock 的前置门槛
- `5.2` `MDM` 与 `PLM` 第一批页面的 mock 列表、详情和状态流结构
- `5.3` 执行链路页面的 mock 头表、明细、关系和轨迹结构
- `5.4` 基于稳定 mock 输出后续 API DTO 设计清单和边界说明

判断依据：

- 当前仓库中已有 mock 规划文档，但未看到这条变更下按批次正式产出的 mock 数据结构交付物
- 本次变更的主线一直强调“静态页先于 mock”，而实际也主要停留在静态页与布局/路由/对象基线阶段
- 归档时并未发现与本批页面严格对应的 API DTO 清单

## 6. 建议的真实任务状态

若在归档前对 `tasks.md` 做真实回填，更合理的状态应为：

### 建议勾选为已完成

- `1.1`
- `1.2`
- `1.3`
- `2.1`
- `2.2`
- `2.3`
- `3.1`
- `3.2`
- `3.3`
- `4.1`
- `4.2`
- `4.3`

### 建议标记为部分完成

- `2.4`
- `3.4`
- `4.4`

### 建议保持未完成

- `5.1`
- `5.2`
- `5.3`
- `5.4`

## 7. 归档说明补充结论

因此，这条变更的真实实施状态可以概括为：

- 已完成“统一对象基线 + 大批量静态页落地 + 路由与布局重构”
- 未完成“mock 批次交付 + API DTO 批次设计”
- `tasks.md` 未勾选的核心原因是“归档前未做任务状态回填”，不是“全部未开发”

后续若需要继续推进，建议不要从头重开，而是直接基于本次归档成果新开一条变更，重点覆盖：

1. 第一批页面任务状态回填与专项交付收口
2. `QMS` 检验分型页补齐
3. 第一批 `mock` 结构设计
4. API DTO 边界设计
