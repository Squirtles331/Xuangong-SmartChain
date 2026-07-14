## ADDED Requirements

### Requirement: Third-batch MES readiness and consumption pages SHALL declare explicit execution ownership boundaries

The system SHALL explicitly distinguish readiness ownership and actual-consumption ownership across the third-batch `MES` pages.

#### Scenario: Readiness page declares MES release coordination ownership

- **WHEN** a page is `开工齐套检查`
- **THEN** the page MUST declare `MES` as the owner of `开工放行条件`
- **AND** it MUST distinguish readiness aggregation from `WMS` warehouse preparation truth, `QMS` release judgment truth, and `PLM` version truth

#### Scenario: Consumption page declares MES actual-consumption ownership

- **WHEN** a page is `投料与消耗`
- **THEN** the page MUST declare `MES` as the owner of `投料消耗记录`
- **AND** it MUST distinguish actual production consumption truth from `WMS` issue/return and stock-movement truth
