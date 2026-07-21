## 1. Change Alignment

- [x] 1.1 Verify `BI` second-batch menu titles, route ownership metadata, and page ordering against the approved topic scope
- [x] 1.2 Keep the implementation limited to `能耗分析`, `安环分析`, `人资分析`, and `报表管理`
- [x] 1.3 Confirm that advanced BI platform capabilities such as OLAP, report designer, scheduled export, and data warehouse integration are not required for this phase

## 2. Static Data Baseline

- [x] 2.1 Extend `src/static/services/bi.ts` so `能耗分析`, `安环分析`, and `人资分析` use stable topic analysis snapshot data
- [x] 2.2 Add a static `报表目录` dataset and list query function for `报表管理`
- [x] 2.3 Preserve source-system fields and ownership boundaries in static data without redefining upstream truth

## 3. BI Topic Pages

- [x] 3.1 Stabilize `能耗分析` as a restrained static analysis page with energy indicators, trend, distribution, and source detail
- [x] 3.2 Stabilize `安环分析` as a restrained static analysis page with safety-environment indicators, trend, distribution, and source detail
- [x] 3.3 Stabilize `人资分析` as a restrained static analysis page with attendance, shift, skill, piecework, and source detail
- [x] 3.4 Stabilize `报表管理` as a static list-management page with report catalog search, status tags, and restrained row actions

## 4. Routing And Acceptance

- [x] 4.1 Update `src/router/modules/bi/index.ts` to expose the second-batch topic pages after the first-batch analysis dashboards
- [x] 4.2 Verify that legacy granular `energy`, `ehs`, `hr`, and old report routes remain hidden rather than becoming second-batch menu entries
- [x] 4.3 Run type-check, tests, and build to verify the static implementation
