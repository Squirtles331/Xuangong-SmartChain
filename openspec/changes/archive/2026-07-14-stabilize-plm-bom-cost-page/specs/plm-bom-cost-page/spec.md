## ADDED Requirements

### Requirement: PLM SHALL expose a static-first BOM cost estimation page

The system SHALL provide a `PLM`-owned static-first BOM cost estimation page so that engineering users can inspect structure-driven cost impact before downstream financial settlement.

#### Scenario: User enters BOM cost estimation from PLM

- **WHEN** a user navigates to `PLM` cost analysis
- **THEN** the page MUST display `PLM` ownership, collaborating systems, core object, and boundary notes
- **AND** the page MUST make clear that `ERP` owns final accounting truth

### Requirement: BOM cost pages SHALL stabilize cost structure before interfaces

The cost estimation page SHALL expose a fixed structure for BOM-driven cost analysis in the static-first phase.

#### Scenario: User calculates a BOM version estimate

- **WHEN** a user selects a BOM version and valuation view
- **THEN** the page MUST show overview cards, a detailed cost table, and a cost composition chart
- **AND** the result MUST include structure context, route context, and change-order context

#### Scenario: User inspects a cost row

- **WHEN** a user opens a row detail
- **THEN** the page MUST reserve sections for cost split, version source, route influence, and downstream impact
- **AND** later mock payloads MUST inherit that approved detail structure
