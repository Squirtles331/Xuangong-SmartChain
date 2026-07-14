## Why

The first four `MES` batches have already stabilized:

- execution entry
- coordination and visibility
- readiness and actual material facts
- traceability and execution audit

One remaining core `MES` execution page is still only a placeholder:

- `返工执行`

This page is sensitive because it sits exactly on the boundary where:

- `QMS` decides whether rework is allowed
- `MES` executes the approved rework chain

If implementation continues without freezing this page first, several risks remain:

- `返工执行` may drift into a quality-decision page and blur `MES` / `QMS` ownership
- `返工执行` may collapse来源关联、返工路径、复检衔接 into a generic工单详情补丁
- later `QMS` or cost-related pages may have to undo weak static state semantics introduced here

This change establishes the fifth-batch `MES` static-page baseline for rework execution.

## What Changes

- Define the formal fifth-batch `MES` static-page scope as:
  - `返工执行`
- Define the primary object for the batch as:
  - `返工单`
- Define the menu ownership for the batch:
  - `返工执行` under `生产执行 > 追溯与异常`
- Define the fifth-batch state semantics:
  - `pending_decision -> released -> executing -> pending_recheck -> closed`
- Define that `返工执行` consumes `QMS` 的返工裁决结果, but MUST NOT replace `QMS` as the owner of the rework-allowed decision
- Define that `返工执行` organizes source linkage, rework route, execution progress, and recheck handoff inside `MES`

## Capabilities

### New Capabilities

- `mes-fifth-batch-rework-execution-page`: defines the `MES` rework-execution page scope, ownership, and static-state semantics

### Modified Capabilities

- `phase-one-page-roadmap`: extends the roadmap from trace/audit pages into the rework-execution page
- `page-ownership-alignment`: adds explicit ownership rules for `返工执行`

## Impact

- Affected documents:
  - `openspec/changes/mes-fifth-batch-rework-execution-page/*`
- Expected implementation targets:
  - `src/router/modules/mes/index.ts`
  - `src/views/mes/work-order/rework-order/index.vue`
- Affected truth boundaries:
  - `MES`
  - `QMS`
