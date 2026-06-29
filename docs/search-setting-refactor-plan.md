# SearchSetting 全页面重构规范

## 1. 目标

所有使用 `SearchSetting` 的页面，统一改造成当前用户管理页的接入方式。

基线页面：

- `src/views/system/user/index.vue`

统一目标：

- 页面只传 `:columns`
- 按需传 `:required-fields`
- 只监听 `@update:visible-fields`
- 不再传 `storage-key`
- 不再依赖任何搜索方案逻辑
- 不做兼容层

统一交互：

- 查询条件配置使用右侧抽屉
- 抽屉内默认展示全部查询条件
- 使用 `VueDraggable + el-checkbox`
- 勾选控制显示
- 拖拽控制顺序
- 点击“应用”后才更新页面查询区
- 抽屉默认关闭 `lock-scroll`

## 2. 当前组件标准

当前 `SearchSetting` 的职责已经固定为：

- 根据页面传入的 `columns` 生成查询字段配置
- 维护 `initial / applied / draft` 三层状态
- 输出 `visibleFields`
- 在应用后重挂载查询区，规避 `gi-form` 动态重排导致的内部报错
- 关闭抽屉滚动锁，避免给 `body` 注入滚动条补偿宽度

当前组件对外允许的接口只有：

```vue
<SearchSetting
  :columns="allSearchColumns"
  :required-fields="['username']"
  @update:visible-fields="onSearchFieldsChange"
>
  <gi-form ... />
</SearchSetting>
```

禁止继续使用：

- `storage-key`
- `scheme-name`
- 搜索方案保存/加载/删除
- 基础搜索 / 高级搜索切换

## 3. 页面改造标准

每个页面统一保留这几个状态：

- `allSearchColumns`
- `visibleSearchColumns`
- `onSearchFieldsChange`
- 查询表单对象

标准写法：

```vue
<SearchSetting
  :columns="allSearchColumns"
  :required-fields="requiredSearchFields"
  @update:visible-fields="onSearchFieldsChange"
>
  <gi-form
    v-model="searchForm"
    :columns="visibleSearchColumns"
    search
    @search="handleSearch"
    @reset="handleReset"
  />
</SearchSetting>
```

```ts
const allSearchColumns = computed(() => searchColumns.value)
const visibleSearchColumns = ref<FormColumnItem[]>([])

function onSearchFieldsChange(fields: FormColumnItem[]) {
  visibleSearchColumns.value = fields
}
```

## 4. 必改项

所有页面必须完成：

1. 删除 `storage-key`
2. 删除任何与搜索方案相关的页面逻辑
3. 删除任何假设 `SearchSetting` 会持久化条件配置的代码
4. 保证 `visibleSearchColumns` 来自组件事件回传
5. 如果有必选字段，明确写在 `required-fields`

## 5. 禁止项

- 禁止继续传 `storage-key`
- 禁止在页面里自己做搜索字段本地持久化
- 禁止恢复方案保存
- 禁止扩展额外兼容 props
- 禁止绕过 `SearchSetting` 直接在页面里做字段拖拽
- 禁止恢复抽屉默认滚动锁

## 6. 迁移步骤

单页执行顺序：

1. 找到页面中的 `SearchSetting` 调用
2. 删除 `storage-key`
3. 检查是否存在旧的搜索方案逻辑
4. 补齐 `allSearchColumns / visibleSearchColumns / onSearchFieldsChange`
5. 如有必选查询项，补 `required-fields`
6. 验证查询区显示、拖拽、应用、重置是否正常
7. 跑目标文件 ESLint

## 7. 页面清单

当前使用 `SearchSetting` 的页面共 45 个：

- `src/views/system/user/index.vue`
- `src/views/system/dict/index.vue`
- `src/views/system/file/index.vue`
- `src/views/system/audit/index.vue`
- `src/views/system/params/index.vue`
- `src/views/bom/list/index.vue`
- `src/views/ecn/list/index.vue`
- `src/views/crm/contract/index.vue`
- `src/views/crm/opportunity/index.vue`
- `src/views/crm/receivable/index.vue`
- `src/views/crm/invoice/index.vue`
- `src/views/crm/order/index.vue`
- `src/views/ehs/training/index.vue`
- `src/views/ehs/permit/index.vue`
- `src/views/ehs/index/index.vue`
- `src/views/ehs/emergency/index.vue`
- `src/views/energy/detail/index.vue`
- `src/views/equipment/list/index.vue`
- `src/views/equipment/repair/index.vue`
- `src/views/equipment/spare/index.vue`
- `src/views/finance/index/index.vue`
- `src/views/hr/attendance/index.vue`
- `src/views/hr/index/index.vue`
- `src/views/hr/piecework/index.vue`
- `src/views/iot/config/index.vue`
- `src/views/mdm/material/index.vue`
- `src/views/mdm/mold/index.vue`
- `src/views/mdm/resource/index.vue`
- `src/views/mdm/work-center/index.vue`
- `src/views/mrp/forecast/index.vue`
- `src/views/qms/inspection/index.vue`
- `src/views/qms/supplier-quality/index.vue`
- `src/views/routing/auto-time/index.vue`
- `src/views/scm/purchase-request/index.vue`
- `src/views/scm/purchase/index.vue`
- `src/views/scm/return/index.vue`
- `src/views/wms/backflush/index.vue`
- `src/views/wms/delivery/index.vue`
- `src/views/wms/inventory/index.vue`
- `src/views/wms/picking/index.vue`
- `src/views/wms/receipt/index.vue`
- `src/views/wms/stock-count/index.vue`
- `src/views/work-order/list/index.vue`
- `src/views/work-order/outsource/index.vue`
- `src/views/work-order/trace/index.vue`

## 8. 批次建议

### P1

- `system`
- `wms`
- `work-order`

原因：

- 查询页多
- 交互最集中
- 能先把新模式跑稳

### P2

- `crm`
- `scm`
- `mdm`
- `equipment`

### P3

- `ehs`
- `hr`
- `qms`
- `mrp`
- `energy`
- `finance`
- `iot`
- `routing`
- `bom`
- `ecn`

## 9. 验收标准

单页验收：

- 页面不再传 `storage-key`
- 查询字段可拖拽
- 查询字段可勾选显示/隐藏
- 抽屉内修改不会实时扰动底层表单
- 点击“应用”后页面查询区更新
- 页面不再出现 `suffix` 相关控制台报错

模块验收：

- 模块内所有 `SearchSetting` 页面都按统一写法接入
- 模块内 `rg -n "storage-key=" src/views/<module>` 结果为 0

全项目验收：

- `rg -n "storage-key=" src/views` 结果为 0
- `rg -n "scheme-name" src/views src/components` 结果为 0
- `npm run type-check` 通过

## 10. 输出要求

每完成一个模块，输出以下结果：

- 已完成页面列表
- 删除的旧 `storage-key` 列表
- 是否存在特殊必选字段
- 该模块的验证结果
