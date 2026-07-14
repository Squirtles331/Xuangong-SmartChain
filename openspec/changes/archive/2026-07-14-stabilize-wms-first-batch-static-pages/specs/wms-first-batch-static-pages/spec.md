## ADDED Requirements

### Requirement: WMS SHALL expose a formal first-batch static transaction-page baseline

The system SHALL define a formal first-batch `WMS` static-page scope so warehouse transaction truth can be stabilized after `MES` and before `QMS`.

#### Scenario: The first-batch WMS scope is fixed before broader warehouse expansion

- **WHEN** the team starts the next module batch after the approved `MES` batch
- **THEN** the formal `WMS` batch MUST be limited to `收货入库`, `生产领料`, `库存台账`, `退料退货`, `库存盘点`, and `库存调拨`
- **AND** pages such as `销售出库`, `倒冲`, `批次条码`, `扫码作业`, and `批次隔离` MUST NOT be treated as first-batch acceptance-critical pages

### Requirement: WMS first-batch pages SHALL remain in static-page mode with static data

The first-batch `WMS` pages SHALL deliver page structure, static fields, state tags, and static data behavior before mock or API integration begins.

#### Scenario: First-batch WMS pages do not require API readiness

- **WHEN** a first-batch `WMS` page is reviewed in the current phase
- **THEN** the page MUST be accepted based on static page structure and static data behavior
- **AND** the page MUST NOT require real API connectivity to be considered implementation-ready for this phase

#### Scenario: Static data source remains stable before mock

- **WHEN** the team organizes first-batch `WMS` page data
- **THEN** the data MUST be expressed through stable static page-local structures or `src/static/services/wms.ts`
- **AND** later mock or API design MUST inherit those approved structures rather than redefining the page fields

### Requirement: WMS first-batch pages SHALL preserve warehouse transaction truth boundaries

The first-batch `WMS` pages SHALL maintain `WMS` as the truth owner for warehouse transactions and inventory state while treating `MES` and `QMS` as collaborator or source systems only.

#### Scenario: Picking does not redefine MES consumption truth

- **WHEN** a user works with `生产领料`
- **THEN** the page MUST treat `领料单` as a `WMS` warehouse-issue transaction
- **AND** it MUST NOT equate issue completion with `MES` actual production consumption completion

#### Scenario: Receipt does not redefine QMS or MES final judgments

- **WHEN** a user works with `收货入库`
- **THEN** the page MUST treat inbound completion as a `WMS` transaction fact
- **AND** it MUST NOT become the final owner of quality judgment or production completion judgment

### Requirement: Standard first-batch WMS transaction pages SHALL default to CrudPage

The first-batch `WMS` transaction pages SHALL use `CrudPage` as the default page-level shell when the page shape is a standard search/list/toolbar/dialog transaction page.

#### Scenario: Core transaction list pages use the shared CRUD shell

- **WHEN** a first-batch `WMS` page is a standard transaction list such as `收货入库`, `生产领料`, `退料退货`, `库存盘点`, or `库存调拨`
- **THEN** the page MUST use `CrudPage` as the primary page-level container
- **AND** toolbar actions, row actions, and status tags MUST follow the shared CRUD baseline

#### Scenario: Query-heavy inventory pages may extend without abandoning the baseline

- **WHEN** a page such as `库存台账` needs summary cards, trace dialogs, or query-heavy presentation
- **THEN** it MAY extend the default CRUD shell with summary or trace blocks
- **AND** it MUST still preserve the shared search/list/action baseline rather than introducing a page-specific shell system
