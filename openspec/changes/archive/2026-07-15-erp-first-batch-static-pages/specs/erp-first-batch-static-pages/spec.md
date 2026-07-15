## ADDED Requirements

### Requirement: ERP SHALL expose a formal first-batch static business-plan baseline

The system SHALL define a formal first-batch `ERP` static-page scope so business-plan consumption and accounting-carry objects can stabilize after the approved first-batch `APS` pages.

#### Scenario: The first-batch ERP scope is fixed before broader finance or collaboration expansion

- **WHEN** the team starts the next module batch after the approved first-batch `APS` pages
- **THEN** the formal `ERP` batch MUST be limited to `需求池`, `物料需求结果`, `物料需求历史`, `净变更计划`, and `总账对账`
- **AND** pages such as `预测需求`, `多工厂计划`, `财务概览`, `成本分析`, and `财务报表` MUST NOT be treated as first-batch acceptance-critical pages

### Requirement: ERP first-batch pages SHALL remain in static-page mode with stable page data

The first-batch `ERP` pages SHALL deliver page structure, static fields, state tags, result sections, ledger sections, and stable static data behavior before mock or API integration begins.

#### Scenario: First-batch ERP pages do not require API readiness

- **WHEN** a first-batch `ERP` page is reviewed in the current phase
- **THEN** the page MUST be accepted based on static page structure and static data behavior
- **AND** the page MUST NOT require real API connectivity to be considered implementation-ready for this phase

#### Scenario: ERP static data remains stable before mock

- **WHEN** the team organizes first-batch `ERP` page data
- **THEN** the data MUST be expressed through stable page-local structures or an ERP static service layer
- **AND** later mock or API design MUST inherit those approved structures rather than redefining page fields, result semantics, or ledger semantics

### Requirement: ERP first-batch pages SHALL distinguish demand, MRP, and ledger object categories

The first-batch `ERP` pages SHALL preserve separate page semantics for plan-input demand, MRP suggestion output, MRP history/change replay, and accounting-carry objects instead of treating them as one generic ERP page family.

#### Scenario: Demand pool remains a plan-input page

- **WHEN** a user works with `需求池`
- **THEN** the page MUST treat aggregated plan demand, release readiness, and priority context as the primary object context
- **AND** it MUST NOT present the page as a sales-order maintenance page or an APS scheduling-result page

#### Scenario: MRP pages remain plan-consumption pages rather than execution pages

- **WHEN** a user works with `物料需求结果`, `物料需求历史`, or `净变更计划`
- **THEN** the page MUST preserve separate field groups, actions, and information blocks for suggestion output, historical runs, and change-impact replay
- **AND** it MUST NOT collapse those concerns into a generic procurement-execution or MES execution page

#### Scenario: Ledger page remains an accounting-carry page

- **WHEN** a user works with `总账对账`
- **THEN** the page MUST treat ledger entries, debit-credit summaries, and reconciliation results as the primary object context
- **AND** it MUST NOT present the page as a warehouse stock ledger or a manufacturing execution trace page

### Requirement: ERP first-batch pages SHALL preserve upstream and downstream truth boundaries

The first-batch `ERP` pages SHALL maintain `ERP` as the truth owner for plan demand, MRP suggestions, MRP run history, change-impact replay, and accounting-carry objects while treating other modules as collaborator or source systems only.

#### Scenario: Demand and MRP pages do not redefine CRM or APS truth

- **WHEN** a user works with `需求池`, `物料需求结果`, `物料需求历史`, or `净变更计划`
- **THEN** the page MUST treat customer-order demand truth as `CRM` truth and scheduling-result truth as `APS` truth
- **AND** it MUST NOT redefine those source objects as ERP-owned source truth

#### Scenario: MRP and ledger pages do not redefine MES or WMS execution truth

- **WHEN** a user works with `物料需求结果`, `净变更计划`, or `总账对账`
- **THEN** the page MUST treat execution facts as `MES` truth and inventory movement or stock facts as `WMS` truth
- **AND** it MUST NOT redefine purchase execution, work-order execution, inventory truth, or stock movement truth as ERP-owned runtime truth

### Requirement: ERP first-batch pages SHALL follow differentiated page-shell rules

The first-batch `ERP` pages SHALL use shared page-shell rules while distinguishing CRUD-oriented demand pages, result-oriented MRP pages, and query-ledger pages.

#### Scenario: Demand pool uses the shared CRUD baseline

- **WHEN** a first-batch `ERP` page is the standard demand-input page `需求池`
- **THEN** the page MUST use `CrudPage` or an equivalent shared CRUD shell as the primary page-level container
- **AND** toolbar actions, row actions, and status tags MUST follow the shared CRUD baseline

#### Scenario: MRP result pages may extend without creating a new shell system

- **WHEN** a first-batch `ERP` page needs run summaries, suggestion tabs, impact tables, or change-detail blocks
- **THEN** the page MAY extend the standard page shell with those blocks
- **AND** it MUST still preserve the shared page header, action hierarchy, and static-data organization baseline rather than introducing a page-specific shell system

#### Scenario: Ledger page remains a query and reconciliation shell

- **WHEN** a first-batch `ERP` page is `总账对账`
- **THEN** the page MUST preserve query-summary-ledger-reconciliation structure as its primary shell
- **AND** it MUST NOT be expanded into a BI-style executive analysis dashboard in this batch
