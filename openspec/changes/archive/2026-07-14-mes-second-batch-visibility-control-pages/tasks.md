## 1. Change Documents

- [x] 1.1 Create the second-batch `MES` `proposal.md`, `design.md`, and `tasks.md`
- [x] 1.2 Add a new capability spec delta for the second-batch control/visibility page baseline
- [x] 1.3 Add related spec deltas for roadmap and ownership alignment

## 2. Menu And Scope

- [x] 2.1 Verify the four-page second-batch `MES` menu scope against the approved delivery order
- [x] 2.2 Keep `工序任务` and `WIP` under `生产执行 > 工序执行`
- [x] 2.3 Keep `生产看板` and `异常中心` under `生产执行 > 追溯与异常`
- [x] 2.4 Keep `齐套检查`, `投料与消耗`, `产品追溯`, `执行日志`, `返工执行`, and `委外工单` outside second-batch acceptance

## 3. Page Structure

- [x] 3.1 Stabilize `工序任务` as a task-pool, dependency, and blocked-signal coordination page
- [x] 3.2 Stabilize `WIP` as a batch-ledger, freeze, and rework-return overview page
- [x] 3.3 Stabilize `生产看板` as a work-center and execution-snapshot visibility page
- [x] 3.4 Stabilize `异常中心` as an exception lock/process/release coordination page

## 4. Object Boundary And Field Canonicalization

- [x] 4.1 Lock the canonical page-level field set for `工序任务池`
- [x] 4.2 Lock the canonical page-level field set for `WIP批次`
- [x] 4.3 Lock the canonical page-level field set for `生产监控快照`
- [x] 4.4 Lock the canonical page-level field set for `执行异常`
- [x] 4.5 Verify that `生产看板` consumes task, WIP, and exception facts rather than redefining them
- [x] 4.6 Verify that `异常中心` references `QMS/WMS/PLM` collaborators without taking over their transactional truth

## 5. State And Interaction

- [x] 5.1 Freeze the `工序任务池` coordination semantics on top of the approved first-batch task flow
- [x] 5.2 Freeze the `WIP批次` freeze / rework / completion semantics for the static phase
- [x] 5.3 Freeze the `生产监控快照` attention / overdue signaling semantics for the static phase
- [x] 5.4 Freeze the `执行异常` lock / process / release semantics for the static phase

## 6. Acceptance

- [x] 6.1 Verify that each second-batch page has exactly one primary object
- [x] 6.2 Verify that second-batch pages remain compatible with the first-batch execution baseline
- [x] 6.3 Verify that second-batch pages do not redefine upstream `PLM` or downstream `WMS/QMS` truth
- [x] 6.4 Verify that the stabilized static-page structure is sufficient to support later mock/API work
