## ADDED Requirements

### Requirement: Product navigation SHALL use user-oriented business language

The system SHALL present visible menu names, group names, page titles, and placeholder descriptions using business object language or user task language that a product user can understand without first knowing the internal system topology.

#### Scenario: Replace system-centric labels with user-facing labels

- **WHEN** a visible menu entry is primarily named after an internal system, engineering directory, or implementation term
- **THEN** the product navigation MUST replace it with a business-facing label or task-facing label

#### Scenario: Preserve architecture meaning without exposing raw jargon

- **WHEN** a page belongs to a domain such as `PLM`, `QMS`, `WMS`, or `MDM`
- **THEN** the visible navigation MUST prioritize Chinese business wording, and any acronym MUST be treated as supporting context rather than the primary label

### Requirement: Product navigation SHALL organize pages by object lifecycle or user task flow

The system SHALL group visible pages according to core business objects, lifecycle stages, or user task flows instead of mirroring legacy module silos.

#### Scenario: Group execution pages around execution objects

- **WHEN** a page serves `工单`、`工序任务`、`WIP`、`报工`、`异常` or `追溯`
- **THEN** the page MUST be grouped under the execution-oriented navigation domain rather than being split only by backend module ownership

#### Scenario: Group collaboration pages around collaboration outcomes

- **WHEN** a page serves warehousing, quality decisions, supplier collaboration, or equipment events
- **THEN** the page MUST be grouped in a collaboration-oriented navigation domain that reflects the user task outcome

### Requirement: The project SHALL maintain a canonical menu catalog

The change SHALL define and maintain a canonical menu catalog that records, for every navigable page, its visible name, menu level, parent group, route path, page status, architecture source, primary owner, collaborator systems, and related core object.

#### Scenario: Resolve document and router conflicts

- **WHEN** the current router, menu document, and architecture documents disagree on page naming or placement
- **THEN** the canonical menu catalog MUST be treated as the single reconciliation baseline for subsequent updates

#### Scenario: Support later static-page and mock work

- **WHEN** frontend developers begin static-page implementation or later mock integration
- **THEN** they MUST be able to use the canonical menu catalog as the stable source of truth for page naming and grouping

### Requirement: The workbench homepage SHALL act as an action-oriented cross-domain workbench

The system SHALL define the visible homepage workbench as the post-login action hub that aggregates pending actions, alerts, execution summaries, collaboration summaries, and high-frequency shortcuts across domains.

#### Scenario: Homepage shows action-first content

- **WHEN** a user opens `/`
- **THEN** the homepage MUST prioritize `待办`、`异常/预警`、`执行总览`、`协同域摘要` and `快捷入口`
- **AND** the homepage MUST NOT be modeled primarily as a long-form management dashboard

#### Scenario: Homepage keeps only lightweight business summary

- **WHEN** the homepage presents business or management indicators
- **THEN** it MUST keep them as lightweight summary cards or summary blocks
- **AND** detailed经营趋势、收入/成本/利润分析 or other deep management visuals SHOULD be routed to `管理分析 / 经营驾驶舱`

#### Scenario: Homepage remains a pure aggregation page

- **WHEN** homepage content spans `MES`、`WMS`、`QMS`、`APS`、`设备/IoT` or `CRM`
- **THEN** the homepage MUST act only as an aggregation and navigation layer
- **AND** it MUST NOT redefine ownership or maintain object truth for any underlying domain object
