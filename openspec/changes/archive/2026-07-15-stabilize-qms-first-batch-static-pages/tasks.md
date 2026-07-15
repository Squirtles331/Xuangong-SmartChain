## 1. Change Alignment

- [x] 1.1 Verify `QMS` menu titles, route ownership metadata, and page ordering against the approved first-batch scope
- [x] 1.2 Keep the first-batch implementation limited to `检验模板`, `来料检验`, `过程检验`, `完工检验`, and `不合格处置`
- [x] 1.3 Confirm that excluded pages such as `供应商质量`, `特采放行`, `返工裁决`, `报废裁决`, and `复检与关闭` are not treated as first-batch acceptance-critical pages

## 2. Static Data Baseline

- [x] 2.1 Organize stable first-batch `QMS` static datasets in `src/static/services/qms.ts`
- [x] 2.2 Ensure first-batch `QMS` page data reads from approved static structures rather than requiring real API connectivity
- [x] 2.3 Normalize first-batch static field groups, status values, source-object relation fields, and list/detail data shapes so later mock/API work can inherit them directly

## 3. Core QMS Pages

- [x] 3.1 Stabilize `检验模板` as a static quality-standard maintenance page with template category, item list, and dialog-based maintenance
- [x] 3.2 Stabilize `来料检验` as a static incoming-quality page with receipt or arrival source context while preserving `QMS` inspection ownership
- [x] 3.3 Stabilize `过程检验` as a static in-process quality page with operation or execution linkage while preserving `MES` execution source truth
- [x] 3.4 Stabilize `完工检验` as a static final-quality page with completion or inbound confirmation linkage while preserving `WMS` and `MES` collaborator boundaries
- [x] 3.5 Stabilize `不合格处置` as a static judgment page with nonconformance source, decision options, and follow-up consequence context

## 4. Page Shell And Interaction

- [x] 4.1 Align standard first-batch quality list pages to the shared `CrudPage` shell
- [x] 4.2 Freeze search areas, toolbar actions, row actions, and status-tag behavior for the first-batch `QMS` pages
- [x] 4.3 Verify that inspection-item tables, source summaries, execution dialogs, and judgment-result blocks extend the CRUD baseline without introducing page-specific shell systems

## 5. Boundary And Source Validation

- [x] 5.1 Verify that `来料检验` expresses a `QMS` inspection object without redefining `WMS` inbound or stock truth
- [x] 5.2 Verify that `过程检验` and `完工检验` express `QMS` inspection truth without redefining `MES` execution or completion truth
- [x] 5.3 Verify that `不合格处置` preserves `QMS` as the judgment owner while leaving rework execution to `MES` and stock-control consequences to `WMS`
- [x] 5.4 Add stable page-level bridge expression for receipt, operation, completion, and nonconformance source links so later pages inherit the same relation model

## 6. Acceptance

- [x] 6.1 Verify that each first-batch `QMS` page has exactly one primary quality object
- [x] 6.2 Verify that no first-batch `QMS` page requires real API connectivity for static-phase acceptance
- [x] 6.3 Verify that no first-batch `QMS` page redefines `MES` execution truth or `WMS` warehouse truth
- [x] 6.4 Verify that the stabilized static-page and static-data structure is sufficient to support later mock and API phases
