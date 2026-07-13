<template>
  <CrudPage
    v-model:search-model="queryParams"
    title="系统参数配置"
    :search-columns="searchColumns"
    :search-grid-item-props="searchGridItemProps"
    :columns="columns"
    :data="tableData"
    :pagination="pagination"
    :loading="loading"
    add-text="新增参数"
    @search="search"
    @reset="handleReset"
    @refresh="refresh"
    @add="openAdd"
  >
    <template #category="{ row }">
      <el-tag :type="getCategoryTagType(row.category)" size="small">{{ getCategoryLabel(row.category) }}</el-tag>
    </template>

    <template #valueCell="{ row }">
      <span class="param-value">{{ formatDisplayValue(row) }}</span>
      <el-tag v-if="row.value === row.defaultValue" size="small" type="info" class="default-tag">默认值</el-tag>
    </template>

    <template #status="{ row }">
      <el-tag :type="row.status === 'active' ? 'success' : 'info'" size="small">
        {{ row.status === 'active' ? '启用' : '停用' }}
      </el-tag>
    </template>

    <template #actions="{ row }">
      <CrudRowActions :actions="rowActions" @action="handleRowAction($event, row)" />
    </template>

    <template #dialog>
      <ConfigFormDialog v-model:visible="dialogVisible" v-model:form="formModel" :mode="dialogMode" @submit="submitDialog" />
    </template>
  </CrudPage>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormColumnItem, TableColumnItem } from 'gi-component'
import CrudPage from '@/components/crud/CrudPage/index.vue'
import CrudRowActions from '@/components/crud/CrudRowActions/index.vue'
import type { CrudRowActionItem } from '@/components/crud/types'
import {
  createSystemParam,
  deleteSystemParam,
  getSystemParams,
  resetSystemParam,
  updateSystemParam,
  type SystemParam,
  type SystemParamQuery
} from '@/api/system'
import { useTable } from '@/hooks/useTable'
import ConfigFormDialog, { type ConfigFormModel } from './ConfigFormDialog.vue'

const categoryOptions = [
  { label: '认证与安全', value: 'auth' },
  { label: 'MRP 计划', value: 'mrp' },
  { label: '库存与仓储', value: 'stock' },
  { label: '生产管理', value: 'production' },
  { label: '财务管理', value: 'finance' },
  { label: '系统通用', value: 'system' },
  { label: '安全策略', value: 'security' },
  { label: '文件管理', value: 'file' }
]

const systemParamNameMap: Record<string, string> = {
  loginLockCount: '登录失败锁定次数',
  tokenExpireMinutes: 'Token 有效期',
  fileUploadMaxMb: '上传大小限制'
}

const systemParamDescMap: Record<string, string> = {
  loginLockCount: '连续失败达到该次数后锁定账户',
  tokenExpireMinutes: '登录令牌有效期，单位分钟',
  fileUploadMaxMb: '单文件最大上传大小，单位 MB'
}

const searchColumns: FormColumnItem[] = [
  { type: 'input', label: '关键字', field: 'keyword', props: { placeholder: '参数名称或参数编码', clearable: true } as any },
  {
    type: 'select-v2',
    label: '分类',
    field: 'category',
    props: {
      clearable: true,
      options: categoryOptions
    } as any
  },
  {
    type: 'select-v2',
    label: '状态',
    field: 'status',
    props: {
      clearable: true,
      options: [
        { label: '启用', value: 'active' },
        { label: '停用', value: 'disabled' }
      ]
    } as any
  }
]

const searchGridItemProps = {
  span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 }
}

const columns: TableColumnItem<SystemParam>[] = [
  { prop: 'code', label: '参数编码', minWidth: 170 },
  { prop: 'name', label: '参数名称', minWidth: 160 },
  { label: '分类', minWidth: 120, slotName: 'category', align: 'center' },
  { label: '参数值', minWidth: 220, slotName: 'valueCell' },
  { prop: 'description', label: '说明', minWidth: 220, showOverflowTooltip: true },
  { prop: 'updatedAt', label: '更新时间', minWidth: 170 },
  { prop: 'updatedBy', label: '更新人', minWidth: 100 },
  { label: '状态', minWidth: 90, slotName: 'status', align: 'center' },
  { label: '操作', minWidth: 220, fixed: 'right', slotName: 'actions', align: 'center' }
]

const queryParams = reactive({
  keyword: '',
  category: '',
  status: ''
})

const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const formModel = ref<ConfigFormModel>(createDefaultFormModel())
const rowActions: CrudRowActionItem[] = [
  { key: 'edit', label: '编辑', tone: 'primary' },
  { key: 'reset', label: '恢复默认', tone: 'warning' },
  { key: 'delete', label: '删除', tone: 'danger' }
]

const { tableData, pagination, loading, search, refresh, onDelete } = useTable<SystemParam>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const params: SystemParamQuery = {
      pageNum: page,
      pageSize: size,
      keyword: queryParams.keyword || undefined,
      category: queryParams.category || undefined,
      status: queryParams.status || undefined
    }
    const response = await getSystemParams(params)
    return {
      list: response.data.list.map(normalizeParamRow),
      total: response.data.total
    }
  },
  deleteAPI: (ids) => Promise.all(ids.map((id) => deleteSystemParam(id)))
})

function createDefaultFormModel(): ConfigFormModel {
  return {
    id: '',
    code: '',
    name: '',
    value: '',
    defaultValue: '',
    category: 'system',
    valueType: 'string',
    description: '',
    status: 'active'
  }
}

function normalizeParamRow(row: SystemParam): SystemParam {
  return {
    ...row,
    name: systemParamNameMap[row.code] || row.name,
    description: systemParamDescMap[row.code] || row.description
  }
}

function handleReset() {
  Object.assign(queryParams, {
    keyword: '',
    category: '',
    status: ''
  })
  search()
}

function getCategoryLabel(value: string) {
  return categoryOptions.find((item) => item.value === value)?.label || value
}

function getCategoryTagType(value: string) {
  if (value === 'auth' || value === 'security') return 'danger'
  if (value === 'mrp') return 'warning'
  if (value === 'stock') return 'primary'
  if (value === 'production') return 'success'
  return 'info'
}

function formatDisplayValue(row: SystemParam) {
  if (row.valueType === 'boolean') {
    return row.value === 'true' || row.value === '1' ? '是' : '否'
  }
  return row.value
}

function openAdd() {
  dialogMode.value = 'add'
  formModel.value = createDefaultFormModel()
  dialogVisible.value = true
}

function openEdit(row: SystemParam) {
  dialogMode.value = 'edit'
  formModel.value = {
    id: row.id,
    code: row.code,
    name: row.name,
    value: row.value,
    defaultValue: row.defaultValue,
    category: row.category,
    valueType: row.valueType,
    description: row.description,
    status: row.status
  }
  dialogVisible.value = true
}

function handleRowAction(action: string, row: SystemParam) {
  if (action === 'edit') {
    openEdit(row)
    return
  }

  if (action === 'reset') {
    resetToDefault(row)
    return
  }

  if (action === 'delete') {
    onDelete(row)
  }
}

async function submitDialog() {
  if (!formModel.value.code || !formModel.value.name) {
    ElMessage.warning('请填写参数编码和参数名称')
    return
  }

  if (dialogMode.value === 'add') {
    await createSystemParam({
      code: formModel.value.code,
      name: formModel.value.name,
      value: formModel.value.value,
      defaultValue: formModel.value.defaultValue || formModel.value.value,
      category: formModel.value.category,
      valueType: formModel.value.valueType,
      description: formModel.value.description,
      status: formModel.value.status,
      updatedBy: '当前用户'
    })
  } else {
    await updateSystemParam(formModel.value.id, formModel.value.value)
  }

  dialogVisible.value = false
  await refresh()
  ElMessage.success(dialogMode.value === 'add' ? '新增成功' : '保存成功')
}

async function resetToDefault(row: SystemParam) {
  await resetSystemParam(row.id)
  ElMessage.success('已恢复默认值')
  await refresh()
}
</script>

<style scoped>
.param-value {
  font-family: 'Courier New', monospace;
}

.default-tag {
  margin-left: 8px;
}
</style>
