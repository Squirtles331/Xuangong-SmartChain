## ADDED Requirements

### Requirement: First-batch ERP pages SHALL declare explicit business-plan and accounting ownership boundaries

The system SHALL explicitly distinguish demand ownership, MRP suggestion ownership, historical replay ownership, change-impact ownership, and accounting-carry ownership across the first-batch `ERP` pages instead of treating the entire ERP menu as one generic business area.

#### Scenario: Demand and MRP pages declare ERP planning-consumption ownership

- **WHEN** a page is `需求池`
- **THEN** the page MUST declare `ERP` as the owner of `计划需求`
- **AND** it MUST distinguish ERP demand aggregation ownership from `CRM` sales-order source truth and `APS` scheduling-result truth

- **WHEN** a page is `物料需求结果`, `物料需求历史`, or `净变更计划`
- **THEN** the page MUST declare `ERP` as the owner of the corresponding `MRP 建议结果 / 历史运行 / 变更影响` object
- **AND** it MUST distinguish that ownership from downstream procurement execution, MES work-order execution, or APS scheduling-result ownership

#### Scenario: Ledger page declares ERP accounting-carry ownership

- **WHEN** a page is `总账对账`
- **THEN** the page MUST declare `ERP` as the owner of `总账分录 / 对账结果 / 核算承接`
- **AND** it MUST distinguish accounting-carry ownership from `WMS` inventory truth and `MES` execution-fact truth

### Requirement: First-batch ERP pages SHALL preserve collaborator-system truth boundaries

The system SHALL preserve `CRM`, `APS`, `MES`, and `WMS` as their respective source-truth owners even when first-batch `ERP` pages expose related source or consequence information.

#### Scenario: CRM and APS remain source-truth owners for ERP planning pages

- **WHEN** `需求池` or `物料需求结果` shows sales demand, release advice, scheduling context, or planning-input relations
- **THEN** the ownership definition MUST preserve `CRM` as the owner of customer-order demand truth and `APS` as the owner of scheduling-result truth
- **AND** `ERP` MUST only own the plan-input aggregation or MRP suggestion object created from that context

#### Scenario: MES and WMS remain source-truth owners for ERP suggestion and ledger pages

- **WHEN** `物料需求结果`, `净变更计划`, or `总账对账` shows work-order context, execution status, inventory balances, stock movement, or warehouse-related carry context
- **THEN** the ownership definition MUST preserve `MES` as the owner of execution facts and `WMS` as the owner of inventory and stock-movement truth
- **AND** `ERP` MUST only own the suggestion, carry, or reconciliation object produced from those source facts
