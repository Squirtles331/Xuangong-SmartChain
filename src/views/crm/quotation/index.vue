<template>
  <gi-page-layout :bordered="true">
    <template #tool><gi-button type="add" @click="openAdd" /><gi-button style="margin-left: 8px" type="reset" @click="refresh" /></template>
    <gi-table :columns="cols" :data="items" border stripe>
      <template #status="{ row }"
        ><el-tag
          :type="row.status === 'sent' ? 'primary' : row.status === 'approved' ? 'success' : row.status === 'lost' ? 'danger' : 'warning'"
          size="small"
          >{{ row.status === 'sent' ? '已发出' : row.status === 'approved' ? '已中标' : row.status === 'lost' ? '已丢单' : '草稿' }}</el-tag
        ></template
      >
      <template #actions="{ row }"><gi-button type="edit" @click="openEdit(row)" /></template>
    </gi-table>
    <gi-dialog v-model="vis" :footer="true" :on-before-ok="submit" :title="mode === 'add' ? '新增报价单' : '编辑报价单'" width="600px">
      <gi-form v-model="form" :columns="formCols" :label-width="100" />
    </gi-dialog>
  </gi-page-layout>
</template>
<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormColumnItem, TableColumnItem } from 'gi-component'
interface QT {
  id: string
  code: string
  customer: string
  product: string
  qty: number
  price: number
  amount: number
  valid_date: string
  status: string
}
const items = ref<QT[]>([
  {
    id: '1',
    code: 'QT20250115001',
    customer: 'XX重工集团',
    product: '离心泵 XJP-100',
    qty: 50,
    price: 4600,
    amount: 230000,
    valid_date: '2025-02-15',
    status: 'sent'
  },
  {
    id: '2',
    code: 'QT20250110002',
    customer: 'AA精密制造',
    product: '齿轮箱 GBX-200',
    qty: 10,
    price: 9000,
    amount: 90000,
    valid_date: '2025-02-10',
    status: 'draft'
  }
])
const cols: TableColumnItem<QT>[] = [
  { prop: 'code', label: '报价单号', minWidth: 170 },
  { prop: 'customer', label: '客户', minWidth: 150 },
  { prop: 'product', label: '产品', minWidth: 160 },
  { prop: 'qty', label: '数量', minWidth: 70, align: 'center' },
  { prop: 'price', label: '单价(元)', minWidth: 100, align: 'right' },
  { prop: 'amount', label: '总价(元)', minWidth: 110, align: 'right' },
  { prop: 'valid_date', label: '有效期', minWidth: 110 },
  { label: '状态', minWidth: 80, slotName: 'status', align: 'center' },
  { label: '操作', minWidth: 120, fixed: 'right', slotName: 'actions', align: 'center' }
]
const vis = ref(false)
const mode = ref<'add' | 'edit'>('add')
const eid = ref('')
const form = reactive({ code: '', customer: '', product: '', qty: 1, price: 0, amount: 0, valid_date: '', status: 'draft' })
const formCols: FormColumnItem[] = [
  { type: 'input', label: '报价单号', field: 'code', required: true },
  { type: 'input', label: '客户', field: 'customer', required: true },
  { type: 'input', label: '产品', field: 'product', required: true },
  { type: 'input-number', label: '数量', field: 'qty', required: true, props: { min: 1 } as any },
  { type: 'input-number', label: '单价(元)', field: 'price', required: true, props: { min: 0 } as any },
  { type: 'input-number', label: '总价(元)', field: 'amount', props: { disabled: true } as any },
  { type: 'date-picker', label: '有效期', field: 'valid_date' },
  {
    type: 'select-v2',
    label: '状态',
    field: 'status',
    props: {
      options: [
        { label: '草稿', value: 'draft' },
        { label: '已发出', value: 'sent' },
        { label: '已中标', value: 'approved' },
        { label: '已丢单', value: 'lost' }
      ]
    } as any
  }
]
function openAdd() {
  mode.value = 'add'
  Object.assign(form, { code: '', customer: '', product: '', qty: 1, price: 0, amount: 0, valid_date: '', status: 'draft' })
  vis.value = true
}
function openEdit(r: QT) {
  mode.value = 'edit'
  eid.value = r.id
  form.amount = r.price * r.qty
  Object.assign(form, r)
  vis.value = true
}
async function submit() {
  if (!form.customer) {
    ElMessage.warning('请填写必填项')
    return false
  }
  form.amount = form.price * form.qty
  if (mode.value === 'add') {
    items.value.unshift({
      id: Date.now().toString(),
      code: 'QT' + new Date().toISOString().slice(0, 10).replace(/-/g, '') + String(items.value.length + 1).padStart(4, '0'),
      ...form
    } as QT)
  } else {
    const i = items.value.findIndex((e) => e.id === eid.value)
    if (i > -1) Object.assign(items.value[i], form)
  }
  return true
}
function refresh() {}
</script>
