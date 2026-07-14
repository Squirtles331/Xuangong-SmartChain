## ADDED Requirements

### Requirement: PLM SHALL expose static-first BOM analysis pages

The system SHALL provide `PLM`-owned static-first analysis pages for `结构版本比较` and `BOM展开/反查` so that BOM truth can be inspected without redefining it downstream.

#### Scenario: User enters BOM analysis from PLM

- **WHEN** a user navigates to `PLM` analysis pages
- **THEN** the pages MUST display `PLM` ownership, collaboration systems, core object, and boundary notes
- **AND** `MES / WMS / QMS` MUST be presented as consuming systems rather than co-owning maintenance systems

### Requirement: BOM compare pages SHALL stabilize version-difference structure before mock

The compare page SHALL expose a fixed structure for reviewing version deltas and their downstream impact.

#### Scenario: User compares two BOM versions

- **WHEN** a user selects baseline and target versions
- **THEN** the page MUST show overview cards, a difference table, and explicit delta states such as `新增`, `删除`, `修改`, and `无变化`
- **AND** the result MUST include version context, route-binding context, and change-order references

#### Scenario: User inspects a difference row

- **WHEN** a user opens a row detail
- **THEN** the page MUST reserve sections for quantity/scrap changes, downstream execution impact, and version source information
- **AND** later mock payloads MUST inherit that approved detail structure

### Requirement: BOM explode pages SHALL unify explode and where-used views under one object context

The explode page SHALL present downward structure and upward reference views using the same BOM object context.

#### Scenario: User views exploded structure

- **WHEN** a user queries a BOM version in explode mode
- **THEN** the page MUST show overview cards and a hierarchical result table
- **AND** rows MUST include object identity, supply mode, replacement strategy, and route/ECN linkage where applicable

#### Scenario: User views where-used references

- **WHEN** a user switches to where-used mode
- **THEN** the page MUST show upstream parent references using the same queried BOM context
- **AND** the page MUST express those references as consumed relationships rather than as locally maintained truth
