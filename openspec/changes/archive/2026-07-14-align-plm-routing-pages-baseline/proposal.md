## Why

`PLM` 下大部分静态页已经收敛到 `CrudPage + PageOwnershipNotice + StatusTag + CrudRowActions` 的前端基线，但 `并行工序` 和 `标准工时学习` 仍使用旧的 `gi-page-layout + SearchSetting + TableSetting` 组合。

同时 `PLM` 菜单与文件目录之间缺少一份直接映射，开发者从菜单名定位文件时需要反复打开路由文件和目录，影响后续批量开发效率。

## What Changes

- 将 `plm/routing/parallel` 重构为 `CrudPage` 基线页面。
- 将 `plm/routing/auto-time` 重构为 `CrudPage` 基线页面。
- 为两个 `PLM` 路由补齐主责归属、协同系统、核心对象和边界说明。
- 新增 `PLM` 菜单到路由、文件路径的映射文档，降低后续定位成本。

## Impact

- 受影响文档：`docs/plm-menu-file-map.md`
- 受影响代码：`src/router/modules/plm/index.ts`、`src/views/plm/routing/parallel/index.vue`、`src/views/plm/routing/auto-time/index.vue`
