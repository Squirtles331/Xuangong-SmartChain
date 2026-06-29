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
        <el-button type="danger" :icon="Delete" plain :disabled="selectedKeys.length === 0" @click="onBatchDelete">批量删除</el-button>
      </div>
    </template>

    <gi-table
      :columns="columns"
      :data="tableData"
      :pagination="pagination"
      :loading="loading"
      border
      stripe
      @selection-change="onSelectionChange"
    >
      <template #category="{ row }">
        <el-tag :type="categoryTagType(row.category)" size="small">{{ categoryLabel(row.category) }}</el-tag>
      </template>

      <template #valueCell="{ row }">
        <template v-if="editingId === row.id">
          <el-input v-if="row.value_type === 'string'" v-model="editingValue" size="small" @keyup.enter="saveEdit(row)" @keyup.escape="cancelEdit" />
          <el-input-number
            v-else-if="row.value_type === 'number'"
            v-model="editingValue"
            size="small"
            controls-position="right"
            @keyup.enter="saveEdit(row)"
          />
          <el-switch v-else-if="row.value_type === 'boolean'" v-model="editingValue" active-text="是" inactive-text="否" @change="saveEdit(row)" />
          <el-input v-else v-model="editingValue" type="textarea" size="small" :rows="2" />
        </template>
        <template v-else>
          <span class="param-value" :class="{ 'is-default': row.value === row.default_value }">
            {{ formatDisplayValue(row) }}
          </span>
          <el-tag v-if="row.value === row.default_value" type="info" size="small" class="default-tag">默认</el-tag>
        </template>
      </template>

      <template #status="{ row }">
        <el-switch
          :model-value="row.status === 'active'"
          active-text="启用"
          inactive-text="禁用"
          inline-prompt
          size="small"
          @change="(val: boolean) => toggleStatus(row, val)"
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

    <ConfigFormDialog
      v-model:visible="dialogVisible"
      v-model:form="formModel"
      :mode="dialogMode"
      @submit="submitDialog"
    />
  </gi-page-layout>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import type { FormColumnItem, TableColumnItem } from 'gi-component'
import { Plus, Refresh, Select, CloseBold, Delete } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  getSystemParams,
  updateSystemParam,
  batchUpdateSystemParams,
  resetSystemParam,
  type SystemParam
} from '@/api/system'
import { useTable } from '@/hooks/useTable'
import ConfigFormDialog, { type ConfigFormModel } from './ConfigFormDialog.vue'

// ==================== 分类配置 ====================
const CATEGORIES: Record<string, string> = {
  auth: '认证与安全',
  mrp: 'MRP计划',
  stock: '库存与仓库',
  production: '生产管理',
  finance: '财务管理',
  system: '系统通用'
}

const CATEGORY_TAG_TYPES: Record<string, 'danger' | 'warning' | 'primary' | 'success' | '' | 'info'> = {
  auth: 'danger',
  mrp: 'warning',
  stock: 'primary',
  production: 'success',
  finance: '' as const,
  system: 'info'
}

function categoryLabel(code: string) {
  return CATEGORIES[code] || code
}
function categoryTagType(code: string) {
  return CATEGORY_TAG_TYPES[code] || 'info'
}

// ==================== 搜索 ====================
const searchForm = reactive({ keyword: '', category: '', status: '' })

const searchColumns: FormColumnItem[] = [
  {
    type: 'input',
    label: '关键字',
    field: 'keyword',
    props: { placeholder: '参数名称/编码', clearable: true }
  },
  {
    type: 'select-v2',
    label: '分类',
    field: 'category',
    props: {
      options: [{ label: '全部', value: '' }, ...Object.entries(CATEGORIES).map(([k, v]) => ({ label: v, value: k }))],
      clearable: true
    }
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
    }
  }
]

// ==================== 表格列 ====================
const columns: TableColumnItem<SystemParam>[] = [
  { type: 'selection', width: 50 },
  { type: 'index', label: '#', width: 60 },
  { prop: 'code', label: '参数编码', width: 180, showOverflowTooltip: true },
  { prop: 'name', label: '参数名称', width: 180 },
  { label: '分类', width: 120, slotName: 'category', align: 'center' },
  { label: '参数值', minWidth: 200, slotName: 'valueCell' },
  { prop: 'description', label: '描述', minWidth: 200, showOverflowTooltip: true },
  { label: '状态', width: 100, slotName: 'status', align: 'center' },
  { prop: 'updated_at', label: '更新时间', width: 170 },
  { prop: 'updated_by', label: '更新人', width: 100 },
  { label: '操作', width: 220, fixed: 'right', slotName: 'actions', align: 'center' }
]

// ==================== useTable ====================
const allParams = ref<SystemParam[]>([])

const { tableData, pagination, loading, search, refresh, onDelete, onBatchDelete, onSelectionChange, selectedKeys } = useTable<SystemParam>({
  rowKey: 'id',
  immediate: false,
  listAPI: async ({ page, size }) => {
    let filtered = allParams.value
    if (searchForm.keyword) {
      const kw = searchForm.keyword.toLowerCase()
      filtered = filtered.filter((item) => item.name.toLowerCase().includes(kw) || item.code.toLowerCase().includes(kw))
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

// ==================== 编辑状态 ====================
const editingId = ref<string | null>(null)
const editingValue = ref<any>('')

function startEdit(row: SystemParam) {
  editingId.value = row.id
  if (row.value_type === 'boolean') {
    editingValue.value = row.value === 'true' || row.value === '1'
  } else if (row.value_type === 'number') {
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
  try {
    const saveValue = String(editingValue.value)
    await updateSystemParam(row.id, saveValue)
    row.value = saveValue
    row.updated_at = new Date().toLocaleString('zh-CN')
    ElMessage.success('保存成功')
    editingId.value = null
  } catch {
    // 拦截器已处理
  }
}

async function resetToDefault(row: SystemParam) {
  try {
    await ElMessageBox.confirm(`确认将「${row.name}」恢复为默认值「${row.default_value}」？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await resetSystemParam(row.id)
    row.value = row.default_value
    row.updated_at = new Date().toLocaleString('zh-CN')
    ElMessage.success('已恢复默认值')
  } catch {
    // 用户取消
  }
}

function formatDisplayValue(row: SystemParam): string {
  if (row.value_type === 'boolean') {
    return row.value === 'true' || row.value === '1' ? '是' : '否'
  }
  return row.value
}

// ==================== 批量操作 ====================
function batchEnable() {
  const ids = selectedKeys.value.length > 0 ? selectedKeys.value : allParams.value.map((p) => p.id)
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

async function batchUpdateStatus(ids: string[], status: string) {
  try {
    const updates = ids.map((id) => ({ id, value: status }))
    await batchUpdateSystemParams(updates)
    ids.forEach((id) => {
      const p = allParams.value.find((item) => item.id === id)
      if (p) p.status = status as SystemParam['status']
    })
    ElMessage.success(`已${status === 'active' ? '启用' : '禁用'} ${ids.length} 个参数`)
    refresh()
  } catch {
    // 拦截器已处理
  }
}

// ==================== 状态切换 ====================
async function toggleStatus(row: SystemParam, val: boolean) {
  const newStatus = val ? 'active' : 'disabled'
  try {
    await updateSystemParam(row.id, newStatus === 'active' ? row.value : '')
    row.status = newStatus as SystemParam['status']
    ElMessage.success(newStatus === 'active' ? '已启用' : '已禁用')
  } catch {
    // 拦截器已处理
  }
}

// ==================== 删除 ====================
function remove(row: SystemParam) {
  ElMessageBox.confirm(`确认删除参数「${row.name}」？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    allParams.value = allParams.value.filter((p) => p.id !== row.id)
    refresh()
    ElMessage.success('删除成功')
  }).catch(() => {
    // 取消
  })
}

// ==================== 对话框 ====================
const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const formModel = ref<ConfigFormModel>(createDefaultFormModel())

function createDefaultFormModel(): ConfigFormModel {
  return {
    id: '',
    code: '',
    name: '',
    value: '',
    default_value: '',
    category: '',
    value_type: 'string',
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
    default_value: formModel.value.default_value || formModel.value.value,
    description: formModel.value.description,
    category: formModel.value.category,
    value_type: formModel.value.value_type,
    status: formModel.value.status,
    updated_at: now,
    updated_by: '当前用户'
  }

  allParams.value.unshift(newParam)
  dialogVisible.value = false
  refresh()
  ElMessage.success('新增成功')
}

// ==================== 搜索处理 ====================
function handleSearch() {
  search()
}
function handleReset() {
  searchForm.keyword = ''
  searchForm.category = ''
  searchForm.status = ''
  search()
}

// ==================== 数据加载 ====================
async function loadParams() {
  try {
    const res = await getSystemParams({ page: 1, page_size: 999 })
    const data = res.data
    if (data && Array.isArray(data.items)) {
      allParams.value = data.items as SystemParam[]
    } else if (Array.isArray(data)) {
      allParams.value = data as SystemParam[]
    } else {
      allParams.value = []
    }
  } catch {
    allParams.value = []
  }
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
