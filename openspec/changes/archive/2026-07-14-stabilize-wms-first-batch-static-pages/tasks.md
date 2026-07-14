## 1. Change Alignment

- [x] 1.1 Verify `WMS` menu titles, route ownership metadata, and page ordering against the approved first-batch scope
- [x] 1.2 Keep the first-batch implementation limited to `收货入库`, `生产领料`, `库存台账`, `退料退货`, `库存盘点`, and `库存调拨`
- [x] 1.3 Confirm that excluded pages such as `销售出库`, `倒冲`, `批次条码`, `扫码作业`, and `批次隔离` are not treated as first-batch acceptance-critical pages

## 2. Static Data Baseline

- [x] 2.1 Organize stable first-batch `WMS` static datasets in `src/static/services/wms.ts`
- [x] 2.2 Ensure first-batch `WMS` page data reads from approved static structures rather than requiring real API connectivity
- [x] 2.3 Normalize first-batch static field groups, status values, and list/detail data shapes so later mock/API work can inherit them directly

## 3. Core WMS Pages

- [x] 3.1 Stabilize `收货入库` as a static inbound transaction page with source-document context, inbound status tags, and dialog-based maintenance
- [x] 3.2 Stabilize `生产领料` as a static warehouse-issue page with work-order linkage while preserving `WMS` transaction ownership
- [x] 3.3 Stabilize `库存台账` as a static inventory-truth page with balance, batch, warning, and trace presentation
- [x] 3.4 Stabilize `退料退货` as a static return transaction page that distinguishes production return from procurement return
- [x] 3.5 Stabilize `库存盘点` as a static count-plan page with execution and variance-confirmation flows
- [x] 3.6 Stabilize `库存调拨` as a static stock-movement page with from/to warehouse context and transfer status flow

## 4. Page Shell And Interaction

- [x] 4.1 Align standard first-batch transaction list pages to the shared `CrudPage` shell
- [x] 4.2 Freeze search areas, toolbar actions, row actions, and status-tag behavior for the first-batch `WMS` pages
- [x] 4.3 Verify that summary cards, trace dialogs, and execution dialogs extend the CRUD baseline without introducing page-specific shell systems

## 5. Boundary And Bridge Validation

- [x] 5.1 Verify that `生产领料` expresses warehouse-issue truth without redefining `MES` actual consumption truth
- [x] 5.2 Verify that `收货入库` expresses inbound transaction truth without taking over production completion or quality-judgment ownership
- [x] 5.3 Add stable page-level bridge expression for `领料申请/执行`, `完工入库确认`, and `倒冲记录`
- [x] 5.4 Verify that first-batch `WMS` pages preserve `QMS` as the final quality-decision owner when quality markers or future batch-control hints appear

## 6. Acceptance

- [x] 6.1 Verify that each first-batch `WMS` page has exactly one primary warehouse object
- [x] 6.2 Verify that no first-batch `WMS` page requires real API connectivity for static-phase acceptance
- [x] 6.3 Verify that no first-batch `WMS` page redefines `MES` execution truth or `QMS` quality-decision truth
- [x] 6.4 Verify that the stabilized static-page and static-data structure is sufficient to support later mock and API phases
