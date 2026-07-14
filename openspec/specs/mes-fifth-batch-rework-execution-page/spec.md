# mes-fifth-batch-rework-execution-page Specification

## Purpose
TBD - created by archiving change mes-fifth-batch-rework-execution-page. Update Purpose after archive.
## Requirements
### Requirement: The fifth-batch MES page SHALL freeze the rework-execution scope after the trace/audit batch

The system SHALL define a formal fifth-batch `MES` static-page scope for the rework-execution page that follows the first four `MES` batches without redefining them.

#### Scenario: Approved fifth-batch page scope

- **WHEN** the team begins the next `MES` page batch after the traceability/audit pages
- **THEN** the approved fifth-batch scope MUST be limited to `返工执行`

### Requirement: The fifth-batch MES page SHALL declare one primary object and one page role

The system SHALL keep object ownership and page role explicit for the rework-execution page.

#### Scenario: Rework-execution object is distinguished from rework decision

- **WHEN** the page is `返工执行`
- **THEN** the page MUST declare `返工单` as its primary object
- **AND** it MUST act as a rework execution page rather than a rework-decision page

### Requirement: Fifth-batch MES state semantics SHALL preserve the QMS-decides / MES-executes split

The system SHALL define fifth-batch state semantics that keep decision and execution ownership separate.

#### Scenario: Rework-execution semantics remain inside MES execution scope

- **WHEN** `返工执行` is implemented in the static phase
- **THEN** its approved lifecycle MUST be `pending_decision -> released -> executing -> pending_recheck -> closed`
- **AND** `QMS` rework permission MUST be consumed as a collaborator decision reference rather than re-owned by `MES`

