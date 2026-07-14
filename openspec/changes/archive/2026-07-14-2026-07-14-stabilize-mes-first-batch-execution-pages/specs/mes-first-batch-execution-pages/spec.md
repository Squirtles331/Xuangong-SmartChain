## ADDED Requirements

### Requirement: MES SHALL expose a formal first-batch execution-page baseline

The system SHALL define a formal first-batch `MES` execution-page scope so that execution truth is stabilized before inventory, quality, or later business-collaboration pages expand downstream.

#### Scenario: The first-batch MES scope is fixed before further execution work

- **WHEN** the team begins the next module batch after first-batch `PLM` static pages
- **THEN** the formal `MES` execution-page baseline MUST be limited to `工单列表`, `新建工单`, `工单详情`, `我的任务`, `工序报工`, and `报工记录`
- **AND** pages such as `生产看板`, `WIP`, `齐套检查`, `投料与消耗`, `异常中心`, and `委外工单` MUST NOT be treated as first-batch acceptance-critical pages

### Requirement: MES first-batch pages SHALL distinguish work-order truth, task truth, and report truth

The first-batch `MES` static pages SHALL assign one primary object per page rather than collapsing the whole execution chain into generic CRUD-style execution screens.

#### Scenario: Work-order pages keep a single primary object

- **WHEN** a page belongs to `工单列表`, `新建工单`, or `工单详情`
- **THEN** the page MUST treat `生产工单` as its primary object
- **AND** upstream BOM or routing fields MUST be presented as consumed references rather than locally redefined master truth

#### Scenario: Task and report pages keep separate primary objects

- **WHEN** a page belongs to `我的任务`
- **THEN** the page MUST treat `工序任务` as its primary object
- **AND** it MUST NOT behave like a duplicate work-order management page

- **WHEN** a page belongs to `工序报工` or `报工记录`
- **THEN** the page MUST treat `报工记录` as its primary object
- **AND** it MUST record execution facts rather than taking over final quality-judgment ownership

### Requirement: MES first-batch static pages SHALL freeze reusable state semantics before mock

The first-batch `MES` static pages SHALL make work-order, task, and report state semantics explicit so later mock payloads and APIs inherit the approved flow instead of redefining it.

#### Scenario: Work-order flow is explicit

- **WHEN** the first-batch execution pages are reviewed in the static phase
- **THEN** `生产工单` MUST use the approved flow `draft -> approved -> released -> in_progress -> completed -> closed`
- **AND** button visibility MUST follow those states instead of exposing the same actions for every row

#### Scenario: Task and report flows are explicit

- **WHEN** `我的任务` or `工序报工` is reviewed in the static phase
- **THEN** `工序任务` MUST use the approved flow `pending -> assigned -> running -> completed`
- **AND** `报工记录` MUST use the approved flow `draft -> submitted -> confirmed`

### Requirement: MES first-batch pages SHALL preserve upstream and downstream truth boundaries

The first-batch `MES` execution pages SHALL make clear that `MES` consumes upstream engineering truth and references downstream inventory and quality truth without taking over their transactional ownership.

#### Scenario: MES consumes released PLM versions

- **WHEN** a user creates, views, or executes a work order
- **THEN** BOM and routing versions MUST be shown as released upstream references from `PLM`
- **AND** `MES` MUST NOT become the editing owner of BOM, routing, or operation-definition truth

#### Scenario: MES shows relation blocks without taking WMS or QMS ownership

- **WHEN** a user views material-issue, inbound, or quality-related sections from a first-batch `MES` page
- **THEN** those sections MUST be expressed as relation or overview blocks
- **AND** the page MUST NOT become the truth owner for warehouse transactions or inspection-judgment transactions
