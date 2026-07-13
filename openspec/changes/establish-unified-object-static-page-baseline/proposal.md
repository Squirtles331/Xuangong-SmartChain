## Why

当前项目虽然已经完成了菜单、路由和页面归属的第一轮重构，但后续静态页开发仍然缺少一套统一的对象基线。若继续按页面逐个推进，极易再次出现同一对象在 `MDM`、`PLM`、`MES`、`WMS`、`QMS`、`ERP` 中字段口径不一、状态定义不一、页面责任不清的问题，后续 mock 与 API 会在错误基线之上继续放大返工成本。

现在最需要的不是继续扩展页面数量，而是把“系统一体化设计”前置成第一阶段可执行规则，让静态页面开发先围绕统一对象、统一字段、统一状态、统一交接顺序展开。

## What Changes

- 建立一套一体化核心对象基线，明确物料、BOM、工艺路线、工单、库存事务、质检事务等对象的主责模块、上下游消费者、核心字段层次和状态流。
- 建立静态页面优先于 mock、mock 优先于 API 的交付基线，统一页面在静态阶段必须完成的结构、字段、状态、操作、详情区块和数据映射要求。
- 定义第一阶段页面开发范围与顺序，优先收敛 `MDM` 与 `PLM` 的核心对象定义页，再进入 `MES/WMS/QMS/APS` 的执行链路页，最后再扩展到 `ERP/SRM/CRM/BI`。
- 把当前形成的对象目录、字段标准、页面映射、状态流和开发路线图纳入正式变更依据，作为后续静态页、mock 和接口设计的统一基线。
- **BREAKING** 后续页面设计、静态数据结构、mock 响应结构和接口 DTO 不再允许各模块自行定义核心对象口径，必须统一回收至本次变更定义的对象基线。

## Capabilities

### New Capabilities

- `integrated-object-foundation`: 定义跨 `MDM/PLM/MES/WMS/QMS/ERP` 的核心对象、主责边界、字段层次和状态流基线。
- `static-page-delivery-baseline`: 定义静态页阶段必须遵循的页面结构、静态数据、mock 交接和 API 前置规则。
- `phase-one-page-roadmap`: 定义第一阶段页面开发批次、依赖关系、优先级和完成标准。

### Modified Capabilities

None.

## Impact

- 受影响文档：`docs/integrated-data-governance-blueprint.md`、`docs/master-data-object-catalog.md`、`docs/core-data-field-standard.md`、`docs/page-object-mapping-matrix.md`、`docs/object-state-flow-matrix.md`、`docs/page-development-priority-roadmap.md`
- 受影响代码范围：后续 `src/views/mdm`、`src/views/plm`、`src/views/mes`、`src/views/wms`、`src/views/qms`、`src/views/erp` 以及静态数据、mock 数据和表单列配置
- 受影响流程：页面设计评审、静态页开发、mock 设计、接口 DTO 设计、后续集成测试
- 受影响系统边界：`MDM`、`PLM`、`APS`、`MES`、`WMS`、`QMS`、`ERP`、`SRM`、`CRM`、`BI`
