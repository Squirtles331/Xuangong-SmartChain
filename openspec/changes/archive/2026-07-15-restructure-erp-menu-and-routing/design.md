## Context

当前 `ERP` 路由定义位于 [src/router/modules/erp/index.ts](D:/Project/玄工智链/src/router/modules/erp/index.ts)，页面源码位于 `src/views/erp`。现状有三个明显问题：

- 路由配置是单层平铺，只是通过 `mrp/result`、`finance/ledger` 这类 path 片段模拟分组，而不是实际的二级/三级 children。
- 页面目录仍按旧的技术分层组织为 `demand-pool/`、`mrp/`、`finance/`，和用户菜单理解不一致。
- 项目的侧边导航已经支持递归 children，但 `ERP` 没有利用这套能力，导致该模块比 `MES`、后续 `PLM` 重构结构都更乱。

同时，`ERP` 首批与第二批静态页变更已经完成，说明当前更适合做结构性整理，而不是继续在旧路径上叠加页面。
本次工作还受到两个明确约束：

- 继续保持静态页阶段，不进入 mock/API 重构。
- 不保留老路径兼容重定向，直接以新路径作为唯一生效结构。

## Goals / Non-Goals

**Goals:**

- 为 `ERP` 建立稳定的二级/三级菜单结构。
- 让 `ERP` 路由层级和 `src/views/erp` 目录结构完全对齐。
- 保持现有页面对象语义不变，只重组导航与源码归位方式。
- 在不增加旧路径兼容逻辑的前提下，形成后续 ERP 扩展的统一基线。

**Non-Goals:**

- 不重新定义 `ERP` 页面的一批/二批业务范围。
- 不重写 `src/static/services/erp.ts` 的数据语义或进入 API 接入。
- 不修改 `APS`、`CRM`、`SRM`、`BI` 等模块的菜单结构。
- 不新增 ERP 独立的运行时菜单系统，继续复用现有 sidebar 路由推导机制。

## Decisions

### Decision 1: ERP visible navigation is regrouped by object chain, not by historical batch

采用以下分组作为新的 ERP 菜单骨架：

```text
ERP
├─ 计划输入
│  ├─ 需求池
│  └─ 预测需求
├─ 物料计划
│  ├─ MRP结果
│  ├─ 净变更计划
│  ├─ MRP历史
│  └─ 多工厂计划
└─ 财务承接
   ├─ 总账对账
   ├─ 应付管理
   ├─ 成本分析
   └─ 财务报表
```

这样分组的原因是：

- `计划输入` 与 `物料计划` 能清楚区分“输入承接”和“计划结果/分析”。
- `财务承接` 能清楚表达 ERP 对执行、库存、供应协同结果的财务承接，而不是泛财务大盘。
- 该结构和已有对象边界一致，不会把页面重新混成“MRP 一组、finance 一组”的技术目录视角。

备选方案：

- 继续平铺一级菜单：用户侧仍混乱，直接排除。
- 按“首批 / 第二批”分组：更像项目过程，不像产品结构，排除。
- 按来源系统分组：会模糊 ERP 主责对象，不采用。

### Decision 2: Route paths become real three-level canonical paths

ERP 路由将从“单层 children + 含斜杠 path”改为真正的多级 children。
新的规范路径采用：

```text
/erp/planning-input/demand-pool
/erp/planning-input/forecast
/erp/material-plan/mrp-result
/erp/material-plan/net-change
/erp/material-plan/mrp-history
/erp/material-plan/multi-plant
/erp/finance-carry/ledger
/erp/finance-carry/payable
/erp/finance-carry/cost-analysis
/erp/finance-carry/finance-report
```

这样做比保留旧式 `mrp/result`、`finance/ledger` 更一致，也能让菜单层级、路径层级、文件层级三者同步。

备选方案：

- 只增加菜单 group，不改实际 path：会留下历史技术债，不采用。
- 新旧路径并存并做 redirect：用户已明确要求不兼容旧路径，不采用。

### Decision 3: Source directories mirror the navigation groups

`src/views/erp` 按新的菜单分组重写为：

```text
src/views/erp/
├─ planning-input/
│  ├─ demand-pool/
│  └─ forecast/
├─ material-plan/
│  ├─ mrp-result/
│  ├─ net-change/
│  ├─ mrp-history/
│  └─ multi-plant/
└─ finance-carry/
   ├─ ledger/
   ├─ payable/
   ├─ cost-analysis/
   └─ finance-report/
```

`应付管理` 当前旧目录是 `finance/index/`，本次明确重命名为 `finance-carry/payable/`，避免“index”既像首页又像业务页的歧义。

备选方案：

- 保留旧目录，仅在路由上包一层 group：开发者仍难从菜单反推源码，不采用。
- 只移动少量目录，继续保留 `mrp/` 与 `finance/`：会形成新旧混搭结构，不采用。

### Decision 4: Existing page semantics stay stable while route names are preserved where practical

本次重点是结构重构，不是页面语义重做，因此：

- 页面标题、对象边界、静态数据语义保持不变。
- 页面级 route `name` 在实现上可尽量复用已有命名，以降低内部 `router.push` 变更成本。
- 分组级 route `name` 使用新的 group 命名即可。

这样既满足“全部重构重写”的结构目标，也避免把本次工作放大成无必要的全局跳转语义重写。

## Risks / Trade-offs

- [Risk] 旧路径废弃后，已有内部跳转、书签或文档链接会失效
  - Mitigation: 实施时统一检索 ERP 旧路径引用，集中更新 `router.push`、`activeMenu`、文档链接与测试入口。

- [Risk] 目录移动会带来页面局部组件、弹窗组件、静态服务 import 失效
  - Mitigation: 按分组逐步移动目录，并在每步后完成 import 校验与构建验证。

- [Risk] 分组路径重构后，如果 group 顺序或首个子页顺序不稳定，双栏导航的默认落点会变得不可预测
  - Mitigation: 明确每个 group 的 `order` 和首个业务子页，保持 sidebar 推导结果稳定。

- [Risk] 本次不改数据服务分层，后续 ERP 持续扩展时仍可能遇到 `src/static/services/erp.ts` 过大的问题
  - Mitigation: 先把视图与路由结构稳定下来；后续如果 ERP 再扩展，可单独提出静态服务分层变更。

## Migration Plan

1. 先重写 `src/router/modules/erp/index.ts` 的 group 骨架与规范路径。
2. 按 `计划输入 / 物料计划 / 财务承接` 三组移动 `src/views/erp` 页面目录。
3. 更新局部组件、静态服务引用、隐藏页 `activeMenu` 和任何内部跳转逻辑。
4. 删除旧目录与旧路径残留，不新增兼容 redirect。
5. 更新 ERP 菜单到文件映射文档，并完成路由/构建验证。

回滚方式：

- 在变更未合并前，直接回退 `src/router/modules/erp/index.ts` 与 `src/views/erp` 目录调整。
- 由于本次不引入数据迁移和持久化结构变更，回滚成本主要在文件移动与路径引用恢复。

## Open Questions

- `ERP` 顶层可见标题最终使用 `经营计划`、`计划经营` 还是 `经营财务`，需要在实现前结合全局菜单语气统一一次。
- ERP 菜单映射文档是新增 `docs/erp-menu-file-map.md`，还是补入现有批次/模块文档，需要在实现时选定一个落点。
