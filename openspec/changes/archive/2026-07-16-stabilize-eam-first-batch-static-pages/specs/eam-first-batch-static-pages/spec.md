## ADDED Requirements

### Requirement: EAM SHALL expose a formal first-batch static equipment-operation baseline

The system SHALL define a formal first-batch `EAM` static-page scope so equipment-operation objects can be stabilized before spare-parts or analysis-oriented expansion begins.

#### Scenario: The first-batch EAM scope is fixed before broader equipment-domain expansion

- **WHEN** the team starts the next module batch after the approved `CRM` pages
- **THEN** the formal `EAM` batch MUST be limited to `设备台账`, `点检`, `保养`, and `维修`
- **AND** pages such as `备件` and `设备综合效率` MUST NOT be treated as first-batch acceptance-critical pages

### Requirement: EAM first-batch pages SHALL remain in static-page mode with stable page data

The first-batch `EAM` pages SHALL deliver page structure, static fields, state tags, source-relation blocks, and stable static data behavior before mock or API integration begins.

#### Scenario: First-batch EAM pages do not require API readiness

- **WHEN** a first-batch `EAM` page is reviewed in the current phase
- **THEN** the page MUST be accepted based on static page structure and static data behavior
- **AND** the page MUST NOT require real API connectivity to be considered implementation-ready for this phase

#### Scenario: Static data source remains stable before mock

- **WHEN** the team organizes first-batch `EAM` page data
- **THEN** the data MUST be expressed through stable structures in `src/static/services/eam.ts` or an equivalent `EAM` static service layer
- **AND** later mock or API work MUST inherit those approved structures rather than redefining page fields or status semantics

### Requirement: EAM first-batch pages SHALL distinguish asset, inspection, maintenance, and repair object categories

The first-batch `EAM` pages SHALL preserve separate page semantics for equipment assets, inspection work, maintenance work, and repair work instead of treating the whole equipment area as one generic asset bucket.

#### Scenario: Equipment list page remains an asset ledger page

- **WHEN** a user works with `设备台账`
- **THEN** the page MUST treat equipment assets, classification, lifecycle state, and location/use context as the primary object context
- **AND** it MUST NOT present the page as a generic `MDM` master-data maintenance page

#### Scenario: Inspection and maintenance pages remain separate preventive-operation pages

- **WHEN** a user works with `点检`
- **THEN** the page MUST treat inspection plans, inspection execution, and exception confirmation as the primary object context
- **AND** it MUST NOT collapse into a generic maintenance page

- **WHEN** a user works with `保养`
- **THEN** the page MUST treat maintenance plans, maintenance execution, and cycle compliance as the primary object context
- **AND** it MUST NOT collapse into the inspection page or a warehouse spare page

#### Scenario: Repair page remains a repair work-order page

- **WHEN** a user works with `维修`
- **THEN** the page MUST treat repair requests, repair work orders, fault handling, and closure progress as the primary object context
- **AND** it MUST NOT collapse into an `IoT` alarm center or a `MES` downtime execution page

### Requirement: EAM first-batch pages SHALL preserve upstream and downstream truth boundaries

The first-batch `EAM` pages SHALL maintain `EAM` as the owner of equipment-operation objects while treating `MDM`, `MES`, `IoT`, and `WMS` as source or collaborator systems only.

#### Scenario: Equipment asset truth remains with EAM

- **WHEN** a first-batch `EAM` page shows equipment code, equipment classification, lifecycle state, or maintenance responsibility context
- **THEN** the page MUST preserve `EAM` as the owner of the equipment asset and operation object
- **AND** related shared reference fields MUST NOT redefine that asset truth into another system

#### Scenario: Execution and telemetry relations remain collaborator truth

- **WHEN** `点检`, `保养`, or `维修` shows production line usage, stop-machine impact, runtime hours, or alarm-trigger context
- **THEN** the page MUST preserve `MES` as the owner of production execution context and `IoT` as the owner of runtime telemetry or alarm source context
- **AND** `EAM` MUST only own the inspection, maintenance, or repair object created from that context

#### Scenario: Spare-stock relations remain WMS truth

- **WHEN** `维修` or `保养` shows spare-part demand, issue, or return-related context
- **THEN** the page MUST preserve `WMS` as the owner of warehouse stock and transaction truth
- **AND** `EAM` MUST only present that information as related business context

### Requirement: Standard first-batch EAM pages SHALL default to CrudPage with controlled extensions

The first-batch `EAM` operation pages SHALL use `CrudPage` as the default page-level shell when the page shape is a standard search/list/toolbar/dialog equipment-operation page.

#### Scenario: Core EAM operation list pages use the shared CRUD shell

- **WHEN** a first-batch `EAM` page is a standard operation list such as `设备台账`, `点检`, `保养`, or `维修`
- **THEN** the page MUST use `CrudPage` as the primary page-level container
- **AND** toolbar actions, row actions, and status tags MUST follow the shared CRUD baseline

#### Scenario: Runtime page structure excludes introduction and statistic panels

- **WHEN** a first-batch `EAM` page is delivered in the static phase
- **THEN** the runtime page MUST NOT require a page-introduction area, ownership-exposition block, or statistic-card row above the working CRUD structure
- **AND** relation blocks or detail extensions MUST remain subordinate to the shared search/list/action baseline
