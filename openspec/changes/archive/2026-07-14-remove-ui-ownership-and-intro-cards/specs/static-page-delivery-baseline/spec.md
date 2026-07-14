## MODIFIED Requirements

### Requirement: Static pages SHALL expose a standard page structure contract

Every first-phase static page SHALL expose a standard structure contract covering at minimum page identity, search region, toolbar region, list region, detail or drawer region, state presentation, and action presentation. Ownership notices, introductory overview cards, and bridge-explanation panels MUST NOT be treated as required parts of the shipped page structure contract.

#### Scenario: CRUD page follows standard composition

- **WHEN** a page is delivered as a standard management or execution page
- **THEN** the page MUST include a consistent set of structural regions for search, toolbar, list, and detail presentation
- **AND** action visibility MUST align with object status and page purpose
- **AND** introductory overview or ownership-exposition blocks MUST NOT be required structural regions

#### Scenario: Detail structure is reserved before dynamic behavior

- **WHEN** a page includes object details, line items, or upstream/downstream relations
- **THEN** those zones MUST be structurally expressed in the static page even if the data is still hard-coded
- **AND** architecture-introduction or bridge-narration cards MUST NOT be used as substitutes for the actual working structure
