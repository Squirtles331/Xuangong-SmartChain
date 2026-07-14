## Context

当前 `PLM` 路由是单层菜单：

- `BOM` 相关页面
- 工艺路线相关页面
- 工序定义
- 工程变更
- 版本切换

但实际业务已经自然形成三个分组：

- `BOM管理`：结构维护、结构分析、成本估算；
- `工艺定义`：工艺路线、工序定义、并行工序、标准工时；
- `工程变更`：ECN、版本切换。

`MES` 模块已经采用二级/三级路由分组，说明当前路由系统支持这种表达方式。

## Decision

### Decision 1: PLM 菜单改为三组

采用以下路由结构：

```text
PLM 产品工艺
├─ BOM管理
│  ├─ 产品结构清单
│  ├─ 结构版本比较
│  ├─ 用量展开与反查
│  └─ 结构成本估算
├─ 工艺定义
│  ├─ 工艺路线
│  ├─ 工序定义
│  ├─ 并行工序
│  └─ 标准工时学习
└─ 工程变更
   ├─ 工程变更
   └─ 版本切换
```

隐藏页继续挂在所属分组下，并通过 `activeMenu` 指向主列表页。

### Decision 2: 目录结构跟随业务分组

目录调整为：

```text
src/views/plm/
├─ bom/
├─ process/
│  ├─ routing-list/
│  ├─ routing-editor/
│  ├─ parallel-operation/
│  ├─ standard-time/
│  └─ operation-definition/
└─ change/
   ├─ ecn/
   └─ cutover/
```

`bom/` 当前已经比较清晰，保留不动。

### Decision 3: 不保留旧路径兼容

本次处于静态页面阶段，旧路径尚未成为稳定外部契约，因此不增加兼容跳转。

## Risks

- 路由路径变化会影响已有 `router.push` 和 `activeMenu`。
- 文件移动会影响动态 import。

## Mitigation

- 保持路由 `name` 不变，降低内部跳转影响。
- 更新所有 `activeMenu`。
- 更新 `docs/plm-menu-file-map.md`。
- 执行 lint、类型检查和构建验证。
