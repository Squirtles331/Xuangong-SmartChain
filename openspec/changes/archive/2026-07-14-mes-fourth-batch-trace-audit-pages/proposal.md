## Why

The first three `MES` batches have already stabilized:

- execution entry around `生产工单`、`工序任务`、`报工记录`
- control and visibility around `工序任务池`、`WIP批次`、`生产监控快照`、`执行异常`
- readiness and actual material facts around `开工放行条件`、`投料消耗记录`

The next missing layer is not another execution-control page. It is the information layer that lets teams reconstruct what happened afterward:

- `产品追溯`
- `执行日志`

Those pages must stay trace-and-audit focused. If implementation starts without a formal batch definition, several risks remain:

- `产品追溯` may drift into a generic工单详情增强页 instead of a true cross-object trace chain
- `产品追溯` may also drift into final quality conclusion ownership and blur `MES` / `QMS`
- `执行日志` may drift into a low-value debug log page instead of an operator-facing审计轨迹 page
- later `QMS/WMS/IoT` pages may have to undo weak trace field definitions introduced here

This change establishes the fourth-batch `MES` static-page baseline for traceability and execution audit visibility.

## What Changes

- Define the formal fourth-batch `MES` static-page scope as:
  - `产品追溯`
  - `执行日志`
- Define the primary objects for the batch as:
  - `产品追溯链`
  - `执行审计记录`
- Define the menu ownership for the batch:
  - `产品追溯` under `生产执行 > 追溯与异常`
  - `执行日志` under `生产执行 > 追溯与异常`
- Define the fourth-batch state semantics:
  - `产品追溯链`: `linked -> partial -> isolated`
  - `执行审计记录`: `captured -> highlighted -> archived`
- Define that `产品追溯` organizes cross-object trace links in `MES`, but MUST NOT replace `QMS` final judgments, `WMS` stock-movement truth, or `IoT` device telemetry ownership
- Define that `执行日志` captures user-facing execution audit records in `MES`, but MUST NOT become a technical debugging console or backend log sink
- Keep the following pages outside fourth-batch acceptance:
  - `返工执行`
  - `委外工单`

## Capabilities

### New Capabilities

- `mes-fourth-batch-trace-audit-pages`: defines the fourth-batch `MES` traceability and execution-audit page scope, ownership, and static-state semantics

### Modified Capabilities

- `phase-one-page-roadmap`: extends the roadmap from readiness/material pages into traceability/audit pages
- `page-ownership-alignment`: adds ownership rules for `产品追溯` and `执行日志`

## Impact

- Affected documents:
  - `openspec/changes/mes-fourth-batch-trace-audit-pages/*`
- Expected implementation targets:
  - `src/router/modules/mes/index.ts`
  - `src/views/mes/work-order/product-trace/index.vue`
  - `src/views/mes/work-order/production-log/index.vue`
- Affected truth boundaries:
  - `MES`
  - `QMS`
  - `WMS`
  - `IoT`
