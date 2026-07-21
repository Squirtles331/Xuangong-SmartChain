## Why

The current product presentation is visually fragmented: theme tokens, global Element Plus overrides, layout shell styling, and key entry pages are driven by different visual assumptions, so the system does not present a coherent brand or product quality level. Now that the target direction has been clarified as a soft, clean, blue-violet modern business SaaS style, the product needs a formal foundation refactor before additional page-level redesign work continues.

## What Changes

- Establish a new Blue Violet Air visual foundation for the product, using a clean, airy, soft blue-violet business style as the default theme baseline.
- Replace the current theme token layer with a unified token system for brand color, neutral surfaces, semantic states, typography, radius, shadow, spacing, gradients, header, and sidebar.
- Replace the current global Element Plus skin layer so buttons, inputs, cards, tables, tags, dialogs, and tabs inherit the new theme foundation consistently.
- Refactor the application shell presentation so the header, blue sidebar, page container, and navigation states follow the new theme contract.
- Define the required rollout order for the visual refactor so the theme foundation is stabilized before login, workbench, CRUD sample pages, and later business-page rollout.
- Use representative sample pages after the foundation stabilizes to verify that the theme system works for access, dashboard, and standard CRUD scenarios.

## Capabilities

### New Capabilities
- `product-visual-theme-foundation`: Defines the unified Blue Violet Air theme tokens, component skin contract, and layout shell presentation baseline for the product runtime.
- `theme-refactor-rollout-order`: Defines the required sequencing for the theme refactor so foundation layers are stabilized before broad page rollout.

### Modified Capabilities

None.

## Impact

- Affected theme and style layers: `src/styles/theme/*`, `src/styles/element.css`, `src/styles/index.scss`, and related global style entry points.
- Affected shell and navigation layers: `src/layout/**` and shared navigation presentation.
- Affected representative pages during rollout validation: login, workbench, and one standard CRUD page after the theme foundation is stable.
- No API, route contract, business object ownership, or module-boundary change is intended in this proposal.
- The implementation must align with the finalized theme reference in [blue-violet-air-theme-spec.md](/D:/Project/玄工智链/docs/blue-violet-air-theme-spec.md).
