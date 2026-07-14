## Context

The current repo-level order remains:

`MDM -> PLM -> MES -> WMS -> QMS`

Within `MES`, the first batch has already stabilized the execution entry chain:

`生产工单 -> 我的任务 -> 工序报工 -> 报工记录`

The next `MES` batch should not reopen the first-batch scope. It should extend from that stabilized chain into the pages that coordinate the broader production floor:

- task-pool coordination
- WIP visibility and control
- production snapshot monitoring
- execution-exception recovery

This second batch is still static-first. It is not the right moment to design real workflow engines, approval APIs, or cross-system transaction interfaces.

## Goals / Non-Goals

**Goals**

- Freeze the exact second-batch `MES` page scope
- Freeze the primary object served by each second-batch page
- Freeze the control and visibility semantics that must stay consistent with the first-batch execution chain
- Freeze menu placement and cross-page boundaries before static implementation begins
- Freeze the line between `MES` execution coordination and downstream `WMS` / `QMS` truth

**Non-Goals**

- This change does not redesign first-batch pages
- This change does not introduce real APIs or workflow engines
- This change does not make `齐套检查` or `投料与消耗` part of second-batch acceptance
- This change does not build full product-level traceability
- This change does not replace `QMS` quality judgment or `WMS` inventory movement ownership

## Decisions

### Decision 1: The second batch SHALL be limited to four visible pages

The formal second-batch `MES` static pages are:

- `工序任务`
- `WIP`
- `生产看板`
- `异常中心`

The following pages remain outside the second-batch acceptance scope:

- `齐套检查`
- `投料与消耗`
- `产品追溯`
- `执行日志`
- `返工执行`
- `委外工单`

This keeps the batch centered on the next coordination layer instead of opening the entire remaining `MES` menu tree.

### Decision 2: `工序任务` SHALL be the coordinator view of the same task truth used by `我的任务`

`我的任务` remains the worker-facing execution entry for assigned work.

`工序任务` becomes the coordinator-facing task pool page that can:

- view the task pool
- track dependencies
- observe blocked tasks
- coordinate status progression

It MUST inherit the first-batch task core flow:

`pending -> assigned -> running -> completed`

`blocked` MAY appear as a coordination flag or exception signal, but it MUST NOT silently redefine the approved task truth model.

### Decision 3: `WIP` SHALL own execution-stage WIP truth, not warehouse inventory truth

`WIP` serves the `WIP批次` object in `MES`.

It MAY expose:

- current operation
- freeze / unfreeze markers
- rework return context
- flow progression

It MUST NOT be treated as:

- warehouse inventory batch truth
- stock-on-hand truth
- finished-goods inbound truth

Those remain downstream `WMS` transaction objects.

### Decision 4: `生产看板` SHALL be a consumption page, not a maintenance page

`生产看板` serves `生产监控快照`.

Its purpose is to aggregate and present:

- task status
- WIP pressure
- exception attention signals
- work-center progress

It MUST consume approved execution facts from other `MES` objects.
It MUST NOT become the place where work orders, tasks, or exceptions are maintained as source truth.

### Decision 5: `异常中心` SHALL own execution lock/process/release coordination only

`异常中心` serves the `执行异常` object.

Its approved static-stage lifecycle is:

`identified -> locked -> processing -> awaiting_release -> released -> closed`

It MAY coordinate:

- scope locking
- recovery action progress
- release checkpoints
- collaboration references

It MUST NOT replace:

- `QMS` quality judgment conclusions
- `WMS` inventory postings
- `PLM` engineering revision truth

### Decision 6: Second-batch pages SHALL stay compatible with the first-batch object chain

The second batch extends the first batch. It does not redefine it.

Therefore:

- `工序任务` must align with `我的任务`
- `WIP` must align with the current operation and reporting facts already approved
- `生产看板` must derive from approved truth instead of inventing new facts
- `异常中心` must reference the same task/work-order/report chain already stabilized

## Risks / Trade-offs

- Risk: `工序任务` can overlap too much with `我的任务`
  - Mitigation: define it explicitly as a coordinator page rather than a worker page
- Risk: `WIP` can be mistaken for a warehouse stock page
  - Mitigation: freeze `WIP批次` as execution-stage truth and keep stock movement outside the page boundary
- Risk: `生产看板` can become a shortcut entry for editing source truth
  - Mitigation: freeze it as a consumption-only snapshot page
- Risk: `异常中心` can absorb too many downstream responsibilities
  - Mitigation: keep it limited to lock/process/release orchestration with explicit collaborator references

## Migration Plan

1. Create the OpenSpec change for the second-batch `MES` control and visibility pages
2. Add the new `mes-second-batch-visibility-control-pages` capability delta
3. Extend roadmap and ownership-alignment specs so the batch order and truth boundaries remain synchronized
4. Align `MES` routing and menu grouping with the approved second-batch scope
5. Implement static pages for `工序任务`, `WIP`, `生产看板`, and `异常中心`
6. Only after static acceptance, proceed into mock/API planning for the remaining `MES` pages
