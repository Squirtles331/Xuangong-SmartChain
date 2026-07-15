# page-ownership-alignment Specification

## Purpose

TBD - created by archiving change realign-menu-naming-and-ownership. Update Purpose after archive.

## Requirements

### Requirement: Every navigable page SHALL declare ownership metadata

The system SHALL define ownership metadata for every navigable page, including at minimum the primary owner system, collaborator systems, related core object, and final truth boundary. This metadata MUST be maintained in route definitions, documentation, or other internal artifacts and MUST NOT rely on runtime page copy for expression.

#### Scenario: Standard page ownership definition

- **WHEN** a page is included in the canonical menu catalog
- **THEN** the page MUST include explicit ownership metadata rather than relying on menu placement alone
- **AND** that metadata MUST remain an internal architecture artifact rather than a required runtime page section

#### Scenario: Router and documentation updates

- **WHEN** route metadata or documentation is updated during the realignment
- **THEN** the ownership metadata MUST remain synchronized with the canonical menu catalog

### Requirement: Joint-decision pages SHALL distinguish decision ownership from execution ownership

The system SHALL explicitly record the different roles for joint-decision pages instead of collapsing them into a single owner. This distinction MUST remain available in internal metadata and documentation even when runtime pages do not display it as user-facing explanation content.

#### Scenario: Rework responsibility split

- **WHEN** a page represents a `返工` flow
- **THEN** the ownership definition MUST record that `QMS` decides whether rework is allowed and `MES` executes the rework chain

#### Scenario: Version cutover responsibility split

- **WHEN** a page represents a `版本切换` flow
- **THEN** the ownership definition MUST record that `PLM` owns version legality and initiation while `MES` owns on-site cutover execution status

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

### Requirement: First-batch WMS transaction pages SHALL declare explicit warehouse-object ownership

The system SHALL explicitly distinguish inbound, picking, inventory, return, count, and transfer ownership across the first-batch `WMS` pages instead of treating the warehouse area as one generic stock bucket.

#### Scenario: Inbound and picking pages declare WMS transaction ownership

- **WHEN** a page is `收货入库`
- **THEN** the page MUST declare `WMS` as the owner of `收货单 / 入库单`
- **AND** upstream purchase, production, or source-document information MUST be presented as referenced collaborators rather than co-owning maintenance systems

- **WHEN** a page is `生产领料`
- **THEN** the page MUST declare `WMS` as the owner of `领料单`
- **AND** it MUST distinguish warehouse-issue ownership from `MES` actual feed and consumption ownership

#### Scenario: Inventory and adjustment pages declare WMS stock truth

- **WHEN** a page is `库存台账`
- **THEN** the page MUST declare `WMS` as the owner of `库存余额 / 库存批次`
- **AND** it MUST distinguish inventory truth from `MES` WIP truth or `ERP` accounting carry truth

- **WHEN** a page is `退料退货`, `库存盘点`, or `库存调拨`
- **THEN** the page MUST declare `WMS` as the owner of the corresponding warehouse transaction object
- **AND** it MUST distinguish transaction correction or movement truth from quality-decision truth

### Requirement: First-batch WMS pages SHALL preserve collaborator-system boundaries

The system SHALL preserve `MES` as the execution source-truth owner and `QMS` as the quality-decision owner even when first-batch `WMS` pages expose related source or judgment information.

#### Scenario: MES remains the source-truth owner for execution-linked warehouse pages

- **WHEN** `生产领料`, `收货入库`, or a related first-batch `WMS` page shows work-order, completion, or backflush context
- **THEN** the ownership definition MUST preserve `MES` as the owner of the execution source object
- **AND** `WMS` MUST only own the warehouse transaction fact created from that source

#### Scenario: QMS remains the decision owner for quality-linked warehouse pages

- **WHEN** a first-batch `WMS` page shows quality markers, release hints, or future batch-control context
- **THEN** the ownership definition MUST preserve `QMS` as the final quality-decision owner
- **AND** `WMS` MUST only own the stock control or warehouse transaction consequence of that decision

### Requirement: Runtime pages SHALL NOT expose ownership metadata as user-facing content

The system SHALL keep ownership metadata available for internal governance but MUST NOT expose ownership labels, ownership panels, or truth-boundary descriptions as runtime product content.

#### Scenario: Standard runtime page hides ownership exposition

- **WHEN** a runtime page has internal ownership metadata
- **THEN** the page MUST NOT display labels such as `页面归属`, `主责系统`, `协同系统`, `核心对象`, or `边界说明`

#### Scenario: Shared placeholder page hides ownership exposition

- **WHEN** a shared placeholder or planned page consumes route metadata with ownership fields
- **THEN** the runtime page MUST NOT render an ownership-specific side card or explanatory ownership section

### Requirement: First-batch QMS pages SHALL declare explicit quality-object ownership

The system SHALL explicitly distinguish template, inspection, and nonconformance ownership across the first-batch `QMS` pages instead of treating the quality area as one generic judgment bucket.

#### Scenario: Template and inspection pages declare QMS quality ownership

- **WHEN** a page is `检验模板`
- **THEN** the page MUST declare `QMS` as the owner of `检验标准 / 检验模板`
- **AND** upstream material, supplier, or engineering references MUST be presented as referenced collaborators rather than co-owning maintenance systems

- **WHEN** a page is `来料检验`, `过程检验`, or `完工检验`
- **THEN** the page MUST declare `QMS` as the owner of the corresponding `检验任务 / 检验记录`
- **AND** it MUST distinguish quality-object ownership from inbound, execution, or completion source-object ownership

#### Scenario: Nonconformance page declares QMS judgment ownership

- **WHEN** a page is `不合格处置`
- **THEN** the page MUST declare `QMS` as the owner of `不合格处理单 / 质量裁决结论`
- **AND** it MUST distinguish judgment ownership from downstream rework, scrap, or stock-control execution ownership

### Requirement: First-batch QMS pages SHALL preserve collaborator-system boundaries

The system SHALL preserve `WMS` as the inbound and stock-truth owner and `MES` as the execution-truth owner even when first-batch `QMS` pages expose related source or consequence information.

#### Scenario: WMS remains the source-truth owner for incoming-quality pages

- **WHEN** `来料检验` shows receipt, arrival, supplier, lot, or batch-control context
- **THEN** the ownership definition MUST preserve `WMS` as the owner of the inbound or stock-related source object
- **AND** `QMS` MUST only own the inspection and judgment object created from that source

#### Scenario: MES remains the source-truth owner for execution-quality pages

- **WHEN** `过程检验`, `完工检验`, or `不合格处置` shows work-order, operation, completion, or rework-follow-up context
- **THEN** the ownership definition MUST preserve `MES` as the owner of the execution source object or rework execution object
- **AND** `QMS` MUST only own the inspection or judgment truth created from that source

### Requirement: First-batch QMS judgment pages SHALL distinguish decision ownership from execution ownership

The system SHALL explicitly distinguish `QMS` decision ownership from the downstream execution ownership carried by `MES` and `WMS`.

#### Scenario: Rework and scrap consequences remain downstream execution concerns

- **WHEN** `不合格处置` records a decision such as `返工`, `报废`, `特采`, or `复检`
- **THEN** the ownership definition MUST preserve `QMS` as the owner of whether-that-decision-is-made
- **AND** it MUST distinguish that role from `MES` rework execution ownership and `WMS` stock-control execution ownership
