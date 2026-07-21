## ADDED Requirements

### Requirement: BI SHALL expose a formal second-batch topic static-page baseline

The system SHALL define a formal second-batch `BI` static-page scope after the first-batch analysis dashboards are complete.

#### Scenario: The second-batch BI topic scope is fixed after first-batch BI completion

- **WHEN** the team continues `BI` development after `生产分析看板`, `质量分析看板`, `库存分析看板`, and `经营分析看板`
- **THEN** the formal second-batch `BI` scope MUST include `能耗分析`, `安环分析`, `人资分析`, and `报表管理`
- **AND** these pages MUST be treated as topic static pages rather than first-batch acceptance-critical pages

### Requirement: BI topic analysis pages SHALL remain in static-page mode with stable topic snapshots

The topic analysis pages SHALL deliver page structure, static analysis fields, indicator cards, trends, distributions, and source-detail rows before mock or API integration begins.

#### Scenario: Topic analysis pages do not require BI platform infrastructure

- **WHEN** `能耗分析`, `安环分析`, or `人资分析` is reviewed in the current phase
- **THEN** the page MUST be accepted based on static page structure and static data behavior
- **AND** the page MUST NOT require real API connectivity, OLAP queries, data warehouse readiness, metric-permission modeling, or report scheduling

#### Scenario: Topic snapshot data uses the BI static service structure

- **WHEN** the team organizes second-batch topic analysis data
- **THEN** the data MUST be expressed through `src/static/services/bi.ts` or an equivalent `BI` static service layer
- **AND** the static structure MUST be compatible with the approved first-batch analysis snapshot structure unless a later change deliberately introduces a new model

### Requirement: BI topic analysis pages SHALL distinguish energy, safety-environment, and people analysis snapshots

The second-batch `BI` topic pages SHALL preserve separate analysis semantics for energy, safety-environment, and people results instead of treating them as one generic dashboard.

#### Scenario: Energy analysis remains a source-aware topic snapshot

- **WHEN** a user works with `能耗分析`
- **THEN** the page MUST treat energy consumption, unit consumption, peak load, abnormal consumption, and source equipment or telemetry context as the primary analysis context
- **AND** it MUST NOT redefine `IOT`, `EAM`, or `MES` source truths

#### Scenario: Safety-environment analysis remains a source-aware topic snapshot

- **WHEN** a user works with `安环分析`
- **THEN** the page MUST treat safety events, rectification closure, environmental exceedance, training completion, and source event context as the primary analysis context
- **AND** it MUST NOT redefine safety event, equipment, production, or quality judgment truths owned by upstream modules

#### Scenario: People analysis remains a source-aware topic snapshot

- **WHEN** a user works with `人资分析`
- **THEN** the page MUST treat attendance, shift coverage, skill matching, piecework output, and staffing risk context as the primary analysis context
- **AND** it MUST NOT redefine staff master data, attendance facts, production reporting facts, or skill certification truth

### Requirement: BI report management SHALL expose a static report catalog

The `报表管理` page SHALL provide a static report catalog for analysis users to inspect available reports, topic ownership, update cycle, source systems, status, and responsible owner.

#### Scenario: Report catalog is a list page rather than a report designer

- **WHEN** a user opens `报表管理`
- **THEN** the page MUST show searchable static report catalog rows with report name, topic, source systems, update cycle, status, last update time, and owner
- **AND** the page MUST NOT require report-template design, drag-and-drop layout, real export, scheduled delivery, or permissioned metric modeling in this phase

#### Scenario: Report catalog preserves source-system boundaries

- **WHEN** a report row references production, quality, inventory, energy, safety-environment, people, or business metrics
- **THEN** the catalog MUST identify the source systems as referenced context
- **AND** `BI` MUST only own the report catalog display and organization semantics

### Requirement: BI second-batch pages SHALL use restrained working layouts

The second-batch `BI` pages SHALL use restrained working-analysis or list-management layouts instead of full-screen dashboards or decorative page introductions.

#### Scenario: Topic analysis pages use consistent working sections

- **WHEN** a topic analysis page is delivered in the static phase
- **THEN** the page MUST expose period filtering, key indicators, trend analysis, structure distribution, and supporting detail rows in a consistent layout
- **AND** it MUST NOT require a full-screen dashboard, decorative hero area, page-introduction block, or unrelated statistic-card row as acceptance-critical content

#### Scenario: Report catalog uses a standard list-management layout

- **WHEN** `报表管理` is delivered in the static phase
- **THEN** the page MUST use a standard working list layout with search, refresh, table data, status tags, and restrained row actions
- **AND** it MUST NOT introduce a separate visual system or BI-specific decorative shell
