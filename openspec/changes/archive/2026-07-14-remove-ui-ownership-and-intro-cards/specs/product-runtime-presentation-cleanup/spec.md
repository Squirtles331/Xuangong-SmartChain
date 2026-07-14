## ADDED Requirements

### Requirement: Runtime pages SHALL NOT expose internal ownership explanation

The system SHALL keep ownership, collaborator, core-object, and truth-boundary reasoning in internal metadata and documentation only, and MUST NOT expose those concepts as user-facing runtime page content.

#### Scenario: Business page keeps internal metadata but removes visible ownership blocks

- **WHEN** a scoped runtime page still carries ownership metadata in route definitions or other internal artifacts
- **THEN** the page MUST NOT render visible content such as `页面归属`, `主责系统`, `协同系统`, `核心对象`, or `边界说明`

#### Scenario: Placeholder and shared pages do not surface ownership sidebars

- **WHEN** a shared placeholder page or common page shell receives ownership-related metadata
- **THEN** the runtime page MUST ignore that metadata for visual presentation and MUST NOT render an ownership sidebar, ownership card, or ownership helper panel

### Requirement: Scoped runtime pages SHALL remove introduction-style overview and bridge cards

The system SHALL remove introduction-style cards from the scoped runtime pages when those cards primarily explain governance scope, architecture relationships, baseline status, or cross-system source-truth context rather than supporting an immediate business operation.

#### Scenario: CRUD pages remove overview cards above the working region

- **WHEN** a scoped `mdm`, `plm`, or `mes` page places overview cards above search, toolbar, table, or editor regions
- **THEN** those overview cards MUST be removed if they mainly describe baseline status, governance metrics, or architecture context

#### Scenario: WMS pages remove cross-system bridge explanation panels

- **WHEN** a scoped `wms` page renders bridge or relation panels that explain `MES`, `WMS`, or `QMS` responsibilities as page content
- **THEN** those explanatory panels MUST be removed from the runtime UI

### Requirement: The login page SHALL present access-first content

The system SHALL keep the login page focused on authentication, concise brand identity, and direct entry actions, and MUST NOT present architecture-introduction, static-phase-planning, or platform-selling-point card content as part of the login experience.

#### Scenario: Login page removes introduction storytelling blocks

- **WHEN** the login page includes hero copy, point lists, metrics, or footer text that describe module coordination, static-page strategy, or platform implementation context
- **THEN** those blocks MUST be removed from the runtime login UI

#### Scenario: Login page preserves required access content

- **WHEN** introduction-style blocks are removed from the login page
- **THEN** the page MUST still preserve the authentication form, minimal brand identity, and direct login-related actions
