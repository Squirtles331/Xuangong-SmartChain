## Why

`ERP` 两批静态页已经落完，但当前导航仍然把 `需求池`、`MRP`、`财务` 页面平铺在同一层，`src/views/erp` 目录也没有和菜单层级保持一致，导致用户侧入口混乱、开发侧定位成本高。
现在正适合在进入后续 `ERP / SRM / CRM / BI` 联动前，先把 `ERP` 的菜单层级、路由层级和源码目录一次重构到稳定结构。

## What Changes

- 将 `ERP` 可见导航改为二级/三级菜单结构，统一分为：
  - `计划输入`
  - `物料计划`
  - `财务承接`
- 将当前 `ERP` 页面重新归并到上述分组下：
  - `计划输入`：`需求池`、`预测需求`
  - `物料计划`：`MRP结果`、`净变更计划`、`MRP历史`、`多工厂计划`
  - `财务承接`：`总账对账`、`应付管理`、`成本分析`、`财务报表`
- 将 `src/views/erp` 目录按菜单分组重写，确保菜单、路由、源码目录一一对应，而不是继续混用 `demand-pool / mrp / finance` 的旧分层。
- 将 `src/router/modules/erp/index.ts` 改为真正的多级 children 路由配置，使用新的规范化路径。
- **BREAKING**：不保留老路径兼容重定向；旧路径直接废弃，以新路径作为唯一生效的 ERP 路由基线。
- 同步补齐 ERP 菜单与文件映射文档或等效说明，便于后续页面继续扩展。

## Capabilities

### New Capabilities
- `erp-menu-directory-structure`: 定义 ERP 二级/三级菜单结构、路由层级、源码目录归并方式以及无旧路径兼容的重构基线

### Modified Capabilities

## Impact

- 受影响代码：
  - `src/router/modules/erp/index.ts`
  - `src/views/erp/**`
  - `src/layout/common/useSidebarMenu.ts` 的消费结果验证
  - `src/static/services/erp.ts` 的页面引用路径
- 受影响文档：
  - `docs/erp-menu-file-map.md` 或等效 ERP 菜单映射文档
- 受影响系统与边界：
  - `ERP`
  - `APS`
  - `CRM`
  - `MES`
  - `WMS`
