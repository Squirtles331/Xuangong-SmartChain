## 1. Establish Theme Foundation

- [x] 1.1 Replace the shared theme token definitions with the Blue Violet Air token system from the approved theme specification.
- [x] 1.2 Add the approved blue sidebar token set and header shell tokens to the shared theme source of truth.
- [x] 1.3 Review shared global style entry points and remove or align legacy token assumptions that conflict with the new baseline.

## 2. Rebuild Shared Visual Skin

- [x] 2.1 Rebuild the global Element Plus skin so buttons, inputs, cards, tables, tags, dialogs, and tabs inherit the Blue Violet Air presentation.
- [x] 2.2 Remove or reduce legacy global overrides that force the old industrial blue-gray backend style.
- [x] 2.3 Verify that shared focus, hover, border, radius, and shadow behavior is consistent across representative controls.

## 3. Refactor Application Shell

- [x] 3.1 Refactor the authenticated layout shell to align header, blue sidebar, navigation states, tabs, and page container surfaces with the new theme baseline.
- [x] 3.2 Verify that the shell keeps a bright, clean content area while preserving a clearly blue navigation region.
- [x] 3.3 Review shared layout styling for conflicts between shell-level presentation and page-local legacy styles.

## 4. Validate Representative Pages

- [x] 4.1 Rebuild the login page as the first representative validation page after the foundation and shell layers are stable.
- [x] 4.2 Refactor the workbench as the second representative validation page using the new shell and component baseline.
- [x] 4.3 Select and refactor one standard CRUD page as the third validation page to confirm search, toolbar, table, tag, and dialog coverage.

## 5. Review And Prepare Broader Rollout

- [x] 5.1 Review the final visual baseline against the approved theme specification document and confirm sidebar, shell, and component alignment.
- [x] 5.2 Verify that the change remains limited to visual foundation and representative validation scope without altering business logic contracts.
- [x] 5.3 Document the approved rollout order for later business-page redesign based on the validated theme foundation.
