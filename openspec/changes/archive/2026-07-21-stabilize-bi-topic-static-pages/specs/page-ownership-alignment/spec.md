## ADDED Requirements

### Requirement: Second-batch BI topic pages SHALL declare explicit analysis-snapshot ownership

The system SHALL explicitly distinguish energy, safety-environment, and people analysis ownership across the second-batch `BI` pages instead of treating topic analytics as generic reporting content.

#### Scenario: Energy and safety-environment analysis pages declare BI analysis ownership

- **WHEN** a page is `能耗分析`
- **THEN** the page MUST declare `BI` as the owner of `能耗分析快照`
- **AND** it MUST distinguish analysis ownership from `IOT` telemetry truth, `EAM` equipment truth, and `MES` production execution truth

- **WHEN** a page is `安环分析`
- **THEN** the page MUST declare `BI` as the owner of `安环分析快照`
- **AND** it MUST distinguish analysis ownership from upstream safety, environmental, equipment, quality, and production event truths

#### Scenario: People analysis page declares BI analysis ownership

- **WHEN** a page is `人资分析`
- **THEN** the page MUST declare `BI` as the owner of `人资分析快照`
- **AND** it MUST distinguish analysis ownership from staff master data, attendance, shift, skill, and production reporting source facts

### Requirement: Second-batch BI report management SHALL declare explicit catalog ownership

The system SHALL explicitly distinguish `BI` report catalog ownership from the upstream business metrics and source reports referenced by each catalog row.

#### Scenario: Report management declares BI catalog ownership

- **WHEN** a page is `报表管理`
- **THEN** the page MUST declare `BI` as the owner of `报表目录`
- **AND** it MUST distinguish catalog display ownership from source-system metric truth, report execution, scheduled delivery, and template-design ownership

### Requirement: Second-batch BI pages SHALL preserve source-system truth boundaries

The system SHALL preserve upstream modules as source-truth owners even when second-batch `BI` pages expose related metrics, trends, distributions, source systems, and report catalog rows.

#### Scenario: Equipment and telemetry facts remain external truth

- **WHEN** `能耗分析` shows energy consumption, peak load, equipment utilization, abnormal usage, or telemetry sampling context
- **THEN** the ownership definition MUST preserve `IOT`, `EAM`, and `MES` as the owners of source telemetry, equipment, and production facts
- **AND** `BI` MUST only own the analysis snapshot created from those facts

#### Scenario: Safety-environment and people facts remain external truth

- **WHEN** `安环分析` or `人资分析` shows event closure, training completion, attendance, shift, skill, piecework, or staffing context
- **THEN** the ownership definition MUST preserve the relevant source modules as the owners of operational facts
- **AND** `BI` MUST only present that information as aggregate or analytical context

#### Scenario: Report catalog references do not transfer metric truth to BI

- **WHEN** `报表管理` lists a report that references another module's production, quality, inventory, business, equipment, telemetry, safety, or people metric
- **THEN** the ownership definition MUST preserve the source module as the owner of that metric truth
- **AND** `BI` MUST only own the catalog row, topic grouping, and display metadata
