## 1. Change Documents

- [x] 1.1 Create the fifth-batch `MES` `proposal.md`, `design.md`, and `tasks.md`
- [x] 1.2 Add a new capability spec delta for the rework-execution page baseline
- [x] 1.3 Add related spec deltas for roadmap and ownership alignment

## 2. Menu And Scope

- [x] 2.1 Verify the single-page fifth-batch `MES` scope against the approved delivery order
- [x] 2.2 Keep `返工执行` under `生产执行 > 追溯与异常`

## 3. Page Structure

- [x] 3.1 Stabilize `返工执行` as a source-linkage, route, recheck, and closure page

## 4. Object Boundary And Field Canonicalization

- [x] 4.1 Lock the canonical page-level field set for `返工单`
- [x] 4.2 Verify that `返工执行` consumes `QMS` rework-decision truth without taking it over

## 5. State And Interaction

- [x] 5.1 Freeze the `返工单` pending_decision / released / executing / pending_recheck / closed semantics for the static phase

## 6. Acceptance

- [x] 6.1 Verify that the page has exactly one primary object
- [x] 6.2 Verify that the page remains compatible with the first four execution baselines
- [x] 6.3 Verify that the page preserves the `QMS decides / MES executes` ownership split
- [x] 6.4 Verify that the stabilized static-page structure is sufficient to support later mock/API work
