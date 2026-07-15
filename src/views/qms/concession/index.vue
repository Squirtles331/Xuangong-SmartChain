<template>
  <CrudPage
    v-model:search-model="queryParams"
    title="特采放行列表"
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
      <ConcessionFormDialog v-model:visible="dialogVisible" v-model:form="formModel" :mode="dialogMode" @submit="submitDialog" />
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
import { createConcession, deleteConcession, getConcessionList, updateConcession } from '@/static/services/qms'
import { useTable } from '@/hooks/useTable'
import type { ConcessionRecord } from '@/types/qms'
import ConcessionFormDialog from './ConcessionFormDialog.vue'

const toolbarActions: CrudToolbarActionItem[] = [{ key: 'export', label: '导出' }]
const rowActions: CrudRowActionItem[] = [
  { key: 'edit', label: '编辑', tone: 'primary' },
  { key: 'delete', label: '删除', tone: 'danger' }
]
const statusOptions = [
  { value: 'draft', label: '草拟', type: 'info' as const },
  { value: 'reviewing', label: '评审中', type: 'warning' as const },
  { value: 'released', label: '已放行', type: 'success' as const },
  { value: 'rejected', label: '已拒绝', type: 'danger' as const }
]

const queryParams = ref({
  code: '',
  inspectionCode: '',
  status: ''
})

const searchColumns: FormColumnItem[] = [
  { type: 'input', label: '放行单号', field: 'code', props: { clearable: true } as any },
  { type: 'input', label: '检验单号', field: 'inspectionCode', props: { clearable: true } as any },
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

const columns: TableColumnItem<ConcessionRecord>[] = [
  { prop: 'code', label: '放行单号', width: 160 },
  { prop: 'inspectionCode', label: '检验单号', width: 160 },
  { prop: 'material', label: '物料名称', minWidth: 150 },
  { prop: 'scope', label: '放行范围', minWidth: 220 },
  { prop: 'owner', label: '责任人', width: 100 },
  { prop: 'validUntil', label: '有效期至', width: 120 },
  { label: '状态', width: 100, slotName: 'status', align: 'center' },
  { label: '操作', minWidth: 160, slotName: 'actions', align: 'center', fixed: 'right' }
]

const { tableData, pagination, loading, search, refresh, onDelete } = useTable<ConcessionRecord>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const response = await getConcessionList({
      pageNum: page,
      pageSize: size,
      code: queryParams.value.code || undefined,
      inspectionCode: queryParams.value.inspectionCode || undefined,
      status: queryParams.value.status || undefined
    })
    return response.data
  },
  deleteAPI: (ids) => Promise.all(ids.map((id) => deleteConcession(id)))
})

const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const formModel = ref<ConcessionRecord>(createDefaultForm())

function createDefaultForm(): ConcessionRecord {
  return {
    id: '',
    code: '',
    inspectionCode: '',
    material: '',
    sourceCode: '',
    scope: '',
    riskNote: '',
    owner: '',
    status: 'draft',
    validUntil: '2026-07-31',
    createdAt: '2026-07-15 09:00'
  }
}

function handleReset() {
  queryParams.value = { code: '', inspectionCode: '', status: '' }
  search()
}

function handleToolbarAction(action: string) {
  if (action === 'export') ElMessage.success('特采放行静态数据已导出')
}

function openAdd() {
  dialogMode.value = 'add'
  formModel.value = createDefaultForm()
  dialogVisible.value = true
}

function openEdit(row: ConcessionRecord) {
  dialogMode.value = 'edit'
  formModel.value = { ...row }
  dialogVisible.value = true
}

function handleRowAction(action: string, row: ConcessionRecord) {
  if (action === 'edit') openEdit(row)
  if (action === 'delete') onDelete(row)
}

async function submitDialog() {
  if (dialogMode.value === 'add') {
    await createConcession(formModel.value)
    ElMessage.success('新增成功')
  } else {
    await updateConcession(formModel.value.id, formModel.value)
    ElMessage.success('编辑成功')
  }

  dialogVisible.value = false
  await refresh()
}
</script>
