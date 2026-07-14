## Context

The current frontend still exposes internal architecture reasoning through runtime UI. The main patterns are:

- a shared ownership notice component rendered from route metadata
- introductory overview card sections inserted through `CrudPage` slots
- WMS bridge/relationship panels that explain cross-system ownership and source-truth boundaries as page content
- placeholder-page ownership sidebars
- login-page brand and introduction blocks that describe platform architecture, static-phase planning, and system coordination

The change is cross-cutting because the same presentation pattern appears across multiple modules and shared components. The confirmed implementation order is `mdm` -> `plm` -> `mes` -> `wms` -> `login`, with shared-shell cleanup included so the deleted patterns cannot silently reappear.

Constraints:

- internal ownership metadata must remain available in docs, route metadata, and design judgment
- runtime UI must stop presenting that metadata as user-facing explanation
- removal must be structural, not a temporary hide/show toggle
- only introduction-style cards and ownership-explanation blocks are in scope; operational forms, editors, tables, and business detail areas remain

## Goals / Non-Goals

**Goals:**

- remove ownership-exposition UI from the scoped runtime pages and shared page shells
- remove introduction-style overview cards that mainly explain governance, baseline status, system collaboration, or planning context
- remove login-page introduction storytelling that makes the entry page feel like a product demo or implementation presentation
- keep route metadata and documentation-level ownership reasoning intact for internal use
- execute cleanup in the confirmed module order so the codebase changes are easy to verify batch by batch

**Non-Goals:**

- redesign business workflows, table schemas, editor forms, or route structure
- remove real business data fields that happen to contain ownership-like business meaning, such as actual department ownership or operational responsibility fields
- rewrite backend APIs or route metadata contracts
- clean every dashboard, analytics summary, or operational card outside the confirmed scope in this change

## Decisions

### Decision: Preserve ownership metadata internally but delete runtime ownership rendering entry points

The system will keep ownership-related route metadata and documentation artifacts for internal architecture governance, but all shared runtime rendering paths for that metadata will be removed from the scoped UI.

This means:

- `PageOwnershipNotice` will be treated as removable shared UI, not a reusable product component
- placeholder and shared page shells will no longer surface ownership sidebars or ownership labels even when route metadata still exists
- page files in scope will stop wiring ownership content into `#headerTop` or equivalent visible regions

This is preferred over hiding the content behind flags because the baseline has already changed permanently and conditional rendering would leave a stale reactivation path in the product UI.

### Decision: Remove introductory card blocks by structural pattern, not by isolated wording fixes

The cleanup will target the structural sources of introduction-style content:

- `page-overview` metric cards
- `beforeTable` blocks whose main purpose is governance explanation, architecture introduction, or bridge narration
- scoped login-page brand points, metrics, and planning-copy blocks

This is preferred over rewriting the copy because the problem is not only wording; the product should stop allocating prime screen space to non-operational explanation blocks.

### Decision: Differentiate explanatory cards from operational content

The removal rule is based on purpose, not on whether a block happens to use `el-card`.

Delete:

- ownership notices
- baseline/governance overview cards
- cross-system explanation panels
- architecture-introduction and static-phase storytelling blocks

Keep:

- operational search areas
- toolbars
- tables
- business forms and dialogs
- editor structures needed to complete work
- real business detail sections required for task execution

This avoids over-cleaning pages that legitimately use card layout for business operations.

### Decision: Execute the cleanup in fixed module batches before login

The code cleanup will follow this exact order:

1. `mdm`
2. `plm`
3. `mes`
4. `wms`
5. `login`

Shared component and placeholder cleanup will be completed as supporting work while processing the scoped batches.

This is preferred over broad parallel deletion because the affected pages already map naturally to module directories and the user explicitly requested ordered handling.

### Decision: Treat login as an entry-surface cleanup, not a normal CRUD-page cleanup

`LoginView.vue` does not use the same `CrudPage` patterns as the business modules, but it still exposes introduction-heavy content. The login cleanup will therefore remove platform-introduction copy blocks, selling points, metrics, and static-phase storytelling while preserving only the necessary access surface and minimal brand identity.

This is preferred over leaving login unchanged because the same “demo / presentation” tone is visible there and would undermine the product-facing baseline even after module-page cleanup.

## Risks / Trade-offs

- [Risk] Some summary cards may look informative and be mistaken for operational content. → Mitigation: cleanup decisions will be anchored to whether the block directly supports an immediate user action or only explains architecture, governance, or planning context.
- [Risk] Removing shared ownership-rendering code may leave unused route metadata that looks redundant. → Mitigation: keep the metadata intentionally and document that it remains internal-only for routing, docs, and design review.
- [Risk] WMS bridge panels may mix explanation with useful operational context. → Mitigation: remove the explanatory panels in this change and preserve operational tables, actions, and status data in the main working regions.
- [Risk] Login may feel visually lighter after removing introduction content. → Mitigation: preserve concise branding and the complete authentication form while dropping presentation-style blocks only.

## Migration Plan

1. Create and approve the specification deltas for product-facing cleanup behavior.
2. Implement shared cleanup so ownership-rendering paths and placeholder ownership sidebars are removed.
3. Remove scoped module presentation blocks in the required order: `mdm`, `plm`, `mes`, `wms`.
4. Clean the login page introduction blocks after the module batches.
5. Verify that scoped pages still retain search, toolbar, table, editor, and form usability after removal.
6. Archive only after documentation, implementation, and task status reflect the new baseline.

Rollback strategy:

- If a removal unexpectedly deletes necessary business context, restore only the affected page section with product-facing business wording rather than restoring ownership or introduction patterns wholesale.

## Open Questions

- None at this time. The removal scope, ordering, and product-facing baseline are already explicitly confirmed.
