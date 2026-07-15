# qms-first-batch-static-pages Specification

## Purpose

Define the first-batch static-page baseline for `QMS`, including scope, ownership boundaries, and CRUD-shell expectations before mock or API phases begin.

## Requirements

### Requirement: QMS SHALL expose a formal first-batch static quality-page baseline

The system SHALL define a formal first-batch `QMS` static-page scope so quality objects can stabilize after `WMS` and before broader judgment, analysis, mock, or API expansion.

#### Scenario: The first-batch QMS scope is fixed before broader quality expansion

- **WHEN** the team starts the next module batch after the approved first-batch `WMS` pages
- **THEN** the formal `QMS` batch MUST be limited to `检验模板`, `来料检验`, `过程检验`, `完工检验`, and `不合格处置`
- **AND** pages such as `供应商质量`, `特采放行`, `返工裁决`, `报废裁决`, and `复检与关闭` MUST NOT be treated as first-batch acceptance-critical pages

### Requirement: QMS first-batch pages SHALL remain in static-page mode with static data

The first-batch `QMS` pages SHALL deliver page structure, static fields, state tags, source-object relation blocks, and static data behavior before mock or API integration begins.

#### Scenario: First-batch QMS pages do not require API readiness

- **WHEN** a first-batch `QMS` page is reviewed in the current phase
- **THEN** the page MUST be accepted based on static page structure and static data behavior
- **AND** the page MUST NOT require real API connectivity to be considered implementation-ready for this phase

#### Scenario: Static data source remains stable before mock

- **WHEN** the team organizes first-batch `QMS` page data
- **THEN** the data MUST be expressed through stable static page-local structures or `src/static/services/qms.ts`
- **AND** later mock or API design MUST inherit those approved structures rather than redefining page fields or status semantics

### Requirement: QMS first-batch inspection pages SHALL distinguish source-object categories

The first-batch `QMS` inspection pages SHALL preserve separate quality-entry semantics for incoming, in-process, and final inspection instead of treating all inspection tasks as one generic queue.

#### Scenario: Incoming inspection remains attached to inbound source objects

- **WHEN** a user works with `来料检验`
- **THEN** the page MUST treat receipt, arrival, or supplier-linked inbound objects as the primary source context
- **AND** it MUST NOT present incoming inspection as a generic execution task without inbound-source distinction

#### Scenario: In-process and final inspection remain attached to execution-stage source objects

- **WHEN** a user works with `过程检验` or `完工检验`
- **THEN** the page MUST distinguish process-execution source context from completion-or-inbound source context
- **AND** it MUST preserve separate field groups, status semantics, or default actions for those inspection categories

### Requirement: QMS first-batch pages SHALL preserve quality-judgment truth boundaries

The first-batch `QMS` pages SHALL maintain `QMS` as the truth owner for inspection and judgment objects while treating `MES` and `WMS` as collaborator or source systems only.

#### Scenario: Inspection pages do not redefine WMS or MES source truth

- **WHEN** a user works with `来料检验`, `过程检验`, or `完工检验`
- **THEN** the page MUST treat the inspection object as a `QMS` quality object created from a source object
- **AND** it MUST NOT redefine inbound transaction truth as `QMS` stock truth or execution fact truth as `QMS` production truth

#### Scenario: Nonconformance does not absorb downstream execution ownership

- **WHEN** a user works with `不合格处置`
- **THEN** the page MUST treat the nonconformance or judgment object as a `QMS` decision object
- **AND** it MUST NOT redefine `MES` rework execution ownership or `WMS` stock-control execution ownership

### Requirement: Standard first-batch QMS pages SHALL default to CrudPage with controlled extensions

The first-batch `QMS` maintenance and list-style quality pages SHALL use `CrudPage` as the default page-level shell when the page shape is a standard search/list/toolbar/dialog transaction page.

#### Scenario: Template and inspection list pages use the shared CRUD shell

- **WHEN** a first-batch `QMS` page is a standard list-style page such as `检验模板`, `来料检验`, `过程检验`, or `完工检验`
- **THEN** the page MUST use `CrudPage` as the primary page-level container
- **AND** toolbar actions, row actions, and status tags MUST follow the shared CRUD baseline

#### Scenario: Execution and judgment blocks may extend without abandoning the baseline

- **WHEN** a first-batch `QMS` page needs inspection-item tables, source-object summaries, execution dialogs, or judgment-result blocks
- **THEN** the page MAY extend the default CRUD shell with those blocks
- **AND** it MUST still preserve the shared search/list/action baseline rather than introducing a page-specific shell system
