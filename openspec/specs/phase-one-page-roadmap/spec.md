# phase-one-page-roadmap Specification

## Purpose

Define the delivery order, upstream-readiness constraints, and phase gates for phase-one page construction.
## Requirements
### Requirement: Phase-one delivery SHALL prioritize master-data and product-definition pages

The first implementation phase under this change SHALL prioritize `MDM` and `PLM` pages that establish canonical object definitions before expanding into downstream execution or collaboration pages.

#### Scenario: MDM and PLM pages are developed first

- **WHEN** the team sequences first-phase page delivery
- **THEN** pages such as `物料`, `仓库/库位`, `客户/供应商`, `EBOM`, `MBOM`, `工艺路线`, and `ECN` MUST be scheduled before execution pages that consume those objects

#### Scenario: Upstream definitions are stable before downstream usage

- **WHEN** a downstream team requests new `MES`, `WMS`, or `QMS` execution pages
- **THEN** the request MUST confirm that its upstream object definitions and status semantics are already stabilized or are being stabilized in the same batch

### Requirement: Execution-chain pages SHALL follow upstream object readiness

The system delivery roadmap SHALL require work-order, reporting, warehousing, and quality pages to follow explicit upstream readiness checks rather than being developed in isolation.

#### Scenario: Work-order page depends on released upstream objects

- **WHEN** the team begins designing a `工单` or `派工` page
- **THEN** canonical definitions for material, BOM, and process routing MUST already exist
- **AND** the page MUST reference those upstream objects using the approved naming and status rules

#### Scenario: Quality and inventory pages follow execution truth

- **WHEN** the team begins designing `入库`, `领料/退料`, or `检验` pages
- **THEN** the related execution objects and transaction relationships MUST already be represented in the roadmap
- **AND** the pages MUST preserve `MES`, `WMS`, and `QMS` truth boundaries rather than collapsing them into one workflow owner

### Requirement: Phase transitions SHALL use explicit completion gates

The roadmap SHALL define explicit completion gates between the static-page phase, mock phase, and API phase for each page batch.

#### Scenario: Static batch completes before mock batch starts

- **WHEN** a batch such as `对象定义批` or `执行主链批` is reviewed for completion
- **THEN** the batch MUST confirm page structure stability, canonical field coverage, state-tag consistency, and object mapping completeness before mock work starts

#### Scenario: Mock batch completes before API batch starts

- **WHEN** the team prepares to design APIs for a completed batch
- **THEN** the batch MUST already have approved mock payloads for list, detail, line items, and status transitions
- **AND** API DTO design MUST inherit those approved structures

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

### Requirement: The phase-one MES roadmap SHALL deliver a second control/visibility batch after the first execution batch

The phase-one roadmap SHALL explicitly separate the first-batch execution-entry pages from the second-batch coordination and visibility pages in `MES`.

#### Scenario: Second-batch MES pages follow first-batch execution stabilization

- **WHEN** the team reviews what to build after the first-batch `MES` pages are stabilized
- **THEN** the roadmap MUST recommend a second `MES` batch for `工序任务`, `WIP`, `生产看板`, and `异常中心`
- **AND** that batch MUST begin before `齐套检查`, `投料与消耗`, `产品追溯`, or `返工执行`

#### Scenario: Remaining MES satellites wait for second-batch control baselines

- **WHEN** the roadmap evaluates whether to start broader `MES` satellite pages
- **THEN** it MUST first confirm that task coordination, WIP visibility, kanban visibility, and exception control semantics have already been stabilized
- **AND** later `MES`, `WMS`, and `QMS` pages MUST inherit those approved baselines rather than redefining them

### Requirement: The phase-one MES roadmap SHALL deliver a third readiness/material batch after the control/visibility batch

The phase-one roadmap SHALL explicitly separate the second-batch visibility/control pages from the third-batch readiness and material-fact pages in `MES`.

#### Scenario: Third-batch MES pages follow second-batch coordination stabilization

- **WHEN** the team reviews what to build after the second-batch `MES` pages are stabilized
- **THEN** the roadmap MUST recommend a third `MES` batch for `开工齐套检查` and `投料与消耗`
- **AND** that batch MUST begin before `产品追溯`, `执行日志`, or `返工执行`

#### Scenario: Remaining MES satellites wait for readiness/material baselines

- **WHEN** the roadmap evaluates whether to start broader `MES` satellite pages
- **THEN** it MUST first confirm that start-readiness and actual-consumption semantics have already been stabilized
- **AND** later `MES`, `WMS`, and `QMS` pages MUST inherit those approved baselines rather than redefining them

### Requirement: The phase-one MES roadmap SHALL deliver the rework-execution page after the trace/audit batch

The phase-one roadmap SHALL explicitly place `返工执行` after the fourth-batch traceability and audit pages.

#### Scenario: Rework execution follows trace/audit stabilization

- **WHEN** the team reviews what to build after the fourth-batch `MES` pages are stabilized
- **THEN** the roadmap MUST recommend `返工执行` as the next `MES` page

#### Scenario: MES execution chain closes before deeper downstream expansion

- **WHEN** the roadmap evaluates whether the current `MES` static execution chain is structurally complete
- **THEN** it MUST confirm that `返工执行` has already been stabilized as the final execution-only page in this phase

### Requirement: The phase-one roadmap SHALL formalize MES as the next execution batch after PLM

The phase-one roadmap SHALL explicitly transition from first-batch upstream definition pages into a first-batch `MES` execution baseline before opening broader downstream transaction batches.

#### Scenario: MES follows PLM in the approved roadmap

- **WHEN** the team finishes the static-first `PLM` definition batch and decides the next module batch
- **THEN** `MES` MUST be the next recommended execution batch before `WMS` or `QMS`
- **AND** the batch MUST focus on stabilizing work-order, task, and reporting relationships before expanding into warehouse or quality transaction pages

#### Scenario: First-batch execution pages complete before downstream transaction batches begin

- **WHEN** the roadmap reviews whether `WMS` or `QMS` pages are ready to start
- **THEN** the review MUST confirm that first-batch `MES` pages have already stabilized execution objects, status semantics, and page jump structure
- **AND** downstream transaction pages MUST inherit those approved execution baselines rather than redefining them

### Requirement: The phase-one roadmap SHALL formalize WMS as the next downstream transaction batch after MES

The phase-one roadmap SHALL explicitly transition from the approved `MES` execution chain into a first-batch `WMS` warehouse transaction baseline before opening `QMS` or later planning and business modules.

#### Scenario: WMS follows MES in the approved roadmap

- **WHEN** the team finishes the current approved `MES` batch and decides the next module batch
- **THEN** `WMS` MUST be the next recommended module batch before `QMS`, `APS`, or `ERP`
- **AND** the batch MUST focus on stabilizing receipt, picking, inventory, return, stock-count, and transfer relationships before broader downstream expansion

#### Scenario: WMS batch stabilizes before QMS starts

- **WHEN** the roadmap reviews whether `QMS` pages are ready to begin
- **THEN** the review MUST first confirm that first-batch `WMS` pages have already stabilized warehouse transaction objects, status semantics, and page jump structure
- **AND** `QMS` pages MUST inherit those approved warehouse transaction baselines rather than redefining them

### Requirement: The phase-one roadmap SHALL formalize QMS as the next downstream quality batch after WMS

The phase-one roadmap SHALL explicitly transition from the approved `WMS` warehouse transaction batch into a first-batch `QMS` quality baseline before opening broader planning, business, or quality-analysis modules.

#### Scenario: QMS follows WMS in the approved roadmap

- **WHEN** the team finishes the current approved `WMS` batch and decides the next module batch
- **THEN** `QMS` MUST be the next recommended module batch before `APS`, `ERP`, or broader analysis-oriented modules
- **AND** the batch MUST focus on stabilizing `检验模板`, `来料检验`, `过程检验`, `完工检验`, and `不合格处置` before deeper downstream expansion

#### Scenario: QMS batch stabilizes before broader quality or planning pages start

- **WHEN** the roadmap reviews whether deeper `QMS`, `APS`, or `ERP` pages are ready to begin
- **THEN** the review MUST first confirm that first-batch `QMS` pages have already stabilized inspection objects, judgment semantics, and page jump structure
- **AND** later quality-analysis, planning, and business pages MUST inherit those approved quality baselines rather than redefining them

### Requirement: The phase-one roadmap SHALL formalize APS as the next planning batch after QMS

The phase-one roadmap SHALL explicitly transition from the approved `QMS` batch into a first-batch `APS` planning baseline before opening broader `ERP` plan-consumption or business-document pages.

#### Scenario: APS follows QMS in the approved roadmap

- **WHEN** the team finishes the current approved `QMS` batch and decides the next module batch
- **THEN** `APS` MUST be the next recommended module batch before broader `ERP` planning-consumption pages
- **AND** the batch MUST focus on stabilizing `排程结果`, `排程约束`, `排程历史`, and `扰动重排`

#### Scenario: APS batch stabilizes before ERP planning pages expand

- **WHEN** the roadmap reviews whether `ERP` pages such as `需求池` or `MRP结果` are ready to expand
- **THEN** the review MUST first confirm that first-batch `APS` pages have already stabilized planning objects, constraint semantics, and page jump structure
- **AND** later `ERP` plan-consumption pages MUST inherit those approved planning baselines rather than redefining them

### Requirement: The phase-one roadmap SHALL formalize SRM as the next collaboration batch after ERP

The phase-one roadmap SHALL explicitly transition from the approved `ERP` batch into a first-batch `SRM` procurement-collaboration baseline before opening broader `CRM` customer-collaboration pages.

#### Scenario: SRM follows ERP in the approved roadmap

- **WHEN** the team finishes the current approved `ERP` batch and decides the next module batch
- **THEN** `SRM` MUST be the next recommended module batch before `CRM`
- **AND** the batch MUST focus on stabilizing `采购申请`, `采购订单`, and `采购退货` before broader supplier collaboration expansion

#### Scenario: SRM batch stabilizes before CRM starts

- **WHEN** the roadmap reviews whether `CRM` pages are ready to begin
- **THEN** the review MUST first confirm that first-batch `SRM` pages have already stabilized procurement-collaboration objects, status semantics, and page jump structure
- **AND** later `CRM` pages MUST inherit those approved supplier-collaboration baselines where cross-module relations exist rather than redefining them

### Requirement: The phase-one roadmap SHALL formalize CRM as the next customer-collaboration batch after SRM

The phase-one roadmap SHALL explicitly transition from the approved first-batch `SRM` pages into a first-batch `CRM` customer-collaboration baseline instead of skipping directly to deeper analysis-oriented modules.

#### Scenario: CRM follows SRM in the approved roadmap

- **WHEN** the team finishes the current approved `SRM` batch and decides the next module batch
- **THEN** `CRM` MUST be the next recommended module batch
- **AND** that batch MUST begin after supplier-side collaboration semantics have already been stabilized

#### Scenario: CRM batch starts from approved upstream collaboration baselines

- **WHEN** the roadmap reviews whether `CRM` pages such as order, contract, or receivable pages are ready to begin
- **THEN** the review MUST first confirm that `ERP` plan-consumption pages and first-batch `SRM` collaboration pages are already stabilized where those objects intersect
- **AND** `CRM` pages MUST inherit those approved upstream collaboration baselines rather than redefining supplier or downstream finance-carry truth


### Requirement: The phase-one roadmap SHALL formalize EAM as the next equipment-operation batch after CRM

The phase-one roadmap SHALL explicitly transition from the approved first-batch `CRM` pages into a first-batch `EAM` equipment-operation baseline before opening broader `IoT`, `BI`, or governance-oriented pages.

#### Scenario: EAM follows CRM in the approved roadmap

- **WHEN** the team finishes the current approved `CRM` batch and decides the next module batch
- **THEN** `EAM` MUST be the next recommended module batch
- **AND** that batch MUST begin from `�豸̨��`, `���`, `����`, and `ά��`

#### Scenario: EAM batch starts from approved upstream collaboration baselines

- **WHEN** the roadmap reviews whether `EAM` pages are ready to begin
- **THEN** the review MUST first confirm that upstream business-collaboration and execution-context pages that intersect with equipment operations are already stabilized where needed
- **AND** `EAM` pages MUST inherit those approved cross-module baselines rather than redefining customer, supplier, warehouse, or telemetry truth

### Requirement: The phase-one roadmap SHALL keep spare and analysis pages out of the first EAM batch

The phase-one roadmap SHALL separate the first equipment-operation batch from later spare-parts and equipment-analysis pages in `EAM`.

#### Scenario: First-batch EAM pages stay focused on the equipment operation main chain

- **WHEN** the team reviews the first `EAM` static-page batch for scope control
- **THEN** the batch MUST remain limited to `�豸̨��`, `���`, `����`, and `ά��`
- **AND** pages such as `����` and `�豸�ۺ�Ч��` MUST wait for later `EAM` expansion batches
