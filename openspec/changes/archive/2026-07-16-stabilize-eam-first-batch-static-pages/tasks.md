## 1. Change Alignment

- [x] 1.1 Verify `EAM` menu titles, route ownership metadata, and page ordering against the approved first-batch scope
- [x] 1.2 Keep the first-batch implementation limited to `设备台账`, `点检`, `保养`, and `维修`
- [x] 1.3 Confirm that excluded pages such as `备件` and `设备综合效率` are not treated as first-batch acceptance-critical pages

## 2. Static Data Baseline

- [x] 2.1 Organize stable first-batch `EAM` static datasets in `src/static/services/eam.ts` or an equivalent EAM static service layer
- [x] 2.2 Ensure first-batch `EAM` page data reads from approved static structures rather than requiring real API connectivity
- [x] 2.3 Normalize equipment-asset fields, inspection fields, maintenance fields, repair fields, and cross-system relation fields so later mock/API work can inherit them directly

## 3. Equipment Operation Pages

- [x] 3.1 Stabilize `设备台账` as a CRUD-style static page with equipment lifecycle context and asset ownership boundaries
- [x] 3.2 Stabilize `点检` as a CRUD-style static page with inspection plans, execution feedback, and exception-confirmation context
- [x] 3.3 Stabilize `保养` as a CRUD-style static page with maintenance plans, cycle execution, and completion tracking
- [x] 3.4 Stabilize `维修` as a CRUD-style static page with repair requests, work-order progression, and closure control

## 4. Acceptance

- [x] 4.1 Verify that each first-batch `EAM` page has exactly one primary equipment-operation object
- [x] 4.2 Verify that no first-batch `EAM` page requires real API connectivity for static-phase acceptance
- [x] 4.3 Verify that first-batch `EAM` pages do not redefine `MES` execution truth, `IoT` telemetry truth, `WMS` spare-stock truth, or `MDM` shared reference truth
- [x] 4.4 Verify that first-batch `EAM` pages follow the shared `CrudPage` baseline and do not include introduction panels or statistic-card rows as required runtime structure
