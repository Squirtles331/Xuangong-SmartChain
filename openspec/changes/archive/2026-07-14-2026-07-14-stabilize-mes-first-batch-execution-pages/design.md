## Context

The repository-level delivery order is already established:

`MDM -> PLM -> MES -> WMS -> QMS`

The practical next step is not to open all `MES` menus at once, but to stabilize a minimal execution chain that downstream transaction and quality pages can inherit directly. In the current codebase, that minimal chain is:

`生产工单 -> 工序任务 -> 报工记录`

Those three objects are already visible in the current `MES` routes and page skeletons, but the implementation still behaves like an in-progress collection of pages rather than an approved batch baseline.

The current instability points are:

- the first-batch `MES` page scope has not been formally frozen
- some pages still risk behaving like generic CRUD lists rather than object-specific execution pages
- `工序报工` can easily drift into quality-judgment behavior if its scope is not explicitly limited
- `工单详情` can easily drift into a mixed `MES/WMS/QMS` transaction hub if relation blocks are not distinguished from ownership blocks
- field naming is still partially transitional in places like `current_operation`, `op_name`, and `qualified/defective/hours`

This change stabilizes the first-batch page structure and boundaries before mock/API work begins.

## Goals / Non-Goals

**Goals**

- Freeze the exact first-batch `MES` page scope
- Freeze the primary objects served by each of those pages
- Freeze the work-order, task, and report status semantics for static pages
- Freeze the menu grouping, hidden-page routing, and page-to-page jump chain
- Freeze the boundary where `MES` consumes upstream `PLM` truth and only references downstream `WMS/QMS` truth

**Non-Goals**

- This change does not introduce real APIs
- This change does not introduce new mock payload design
- This change does not fully implement `WIP`, `齐套检查`, `投料与消耗`, `异常中心`, or `委外工单`
- This change does not make `生产看板` part of the first-batch acceptance core
- This change does not redesign `PLM` routing or BOM data structures

## Decisions

### Decision 1: The first batch SHALL be limited to six pages

The formal first-batch `MES` static pages are:

- `工单列表`
- `新建工单`
- `工单详情`
- `我的任务`
- `工序报工`
- `报工记录`

The following pages remain outside the first-batch acceptance scope:

- `生产看板`
- `WIP`
- `齐套检查`
- `投料与消耗`
- `异常中心`
- `委外工单`

This keeps the batch centered on the minimum execution truth chain.

### Decision 2: Page ownership SHALL follow object ownership rather than menu breadth

- `工单列表` / `新建工单` / `工单详情` serve the `生产工单` object
- `我的任务` serves the `工序任务` object
- `工序报工` / `报工记录` serve the `报工记录` object

This prevents the first batch from collapsing into a single generic execution workspace.

### Decision 3: Reporting fact capture SHALL remain separate from quality judgment

`工序报工` records execution facts:

- qualified quantity
- defective quantity
- defect reasons
- actual labor time
- reporting timestamp

It MUST NOT become the final owner of quality judgment outcomes such as accept / concession / scrap / return decisions. Those belong to later `QMS` work.

### Decision 4: Work-order detail SHALL expose relation blocks without taking downstream ownership

`工单详情` MAY expose:

- operation list
- material-issue overview
- operation log
- quality gate markers

It MUST NOT become the primary maintenance page for:

- warehouse issue/return transactions
- finished-goods inbound transactions
- inspection judgment transactions

This keeps `MES` execution truth visible without collapsing `WMS` or `QMS` truth boundaries.

### Decision 5: Hidden execution pages SHALL hang back to stable primary entries

- `新建工单` and `工单详情` hang back to `工单列表`
- `工序报工` hangs back to `我的任务`

This preserves a stable user-facing navigation path while keeping the main execution chain easy to understand.

### Decision 6: Transitional field names MAY exist briefly, but the approved direction SHALL be frozen now

Approved direction:

- `current_operation` should evolve toward `current_operation_no` + `current_operation_name`
- `op_name` should evolve toward `operation_name`
- `qualified/defective/hours` should evolve toward `qualified_qty/defective_qty/actual_hours`

Static pages may temporarily keep compatibility fields, but later mock/API design MUST inherit the approved naming direction.

## Risks / Trade-offs

- Risk: `生产看板` already exists and may appear ready enough to include now
  - Mitigation: keep it routable, but leave it outside first-batch acceptance so the execution truth chain is stabilized first
- Risk: field names are partially transitional and not all current code will align immediately
  - Mitigation: approve the direction now and allow the first implementation pass to normalize the page-level structures gradually
- Risk: users may expect `工单详情` to fully perform warehouse or quality actions
  - Mitigation: explicitly present those sections as relation/overview blocks rather than transaction-maintenance blocks

## Migration Plan

1. Create the OpenSpec change for the `MES` first-batch execution-page baseline
2. Add the new `mes-first-batch-execution-pages` capability delta
3. Add roadmap and ownership-alignment spec deltas so the batch order and truth boundaries remain synchronized
4. Align `src/router/modules/mes/index.ts` with the approved page grouping and hidden-page behavior
5. Refine the six target pages against the approved object split, field groups, and button matrix
6. Only after static-page acceptance, proceed into mock payload and API planning
