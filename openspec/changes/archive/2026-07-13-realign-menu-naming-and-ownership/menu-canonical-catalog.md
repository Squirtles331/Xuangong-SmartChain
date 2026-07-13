# 菜单真相表（首轮）

## 1. 文档目的

本文档是 `realign-menu-naming-and-ownership` 变更下的首轮菜单真相表，用于先统一以下三件事：

1. 用户真正看到的菜单名称应该叫什么
2. 这个页面在产品导航里应该放在哪一层
3. 这个页面背后的主责系统和边界应该如何表达

这份真相表优先服务于：

- 前端路由与菜单重构
- 静态页面阶段的页面分组和命名
- 后续 mock / 接口 / PRD / 测试统一口径

## 2. 使用规则

- `目标显示名` 是用户可见的产品语言，优先于当前代码中的系统化命名。
- `路径` 首轮尽量沿用当前已有路由，不在此文档中先处理工程级路径迁移。
- `主责/边界备注` 用来防止“菜单放在哪里”被误读成“哪个系统拥有最终真相”。
- 对隐藏详情页，首轮沿用列表页或父页面的菜单高亮归属。

## 3. 一级导航真相表

| 当前显示名   | 目标显示名   | 当前路径前缀           | 调整原因                                          | 主责/边界备注                              |
| ------------ | ------------ | ---------------------- | ------------------------------------------------- | ------------------------------------------ |
| 首页工作台   | 工作台       | `/`                    | 去掉口号式命名，保留统一入口语义                  | 聚合页，不单独代表某一系统主责             |
| MES 执行中枢 | 生产执行     | `/mes`                 | 用户更容易理解“我要执行生产”而不是“进入 MES 中枢” | 页面主要承接 `MES` 执行对象                |
| 工程与计划   | 工程计划     | `/engineering-plan`    | 保留工程与计划一体关系，但命名更短                | `PLM / APS / ERP / MDM` 协同域             |
| 协同支撑     | 质量仓储协同 | `/collaboration`       | “协同支撑”太抽象，用户无法判断里面有什么          | 承接 `WMS / QMS / SRM / 设备 / IoT` 协同页 |
| 客户与经营   | 客户与订单   | `/customer-business`   | 当前名称偏管理层语义，用户更容易理解客户与订单    | 以 `CRM` 为主，兼顾交付链路                |
| 管理分析     | 经营分析     | `/management-analysis` | 强调结果分析和经营视角，减少空泛表述              | 经营、财务、能耗、安环、人资分析域         |
| 平台基础     | 平台与主数据 | `/platform-foundation` | 当前名称容易让主数据被弱化                        | `系统管理 + 主数据治理 + 平台设置`         |

## 4. 二级导航真相表

### 4.1 生产执行

| 当前二级名 | 目标二级名 | 路径前缀            | 调整原因                                         | 主责/边界备注                            |
| ---------- | ---------- | ------------------- | ------------------------------------------------ | ---------------------------------------- |
| 工单中心   | 工单       | `/mes/work-order`   | “中心”过虚，用户找的是工单相关入口               | `MES` 主责生产工单                       |
| 执行中心   | 工序执行   | `/mes/execution`    | 明确围绕工序任务、报工、WIP 展开                 | `MES` 主责工序任务、WIP、报工、消耗      |
| 追溯与监控 | 追溯与异常 | `/mes/traceability` | 当前内容以追溯、日志、异常、返工为主，“监控”不准 | 异常锁定在 `MES`，质量裁决仍可能在 `QMS` |

### 4.2 工程计划

| 当前二级名   | 目标二级名     | 路径前缀                     | 调整原因                             | 主责/边界备注                            |
| ------------ | -------------- | ---------------------------- | ------------------------------------ | ---------------------------------------- |
| PLM 产品工艺 | 产品结构与工艺 | `/engineering-plan/plm`      | 用户更容易从对象理解页面用途         | `PLM` 主责 BOM、工艺、工程变更           |
| 计划协同     | 计划排程       | `/engineering-plan/planning` | 让用户更直观看到需求、APS、MRP、重排 | `APS / ERP` 主责计划结果，`MES` 承接执行 |

### 4.3 质量仓储协同

| 当前二级名   | 目标二级名   | 路径前缀                       | 调整原因                                    | 主责/边界备注                            |
| ------------ | ------------ | ------------------------------ | ------------------------------------------- | ---------------------------------------- |
| WMS 仓储协同 | 仓储与批次   | `/collaboration/wms`           | 用户首先关心库存、批次、出入库              | `WMS` 主责库存、库位、批次真相           |
| QMS 质量裁决 | 质量裁决     | `/collaboration/qms`           | 保留已确认口径，但去掉系统缩写作为主标签    | `QMS` 主责检验、不合格、特采、报废、复检 |
| SRM 采购协同 | 采购与供应商 | `/collaboration/srm`           | 比“采购协同”更像产品入口                    | `SRM / ERP` 主责采购与供应商协同         |
| 设备与 IoT   | 设备与采集   | `/collaboration/equipment-iot` | 设备台账与采集监控并存，“采集”比 IoT 更易懂 | `设备 / IoT` 主责事件、监控、告警、采集  |

### 4.4 客户与订单

| 当前二级名   | 目标二级名 | 路径前缀                 | 调整原因                                     | 主责/边界备注                        |
| ------------ | ---------- | ------------------------ | -------------------------------------------- | ------------------------------------ |
| CRM 客户经营 | 客户与订单 | `/customer-business/crm` | 当前实际内容覆盖客户、订单、合同、报价、应收 | `CRM` 主责客户、订单、合同、交付跟踪 |

### 4.5 经营分析

| 当前二级名     | 目标二级名     | 路径前缀                          | 调整原因                                    | 主责/边界备注                          |
| -------------- | -------------- | --------------------------------- | ------------------------------------------- | -------------------------------------- |
| 分析与经营     | 经营与财务     | `/management-analysis/operations` | 当前包含驾驶舱、报表、财务、成本、总账      | 经营分析页，不直接改写业务真相         |
| 合规与综合管理 | 能源安环与人资 | `/management-analysis/compliance` | 当前内容并非“综合管理”，而是能源、EHS、人资 | 分析与管控入口，底层真相来自各主责系统 |

### 4.6 平台与主数据

| 当前二级名 | 目标二级名 | 路径前缀                        | 调整原因                                     | 主责/边界备注                        |
| ---------- | ---------- | ------------------------------- | -------------------------------------------- | ------------------------------------ |
| 系统管理   | 系统管理   | `/platform-foundation/system`   | 名称可保留                                   | 平台基础能力                         |
| 主数据治理 | 主数据     | `/platform-foundation/mdm`      | 用户侧不必先理解“治理”，但文档要保留治理属性 | `MDM` 是跨域治理能力，不是普通设置页 |
| 平台设置   | 平台设置   | `/platform-foundation/settings` | 名称可保留                                   | 平台级配置与日志                     |

## 5. 关键三级页面真相表

说明：以下优先覆盖命名最乱、最容易误导、或后续最先要静态重构的页面。

### 5.1 生产执行

| 当前三级名  | 目标三级名   | 当前路径                             | 调整原因                               | 主责/边界备注                            |
| ----------- | ------------ | ------------------------------------ | -------------------------------------- | ---------------------------------------- |
| 工单管理    | 工单列表     | `/mes/work-order/list`               | 用户进入后看到的是列表，不是抽象“管理” | `MES` 主责生产工单                       |
| 新建工单    | 新建工单     | `/mes/work-order/create`             | 名称可保留                             | 隐藏页，归属工单列表                     |
| 工单详情    | 工单详情     | `/mes/work-order/:id`                | 名称可保留                             | 隐藏页，归属工单列表                     |
| 工单拆分    | 工单拆分     | `/mes/work-order/split`              | 名称可保留                             | 隐藏页，归属工单列表                     |
| 委外工单    | 委外工单     | `/mes/work-order/outsource`          | 名称可保留                             | 执行入口在 `MES`，协同 `SRM / WMS / QMS` |
| 我的任务    | 我的任务     | `/mes/execution/my-tasks`            | 当前名称对班组成员可理解               | 面向操作员/班组成员的任务入口            |
| 工序任务    | 工序任务     | `/mes/execution/operation-task`      | 名称可保留                             | `MES` 主责当前最小执行单元之一           |
| 工序报工    | 工序报工     | `/mes/execution/report/:id`          | 名称可保留                             | 隐藏页，归属我的任务                     |
| WIP 管理    | 在制品       | `/mes/execution/wip`                 | 直接用用户更熟悉的对象名称             | `MES` 主责 WIP，不是 `WMS` 库存批次      |
| 齐套校验    | 开工齐套检查 | `/mes/execution/kitting`             | 强化这是放行前检查入口                 | 不等于仓库备料完成                       |
| 投料 / 消耗 | 投料与消耗   | `/mes/execution/consumption`         | 更自然、更完整                         | `MES` 主责消耗事实，不能等价于领料       |
| 车间看板    | 生产看板     | `/mes/traceability/kanban`           | 更符合用户预期                         | 现场总览页                               |
| 报工追溯    | 报工记录     | `/mes/traceability/trace-report`     | “追溯”偏系统语言，用户更易理解报工记录 | 追溯报工事实                             |
| 产品追溯    | 产品追溯     | `/mes/traceability/product-trace`    | 名称可保留                             | 建立正反向追溯链                         |
| 生产日志    | 执行日志     | `/mes/traceability/production-log`   | 更准确表达围绕执行活动日志             | 审计、回放、责任追踪                     |
| 异常中心    | 异常处置     | `/mes/traceability/exception-center` | “中心”过虚，用户需要处置入口           | `MES` 先锁定，质量结论可能由 `QMS` 裁决  |
| 返工工单    | 返工执行     | `/mes/traceability/rework-order`     | 与 `QMS` 的返工评审做区分              | `QMS` 决策是否返工，`MES` 执行返工链     |

### 5.2 工程计划

| 当前三级名     | 目标三级名     | 当前路径                                            | 调整原因                       | 主责/边界备注                        |
| -------------- | -------------- | --------------------------------------------------- | ------------------------------ | ------------------------------------ |
| BOM 管理       | 产品结构       | `/engineering-plan/plm/bom/list`                    | 用户首先关注产品结构对象       | `PLM` 主责 BOM                       |
| BOM 编辑器     | BOM 编辑       | `/engineering-plan/plm/bom/editor/:id`              | “编辑器”偏工具语言             | 隐藏页，归属产品结构                 |
| 版本比较       | BOM 版本比较   | `/engineering-plan/plm/bom/compare`                 | 指向更清楚                     | `PLM` 主责版本合法性                 |
| 展开 / 反查    | 用量展开与反查 | `/engineering-plan/plm/bom/explode`                 | 用户能更快理解                 | 结构分析页                           |
| 成本卷积       | BOM 成本估算   | `/engineering-plan/plm/bom/cost`                    | “卷积”不是产品语言             | 估算，不是 ERP 最终成本真相          |
| 工艺路线       | 工艺路线       | `/engineering-plan/plm/routing`                     | 名称可保留                     | `PLM` 主责工艺定义                   |
| 工艺路线编辑器 | 工艺路线编辑   | `/engineering-plan/plm/routing/editor/:id`          | 去工具化                       | 隐藏页，归属工艺路线                 |
| 并行工序       | 并行工序       | `/engineering-plan/plm/routing/parallel`            | 名称可保留                     | 工艺规则配置页                       |
| 工时自学习     | 标准工时学习   | `/engineering-plan/plm/routing/auto-time`           | 用户更容易理解                 | 辅助工艺与排程                       |
| ECN / ECO 变更 | 工程变更       | `/engineering-plan/plm/ecn/list`                    | 减少缩写依赖                   | `PLM` 主责工程变更                   |
| 版本切换       | 版本切换       | `/engineering-plan/plm/cutover`                     | 名称可保留                     | `PLM` 发起合法性，`MES` 承接现场切换 |
| 计划需求池     | 需求池         | `/engineering-plan/planning/demand-pool`            | 更短、更可理解                 | 承接计划输入                         |
| APS 排程       | 排程结果       | `/engineering-plan/planning/aps/schedule`           | 用户更关心结果，而不是系统简称 | `APS` 主责排程真相                   |
| 约束配置       | 排程约束       | `/engineering-plan/planning/aps/constraint`         | 补齐对象前缀                   | `APS` 约束配置                       |
| 运行历史       | 排程历史       | `/engineering-plan/planning/aps/history`            | 与 MRP 历史区分                | 排程版本回看                         |
| MRP 结果       | MRP 运算结果   | `/engineering-plan/planning/mrp/result`             | 更准确                         | `ERP` 主口径或承接结果口径           |
| 运行历史       | MRP 历史       | `/engineering-plan/planning/mrp/history`            | 避免两个“运行历史”并列         | 与排程历史区分                       |
| 预测需求       | 预测需求       | `/engineering-plan/planning/mrp/forecast`           | 名称可保留                     | 计划输入页                           |
| 多工厂 MRP     | 多工厂计划     | `/engineering-plan/planning/mrp/multi-plant`        | 用业务语言替代系统算法名       | 计划协同视图                         |
| 净变更 MRP     | 净变更计划     | `/engineering-plan/planning/mrp/net-change`         | 降低术语门槛                   | 计划变更视图                         |
| 扰动重排       | 扰动重排       | `/engineering-plan/planning/disturbance-reschedule` | 名称可保留                     | `APS` 负责建议，`MES` 执行调整       |

### 5.3 质量仓储协同

| 当前三级名  | 目标三级名 | 当前路径                                          | 调整原因                     | 主责/边界备注                     |
| ----------- | ---------- | ------------------------------------------------- | ---------------------------- | --------------------------------- |
| 库存查询    | 库存台账   | `/collaboration/wms/inventory`                    | “查询”太轻，实际是库存主视图 | `WMS` 库存真相                    |
| 生产领料    | 生产领料   | `/collaboration/wms/picking`                      | 名称可保留                   | 领料不等于消耗                    |
| 入库管理    | 入库       | `/collaboration/wms/receipt`                      | 更短                         | `WMS` 主责入库                    |
| 销售出库    | 销售出库   | `/collaboration/wms/delivery`                     | 名称可保留                   | 交付出库                          |
| 退料 / 退货 | 退料退货   | `/collaboration/wms/return`                       | 文案更紧凑                   | `WMS` 主责库存移动                |
| 库存盘点    | 库存盘点   | `/collaboration/wms/stock-count`                  | 名称可保留                   | `WMS`                             |
| 库存调拨    | 库存调拨   | `/collaboration/wms/transfer`                     | 名称可保留                   | `WMS`                             |
| 倒冲领料    | 倒冲       | `/collaboration/wms/backflush`                    | 简化但保留专业含义           | 不能替代 `MES` 消耗记录           |
| 条码管理    | 批次条码   | `/collaboration/wms/barcode`                      | 指向更清楚                   | `WMS` 条码/批次能力               |
| 条码打印    | 条码打印   | `/collaboration/wms/barcode-print`                | 名称可保留                   | `WMS`                             |
| 扫码出入库  | 扫码作业   | `/collaboration/wms/barcode-scan`                 | 覆盖更多扫码业务动作         | `WMS`                             |
| 批次隔离    | 批次隔离   | `/collaboration/wms/batch-quarantine`             | 名称可保留                   | 库存隔离页，裁决可能来自 `QMS`    |
| 质检管理    | 检验任务   | `/collaboration/qms/inspection`                   | 让用户直接知道是任务入口     | `QMS` 检验真相                    |
| 质检模板    | 检验模板   | `/collaboration/qms/template`                     | 更贴近实际用途               | `QMS`                             |
| 供应商质量  | 供应商质量 | `/collaboration/qms/supplier-quality`             | 名称可保留                   | `QMS / SRM` 协同                  |
| 不合格处置  | 不合格处置 | `/collaboration/qms/ncr`                          | 用中文替代缩写               | `QMS` 主责不合格处理              |
| 特采放行    | 特采放行   | `/collaboration/qms/concession`                   | 用中文替代抽象词             | `QMS` 裁决，`MES/WMS` 执行        |
| 返工评审    | 返工裁决   | `/collaboration/qms/rework-review`                | 与 `MES` 的返工执行区分      | `QMS` 决策返工                    |
| 报废评审    | 报废裁决   | `/collaboration/qms/scrap-review`                 | 让用户明确这是裁决页         | `QMS` 决策报废                    |
| 复检关闭    | 复检与关闭 | `/collaboration/qms/re-inspection`                | 更符合动作链                 | `QMS` 主责复检和关闭              |
| 供应商管理  | 供应商     | `/collaboration/srm/supplier`                     | 更简洁                       | `SRM` 主责                        |
| 采购申请    | 采购申请   | `/collaboration/srm/purchase-request`             | 名称可保留                   | `SRM / ERP`                       |
| 采购订单    | 采购订单   | `/collaboration/srm/purchase`                     | 当前名称建议明确为订单       | `SRM / ERP`                       |
| 采购退货    | 采购退货   | `/collaboration/srm/return`                       | 名称可保留                   | `SRM / WMS`                       |
| 采购价格    | 价格协议   | `/collaboration/srm/price`                        | 更贴近业务对象               | `SRM`                             |
| 供应商门户  | 供应商协同 | `/collaboration/srm/portal`                       | 对用户更自然                 | `SRM`                             |
| 设备台账    | 设备台账   | `/collaboration/equipment-iot/equipment/list`     | 名称可保留                   | `设备` 主责                       |
| 点检管理    | 点检       | `/collaboration/equipment-iot/equipment/check`    | 更短                         | `设备`                            |
| 保养管理    | 保养       | `/collaboration/equipment-iot/equipment/maintain` | 更短                         | `设备`                            |
| 维修工单    | 维修       | `/collaboration/equipment-iot/equipment/repair`   | 更短                         | `设备`                            |
| 备件管理    | 备件       | `/collaboration/equipment-iot/equipment/spare`    | 更短                         | `设备`                            |
| OEE 统计    | OEE        | `/collaboration/equipment-iot/equipment/oee`      | 更简洁                       | 分析视图，数据源来自设备/执行系统 |
| 设备监控    | 实时监控   | `/collaboration/equipment-iot/iot/monitor`        | 更符合页面用途               | `IoT` 主责事件采集                |
| 采集配置    | 采集配置   | `/collaboration/equipment-iot/iot/config`         | 名称可保留                   | `IoT`                             |
| 历史数据    | 采集历史   | `/collaboration/equipment-iot/iot/history`        | 与其他历史页区分             | `IoT`                             |
| 告警规则    | 告警规则   | `/collaboration/equipment-iot/iot/alert`          | 名称可保留                   | `IoT`                             |
| 自动报工    | 自动报工   | `/collaboration/equipment-iot/iot/auto-report`    | 名称可保留                   | `IoT` 触发，执行事实仍归 `MES`    |

### 5.4 客户与订单

| 当前三级名 | 目标三级名 | 当前路径                              | 调整原因   | 主责/边界备注        |
| ---------- | ---------- | ------------------------------------- | ---------- | -------------------- |
| 客户管理   | 客户       | `/customer-business/crm/customer`     | 更自然     | `CRM` 主责           |
| 销售订单   | 销售订单   | `/customer-business/crm/order`        | 名称可保留 | `CRM` 主责订单       |
| 订单变更   | 订单变更   | `/customer-business/crm/order-change` | 名称可保留 | 隐藏页，归属销售订单 |
| 合同管理   | 合同       | `/customer-business/crm/contract`     | 更自然     | `CRM`                |
| 商机管理   | 商机       | `/customer-business/crm/opportunity`  | 更自然     | `CRM`                |
| 报价管理   | 报价       | `/customer-business/crm/quotation`    | 更自然     | `CRM`                |
| 发票管理   | 发票       | `/customer-business/crm/invoice`      | 更自然     | `CRM / 财务` 协同    |
| 应收台账   | 应收       | `/customer-business/crm/receivable`   | 更简洁     | `CRM / 财务` 协同    |

### 5.5 经营分析

| 当前三级名 | 目标三级名 | 当前路径                                           | 调整原因                 | 主责/边界备注        |
| ---------- | ---------- | -------------------------------------------------- | ------------------------ | -------------------- |
| 数据面板   | 经营驾驶舱 | `/management-analysis/operations/dashboard`        | “数据面板”太泛           | 分析聚合页           |
| 报表管理   | 经营报表   | `/management-analysis/operations/report`           | 更明确                   | 分析输出页           |
| 财务管理   | 财务概览   | `/management-analysis/operations/finance/index`    | “管理”容易误解成交易入口 | 分析口径页           |
| 成本核算   | 成本分析   | `/management-analysis/operations/finance/cost`     | 当前更像分析页           | ERP/财务仍是最终真相 |
| 财务报表   | 财务报表   | `/management-analysis/operations/finance/report`   | 名称可保留               | 报表页               |
| 总账对账   | 总账对账   | `/management-analysis/operations/finance/ledger`   | 名称可保留               | 对账页               |
| 能源概览   | 能耗概览   | `/management-analysis/compliance/energy/overview`  | 用户更常用“能耗”         | 分析页               |
| 能源明细   | 能耗明细   | `/management-analysis/compliance/energy/detail`    | 前后一致                 | 分析页               |
| 能源对标   | 能效对标   | `/management-analysis/compliance/energy/benchmark` | 更偏结果比较             | 分析页               |
| 安全管理   | 安环总览   | `/management-analysis/compliance/ehs/index`        | 当前实际是安环入口总览   | EHS 数据分析和总览   |
| 作业票管理 | 作业票     | `/management-analysis/compliance/ehs/permit`       | 更简洁                   | EHS                  |
| 应急预案   | 应急预案   | `/management-analysis/compliance/ehs/emergency`    | 名称可保留               | EHS                  |
| 培训管理   | 安环培训   | `/management-analysis/compliance/ehs/training`     | 与人资培训区分           | EHS                  |
| 人资管理   | 人资总览   | `/management-analysis/compliance/hr/index`         | 更像总览入口             | HR                   |
| 考勤管理   | 考勤       | `/management-analysis/compliance/hr/attendance`    | 更简洁                   | HR                   |
| 班组排班   | 排班       | `/management-analysis/compliance/hr/schedule`      | 更简洁                   | HR                   |
| 计件工资   | 计件工资   | `/management-analysis/compliance/hr/piecework`     | 名称可保留               | HR                   |
| 技能矩阵   | 技能矩阵   | `/management-analysis/compliance/hr/skill-matrix`  | 名称可保留               | HR                   |

### 5.6 平台与主数据

| 当前三级名   | 目标三级名   | 当前路径                                                            | 调整原因       | 主责/边界备注        |
| ------------ | ------------ | ------------------------------------------------------------------- | -------------- | -------------------- |
| 用户管理     | 用户         | `/platform-foundation/system/user`                                  | 更自然         | 平台基础             |
| 角色管理     | 角色         | `/platform-foundation/system/role`                                  | 更自然         | 平台基础             |
| 菜单管理     | 菜单         | `/platform-foundation/system/menu`                                  | 更自然         | 平台基础             |
| 字典管理     | 字典         | `/platform-foundation/system/dict`                                  | 更自然         | 平台基础             |
| 系统参数     | 参数         | `/platform-foundation/system/params`                                | 更自然         | 平台基础             |
| 操作日志     | 操作日志     | `/platform-foundation/system/audit`                                 | 名称可保留     | 平台基础             |
| 编码规则     | 编码规则     | `/platform-foundation/system/code-rule`                             | 名称可保留     | 平台基础             |
| 审批流配置   | 审批流       | `/platform-foundation/system/approval`                              | 更自然         | 平台基础             |
| 文件管理     | 文件         | `/platform-foundation/system/file`                                  | 更自然         | 平台基础             |
| 通知配置     | 通知         | `/platform-foundation/system/notification`                          | 更自然         | 平台基础             |
| SSO 配置     | 单点登录     | `/platform-foundation/system/sso`                                   | 用户更容易理解 | 平台基础             |
| 打印模板     | 打印模板     | `/platform-foundation/system/print-template/list`                   | 名称可保留     | 平台基础             |
| 打印模板设置 | 打印模板设置 | `/platform-foundation/system/print-template/templates/:categoryId?` | 名称可保留     | 归属打印模板         |
| 打印模板设计 | 打印模板设计 | `/platform-foundation/system/print-template/designer/:id`           | 名称可保留     | 隐藏页，归属打印模板 |
| 组织管理     | 组织         | `/platform-foundation/mdm/organization`                             | 对用户更直接   | `MDM` 跨域治理       |
| 物料管理     | 物料         | `/platform-foundation/mdm/material`                                 | 对用户更直接   | `MDM`                |
| 制造资源     | 制造资源     | `/platform-foundation/mdm/resource`                                 | 名称可保留     | `MDM`                |
| 工作中心     | 工作中心     | `/platform-foundation/mdm/work-center`                              | 名称可保留     | `MDM`                |
| 模具管理     | 模具         | `/platform-foundation/mdm/mold`                                     | 更自然         | `MDM`                |
| 系统配置     | 系统配置     | `/platform-foundation/settings/config`                              | 名称可保留     | 平台设置             |
| 设置日志     | 设置日志     | `/platform-foundation/settings/log`                                 | 名称可保留     | 平台设置             |

## 6. 重点边界裁决

### 6.1 MDM

- 导航位置：`平台与主数据 / 主数据`
- 对外命名原则：优先使用 `组织 / 物料 / 制造资源 / 工作中心 / 模具`
- 边界说明：虽然导航放在平台域，但 `MDM` 不是普通设置页，而是跨系统主数据标准与治理能力

### 6.2 版本切换

- 导航位置：`工程计划 / 产品结构与工艺 / 版本切换`
- 页面角色：产品用户看到的是一个切换入口
- 责任表达：
  - `PLM` 负责版本合法性、发起与工程影响判断
  - `MES` 负责现场切换执行、旧版收口、执行留痕

### 6.3 返工

- `质量仓储协同 / 质量裁决 / 返工裁决`：负责是否允许返工
- `生产执行 / 追溯与异常 / 返工执行`：负责返工链执行、回流、复检衔接

### 6.4 异常中心

- 目标显示名：`异常处置`
- 不再用“中心”作为主名称
- 页面语义固定为：`先锁定 -> 再处置 -> 再放行`
- 质量类异常的最终裁决不得在该页中绕过 `QMS`

### 6.5 WMS / MES 领料与消耗边界

- `仓储与批次 / 生产领料`：表达库存移动和实物出库
- `生产执行 / 投料与消耗`：表达现场实际使用事实
- 两者必须分别保留，不得合并为同一事实页

## 7. 首轮落地建议

首轮不建议直接改所有路径和目录，按下面顺序推进：

1. 先改菜单显示名、页面标题、面包屑
2. 再补路由元数据中的主责系统、协同系统、边界备注
3. 再按这份真相表做静态页面重构
4. 最后统一补 mock 和接口映射

## 8. 下一步待补充

这份真相表已经足够支撑一级、二级和关键三级菜单重构。后续还需要继续补齐两类内容：

1. 全量三级页面的最终排序与是否保留判定
2. 隐藏详情页、向导页、设计器页的统一命名和高亮归属规则
