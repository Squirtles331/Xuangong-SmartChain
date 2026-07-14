## ADDED Requirements

### Requirement: The phase-one MES roadmap SHALL deliver a third readiness/material batch after the control/visibility batch

The phase-one roadmap SHALL explicitly separate the second-batch visibility/control pages from the third-batch readiness and material-fact pages in `MES`.

#### Scenario: Third-batch MES pages follow second-batch coordination stabilization

- **WHEN** the team reviews what to build after the second-batch `MES` pages are stabilized
- **THEN** the roadmap MUST recommend a third `MES` batch for `开工齐套检查` and `投料与消耗`
- **AND** that batch MUST begin before `产品追溯`, `执行日志`, or `返工执行`

#### Scenario: Remaining MES satellites wait for readiness/material baselines

- **WHEN** the roadmap evaluates whether to start broader `MES` satellite pages
- **THEN** it MUST first confirm that start-readiness and actual-consumption semantics have already been stabilized
- **AND** later `MES`, `WMS`, and `QMS` pages MUST inherit those approved baselines rather than redefining them
