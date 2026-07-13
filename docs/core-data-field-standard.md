# 玄工智链核心字段口径表

## 1. 文档定位

本文档用于约束玄工智链核心对象的字段口径，避免后续静态页、mock、接口出现以下问题：

- 同一个对象在不同模块字段名不同
- 同一个字段在不同模块语义不同
- 页面能显示，但无法真正做跨模块联动

本文档当前优先覆盖五类关键对象：

- 物料
- BOM
- 工艺路线
- 仓库/库位
- 工单

## 2. 使用约定

### 2.1 命名原则

- 前端展示使用中文业务语言
- 内部字段建议使用统一英文蛇形或驼峰规则，不同对象保持一致
- 同一字段跨模块复用同一命名，不允许近义变体并存

### 2.2 字段类型原则

- 编码字段统一为字符串
- 数量字段统一为数值
- 日期时间字段统一明确是日期还是日期时间
- 状态字段统一使用枚举值，不使用自由文本

### 2.3 口径优先级

以本文档定义为准；若现有页面、mock、接口与本文档冲突，后续改造应逐步对齐本文档。

## 3. 物料字段口径

### 3.1 物料字段标准

| 字段中文名   | 建议字段名            | 类型    | 必填 | 主责模块    | 说明                                          |
| ------------ | --------------------- | ------- | ---- | ----------- | --------------------------------------------- |
| 物料ID       | `id`                  | string  | 是   | `MDM`       | 系统内部唯一标识                              |
| 物料编码     | `code`                | string  | 是   | `MDM`       | 跨系统唯一编码，不得重复                      |
| 物料名称     | `name`                | string  | 是   | `MDM`       | 标准名称                                      |
| 规格型号     | `spec`                | string  | 否   | `MDM`       | 用于区分规格                                  |
| 物料分类编码 | `category_code`       | string  | 是   | `MDM`       | 引用物料分类                                  |
| 物料分类名称 | `category_name`       | string  | 是   | `MDM`       | 展示字段，可冗余                              |
| 物料类型     | `type`                | enum    | 是   | `MDM`       | 建议：`purchased` `manufactured` `outsourced` |
| 基本单位     | `base_uom`            | string  | 是   | `MDM`       | 唯一计量基础单位                              |
| 批次管理     | `batch_managed`       | boolean | 是   | `MDM`       | 是否按批次管理                                |
| 序列号管理   | `sn_managed`          | boolean | 是   | `MDM`       | 是否按序列号管理                              |
| 替代料策略   | `substitution_policy` | enum    | 否   | `MDM`       | 建议：`none` `manual` `auto`                  |
| 默认仓库编码 | `default_wh_code`     | string  | 否   | `MDM`       | 缺省库存归属仓                                |
| 采购属性     | `purchase_flag`       | boolean | 是   | `MDM`       | 是否允许采购                                  |
| 生产属性     | `manufacture_flag`    | boolean | 是   | `MDM`       | 是否允许生产                                  |
| 质量属性     | `quality_flag`        | boolean | 是   | `MDM`       | 是否纳入质量管控                              |
| 状态         | `status`              | enum    | 是   | `MDM`       | 建议：`draft` `active` `disabled` `archived`  |
| 版本         | `revision`            | string  | 否   | `MDM`/`PLM` | 若启用版本化则必须明确                        |
| 生效日期     | `effective_date`      | date    | 否   | `MDM`       | 发布后生效控制                                |

### 3.2 现阶段最低实现字段

结合当前系统页面，物料页至少应先统一这些字段：

- `code`
- `name`
- `spec`
- `type`
- `base_uom`
- `category_code`
- `status`

## 4. BOM 字段口径

### 4.1 BOM 头字段标准

| 字段中文名   | 建议字段名       | 类型     | 必填 | 主责模块 | 说明                              |
| ------------ | ---------------- | -------- | ---- | -------- | --------------------------------- |
| BOM ID       | `id`             | string   | 是   | `PLM`    | 内部唯一标识                      |
| 母件物料编码 | `material_code`  | string   | 是   | `PLM`    | 引用物料                          |
| 母件物料名称 | `material_name`  | string   | 是   | `PLM`    | 展示冗余                          |
| BOM 类型     | `bom_type`       | enum     | 是   | `PLM`    | 建议：`EBOM` `MBOM` `PBOM`        |
| BOM 版本     | `version`        | string   | 是   | `PLM`    | 如 `V1.0`                         |
| 状态         | `status`         | enum     | 是   | `PLM`    | 建议：`draft` `active` `archived` |
| 生效日期     | `effective_date` | date     | 否   | `PLM`    | 生效开始日期                      |
| 失效日期     | `expire_date`    | date     | 否   | `PLM`    | 可选                              |
| 创建人       | `created_by`     | string   | 否   | `PLM`    | 审计字段                          |
| 创建时间     | `created_at`     | datetime | 否   | `PLM`    | 审计字段                          |
| 来源变更单   | `ecn_code`       | string   | 否   | `PLM`    | 对应变更来源                      |

### 4.2 BOM 行字段标准

| 字段中文名   | 建议字段名           | 类型    | 必填 | 说明                   |
| ------------ | -------------------- | ------- | ---- | ---------------------- |
| 子项行ID     | `item_id`            | string  | 是   | 行级唯一标识           |
| 子项物料编码 | `component_code`     | string  | 是   | 引用物料               |
| 子项物料名称 | `component_name`     | string  | 是   | 展示冗余               |
| 用量         | `qty_per`            | number  | 是   | 标准单位用量           |
| 损耗率       | `scrap_rate`         | number  | 否   | 百分比或小数，必须统一 |
| 单位         | `uom`                | string  | 是   | 单位口径需与物料一致   |
| 替代组       | `alternate_group`    | string  | 否   | 替代料分组             |
| 虚拟件标识   | `phantom_flag`       | boolean | 否   | 是否虚拟件             |
| 领料工序号   | `issue_operation_no` | number  | 否   | 与工艺路线关联         |
| 备注         | `remark`             | string  | 否   | 说明字段               |

### 4.3 关键口径要求

- `EBOM` 表示设计结构
- `MBOM` 表示制造领料结构
- `PBOM` 如保留，必须明确其业务定义，不能只是中间态别名
- `qty_per` 必须是标准基准用量
- `scrap_rate` 必须统一一种表达方式，不得一处写 `5` 一处写 `0.05`

## 5. 工艺路线字段口径

### 5.1 工艺路线头字段标准

| 字段中文名   | 建议字段名      | 类型   | 必填 | 主责模块 | 说明                                          |
| ------------ | --------------- | ------ | ---- | -------- | --------------------------------------------- |
| 工艺路线ID   | `id`            | string | 是   | `PLM`    | 内部唯一标识                                  |
| 工艺路线名称 | `routing_name`  | string | 是   | `PLM`    | 标准名称                                      |
| 物料编码     | `material_code` | string | 是   | `PLM`    | 对应产品/半成品                               |
| 物料名称     | `material_name` | string | 是   | `PLM`    | 展示冗余                                      |
| 版本         | `version`       | string | 是   | `PLM`    | 与 BOM 版本协调                               |
| 状态         | `status`        | enum   | 是   | `PLM`    | 建议：`draft` `enabled` `disabled` `archived` |
| 说明         | `description`   | string | 否   | 补充描述 |

### 5.2 工序字段标准

| 字段中文名   | 建议字段名         | 类型    | 必填 | 说明               |
| ------------ | ------------------ | ------- | ---- | ------------------ |
| 工序ID       | `operation_id`     | string  | 是   | 行级唯一标识       |
| 工序号       | `operation_no`     | number  | 是   | 建议 10、20、30... |
| 工序名称     | `operation_name`   | string  | 是   | 标准工序名称       |
| 工作中心编码 | `work_center_code` | string  | 是   | 引用工作中心       |
| 工作中心名称 | `work_center_name` | string  | 是   | 展示冗余           |
| 准备工时     | `setup_minutes`    | number  | 否   | 建议统一分钟       |
| 加工工时     | `run_minutes`      | number  | 否   | 建议统一分钟       |
| 排队工时     | `queue_minutes`    | number  | 否   | 建议统一分钟       |
| 转运工时     | `move_minutes`     | number  | 否   | 建议统一分钟       |
| 标准人数     | `worker_count`     | number  | 否   | 建议整数           |
| 技能要求     | `skill_code`       | string  | 否   | 引用技能字典       |
| 质检关卡     | `is_qc_gate`       | boolean | 否   | 是否需要质量关卡   |
| 委外工序     | `is_outsourced`    | boolean | 否   | 是否委外           |
| 作业说明     | `instruction`      | string  | 否   | 作业指导说明       |

### 5.3 当前页面建议对齐

当前工艺路线页面已有以下概念，应优先收敛命名：

- `routing_name`
- `material_code`
- `material_name`
- `version`
- `status`
- `operation_no`
- `work_center`
- `setup_hours`
- `run_hours`
- `queue_hours`
- `move_hours`

建议后续统一把工时类字段改为分钟口径，避免“小时/分钟混用”。

## 6. 仓库与库位字段口径

### 6.1 仓库字段标准

| 字段中文名 | 建议字段名 | 类型   | 必填 | 主责模块 | 说明                                  |
| ---------- | ---------- | ------ | ---- | -------- | ------------------------------------- |
| 仓库ID     | `id`       | string | 是   | `MDM`    | 内部唯一标识                          |
| 仓库编码   | `code`     | string | 是   | `MDM`    | 唯一编码                              |
| 仓库名称   | `name`     | string | 是   | `MDM`    | 展示名称                              |
| 仓库类型   | `type`     | enum   | 是   | `MDM`    | 建议：`raw` `semi` `finished` `spare` |
| 组织编码   | `org_code` | string | 是   | `MDM`    | 所属组织                              |
| 启用状态   | `status`   | enum   | 是   | `MDM`    | 建议：`active` `disabled`             |

### 6.2 库位字段标准

| 字段中文名 | 建议字段名         | 类型   | 必填 | 说明               |
| ---------- | ------------------ | ------ | ---- | ------------------ |
| 库位ID     | `id`               | string | 是   | 内部唯一标识       |
| 库位编码   | `bin_code`         | string | 是   | 唯一编码           |
| 库位名称   | `bin_name`         | string | 是   | 展示名称           |
| 仓库编码   | `wh_code`          | string | 是   | 所属仓库           |
| 库区编码   | `area_code`        | string | 否   | 所属库区           |
| 库位类型   | `bin_type`         | enum   | 否   | 存储、拣选、待检等 |
| 库存状态   | `inventory_status` | enum   | 否   | 缺省库存状态       |
| 启用状态   | `status`           | enum   | 是   | 是否启用           |

## 7. 工单字段口径

### 7.1 工单头字段标准

| 字段中文名   | 建议字段名               | 类型   | 必填 | 主责模块    | 说明                                                                   |
| ------------ | ------------------------ | ------ | ---- | ----------- | ---------------------------------------------------------------------- |
| 工单ID       | `id`                     | string | 是   | `MES`       | 内部唯一标识                                                           |
| 工单编号     | `code`                   | string | 是   | `MES`/`ERP` | 统一编码                                                               |
| 产品物料编码 | `material_code`          | string | 是   | `MES`       | 引用物料                                                               |
| 产品名称     | `material_name`          | string | 是   | `MES`       | 展示冗余                                                               |
| BOM版本      | `bom_version`            | string | 是   | `MES`       | 承接执行版本                                                           |
| 工艺路线版本 | `routing_version`        | string | 是   | `MES`       | 承接执行版本                                                           |
| 计划数量     | `planned_qty`            | number | 是   | `MES`       | 工单目标产量                                                           |
| 完成数量     | `completed_qty`          | number | 否   | `MES`       | 实际完成量                                                             |
| 优先级       | `priority`               | enum   | 是   | `MES`       | 建议：`urgent` `high` `normal` `low`                                   |
| 状态         | `status`                 | enum   | 是   | `MES`       | 建议：`draft` `approved` `released` `in_progress` `completed` `closed` |
| 车间编码     | `workshop_code`          | string | 否   | `MES`       | 所属车间                                                               |
| 车间名称     | `workshop_name`          | string | 否   | `MES`       | 展示冗余                                                               |
| 当前工序号   | `current_operation_no`   | number | 否   | `MES`       | 执行态字段                                                             |
| 当前工序名称 | `current_operation_name` | string | 否   | `MES`       | 执行态字段                                                             |
| 计划开工日期 | `planned_start_date`     | date   | 否   | `MES`       | 计划字段                                                               |
| 计划完工日期 | `planned_end_date`       | date   | 否   | `MES`       | 计划字段                                                               |
| 下达日期     | `release_date`           | date   | 否   | `MES`       | 正式下达日期                                                           |
| 来源订单号   | `source_order_code`      | string | 否   | `ERP`/`MES` | 上游销售或计划来源                                                     |

### 7.2 当前工单页建议对齐

当前工单页面中已有这些重点字段，建议保持为正式标准：

- `code`
- `material_name`
- `planned_qty`
- `completed_qty`
- `priority`
- `status`
- `current_operation`
- `workshop_name`
- `planned_end_date`

其中建议后续把：

- `current_operation` 拆为 `current_operation_no` + `current_operation_name`
- `progress` 定位为计算字段，不作为主存字段

## 8. 通用状态字段规范

不同对象可以有不同状态，但应遵守以下原则：

- 状态值统一用英文枚举
- 展示标签统一由映射表管理
- 不在业务记录中直接保存中文状态名

### 8.1 推荐状态值层次

| 层次   | 说明       | 示例                          |
| ------ | ---------- | ----------------------------- |
| 草稿态 | 尚未生效   | `draft`                       |
| 审批态 | 等待审核   | `pending_approval`            |
| 发布态 | 已可用     | `active` `released` `enabled` |
| 停用态 | 可恢复停用 | `disabled`                    |
| 归档态 | 历史冻结   | `archived`                    |

## 9. 当前阶段的落地建议

这份字段口径表对当前开发的直接要求是：

1. 新静态页字段优先从本文档取名
2. mock 数据字段必须与本文档一致
3. 若已有旧字段名冲突，先在文档标注，后续逐步迁移
4. 先统一物料、BOM、工艺、仓储、工单五类，再扩展到客户、供应商、检验、设备

## 10. 后续扩展建议

下一步建议继续补齐以下字段口径表：

- 客户
- 供应商
- 收货单/入库单
- 报工记录
- 检验记录
- 异常记录
- 库存台账
