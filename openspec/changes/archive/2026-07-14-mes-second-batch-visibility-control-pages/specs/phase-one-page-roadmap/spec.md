## ADDED Requirements

### Requirement: The phase-one MES roadmap SHALL deliver a second control/visibility batch after the first execution batch

The phase-one roadmap SHALL explicitly separate the first-batch execution-entry pages from the second-batch coordination and visibility pages in `MES`.

#### Scenario: Second-batch MES pages follow first-batch execution stabilization

- **WHEN** the team reviews what to build after the first-batch `MES` pages are stabilized
- **THEN** the roadmap MUST recommend a second `MES` batch for `工序任务`, `WIP`, `生产看板`, and `异常中心`
- **AND** that batch MUST begin before `齐套检查`, `投料与消耗`, `产品追溯`, or `返工执行`

#### Scenario: Remaining MES satellites wait for second-batch control baselines

- **WHEN** the roadmap evaluates whether to start broader `MES` satellite pages
- **THEN** it MUST first confirm that task coordination, WIP visibility, kanban visibility, and exception control semantics have already been stabilized
- **AND** later `MES`, `WMS`, and `QMS` pages MUST inherit those approved baselines rather than redefining them
