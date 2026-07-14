## Why

`PLM` 模块已经从少量平铺页面扩展为完整的产品定义链，当前路由仍按单层菜单排列，源码目录也混合了对象目录和能力目录。

这会带来两个问题：

- 菜单上很难看出 `BOM`、工艺定义、工程变更之间的层次关系；
- 开发者从菜单定位源码时，需要在 `router` 和 `src/views/plm` 之间反复跳转，目录意图不够清晰。

## What Changes

- 将 `PLM` 路由调整为二级/三级菜单结构：
  - `BOM管理`
  - `工艺定义`
  - `工程变更`
- 将 `src/views/plm` 目录同步整理为：
  - `bom/`
  - `process/` 下的扁平业务目录
  - `change/`
- 更新所有受影响的 `activeMenu` 和页面 import 路径。
- 更新 `docs/plm-menu-file-map.md`，让菜单、路由、文件路径保持一致。
- 不保留旧路径兼容跳转，静态阶段直接收敛到新路径。

## Impact

- 受影响代码：`src/router/modules/plm/index.ts`、`src/views/plm/**`
- 受影响文档：`docs/plm-menu-file-map.md`
- 受影响业务边界：`PLM`
