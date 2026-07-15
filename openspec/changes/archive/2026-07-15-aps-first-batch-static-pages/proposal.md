## Why

`QMS` 第一批静态页已经完成并归档，按当前项目路线，下一步应进入 `APS`，先把计划侧的页面对象、边界和静态交互稳定下来，再进入 `ERP` 计划承接页。如果不先把 `APS` 做成正式变更，现有仓库里的排程页和约束页就会继续停留在“有页面但没有批次定义”的状态，后续很容易把排程结果、约束维护、历史复盘和扰动重排混成同一类页面，增加后续 mock 和 API 阶段的返工。

## What Changes

- 定义 `APS` 第一批静态页的正式交付范围，限定为：
  - `排程结果`
  - `排程约束`
  - `排程历史`
  - `扰动重排`
- 定义本批页面当前阶段只交付静态页面结构、静态字段、状态表达、结果视图和静态数据行为，不进入真实 API 联调。
- 明确 `APS` 第一批页面的主对象边界：
  - `APS` 主责排程结果、约束规则、排程版本/历史、重排建议
  - `MES` 继续主责执行事实、工序任务、在制过程和现场调度执行
  - `ERP` 作为计划输入与承接方，不反向改写 `APS` 的排程结果真相
- 冻结 `APS` 第一批页面的页面拆分规则：
  - `排程结果` 表达 APS 计划输出，不等同于 MES 执行看板
  - `排程约束` 表达 APS 约束维护，不等同于主数据中心
  - `排程历史` 表达 APS 版本复盘，不等同于 BI 分析报表
  - `扰动重排` 表达 APS 重排建议，不等同于 MES 现场执行页面
- 对齐前端基线：
  - 约束类维护页优先收敛到 `CrudPage`
  - 结果类与历史类页面允许保留图形化和摘要块，但必须保持统一页头、动作区和静态数据组织方式

## Capabilities

### New Capabilities

- `aps-first-batch-static-pages`: 定义 `APS` 第一批静态页的交付范围、对象边界、页面拆分方式、静态数据策略和前端壳层规则

### Modified Capabilities

- `phase-one-page-roadmap`: 将当前主链从 `QMS` 完成后正式推进到 `APS / ERP` 批次，并明确 `APS` 先于 `ERP` 计划承接页落地
- `page-ownership-alignment`: 补充 `APS` 第一批页面与 `MES`、`ERP` 之间的计划结果、执行事实和业务承接边界

## Impact

- Affected documents:
  - `openspec/specs/phase-one-page-roadmap/spec.md`
  - `openspec/specs/page-ownership-alignment/spec.md`
  - `openspec/specs/aps-first-batch-static-pages/spec.md`
- Affected code:
  - `src/router/modules/aps/index.ts`
  - `src/views/aps/schedule/index.vue`
  - `src/views/aps/constraint/index.vue`
  - `src/views/aps/history/**`
  - `src/views/aps/disturbance-reschedule/**`
  - `src/static/services/aps.ts` or equivalent APS static data layer
- Affected systems and boundaries:
  - `APS`
  - `MES`
  - `ERP`
  - static-page delivery baseline
