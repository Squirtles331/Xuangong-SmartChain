## MODIFIED Requirements

### Requirement: Every navigable page SHALL declare ownership metadata

The system SHALL define ownership metadata for every navigable page, including at minimum the primary owner system, collaborator systems, related core object, and final truth boundary. This metadata MUST be maintained in route definitions, documentation, or other internal artifacts and MUST NOT rely on runtime page copy for expression.

#### Scenario: Standard page ownership definition

- **WHEN** a page is included in the canonical menu catalog
- **THEN** the page MUST include explicit ownership metadata rather than relying on menu placement alone
- **AND** that metadata MUST remain an internal architecture artifact rather than a required runtime page section

#### Scenario: Router and documentation updates

- **WHEN** route metadata or documentation is updated during the realignment
- **THEN** the ownership metadata MUST remain synchronized with the canonical menu catalog

### Requirement: Joint-decision pages SHALL distinguish decision ownership from execution ownership

The system SHALL explicitly record the different roles for joint-decision pages instead of collapsing them into a single owner. This distinction MUST remain available in internal metadata and documentation even when runtime pages do not display it as user-facing explanation content.

#### Scenario: Rework responsibility split

- **WHEN** a page represents a `返工` flow
- **THEN** the ownership definition MUST record that `QMS` decides whether rework is allowed and `MES` executes the rework chain

#### Scenario: Version cutover responsibility split

- **WHEN** a page represents a `版本切换` flow
- **THEN** the ownership definition MUST record that `PLM` owns version legality and initiation while `MES` owns on-site cutover execution status

## ADDED Requirements

### Requirement: Runtime pages SHALL NOT expose ownership metadata as user-facing content

The system SHALL keep ownership metadata available for internal governance but MUST NOT expose ownership labels, ownership panels, or truth-boundary descriptions as runtime product content.

#### Scenario: Standard runtime page hides ownership exposition

- **WHEN** a runtime page has internal ownership metadata
- **THEN** the page MUST NOT display labels such as `页面归属`, `主责系统`, `协同系统`, `核心对象`, or `边界说明`

#### Scenario: Shared placeholder page hides ownership exposition

- **WHEN** a shared placeholder or planned page consumes route metadata with ownership fields
- **THEN** the runtime page MUST NOT render an ownership-specific side card or explanatory ownership section
