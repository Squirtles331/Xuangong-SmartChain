## ADDED Requirements

### Requirement: The phase-one roadmap SHALL formalize SRM as the next collaboration batch after ERP

The phase-one roadmap SHALL explicitly transition from the approved `ERP` batch into a first-batch `SRM` procurement-collaboration baseline before opening broader `CRM` customer-collaboration pages.

#### Scenario: SRM follows ERP in the approved roadmap

- **WHEN** the team finishes the current approved `ERP` batch and decides the next module batch
- **THEN** `SRM` MUST be the next recommended module batch before `CRM`
- **AND** the batch MUST focus on stabilizing `采购申请`, `采购订单`, and `采购退货` before broader supplier collaboration expansion

#### Scenario: SRM batch stabilizes before CRM starts

- **WHEN** the roadmap reviews whether `CRM` pages are ready to begin
- **THEN** the review MUST first confirm that first-batch `SRM` pages have already stabilized procurement-collaboration objects, status semantics, and page jump structure
- **AND** later `CRM` pages MUST inherit those approved supplier-collaboration baselines where cross-module relations exist rather than redefining them

### Requirement: The phase-one roadmap SHALL formalize CRM as the next customer-collaboration batch after SRM

The phase-one roadmap SHALL explicitly transition from the approved first-batch `SRM` pages into a first-batch `CRM` customer-collaboration baseline instead of skipping directly to deeper analysis-oriented modules.

#### Scenario: CRM follows SRM in the approved roadmap

- **WHEN** the team finishes the current approved `SRM` batch and decides the next module batch
- **THEN** `CRM` MUST be the next recommended module batch
- **AND** that batch MUST begin after supplier-side collaboration semantics have already been stabilized

#### Scenario: CRM batch starts from approved upstream collaboration baselines

- **WHEN** the roadmap reviews whether `CRM` pages such as order, contract, or receivable pages are ready to begin
- **THEN** the review MUST first confirm that `ERP` plan-consumption pages and first-batch `SRM` collaboration pages are already stabilized where those objects intersect
- **AND** `CRM` pages MUST inherit those approved upstream collaboration baselines rather than redefining supplier or downstream finance-carry truth
