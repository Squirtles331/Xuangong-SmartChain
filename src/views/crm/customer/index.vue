<template>
  <gi-page-layout :bordered="true">
    <template #tool>
      <gi-button type="add" @click="openAdd" />
    </template>
    <gi-table :columns="columns" :data="customers" border stripe style="height: 100%">
      <template #status="{ row }"
        ><el-tag :type="row.status === 'active' ? 'success' : 'danger'" size="small">{{
          row.status === 'active' ? '正常' : '黑名单'
        }}</el-tag></template
      >
      <template #actions="{ row }">
        <gi-button type="edit" @click="openEdit(row)" />
        <gi-button type="delete" @click="deleteCust(row.id)" />
      </template>
    </gi-table>
    <gi-dialog
      v-model="dialogVisible"
      :footer="true"
      :on-before-ok="submitDialog"
      :title="dialogMode === 'add' ? '新增客户' : '编辑客户'"
      width="600px"
    >
      <gi-form v-model="form" :columns="formColumns" :label-width="120" />
    </gi-dialog>
  </gi-page-layout>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { customers as mockCustomers } from '@/mock'
import type { FormColumnItem, TableColumnItem } from 'gi-component'

interface Customer {
  id: string
  code: string
  name: string
  contact_person: string
  contact_phone: string
  payment_terms: string
  credit_limit: number
  status: string
}

const customers = ref<Customer[]>(mockCustomers as any)

const columns: TableColumnItem<Customer>[] = [
  { prop: 'code', label: '客户编码', width: 150 },
  { prop: 'name', label: '客户名称', minWidth: 180 },
  { prop: 'contact_person', label: '联系人', width: 100 },
  { prop: 'contact_phone', label: '联系电话', width: 130 },
  { prop: 'payment_terms', label: '付款条款', width: 110 },
  { prop: 'credit_limit', label: '信用额度(元)', minWidth: 140, align: 'right' },
  { label: '状态', minWidth: 80, slotName: 'status', align: 'center' },
  { label: '操作', minWidth: 160, fixed: 'right', slotName: 'actions', align: 'center' }
]

const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const editingId = ref('')
const form = reactive({ code: '', name: '', contact_person: '', contact_phone: '', payment_terms: '月结30天', credit_limit: 0 })
const formColumns: FormColumnItem[] = [
  { type: 'input', label: '客户编码', field: 'code', required: true },
  { type: 'input', label: '客户名称', field: 'name', required: true },
  { type: 'input', label: '联系人', field: 'contact_person' },
  { type: 'input', label: '联系电话', field: 'contact_phone' },
  { type: 'input', label: '付款条款', field: 'payment_terms' },
  { type: 'input-number', label: '信用额度', field: 'credit_limit', props: { min: 0, step: 10000 } as any }
]

function openAdd() {
  dialogMode.value = 'add'
  Object.assign(form, { code: '', name: '', contact_person: '', contact_phone: '', payment_terms: '月结30天', credit_limit: 0 })
  dialogVisible.value = true
}
function openEdit(row: Customer) {
  dialogMode.value = 'edit'
  editingId.value = row.id
  Object.assign(form, row)
  dialogVisible.value = true
}
async function submitDialog() {
  ElMessage.success(dialogMode.value === 'add' ? '新增成功' : '保存成功')
  return true
}
function deleteCust(id: string) {
  ElMessageBox.confirm('确定删除？', '警告', { type: 'warning' })
    .then(() => {
      customers.value = customers.value.filter((c) => c.id !== id)
      ElMessage.success('删除成功')
    })
    .catch(() => {})
}
</script>
