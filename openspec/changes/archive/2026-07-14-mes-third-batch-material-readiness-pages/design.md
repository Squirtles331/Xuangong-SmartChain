## Context

The current repo-level order remains:

`MDM -> PLM -> MES -> WMS -> QMS`

Inside `MES`, the first two batches now cover:

- execution entry
- execution coordination
- WIP and exception visibility

The next pages should not reopen those object boundaries. They should extend the stabilized chain into the point where production is either released to start or records actual material use while executing.

That means the third batch should focus on:

- readiness before start
- actual on-site consumption facts after start

This batch remains static-first. It is not the right moment to design real warehouse postings, backflush engines, or final quality disposition APIs.

## Goals / Non-Goals

**Goals**

- Freeze the exact third-batch `MES` page scope
- Freeze the primary object served by each page
- Freeze the readiness and material-consumption semantics before static implementation begins
- Freeze the boundaries between `MES`, `WMS`, `QMS`, and `PLM` for these pages
- Keep the pages compatible with the first and second `MES` batches

**Non-Goals**

- This change does not redesign first- or second-batch pages
- This change does not introduce real API, posting, or backflush logic
- This change does not make `产品追溯`, `执行日志`, or `返工执行` part of third-batch acceptance
- This change does not replace `WMS` inventory movement truth
- This change does not replace `QMS` final release judgment truth

## Decisions

### Decision 1: The third batch SHALL be limited to two pages

The formal third-batch `MES` static pages are:

- `开工齐套检查`
- `投料与消耗`

The following pages remain outside third-batch acceptance:

- `产品追溯`
- `执行日志`
- `返工执行`
- `委外工单`

This keeps the batch focused on readiness and actual material execution facts rather than opening the rest of the `MES` satellites.

### Decision 2: `开工齐套检查` SHALL serve readiness truth, not warehouse or quality transaction truth

`开工齐套检查` serves the `开工放行条件` object.

It MAY expose:

- material readiness
- version readiness
- batch readiness
- qualification / gate readiness

It MUST NOT be treated as:

- a warehouse issue transaction page
- a final quality judgment page
- an engineering change page

Instead, it aggregates whether the start conditions are satisfied from collaborating systems and converts them into a `MES` release view.

### Decision 3: `投料与消耗` SHALL own actual production-consumption facts in MES

`投料与消耗` serves the `投料消耗记录` object.

It MAY expose:

- bound material batches
- actual issue-for-use quantity
- over-consumption / under-consumption warnings
- supplement / return references
- substitute-material references

It MUST NOT be treated as:

- the truth owner of warehouse stock movement
- the page that posts inventory decrease
- the page that redefines BOM source truth

### Decision 4: Start readiness SHALL precede execution but remain compatible with second-batch signals

The third batch extends the first two batches. It does not redefine them.

Therefore:

- `开工齐套检查` must be compatible with task-pool and WIP release signals
- `投料与消耗` must inherit released BOM/version references from `PLM`
- consumption facts must reference, but not replace, `WMS` issue/return actions

### Decision 5: Third-batch state semantics SHALL stay minimal and static-safe

Approved static semantics:

- `开工放行条件`: `collecting -> ready -> blocked -> released`
- `投料消耗记录`: `draft -> in_use -> reconciled -> closed`

This keeps the page state explicit while leaving later mock/API work room to refine transition mechanics.

## Risks / Trade-offs

- Risk: `开工齐套检查` can be mistaken for a warehouse-prep page
  - Mitigation: freeze it as a readiness page that consumes, but does not own, warehouse facts
- Risk: `投料与消耗` can be mistaken for inventory posting
  - Mitigation: freeze `MES` ownership on actual consumption facts only
- Risk: users may expect these pages to finish the whole warehouse-quality cycle
  - Mitigation: expose collaborator systems and boundary notes directly in the page shell

## Migration Plan

1. Create the OpenSpec change for the third-batch readiness and material-fact pages
2. Add the new `mes-third-batch-material-readiness-pages` capability delta
3. Extend roadmap and ownership-alignment specs to keep batch order and truth boundaries synchronized
4. Align `MES` routing and menu grouping with the approved third-batch scope
5. Implement static pages for `开工齐套检查` and `投料与消耗`
6. Only after static acceptance, proceed into mock/API planning for warehouse and quality integration details
