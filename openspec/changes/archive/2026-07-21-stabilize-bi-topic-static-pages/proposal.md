## Why

`BI` 首批核心分析看板已经完成并归档，旧版能耗、安环、人资和报表入口仍然停留在分散旧页面中。现在需要在不进入 mock / API 的前提下，把这些后续专题收口为可导航、可复用、边界清晰的静态页面。

## What Changes

- 将 `能耗分析`、`安环分析`、`人资分析` 作为 `BI` 二批专题分析页，沿用统一的静态分析快照结构
- 将旧版泛化 `经营报表` 收口为 `报表管理`，先提供报表目录、主题归属、更新周期、状态和来源系统的静态列表能力
- 扩展 `src/static/services/bi.ts`，让首批和二批 `BI` 页面共享稳定的分析快照与报表目录数据结构
- 更新 `BI` 路由菜单顺序，在四个首批看板之后开放二批专题入口，并继续隐藏旧版分散页面
- 明确 `BI` 只拥有专题分析快照和报表目录展示语义，不重新定义 `IOT`、`EAM`、`MES`、`QMS`、`WMS`、`ERP`、`CRM`、`SRM` 或人资源系统的业务真相

## Capabilities

### New Capabilities
- `bi-topic-static-pages`: 定义 `BI` 二批专题静态页面的范围、页面形态、静态数据结构、报表目录能力和源系统边界

### Modified Capabilities
- `page-ownership-alignment`: 补充 `BI` 二批专题分析页与报表目录的归属、协同系统和源系统真相边界
- `phase-one-page-roadmap`: 明确 `BI` 首批完成后可进入专题分析二批，并将能耗、安环、人资、报表管理从首批延后项转为二批范围

## Impact

- Affected code:
  - `src/router/modules/bi/index.ts`
  - `src/static/services/bi.ts`
  - new pages under `src/views/bi/energy-analysis`, `src/views/bi/ehs-analysis`, `src/views/bi/hr-analysis`, and `src/views/bi/report-catalog`
  - existing legacy pages under `src/views/bi/energy`, `src/views/bi/ehs`, `src/views/bi/hr`, and `src/views/bi/ReportView.vue` remain hidden and are not deleted
- Affected systems:
  - `BI` as owner of topic analysis snapshots and report catalog display
  - `IOT / EAM / MES` as energy and equipment source facts
  - `QMS / MES / EAM` as safety, environment, exception, and training source facts where applicable
  - upstream HR, MES, and MDM-like staff reference sources as people and shift facts
- No real API, OLAP, report designer, export backend, or data warehouse integration is required in this phase
