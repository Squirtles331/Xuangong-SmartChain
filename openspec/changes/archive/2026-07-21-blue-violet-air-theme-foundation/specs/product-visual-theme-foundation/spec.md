## ADDED Requirements

### Requirement: Product runtime SHALL expose a unified Blue Violet Air theme token system

The product runtime SHALL define one shared Blue Violet Air token system for brand colors, neutral surfaces, semantic states, typography, radius, shadow, spacing, gradients, header presentation, and sidebar presentation so shared styling does not depend on conflicting visual sources.

#### Scenario: Shared tokens define the new brand and surface contract

- **WHEN** the theme foundation is loaded for the runtime
- **THEN** the shared token layer SHALL expose values for the Blue Violet Air primary blue, supporting violet, page and card surfaces, border hierarchy, text hierarchy, semantic states, and shared radii, shadows, spacing, and gradients

#### Scenario: Sidebar tokens follow the approved blue navigation baseline

- **WHEN** the application shell renders the sidebar
- **THEN** the shared token layer SHALL provide a blue sidebar presentation with a blue background, lighter blue hover state, translucent active state, light navigation text, and white active text instead of the prior dark blue-gray sidebar assumption

### Requirement: Product runtime SHALL apply a unified global component skin

The product runtime SHALL apply one global component skin so shared controls inherit the Blue Violet Air presentation consistently across the product without requiring page-local compensation styles as the primary theming mechanism.

#### Scenario: Shared controls inherit soft modern business styling

- **WHEN** a page renders shared controls such as buttons, inputs, cards, tables, tags, dialogs, and tabs
- **THEN** those controls SHALL inherit the shared Blue Violet Air surfaces, borders, typography, radius, hover behavior, and focus treatment from the global skin layer

#### Scenario: Global component styling does not rely on page-specific theme patches

- **WHEN** a representative runtime page is reviewed after the foundation refactor
- **THEN** the shared component presentation SHALL be driven primarily by the global skin and token layers rather than by one-off page-local style patches for each control type

### Requirement: Application shell SHALL present the Blue Violet Air layout baseline

The application shell SHALL present a coherent Blue Violet Air layout baseline across the header, sidebar, tabs, page container, and common content surfaces.

#### Scenario: Header and page shell stay light and airy

- **WHEN** the authenticated application shell is rendered
- **THEN** the header and page container SHALL use light surfaces, soft borders, restrained shadows, and clear content separation consistent with the Blue Violet Air theme direction

#### Scenario: Sidebar remains clearly blue while inner content stays bright

- **WHEN** the authenticated application shell is rendered
- **THEN** the sidebar SHALL remain visually blue and brand-forward while the main content region SHALL remain bright, clean, and readable with white or near-white working surfaces
