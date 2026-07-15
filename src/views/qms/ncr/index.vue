<template>
  <CrudPage
    v-model:search-model="queryParams"
    title="不合格处置列表"
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
    <template #severity="{ row }">
      <StatusTag :value="row.severity" :options="severityOptions" />
    </template>

    <template #disposition="{ row }">
      <StatusTag :value="row.disposition" :options="dispositionOptions" />
    </template>

    <template #status="{ row }">
      <StatusTag :value="row.status" :options="statusOptions" />
    </template>

    <template #actions="{ row }">
      <CrudRowActions :actions="getRowActions(row)" @action="handleRowAction($event, row)" />
    </template>

    <template #dialog>
      <NcrDecisionDialog v-model:visible="dialogVisible" v-model:form="formModel" :mode="dialogMode" @submit="submitDialog" />
    </template>
  </CrudPage>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormColumnItem, TableColumnItem } from 'gi-component'
import StatusTag from '@/components/StatusTag.vue'
import CrudPage from '@/components/crud/CrudPage/index.vue'
import CrudRowActions from '@/components/crud/CrudRowActions/index.vue'
import type { CrudRowActionItem, CrudToolbarActionItem } from '@/components/crud/types'
import { createNcr, deleteNcr, getNcrList, updateNcr } from '@/static/services/qms'
import { useTable } from '@/hooks/useTable'
import type { NonconformanceRecord } from '@/types/qms'
import NcrDecisionDialog from './NcrDecisionDialog.vue'

const toolbarActions: CrudToolbarActionItem[] = [{ key: 'export', label: '导出' }]
const severityOptions = [
  { value: 'critical', label: '严重', type: 'danger' as const },
  { value: 'major', label: '主要', type: 'warning' as const },
  { value: 'minor', label: '次要', type: 'info' as const }
]
const statusOptions = [
  { value: 'open', label: '待处理', type: 'warning' as const },
  { value: 'reviewing', label: '处理中', type: 'primary' as const },
  { value: 'closed', label: '已关闭', type: 'success' as const }
]
const dispositionOptions = [
  { value: 'pending', label: '待裁决', type: 'info' as const },
  { value: 'rework', label: '返工', type: 'danger' as const },
  { value: 'scrap', label: '报废', type: 'danger' as const },
  { value: 'concession', label: '让步接收', type: 'warning' as const },
  { value: 'reinspect', label: '复检', type: 'primary' as const }
]

const queryParams = ref({
  code: '',
  inspectionCode: '',
  status: '',
  disposition: ''
})

const searchColumns: FormColumnItem[] = [
  { type: 'input', label: '处置单号', field: 'code', props: { clearable: true } as any },
  { type: 'input', label: '检验单号', field: 'inspectionCode', props: { clearable: true } as any },
  {
    type: 'select-v2',
    label: '处理状态',
    field: 'status',
    props: {
      options: statusOptions.map((item) => ({ label: item.label, value: item.value })),
      clearable: true
    } as any
  },
  {
    type: 'select-v2',
    label: '裁决动作',
    field: 'disposition',
    props: {
      options: dispositionOptions.map((item) => ({ label: item.label, value: item.value })),
      clearable: true
    } as any
  }
]

const columns: TableColumnItem<NonconformanceRecord>[] = [
  { prop: 'code', label: '处置单号', width: 160 },
  { prop: 'inspectionCode', label: '检验单号', width: 160 },
  { prop: 'material', label: '物料名称', minWidth: 160 },
  { prop: 'sourceCode', label: '来源单号', width: 150 },
  { label: '严重等级', width: 100, slotName: 'severity', align: 'center' },
  { label: '裁决动作', width: 120, slotName: 'disposition', align: 'center' },
  { label: '处理状态', width: 100, slotName: 'status', align: 'center' },
  { prop: 'followUp', label: '后续动作', minWidth: 160 },
  { label: '操作', minWidth: 180, slotName: 'actions', align: 'center', fixed: 'right' }
]

const { tableData, pagination, loading, search, refresh, onDelete } = useTable<NonconformanceRecord>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const response = await getNcrList({
      pageNum: page,
      pageSize: size,
      code: queryParams.value.code || undefined,
      inspectionCode: queryParams.value.inspectionCode || undefined,
      status: queryParams.value.status || undefined,
      disposition: queryParams.value.disposition || undefined
    })
    return response.data
  },
  deleteAPI: (ids) => Promise.all(ids.map((id) => deleteNcr(id)))
})

const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit' | 'judge'>('add')
const formModel = ref<NonconformanceRecord>(createDefaultForm())

function createDefaultForm(): NonconformanceRecord {
  return {
    id: '',
    code: '',
    inspectionCode: '',
    inspectionCategory: 'incoming',
    material: '',
    sourceCode: '',
    sourceType: 'receipt',
    severity: 'major',
    status: 'open',
    disposition: 'pending',
    owner: '',
    issueDesc: '',
    followUp: '',
    createdAt: '2026-07-15 09:00'
  }
}

function handleReset() {
  queryParams.value = {
    code: '',
    inspectionCode: '',
    status: '',
    disposition: ''
  }
  search()
}

function handleToolbarAction(action: string) {
  if (action === 'export') {
    ElMessage.success('不合格处置静态数据已导出')
  }
}

function openAdd() {
  dialogMode.value = 'add'
  formModel.value = createDefaultForm()
  dialogVisible.value = true
}

function openEdit(row: NonconformanceRecord) {
  dialogMode.value = 'edit'
  formModel.value = { ...row }
  dialogVisible.value = true
}

function openJudge(row: NonconformanceRecord) {
  dialogMode.value = 'judge'
  formModel.value = {
    ...row,
    status: row.status === 'open' ? 'reviewing' : row.status
  }
  dialogVisible.value = true
}

function getRowActions(row: NonconformanceRecord): CrudRowActionItem[] {
  return [
    { key: 'judge', label: row.status === 'closed' ? '查看' : '裁决', tone: 'primary' },
    { key: 'edit', label: '编辑', tone: 'primary' },
    { key: 'delete', label: '删除', tone: 'danger' }
  ]
}

function handleRowAction(action: string, row: NonconformanceRecord) {
  if (action === 'judge') {
    openJudge(row)
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
  const payload = {
    ...formModel.value,
    status:
      dialogMode.value === 'judge' && formModel.value.disposition !== 'pending'
        ? formModel.value.status === 'open'
          ? 'reviewing'
          : formModel.value.status
        : formModel.value.status
  }

  if (dialogMode.value === 'add') {
    await createNcr(payload)
    ElMessage.success('新增成功')
  } else {
    await updateNcr(formModel.value.id, payload)
    ElMessage.success(dialogMode.value === 'judge' ? '裁决已保存' : '编辑成功')
  }

  dialogVisible.value = false
  await refresh()
}
</script>
