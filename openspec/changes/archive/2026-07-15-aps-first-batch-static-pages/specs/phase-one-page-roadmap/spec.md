## ADDED Requirements

### Requirement: The phase-one roadmap SHALL formalize APS as the next planning batch after QMS

The phase-one roadmap SHALL explicitly transition from the approved `QMS` batch into a first-batch `APS` planning baseline before opening broader `ERP` plan-consumption or business-document pages.

#### Scenario: APS follows QMS in the approved roadmap

- **WHEN** the team finishes the current approved `QMS` batch and decides the next module batch
- **THEN** `APS` MUST be the next recommended module batch before broader `ERP` planning-consumption pages
- **AND** the batch MUST focus on stabilizing `排程结果`, `排程约束`, `排程历史`, and `扰动重排`

#### Scenario: APS batch stabilizes before ERP planning pages expand

- **WHEN** the roadmap reviews whether `ERP` pages such as `需求池` or `MRP结果` are ready to expand
- **THEN** the review MUST first confirm that first-batch `APS` pages have already stabilized planning objects, constraint semantics, and page jump structure
- **AND** later `ERP` plan-consumption pages MUST inherit those approved planning baselines rather than redefining them
