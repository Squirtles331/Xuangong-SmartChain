<template>
  <gi-page-layout>
    <template #header>
      <SearchSetting :columns="searchColumns" @update:visible-fields="onSearchFieldsChange">
        <gi-form
          v-model="queryParams"
          :columns="visibleSearchColumns"
          :grid-item-props="{ span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 } }"
          search
          @search="search"
          @reset="handleReset"
        />
      </SearchSetting>
    </template>

    <template #tool>
      <gi-button type="add" @click="openAdd" />
      <gi-button style="margin-left: 8px" type="reset" @click="refresh" />
    </template>

    <TableSetting title="采购退货单" :columns="columns" @refresh="refresh">
      <template #default="{ settingColumns, tableProps }">
        <gi-table :columns="settingColumns" :data="tableData" :pagination="pagination" :loading="loading" v-bind="tableProps" border stripe>
          <template #status="{ row }">
            <el-tag :type="row.status === 'pending' ? 'warning' : row.status === 'done' ? 'success' : 'info'" size="small">
              {{ row.status === 'pending' ? '待退货' : row.status === 'done' ? '已退货' : '已取消' }}
            </el-tag>
          </template>
          <template #actions="{ row }">
            <gi-button type="edit" @click="openEdit(row)" />
            <el-button v-if="row.status === 'pending'" type="primary" link size="small" @click="confirmReturn(row)">确认退货</el-button>
          </template>
        </gi-table>
      </template>
    </TableSetting>

    <ReturnFormDialog v-model:visible="dialogVisible" v-model:form="formModel" :mode="dialogMode" @submit="submitDialog" />
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormColumnItem, TableColumnItem } from 'gi-component'
import SearchSetting from '@/components/SearchSetting.vue'
import TableSetting from '@/components/TableSetting.vue'
import { createPurchaseReturn, getPurchaseReturnList, type PurchaseReturn, type PurchaseReturnQuery, updatePurchaseReturn } from '@/api/scm'
import { useTable } from '@/hooks/useTable'
import ReturnFormDialog, { type ReturnFormModel } from './ReturnFormDialog.vue'

interface ReturnRow extends PurchaseReturn {}

const queryParams = ref({
  code: '',
  status: ''
})

const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const formModel = ref<ReturnFormModel>(createDefaultFormModel())

const searchColumns: FormColumnItem[] = [
  { type: 'input', label: '退货单号', field: 'code', props: { clearable: true } as any },
  {
    type: 'select-v2',
    label: '状态',
    field: 'status',
    props: {
      options: [
        { label: '待退货', value: 'pending' },
        { label: '已退货', value: 'done' }
      ],
      clearable: true
    } as any
  }
]

const visibleSearchColumns = ref<FormColumnItem[]>([...searchColumns])

function onSearchFieldsChange(fields: FormColumnItem[]) {
  visibleSearchColumns.value = fields
}

const columns: TableColumnItem<ReturnRow>[] = [
  { prop: 'code', label: '退货单号', width: 170 },
  { prop: 'po_code', label: '采购订单', width: 170 },
  { prop: 'supplier', label: '供应商', minWidth: 150 },
  { prop: 'material', label: '物料名称', minWidth: 140 },
  { prop: 'qty', label: '数量', minWidth: 80, align: 'center' },
  { prop: 'reason', label: '原因', width: 120 },
  { label: '状态', minWidth: 80, slotName: 'status', align: 'center' },
  { label: '操作', minWidth: 160, fixed: 'right', slotName: 'actions', align: 'center' }
]

const { tableData, pagination, loading, search, refresh } = useTable<ReturnRow>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const params: PurchaseReturnQuery = {
      pageNum: page,
      pageSize: size,
      code: queryParams.value.code || undefined,
      status: queryParams.value.status || undefined
    }
    const res = await getPurchaseReturnList(params)
    return res.data
  }
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
  queryParams.value = { code: '', status: '' }
  search()
}

function openAdd() {
  dialogMode.value = 'add'
  formModel.value = createDefaultFormModel()
  dialogVisible.value = true
}

function openEdit(row: ReturnRow) {
  dialogMode.value = 'edit'
  formModel.value = { ...row }
  dialogVisible.value = true
}

async function submitDialog() {
  const payload = {
    code: formModel.value.code,
    po_code: formModel.value.po_code,
    supplier: formModel.value.supplier,
    material: formModel.value.material,
    qty: formModel.value.qty,
    reason: formModel.value.reason,
    status: formModel.value.status as 'pending' | 'done'
  }

  if (dialogMode.value === 'add') {
    await createPurchaseReturn(payload)
  } else {
    await updatePurchaseReturn(formModel.value.id, payload)
  }

  dialogVisible.value = false
  await refresh()
}

async function confirmReturn(row: ReturnRow) {
  row.status = 'done'
  await updatePurchaseReturn(row.id, { status: 'done' })
  ElMessage.success('退货完成')
}
</script>

<style scoped>
:deep(.gi-page-layout__tool) {
  gap: 8px;
}
</style>
