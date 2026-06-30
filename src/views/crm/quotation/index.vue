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

    <TableSetting title="报价单列表" :columns="columns" @refresh="refresh">
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
          <template #price="{ row }">
            {{ row.price.toLocaleString('zh-CN') }}
          </template>

          <template #amount="{ row }">
            {{ row.amount.toLocaleString('zh-CN') }}
          </template>

          <template #status="{ row }">
            <el-tag :type="statusTagType[row.status]">
              {{ statusTextMap[row.status] }}
            </el-tag>
          </template>

          <template #actions="{ row }">
            <gi-button type="edit" @click="openEdit(row)" />
            <gi-button type="delete" style="margin-left: 8px" @click="onDelete(row)" />
          </template>
        </gi-table>
      </template>
    </TableSetting>

    <QuotationFormDialog v-model:visible="dialogVisible" v-model:form="formModel" :mode="dialogMode" @submit="submitDialog" />
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormColumnItem, TableColumnItem } from 'gi-component'
import SearchSetting from '@/components/SearchSetting.vue'
import TableSetting from '@/components/TableSetting.vue'
import { deleteQuotation, getQuotationList, saveQuotation, type Quotation, type QuotationQuery } from '@/api/crm'
import { useTable } from '@/hooks/useTable'
import QuotationFormDialog, { type QuotationFormModel } from './QuotationFormDialog.vue'

const statusTextMap: Record<Quotation['status'], string> = {
  draft: '草稿',
  sent: '已发送',
  approved: '已中标',
  lost: '已丢单'
}

const statusTagType: Record<Quotation['status'], '' | 'success' | 'warning' | 'danger' | 'info' | 'primary'> = {
  draft: 'info',
  sent: 'primary',
  approved: 'success',
  lost: 'danger'
}

const searchColumns: FormColumnItem[] = [
  { type: 'input', label: '报价单号', field: 'code' },
  { type: 'input', label: '客户名称', field: 'customer' },
  {
    type: 'select-v2',
    label: '状态',
    field: 'status',
    props: {
      options: [
        { label: '全部', value: '' },
        { label: '草稿', value: 'draft' },
        { label: '已发送', value: 'sent' },
        { label: '已中标', value: 'approved' },
        { label: '已丢单', value: 'lost' }
      ]
    } as any
  }
]

const searchGridItemProps = {
  span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 }
}

const columns: TableColumnItem<Quotation>[] = [
  { prop: 'code', label: '报价单号', minWidth: 160 },
  { prop: 'customer', label: '客户名称', minWidth: 160 },
  { prop: 'product', label: '产品名称', minWidth: 180 },
  { prop: 'qty', label: '数量', minWidth: 80, align: 'center' },
  { label: '单价(元)', minWidth: 100, align: 'right', slotName: 'price' },
  { label: '总价(元)', minWidth: 120, align: 'right', slotName: 'amount' },
  { prop: 'valid_date', label: '有效期', minWidth: 120 },
  { label: '状态', minWidth: 100, align: 'center', slotName: 'status' },
  { label: '操作', minWidth: 160, fixed: 'right', align: 'center', slotName: 'actions' }
]

const queryParams = reactive({
  code: '',
  customer: '',
  status: ''
})

const visibleSearchColumns = ref<FormColumnItem[]>([...searchColumns])
const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const formModel = ref<QuotationFormModel>(createDefaultFormModel())

const { tableData, pagination, loading, search, refresh, onDelete } = useTable<Quotation>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const params: QuotationQuery = {
      pageNum: page,
      pageSize: size,
      code: queryParams.code || undefined,
      customer: queryParams.customer || undefined,
      status: (queryParams.status || undefined) as Quotation['status'] | undefined
    }
    const response = await getQuotationList(params)
    return response.data
  },
  deleteAPI: (ids) => Promise.all(ids.map((id) => deleteQuotation(id)))
})

function createDefaultFormModel(): QuotationFormModel {
  return {
    id: '',
    code: '',
    customer: '',
    product: '',
    qty: 1,
    price: 0,
    amount: 0,
    valid_date: '',
    status: 'draft'
  }
}

function onSearchFieldsChange(fields: FormColumnItem[]) {
  visibleSearchColumns.value = fields
}

function handleReset() {
  Object.assign(queryParams, {
    code: '',
    customer: '',
    status: ''
  })
  search()
}

function openAdd() {
  dialogMode.value = 'add'
  formModel.value = createDefaultFormModel()
  dialogVisible.value = true
}

function openEdit(row: Quotation) {
  dialogMode.value = 'edit'
  formModel.value = { ...row }
  dialogVisible.value = true
}

async function submitDialog() {
  if (!formModel.value.customer || !formModel.value.product) {
    ElMessage.warning('请填写客户名称和产品名称')
    return
  }

  formModel.value.amount = formModel.value.qty * formModel.value.price
  await saveQuotation({
    ...formModel.value,
    status: formModel.value.status as Quotation['status']
  })
  dialogVisible.value = false
  await refresh()
}
</script>

<style scoped>
:deep(.gi-page-layout__tool) {
  gap: 8px;
}
</style>
