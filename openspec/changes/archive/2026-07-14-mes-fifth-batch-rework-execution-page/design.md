## Context

The current repo-level order remains:

`MDM -> PLM -> MES -> WMS -> QMS`

Inside `MES`, the first four batches already cover the main execution, coordination, readiness, and traceability layers.

The remaining core page in this phase is `返工执行`, which should not be treated as a generic satellite. It is the execution page for a rework chain that was already judged and allowed elsewhere.

This batch remains static-first. It is not the right moment to design real cost settlement, final quality-return logic, or repair-capability planning.

## Goals / Non-Goals

**Goals**

- Freeze the exact fifth-batch `MES` page scope
- Freeze the primary object served by the page
- Freeze the state semantics for the approved rework execution chain
- Keep the page compatible with the first four `MES` batches
- Preserve the ownership split where `QMS` decides and `MES` executes

**Non-Goals**

- This change does not redesign the first four batches
- This change does not make `委外工单` part of the same batch
- This change does not move rework-decision ownership out of `QMS`
- This change does not introduce real cost, settlement, or API workflows

## Decisions

### Decision 1: The fifth batch SHALL be limited to one page

The formal fifth-batch `MES` static page is:

- `返工执行`

This keeps the batch focused on the final execution-only page still missing from the current `MES` tree.

### Decision 2: `返工执行` SHALL serve the `返工单` object

`返工执行` serves the `返工单` object.

It MAY expose:

- source object linkage
- rework path
- current execution stage
- recheck handoff
- closure notes

It MUST NOT be treated as:

- the owner of whether rework is allowed
- the owner of final quality judgment

### Decision 3: Ownership SHALL preserve the decision/execution split

- `QMS` owns the decision of whether rework is allowed
- `MES` owns the execution chain after rework is allowed

The page MUST show the `QMS` decision reference as collaborator context, not as locally editable truth.

### Decision 4: Fifth-batch state semantics SHALL remain minimal and static-safe

Approved static semantics:

- `pending_decision -> released -> executing -> pending_recheck -> closed`

This keeps the page state explicit while leaving room for later mock/API refinement.

## Risks / Trade-offs

- Risk: the page may look too much like工单详情
  - Mitigation: focus it on rework source, route, recheck handoff, and closure
- Risk: the page may blur the boundary with `QMS`
  - Mitigation: freeze `QMS` as decision owner and `MES` as execution owner

## Migration Plan

1. Create the OpenSpec change for `返工执行`
2. Add the new `mes-fifth-batch-rework-execution-page` capability delta
3. Extend roadmap and ownership-alignment specs
4. Align the `MES` route entry from planned placeholder to static page
5. Implement the static page and verify later mock/API readiness
