## Why

`PLM` 菜单中的 `版本切换` 仍然指向计划占位页，无法承接 `BOM`、工艺路线、工序定义和 `ECN` 已经稳定后的切换闭环。

版本切换是 `PLM` 定义链向 `MES` 执行链交接的关键页面。如果继续缺失，后续现场工单、领料、检验和版本收口仍缺少统一的切换任务入口。

## What Changes

- 新增 `PLM` 版本切换静态页。
- 将 `plm/cutover` 从 planned placeholder 切换为真实页面。
- 固定版本切换的任务列表、状态表达、影响概览、审批放行、现场执行和收口验证结构。
- 更新 `PLM` 菜单到文件定位表。

## Impact

- 受影响文档：`docs/plm-menu-file-map.md`
- 受影响代码：`src/router/modules/plm/index.ts`、`src/views/plm/cutover/index.vue`
