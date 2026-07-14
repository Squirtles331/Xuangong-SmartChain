## Why

当前仓库已经按玄工开发基线完成了统一对象、菜单归属和静态优先的前置梳理，后续正式实施应从 `PLM` 批次继续推进，而不是再把页面平均分摊到所有模块。

结合现有路由和页面状态，`BOM`、`工艺路线`、`ECN` 已经有了 `PLM` 入口，但基线中同批次要求的“工序定义”仍然停留在 `MDM` 目录中的主数据页面形态，缺少 `PLM` 视角的工艺定义入口，也没有把“工序是工艺路线子对象、由 PLM 发布、被 MES/QMS/APS 消费，`MDM` 只负责编码规则和治理基线”的边界完整表达出来。

如果继续在 `MES`、`WMS`、`QMS` 里推进执行页面，而上游 `PLM` 的工序定义还没有稳定下来，后续工单、报工、过程检验和排程页面就会继续自行补字段、自行解释工序状态，违背当前已经确定的静态优先和对象统一基线。

## What Changes

- 新增一个正式的 `PLM` 工序定义静态页入口，补齐 `PLM` 第一批次中 `BOM / 工艺路线 / 工序定义 / ECN` 的页面链路。
- 将工序定义页面从“MDM 主数据清单”形态收敛为“PLM 工艺定义页面”，明确页面标题、归属提示、协同系统、主对象和边界说明。
- 为工序定义页面增加静态阶段必须具备的结构分区，包括查询区、概览卡片、列表区、详情抽屉、质量与报工约束区、上下游关联区。
- 明确 `MDM` 不再提供 `BOM`、工序、工艺路线、工艺参数实例的新增、修改、删除入口，只负责编码规则、对象目录治理和下游消费约束。
- 明确 `工序编码`、`工艺路线编码` 的规则归 `MDM`，编码实例生成、占用和唯一性校验归 `PLM`。

## Capabilities

### New Capabilities

- `plm-operation-definition`: 定义 `PLM` 批次中的工序定义静态页入口、结构分区、状态表达和协同边界。
- `plm-routing-and-operation-code-ownership`: 定义工序编码、工艺路线编码在 `MDM` 与 `PLM` 之间的规则与实例分责。

### Modified Capabilities

- `product-navigation`: 需要允许用户从 `PLM` 菜单进入工序定义主入口，并从 `MDM` 菜单移除工序维护入口。

## Impact

- 受影响文档：`openspec/changes/2026-07-14-stabilize-plm-operation-definition/*`
- 受影响代码：`src/router/modules/plm/index.ts`、`src/router/modules/mdm/index.ts`、`src/views/plm/operation-definition/index.vue`、`src/views/mdm/bom-master/index.vue`、`src/views/mdm/routing-master/index.vue`、`src/views/mdm/operation-master/index.vue`、`src/views/mdm/process-parameter/index.vue`
- 受影响业务边界：`PLM`、`MDM`、`MES`、`QMS`、`APS`
