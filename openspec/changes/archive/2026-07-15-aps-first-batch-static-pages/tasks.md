## 1. Change Alignment

- [x] 1.1 Verify `APS` menu titles, route ownership metadata, and page ordering against the approved first-batch scope
- [x] 1.2 Keep the first-batch implementation limited to `排程结果`, `排程约束`, `排程历史`, and `扰动重排`
- [x] 1.3 Confirm that downstream `ERP` planning-consumption pages are not treated as APS first-batch acceptance-critical pages

## 2. Static Data Baseline

- [x] 2.1 Organize stable first-batch `APS` static datasets in `src/static/services/aps.ts` or an equivalent APS static service layer
- [x] 2.2 Ensure first-batch `APS` page data reads from approved static structures rather than requiring real API connectivity
- [x] 2.3 Normalize first-batch APS result fields, constraint fields, history snapshots, disturbance levels, and status semantics so later mock/API work can inherit them directly

## 3. Core APS Pages

- [x] 3.1 Stabilize `排程结果` as a static planning-output page with gantt, load, and conflict views while preserving APS result ownership
- [x] 3.2 Stabilize `排程约束` as a static constraint-maintenance page with category tabs, constraint records, and dialog-based maintenance
- [x] 3.3 Stabilize `排程历史` as a static version-replay page with version list, parameter snapshot, and conflict-difference context
- [x] 3.4 Stabilize `扰动重排` as a static reschedule-advice page with disturbance levels, impact scope, and local/global reschedule suggestion blocks

## 4. Page Shell And Interaction

- [x] 4.1 Align APS maintenance pages to the shared `CrudPage` shell where the page shape is standard search/list/toolbar/dialog CRUD
- [x] 4.2 Freeze page-header structure, primary and secondary actions, status-tag behavior, and static action hierarchy for first-batch APS pages
- [x] 4.3 Verify that gantt blocks, load charts, version comparison sections, and disturbance suggestion blocks extend the shared frontend baseline without introducing new page shell systems

## 5. Boundary And Source Validation

- [x] 5.1 Verify that `排程结果` expresses APS planning truth without redefining MES execution truth
- [x] 5.2 Verify that `排程约束` expresses APS planning-rule truth without redefining MDM or PLM source master data truth
- [x] 5.3 Verify that `排程历史` preserves APS version and replay ownership without drifting into BI analysis-page semantics
- [x] 5.4 Verify that `扰动重排` preserves APS advice ownership while leaving execution adjustment truth to `MES`
- [x] 5.5 Verify that downstream `ERP` consumption of scheduling outputs is expressed as collaboration context rather than APS-owned business-document truth

## 6. Acceptance

- [x] 6.1 Verify that each first-batch `APS` page has exactly one primary planning object
- [x] 6.2 Verify that no first-batch `APS` page requires real API connectivity for static-phase acceptance
- [x] 6.3 Verify that no first-batch `APS` page redefines `MES` execution truth or `ERP` business-plan consumption truth
- [x] 6.4 Verify that the stabilized static-page and static-data structure is sufficient to support later ERP planning-consumption, mock, and API phases
