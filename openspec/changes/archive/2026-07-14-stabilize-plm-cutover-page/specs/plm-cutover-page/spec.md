## ADDED Requirements

### Requirement: PLM SHALL expose a static-first cutover page

The system SHALL provide a `PLM` cutover page that manages version switch tasks from engineering release to execution handoff.

#### Scenario: User opens version cutover

- **WHEN** a user navigates to `plm/cutover`
- **THEN** the page MUST render a real static page rather than a planned placeholder
- **AND** the page MUST display ownership metadata and cutover task status

### Requirement: Cutover pages SHALL reserve execution handoff structure

The cutover page SHALL reserve static structures that downstream `MES` can inherit for execution and closure.

#### Scenario: User inspects a cutover task

- **WHEN** a user opens task detail
- **THEN** the page MUST show affected versions, impacted execution objects, cutover steps, and closure records
- **AND** status actions MUST express approval, execution, verification, and closure semantics
