## ADDED Requirements

### Requirement: Every navigable page SHALL declare ownership metadata

The system SHALL define ownership metadata for every navigable page, including at minimum the primary owner system, collaborator systems, related core object, and final truth boundary.

#### Scenario: Standard page ownership definition

- **WHEN** a page is included in the canonical menu catalog
- **THEN** the page MUST include explicit ownership metadata rather than relying on menu placement alone

#### Scenario: Router and documentation updates

- **WHEN** route metadata or documentation is updated during the realignment
- **THEN** the ownership metadata MUST remain synchronized with the canonical menu catalog

### Requirement: Joint-decision pages SHALL distinguish decision ownership from execution ownership

For pages where one system decides and another system executes, the system SHALL explicitly record and expose the different roles instead of collapsing them into a single owner.

#### Scenario: Rework responsibility split

- **WHEN** the page represents a `返工` flow
- **THEN** the ownership definition MUST state that `QMS` decides whether rework is allowed and `MES` executes the rework chain

#### Scenario: Version cutover responsibility split

- **WHEN** the page represents a `版本切换` flow
- **THEN** the ownership definition MUST state that `PLM` owns version legality and initiation while `MES` owns on-site cutover execution status

### Requirement: Navigation placement SHALL NOT redefine system truth boundaries

The system SHALL preserve architecture truth boundaries even when a page is regrouped under a more user-friendly product menu.

#### Scenario: Inventory truth remains with WMS

- **WHEN** a page about领料、退料、配送 or batch inventory appears near execution workflows
- **THEN** the ownership definition MUST preserve `WMS` as the inventory truth owner and MUST NOT redefine the page as `MES` inventory truth

#### Scenario: Consumption truth remains with MES

- **WHEN** a page captures投料、实际消耗 or工序消耗事实
- **THEN** the ownership definition MUST preserve `MES` as the production consumption truth owner and MUST NOT equate warehouse issue completion with consumption completion

#### Scenario: Master data placement does not hide cross-domain governance

- **WHEN** `MDM` pages are grouped under a user-facing platform or master-data menu
- **THEN** the ownership definition MUST still identify `MDM` as a cross-domain governance capability rather than a simple platform settings page
