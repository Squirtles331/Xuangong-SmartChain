# mes-third-batch-material-readiness-pages Specification

## Purpose
TBD - created by archiving change mes-third-batch-material-readiness-pages. Update Purpose after archive.
## Requirements
### Requirement: The third-batch MES pages SHALL freeze the readiness and material-fact scope after the control/visibility batch

The system SHALL define a formal third-batch `MES` static-page scope for the readiness and actual-consumption layer that follows the first two `MES` batches without redefining them.

#### Scenario: Approved third-batch page scope

- **WHEN** the team begins the next `MES` page batch after the second-batch control/visibility pages
- **THEN** the approved third-batch scope MUST be limited to `开工齐套检查` and `投料与消耗`
- **AND** pages such as `产品追溯`, `执行日志`, `返工执行`, and `委外工单` MUST remain outside third-batch acceptance

### Requirement: Each third-batch MES page SHALL declare one primary object and one page role

The system SHALL keep object ownership and page role explicit across the third-batch pages.

#### Scenario: Readiness and consumption objects are distinguished

- **WHEN** the third-batch page is `开工齐套检查`
- **THEN** the page MUST declare `开工放行条件` as its primary object
- **AND** it MUST act as a readiness and release page rather than a warehouse transaction page

- **WHEN** the third-batch page is `投料与消耗`
- **THEN** the page MUST declare `投料消耗记录` as its primary object
- **AND** it MUST act as an actual-consumption fact page rather than a stock-movement posting page

### Requirement: Third-batch MES state semantics SHALL preserve MES/WMS/QMS/PLM ownership boundaries

The system SHALL define third-batch state semantics that clarify readiness and consumption behavior without blurring collaborator ownership.

#### Scenario: Start readiness semantics remain inside MES release coordination

- **WHEN** `开工齐套检查` is implemented in the static phase
- **THEN** its approved lifecycle MUST be `collecting -> ready -> blocked -> released`
- **AND** readiness facts from `PLM`, `WMS`, and `QMS` MUST be consumed as collaborator signals rather than re-owned transaction truth

#### Scenario: Consumption semantics distinguish MES facts from warehouse movement

- **WHEN** `投料与消耗` is implemented in the static phase
- **THEN** its approved lifecycle MUST be `draft -> in_use -> reconciled -> closed`
- **AND** the page MUST preserve `MES` ownership of actual consumption facts while keeping `WMS` as the owner of issue, return, and stock movement truth

