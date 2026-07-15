## Why

The current login page is built from fixed vertical spacing and an unconstrained content stack. On shorter desktop viewports, the authentication form, third-party login area, and footer extend beyond the viewport while the global document scroll is disabled, causing the lower content to be clipped. The page also has separate desktop and mobile rules that do not establish a reliable height and scroll ownership model.

This change will directly rebuild the login page presentation so the authentication workflow remains usable across supported desktop viewport sizes, while preserving the existing login behavior.

## What Changes

- Replace the current `LoginView.vue` template and page-local styles with a clear two-panel login layout.
- Establish an explicit fixed desktop viewport-height model using `100vh`.
- Make the login form panel the owner of vertical scrolling when the form exceeds the available height.
- Add short-viewport spacing rules so common authentication controls remain visible without layout overlap.
- Make the promotional panel, heading, and illustration resize without clipping or colliding.
- Keep the desktop two-panel composition as the only supported layout mode.
- Preserve the existing tenant selection, username, password, captcha, remember-account, validation, mock login, local storage, and router behavior.
- Keep the change scoped to login-page presentation; do not rewrite shared authentication services, routes, or the global application shell.

## Capabilities

### New Capabilities

- `login-page-layout`: Defines the responsive structure, viewport sizing, scroll ownership, and non-overlapping presentation contract for the login page.

### Modified Capabilities

None.

## Impact

- Affected view: `src/views/LoginView.vue`.
- Affected static asset usage: the existing `src/assets/images/login.png` remains the promotional illustration source.
- No API, mock service, route, authentication state, or persistence contract changes.
- The implementation must account for the existing global `body` overflow rule without introducing a second full-application layout system.
- Verification should cover short-height and standard desktop viewports; mobile and narrow touch layouts are out of scope.
