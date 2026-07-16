## Why

`CRM` 首批静态页已经完成并归档，按当前项目批次顺序，下一模块应进入 `EAM`。现有 `EAM` 页面虽已具备旧版入口，但页面容器、对象边界、静态数据组织和批次范围都还没有按当前 `CrudPage + static service` 基线收口，因此需要先稳定第一批设备管理页面，再继续扩展到备件或分析类页面。

## What Changes

- 正式限定 `EAM` 首批静态页范围为 `设备台账`、`点检`、`保养`、`维修`
- 将首批 `EAM` 页面统一重构到共享 `CrudPage` 基线，而不是继续保留旧的页面壳和分散数据组织方式
- 为首批 `EAM` 页面建立稳定静态数据服务层，先固化字段、状态、跳转和协同关系，再进入 mock / API
- 明确 `EAM` 首批页面的主对象归属与协同边界，避免把 `MDM`、`MES`、`IoT`、`WMS` 的真相对象重新定义到 `EAM`
- 保持 `备件` 与 `设备综合效率` 在首批范围之外，不作为本次验收关键页面

## Capabilities

### New Capabilities
- `eam-first-batch-static-pages`: 定义 `EAM` 首批 `设备台账`、`点检`、`保养`、`维修` 的静态页范围、对象语义、状态语义与 `CrudPage` 基线

### Modified Capabilities
- `page-ownership-alignment`: 补充 `EAM` 首批页面的设备资产、点检计划、保养计划、维修工单归属与跨系统协同边界
- `phase-one-page-roadmap`: 将 `EAM` 明确固化为 `CRM` 之后的下一批模块，并限定首批页面范围

## Impact

- Affected code:
  - `src/router/modules/eam/index.ts`
  - `src/views/eam/list/index.vue`
  - `src/views/eam/check/index.vue`
  - `src/views/eam/maintain/index.vue`
  - `src/views/eam/repair/index.vue`
  - planned new static service such as `src/static/services/eam.ts`
- Affected systems:
  - `EAM` as first-batch owner
  - `MDM` as shared master-data reference source
  - `MES` as production execution context collaborator
  - `IoT` as device telemetry and runtime signal collaborator
  - `WMS` as spare-stock and warehouse transaction truth source
- No API contract should be required in this phase; work remains static-first
