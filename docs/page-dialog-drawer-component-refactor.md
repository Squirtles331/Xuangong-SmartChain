# 页面弹窗/抽屉组件拆分规范

## 1. 目标

所有页面内的新增、编辑、详情、配置类弹窗或抽屉，都要从页面主文件中拆成独立组件。

基线页面：

- `src/views/system/user/index.vue`
- `src/views/system/user/UserFormDialog.vue`

统一目标：

- 页面主文件只保留列表、搜索、打开弹窗、提交保存、刷新删除等页面级逻辑
- 弹窗或抽屉内部表单单独封装成组件
- 父子通信优先使用 `defineModel`
- 尽量避免使用 `watch`
- 不保留页面内联的大段 `gi-dialog` / `el-drawer` / `gi-form`

## 2. 适用范围

适用于所有页面中的以下场景：

- 新增弹窗
- 编辑弹窗
- 详情抽屉
- 配置抽屉
- 选择器弹窗
- 多步骤表单弹窗

不再允许页面主文件中长期保留复杂弹窗表单实现。

## 3. 页面职责边界

### 3.1 页面主文件职责

页面主文件只负责：

- 列表数据获取
- 搜索和筛选
- 表格展示
- 当前弹窗模式控制
- 当前表单数据初始化
- 调用创建、更新、删除接口
- 弹窗提交成功后的刷新

### 3.2 弹窗/抽屉子组件职责

子组件只负责：

- 弹窗或抽屉容器
- 表单字段定义
- 表单渲染
- 确认/取消按钮交互
- 向父组件抛出提交事件

## 4. 目录规范

如果页面已经形成独立目录，弹窗组件放在同目录下。

示例：

```text
src/views/system/user/
  index.vue
  UserFormDialog.vue
```

如果一个页面有多个弹窗组件，按语义拆分：

```text
src/views/system/dict/
  index.vue
  DictTypeDialog.vue
  DictItemDialog.vue
```

## 5. 推荐命名

推荐命名规则：

- 表单弹窗：`XxxFormDialog.vue`
- 详情抽屉：`XxxDetailDrawer.vue`
- 配置抽屉：`XxxSettingDrawer.vue`
- 选择弹窗：`XxxSelectDialog.vue`

不要使用无语义命名：

- `dialog.vue`
- `form.vue`
- `popup.vue`

## 6. 父组件标准写法

页面内统一保留：

- `dialogVisible`
- `dialogMode`
- `formModel`

标准示例：

```vue
<UserFormDialog
  v-model:visible="dialogVisible"
  v-model:form="formModel"
  :mode="dialogMode"
  :role-options="roleOptions"
  :status-options="statusOptions"
  @submit="submitDialog"
/>
```

父组件中：

```ts
const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const formModel = ref<UserFormModel>(createDefaultFormModel())
```

## 7. 子组件标准写法

子组件优先使用：

- `defineModel('visible')`
- `defineModel('form')`

标准示例：

```ts
const visible = defineModel<boolean>('visible', { required: true })
const formData = defineModel<UserFormModel>('form', { required: true })
```

提交事件统一：

```ts
const emit = defineEmits<{
  submit: []
}>()
```

确认时只抛事件，不直接调接口：

```ts
async function handleSubmit() {
  emit('submit')
  return false
}
```

## 8. 表单模型规范

页面级表单模型必须单独定义类型：

```ts
export interface UserFormModel {
  id: string
  username: string
  nickname: string
  role: string
  status: UserStatus
}
```

默认值统一通过工厂函数创建：

```ts
function createDefaultFormModel(): UserFormModel {
  return {
    id: '',
    username: '',
    nickname: '',
    role: '',
    status: '启用'
  }
}
```

不要直接在多个地方手写同一份初始对象。

## 9. 打开弹窗规范

新增：

```ts
function openAdd() {
  dialogMode.value = 'add'
  formModel.value = createDefaultFormModel()
  dialogVisible.value = true
}
```

编辑：

```ts
function openEdit(row: UserRow) {
  dialogMode.value = 'edit'
  formModel.value = mapRowToForm(row)
  dialogVisible.value = true
}
```

不要在子组件里自己推断是新增还是编辑。

## 10. 提交规范

提交逻辑必须留在父组件：

- 校验页面级业务规则
- 转换 payload
- 调用 `createXxx` / `updateXxx`
- 关闭弹窗
- 刷新列表

示例：

```ts
async function submitDialog() {
  if (!formModel.value.username || !formModel.value.role) {
    ElMessage.warning('请填写用户名和角色')
    return
  }

  const payload = buildUserPayload(formModel.value)

  if (dialogMode.value === 'add') {
    await createUser(payload)
  } else {
    await updateUser(formModel.value.id, payload)
  }

  dialogVisible.value = false
  await refresh()
}
```

## 11. 尽量避免 watch

本轮重构要求：

- 能不用 `watch` 就不用
- 优先使用 `defineModel`
- 优先在打开弹窗时一次性赋值
- 优先使用 `computed` 和显式事件

允许保留 `watch` 的场景：

- 第三方组件强依赖同步状态
- 路由参数变化驱动详情刷新
- 外部值变化必须重建局部状态

但要先证明不能通过更直接的方式实现。

## 12. 禁止项

- 禁止页面主文件继续内联复杂 `gi-dialog`
- 禁止子组件内部直接请求接口
- 禁止子组件同时承担列表和弹窗职责
- 禁止用 `watch` 同步 `props -> form` 作为默认方案
- 禁止一个页面文件里堆多段大型弹窗表单

## 13. 迁移步骤

单页执行顺序：

1. 找出页面内联的弹窗或抽屉代码
2. 提取表单模型类型
3. 新建独立组件文件
4. 把字段定义和表单渲染迁移到子组件
5. 父组件改成 `v-model:visible + v-model:form + @submit`
6. 删除页面内旧弹窗结构
7. 删除不必要的 `watch`
8. 运行类型检查和 ESLint

## 14. 优先改造模块

优先顺序建议：

### P1

- `system`
- `wms`
- `work-order`

### P2

- `crm`
- `scm`
- `mdm`
- `equipment`

### P3

- `qms`
- `hr`
- `ehs`
- `mrp`
- `energy`
- `finance`
- `iot`
- `routing`
- `bom`
- `ecn`

## 15. 验收标准

单页验收：

- 页面主文件不再内联复杂弹窗表单
- 弹窗/抽屉已拆成独立组件
- 父组件通过 `defineModel` 对应的 `v-model` 与子组件通信
- 提交逻辑保留在父组件
- 无额外无意义 `watch`

模块验收：

- 模块内同类页面采用统一拆法
- 命名统一
- 类型定义统一

全项目验收：

- 新增/编辑类弹窗基本完成独立组件化
- `npm run type-check` 通过
- 目标文件 ESLint 通过

## 16. 输出要求

每完成一个模块，输出：

- 已拆分页面列表
- 新增组件文件列表
- 删除的页面内联弹窗说明
- 是否仍保留必要 `watch`
- 类型检查与 ESLint 结果
