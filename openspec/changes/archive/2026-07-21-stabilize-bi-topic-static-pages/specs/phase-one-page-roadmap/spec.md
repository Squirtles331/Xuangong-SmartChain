## ADDED Requirements

### Requirement: The phase-one roadmap SHALL allow a second BI topic batch after first-batch BI completion

The phase-one roadmap SHALL explicitly allow a second `BI` static-page batch after the approved first-batch `BI` analysis dashboards are complete.

#### Scenario: Second-batch BI follows first-batch BI stabilization

- **WHEN** the team finishes `生产分析看板`, `质量分析看板`, `库存分析看板`, and `经营分析看板`
- **THEN** the roadmap MUST allow the next `BI` batch to begin from `能耗分析`, `安环分析`, `人资分析`, and `报表管理`
- **AND** that batch MUST remain in static-page mode unless a separate mock or API change is approved

#### Scenario: Second-batch BI starts from approved source-object baselines

- **WHEN** the roadmap reviews whether second-batch `BI` topic pages are ready to begin
- **THEN** the review MUST confirm that the relevant upstream source pages or static structures are stable enough for analysis consumption
- **AND** second-batch `BI` pages MUST inherit those approved source-object baselines rather than redefining telemetry, equipment, production, quality, inventory, business, safety, or people truth

### Requirement: The phase-one roadmap SHALL keep advanced BI platform capabilities out of the second topic batch

The phase-one roadmap SHALL separate second-batch topic static pages from later advanced `BI` platform capabilities.

#### Scenario: Second-batch BI stays focused on topic pages and catalog display

- **WHEN** the team reviews the second `BI` static-page batch for scope control
- **THEN** the batch MUST remain limited to topic analysis pages and static report catalog display
- **AND** capabilities such as OLAP modeling, data warehouse integration, report designer, scheduled distribution, permissioned metric catalogs, and export backends MUST wait for later expansion batches
