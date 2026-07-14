## ADDED Requirements

### Requirement: The phase-one MES roadmap SHALL deliver a fourth trace/audit batch after the readiness/material batch

The phase-one roadmap SHALL explicitly separate the third-batch readiness/material pages from the fourth-batch traceability and audit pages in `MES`.

#### Scenario: Fourth-batch MES pages follow third-batch readiness/material stabilization

- **WHEN** the team reviews what to build after the third-batch `MES` pages are stabilized
- **THEN** the roadmap MUST recommend a fourth `MES` batch for `产品追溯` and `执行日志`
- **AND** that batch MUST begin before `返工执行`

#### Scenario: Remaining MES satellites wait for trace/audit baselines

- **WHEN** the roadmap evaluates whether to start broader `MES` satellite pages
- **THEN** it MUST first confirm that trace-chain and execution-audit semantics have already been stabilized
- **AND** later `MES`, `QMS`, `WMS`, and `IoT` pages MUST inherit those approved baselines rather than redefining them
