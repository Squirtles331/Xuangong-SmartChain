## 1. Preserve Login Behavior

- [x] 1.1 Record the existing login template bindings and preserve tenant, credential, captcha, remember-account, validation, and submit behavior while replacing the visual structure.
- [x] 1.2 Keep the existing mock login persistence, error feedback, success message, and router navigation unchanged.

## 2. Rebuild Login Page Structure

- [x] 2.1 Replace the current `LoginView.vue` template with explicit brand, authentication, promotional, illustration, and footer regions without changing the existing form model bindings.
- [x] 2.2 Rebuild the page-local styles around a viewport-contained desktop shell with stable two-column sizing and no cross-panel overlap.
- [x] 2.3 Add a local authentication-panel scroll owner using `100vh` and `min-height: 0` constraints, while keeping the shared global shell unchanged.
- [x] 2.4 Add short-height spacing rules that reduce non-essential gaps without scaling down readable type or interactive controls.
- [x] 2.5 Remove the existing tablet/mobile single-column breakpoints so the desktop two-panel composition is the only supported mode.
- [x] 2.6 Bound the promotional heading and existing illustration dimensions so the image remains contained and does not cover surrounding content.

## 3. Verify Layout And Behavior

- [x] 3.1 Run `npm run type-check` and `npm run build` after the page rewrite.
- [x] 3.2 Verify the page at short desktop and standard desktop viewports; confirm the captcha, login button, social login, and footer are reachable and no required content is clipped.
- [x] 3.3 Verify successful login, invalid captcha handling, remember-account persistence, captcha refresh, error feedback, and navigation to the authenticated entry route.
- [x] 3.4 Review the final diff to confirm the change remains limited to login presentation and does not alter shared authentication or routing contracts.
