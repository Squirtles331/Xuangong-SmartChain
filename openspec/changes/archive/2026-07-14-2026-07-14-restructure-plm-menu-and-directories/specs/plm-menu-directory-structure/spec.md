## ADDED Requirements

### Requirement: PLM SHALL use grouped menu navigation

The `PLM` route module SHALL group visible menu entries by business domain instead of exposing all pages as a flat list.

#### Scenario: User opens PLM navigation

- **WHEN** a user opens `PLM`
- **THEN** the menu MUST show grouped entries for `BOM管理`, `工艺定义`, and `工程变更`
- **AND** visible child pages MUST be placed under the matching group

### Requirement: PLM source directories SHALL align with menu groups

The `src/views/plm` directory SHALL align with the visible menu grouping so that developers can locate files from the menu structure.

#### Scenario: Developer locates a PLM page

- **WHEN** a developer finds a menu entry in `docs/plm-menu-file-map.md`
- **THEN** the mapped file path MUST reflect the grouped source directory
- **AND** PLM process pages MUST use flattened business directories such as `routing-list`, `routing-editor`, `parallel-operation`, and `standard-time`
- **AND** hidden pages MUST remain mapped to their parent menu through `activeMenu`
