## Context

The current repo-level order remains:

`MDM -> PLM -> MES -> WMS -> QMS`

Inside `MES`, the first three batches now cover:

- execution entry
- coordination / visibility
- start readiness and actual material facts

The next pages should complete the execution-information layer by answering:

- where did this product / batch / serial come from and where did it go
- what key execution actions and state changes have happened over time

That means the fourth batch should focus on:

- cross-object trace reconstruction
- operator-facing execution audit visibility

This batch remains static-first. It is not the right moment to design real event buses, telemetry ingestion, or final quality-return logic.

## Goals / Non-Goals

**Goals**

- Freeze the exact fourth-batch `MES` page scope
- Freeze the primary object served by each page
- Freeze traceability and audit semantics before static implementation begins
- Freeze the collaborator boundaries between `MES`, `QMS`, `WMS`, and `IoT`
- Keep the pages compatible with the first three `MES` batches

**Non-Goals**

- This change does not redesign the first three batches
- This change does not introduce technical log sinks or real event ingestion
- This change does not make `返工执行` or `委外工单` part of fourth-batch acceptance
- This change does not replace `QMS` final quality history or `WMS` stock trace truth

## Decisions

### Decision 1: The fourth batch SHALL be limited to two pages

The formal fourth-batch `MES` static pages are:

- `产品追溯`
- `执行日志`

The following pages remain outside fourth-batch acceptance:

- `返工执行`
- `委外工单`

This keeps the batch focused on trace reconstruction and audit visibility.

### Decision 2: `产品追溯` SHALL serve the trace chain, not the transaction source truth

`产品追溯` serves the `产品追溯链` object.

It MAY expose:

- product-to-work-order links
- material-batch links
- inspection links
- equipment / station links
- impact-scope links

It MUST NOT be treated as:

- the owner of warehouse stock trace truth
- the owner of final inspection judgment truth
- the owner of raw device telemetry truth

Instead, it organizes those facts into a production-side trace chain.

### Decision 3: `执行日志` SHALL be an audit page, not a debug page

`执行日志` serves the `执行审计记录` object.

It MAY expose:

- action category
- object references
- status transitions
- operator and timestamp
- highlight / attention markers

It MUST NOT be treated as:

- a raw backend log viewer
- a frontend console output page
- a generic ops monitoring dashboard

### Decision 4: Fourth-batch pages SHALL stay compatible with previous MES batches

The fourth batch extends the first three batches. It does not redefine them.

Therefore:

- `产品追溯` must reuse approved work-order, task, WIP, report, and consumption references
- `执行日志` must reference the same approved object names and state flows
- neither page may silently invent a competing object model

### Decision 5: Fourth-batch state semantics SHALL remain minimal and static-safe

Approved static semantics:

- `产品追溯链`: `linked -> partial -> isolated`
- `执行审计记录`: `captured -> highlighted -> archived`

This keeps user-facing state explicit while leaving room for later mock/API refinement.

## Risks / Trade-offs

- Risk: `产品追溯` may become a duplicate of工单详情或报工记录查询
  - Mitigation: freeze it as a cross-object trace chain page
- Risk: `执行日志` may become too technical or too shallow
  - Mitigation: freeze it as an operator-facing audit page with object, action, and status context
- Risk: users may expect these pages to own collaborator facts
  - Mitigation: expose collaborator systems and boundary notes directly in the page shell

## Migration Plan

1. Create the OpenSpec change for the fourth-batch traceability/audit pages
2. Add the new `mes-fourth-batch-trace-audit-pages` capability delta
3. Extend roadmap and ownership-alignment specs to keep batch order and truth boundaries synchronized
4. Align `MES` routing and menu grouping with the approved fourth-batch scope
5. Implement static pages for `产品追溯` and `执行日志`
6. Only after static acceptance, proceed into later trace / IoT / quality integration details
