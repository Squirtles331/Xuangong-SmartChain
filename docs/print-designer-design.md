# 打印设计器（Print Designer）设计与开发文档

> 状态：设计稿 v1
> 适用项目：starlink-mos-frontend（Vue 3.5 + Element Plus + Pinia + vxe-table + vue-draggable-plus）
> 目标：自研一套可视化打印模板设计器，替代 hiprint / vue-plugin-print 等开源插件，覆盖全模块单据打印。

---

## 1. 背景与目标

### 1.1 为什么自研

现有开源方案的主要问题：

| 方案                     | 问题                                                                     |
| ------------------------ | ------------------------------------------------------------------------ |
| vue-plugin-hiprint       | 基于 jQuery，与 Vue 3 响应式割裂；样式定制困难；中文文档零散；二开成本高 |
| print-js / vue3-print-nb | 只负责"打印当前 DOM"，没有可视化设计能力，模板靠手写 HTML                |
| 各类 PDF 设计器          | 偏报表（类 BIRT/JasperReports），重、慢、与本项目数据层不匹配            |

本项目是十几个业务模块的 MOS/ERP 系统，单据打印是高频刚需（采购单、销售单、出入库单、质检报告、物料标签等）。需要一套：

- 原生 Vue 3 实现，零 jQuery，吃 Pinia 响应式
- 复用现有 `gi-component` / `useTable` / mock-api 分层约定
- 一套模板数据，多种输出（浏览器打印 / PDF / 针式套打 / 后端批量）
- 管理员可深度设计，业务用户可轻量调整

### 1.2 范围（本期）

- 输出方式：浏览器原生打印、PDF 导出、针式/连续纸套打、后端批量打印（四类全覆盖）
- 单据类型：标准业务单据、标签/条码、质检报告、证书/凭证（四类全覆盖）
- 用户定位：管理员配置 + 业务用户自助轻量调整（两者兼顾）

### 1.3 不在本期范围

- 复杂统计报表（交叉表、图表钻取）——交由 echarts 报表页处理
- 多人实时协同编辑模板

---

## 2. 整体架构

```
┌─────────────────────────────────────────────────────────┐
│                     打印设计器模块                          │
│                                                           │
│  ┌────────────┐   ┌────────────┐   ┌─────────────────┐   │
│  │  Designer   │   │  Renderer  │   │  Output Adapters │   │
│  │  设计器画布   │──▶│  渲染引擎    │──▶│  浏览器/PDF/针式/后端 │   │
│  └────────────┘   └────────────┘   └─────────────────┘   │
│        │                 ▲                                │
│        ▼                 │                                │
│  ┌────────────┐   ┌────────────┐                          │
│  │ Template    │   │ DataBinding │                         │
│  │ Schema(JSON) │  │ 数据绑定/表达式 │                       │
│  └────────────┘   └────────────┘                          │
└─────────────────────────────────────────────────────────┘
         │                                    │
         ▼                                    ▼
   src/api/print.ts                    业务模块调用 PrintService
   (mock / real 切换)                  (传 templateKey + 业务数据)
```

核心理念：**模板 = 一份 JSON Schema**。设计器产出 JSON，渲染引擎消费 JSON，所有输出适配器共享同一份渲染结果。设计器和渲染引擎严格分离——业务页打印时只加载渲染引擎（轻量），不加载设计器（重）。

---

## 3. 目录结构

```
src/
├── api/
│   └── print.ts                      # 打印模板 CRUD（mock/real 切换）
├── mock/
│   ├── modules/print.ts              # mock 数据
│   └── services/print.ts             # mock 服务
├── views/
│   └── system/
│       └── print-template/
│           ├── index.vue             # 模板列表页（管理入口）
│           └── designer/
│               └── index.vue         # 设计器主页面（路由独立全屏）
├── components/
│   └── print-designer/
│       ├── Designer.vue              # 设计器外壳（三栏布局）
│       ├── Canvas.vue                # 中央画布（纸张 + 标尺 + 网格）
│       ├── panels/
│       │   ├── ElementPanel.vue      # 左：元素物料库
│       │   ├── PropertyPanel.vue     # 右：属性配置
│       │   ├── DataSourcePanel.vue   # 右：数据源/字段树
│       │   └── LayerPanel.vue        # 右：图层/大纲
│       ├── elements/                 # 各类可拖拽元素组件
│       │   ├── TextElement.vue
│       │   ├── FieldElement.vue      # 数据字段（绑定 {{ }}）
│       │   ├── TableElement.vue      # 明细表格（核心）
│       │   ├── ImageElement.vue
│       │   ├── BarcodeElement.vue
│       │   ├── QRCodeElement.vue
│       │   ├── LineElement.vue
│       │   ├── RectElement.vue
│       │   └── HtmlElement.vue       # 富文本/自由 HTML
│       └── widgets/
│           ├── Ruler.vue             # 标尺
│           ├── Toolbar.vue           # 顶部工具栏
│           └── ContextMenu.vue       # 右键菜单
└── print/                            # 与设计器解耦的运行时
    ├── renderer/
    │   ├── PrintRenderer.vue         # 模板 + 数据 → 可打印 DOM
    │   ├── paginate.ts               # 分页算法（表格跨页/表头重复）
    │   └── expression.ts             # 表达式/格式化求值
    ├── adapters/
    │   ├── browser.ts                # window.print
    │   ├── pdf.ts                    # 前端 PDF 导出
    │   ├── dotmatrix.ts              # 针式套打（mm 定位 + ESC/P 可选）
    │   └── server.ts                 # 后端批量打印任务
    ├── PrintService.ts               # 对外统一入口
    └── usePrint.ts                   # 业务页用的组合式 API
```

设计原则：`src/print/` 是运行时，可被任意业务页按需 `import`，不依赖 `components/print-designer/`（设计器）。设计器依赖运行时（用于实时预览），反之不成立。

---

## 4. 模板数据模型（Template Schema）

模板是整个系统的契约核心。以下为 TypeScript 定义，将放在 `src/api/print.ts`。

```typescript
/** 单位统一用毫米(mm)，渲染时按 DPI 换算为 px */
export interface PrintTemplate {
  id: string
  /** 业务唯一键，业务页通过它取模板，如 'scm.purchase.order' */
  templateKey: string
  name: string
  /** 适用模块，用于列表筛选 */
  module: string
  /** 模板分类 */
  category: 'document' | 'label' | 'report' | 'certificate'
  version: number
  status: 'draft' | 'published'
  page: PageConfig
  /** 页面元素（绝对定位） */
  elements: PrintElement[]
  /** 数据源定义（字段元数据，供设计期字段树展示） */
  dataSource: DataSourceDef
  createdAt: string
  updatedAt: string
  /** 谁能编辑：admin=仅管理员设计，user=业务用户可调 */
  editScope: 'admin' | 'user'
}

export interface PageConfig {
  /** 预设纸张或自定义 */
  paper: 'A4' | 'A5' | 'A6' | 'B5' | 'letter' | 'custom'
  width: number // mm
  height: number // mm
  orientation: 'portrait' | 'landscape'
  margin: { top: number; right: number; bottom: number; left: number } // mm
  /** 页眉/页脚配置（高度为 0 表示不启用该区） */
  header: PageBand
  footer: PageBand
  /** 是否连续纸（针式），连续纸不强制分页高度 */
  continuous: boolean
  /** 背景图（套打底纹对齐用），dataURL 或 url */
  background?: string
  /** 设计期网格大小 mm，0=关闭 */
  grid: number
  /** 网格是否吸附 */
  snapToGrid: boolean
}

/** 页眉/页脚区域：只定义高度与重复策略，内容是 region 为 header/footer 的元素 */
export interface PageBand {
  /** 区高度 mm，0 = 不启用 */
  height: number
  /**
   * 出现位置：
   *  every       - 每页都出现（公司抬头、页码）
   *  first       - 仅首页（单据主信息抬头）
   *  last        - 仅末页（合计、签字栏）
   *  exceptFirst - 除首页外每页（首页大抬头，后续页小抬头）
   */
  repeat: 'every' | 'first' | 'last' | 'exceptFirst'
}
```

> 页眉/页脚的**内容**是 `region: 'header' | 'footer'` 的普通元素（见 §4.1）——可放文本、字段、页码、Logo、线条。`PageBand` 只定义这块区域的**高度和重复策略**。正文可用高度 = 页高 − 上下边距 − 页眉高 − 页脚高，分页算法（§5.3）据此切页。

### 4.1 元素模型

```typescript
export type ElementType =
  | 'text' // 静态文本
  | 'field' // 数据字段（绑定表达式）
  | 'table' // 明细表格
  | 'image' // 图片（静态或绑定）
  | 'barcode' // 一维码
  | 'qrcode' // 二维码
  | 'line' // 直线
  | 'rect' // 矩形/边框
  | 'html' // 富文本/自由 HTML

/** 所有元素的公共字段 */
export interface BaseElement {
  id: string
  type: ElementType
  /** 绝对定位，单位 mm，相对页面左上角（含边距内坐标系） */
  rect: { x: number; y: number; w: number; h: number }
  /** 层级 */
  zIndex: number
  /** 是否锁定（设计期不可选中拖动） */
  locked?: boolean
  /** 是否在该页眉/页脚/正文区，决定分页行为 */
  region: 'header' | 'body' | 'footer'
  /** 条件显示表达式，如 "{{ data.status === 'paid' }}" */
  visibleIf?: string
  style: ElementStyle
}

export interface ElementStyle {
  fontFamily?: string
  fontSize?: number // pt
  fontWeight?: 'normal' | 'bold'
  fontStyle?: 'normal' | 'italic'
  color?: string
  background?: string
  textAlign?: 'left' | 'center' | 'right' | 'justify'
  verticalAlign?: 'top' | 'middle' | 'bottom'
  lineHeight?: number
  letterSpacing?: number
  border?: BorderStyle
  padding?: { top: number; right: number; bottom: number; left: number }
  /** 文本溢出处理 */
  overflow?: 'visible' | 'ellipsis' | 'shrink'
}

export interface BorderStyle {
  top?: BorderEdge
  right?: BorderEdge
  bottom?: BorderEdge
  left?: BorderEdge
}
export interface BorderEdge {
  width: number
  style: 'solid' | 'dashed' | 'dotted'
  color: string
}

/** 文本元素 */
export interface TextElement extends BaseElement {
  type: 'text'
  content: string
}

/** 字段元素：内容为表达式，支持格式化 */
export interface FieldElement extends BaseElement {
  type: 'field'
  /** 绑定表达式，如 "{{ data.supplierName }}" 或 "{{ data.amount }}" */
  expression: string
  /** 格式化器 */
  format?: FieldFormat
}

export interface FieldFormat {
  kind: 'none' | 'number' | 'currency' | 'date' | 'datetime' | 'percent' | 'custom'
  /** 数字小数位 */
  decimals?: number
  /** 千分位 */
  thousands?: boolean
  /** 日期格式如 'YYYY-MM-DD' */
  pattern?: string
  /** 自定义格式函数名（注册在 formatter registry） */
  fn?: string
  prefix?: string
  suffix?: string
}
```

### 4.2 表格元素（核心，决定分页能力）

表格是单据打印的核心，也是开源插件做得最差的地方。明细行数不定 → 必须支持跨页、表头重复、表尾合计。

```typescript
export interface TableElement extends BaseElement {
  type: 'table'
  /** 明细数据来源表达式，求值结果须为数组，如 "{{ data.items }}" */
  dataKey: string
  columns: TableColumn[]
  /** 表头是否在每页重复 */
  repeatHeader: boolean
  /** 合计行配置 */
  summary?: TableSummary
  /** 行高 mm，auto 为按内容自适应 */
  rowHeight: number | 'auto'
  /** 斑马纹 */
  stripe?: boolean
  /** 最小行数（不足时补空行，套打用） */
  minRows?: number
  headerStyle?: ElementStyle
  cellStyle?: ElementStyle
}

export interface TableColumn {
  id: string
  title: string
  /** 单元格表达式，行上下文为 row，如 "{{ row.materialName }}" */
  expression: string
  width: number // mm
  align?: 'left' | 'center' | 'right'
  format?: FieldFormat
  /** 合并相同值的相邻单元格（如同一物料分组） */
  mergeSame?: boolean
}

export interface TableSummary {
  /** 合计行标签，放在第一列或指定列 */
  label: string
  labelColumnId: string
  /** 需要合计的列及方式 */
  items: Array<{ columnId: string; agg: 'sum' | 'avg' | 'count' | 'max' | 'min' }>
}
```

### 4.3 条码 / 二维码元素

```typescript
export interface BarcodeElement extends BaseElement {
  type: 'barcode'
  expression: string // 编码内容
  symbology: 'CODE128' | 'CODE39' | 'EAN13' | 'ITF14'
  showText: boolean
}

export interface QRCodeElement extends BaseElement {
  type: 'qrcode'
  expression: string
  level: 'L' | 'M' | 'Q' | 'H' // 容错级别
}
```

### 4.4 数据源定义

设计期需要一个"字段树"让用户拖拽，所以模板要保存数据结构元信息（不是真实数据）。

```typescript
export interface DataSourceDef {
  /** 主数据字段（表头/单据级） */
  fields: FieldMeta[]
  /** 明细数据集（可多个：主表 + 子表） */
  datasets: Array<{
    key: string // 对应 data.items
    label: string
    fields: FieldMeta[]
  }>
}

export interface FieldMeta {
  key: string // data.supplierName
  label: string // 供应商名称
  type: 'string' | 'number' | 'date' | 'boolean'
  /** 预览用的示例值 */
  sample?: unknown
}
```

业务调用时传入的运行时数据结构：

```typescript
export interface PrintData {
  /** 单据级数据 */
  [key: string]: unknown
  /** 约定：明细放在数组字段里，如 items */
}
```

---

## 5. 渲染引擎与分页（技术核心）

### 5.1 坐标与单位

- 模板存储统一用 **mm**（与物理纸张、套打对齐天然一致）。
- 渲染到屏幕/打印时换算为 px：`px = mm / 25.4 * DPI`。屏幕预览用 96 DPI，打印交给浏览器。
- CSS 直接用 `mm` 单位输出（`width: 210mm`），浏览器打印会按物理尺寸精确还原，避免 DPI 误差。这是比"算 px"更稳的做法。

```css
@page {
  size: 210mm 297mm; /* 由 PageConfig 生成 */
  margin: 0;
}
.print-page {
  width: 210mm;
  height: 297mm;
  position: relative;
  box-sizing: border-box;
  page-break-after: always;
}
.print-element {
  position: absolute; /* 绝对定位，left/top/width/height 全用 mm */
}
```

### 5.2 表达式求值（expression.ts）

模板里的 `{{ ... }}` 需要安全求值。**不要用 `eval` / `new Function` 直接跑用户表达式**（XSS/注入风险，尤其后端渲染时）。

方案：受限表达式求值器。

```typescript
// src/print/renderer/expression.ts
interface EvalContext {
  data: PrintData // 单据数据
  row?: Record<string, unknown> // 表格行上下文
  index?: number // 行号
  page?: { current: number; total: number }
  sys?: { now: Date; user: string } // 系统变量
}

/**
 * 求值 {{ expr }}。支持：
 *  - 字段访问：data.supplierName, row.qty
 *  - 内置函数白名单：sum, formatDate, upper, lower, ...
 *  - 三元/比较运算（用于 visibleIf）
 * 实现：用一个小型解析器（如 jsep）解析为 AST，再受限求值，
 *      只允许成员访问 + 白名单函数 + 基本运算符。
 */
export function evaluate(expr: string, ctx: EvalContext): unknown
export function interpolate(template: string, ctx: EvalContext): string // 处理整段含多个 {{ }}
```

> 依赖建议：引入 `jsep`（~5KB，无依赖）做表达式解析，自己写 AST 求值器控制白名单。比裸 `new Function` 安全得多，也比完整 JS 引擎轻。

### 5.3 分页算法（paginate.ts）

这是替代开源插件的最大价值点。流程：

```
输入：template + data
1. 计算正文可用高度 = page.height - margin.top - margin.bottom - header高 - footer高
2. 固定定位元素（非表格）直接放入对应 region
3. 对每个 table 元素：
   a. 求值 dataKey 得到行数组
   b. 逐行测量高度（rowHeight=auto 时离屏测量真实 DOM）
   c. 累加行高，超过可用高度则切页：
      - 新页重绘 header 区元素（若 repeatHeader）
      - 表头重复
   d. 最后一页追加 summary 合计行
4. 输出 Page[]，每页是一组定位好的元素
5. 页码变量 {{ page.current }} / {{ page.total }} 二次回填
```

```typescript
export interface RenderedPage {
  index: number
  elements: PositionedElement[] // 已求值、已定位
}

export function paginate(template: PrintTemplate, data: PrintData): RenderedPage[]
```

关键难点处理：

- **auto 行高**：先离屏渲染（`visibility:hidden` 容器）测量真实高度，再决定切页。这是 DOM 渲染相对 canvas 方案的优势——文字换行天然准确。
- **表格跨页时合计行**：只在最后一页；中间页可选"接上页/转下页"小计。
- **连续纸（continuous=true）**：不强制分页，整单一页输出，针式打印机走纸。

### 5.4 渲染组件

```vue
<!-- src/print/renderer/PrintRenderer.vue -->
<template>
  <div class="print-root">
    <div v-for="page in pages" :key="page.index" class="print-page" :style="pageStyle">
      <component :is="resolveElement(el.type)" v-for="el in page.elements" :key="el.id" :element="el" :ctx="el.__ctx" />
    </div>
  </div>
</template>
```

每种元素类型对应一个纯展示组件（`elements/` 下的设计期组件可与运行时复用 render 逻辑，但运行时组件不含拖拽/选中交互，保持轻量）。

---

## 6. 输出适配器（四种全覆盖）

统一接口：

```typescript
// src/print/PrintService.ts
export interface PrintOptions {
  templateKey: string
  data: PrintData | PrintData[]   // 单条或批量
  output: 'browser' | 'pdf' | 'dotmatrix' | 'server'
  /** pdf/dotmatrix 文件名 */
  filename?: string
}

export const PrintService = {
  /** 业务页唯一入口 */
  async print(options: PrintOptions): Promise<void>,
  /** 仅渲染为 HTML（预览用） */
  async renderHtml(templateKey: string, data: PrintData): Promise<string>,
}
```

### 6.1 浏览器原生打印（browser.ts）

```
渲染 → 注入隐藏 iframe → iframe.contentWindow.print()
```

用 iframe 而非新窗口/直接打印当前页，避免污染主文档样式、避免被弹窗拦截。`@page` 规则写入 iframe。

### 6.2 PDF 导出（pdf.ts）

两条路线，按精度需求选：

| 路线       | 说明                                           | 适用                       |
| ---------- | ---------------------------------------------- | -------------------------- |
| 浏览器原生 | iframe + `print()`，用户选"另存为 PDF"         | 简单、零依赖、保真度最高   |
| 库生成     | `html2canvas` + `jsPDF`，或 `pdf-lib` 矢量绘制 | 需自动落盘、批量、邮件附件 |

建议：**默认走浏览器原生**（保真 + 零体积）；需要"无人值守自动生成文件"时才上 `jsPDF`。矢量清晰度要求高的（如证书）用 `pdf-lib` 直接画。这部分做成可插拔，按需动态 import，不进主包。

### 6.3 针式 / 连续纸套打（dotmatrix.ts）

两种模式：

1. **图形模式**：和普通打印一样走浏览器，靠 `PageConfig.background` 套打底纹 + mm 精确定位对齐预印刷表单。设计器提供"上传底纹图 + 半透明叠加"功能校准位置。
2. **ESC/P 文本模式**（可选，高级）：针对老式针式打印机直连，生成 ESC/P 指令流，由后端或浏览器插件下发。本期先做图形模式，ESC/P 预留适配器接口。

针式关键点：`continuous: true` + `minRows` 补空行 + 行高固定（行打）。

### 6.4 后端批量打印（server.ts）

```
前端只传 templateKey + 数据集 ID 列表 → 后端用同一套 Schema 渲染 → 生成 PDF/直发打印机
```

```typescript
// 前端只是发起任务
export async function serverPrint(templateKey: string, dataIds: string[]): Promise<{ taskId: string }>
```

后端需实现等价的渲染器（Node 端可用 puppeteer 跑同一份 `PrintRenderer`，或用模板引擎复刻分页逻辑）。**Schema 跨端共享是关键**——前后端渲染同一份 JSON，保证一致。本期前端先出接口契约 + mock，后端按 Schema 实现。

---

## 7. 设计器交互（兼顾管理员与业务用户）

### 7.1 三栏布局

```
┌──────────────────────────────────────────────────────────┐
│ Toolbar: 保存 预览 撤销/重做 缩放 对齐 纸张设置 输出测试       │
├──────────┬─────────────────────────────────┬──────────────┤
│ 左栏      │          中央画布                 │   右栏        │
│ 元素物料库 │   ┌─────────────────────┐        │  属性面板      │
│ ·文本     │   │  标尺                 │        │ (随选中元素切换) │
│ ·字段     │   │ ┌─────────────────┐  │        │              │
│ ·表格     │   │ │   纸张(mm)+网格    │  │        │  数据源面板    │
│ ·图片     │   │ │   绝对定位元素      │  │        │ (字段树拖拽)   │
│ ·条码     │   │ └─────────────────┘  │        │              │
│ ·二维码    │   └─────────────────────┘        │  图层面板      │
│ ·线/框    │                                  │              │
└──────────┴─────────────────────────────────┴──────────────┘
```

### 7.2 双模式（这是"兼顾"的落地方式）

模板的 `editScope` 字段 + 当前用户角色，决定设计器开放程度：

| 模式         | 触发                        | 能力                                                                                         |
| ------------ | --------------------------- | -------------------------------------------------------------------------------------------- |
| **专业模式** | 管理员 / `editScope=admin`  | 全功能：新增/删除元素、改布局、配数据源、表达式、分页设置                                    |
| **轻量模式** | 业务用户 / `editScope=user` | 只能改文本内容、字段显隐、字号、挪位置；不能删元素、不能改数据绑定。物料库与高级属性面板隐藏 |

两种模式共用同一套组件，通过 `mode` prop + 权限位控制功能可见性。轻量模式下属性面板只渲染白名单字段。

### 7.3 关键交互（拖拽用 vue-draggable-plus，项目已装）

- **拖入**：从左栏拖元素到画布 → 在落点创建元素
- **拖字段**：从右栏字段树拖到画布 → 创建已绑定的 `field` 元素
- **选中/多选**：点选、框选、Shift 加选
- **移动/缩放**：拖动 + 八向缩放手柄，按住吸附网格（`grid` mm）
- **对齐**：多选后左/右/顶/底/居中对齐、等间距分布
- **快捷键**：方向键微移、Ctrl+C/V、Ctrl+Z/Y、Delete
- **辅助线**：拖动时显示与其他元素的对齐参考线（magnetic guides）
- **缩放**：画布 50%~200% 缩放查看

### 7.4 撤销/重做

用命令栈记录元素增删改。状态存 Pinia store（见 §8），每次变更 push 一个 snapshot（或 diff）。限制栈深 50。

---

## 8. 状态管理（Pinia）

```typescript
// src/stores/printDesigner.ts
export const usePrintDesignerStore = defineStore('printDesigner', () => {
  const template = ref<PrintTemplate | null>(null)
  const selectedIds = ref<string[]>([])
  const mode = ref<'pro' | 'lite'>('pro')
  const zoom = ref(1)
  const history = reactive<{ stack: string[]; cursor: number }>({ stack: [], cursor: -1 })

  // 元素操作
  function addElement(el: PrintElement): void
  function updateElement(id: string, patch: Partial<PrintElement>): void
  function removeElements(ids: string[]): void
  function selectElements(ids: string[]): void

  // 历史
  function commit(): void   // 当前状态入栈
  function undo(): void
  function redo(): void

  // 计算
  const selectedElements = computed(() => ...)

  return { template, selectedIds, mode, zoom, addElement, updateElement,
           removeElements, selectElements, undo, redo, selectedElements }
})
```

> 遵循项目 store 约定（`src/stores/constraint.ts` 同款 setup 写法）。

---

## 9. API 层（遵循项目 mock/real 切换约定）

完全对齐 `src/api/qms.ts` 的写法：`isMockMode ? mockService : http`。

```typescript
// src/api/print.ts
import { isMockMode } from './_config'
import { apiDelete, apiGet, apiPost, apiPut, type ApiResponse, type PaginatedData } from './_factory'
import * as mockService from '@/mock/services/print'

// ... PrintTemplate 等类型定义见 §4 ...

export function getPrintTemplateList(params: { pageNum: number; pageSize: number; module?: string; category?: string; keyword?: string }) {
  if (isMockMode) return mockService.getPrintTemplateList(params) as Promise<ApiResponse<PaginatedData<PrintTemplate>>>
  return apiGet<PaginatedData<PrintTemplate>>('/print/templates', { params })
}

export function getPrintTemplate(id: string) {
  if (isMockMode) return mockService.getPrintTemplate(id)
  return apiGet<PrintTemplate>(`/print/templates/${id}`)
}

/** 业务页按 templateKey 取已发布模板 */
export function getPublishedTemplate(templateKey: string) {
  if (isMockMode) return mockService.getPublishedTemplate(templateKey)
  return apiGet<PrintTemplate>(`/print/templates/by-key/${templateKey}`)
}

export function createPrintTemplate(data: Partial<PrintTemplate>) {
  if (isMockMode) return mockService.createPrintTemplate(data)
  return apiPost<PrintTemplate, Partial<PrintTemplate>>('/print/templates', data)
}

export function updatePrintTemplate(id: string, data: Partial<PrintTemplate>) {
  if (isMockMode) return mockService.updatePrintTemplate(id, data)
  return apiPut<PrintTemplate, Partial<PrintTemplate>>(`/print/templates/${id}`, data)
}

export function deletePrintTemplate(id: string) {
  if (isMockMode) return mockService.deletePrintTemplate(id)
  return apiDelete<Record<string, never>>(`/print/templates/${id}`)
}

/** 发起后端批量打印任务 */
export function createServerPrintJob(data: { templateKey: string; dataIds: string[] }) {
  if (isMockMode) return mockService.createServerPrintJob(data)
  return apiPost<{ taskId: string }, typeof data>('/print/jobs', data)
}
```

mock 层在 `src/mock/modules/print.ts`（种子模板）+ `src/mock/services/print.ts`（用 `paginate`/`searchItems`/`wrap*Response` 等 shared 工具），与 `src/mock/services/qms.ts` 同构。

---

## 10. 业务页接入方式

业务页接入要极简——一行调用。

```typescript
// src/print/usePrint.ts
export function usePrint() {
  async function print(opts: PrintOptions) {
    return PrintService.print(opts)
  }
  return { print }
}
```

业务页用法（以采购单为例）：

```vue
<script setup lang="ts">
import { usePrint } from '@/print/usePrint'
const { print } = usePrint()

async function onPrint(row: PurchaseOrder) {
  await print({
    templateKey: 'scm.purchase.order',
    data: row, // 单据数据，结构匹配模板 dataSource
    output: 'browser'
  })
}
</script>

<template>
  <gi-button type="default" @click="onPrint(row)">打印</gi-button>
</template>
```

批量打印：`data: selectedRows`（数组）→ 适配器循环分页拼成多页文档。

数据结构契约：业务方传入的 `data` 字段路径需与模板 `dataSource.fields[].key` 一致。约定明细数组字段名（如 `items`）。建议每个业务单据提供一个 `toPrintData(row)` 映射函数，隔离打印结构与业务模型。

---

## 11. 模板管理页

`src/views/system/print-template/index.vue`——标准列表页，完全复用 `useTable` + `SearchSetting` + `TableSetting` + `gi-*`（照搬 `qms/template/index.vue` 模式）。

- 搜索：模块、分类、关键字
- 列：名称、templateKey、模块、分类、版本、状态、更新时间、操作
- 操作：设计（跳设计器全屏路由）、复制、发布/下线、删除、打印测试
- 新增：选分类 + 纸张 → 进设计器

路由（挂在 system 下，参考 §router 约定）：

```typescript
{
  path: 'print-template',
  name: 'printTemplate',
  component: () => import('@/views/system/print-template/index.vue'),
  meta: { title: '打印模板', icon: 'Printer', order: 9 }
},
{
  path: 'print-template/designer/:id',
  name: 'printTemplateDesigner',
  component: () => import('@/views/system/print-template/designer/index.vue'),
  meta: { title: '打印设计器', hidden: true }  // 全屏，不在菜单
}
```

---

## 12. 依赖评估

按需引入，全部可动态 import，不进主包：

| 依赖                 | 用途       | 体积   | 备注                       |
| -------------------- | ---------- | ------ | -------------------------- |
| `jsep`               | 表达式解析 | ~5KB   | 必需，安全求值基础         |
| `jsbarcode`          | 一维码     | ~30KB  | barcode 元素用，懒加载     |
| `qrcode`             | 二维码     | ~20KB  | qrcode 元素用，懒加载      |
| `jspdf`              | PDF 生成   | ~350KB | 仅"自动落盘 PDF"场景懒加载 |
| `html2canvas`        | DOM 转图   | ~200KB | 配合 jsPDF，懒加载         |
| `vue-draggable-plus` | 拖拽       | 已装   | 复用                       |

已有的 `vxe-table` 不直接用于打印渲染（它是交互表格，打印需要自绘 mm 定位表格），但设计器内的属性配置列表可以用。

> 结论：核心运行时只强依赖 `jsep` + 条码/二维码库，都很小。PDF 重型库严格懒加载。

---

## 13. 开发计划（分阶段，可独立验收）

### Phase 1 — 数据契约与运行时骨架（地基）

- [ ] `src/api/print.ts` 类型定义 + 接口（§4、§9）
- [ ] `src/mock/modules/print.ts` + `services/print.ts`，2~3 个种子模板
- [ ] `src/print/renderer/expression.ts` 表达式求值 + 单测
- [ ] `src/print/renderer/PrintRenderer.vue` 基础渲染（无分页，固定元素）
- [ ] 验收：给定模板 JSON + 数据，能在页面渲染出静态单据

### Phase 2 — 分页与浏览器打印（最高价值）

- [ ] `paginate.ts` 分页算法 + 表格跨页 + 表头重复 + 合计行 + 单测
- [ ] `adapters/browser.ts` iframe 打印
- [ ] `PrintService` + `usePrint`
- [ ] 接入 1 个真实业务页（如采购单）跑通端到端
- [ ] 验收：明细 100 行的采购单能正确跨页打印

### Phase 3 — 设计器（专业模式）

- [ ] 三栏布局 + Pinia store + 撤销重做
- [ ] 画布：标尺、网格、绝对定位、拖拽、缩放、对齐辅助线
- [ ] 元素：text/field/table/image/line/rect 的设计期组件 + 属性面板
- [ ] 数据源字段树拖拽绑定
- [ ] 保存/预览
- [ ] 验收：能从零拖出一张采购单模板并保存打印

### Phase 4 — 全元素与多输出

- [ ] barcode / qrcode / html 元素
- [ ] PDF 导出适配器（懒加载）
- [ ] 针式套打：底纹上传 + 半透明对齐 + 连续纸 + 补空行
- [ ] 后端批量打印接口契约 + mock 任务
- [ ] 验收：四类输出全部可演示

### Phase 5 — 轻量模式与打磨

- [ ] 业务用户轻量模式（白名单属性）
- [ ] 模板版本管理、复制、发布/下线
- [ ] 字体/字号/分页边界等细节打磨
- [ ] 各业务模块 `toPrintData` 映射 + 模板铺开

---

## 14. 风险与权衡

| 风险                                    | 应对                                                                        |
| --------------------------------------- | --------------------------------------------------------------------------- |
| auto 行高测量性能（大数据量离屏渲染慢） | 固定行高优先；auto 仅对必要列；测量结果缓存；超大数据走后端                 |
| 浏览器打印分页与预览不一致              | 统一用 mm + `@page`，预览即打印视图；提供"打印预览"按钮走真实 print preview |
| 前后端渲染一致性                        | Schema 唯一真相；后端用 puppeteer 跑同一 Vue 渲染器，而非另写一套           |
| 表达式安全                              | 禁用 `eval`/`new Function`，jsep + 白名单 AST 求值                          |
| 套打对齐繁琐                            | 底纹叠加 + mm 微调 + 方向键 0.5mm 步进                                      |
| 模板 Schema 演进                        | `version` 字段 + 迁移函数，旧模板加载时升级                                 |

---

## 15. 与开源方案的关键差异（为什么这套更好）

| 维度     | hiprint 等      | 本方案                                   |
| -------- | --------------- | ---------------------------------------- |
| 技术栈   | jQuery          | 原生 Vue 3 + Pinia 响应式                |
| 渲染     | canvas/绝对 px  | mm + CSS `@page`，物理尺寸精确           |
| 表格分页 | 弱/手动         | 自动跨页、表头重复、合计行               |
| 表达式   | 字符串拼接/eval | jsep 白名单安全求值                      |
| 输出     | 主要浏览器      | 浏览器/PDF/针式/后端 四合一，同一 Schema |
| 数据层   | 自成一套        | 复用项目 api/mock/useTable 约定          |
| 权限     | 无              | 专业/轻量双模式 + editScope              |
| 维护     | 黑盒二开        | 全自研，结构清晰可演进                   |

---

## 16. 核心编辑能力详述

本节针对几项重点能力补充设计细节：在线预览、网格画布、页眉页脚、纸张大小、方向、排版。

### 16.1 在线预览

预览是设计器与渲染引擎的交汇点——**预览即打印视图**，所见即所得，避免开源插件"设计一套、打印另一套"的错位。

三种预览入口：

| 入口               | 说明                                                  | 数据来源                              |
| ------------------ | ----------------------------------------------------- | ------------------------------------- |
| 设计期实时预览     | 画布右侧"预览"页签，复用 `PrintRenderer` 渲染当前模板 | `dataSource.fields[].sample` 示例数据 |
| 模板列表"打印测试" | 弹窗预览，可切换不同示例数据集                        | mock 示例数据                         |
| 业务页打印前预览   | `output: 'browser'` 时浏览器原生 print preview        | 真实业务数据                          |

实现：

```typescript
// 预览组件直接喂模板 + 示例数据，走与正式打印完全相同的分页与渲染
<PrintRenderer :template="store.template" :data="previewData" />
```

要点：

- 预览用真实分页（调 `paginate`），翻页查看多页效果，显示"第 N / 共 M 页"。
- 预览缩放与画布缩放独立。
- 预览面板提供"切换示例数据"——空数据、单行、超长多页三套，验证分页边界。
- 设计期改动 → 预览面板防抖（300ms）重渲染，避免大模板卡顿。

### 16.2 网格画布

画布是 mm 坐标系的可视化承载，网格用于对齐和吸附。

```
┌── Ruler(水平标尺, mm 刻度) ──────────────┐
│ R ┌─────────────────────────────────┐  │
│ u │                                  │  │
│ l │     纸张区(白底) + 网格点/线        │  │
│ e │     ┌──────┐                     │  │
│ r │     │ 元素  │ ← 拖动时吸附网格      │  │
│ ↕ │     └──────┘                     │  │
│   └─────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

- **网格**：`PageConfig.grid`（mm）控制网格间距，0 关闭。用 CSS `background` 重复渐变画网格点/线，不产生 DOM 节点（性能）。
- **吸附**：`snapToGrid=true` 时，拖动/缩放元素坐标按 `Math.round(v / grid) * grid` 对齐。
- **标尺**：水平/垂直标尺显示 mm 刻度，随缩放联动；鼠标位置在标尺上有指示线。
- **辅助线**：拖动时检测与其他元素的边/中心对齐，显示磁吸参考线（与网格吸附互补）。
- **缩放**：50%~200%，画布用 CSS `transform: scale()`，坐标计算时除以缩放比还原 mm。

### 16.3 页眉页脚

数据模型见 §4 的 `PageBand`。设计与渲染要点：

- **设计期**：画布上用两条分隔线把页面切成「页眉 / 正文 / 页脚」三个可视区域，拖入的元素按落点自动归属 `region`。拖动页眉/页脚分隔线即调整 `header.height` / `footer.height`。
- **重复策略**：`repeat` 控制每页/首页/末页/除首页出现，满足常见场景：
  - 公司抬头 + 页码 → `every`
  - 单据主信息（供应商、单号、大标题）→ `first`
  - 合计、签字栏、盖章区 → `last`
  - 简化的续页抬头 → `exceptFirst`
- **页码变量**：页脚里放 `{{ page.current }} / {{ page.total }}`，分页完成后二次回填（见 §5.3）。
- **正文区**：表格跨页时，正文高度受页眉页脚挤压，分页算法据实际 band 高度计算可用空间。

### 16.4 纸张大小

`PageConfig.paper` 预设 + `custom` 自定义，预设选中即回填 width/height（mm）：

| 预设   | 宽 × 高 (mm, 纵向) |
| ------ | ------------------ |
| A4     | 210 × 297          |
| A5     | 148 × 210          |
| A6     | 105 × 148          |
| B5     | 176 × 250          |
| letter | 216 × 279          |
| custom | 用户输入           |

- 选 `custom` 时显示宽/高输入框（mm）。
- 针式连续纸常用尺寸（如 241×140 二等分、241×93 三等分）做成 `custom` 快捷预设按钮。
- 纸张设置面板放在顶部工具栏的"纸张设置"弹窗，含纸张、方向、边距、页眉页脚高度、连续纸开关、网格一站式配置。
- 输出 CSS：`@page { size: <width>mm <height>mm; }`，浏览器据此精确出纸。

### 16.5 方向

`orientation: 'portrait' | 'landscape'`。

- 切换方向时**交换** width/height（210×297 ⇄ 297×210）。
- 已布局的元素：弹窗提示"切换方向可能需要重新排版"，不自动缩放元素（避免破坏精心定位），由用户调整或用排版工具批量对齐。
- `@page size` 同步输出新方向尺寸。

### 16.6 排版

排版工具解决"多元素对齐、分布、统一尺寸"，是专业模式效率核心。多选后工具栏/右键菜单提供：

| 分类     | 操作                                                             |
| -------- | ---------------------------------------------------------------- |
| 对齐     | 左对齐、右对齐、顶对齐、底对齐、水平居中、垂直居中               |
| 分布     | 水平等间距、垂直等间距                                           |
| 尺寸     | 等宽、等高、等尺寸                                               |
| 层级     | 置顶、置底、上移一层、下移一层（改 `zIndex`）                    |
| 页面对齐 | 相对页面水平/垂直居中                                            |
| 微调     | 方向键 1 格（吸附时按 grid，否则 0.5mm），Shift+方向键 10 倍步进 |
| 锁定     | 锁定/解锁元素（`locked`），锁定后不可选中拖动                    |

实现：对齐/分布是对选中元素 `rect` 的纯计算（取基准 → 改 x/y/w/h），改完 `commit()` 入撤销栈。所有操作走 §8 store 的 `updateElement`，预览实时反映。

## 附录 A：示例模板（采购单，精简）

```json
{
  "templateKey": "scm.purchase.order",
  "name": "采购订单",
  "module": "scm",
  "category": "document",
  "page": {
    "paper": "A4",
    "width": 210,
    "height": 297,
    "orientation": "portrait",
    "margin": { "top": 15, "right": 15, "bottom": 15, "left": 15 },
    "header": { "height": 30, "repeat": "every" },
    "footer": { "height": 12, "repeat": "every" },
    "continuous": false,
    "grid": 1,
    "snapToGrid": true
  },
  "elements": [
    {
      "id": "t1",
      "type": "text",
      "region": "header",
      "rect": { "x": 0, "y": 0, "w": 180, "h": 12 },
      "content": "采购订单",
      "zIndex": 1,
      "style": { "fontSize": 18, "fontWeight": "bold", "textAlign": "center" }
    },
    {
      "id": "f1",
      "type": "field",
      "region": "header",
      "rect": { "x": 0, "y": 16, "w": 90, "h": 6 },
      "expression": "供应商：{{ data.supplierName }}",
      "zIndex": 1,
      "style": { "fontSize": 10 }
    },
    {
      "id": "f2",
      "type": "field",
      "region": "header",
      "rect": { "x": 0, "y": 23, "w": 90, "h": 6 },
      "expression": "单号：{{ data.orderNo }}",
      "zIndex": 1,
      "style": { "fontSize": 10 }
    },
    {
      "id": "tb1",
      "type": "table",
      "region": "body",
      "rect": { "x": 0, "y": 32, "w": 180, "h": 100 },
      "dataKey": "{{ data.items }}",
      "repeatHeader": true,
      "rowHeight": "auto",
      "columns": [
        { "id": "c1", "title": "物料", "expression": "{{ row.materialName }}", "width": 70 },
        { "id": "c2", "title": "数量", "expression": "{{ row.qty }}", "width": 30, "align": "right" },
        {
          "id": "c3",
          "title": "单价",
          "expression": "{{ row.price }}",
          "width": 40,
          "align": "right",
          "format": { "kind": "currency", "decimals": 2 }
        },
        {
          "id": "c4",
          "title": "金额",
          "expression": "{{ row.amount }}",
          "width": 40,
          "align": "right",
          "format": { "kind": "currency", "decimals": 2 }
        }
      ],
      "summary": { "label": "合计", "labelColumnId": "c1", "items": [{ "columnId": "c4", "agg": "sum" }] },
      "zIndex": 1,
      "style": {}
    }
  ],
  "dataSource": {
    "fields": [
      { "key": "supplierName", "label": "供应商", "type": "string" },
      { "key": "orderNo", "label": "单号", "type": "string" }
    ],
    "datasets": [
      {
        "key": "items",
        "label": "明细",
        "fields": [
          { "key": "materialName", "label": "物料", "type": "string" },
          { "key": "qty", "label": "数量", "type": "number" },
          { "key": "price", "label": "单价", "type": "number" },
          { "key": "amount", "label": "金额", "type": "number" }
        ]
      }
    ]
  },
  "editScope": "admin",
  "status": "published",
  "version": 1
}
```
