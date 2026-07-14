## Why

The repository has already stabilized the first-phase upstream foundation through `MDM` and the first-batch `PLM` static pages. The next recommended delivery step is to enter `MES` and stabilize the manufacturing execution chain before expanding into `WMS`, `QMS`, or later business-collaboration modules.

The current codebase already contains `MES` route groups and page skeletons for work orders, task execution, reporting, and trace records. However, those pages are not yet formalized as a first-batch execution baseline. The repo still lacks an approved change that locks:

- the exact first-batch `MES` page scope
- the primary objects owned by those pages
- the work-order, task, and report status semantics
- the menu placement and hidden-page active-menu behavior
- the truth boundary between `PLM`, `MES`, `WMS`, and `QMS`

If implementation continues without formalizing those decisions, later static-page work can drift in several ways:

- `MES` pages may redefine `PLM` objects such as BOM or routing versions
- work-order pages and task pages may both act like generic execution lists without a stable object split
- reporting pages may collapse execution fact capture and quality judgment into one page
- downstream `WMS` and `QMS` pages may later require avoidable field and state rework

This change establishes the first-batch `MES` execution-page baseline before mock or API design starts.

## What Changes

- Define the formal first-batch `MES` static-page scope as:
  - `工单列表`
  - `新建工单`
  - `工单详情`
  - `我的任务`
  - `工序报工`
  - `报工记录`
- Define the primary execution objects for the batch as:
  - `生产工单`
  - `工序任务`
  - `报工记录`
- Define the menu ownership and hidden-page active-menu behavior for the first batch:
  - `工单列表` under `生产执行 > 工单`
  - `我的任务` under `生产执行 > 工序执行`
  - `报工记录` under `生产执行 > 追溯与异常`
  - `新建工单` / `工单详情` / `工序报工` as hidden pages that hang back to their primary entry pages
- Define the first-batch status flows:
  - `生产工单`: `draft -> approved -> released -> in_progress -> completed -> closed`
  - `工序任务`: `pending -> assigned -> running -> completed`
  - `报工记录`: `draft -> submitted -> confirmed`
- Define the static-phase boundary that `MES` consumes released `PLM` versions without redefining BOM, routing, or operation objects locally
- Define the static-phase boundary that `MES` may show inventory and quality relation blocks but MUST NOT become the truth owner for `WMS` or `QMS` transactional objects
- Stabilize the field groups, action matrix, and page-to-page jumps for the first-batch execution flow before mock/API work begins

## Capabilities

### New Capabilities

- `mes-first-batch-execution-pages`: defines the first-batch `MES` execution-page scope, page structure, state semantics, and ownership boundary

### Modified Capabilities

- `phase-one-page-roadmap`: extends the phase-one roadmap from upstream definition pages into the first `MES` execution batch
- `page-ownership-alignment`: adds explicit ownership and truth-boundary rules for first-batch `MES` execution pages

## Impact

- Affected documents:
  - `openspec/changes/2026-07-14-stabilize-mes-first-batch-execution-pages/*`
- Affected code:
  - `src/router/modules/mes/index.ts`
  - `src/views/mes/work-order/list/index.vue`
  - `src/views/mes/work-order/create/index.vue`
  - `src/views/mes/work-order/detail/index.vue`
  - `src/views/mes/work-order/my-tasks/index.vue`
  - `src/views/mes/work-order/report/index.vue`
  - `src/views/mes/work-order/trace/index.vue`
  - `src/api/work-order.ts`
- Affected truth boundaries:
  - `MES`
  - `PLM`
  - `WMS`
  - `QMS`
