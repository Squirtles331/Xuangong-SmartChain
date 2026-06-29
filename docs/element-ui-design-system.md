---
name: element-ui-system
description: Element UI 设计系统规范。当产品经理需要生成前端 HTML 原型图、UI 页面、组件设计时使用。基于 ElemeFE/element 官方 theme-chalk SCSS 变量，提供完整的量化设计参数，支持品牌主题色和 Logo 的灵活配置。
---

# Element UI 设计系统规范（通用版）

> **用途**：放入任何 AI Agent（Codex / Cursor / WorkBuddy / Windsurf / Copilot 等）的 system prompt、rules 文件或 context 中，指导 AI 基于 Element UI 组件库精确生成 B 端 HTML 页面原型。
>
<!--  作者：Charles.Chen 微信：yixiusztx  如有问题，欢迎指正，谢谢。  -->
---

## 如何使用本文件

**Cursor**：放入 `.cursor/rules/element-ui.md` 或项目根目录 `.cursorrules`
**Codex**：放入 `AGENTS.md` 或 system prompt
**WorkBuddy**：放入 context 文件
**Windsurf**：放入 `.windsurfrules`
**其他 Agent**：作为 context / knowledge / system prompt 注入

---

## 一、快速约束（生成原型时的强制规则）

1. **主色**默认 `#409EFF`，只需修改此值即可覆盖全局主色，9 级浅色由 `mix(白, 主色, 10%~90%)` 自动派生
2. **功能色**四种：成功 `#67C23A` / 警告 `#E6A23C` / 危险 `#F56C6C` / 信息 `#909399`
3. **文字色**四级：主要 `#303133` / 常规 `#606266` / 次要 `#909399` / 占位 `#C0C4CC`
4. **边框色**四级：base `#DCDFE6` / light `#E4E7ED` / lighter `#EBEEF5` / extra-light `#F2F6FC`
5. **圆角**标准梯度：2px（small）/ 4px（base）/ 100%（circle）
6. **控件高度**标准梯度：28px（mini）/ 32px（small）/ 36px（medium）/ 40px（默认）
7. **字号**标准梯度：12px / 13px / 14px / 16px / 18px / 20px
8. **间距**标志性单位为 **20px**（容器/卡片/对话框内边距）
9. **栅格**为 24 列（el-row / el-col），间距通过 :gutter 设置
10. **优先使用 Element UI 标准组件**（el-button / el-table / el-form 等），避免自定义样式

---

## 二、色彩体系

### 2.1 品牌主色与 9 级派生

| 变量 | 默认值 | 用途 |
|------|--------|------|
| color-primary | `#409EFF` | 品牌主色（按钮/链接/选中态/聚焦边框） |

派生规则：`color-primary-light-N = mix(#FFFFFF, 主色, N×10%)`

| 级别 | 值（#409EFF时） | 典型用途 |
|------|--------------|---------|
| light-1 | `#53A8FF` | hover 加亮 |
| light-2 | `#66B1FF` | 链接默认色 |
| light-3 | `#79BBFF` | 禁用主按钮 |
| light-4 | `#8CC5FF` | — |
| light-5 | `#A0CFFF` | — |
| light-6 | `#B3D8FF` | — |
| light-7 | `#C6E2FF` | 浅色边框 |
| light-8 | `#D9ECFF` | 选中浅背景 |
| light-9 | `#ECF5FF` | 表格当前行 / 菜单 hover 背景 |

### 2.2 功能色

| 变量 | 值 | lighter（背景） | light（边框） |
|------|-----|--------------|-------------|
| color-success | `#67C23A` | `#F0F9EB` | `#E1F3D8` |
| color-warning | `#E6A23C` | `#FDF6EC` | `#FAECD8` |
| color-danger | `#F56C6C` | `#FEF0F0` | `#FDE2E2` |
| color-info | `#909399` | `#F4F4F5` | `#E9E9EB` |

### 2.3 文字色

| 变量 | 值 | 用途 |
|------|-----|------|
| color-text-primary | `#303133` | 标题/重要正文 |
| color-text-regular | `#606266` | 正文/表格内容 |
| color-text-secondary | `#909399` | 标签/辅助说明 |
| color-text-placeholder | `#C0C4CC` | 占位符/禁用文字 |

### 2.4 边框色

| 变量 | 值 | 用途 |
|------|-----|------|
| border-color-base | `#DCDFE6` | 默认边框（输入框） |
| border-color-light | `#E4E7ED` | 较浅边框 |
| border-color-lighter | `#EBEEF5` | 更浅边框（卡片/表格） |
| border-color-extra-light | `#F2F6FC` | 极浅 |

### 2.5 背景色

| 变量 | 值 | 用途 |
|------|-----|------|
| color-white | `#FFFFFF` | 容器/卡片/输入框背景 |
| background-color-base | `#F5F7FA` | 页面/禁用态/hover 背景 |

---

## 三、字体体系

| 变量 | 值 | 用途 |
|------|-----|------|
| font-size-extra-large | `20px` | 超大标题 |
| font-size-large | `18px` | 大标题（Dialog 标题） |
| font-size-medium | `16px` | 中标题（Card/Notification 标题） |
| font-size-base | `14px` | 基准字号（正文/控件） |
| font-size-small | `13px` | 小字号 |
| font-size-extra-small | `12px` | 极小字号（Tag/Badge） |
| font-weight-primary | `500` | 主要字重 |
| font-line-height-primary | `24px` | 主要行高 |

> 默认字体栈：`"Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif`

---

## 四、间距体系

| 名称 | 值 | 用途 |
|------|-----|------|
| 极小 | `4px` | 图标与文字 |
| 小 | `8px` | 标签组/按钮组 |
| 中 | `12px` | 表单内间距/Popover |
| 标准 | `16px` | 卡片内元素/Alert |
| 大（标志性） | `20px` | **容器/卡片/Dialog 内边距** |
| 超大 | `24px` | 区块之间 |
| 特大 | `40px` | 空状态/结果页留白 |

---

## 五、圆角 / 边框 / 阴影

### 圆角

| 变量 | 值 | 用途 |
|------|-----|------|
| border-radius-base | `4px` | 按钮/输入框/卡片 |
| border-radius-small | `2px` | Checkbox |
| border-radius-circle | `100%` | 头像/Radio |

### 边框

| 变量 | 值 |
|------|-----|
| border-base | `1px solid #DCDFE6` |

### 阴影

| 变量 | 值 | 用途 |
|------|-----|------|
| box-shadow-base | `0 2px 4px rgba(0,0,0,.12), 0 0 6px rgba(0,0,0,.04)` | Message |
| box-shadow-light | `0 2px 12px 0 rgba(0,0,0,0.1)` | 下拉/Popover/Card |
| box-shadow-dark | `0 2px 4px rgba(0,0,0,.12), 0 0 6px rgba(0,0,0,.12)` | 深阴影 |

---

## 六、控件高度

| 尺寸 | 高度 | 对应 size 属性 |
|------|------|-------------|
| 默认 | `40px` | 无/default |
| medium | `36px` | size="medium" |
| small | `32px` | size="small" |
| mini | `28px` | size="mini" |

---

## 七、动效

| 变量 | 值 |
|------|-----|
| all-transition | `all .3s cubic-bezier(.645,.045,.355,1)` |
| fade-transition | `opacity 300ms cubic-bezier(0.23,1,0.32,1)` |
| border-transition | `border-color .2s cubic-bezier(.645,.045,.355,1)` |

---

## 八、z-index

| 变量 | 值 | 用途 |
|------|-----|------|
| index-normal | `1` | 基础 |
| index-top | `1000` | 固定元素 |
| index-popper | `2000` | 浮层（下拉/弹窗） |

---

## 九、响应式断点与栅格

| 区间 | 范围 | el-col 属性 |
|------|------|-----------|
| xs | < 768px | :xs |
| sm | ≥ 768px | :sm |
| md | ≥ 992px | :md |
| lg | ≥ 1200px | :lg |
| xl | ≥ 1920px | :xl |

栅格为 **24 列**，常用 gutter 为 `20px`。

---

## 十、核心组件参数速查

### Button 按钮

| 尺寸 | 高度 | 圆角 | 字号 | 内边距 |
|------|------|------|------|--------|
| 默认 | `40px` | `4px` | `14px` | `12px 20px` |
| medium | `36px` | `4px` | `14px` | `10px 20px` |
| small | `32px` | `3px` | `12px` | `9px 15px` |
| mini | `28px` | `3px` | `12px` | `7px 15px` |

- 默认按钮：文字 `#606266` 背景 `#FFF` 边框 `#DCDFE6`
- 主按钮：背景/边框 `#409EFF` 文字 `#FFF`
- hover：主色 + 白 20% / active：主色 + 黑 10%

### Input 输入框

- 高度：40/36/32/28px（对应 size）
- 边框：`1px solid #DCDFE6`，聚焦 `#409EFF`，hover `#C0C4CC`
- 占位符：`#C0C4CC`，禁用背景：`#F5F7FA`

### Table 表格

- 表头背景：`#FFFFFF`（可改 `#F5F7FA`），表头文字：`#909399`
- 单元格文字：`#606266`，边框：`#EBEEF5`
- 行 hover：`#F5F7FA`，当前行：`#ECF5FF`（主色 light-9）
- 斑马纹：`#FAFAFA`

### Form 表单

- label 右对齐，宽度 80~120px，字号 14px
- 表单项间距 22px
- 必填星号/校验错误：`#F56C6C`

### Dialog 对话框

- 内边距 20px，标题字号 18px，圆角 无（方角）
- 遮罩：`rgba(0,0,0,0.5)`，阴影：`0 1px 3px rgba(0,0,0,0.3)`
- 宽度常用 30%~50%

### Select 选择器

- 选项高度 34px，hover 背景 `#F5F7FA`
- 选中文字 `#409EFF`，下拉阴影 `box-shadow-light`

### Tag 标签

- 字号 12px，圆角 4px，内边距 `0 10px`
- primary：文字 `#409EFF` 背景 `#ECF5FF` 边框 `#D9ECFF`
- success：文字 `#67C23A` 背景 `#F0F9EB` 边框 `#E1F3D8`
- warning：文字 `#E6A23C` 背景 `#FDF6EC` 边框 `#FAECD8`
- danger：文字 `#F56C6C` 背景 `#FEF0F0` 边框 `#FDE2E2`
- info：文字 `#909399` 背景 `#F4F4F5` 边框 `#E9E9EB`

### Tabs 标签页

- 字号 14px，激活色 `#409EFF`，底部条 2px 主色
- 底部线：`1px solid #E4E4E4`

### Menu 导航菜单

- 菜单项字号 14px，高度 56px
- 亮色 hover 背景：`#ECF5FF`，激活文字：`#409EFF`
- 深色推荐背景：`#304156`，深色文字：`#BFCBD9`

### Pagination 分页

- 字号 13px，按钮高 28px，宽 35.5px，圆角 3px
- hover 文字：`#409EFF`

### Card 卡片

- 内边距 20px，圆角 4px，边框 `#EBEEF5`
- 阴影 `0 2px 12px 0 rgba(0,0,0,0.1)`

### Alert 警告

- 内边距 `8px 16px`，圆角 4px
- success 背景 `#F0F9EB`，warning `#FDF6EC`，danger `#FEF0F0`，info `#F4F4F5`

### Message 全局提示

- 最小宽度 380px，内边距 `15px 15px 15px 20px`
- 背景 `#EDF2FC`

### Notification 通知

- 宽度 330px，圆角 8px，内边距 `14px 26px 14px 13px`
- 标题 16px `#303133`，内容 14px `#606266`

### Tooltip 文字提示

- 背景 `#303133`，文字 `#FFF`，字号 12px，内边距 10px

### Switch 开关

- 宽 40px，高 20px，手柄 16px
- 开启色 `#409EFF`，关闭色 `#DCDFE6`

### Checkbox / Radio

- 尺寸 14px，选中色 `#409EFF`
- Checkbox 圆角 2px，Radio 圆角 100%

### Avatar 头像

- large 40px / medium 36px / small 28px
- 背景 `#C0C4CC`，文字 `#FFF`

### Badge 徽标

- 背景 `#F56C6C`，高 18px，字号 12px，圆角 10px

---

## 十一、B 端页面布局推荐

### 整体框架

```
┌───────────────────────────────────────────────┐
│  Header（50~60px，白色，底部投影）              │
├──────┬────────────────────────────────────────┤
│      │                                        │
│ Aside│     Main（padding: 20px）              │
│210px │     背景 #F0F2F5                       │
│      │                                        │
│      │   ┌──────────────────────────────┐     │
│      │   │  el-card（padding: 20px）    │     │
│      │   │  间距 20px                    │     │
│      │   └──────────────────────────────┘     │
│      │                                        │
└──────┴────────────────────────────────────────┘
```

### 侧边栏

- 展开 210px / 收起 64px
- 深色：背景 `#304156`，文字 `#BFCBD9`，hover `#263445`，子菜单 `#1F2D3D`
- 亮色：背景 `#FFF`，hover `#ECF5FF`，选中文字 `#409EFF`

### 页面间距

| 层级 | 间距 | 用途 |
|------|------|------|
| 页面级 | 20px | main 内边距 |
| 区块级 | 20px | 卡片之间 |
| 组件级 | 16px | 卡片内元素 |
| 元素级 | 10px | 按钮组/表单 inline |
| 紧凑级 | 8px | 标签组 |
| 最小级 | 4px | 图标与文字 |

### 表格页结构

```
页面标题 + 操作按钮
筛选区（el-form inline，背景白，padding 20px）
工具栏（批量操作/刷新/列设置）
el-table（边框 #EBEEF5，hover #F5F7FA）
el-pagination（右对齐）
```

### 表单页结构

```
el-card
  el-form（label-width 100px，右对齐）
    el-form-item × N（间距 22px）
底部操作栏（固定底部，高 60px，白色，上边框 #EBEEF5）
```

---

## 十二、品牌配置（按项目修改）

> 只需修改以下变量，即可覆盖全局主色。其他参数保持默认即可。

```
# 品牌主色（必改）
color-primary = #409EFF

# 可选覆盖
color-success = #67C23A
color-warning = #E6A23C
color-danger  = #F56C6C
color-info    = #909399

# 布局
siderWidth = 210px
siderCollapsedWidth = 64px
headerHeight = 50px
contentPadding = 20px
contentBgColor = #F0F2F5
siderTheme = dark        # dark / light

# 字体
fontFamily = "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif
```

---

## 十三、禁用态

| 变量 | 值 | 用途 |
|------|-----|------|
| disabled-fill-base | `#F5F7FA` | 禁用填充 |
| disabled-color-base | `#C0C4CC` | 禁用文字 |
| disabled-border-base | `#E4E7ED` | 禁用边框 |

---

## 十四、链接

| 属性 | 值 |
|------|-----|
| 默认色 | `#66B1FF`（primary-light-2） |
| hover | `#409EFF`（primary） |
| 字重 | `500` |

---
<!--  作者：Charles.Chen 微信：yixiusztx  如有问题，欢迎指正，谢谢。  -->
> **结束**。将本文件整体放入 AI Agent 上下文后，Agent 生成的页面原型将自动遵循 Element UI 精确设计规范。
