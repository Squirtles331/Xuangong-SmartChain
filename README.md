# 玄工智链 · XIC 平台

> **制造业一体化数字平台** — 覆盖客户管理、生产管理、仓储采购、商品管理、精益生产、AI智能体、消息中心、系统管理等全链路功能

---

## 📋 项目简介

玄工智链（XIC Platform）是一套面向离散制造企业的全链路数字化管理平台，基于 Vue 3 + Element Plus + gi-component 构建，覆盖从客户跟单到生产报工、从采购入库到质量检验的完整业务闭环。

| 项目     | 信息                                                                   |
| -------- | ---------------------------------------------------------------------- |
| 技术栈   | Vue 3.5 + TypeScript + Element Plus 2.14 + gi-component + Pinia + Vite |
| 页面总数 | **94 个**                                                              |
| 模块数   | **16 个**                                                              |
| 数据方式 | Mock 数据驱动（对接后端后替换）                                        |
| 终端支持 | PC 端（1280px+）                                                       |

---

## 🚀 快速开始

```bash
# 克隆项目
git clone https://gitee.com/songtonngxue/xuanlian.git
cd xuanlian

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 登录系统
# 账号: admin / 密码: 123456
# 验证码可留空，直接登录
```

访问 http://localhost:8099 即可看到登录页。

---
/
├── dashboard                 首页工作台
│
├── mes                       MES生产执行 ⭐核心
│
├── erp                       ERP经营计划
│
├── plm                       PLM产品工艺
│
├── wms                       WMS仓储物流
│
├── qms                       QMS质量管理
│
├── crm                       CRM客户管理
│
├── srm                       SRM供应商管理
│
├── iot                       IoT设备管理
│
├── mdm                       MDM主数据中心
│
├── bi                        数据分析
│
└── system                    系统管理
/mes

MES生产执行
│
├── /mes/work-order
│       工单管理
│
├── /mes/dispatch
│       工单派工
│
├── /mes/material
│       物料齐套
│
├── /mes/production
│       生产执行
│
├── /mes/report
│       生产报工
│
├── /mes/process
│       工序管理
│
├── /mes/wip
│       在制品管理
│
├── /mes/trace
│       产品追溯
│
├── /mes/person
│       人员管理
│
├── /mes/shift
│       班组排班
│
├── /mes/tooling
│       工装模具
│
├── /mes/energy
│       能耗管理
│
├── /mes/dashboard
│       生产看板
│
└── /mes/log
        生产日志
/erp

ERP经营计划
│
├── /erp/order
│       销售订单
│
├── /erp/plan
│       生产计划
│
├── /erp/mps
│       MPS主生产计划
│
├── /erp/mrp
│       MRP物料需求
│
├── /erp/material
│       物料管理
│
├── /erp/inventory
│       库存协同
│
├── /erp/cost
│       生产成本
│
└── /erp/finance
        基础财务
/plm

PLM产品工艺
│
├── /plm/product
│       产品管理
│
├── /plm/bom
│       BOM管理
│
├── /plm/ebom
│       EBOM管理
│
├── /plm/mbom
│       MBOM管理
│
├── /plm/process
│       工艺路线
│
├── /plm/document
│       工艺文件
│
├── /plm/change
│       工程变更
│
├── /plm/ecr
│       ECR变更申请
│
└── /plm/eco
        ECO变更执行
/wms

WMS仓储物流
│
├── /wms/inbound
│       入库管理
│
├── /wms/outbound
│       出库管理
│
├── /wms/material
│       物料配送
│
├── /wms/location
│       库位管理
│
├── /wms/inventory
│       库存管理
│
├── /wms/barcode
│       条码管理
│
├── /wms/batch
│       批次管理
│
└── /wms/check
        盘点管理
/qms

QMS质量管理
│
├── /qms/standard
│       检验标准
│
├── /qms/iqc
│       来料检验
│
├── /qms/ipqc
│       过程检验
│
├── /qms/fqc
│       成品检验
│
├── /qms/defect
│       缺陷管理
│
├── /qms/rework
│       返工管理
│
├── /qms/scrap
│       报废管理
│
└── /qms/trace
        质量追溯
/crm

CRM客户管理
│
├── /crm/customer
│       客户档案
│
├── /crm/contact
│       联系人
│
├── /crm/order
│       客户订单
│
├── /crm/contract
│       销售合同
│
├── /crm/delivery
│       交付跟踪
│
├── /crm/service
│       售后服务
│
└── /crm/complaint
        客诉管理
/srm

SRM供应商管理
│
├── /srm/supplier
│       供应商档案
│
├── /srm/qualification
│       供应商准入
│
├── /srm/inquiry
│       询价比价
│
├── /srm/order
│       采购订单
│
├── /srm/delivery
│       到货管理
│
└── /srm/evaluation
        供应商评价
/iot

IoT设备管理
│
├── /iot/device
│       设备台账
│
├── /iot/gateway
│       网关管理
│
├── /iot/tag
│       点位管理
│
├── /iot/data
│       实时数据
│
├── /iot/alarm
│       报警管理
│
├── /iot/maintenance
│       设备维护
│
└── /iot/oee
        OEE分析
/mdm

MDM主数据中心
│
├── /mdm/customer
│       客户主数据
│
├── /mdm/material
│       物料主数据
│
├── /mdm/product
│       产品主数据
│
├── /mdm/bom
│       BOM主数据
│
├── /mdm/device
│       设备主数据
│
├── /mdm/person
│       人员主数据
│
├── /mdm/organization
│       组织主数据
│
├── /mdm/sync
│       数据同步
│
└── /mdm/governance
        数据治理
/bi

数据分析
│
├── /bi/production
│       生产分析
│
├── /bi/oee
│       OEE分析
│
├── /bi/quality
│       质量分析
│
├── /bi/cost
│       成本分析
│
├── /bi/device
│       设备分析
│
└── /bi/dashboard
        综合驾驶舱
系统管理
│
├── 用户管理
├── 角色权限
├── 组织管理
├── 菜单管理
├── 数据权限
├── 操作日志
├── 参数配置
└── 租户管理
首页
生产制造(MES)
计划排程(APS)
产品工艺(PLM)
质量管理(QMS)
仓储物流(WMS)
设备管理(IoT)
供应链(SRM)
客户管理(CRM)
数据中心(MDM)
报表分析(BI)
系统管理

## 📦 功能模块

### 1. 客户管理

| 功能     | 页面                | 说明                                     |
| -------- | ------------------- | ---------------------------------------- |
| 客户管理 | `/crm/customer`     | 客户信息CRUD、联系人维护                 |
| 商机管理 | `/crm/opportunity`  | 初步接触→方案制定→报价→成交 四阶段漏斗   |
| 报价单   | `/crm/quotation`    | 报价单创建、产品关联、折扣应用、状态跟踪 |
| 销售订单 | `/crm/order`        | 订单审批→生产→发货→完成 全流程           |
| 订单变更 | `/crm/order-change` | 数量/交期调整，已生成工单后走评审流程    |
| 合同管理 | `/crm/contract`     | 合同签订→生效→到期 全生命周期            |
| 应收台账 | `/crm/receivable`   | 账龄分析、回款核销、自动匹配             |
| 发票管理 | `/crm/invoice`      | 开票、含税自动计算、作废/红冲            |

### 2. 生产管理

| 功能     | 页面                     | 说明                                    |
| -------- | ------------------------ | --------------------------------------- |
| 工单管理 | `/work-order/list`       | 工单CRUD、审批、下发、关闭              |
| 工单创建 | `/work-order/create`     | 三步向导：基本信息→BOM/工艺预览→确认    |
| 工单详情 | `/work-order/:id`        | 基本信息/工序列表/操作日志 三Tab        |
| 工单拆分 | `/work-order/split`      | 多产线并行生产分配                      |
| 车间看板 | `/work-order/kanban`     | 四列Kanban：待派工/已派工/生产中/已完工 |
| 工序报工 | `/work-order/report/:id` | 合格数/不良数/工时上报、计时器          |
| 我的任务 | `/work-order/my-tasks`   | 待开工/生产中/已完工 三Tab              |
| 报工追溯 | `/work-order/trace`      | 历史报工记录查询                        |
| 委外工单 | `/work-order/outsource`  | 委外加工全流程跟踪、成本核算            |

### 3. BOM与工艺

| 功能       | 页面                  | 说明                                       |
| ---------- | --------------------- | ------------------------------------------ |
| BOM管理    | `/bom/list`           | EBOM/PBOM/MBOM版本管理                     |
| BOM编辑器  | `/bom/editor/:id`     | 树形编辑器、虚拟件/辅料标识、Excel导入导出 |
| 版本比较   | `/bom/compare`        | 双版本差异高亮对比                         |
| 展开/反查  | `/bom/explode`        | 正查BOM树 + Where-Used反查                 |
| 成本卷积   | `/bom/cost`           | 材料成本+人工成本+制造费用汇总             |
| 工艺路线   | `/routing/editor/:id` | 工序编排、质检关口、委外标识、工时定额     |
| 并行工序   | `/routing/parallel`   | 并行组配置、汇合规则                       |
| 工时自学习 | `/routing/auto-time`  | IoT数据自动修正定额                        |
| ECN变更    | `/ecn/list`           | 变更申请→审批→执行→验证 + 影响分析         |

### 4. 生产计划与排程

| 功能      | 页面               | 说明                             |
| --------- | ------------------ | -------------------------------- |
| MRP结果   | `/mrp/result`      | 建议采购/建议生产/例外报告 三Tab |
| 运行历史  | `/mrp/history`     | MRP运行日志追溯                  |
| 预测需求  | `/mrp/forecast`    | 销售预测+独立需求，纳入MRP       |
| 多工厂MRP | `/mrp/multi-plant` | 跨工厂调拨建议                   |
| 净变更MRP | `/mrp/net-change`  | 变更事件→受影响物料增量计算      |
| APS排程   | `/aps/schedule`    | 甘特图+负荷图+约束冲突检测       |
| 约束配置  | `/aps/constraint`  | 模具/刀具/人员技能/物料约束配置  |

### 5. 仓储/采购

| 功能       | 页面                    | 说明                          |
| ---------- | ----------------------- | ----------------------------- |
| 供应商管理 | `/scm/supplier`         | 供应商信息、供货物料清单      |
| 采购申请   | `/scm/purchase-request` | MRP生成+手动创建、审批→转订单 |
| 采购订单   | `/scm/purchase`         | 收货确认、批次管理、状态流转  |
| 采购退货   | `/scm/return`           | 质检不合格→退货出库           |
| 采购价格   | `/scm/price`            | 询价/比价/年度合同 价格库     |
| 供应商门户 | `/scm/portal`           | 供应商在线确认订单+发货通知   |
| 库存查询   | `/wms/inventory`        | 实时库存、批次追溯            |
| 生产领料   | `/wms/picking`          | 按工单BOM拣货+确认            |
| 入库管理   | `/wms/receipt`          | 采购/生产/退货入库            |
| 销售出库   | `/wms/delivery`         | 发货确认                      |
| 退料退货   | `/wms/return`           | 生产退料+采购退货             |
| 库存盘点   | `/wms/stock-count`      | 计划创建→执行→差异处理        |
| 库存调拨   | `/wms/transfer`         | 仓库间/库位间转移             |
| 倒冲领料   | `/wms/backflush`        | BOM用量vs实际用量自动冲销     |
| 条码管理   | `/wms/barcode`          | 条码打印+扫码出入库           |

### 6. 质量管理

| 功能       | 页面                    | 说明                         |
| ---------- | ----------------------- | ---------------------------- |
| 质检任务   | `/qms/inspection`       | 来料/过程/最终检验，5种判定  |
| 质检模板   | `/qms/template`         | 检验项目动态配置             |
| 供应商质量 | `/qms/supplier-quality` | 批次合格率统计、重复问题追踪 |

### 7. 商品管理（主数据）

| 功能     | 页面                | 说明                       |
| -------- | ------------------- | -------------------------- |
| 组织管理 | `/mdm/organization` | 集团→公司→工厂→车间 四级树 |
| 物料管理 | `/mdm/material`     | 分类树+列表、编码规则      |
| 制造资源 | `/mdm/resource`     | 设备台账+状态管理          |
| 工作中心 | `/mdm/work-center`  | 产能+工时费率              |
| 模具管理 | `/mdm/mold`         | 模具编码+寿命管理          |

### 8. 精益生产

| 功能     | 页面                  | 说明                        |
| -------- | --------------------- | --------------------------- |
| 设备台账 | `/equipment/list`     | 设备全生命周期管理          |
| 点检管理 | `/equipment/check`    | 日/周/月点检计划+执行       |
| 保养管理 | `/equipment/maintain` | 日常/周保养/大修计划+执行   |
| 维修工单 | `/equipment/repair`   | 故障上报→派工→维修→验收     |
| 备件管理 | `/equipment/spare`    | 库存管理+安全库存预警       |
| OEE统计  | `/equipment/oee`      | 综合OEE卡片+趋势图+设备排行 |

### 9. IoT中心

| 功能     | 页面               | 说明                               |
| -------- | ------------------ | ---------------------------------- |
| 设备监控 | `/iot/monitor`     | 5台设备实时状态卡片                |
| 采集配置 | `/iot/config`      | OPC UA/MQTT协议配置                |
| 历史数据 | `/iot/history`     | ECharts实时曲线+历史表格           |
| 告警规则 | `/iot/alert`       | 设备/指标/阈值/级别 规则配置       |
| 自动报工 | `/iot/auto-report` | 周期完成/计数到达/设备停机触发报工 |

### 10. 能源中心

| 功能     | 页面                | 说明                          |
| -------- | ------------------- | ----------------------------- |
| 能耗概览 | `/energy/overview`  | 电/水/气 能耗卡片+ECharts图表 |
| 能耗明细 | `/energy/detail`    | 分车间/分项能耗明细           |
| 能耗对标 | `/energy/benchmark` | 单位产值能耗 vs 行业标杆      |

### 11. 安环中心

| 功能       | 页面             | 说明                        |
| ---------- | ---------------- | --------------------------- |
| 安全管理   | `/ehs/index`     | 隐患排查、I/II/III级风险    |
| 作业票管理 | `/ehs/permit`    | 动火/高处/受限空间/临时用电 |
| 应急预案   | `/ehs/emergency` | 预案管理+演练记录           |
| 培训管理   | `/ehs/training`  | 三级安全教育+消防+危化品    |

### 12. 人资中心

| 功能     | 页面               | 说明                          |
| -------- | ------------------ | ----------------------------- |
| 员工管理 | `/hr/index`        | 员工信息CRUD                  |
| 考勤管理 | `/hr/attendance`   | 打卡记录、迟到/旷工统计       |
| 班组排班 | `/hr/schedule`     | 白班/夜班/中班排班            |
| 计件工资 | `/hr/piecework`    | 6道工序单价+合格奖励+不良扣款 |
| 技能矩阵 | `/hr/skill-matrix` | 5星技能等级+证书管理          |

### 13. 财务中心

| 功能     | 页面              | 说明                     |
| -------- | ----------------- | ------------------------ |
| 应付账款 | `/finance/index`  | 应付款管理、付款状态跟踪 |
| 成本核算 | `/finance/cost`   | 材料/人工/制造费用       |
| 财务报表 | `/finance/report` | 月度经营概览             |
| 总账对账 | `/finance/ledger` | 借贷总账+应收应付对账    |

### 14. 系统管理

| 功能       | 页面                   | 说明                       |
| ---------- | ---------------------- | -------------------------- |
| 用户管理   | `/system/user`         | 用户CRUD+角色分配          |
| 角色管理   | `/system/role`         | 角色配置+权限分配          |
| 菜单管理   | `/system/menu`         | 三级菜单树(目录/菜单/按钮) |
| 字典管理   | `/system/dict`         | 字典类型+字典项维护        |
| 系统参数   | `/system/params`       | 全局参数配置               |
| 操作日志   | `/system/audit`        | 审计日志查询               |
| 编码规则   | `/system/code-rule`    | 单据编码自动生成规则       |
| 审批流配置 | `/system/approval`     | 固定审批链配置             |
| 文件管理   | `/system/file`         | 文件上传/下载/预览         |
| 通知配置   | `/system/notification` | 企微/钉钉/站内信多渠道路由 |
| SSO配置    | `/system/sso`          | OAuth2/OIDC/SAML/LDAP      |

### 15. 驾驶舱

| 功能       | 路径 | 说明                                     |
| ---------- | ---- | ---------------------------------------- |
| 首页工作台 | `/`  | 营收/工单/OEE/交付率 4卡片 + ECharts图表 |

---

## 🏗️ 项目结构

```
src/
├── api/            # API接口层（system.ts / business.ts / work-order.ts）
├── assets/         # 静态资源（图标/图片）
├── common/utils/   # 通用工具函数
├── components/     # 全局组件（TableSetting等）
├── layout/         # 布局系统（6种布局模式）
├── mock/           # Mock数据中心（system / work-order / bom / business）
├── router/         # 路由配置
├── stores/         # Pinia状态管理（user / permission / layout / lock / constraint）
├── styles/         # 全局样式 + 7套主题
├── types/          # TypeScript类型定义
├── utils/          # HTTP封装（axios拦截器）
└── views/          # 94个业务页面
    ├── system/     # 系统管理（11页）
    ├── work-order/ # 生产管理（9页）
    ├── bom/        # BOM管理（5页）
    ├── routing/    # 工艺路线（3页）
    ├── ecn/        # 变更管理（1页）
    ├── crm/        # 客户管理（8页）
    ├── scm/        # 采购管理（6页）
    ├── wms/        # 仓储管理（9页）
    ├── qms/        # 质量管理（3页）
    ├── mdm/        # 主数据（5页）
    ├── aps/        # APS排程（2页）
    ├── mrp/        # MRP运算（5页）
    ├── equipment/  # 设备中心（6页）
    ├── iot/        # IoT中心（5页）
    ├── energy/     # 能源中心（3页）
    ├── ehs/        # 安环中心（4页）
    ├── hr/         # 人资中心（5页）
    ├── finance/    # 财务中心（4页）
    ├── analysis/   # 数据分析（2页）
    └── settings/   # 系统设置（2页）
```

---

## 🔧 开发规范

### 文件命名

| 类型     | 规范                | 示例                             |
| -------- | ------------------- | -------------------------------- |
| 目录     | kebab-case          | `work-order/`, `code-rule/`      |
| 页面入口 | `index.vue`         | `work-order/list/index.vue`      |
| 子组件   | `component/xxx.vue` | `system/role/component/form.vue` |

### 组件使用优先级

```
gi-component → vxe-table → Element Plus
```

### gi-page-layout 标准结构

```vue
<gi-page-layout>
  <template #header><gi-form search /></template>
  <template #left><el-tree /></template>
  <template #tool><gi-button /></template>
  <gi-table />  <!-- 默认插槽 -->
  <gi-dialog /> <!-- 弹窗 -->
</gi-page-layout>
```

### gi-table 规范

- 列宽使用 `minWidth`（不使用固定 `width`）
- 操作栏固定右侧：`fixed: 'right'`
- 分页 `total` 使用 `watch` 更新（不放 `computed` 中）

---

## 📊 项目历程

| 阶段        | 内容                              | 页面数 |
| ----------- | --------------------------------- | ------ |
| V1.0 基础   | 经营闭环 8 模块 PRD + 前端页面    | 69     |
| V1.0 补全   | 按 PRD 补齐 16 个缺失功能         | 69     |
| V2.0 新模块 | 设备/IoT/能源/安环/人资/财务      | +10    |
| V2.0 增强   | 约束排程/自动报工/发票/合同/SSO等 | +15    |
| **当前**    | **94个页面，16个模块**            | **94** |

---

## 📝 相关文档

- [项目总览](./玄工智链_项目总览_V1.0.md)
- [PC端前端开发计划](./玄工智链_PC端前端开发计划_V1.0.md)
- [系统管理与平台基础 PRD](./玄工智链_PRD_系统管理与平台基础_V1.0.md)
- [测试验收总览](./玄工智链_测试验收总览_V1.0.md)

---

> **最后更新**：2025-01 | **版本**：V2.0 | **页面总数**：94 | **模块数**：16
