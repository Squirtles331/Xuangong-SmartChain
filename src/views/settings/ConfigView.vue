<template>
  <gi-page-layout>
    <template #header>
      <gi-form v-model="searchForm" :columns="searchColumns" search @search="handleSearch" @reset="handleReset" />
    </template>

    <template #tool>
      <div class="toolbar-left">
        <el-button type="primary" :icon="Plus" @click="handleAdd">新增参数</el-button>
        <el-button :icon="Refresh" @click="refresh">刷新</el-button>
      </div>
      <div class="toolbar-right">
        <el-button type="success" :icon="Select" plain @click="batchEnable">批量启用</el-button>
        <el-button type="warning" :icon="CloseBold" plain @click="batchDisable">批量禁用</el-button>
        <el-button type="danger" :icon="Delete" plain :disabled="selectedKeys.length === 0" @click="removeSelected">批量删除</el-button>
      </div>
    </template>

    <gi-table :columns="columns" :data="tableData" :pagination="pagination" :loading="loading" border stripe @selection-change="onSelectionChange">
      <template #category="{ row }">
        <el-tag :type="categoryTagType(row.category)" size="small">{{ categoryLabel(row.category) }}</el-tag>
      </template>

      <template #valueCell="{ row }">
        <template v-if="editingId === row.id">
          <el-input v-if="row.valueType === 'string'" v-model="editingValue" size="small" @keyup.enter="saveEdit(row)" @keyup.escape="cancelEdit" />
          <el-input-number v-else-if="row.valueType === 'number'" v-model="editingValue" size="small" controls-position="right" />
          <el-switch v-else-if="row.valueType === 'boolean'" v-model="editingValue" active-text="是" inactive-text="否" @change="saveEdit(row)" />
          <el-input v-else v-model="editingValue" type="textarea" size="small" :rows="2" />
        </template>
        <template v-else>
          <span class="param-value" :class="{ 'is-default': row.value === row.defaultValue }">{{ formatDisplayValue(row) }}</span>
          <el-tag v-if="row.value === row.defaultValue" type="info" size="small" class="default-tag">默认</el-tag>
        </template>
      </template>

      <template #status="{ row }">
        <el-switch
          :model-value="row.status === 'active'"
          active-text="启用"
          inactive-text="禁用"
          inline-prompt
          size="small"
          @change="(value: boolean) => toggleStatus(row, value)"
        />
      </template>

      <template #actions="{ row }">
        <template v-if="editingId === row.id">
          <el-button type="primary" link size="small" @click="saveEdit(row)">保存</el-button>
          <el-button link size="small" @click="cancelEdit">取消</el-button>
        </template>
        <template v-else>
          <el-button type="primary" link size="small" @click="startEdit(row)">编辑</el-button>
          <el-button type="warning" link size="small" @click="resetToDefault(row)">恢复默认</el-button>
          <el-button type="danger" link size="small" @click="remove(row)">删除</el-button>
        </template>
      </template>
    </gi-table>

    <ConfigFormDialog v-model:visible="dialogVisible" v-model:form="formModel" :mode="dialogMode" @submit="submitDialog" />
  </gi-page-layout>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { FormColumnItem, TableColumnItem } from 'gi-component'
import { CloseBold, Delete, Plus, Refresh, Select } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { batchUpdateSystemParams, getSystemParams, resetSystemParam, updateSystemParam, type SystemParam } from '@/api/system'
import { useTable } from '@/hooks/useTable'
import ConfigFormDialog, { type ConfigFormModel } from './ConfigFormDialog.vue'

const categories: Record<string, string> = {
  auth: '认证与安全',
  mrp: 'MRP 计划',
  stock: '库存与仓储',
  production: '生产管理',
  finance: '财务管理',
  system: '系统通用',
  security: '安全',
  file: '文件'
}

const categoryTagTypes: Record<string, 'danger' | 'warning' | 'primary' | 'success' | '' | 'info'> = {
  auth: 'danger',
  security: 'danger',
  mrp: 'warning',
  stock: 'primary',
  production: 'success',
  finance: '' as const,
  system: 'info',
  file: 'info'
}

function categoryLabel(code: string) {
  return categories[code] || code
}

function categoryTagType(code: string) {
  return categoryTagTypes[code] || 'info'
}

const searchForm = reactive({ keyword: '', category: '', status: '' })

const searchColumns: FormColumnItem[] = [
  { type: 'input', label: '关键字', field: 'keyword', props: { placeholder: '参数名称/编码', clearable: true } as any },
  {
    type: 'select-v2',
    label: '分类',
    field: 'category',
    props: {
      options: [{ label: '全部', value: '' }, ...Object.entries(categories).map(([value, label]) => ({ label, value }))],
      clearable: true
    } as any
  },
  {
    type: 'select-v2',
    label: '状态',
    field: 'status',
    props: {
      options: [
        { label: '全部', value: '' },
        { label: '启用', value: 'active' },
        { label: '禁用', value: 'disabled' }
      ],
      clearable: true
    } as any
  }
]

const columns: TableColumnItem<SystemParam>[] = [
  { type: 'selection', width: 50 },
  { type: 'index', label: '#', width: 60 },
  { prop: 'code', label: '参数编码', width: 180, showOverflowTooltip: true },
  { prop: 'name', label: '参数名称', width: 180 },
  { label: '分类', width: 120, slotName: 'category', align: 'center' },
  { label: '参数值', minWidth: 200, slotName: 'valueCell' },
  { prop: 'description', label: '描述', minWidth: 200, showOverflowTooltip: true },
  { label: '状态', width: 100, slotName: 'status', align: 'center' },
  { prop: 'updatedAt', label: '更新时间', width: 170 },
  { prop: 'updatedBy', label: '更新人', width: 100 },
  { label: '操作', width: 220, fixed: 'right', slotName: 'actions', align: 'center' }
]

const allParams = ref<SystemParam[]>([])

const { tableData, pagination, loading, search, refresh, onSelectionChange, selectedKeys } = useTable<SystemParam>({
  rowKey: 'id',
  immediate: false,
  listAPI: async ({ page, size }) => {
    let filtered = allParams.value
    if (searchForm.keyword) {
      const keyword = searchForm.keyword.toLowerCase()
      filtered = filtered.filter((item) => item.name.toLowerCase().includes(keyword) || item.code.toLowerCase().includes(keyword))
    }
    if (searchForm.category) {
      filtered = filtered.filter((item) => item.category === searchForm.category)
    }
    if (searchForm.status) {
      filtered = filtered.filter((item) => item.status === searchForm.status)
    }
    const start = (page - 1) * size
    return {
      list: filtered.slice(start, start + size),
      total: filtered.length
    }
  }
})

const editingId = ref<string | null>(null)
const editingValue = ref<any>('')

function startEdit(row: SystemParam) {
  editingId.value = row.id
  if (row.valueType === 'boolean') {
    editingValue.value = row.value === 'true' || row.value === '1'
  } else if (row.valueType === 'number') {
    editingValue.value = Number(row.value)
  } else {
    editingValue.value = row.value
  }
}

function cancelEdit() {
  editingId.value = null
  editingValue.value = ''
}

async function saveEdit(row: SystemParam) {
  const saveValue = String(editingValue.value)
  await updateSystemParam(row.id, saveValue)
  row.value = saveValue
  row.updatedAt = new Date().toLocaleString('zh-CN')
  ElMessage.success('保存成功')
  editingId.value = null
}

async function resetToDefault(row: SystemParam) {
  await ElMessageBox.confirm(`确认将“${row.name}”恢复为默认值“${row.defaultValue}”？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
  await resetSystemParam(row.id)
  row.value = row.defaultValue
  row.updatedAt = new Date().toLocaleString('zh-CN')
  ElMessage.success('已恢复默认值')
}

function formatDisplayValue(row: SystemParam): string {
  if (row.valueType === 'boolean') {
    return row.value === 'true' || row.value === '1' ? '是' : '否'
  }
  return row.value
}

async function batchUpdateStatus(ids: string[], status: SystemParam['status']) {
  await batchUpdateSystemParams(ids.map((id) => ({ id, value: status })))
  ids.forEach((id) => {
    const item = allParams.value.find((current) => current.id === id)
    if (item) item.status = status
  })
  ElMessage.success(`已${status === 'active' ? '启用' : '禁用'} ${ids.length} 个参数`)
  refresh()
}

function batchEnable() {
  const ids = selectedKeys.value.length > 0 ? selectedKeys.value : allParams.value.map((item) => item.id)
  if (selectedKeys.value.length === 0) {
    ElMessage.info('将启用所有参数')
  }
  batchUpdateStatus(ids, 'active')
}

function batchDisable() {
  if (selectedKeys.value.length === 0) {
    ElMessage.warning('请先选择要禁用的参数')
    return
  }
  batchUpdateStatus(selectedKeys.value, 'disabled')
}

async function toggleStatus(row: SystemParam, value: boolean) {
  row.status = value ? 'active' : 'disabled'
  row.updatedAt = new Date().toLocaleString('zh-CN')
  ElMessage.success(value ? '已启用' : '已禁用')
}

function remove(row: SystemParam) {
  ElMessageBox.confirm(`确认删除参数“${row.name}”？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      allParams.value = allParams.value.filter((item) => item.id !== row.id)
      refresh()
      ElMessage.success('删除成功')
    })
    .catch(() => {})
}

function removeSelected() {
  if (selectedKeys.value.length === 0) return
  allParams.value = allParams.value.filter((item) => !selectedKeys.value.includes(item.id))
  refresh()
  ElMessage.success('批量删除成功')
}

const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const formModel = ref<ConfigFormModel>(createDefaultFormModel())

function createDefaultFormModel(): ConfigFormModel {
  return {
    id: '',
    code: '',
    name: '',
    value: '',
    defaultValue: '',
    category: '',
    valueType: 'string',
    description: '',
    status: 'active'
  }
}

function handleAdd() {
  dialogMode.value = 'add'
  formModel.value = createDefaultFormModel()
  dialogVisible.value = true
}

function submitDialog() {
  const now = new Date().toLocaleString('zh-CN')
  const newParam: SystemParam = {
    id: String(Date.now()),
    code: formModel.value.code,
    name: formModel.value.name,
    value: formModel.value.value,
    defaultValue: formModel.value.defaultValue || formModel.value.value,
    description: formModel.value.description,
    category: formModel.value.category,
    valueType: formModel.value.valueType,
    status: formModel.value.status,
    updatedAt: now,
    updatedBy: '当前用户'
  }
  allParams.value.unshift(newParam)
  dialogVisible.value = false
  refresh()
  ElMessage.success('新增成功')
}

function handleSearch() {
  search()
}

function handleReset() {
  searchForm.keyword = ''
  searchForm.category = ''
  searchForm.status = ''
  search()
}

async function loadParams() {
  const response = await getSystemParams({ pageNum: 1, pageSize: 999 })
  allParams.value = response.data.list
}

loadParams().then(() => refresh())
</script>

<style scoped>
.toolbar-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.toolbar-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.param-value {
  font-family: 'Courier New', monospace;
  font-size: 13px;
}

.param-value.is-default {
  color: #909399;
}

.default-tag {
  margin-left: 6px;
  font-size: 11px;
}
</style>
