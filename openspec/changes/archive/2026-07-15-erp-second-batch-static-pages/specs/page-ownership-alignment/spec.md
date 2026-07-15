## ADDED Requirements

### Requirement: ERP second-batch pages SHALL declare explicit planning-extension and finance-aggregation ownership boundaries

The system SHALL explicitly distinguish forecast-demand ownership, cross-plant balance ownership, payable-carry ownership, cost-result ownership, and report-aggregation ownership across the second-batch `ERP` pages instead of treating the remaining `ERP` menu as one generic extension area.

#### Scenario: Forecast and multi-plant pages declare ERP planning-extension ownership

- **WHEN** a page is `预测需求`
- **THEN** the page MUST declare `ERP` as the owner of the `预测需求承接对象`
- **AND** it MUST distinguish that ownership from `CRM` customer-demand truth and `APS` planning-result truth

- **WHEN** a page is `多工厂计划`
- **THEN** the page MUST declare `ERP` as the owner of the `跨工厂供需平衡建议` object
- **AND** it MUST distinguish that ownership from `APS` scheduling-result ownership and `WMS` inventory-truth ownership

#### Scenario: Finance second-batch pages declare ERP aggregation ownership

- **WHEN** a page is `应付管理`
- **THEN** the page MUST declare `ERP` as the owner of the `应付承接对象`
- **AND** it MUST distinguish that ownership from `SRM` supplier-collaboration truth and payment-execution truth

- **WHEN** a page is `成本分析` or `财务报表`
- **THEN** the page MUST declare `ERP` as the owner of the corresponding `成本结果` or `经营报表聚合` object
- **AND** it MUST distinguish that ownership from `PLM` engineering truth, `MES` execution truth, and `WMS` inventory truth

### Requirement: ERP second-batch pages SHALL preserve collaborator-system source truth boundaries

The system SHALL preserve `CRM`, `APS`, `PLM`, `MES`, `WMS`, and `SRM` as their respective source-truth owners even when second-batch `ERP` pages expose related source or consequence information.

#### Scenario: Planning-extension pages keep CRM, APS, and WMS as source-truth owners

- **WHEN** `预测需求` or `多工厂计划` shows demand context, planning context, plant balances, or stock-sensitive suggestions
- **THEN** the ownership definition MUST preserve `CRM` as the owner of customer-order demand truth, `APS` as the owner of scheduling-result truth, and `WMS` as the owner of inventory truth
- **AND** `ERP` MUST only own the forecast or balance-suggestion object produced from that context

#### Scenario: Finance aggregation pages keep PLM, MES, WMS, and SRM as source-truth owners

- **WHEN** `应付管理`, `成本分析`, or `财务报表` shows supplier context, execution context, inventory carry context, engineering context, or cost/report consequences
- **THEN** the ownership definition MUST preserve `SRM` as the owner of supplier-collaboration truth, `MES` as the owner of execution facts, `WMS` as the owner of inventory truth, and `PLM` as the owner of engineering-definition truth
- **AND** `ERP` MUST only own the payable-carry, cost-result, or report-aggregation object created from those source facts
