## ADDED Requirements

### Requirement: First-batch WMS transaction pages SHALL declare explicit warehouse-object ownership

The system SHALL explicitly distinguish inbound, picking, inventory, return, count, and transfer ownership across the first-batch `WMS` pages instead of treating the warehouse area as one generic stock bucket.

#### Scenario: Inbound and picking pages declare WMS transaction ownership

- **WHEN** a page is `收货入库`
- **THEN** the page MUST declare `WMS` as the owner of `收货单 / 入库单`
- **AND** upstream purchase, production, or source-document information MUST be presented as referenced collaborators rather than co-owning maintenance systems

- **WHEN** a page is `生产领料`
- **THEN** the page MUST declare `WMS` as the owner of `领料单`
- **AND** it MUST distinguish warehouse-issue ownership from `MES` actual feed and consumption ownership

#### Scenario: Inventory and adjustment pages declare WMS stock truth

- **WHEN** a page is `库存台账`
- **THEN** the page MUST declare `WMS` as the owner of `库存余额 / 库存批次`
- **AND** it MUST distinguish inventory truth from `MES` WIP truth or `ERP` accounting carry truth

- **WHEN** a page is `退料退货`, `库存盘点`, or `库存调拨`
- **THEN** the page MUST declare `WMS` as the owner of the corresponding warehouse transaction object
- **AND** it MUST distinguish transaction correction or movement truth from quality-decision truth

### Requirement: First-batch WMS pages SHALL preserve collaborator-system boundaries

The system SHALL preserve `MES` as the execution source-truth owner and `QMS` as the quality-decision owner even when first-batch `WMS` pages expose related source or judgment information.

#### Scenario: MES remains the source-truth owner for execution-linked warehouse pages

- **WHEN** `生产领料`, `收货入库`, or a related first-batch `WMS` page shows work-order, completion, or backflush context
- **THEN** the ownership definition MUST preserve `MES` as the owner of the execution source object
- **AND** `WMS` MUST only own the warehouse transaction fact created from that source

#### Scenario: QMS remains the decision owner for quality-linked warehouse pages

- **WHEN** a first-batch `WMS` page shows quality markers, release hints, or future batch-control context
- **THEN** the ownership definition MUST preserve `QMS` as the final quality-decision owner
- **AND** `WMS` MUST only own the stock control or warehouse transaction consequence of that decision
