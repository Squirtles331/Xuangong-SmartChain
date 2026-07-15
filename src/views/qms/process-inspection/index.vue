<template>
  <CrudPage
    v-model:search-model="queryParams"
    title="过程检验"
    :search-columns="searchColumns"
    :columns="columns"
    :data="tableData"
    :pagination="pagination"
    :loading="loading"
    :toolbar-actions="toolbarActions"
    :table-attrs="{ border: true, stripe: true, style: 'height: 100%' }"
    @search="search"
    @reset="handleReset"
    @refresh="refresh"
    @add="openAdd"
    @toolbar-action="handleToolbarAction"
  >
    <template #source="{ row }">
      <div class="source-cell">
        <div class="source-main">{{ row.sourceCode }}</div>
        <div class="source-sub">{{ row.sourceName }}</div>
      </div>
    </template>

    <template #status="{ row }">
      <StatusTag :value="row.status" :options="statusOptions" />
    </template>

    <template #verdict="{ row }">
      <StatusTag :value="row.verdict || ''" :options="verdictOptions" />
    </template>

    <template #actions="{ row }">
      <CrudRowActions :actions="getRowActions(row)" @action="handleRowAction($event, row)" />
    </template>

    <template #dialog>
      <ProcessInspectionFormDialog v-model:visible="dialogVisible" v-model:form="formModel" :mode="dialogMode" @submit="submitDialog" />
      <ProcessInspectionExecuteDialog
        v-model:visible="executeVisible"
        v-model:items="executeItems"
        v-model:result="executeResult"
        :task="currentTask"
        @submit="submitInspect"
      />
    </template>
  </CrudPage>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormColumnItem, TableColumnItem } from 'gi-component'
import CrudPage from '@/components/crud/CrudPage/index.vue'
import CrudRowActions from '@/components/crud/CrudRowActions/index.vue'
import type { CrudRowActionItem, CrudToolbarActionItem } from '@/components/crud/types'
import StatusTag from '@/components/StatusTag.vue'
import { INSPECTION_RESULT } from '@/common/status-maps'
import { createInspectionTask, deleteInspectionTask, getInspectionTaskList, updateInspectionTask } from '@/static/services/qms'
import { useTable } from '@/hooks/useTable'
import type { InspectionCategory, InspectionTask, InspectionVerdict } from '@/types/qms'
import ProcessInspectionExecuteDialog, {
  type ProcessInspectionExecuteItem,
  type ProcessInspectionExecuteTask
} from './ProcessInspectionExecuteDialog.vue'
import ProcessInspectionFormDialog, { type ProcessInspectionFormModel } from './ProcessInspectionFormDialog.vue'

const pageTitle = '过程检验'
const pageCategory: InspectionCategory = 'process'

const toolbarActions: CrudToolbarActionItem[] = [{ key: 'export', label: '导出' }]
const statusOptions = [
  { value: 'pending', label: '待检', type: 'warning' as const },
  { value: 'in_progress', label: '检验中', type: 'primary' as const },
  { value: 'completed', label: '已完成', type: 'success' as const }
]
const verdictOptions = [{ value: '', label: '待判定', type: 'info' as const }, ...INSPECTION_RESULT]

const queryParams = ref({
  code: '',
  material: '',
  sourceCode: '',
  status: ''
})

const searchColumns: FormColumnItem[] = [
  { type: 'input', label: '检验单号', field: 'code', props: { clearable: true } as any },
  { type: 'input', label: '物料名称', field: 'material', props: { clearable: true } as any },
  { type: 'input', label: '工序任务号', field: 'sourceCode', props: { clearable: true } as any },
  {
    type: 'select-v2',
    label: '状态',
    field: 'status',
    props: {
      options: statusOptions.map((item) => ({ label: item.label, value: item.value })),
      clearable: true
    } as any
  }
]

const columns: TableColumnItem<InspectionTask>[] = [
  { prop: 'code', label: '检验单号', width: 160 },
  { prop: 'material', label: '物料名称', minWidth: 160 },
  { prop: 'operationName', label: '工序', minWidth: 140 },
  { label: '工序任务号', minWidth: 200, slotName: 'source' },
  { prop: 'qty', label: '数量', width: 90, align: 'center' },
  { prop: 'templateName', label: '检验模板', minWidth: 150 },
  { label: '状态', width: 100, slotName: 'status', align: 'center' },
  { label: '判定', width: 120, slotName: 'verdict', align: 'center' },
  { label: '操作', minWidth: 180, slotName: 'actions', align: 'center', fixed: 'right' }
]

const { tableData, pagination, loading, search, refresh, onDelete } = useTable<InspectionTask>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const response = await getInspectionTaskList({
      pageNum: page,
      pageSize: size,
      category: pageCategory,
      code: queryParams.value.code || undefined,
      material: queryParams.value.material || undefined,
      sourceCode: queryParams.value.sourceCode || undefined,
      status: queryParams.value.status || undefined
    })
    return response.data
  },
  deleteAPI: (ids) => Promise.all(ids.map((id) => deleteInspectionTask(id)))
})

const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const formModel = ref<ProcessInspectionFormModel>(createDefaultForm())
const executeVisible = ref(false)
const currentTask = ref<ProcessInspectionExecuteTask | null>(null)
const executeItems = ref<ProcessInspectionExecuteItem[]>([])
const executeResult = ref<Exclude<InspectionVerdict, ''>>('pass')

function createDefaultForm(): ProcessInspectionFormModel {
  return {
    id: '',
    code: '',
    category: pageCategory,
    material: '',
    lot: '',
    qty: 1,
    status: 'pending',
    verdict: '',
    sourceCode: '',
    sourceName: '',
    sourceType: 'operation',
    templateName: '泵体过程检验模板',
    supplier: '',
    warehouse: '',
    workOrderCode: '',
    operationName: '',
    createdAt: '2026-07-15 09:00',
    items: [
      { name: '尺寸偏差', type: 'measure', standard: '100.0', required: true },
      { name: '硬度', type: 'measure', standard: '45.0', required: true },
      { name: '表面状态', type: 'sensory', standard: '无磕碰', required: true }
    ]
  }
}

function handleReset() {
  queryParams.value = {
    code: '',
    material: '',
    sourceCode: '',
    status: ''
  }
  search()
}

function handleToolbarAction(action: string) {
  if (action === 'export') {
    ElMessage.success(`${pageTitle}静态数据已导出`)
  }
}

function openAdd() {
  dialogMode.value = 'add'
  formModel.value = createDefaultForm()
  dialogVisible.value = true
}

function openEdit(row: InspectionTask) {
  dialogMode.value = 'edit'
  formModel.value = {
    ...row,
    items: row.items.map((item) => ({ ...item }))
  }
  dialogVisible.value = true
}

function getRowActions(row: InspectionTask): CrudRowActionItem[] {
  return [
    { key: 'inspect', label: row.status === 'completed' ? '复核' : '检验', tone: 'primary' },
    { key: 'edit', label: '编辑', tone: 'primary' },
    { key: 'delete', label: '删除', tone: 'danger' }
  ]
}

function handleRowAction(action: string, row: InspectionTask) {
  if (action === 'inspect') {
    inspect(row)
    return
  }

  if (action === 'edit') {
    openEdit(row)
    return
  }

  if (action === 'delete') {
    onDelete(row)
  }
}

async function submitDialog() {
  if (dialogMode.value === 'add') {
    await createInspectionTask(formModel.value)
    ElMessage.success('新增成功')
  } else {
    await updateInspectionTask(formModel.value.id, formModel.value)
    ElMessage.success('编辑成功')
  }

  dialogVisible.value = false
  await refresh()
}

function inspect(row: InspectionTask) {
  currentTask.value = {
    code: row.code,
    material: row.material,
    sourceCode: row.sourceCode,
    sourceName: row.sourceName,
    templateName: row.templateName
  }
  executeItems.value = row.items.map((item) => ({
    name: item.name,
    standard: item.standard,
    value: ''
  }))
  executeResult.value = row.verdict ? row.verdict : 'pass'
  executeVisible.value = true
}

async function submitInspect() {
  if (!currentTask.value) return

  const target = tableData.value.find((item) => item.code === currentTask.value?.code)
  if (!target) return

  await updateInspectionTask(target.id, {
    status: 'completed',
    verdict: executeResult.value
  })

  executeVisible.value = false
  ElMessage.success(`检验完成：${verdictLabel(executeResult.value)}`)
  await refresh()
}

function verdictLabel(value: Exclude<InspectionVerdict, ''>) {
  return verdictOptions.find((item) => item.value === value)?.label || value
}
</script>

<style scoped>
.source-cell {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.source-main {
  color: var(--el-text-color-primary);
}

.source-sub {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}
</style>
