## Why

The first two `MES` batches have already stabilized:

- the execution-entry chain around `生产工单`、`工序任务`、`报工记录`
- the coordination and visibility layer around `工序任务池`、`WIP批次`、`生产监控快照`、`执行异常`

However, the `MES` execution menu still has two important planned pages that sit between on-site execution and downstream warehouse/quality collaboration:

- `开工齐套检查`
- `投料与消耗`

Those pages are not generic satellites. They are the readiness and actual-consumption layer that decides whether execution can legally start and how on-site material facts should be captured afterward.

If implementation continues without freezing this batch first, several risks remain:

- `开工齐套检查` may drift into a warehouse prep page and blur `MES` / `WMS` ownership
- `开工齐套检查` may also drift into final quality release semantics and blur `MES` / `QMS` ownership
- `投料与消耗` may collapse warehouse issue completion and actual production consumption into one concept
- later `WMS` and `QMS` pages may have to undo static-page fields and state tags introduced here

This change establishes the third-batch `MES` static-page baseline for readiness and material-fact capture before mock or API design begins.

## What Changes

- Define the formal third-batch `MES` static-page scope as:
  - `开工齐套检查`
  - `投料与消耗`
- Define the primary objects for the batch as:
  - `开工放行条件`
  - `投料消耗记录`
- Define the menu ownership for the batch:
  - `开工齐套检查` under `生产执行 > 工序执行`
  - `投料与消耗` under `生产执行 > 工序执行`
- Define the third-batch state semantics:
  - `开工放行条件`: `collecting -> ready -> blocked -> released`
  - `投料消耗记录`: `draft -> in_use -> reconciled -> closed`
- Define that `开工齐套检查` consumes `PLM` version truth, `WMS` 备料/批次就绪信号, and `QMS` 放行前置条件, but MUST NOT become the truth owner of any of those downstream or upstream objects
- Define that `投料与消耗` owns现场实际投料与消耗事实 in `MES`, while `WMS` remains the truth owner of领料、退料、补料 and other inventory movements
- Keep the following pages outside third-batch acceptance:
  - `产品追溯`
  - `执行日志`
  - `返工执行`
  - `委外工单`

## Capabilities

### New Capabilities

- `mes-third-batch-material-readiness-pages`: defines the third-batch `MES` readiness and material-fact page scope, ownership, and static-state semantics

### Modified Capabilities

- `phase-one-page-roadmap`: extends the roadmap from second-batch control/visibility pages into the readiness and material-fact batch
- `page-ownership-alignment`: adds ownership rules for `开工齐套检查` and `投料与消耗`

## Impact

- Affected documents:
  - `openspec/changes/mes-third-batch-material-readiness-pages/*`
- Expected implementation targets:
  - `src/router/modules/mes/index.ts`
  - `src/views/mes/work-order/kitting/index.vue`
  - `src/views/mes/work-order/consumption/index.vue`
- Affected truth boundaries:
  - `MES`
  - `WMS`
  - `QMS`
  - `PLM`
