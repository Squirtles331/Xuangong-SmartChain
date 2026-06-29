# 页面统一重构规范

## 1. 目标

所有页面按用户管理页当前模式统一重构：

`View/Page -> src/api/* -> isMockMode ? mock service : http`

统一要求：

- 页面层不再维护本地假数据数组
- 页面层不再直接使用 `@/mock/*`
- 列表页统一通过 `useTable` 管理加载、分页、刷新、删除
- 页面只调用 `src/api/*`
- mock / real 切换只能发生在 `src/api/*`
- 不做兼容层，不保留旧写法

参考基线：

- `src/views/system/user/index.vue`

## 2. 适用范围

当前 `src/views` 下共有 96 个 `index.vue` 页面，需要全部按本规范迭代。

按模块统计：

- `system`: 11
- `wms`: 11
- `work-order`: 9
- `crm`: 8
- `equipment`: 6
- `scm`: 6
- `bom`: 5
- `hr`: 5
- `iot`: 5
- `mdm`: 5
- `mrp`: 5
- `ehs`: 4
- `finance`: 4
- `energy`: 3
- `qms`: 3
- `routing`: 3
- `aps`: 2
- `ecn`: 1

## 3. 页面分型

### 3.1 列表页

特征：

- 有搜索区
- 有表格
- 有分页
- 有新增、编辑、删除、批量操作

改造要求：

- 使用 `useTable`
- 页面内保留查询表单状态
- 页面内定义 `listAPI` 适配函数
- 页面内负责 API 数据和表格展示模型之间的映射
- 删除本地 `computed filteredList`
- 删除本地 `pagedList`
- 删除本地分页切片逻辑

### 3.2 表单页

特征：

- 新增页
- 编辑页
- 配置页

改造要求：

- 初始值通过 `src/api/*` 获取
- 提交通过 `createXxx` / `updateXxx` / `saveXxx`
- 页面不保留 mock 表单默认对象以模拟后端结果
- 枚举数据优先从 API 或统一常量获取

### 3.3 详情页

特征：

- 详情展示
- 带 tabs 的只读信息

改造要求：

- 详情通过 `getDetail(id)` 获取
- 页面只负责展示模型转换
- 删除本地详情常量和演示数据

### 3.4 看板 / 统计页

特征：

- 卡片统计
- 图表
- 趋势分析

改造要求：

- 统计卡片、图表、趋势数据全部通过 `src/api/*`
- 图表 option 的组装留在页面或单独 hooks
- 不允许页面硬编码趋势数组、月份数组、统计卡片数组作为业务数据源

## 4. 列表页统一写法

### 4.1 页面必须保留的内容

- 搜索表单 `searchForm`
- 列定义 `columns`
- 表单弹窗状态
- API 数据到页面模型的映射函数
- 表单模型到 API payload 的映射函数

### 4.2 页面必须删除的内容

- `const list = ref([...])`
- `const filteredList = computed(...)`
- `const pagedList = computed(...)`
- 手写 `pagination = ref(...)` 然后本地 `slice`
- 本地 `remove(id)` 直接修改数组
- 本地 `submitDialog()` 直接 `push/unshift/splice`

### 4.3 useTable 接入规则

标准模式：

```ts
const { tableData, pagination, loading, search, refresh, onDelete } = useTable<Row>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const response = await getXxxList({
      page,
      page_size: size,
      ...queryAdapter(searchForm.value)
    })

    return {
      list: response.data.items.map(mapRow),
      total: response.data.total
    }
  },
  deleteAPI: (ids) => Promise.all(ids.map((id) => deleteXxx(id)))
})
```

约束：

- 不修改 `useTable` 文件以兼容单页特殊逻辑
- 页面自己适配查询参数
- 页面自己适配返回结构
- 页面自己适配状态值、字段名、日期格式

### 4.4 搜索规则

- `handleSearch` 统一调 `search()`
- `handleReset` 统一重置 `searchForm` 后调 `search()`
- 搜索字段命名优先对齐 API 字段
- 如果页面显示字段与 API 字段不同，使用页面内 adapter，不在模板里直接拼转换逻辑

### 4.5 新增 / 编辑规则

- 弹窗表单只维护页面表单模型
- 提交前转换为 API payload
- 新增调 `createXxx`
- 编辑调 `updateXxx`
- 成功后统一 `await refresh()`

### 4.6 删除规则

- 单条删除统一走 `onDelete(row)`
- 批量删除统一走 `deleteAPI`
- 页面不直接 `splice` 本地数组

## 5. API 层统一规则

每个业务域只保留一个 API 文件，例如：

- `src/api/system.ts`
- `src/api/wms.ts`
- `src/api/work-order.ts`
- `src/api/crm.ts`

规则：

- 页面只能 import `src/api/*`
- API 文件负责 mock / real 分支切换
- API 类型声明必须完整
- 列表查询统一显式定义 query interface
- 详情、创建、编辑、删除接口命名统一

推荐命名：

- `getXxxList`
- `getXxxDetail`
- `createXxx`
- `updateXxx`
- `deleteXxx`
- `batchDeleteXxx`
- `changeXxxStatus`

## 6. mock 层统一规则

mock 目录职责固定：

```text
src/mock/
  modules/   # 原始 mock 数据
  services/  # CRUD / 列表 / 搜索 / 状态变更
  shared/    # delay / paginate / response / id
```

规则：

- 页面不碰 mock
- API 只调用 `mock/services/*`
- `modules/*` 不承载业务逻辑
- `services/*` 返回结构必须和 real API 对齐

## 7. 页面改造步骤

单页执行顺序固定：

1. 找出页面里的本地数组、computed 过滤、分页切片、直连 mock 代码。
2. 找到对应 `src/api/*`，缺什么接口就补什么接口。
3. 找到对应 `src/mock/services/*`，补齐查询、详情、创建、编辑、删除逻辑。
4. 在页面内定义 `Row`、`FormModel`、`mapRow`、`buildPayload`。
5. 列表页接入 `useTable`。
6. 替换新增、编辑、删除为 API 调用。
7. 删除旧本地状态和旧兼容逻辑。
8. 跑 `npm run type-check`。
9. 跑目标文件 ESLint。

## 8. 批次建议

### P1：系统级和高频列表页

优先模块：

- `system`
- `wms`
- `work-order`
- `crm`
- `scm`

原因：

- 列表页多
- CRUD 集中
- 最适合先统一出模板

### P2：主数据和制造流程页

- `mdm`
- `bom`
- `routing`
- `mrp`
- `equipment`
- `qms`
- `ecn`

### P3：统计、配置、外围业务页

- `analysis`
- `aps`
- `energy`
- `finance`
- `hr`
- `ehs`
- `iot`
- `settings`

## 9. 验收标准

单页验收必须全部满足：

- 页面不再直接 import `@/mock`
- 页面不再保留本地业务数组作为主数据源
- 列表页分页不再使用本地 `slice`
- 所有 CRUD 都通过 `src/api/*`
- 搜索、刷新、删除、新增、编辑在 mock 模式下可运行
- `npm run type-check` 通过
- 目标文件 ESLint 通过

全项目验收必须全部满足：

- `src/views` 内 direct mock import 为 0
- `src/components` 内 direct mock import 为 0
- `src/stores` 内 direct mock import 为 0
- 所有业务页面都符合本规范

## 10. 禁止事项

- 禁止为了兼容旧页面去改 `useTable`
- 禁止页面直接调用 `http`
- 禁止页面直接读写 `src/mock/modules/*`
- 禁止继续保留本地静态数组并和 API 混用
- 禁止新增聚合兼容 API 文件
- 禁止为了省事把字段转换逻辑直接堆在模板表达式里

## 11. 输出要求

后续每改完一个模块，至少输出以下结果：

- 已完成页面列表
- 新增或补齐的 API 列表
- 新增或补齐的 mock service 列表
- 删除的旧本地数据逻辑说明
- `type-check` 与 `eslint` 结果
