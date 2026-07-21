## Context

The product now has a finalized target theme direction documented in [blue-violet-air-theme-spec.md](/D:/Project/玄工智链/docs/blue-violet-air-theme-spec.md): Blue Violet Air, a clean, airy, soft blue-violet business SaaS style with a clear blue sidebar. The current runtime, however, is controlled by multiple conflicting layers: theme token files still reflect an older industrial blue-gray baseline, the global Element Plus overrides enforce legacy backend-style component presentation, and page-level styling for key entry screens does not share one visual contract.

This change is intended to create a formal visual foundation refactor before any large-scale page rebuild. The goal is not to redesign every business page in one step, but to establish a reusable theme system that can support later rollout with less rework risk.

## Goals / Non-Goals

**Goals:**

- Establish one product-wide source of truth for Blue Violet Air theme tokens.
- Replace the legacy global component skin so shared Element Plus controls inherit a modern, soft, consistent business style.
- Refactor the layout shell presentation so the header, sidebar, tabs, and page container share one coherent visual language.
- Define the required rollout order for validation pages so the team can refactor login, workbench, and a standard CRUD page only after the foundation stabilizes.
- Keep the visual refactor isolated from business logic, route behavior, API contracts, and module ownership rules.

**Non-Goals:**

- Do not redesign every domain page in the first change.
- Do not change API interfaces, menu ownership rules, business objects, or module sequencing.
- Do not introduce a second theme system, a new component library, or an unrelated layout mode.
- Do not use page-local styling patches as the primary migration strategy for the new theme baseline.

## Decisions

### 1. Use the theme token layer as the single visual source of truth

The new theme will be driven first from shared tokens for color, typography, radius, spacing, shadow, surface, gradient, header, and sidebar presentation. Global styles and layout styling will consume those tokens instead of redefining parallel values in multiple files.

Alternative considered: patching page styles first and backfilling tokens later. This would produce visible wins quickly, but it would also duplicate values, increase drift, and make later rollout harder to govern.

### 2. Replace the global Element Plus skin before rebuilding sample pages

Shared controls such as buttons, inputs, cards, tables, tags, dialogs, and tabs must inherit the same style contract before page-level redesign begins. Otherwise login, workbench, and CRUD pages would each need their own compensation styling and the theme system would remain fragmented.

Alternative considered: styling only the pages that are being refactored. This lowers short-term effort but creates inconsistent controls across the product and makes future maintenance more expensive.

### 3. Refactor the layout shell before page-level validation

The product shell is the highest-frequency visual surface in the application. Header, blue sidebar, navigation states, tabs, and the page container determine whether the product feels coherent even before users enter any specific module page. Refactoring the shell first ensures the later sample-page work is grounded in the correct visual environment.

Alternative considered: redesigning login or workbench first. Those pages can look polished individually, but if the shell still uses the old baseline, the product will continue to feel inconsistent.

### 4. Validate the new baseline with three representative page types

After the foundation layers stabilize, the first validation pages will be login, workbench, and one standard CRUD page. Together they cover the main runtime contexts of access entry, dashboard summary, and data-management workflow without forcing a broad business-page rewrite inside the same first change.

Alternative considered: bulk-refactoring an entire module immediately after the shell rewrite. That would mix theme-foundation work with domain-page scope and make review, rollback, and sequencing harder.

### 5. Preserve product behavior and business ownership contracts

This change remains visual and structural. It will not alter route meaning, page ownership logic, mock/API sequencing, or business object truth boundaries. If any page needs content-level redesign later, that work should happen as a separate or follow-on change after the theme baseline is proven.

Alternative considered: combining visual refactor with content and page-structure cleanup. That would increase ambiguity, create review noise, and make it harder to isolate regressions.

## Risks / Trade-offs

- **[Risk]** Legacy page-local styles may override new theme tokens and produce mixed results. **Mitigation:** treat the token layer, global component skin, and shell as the first three mandatory refactor layers before sample-page validation.
- **[Risk]** A visually stronger sidebar and shell could reveal pages whose inner content still follows the old baseline. **Mitigation:** explicitly validate login, workbench, and one CRUD page before expanding to broader page rollout.
- **[Risk]** Global Element Plus overrides can create unplanned regressions across existing screens. **Mitigation:** keep the new skin centered on shared surface, border, hover, focus, and typography rules, then review representative screens before broad rollout.
- **[Risk]** The scope could drift into full-product redesign. **Mitigation:** keep the first change limited to the theme foundation plus sample-page validation order, and defer broad domain-page rollout until the baseline is confirmed.

## Migration Plan

1. Replace shared theme tokens with the Blue Violet Air token system.
2. Rebuild the global Element Plus skin against the new token source of truth.
3. Refactor the layout shell presentation, including header, blue sidebar, tabs, and shared page container surfaces.
4. Validate the new baseline by rebuilding the login page, then the workbench, then one standard CRUD page.
5. Review the results and use the validated baseline for later business-page rollout changes.

Rollback can be performed layer by layer by restoring the theme token files, global skin files, and shell presentation files independently before any later page-level rollout begins.

## Open Questions

- The proposal does not yet fix which CRUD page will be used as the standard validation page. That selection can be made during apply, but it should prefer a typical management page with search, toolbar, table, tags, and dialog coverage.
