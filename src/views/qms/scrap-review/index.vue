<template>
  <CrudPage
    v-model:search-model="queryParams"
    title="报废裁决列表"
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
    <template #actions="{ row }">
      <CrudRowActions :actions="rowActions" @action="handleRowAction($event, row)" />
    </template>
    <template #dialog>
      <ScrapReviewDialog v-model:visible="dialogVisible" v-model:form="formModel" :mode="dialogMode" @submit="submitDialog" />
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
import { createScrapReview, deleteScrapReview, getScrapReviewList, updateScrapReview } from '@/static/services/qms'
import { useTable } from '@/hooks/useTable'
import type { ScrapReviewRecord } from '@/types/qms'
import ScrapReviewDialog from './ScrapReviewDialog.vue'

const toolbarActions: CrudToolbarActionItem[] = [{ key: 'export', label: '导出' }]
const rowActions: CrudRowActionItem[] = [
  { key: 'edit', label: '编辑', tone: 'primary' },
  { key: 'delete', label: '删除', tone: 'danger' }
]
const statusOptions = [
  { value: 'pending', label: '待审批', type: 'warning' as const },
  { value: 'approved', label: '已批准', type: 'success' as const },
  { value: 'closed', label: '已关闭', type: 'info' as const }
]

const queryParams = ref({ code: '', status: '' })
const searchColumns: FormColumnItem[] = [
  { type: 'input', label: '裁决单号 / 不合格单号', field: 'code', props: { clearable: true } as any },
  {
    type: 'select-v2',
    label: '状态',
    field: 'status',
    props: { options: statusOptions.map((item) => ({ label: item.label, value: item.value })), clearable: true } as any
  }
]
const columns: TableColumnItem<ScrapReviewRecord>[] = [
  { prop: 'code', label: '裁决单号', width: 160 },
  { prop: 'ncrCode', label: '不合格单号', width: 160 },
  { prop: 'material', label: '物料名称', minWidth: 150 },
  { prop: 'qty', label: '报废数量', width: 100, align: 'center' },
  { prop: 'lossAmount', label: '损失金额', width: 120, align: 'right' },
  { label: '状态', width: 100, slotName: 'status', align: 'center' },
  { prop: 'reason', label: '报废原因', minWidth: 220 },
  { label: '操作', minWidth: 160, slotName: 'actions', align: 'center', fixed: 'right' }
]

const { tableData, pagination, loading, search, refresh, onDelete } = useTable<ScrapReviewRecord>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const response = await getScrapReviewList({
      pageNum: page,
      pageSize: size,
      code: queryParams.value.code || undefined,
      status: queryParams.value.status || undefined
    })
    return response.data
  },
  deleteAPI: (ids) => Promise.all(ids.map((id) => deleteScrapReview(id)))
})

const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const formModel = ref<ScrapReviewRecord>({
  id: '',
  code: '',
  ncrCode: '',
  material: '',
  sourceCode: '',
  reason: '',
  qty: 1,
  lossAmount: 0,
  owner: '',
  status: 'pending',
  createdAt: '2026-07-15 09:00'
})

function handleReset() {
  queryParams.value = { code: '', status: '' }
  search()
}

function handleToolbarAction(action: string) {
  if (action === 'export') ElMessage.success('报废裁决静态数据已导出')
}

function openAdd() {
  dialogMode.value = 'add'
  formModel.value = {
    id: '',
    code: '',
    ncrCode: '',
    material: '',
    sourceCode: '',
    reason: '',
    qty: 1,
    lossAmount: 0,
    owner: '',
    status: 'pending',
    createdAt: '2026-07-15 09:00'
  }
  dialogVisible.value = true
}

function handleRowAction(action: string, row: ScrapReviewRecord) {
  if (action === 'edit') {
    dialogMode.value = 'edit'
    formModel.value = { ...row }
    dialogVisible.value = true
  }
  if (action === 'delete') onDelete(row)
}

async function submitDialog() {
  if (dialogMode.value === 'add') {
    await createScrapReview(formModel.value)
    ElMessage.success('新增成功')
  } else {
    await updateScrapReview(formModel.value.id, formModel.value)
    ElMessage.success('编辑成功')
  }
  dialogVisible.value = false
  await refresh()
}
</script>
