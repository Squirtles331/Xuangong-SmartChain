## ADDED Requirements

### Requirement: The phase-one roadmap SHALL formalize EAM as the next equipment-operation batch after CRM

The phase-one roadmap SHALL explicitly transition from the approved first-batch `CRM` pages into a first-batch `EAM` equipment-operation baseline before opening broader `IoT`, `BI`, or governance-oriented pages.

#### Scenario: EAM follows CRM in the approved roadmap

- **WHEN** the team finishes the current approved `CRM` batch and decides the next module batch
- **THEN** `EAM` MUST be the next recommended module batch
- **AND** that batch MUST begin from `设备台账`, `点检`, `保养`, and `维修`

#### Scenario: EAM batch starts from approved upstream collaboration baselines

- **WHEN** the roadmap reviews whether `EAM` pages are ready to begin
- **THEN** the review MUST first confirm that upstream business-collaboration and execution-context pages that intersect with equipment operations are already stabilized where needed
- **AND** `EAM` pages MUST inherit those approved cross-module baselines rather than redefining customer, supplier, warehouse, or telemetry truth

### Requirement: The phase-one roadmap SHALL keep spare and analysis pages out of the first EAM batch

The phase-one roadmap SHALL separate the first equipment-operation batch from later spare-parts and equipment-analysis pages in `EAM`.

#### Scenario: First-batch EAM pages stay focused on the equipment operation main chain

- **WHEN** the team reviews the first `EAM` static-page batch for scope control
- **THEN** the batch MUST remain limited to `设备台账`, `点检`, `保养`, and `维修`
- **AND** pages such as `备件` and `设备综合效率` MUST wait for later `EAM` expansion batches
