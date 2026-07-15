<template>
  <CrudPage
    v-model:search-model="queryParams"
    title="供应商质量"
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
    <template #passRate="{ row }">
      <el-progress :percentage="row.pass_rate" :stroke-width="8" :color="progressColor(row.pass_rate)" />
    </template>

    <template #actions="{ row }">
      <CrudRowActions :actions="rowActions" @action="handleRowAction($event, row)" />
    </template>

    <template #dialog>
      <SupplierQualityFormDialog v-model:visible="dialogVisible" v-model:form="formModel" :mode="dialogMode" @submit="submitDialog" />
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
import { useTable } from '@/hooks/useTable'
import { createSupplierQuality, deleteSupplierQuality, getSupplierQualityList, updateSupplierQuality } from '@/static/services/qms'
import type { SupplierQuality } from '@/types/qms'
import SupplierQualityFormDialog, { type SupplierQualityFormModel } from './SupplierQualityFormDialog.vue'

const toolbarActions: CrudToolbarActionItem[] = [{ key: 'export', label: '导出' }]
const rowActions: CrudRowActionItem[] = [
  { key: 'edit', label: '编辑', tone: 'primary' },
  { key: 'delete', label: '删除', tone: 'danger' }
]

const queryParams = ref({
  supplier: ''
})

const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const formModel = ref<SupplierQualityFormModel>(createDefaultFormModel())

const searchColumns: FormColumnItem[] = [{ type: 'input', label: '供应商', field: 'supplier', props: { clearable: true } as any }]

const columns: TableColumnItem<SupplierQuality>[] = [
  { prop: 'supplier', label: '供应商', minWidth: 180 },
  { prop: 'total_batches', label: '总批次数', minWidth: 100, align: 'center' },
  { prop: 'pass_batches', label: '合格批次', minWidth: 100, align: 'center' },
  { label: '合格率', minWidth: 180, slotName: 'passRate' },
  { prop: 'repeat_issues', label: '重复问题', minWidth: 90, align: 'center' },
  { prop: 'last_inspection', label: '最近检验', width: 120 },
  { label: '操作', minWidth: 160, fixed: 'right', slotName: 'actions', align: 'center' }
]

const { tableData, pagination, loading, search, refresh, onDelete } = useTable<SupplierQuality>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const response = await getSupplierQualityList({
      pageNum: page,
      pageSize: size,
      supplier: queryParams.value.supplier || undefined
    })
    return response.data
  },
  deleteAPI: (ids) => Promise.all(ids.map((id) => deleteSupplierQuality(id)))
})

function createDefaultFormModel(): SupplierQualityFormModel {
  return {
    id: '',
    supplier: '',
    total_batches: 0,
    pass_batches: 0,
    pass_rate: 0,
    repeat_issues: 0,
    last_inspection: ''
  }
}

function handleReset() {
  queryParams.value = { supplier: '' }
  search()
}

function handleToolbarAction(action: string) {
  if (action === 'export') {
    ElMessage.success('供应商质量静态数据已导出')
  }
}

function openAdd() {
  dialogMode.value = 'add'
  formModel.value = createDefaultFormModel()
  dialogVisible.value = true
}

function openEdit(row: SupplierQuality) {
  dialogMode.value = 'edit'
  formModel.value = { ...row }
  dialogVisible.value = true
}

function handleRowAction(action: string, row: SupplierQuality) {
  if (action === 'edit') {
    openEdit(row)
    return
  }

  if (action === 'delete') {
    onDelete(row)
  }
}

function progressColor(passRate: number) {
  if (passRate >= 95) return '#67c23a'
  if (passRate >= 80) return '#e6a23c'
  return '#f56c6c'
}

async function submitDialog() {
  const payload = {
    ...formModel.value,
    pass_rate: formModel.value.total_batches > 0 ? Number(((formModel.value.pass_batches / formModel.value.total_batches) * 100).toFixed(1)) : 0
  }

  if (dialogMode.value === 'add') {
    await createSupplierQuality(payload)
    ElMessage.success('新增成功')
  } else {
    await updateSupplierQuality(formModel.value.id, payload)
    ElMessage.success('编辑成功')
  }

  dialogVisible.value = false
  await refresh()
}
</script>
