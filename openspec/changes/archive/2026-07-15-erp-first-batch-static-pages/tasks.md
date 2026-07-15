## 1. Change Alignment

- [x] 1.1 Verify `ERP` menu titles, route ownership metadata, and page ordering against the approved first-batch scope
- [x] 1.2 Keep the first-batch implementation limited to `需求池`, `物料需求结果`, `物料需求历史`, `净变更计划`, and `总账对账`
- [x] 1.3 Confirm that excluded pages such as `预测需求`, `多工厂计划`, `财务概览`, `成本分析`, and `财务报表` are not treated as first-batch acceptance-critical pages

## 2. Static Data Baseline

- [x] 2.1 Organize stable first-batch `ERP` static datasets in `src/static/services/erp.ts` or an equivalent ERP static service layer
- [x] 2.2 Ensure first-batch `ERP` page data reads from approved static structures rather than requiring real API connectivity
- [x] 2.3 Normalize first-batch demand fields, MRP suggestion fields, history run fields, net-change impact fields, and ledger reconciliation fields so later mock/API work can inherit them directly

## 3. Demand Pool Page

- [x] 3.1 Replace the current `需求池` planned placeholder with a formal static page that expresses ERP plan-demand ownership
- [x] 3.2 Stabilize `需求池` as a CRUD-style page with search, demand aggregation, priority or release-readiness fields, and default jumps into the MRP result chain
- [x] 3.3 Verify that `需求池` consumes `CRM` demand context and `APS` planning context without redefining either source truth

## 4. MRP Result Chain

- [x] 4.1 Stabilize `物料需求结果` as a static plan-consumption page with purchase suggestions, production suggestions, and action hierarchy that preserves ERP suggestion ownership
- [x] 4.2 Stabilize `物料需求历史` as a static run-history page with run summary, parameter replay, and default result drill-in behavior
- [x] 4.3 Stabilize `净变更计划` as a static change-impact page with change events, affected-material scope, and impact-detail blocks without drifting into APS disturbance-reschedule semantics
- [x] 4.4 Verify that MRP result-chain pages do not redefine procurement execution truth, MES execution truth, or WMS inventory truth

## 5. Ledger And Finance Boundary

- [x] 5.1 Stabilize `总账对账` as the only first-batch ERP finance acceptance page with summary cards, ledger entries, and reconciliation results
- [x] 5.2 Align ERP finance route titles, ownership expression, and page ordering so `总账对账` remains the first-batch accounting-carry page and `finance/index` drift does not blur scope
- [x] 5.3 Verify that first-batch ledger pages express ERP accounting-carry truth without collapsing into BI analysis pages or upstream source-document maintenance pages

## 6. Acceptance

- [x] 6.1 Verify that each first-batch `ERP` page has exactly one primary business-plan or accounting object
- [x] 6.2 Verify that no first-batch `ERP` page requires real API connectivity for static-phase acceptance
- [x] 6.3 Verify that no first-batch `ERP` page redefines `CRM` demand truth, `APS` planning truth, `MES` execution truth, or `WMS` inventory truth
- [x] 6.4 Verify that the stabilized static-page and static-data structure is sufficient to support later ERP expansion, mock, and API phases
