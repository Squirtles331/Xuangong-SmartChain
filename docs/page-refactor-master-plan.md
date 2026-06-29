# 页面统一重构总计划

> 基于三份规范文档 + 当前代码扫描结果制定

## 一、规范来源

| 规范文档 | 核心要求 |
|----------|---------|
| `page-refactor-standard.md` | 列表页接入 useTable、删除本地数据逻辑、统一 API 调用模式 |
| `page-dialog-drawer-component-refactor.md` | 弹窗/抽屉拆为独立组件、defineModel 通信、父组件持有提交逻辑 |
| `search-setting-refactor-plan.md` | 删除 storage-key、使用 `:columns` + `@update:visible-fields` 模式 |

## 二、基线页面

- **列表页基线**：`src/views/system/user/index.vue`
- **弹窗基线**：`src/views/system/user/UserFormDialog.vue`

## 三、当前现状扫描

### 3.1 总体数据

| 指标 | 数量 |
|------|------|
| 总页面数 | 96 |
| 已接入 useTable | 1（system/user） |
| 已拆分弹窗组件 | 1（system/user） |
| 使用 SearchSetting | 45 页 |
| 仍有 storage-key | 44 页（除 user 外全部） |
| 有内联弹窗 | 62 页 |
| 仍有 computed filteredList/pagedList | 19 页 |

### 3.2 各模块详细现状

| 模块 | 总页 | 列表页 | SearchSetting | storage-key | 内联弹窗 | filteredList | useTable |
|------|------|--------|:---:|:---:|:---:|:---:|:---:|
| system | 11 | 8 | 6 | 4 | 8 | 4 | 1 |
| wms | 11 | 11 | 8 | 8 | 7 | 0 | 0 |
| work-order | 9 | 5 | 3 | 3 | 6 | 1 | 0 |
| crm | 8 | 7 | 5 | 5 | 5 | 1 | 0 |
| scm | 6 | 6 | 4 | 4 | 4 | 0 | 0 |
| mdm | 5 | 5 | 4 | 4 | 4 | 2 | 0 |
| bom | 5 | 2 | 1 | 1 | 1 | 1 | 0 |
| routing | 3 | 1 | 1 | 1 | 1 | 0 | 0 |
| ecn | 1 | 1 | 1 | 1 | 1 | 1 | 0 |
| mrp | 5 | 3 | 1 | 1 | 1 | 0 | 0 |
| qms | 3 | 3 | 2 | 2 | 3 | 1 | 0 |
| equipment | 6 | 4 | 3 | 3 | 5 | 0 | 0 |
| ehs | 4 | 4 | 4 | 4 | 4 | 2 | 0 |
| hr | 5 | 3 | 3 | 3 | 5 | 0 | 0 |
| iot | 5 | 3 | 1 | 1 | 4 | 1 | 0 |
| energy | 3 | 3 | 1 | 1 | 1 | 2 | 0 |
| finance | 4 | 3 | 1 | 1 | 1 | 0 | 0 |
| aps | 2 | 1 | 0 | 0 | 1 | 0 | 0 |
| analysis | 2 | 0 | 0 | 0 | 0 | 0 | 0 |
| settings | 2 | 0 | 0 | 0 | 2 | 2 | 0 |

---

## 四、单页改造模板

每个列表页统一按以下模板改造：

### 4.1 改造前（旧模式）

```ts
// 本地数组 + computed 过滤 + 本地分页
const list = ref([...])
const filteredList = computed(() => list.value.filter(...))
const pagination = ref({ page: 1, size: 10 })
const pagedList = computed(() => filteredList.value.slice(...))
// 内联 gi-dialog + gi-form
```

### 4.2 改造后（新模式）

```ts
// useTable + 弹窗组件
const { tableData, pagination, loading, search, refresh, onDelete } = useTable<Row>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const res = await getXxxList({ page, page_size: size, ...searchForm.value })
    return { list: res.data.items.map(mapRow), total: res.data.total }
  },
  deleteAPI: (ids) => Promise.all(ids.map(id => deleteXxx(id)))
})
```

### 4.3 SearchSetting 改造

```diff
- <SearchSetting storage-key="xxx-search" ...>
+ <SearchSetting :columns="allSearchColumns" :required-fields="[...]" @update:visible-fields="onSearchFieldsChange">
```

### 4.4 弹窗拆分

```
父组件:
  dialogVisible, dialogMode, formModel
  openAdd(), openEdit(row), submitDialog()

子组件 XxxFormDialog.vue:
  defineModel('visible'), defineModel('form')
  emit('submit')
```

---

## 五、分批执行计划

### P1 批次：核心高频模块（5 模块，45 页）

| 模块 | 页数 | 列表页 | 弹窗拆分 | SearchSetting | 改造重点 |
|------|------|--------|----------|:---:|------|
| **system** | 11 | 8 | 8 | 6 | user 已完工，其余 7 个列表页接入 useTable + 拆分弹窗 |
| **wms** | 11 | 11 | 7 | 8 | 全量接入 useTable，拆分弹窗，去掉 storage-key |
| **work-order** | 9 | 5 | 6 | 3 | list/detail/kanban/my-tasks/report 接入 useTable |
| **crm** | 8 | 7 | 5 | 5 | customer/order/receivable 已有 API 调用，接入 useTable |
| **scm** | 6 | 6 | 4 | 4 | supplier/purchase 接入 useTable，拆分弹窗 |

### P2 批次：主数据与制造流程（7 模块，28 页）

| 模块 | 页数 | 列表页 | 弹窗拆分 | SearchSetting | 改造重点 |
|------|------|--------|----------|:---:|------|
| **mdm** | 5 | 5 | 4 | 4 | material/organization/resource 接入 useTable |
| **bom** | 5 | 2 | 1 | 1 | list 接入 useTable，editor 为表单页 |
| **routing** | 3 | 1 | 1 | 1 | editor 接入 useTable |
| **mrp** | 5 | 3 | 1 | 1 | result 为核心页面 |
| **equipment** | 6 | 4 | 5 | 3 | list/repair/spare 接入 useTable |
| **qms** | 3 | 3 | 3 | 2 | inspection 为核心页面 |
| **ecn** | 1 | 1 | 1 | 1 | list 接入 useTable |

### P3 批次：统计配置外围（6 模块，23 页）

| 模块 | 页数 | 列表页 | 弹窗拆分 | SearchSetting | 改造重点 |
|------|------|--------|----------|:---:|------|
| **ehs** | 4 | 4 | 4 | 4 | 全量接入 useTable |
| **hr** | 5 | 3 | 5 | 3 | attendance/index/piecework 接入 useTable |
| **iot** | 5 | 3 | 4 | 1 | config/alert/monitor 为核心页面 |
| **energy** | 3 | 3 | 1 | 1 | detail 为核心页面 |
| **finance** | 4 | 3 | 1 | 1 | cost/ledger/index 接入 useTable |
| **aps** | 2 | 1 | 1 | 0 | schedule 为核心页面 |
| **analysis** | 2 | 0 | 0 | 0 | 看板/统计页，改为 API 数据源 |
| **settings** | 2 | 0 | 2 | 0 | 配置页，清理本地数据 |

---

## 六、验收标准

### 单页验收
- [ ] 页面不再直接 `import @/mock`
- [ ] 列表页接入 `useTable`
- [ ] 弹窗/抽屉拆为独立组件
- [ ] 删除 `storage-key`
- [ ] 删除本地 `computed filteredList` / `pagedList`
- [ ] 所有 CRUD 通过 `@/api/*`
- [ ] SearchSetting 使用新模式

### 全项目验收
- [ ] `src/views` 内 `storage-key=` 引用为 0
- [ ] `src/views` 内 `@/mock` 引用为 0
- [ ] 所有列表页接入 `useTable`
- [ ] 所有弹窗已拆分
- [ ] `npm run type-check` 通过
- [ ] ESLint 通过

---

## 七、执行顺序

```
P1（45页）→ P2（28页）→ P3（23页）→ 全量验收
```

每个模块完成后的交付物：
1. 已完成页面列表
2. 新增弹窗组件列表
3. 删除的旧逻辑说明
4. type-check 与 ESLint 结果
