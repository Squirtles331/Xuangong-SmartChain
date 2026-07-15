## Context

`src/views/LoginView.vue` currently combines the login form and promotional panel in one page-local layout. The left panel uses large fixed vertical padding and enlarged Element Plus control wrappers, while the shared reset stylesheet disables document scrolling and fixes the application root to the viewport. When the form stack is taller than the viewport, the lower controls are rendered outside the visible area without a reliable scroll owner.

The requested change is a direct visual rebuild of the login page. Existing login behavior is already functional and must remain unchanged: tenant selection, username/password fields, captcha refresh and validation, remember-account persistence, mock login persistence, success routing, and error messages.

## Goals / Non-Goals

**Goals:**

- Establish one explicit height and scroll ownership model for the login page.
- Keep all authentication controls reachable on short desktop viewports.
- Prevent overlap or clipping between the brand header, form, social login, footer, promotional heading, and illustration.
- Provide predictable behavior across supported desktop widths and short window heights.
- Keep the page aligned with the project's industrial blue-gray visual baseline and access-first login guidance.

**Non-Goals:**

- Do not change authentication APIs, mock behavior, route guards, local-storage keys, or validation rules.
- Do not rewrite `src/App.vue` or the shared reset stylesheet as part of this page change.
- Do not add a new layout mode, component library, dependency, or global design system abstraction.
- Do not expand the promotional panel into an architecture introduction or marketing page.

## Decisions

### 1. Rebuild the page shell and styles, retain the behavior script

Replace the existing `LoginView.vue` template and page-local style block so the visual structure can be designed around stable layout regions. Retain the current `<script setup>` behavior unless a small template binding adjustment is required. This keeps the change focused and avoids reintroducing authentication regressions during a visual refactor.

Alternative considered: incrementally patch the existing selectors. This would preserve several conflicting spacing and breakpoint assumptions and make it harder to prove that every region has a clear layout owner.

### 2. Use a viewport-contained desktop shell with a local form scroll area

The desktop shell will use `100vh` and will contain overflow at the page boundary. The form panel will have `min-height: 0`, fill the available shell height, and own vertical scrolling when its content is taller than the viewport. The promotional panel will remain clipped only for decorative overflow, not for its primary heading or illustration.

Alternative considered: changing global `body` overflow to `auto`. That would affect the entire application and conflict with the project's layout responsibility model. A login-local scroll owner is lower risk.

### 3. Keep one desktop two-column mode

Supported desktop screens will use two stable columns with constrained inner content. No mobile or single-column mode will be added in this change. The form panel remains the local scroll owner when the desktop window is short.

Alternative considered: preserving the current `column-reverse` breakpoint behavior. That adds an unsupported responsive mode and makes the page harder to reason about as a desktop-only surface.

### 4. Adapt spacing before reducing type size

Short-height rules will reduce excess section gaps and panel padding while keeping control targets and product-facing type readable. Font sizes will remain fixed at intentional UI sizes; the layout will use bounded spacing and dimensions rather than viewport-scaled typography.

Alternative considered: applying a transform scale to the entire form. Scaling would make controls harder to read and interact with and could create blurry text.

### 5. Verify behavior at representative viewport classes

Verification will cover a short desktop viewport matching the reported screenshot and a standard desktop viewport. The key checks are reachability of the captcha, login button, social login, and footer; no horizontal overflow within supported desktop widths; no overlap; and unchanged login success/failure behavior.

## Risks / Trade-offs

- **[Risk]** A very short desktop viewport may still require scrolling because the authentication workflow has more content than can fit comfortably. **Mitigation:** keep the form panel scrollable, reduce only non-essential spacing, and verify that the scroll position can reach the footer.
- **[Risk]** The existing global `body` overflow rule may mask an incorrect page height implementation. **Mitigation:** test the page at each target viewport and assert the login panel, rather than the document, exposes the required scroll range.
- **[Risk]** Replacing the template can accidentally break Element Plus bindings or icon rendering. **Mitigation:** preserve all current form model/rule bindings, run type-check and build, and manually verify validation, captcha refresh, and login routing.
- **[Risk]** The promotional image may dominate the available height on short desktop screens. **Mitigation:** bound its width and height, keep `object-fit: contain`, and let the form panel retain independent scrolling.

## Migration Plan

1. Replace the login page template and page-local styles according to this design.
2. Run type-check, production build, and targeted visual checks at the representative viewports.
3. Confirm login success, invalid captcha handling, remember-account persistence, and route navigation.
4. Rollback by restoring only `src/views/LoginView.vue`; no data migration, route migration, or shared CSS migration is required.

## Open Questions

- None blocking implementation. The existing screenshot is treated as the short desktop reference viewport, and the right promotional panel remains part of the only supported desktop experience.
