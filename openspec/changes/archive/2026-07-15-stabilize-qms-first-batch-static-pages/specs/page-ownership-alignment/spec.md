## ADDED Requirements

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
