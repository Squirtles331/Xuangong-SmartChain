## ADDED Requirements

### Requirement: ERP SHALL use grouped menu navigation

The `ERP` route module SHALL group visible pages through real second-level and third-level menu nodes instead of exposing all ERP pages as a flat visible list.

#### Scenario: User opens ERP navigation

- **WHEN** a user opens `ERP`
- **THEN** the menu MUST show grouped entries for `计划输入`, `物料计划`, and `财务承接`
- **AND** visible ERP child pages MUST be placed under the matching group rather than remaining in one flat list

### Requirement: ERP source directories SHALL align with menu groups

The `src/views/erp` directory SHALL align with the grouped ERP menu structure so developers can locate source files directly from the visible menu hierarchy.

#### Scenario: Developer locates an ERP page from the menu

- **WHEN** a developer identifies an ERP menu entry
- **THEN** the mapped source file path MUST reflect the grouped directory structure
- **AND** `需求池` and `预测需求` MUST reside under `planning-input`
- **AND** `MRP结果`, `净变更计划`, `MRP历史`, and `多工厂计划` MUST reside under `material-plan`
- **AND** `总账对账`, `应付管理`, `成本分析`, and `财务报表` MUST reside under `finance-carry`

### Requirement: ERP route paths SHALL use rebuilt canonical hierarchy without legacy redirects

The `ERP` route module SHALL expose only the rebuilt canonical grouped paths and MUST NOT preserve legacy compatibility redirects from the previous flat ERP paths.

#### Scenario: User navigates to ERP pages after the refactor

- **WHEN** a user or developer accesses an ERP page after the restructuring
- **THEN** the canonical paths MUST use the grouped hierarchy such as `/erp/planning-input/demand-pool`, `/erp/material-plan/mrp-result`, and `/erp/finance-carry/ledger`
- **AND** the system MUST NOT add compatibility redirects from legacy paths such as `/erp/demand-pool`, `/erp/mrp/result`, or `/erp/finance/ledger`
