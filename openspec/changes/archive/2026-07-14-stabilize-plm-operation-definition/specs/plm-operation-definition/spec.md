## ADDED Requirements

### Requirement: PLM SHALL expose a primary operation-definition page

The system SHALL provide a primary `PLM` menu entry for operation definition so that operation truth is expressed as an upstream engineering object rather than as a generic governance-only list.

#### Scenario: User enters operation definition from PLM

- **WHEN** a user navigates the first-batch `PLM` menu
- **THEN** the menu MUST include an operation-definition page
- **AND** the page MUST display `PLM` ownership, collaboration systems, core object, and boundary notes

#### Scenario: MDM does not expose a competing maintenance entry

- **WHEN** a user accesses the product-facing maintenance menus
- **THEN** `MDM` MUST NOT expose a competing editable entry for operation definition
- **AND** `PLM` MUST remain the only product-facing maintenance entry for operation definition

### Requirement: Operation-definition static pages SHALL reserve downstream-consumable structure

The operation-definition static page SHALL expose structure blocks that downstream `MES`, `QMS`, and `APS` work can inherit directly.

#### Scenario: Static list page stabilizes the operation object

- **WHEN** the page is delivered in the static-first phase
- **THEN** it MUST include a query area, overview cards, table columns, state presentation, and action presentation
- **AND** status semantics MUST be explicit and reusable by downstream pages

#### Scenario: Detail structure is fixed before mock

- **WHEN** the page exposes a detail drawer or detail region
- **THEN** it MUST reserve blocks for base information, time/resource settings, quality/reporting constraints, and upstream/downstream relations
- **AND** later mock payloads MUST inherit that approved structure instead of redefining it

### Requirement: Operation-definition pages SHALL distinguish PLM truth from downstream execution truth

The system SHALL make clear that `PLM` defines operation templates and release semantics, while downstream systems consume them without redefining the object baseline.

#### Scenario: Ownership notice prevents truth drift

- **WHEN** the operation-definition page is viewed
- **THEN** the page MUST explain that `PLM` owns the operation definition truth
- **AND** `MES`, `QMS`, and `APS` MUST be presented as collaborating consumers rather than co-owning maintenance systems

#### Scenario: Detail relations show released dependencies

- **WHEN** a user inspects an operation definition
- **THEN** the page MUST show related routing versions, affected BOM versions, or change-order references
- **AND** those relations MUST be expressed as consumed links rather than as locally redefined objects

### Requirement: Code-rule ownership SHALL be separated from code-instance ownership

The system SHALL separate global code-rule governance from object-instance maintenance for operation definitions and routing definitions.

#### Scenario: MDM owns coding rules

- **WHEN** the system defines the coding format for operation or routing objects
- **THEN** prefix rules, segment rules, length, version-segment policy, and organizational pooling policy MUST be governed by `MDM`
- **AND** those rules MUST be reusable across downstream object owners

#### Scenario: PLM owns code-instance generation and uniqueness

- **WHEN** a user creates, edits, publishes, or versions an operation definition or routing definition
- **THEN** `PLM` MUST own the concrete code instance generation, occupation, uniqueness check, and lifecycle maintenance
- **AND** `MDM` MUST NOT become the editable owner of those object instances
