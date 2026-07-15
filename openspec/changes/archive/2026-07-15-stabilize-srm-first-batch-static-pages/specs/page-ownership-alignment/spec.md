## ADDED Requirements

### Requirement: First-batch SRM pages SHALL declare explicit procurement-collaboration ownership

The system SHALL explicitly distinguish request ownership, order-collaboration ownership, and return-collaboration ownership across the first-batch `SRM` pages instead of treating the supplier area as one generic procurement bucket.

#### Scenario: Purchase-request page declares SRM initiation ownership

- **WHEN** a page is `采购申请`
- **THEN** the page MUST declare `SRM` as the owner of `采购申请单`
- **AND** it MUST distinguish request ownership from `ERP` planning-source truth and `MDM` supplier master-data truth

#### Scenario: Purchase-order and return pages declare SRM collaboration ownership

- **WHEN** a page is `采购订单`
- **THEN** the page MUST declare `SRM` as the owner of `采购协同订单`
- **AND** it MUST distinguish supplier-collaboration ownership from `WMS` receipt truth and `ERP` payable-carry truth

- **WHEN** a page is `采购退货`
- **THEN** the page MUST declare `SRM` as the owner of `供应商退货协同单`
- **AND** it MUST distinguish return-collaboration ownership from `QMS` quality-judgment truth and `WMS` stock-correction truth

### Requirement: First-batch SRM pages SHALL preserve collaborator-system boundaries

The system SHALL preserve `MDM` as the supplier-master owner, `ERP` as the planning and finance-carry owner, `WMS` as the receipt and stock-transaction owner, and `QMS` as the incoming-quality owner even when first-batch `SRM` pages expose related source or consequence information.

#### Scenario: Supplier references remain MDM truth

- **WHEN** a first-batch `SRM` page shows supplier code, supplier classification, qualification, or contact context
- **THEN** the ownership definition MUST preserve `MDM` as the owner of the supplier source object
- **AND** `SRM` MUST only own the collaboration object created from that supplier context

#### Scenario: Planning and downstream finance relations remain ERP truth

- **WHEN** `采购申请` or `采购订单` shows purchase-suggestion, demand-source, settlement, or payable-related context
- **THEN** the ownership definition MUST preserve `ERP` as the owner of the planning-consumption or finance-carry source object
- **AND** `SRM` MUST only own the supplier collaboration truth created from that context

#### Scenario: Receipt and incoming-quality relations remain WMS and QMS truth

- **WHEN** `采购订单` or `采购退货` shows arrival, receive, inspection, or release-related context
- **THEN** the ownership definition MUST preserve `WMS` as the owner of the warehouse transaction source object and `QMS` as the owner of the incoming-quality judgment object
- **AND** `SRM` MUST only own the supplier-side协同状态 or协同结果 created from those related facts
