## Why

The first-batch `MES` change has already stabilized the minimum execution truth chain around:

- `生产工单`
- `工序任务`
- `报工记录`

That baseline is enough for the first round of static execution pages, but it does not yet cover the next layer of `MES` pages that production teams use to coordinate, observe, and recover execution work at scale.

The current repository already exposes planned or partial `MES` menus for:

- `工序任务`
- `WIP`
- `生产看板`
- `异常中心`

However, those pages are still outside an approved batch definition. If implementation continues without formalizing the second batch, several risks remain:

- `工序任务` may drift into a duplicate of `我的任务` instead of a coordinator-facing task pool
- `WIP` may drift into warehouse-batch semantics and blur `MES` / `WMS` ownership
- `生产看板` may start maintaining execution truth instead of consuming approved execution facts
- `异常中心` may mix `MES` execution lock/release behavior with `QMS` quality judgment or `WMS` inventory actions

This change establishes the second-batch `MES` static-page baseline so the remaining execution pages can be built in a controlled order without breaking the first-batch object model.

## What Changes

- Define the formal second-batch `MES` static-page scope as:
  - `工序任务`
  - `WIP`
  - `生产看板`
  - `异常中心`
- Define the primary objects for the batch as:
  - `工序任务池`
  - `WIP批次`
  - `生产监控快照`
  - `执行异常`
- Define the menu ownership for the second batch:
  - `工序任务` under `生产执行 > 工序执行`
  - `WIP` under `生产执行 > 工序执行`
  - `生产看板` under `生产执行 > 追溯与异常`
  - `异常中心` under `生产执行 > 追溯与异常`
- Define the second-batch state semantics:
  - `工序任务池`: inherits the first-batch task core flow `pending -> assigned -> running -> completed`, with `blocked` as a coordination flag rather than a new owner state
  - `WIP批次`: `queued -> processing -> frozen -> rework -> completed`
  - `生产监控快照`: `normal -> attention -> overdue`
  - `执行异常`: `identified -> locked -> processing -> awaiting_release -> released -> closed`
- Define that `生产看板` consumes approved task/WIP/exception facts and MUST NOT become their maintenance owner
- Define that `异常中心` owns execution lock/process/release coordination in `MES`, while `QMS` and `WMS` remain owners of their own downstream judgments and transactions
- Keep the following pages outside second-batch acceptance:
  - `齐套检查`
  - `投料与消耗`
  - `产品追溯`
  - `执行日志`
  - `返工执行`
  - `委外工单`

## Capabilities

### New Capabilities

- `mes-second-batch-visibility-control-pages`: defines the second-batch `MES` control and visibility page scope, ownership, and static-state semantics

### Modified Capabilities

- `phase-one-page-roadmap`: extends the roadmap from the first-batch `MES` execution chain into the second-batch control/visibility pages
- `page-ownership-alignment`: adds ownership rules for coordinator, WIP, kanban, and exception pages in `MES`

## Impact

- Affected documents:
  - `openspec/changes/mes-second-batch-visibility-control-pages/*`
- Expected implementation targets:
  - `src/router/modules/mes/index.ts`
  - `src/views/mes/work-order/kanban/index.vue`
  - planned `MES` pages for `工序任务`, `WIP`, and `异常中心`
- Affected truth boundaries:
  - `MES`
  - `WMS`
  - `QMS`
  - `PLM`
