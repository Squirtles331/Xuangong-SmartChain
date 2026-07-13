## ADDED Requirements

### Requirement: Phase-one delivery SHALL prioritize master-data and product-definition pages

The first implementation phase under this change SHALL prioritize `MDM` and `PLM` pages that establish canonical object definitions before expanding into downstream execution or collaboration pages.

#### Scenario: MDM and PLM pages are developed first

- **WHEN** the team sequences first-phase page delivery
- **THEN** pages such as `物料`、`仓库/库位`、`客户/供应商`、`EBOM`、`MBOM`、`工艺路线` and `ECN` MUST be scheduled before execution pages that consume those objects

#### Scenario: Upstream definitions are stable before downstream usage

- **WHEN** a downstream team requests new `MES`、`WMS` or `QMS` execution pages
- **THEN** the request MUST confirm that its upstream object definitions and status semantics are already stabilized or are being stabilized in the same batch

### Requirement: Execution-chain pages SHALL follow upstream object readiness

The system delivery roadmap SHALL require work-order, reporting, warehousing, and quality pages to follow explicit upstream readiness checks rather than being developed in isolation.

#### Scenario: Work-order page depends on released upstream objects

- **WHEN** the team begins designing a `工单` or `派工` page
- **THEN** canonical definitions for material, BOM, and process routing MUST already exist
- **AND** the page MUST reference those upstream objects using the approved naming and status rules

#### Scenario: Quality and inventory pages follow execution truth

- **WHEN** the team begins designing `入库`、`领料/退料` or `检验` pages
- **THEN** the related execution objects and transaction relationships MUST already be represented in the roadmap
- **AND** the pages MUST preserve `MES`、`WMS` and `QMS` truth boundaries rather than collapsing them into one workflow owner

### Requirement: Phase transitions SHALL use explicit completion gates

The roadmap SHALL define explicit completion gates between the static-page phase, mock phase, and API phase for each page batch.

#### Scenario: Static batch completes before mock batch starts

- **WHEN** a batch such as `对象定义批` or `执行主链批` is reviewed for completion
- **THEN** the batch MUST confirm page structure stability, canonical field coverage, state-tag consistency, and object mapping completeness before mock work starts

#### Scenario: Mock batch completes before API batch starts

- **WHEN** the team prepares to design APIs for a completed batch
- **THEN** the batch MUST already have approved mock payloads for list, detail, line items, and status transitions
- **AND** API DTO design MUST inherit those approved structures
