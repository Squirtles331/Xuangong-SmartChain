## ADDED Requirements

### Requirement: First-batch APS pages SHALL declare explicit planning-object ownership

The system SHALL explicitly distinguish scheduling result ownership, constraint ownership, history ownership, and disturbance-reschedule ownership across the first-batch `APS` pages instead of treating the planning area as one generic optimization bucket.

#### Scenario: Result and constraint pages declare APS planning ownership

- **WHEN** a page is `排程结果`
- **THEN** the page MUST declare `APS` as the owner of `排程结果 / 资源负荷 / 冲突提示`
- **AND** upstream execution or demand references MUST be presented as collaborator context rather than co-owning systems

- **WHEN** a page is `排程约束`
- **THEN** the page MUST declare `APS` as the owner of `排程约束规则`
- **AND** it MUST distinguish planning-rule ownership from material, equipment, or personnel master-data ownership

#### Scenario: History and disturbance pages declare APS version and advice ownership

- **WHEN** a page is `排程历史`
- **THEN** the page MUST declare `APS` as the owner of `排程版本 / 参数快照 / 复盘差异`
- **AND** it MUST distinguish replay ownership from BI-style analysis ownership

- **WHEN** a page is `扰动重排`
- **THEN** the page MUST declare `APS` as the owner of `重排建议`
- **AND** it MUST distinguish reschedule-advice ownership from MES execution adjustment ownership

### Requirement: First-batch APS pages SHALL preserve collaborator-system boundaries

The system SHALL preserve `MES` as the execution-truth owner and `ERP` as the business-plan承接 owner even when first-batch `APS` pages expose related source or consequence information.

#### Scenario: MES remains the execution-truth owner for APS-linked pages

- **WHEN** `排程结果` or `扰动重排` shows工单、工序、产能占用、执行异常 or现场调整 context
- **THEN** the ownership definition MUST preserve `MES` as the owner of the execution source object or execution adjustment result
- **AND** `APS` MUST only own the planning result or reschedule advice created from that context

#### Scenario: ERP remains the downstream承接 owner for planning-consumption pages

- **WHEN** first-batch `APS` pages show demand release, order承接, or planning-output downstream consequences
- **THEN** the ownership definition MUST preserve `ERP` as the owner of the downstream business-plan consumption object
- **AND** `APS` MUST only own the plan result or suggestion that is being consumed

### Requirement: First-batch APS disturbance pages SHALL distinguish advice ownership from execution ownership

The system SHALL explicitly distinguish `APS` advice ownership from downstream execution ownership carried by `MES`.

#### Scenario: Disturbance reschedule remains an APS advice page

- **WHEN** `扰动重排` records L1微调、L2局部重排 or L3全局重排 suggestions
- **THEN** the ownership definition MUST preserve `APS` as the owner of whether-and-how-to-reschedule advice
- **AND** it MUST distinguish that role from `MES` ownership of actual现场执行调整
