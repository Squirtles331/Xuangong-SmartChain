# mes-second-batch-visibility-control-pages Specification

## Purpose

TBD - created by archiving change mes-second-batch-visibility-control-pages. Update Purpose after archive.

## Requirements

### Requirement: The second-batch MES pages SHALL freeze the control and visibility scope after the first execution batch

The system SHALL define a formal second-batch `MES` static-page scope for the coordination and visibility layer that extends the first-batch execution chain without reopening it.

#### Scenario: Approved second-batch page scope

- **WHEN** the team begins the next `MES` page batch after the first-batch execution pages
- **THEN** the approved second-batch scope MUST be limited to `工序任务`, `WIP`, `生产看板`, and `异常中心`
- **AND** pages such as `齐套检查`, `投料与消耗`, `产品追溯`, `执行日志`, `返工执行`, and `委外工单` MUST remain outside second-batch acceptance

### Requirement: Each second-batch MES page SHALL declare one primary object and one page role

The system SHALL keep object ownership and page role explicit across the second-batch pages.

#### Scenario: Coordinator, WIP, kanban, and exception objects are distinguished

- **WHEN** the second-batch page is `工序任务`
- **THEN** the page MUST declare `工序任务池` as its primary object
- **AND** it MUST act as a coordinator-facing task-pool page rather than a duplicate of `我的任务`

- **WHEN** the second-batch page is `WIP`
- **THEN** the page MUST declare `WIP批次` as its primary object
- **AND** it MUST act as an execution-stage batch ledger rather than a warehouse inventory page

- **WHEN** the second-batch page is `生产看板`
- **THEN** the page MUST declare `生产监控快照` as its primary object
- **AND** it MUST act as a consumption-only monitoring page rather than a maintenance page

- **WHEN** the second-batch page is `异常中心`
- **THEN** the page MUST declare `执行异常` as its primary object
- **AND** it MUST act as an execution lock/process/release coordination page

### Requirement: Second-batch MES state semantics SHALL stay compatible with the first-batch execution truth

The system SHALL define second-batch state semantics that extend, but do not contradict, the first-batch `MES` execution baseline.

#### Scenario: Task coordination stays compatible with the first-batch task flow

- **WHEN** `工序任务` presents task progression
- **THEN** it MUST inherit the approved core task flow `pending -> assigned -> running -> completed`
- **AND** any blocked or escalation marker MUST be treated as a coordination signal rather than a silent replacement of the primary task lifecycle

#### Scenario: WIP, kanban, and exception semantics are frozen for static implementation

- **WHEN** `WIP` is implemented in the static phase
- **THEN** its approved batch lifecycle MUST be `queued -> processing -> frozen -> rework -> completed`

- **WHEN** `生产看板` is implemented in the static phase
- **THEN** its approved monitoring severity lifecycle MUST be `normal -> attention -> overdue`

- **WHEN** `异常中心` is implemented in the static phase
- **THEN** its approved exception lifecycle MUST be `identified -> locked -> processing -> awaiting_release -> released -> closed`
