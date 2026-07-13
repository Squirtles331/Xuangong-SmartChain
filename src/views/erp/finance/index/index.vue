<template>
  <gi-page-layout>
    <template #header>
      <SearchSetting :columns="searchColumns" @update:visible-fields="onSearchFieldsChange">
        <gi-form
          v-model="queryParams"
          :columns="visibleSearchColumns"
          :grid-item-props="searchGridItemProps"
          search
          @search="search"
          @reset="handleReset"
        />
      </SearchSetting>
    </template>

    <template #tool>
      <gi-button type="add" @click="openAdd" />
      <gi-button type="reset" style="margin-left: 8px" @click="refresh" />
    </template>

    <TableSetting title="应付管理列表" :columns="columns" @refresh="refresh">
      <template #default="{ settingColumns, tableProps }">
        <gi-table
          :columns="settingColumns"
          :data="tableData"
          :pagination="pagination"
          :loading="loading"
          v-bind="tableProps"
          border
          style="height: 100%"
        >
          <template #amount="{ row }">
            {{ formatAmount(row.amount) }}
          </template>

          <template #paid="{ row }">
            {{ formatAmount(row.paid) }}
          </template>

          <template #balance="{ row }">
            {{ formatAmount(row.balance) }}
          </template>

          <template #status="{ row }">
            <el-tag :type="statusTagMap[row.status]">
              {{ statusLabelMap[row.status] }}
            </el-tag>
          </template>

          <template #actions="{ row }">
            <gi-button type="edit" @click="openEdit(row)" />
            <gi-button type="delete" style="margin-left: 8px" @click="onDelete(row)" />
          </template>
        </gi-table>
      </template>
    </TableSetting>

    <FinanceIndexFormDialog v-model:visible="dialogVisible" v-model:form="formModel" :mode="dialogMode" @submit="submitDialog" />
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormColumnItem, TableColumnItem } from 'gi-component'
import SearchSetting from '@/components/SearchSetting.vue'
import TableSetting from '@/components/TableSetting.vue'
import {
  createFinancePayable,
  deleteFinancePayable,
  getFinancePayableList,
  updateFinancePayable,
  type FinancePayable,
  type FinancePayableQuery,
  type FinancePayableStatus
} from '@/api/finance'
import { useTable } from '@/hooks/useTable'
import FinanceIndexFormDialog, { type FinancePayableFormModel } from './FinanceIndexFormDialog.vue'

const statusOptions: Array<{ label: string; value: '' | FinancePayableStatus }> = [
  { label: '全部', value: '' },
  { label: '未付款', value: 'open' },
  { label: '已付款', value: 'paid' },
  { label: '部分付款', value: 'partial' }
]

const statusTagMap: Record<FinancePayableStatus, 'warning' | 'success' | 'info'> = {
  open: 'warning',
  paid: 'success',
  partial: 'info'
}

const statusLabelMap: Record<FinancePayableStatus, string> = {
  open: '未付款',
  paid: '已付款',
  partial: '部分付款'
}

const searchColumns: FormColumnItem[] = [
  { type: 'input', label: '应付单号', field: 'code' },
  { type: 'input', label: '供应商', field: 'supplier' },
  {
    type: 'select-v2',
    label: '状态',
    field: 'status',
    props: {
      options: statusOptions
    } as any
  }
]

const searchGridItemProps = {
  span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 }
}

const columns: TableColumnItem<FinancePayable>[] = [
  { prop: 'code', label: '应付单号', minWidth: 160 },
  { prop: 'supplier', label: '供应商', minWidth: 180 },
  { prop: 'amount', label: '应付金额', minWidth: 120, align: 'right', slotName: 'amount' },
  { prop: 'paid', label: '已付金额', minWidth: 120, align: 'right', slotName: 'paid' },
  { prop: 'balance', label: '未付余额', minWidth: 120, align: 'right', slotName: 'balance' },
  { prop: 'due_date', label: '到期日期', minWidth: 120, align: 'center' },
  { prop: 'status', label: '状态', minWidth: 110, align: 'center', slotName: 'status' },
  { label: '操作', minWidth: 180, fixed: 'right', slotName: 'actions', align: 'center' }
]

const queryParams = reactive<{
  code: string
  supplier: string
  status: '' | FinancePayableStatus
}>({
  code: '',
  supplier: '',
  status: ''
})

const visibleSearchColumns = ref<FormColumnItem[]>([...searchColumns])
const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const formModel = ref<FinancePayableFormModel>(createDefaultFormModel())

const { tableData, pagination, loading, search, refresh, onDelete } = useTable<FinancePayable>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const params: FinancePayableQuery = {
      pageNum: page,
      pageSize: size,
      code: queryParams.code || undefined,
      supplier: queryParams.supplier || undefined,
      status: queryParams.status || undefined
    }

    const response = await getFinancePayableList(params)
    return response.data
  },
  deleteAPI: (ids) => Promise.all(ids.map((id) => deleteFinancePayable(id)))
})

function createDefaultFormModel(): FinancePayableFormModel {
  return {
    id: '',
    code: '',
    supplier: '',
    amount: 0,
    paid: 0,
    balance: 0,
    due_date: '',
    status: 'open'
  }
}

function formatAmount(value: number) {
  return value.toLocaleString('zh-CN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

function onSearchFieldsChange(fields: FormColumnItem[]) {
  visibleSearchColumns.value = fields
}

function handleReset() {
  Object.assign(queryParams, {
    code: '',
    supplier: '',
    status: ''
  })
  search()
}

function openAdd() {
  dialogMode.value = 'add'
  formModel.value = createDefaultFormModel()
  dialogVisible.value = true
}

function openEdit(row: FinancePayable) {
  dialogMode.value = 'edit'
  formModel.value = { ...row }
  dialogVisible.value = true
}

async function submitDialog() {
  if (!formModel.value.supplier) {
    ElMessage.warning('请填写供应商')
    return
  }

  formModel.value.balance = Math.max(formModel.value.amount - formModel.value.paid, 0)

  if (dialogMode.value === 'add') {
    await createFinancePayable(formModel.value)
    ElMessage.success('新增成功')
  } else {
    await updateFinancePayable(formModel.value.id, formModel.value)
    ElMessage.success('编辑成功')
  }

  dialogVisible.value = false
  await refresh()
}
</script>

<style scoped>
:deep(.gi-page-layout__tool) {
  gap: 8px;
}
</style>
