## MODIFIED Requirements

### Requirement: Product navigation SHALL use user-oriented business language

The system SHALL present visible menu names, group names, page titles, subtitles, login-entry copy, and placeholder descriptions using business object language or user task language that a product user can understand without first knowing the internal system topology. Visible runtime copy MUST avoid ownership exposition, system-authorship narration, and architecture-introduction phrasing.

#### Scenario: Replace system-centric labels with user-facing labels

- **WHEN** a visible menu entry is primarily named after an internal system, engineering directory, or implementation term
- **THEN** the product navigation MUST replace it with a business-facing label or task-facing label

#### Scenario: Preserve architecture meaning without exposing raw jargon

- **WHEN** a page belongs to a domain such as `PLM`, `QMS`, `WMS`, or `MDM`
- **THEN** the visible navigation MUST prioritize Chinese business wording, and any acronym MUST be treated as supporting context rather than the primary label

#### Scenario: Avoid ownership exposition in visible runtime copy

- **WHEN** a runtime page, login surface, or placeholder description introduces the page or platform
- **THEN** the visible copy MUST NOT present ownership labels, truth-boundary notes, or architecture-authorship explanation as product guidance
