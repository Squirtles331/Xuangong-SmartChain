<template>
  <gi-page-layout>
    <template #header>
      <gi-form
        ref="searchFormRef"
        v-model="searchForm"
        :columns="searchColumns"
        :grid-item-props="{
          span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 }
        }"
        search
        @reset="handleReset"
        @search="handleSearch"
      />
    </template>

    <template #tool>
      <gi-button type="add" @click="openAdd" />
      <gi-button style="margin-left: 8px" type="reset" @click="refresh" />
    </template>

    <gi-table :columns="columns" :data="tableData" :pagination="pagination" :loading="loading" border stripe style="height: 100%">
      <template #status="{ row }">
        <el-tag :type="row.status === 'active' ? 'success' : 'danger'" size="small">
          {{ row.status === 'active' ? '正常' : '黑名单' }}
        </el-tag>
      </template>
      <template #credit_limit="{ row }">
        {{ formatNumber(row.credit_limit) }}
      </template>
      <template #actions="{ row }">
        <gi-button type="edit" @click="openEdit(row)" />
        <gi-button style="margin-left: 8px" type="delete" @click="remove(row)" />
      </template>
    </gi-table>

    <CustomerFormDialog v-model:visible="dialogVisible" v-model:form="formModel" :mode="dialogMode" @submit="submitDialog" />
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormColumnItem, FormInstance, TableColumnItem } from 'gi-component'
import { createCustomer, deleteCustomer, getCustomerList, updateCustomer, type Customer, type CustomerQuery } from '@/api/crm'
import { useTable } from '@/hooks/useTable'
import CustomerFormDialog, { type CustomerFormModel } from './CustomerFormDialog.vue'

interface CustomerRow {
  id: string
  code: string
  name: string
  contact_person: string
  contact_phone: string
  payment_terms: string
  credit_limit: number
  status: string
}

const searchFormRef = ref<FormInstance | null>()
const searchForm = ref({
  code: '',
  name: '',
  status: ''
})

const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const formModel = ref<CustomerFormModel>(createDefaultFormModel())

const searchColumns: FormColumnItem[] = [
  { type: 'input', label: '客户编码', field: 'code' },
  { type: 'input', label: '客户名称', field: 'name' },
  {
    type: 'select-v2',
    label: '状态',
    field: 'status',
    props: {
      options: [
        { label: '正常', value: 'active' },
        { label: '黑名单', value: 'blacklist' }
      ]
    } as any
  }
]

const columns: TableColumnItem<CustomerRow>[] = [
  { prop: 'code', label: '客户编码', width: 150 },
  { prop: 'name', label: '客户名称', minWidth: 180 },
  { prop: 'contact_person', label: '联系人', width: 100 },
  { prop: 'contact_phone', label: '联系电话', width: 130 },
  { prop: 'payment_terms', label: '付款条款', width: 110 },
  { label: '信用额度(元)', minWidth: 140, align: 'right', slotName: 'credit_limit' },
  { label: '状态', minWidth: 80, slotName: 'status', align: 'center' },
  { label: '操作', minWidth: 160, fixed: 'right', slotName: 'actions', align: 'center' }
]

const { tableData, pagination, loading, search, refresh, onDelete } = useTable<CustomerRow>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const params: CustomerQuery = {
      page,
      page_size: size,
      name: searchForm.value.name || undefined,
      status: searchForm.value.status || undefined
    }
    const res = await getCustomerList(params)
    return {
      list: res.data.items.map(mapCustomerRow),
      total: res.data.total
    }
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

function formatNumber(n: number) {
  return n.toLocaleString('en-US')
}

function mapCustomerRow(customer: Customer): CustomerRow {
  return {
    id: String(customer.id),
    code: customer.code,
    name: customer.name,
    contact_person: customer.contact_person || '-',
    contact_phone: customer.contact_phone || '-',
    payment_terms: customer.payment_terms || '-',
    credit_limit: customer.credit_limit ?? 0,
    status: customer.status
  }
}

function handleSearch() {
  search()
}

function handleReset() {
  searchForm.value = { code: '', name: '', status: '' }
  search()
}

function openAdd() {
  dialogMode.value = 'add'
  formModel.value = createDefaultFormModel()
  dialogVisible.value = true
}

function openEdit(row: CustomerRow) {
  dialogMode.value = 'edit'
  formModel.value = {
    id: row.id,
    code: row.code,
    name: row.name,
    contact_person: row.contact_person === '-' ? '' : row.contact_person,
    contact_phone: row.contact_phone === '-' ? '' : row.contact_phone,
    payment_terms: row.payment_terms === '-' ? '月结30天' : row.payment_terms,
    credit_limit: row.credit_limit,
    status: row.status
  }
  dialogVisible.value = true
}

async function submitDialog() {
  if (!formModel.value.code || !formModel.value.name) {
    ElMessage.warning('请填写编码和名称')
    return
  }

  const payload = {
    code: formModel.value.code,
    name: formModel.value.name,
    contact_person: formModel.value.contact_person,
    contact_phone: formModel.value.contact_phone,
    payment_terms: formModel.value.payment_terms,
    credit_limit: formModel.value.credit_limit,
    status: formModel.value.status
  }

  if (dialogMode.value === 'add') {
    await createCustomer(payload)
  } else {
    await updateCustomer(formModel.value.id, payload)
  }

  dialogVisible.value = false
  await refresh()
}

function remove(row: CustomerRow) {
  onDelete(row)
}
</script>

<style scoped>
:deep(.gi-page-layout__tool) {
  gap: 8px;
}
</style>
