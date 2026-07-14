## ADDED Requirements

### Requirement: PLM routing subpages SHALL follow the shared CRUD page baseline

`PLM` routing subpages that behave as list or configuration pages SHALL use the shared `CrudPage` shell and the same ownership notice and row action patterns as other stabilized PLM pages.

#### Scenario: User opens routing configuration subpages

- **WHEN** a user opens `并行工序` or `标准工时学习`
- **THEN** the page MUST use the shared `CrudPage` shell
- **AND** the page MUST display ownership metadata through the shared ownership notice pattern

### Requirement: PLM menus SHALL be traceable to source files

The project SHALL provide a maintained mapping from `PLM` menu names to route names, route paths, and source files.

#### Scenario: Developer locates a PLM page from the menu

- **WHEN** a developer sees a `PLM` menu item
- **THEN** they MUST be able to find the corresponding route and source file from the mapping document
