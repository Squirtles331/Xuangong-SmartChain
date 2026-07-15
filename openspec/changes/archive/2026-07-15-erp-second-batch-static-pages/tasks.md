## 1. Change Alignment

- [x] 1.1 Verify the second-batch `ERP` menu scope, naming, and ordering against the approved remaining `ERP` pages
- [x] 1.2 Keep the second-batch implementation limited to `预测需求`, `多工厂计划`, `应付管理`, `成本分析`, and `财务报表`
- [x] 1.3 Verify that second-batch pages preserve `ERP` extension/aggregation semantics and do not drift into `SRM`, `CRM`, or `BI` acceptance scope

## 2. Static Data Baseline

- [x] 2.1 Extend `src/static/services/erp.ts` with stable second-batch `ERP` static datasets and service methods
- [x] 2.2 Ensure second-batch `ERP` pages read from the approved static structures rather than real API connectivity
- [x] 2.3 Normalize forecast, multi-plant, payable, cost, and report fields so later mock/API work can inherit them directly

## 3. Planning Extension Pages

- [x] 3.1 Stabilize `预测需求` as a CRUD-style static page with forecast type, probability, and trend comparison while preserving `CRM` demand truth boundaries
- [x] 3.2 Stabilize `多工厂计划` as a static cross-plant balance page with plant-capacity snapshots and suggestion results without drifting into `APS` scheduling-result semantics
- [x] 3.3 Verify that planning-extension pages consume collaborator context without redefining `CRM`, `APS`, or `WMS` source truth

## 4. Finance Extension Pages

- [x] 4.1 Stabilize `应付管理` as a CRUD-style static carry page with payable summaries, balance status, and dialog maintenance
- [x] 4.2 Stabilize `成本分析` as a static cost-result page with summary cards, cost composition, and period filtering
- [x] 4.3 Stabilize `财务报表` as a static report-aggregation page with period comparison, trend blocks, and report summaries without expanding into a BI dashboard
- [x] 4.4 Verify that finance extension pages preserve `ERP` carry/aggregation ownership and do not redefine `SRM`, `PLM`, `MES`, or `WMS` truth

## 5. Acceptance

- [x] 5.1 Verify that each second-batch `ERP` page has exactly one primary extension or aggregation object
- [x] 5.2 Verify that no second-batch `ERP` page requires real API connectivity for static-phase acceptance
- [x] 5.3 Verify that the second-batch static structures are sufficient for later `ERP` mock/API evolution and downstream collaboration reuse
