## ADDED Requirements

### Requirement: First-batch EAM pages SHALL declare explicit equipment-operation ownership

The system SHALL explicitly distinguish asset ownership, inspection ownership, maintenance ownership, and repair ownership across the first-batch `EAM` pages instead of treating the equipment area as one generic asset bucket.

#### Scenario: Asset ledger page declares EAM equipment-asset ownership

- **WHEN** a page is `设备台账`
- **THEN** the page MUST declare `EAM` as the owner of `设备资产`
- **AND** it MUST distinguish equipment-asset ownership from shared reference fields maintained by other systems

#### Scenario: Inspection, maintenance, and repair pages declare narrower operation ownership

- **WHEN** a page is `点检`
- **THEN** the page MUST declare `EAM` as the owner of `点检计划 / 点检执行`
- **AND** it MUST distinguish inspection ownership from generic asset-ledger ownership

- **WHEN** a page is `保养`
- **THEN** the page MUST declare `EAM` as the owner of `保养计划 / 保养执行`
- **AND** it MUST distinguish maintenance ownership from warehouse spare-stock truth

- **WHEN** a page is `维修`
- **THEN** the page MUST declare `EAM` as the owner of `维修工单`
- **AND** it MUST distinguish repair ownership from `IoT` alarm-source truth and `MES` stop-machine execution truth

### Requirement: First-batch EAM pages SHALL preserve collaborator-system boundaries

The system SHALL preserve `MES` as the production-execution context owner, `IoT` as the telemetry and alarm-source owner, `WMS` as the spare-stock and warehouse-transaction owner, and `MDM` as the shared reference-data owner even when first-batch `EAM` pages expose related source or consequence information.

#### Scenario: Execution and telemetry references remain collaborator truth

- **WHEN** a first-batch `EAM` page shows line context, stop-machine impact, runtime duration, alarm trigger, or monitoring snapshot context
- **THEN** the ownership definition MUST preserve `MES` as the owner of execution source context and `IoT` as the owner of telemetry or alarm source context
- **AND** `EAM` MUST only own the maintenance-side object created from that context

#### Scenario: Spare and shared reference relations remain external truth

- **WHEN** a first-batch `EAM` page shows spare-part issue, return, stock availability, workshop, department, or staff-reference context
- **THEN** the ownership definition MUST preserve `WMS` as the owner of spare-stock and transaction truth and `MDM` as the owner of shared reference data
- **AND** `EAM` MUST only present that information as related business context
