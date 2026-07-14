## 1. Shared Baseline Cleanup

- [x] 1.1 Remove ownership exposition from shared placeholder/runtime shell code such as `src/views/shared/PlannedPage.vue`
- [x] 1.2 Identify shared ownership and introductory-card patterns that are still referenced by scoped pages and mark them for final deletion after module cleanup

## 2. MDM Cleanup

- [x] 2.1 Remove `PageOwnershipNotice` usage from all scoped `src/views/mdm/**/index.vue` pages
- [x] 2.2 Remove `page-overview` introductory card blocks and related computed data/styles from scoped `mdm` pages, including pages such as `organization`, `material`, `warehouse`, `supplier`, and other affected master-data pages
- [x] 2.3 Verify that cleaned `mdm` pages still preserve left trees, search areas, toolbars, tables, dialogs, and other operational regions after removal

## 3. PLM Cleanup

- [x] 3.1 Remove `PageOwnershipNotice` usage from all scoped `src/views/plm/**/index.vue` pages
- [x] 3.2 Remove `page-overview` introductory card blocks and related computed data/styles from scoped `plm` pages, including BOM, ECN, routing, standard-time, and operation-definition pages
- [x] 3.3 Verify that cleaned `plm` pages still preserve editors, lists, comparisons, dialogs, and other operational regions after removal

## 4. MES Cleanup

- [x] 4.1 Remove `PageOwnershipNotice` usage from all scoped `src/views/mes/work-order/**/index.vue` pages
- [x] 4.2 Remove any scoped introductory overview content that appears above the working region in `mes` list, detail, kanban, task, report, or trace pages
- [x] 4.3 Verify that cleaned `mes` pages still preserve execution lists, detail content, report flows, and action areas after removal

## 5. WMS Cleanup

- [x] 5.1 Remove `PageOwnershipNotice` usage from all scoped `src/views/wms/**/index.vue` pages
- [x] 5.2 Remove introductory overview cards, bridge panels, relation panels, and similar cross-system explanation blocks from scoped `wms` pages such as `receipt`, `picking`, `batch-quarantine`, `stock-count`, and `transfer`
- [x] 5.3 Verify that cleaned `wms` pages still preserve transaction search, toolbar, table, form, and required operational status content after removal

## 6. Login Cleanup

- [x] 6.1 Remove platform-introduction hero copy, point lists, metrics, and planning-oriented footer text from `src/views/LoginView.vue`
- [x] 6.2 Preserve only concise brand identity, authentication form content, and direct login-related actions on the login page
- [x] 6.3 Verify that the cleaned login page still works responsively on desktop and mobile without the removed introduction blocks

## 7. Final Deletion And Verification

- [x] 7.1 Delete fully unused shared ownership-notice code such as `src/components/PageOwnershipNotice.vue` after all scoped callers are removed
- [x] 7.2 Remove dead imports, computed properties, static summary data, and scoped styles left behind by the introductory-card cleanup
- [x] 7.3 Run targeted verification to confirm scoped pages no longer display ownership exposition or introduction-style cards while core operations remain available
