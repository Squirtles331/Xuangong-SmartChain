## ADDED Requirements

### Requirement: The phase-one roadmap SHALL formalize QMS as the next downstream quality batch after WMS

The phase-one roadmap SHALL explicitly transition from the approved `WMS` warehouse transaction batch into a first-batch `QMS` quality baseline before opening broader planning, business, or quality-analysis modules.

#### Scenario: QMS follows WMS in the approved roadmap

- **WHEN** the team finishes the current approved `WMS` batch and decides the next module batch
- **THEN** `QMS` MUST be the next recommended module batch before `APS`, `ERP`, or broader analysis-oriented modules
- **AND** the batch MUST focus on stabilizing `检验模板`, `来料检验`, `过程检验`, `完工检验`, and `不合格处置` before deeper downstream expansion

#### Scenario: QMS batch stabilizes before broader quality or planning pages start

- **WHEN** the roadmap reviews whether deeper `QMS`, `APS`, or `ERP` pages are ready to begin
- **THEN** the review MUST first confirm that first-batch `QMS` pages have already stabilized inspection objects, judgment semantics, and page jump structure
- **AND** later quality-analysis, planning, and business pages MUST inherit those approved quality baselines rather than redefining them
