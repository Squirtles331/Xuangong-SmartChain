## Why

The current product UI still contains ownership notices, architecture explanation blocks, static overview cards, and login-page introduction content that read like a demo, training sample, or implementation walkthrough. This conflicts with the product baseline that runtime pages should focus on user tasks and business operations rather than system authorship or internal planning language.

This change is needed now because the cleanup scope has already been clarified and the removal must happen in a fixed implementation order across `mdm`, `plm`, `mes`, `wms`, and `login` to prevent the old presentation style from persisting as new pages continue to stabilize.

## What Changes

- Remove all runtime `页面归属`-style presentation blocks from product pages, including labels such as `主责系统`, `协同系统`, `核心对象`, `边界说明`, and similar architecture-facing helper text.
- Remove introduction-style overview card sections that sit above working regions such as search, toolbar, table, editor, or form content when those cards mainly explain baseline status, governance scope, or architectural context rather than supporting immediate user action.
- Remove cross-system bridge or relation explanation panels in the scoped modules when they are presented as explanatory onboarding content instead of direct operational UI.
- Clean up shared page-shell code and placeholder-page code so ownership explanation content cannot continue to render through shared components.
- Clean up the login page so it no longer presents platform-introduction, static-baseline, or architecture-coordination storytelling blocks as part of the login experience.
- Execute the cleanup in this order: `mdm` -> `plm` -> `mes` -> `wms` -> `login`.
- **BREAKING**: shared ownership-notice and introductory-card code paths in the scoped runtime UI will be removed rather than hidden behind conditional display flags.

## Capabilities

### New Capabilities

- `product-runtime-presentation-cleanup`: Defines the runtime-UI rule that product pages and login surfaces must avoid ownership exposition and introduction-style cards, and must keep internal architecture reasoning in documentation and metadata only.

### Modified Capabilities

- `page-ownership-alignment`: ownership metadata remains required for internal routing, documentation, and design judgment, but runtime pages must no longer expose that metadata as user-facing content.
- `product-navigation`: visible product entry surfaces and page-facing language must remove architecture-introduction content and keep user attention on actionable business tasks.
- `static-page-delivery-baseline`: static-first pages must stabilize operational structure without depending on introductory overview cards or ownership explanation panels as part of the shipped page contract.

## Impact

- Affected code areas include `src/components/PageOwnershipNotice.vue`, `src/views/shared/PlannedPage.vue`, scoped page files under `src/views/mdm/**`, `src/views/plm/**`, `src/views/mes/**`, `src/views/wms/**`, and `src/views/LoginView.vue`.
- Shared CRUD page usage patterns will be affected because many scoped pages currently inject ownership notices through `#headerTop` and overview cards through `#beforeTable`.
- Route metadata may remain for internal use, but runtime rendering logic that surfaces ownership metadata will be removed from the scoped UI.
- No backend API contract change is required for this change; the impact is in runtime presentation, shared frontend components, and static-page composition.
