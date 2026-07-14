## ADDED Requirements

### Requirement: Second-batch MES visibility and control pages SHALL declare explicit execution ownership boundaries

The system SHALL explicitly distinguish coordinator, WIP, kanban, and exception ownership across the second-batch `MES` pages.

#### Scenario: Coordinator and WIP pages declare MES execution ownership

- **WHEN** a page is `工序任务`
- **THEN** the page MUST declare `MES` as the owner of `工序任务池`
- **AND** it MUST distinguish coordinator ownership from the worker-facing `我的任务` entry

- **WHEN** a page is `WIP`
- **THEN** the page MUST declare `MES` as the owner of `WIP批次`
- **AND** it MUST distinguish execution-stage WIP truth from `WMS` inventory truth

#### Scenario: Kanban and exception pages distinguish consumption from source truth

- **WHEN** a page is `生产看板`
- **THEN** the page MUST declare `MES` as the organizer of `生产监控快照`
- **AND** it MUST identify task, WIP, and exception data as consumed execution facts rather than newly maintained source truth

- **WHEN** a page is `异常中心`
- **THEN** the page MUST declare `MES` as the owner of `执行异常`
- **AND** it MUST distinguish execution lock/process/release ownership from downstream `QMS` quality judgments and `WMS` inventory transactions
