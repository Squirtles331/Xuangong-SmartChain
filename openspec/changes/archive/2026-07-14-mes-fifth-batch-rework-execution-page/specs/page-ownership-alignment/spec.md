## ADDED Requirements

### Requirement: The fifth-batch MES rework page SHALL declare explicit decision/execution ownership boundaries

The system SHALL explicitly distinguish `QMS` decision ownership from `MES` rework-execution ownership.

#### Scenario: Rework page declares MES execution ownership and QMS decision collaboration

- **WHEN** a page is `返工执行`
- **THEN** the page MUST declare `MES` as the owner of `返工单`
- **AND** it MUST declare `QMS` as the collaborator that owns the whether-rework-is-allowed decision truth
