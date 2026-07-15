## 1. Change Alignment

- [x] 1.1 Verify `SRM` menu titles, route ownership metadata, and page ordering against the approved first-batch scope
- [x] 1.2 Keep the first-batch implementation limited to `采购申请`, `采购订单`, and `采购退货`
- [x] 1.3 Confirm that excluded pages such as `价格协议` and `供应商协同` are not treated as first-batch acceptance-critical pages

## 2. Static Data Baseline

- [x] 2.1 Organize stable first-batch `SRM` static datasets in `src/static/services/srm.ts` or an equivalent SRM static service layer
- [x] 2.2 Ensure first-batch `SRM` page data reads from approved static structures rather than requiring real API connectivity
- [x] 2.3 Normalize purchase-request fields, purchase-order fields, return fields, supplier response fields, and source-relation fields so later mock/API work can inherit them directly

## 3. Procurement Collaboration Pages

- [x] 3.1 Stabilize `采购申请` as a CRUD-style static page with source context, request status, and default conversion behavior while preserving `ERP` plan-source boundaries
- [x] 3.2 Stabilize `采购订单` as a CRUD-style static supplier-collaboration page with supplier response, delivery commitment, and receive-related context without drifting into `WMS` receipt truth
- [x] 3.3 Stabilize `采购退货` as a CRUD-style static supplier-return page with source-order relation, return reason, and协同状态 without drifting into `QMS` judgment truth or `WMS` inventory-correction truth

## 4. Acceptance

- [x] 4.1 Verify that each first-batch `SRM` page has exactly one primary procurement-collaboration object
- [x] 4.2 Verify that no first-batch `SRM` page requires real API connectivity for static-phase acceptance
- [x] 4.3 Verify that first-batch `SRM` pages do not redefine `MDM` supplier-master truth, `ERP` planning or finance-carry truth, `WMS` receipt or stock truth, or `QMS` incoming-quality truth
- [x] 4.4 Verify that first-batch `SRM` pages follow the shared `CrudPage` baseline and leave sufficient structure for later second-batch expansion, mock, and API phases
