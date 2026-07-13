## ADDED Requirements

### Requirement: Core business objects SHALL have a single truth owner and explicit consumer boundary

The system SHALL define a canonical ownership baseline for core business objects including at minimum `物料`、`BOM`、`工艺路线`、`工单`、`库存事务` and `质检事务`. Each object MUST record its primary owning domain, downstream consumer domains, and the boundary between definition truth and execution truth.

#### Scenario: Material ownership is defined once

- **WHEN** a page, static data model, mock response, or API contract references `物料`
- **THEN** the system MUST treat `MDM` as the master-data truth owner
- **AND** downstream domains such as `PLM`、`MES`、`WMS`、`ERP` MUST consume rather than redefine the canonical material identity

#### Scenario: Execution pages do not steal ownership from definition pages

- **WHEN** a manufacturing execution page references `BOM` or `工艺路线`
- **THEN** the system MUST preserve `PLM` as the source of definition truth
- **AND** `MES` MUST only own execution facts derived from those released definitions

### Requirement: Core business objects SHALL define canonical lifecycle states before downstream implementation

The system SHALL define canonical lifecycle states and transition expectations for core business objects before static pages, mock responses, or APIs for downstream business pages are finalized.

#### Scenario: BOM lifecycle is defined before work-order implementation

- **WHEN** the team begins work on pages or mocks that consume `BOM`
- **THEN** the `BOM` object MUST already define its lifecycle such as `draft`、`pending_approval`、`active`、`disabled` and `archived`
- **AND** downstream consumers MUST use those lifecycle meanings consistently

#### Scenario: Work-order status cannot contradict upstream release state

- **WHEN** the team defines a `工单` page, static model, or mock structure
- **THEN** the work-order creation and execution statuses MUST respect upstream object release constraints
- **AND** the system MUST NOT allow downstream definitions that imply using unreleased upstream objects as normal state

### Requirement: Core business objects SHALL use canonical field layering

The system SHALL organize core object fields using a consistent field-layering model that distinguishes identity, classification, versioning, planning, execution, quality, inventory, and audit concerns where applicable.

#### Scenario: Material page follows canonical field grouping

- **WHEN** a material page or form is designed
- **THEN** its fields MUST be grouped according to canonical layers such as basic identity, classification, specification, planning, inventory, and audit information
- **AND** the page MUST NOT mix unrelated downstream execution fields into the master-data definition group

#### Scenario: Work-order page separates header and execution facts

- **WHEN** a work-order page is designed
- **THEN** the page MUST distinguish order header data, planned execution data, actual execution data, and audit data
- **AND** the data structure MUST support later handoff to mock and API without redefining those groups
