<template>
  <gi-page-layout>
    <template #header>
      <gi-form v-model="searchForm" :columns="searchColumns" search @search="handleSearch" @reset="handleReset" />
    </template>

    <template #tool>
      <div class="toolbar-left">
        <el-button type="primary" :icon="Plus" @click="handleAdd">新增参数</el-button>
        <el-button :icon="Refresh" @click="loadParams">刷新</el-button>
      </div>
      <div class="toolbar-right">
        <el-button type="success" :icon="Select" plain @click="batchEnable">批量启用</el-button>
        <el-button type="warning" :icon="CloseBold" plain @click="batchDisable">批量禁用</el-button>
        <el-button type="danger" :icon="Delete" plain :disabled="selectedIds.length === 0" @click="batchDelete">批量删除</el-button>
      </div>
    </template>

    <gi-table :columns="columns" :data="pagedData" :pagination="pagination" border stripe @selection-change="handleSelectionChange">
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
          <el-button type="danger" link size="small" @click="handleDelete(row)">删除</el-button>
        </template>
      </template>
    </gi-table>

    <!-- 新增/编辑弹窗 -->
    <gi-dialog v-model="dialogVisible" :title="dialogTitle" width="560px" @confirm="submitForm" @cancel="dialogVisible = false">
      <gi-form ref="formRef" v-model="formData" :columns="formColumns" label-width="100px" />
    </gi-dialog>
  </gi-page-layout>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from 'vue'
import type { FormColumnItem, TableColumnItem } from 'gi-component'
import { Plus, Refresh, Select, CloseBold, Delete } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getSystemParams, updateSystemParam, batchUpdateSystemParams, resetSystemParam, type SystemParam } from '@/api/system'

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

// ==================== 数据 ====================
const allParams = ref<SystemParam[]>([])

const filteredData = computed(() => {
  return allParams.value.filter((item) => {
    if (searchForm.keyword) {
      const kw = searchForm.keyword.toLowerCase()
      if (!item.name.toLowerCase().includes(kw) && !item.code.toLowerCase().includes(kw)) {
        return false
      }
    }
    if (searchForm.category && item.category !== searchForm.category) return false
    if (searchForm.status && item.status !== searchForm.status) return false
    return true
  })
})

const pagination = reactive({ currentPage: 1, pageSize: 15, total: 0 })

const pagedData = computed(() => {
  const start = (pagination.currentPage - 1) * pagination.pageSize
  return filteredData.value.slice(start, start + pagination.pageSize)
})

watch(
  filteredData,
  (val) => {
    pagination.total = val.length
    if (pagination.currentPage > 1 && pagedData.value.length === 0) {
      pagination.currentPage = 1
    }
  },
  { immediate: true }
)

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
    let saveValue: string
    if (row.value_type === 'boolean') {
      saveValue = String(editingValue.value)
    } else if (row.value_type === 'number') {
      saveValue = String(editingValue.value)
    } else {
      saveValue = String(editingValue.value)
    }

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
const selectedIds = ref<string[]>([])

function handleSelectionChange(rows: SystemParam[]) {
  selectedIds.value = rows.map((r) => r.id)
}

function batchEnable() {
  const ids = selectedIds.value.length > 0 ? selectedIds.value : allParams.value.map((p) => p.id)
  if (selectedIds.value.length === 0) {
    ElMessage.info('将启用所有参数')
  }
  batchUpdateStatus(ids, 'active')
}

function batchDisable() {
  if (selectedIds.value.length === 0) {
    ElMessage.warning('请先选择要禁用的参数')
    return
  }
  batchUpdateStatus(selectedIds.value, 'disabled')
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
  } catch {
    // 拦截器已处理
  }
}

function batchDelete() {
  ElMessageBox.confirm(`确认删除选中的 ${selectedIds.value.length} 个参数？此操作不可恢复！`, '危险操作', {
    confirmButtonText: '确定删除',
    cancelButtonText: '取消',
    type: 'error'
  })
    .then(() => {
      allParams.value = allParams.value.filter((p) => !selectedIds.value.includes(p.id))
      selectedIds.value = []
      ElMessage.success('删除成功')
    })
    .catch(() => {
      // 取消
    })
}

async function handleDelete(row: SystemParam) {
  try {
    await ElMessageBox.confirm(`确认删除参数「${row.name}」？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    allParams.value = allParams.value.filter((p) => p.id !== row.id)
    ElMessage.success('删除成功')
  } catch {
    // 取消
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

// ==================== 新增/编辑弹窗 ====================
const dialogVisible = ref(false)
const dialogTitle = ref('新增参数')
const isEdit = ref(false)
const formRef = ref()

const formData = reactive({
  code: '',
  name: '',
  value: '',
  default_value: '',
  category: '',
  value_type: 'string' as SystemParam['value_type'],
  description: '',
  status: 'active' as SystemParam['status']
})

const formColumns: FormColumnItem[] = [
  {
    type: 'input',
    label: '参数编码',
    field: 'code',
    props: { placeholder: '唯一标识，如: login_lock_count' },
    rules: [{ required: true, message: '请输入参数编码', trigger: 'blur' }]
  },
  {
    type: 'input',
    label: '参数名称',
    field: 'name',
    props: { placeholder: '如: 登录失败锁定次数' },
    rules: [{ required: true, message: '请输入参数名称', trigger: 'blur' }]
  },
  {
    type: 'select-v2',
    label: '所属分类',
    field: 'category',
    props: {
      options: Object.entries(CATEGORIES).map(([k, v]) => ({ label: v, value: k })),
      placeholder: '请选择分类'
    },
    rules: [{ required: true, message: '请选择分类', trigger: 'change' }]
  },
  {
    type: 'select-v2',
    label: '值类型',
    field: 'value_type',
    props: {
      options: [
        { label: '字符串', value: 'string' },
        { label: '数字', value: 'number' },
        { label: '布尔值', value: 'boolean' },
        { label: 'JSON', value: 'json' }
      ]
    },
    rules: [{ required: true, message: '请选择值类型', trigger: 'change' }]
  },
  {
    type: 'input',
    label: '参数值',
    field: 'value',
    props: { placeholder: '当前值' },
    rules: [{ required: true, message: '请输入参数值', trigger: 'blur' }]
  },
  {
    type: 'input',
    label: '默认值',
    field: 'default_value',
    props: { placeholder: '系统默认值' }
  },
  {
    type: 'input',
    label: '描述',
    field: 'description',
    props: { type: 'textarea', rows: 2, placeholder: '参数用途说明' }
  }
]

function handleAdd() {
  isEdit.value = false
  dialogTitle.value = '新增参数'
  Object.assign(formData, {
    code: '',
    name: '',
    value: '',
    default_value: '',
    category: '',
    value_type: 'string',
    description: '',
    status: 'active'
  })
  dialogVisible.value = true
}

function submitForm() {
  if (!formRef.value) return
  formRef.value.validate().then((valid: boolean) => {
    if (!valid) return

    const now = new Date().toLocaleString('zh-CN')
    const newParam: SystemParam = {
      id: String(Date.now()),
      code: formData.code,
      name: formData.name,
      value: formData.value,
      default_value: formData.default_value || formData.value,
      description: formData.description,
      category: formData.category,
      value_type: formData.value_type,
      status: formData.status,
      updated_at: now,
      updated_by: '当前用户'
    }

    allParams.value.unshift(newParam)
    dialogVisible.value = false
    ElMessage.success('新增成功')
  })
}

// ==================== 搜索处理 ====================
function handleSearch() {
  pagination.currentPage = 1
}
function handleReset() {
  searchForm.keyword = ''
  searchForm.category = ''
  searchForm.status = ''
  pagination.currentPage = 1
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

onMounted(() => {
  loadParams()
})
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
