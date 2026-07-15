## ADDED Requirements

### Requirement: Desktop login page SHALL contain its viewport and scrolling behavior

The desktop login page SHALL occupy the available viewport using `100vh` without relying on document scrolling, and SHALL expose a local vertical scroll area for the authentication panel when its content exceeds the available height.

#### Scenario: Short desktop viewport keeps the full form reachable

- **WHEN** the login page is rendered in a desktop viewport whose height is shorter than the total form content
- **THEN** the left authentication panel SHALL remain within the viewport, SHALL expose vertical scrolling, and SHALL allow the user to reach the login button, third-party login area, and footer

#### Scenario: Page does not clip required authentication content

- **WHEN** the user scrolls the authentication panel to its end
- **THEN** the captcha, login action, third-party login options, and footer SHALL be fully visible and SHALL not be covered by the page shell

### Requirement: Desktop login page SHALL prevent visual overlap

The login page SHALL maintain non-overlapping layout regions for brand identity, authentication fields, form actions, social login, footer content, promotional copy, and the promotional illustration.

#### Scenario: Desktop two-panel layout remains separated

- **WHEN** the login page is rendered at a wide desktop width
- **THEN** the authentication panel and promotional panel SHALL occupy separate columns, and the promotional heading SHALL not overlap the illustration or cross into the authentication panel

#### Scenario: Long text remains contained

- **WHEN** product-facing labels or promotional text occupy more width than the available inner region
- **THEN** the text SHALL wrap or reflow within its region without covering adjacent controls, icons, or images

### Requirement: Desktop login page SHALL keep a stable two-panel composition

The desktop login page SHALL use a stable two-column composition at supported desktop widths, with the authentication workflow on the left and the promotional presentation on the right. Mobile and narrow touch layouts are outside this capability's scope.

#### Scenario: Supported desktop width keeps two panels separated

- **WHEN** the page is rendered at a supported desktop width
- **THEN** the authentication and promotional regions SHALL remain in separate columns without horizontal overlap

#### Scenario: Short desktop window preserves the desktop composition

- **WHEN** the desktop window height is shorter than the total authentication content
- **THEN** the two-column shell SHALL remain intact and the left authentication panel SHALL provide the required vertical scrolling

### Requirement: Login page SHALL preserve existing authentication behavior

The visual rebuild SHALL preserve the current login form fields, validation rules, captcha refresh behavior, mock login behavior, local-storage persistence, error feedback, and successful navigation.

#### Scenario: Existing login controls retain their behavior

- **WHEN** the user selects a tenant, enters credentials and captcha, and submits the form
- **THEN** the same validation and mock-login flow SHALL execute as before, including success feedback and navigation to the authenticated entry route

#### Scenario: Invalid captcha remains rejected

- **WHEN** the submitted captcha does not match the displayed captcha
- **THEN** the login attempt SHALL remain unsuccessful and SHALL display the existing captcha error behavior
