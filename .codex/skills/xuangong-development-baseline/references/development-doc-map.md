# Xuangong Development Doc Map

Use this reference to decide which project documents to open for a given development task.

Do not load every document by default.

## 1. Object Ownership And Data Scope

Open these when the task touches primary objects, field boundaries, source-of-truth questions, or cross-module ownership:

- [master-data-object-catalog.md](D:/Project/玄工智链/docs/master-data-object-catalog.md)
- [core-data-field-standard.md](D:/Project/玄工智链/docs/core-data-field-standard.md)
- [object-state-flow-matrix.md](D:/Project/玄工智链/docs/object-state-flow-matrix.md)
- [integrated-data-governance-blueprint.md](D:/Project/玄工智链/docs/integrated-data-governance-blueprint.md)

Use this set for:

- deciding whether data belongs to `MDM`, `PLM`, `MES`, `WMS`, `QMS`, or `ERP`
- deciding whether a page maintains an object or only consumes it
- keeping downstream pages from redefining upstream truth

## 2. Page Sequencing And Module Order

Open these when the task is about what to build next, which menu module goes first, or how to phase static-page work:

- [page-development-priority-roadmap.md](D:/Project/玄工智链/docs/page-development-priority-roadmap.md)
- [page-object-mapping-matrix.md](D:/Project/玄工智链/docs/page-object-mapping-matrix.md)
- [menu-module-development-batch-plan.md](D:/Project/玄工智链/docs/menu-module-development-batch-plan.md)

Use this set for:

- deciding page priority
- deciding module batch order
- deciding whether a task belongs to `PLM`, `MES`, `WMS`, `QMS`, or later batches

## 3. Frontend, Page Shell, And CRUD Refactor

Open these when the task is UI-heavy, layout-heavy, CRUD-heavy, or about static page refactor style:

- [page-refactor-standard.md](D:/Project/玄工智链/docs/page-refactor-standard.md)
- [ui-foundation-baseline-plan.md](D:/Project/玄工智链/docs/ui-foundation-baseline-plan.md)
- [page-dialog-drawer-component-refactor.md](D:/Project/玄工智链/docs/page-dialog-drawer-component-refactor.md)
- [search-setting-refactor-plan.md](D:/Project/玄工智链/docs/search-setting-refactor-plan.md)
- [frontend-baseline](/D:/Project/玄工智链/.codex/skills/frontend-baseline/SKILL.md)

Use this set for:

- page shell consistency
- layout and navigation rules
- workbench rules
- CRUD toolbars, row actions, dialogs, and status tags

## 4. Static To Mock To API Transition

Open these when the page is close to leaving static mode or when API shape planning begins:

- [mock-api-migration-master-plan.md](D:/Project/玄工智链/docs/mock-api-migration-master-plan.md)
- [mock-api-migration-plan.md](D:/Project/玄工智链/docs/mock-api-migration-plan.md)
- [mock-restful-response-standard.md](D:/Project/玄工智链/docs/mock-restful-response-standard.md)
- [http-wrapper-standard.md](D:/Project/玄工智链/docs/http-wrapper-standard.md)

Use this set for:

- mock response structure
- DTO boundary planning
- request/response wrapper rules
- deciding whether the page is ready to leave static phase

## 5. OpenSpec Change Workflow

Open these when the task needs formal change exploration, implementation, or archive:

- [openspec-explore](/D:/Project/玄工智链/.codex/skills/openspec-explore/SKILL.md)
- [openspec-propose](/D:/Project/玄工智链/.codex/skills/openspec-propose/SKILL.md)
- [openspec-apply-change](/D:/Project/玄工智链/.codex/skills/openspec-apply-change/SKILL.md)
- [openspec-archive-change](/D:/Project/玄工智链/.codex/skills/openspec-archive-change/SKILL.md)

Use this set for:

- deciding whether to explore or implement
- creating a formal change
- archiving only after real closeout

## 6. Long-Form Design Background

Open these only when strategic background or integrated-platform reasoning is needed:

- [掘金文章_MES中枢型一体化平台通用版.md](D:/Project/玄工智链/docs/掘金文章_MES中枢型一体化平台通用版.md)
- [掘金文章_MES为核心的一体化平台设计思路.md](D:/Project/玄工智链/docs/掘金文章_MES为核心的一体化平台设计思路.md)

Use this set for:

- explaining why manufacturing-integrated design matters
- justifying unified object and process design
- supporting future architecture or product strategy discussion
