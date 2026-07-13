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

    <TableSetting title="采购退货单" :columns="columns" @refresh="refresh">
      <template #default="{ settingColumns, tableProps }">
        <gi-table
          :columns="settingColumns"
          :data="tableData"
          :pagination="pagination"
          :loading="loading"
          v-bind="tableProps"
          border
          stripe
          style="height: 100%"
        >
          <template #status="{ row }">
            <el-tag :type="row.status === 'pending' ? 'warning' : 'success'" size="small">
              {{ row.status === 'pending' ? '待退货' : '已退货' }}
            </el-tag>
          </template>

          <template #actions="{ row }">
            <el-button type="primary" link size="small" @click="openEdit(row)">编辑</el-button>
            <el-button v-if="row.status === 'pending'" type="success" link size="small" @click="confirmReturn(row)">确认退货</el-button>
            <el-button v-if="row.status === 'pending'" type="danger" link size="small" @click="onDelete(row)">删除</el-button>
          </template>
        </gi-table>
      </template>
    </TableSetting>

    <ReturnFormDialog v-model:visible="dialogVisible" v-model:form="formModel" :mode="dialogMode" @submit="submitDialog" />
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormColumnItem, TableColumnItem } from 'gi-component'
import SearchSetting from '@/components/SearchSetting.vue'
import TableSetting from '@/components/TableSetting.vue'
import {
  createPurchaseReturn,
  deletePurchaseReturn,
  getPurchaseReturnList,
  updatePurchaseReturn,
  type PurchaseReturn,
  type PurchaseReturnQuery
} from '@/api/scm'
import { useTable } from '@/hooks/useTable'
import ReturnFormDialog, { type ReturnFormModel } from './ReturnFormDialog.vue'

type PurchaseReturnRow = PurchaseReturn

const searchColumns: FormColumnItem[] = [
  { type: 'input', label: '退货单号', field: 'code', props: { clearable: true } as any },
  {
    type: 'select-v2',
    label: '状态',
    field: 'status',
    props: {
      clearable: true,
      options: [
        { label: '待退货', value: 'pending' },
        { label: '已退货', value: 'done' }
      ]
    } as any
  }
]

const searchGridItemProps = {
  span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 }
}

const columns: TableColumnItem<PurchaseReturnRow>[] = [
  { prop: 'code', label: '退货单号', minWidth: 160 },
  { prop: 'po_code', label: '采购订单', minWidth: 160 },
  { prop: 'supplier', label: '供应商', minWidth: 150 },
  { prop: 'material', label: '物料名称', minWidth: 150 },
  { prop: 'qty', label: '数量', minWidth: 90, align: 'center' },
  { prop: 'reason', label: '退货原因', minWidth: 130 },
  { label: '状态', minWidth: 90, slotName: 'status', align: 'center' },
  { label: '操作', minWidth: 180, fixed: 'right', slotName: 'actions', align: 'center' }
]

const queryParams = reactive({
  code: '',
  status: ''
})

const visibleSearchColumns = ref<FormColumnItem[]>([...searchColumns])
const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const formModel = ref<ReturnFormModel>(createDefaultFormModel())

const { tableData, pagination, loading, search, refresh, onDelete } = useTable<PurchaseReturnRow>({
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

function onSearchFieldsChange(fields: FormColumnItem[]) {
  visibleSearchColumns.value = fields
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

function openEdit(row: PurchaseReturnRow) {
  dialogMode.value = 'edit'
  formModel.value = { ...row }
  dialogVisible.value = true
}

async function submitDialog() {
  if (!formModel.value.code || !formModel.value.po_code || !formModel.value.material) {
    ElMessage.warning('请填写退货单号、采购订单和物料名称')
    return
  }

  const payload: Partial<PurchaseReturn> = {
    code: formModel.value.code,
    po_code: formModel.value.po_code,
    supplier: formModel.value.supplier,
    material: formModel.value.material,
    qty: Number(formModel.value.qty || 0),
    reason: formModel.value.reason,
    status: formModel.value.status as PurchaseReturn['status']
  }

  if (dialogMode.value === 'add') {
    await createPurchaseReturn(payload)
  } else {
    await updatePurchaseReturn(formModel.value.id, payload)
  }

  dialogVisible.value = false
  await refresh()
}

async function confirmReturn(row: PurchaseReturnRow) {
  await updatePurchaseReturn(row.id, { status: 'done' })
  ElMessage.success('采购退货已完成')
  await refresh()
}
</script>

<style scoped>
:deep(.gi-page-layout__tool) {
  gap: 8px;
}
</style>
