<template>
  <CrudPage
    v-model:search-model="queryParams"
    title="复检与关闭列表"
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
    <template #status="{ row }">
      <StatusTag :value="row.status" :options="statusOptions" />
    </template>
    <template #result="{ row }">
      <StatusTag :value="row.result" :options="resultOptions" />
    </template>
    <template #actions="{ row }">
      <CrudRowActions :actions="rowActions" @action="handleRowAction($event, row)" />
    </template>
    <template #dialog>
      <ReInspectionDialog v-model:visible="dialogVisible" v-model:form="formModel" :mode="dialogMode" @submit="submitDialog" />
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
import { createReInspection, deleteReInspection, getReInspectionList, updateReInspection } from '@/static/services/qms'
import { useTable } from '@/hooks/useTable'
import type { ReInspectionRecord } from '@/types/qms'
import ReInspectionDialog from './ReInspectionDialog.vue'

const toolbarActions: CrudToolbarActionItem[] = [{ key: 'export', label: '导出' }]
const rowActions: CrudRowActionItem[] = [
  { key: 'edit', label: '编辑', tone: 'primary' },
  { key: 'delete', label: '删除', tone: 'danger' }
]
const statusOptions = [
  { value: 'pending', label: '待复检', type: 'warning' as const },
  { value: 'executing', label: '处理中', type: 'primary' as const },
  { value: 'closed', label: '已关闭', type: 'success' as const }
]
const resultOptions = [
  { value: 'pending', label: '待确认', type: 'info' as const },
  { value: 'pass', label: '通过', type: 'success' as const },
  { value: 'fail', label: '失败', type: 'danger' as const }
]

const queryParams = ref({ code: '', status: '', result: '' })
const searchColumns: FormColumnItem[] = [
  { type: 'input', label: '关闭单号 / 检验单号', field: 'code', props: { clearable: true } as any },
  {
    type: 'select-v2',
    label: '状态',
    field: 'status',
    props: { options: statusOptions.map((item) => ({ label: item.label, value: item.value })), clearable: true } as any
  },
  {
    type: 'select-v2',
    label: '结果',
    field: 'result',
    props: { options: resultOptions.map((item) => ({ label: item.label, value: item.value })), clearable: true } as any
  }
]
const columns: TableColumnItem<ReInspectionRecord>[] = [
  { prop: 'code', label: '关闭单号', width: 160 },
  { prop: 'inspectionCode', label: '检验单号', width: 160 },
  { prop: 'material', label: '物料名称', minWidth: 150 },
  { prop: 'previousDecision', label: '前序裁决', width: 120 },
  { label: '状态', width: 100, slotName: 'status', align: 'center' },
  { label: '结果', width: 100, slotName: 'result', align: 'center' },
  { prop: 'unlockAction', label: '解锁动作', minWidth: 220 },
  { label: '操作', minWidth: 160, slotName: 'actions', align: 'center', fixed: 'right' }
]

const { tableData, pagination, loading, search, refresh, onDelete } = useTable<ReInspectionRecord>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const response = await getReInspectionList({
      pageNum: page,
      pageSize: size,
      code: queryParams.value.code || undefined,
      status: queryParams.value.status || undefined,
      result: queryParams.value.result || undefined
    })
    return response.data
  },
  deleteAPI: (ids) => Promise.all(ids.map((id) => deleteReInspection(id)))
})

const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const formModel = ref<ReInspectionRecord>({
  id: '',
  code: '',
  sourceCode: '',
  inspectionCode: '',
  material: '',
  previousDecision: '',
  unlockAction: '',
  owner: '',
  status: 'pending',
  result: 'pending',
  createdAt: '2026-07-15 09:00'
})

function handleReset() {
  queryParams.value = { code: '', status: '', result: '' }
  search()
}

function handleToolbarAction(action: string) {
  if (action === 'export') ElMessage.success('复检与关闭静态数据已导出')
}

function openAdd() {
  dialogMode.value = 'add'
  formModel.value = {
    id: '',
    code: '',
    sourceCode: '',
    inspectionCode: '',
    material: '',
    previousDecision: '',
    unlockAction: '',
    owner: '',
    status: 'pending',
    result: 'pending',
    createdAt: '2026-07-15 09:00'
  }
  dialogVisible.value = true
}

function handleRowAction(action: string, row: ReInspectionRecord) {
  if (action === 'edit') {
    dialogMode.value = 'edit'
    formModel.value = { ...row }
    dialogVisible.value = true
  }
  if (action === 'delete') onDelete(row)
}

async function submitDialog() {
  if (dialogMode.value === 'add') {
    await createReInspection(formModel.value)
    ElMessage.success('新增成功')
  } else {
    await updateReInspection(formModel.value.id, formModel.value)
    ElMessage.success('编辑成功')
  }
  dialogVisible.value = false
  await refresh()
}
</script>
