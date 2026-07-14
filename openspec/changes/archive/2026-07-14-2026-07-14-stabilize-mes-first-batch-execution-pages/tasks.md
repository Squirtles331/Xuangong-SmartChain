## 1. Change Documents

- [x] 1.1 Create the `MES` first-batch execution-page `proposal.md`, `design.md`, and `tasks.md`
- [x] 1.2 Add a new capability spec delta for the `MES` first-batch execution-page baseline
- [x] 1.3 Add related spec deltas for roadmap and ownership alignment

## 2. Menu And Ownership

- [x] 2.1 Verify the `MES` menu grouping and page titles against the approved first-batch scope
- [x] 2.2 Keep `工单列表` as the primary entry under `生产执行 > 工单`
- [x] 2.3 Keep `我的任务` as the primary entry under `生产执行 > 工序执行`
- [x] 2.4 Keep `报工记录` as the primary entry under `生产执行 > 追溯与异常`
- [x] 2.5 Keep `新建工单`, `工单详情`, and `工序报工` as hidden pages with stable active-menu return paths

## 3. Page Structure

- [x] 3.1 Stabilize `工单列表` query area, table columns, and row-action matrix
- [x] 3.2 Stabilize `新建工单` as a step-based creation flow with BOM and routing version previews
- [x] 3.3 Stabilize `工单详情` as a head/detail page with operation, material-overview, and log sections
- [x] 3.4 Stabilize `我的任务` as the execution entry for assigned, running, and completed task states
- [x] 3.5 Stabilize `工序报工` around report form, report history, and defect analysis blocks
- [x] 3.6 Stabilize `报工记录` as a reporting-history query page with detail inspection

## 4. Object Boundary And Field Canonicalization

- [x] 4.1 Lock the canonical page-level field set for `生产工单`
- [x] 4.2 Lock the canonical page-level field set for `工序任务`
- [x] 4.3 Lock the canonical page-level field set for `报工记录`
- [x] 4.4 Verify that `MES` pages consume released `PLM` BOM and routing versions rather than redefining them
- [x] 4.5 Verify that `MES` pages only show `WMS/QMS` relation blocks and do not become their truth owner

## 5. State And Interaction

- [x] 5.1 Freeze the `生产工单` state flow and button-visibility matrix
- [x] 5.2 Freeze the `工序任务` state flow and execution actions
- [x] 5.3 Freeze the `报工记录` submit/confirm semantics for the static phase
- [x] 5.4 Verify that the page-to-page jump chain covers the first-batch execution flow cleanly

## 6. Acceptance

- [x] 6.1 Verify that each first-batch page has exactly one primary object
- [x] 6.2 Verify that no first-batch `MES` page redefines upstream `PLM` truth
- [x] 6.3 Verify that no first-batch `MES` page takes over downstream `WMS` or `QMS` transactional truth
- [x] 6.4 Verify that the stabilized static-page structure is sufficient to support later mock/API work
