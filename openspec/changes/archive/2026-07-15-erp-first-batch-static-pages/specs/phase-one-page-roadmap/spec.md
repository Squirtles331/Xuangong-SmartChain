## ADDED Requirements

### Requirement: The phase-one roadmap SHALL formalize ERP as the next business-plan batch after APS

The phase-one roadmap SHALL explicitly transition from the approved first-batch `APS` pages into a first-batch `ERP` business-plan baseline before opening broader collaboration or analysis modules.

#### Scenario: ERP follows APS in the approved roadmap

- **WHEN** the team finishes the approved first-batch `APS` pages and decides the next module batch
- **THEN** `ERP` MUST be the next recommended module batch before `SRM`, `CRM`, or broader finance-analysis pages
- **AND** the batch MUST focus on stabilizing `需求池`, `物料需求结果`, `物料需求历史`, `净变更计划`, and `总账对账`

#### Scenario: ERP first batch stabilizes before broader ERP expansion

- **WHEN** the roadmap reviews whether `ERP` pages such as `预测需求`, `多工厂计划`, `财务概览`, `成本分析`, or `财务报表` are ready to expand
- **THEN** the review MUST first confirm that first-batch `ERP` pages have already stabilized plan-input objects, MRP suggestion semantics, and accounting-carry page structure
- **AND** later ERP planning, finance-analysis, and collaboration pages MUST inherit those approved baselines rather than redefining them
