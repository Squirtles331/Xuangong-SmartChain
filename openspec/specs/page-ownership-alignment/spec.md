# page-ownership-alignment Specification

## Purpose

TBD - created by archiving change realign-menu-naming-and-ownership. Update Purpose after archive.
## Requirements
### Requirement: Every navigable page SHALL declare ownership metadata

The system SHALL define ownership metadata for every navigable page, including at minimum the primary owner system, collaborator systems, related core object, and final truth boundary.

#### Scenario: Standard page ownership definition

- **WHEN** a page is included in the canonical menu catalog
- **THEN** the page MUST include explicit ownership metadata rather than relying on menu placement alone

#### Scenario: Router and documentation updates

- **WHEN** route metadata or documentation is updated during the realignment
- **THEN** the ownership metadata MUST remain synchronized with the canonical menu catalog

### Requirement: Joint-decision pages SHALL distinguish decision ownership from execution ownership

For pages where one system decides and another system executes, the system SHALL explicitly record and expose the different roles instead of collapsing them into a single owner.

#### Scenario: Rework responsibility split

- **WHEN** the page represents a `返工` flow
- **THEN** the ownership definition MUST state that `QMS` decides whether rework is allowed and `MES` executes the rework chain

#### Scenario: Version cutover responsibility split

- **WHEN** the page represents a `版本切换` flow
- **THEN** the ownership definition MUST state that `PLM` owns version legality and initiation while `MES` owns on-site cutover execution status

### Requirement: Navigation placement SHALL NOT redefine system truth boundaries

The system SHALL preserve architecture truth boundaries even when a page is regrouped under a more user-friendly product menu.

#### Scenario: Inventory truth remains with WMS

- **WHEN** a page about领料、退料、配送 or batch inventory appears near execution workflows
- **THEN** the ownership definition MUST preserve `WMS` as the inventory truth owner and MUST NOT redefine the page as `MES` inventory truth

#### Scenario: Consumption truth remains with MES

- **WHEN** a page captures投料、实际消耗 or工序消耗事实
- **THEN** the ownership definition MUST preserve `MES` as the production consumption truth owner and MUST NOT equate warehouse issue completion with consumption completion

#### Scenario: Master data placement does not hide cross-domain governance

- **WHEN** `MDM` pages are grouped under a user-facing platform or master-data menu
- **THEN** the ownership definition MUST still identify `MDM` as a cross-domain governance capability rather than a simple platform settings page

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

### Requirement: Third-batch MES readiness and consumption pages SHALL declare explicit execution ownership boundaries

The system SHALL explicitly distinguish readiness ownership and actual-consumption ownership across the third-batch `MES` pages.

#### Scenario: Readiness page declares MES release coordination ownership

- **WHEN** a page is `开工齐套检查`
- **THEN** the page MUST declare `MES` as the owner of `开工放行条件`
- **AND** it MUST distinguish readiness aggregation from `WMS` warehouse preparation truth, `QMS` release judgment truth, and `PLM` version truth

#### Scenario: Consumption page declares MES actual-consumption ownership

- **WHEN** a page is `投料与消耗`
- **THEN** the page MUST declare `MES` as the owner of `投料消耗记录`
- **AND** it MUST distinguish actual production consumption truth from `WMS` issue/return and stock-movement truth

### Requirement: The fifth-batch MES rework page SHALL declare explicit decision/execution ownership boundaries

The system SHALL explicitly distinguish `QMS` decision ownership from `MES` rework-execution ownership.

#### Scenario: Rework page declares MES execution ownership and QMS decision collaboration

- **WHEN** a page is `返工执行`
- **THEN** the page MUST declare `MES` as the owner of `返工单`
- **AND** it MUST declare `QMS` as the collaborator that owns the whether-rework-is-allowed decision truth

### Requirement: First-batch MES execution pages SHALL declare explicit execution-object ownership

The system SHALL explicitly distinguish work-order ownership, task ownership, and report ownership across the first-batch `MES` execution pages instead of treating the whole execution area as one generic workflow bucket.

#### Scenario: Work-order pages declare MES work-order ownership

- **WHEN** a page is `工单列表`, `新建工单`, or `工单详情`
- **THEN** the page MUST declare `MES` as the owner of `生产工单`
- **AND** collaborator systems such as `PLM`, `WMS`, or `QMS` MUST be presented as referenced collaborators rather than co-owning maintenance systems

#### Scenario: Task and report pages declare narrower execution ownership

- **WHEN** a page is `我的任务`
- **THEN** the page MUST declare `MES` as the owner of `工序任务`
- **AND** it MUST distinguish task execution ownership from work-order maintenance ownership

- **WHEN** a page is `工序报工` or `报工记录`
- **THEN** the page MUST declare `MES` as the owner of `报工记录`
- **AND** it MUST distinguish execution fact ownership from final quality-judgment ownership

### Requirement: First-batch MES relation blocks SHALL NOT redefine downstream truth owners

The system SHALL preserve `WMS` and `QMS` truth boundaries even when first-batch `MES` detail pages expose related inventory or quality blocks.

#### Scenario: Material and inventory relations remain WMS truth

- **WHEN** `工单详情` or another first-batch `MES` page shows material-issue or inbound-related information
- **THEN** the ownership definition MUST preserve `WMS` as the warehouse-transaction truth owner
- **AND** `MES` MUST only present the data as related execution context

#### Scenario: Quality relations remain QMS truth

- **WHEN** `工序报工` or `工单详情` shows quality gates, inspection markers, or nonconformance hints
- **THEN** the ownership definition MUST preserve `QMS` as the final inspection and judgment truth owner
- **AND** `MES` MUST only own the reporting fact and execution context

