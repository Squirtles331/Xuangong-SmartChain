## ADDED Requirements

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
