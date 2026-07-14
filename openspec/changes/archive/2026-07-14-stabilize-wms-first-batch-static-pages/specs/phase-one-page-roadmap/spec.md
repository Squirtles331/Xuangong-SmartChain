## ADDED Requirements

### Requirement: The phase-one roadmap SHALL formalize WMS as the next downstream transaction batch after MES

The phase-one roadmap SHALL explicitly transition from the approved `MES` execution chain into a first-batch `WMS` warehouse transaction baseline before opening `QMS` or later planning and business modules.

#### Scenario: WMS follows MES in the approved roadmap

- **WHEN** the team finishes the current approved `MES` batch and decides the next module batch
- **THEN** `WMS` MUST be the next recommended module batch before `QMS`, `APS`, or `ERP`
- **AND** the batch MUST focus on stabilizing receipt, picking, inventory, return, stock-count, and transfer relationships before broader downstream expansion

#### Scenario: WMS batch stabilizes before QMS starts

- **WHEN** the roadmap reviews whether `QMS` pages are ready to begin
- **THEN** the review MUST first confirm that first-batch `WMS` pages have already stabilized warehouse transaction objects, status semantics, and page jump structure
- **AND** `QMS` pages MUST inherit those approved warehouse transaction baselines rather than redefining them
