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

    <TableSetting title="客户列表" :columns="columns" @refresh="refresh">
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
          <template #creditLimit="{ row }">
            {{ row.credit_limit.toLocaleString('zh-CN') }}
          </template>

          <template #status="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'info'">
              {{ row.status === 'active' ? '正常' : '停用' }}
            </el-tag>
          </template>

          <template #actions="{ row }">
            <gi-button type="edit" @click="openEdit(row)" />
            <gi-button type="delete" style="margin-left: 8px" @click="onDelete(row)" />
          </template>
        </gi-table>
      </template>
    </TableSetting>

    <CustomerFormDialog v-model:visible="dialogVisible" v-model:form="formModel" :mode="dialogMode" @submit="submitDialog" />
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormColumnItem, TableColumnItem } from 'gi-component'
import SearchSetting from '@/components/SearchSetting.vue'
import TableSetting from '@/components/TableSetting.vue'
import { createCustomer, deleteCustomer, getCustomerList, updateCustomer, type Customer, type CustomerQuery } from '@/api/crm'
import { useTable } from '@/hooks/useTable'
import CustomerFormDialog, { type CustomerFormModel } from './CustomerFormDialog.vue'

const statusOptions = [
  { label: '正常', value: 'active' },
  { label: '停用', value: 'disabled' }
]

const searchColumns: FormColumnItem[] = [
  { type: 'input', label: '客户编码', field: 'code' },
  { type: 'input', label: '客户名称', field: 'name' },
  {
    type: 'select-v2',
    label: '状态',
    field: 'status',
    props: {
      options: [{ label: '全部', value: '' }, ...statusOptions]
    } as any
  }
]

const searchGridItemProps = {
  span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 }
}

const columns: TableColumnItem<Customer>[] = [
  { prop: 'code', label: '客户编码', minWidth: 140 },
  { prop: 'name', label: '客户名称', minWidth: 180 },
  { prop: 'contact_person', label: '联系人', minWidth: 120 },
  { prop: 'contact_phone', label: '联系电话', minWidth: 140 },
  { prop: 'payment_terms', label: '付款条件', minWidth: 120 },
  { label: '信用额度(元)', minWidth: 140, align: 'right', slotName: 'creditLimit' },
  { label: '状态', minWidth: 100, align: 'center', slotName: 'status' },
  { label: '操作', minWidth: 160, fixed: 'right', align: 'center', slotName: 'actions' }
]

const queryParams = reactive({
  code: '',
  name: '',
  status: ''
})

const visibleSearchColumns = ref<FormColumnItem[]>([...searchColumns])
const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const formModel = ref<CustomerFormModel>(createDefaultFormModel())

const { tableData, pagination, loading, search, refresh, onDelete } = useTable<Customer>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const params: CustomerQuery = {
      pageNum: page,
      pageSize: size,
      code: queryParams.code || undefined,
      name: queryParams.name || undefined,
      status: queryParams.status || undefined
    }
    const response = await getCustomerList(params)
    return response.data
  },
  deleteAPI: (ids) => Promise.all(ids.map((id) => deleteCustomer(id)))
})

function createDefaultFormModel(): CustomerFormModel {
  return {
    id: '',
    code: '',
    name: '',
    contact_person: '',
    contact_phone: '',
    payment_terms: '月结30天',
    credit_limit: 0,
    status: 'active'
  }
}

function onSearchFieldsChange(fields: FormColumnItem[]) {
  visibleSearchColumns.value = fields
}

function handleReset() {
  Object.assign(queryParams, {
    code: '',
    name: '',
    status: ''
  })
  search()
}

function openAdd() {
  dialogMode.value = 'add'
  formModel.value = createDefaultFormModel()
  dialogVisible.value = true
}

function openEdit(row: Customer) {
  dialogMode.value = 'edit'
  formModel.value = { ...row }
  dialogVisible.value = true
}

async function submitDialog() {
  if (!formModel.value.code || !formModel.value.name) {
    ElMessage.warning('请填写客户编码和客户名称')
    return
  }

  const payload = {
    code: formModel.value.code,
    name: formModel.value.name,
    contact_person: formModel.value.contact_person,
    contact_phone: formModel.value.contact_phone,
    payment_terms: formModel.value.payment_terms,
    credit_limit: formModel.value.credit_limit,
    status: formModel.value.status as Customer['status']
  }
  if (dialogMode.value === 'add') {
    await createCustomer(payload)
  } else {
    await updateCustomer(formModel.value.id, payload)
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
