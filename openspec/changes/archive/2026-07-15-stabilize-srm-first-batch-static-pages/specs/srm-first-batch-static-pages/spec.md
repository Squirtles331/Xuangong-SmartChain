## ADDED Requirements

### Requirement: SRM SHALL expose a formal first-batch static procurement-collaboration baseline

The system SHALL define a formal first-batch `SRM` static-page scope so procurement-collaboration objects can be stabilized before broader supplier agreement or portal expansion.

#### Scenario: The first-batch SRM scope is fixed before broader supplier collaboration expansion

- **WHEN** the team starts the next module batch after the approved `ERP` pages
- **THEN** the formal `SRM` batch MUST be limited to `采购申请`, `采购订单`, and `采购退货`
- **AND** pages such as `价格协议` and `供应商协同` MUST NOT be treated as first-batch acceptance-critical pages

### Requirement: SRM first-batch pages SHALL remain in static-page mode with stable page data

The first-batch `SRM` pages SHALL deliver page structure, static fields, state tags, source-relation blocks, and stable static data behavior before mock or API integration begins.

#### Scenario: First-batch SRM pages do not require API readiness

- **WHEN** a first-batch `SRM` page is reviewed in the current phase
- **THEN** the page MUST be accepted based on static page structure and static data behavior
- **AND** the page MUST NOT require real API connectivity to be considered implementation-ready for this phase

#### Scenario: Static data source remains stable before mock

- **WHEN** the team organizes first-batch `SRM` page data
- **THEN** the data MUST be expressed through stable structures in `src/static/services/srm.ts` or an equivalent `SRM` static service layer
- **AND** later mock or API work MUST inherit those approved structures rather than redefining page fields or status semantics

### Requirement: SRM first-batch pages SHALL distinguish request, order, and return object categories

The first-batch `SRM` pages SHALL preserve separate page semantics for purchase-request initiation, purchase-order collaboration, and purchase-return collaboration instead of treating the whole supplier area as one generic procurement bucket.

#### Scenario: Purchase-request page remains a procurement-initiation page

- **WHEN** a user works with `采购申请`
- **THEN** the page MUST treat purchase-request records, source context, and conversion state as the primary object context
- **AND** it MUST NOT present the page as an `ERP` MRP suggestion source-truth page or a supplier master-data maintenance page

#### Scenario: Purchase-order page remains a supplier-collaboration page

- **WHEN** a user works with `采购订单`
- **THEN** the page MUST treat supplier response, order commitment, and协同状态 as the primary object context
- **AND** it MUST NOT collapse into a `WMS` receipt transaction page or an `ERP` payable-carry page

#### Scenario: Purchase-return page remains a supplier-return collaboration page

- **WHEN** a user works with `采购退货`
- **THEN** the page MUST treat supplier-return records, source-order relation, and return-collaboration state as the primary object context
- **AND** it MUST NOT collapse into a `QMS` quality-judgment page or a `WMS` stock-correction page

### Requirement: SRM first-batch pages SHALL preserve upstream and downstream truth boundaries

The first-batch `SRM` pages SHALL maintain `SRM` as the owner of procurement-collaboration objects while treating `MDM`, `ERP`, `WMS`, and `QMS` as source or collaborator systems only.

#### Scenario: Supplier master truth remains with MDM

- **WHEN** a first-batch `SRM` page shows supplier identity, category, or qualification context
- **THEN** the page MUST preserve `MDM` as the owner of supplier master-data truth
- **AND** `SRM` MUST only consume that supplier context for collaboration objects

#### Scenario: Planning and finance carry truth remain with ERP

- **WHEN** `采购申请` or `采购订单` shows purchase-suggestion, source-demand, or payable-related context
- **THEN** the page MUST preserve `ERP` as the owner of planning-consumption and finance-carry truth
- **AND** `SRM` MUST only own the procurement-collaboration object created from that context

#### Scenario: Receipt and quality truth remain with WMS and QMS

- **WHEN** `采购订单` or `采购退货` shows receive-related, arrival-related, or incoming-quality-related context
- **THEN** the page MUST preserve `WMS` as the owner of receipt and stock-transaction truth and `QMS` as the owner of incoming-quality judgment truth
- **AND** `SRM` MUST only own the supplier-side collaboration consequence of those related facts

### Requirement: Standard first-batch SRM pages SHALL default to CrudPage with controlled extensions

The first-batch `SRM` collaboration pages SHALL use `CrudPage` as the default page-level shell when the page shape is a standard search/list/toolbar/dialog collaboration page.

#### Scenario: Core SRM collaboration list pages use the shared CRUD shell

- **WHEN** a first-batch `SRM` page is a standard collaboration list such as `采购申请`, `采购订单`, or `采购退货`
- **THEN** the page MUST use `CrudPage` as the primary page-level container
- **AND** toolbar actions, row actions, and status tags MUST follow the shared CRUD baseline

#### Scenario: Collaboration detail blocks may extend without abandoning the baseline

- **WHEN** a first-batch `SRM` page needs source summaries, supplier-response blocks, receive-related context, or return-reason blocks
- **THEN** it MAY extend the default CRUD shell with those blocks
- **AND** it MUST still preserve the shared search/list/action baseline rather than introducing a page-specific shell system
