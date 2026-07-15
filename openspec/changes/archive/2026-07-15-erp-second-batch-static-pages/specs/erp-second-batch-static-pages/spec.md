## ADDED Requirements

### Requirement: ERP SHALL expose a formal second-batch static-page baseline

The system SHALL define a formal second-batch `ERP` static-page scope so the remaining planning-extension and finance-aggregation pages can stabilize after the approved first-batch `ERP` pages.

#### Scenario: The second-batch ERP scope is fixed before SRM, CRM, or BI expansion

- **WHEN** the team continues `ERP` development after the approved first-batch pages
- **THEN** the second-batch `ERP` scope MUST be limited to `预测需求`, `多工厂计划`, `应付管理`, `成本分析`, and `财务报表`
- **AND** those pages MUST be treated as the formal second-batch acceptance scope for static delivery

### Requirement: ERP second-batch pages SHALL remain in static-page mode with stable page data

The second-batch `ERP` pages SHALL deliver page structure, static fields, state tags, analysis blocks, and stable static data behavior before mock or API integration begins.

#### Scenario: Second-batch ERP pages do not require API readiness

- **WHEN** a second-batch `ERP` page is reviewed in the current phase
- **THEN** the page MUST be accepted based on static page structure and static data behavior
- **AND** the page MUST NOT require real API connectivity to be considered implementation-ready for this phase

#### Scenario: ERP second-batch static data remains stable before mock

- **WHEN** the team organizes second-batch `ERP` page data
- **THEN** the data MUST be expressed through stable structures in `src/static/services/erp.ts` or an equivalent `ERP` static service layer
- **AND** later mock or API work MUST inherit those approved structures rather than redefining page fields or object semantics

### Requirement: ERP second-batch pages SHALL distinguish forecast, multi-plant, payable, cost, and report object categories

The second-batch `ERP` pages SHALL preserve separate page semantics for forecast-demand input, cross-plant balance suggestions, payable-carry objects, cost-result aggregation, and report aggregation.

#### Scenario: Forecast page remains a planning-input extension page

- **WHEN** a user works with `预测需求`
- **THEN** the page MUST treat forecast-demand records, demand type, probability, and planning-input context as the primary object context
- **AND** it MUST NOT present the page as a CRM order-maintenance page or a customer-demand source-truth page

#### Scenario: Multi-plant page remains a cross-plant balance page

- **WHEN** a user works with `多工厂计划`
- **THEN** the page MUST treat cross-plant supply-demand balance suggestions, capacity snapshots, and transfer or procurement advice as the primary object context
- **AND** it MUST NOT collapse into an APS scheduling-result page or a WMS inventory-ledger page

#### Scenario: Finance second-batch pages preserve separate object types

- **WHEN** a user works with `应付管理`, `成本分析`, or `财务报表`
- **THEN** the pages MUST preserve separate object semantics for payable carry, cost-result aggregation, and operating-report aggregation
- **AND** they MUST NOT collapse those concerns into one generic finance dashboard page

### Requirement: ERP second-batch pages SHALL preserve upstream and collaborator truth boundaries

The second-batch `ERP` pages SHALL maintain `ERP` as the owner of forecast-demand carry, cross-plant balance suggestions, payable-carry objects, cost-result objects, and report-aggregation objects while treating other systems as source or collaborator systems only.

#### Scenario: Forecast and multi-plant pages do not redefine CRM, APS, or WMS truth

- **WHEN** a user works with `预测需求` or `多工厂计划`
- **THEN** the page MUST preserve `CRM` as the owner of customer-order demand truth, `APS` as the owner of scheduling-result truth, and `WMS` as the owner of inventory truth
- **AND** `ERP` MUST only own the forecast-input or cross-plant suggestion object created from that context

#### Scenario: Finance pages do not redefine PLM, MES, WMS, or SRM truth

- **WHEN** a user works with `应付管理`, `成本分析`, or `财务报表`
- **THEN** the page MUST preserve `PLM` as the owner of engineering definitions, `MES` as the owner of execution facts, `WMS` as the owner of inventory facts, and `SRM` as the owner of supplier collaboration truth
- **AND** `ERP` MUST only own the payable-carry, cost-result, or report-aggregation object derived from those source facts

### Requirement: ERP second-batch pages SHALL follow differentiated page-shell rules

The second-batch `ERP` pages SHALL use shared page-shell rules while distinguishing CRUD-oriented carry pages and result-oriented analysis pages.

#### Scenario: Forecast and payable pages use the shared CRUD baseline

- **WHEN** a second-batch `ERP` page is `预测需求` or `应付管理`
- **THEN** the page MUST use `CrudPage` or an equivalent shared CRUD shell as the primary page-level container
- **AND** toolbar actions, row actions, dialogs, and status tags MUST follow the shared CRUD baseline

#### Scenario: Multi-plant, cost, and report pages may extend without creating a new shell system

- **WHEN** a second-batch `ERP` page needs summary cards, plant-capacity charts, cost-composition blocks, or report-trend blocks
- **THEN** the page MAY extend the standard page shell with those blocks
- **AND** it MUST still preserve the shared page header, action hierarchy, and static-data organization baseline rather than introducing a page-specific shell system
