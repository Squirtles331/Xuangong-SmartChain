<template>
  <CrudPage
    v-model:search-model="queryParams"
    title="采购退货"
    :search-columns="searchColumns"
    :search-grid-item-props="searchGridItemProps"
    :columns="columns"
    :data="tableData"
    :pagination="pagination"
    :loading="loading"
    :table-attrs="{ border: true, stripe: true, rowKey: 'id', style: 'height: 100%' }"
    @search="search"
    @reset="handleReset"
    @refresh="refresh"
    @add="openAdd"
  >
    <template #status="{ row }">
      <StatusTag :value="row.status" :options="statusOptions" />
    </template>

    <template #actions="{ row }">
      <CrudRowActions :actions="getRowActions(row)" @action="handleRowAction($event, row)" />
    </template>

    <template #dialog>
      <ReturnFormDialog v-model:visible="dialogVisible" v-model:form="formModel" :mode="dialogMode" @submit="submitDialog" />
    </template>
  </CrudPage>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormColumnItem, TableColumnItem } from 'gi-component'
import StatusTag from '@/components/StatusTag.vue'
import CrudPage from '@/components/crud/CrudPage/index.vue'
import CrudRowActions from '@/components/crud/CrudRowActions/index.vue'
import type { CrudDialogMode, CrudRowActionItem } from '@/components/crud/types'
import { useTable } from '@/hooks/useTable'
import {
  createPurchaseReturn,
  deletePurchaseReturn,
  getPurchaseReturnList,
  updatePurchaseReturn,
  type PurchaseReturnQuery,
  type PurchaseReturnRecord
} from '@/static/services/srm'
import ReturnFormDialog, { type ReturnFormModel } from './ReturnFormDialog.vue'

defineOptions({
  name: 'SrmPurchaseReturnPage'
})

const statusOptions = [
  { value: 'pending', label: '待退货', type: 'warning' as const },
  { value: 'done', label: '已完成', type: 'success' as const }
]

const searchColumns: FormColumnItem[] = [
  { type: 'input', label: '退货单号', field: 'code', props: { clearable: true, placeholder: '退货单号 / 采购单号 / 质检来源' } as never },
  {
    type: 'select-v2',
    label: '状态',
    field: 'status',
    props: { clearable: true, options: statusOptions.map((item) => ({ label: item.label, value: item.value })) } as never
  }
]

const searchGridItemProps = {
  span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 }
}

const columns: TableColumnItem<PurchaseReturnRecord>[] = [
  { prop: 'code', label: '退货单号', minWidth: 150 },
  { prop: 'po_code', label: '采购订单', minWidth: 150 },
  { prop: 'supplier', label: '供应商', minWidth: 170 },
  { prop: 'material', label: '退货物料', minWidth: 160 },
  { prop: 'qty', label: '退货数量', minWidth: 90, align: 'center' },
  { prop: 'reason', label: '退货原因', minWidth: 160 },
  { prop: 'quality_source', label: '质量来源', minWidth: 170 },
  { prop: 'created_at', label: '创建日期', minWidth: 120, align: 'center' },
  { label: '状态', minWidth: 100, slotName: 'status', align: 'center' },
  { label: '操作', minWidth: 180, fixed: 'right', slotName: 'actions', align: 'center' }
]

const queryParams = reactive<{
  code: string
  status: '' | PurchaseReturnRecord['status']
}>({
  code: '',
  status: ''
})

const dialogVisible = ref(false)
const dialogMode = ref<CrudDialogMode>('add')
const formModel = ref<ReturnFormModel>(createDefaultFormModel())

const { tableData, pagination, loading, search, refresh, onDelete } = useTable<PurchaseReturnRecord>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const params: PurchaseReturnQuery = {
      pageNum: page,
      pageSize: size,
      code: queryParams.code || undefined,
      status: queryParams.status || undefined
    }
    const response = await getPurchaseReturnList(params)
    return response.data
  },
  deleteAPI: (ids) => Promise.all(ids.map((id) => deletePurchaseReturn(id)))
})

function createDefaultFormModel(): ReturnFormModel {
  return {
    id: '',
    code: '',
    po_code: '',
    supplier: '',
    material: '',
    qty: 1,
    reason: '',
    status: 'pending'
  }
}

function handleReset() {
  Object.assign(queryParams, {
    code: '',
    status: ''
  })
  search()
}

function openAdd() {
  dialogMode.value = 'add'
  formModel.value = createDefaultFormModel()
  dialogVisible.value = true
}

function openEdit(row: PurchaseReturnRecord) {
  dialogMode.value = 'edit'
  formModel.value = {
    id: row.id,
    code: row.code,
    po_code: row.po_code,
    supplier: row.supplier,
    material: row.material,
    qty: row.qty,
    reason: row.reason,
    status: row.status
  }
  dialogVisible.value = true
}

function getRowActions(row: PurchaseReturnRecord): CrudRowActionItem[] {
  return [
    { key: 'edit', label: '编辑', tone: 'primary' },
    { key: 'confirm', label: '确认退货', tone: 'success', hidden: row.status !== 'pending' },
    { key: 'delete', label: '删除', tone: 'danger', hidden: row.status !== 'pending' }
  ]
}

function handleRowAction(action: string, row: PurchaseReturnRecord) {
  if (action === 'edit') {
    openEdit(row)
    return
  }

  if (action === 'confirm') {
    void confirmReturn(row)
    return
  }

  if (action === 'delete') {
    onDelete(row)
  }
}

async function submitDialog() {
  if (!formModel.value.code || !formModel.value.po_code || !formModel.value.material) {
    ElMessage.warning('请填写退货单号、采购订单和退货物料')
    return
  }

  const payload: Partial<PurchaseReturnRecord> = {
    code: formModel.value.code,
    po_code: formModel.value.po_code,
    supplier: formModel.value.supplier,
    material: formModel.value.material,
    qty: Number(formModel.value.qty || 0),
    reason: formModel.value.reason,
    status: formModel.value.status as PurchaseReturnRecord['status'],
    quality_source: 'QMS-STATIC-LINK',
    created_at: new Date().toISOString().slice(0, 10)
  }

  if (dialogMode.value === 'add') {
    await createPurchaseReturn(payload)
    ElMessage.success('采购退货已新增')
  } else {
    await updatePurchaseReturn(formModel.value.id, payload)
    ElMessage.success('采购退货已更新')
  }

  dialogVisible.value = false
  await refresh()
}

async function confirmReturn(row: PurchaseReturnRecord) {
  await updatePurchaseReturn(row.id, { status: 'done' })
  ElMessage.success('采购退货协同已确认')
  await refresh()
}
</script>

<style scoped></style>
