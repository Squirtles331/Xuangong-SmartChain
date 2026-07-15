# aps-first-batch-static-pages Specification

## Purpose

Define the formal first-batch `APS` static-page scope, planning-object boundaries, static-data baseline, and page-shell rules before mock or API integration begins.

## Requirements

### Requirement: APS SHALL expose a formal first-batch static planning-page baseline

The system SHALL define a formal first-batch `APS` static-page scope so planning objects can stabilize after `QMS` and before `ERP` plan-consumption or broader analytics expansion.

#### Scenario: The first-batch APS scope is fixed before ERP planning pages expand

- **WHEN** the team starts the next module batch after the approved first-batch `QMS` pages
- **THEN** the formal `APS` batch MUST be limited to `排程结果`, `排程约束`, `排程历史`, and `扰动重排`
- **AND** pages in `ERP` such as `需求池` or `MRP结果` MUST NOT be treated as part of APS first-batch acceptance

### Requirement: APS first-batch pages SHALL remain in static-page mode with stable planning data

The first-batch `APS` pages SHALL deliver page structure, static fields, result views, constraint records, and static data behavior before mock or API integration begins.

#### Scenario: APS first-batch pages do not require API readiness

- **WHEN** a first-batch `APS` page is reviewed in the current phase
- **THEN** the page MUST be accepted based on static page structure and static data behavior
- **AND** the page MUST NOT require real API connectivity to be considered implementation-ready for this phase

#### Scenario: APS static data remains stable before mock

- **WHEN** the team organizes first-batch `APS` page data
- **THEN** the data MUST be expressed through stable page-local structures or `src/static/services/aps.ts`
- **AND** later mock or API design MUST inherit those approved structures rather than redefining page fields or result semantics

### Requirement: APS first-batch pages SHALL distinguish planning-object categories

The first-batch `APS` pages SHALL preserve separate planning-entry semantics for result output, constraint maintenance, history replay, and disturbance rescheduling instead of treating them as one generic planning page.

#### Scenario: Scheduling result remains a plan-output page

- **WHEN** a user works with `排程结果`
- **THEN** the page MUST treat scheduling output, work-center load, and conflict signals as the primary object context
- **AND** it MUST NOT present the page as a generic MES execution kanban

#### Scenario: Constraint, history, and disturbance pages remain separate APS objects

- **WHEN** a user works with `排程约束`, `排程历史`, or `扰动重排`
- **THEN** the page MUST preserve separate field groups, default actions, and information blocks for those page categories
- **AND** it MUST NOT collapse constraint maintenance, version replay, and reschedule advice into a single undifferentiated planning page

### Requirement: APS first-batch pages SHALL preserve planning truth boundaries

The first-batch `APS` pages SHALL maintain `APS` as the truth owner for planning results, constraint rules, and reschedule advice while treating `MES` and `ERP` as collaborator or consumer systems only.

#### Scenario: APS pages do not redefine MES execution truth

- **WHEN** a user works with `排程结果` or `扰动重排`
- **THEN** the page MUST treat execution facts, operation progress, and现场调整结果 as `MES` truth
- **AND** it MUST NOT redefine those execution facts as APS-owned runtime truth

#### Scenario: APS pages do not redefine ERP business-plan truth

- **WHEN** a user works with `排程结果`, `排程历史`, or `扰动重排`
- **THEN** the page MUST treat demand release, order承接, and business document generation as downstream `ERP` concerns
- **AND** it MUST NOT redefine ERP plan-consumption objects as APS-owned source truth

### Requirement: APS first-batch pages SHALL follow differentiated page-shell rules

The first-batch `APS` pages SHALL use shared page-shell rules while distinguishing CRUD-oriented maintenance pages from result-oriented planning pages.

#### Scenario: Constraint maintenance pages use the shared CRUD baseline

- **WHEN** a first-batch `APS` page is a standard constraint maintenance page such as `排程约束`
- **THEN** the page MUST use `CrudPage` or an equivalent shared CRUD shell as the primary page-level container
- **AND** toolbar actions, row actions, and dialog maintenance behavior MUST follow the shared CRUD baseline

#### Scenario: Result-oriented APS pages may extend without creating a new shell system

- **WHEN** a first-batch `APS` page needs gantt views, load charts, version comparisons, or reschedule-advice blocks
- **THEN** the page MAY extend the standard page shell with those blocks
- **AND** it MUST still preserve the shared page header, action hierarchy, and static-data organization baseline rather than introducing a page-specific shell system
