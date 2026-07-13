<template>
  <CrudPage
    v-model:search-model="queryParams"
    title="参数配置"
    :search-columns="searchColumns"
    :search-grid-item-props="searchGridItemProps"
    :columns="columns"
    :data="tableData"
    :pagination="pagination"
    :loading="loading"
    @search="search"
    @reset="handleReset"
    @refresh="refresh"
    @add="openAdd"
  >
    <template #status="{ row }">
      <StatusTag :value="row.status" :options="statusOptions" />
    </template>

    <template #category="{ row }">
      <el-tag effect="plain">{{ row.category }}</el-tag>
    </template>

    <template #actions="{ row }">
      <CrudRowActions :actions="rowActions" @action="handleRowAction($event, row)" />
    </template>

    <template #dialog>
      <ParamFormDialog v-model:visible="dialogVisible" v-model:form="formModel" :mode="dialogMode" @submit="submitDialog" />
    </template>
  </CrudPage>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormColumnItem, TableColumnItem } from 'gi-component'
import StatusTag from '@/components/StatusTag.vue'
import CrudPage from '@/components/crud/CrudPage/index.vue'
import CrudRowActions from '@/components/crud/CrudRowActions/index.vue'
import type { CrudRowActionItem } from '@/components/crud/types'
import { useTable } from '@/hooks/useTable'
import ParamFormDialog, { type ParamFormModel } from './ParamFormDialog.vue'

interface ParamRecord {
  id: string
  code: string
  name: string
  value: string
  category: string
  description: string
  status: 'active' | 'inactive'
}

const statusOptions = [
  { label: '启用', value: 'active', type: 'success' as const },
  { label: '停用', value: 'inactive', type: 'info' as const }
]

const paramRecords = ref<ParamRecord[]>([
  {
    id: 'P-001',
    code: 'sys.default-theme',
    name: '默认主题',
    value: '工业蓝灰',
    category: '界面配置',
    description: '系统首次登录默认采用的主题方案。',
    status: 'active'
  },
  {
    id: 'P-002',
    code: 'sys.workbench-cycle',
    name: '工作台刷新周期',
    value: '15分钟',
    category: '运行配置',
    description: '用于静态工作台模块的指标刷新展示说明。',
    status: 'active'
  },
  {
    id: 'P-003',
    code: 'mes.report-timeout',
    name: '报工超时阈值',
    value: '30分钟',
    category: 'MES配置',
    description: '超出该时长的未完工报工将进入异常跟踪池。',
    status: 'active'
  },
  {
    id: 'P-004',
    code: 'wms.scan-mode',
    name: '默认扫描模式',
    value: '单据优先',
    category: 'WMS配置',
    description: '条码作业页面默认打开的扫描策略。',
    status: 'inactive'
  }
])

const searchColumns: FormColumnItem[] = [
  {
    type: 'input',
    label: '关键词',
    field: 'keyword',
    props: { placeholder: '请输入参数编码、参数名称或分类' } as never
  }
]

const searchGridItemProps = {
  span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 }
}

const columns: TableColumnItem<ParamRecord>[] = [
  { type: 'index', label: '#', width: 60 },
  { prop: 'code', label: '参数编码', minWidth: 180 },
  { prop: 'name', label: '参数名称', minWidth: 160 },
  { prop: 'value', label: '参数值', minWidth: 140 },
  { prop: 'category', label: '分类', minWidth: 120, slotName: 'category' },
  { prop: 'description', label: '说明', minWidth: 260 },
  { prop: 'status', label: '状态', minWidth: 100, slotName: 'status', align: 'center' },
  { label: '操作', minWidth: 160, fixed: 'right', slotName: 'actions', align: 'center' }
]

const queryParams = reactive({
  keyword: ''
})

const rowActions: CrudRowActionItem[] = [
  { key: 'edit', label: '编辑', tone: 'primary' },
  { key: 'delete', label: '删除', tone: 'danger' }
]

const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const formModel = ref<ParamFormModel>(createDefaultFormModel())

const filteredRecords = computed(() => {
  const keyword = queryParams.keyword.trim().toLowerCase()

  if (!keyword) {
    return paramRecords.value
  }

  return paramRecords.value.filter((item) => {
    return [item.code, item.name, item.category, item.description].some((field) => field.toLowerCase().includes(keyword))
  })
})

const { tableData, pagination, loading, search, refresh, onDelete } = useTable<ParamRecord>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const start = (page - 1) * size
    const end = start + size
    return {
      list: filteredRecords.value.slice(start, end),
      total: filteredRecords.value.length
    }
  },
  deleteAPI: async (ids) => {
    paramRecords.value = paramRecords.value.filter((item) => !ids.includes(item.id))
  }
})

function createDefaultFormModel(): ParamFormModel {
  return {
    id: '',
    code: '',
    name: '',
    value: '',
    category: '',
    description: '',
    status: 'active'
  }
}

function handleReset() {
  queryParams.keyword = ''
  search()
}

function openAdd() {
  dialogMode.value = 'add'
  formModel.value = createDefaultFormModel()
  dialogVisible.value = true
}

function openEdit(row: ParamRecord) {
  dialogMode.value = 'edit'
  formModel.value = {
    id: row.id,
    code: row.code,
    name: row.name,
    value: row.value,
    category: row.category,
    description: row.description,
    status: row.status
  }
  dialogVisible.value = true
}

function handleRowAction(action: string, row: ParamRecord) {
  if (action === 'edit') {
    openEdit(row)
    return
  }

  if (action === 'delete') {
    onDelete(row)
  }
}

async function submitDialog() {
  if (!formModel.value.code || !formModel.value.name || !formModel.value.value) {
    ElMessage.warning('请完整填写参数编码、参数名称和参数值')
    return
  }

  if (dialogMode.value === 'add') {
    paramRecords.value.unshift({
      id: `P-${String(paramRecords.value.length + 1).padStart(3, '0')}`,
      code: formModel.value.code,
      name: formModel.value.name,
      value: formModel.value.value,
      category: formModel.value.category || '未分类',
      description: formModel.value.description,
      status: formModel.value.status
    })
    ElMessage.success('已新增静态参数数据')
  } else {
    paramRecords.value = paramRecords.value.map((item) =>
      item.id === formModel.value.id
        ? {
            ...item,
            code: formModel.value.code,
            name: formModel.value.name,
            value: formModel.value.value,
            category: formModel.value.category || '未分类',
            description: formModel.value.description,
            status: formModel.value.status
          }
        : item
    )
    ElMessage.success('已更新静态参数数据')
  }

  dialogVisible.value = false
  await refresh()
}
</script>
