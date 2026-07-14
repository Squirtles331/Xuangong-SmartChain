## 1. Change Documents

- [x] 1.1 Create the third-batch `MES` `proposal.md`, `design.md`, and `tasks.md`
- [x] 1.2 Add a new capability spec delta for the third-batch readiness/material page baseline
- [x] 1.3 Add related spec deltas for roadmap and ownership alignment

## 2. Menu And Scope

- [x] 2.1 Verify the two-page third-batch `MES` menu scope against the approved delivery order
- [x] 2.2 Keep `开工齐套检查` and `投料与消耗` under `生产执行 > 工序执行`
- [x] 2.3 Keep `产品追溯`, `执行日志`, `返工执行`, and `委外工单` outside third-batch acceptance

## 3. Page Structure

- [x] 3.1 Stabilize `开工齐套检查` as a readiness, release, and blocked-signal page
- [x] 3.2 Stabilize `投料与消耗` as an actual-consumption, supplement, and reconciliation page

## 4. Object Boundary And Field Canonicalization

- [x] 4.1 Lock the canonical page-level field set for `开工放行条件`
- [x] 4.2 Lock the canonical page-level field set for `投料消耗记录`
- [x] 4.3 Verify that `开工齐套检查` consumes `PLM/WMS/QMS` readiness facts without taking over their truth
- [x] 4.4 Verify that `投料与消耗` owns actual consumption facts but does not redefine warehouse stock movement truth

## 5. State And Interaction

- [x] 5.1 Freeze the `开工放行条件` collecting / ready / blocked / released semantics for the static phase
- [x] 5.2 Freeze the `投料消耗记录` draft / in_use / reconciled / closed semantics for the static phase

## 6. Acceptance

- [x] 6.1 Verify that each third-batch page has exactly one primary object
- [x] 6.2 Verify that third-batch pages remain compatible with the first- and second-batch execution baselines
- [x] 6.3 Verify that third-batch pages do not redefine upstream `PLM` or downstream `WMS/QMS` truth
- [x] 6.4 Verify that the stabilized static-page structure is sufficient to support later mock/API work
