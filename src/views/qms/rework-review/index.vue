<template>
  <CrudPage
    v-model:search-model="queryParams"
    title="返工裁决列表"
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
    <template #decision="{ row }">
      <StatusTag :value="row.decision" :options="decisionOptions" />
    </template>
    <template #status="{ row }">
      <StatusTag :value="row.status" :options="statusOptions" />
    </template>
    <template #actions="{ row }">
      <CrudRowActions :actions="rowActions" @action="handleRowAction($event, row)" />
    </template>
    <template #dialog>
      <ReworkReviewDialog v-model:visible="dialogVisible" v-model:form="formModel" :mode="dialogMode" @submit="submitDialog" />
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
import { createReworkReview, deleteReworkReview, getReworkReviewList, updateReworkReview } from '@/static/services/qms'
import { useTable } from '@/hooks/useTable'
import type { ReworkReviewRecord } from '@/types/qms'
import ReworkReviewDialog from './ReworkReviewDialog.vue'

const toolbarActions: CrudToolbarActionItem[] = [{ key: 'export', label: '导出' }]
const rowActions: CrudRowActionItem[] = [
  { key: 'edit', label: '编辑', tone: 'primary' },
  { key: 'delete', label: '删除', tone: 'danger' }
]
const decisionOptions = [
  { value: 'pending', label: '待裁决', type: 'info' as const },
  { value: 'approved', label: '允许返工', type: 'success' as const },
  { value: 'rejected', label: '不允许返工', type: 'danger' as const }
]
const statusOptions = [
  { value: 'open', label: '待处理', type: 'warning' as const },
  { value: 'reviewing', label: '评审中', type: 'primary' as const },
  { value: 'closed', label: '已关闭', type: 'success' as const }
]

const queryParams = ref({ code: '', decision: '', status: '' })
const searchColumns: FormColumnItem[] = [
  { type: 'input', label: '裁决单号 / 工单号', field: 'code', props: { clearable: true } as any },
  {
    type: 'select-v2',
    label: '裁决结果',
    field: 'decision',
    props: { options: decisionOptions.map((item) => ({ label: item.label, value: item.value })), clearable: true } as any
  },
  {
    type: 'select-v2',
    label: '状态',
    field: 'status',
    props: { options: statusOptions.map((item) => ({ label: item.label, value: item.value })), clearable: true } as any
  }
]
const columns: TableColumnItem<ReworkReviewRecord>[] = [
  { prop: 'code', label: '裁决单号', width: 160 },
  { prop: 'ncrCode', label: '不合格单号', width: 160 },
  { prop: 'material', label: '物料名称', minWidth: 150 },
  { prop: 'workOrderCode', label: '工单号', width: 160 },
  { label: '裁决结果', width: 110, slotName: 'decision', align: 'center' },
  { label: '状态', width: 100, slotName: 'status', align: 'center' },
  { prop: 'reviewRoute', label: '返工路径', minWidth: 220 },
  { label: '操作', minWidth: 160, slotName: 'actions', align: 'center', fixed: 'right' }
]

const { tableData, pagination, loading, search, refresh, onDelete } = useTable<ReworkReviewRecord>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const response = await getReworkReviewList({
      pageNum: page,
      pageSize: size,
      code: queryParams.value.code || undefined,
      decision: queryParams.value.decision || undefined,
      status: queryParams.value.status || undefined
    })
    return response.data
  },
  deleteAPI: (ids) => Promise.all(ids.map((id) => deleteReworkReview(id)))
})

const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const formModel = ref<ReworkReviewRecord>({
  id: '',
  code: '',
  ncrCode: '',
  material: '',
  workOrderCode: '',
  sourceCode: '',
  reviewRoute: '',
  reinspectionRule: '',
  owner: '',
  status: 'open',
  decision: 'pending',
  createdAt: '2026-07-15 09:00'
})

function handleReset() {
  queryParams.value = { code: '', decision: '', status: '' }
  search()
}

function handleToolbarAction(action: string) {
  if (action === 'export') ElMessage.success('返工裁决静态数据已导出')
}

function openAdd() {
  dialogMode.value = 'add'
  formModel.value = {
    id: '',
    code: '',
    ncrCode: '',
    material: '',
    workOrderCode: '',
    sourceCode: '',
    reviewRoute: '',
    reinspectionRule: '',
    owner: '',
    status: 'open',
    decision: 'pending',
    createdAt: '2026-07-15 09:00'
  }
  dialogVisible.value = true
}

function handleRowAction(action: string, row: ReworkReviewRecord) {
  if (action === 'edit') {
    dialogMode.value = 'edit'
    formModel.value = { ...row }
    dialogVisible.value = true
  }
  if (action === 'delete') onDelete(row)
}

async function submitDialog() {
  if (dialogMode.value === 'add') {
    await createReworkReview(formModel.value)
    ElMessage.success('新增成功')
  } else {
    await updateReworkReview(formModel.value.id, formModel.value)
    ElMessage.success('编辑成功')
  }
  dialogVisible.value = false
  await refresh()
}
</script>
