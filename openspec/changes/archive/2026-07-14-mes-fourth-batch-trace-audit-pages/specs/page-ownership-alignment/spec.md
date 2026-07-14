## ADDED Requirements

### Requirement: Fourth-batch MES trace and audit pages SHALL declare explicit information-ownership boundaries

The system SHALL explicitly distinguish trace-chain organization ownership and execution-audit ownership across the fourth-batch `MES` pages.

#### Scenario: Trace page declares MES trace-chain organization ownership

- **WHEN** a page is `产品追溯`
- **THEN** the page MUST declare `MES` as the organizer of `产品追溯链`
- **AND** it MUST distinguish that role from `QMS` quality history truth, `WMS` stock trace truth, and `IoT` telemetry truth

#### Scenario: Audit page declares MES execution-audit ownership

- **WHEN** a page is `执行日志`
- **THEN** the page MUST declare `MES` as the owner of `执行审计记录`
- **AND** it MUST distinguish operator-facing audit records from raw technical logs or backend debugging output
