# PLM 菜单与文件定位表

## 使用说明

本文档用于从 `PLM` 菜单快速定位到路由名称、路由路径和源码文件。后续新增或移动 `PLM` 页面时，应同步更新本文档，避免菜单名称、路由和目录结构脱节。

## 菜单映射

| 菜单名称                 | 路由 path                          | 路由 name                | 页面文件                                               |
| ------------------------ | ---------------------------------- | ------------------------ | ------------------------------------------------------ |
| BOM管理 / 产品结构清单   | `plm/bom/list`                     | `bomList`                | `src/views/plm/bom/list/index.vue`                     |
| BOM管理 / 新建产品结构   | `plm/bom/create`                   | `bomCreate`              | `src/views/plm/bom/editor/index.vue`                   |
| BOM管理 / 产品结构编辑   | `plm/bom/editor/:id`               | `bomEditor`              | `src/views/plm/bom/editor/index.vue`                   |
| BOM管理 / 结构版本比较   | `plm/bom/compare`                  | `bomCompare`             | `src/views/plm/bom/compare/index.vue`                  |
| BOM管理 / 用量展开与反查 | `plm/bom/explode`                  | `bomExplode`             | `src/views/plm/bom/explode/index.vue`                  |
| BOM管理 / 结构成本估算   | `plm/bom/cost`                     | `bomCost`                | `src/views/plm/bom/cost/index.vue`                     |
| 工艺定义 / 工艺路线      | `plm/process/routing`              | `plmRoutingList`         | `src/views/plm/process/routing-list/index.vue`         |
| 工艺定义 / 工艺路线编辑  | `plm/process/routing/editor/:id`   | `routingEditor`          | `src/views/plm/process/routing-editor/index.vue`       |
| 工艺定义 / 工序定义      | `plm/process/operation-definition` | `plmOperationDefinition` | `src/views/plm/process/operation-definition/index.vue` |
| 工艺定义 / 并行工序      | `plm/process/parallel-operation`   | `routingParallel`        | `src/views/plm/process/parallel-operation/index.vue`   |
| 工艺定义 / 标准工时学习  | `plm/process/standard-time`        | `routingAutoTime`        | `src/views/plm/process/standard-time/index.vue`        |
| 工程变更 / 工程变更      | `plm/change/ecn/list`              | `ecnList`                | `src/views/plm/change/ecn/list/index.vue`              |
| 工程变更 / 版本切换      | `plm/change/cutover`               | `plmCutover`             | `src/views/plm/change/cutover/index.vue`               |

## 目录约定

`src/views/plm` 下按业务分组，与菜单二级/三级结构保持一致：

- `bom/`：BOM 版本、结构比较、展开反查、成本估算、编辑器。
- `process/routing-list/`：工艺路线主列表。
- `process/routing-editor/`：工艺路线编辑器。
- `process/parallel-operation/`：并行工序。
- `process/standard-time/`：标准工时学习。
- `process/operation-definition/`：工序定义。
- `change/ecn/`：工程变更。
- `change/cutover/`：版本切换任务、审批放行、现场切换与验证收口。

## 维护规则

- 菜单新增时，同步补 `src/router/modules/plm/index.ts` 和本文档。
- 页面迁移时，先改路由，再改本文档，最后清理旧目录。
- `PLM` 页面的普通列表和配置页应优先使用 `CrudPage`，并通过 `PageOwnershipNotice` 展示归属边界。
